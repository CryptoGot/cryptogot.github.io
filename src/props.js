/* =============================================================
   Fabrique de props low-poly « placeholder »
   Tout est construit à partir de primitives Three.js.
   → À terme, chaque fonction peut être remplacée par un .glb
     exporté de Blender (voir README, section assets).
============================================================= */

import * as THREE from 'three';

/** Matériau standard low-poly (flat shading). */
export function mat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    flatShading: true,
    roughness: 0.9,
    metalness: 0.0,
    ...opts
  });
}

function m(geo, material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/* ---------- Végétation ---------- */

export function pinTree(scale = 1, snowy = false) {
  const g = new THREE.Group();
  const trunk = m(new THREE.CylinderGeometry(0.16, 0.24, 0.9, 6), mat(0x7a4f27), 0, 0.45, 0);
  const leaf = snowy ? mat(0xdfe9ee) : mat(0x2f6b3c);
  const c1 = m(new THREE.ConeGeometry(1.05, 1.5, 7), leaf, 0, 1.4, 0);
  const c2 = m(new THREE.ConeGeometry(0.8, 1.2, 7), leaf, 0, 2.15, 0);
  const c3 = m(new THREE.ConeGeometry(0.55, 0.95, 7), leaf, 0, 2.85, 0);
  g.add(trunk, c1, c2, c3);
  g.scale.setScalar(scale);
  return g;
}

export function leafTree(scale = 1, tint = 0x4c9a4c) {
  const g = new THREE.Group();
  const trunk = m(new THREE.CylinderGeometry(0.18, 0.28, 1.2, 6), mat(0x8a5a2b), 0, 0.6, 0);
  const blob = m(new THREE.IcosahedronGeometry(1.05, 0), mat(tint), 0, 1.9, 0);
  blob.scale.set(1, 0.92, 1);
  const blob2 = m(new THREE.IcosahedronGeometry(0.6, 0), mat(tint), 0.55, 1.45, 0.3);
  g.add(trunk, blob, blob2);
  g.scale.setScalar(scale);
  return g;
}

export function rock(scale = 1, color = 0x9a9aa4) {
  const g = new THREE.Group();
  const r = m(new THREE.DodecahedronGeometry(0.7, 0), mat(color), 0, 0.35, 0);
  r.scale.set(1, 0.72, 1);
  r.rotation.y = Math.random() * Math.PI;
  g.add(r);
  g.scale.setScalar(scale);
  return g;
}

export function cactus(scale = 1) {
  const g = new THREE.Group();
  const green = mat(0x3f8f4f);
  const body = m(new THREE.CylinderGeometry(0.32, 0.36, 1.9, 8), green, 0, 0.95, 0);
  const arm = m(new THREE.CylinderGeometry(0.18, 0.2, 0.8, 8), green, 0.5, 1.15, 0);
  arm.rotation.z = -0.5;
  const arm2 = m(new THREE.CylinderGeometry(0.16, 0.18, 0.6, 8), green, -0.45, 0.9, 0);
  arm2.rotation.z = 0.55;
  g.add(body, arm, arm2);
  g.scale.setScalar(scale);
  return g;
}

export function palmTree(scale = 1) {
  const g = new THREE.Group();
  const trunkMat = mat(0xa9713a);
  for (let i = 0; i < 4; i++) {
    const seg = m(new THREE.CylinderGeometry(0.14 - i * 0.015, 0.17 - i * 0.015, 0.62, 6), trunkMat, i * 0.14, 0.3 + i * 0.58, 0);
    seg.rotation.z = -0.12 * (i + 1);
    g.add(seg);
  }
  const leafMat = mat(0x3f9a4f);
  for (let i = 0; i < 5; i++) {
    const leaf = m(new THREE.ConeGeometry(0.16, 1.5, 4), leafMat, 0.62, 2.62, 0);
    leaf.rotation.z = Math.PI / 2.35;
    leaf.rotation.y = (i / 5) * Math.PI * 2;
    leaf.translateY(-0.35);
    g.add(leaf);
  }
  g.scale.setScalar(scale);
  return g;
}

export function cattail(scale = 1) {
  const g = new THREE.Group();
  const stem = m(new THREE.CylinderGeometry(0.03, 0.04, 1.1, 5), mat(0x5f7a3a), 0, 0.55, 0);
  const top = m(new THREE.CylinderGeometry(0.09, 0.09, 0.4, 6), mat(0x6b4a2b), 0, 1.2, 0);
  g.add(stem, top);
  g.scale.setScalar(scale);
  return g;
}

export function pond(scale = 1) {
  const g = new THREE.Group();
  const water = m(new THREE.CylinderGeometry(1.6, 1.6, 0.08, 16), mat(0x4aa3df, { roughness: 0.35 }), 0, 0.04, 0);
  water.receiveShadow = true;
  water.castShadow = false;
  const pad = m(new THREE.CylinderGeometry(0.42, 0.42, 0.05, 7), mat(0x3f8f4f), 0.5, 0.1, 0.3);
  const pad2 = m(new THREE.CylinderGeometry(0.3, 0.3, 0.05, 7), mat(0x4c9a4c), -0.55, 0.1, -0.25);
  pad.castShadow = pad2.castShadow = false;
  g.add(water, pad, pad2);
  g.scale.setScalar(scale);
  return g;
}

/* ---------- Structures ---------- */

export function building(scale = 1, height = 3, color = 0x8fa3b8) {
  const g = new THREE.Group();
  const body = m(new THREE.BoxGeometry(1.6, height, 1.6), mat(color), 0, height / 2, 0);
  const roof = m(new THREE.BoxGeometry(1.75, 0.18, 1.75), mat(0x5a6a7a), 0, height + 0.09, 0);
  const winMat = mat(0xfff2b8, { emissive: 0xffdf6b, emissiveIntensity: 0.55 });
  for (let fy = 0; fy < Math.floor(height) ; fy++) {
    for (let fx = -1; fx <= 1; fx += 2) {
      const w = m(new THREE.BoxGeometry(0.32, 0.4, 0.06), winMat, fx * 0.42, 0.75 + fy * 0.85, 0.81);
      w.castShadow = false;
      g.add(w);
    }
  }
  g.add(body, roof);
  g.scale.setScalar(scale);
  return g;
}

export function arcadeCabinet(scale = 1, color = 0xd14b8f) {
  const g = new THREE.Group();
  const body = m(new THREE.BoxGeometry(0.9, 1.6, 0.8), mat(color), 0, 0.8, 0);
  const screen = m(new THREE.BoxGeometry(0.62, 0.5, 0.06), mat(0x74e6ff, { emissive: 0x39c5e8, emissiveIntensity: 0.8 }), 0, 1.12, 0.41);
  screen.castShadow = false;
  const panel = m(new THREE.BoxGeometry(0.7, 0.1, 0.3), mat(0x2a2a3a), 0, 0.72, 0.45);
  panel.rotation.x = -0.35;
  const btn1 = m(new THREE.CylinderGeometry(0.05, 0.05, 0.05, 8), mat(0xffd166), 0.12, 0.79, 0.5);
  const btn2 = m(new THREE.CylinderGeometry(0.05, 0.05, 0.05, 8), mat(0x4ecb71), -0.12, 0.79, 0.5);
  g.add(body, screen, panel, btn1, btn2);
  g.scale.setScalar(scale);
  return g;
}

export function mountainPeak(scale = 1) {
  const g = new THREE.Group();
  const base = m(new THREE.ConeGeometry(2.2, 3.4, 6), mat(0x8b8b98), 0, 1.7, 0);
  const cap = m(new THREE.ConeGeometry(0.85, 1.25, 6), mat(0xf2f5f7), 0, 2.85, 0);
  g.add(base, cap);
  g.rotation.y = Math.random() * Math.PI;
  g.scale.setScalar(scale);
  return g;
}

export function snowman(scale = 1) {
  const g = new THREE.Group();
  const white = mat(0xf5f8fa);
  const b1 = m(new THREE.IcosahedronGeometry(0.55, 1), white, 0, 0.5, 0);
  const b2 = m(new THREE.IcosahedronGeometry(0.38, 1), white, 0, 1.25, 0);
  const nose = m(new THREE.ConeGeometry(0.07, 0.35, 6), mat(0xff8f3c), 0, 1.3, 0.4);
  nose.rotation.x = Math.PI / 2;
  const e1 = m(new THREE.SphereGeometry(0.045, 6, 6), mat(0x222222), 0.13, 1.42, 0.31);
  const e2 = m(new THREE.SphereGeometry(0.045, 6, 6), mat(0x222222), -0.13, 1.42, 0.31);
  e1.castShadow = e2.castShadow = nose.castShadow = false;
  g.add(b1, b2, nose, e1, e2);
  g.scale.setScalar(scale);
  return g;
}

export function pyramid(scale = 1) {
  const g = new THREE.Group();
  const p = m(new THREE.ConeGeometry(1.6, 1.8, 4), mat(0xdcbf7e), 0, 0.9, 0);
  p.rotation.y = Math.PI / 4;
  g.add(p);
  g.scale.setScalar(scale);
  return g;
}

export function obelisk(scale = 1) {
  const g = new THREE.Group();
  const col = m(new THREE.CylinderGeometry(0.28, 0.4, 2.2, 4), mat(0x3a4a6a), 0, 1.1, 0);
  const orb = m(new THREE.IcosahedronGeometry(0.32, 0), mat(0x74e6ff, { emissive: 0x39c5e8, emissiveIntensity: 1.2 }), 0, 2.55, 0);
  orb.castShadow = false;
  orb.userData.float = true; // animé dans World
  g.add(col, orb);
  g.scale.setScalar(scale);
  return g;
}

export function pcTower(scale = 1) {
  const g = new THREE.Group();
  const box = m(new THREE.BoxGeometry(0.7, 1.3, 1.1), mat(0x3a3a44), 0, 0.65, 0);
  const face = m(new THREE.BoxGeometry(0.72, 1.1, 0.08), mat(0x2a2a32), 0, 0.7, 0.52);
  const led = m(new THREE.BoxGeometry(0.5, 0.06, 0.04), mat(0x4ecb71, { emissive: 0x4ecb71, emissiveIntensity: 1.4 }), 0, 1.05, 0.56);
  const fan = m(new THREE.CylinderGeometry(0.22, 0.22, 0.05, 12), mat(0x74e6ff, { emissive: 0x2a8fb8, emissiveIntensity: 0.7 }), 0, 0.5, 0.55);
  fan.rotation.x = Math.PI / 2;
  led.castShadow = fan.castShadow = false;
  g.add(box, face, led, fan);
  g.scale.setScalar(scale);
  return g;
}

export function chip(scale = 1) {
  const g = new THREE.Group();
  const body = m(new THREE.BoxGeometry(1.1, 0.22, 1.1), mat(0x2f7a4f), 0, 0.4, 0);
  const core = m(new THREE.BoxGeometry(0.45, 0.26, 0.45), mat(0xffd166, { emissive: 0xd6a020, emissiveIntensity: 0.5 }), 0, 0.44, 0);
  for (let i = -1; i <= 1; i++) {
    for (const s of [-1, 1]) {
      const pin = m(new THREE.BoxGeometry(0.08, 0.3, 0.08), mat(0xc9c9d4), i * 0.35, 0.15, s * 0.62);
      pin.castShadow = false;
      g.add(pin);
      const pin2 = m(new THREE.BoxGeometry(0.08, 0.3, 0.08), mat(0xc9c9d4), s * 0.62, 0.15, i * 0.35);
      pin2.castShadow = false;
      g.add(pin2);
    }
  }
  g.add(body, core);
  g.scale.setScalar(scale);
  return g;
}

/* ---------- Interactifs ---------- */

export function treasureChest() {
  const g = new THREE.Group();
  const wood = mat(0x8a5a2b);
  const base = m(new THREE.BoxGeometry(1.35, 0.75, 0.95), wood, 0, 0.38, 0);
  const lid = m(new THREE.BoxGeometry(1.42, 0.5, 1.02), mat(0x9a6a35), 0, 0.95, 0);
  const band = m(new THREE.BoxGeometry(0.22, 1.28, 1.06), mat(0xd9a441, { metalness: 0.35, roughness: 0.5 }), 0, 0.62, 0);
  const lock = m(new THREE.BoxGeometry(0.3, 0.3, 0.12), mat(0xffd166, { metalness: 0.4, roughness: 0.4 }), 0, 0.62, 0.52);
  g.add(base, lid, band, lock);
  return g;
}

/** Anneau lumineux pulsant posé au sol (affordance d'interaction). */
export function glowRing(color = 0xffd166) {
  const glow = new THREE.Mesh(
    new THREE.CylinderGeometry(1.15, 1.15, 0.06, 24),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.4 })
  );
  glow.position.y = 0.03;
  glow.userData.pulse = true; // animé dans World
  return glow;
}

export function signpost(accent = 0xc9995c) {
  const g = new THREE.Group();
  const post = m(new THREE.CylinderGeometry(0.09, 0.11, 1.5, 6), mat(0x7a4f27), 0, 0.75, 0);
  const panel = m(new THREE.BoxGeometry(1.5, 0.85, 0.12), mat(accent), 0, 1.55, 0);
  const rim = m(new THREE.BoxGeometry(1.62, 0.97, 0.08), mat(0x6b431f), 0, 1.55, -0.03);
  g.add(post, rim, panel);
  return g;
}

export function flag(color = 0xffb703) {
  const g = new THREE.Group();
  const pole = m(new THREE.CylinderGeometry(0.05, 0.07, 2.4, 6), mat(0x7a4f27), 0, 1.2, 0);
  const banner = m(new THREE.BoxGeometry(1.05, 0.6, 0.05), mat(color), 0.55, 2, 0);
  const knob = m(new THREE.IcosahedronGeometry(0.09, 0), mat(0xffd166), 0, 2.45, 0);
  g.add(pole, banner, knob);
  return g;
}

export function cloud(scale = 1) {
  const g = new THREE.Group();
  const white = new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true, roughness: 1 });
  const s1 = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 0), white);
  const s2 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.8, 0), white);
  const s3 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7, 0), white);
  s2.position.set(1.1, -0.15, 0.2);
  s3.position.set(-1.05, -0.1, -0.15);
  [s1, s2, s3].forEach((s) => { s.scale.y = 0.62; g.add(s); });
  g.scale.setScalar(scale);
  return g;
}
