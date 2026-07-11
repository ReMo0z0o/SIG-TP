/* ============================================================
   APP — routeur, progression, navigation
   ============================================================ */

/* ---------- Progression (localStorage) ---------- */
window.Progress = (function () {
  const KEY = 'sig-tp-progress-v1';
  let data;
  try { data = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { data = {}; }
  const listeners = [];
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* stockage indisponible */ }
    listeners.forEach(f => { try { f(); } catch (e) { } });
  }
  return {
    set(id, score) {
      const prev = data[id];
      data[id] = Math.max(prev == null ? 0 : prev, Math.round(score * 100) / 100);
      save();
    },
    get(id) { return data[id] == null ? null : data[id]; },
    reset() { data = {}; save(); },
    onChange(f) { listeners.push(f); },
    moduleStats(ids) {
      const done = ids.filter(i => data[i] != null);
      const sum = done.reduce((a, i) => a + data[i], 0);
      return {
        total: ids.length,
        done: done.length,
        pct: ids.length ? Math.round((done.length / ids.length) * 100) : 0,
        score: done.length ? sum / done.length : 0
      };
    }
  };
})();

/* ---------- Registre des pages ---------- */
window.APP = {
  pages: {},
  register(route, def) { this.pages[route] = def; }
};

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const navBox = document.getElementById('nav-items');
  const main = document.getElementById('view');
  const crumb = document.getElementById('crumb');
  const topProg = document.getElementById('top-progress');

  const ORDER = [
    { group: 'Découvrir' },
    { route: 'home', icon: '⌂' },
    { group: 'Parcours BPMN' },
    { route: 'bpmn' },
    { route: 'tp1' },
    { route: 'tp2' },
    { group: 'Parcours ArchiMate' },
    { route: 'archimate' },
    { route: 'tp3' },
    { group: 'Évaluation' },
    { route: 'examen' }
  ];

  function buildNav() {
    navBox.innerHTML = '';
    ORDER.forEach(item => {
      if (item.group) {
        const l = document.createElement('div');
        l.className = 'nav-group-label';
        l.textContent = item.group;
        navBox.appendChild(l);
        return;
      }
      const def = APP.pages[item.route];
      if (!def) return;
      const a = document.createElement('a');
      a.href = '#/' + item.route;
      a.className = 'nav-item';
      a.dataset.route = item.route;
      const stats = def.ids && def.ids.length ? Progress.moduleStats(def.ids) : null;
      a.innerHTML = `<span class="nav-dot">${def.short || ''}</span><span>${def.title}</span>` +
        (stats ? `<span class="nav-pct">${stats.pct}%</span>` : '');
      if (stats && stats.pct === 100) a.classList.add('nav-done');
      navBox.appendChild(a);
    });
  }

  function currentRoute() {
    const hash = location.hash.replace(/^#\/?/, '');
    return hash.split('?')[0] || 'home';
  }

  function renderRoute() {
    const route = currentRoute();
    const def = APP.pages[route] || APP.pages.home;
    document.body.dataset.module = def.module || 'bpmn';
    main.innerHTML = '';
    main.dataset.module = def.module || 'bpmn';
    const page = document.createElement('div');
    page.className = 'page' + (def.narrow ? ' page-narrow' : '');
    main.appendChild(page);
    def.render(page);
    crumb.innerHTML = `ECGEB210 · <b>${def.title}</b>`;
    updateTopProgress(def);
    document.querySelectorAll('.nav-item').forEach(a => {
      a.classList.toggle('active', a.dataset.route === route);
    });
    sidebar.classList.remove('open');
    window.scrollTo({ top: 0 });
    document.title = def.title + ' · BPMN & ArchiMate';
  }

  function updateTopProgress(def) {
    if (def && def.ids && def.ids.length) {
      const s = Progress.moduleStats(def.ids);
      topProg.style.display = '';
      topProg.querySelector('.bar i').style.width = s.pct + '%';
      topProg.querySelector('.cnt').textContent = `${s.done}/${s.total}`;
    } else {
      topProg.style.display = 'none';
    }
  }

  Progress.onChange(() => {
    buildNav();
    const def = APP.pages[currentRoute()];
    updateTopProgress(def);
    document.querySelectorAll('.nav-item').forEach(a => {
      a.classList.toggle('active', a.dataset.route === currentRoute());
    });
  });

  window.addEventListener('hashchange', renderRoute);

  document.getElementById('menu-toggle').addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
  document.addEventListener('click', e => {
    if (window.innerWidth <= 960 && sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) && e.target.id !== 'menu-toggle') {
      sidebar.classList.remove('open');
    }
  });

  // thème
  const themeBtn = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('sig-tp-theme');
  if (saved) document.documentElement.dataset.theme = saved;
  themeBtn.addEventListener('click', () => {
    const cur = document.documentElement.dataset.theme ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('sig-tp-theme', next);
  });

  // réinitialisation
  document.getElementById('reset-progress').addEventListener('click', () => {
    if (confirm('Réinitialiser toute votre progression ?')) {
      Progress.reset();
      renderRoute();
    }
  });

  buildNav();
  renderRoute();
});

/* ---------- helpers HTML partagés ---------- */
window.H = {
  callout(type, icon, html) {
    return `<div class="callout callout-${type}"><span class="co-ic">${icon}</span><div>${html}</div></div>`;
  },
  canvas(title, tagHtml) {
    const panel = document.createElement('figure');
    panel.className = 'canvas-panel';
    panel.style.margin = '18px 0';
    panel.innerHTML = `<div class="canvas-head">${title || ''}${tagHtml ? `<span class="tag ${tagHtml[1] || ''}" style="margin-left:auto">${tagHtml[0]}</span>` : ''}</div><div class="canvas-scroll"></div>`;
    return { panel, scroll: panel.querySelector('.canvas-scroll') };
  },
  nextPrev(page, prev, next) {
    const d = document.createElement('div');
    d.className = 'next-prev';
    d.innerHTML =
      (prev ? `<a class="btn" href="#/${prev[0]}">← ${prev[1]}</a>` : '<span></span>') +
      (next ? `<a class="btn btn-primary" href="#/${next[0]}">${next[1]} →</a>` : '<span></span>');
    page.appendChild(d);
  }
};
