/* =============================================================
   Configuration des 8 zones sur la petite planète
   Chaque zone occupe une calotte autour d'un point (lat, lon).
   Le pôle Nord est la place d'atterrissage (cratère + coffres).
============================================================= */

import * as THREE from 'three';

export const PLANET_RADIUS = 20;

export const ZONES = [
  { id: 'gamedev',      nom: 'Game Dev',      emoji: '🎮', lat: 32,  lon: 0,   biome: 'plaine',   couleurSol: 0x8ec963, accent: 0x7eb84a },
  { id: 'ia',           nom: 'IA & Agents',   emoji: '🤖', lat: 32,  lon: 90,  biome: 'desert',   couleurSol: 0xe8cd8a, accent: 0xd2a854 },
  { id: 'site',         nom: 'Web & SaaS',    emoji: '🌐', lat: 32,  lon: 180, biome: 'neige',    couleurSol: 0xeef4f7, accent: 0x9fc8e8 },
  { id: 'securite',     nom: 'Cybersécurité', emoji: '🔐', lat: 32,  lon: 270, biome: 'plage',    couleurSol: 0xf0dfa4, accent: 0xe0c060 },
  { id: 'app',          nom: 'App mobile',    emoji: '📱', lat: -32, lon: 45,  biome: 'ville',    couleurSol: 0xb9c0c9, accent: 0x5a7a9a },
  { id: 'electronique', nom: 'Électronique',  emoji: '⚡', lat: -32, lon: 135, biome: 'marais',   couleurSol: 0x7d9155, accent: 0x5a6a3a },
  { id: 'hardware',     nom: 'Hardware',      emoji: '🔧', lat: -32, lon: 225, biome: 'montagne', couleurSol: 0xa8a8b4, accent: 0x7a7a8a },
  { id: 'design3d',     nom: '3D Design',     emoji: '🌲', lat: -32, lon: 315, biome: 'foret',    couleurSol: 0x63a058, accent: 0x3a7a3a }
];

/** Direction unitaire (Vector3) depuis (latitude, longitude) en degrés. */
export function dirFromLatLon(lat, lon) {
  const la = (lat * Math.PI) / 180;
  const lo = (lon * Math.PI) / 180;
  return new THREE.Vector3(
    Math.cos(la) * Math.sin(lo),
    Math.sin(la),
    -Math.cos(la) * Math.cos(lo)
  );
}

export const POLE = new THREE.Vector3(0, 1, 0);
export const SOUTH_POLE = new THREE.Vector3(0, -1, 0);

/** Tangente unitaire en `dir` pointant vers `toward` (projeté sur le plan tangent). */
export function tangentToward(dir, toward) {
  const t = toward.clone().projectOnPlane(dir);
  return t.lengthSq() < 1e-8 ? arbitraryTangent(dir) : t.normalize();
}

export function arbitraryTangent(dir) {
  const ref = Math.abs(dir.y) < 0.95 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
  return ref.clone().projectOnPlane(dir).normalize();
}

/** Fait glisser `dir` d'un angle (degrés) en direction de `toward`, sur le grand cercle. */
export function slideOnSphere(dir, toward, angleDeg) {
  const axis = new THREE.Vector3().crossVectors(dir, tangentToward(dir, toward));
  if (axis.lengthSq() < 1e-8) return dir.clone();
  axis.normalize();
  const q = new THREE.Quaternion().setFromAxisAngle(axis, (angleDeg * Math.PI) / 180);
  return dir.clone().applyQuaternion(q).normalize();
}

/** Angle en degrés entre deux directions unitaires. */
export function angleBetween(a, b) {
  return (Math.acos(THREE.MathUtils.clamp(a.dot(b), -1, 1)) * 180) / Math.PI;
}

export function zoneById(id) {
  return ZONES.find((z) => z.id === id);
}
