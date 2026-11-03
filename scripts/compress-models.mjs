// Run: node scripts/compress-models.mjs
//   gallery.glb           room from Blender
//   Portfolio3-mobile.glb hero scene simplified for phones
// Both come out Draco-compressed. Run after build-work-gallery.mjs.

import { NodeIO, PropertyType } from '@gltf-transform/core';
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, draco, prune, simplify, weld } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';
import { MeshoptSimplifier } from 'meshoptimizer';
import { statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const src = join(root, 'assets-src', 'work-gallery');

const io = new NodeIO().registerExtensions(KHRONOS_EXTENSIONS).registerDependencies({
  'draco3d.decoder': await draco3d.createDecoderModule(),
  'draco3d.encoder': await draco3d.createEncoderModule(),
});

const kb = (p) => `${Math.round(statSync(p).size / 1024)} KB`;

const room = await io.read(join(src, 'gallery-raw.glb'));
await room.transform(
  weld(),
  draco({ quantizePosition: 14, quantizeNormal: 10, quantizeTexcoord: 14, encodeSpeed: 3, decodeSpeed: 5 }),
);
await io.write(join(pub, 'work-gallery', 'gallery.glb'), room);
console.log('gallery.glb', kb(join(pub, 'work-gallery', 'gallery.glb')));

const hero = await io.read(join(pub, 'Portfolio3-draco.glb'));
await hero.transform(
  // Materials stay as they are: components/Portfolio3.tsx looks them up by name.
  dedup({ propertyTypes: [PropertyType.ACCESSOR, PropertyType.MESH] }),
  weld(),
  simplify({ simplifier: MeshoptSimplifier, ratio: 0.3, error: 0.004, lockBorder: true }),
  prune({ keepLeaves: true }),
  draco({ quantizePosition: 13, quantizeNormal: 8, quantizeTexcoord: 10, encodeSpeed: 3, decodeSpeed: 5 }),
);
await io.write(join(pub, 'Portfolio3-mobile.glb'), hero);
console.log('Portfolio3-mobile.glb', kb(join(pub, 'Portfolio3-mobile.glb')));
