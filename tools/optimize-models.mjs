/* =============================================================
   Optimise les exports Meshy (Assets3D/) → public/assets/models/
   - simplification du maillage (meshoptimizer)
   - compression meshopt + textures WebP redimensionnées
   Usage : node tools/optimize-models.mjs
============================================================= */

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync, copyFileSync, rmSync, readFileSync } from 'node:fs';

const SRC = 'Assets3D';
const OUT = 'public/assets/models';
const TMP = `${OUT}/_tmp.glb`;

/* [fichier source, id de sortie, options]
   `target` = budget de triangles (le ratio est calculé depuis le comptage réel). */
const MAP = [
  ['Meshy_AI_Tri_Tier_Emerald_Tree_0805093457_texture.glb', 'sapin', { target: 5000 }],
  ['Meshy_AI_Snowy_Layered_Pine_0805093525_texture.glb', 'sapin-neige', { target: 5000 }],
  ['Meshy_AI_Emerald_Polygon_Tree_0805092402_texture.glb', 'arbre-feuillu', { target: 5000 }],
  ['Meshy_AI_Facet_Stone_0805093519_texture.glb', 'rocher', { target: 2500 }],
  ['Meshy_AI_Polygon_Palm_0805094544_texture.glb', 'palmier', { target: 6000 }],
  ['Meshy_AI_Cattail_Trio_0805093514_texture.glb', 'quenouilles', { target: 5000 }],
  ['Meshy_AI_Geometric_Snowman_0805092355_texture.glb', 'bonhomme-neige', { target: 4000 }],
  ['Meshy_AI_Golden_Pyramid_0805093504_texture.glb', 'pyramide', { target: 3000 }],
  ['Meshy_AI_Pastel_Neon_Arcade_0805092546_texture.glb', 'borne-arcade', { target: 6000 }],
  ['Meshy_AI_Neon_Hex_PC_0805093508_texture.glb', 'tour-pc', { target: 6000 }],
  ['Meshy_AI_Azure_Obelisk_of_Ligh_0805094113_texture.glb', 'obelisque', { target: 4000 }],
  ['Meshy_AI_Golden_Treasure_Chest_0805092600_texture.glb', 'coffre', { target: 5000 }],
  ['Meshy_AI_Golden_Polygon_Lamp_0805094103_texture.glb', 'lampe', { target: 4000 }],
  ['Meshy_AI_Cracked_Ember_Orb_0805092446_texture.glb', 'meteorite', { target: 5000 }],
  ['Meshy_AI_Geometric_Moon_with_C_0805092440_texture.glb', 'lune', { target: 4000 }],
  ['Meshy_AI_Amber_Saturn_0805094108_texture.glb', 'planete-anneaux', { target: 6000 }],
  ['Meshy_AI_Emerald_Facets_0805094055_texture.glb', 'planete', { target: 15000, error: 0.02, tex: 1024 }],
  [
    'perso/Meshy_AI_Little_Boy_with_Panda_biped/Meshy_AI_Little_Boy_with_Panda_biped_Meshy_AI_Meshy_Merged_Animations.glb',
    'perso',
    { ratio: 0.12, error: 0.005, tex: 1024 }
  ]
];

mkdirSync(OUT, { recursive: true });

/** Compte les triangles d'un .glb (lecture du chunk JSON). */
function countTris(path) {
  try {
    const buf = readFileSync(path);
    if (buf.readUInt32LE(0) !== 0x46546c67) return null;
    const json = JSON.parse(buf.subarray(20, 20 + buf.readUInt32LE(12)).toString('utf8'));
    let tris = 0;
    for (const m of json.meshes ?? []) {
      for (const p of m.primitives ?? []) {
        if (p.indices != null) tris += (json.accessors[p.indices].count / 3) | 0;
      }
    }
    return tris || null;
  } catch {
    return null;
  }
}

function run(args) {
  const r = spawnSync('npx', ['--no-install', 'gltf-transform', ...args], {
    shell: true,
    encoding: 'utf8'
  });
  return { ok: r.status === 0, out: (r.stdout ?? '') + (r.stderr ?? '') };
}

function mb(path) {
  return (statSync(path).size / 1048576).toFixed(2);
}

let okCount = 0;
for (const [srcName, id, opts] of MAP) {
  const src = `${SRC}/${srcName}`;
  const out = `${OUT}/${id}.glb`;
  if (!existsSync(src)) {
    console.log(`⏭  ${id} : source absente (${srcName})`);
    continue;
  }

  const tex = opts.tex ?? 512;

  // Ratio depuis le budget de triangles (l'erreur haute laisse le ratio décider)
  let ratio = opts.ratio;
  let error = opts.error ?? 0.05;
  if (!ratio) {
    const tris = countTris(src);
    ratio = tris ? Math.min(1, Math.max(0.01, (opts.target ?? 5000) / tris)) : 0.2;
  }

  // 1) Simplification agressive du maillage
  const s = run(['simplify', src, TMP, '--ratio', String(ratio), '--error', String(error)]);
  if (!s.ok) {
    console.log(`   ⚠ ${id} : simplify a échoué, on continue sans (${s.out.split('\n')[0]})`);
    copyFileSync(src, TMP);
  }

  // 2) Optimisation générale + compression.
  //    Le convertisseur WebP (sharp) plante sur ces textures sous Windows
  //    → chaîne de replis : jpeg → resize seul → aucune retouche texture.
  const attempts = [
    ['jpeg', ['--compress', 'meshopt', '--texture-compress', 'jpeg', '--texture-size', String(tex)]],
    ['resize seul', ['--compress', 'meshopt', '--texture-compress', 'false', '--texture-size', String(tex)]],
    ['textures intactes', ['--compress', 'meshopt', '--texture-compress', 'false']]
  ];

  let done = false;
  for (const [label, flags] of attempts) {
    const o = run(['optimize', TMP, out, ...flags]);
    if (o.ok) {
      okCount++;
      console.log(`✅ ${id}.glb (${label}) : ${mb(src)} Mo → ${mb(out)} Mo`);
      done = true;
      break;
    }
  }
  if (!done) console.log(`❌ ${id} : toutes les tentatives ont échoué`);
}

rmSync(TMP, { force: true });
console.log(`\n🏁 ${okCount}/${MAP.length} modèles optimisés dans ${OUT}/`);
