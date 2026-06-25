// Tabs do feed
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', function () {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
  });
});

// Links da sidebar esquerda
document.querySelectorAll('.sidebar-link').forEach(link => {
  link.addEventListener('click', function () {
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});

// Sistema de votos
document.querySelectorAll('.vote-col').forEach(col => {
  const upBtn    = col.querySelector('.vote-btn.up');
  const downBtn  = col.querySelector('.vote-btn.down');
  const countEl  = col.querySelector('.vote-count');

  let count   = parseInt(countEl.textContent);
  let current = 0; // -1, 0 ou 1

  function render() {
    countEl.textContent = count >= 1000
      ? (count / 1000).toFixed(1).replace('.0', '') + 'k'
      : count;
    upBtn.style.color   = current ===  1 ? '#b44dff' : '';
    downBtn.style.color = current === -1 ? '#ff5555' : '';
  }

  upBtn.addEventListener('click', () => {
    if (current === 1) { count--; current = 0; }
    else { count += current === -1 ? 2 : 1; current = 1; }
    render();
  });

  downBtn.addEventListener('click', () => {
    if (current === -1) { count++; current = 0; }
    else { count -= current === 1 ? 2 : 1; current = -1; }
    render();
  });
});