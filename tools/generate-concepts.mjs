/* =============================================================
   Génère les images concept des assets 3D (pour Meshy)
   Usage :  $env:OPENAI_API_KEY='sk-...' ; node tools/generate-concepts.mjs
   Sortie : meshy-concepts/<id>.png  (fond transparent, 1024×1024)

   Chaque image = UN objet isolé, style low-poly cohérent
   → à envoyer ensuite dans Meshy (image → 3D), export .glb,
     puis déposer dans public/assets/models/ (voir README).
============================================================= */

import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) {
  console.error('❌ Variable OPENAI_API_KEY manquante.');
  process.exit(1);
}

const OUT_DIR = 'meshy-concepts';

/* Style commun à TOUS les assets — cohérence visuelle de la planète */
const STYLE =
  ', stylized low-poly 3D game asset, flat shading with subtle facets, ' +
  'soft vibrant colors, cute cozy video game style, single object perfectly centered, ' +
  'isolated on plain background, 3/4 perspective view, soft studio lighting, ' +
  'clean silhouette, no text, no watermark, no ground shadow';

const ASSETS = [
  // --- Le héros et les éléments clés ---
  {
    id: 'perso-robot',
    prompt: 'Cute small robot explorer character standing upright: cream-white boxy body, dark blue visor with two glowing cyan rectangular eyes, orange backpack, dark blue legs, yellow glowing antenna ball on top of head, friendly game mascot proportions (big head, small body)'
  },
  {
    id: 'planete',
    prompt: 'Tiny spherical cartoon planet for a video game, miniature world with several distinct biomes wrapping around the sphere: green grassy plains, sandy desert, snowy patch, beach, tiny city block, dark swamp, rocky gray mountains, pine forest, small brown impact crater on the top pole, oceans absent, whimsical Little Prince style'
  },
  {
    id: 'planete-nue',
    prompt: 'Bare tiny spherical planet terrain to walk on, mostly green grassy low-poly faceted surface with gentle rounded hills and a few subtle patches of lighter grass and dirt, one small flat circular sandy area on the top pole, completely empty terrain with nothing on it: no trees, no buildings, no rocks, no plants, no objects, no characters, just the bare ground sphere'
  },
  {
    id: 'planete-nue-biomes',
    prompt: 'Bare tiny spherical planet terrain to walk on, low-poly faceted sphere with distinct colored biome ground patches blending around it: green grass, sandy desert yellow, white snow, gray rocky stone, dark swamp green, beach sand, one small flat circular sandy area on the top pole, gentle bumps, completely empty terrain with nothing on it: no trees, no buildings, no rocks, no plants, no objects, no characters, just the bare ground sphere'
  },
  {
    id: 'meteorite',
    prompt: 'Burning meteorite rock ball, dark brown rocky surface with glowing orange lava cracks, small flames, falling star game prop'
  },
  {
    id: 'coffre',
    prompt: 'Closed wooden treasure chest with golden metal bands and a golden lock, warm brown wood, small golden glow around the lock'
  },
  {
    id: 'pancarte',
    prompt: 'Wooden signpost: single thick post with one blank rectangular wooden panel mounted near the top, warm brown wood with darker frame'
  },
  {
    id: 'drapeau',
    prompt: 'Small flag planted in the ground: wooden pole with a golden-yellow rectangular flag, tiny golden ball on top of the pole'
  },

  // --- Biomes : végétation & nature ---
  {
    id: 'sapin',
    prompt: 'Stylized pine tree made of three stacked green cone layers on a short brown trunk'
  },
  {
    id: 'sapin-neige',
    prompt: 'Stylized pine tree made of three stacked cone layers covered in white snow, short brown trunk'
  },
  {
    id: 'arbre-feuillu',
    prompt: 'Stylized leafy tree: round faceted green foliage blob on a brown trunk, one smaller foliage blob on the side'
  },
  {
    id: 'rocher',
    prompt: 'Faceted gray boulder rock, slightly flattened, simple game prop'
  },
  {
    id: 'cactus',
    prompt: 'Green desert cactus with a tall main body and two small arms, subtle facets'
  },
  {
    id: 'palmier',
    prompt: 'Palm tree with curved segmented brown trunk and a crown of green pointed leaves'
  },
  {
    id: 'quenouilles',
    prompt: 'Small cluster of swamp cattail reeds: thin green stems with brown sausage-shaped tops'
  },
  {
    id: 'bonhomme-neige',
    prompt: 'Cute snowman with two stacked white snowballs, orange carrot nose, small black eyes'
  },
  {
    id: 'montagne',
    prompt: 'Rocky gray mountain peak with white snow cap, faceted hexagonal cone shape'
  },
  {
    id: 'pyramide',
    prompt: 'Sandstone desert pyramid, warm sandy yellow, clean faceted faces'
  },

  // --- Objets thématiques des domaines ---
  {
    id: 'borne-arcade',
    prompt: 'Retro arcade cabinet, pink-magenta body, glowing cyan screen, small control panel with yellow and green buttons'
  },
  {
    id: 'immeuble',
    prompt: 'Small city building, blue-gray facade with rows of glowing warm yellow windows, flat dark roof'
  },
  {
    id: 'tour-pc',
    prompt: 'Gaming PC tower case, dark gray, glowing green LED strip on the front and a glowing cyan fan'
  },
  {
    id: 'puce-electronique',
    prompt: 'Electronic microchip: green square circuit board body with silver metal pins on the sides and a glowing golden core in the center'
  },
  {
    id: 'obelisque',
    prompt: 'Dark blue stone obelisk monument with a glowing cyan orb floating just above its tip'
  },

  // --- Décor spatial ---
  {
    id: 'lune',
    prompt: 'Small gray moon sphere with a few faceted craters'
  },
  {
    id: 'planete-anneaux',
    prompt: 'Ringed gas giant planet, warm orange-brown banded sphere with a wide flat tan ring around it'
  }
];

/* ---------- Appel API ---------- */

async function generateOne(asset, attempt = 1) {
  const body = {
    model: 'gpt-image-1',
    prompt: asset.prompt + STYLE,
    size: '1024x1024',
    quality: 'medium',
    background: 'transparent',
    n: 1
  };

  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.text();
    // gpt-image-1 pas accessible ? → repli sur dall-e-3
    if (res.status === 403 || err.includes('must be verified') || err.includes('does not have access')) {
      return generateFallback(asset);
    }
    if ((res.status === 429 || res.status >= 500) && attempt < 3) {
      console.log(`   ⏳ ${asset.id} : réessai ${attempt + 1}...`);
      await new Promise((r) => setTimeout(r, 8000 * attempt));
      return generateOne(asset, attempt + 1);
    }
    throw new Error(`${res.status} — ${err.slice(0, 300)}`);
  }

  const json = await res.json();
  return Buffer.from(json.data[0].b64_json, 'base64');
}

async function generateFallback(asset) {
  console.log(`   ↪ ${asset.id} : repli sur dall-e-3 (fond uni au lieu de transparent)`);
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: asset.prompt + STYLE.replace('isolated on plain background', 'isolated on a plain light gray background'),
      size: '1024x1024',
      quality: 'standard',
      response_format: 'b64_json',
      n: 1
    })
  });
  if (!res.ok) throw new Error(`${res.status} — ${(await res.text()).slice(0, 300)}`);
  const json = await res.json();
  return Buffer.from(json.data[0].b64_json, 'base64');
}

/* ---------- Boucle avec un peu de parallélisme ---------- */

await mkdir(OUT_DIR, { recursive: true });
console.log(`🎨 Génération de ${ASSETS.length} images concept → ${OUT_DIR}/\n`);

const queue = [...ASSETS];
let done = 0;
let failed = 0;

async function worker() {
  while (queue.length) {
    const asset = queue.shift();
    if (existsSync(`${OUT_DIR}/${asset.id}.png`)) {
      done++;
      console.log(`⏭  [${done + failed}/${ASSETS.length}] ${asset.id}.png déjà présent`);
      continue;
    }
    try {
      const png = await generateOne(asset);
      await writeFile(`${OUT_DIR}/${asset.id}.png`, png);
      done++;
      console.log(`✅ [${done + failed}/${ASSETS.length}] ${asset.id}.png`);
    } catch (e) {
      failed++;
      console.error(`❌ [${done + failed}/${ASSETS.length}] ${asset.id} : ${e.message}`);
    }
  }
}

await Promise.all([worker(), worker(), worker()]);

console.log(`\n🏁 Terminé : ${done} réussies, ${failed} échouées.`);
console.log('→ Envoie ces PNG dans Meshy (mode Image to 3D), exporte en .glb,');
console.log('  puis dépose les fichiers dans public/assets/models/.');
