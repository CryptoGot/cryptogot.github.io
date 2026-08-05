/* =============================================================
   SpaceView — examiner un domaine = lever les yeux vers l'espace
   La caméra bascule vers le ciel et les informations flottent
   en hologrammes (CSS3D) au milieu des étoiles.
   Si on change de domaine pendant la vue, la caméra glisse
   d'une constellation d'infos à l'autre.
============================================================= */

import * as THREE from 'three';
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { ZONES_CONTENU, COFFRES } from './content.js';
import { zoneById } from './zones.js';

const CARD_SCALE = 0.031;
const OPEN_SPEED = 1 / 0.75; // blend par seconde

function smooth(k) {
  return k * k * (3 - 2 * k);
}

export class SpaceView {
  constructor(xp, ui) {
    this.xp = xp;
    this.ui = ui;
    this.scene = xp.panelScene;

    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.cards = []; // { obj, base: Vector3, rotY }

    this.blend = 0;      // 0 = sur la planète, 1 = dans les étoiles
    this.target = 0;
    this.onChange = null;

    // Cibles caméra (amorties pour glisser entre deux domaines)
    this.camPos = new THREE.Vector3();
    this.lookPos = new THREE.Vector3();
    this.upVec = new THREE.Vector3(0, 1, 0);
    this.camPosT = new THREE.Vector3();
    this.lookPosT = new THREE.Vector3();
    this.upVecT = new THREE.Vector3(0, 1, 0);
    this.groupQuatT = new THREE.Quaternion();
    this.upScreen = new THREE.Vector3(0, 1, 0);

    this.scroll = 0;
    this.scrollT = 0;
    this.maxScroll = 0;

    this.backdrop = document.getElementById('spaceBackdrop');
    this.bindEvents();
  }

  get isOpen() {
    return this.target === 1;
  }
  get active() {
    return this.target === 1 || this.blend > 0.001;
  }
  get eased() {
    return smooth(this.blend);
  }

  bindEvents() {
    let dragDist = 0;
    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop && dragDist < 6) this.close();
    });
    this.backdrop.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.scrollT = THREE.MathUtils.clamp(this.scrollT + e.deltaY * 0.02, 0, this.maxScroll);
    }, { passive: false });

    // Glisser pour naviguer (tactile) — un vrai glissement ne ferme pas
    let dragY = null;
    this.backdrop.addEventListener('pointerdown', (e) => { dragY = e.clientY; dragDist = 0; });
    this.backdrop.addEventListener('pointermove', (e) => {
      if (dragY == null) return;
      dragDist += Math.abs(dragY - e.clientY);
      this.scrollT = THREE.MathUtils.clamp(this.scrollT + (dragY - e.clientY) * 0.045, 0, this.maxScroll);
      dragY = e.clientY;
    });
    addEventListener('pointerup', () => { dragY = null; });

    addEventListener('keydown', (e) => {
      if (e.code !== 'Escape' || !this.isOpen) return;
      const lb = document.getElementById('lightbox');
      if (lb && !lb.hidden) return; // la lightbox se ferme d'abord
      this.close();
    });
  }

  /* ---------------- Ouverture / fermeture ---------------- */

  /**
   * @param {'zone'|'chest'} type
   * @param {string} id
   * @param {THREE.Vector3} playerPos position du joueur (surface)
   * @param {THREE.Vector3} up normale locale (radiale)
   * @param {THREE.Vector3} fwd direction du regard caméra (tangente)
   */
  open(type, id, playerPos, up, fwd) {
    const wasOpen = this.isOpen;

    // Cibles caméra : on lève les yeux vers le ciel
    this.camPosT.copy(playerPos).addScaledVector(up, 1.3).addScaledVector(fwd, -5.5);
    this.lookPosT.copy(playerPos).addScaledVector(up, 37).addScaledVector(fwd, 7);

    const faceDir = this.camPosT.clone().sub(this.lookPosT).normalize();
    const upScreen = fwd.clone().negate().projectOnPlane(faceDir).normalize();
    this.upVecT.copy(upScreen);
    this.upScreen.copy(upScreen);
    const right = new THREE.Vector3().crossVectors(upScreen, faceDir);
    this.groupQuatT.setFromRotationMatrix(new THREE.Matrix4().makeBasis(right, upScreen, faceDir));

    if (!wasOpen) {
      // Départ net : pas d'amortissement depuis une vieille position
      this.camPos.copy(this.camPosT);
      this.lookPos.copy(this.lookPosT);
      this.upVec.copy(this.upVecT);
      this.group.quaternion.copy(this.groupQuatT);
      this.group.position.copy(this.lookPosT);
    }

    this.buildCards(type, id);
    this.scroll = 0;
    this.scrollT = 0;

    this.target = 1;
    this.backdrop.hidden = false;
    requestAnimationFrame(() => this.backdrop.classList.add('show'));
    this.onChange?.(true);
  }

  close() {
    if (!this.isOpen) return;
    this.target = 0;
    this.backdrop.classList.remove('show');
    for (const c of this.cards) c.obj.element.firstElementChild?.classList.remove('show');
    this.onChange?.(false);
  }

  /* ---------------- Construction des hologrammes ---------------- */

  disposeCards() {
    for (const c of this.cards) {
      this.group.remove(c.obj);
      c.obj.element.remove();
    }
    this.cards = [];
  }

  buildCards(type, id) {
    this.disposeCards();

    const data = type === 'zone' ? ZONES_CONTENU[id] : COFFRES[id];
    if (!data) return;
    const meta = type === 'zone' ? zoneById(id) : null;
    const emoji = meta?.emoji ?? data.emoji ?? '📌';

    // --- Carte titre ---
    const head = document.createElement('div');
    head.className = 'holo-card holo-head';
    head.innerHTML = `
      <button class="holo-close" type="button" aria-label="Retour sur la planète">×</button>
      <div class="holo-head-top">
        <span class="holo-emoji">${emoji}</span>
        <div class="holo-head-titles">
          <h2>${esc(data.titre)}</h2>
          ${data.sousTitre ? `<p class="holo-sub">${esc(data.sousTitre)}</p>` : ''}
        </div>
        ${data.badge ? `<span class="holo-badge">${esc(data.badge)}</span>` : ''}
      </div>
      ${data.intro ? `<p class="holo-intro">${esc(data.intro)}</p>` : ''}
    `;
    head.querySelector('.holo-close').addEventListener('click', () => this.close());

    // --- Cartes projets / blocs ---
    const items = [];
    if (data.projets) {
      for (const p of data.projets) items.push(this.projectCard(p));
    } else if (data.blocs) {
      for (const b of data.blocs) {
        const el = document.createElement('div');
        el.className = 'holo-card holo-item';
        el.innerHTML = `<h3>${esc(b.titre)}</h3><p>${esc(b.texte)}</p>`;
        items.push(el);
      }
    }
    if (data.liste) {
      const el = document.createElement('div');
      el.className = 'holo-card holo-item';
      el.innerHTML = `<h3>Mes objectifs</h3><ul class="liste-simple">${data.liste.map((li) => `<li>${esc(li)}</li>`).join('')}</ul>`;
      items.push(el);
    }

    // --- Carte compétences / bilan ---
    let footer = null;
    if (data.competences?.length || data.retenir) {
      footer = document.createElement('div');
      footer.className = 'holo-card holo-footer';
      footer.innerHTML = `
        ${data.competences?.length ? `<div class="chips">${data.competences.map((c) => `<span class="chip">${esc(c)}</span>`).join('')}</div>` : ''}
        ${data.retenir ? `<div class="retenir"><strong>Ce que j'en retiens :</strong> ${esc(data.retenir)}</div>` : ''}
      `;
    }

    this.layoutCards(head, items, footer);

    // Apparition en cascade
    requestAnimationFrame(() => {
      this.cards.forEach((c, i) => {
        const inner = c.obj.element.firstElementChild;
        inner.style.transitionDelay = `${i * 70}ms`;
        inner.classList.add('show');
      });
    });
  }

  projectCard(p) {
    const el = document.createElement('div');
    el.className = 'holo-card holo-item holo-scroll';
    el.innerHTML = `
      <h3>${esc(p.titre)}</h3>
      ${p.tag ? `<span class="projet-tag">${esc(p.tag)}</span>` : ''}
      <p>${esc(p.texte)}</p>
      ${p.images?.length ? `<div class="projet-imgs">${p.images.map((s) => `<img src="${s}" loading="lazy" alt="Capture — ${esc(p.titre)}">`).join('')}</div>` : ''}
      ${p.liens?.length ? `<div class="projet-liens">${p.liens.map((l) => `<a class="lien-btn${l.style ? ` ${l.style}` : ''}" href="${l.url}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join('')}</div>` : ''}
    `;
    el.querySelectorAll('.projet-imgs img').forEach((img) => {
      img.addEventListener('click', () => this.ui.openLightbox(img.src));
    });
    return el;
  }

  layoutCards(head, items, footer) {
    const mobile = innerWidth < 720;
    const addCard = (el, x, y, z, rotY = 0) => {
      const wrap = document.createElement('div');
      wrap.className = 'holo-wrap';
      wrap.appendChild(el);
      const obj = new CSS3DObject(wrap);
      obj.scale.setScalar(CARD_SCALE * (mobile ? 0.86 : 1));
      obj.position.set(x, y, z);
      obj.rotation.y = rotY;
      this.group.add(obj);
      this.cards.push({ obj, base: new THREE.Vector3(x, y, z), rotY });
    };

    if (!mobile) {
      addCard(head, 0, 10.8, 0);
      const n = items.length;
      items.forEach((el, i) => {
        const off = i - (n - 1) / 2;
        addCard(el, off * 11.6, -0.8, -Math.abs(off) * 0.9, -off * 0.1);
      });
      if (footer) addCard(footer, 0, -12.4, 0.5);
      this.maxScroll = Math.max(0, (items.length > 3 ? 2 : 0) + (footer ? 3 : 0));
    } else {
      // Mobile : colonne verticale, on fait défiler le ciel
      let y = 11;
      addCard(head, 0, y, 0);
      y -= 13;
      for (const el of items) {
        addCard(el, 0, y, 0);
        y -= 13.5;
      }
      if (footer) {
        addCard(footer, 0, y, 0);
        y -= 12;
      }
      this.maxScroll = Math.max(0, -y - 16);
    }
  }

  /* ---------------- Boucle ---------------- */

  update(dt, t) {
    // Avance l'ouverture / la fermeture
    const dir = this.target === 1 ? 1 : -1;
    const prev = this.blend;
    this.blend = THREE.MathUtils.clamp(this.blend + dir * OPEN_SPEED * dt, 0, 1);
    if (prev > 0 && this.blend === 0 && this.target === 0) {
      this.disposeCards();
      this.backdrop.hidden = true;
    }

    if (!this.active) return;

    // Glisse douce des cibles caméra (voyage entre deux domaines)
    const k = 1 - Math.pow(0.004, dt);
    this.camPos.lerp(this.camPosT, k);
    this.lookPos.lerp(this.lookPosT, k);
    this.upVec.lerp(this.upVecT, k).normalize();

    // Le groupe de cartes suit (position + défilement)
    this.scroll += (this.scrollT - this.scroll) * Math.min(dt * 10, 1);
    this.group.quaternion.slerp(this.groupQuatT, k);
    this.group.position.copy(this.lookPos).addScaledVector(this.upScreen, this.scroll);

    // Flottement des cartes
    for (let i = 0; i < this.cards.length; i++) {
      const c = this.cards[i];
      c.obj.position.y = c.base.y + Math.sin(t * 1.4 + i * 1.7) * 0.22;
      c.obj.rotation.y = c.rotY + Math.sin(t * 0.8 + i) * 0.015;
    }
  }
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
