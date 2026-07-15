// Pipeline for hero-scene textures:
//   1. Downscale 4096² → 1024² using sharp (camera never sees them close enough
//      for 4K detail to matter — ~16× VRAM reduction).
//   2. Pack into a temp GLB referencing each texture from a material.
//   3. Run native gltfpack.exe -tc → compresses textures to KTX2 (ETC1S/BasisU).
//   4. Extract the KTX2 buffers back to standalone .ktx2 files in /public.

import { NodeIO, Document } from '@gltf-transform/core';
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions';
import sharp from 'sharp';
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const publicDir = join(root, 'public');
const tmpDir = join(root, '.ktx2-tmp');
const gltfpack = join(root, '.tools', 'gltfpack.exe');

if (!existsSync(gltfpack)) {
  console.error(`gltfpack.exe not found at ${gltfpack}`);
  process.exit(1);
}

// Texture classes for gltfpack: 'color' uses sRGB encoding, 'attrib' uses linear.
// wdiffuse/cdiffuse are color maps (sRGB). 'arm' = AO/Roughness/Metalness packed
// is a linear data map ('attrib').
const TEXTURES = [
  { src: 'Cw/diffuse.webp',  out: 'Cw/diffuse.ktx2',  label: 'cdiffuse', kind: 'color'  },
  { src: 'Wood/diff.webp',   out: 'Wood/diff.ktx2',   label: 'wdiffuse', kind: 'color'  },
  { src: 'Wood/arm.webp',    out: 'Wood/arm.ktx2',    label: 'warm',     kind: 'attrib' },
];

const TARGET_SIZE = 1024;

mkdirSync(tmpDir, { recursive: true });

const doc = new Document();
const buffer = doc.createBuffer();
const positions = doc
  .createAccessor()
  .setType('VEC3')
  .setArray(new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]))
  .setBuffer(buffer);
const uvs = doc
  .createAccessor()
  .setType('VEC2')
  .setArray(new Float32Array([0, 0, 1, 0, 0, 1]))
  .setBuffer(buffer);
const scene = doc.createScene();

for (const tex of TEXTURES) {
  // Downscale + re-encode as PNG (lossless input to gltfpack so we don't double-lossy).
  const inPath = join(publicDir, tex.src);
  const resized = await sharp(inPath)
    .resize(TARGET_SIZE, TARGET_SIZE, { fit: 'fill' })
    .png({ compressionLevel: 9 })
    .toBuffer();
  console.log(`  resized ${tex.src} → ${TARGET_SIZE}² (${(resized.byteLength/1024).toFixed(0)} KB PNG intermediate)`);

  const texture = doc
    .createTexture(tex.label)
    .setImage(resized)
    .setMimeType('image/png');
  const material = doc.createMaterial(tex.label).setBaseColorTexture(texture);
  const prim = doc
    .createPrimitive()
    .setAttribute('POSITION', positions)
    .setAttribute('TEXCOORD_0', uvs)
    .setMaterial(material);
  const mesh = doc.createMesh(tex.label).addPrimitive(prim);
  const node = doc.createNode(tex.label).setMesh(mesh);
  scene.addChild(node);
}

const io = new NodeIO().registerExtensions(KHRONOS_EXTENSIONS);
const inGlb = join(tmpDir, 'textures-in.glb');
const outGlb = join(tmpDir, 'textures-out.glb');
await io.write(inGlb, doc);
console.log(`temp GLB written: ${inGlb}`);

// Run native gltfpack — ETC1S (-tc) for color, default quality 8.
// -noq disables vertex quantization (we're not shipping these meshes anyway).
// -kn -km preserve our labels so we can match outputs.
const args = ['-i', inGlb, '-o', outGlb, '-tc', '-tq', '8', '-noq', '-kn', '-km'];
console.log(`running: gltfpack ${args.join(' ')}`);
const result = spawnSync(gltfpack, args, { stdio: 'inherit' });
if (result.status !== 0) {
  console.error('gltfpack failed');
  process.exit(1);
}

const outDoc = await io.read(outGlb);
const outTextures = outDoc.getRoot().listTextures();

for (const tex of TEXTURES) {
  const match = outTextures.find((t) => t.getName() === tex.label);
  if (!match) {
    console.error(`Texture "${tex.label}" missing in output`);
    process.exit(1);
  }
  const img = match.getImage();
  const mime = match.getMimeType();
  if (mime !== 'image/ktx2') {
    console.error(`Texture "${tex.label}" mime is ${mime}, expected image/ktx2`);
    process.exit(1);
  }
  const outPath = join(publicDir, tex.out);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, img);
  console.log(`✓ ${tex.out} (${(img.byteLength/1024).toFixed(0)} KB)`);
}

rmSync(tmpDir, { recursive: true, force: true });
console.log('Done.');
