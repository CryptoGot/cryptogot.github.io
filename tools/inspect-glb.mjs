/* Inspecte un .glb : animations, meshes, matériaux, textures, dimensions.
   Usage : node tools/inspect-glb.mjs <fichier.glb> [...]                */

import { readFile } from 'node:fs/promises';

for (const path of process.argv.slice(2)) {
  const buf = await readFile(path);
  if (buf.readUInt32LE(0) !== 0x46546c67) {
    console.log(`${path} : pas un GLB`);
    continue;
  }
  const jsonLen = buf.readUInt32LE(12);
  const json = JSON.parse(buf.subarray(20, 20 + jsonLen).toString('utf8'));

  console.log(`\n═══ ${path.split(/[\\/]/).pop()}`);
  console.log(`   meshes: ${json.meshes?.length ?? 0}, nodes: ${json.nodes?.length ?? 0}, ` +
    `matériaux: ${json.materials?.length ?? 0}, images: ${json.images?.length ?? 0}, ` +
    `skins: ${json.skins?.length ?? 0}`);

  // Taille approx. des primitives
  let tris = 0;
  for (const m of json.meshes ?? []) {
    for (const p of m.primitives ?? []) {
      if (p.indices != null) tris += (json.accessors[p.indices].count / 3) | 0;
    }
  }
  console.log(`   triangles: ~${tris}`);

  // Dimensions via les accessors POSITION (min/max)
  let min = [Infinity, Infinity, Infinity];
  let max = [-Infinity, -Infinity, -Infinity];
  for (const m of json.meshes ?? []) {
    for (const p of m.primitives ?? []) {
      const acc = json.accessors[p.attributes?.POSITION];
      if (acc?.min && acc?.max) {
        for (let i = 0; i < 3; i++) {
          min[i] = Math.min(min[i], acc.min[i]);
          max[i] = Math.max(max[i], acc.max[i]);
        }
      }
    }
  }
  if (isFinite(min[0])) {
    const dims = max.map((v, i) => (v - min[i]).toFixed(2));
    console.log(`   dimensions (avant transform de nodes): ${dims.join(' × ')}`);
  }

  if (json.animations?.length) {
    console.log(`   animations (${json.animations.length}) :`);
    json.animations.forEach((a, i) => console.log(`     [${i}] ${a.name ?? '(sans nom)'}`));
  } else {
    console.log('   animations : aucune');
  }
}
