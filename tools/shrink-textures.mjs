/* =============================================================
   Réduit les textures des .glb optimisés (pur JS via jimp —
   contourne le bug sharp/vips sur les PNG Meshy sous Windows).
   PNG → JPEG (si opaque) + redimensionnement ≤ 512 px (1024
   pour le perso et la planète-sol).
   Usage : node tools/shrink-textures.mjs
============================================================= */

import { readdirSync, statSync } from 'node:fs';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import { Jimp } from 'jimp';

const DIR = 'public/assets/models';
const HI_RES = new Set(['perso.glb', 'planete.glb']);

await MeshoptDecoder.ready;
await MeshoptEncoder.ready;

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    'meshopt.decoder': MeshoptDecoder,
    'meshopt.encoder': MeshoptEncoder
  });

function hasAlpha(img) {
  const d = img.bitmap.data;
  for (let i = 3; i < d.length; i += 64 * 4) {
    if (d[i] < 250) return true;
  }
  return false;
}

const files = readdirSync(DIR).filter((f) => f.endsWith('.glb'));
for (const file of files) {
  const path = `${DIR}/${file}`;
  const before = statSync(path).size / 1048576;
  const max = HI_RES.has(file) ? 1024 : 512;

  const doc = await io.read(path);
  let touched = 0;

  for (const tex of doc.getRoot().listTextures()) {
    const data = tex.getImage();
    if (!data) continue;
    try {
      const img = await Jimp.fromBuffer(Buffer.from(data));
      if (img.width > max) img.resize({ w: max });

      if (hasAlpha(img)) {
        const out = await img.getBuffer('image/png');
        tex.setImage(new Uint8Array(out)).setMimeType('image/png');
      } else {
        const out = await img.getBuffer('image/jpeg', { quality: 82 });
        tex.setImage(new Uint8Array(out)).setMimeType('image/jpeg');
      }
      touched++;
    } catch (e) {
      console.log(`   ⚠ ${file} : texture illisible (${e.message.slice(0, 80)})`);
    }
  }

  await io.write(path, doc);
  const after = statSync(path).size / 1048576;
  console.log(`✅ ${file} : ${before.toFixed(2)} → ${after.toFixed(2)} Mo (${touched} textures)`);
}

console.log('\n🏁 Textures réduites.');
