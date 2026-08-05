# Portfolio 3D — Aurélien Lannoye

Portfolio interactif en 3D : une île low-poly explorable où chaque biome présente un domaine (Game Dev, IA, Web, 3D…). Construit avec **Three.js + Vite**, déployé sur **GitHub Pages**.

## Développement

```bash
npm install       # première fois
npm run dev       # serveur de dev → http://localhost:5173
npm run build     # build de production dans dist/
npm run preview   # prévisualiser le build
```

## Structure

```
index.html          UI HTML par-dessus le canvas (intro, menu, modales)
src/
  main.js           Assemble tout (boucle, interactions, téléportation)
  Experience.js     Renderer, scène, caméra, lumières
  World.js          L'île : terrain peint par sommet, biomes, pancartes, coffres
  Player.js         Personnage + déplacement + animation procédurale
  Input.js          Clavier (ZQSD/WASD/flèches) + joystick tactile
  props.js          Props low-poly en primitives (PLACEHOLDERS à remplacer)
  zones.js          Position/couleur/biome des 8 zones
  content.js        Tout le contenu texte (projets, liens, images)
  ui.js             Modales, menu rapide, lightbox
  style.css         Styles de l'UI
public/
  assets/           Images de preuves + futurs modèles 3D
  docs/             CV (PDF)
```

## Générer les assets : images concept → Meshy → .glb

1. **Générer les images concept** (une par asset, style cohérent, fond transparent) :

```bash
$env:OPENAI_API_KEY='sk-...' ; node tools/generate-concepts.mjs
```

   → PNG dans `meshy-concepts/` (dossier gitignoré, la clé n'est jamais écrite sur disque).

2. **Dans Meshy** : *Image to 3D* → uploader le PNG → générer → exporter en **.glb**
   et déposer les fichiers bruts dans `Assets3D/` (dossier gitignoré).
3. **Optimiser** (simplification du maillage + compression meshopt + textures réduites) :

```bash
node tools/optimize-models.mjs ; node tools/shrink-textures.mjs
```

   → sortie légère dans `public/assets/models/<id>.glb` (mapping des noms dans
   `tools/optimize-models.mjs`).
4. C'est tout : au chargement du site, `src/ModelLibrary.js` télécharge chaque `.glb`
   et **remplace automatiquement le placeholder** correspondant (slots dans `World.js`).
   Un modèle absent = le placeholder procédural reste affiché. La planète Meshy devient
   le vrai sol : sa surface est échantillonnée par raycast (grille de hauteurs) pour y
   poser le joueur et les props. Le personnage (`perso.glb`) est animé via ses clips
   Meshy (`Casual_Walk` en marche, pose figée à l'arrêt).

Tailles cibles et orientation de chaque modèle : catalogue `MODELS` dans `src/ModelLibrary.js`.

## Remplacer les placeholders par mes assets Blender

Les props actuels (`src/props.js`) sont des primitives Three.js. Pour les remplacer :

1. **Dans Blender** : modéliser en low-poly, appliquer échelle/rotation (`Ctrl+A`),
   origine au sol au centre du modèle, **1 unité Blender = 1 mètre** (le perso fait ~1,9 m).
2. **Exporter en glTF** : `File → Export → glTF 2.0 (.glb)`, cocher *Apply Modifiers*.
   Déposer le fichier dans `public/assets/models/`.
3. **Charger dans le code** avec `GLTFLoader` :

```js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.load('/assets/models/sapin.glb', (gltf) => {
  const model = gltf.scene;
  model.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  scene.add(model);
});
```

4. Remplacer la fonction correspondante dans `props.js` (ex. `pinTree()`) par le chargement
   du modèle — le reste du monde (placement, interactions) ne change pas.

Conseils perf : < 2 000 triangles par prop, textures 512 px max (ou juste des couleurs de
matériaux, comme maintenant), pas de lumières dans les exports.

## Déploiement

Le workflow `.github/workflows/deploy.yml` build et déploie automatiquement sur GitHub Pages
à chaque push sur `main`. Prérequis (une seule fois) : dans les settings du repo →
**Pages → Source → GitHub Actions**.

L'ancien site 2D reste disponible dans l'historique git (branche `main` avant fusion).
