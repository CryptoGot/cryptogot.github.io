/* =============================================================
   World — la petite planète et son espace
   Démarre avec des placeholders procéduraux ; chaque modèle
   Meshy (ModelLibrary) remplace le sien dès qu'il est chargé.
   La planète Meshy devient le vrai sol : une grille de hauteurs
   est construite par raycast pour y poser joueur et props.
============================================================= */

import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import {
  ZONES, PLANET_RADIUS, POLE, SOUTH_POLE,
  dirFromLatLon, tangentToward, arbitraryTangent, angleBetween
} from './zones.js';
import * as P from './props.js';
import { models } from './ModelLibrary.js';

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function smoothstep(a, b, x) {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

/* Grille de hauteurs échantillonnée sur la planète Meshy */
const GRID_LON = 128;
const GRID_LAT = 64;

export class World {
  constructor(scene) {
    this.scene = scene;
    this.radius = PLANET_RADIUS;
    this.interactables = [];
    this.pulses = [];
    this.floaters = [];
    this.bursts = [];
    this.rings = [];
    this.meteor = null;

    /* Slots de remplacement : { slot, modelId, variant } */
    this.swappables = [];
    /* Objets posés sur la planète : { obj, dir, facing, yaw } */
    this.placed = [];
    /* Grille de hauteurs (une fois la planète Meshy prête) */
    this.heightGrid = null;
    this.onGroundChanged = null;
    this.camN = new THREE.Vector3(0, 1, 0);

    this.buildPlanet();
    this.buildSpace();
    this.buildPlaza();
    this.buildZones();
    this.buildSouthPole();
    this.setupSwaps();
  }

  /* ================= Relief ================= */

  /** Rayon du terrain dans la direction `dir`. */
  heightAt(dir) {
    if (this.heightGrid) return this.gridHeight(dir);

    const x = dir.x, y = dir.y, z = dir.z;
    const n1 = Math.sin(x * 4.1 + 1.7) * Math.sin(y * 3.7 + 2.3) * Math.sin(z * 4.4 + 3.1);
    const n2 = Math.sin(x * 8.3 + 0.5) * Math.sin(y * 7.9 + 1.2) * Math.sin(z * 8.7 + 2.6);
    let bump = 0.022 * n1 + 0.011 * n2;
    const aN = angleBetween(dir, POLE);
    const aS = angleBetween(dir, SOUTH_POLE);
    bump *= smoothstep(7, 18, aN) * smoothstep(4, 10, aS);
    return this.radius * (1 + bump);
  }

  gridHeight(dir) {
    const g = this.heightGrid;
    const lat = Math.asin(THREE.MathUtils.clamp(dir.y, -1, 1));
    let lon = Math.atan2(dir.x, -dir.z);
    if (lon < 0) lon += Math.PI * 2;

    const v = (lat / Math.PI + 0.5) * (GRID_LAT - 1);
    const u = (lon / (Math.PI * 2)) * GRID_LON;
    const v0 = Math.floor(v);
    const u0 = Math.floor(u) % GRID_LON;
    const v1 = Math.min(v0 + 1, GRID_LAT - 1);
    const u1 = (u0 + 1) % GRID_LON;
    const fv = v - v0;
    const fu = u - Math.floor(u);

    const h00 = g[v0 * GRID_LON + u0];
    const h01 = g[v0 * GRID_LON + u1];
    const h10 = g[v1 * GRID_LON + u0];
    const h11 = g[v1 * GRID_LON + u1];
    return (h00 * (1 - fu) + h01 * fu) * (1 - fv) + (h10 * (1 - fu) + h11 * fu) * fv;
  }

  surfacePoint(dir, lift = 0) {
    return dir.clone().normalize().multiplyScalar(this.heightAt(dir) + lift);
  }

  surfaceQuaternion(dir, facing = null) {
    const up = dir.clone().normalize();
    const fwd = facing ? tangentToward(up, facing) : arbitraryTangent(up);
    const right = new THREE.Vector3().crossVectors(up, fwd);
    return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(right, up, fwd));
  }

  /* Pose `obj` sur la planète (matrice figée) et l'enregistre pour re-placement. */
  placeOnPlanet(obj, dir, facing = null, yaw = 0) {
    obj.position.copy(this.surfacePoint(dir));
    obj.quaternion.copy(this.surfaceQuaternion(dir, facing));
    if (yaw) obj.rotateY(yaw);
    obj.updateMatrix();
    obj.matrixAutoUpdate = false; // statique : pas de recalcul par frame
    this.placed.push({ obj, dir: dir.clone().normalize(), facing, yaw });
  }

  /* ================= Remplacement par les modèles Meshy ================= */

  /** Crée un slot : contenu placeholder remplacé par `modelId` quand dispo. */
  makeSlot(modelId, placeholder = null, variant = 1) {
    const slot = new THREE.Group();
    if (placeholder) slot.add(placeholder);
    if (modelId) this.swappables.push({ slot, modelId, variant });
    return slot;
  }

  setupSwaps() {
    const ids = [...new Set(this.swappables.map((s) => s.modelId))];
    for (const id of ids) {
      models.onReady(id, () => this.applySwap(id));
    }
    models.onReady('planete', (entry) => this.beginPlanetSwap(entry));
  }

  applySwap(id) {
    for (const s of this.swappables) {
      if (s.modelId !== id) continue;
      // retire les animations liées aux enfants du placeholder
      this.floaters = this.floaters.filter((f) => !this.isInside(f, s.slot));
      s.slot.clear();
      const inst = models.instance(id);
      if (!inst) continue;
      inst.scale.multiplyScalar(s.variant);
      s.slot.add(inst);
    }
  }

  isInside(obj, root) {
    let p = obj;
    while (p) {
      if (p === root) return true;
      p = p.parent;
    }
    return false;
  }

  /* ================= La planète ================= */

  buildPlanet() {
    const geo = new THREE.IcosahedronGeometry(this.radius, 5);
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);

    const cGrass = new THREE.Color(0x8fca6f);
    const cPath = new THREE.Color(0xe6d8b0);
    const cSnowCap = new THREE.Color(0xeef4f7);
    const c = new THREE.Color();
    const zc = new THREE.Color();
    const v = new THREE.Vector3();

    const zoneDirs = ZONES.map((z) => ({ zone: z, dir: dirFromLatLon(z.lat, z.lon) }));

    for (let i = 0; i < pos.count; i++) {
      v.set(pos.getX(i), pos.getY(i), pos.getZ(i)).normalize();
      const h = this.heightAt(v);
      pos.setXYZ(i, v.x * h, v.y * h, v.z * h);

      c.copy(cGrass);
      for (const { zone, dir } of zoneDirs) {
        const ang = angleBetween(v, dir);
        const w = Math.exp(-((ang / 21) ** 2));
        if (w > 0.02) {
          zc.setHex(zone.couleurSol);
          c.lerp(zc, Math.min(w, 0.96));
        }
      }
      const aN = angleBetween(v, POLE);
      c.lerp(cPath, 1 - smoothstep(8, 16, aN));
      const aS = angleBetween(v, SOUTH_POLE);
      c.lerp(cSnowCap, 1 - smoothstep(5, 11, aS));

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();

    this.planet = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1 })
    );
    this.planet.receiveShadow = true;
    this.scene.add(this.planet);

    // Halo d'atmosphère
    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius * 1.4, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x6fb7ff, transparent: true, opacity: 0.07,
        side: THREE.BackSide, depthWrite: false
      })
    );
    this.scene.add(atmo);
  }

  /**
   * La planète Meshy est chargée : sa surface est échantillonnée en
   * lisant directement les sommets du maillage (aucun raycast, instantané).
   */
  beginPlanetSwap(entry) {
    const container = entry.container;
    container.updateMatrixWorld(true);

    const cells = GRID_LON * GRID_LAT;
    const grid = new Float32Array(cells);
    const wsum = new Float32Array(cells);
    const v = new THREE.Vector3();

    container.traverse((o) => {
      if (!o.isMesh) return;
      const pos = o.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld);
        const h = v.length();
        if (h < 1e-3) continue;
        const lat = Math.asin(THREE.MathUtils.clamp(v.y / h, -1, 1));
        let lon = Math.atan2(v.x, -v.z);
        if (lon < 0) lon += Math.PI * 2;
        const gv = (lat / Math.PI + 0.5) * (GRID_LAT - 1);
        const gu = (lon / (Math.PI * 2)) * GRID_LON;
        const v0 = Math.floor(gv);
        const u0 = Math.floor(gu) % GRID_LON;
        const v1 = Math.min(v0 + 1, GRID_LAT - 1);
        const u1 = (u0 + 1) % GRID_LON;
        const fv = gv - v0;
        const fu = gu - Math.floor(gu);
        // splat bilinéaire dans les 4 cellules voisines
        let idx = v0 * GRID_LON + u0; let w = (1 - fv) * (1 - fu);
        grid[idx] += h * w; wsum[idx] += w;
        idx = v0 * GRID_LON + u1; w = (1 - fv) * fu;
        grid[idx] += h * w; wsum[idx] += w;
        idx = v1 * GRID_LON + u0; w = fv * (1 - fu);
        grid[idx] += h * w; wsum[idx] += w;
        idx = v1 * GRID_LON + u1; w = fv * fu;
        grid[idx] += h * w; wsum[idx] += w;
      }
    });

    for (let i = 0; i < cells; i++) {
      grid[i] = wsum[i] > 1e-6 ? grid[i] / wsum[i] : 0;
    }

    // Bouche les trous par diffusion des voisins
    for (let pass = 0; pass < 12; pass++) {
      let holes = 0;
      for (let r = 0; r < GRID_LAT; r++) {
        for (let c = 0; c < GRID_LON; c++) {
          const i = r * GRID_LON + c;
          if (grid[i] > 0) continue;
          let sum = 0;
          let n = 0;
          const neigh = [
            r * GRID_LON + ((c + 1) % GRID_LON),
            r * GRID_LON + ((c - 1 + GRID_LON) % GRID_LON),
            Math.min(r + 1, GRID_LAT - 1) * GRID_LON + c,
            Math.max(r - 1, 0) * GRID_LON + c
          ];
          for (const j of neigh) {
            if (grid[j] > 0) { sum += grid[j]; n++; }
          }
          if (n) grid[i] = sum / n;
          else holes++;
        }
      }
      if (!holes) break;
    }
    for (let i = 0; i < cells; i++) {
      if (grid[i] <= 0) grid[i] = this.radius;
    }

    this.heightGrid = grid;

    // Échange visuel : le sol Meshy remplace la sphère procédurale
    this.scene.remove(this.planet);
    container.traverse((o) => {
      if (o.isMesh) {
        o.receiveShadow = true;
        o.castShadow = false;
      }
    });
    this.scene.add(container);

    // Tout ce qui est posé est re-projeté sur la vraie surface
    for (const p of this.placed) {
      p.obj.position.copy(this.surfacePoint(p.dir));
      p.obj.quaternion.copy(this.surfaceQuaternion(p.dir, p.facing));
      if (p.yaw) p.obj.rotateY(p.yaw);
      p.obj.updateMatrix();
    }
    for (const it of this.interactables) {
      it.pos.copy(it.group.position);
    }

    this.onGroundChanged?.();
  }

  /* ================= L'espace autour ================= */

  buildSpace() {
    const rand = mulberry32(777);

    // Étoiles
    const starCount = 1700;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const d = new THREE.Vector3(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1).normalize()
        .multiplyScalar(330 + rand() * 220);
      starPos[i * 3] = d.x;
      starPos[i * 3 + 1] = d.y;
      starPos[i * 3 + 2] = d.z;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
      color: 0xdfe8ff, size: 2.6, sizeAttenuation: true, transparent: true, opacity: 0.9
    }));
    this.scene.add(stars);

    // Lune en orbite (slot → lune.glb)
    this.moonPivot = new THREE.Group();
    this.moonPivot.rotation.z = 0.35;
    const moonPh = new THREE.Group();
    const moonBody = new THREE.Mesh(new THREE.IcosahedronGeometry(1.9, 1), P.mat(0xb8bcc9));
    const moonCrater = new THREE.Mesh(new THREE.IcosahedronGeometry(0.4, 0), P.mat(0x9a9eab));
    moonCrater.position.set(0.9, 0.9, 0.5);
    moonPh.add(moonBody, moonCrater);
    const moonSlot = this.makeSlot('lune', moonPh);
    moonSlot.position.set(44, 0, 0);
    this.moonPivot.add(moonSlot);
    this.scene.add(this.moonPivot);

    // Géante gazeuse (slot → planete-anneaux.glb)
    const giantPh = new THREE.Group();
    const giant = new THREE.Mesh(new THREE.IcosahedronGeometry(15, 2), P.mat(0xc98f6a, { roughness: 0.8 }));
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(24, 2.6, 2, 60),
      P.mat(0xe8c9a0, { transparent: true, opacity: 0.85 })
    );
    ring.rotation.x = Math.PI / 2.25;
    ring.scale.z = 0.18;
    giantPh.add(giant, ring);
    this.gasGiant = this.makeSlot('planete-anneaux', giantPh);
    this.gasGiant.position.set(150, 70, -220);
    this.scene.add(this.gasGiant);

    const teal = new THREE.Mesh(new THREE.IcosahedronGeometry(8, 2), P.mat(0x5fb8a8));
    teal.position.set(-230, -50, 140);
    this.scene.add(teal);
  }

  /* ================= Place polaire ================= */

  buildPlaza() {
    const chests = [
      { id: 'projet', nom: 'Projet pro', emoji: '🎯', lon: 0, glow: 0xffd166 },
      { id: 'forces', nom: 'Mes forces', emoji: '💪', lon: -50, glow: 0x4ecb71 },
      { id: 'faiblesses', nom: 'Axes de progression', emoji: '🌱', lon: 50, glow: 0xff8f3c }
    ];
    for (const cfg of chests) {
      const dir = dirFromLatLon(76, cfg.lon);
      const wrapper = new THREE.Group();
      wrapper.add(this.makeSlot('coffre', P.treasureChest()));

      const glow = P.glowRing(cfg.glow);
      this.pulses.push(glow);
      wrapper.add(glow);

      const label = this.makeLabel(`${cfg.emoji} ${cfg.nom}`, 'zone-label small');
      label.position.set(0, 2.1, 0);
      wrapper.add(label);

      this.placeOnPlanet(wrapper, dir, POLE);
      this.scene.add(wrapper);

      this.interactables.push({
        type: 'chest', id: cfg.id, nom: cfg.nom, emoji: cfg.emoji,
        group: wrapper, pos: wrapper.position.clone(), radius: 3.2
      });
    }

    // Lampadaire doré (asset Meshy bonus) derrière le cratère
    const lampDir = dirFromLatLon(74, 180);
    const lamp = this.makeSlot('lampe');
    this.placeOnPlanet(lamp, lampDir, POLE);
    this.scene.add(lamp);
  }

  /* ================= Les 8 zones ================= */

  buildZones() {
    for (let zi = 0; zi < ZONES.length; zi++) {
      const zone = ZONES[zi];
      const rand = mulberry32(1000 + zi * 77);
      const zoneDir = dirFromLatLon(zone.lat, zone.lon);

      const wrapper = new THREE.Group();
      wrapper.add(this.makeSlot('pancarte', P.signpost(zone.accent)));

      const label = this.makeLabel(`<span class="zl-emoji">${zone.emoji}</span>${zone.nom}`, 'zone-label');
      label.position.set(0, 2.75, 0);
      wrapper.add(label);

      this.placeOnPlanet(wrapper, zoneDir, POLE);
      this.scene.add(wrapper);

      this.interactables.push({
        type: 'zone', id: zone.id, nom: zone.nom, emoji: zone.emoji,
        group: wrapper, pos: wrapper.position.clone(), radius: 4.5
      });

      this.scatterProps(zone, zoneDir, rand);
    }
  }

  scatterProps(zone, zoneDir, rand) {
    /* [placeholder, modelId, variante d'échelle] */
    const props = [];
    const add = (ph, modelId, variant = 1) => props.push({ ph, modelId, variant });

    switch (zone.biome) {
      case 'plaine':
        add(P.arcadeCabinet(1.25, 0xd14b8f), 'borne-arcade', 1.25);
        add(P.arcadeCabinet(1.1, 0x5a67d8), 'borne-arcade', 1.1);
        add(P.arcadeCabinet(1.15, 0x38a169), 'borne-arcade', 1.15);
        add(P.leafTree(1.1), 'arbre-feuillu', 1.1);
        add(P.leafTree(0.9, 0x5fae52), 'arbre-feuillu', 0.9);
        add(P.rock(0.8, 0xa8b088), 'rocher', 0.8);
        break;
      case 'desert':
        add(P.pyramid(1.9), 'pyramide', 1.9);
        add(P.obelisk(1.2), 'obelisque', 1.2);
        add(P.obelisk(1), 'obelisque', 1);
        add(P.cactus(1.1), 'cactus', 1.1);
        add(P.cactus(0.85), 'cactus', 0.85);
        add(P.cactus(1.25), 'cactus', 1.25);
        add(P.rock(0.9, 0xcbb083), 'rocher', 0.9);
        break;
      case 'neige':
        add(P.pinTree(1.3, true), 'sapin-neige', 1.3);
        add(P.pinTree(1, true), 'sapin-neige', 1);
        add(P.pinTree(0.85, true), 'sapin-neige', 0.85);
        add(P.pinTree(1.15, true), 'sapin-neige', 1.15);
        add(P.snowman(1.05), 'bonhomme-neige', 1.05);
        add(P.rock(0.9, 0xdfe6ea), 'rocher', 0.9);
        break;
      case 'plage':
        add(P.palmTree(1.3), 'palmier', 1.3);
        add(P.palmTree(1.1), 'palmier', 1.1);
        add(P.palmTree(0.95), 'palmier', 0.95);
        add(P.pond(1.1), null);
        add(P.rock(1, 0xd8c9a4), 'rocher', 1);
        add(P.rock(0.7, 0xc9b98f), 'rocher', 0.7);
        break;
      case 'ville':
        add(P.building(1.1, 3.2, 0x8fa3b8), 'immeuble', 1.1);
        add(P.building(0.95, 2.6, 0xa8b8c8), 'immeuble', 0.95);
        add(P.building(0.9, 3.8, 0x7a90a8), 'immeuble', 1.2);
        add(P.building(0.85, 2.2, 0x98a8ba), 'immeuble', 0.85);
        add(P.leafTree(0.8), 'arbre-feuillu', 0.8);
        break;
      case 'marais':
        add(P.pond(1.25), null);
        add(P.pond(0.9), null);
        add(P.chip(1.15), 'puce-electronique', 1.15);
        add(P.chip(0.85), 'puce-electronique', 0.85);
        add(P.cattail(1.1), 'quenouilles', 1.1);
        add(P.cattail(0.9), 'quenouilles', 0.9);
        add(P.cattail(1.2), 'quenouilles', 1.2);
        add(P.leafTree(0.95, 0x557a45), 'arbre-feuillu', 0.95);
        break;
      case 'montagne':
        add(P.mountainPeak(1.5), 'montagne', 1.5);
        add(P.mountainPeak(1.05), 'montagne', 1.05);
        add(P.pcTower(1.2), 'tour-pc', 1.2);
        add(P.pcTower(0.95), 'tour-pc', 0.95);
        add(P.rock(1.2), 'rocher', 1.2);
        add(P.rock(0.8), 'rocher', 0.8);
        add(P.rock(1), 'rocher', 1);
        break;
      case 'foret':
        add(P.pinTree(1.4), 'sapin', 1.4);
        add(P.pinTree(1.1), 'sapin', 1.1);
        add(P.pinTree(0.9), 'sapin', 0.9);
        add(P.pinTree(1.25), 'sapin', 1.25);
        add(P.leafTree(1.2), 'arbre-feuillu', 1.2);
        add(P.leafTree(0.95), 'arbre-feuillu', 0.95);
        add(P.rock(0.85, 0x8a9a84), 'rocher', 0.85);
        break;
    }

    const baseTangent = arbitraryTangent(zoneDir);
    for (const { ph, modelId, variant } of props) {
      const angle = (5 + rand() * 9) * (Math.PI / 180);
      const azimut = rand() * Math.PI * 2;
      const axis = baseTangent.clone().applyAxisAngle(zoneDir, azimut);
      const dirP = zoneDir.clone().applyQuaternion(new THREE.Quaternion().setFromAxisAngle(axis, angle));

      const slot = this.makeSlot(modelId, ph, variant);
      this.placeOnPlanet(slot, dirP, null, rand() * Math.PI * 2);
      this.scene.add(slot);

      slot.traverse((o) => {
        if (o.userData.float) {
          o.userData.baseY = o.position.y;
          this.floaters.push(o);
        }
      });
    }
  }

  /* ================= Pôle Sud ================= */

  buildSouthPole() {
    const flag = P.flag(0xffb703);
    const label = this.makeLabel('🐧 Pôle Sud — tu as fait le tour !', 'zone-label small');
    label.position.set(0, 2.6, 0);
    flag.add(label);
    this.placeOnPlanet(flag, SOUTH_POLE.clone(), dirFromLatLon(-60, 0));
    this.scene.add(flag);

    const snDir = dirFromLatLon(-81, 40);
    const sn = this.makeSlot('bonhomme-neige', P.snowman(0.9), 0.9);
    this.placeOnPlanet(sn, snDir, SOUTH_POLE);
    this.scene.add(sn);
  }

  /* ================= Météorite d'intro ================= */

  spawnMeteor() {
    const impact = this.surfacePoint(POLE);
    const side = new THREE.Vector3(1, 0, 0.4).normalize();
    this.meteorStart = impact.clone().addScaledVector(POLE, 46).addScaledVector(side, 52);
    this.meteorEnd = impact;

    const g = new THREE.Group();
    const meshyMeteor = models.instance('meteorite');
    const core = meshyMeteor ?? new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.95, 0),
      new THREE.MeshStandardMaterial({
        color: 0x5a4a3a, emissive: 0xff6a1f, emissiveIntensity: 1.6,
        flatShading: true, roughness: 0.7
      })
    );
    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.5, 0),
      new THREE.MeshBasicMaterial({ color: 0xffa040, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    const light = new THREE.PointLight(0xff9a3c, 60, 60, 1.6);
    g.add(core, shell, light);
    g.position.copy(this.meteorStart);
    this.scene.add(g);
    this.meteor = { group: g, core };

    this.trail = [];
    for (let i = 0; i < 10; i++) {
      const s = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.75 - i * 0.06, 0),
        new THREE.MeshBasicMaterial({
          color: i < 4 ? 0xffc37a : 0xff8a4a,
          transparent: true, opacity: 0.5 - i * 0.045,
          blending: THREE.AdditiveBlending, depthWrite: false
        })
      );
      s.position.copy(this.meteorStart);
      this.scene.add(s);
      this.trail.push(s);
    }
  }

  setMeteorAt(k) {
    if (!this.meteor) return;
    const e = k * k;
    this.meteor.group.position.lerpVectors(this.meteorStart, this.meteorEnd, e);
    this.meteor.core.rotation.x += 0.2;
    this.meteor.core.rotation.y += 0.31;
  }

  updateTrail() {
    if (!this.trail || !this.meteor) return;
    for (let i = this.trail.length - 1; i > 0; i--) {
      this.trail[i].position.lerp(this.trail[i - 1].position, 0.55);
    }
    this.trail[0].position.lerp(this.meteor.group.position, 0.75);
  }

  impact() {
    const point = this.meteorEnd.clone();
    const up = POLE.clone();

    if (this.meteor) {
      this.scene.remove(this.meteor.group);
      this.meteor = null;
    }
    if (this.trail) {
      for (const s of this.trail) this.scene.remove(s);
      this.trail = null;
    }

    // Particules d'explosion
    const count = 90;
    const positions = new Float32Array(count * 3);
    const vels = [];
    const tang1 = arbitraryTangent(up);
    const tang2 = new THREE.Vector3().crossVectors(up, tang1);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
      const a = Math.random() * Math.PI * 2;
      const vUp = 3 + Math.random() * 9;
      const vSide = 2 + Math.random() * 7;
      vels.push(new THREE.Vector3()
        .addScaledVector(up, vUp)
        .addScaledVector(tang1, Math.cos(a) * vSide)
        .addScaledVector(tang2, Math.sin(a) * vSide));
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xffc37a, size: 0.55, transparent: true, opacity: 1,
      blending: THREE.AdditiveBlending, depthWrite: false
    });
    const points = new THREE.Points(geo, mat);
    this.scene.add(points);
    this.bursts.push({ points, vels, life: 1.1, maxLife: 1.1 });

    this.spawnRing(point, up, 0xffe9c9, 0.65, 10);
    this.spawnRing(point, up, 0xc9a26a, 1.0, 7);
    this.buildCrater(up);

    return point;
  }

  spawnRing(point, up, color, dur, endScale) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.7, 1.05, 42),
      new THREE.MeshBasicMaterial({
        color, transparent: true, opacity: 0.85,
        side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false
      })
    );
    ring.position.copy(point).addScaledVector(up, 0.12);
    ring.quaternion.copy(this.surfaceQuaternion(up));
    ring.rotateX(-Math.PI / 2);
    this.scene.add(ring);
    this.rings.push({ ring, life: dur, maxLife: dur, endScale });
  }

  buildCrater(up) {
    const crater = new THREE.Group();

    const floor = new THREE.Mesh(new THREE.CircleGeometry(2.9, 26), P.mat(0x59493c));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0.06;
    floor.receiveShadow = true;

    const rim = new THREE.Mesh(new THREE.TorusGeometry(2.9, 0.4, 7, 26), P.mat(0x6e5a45));
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.12;
    rim.scale.z = 0.5;
    rim.castShadow = true;

    const glow = new THREE.Mesh(
      new THREE.RingGeometry(1.0, 1.8, 26),
      new THREE.MeshBasicMaterial({
        color: 0xff8a3c, transparent: true, opacity: 0.5,
        blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
      })
    );
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = 0.1;
    glow.userData.pulse = true;
    this.pulses.push(glow);

    const rand = mulberry32(99);
    for (let i = 0; i < 6; i++) {
      const r = P.rock(0.3 + rand() * 0.35, 0x6e5a45);
      const a = rand() * Math.PI * 2;
      r.position.set(Math.cos(a) * (3.1 + rand()), 0.05, Math.sin(a) * (3.1 + rand()));
      crater.add(r);
    }

    crater.add(floor, rim, glow);
    this.placeOnPlanet(crater, up);
    this.scene.add(crater);
  }

  /* ================= Divers ================= */

  makeLabel(html, className) {
    const div = document.createElement('div');
    div.className = className;
    div.innerHTML = html;
    return new CSS2DObject(div);
  }

  getNearest(playerPos) {
    let best = null;
    let bestD = Infinity;
    for (const it of this.interactables) {
      const d = playerPos.distanceTo(it.pos);
      if (d < it.radius && d < bestD) {
        bestD = d;
        best = it;
      }
    }
    return best;
  }

  update(dt, t, camera = null) {
    // Cache l'hémisphère de la planète opposé à la caméra (gros gain GPU)
    if (camera) {
      this.camN.copy(camera.position).normalize();
      for (const p of this.placed) {
        p.obj.visible = p.dir.dot(this.camN) > -0.18;
      }
    }

    this.moonPivot.rotation.y += dt * 0.14;
    this.gasGiant.rotation.y += dt * 0.03;

    this.updateTrail();

    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const b = this.bursts[i];
      b.life -= dt;
      if (b.life <= 0) {
        this.scene.remove(b.points);
        this.bursts.splice(i, 1);
        continue;
      }
      const posAttr = b.points.geometry.attributes.position;
      const center = new THREE.Vector3();
      for (let j = 0; j < b.vels.length; j++) {
        const vel = b.vels[j];
        center.set(posAttr.getX(j), posAttr.getY(j), posAttr.getZ(j));
        vel.addScaledVector(center.clone().normalize(), -9 * dt);
        posAttr.setXYZ(j, center.x + vel.x * dt, center.y + vel.y * dt, center.z + vel.z * dt);
      }
      posAttr.needsUpdate = true;
      b.points.material.opacity = Math.max(b.life / b.maxLife, 0);
    }

    for (let i = this.rings.length - 1; i >= 0; i--) {
      const r = this.rings[i];
      r.life -= dt;
      if (r.life <= 0) {
        this.scene.remove(r.ring);
        this.rings.splice(i, 1);
        continue;
      }
      const k = 1 - r.life / r.maxLife;
      const s = 1 + k * r.endScale;
      r.ring.scale.set(s, s, 1);
      r.ring.material.opacity = 0.85 * (1 - k);
    }

    for (const g of this.pulses) {
      const s = 1 + Math.sin(t * 3) * 0.08;
      g.scale.setScalar(s);
      g.material.opacity = 0.3 + (Math.sin(t * 3) * 0.5 + 0.5) * 0.25;
    }

    for (const f of this.floaters) {
      f.position.y = f.userData.baseY + Math.sin(t * 2 + f.id) * 0.14;
      f.rotation.y += dt * 1.2;
    }
  }
}
