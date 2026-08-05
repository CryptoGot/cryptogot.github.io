/* =============================================================
   ModelLibrary — charge les .glb Meshy en arrière-plan et les
   normalise (échelle, origine). Le monde démarre avec les
   placeholders et chaque modèle remplace le sien dès qu'il
   est prêt (progressive enhancement, zéro écran de chargement).
============================================================= */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { clone as cloneSkeleton } from 'three/addons/utils/SkeletonUtils.js';

/**
 * Catalogue : id → { height: taille cible (unités monde),
 *                    normalize: 'ground' (origine aux pieds) | 'center',
 *                    rotateY: correction d'orientation éventuelle }
 */
export const MODELS = {
  perso: { height: 1.9, normalize: 'ground' },
  sapin: { height: 3.4, normalize: 'ground' },
  'sapin-neige': { height: 3.4, normalize: 'ground' },
  'arbre-feuillu': { height: 2.9, normalize: 'ground' },
  rocher: { height: 0.9, normalize: 'ground' },
  palmier: { height: 3.3, normalize: 'ground' },
  quenouilles: { height: 1.5, normalize: 'ground' },
  'bonhomme-neige': { height: 1.7, normalize: 'ground' },
  pyramide: { height: 2.6, normalize: 'ground' },
  'borne-arcade': { height: 1.8, normalize: 'ground' },
  'tour-pc': { height: 1.5, normalize: 'ground' },
  obelisque: { height: 3.1, normalize: 'ground' },
  coffre: { height: 1.15, normalize: 'ground' },
  lampe: { height: 2.6, normalize: 'ground' },
  pancarte: { height: 2.2, normalize: 'ground' },
  cactus: { height: 2.1, normalize: 'ground' },
  montagne: { height: 4.8, normalize: 'ground' },
  immeuble: { height: 3.6, normalize: 'ground' },
  'puce-electronique': { height: 0.7, normalize: 'ground' },
  meteorite: { height: 2.0, normalize: 'center' },
  lune: { height: 3.8, normalize: 'center' },
  'planete-anneaux': { height: 26, normalize: 'center' },
  planete: { height: 40, normalize: 'center' } // diamètre = 2 × PLANET_RADIUS
};

export class ModelLibrary {
  constructor() {
    this.loader = new GLTFLoader();
    this.loader.setMeshoptDecoder(MeshoptDecoder);
    this.entries = new Map(); // id → { template, animations }
    this.listeners = new Map(); // id → [cb]
  }

  /** Charge tous les modèles du catalogue (ceux présents sur le serveur). */
  loadAll() {
    for (const id of Object.keys(MODELS)) this.load(id);
  }

  load(id) {
    const cfg = MODELS[id];
    if (!cfg || this.entries.has(id)) return;
    this.loader.load(
      `/assets/models/${id}.glb`,
      (gltf) => {
        const entry = this.prepare(id, cfg, gltf);
        this.entries.set(id, entry);
        for (const cb of this.listeners.get(id) ?? []) cb(entry);
        this.listeners.delete(id);
      },
      undefined,
      () => { /* modèle absent → on garde le placeholder, silencieux */ }
    );
  }

  prepare(id, cfg, gltf) {
    const root = gltf.scene;
    root.updateMatrixWorld(true);

    // Mesure et normalisation : échelle cible + origine
    const box = new THREE.Box3().setFromObject(root);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const scale = cfg.height / (size.y || 1);

    const container = new THREE.Group();
    container.add(root);
    root.scale.setScalar(scale);
    if (cfg.rotateY) root.rotation.y = cfg.rotateY;

    if (cfg.normalize === 'center') {
      root.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    } else {
      // origine aux pieds, centrée en X/Z
      root.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
    }

    container.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        if (o.material) {
          o.material.roughness = Math.min(o.material.roughness ?? 1, 0.95);
        }
      }
    });

    return { id, container, animations: gltf.animations ?? [], skinned: !!gltf.scene.getObjectByProperty('isSkinnedMesh', true) };
  }

  /** Rappelle `cb(entry)` dès que le modèle est dispo (tout de suite s'il l'est déjà). */
  onReady(id, cb) {
    const entry = this.entries.get(id);
    if (entry) {
      cb(entry);
      return;
    }
    if (!this.listeners.has(id)) this.listeners.set(id, []);
    this.listeners.get(id).push(cb);
  }

  /** Clone prêt à poser (SkeletonUtils pour les modèles riggés). */
  instance(id) {
    const entry = this.entries.get(id);
    if (!entry) return null;
    const c = entry.skinned ? cloneSkeleton(entry.container) : entry.container.clone();
    return c;
  }
}

export const models = new ModelLibrary();
