/* =============================================================
   Input — clavier (ZQSD/WASD/flèches) + joystick tactile
   e.code est basé sur la position physique : KeyW = Z sur AZERTY,
   donc ZQSD et WASD marchent tous les deux sans détection de layout.
============================================================= */

export class Input {
  constructor() {
    this.enabled = false;
    this.keys = new Set();
    this.joy = { active: false, x: 0, y: 0 };
    this.onInteract = null; // callback touche E / bouton action
    this.onToggleHelp = null;

    addEventListener('keydown', (e) => {
      if (e.repeat) return;
      if (e.code === 'KeyH' && this.onToggleHelp) this.onToggleHelp();
      if (!this.enabled) return;
      this.keys.add(e.code);
      if (e.code === 'KeyE' && this.onInteract) this.onInteract();
      // Empêche la page de scroller avec les flèches / espace
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
    });
    addEventListener('keyup', (e) => this.keys.delete(e.code));
    addEventListener('blur', () => this.keys.clear());

    this.initJoystick();
  }

  initJoystick() {
    const zone = document.getElementById('joystick');
    const knob = document.getElementById('joyKnob');
    if (!zone || !knob) return;
    const MAX = 40;
    let pointerId = null;

    const setKnob = (dx, dy) => {
      knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    };

    zone.addEventListener('pointerdown', (e) => {
      pointerId = e.pointerId;
      zone.setPointerCapture(pointerId);
      this.joy.active = true;
      moveTo(e);
    });
    const moveTo = (e) => {
      const r = zone.getBoundingClientRect();
      let dx = e.clientX - (r.left + r.width / 2);
      let dy = e.clientY - (r.top + r.height / 2);
      const len = Math.hypot(dx, dy);
      if (len > MAX) { dx = (dx / len) * MAX; dy = (dy / len) * MAX; }
      setKnob(dx, dy);
      this.joy.x = dx / MAX;
      this.joy.y = dy / MAX;
    };
    zone.addEventListener('pointermove', (e) => {
      if (e.pointerId !== pointerId) return;
      moveTo(e);
    });
    const end = (e) => {
      if (e.pointerId !== pointerId) return;
      pointerId = null;
      this.joy.active = false;
      this.joy.x = this.joy.y = 0;
      setKnob(0, 0);
    };
    zone.addEventListener('pointerup', end);
    zone.addEventListener('pointercancel', end);
  }

  /** Vecteur de déplacement normalisé {x, z} (x = droite, z = bas/écran). */
  getMove() {
    let x = 0;
    let z = 0;
    if (this.enabled) {
      const k = this.keys;
      if (k.has('KeyW') || k.has('ArrowUp')) z -= 1;
      if (k.has('KeyS') || k.has('ArrowDown')) z += 1;
      if (k.has('KeyA') || k.has('ArrowLeft')) x -= 1;
      if (k.has('KeyD') || k.has('ArrowRight')) x += 1;
      if (this.joy.active) { x += this.joy.x; z += this.joy.y; }
    }
    const len = Math.hypot(x, z);
    if (len > 1) { x /= len; z /= len; }
    return { x, z };
  }
}
