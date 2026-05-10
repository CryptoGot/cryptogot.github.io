/* =============================================================
   WORLD.JS : moteur top-down RPG avec 8 environnements générés
   procéduralement en pixel art
   - Le perso (Eris) descend de zone en zone
   - Caméra suit Y, jamais X
   - Pancartes interactives qui ouvrent les panneaux EPHEC
============================================================= */

(function(){
  'use strict';

  if (!window.PORTFOLIO) {
    console.error('content.js doit être chargé avant world.js');
    return;
  }

  /* ============== CONSTANTES ============== */
  const TILE   = 32;         // taille d'une tuile (world units)
  const MAP_W  = 22;         // largeur de la carte en tuiles (704px world)
  const ZONE_H = 12;         // hauteur d'une zone en tuiles (zones plus courtes)
  const VIEW_ZOOM = 0.7;     // dézoom global pour voir plus de map à la fois
  const PARCOURS = window.PORTFOLIO.parcours;
  const NUM_ZONES = PARCOURS.length;
  const MAP_H = ZONE_H * NUM_ZONES;
  const WORLD_PX_W = MAP_W * TILE;
  const WORLD_PX_H = MAP_H * TILE;

  // Mapping zone id -> environnement visuel
  const ENV_BY_ZONE = {
    design3d:    'foret',
    app:         'ville',
    gamedev:     'plaine',
    electronique:'marais',
    hardware:    'montagne',
    ia:          'desert',
    securite:    'plage',
    site:        'neige'
  };

  // Noms affichés à l'entrée de zone
  const ZONE_NAMES = {
    foret:    { titre: '🌲 Forêt du 3D Design',          sub: 'Mes assets Blender' },
    ville:    { titre: '🏙️ Ville de l\'App',              sub: 'Diopside, projet d\'équipe' },
    plaine:   { titre: '🌾 Plaine du Game Dev',           sub: 'Mes jeux Unity et Unreal' },
    marais:   { titre: '🪵 Marais de l\'Électronique',    sub: 'Frigo connecté Raspberry Pi' },
    montagne: { titre: '⛰️ Montagne du Hardware',         sub: 'Réparations PC' },
    desert:   { titre: '🏜️ Désert de l\'IA',              sub: 'Agents et jeux IA' },
    plage:    { titre: '🏖️ Plage de la Sécurité',         sub: 'Challenge cybersécurité' },
    neige:    { titre: '❄️ Neige des Sites Web',          sub: 'GamAI et formations web' }
  };

  /* ============== CANVAS / RESIZE ============== */
  const canvas = document.getElementById('worldCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let viewW = 0, viewH = 0;
  let dpr = 1;
  let renderScale = 1; // si le viewport est plus étroit que WORLD_PX_W, on scale

  function resize(){
    dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    const rect = canvas.getBoundingClientRect();
    viewW = Math.max(1, Math.floor(rect.width));
    viewH = Math.max(1, Math.floor(rect.height));
    canvas.width  = viewW * dpr;
    canvas.height = viewH * dpr;
    // viewZoom dézoome légèrement la map pour voir plus de zones à la fois
    renderScale = Math.max(0.5, (viewW / WORLD_PX_W) * VIEW_ZOOM);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
    updateSignsHud();
  }
  window.addEventListener('resize', () => { resize(); }, { passive: true });

  /* ============== PALETTES ENVIRONNEMENTS ============== */
  // Couleurs flat par zone (style cell-shading / dessin animé)
  // g1 = couleur principale, g2 = nuance secondaire, accent = highlight, deco couleur du décor
  const PAL = {
    foret:    { g1:'#3a7a3a', g2:'#2d5e2d', accent:'#5fa84f', deco:'#1e3010', trunk:'#3a2515', flower:'#ffe066' },
    ville:    { g1:'#a8acb4', g2:'#82868c', accent:'#c4c8d0', deco:'#3a3e44', trunk:'#3a3e44', flower:'#dadada' },
    plaine:   { g1:'#a8e068', g2:'#7eb84a', accent:'#cbf088', deco:'#3a6a1a', trunk:'#5a3a20', flower:'#fff060' },
    marais:   { g1:'#6a6038', g2:'#4a4028', accent:'#8a8050', deco:'#3a3018', trunk:'#2a1e10', flower:'#9aa8b0' },
    montagne: { g1:'#9090a0', g2:'#6a6a7a', accent:'#c0c0d0', deco:'#4a4a5a', trunk:'#3a2a2a', flower:'#fff'    },
    desert:   { g1:'#e8c878', g2:'#c8a44e', accent:'#f4dc9c', deco:'#3a7020', trunk:'#5a8a40', flower:'#ff8050' },
    plage:    { g1:'#f4e0a0', g2:'#d8c478', accent:'#fff0c8', deco:'#3a8a30', trunk:'#5a3a20', flower:'#ff8080' },
    neige:    { g1:'#f0f4f8', g2:'#cdd6e0', accent:'#ffffff', deco:'#1e3010', trunk:'#3a2a1a', flower:'#fff'    }
  };
  const BG_COLOR = '#cccccc'; // fond global gris (zones non couvertes)
  const PATH_COLOR = '#b08050'; // marron clair pour le chemin
  const PATH_OUTLINE = '#000';
  const ZONE_OUTLINE = '#000';

  /* ============== GÉNÉRATION DES TILESETS PIXEL ART ============== */
  // Chaque tileset = canvas 16xTILE × TILE avec 16 tuiles indexées
  // Tile IDs :
  //   0,1 : ground variant 1, 2
  //   2   : path
  //   3   : tree / building / cactus selon environnement
  //   4   : rock / shrub
  //   5   : flower / detail
  //   6   : water (si applicable)
  //   7   : sign (pancarte)
  //   8   : ground variant 3 (plus rare)

  const tilesets = {};
  for (const env of Object.keys(PAL)) {
    tilesets[env] = makeTileset(env, PAL[env]);
  }

  function makeTileset(env, pal){
    const c = document.createElement('canvas');
    c.width = TILE * 16;
    c.height = TILE;
    const tc = c.getContext('2d');
    tc.imageSmoothingEnabled = false;

    // ---- 0 : ground principal (texture mouchetée 4x4 mini-pixels)
    drawGround(tc, 0, pal.g1, pal.g2);
    // ---- 1 : ground variant (mêmes couleurs, autre seed)
    drawGround(tc, 1, pal.g2, pal.g1);
    // ---- 2 : path
    drawGround(tc, 2, pal.path, pal.pathEdge);
    // ---- 3 : décor "vertical" (arbre / bâtiment / cactus / rocher selon env)
    drawDecor(tc, 3, env, pal);
    // ---- 4 : rocher / petit décor
    drawRock(tc, 4, pal);
    // ---- 5 : fleur / détail
    drawFlower(tc, 5, pal);
    // ---- 6 : eau ou variante sol
    if (pal.water) drawWater(tc, 6, pal);
    else           drawGround(tc, 6, pal.g3, pal.g1);
    // ---- 7 : pancarte (sign en bois, vue de haut, sans bg noir)
    drawSign(tc, 7, pal);
    // ---- 8 : ground variant 3
    drawGround(tc, 8, pal.g3, pal.g2);
    // ---- 9 : edge sol/path (transition)
    drawGroundMix(tc, 9, pal.g1, pal.path);

    return c;
  }

  // Helper : dessine un carré 32x32 à l'index t avec texture mouchetée
  function drawGround(tc, t, base, splash){
    const x = t * TILE;
    tc.fillStyle = base;
    tc.fillRect(x, 0, TILE, TILE);
    // mouchetures pixel art
    tc.fillStyle = splash;
    const seed = (t * 7919 + 13) & 0xffff;
    for (let i = 0; i < 14; i++){
      const px = x + ((seed * (i+1)) % TILE) - ((seed * (i+1)) % TILE) % 2;
      const py = ((seed * (i+3)) % TILE) - ((seed * (i+3)) % TILE) % 2;
      tc.fillRect(px, py, 2, 2);
    }
  }

  function drawGroundMix(tc, t, c1, c2){
    drawGround(tc, t, c1, c2);
    // bord du chemin (ligne de transition)
    const x = t * TILE;
    tc.fillStyle = c2;
    for (let i = 0; i < TILE; i+=2){
      tc.fillRect(x + i, TILE - 4 + ((i/2)%2)*2, 2, 2);
    }
  }

  function drawDecor(tc, t, env, pal){
    const x = t * TILE;
    // FOND TRANSPARENT (le sol de zone est déjà dessiné par drawBiomes)
    tc.clearRect(x, 0, TILE, TILE);

    if (env === 'foret' || env === 'plaine' || env === 'plage' || env === 'neige'){
      // ARBRE
      // ombre au pied
      tc.fillStyle = 'rgba(0,0,0,.25)';
      tc.fillRect(x+8, 26, 16, 4);
      // tronc
      tc.fillStyle = pal.trunk;
      tc.fillRect(x+13, 18, 6, 12);
      tc.fillStyle = '#000';
      tc.fillRect(x+13, 18, 1, 12); // ombre tronc
      // feuillage
      tc.fillStyle = pal.leaf;
      // boule de feuilles (cercle pixelisé)
      const leafBlocks = [
        [12, 4, 8, 16],
        [10, 6, 12, 12],
        [8, 8, 16, 8],
      ];
      for (const [bx, by, bw, bh] of leafBlocks){
        tc.fillRect(x + bx, by, bw, bh);
      }
      // hightlight
      tc.fillStyle = pal.accent;
      tc.fillRect(x+12, 6, 4, 4);
      tc.fillRect(x+18, 10, 2, 2);

      if (env === 'neige'){
        // neige sur l'arbre
        tc.fillStyle = '#fff';
        tc.fillRect(x+10, 4, 4, 2);
        tc.fillRect(x+14, 6, 6, 2);
        tc.fillRect(x+16, 10, 4, 2);
      }
    } else if (env === 'ville'){
      // BÂTIMENT
      tc.fillStyle = pal.g3;
      tc.fillRect(x+4, 4, 24, 24);
      tc.fillStyle = pal.accent;
      tc.fillRect(x+4, 4, 24, 4); // toit
      tc.fillStyle = '#1a1a1a';
      // fenêtres
      tc.fillRect(x+8,  12, 4, 4);
      tc.fillRect(x+16, 12, 4, 4);
      tc.fillRect(x+24, 12, 4, 4);
      tc.fillRect(x+8,  20, 4, 4);
      tc.fillRect(x+24, 20, 4, 4);
      // porte
      tc.fillStyle = pal.trunk;
      tc.fillRect(x+14, 18, 8, 10);
      tc.fillStyle = '#ffd24a';
      tc.fillRect(x+19, 22, 1, 2); // poignée
    } else if (env === 'marais'){
      // ROSEAUX
      tc.fillStyle = pal.water;
      tc.fillRect(x, 14, TILE, TILE-14);
      tc.fillStyle = pal.leaf;
      // 5 tiges
      for (let i = 0; i < 5; i++){
        tc.fillRect(x + 4 + i*5, 6 + (i%2)*2, 2, 18);
        tc.fillStyle = pal.flower;
        tc.fillRect(x + 4 + i*5 - 1, 4 + (i%2)*2, 4, 3);
        tc.fillStyle = pal.leaf;
      }
    } else if (env === 'montagne'){
      // PIC ROCHEUX
      tc.fillStyle = pal.g3;
      const peak = [
        [14, 4, 4, 4],
        [12, 8, 8, 4],
        [10, 12, 12, 4],
        [8,  16, 16, 4],
        [6,  20, 20, 4],
        [4,  24, 24, 4],
      ];
      for (const [bx, by, bw, bh] of peak){
        tc.fillRect(x+bx, by, bw, bh);
      }
      // sommet enneigé
      tc.fillStyle = '#fff';
      tc.fillRect(x+14, 4, 4, 2);
      tc.fillRect(x+12, 6, 8, 2);
      // ombre droite
      tc.fillStyle = '#000';
      tc.globalAlpha = .25;
      tc.fillRect(x+18, 8, 4, 20);
      tc.globalAlpha = 1;
    } else if (env === 'desert'){
      // CACTUS
      tc.fillStyle = pal.leaf;
      tc.fillRect(x+13, 6, 6, 22);
      tc.fillRect(x+8,  14, 5, 8);
      tc.fillRect(x+19, 16, 5, 6);
      tc.fillStyle = pal.accent;
      // ombre interne
      tc.fillRect(x+13, 6, 1, 22);
      tc.fillStyle = '#fff';
      // épines (points)
      for (let i = 0; i < 4; i++){
        tc.fillRect(x+15, 9 + i*5, 1, 1);
        tc.fillRect(x+10, 17 + i*2, 1, 1);
      }
    }
  }

  function drawRock(tc, t, pal){
    const x = t * TILE;
    tc.clearRect(x, 0, TILE, TILE);
    // ombre
    tc.fillStyle = 'rgba(0,0,0,.3)';
    tc.fillRect(x+8, 22, 16, 4);
    // rocher
    tc.fillStyle = pal.g3;
    tc.fillRect(x+10, 12, 12, 12);
    tc.fillRect(x+8,  16, 16, 6);
    tc.fillRect(x+12, 10, 8,  4);
    // hightlight haut-gauche
    tc.fillStyle = pal.accent;
    tc.fillRect(x+12, 12, 4, 2);
    tc.fillRect(x+10, 14, 2, 4);
  }

  function drawFlower(tc, t, pal){
    const x = t * TILE;
    tc.clearRect(x, 0, TILE, TILE);
    // herbe + fleur
    tc.fillStyle = pal.g2;
    for (let i = 0; i < 6; i++){
      tc.fillRect(x + 4 + i*4, 22 + (i%2)*2, 1, 4);
    }
    // fleur centrale
    tc.fillStyle = pal.flower;
    tc.fillRect(x+14, 14, 4, 4);
    tc.fillStyle = '#fff';
    tc.fillRect(x+15, 15, 2, 2);
    // tige
    tc.fillStyle = pal.leaf;
    tc.fillRect(x+15, 18, 2, 6);
  }

  function drawWater(tc, t, pal){
    const x = t * TILE;
    tc.fillStyle = pal.water;
    tc.fillRect(x, 0, TILE, TILE);
    // vagues
    tc.fillStyle = 'rgba(255,255,255,.25)';
    tc.fillRect(x+4, 8, 6, 1);
    tc.fillRect(x+18, 14, 8, 1);
    tc.fillRect(x+10, 22, 6, 1);
    tc.fillRect(x+22, 26, 6, 1);
  }

  function drawSign(tc, t, pal){
    const x = t * TILE;
    tc.clearRect(x, 0, TILE, TILE);
    // ombre au pied du poteau
    tc.fillStyle = 'rgba(0,0,0,.3)';
    tc.fillRect(x+12, 26, 8, 3);
    // poteau (à la base du panneau)
    tc.fillStyle = '#5b3812';
    tc.fillRect(x+15, 18, 2, 10);
    // bois (un mini panneau dessiné, le vrai label sera affiché en HTML par-dessus)
    tc.fillStyle = '#c98c3b';
    tc.fillRect(x+4, 4, 24, 14);
    // bordure
    tc.fillStyle = '#5b3812';
    tc.fillRect(x+4, 4, 24, 1);
    tc.fillRect(x+4, 17, 24, 1);
    tc.fillRect(x+4, 4, 1, 14);
    tc.fillRect(x+27, 4, 1, 14);
    // clous
    tc.fillStyle = '#3a2515';
    tc.fillRect(x+6, 6, 1, 1);
    tc.fillRect(x+26, 6, 1, 1);
    tc.fillRect(x+6, 16, 1, 1);
    tc.fillRect(x+26, 16, 1, 1);
  }

  /* ============== GÉNÉRATION DE LA CARTE ============== */
  // map[y * MAP_W + x] = id de tuile
  const map = new Uint8Array(MAP_W * MAP_H);
  // collisionMap[y * MAP_W + x] = 1 si non franchissable
  const collisionMap = new Uint8Array(MAP_W * MAP_H);
  // signs : objets avec position + référence au panneau du contenu
  const signs = [];

  // PRNG simple pour rendu déterministe
  function mulberry32(seed){
    return function(){
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Anchor X par zone : alternance droite / gauche / centre / droite / gauche...
  const X_DROITE = Math.floor(MAP_W * 0.78);
  const X_GAUCHE = Math.floor(MAP_W * 0.22);
  const X_CENTRE = Math.floor(MAP_W / 2);
  const ANCHORS = [
    X_DROITE,  // zone 0 : 3D Design
    X_GAUCHE,  // zone 1 : App
    X_CENTRE,  // zone 2 : GameDev
    X_DROITE,  // zone 3 : Électro
    X_GAUCHE,  // zone 4 : Hardware
    X_CENTRE,  // zone 5 : IA
    X_DROITE,  // zone 6 : Sécurité
    X_GAUCHE   // zone 7 : Site
  ];

  // pathX(y) : interpole entre l'anchor de la zone courante et celui de la suivante
  // pour avoir une transition smooth (smoothstep) entre les zones
  function pathX(y){
    const z = y / ZONE_H;
    const zIdx = Math.floor(z);
    const tInZone = Math.max(0, Math.min(1, z - zIdx));
    const a = ANCHORS[Math.min(NUM_ZONES - 1, zIdx)];
    const b = ANCHORS[Math.min(NUM_ZONES - 1, zIdx + 1)];
    const t = tInZone * tInZone * (3 - 2 * tInZone);
    return a + (b - a) * t;
  }

  // Génération de la map APRÈS la déclaration de ANCHORS/pathX (TDZ)
  generateMap();

  function generateMap(){
    const rand = mulberry32(424242);

    for (let z = 0; z < NUM_ZONES; z++){
      const zoneId = PARCOURS[z];
      const env = ENV_BY_ZONE[zoneId];
      const startY = z * ZONE_H;
      const endY = startY + ZONE_H;

      // 1) sol de base : alternance ground 0/1 avec quelques 8 (variant)
      for (let y = startY; y < endY; y++){
        for (let x = 0; x < MAP_W; x++){
          const r = rand();
          map[y * MAP_W + x] = r < 0.55 ? 0 : (r < 0.92 ? 1 : 8);
        }
      }

      // 2) chemin SERPENTANT : on enregistre dans la map les tiles du chemin
      // pour que la collision fonctionne (on ne peut pas marcher dans le décor),
      // mais le rendu visuel du chemin se fait via Path2D (renderPath)
      for (let y = startY; y < endY; y++){
        const cx = Math.round(pathX(y));
        for (let dx = -1; dx <= 1; dx++){
          const xx = Math.max(1, Math.min(MAP_W - 2, cx + dx));
          map[y * MAP_W + xx] = 2;
        }
      }

      // 3) décorations (arbres/bâtiments/cactus)
      const decoCount = 14 + Math.floor(rand() * 6);
      let attempts = 0;
      let placed = 0;
      while (placed < decoCount && attempts < 100){
        attempts++;
        const dx = Math.floor(rand() * MAP_W);
        const dy = startY + 1 + Math.floor(rand() * (ZONE_H - 2));
        // pas sur le chemin (avec 2 tile de marge)
        if (Math.abs(dx - Math.round(pathX(dy))) <= 2) continue;
        const idx = dy * MAP_W + dx;
        if (map[idx] >= 3) continue;
        const r = rand();
        let tileId;
        if (env === 'marais' && r < 0.5) tileId = 6;
        else if (r < 0.55) tileId = 3;
        else if (r < 0.85) tileId = 4;
        else                tileId = 5;
        map[idx] = tileId;
        if (tileId === 3 || tileId === 4 || tileId === 6) collisionMap[idx] = 1;
        placed++;
      }

      // 4) bordures latérales : collision invisible (le perso ne sort pas de
      // la map) mais SANS poser de décor, pour ne pas avoir de cases bordées
      for (let y = startY; y < endY; y++){
        collisionMap[y * MAP_W + 0] = 1;
        collisionMap[y * MAP_W + (MAP_W - 1)] = 1;
      }

      // 5) pancartes : 1 par panneau du thème, placées sur le chemin
      const panneaux = window.PORTFOLIO[zoneId]?.panneaux || [];
      for (let p = 0; p < panneaux.length; p++){
        const signY = startY + Math.floor(ZONE_H / 3) + p * Math.floor(ZONE_H / 3);
        const cx = Math.round(pathX(signY));
        // pancarte juste à côté du chemin (3 cases à droite ou gauche)
        const signX = (p % 2 === 0) ? cx + 3 : cx - 3;
        const safeX = Math.max(1, Math.min(MAP_W - 2, signX));
        const sIdx = signY * MAP_W + safeX;
        map[sIdx] = 7;
        collisionMap[sIdx] = 1;
        signs.push({
          x: safeX, y: signY,
          zoneId, panneauIdx: p,
          env,
          type: panneaux[p].type || 'projet',
          label: panneauTypeLabel(panneaux[p].type || 'projet')
        });
      }
    }
  }

  function panneauTypeLabel(t){
    return ({
      projet: 'PROJET',
      formation: 'FORMATION',
      challenge: 'CHALLENGE',
      hackathon: 'HACKATHON',
      conference: 'CONFÉRENCE',
      visite: 'VISITE',
      jobday: 'JOB DAY',
      salon: 'SALON'
    })[t] || 'PROJET';
  }

  /* ============== JOUEUR (ERIS) ============== */
  const sprIdle = new Image(); sprIdle.src = 'assets/eris/idle.png';
  const sprWalk = new Image(); sprWalk.src = 'assets/eris/walk.png';

  // Le sprite Eris est 16x32, organisé 8 cols x 5 rows
  // On utilise les 4 premières lignes pour les directions (down, left, up, right)
  // Approximation : on utilise frame 0 idle, frames 0-3 walk
  const SPR_W = 16, SPR_H = 32;
  const SPR_COLS = 8;
  const DIR_ROW = { down: 0, left: 1, up: 2, right: 3 };

  const player = {
    // position en pixels monde (centre du sprite à ses pieds)
    x: WORLD_PX_W / 2,
    y: TILE * 3,
    w: 18,         // hitbox (étroite, base du sprite)
    h: 12,         // hitbox bas du corps seulement
    speed: 140,    // px/seconde
    facing: 'down',
    walking: false,
    frame: 0,
    frameTime: 0
  };

  /* ============== CAMÉRA (Y uniquement) ============== */
  const camera = { y: 0 };

  function updateCamera(){
    // Centre la caméra verticalement sur le perso, contrainte aux bords
    // viewH est en pixels CSS, on le convertit en world units via renderScale
    const visHeight = viewH / renderScale;
    const target = player.y - visHeight / 2;
    camera.y = Math.max(0, Math.min(WORLD_PX_H - visHeight, target));
  }

  /* ============== INPUTS ============== */
  const keys = { up:false, down:false, left:false, right:false, interact:false };
  let interactPressed = false;
  let active = false; // true quand le world est visible/jouable

  function isTyping(e){
    const tag = (e.target.tagName || '').toUpperCase();
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable;
  }

  window.addEventListener('keydown', (e) => {
    if (!active) return;
    if (isTyping(e)) return;
    switch (e.code){
      case 'ArrowUp': case 'KeyW': case 'KeyZ':
        keys.up = true; e.preventDefault(); break;
      case 'ArrowDown': case 'KeyS':
        keys.down = true; e.preventDefault(); break;
      case 'ArrowLeft': case 'KeyA': case 'KeyQ':
        keys.left = true; e.preventDefault(); break;
      case 'ArrowRight': case 'KeyD':
        keys.right = true; e.preventDefault(); break;
      case 'KeyE': case 'Enter': case 'Space':
        if (!keys.interact){ interactPressed = true; }
        keys.interact = true;
        e.preventDefault();
        break;
      case 'Escape':
        // retourne en haut
        document.querySelector('#top')?.scrollIntoView({ behavior: 'smooth' });
        break;
    }
  }, { passive: false });

  window.addEventListener('keyup', (e) => {
    if (isTyping(e)) return;
    switch (e.code){
      case 'ArrowUp': case 'KeyW': case 'KeyZ':    keys.up = false; break;
      case 'ArrowDown': case 'KeyS':                keys.down = false; break;
      case 'ArrowLeft': case 'KeyA': case 'KeyQ':   keys.left = false; break;
      case 'ArrowRight': case 'KeyD':               keys.right = false; break;
      case 'KeyE': case 'Enter': case 'Space':      keys.interact = false; break;
    }
  }, { passive: true });

  /* ============== COLLISIONS ============== */
  function isSolid(tx, ty){
    if (tx < 0 || tx >= MAP_W || ty < 0 || ty >= MAP_H) return true;
    return collisionMap[ty * MAP_W + tx] === 1;
  }

  function tryMove(dx, dy){
    // hitbox = rectangle player.w × player.h centré sur (player.x, player.y)
    const x0 = player.x - player.w/2 + dx;
    const x1 = player.x + player.w/2 + dx;
    const y0 = player.y - player.h    + dy;
    const y1 = player.y               + dy;

    // X
    if (dx !== 0){
      const newX0 = x0;
      const newX1 = x1;
      const tx0 = Math.floor(newX0 / TILE);
      const tx1 = Math.floor(newX1 / TILE);
      const ty0 = Math.floor((player.y - player.h) / TILE);
      const ty1 = Math.floor((player.y - 1) / TILE);
      let canMove = true;
      for (let ty = ty0; ty <= ty1; ty++){
        for (let tx = tx0; tx <= tx1; tx++){
          if (isSolid(tx, ty)){ canMove = false; break; }
        }
        if (!canMove) break;
      }
      if (canMove) player.x += dx;
    }
    // Y
    if (dy !== 0){
      const newY0 = player.y - player.h + dy;
      const newY1 = player.y + dy;
      const ty0 = Math.floor(newY0 / TILE);
      const ty1 = Math.floor(newY1 / TILE);
      const tx0 = Math.floor((player.x - player.w/2) / TILE);
      const tx1 = Math.floor((player.x + player.w/2 - 1) / TILE);
      let canMove = true;
      for (let ty = ty0; ty <= ty1; ty++){
        for (let tx = tx0; tx <= tx1; tx++){
          if (isSolid(tx, ty)){ canMove = false; break; }
        }
        if (!canMove) break;
      }
      if (canMove) player.y += dy;
    }
    // bornes monde
    player.x = Math.max(player.w/2 + 2, Math.min(WORLD_PX_W - player.w/2 - 2, player.x));
    player.y = Math.max(player.h + 2,    Math.min(WORLD_PX_H - 2,             player.y));
  }

  /* ============== INTERACTION PANCARTES ============== */
  let nearbySign = null;

  function findNearbySign(){
    let best = null;
    let bestD2 = (TILE * 1.6) * (TILE * 1.6);
    const px = player.x;
    const py = player.y - player.h/2;
    for (const s of signs){
      const sx = s.x * TILE + TILE/2;
      const sy = s.y * TILE + TILE/2;
      const d2 = (sx - px)*(sx - px) + (sy - py)*(sy - py);
      if (d2 < bestD2){ bestD2 = d2; best = s; }
    }
    return best;
  }

  function openSignModal(sign){
    const zoneData = window.PORTFOLIO[sign.zoneId];
    if (!zoneData) return;
    const panneau = zoneData.panneaux[sign.panneauIdx];
    if (!panneau) return;
    if (typeof window.showZoneModal === 'function') {
      window.showZoneModal(zoneData, panneau);
    }
  }

  /* ============== LABELS HTML DES PANCARTES ============== */
  // On crée un label DOM pour chaque pancarte, qu'on positionne en absolu
  // au-dessus du canvas. Bien plus net que dessiner du texte sur le canvas.
  const signLabels = [];
  function createSignLabels(){
    const worldSection = document.getElementById('world');
    if (!worldSection) return;
    let layer = worldSection.querySelector('.sign-labels-layer');
    if (!layer){
      layer = document.createElement('div');
      layer.className = 'sign-labels-layer';
      worldSection.appendChild(layer);
    }
    layer.innerHTML = '';
    for (const s of signs){
      const el = document.createElement('div');
      el.className = `sign-label sign-${s.type}`;
      el.textContent = s.label;
      layer.appendChild(el);
      signLabels.push({ sign: s, el });
    }
  }

  function updateSignsHud(){
    if (!signLabels.length) return;
    const drawnTile = TILE * renderScale;
    const offsetX = (viewW - WORLD_PX_W * renderScale) / 2;
    const PANNEAU_SCALE = 1.6; // doit matcher DECO_SCALE[7]
    for (const { sign, el } of signLabels){
      const centerX = offsetX + (sign.x + 0.5) * drawnTile;
      // baseY = bas du sprite ; haut du sprite = baseY - dh
      const baseY = -camera.y * renderScale + (sign.y + 1) * drawnTile;
      const topY  = baseY - drawnTile * PANNEAU_SCALE;
      el.style.left = `${centerX}px`;
      el.style.top  = `${topY - 6}px`;
      const visible = topY > -60 && topY < viewH + 60;
      el.style.display = visible ? 'block' : 'none';
    }
  }

  /* ============== ZONE COURANTE / INTRO ============== */
  let currentZoneIdx = -1;
  const zoneIntroEl = ensureZoneIntro();
  const progressLabel = document.querySelector('.zone-label');

  function ensureZoneIntro(){
    let el = document.querySelector('.zone-intro');
    if (!el){
      el = document.createElement('div');
      el.className = 'zone-intro';
      el.innerHTML = '<h3></h3><p></p>';
      document.body.appendChild(el);
    }
    return el;
  }

  function updateZone(){
    const zIdx = Math.min(NUM_ZONES - 1, Math.max(0, Math.floor(player.y / (ZONE_H * TILE))));
    if (zIdx !== currentZoneIdx){
      currentZoneIdx = zIdx;
      const zoneId = PARCOURS[zIdx];
      const env = ENV_BY_ZONE[zoneId];
      const info = ZONE_NAMES[env];
      if (info){
        zoneIntroEl.querySelector('h3').textContent = info.titre;
        zoneIntroEl.querySelector('p').textContent  = info.sub;
        zoneIntroEl.classList.add('show');
        clearTimeout(updateZone._t);
        updateZone._t = setTimeout(() => zoneIntroEl.classList.remove('show'), 2800);
      }
      if (progressLabel){
        progressLabel.textContent = `${zIdx + 1}/${NUM_ZONES}  ${info?.titre || ''}`.trim();
      }
    }
  }

  /* ============== SIGN PROMPT ============== */
  const signPrompt = ensureSignPrompt();
  function ensureSignPrompt(){
    let el = document.querySelector('.sign-prompt');
    if (!el){
      el = document.createElement('div');
      el.className = 'sign-prompt';
      el.textContent = 'Appuie sur E';
      document.body.appendChild(el);
    }
    return el;
  }

  /* ============== BOUCLE PRINCIPALE ============== */
  let last = performance.now();
  function loop(now){
    const dt = Math.min(0.04, (now - last) / 1000);
    last = now;

    if (!active){
      requestAnimationFrame(loop);
      return;
    }

    update(dt);
    render();
    requestAnimationFrame(loop);
  }

  function update(dt){
    // direction
    let dx = 0, dy = 0;
    if (keys.up)    dy -= 1;
    if (keys.down)  dy += 1;
    if (keys.left)  dx -= 1;
    if (keys.right) dx += 1;
    const moving = (dx !== 0 || dy !== 0);

    if (moving){
      const mag = Math.hypot(dx, dy);
      dx /= mag; dy /= mag;
      // facing prioritaire sur X si appuyé, sinon Y
      if      (dx < 0) player.facing = 'left';
      else if (dx > 0) player.facing = 'right';
      else if (dy < 0) player.facing = 'up';
      else if (dy > 0) player.facing = 'down';

      tryMove(dx * player.speed * dt, 0);
      tryMove(0, dy * player.speed * dt);

      player.walking = true;
      player.frameTime += dt;
      if (player.frameTime > 0.12){
        player.frameTime = 0;
        player.frame = (player.frame + 1) % 4;
      }
    } else {
      player.walking = false;
      player.frame = 0;
      player.frameTime = 0;
    }

    updateCamera();
    updateZone();
    updateSignsHud();

    // pancarte proche
    nearbySign = findNearbySign();
    if (nearbySign){
      signPrompt.classList.add('show');
    } else {
      signPrompt.classList.remove('show');
    }

    if (interactPressed){
      interactPressed = false;
      if (nearbySign) openSignModal(nearbySign);
    }
  }

  function render(){
    // 1) Fond global gris (zones non couvertes)
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, viewW, viewH);

    const sc = renderScale;
    const drawnW = WORLD_PX_W * sc;
    const drawnTile = TILE * sc;

    const offsetX = (viewW - drawnW) / 2;
    const offsetY = -camera.y * sc;

    // 2) Dessiner les zones (couleurs flat avec contours noirs)
    drawBiomes(offsetX, offsetY, sc);

    // 3) Dessiner le chemin courbe par-dessus les zones
    drawPath(offsetX, offsetY, sc);

    // 4) Dessiner les décorations (arbres, rochers, fleurs, eau, pancartes)
    drawDecorations(offsetX, offsetY, sc);

    // 5) Joueur
    drawPlayer(offsetX, offsetY, sc);
  }

  /* ============== RENDU ZONES (FLAT COLOR + OUTLINES) ============== */
  function drawBiomes(offsetX, offsetY, sc){
    const drawnTile = TILE * sc;
    const drawnW    = WORLD_PX_W * sc;

    // Pour chaque zone, dessiner un polygone qui occupe presque toute la largeur,
    // avec bords supérieur et inférieur ondulés (effet "île organique").
    // Bordure noire entre zones, pour un look style cell-shading / dessin animé.
    const NPTS = 22;          // nombre de points pour l'ondulation horizontale
    const WAVE_AMP = 0.5;     // amplitude de l'ondulation (en tiles)
    const ZONE_INSET = 0.4;   // marge horizontale (en tiles, pour bord interne)

    for (let z = 0; z < NUM_ZONES; z++){
      const env = ENV_BY_ZONE[PARCOURS[z]];
      const pal = PAL[env];
      const yTopWorld = z * ZONE_H * TILE;
      const yBotWorld = (z + 1) * ZONE_H * TILE;

      // Skip si la zone est hors viewport
      const yTopScreen = yTopWorld * sc + offsetY;
      const yBotScreen = yBotWorld * sc + offsetY;
      if (yBotScreen < -100 || yTopScreen > viewH + 100) continue;

      // Construire le polygone : top edge wavy → right side → bottom edge wavy → left side
      ctx.beginPath();
      // Top edge (uniquement entre zones, pas sur la première)
      if (z === 0){
        // top : ligne droite tout en haut
        ctx.moveTo(offsetX, yTopScreen);
        ctx.lineTo(offsetX + drawnW, yTopScreen);
      } else {
        // top : ondulation entre zone z-1 et z
        ctx.moveTo(offsetX, yTopScreen);
        for (let i = 1; i <= NPTS; i++){
          const t = i / NPTS;
          const wave = Math.sin(t * Math.PI * 3 + z * 1.7) * WAVE_AMP * drawnTile;
          ctx.lineTo(offsetX + t * drawnW, yTopScreen + wave);
        }
      }
      // Right side : ligne droite
      ctx.lineTo(offsetX + drawnW, yBotScreen);
      // Bottom edge (uniquement si pas la dernière zone, sinon ligne droite)
      if (z === NUM_ZONES - 1){
        ctx.lineTo(offsetX, yBotScreen);
      } else {
        for (let i = NPTS - 1; i >= 0; i--){
          const t = i / NPTS;
          const wave = Math.sin(t * Math.PI * 3 + (z + 1) * 1.7) * WAVE_AMP * drawnTile;
          ctx.lineTo(offsetX + t * drawnW, yBotScreen + wave);
        }
      }
      // Left side
      ctx.closePath();

      // Remplissage couleur principale
      ctx.fillStyle = pal.g1;
      ctx.fill();

      // Patches de couleur secondaire (taches) pour donner du relief
      drawPatches(offsetX, offsetY, sc, z, pal);

      // Contour noir épais (style cell-shading)
      ctx.strokeStyle = ZONE_OUTLINE;
      ctx.lineWidth = Math.max(2, 2 * sc);
      ctx.stroke();
    }
  }

  /* ============== PATCHES (taches plus claires/foncées dans la zone) ============== */
  function drawPatches(offsetX, offsetY, sc, zoneIdx, pal){
    const drawnTile = TILE * sc;
    const seed = zoneIdx * 73 + 11;
    const r = mulberry32(seed);
    const startY = zoneIdx * ZONE_H * TILE;
    const yScreenStart = startY * sc + offsetY;
    const ySize = ZONE_H * TILE * sc;

    ctx.save();
    // Clipper aux zones rect approximatif (pour ne pas déborder)
    ctx.beginPath();
    ctx.rect(offsetX - 4, yScreenStart - 4, WORLD_PX_W * sc + 8, ySize + 8);
    ctx.clip();

    // Quelques patches accent
    ctx.fillStyle = pal.accent;
    for (let i = 0; i < 3; i++){
      const cx = offsetX + r() * WORLD_PX_W * sc;
      const cy = yScreenStart + r() * ySize;
      const rad = (2 + r() * 3) * drawnTile;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rad * 1.3, rad * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // Quelques patches plus foncés
    ctx.fillStyle = pal.g2;
    for (let i = 0; i < 4; i++){
      const cx = offsetX + r() * WORLD_PX_W * sc;
      const cy = yScreenStart + r() * ySize;
      const rad = (1.5 + r() * 2.5) * drawnTile;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rad * 1.1, rad * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  /* ============== RENDU CHEMIN (Path2D, courbes lisses) ============== */
  function drawPath(offsetX, offsetY, sc){
    const drawnTile = TILE * sc;
    const visHeightWorld = viewH / sc;
    // Limiter au range visible pour économiser
    const yStart = Math.max(0, camera.y - TILE * 4);
    const yEnd   = Math.min(WORLD_PX_H, camera.y + visHeightWorld + TILE * 4);

    // On échantillonne pathX tous les "step" pixels world pour avoir un trace lisse
    const step = TILE / 2; // 2 points par tile
    const points = [];
    for (let y = yStart; y <= yEnd; y += step){
      const px = pathX(y / TILE) * TILE + TILE / 2;
      points.push({
        x: px * sc + offsetX,
        y: y * sc + offsetY
      });
    }
    if (points.length < 2) return;

    // Outline noir épais d'abord
    ctx.strokeStyle = PATH_OUTLINE;
    ctx.lineWidth = (4 * drawnTile) + Math.max(2, 4 * sc);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++){
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    // Marron par-dessus (légèrement plus fin)
    ctx.strokeStyle = PATH_COLOR;
    ctx.lineWidth = 4 * drawnTile;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++){
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
  }

  /* ============== RENDU DÉCOR (sprites isolés sur le sol coloré) ============== */
  // Echelle d'agrandissement par type de décor (tile id) : valeurs > 1 rendent
  // l'élément plus grand que sa case.
  // 3 = arbre/batiment/cactus/montagne, 4 = rocher/buisson, 5 = fleur,
  // 6 = eau, 7 = pancarte
  const DECO_SCALE = { 3: 2.0, 4: 1.4, 5: 1.0, 6: 1.2, 7: 1.6 };

  function drawDecorations(offsetX, offsetY, sc){
    const drawnTile = TILE * sc;
    const visHeightWorld = viewH / sc;
    // étendre la marge pour ne pas couper les gros sprites en bord d'écran
    const firstRow = Math.max(0, Math.floor(camera.y / TILE) - 2);
    const lastRow  = Math.min(MAP_H - 1, Math.ceil((camera.y + visHeightWorld) / TILE) + 2);

    // Trier par y pour avoir un ordre de rendu cohérent (les sprites du bas
    // dessinés par-dessus ceux du haut, effet de profondeur).
    // Ne rendre que les vraies decorations (id 3..7), pas les variants de sol
    // (0, 1, 8) ni le chemin (2) ni les transitions (9).
    const items = [];
    for (let y = firstRow; y <= lastRow; y++){
      for (let x = 0; x < MAP_W; x++){
        const id = map[y * MAP_W + x];
        if (id < 3 || id > 7) continue;
        items.push({ x, y, id });
      }
    }
    items.sort((a, b) => a.y - b.y);

    for (const it of items){
      const id = it.id;
      const zoneIdx = Math.floor(it.y / ZONE_H);
      const env = ENV_BY_ZONE[PARCOURS[Math.min(NUM_ZONES - 1, zoneIdx)]];
      const ts = tilesets[env];
      const sx = id * TILE;

      const k = DECO_SCALE[id] || 1;
      const dw = drawnTile * k;
      const dh = drawnTile * k;
      // ancrer le sprite par le bas centre (les arbres/maisons "poussent" du sol)
      const centerX = offsetX + (it.x + 0.5) * drawnTile;
      const baseY   = offsetY + (it.y + 1)   * drawnTile;
      const dx = Math.round(centerX - dw / 2);
      const dy = Math.round(baseY   - dh);

      ctx.drawImage(ts, sx, 0, TILE, TILE, dx, dy, dw, dh);
    }
  }

  function drawPlayer(offsetX, offsetY, sc){
    // Approche simple : on utilise UNIQUEMENT idle.png frame 0 (top-left 16x32),
    // qu'on flippe horizontalement quand le perso regarde à gauche.
    // Pendant la marche, petit "bobbing" vertical (haut-bas) pour donner du mouvement
    // sans dépendre d'un mapping de sprite sheet incertain.
    const img = (sprIdle.complete && sprIdle.naturalWidth > 0) ? sprIdle : null;
    const SCALE = 2;
    const dw = SPR_W * SCALE * sc;
    const dh = SPR_H * SCALE * sc;
    const px = player.x * sc + offsetX;
    const py = player.y * sc + offsetY;

    // bobbing vertical pendant la marche
    const bob = player.walking
      ? Math.sin(performance.now() / 90) * 2 * sc
      : Math.sin(performance.now() / 600) * 0.6 * sc;
    const dx = Math.round(px - dw/2);
    const dy = Math.round(py - dh + 4 * sc + bob);

    // ombre
    ctx.fillStyle = 'rgba(0,0,0,.4)';
    ctx.beginPath();
    ctx.ellipse(px, py - sc, dw*0.32, 4*sc, 0, 0, Math.PI*2);
    ctx.fill();

    if (img){
      const flip = (player.facing === 'left');
      if (flip){
        ctx.save();
        ctx.translate(px, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(img, 0, 0, SPR_W, SPR_H, -dw/2, dy, dw, dh);
        ctx.restore();
      } else {
        ctx.drawImage(img, 0, 0, SPR_W, SPR_H, dx, dy, dw, dh);
      }
    } else {
      ctx.fillStyle = '#ffd24a';
      ctx.fillRect(dx, dy, dw, dh);
      ctx.fillStyle = '#5b3812';
      ctx.fillRect(dx + dw*0.25, dy + dh*0.1, dw*0.5, dh*0.25);
    }
  }

  /* ============== API publique ============== */
  window.WorldEngine = {
    enter(){
      active = true;
      document.body.classList.add('in-world');
      resize();
      // spawn en haut du monde, sur le chemin
      player.x = WORLD_PX_W / 2;
      player.y = TILE * 3;
      currentZoneIdx = -1;
      updateZone();
      // hint qui s'efface après 6s
      const hint = document.getElementById('worldHint');
      if (hint){
        hint.classList.remove('fade-out');
        clearTimeout(WorldEngine._hintT);
        WorldEngine._hintT = setTimeout(() => hint.classList.add('fade-out'), 6500);
      }
    },
    leave(){
      active = false;
      document.body.classList.remove('in-world');
    },
    isActive(){ return active; }
  };

  // Auto-activation si la section world est visible
  // Utilise scroll + intersection rect pour fiabilité
  const worldSection = document.getElementById('world');

  function checkWorldVisibility(){
    if (!worldSection) return;
    const rect = worldSection.getBoundingClientRect();
    const vh = window.innerHeight;
    // World est "actif" si plus de la moitié du viewport est dans world
    const visibleTop    = Math.max(0, rect.top);
    const visibleBottom = Math.min(vh, rect.bottom);
    const visibleH      = Math.max(0, visibleBottom - visibleTop);
    const ratio         = vh > 0 ? (visibleH / vh) : 0;
    if (ratio >= 0.5){
      if (!active) window.WorldEngine.enter();
    } else {
      if (active) window.WorldEngine.leave();
    }
  }

  let scrollTimer = null;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(checkWorldVisibility, 60);
  }, { passive: true });
  window.addEventListener('resize', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(checkWorldVisibility, 100);
  }, { passive: true });

  // Vérification initiale après chargement complet
  setTimeout(checkWorldVisibility, 200);

  // Resize initial + creation des labels HTML
  resize();
  createSignLabels();
  updateSignsHud();
  requestAnimationFrame(loop);

})();
