/* =============================================================
   UI — intro, menu rapide, invite d'interaction, lightbox
   (Le contenu des domaines s'affiche dans l'espace → SpaceView)
============================================================= */

import { PROFILE, COFFRES } from './content.js';
import { ZONES } from './zones.js';

export class UI {
  constructor() {
    this.intro = document.getElementById('intro');
    this.navPanel = document.getElementById('navPanel');
    this.navToggle = document.getElementById('navToggle');
    this.helpBox = document.getElementById('helpBox');
    this.prompt = document.getElementById('prompt');
    this.promptText = document.getElementById('promptText');
    this.actionBtn = document.getElementById('actionBtn');
    this.lightbox = document.getElementById('lightbox');
    this.lightboxImg = document.getElementById('lightboxImg');
    this.flashEl = document.getElementById('flash');

    this.onTeleport = null;   // (zoneId) => void
    this.onOpenAbout = null;  // (coffreId) => void

    this.buildNav();
    this.bindEvents();
  }

  /* ---------------- Navigation rapide ---------------- */

  buildNav() {
    const zonesBox = document.getElementById('navZones');
    for (const z of ZONES) {
      const btn = document.createElement('button');
      btn.className = 'nav-zone';
      btn.type = 'button';
      btn.innerHTML = `<span class="nz-emoji">${z.emoji}</span><span>${z.nom}</span>`;
      btn.addEventListener('click', () => {
        this.closeNav();
        this.onTeleport?.(z.id);
      });
      zonesBox.appendChild(btn);
    }

    const chestsBox = document.getElementById('navChests');
    for (const [id, c] of Object.entries(COFFRES)) {
      const btn = document.createElement('button');
      btn.className = 'nav-zone';
      btn.type = 'button';
      btn.innerHTML = `<span class="nz-emoji">${c.emoji}</span><span>${c.titre}</span>`;
      btn.addEventListener('click', () => {
        this.closeNav();
        this.onOpenAbout?.(id);
      });
      chestsBox.appendChild(btn);
    }

    const linksBox = document.getElementById('navLinks');
    for (const l of PROFILE.liens) {
      const a = document.createElement('a');
      a.className = 'nav-link';
      a.href = l.url;
      if (!l.url.startsWith('mailto:')) {
        a.target = '_blank';
        a.rel = 'noopener';
      }
      a.innerHTML = `<span>${l.emoji}</span><span>${l.label}</span>`;
      linksBox.appendChild(a);
    }
  }

  bindEvents() {
    this.navToggle.addEventListener('click', () => this.toggleNav());
    document.getElementById('navClose').addEventListener('click', () => this.closeNav());
    document.getElementById('helpToggle').addEventListener('click', () => this.toggleHelp());

    addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        if (!this.lightbox.hidden) this.closeLightbox();
        else if (!this.navPanel.hidden) this.closeNav();
      }
    });
    this.lightbox.addEventListener('click', () => this.closeLightbox());
  }

  /* ---------------- Intro / atterrissage ---------------- */

  /** Le titre décolle et plonge vers la planète. */
  launchIntro() {
    this.intro.classList.add('launch');
  }

  /** Flash blanc au moment de l'impact. */
  flash() {
    this.flashEl.hidden = false;
    this.flashEl.classList.remove('go');
    void this.flashEl.offsetWidth; // relance l'animation
    this.flashEl.classList.add('go');
    setTimeout(() => { this.flashEl.hidden = true; }, 550);
  }

  /** Passe en mode jeu : HUD visible, intro retirée. */
  setPlaying() {
    document.body.classList.add('playing');
    this.intro.hidden = true;
  }

  /* ---------------- Panneaux ---------------- */

  toggleNav() {
    this.navPanel.hidden ? this.openNav() : this.closeNav();
  }
  openNav() {
    this.navPanel.hidden = false;
    this.navToggle.setAttribute('aria-expanded', 'true');
  }
  closeNav() {
    this.navPanel.hidden = true;
    this.navToggle.setAttribute('aria-expanded', 'false');
  }
  toggleHelp() {
    this.helpBox.hidden = !this.helpBox.hidden;
  }

  /* ---------------- Invite d'interaction ---------------- */

  showPrompt(interactable) {
    this.promptText.textContent =
      interactable.type === 'zone' ? `Découvrir ${interactable.nom}` : `Ouvrir « ${interactable.nom} »`;
    this.prompt.hidden = false;
    this.actionBtn.hidden = false;
  }
  hidePrompt() {
    this.prompt.hidden = true;
    this.actionBtn.hidden = true;
  }

  /* ---------------- Lightbox ---------------- */

  openLightbox(src) {
    this.lightboxImg.src = src;
    this.lightbox.hidden = false;
  }
  closeLightbox() {
    this.lightbox.hidden = true;
  }
}
