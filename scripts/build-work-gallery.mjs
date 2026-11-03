// Pipeline for the Work gallery assets (run: node scripts/build-work-gallery.mjs)
//   assets-src/work-gallery/textures/*.png   4K sources generated in Blender
//   assets-src/work-gallery/lightmaps/*.png  Cycles-baked light (GI + AO)
//   assets-src/work-gallery/gallery-raw.glb  room geometry exported from Blender
// Output goes to public/work-gallery/:
//   - KTX2 PBR sets at 4K (desktop) and 1K (first paint + phones)
//   - WebP lightmaps at two sizes (smooth gradients band badly under ETC1S, so not KTX2)
//   - gallery.glb with geometry only (compress-models.mjs adds Draco afterwards)

import { NodeIO, Document } from '@gltf-transform/core';
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions';
import sharp from 'sharp';
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync, copyFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'assets-src', 'work-gallery');
const out = join(root, 'public', 'work-gallery');
const tmp = join(root, '.gallery-tmp');
const gltfpack = join(root, '.tools', 'gltfpack.exe');

mkdirSync(out, { recursive: true });
mkdirSync(tmp, { recursive: true });
sharp.cache(false);

const SETS = ['plaster', 'floor'];
const TIERS = [
  { suffix: '4k', size: 4096, tq: '8' },
  { suffix: '1k', size: 1024, tq: '10' },
];

const kb = (p) => `${(statSync(p).size / 1024).toFixed(0)} KB`;

async function packTier({ suffix, size, tq }) {
  const doc = new Document();
  const buffer = doc.createBuffer();
  const pos = doc.createAccessor().setType('VEC3').setArray(new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0])).setBuffer(buffer);
  const nor = doc.createAccessor().setType('VEC3').setArray(new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1])).setBuffer(buffer);
  const uv = doc.createAccessor().setType('VEC2').setArray(new Float32Array([0, 0, 1, 0, 0, 1])).setBuffer(buffer);
  const scene = doc.createScene();

  const load = async (file) => {
    const img = sharp(join(src, 'textures', file)).removeAlpha();
    return (size === 4096 ? img : img.resize(size, size, { kernel: 'lanczos3' })).png({ compressionLevel: 6 }).toBuffer();
  };

  for (const set of SETS) {
    const tex = (name, image) => doc.createTexture(name).setImage(image).setMimeType('image/png');
    const material = doc
      .createMaterial(set)
      .setBaseColorTexture(tex(`${set}_basecolor`, await load(`${set}_basecolor.png`)))
      .setNormalTexture(tex(`${set}_normal`, await load(`${set}_normal.png`)))
      .setMetallicRoughnessTexture(tex(`${set}_orh`, await load(`${set}_orh.png`)));
    const prim = doc.createPrimitive().setAttribute('POSITION', pos).setAttribute('NORMAL', nor).setAttribute('TEXCOORD_0', uv).setMaterial(material);
    scene.addChild(doc.createNode(set).setMesh(doc.createMesh(set).addPrimitive(prim)));
  }

  const io = new NodeIO().registerExtensions(KHRONOS_EXTENSIONS);
  const inGlb = join(tmp, `in-${suffix}.glb`);
  const outGlb = join(tmp, `out-${suffix}.glb`);
  await io.write(inGlb, doc);

  const run = spawnSync(gltfpack, ['-i', inGlb, '-o', outGlb, '-tc', '-tq', tq, '-noq', '-kn', '-km'], { stdio: 'inherit' });
  if (run.status !== 0) throw new Error('gltfpack failed');

  const packed = await io.read(outGlb);
  for (const t of packed.getRoot().listTextures()) {
    const name = t.getName();
    if (t.getMimeType() !== 'image/ktx2') throw new Error(`${name} is ${t.getMimeType()}`);
    const file = join(out, `${name}_${suffix}.ktx2`);
    writeFileSync(file, t.getImage());
    console.log(`  ${name}_${suffix}.ktx2  ${kb(file)}`);
  }
}

for (const tier of TIERS) {
  console.log(`Encoding ${tier.size}px textures...`);
  await packTier(tier);
}

console.log('Lightmaps...');
for (const name of ['GalleryWall', 'GalleryFloor', 'GalleryCeiling']) {
  const input = join(src, 'lightmaps', `${name}.png`);
  const file = join(out, `${name}_lm.webp`);
  const phone = join(out, `${name}_lm_sm.webp`);
  // The bake is neutral. Dropping colour stops chroma artifacts, which the shader's 4x light multiplier makes visible.
  const grey = () => sharp(input).removeAlpha().greyscale().toColourspace('srgb');
  await grey().webp({ quality: 95, effort: 6 }).toFile(file);
  await grey().resize(768, 768, { kernel: 'lanczos3' }).webp({ quality: 92, effort: 6 }).toFile(phone);
  console.log(`  ${name}_lm  ${kb(file)}  phone ${kb(phone)}`);
}

copyFileSync(join(src, 'gallery-raw.glb'), join(out, 'gallery.glb'));
console.log(`  gallery.glb  ${kb(join(out, 'gallery.glb'))}`);

rmSync(tmp, { recursive: true, force: true });
console.log('Done.');
