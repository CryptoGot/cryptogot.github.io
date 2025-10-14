// Toggle visuel (game/mouse) — pour l’instant, c’est uniquement décoratif.
const toggle = document.getElementById('modeToggle');
toggle.addEventListener('click', (e) => {
  if (e.target.matches('button[data-mode]')) {
    [...toggle.children].forEach(b => b.classList.toggle('active', b === e.target));
    const mode = e.target.dataset.mode;
    console.log('Mode actuel :', mode);
    // plus tard : si mode === 'game', on activera le Canvas.
  }
});
