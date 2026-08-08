// rahullingampally.online — small interactive touches
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- live "uptime" readout in the tmux bar ----
  const statusEl = document.querySelector('[data-uptime]');
  if (statusEl) {
    const start = Date.now();
    const render = () => {
      const s = Math.floor((Date.now() - start) / 1000);
      const hh = String(Math.floor(s / 3600)).padStart(2, '0');
      const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
      const ss = String(s % 60).padStart(2, '0');
      statusEl.textContent = `session ${hh}:${mm}:${ss}`;
    };
    render();
    setInterval(render, 1000);
  }

  // ---- boot log typing sequence (hero only) ----
  const bootEl = document.getElementById('boot-log');
  if (bootEl) {
    const lines = [
      { t: 'initializing recon module...', cls: 'ok', tag: '[ OK ]' },
      { t: 'loading certifications.db...', cls: 'ok', tag: '[ OK ]' },
      { t: 'mounting soc-internship volume...', cls: 'ok', tag: '[ OK ]' },
      { t: 'checking known CVEs against target...', cls: 'warn', tag: '[WARN]' },
      { t: 'establishing shell...', cls: 'ok', tag: '[ OK ]' },
      { t: 'whoami', cls: 'ok', tag: '' },
    ];

    if (reduceMotion) {
      bootEl.innerHTML = lines
        .map(l => `<span class="${l.cls}">${l.tag ? l.tag + ' ' : '$ '}</span>${l.t}`)
        .join('\n');
      revealHero();
    } else {
      let li = 0;
      const typeLine = () => {
        if (li >= lines.length) {
          revealHero();
          return;
        }
        const line = lines[li];
        const prefix = line.tag ? `<span class="${line.cls}">${line.tag}</span> ` : '<span class="ok">$</span> ';
        let ci = 0;
        const existing = bootEl.innerHTML;
        const tick = () => {
          ci++;
          bootEl.innerHTML = existing + prefix + line.t.slice(0, ci);
          if (ci < line.t.length) {
            setTimeout(tick, 14 + Math.random() * 20);
          } else {
            bootEl.innerHTML = existing + prefix + line.t + '\n';
            li++;
            setTimeout(typeLine, 160);
          }
        };
        tick();
      };
      typeLine();
    }
  } else {
    revealHero();
  }

  function revealHero() {
    const name = document.querySelector('.hero-name');
    const role = document.querySelector('.hero-role');
    const tagline = document.querySelector('.hero-tagline');
    const actions = document.querySelector('.hero-actions');
    [name, role, tagline, actions].forEach((el, i) => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(6px)';
      el.style.transition = 'opacity .45s ease, transform .45s ease';
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      }, reduceMotion ? 0 : i * 90);
    });
  }

  // ---- glitch scramble on the name, once, after reveal ----
  const glow = document.querySelector('.hero-name .glow');
  if (glow && !reduceMotion) {
    const finalText = glow.textContent;
    const chars = '!<>-_\\/[]{}—=+*^?#01';
    setTimeout(() => {
      let frame = 0;
      const totalFrames = 14;
      const iv = setInterval(() => {
        frame++;
        if (frame >= totalFrames) {
          glow.textContent = finalText;
          clearInterval(iv);
          return;
        }
        glow.textContent = finalText
          .split('')
          .map((ch, i) => (ch === ' ' ? ' ' : (i < frame ? finalText[i] : chars[Math.floor(Math.random() * chars.length)])))
          .join('');
      }, 40);
    }, 900);
  }
})();
