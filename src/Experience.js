/* =============================================================
   Experience — renderer, scène spatiale, caméra, lumières
   La caméra suit le joueur autour de la planète (up radial).
============================================================= */

import * as THREE from 'three';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';

export class Experience {
  constructor(container, labelContainer, panelContainer) {
    this.container = container;

    // --- Scène : l'espace ---
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x070b1a);

    // --- Caméra ---
    this.camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, 0.1, 900);
    this.camera.position.set(0, 22, 62);
    this.camUp = new THREE.Vector3(0, 1, 0);

    // --- Renderer ---
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    container.appendChild(this.renderer.domElement);

    // --- Labels HTML (CSS2D) ---
    this.labelRenderer = new CSS2DRenderer({ element: labelContainer });
    this.labelRenderer.setSize(innerWidth, innerHeight);

    // --- Hologrammes HTML (CSS3D, scène séparée) ---
    this.panelScene = new THREE.Scene();
    this.panelRenderer = new CSS3DRenderer({ element: panelContainer });
    this.panelRenderer.setSize(innerWidth, innerHeight);

    // --- Lumières : un « soleil » qui éclaire toujours la face visible ---
    this.ambient = new THREE.AmbientLight(0x6272a8, 0.6);
    this.scene.add(this.ambient);

    this.sun = new THREE.DirectionalLight(0xfff2d8, 2.2);
    this.sun.position.set(50, 74, 58); // éclaire le pôle pendant l'orbite d'intro
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024, 1024);
    const sc = this.sun.shadow.camera;
    sc.left = sc.bottom = -30;
    sc.right = sc.top = 30;
    sc.near = 2;
    sc.far = 140;
    this.sun.shadow.bias = -0.0005;
    this.sun.shadow.normalBias = 0.03;
    this.sunTarget = new THREE.Object3D();
    this.scene.add(this.sunTarget);
    this.sun.target = this.sunTarget;
    this.scene.add(this.sun);

    // --- Secousses caméra ---
    this.shakeAmp = 0;
    this.shakeTime = 0;
    this.shakeDur = 1;

    // --- Boucle ---
    this.clock = new THREE.Clock();
    this.updatables = [];

    addEventListener('resize', () => this.onResize());
  }

  onResize() {
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(innerWidth, innerHeight);
    this.labelRenderer.setSize(innerWidth, innerHeight);
    this.panelRenderer.setSize(innerWidth, innerHeight);
  }

  /** Le soleil suit le joueur pour que la face visible soit toujours éclairée. */
  updateSun(playerPos, up, right, forward) {
    this.sun.position.copy(playerPos)
      .addScaledVector(up, 36)
      .addScaledVector(right, 22)
      .addScaledVector(forward, 9);
    this.sunTarget.position.copy(playerPos);
  }

  shake(amp = 0.6, dur = 0.55) {
    this.shakeAmp = amp;
    this.shakeTime = dur;
    this.shakeDur = dur;
  }

  /** Caméra 3e personne sur la sphère : derrière et au-dessus du joueur. */
  followPlayer(playerPos, up, forward, dt, snap = false) {
    const wanted = playerPos.clone().addScaledVector(up, 8.5).addScaledVector(forward, -13);
    if (snap) {
      this.camera.position.copy(wanted);
      this.camUp.copy(up);
    } else {
      const k = 1 - Math.pow(0.002, dt);
      this.camera.position.lerp(wanted, k);
      this.camUp.lerp(up, k).normalize();
    }
    this.camera.up.copy(this.camUp);
    const look = playerPos.clone().addScaledVector(up, 2.2);
    this.camera.lookAt(look);
  }

  applyShake(dt) {
    if (this.shakeTime <= 0) return;
    this.shakeTime -= dt;
    const f = Math.max(this.shakeTime, 0) / this.shakeDur;
    const a = this.shakeAmp * f * f;
    this.camera.position.x += (Math.random() - 0.5) * a;
    this.camera.position.y += (Math.random() - 0.5) * a;
    this.camera.position.z += (Math.random() - 0.5) * a;
  }

  onUpdate(fn) {
    this.updatables.push(fn);
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      const dt = Math.min(this.clock.getDelta(), 0.05);
      const t = this.clock.elapsedTime;
      for (const fn of this.updatables) fn(dt, t);
      this.applyShake(dt);
      this.renderer.render(this.scene, this.camera);
      this.labelRenderer.render(this.scene, this.camera);
      this.panelRenderer.render(this.panelScene, this.camera);
    });
  }
}
