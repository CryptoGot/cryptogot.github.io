/* =============================================================
   Player — le petit robot, version planète sphérique
   Il marche sur la sphère : sa position est une direction
   unitaire × la hauteur du terrain, son « haut » est radial.
============================================================= */

import * as THREE from 'three';
import { mat } from './props.js';
import { tangentToward, arbitraryTangent } from './zones.js';
import { models } from './ModelLibrary.js';

const SPEED = 7.5; // vitesse d'arc (unités/s)

export class Player {
  constructor(scene, world) {
    this.world = world;
    this.group = new THREE.Group();
    this.dir = new THREE.Vector3(0, 1, 0);          // direction radiale (pôle Nord)
    this.forward = new THREE.Vector3(0, 0, -1);     // tangente, sens du regard
    this.speed = 0;
    this.animT = 0;
    this.spawnT = -1; // -1 = pas en cours ; >=0 = anim d'apparition
    this.mixer = null;

    this.buildBody();
    scene.add(this.group);
    this.applyTransform();

    // Le vrai personnage (Meshy, riggé) remplace le robot dès qu'il est chargé
    models.onReady('perso', (entry) => this.attachModel(entry));
  }

  /** Remplace le robot placeholder par le personnage animé. */
  attachModel(entry) {
    this.body.clear();
    const model = entry.container; // un seul joueur → on utilise le template directement
    this.body.add(model);

    this.mixer = new THREE.AnimationMixer(model);
    const clips = entry.animations;
    // « marche détente » demandée : Casual_Walk (sinon premier clip de marche)
    const walkClip =
      clips.find((c) => /casual[_ ]?walk/i.test(c.name)) ??
      clips.find((c) => /walk/i.test(c.name)) ??
      clips[0];
    if (!walkClip) return;

    this.walkAction = this.mixer.clipAction(walkClip);
    this.walkAction.play();

    // Pose figée (1re frame de la marche) comme idle — évite le T-pose
    const idleClip = THREE.AnimationUtils.subclip(walkClip, 'IdlePose', 0, 1, 30);
    this.idleAction = this.mixer.clipAction(idleClip);
    this.idleAction.play();
  }

  buildBody() {
    const cream = mat(0xf3efe4);
    const dark = mat(0x2b3244);

    this.body = new THREE.Group();
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.62, 0.5), cream);
    torso.position.y = 0.72;
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.5, 0.54), cream);
    head.position.y = 1.32;
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.24, 0.08), mat(0x1d2433, { roughness: 0.4 }));
    visor.position.set(0, 1.34, 0.29);
    const eyeMat = mat(0x74e6ff, { emissive: 0x39c5e8, emissiveIntensity: 1.6 });
    const eye1 = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.03), eyeMat);
    eye1.position.set(-0.11, 1.34, 0.34);
    const eye2 = eye1.clone();
    eye2.position.x = 0.11;
    const antRod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.3, 5), dark);
    antRod.position.y = 1.72;
    this.antBall = new THREE.Mesh(new THREE.IcosahedronGeometry(0.07, 0), mat(0xffb703, { emissive: 0xd6a020, emissiveIntensity: 0.8 }));
    this.antBall.position.y = 1.9;
    const pack = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.42, 0.2), mat(0xff8f3c));
    pack.position.set(0, 0.78, -0.34);
    this.body.add(torso, head, visor, eye1, eye2, antRod, this.antBall, pack);

    this.armL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.5, 0.18), cream);
    this.armL.geometry.translate(0, -0.2, 0);
    this.armL.position.set(-0.5, 0.9, 0);
    this.armR = this.armL.clone();
    this.armR.position.x = 0.5;

    this.legL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.42, 0.26), dark);
    this.legL.geometry.translate(0, -0.18, 0);
    this.legL.position.set(-0.18, 0.42, 0);
    this.legR = this.legL.clone();
    this.legR.position.x = 0.18;

    this.body.add(this.armL, this.armR, this.legL, this.legR);
    this.body.traverse((o) => { if (o.isMesh) o.castShadow = true; });

    // Ombre douce « fake » sous les pieds (lisibilité)
    const blob = new THREE.Mesh(
      new THREE.CircleGeometry(0.5, 20),
      new THREE.MeshBasicMaterial({ color: 0x1d2433, transparent: true, opacity: 0.22 })
    );
    blob.rotation.x = -Math.PI / 2;
    blob.position.y = 0.03;

    this.group.add(this.body, blob);
  }

  get position() {
    return this.group.position;
  }
  get up() {
    return this.dir;
  }

  /** Place le joueur sur `dir` (direction unitaire), regard vers `facing` (direction unitaire). */
  teleport(dir, facing = null) {
    this.dir.copy(dir).normalize();
    this.forward.copy(facing ? tangentToward(this.dir, facing) : arbitraryTangent(this.dir));
    this.applyTransform();
  }

  /** Anim d'apparition (après l'impact météorite). */
  playSpawn() {
    this.group.visible = true;
    this.spawnT = 0;
    this.group.scale.setScalar(0.01);
  }

  applyTransform() {
    const h = this.world.heightAt(this.dir);
    this.group.position.copy(this.dir).multiplyScalar(h);

    // Base orthonormée : X = droite, Y = up radial, Z = regard
    const upVector = this.dir;
    const fwd = this.forward.clone().projectOnPlane(upVector).normalize();
    if (fwd.lengthSq() < 1e-8) fwd.copy(arbitraryTangent(upVector));
    this.forward.copy(fwd);
    const right = new THREE.Vector3().crossVectors(upVector, fwd);
    const basis = new THREE.Matrix4().makeBasis(right, upVector, fwd);
    this.group.quaternion.setFromRotationMatrix(basis);
  }

  /**
   * @param {number} dt
   * @param {THREE.Vector3|null} moveWorld — direction tangente désirée (longueur 0..1)
   */
  update(dt, moveWorld) {
    const moving = moveWorld && moveWorld.lengthSq() > 0.003;

    if (moving) {
      const step = (SPEED * dt) / this.world.radius; // angle parcouru
      this.dir.addScaledVector(moveWorld, step).normalize();

      // Regard : glisse vers la direction de déplacement
      const wanted = moveWorld.clone().normalize();
      this.forward.lerp(wanted, Math.min(dt * 10, 1));
      this.speed = Math.min(this.speed + dt * 6, 1);
    } else {
      this.speed = Math.max(this.speed - dt * 8, 0);
    }

    this.applyTransform();

    // Anim d'apparition
    if (this.spawnT >= 0) {
      this.spawnT += dt;
      const k = Math.min(this.spawnT / 0.55, 1);
      // petit overshoot élastique
      const s = k < 1 ? 1 + (Math.sin(k * Math.PI * 2.2) * (1 - k) * 0.35) : 1;
      this.group.scale.setScalar(0.01 + (s - 0.01) * k);
      if (k >= 1) {
        this.group.scale.setScalar(1);
        this.spawnT = -1;
      }
    }

    this.animT += dt * (this.speed > 0.05 ? 11 : 2.4);

    if (this.mixer) {
      // Personnage Meshy : mélange marche ↔ pose figée selon la vitesse
      this.walkAction.setEffectiveWeight(this.speed);
      this.idleAction.setEffectiveWeight(1 - this.speed);
      this.walkAction.timeScale = 0.75 + this.speed * 0.55;
      this.mixer.update(dt);
      // légère respiration à l'arrêt
      this.body.position.y = Math.sin(this.animT) * 0.012 * (1 - this.speed);
    } else {
      // Robot placeholder : animation procédurale
      const s = Math.sin(this.animT);
      const walk = this.speed;
      this.armL.rotation.x = s * 0.9 * walk;
      this.armR.rotation.x = -s * 0.9 * walk;
      this.legL.rotation.x = -s * 0.95 * walk;
      this.legR.rotation.x = s * 0.95 * walk;
      this.body.position.y = walk > 0.05
        ? Math.abs(Math.sin(this.animT)) * 0.09 * walk
        : Math.sin(this.animT) * 0.025;
      this.antBall.position.x = Math.sin(this.animT * 0.7) * 0.03;
    }
  }
}
