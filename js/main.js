/* =========================
   Boot / Scroll / Assets
========================= */

// pas de restauration de scroll au reload
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.addEventListener('load', () => window.scrollTo(0, 0), { once: true });

// assets uniques
const SPR_IMG = new Image();  // perso
SPR_IMG.src = 'assets/sprites/idle96.png';

const BOUNCER_IMG = new Image(); // ressort
BOUNCER_IMG.src = 'assets/sprites/bouncer.png';

/* =========================
   UI : Toggle & key handling
========================= */

const toggle = document.getElementById('modeToggle');
toggle.addEventListener('click', (e) => {
  if (!e.target.matches('button[data-mode]')) return;
  [...toggle.children].forEach(b => b.classList.toggle('active', b === e.target));
  const mode = e.target.dataset.mode;
  document.body.classList.toggle('mode-game',  mode === 'game');
  document.body.classList.toggle('mode-mouse', mode === 'mouse');
  if (window.gameLayer) (mode === 'game' ? window.gameLayer.enable() : window.gameLayer.disable());
});

// bloque le scroll avec espace/flèches si on ne tape pas dans un input
window.addEventListener('keydown', (e) => {
  const tag = (e.target.tagName || '').toUpperCase();
  const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable;
  if (!typing && ['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) e.preventDefault();
}, { passive:false });

/* =========================
   “?” pop (clic + API spawn)
========================= */

function setupQuestionBoxes() {
  const header = document.querySelector('.top-hero');
  if (!header) return null;

  let layer = header.querySelector('.pop-items-layer');
  if (!layer){
    layer = document.createElement('div');
    layer.className = 'pop-items-layer';
    header.appendChild(layer);
  }

  const ICONS = {
    github: `<svg viewBox="0 0 24 24"><path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.78-1.34-1.78-1.09-.75.08-.74.08-.74 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.48.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.16 0 0 1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.64.24 2.86.12 3.16.76.84 1.23 1.9 1.23 3.22 0 4.62-2.8 5.64-5.48 5.94.43.37.82 1.1.82 2.23v3.31c0 .32.21.7.83.58A12 12 0 0 0 12 .5z"/></svg>`,
    mail:   `<svg viewBox="0 0 24 24"><path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11A2.5 2.5 0 0 1 19.5 20h-15A2.5 2.5 0 0 1 2 17.5v-11Zm2.2-.3 7.3 5.46c.3.23.7.23 1 0l7.3-5.46a1 1 0 0 0-.8-.2H5a1 1 0 0 0-.8.2Zm16.1 2.48-6.9 5.17a2.5 2.5 0 0 1-3.2 0L3.3 8.68V17.5c0 .28.22.5.5.5h16.4c.28 0 .5-.22.5-.5V8.68Z"/></svg>`,
    cv:     `<svg viewBox="0 0 24 24"><path d="M6 2h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2Zm7 1.5V8h4.5L13 3.5ZM8 11h8v1.8H8V11Zm0 3.2h8V16H8v-1.8Zm0 3.2h5V20H8v-2.6Z"/></svg>`,
    linkedin:`<svg viewBox="0 0 24 24"><path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3.5a2 2 0 1 0 0 4.01 2 2 0 0 0 0-4ZM20.44 20h-3.37v-6.2c0-1.48-.53-2.48-1.86-2.48-1.02 0-1.63.69-1.89 1.36-.1.25-.13.6-.13.95V20h-3.37s.04-10.98 0-12.12h3.37v1.72c.45-.7 1.25-1.7 3.05-1.7 2.23 0 3.9 1.46 3.9 4.6V20Z"/></svg>`
  };

  function spawnFromBtn(btn){
    if (!btn) return;
    if (btn._spawn) { btn._spawn.remove(); btn._spawn = null; }

    const type = btn.dataset.item || 'github';
    const href = btn.dataset.href || '#';

    const rect = btn.getBoundingClientRect();
    const rH   = header.getBoundingClientRect();
    const x = rect.left + rect.width/2 - rH.left;
    const y = rect.top  - 10 - rH.top;

    const el = document.createElement('div');
    el.className = `pop-item ${type}`;
    el.style.left = `${x}px`;
    el.style.top  = `${y}px`;
    el.innerHTML = `${ICONS[type] || ''}`;
    el.addEventListener('click', (ev)=>{
      ev.stopPropagation();
      const isMail = href.startsWith('mailto:');
      window.open(href, isMail ? '_self' : '_blank', 'noopener');
      el.remove(); btn._spawn = null;
    });
    document.addEventListener('click', closeOnce, { once:true });
    function closeOnce(){ el.remove(); btn._spawn = null; }

    layer.appendChild(el);
    btn._spawn = el;
    btn.classList.add('hit'); setTimeout(()=>btn.classList.remove('hit'), 150);
  }

  // clic sur une case “?”
  header.addEventListener('click', (e)=>{
    const btn = e.target.closest('.pop-box.qbtn');
    if (!btn) return;
    e.preventDefault(); e.stopPropagation();
    spawnFromBtn(btn);
  });

  // API pour la couche jeu (spawn sur “coup de tête”)
  return {
    header,
    buttons: [...header.querySelectorAll('.pop-box.qbtn')],
    spawnFromBtn
  };
}

const QBOX = setupQuestionBoxes();

/* =========================
   Fabrique d'une couche jeu
========================= */

function createGameLayer(rootSelector, canvasId, opts = {}) {
  const root   = document.querySelector(rootSelector);
  const canvas = document.getElementById(canvasId);
  if (!root || !canvas) return null;

  const SPAWN_X = opts.spawnX ?? 64;

  const SPR = { w:96, h:96, cols:11, rows:1, count:11, fps:8, scale:0.7 };
  const anim = { t:0, frame:0, name:'idle' };
  const ctx = canvas.getContext('2d');
  let enabled = true;

  // joueur
  const player = { x:SPAWN_X, y:120, w:36, h:48, vx:0, vy:0, speed:20000, jump:1200, onGround:false, facing:1 };

  // physique
  const G=2200, MAX_FALL=1600, FRICTION=0.86;

  // inputs
  const keys = { left:false, right:false, up:false, interact:false };
  let interactPressed = false;
  const kd = (e)=>{ if (e.repeat) return;
    if (e.code==='ArrowLeft'||e.code==='KeyA') keys.left = true;
    if (e.code==='ArrowRight'||e.code==='KeyD') keys.right = true;
    if (e.code==='ArrowUp'||e.code==='Space'||e.code==='KeyW') keys.up = true;
    if (e.code==='KeyE'){ keys.interact = true; interactPressed = true; }
  };
  const ku = (e)=>{ 
    if (e.code==='ArrowLeft'||e.code==='KeyA') keys.left = false;
    if (e.code==='ArrowRight'||e.code==='KeyD') keys.right = false;
    if (e.code==='ArrowUp'||e.code==='Space'||e.code==='KeyW') keys.up = false;
    if (e.code==='KeyE') keys.interact = false;
  };
  window.addEventListener('keydown', kd);
  window.addEventListener('keyup', ku);

  // canvas sizing
  function resize(){
    const r = root.getBoundingClientRect();
    const dpr = Math.max(1, Math.floor(window.devicePixelRatio||1));
    canvas.width  = Math.floor(r.width  * dpr);
    canvas.height = Math.floor(r.height * dpr);
    canvas.style.width  = r.width  + 'px';
    canvas.style.height = r.height + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.imageSmoothingEnabled = false;
  }
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', ()=>setTimeout(resize, 200));
  resize();

  // colliders
  function colliders(){
    const r0 = root.getBoundingClientRect();
    const out = [];
    root.querySelectorAll('.collider').forEach(el=>{
      const r = el.getBoundingClientRect();
      out.push({ x:r.left-r0.left, y:r.top-r0.top, w:r.width, h:r.height });
    });
    return out;
  }

  // resolve AABB (player)
  function resolve(px,py,vx,vy,w,h, cols){
    let onGround=false, x=px, y=py;
    x+=vx;
    for(const c of cols){
      if (x < c.x + c.w && x + w > c.x && y < c.y + c.h && y + h > c.y){
        if (vx > 0) x = c.x - w; else if (vx < 0) x = c.x + c.w;
        vx = 0;
      }
    }
    y+=vy;
    for(const c of cols){
      if (x < c.x + c.w && x + w > c.x && y < c.y + c.h && y + h > c.y){
        if (vy > 0){ y = c.y - h; vy = 0; onGround = true; }
        else if (vy < 0){ y = c.y + c.h; vy = 0; }
      }
    }
    return {x,y,vx,vy,onGround};
  }

  // items (dont bouncer)
  const items = (opts.items || []).map(i => ({
    kind: i.kind || 'prop',
    img:  i.img  || null,
    x: i.x ?? 0, y: i.y ?? 0,
    w: i.w ?? 48, h: i.h ?? 48,
    vy: i.vy ?? 0,
    gravity: i.gravity ?? true,
    atRest: false,
    carrying: false,
    bouncePower: i.bouncePower ?? 1400
  }));
  let carried = null;

  function resolveItemVertical(it, vy, cols){
    let y = it.y + vy, newVy = vy, onGround = false;
    for (const c of cols){
      const overlapX = it.x < c.x + c.w && it.x + it.w > c.x;
      const willOverlapY = y < c.y + c.h && y + it.h > c.y;
      if (overlapX && willOverlapY){
        if (vy > 0){ y = c.y - it.h; newVy = 0; onGround = true; }
        else if (vy < 0){ y = c.y + c.h; newVy = 0; }
      }
    }
    return { y, vy:newVy, onGround };
  }

  // pick/drop (E)
  const PICK_RADIUS = 64, CARRY_OFFSET_Y = 6;
  function tryPickupOrDrop(){
    if (carried){
      const feetX = player.x + player.w/2, feetY = player.y + player.h;
      carried.carrying=false; carried.gravity=true; carried.atRest=false; carried.vy=-300;
      const ahead = player.facing > 0 ? 14 : -14;
      carried.x = Math.round(feetX - carried.w/2 + ahead);
      carried.y = Math.round(feetY - carried.h - 2);
      carried = null; return;
    }
    const pcx = player.x + player.w/2, pcy = player.y + player.h/2;
    let best=null, bestD2=Infinity;
    for(const it of items){
      if (it.carrying) continue;
      const icx = it.x + it.w/2, icy = it.y + it.h/2;
      const d2 = (icx-pcx)*(icx-pcx) + (icy-pcy)*(icy-pcy);
      if (d2 < bestD2 && d2 <= PICK_RADIUS*PICK_RADIUS){ best=it; bestD2=d2; }
    }
    if (best){
      carried=best; best.carrying=true; best.gravity=false; best.atRest=false; best.vy=0;
      best.x = Math.round((player.x + player.w/2) - best.w/2);
      best.y = Math.round(player.y - best.h - CARRY_OFFSET_Y);
    }
  }

  // spawn
  function placeStart(){
    const cols = colliders();
    if (cols.length){
      cols.sort((a,b)=>a.y-b.y);
      const t = cols[0];
      player.x = SPAWN_X;
      player.y = t ? (t.y - player.h - 4) : 10;
    } else { player.x = SPAWN_X; player.y = 10; }
    player.vx = player.vy = 0; player.onGround = false;
  }
  placeStart();

  // handoff callbacks
  let onFallOut = null, onExitTop = null;
  let fallArmed=false, touchedGroundOnce=false;
  setTimeout(()=> fallArmed = true, 500);

  // anti-spam spawn sur les “?” (par bouton)
  const bumpCooldownMs = 220;
  const lastBumpAt = new Map();

  // loop
  let last = performance.now();
  function loop(now){
    const dt = Math.min(0.033, (now-last)/1000); last = now;

    if (!enabled){ ctx.clearRect(0,0,canvas.width,canvas.height); requestAnimationFrame(loop); return; }

    if (interactPressed){ tryPickupOrDrop(); interactPressed=false; }

    // input
    let ax = 0;
    if (keys.left)  { ax -= 1; player.facing = -1; }
    if (keys.right) { ax += 1; player.facing =  1; }
    player.vx = ax ? (ax*player.speed*dt) + player.vx*0.6 : player.vx*FRICTION;

    // gravité + saut
    player.vy += G*dt; if (player.vy > MAX_FALL) player.vy = MAX_FALL;
    if (keys.up && player.onGround){ player.vy = -player.jump; player.onGround=false; }

    // collisions
    const cols = colliders();
    const res  = resolve(player.x, player.y, player.vx*dt, player.vy*dt, player.w, player.h, cols);
    const prevY = player.y; // utile pour tester la direction avant mise à jour
    player.x=res.x; player.y=res.y; player.onGround=res.onGround;
    player.vx=res.vx/dt; player.vy=res.vy/dt;

    if (player.onGround) touchedGroundOnce = true;

    // sortie bas
    const rootRect = root.getBoundingClientRect();
    if (fallArmed && touchedGroundOnce && (player.y + player.h) > rootRect.height + 4 && typeof onFallOut === 'function'){
      onFallOut({ x: player.x + player.w/2, facing: player.facing });
      fallArmed = false; setTimeout(()=> fallArmed = true, 300);
    }
    // sortie haut (pour la grotte)
    if ((player.y + player.h) < -8 && typeof onExitTop === 'function'){
      onExitTop({ x: player.x + player.w/2, facing: player.facing });
    }

    // rebond sur bouncers
    if (player.vy > 0){
      const left=player.x, right=player.x+player.w, bottom=player.y+player.h;
      for(const it of items){
        if (it.kind!=='bouncer' || it.carrying) continue;
        const t=it.y, l=it.x, r=it.x+it.w;
        if (right>l && left<r && bottom>=t && (bottom-t)<=Math.max(8, player.h*0.6)){
          player.y=t-player.h; player.vy=-(it.bouncePower??2200); player.onGround=false; break;
        }
      }
    }

    // cogner les “?” par dessous (uniquement dans le header)
    if (QBOX && root.matches('.top-hero') && prevY > player.y && player.vy < 0){
      const rH = root.getBoundingClientRect();
      const headLeft  = player.x;
      const headRight = player.x + player.w;
      const headY     = player.y; // haut du joueur

      QBOX.buttons.forEach(btn=>{
        const br = btn.getBoundingClientRect();
        const bx = br.left - rH.left, by = br.top - rH.top, bw = br.width, bh = br.height;
        const overlapX = headRight > bx && headLeft < bx + bw;
        const touchingBottom = (headY <= by + bh) && (headY >= by + bh - 10); // proximité sous la box
        if (overlapX && touchingBottom){
          const lastT = lastBumpAt.get(btn) || 0;
          if (now - lastT > bumpCooldownMs){
            lastBumpAt.set(btn, now);
            // petit “rebond plafond”
            player.vy = Math.abs(player.vy) * 0.35;
            player.y  = by + bh + 0.1;
            QBOX.spawnFromBtn(btn);
          }
        }
      });
    }

    // anim
    anim.t += dt; const spf = 1/SPR.fps;
    while (anim.t >= spf){ anim.t -= spf; anim.frame = (anim.frame+1)%SPR.count; }

    // items (gravité)
    for(const it of items){
      if (it.carrying || !it.gravity || it.atRest) continue;
      it.vy += G*dt; if (it.vy > MAX_FALL) it.vy = MAX_FALL;
      const rI = resolveItemVertical(it, it.vy*dt, cols);
      it.y = rI.y; it.vy = rI.vy/dt; if (rI.onGround){ it.atRest=true; it.vy=0; }
    }
    // item porté au-dessus de la tête
    if (carried){
      carried.x = Math.round(player.x + player.w/2 - carried.w/2);
      carried.y = Math.round(player.y - carried.h - 6);
    }

    // draw
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // items
    for(const it of items){
      const x=Math.round(it.x), y=Math.round(it.y);
      if (it.img?.complete) ctx.drawImage(it.img, x,y,it.w,it.h);
      else { ctx.fillStyle='#67b7ff'; ctx.fillRect(x,y,it.w,it.h); ctx.strokeStyle='#0e2a3a'; ctx.lineWidth=2; ctx.strokeRect(x+1,y+1,it.w-2,it.h-2); }
    }

    // perso
    const f=anim.frame, sx=(f%SPR.cols)*SPR.w, sy=Math.floor(f/SPR.cols)*SPR.h;
    const dw=SPR.w*SPR.scale, dh=SPR.h*SPR.scale;
    const feetX=player.x+player.w/2, feetY=player.y+player.h;
    const dx=Math.round(feetX - dw/2), dy=Math.round(feetY - dh);

    ctx.save();
    if (player.facing < 0){ ctx.translate(Math.round(feetX),0); ctx.scale(-1,1); ctx.translate(-Math.round(feetX),0); }
    ctx.globalAlpha=.15; ctx.fillStyle='#000'; ctx.beginPath(); ctx.ellipse(feetX,feetY,dw*0.35,dh*0.10,0,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
    if (SPR_IMG.complete) ctx.drawImage(SPR_IMG, sx,sy,SPR.w,SPR.h, dx,dy,dw,dh);
    else ctx.fillRect(player.x,player.y,player.w,player.h);
    ctx.restore();

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  return {
    enable(){ enabled=true; canvas.style.display='block'; touchedGroundOnce=false; fallArmed=false; setTimeout(()=>fallArmed=true,500); },
    disable(){ enabled=false; canvas.style.display='none'; },
    setOnFallOut(fn){ onFallOut=fn; },
    setOnExitTop(fn){ onExitTop=fn; },
    getState(){ return { x:player.x, y:player.y, vx:player.vx, vy:player.vy, facing:player.facing }; },
    setState(s){
      const r = root.getBoundingClientRect();
      const xWanted = (s.x ?? SPAWN_X);
      const x = Math.max(16, Math.min(xWanted, r.width-16));
      player.x = x - player.w/2; player.y = 10; player.vx=0; player.vy=0;
      if (s.facing) player.facing = s.facing;
    }
  };
}

/* =========================
   Instanciation des couches
========================= */

// Header
const headerLayer = createGameLayer('.top-hero', 'gameLayer', { spawnX: 64 });

// About + ressort
const aboutLayer  = createGameLayer('#about.about-cave', 'gameLayerAbout', {
  spawnX: 64,
  items: [
    { kind:'bouncer', img: BOUNCER_IMG, x: 80, y: -40, w: 64, h: 64, gravity:true, bouncePower: 2200 }
  ]
});

// état initial
aboutLayer?.disable();
window.gameLayer = headerLayer;

// handoff bas (header -> about)
headerLayer?.setOnFallOut((state)=>{
  headerLayer.disable();
  aboutLayer.enable();
  aboutLayer.setState({ x: state.x, facing: state.facing });
  document.getElementById('about')?.scrollIntoView({ behavior:'smooth' });
  window.gameLayer = aboutLayer;
});

// sortie haut (about -> header)
aboutLayer?.setOnExitTop(()=>{
  aboutLayer.disable();
  headerLayer.enable();
  headerLayer.setState({ x: 64, facing: 1 });
  document.querySelector('.top-hero')?.scrollIntoView({ behavior:'smooth' });
  document.body.classList.add('mode-game');
  document.body.classList.remove('mode-mouse');
  window.gameLayer = headerLayer;
});

// clic “Who I am ?”
document.addEventListener('click', (e) => {
  const link = e.target.closest('a.who-btn');
  if (!link) return;
  e.preventDefault();
  headerLayer?.disable();
  aboutLayer?.enable();
  aboutLayer?.setState({ x: 64, facing: 1 });
  document.getElementById('about')?.scrollIntoView({ behavior:'smooth' });
  document.body.classList.remove('mode-game');
  document.body.classList.add('mode-mouse');
  window.gameLayer = aboutLayer;
});

// clic “Back to start”
document.addEventListener('click', (e) => {
  const link = e.target.closest('a.back-btn');
  if (!link) return;
  e.preventDefault();
  aboutLayer?.disable();
  headerLayer?.enable();
  headerLayer?.setState({ x: 64, facing: 1 });
  document.querySelector('.top-hero')?.scrollIntoView({ behavior:'smooth' });
  document.body.classList.add('mode-game');
  document.body.classList.remove('mode-mouse');
  window.gameLayer = headerLayer;
});

/* =========================
   Accordions (main)
========================= */
(function(){
  function setup(headSelector){
    const head  = document.querySelector(headSelector);
    if (!head) return;
    const panel = document.getElementById(head.getAttribute('aria-controls'));
    if (!panel) return;
    function open(){ panel.hidden=false; requestAnimationFrame(()=>panel.classList.add('open')); head.setAttribute('aria-expanded','true'); }
    function close(){ panel.classList.remove('open'); head.setAttribute('aria-expanded','false'); setTimeout(()=>{ if(!panel.classList.contains('open')) panel.hidden=true; },320); }
    head.addEventListener('click', ()=> (head.getAttribute('aria-expanded')==='true') ? close() : open());
  }
  setup('.info-toggle.left  .info-head');
  setup('.info-toggle.right .info-head');
})();

(function setupControlsHints(){
  const hints = document.getElementById('controlsHints');
  const chip  = document.getElementById('helpChip');
  if (!hints || !chip) return;

  let autoHideTimer = null;
  let hasInteracted = false;

  function showHints(ms=0){
    clearTimeout(autoHideTimer);
    hints.classList.add('show');
    if (ms) autoHideTimer = setTimeout(hideHints, ms);
  }
  function hideHints(){
    clearTimeout(autoHideTimer);
    hints.classList.remove('show');
  }

  // Affiche au chargement puis cache après 6s
  showHints(6000);

  // Cache dès la première action de jeu (bouger ou sauter)
  const hideOnKeys = (e)=>{
    if (hasInteracted) return;
    if (['ArrowLeft','ArrowRight','KeyA','KeyD','Space','KeyW','ArrowUp'].includes(e.code)){
      hasInteracted = true;
      hideHints();
      window.removeEventListener('keydown', hideOnKeys);
    }
  };
  window.addEventListener('keydown', hideOnKeys, { passive:true });

  // Bouton ? pour (re)montrer
  chip.addEventListener('click', (e)=>{
    e.preventDefault();
    if (hints.classList.contains('show')) hideHints();
    else showHints();
  });

  // Touche H = toggle aide
  window.addEventListener('keydown', (e)=>{
    if (e.code === 'KeyH'){
      if (hints.classList.contains('show')) hideHints();
      else showHints();
    }
  });
})();
