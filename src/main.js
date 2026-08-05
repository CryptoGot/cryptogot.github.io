/* =============================================================
   main — assemble tout
   États : 'orbit' (titre dans l'espace, planète en contrebas)
         → 'landing' (le titre/météorite s'écrase sur la planète)
         → 'play' (on contrôle le personnage)
   En mode play, examiner un domaine bascule la caméra vers le
   ciel : les infos flottent dans l'espace (SpaceView).
============================================================= */

import './style.css';
import * as THREE from 'three';
import { Experience } from './Experience.js';
import { World } from './World.js';
import { Player } from './Player.js';
import { Input } from './Input.js';
import { UI } from './ui.js';
import { SpaceView } from './SpaceView.js';
import { models } from './ModelLibrary.js';
import { zoneById, dirFromLatLon, slideOnSphere, POLE } from './zones.js';

const app = document.getElementById('app');
const labels = document.getElementById('labels');
const panels = document.getElementById('panels');

const xp = new Experience(app, labels, panels);
const world = new World(xp.scene);
const player = new Player(xp.scene, world);
const input = new Input();
const ui = new UI();
const spaceView = new SpaceView(xp, ui);

// Charge les modèles Meshy en arrière-plan (remplacement progressif)
models.loadAll();
world.onGroundChanged = () => {
  if (mode === 'play' && !spaceView.active) snapCamera = true;
};

// Le personnage arrive avec la météorite : caché au début
player.group.visible = false;
player.teleport(POLE.clone(), dirFromLatLon(0, 0));

let mode = 'orbit'; // 'orbit' | 'landing' | 'play'
let landingT = 0;
const LAND_DUR = 1.4;
let camStart = null;
let camEndPos = null;
let camEndLook = null;
let nearest = null;
let snapCamera = false;

// Direction caméra lissée (évite les demi-tours brusques)
const camFwd = player.forward.clone();
const tmpV = new THREE.Vector3();
const tmpV2 = new THREE.Vector3();
const tmpLook = new THREE.Vector3();

// Instantané de la caméra « au sol » pendant la vue spatiale
const snapPos = new THREE.Vector3();
const snapLook = new THREE.Vector3();
const snapUp = new THREE.Vector3(0, 1, 0);

/* ---------------- Décollage / atterrissage ---------------- */

function startLanding() {
  if (mode !== 'orbit') return;
  mode = 'landing';
  landingT = 0;
  world.spawnMeteor();
  ui.launchIntro();

  camStart = xp.camera.position.clone();
  const playerPos = world.surfacePoint(POLE);
  camEndPos = playerPos.clone().addScaledVector(POLE, 8.5).addScaledVector(player.forward, -13);
  camEndLook = playerPos.clone().addScaledVector(POLE, 2.2);
}

function doImpact() {
  world.impact();
  xp.shake(1.1, 0.7);
  ui.flash();
  player.playSpawn();
  ui.setPlaying();
  mode = 'play';
  input.enabled = true;
  snapCamera = true;
}

document.getElementById('intro').addEventListener('click', startLanding);
addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'Enter') startLanding();
});

/* ---------------- Vue spatiale (infos des domaines) ---------------- */

/** Mémorise la config caméra « au sol » du point actuel du joueur. */
function snapshotFollowCam() {
  snapPos.copy(player.position).addScaledVector(player.up, 8.5).addScaledVector(camFwd, -13);
  snapLook.copy(player.position).addScaledVector(player.up, 2.2);
  snapUp.copy(player.up);
}

function openSpace(type, id) {
  if (mode !== 'play') return;
  if (!spaceView.active) {
    // On part de là où la caméra est vraiment (transition sans à-coup)
    snapPos.copy(xp.camera.position);
    snapLook.copy(player.position).addScaledVector(player.up, 2.2);
    snapUp.copy(xp.camera.up);
  }
  spaceView.open(type, id, player.position.clone(), player.up.clone(), camFwd.clone());
  ui.hidePrompt();
}

spaceView.onChange = (open) => {
  input.enabled = !open && mode === 'play';
};

ui.onTeleport = (id) => {
  if (mode !== 'play') return;
  const zone = zoneById(id);
  if (!zone) return;
  const zoneDir = dirFromLatLon(zone.lat, zone.lon);
  const standDir = slideOnSphere(zoneDir, POLE, 5); // 5° avant la pancarte
  player.teleport(standDir, zoneDir);
  camFwd.copy(player.forward);
  snapshotFollowCam(); // au retour des étoiles, on redescendra ici
  snapCamera = true;
  spaceView.open('zone', id, player.position.clone(), player.up.clone(), camFwd.clone());
  ui.hidePrompt();
};

ui.onOpenAbout = (id) => openSpace('chest', id);

/* ---------------- Interactions ---------------- */

function tryInteract() {
  if (spaceView.isOpen || mode !== 'play') return;
  if (nearest) openSpace(nearest.type, nearest.id);
}

input.onInteract = tryInteract;
input.onToggleHelp = () => ui.toggleHelp();
document.getElementById('actionBtn').addEventListener('click', tryInteract);

// M : change le style de marche du perso (pour choisir sa préférée)
addEventListener('keydown', (e) => {
  if (e.code !== 'KeyM' || e.repeat || mode !== 'play' || spaceView.isOpen) return;
  const name = player.cycleWalk();
  if (name) ui.toast(`🚶 Marche : ${name}`);
});

/* Clic direct sur une pancarte ou un coffre */
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let downAt = null;

xp.renderer.domElement.addEventListener('pointerdown', (e) => {
  downAt = { x: e.clientX, y: e.clientY };
});
xp.renderer.domElement.addEventListener('pointerup', (e) => {
  if (!downAt || Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 8) return;
  if (spaceView.isOpen || mode !== 'play') return;
  pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  raycaster.setFromCamera(pointer, xp.camera);
  const groups = world.interactables.map((it) => it.group);
  const hits = raycaster.intersectObjects(groups, true);
  if (!hits.length) return;
  let obj = hits[0].object;
  while (obj && !groups.includes(obj)) obj = obj.parent;
  const it = world.interactables.find((i) => i.group === obj);
  if (it) openSpace(it.type, it.id);
});

/* ---------------- Boucle principale ---------------- */

let wasSpaceActive = false;

xp.onUpdate((dt, t) => {
  world.update(dt, t, xp.camera);
  spaceView.update(dt, t);

  // Fin de la redescente : on resynchronise la caméra de suivi
  if (wasSpaceActive && !spaceView.active) {
    xp.camUp.copy(snapUp);
    xp.camera.up.copy(snapUp);
  }
  wasSpaceActive = spaceView.active;

  if (mode === 'orbit') {
    const a = t * 0.07;
    xp.camera.position.set(Math.sin(a) * 66, 24, Math.cos(a) * 66);
    xp.camera.up.set(0, 1, 0);
    xp.camera.lookAt(0, 0, 0);
    return;
  }

  if (mode === 'landing') {
    landingT += dt;
    const k = Math.min(landingT / LAND_DUR, 1);
    world.setMeteorAt(k);

    const e = k * k * (3 - 2 * k); // smoothstep
    xp.camera.position.lerpVectors(camStart, camEndPos, e);
    tmpV.set(0, 0, 0).lerp(camEndLook, e);
    xp.camera.up.set(0, 1, 0);
    xp.camera.lookAt(tmpV);

    if (k >= 1) doImpact();
    return;
  }

  // --- mode 'play' ---
  if (spaceView.active) {
    // Tête levée vers les étoiles : caméra mélangée sol ↔ ciel
    player.update(dt, null); // le perso respire pendant qu'on lit
    const e = spaceView.eased;
    xp.camera.position.lerpVectors(snapPos, spaceView.camPos, e);
    tmpLook.lerpVectors(snapLook, spaceView.lookPos, e);
    tmpV.lerpVectors(snapUp, spaceView.upVec, e).normalize();
    xp.camera.up.copy(tmpV);
    xp.camera.lookAt(tmpLook);
  } else {
    const mv = input.getMove();
    let moveWorld = null;
    if (mv.x !== 0 || mv.z !== 0) {
      const up = player.up;
      xp.camera.getWorldDirection(tmpV);
      tmpV.projectOnPlane(up);
      if (tmpV.lengthSq() < 1e-6) tmpV.copy(player.forward);
      tmpV.normalize(); // avant écran
      tmpV2.crossVectors(tmpV, up).normalize(); // droite écran
      moveWorld = new THREE.Vector3()
        .addScaledVector(tmpV, -mv.z)
        .addScaledVector(tmpV2, mv.x);
      if (moveWorld.lengthSq() > 1) moveWorld.normalize();
    }

    player.update(dt, moveWorld);

    // Caméra : suit une direction lissée (pas de demi-tour brutal)
    const kf = 1 - Math.pow(0.25, dt);
    camFwd.lerp(player.forward, kf).projectOnPlane(player.up);
    if (camFwd.lengthSq() < 1e-6) camFwd.copy(player.forward);
    camFwd.normalize();
    xp.followPlayer(player.position, player.up, camFwd, dt, snapCamera);
    snapCamera = false;
  }

  // Soleil au-dessus du joueur
  tmpV2.crossVectors(player.up, camFwd).normalize();
  xp.updateSun(player.position, player.up, tmpV2, camFwd);

  // Proximité pancartes / coffres
  const near = !spaceView.active ? world.getNearest(player.position) : null;
  if (near !== nearest) {
    nearest = near;
    if (nearest) ui.showPrompt(nearest);
    else ui.hidePrompt();
  }
});

xp.start();
