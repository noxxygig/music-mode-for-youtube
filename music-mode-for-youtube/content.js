(() => {
  const DEF = { enabled: false, saver: true, hideRecs: true };
  let S = { ...DEF };
  const root = document.documentElement;
  const $ = (id) => document.getElementById(id);
  const vid = () => new URLSearchParams(location.search).get('v');
  const onWatch = () => location.pathname === '/watch' && !!vid();
  const el = (cls, tag = 'div') => { const e = document.createElement(tag); e.className = cls; return e; };

  function cover() {
    const p = $('movie_player');
    if (!p) return;
    let c = $('ytmm-cover');
    if (!c) {
      c = el('ytmm-c'); c.id = 'ytmm-cover';
      c.append(el('bg'), el('img', 'img'), el('t'));
      p.appendChild(c);
    }
    const id = vid();
    const bg = c.querySelector('.bg'), img = c.querySelector('img'), t = c.querySelector('.t');
    if (id && c.dataset.v !== id) {
      c.dataset.v = id;
      const hq = `https://i.ytimg.com/vi/${id}/hq720.jpg`;
      const mq = `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
      img.onerror = () => { img.onerror = null; img.src = mq; bg.style.backgroundImage = `url(${mq})`; };
      img.src = hq; bg.style.backgroundImage = `url(${hq})`;
    }
    t.textContent = document.title.replace(/^\(\d+\)\s*/, '').replace(/\s*-\s*YouTube$/, '');
  }

  function saver(low) {
    const send = () => window.postMessage({ ytmm: 'quality', low }, '*');
    send(); setTimeout(send, 1500); setTimeout(send, 4000);
  }

  function apply() {
    const on = S.enabled && onWatch();
    root.classList.toggle('ytmm-on', on);
    root.classList.toggle('ytmm-norecs', S.hideRecs);
    if (on) cover();
    const b = document.querySelector('.ytmm-btn');
    if (b) b.classList.toggle('active', S.enabled);
    if (on && S.saver) saver(true);
  }

  function btn() {
    if (document.querySelector('.ytmm-btn')) return;
    const bar = document.querySelector('.ytp-right-controls');
    if (!bar) return;
    const NS = 'http://www.w3.org/2000/svg';
    const b = el('ytp-button ytmm-btn', 'button');
    b.title = 'Music Mode (Alt+M)';
    const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 24 24');
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', 'M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z'); p.setAttribute('fill', 'currentColor');
    s.appendChild(p); b.appendChild(s);
    b.onclick = toggle;
    b.classList.toggle('active', S.enabled);
    bar.prepend(b);
  }

  function toggle() {
    S.enabled = !S.enabled;
    chrome.storage.sync.set({ enabled: S.enabled });
    apply();
  }

  chrome.storage.sync.get(DEF, (v) => { S = { ...DEF, ...v }; apply(); });
  chrome.storage.onChanged.addListener((ch) => {
    for (const k in ch) S[k] = ch[k].newValue;
    apply();
  });
  document.addEventListener('yt-navigate-finish', apply);
  document.addEventListener('keydown', (e) => {
    if (e.altKey && !e.ctrlKey && !e.metaKey && e.code === 'KeyM') { e.preventDefault(); toggle(); }
  });
  setInterval(() => { btn(); if (root.classList.contains('ytmm-on')) cover(); }, 1000);
})();
