/* ============================================================
   Sommaire latéral partagé des chapitres de théorie (SIG-TP)
   Inclusion : <script src="sommaire-lateral.js" data-ch="theorie-chX"></script>
   - liste des sections à gauche du contenu (écrans ≥ 1280 px)
   - section en cours de lecture surlignée + barre de progression
   - coche verte sur les sections déjà « vues » (même règle et même
     stockage que le suivi de lecture du site : sig-tp-seen-v1)
   Le chapitre 5 a sa propre version intégrée ; le chapitre 3 navigue
   par onglets et garde sa barre latérale native.
   ============================================================ */
(function () {
  var SEEN_KEY = 'sig-tp-seen-v1';

  var CONF = {
    'theorie-ch1': {
      colors: { surface: '#fff', line: 'var(--line,#d5e4e7)', ink: 'var(--ink,#152a31)', muted: '#5c7078', accent: 'var(--teal,#087e8b)', deep: 'var(--teal-deep,#0b5563)', ok: 'var(--ok,#2e8b57)' },
      secs: [
        ['s1', 'Pourquoi ce cours ? L’échec des projets IT'],
        ['s2', '« IT doesn’t matter » & Hype Cycle'],
        ['s3', 'Business Analyst & alignement'],
        ['s4', 'Données, information & DIKW'],
        ['s5', 'Système & définition du SIG'],
        ['s6', 'Les types de SIG'],
        ['s7', 'SI fonctionnels & silos'],
        ['s8', 'Systèmes intégrés : CRM, ERP, EAI'],
        ['recap', 'Récapitulatif pour l’examen'],
        ['training', 'Exercices d’entraînement']
      ]
    },
    'theorie-ch2': {
      colors: { surface: 'var(--carte,#fff)', line: 'var(--ligne,#dde5e4)', ink: 'var(--encre,#12343b)', muted: 'var(--gris,#5b6b6d)', accent: 'var(--sarcelle,#0e7c86)', deep: 'var(--sarcelle,#0e7c86)', ok: 'var(--vert-ok,#2e7d32)' },
      secs: [
        ['s1', 'Les 7 phases du SDLC'],
        ['s2', 'Avantages & triangle de projet'],
        ['s3', 'Waterfall : la cascade'],
        ['s4', 'Le modèle agile & SCRUM'],
        ['s5', 'Le Business Analyst'],
        ['s6', 'Exigences & MoSCoW'],
        ['s7', 'Pourquoi modéliser ?'],
        ['prio', 'À maîtriser en priorité'],
        ['train', 'Exercices d’entraînement']
      ]
    },
    'theorie-ch4': {
      colors: { surface: 'var(--card,#fff)', line: 'var(--line,#dfe3da)', ink: 'var(--ink,#1b2430)', muted: 'var(--ink-soft,#44505f)', accent: 'var(--accent,#2e4057)', deep: 'var(--accent,#2e4057)', ok: 'var(--ok,#2f7d4f)' },
      secs: [
        ['s1', 'Pourquoi l’architecture d’entreprise ?'],
        ['s2', 'TOGAF et son cycle ADM'],
        ['s3', 'ArchiMate : les 3 couches'],
        ['s4', 'La couche Métier ★'],
        ['s5', 'La couche Application ★'],
        ['s6', 'Les 12 relations ★'],
        ['s7', 'L’articulation inter-couches ★'],
        ['s8', 'L’essentiel pour l’examen'],
        ['s9', 'Exercices d’entraînement']
      ]
    },
    'theorie-ch6': {
      colors: { surface: 'var(--surface,#fff)', line: 'var(--line,#dbe3e0)', ink: 'var(--ink,#152a31)', muted: 'var(--ink-3,#6d7b85)', accent: 'var(--teal,#0e7c86)', deep: 'var(--teal-deep,#0a616a)', ok: 'var(--ok,#2e7d46)' },
      secs: [
        ['s1', 'Les acquis d’apprentissage'],
        ['s2', 'L’évaluation : 20 / 40 / 40'],
        ['s3', 'Questions théoriques annoncées'],
        ['s4', 'Questions pratiques annoncées']
      ]
    }
  };

  var script = document.currentScript;
  var CH = script && script.dataset.ch;
  var conf = CONF[CH];
  if (!conf) return;
  var C = conf.colors;

  var els = conf.secs
    .map(function (s) { return { id: s[0], title: s[1], el: document.getElementById(s[0]) }; })
    .filter(function (s) { return s.el; });
  if (!els.length) return;

  /* ---------- styles ---------- */
  var css =
    '.sig-toc{display:none;position:fixed;left:18px;top:18px;width:302px;z-index:300;' +
      'max-height:calc(100vh - 92px);overflow-y:auto;background:' + C.surface + ';' +
      'border:1px solid ' + C.line + ';border-radius:14px;padding:16px 12px 18px;' +
      'box-shadow:0 1px 2px rgba(20,40,45,.05),0 4px 14px rgba(20,40,45,.08);' +
      'font:1rem/1.32 system-ui,"Segoe UI",Roboto,sans-serif}' +
    '@media(min-width:1280px){body{padding-left:352px}.sig-toc{display:block}}' +
    /* .ls est un simple div : les chapitres stylent parfois l'élément nav globalement */
    '.sig-toc .ls{display:flex;flex-direction:column;background:none;border:0;padding:0;margin:0}' +
    '.sig-toc .tt{font-size:.78rem;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:' + C.deep + ';margin:0 0 12px 14px}' +
    '.sig-toc a{display:flex;gap:12px;align-items:baseline;color:' + C.ink + ';text-decoration:none;' +
      'background:transparent;text-transform:none;letter-spacing:normal;white-space:normal;' +
      'font-size:1rem;font-weight:400;line-height:1.32;margin:0;' +
      'padding:10px 12px 10px 13px;border:0;border-left:3px solid ' + C.line + ';border-radius:0 9px 9px 0}' +
    '.sig-toc a .n{font-size:.78rem;font-weight:700;color:' + C.muted + ';flex-shrink:0;width:18px;text-align:center}' +
    '.sig-toc a:hover{color:' + C.deep + ';background:color-mix(in srgb,' + C.accent + ' 8%,transparent)}' +
    '.sig-toc a.done .n{color:' + C.ok + '}' +
    '.sig-toc a.active{color:' + C.deep + ';font-weight:700;border-left-color:' + C.accent + ';' +
      'background:color-mix(in srgb,' + C.accent + ' 14%,transparent)}' +
    '.sig-toc a.active .n{color:' + C.deep + '}' +
    '.sig-toc .pg{height:6px;border-radius:3px;background:' + C.line + ';margin:14px 14px 0;overflow:hidden}' +
    '.sig-toc .pg i{display:block;height:100%;width:0;background:' + C.accent + ';border-radius:3px;transition:width .25s}' +
    '.sig-toc .ct{font-size:.85rem;color:' + C.muted + ';margin:8px 0 0 14px}' +
    '.sig-toc .ct b{color:' + C.ok + '}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------- structure ---------- */
  var aside = document.createElement('aside');
  aside.className = 'sig-toc';
  aside.setAttribute('aria-label', 'Sommaire du chapitre');
  var html = '<p class="tt">Dans ce chapitre</p><div class="ls" role="navigation">';
  els.forEach(function (s, i) {
    html += '<a href="#' + s.id + '" data-sec="' + s.id + '"><span class="n">' + (i + 1) + '</span>' + s.title + '</a>';
  });
  html += '</div><div class="pg"><i></i></div><p class="ct"><b class="sn">0</b>/' + els.length + ' sections vues</p>';
  aside.innerHTML = html;
  document.body.appendChild(aside);

  var links = Array.prototype.slice.call(aside.querySelectorAll('a[data-sec]'));
  var bar = aside.querySelector('.pg i');
  var counter = aside.querySelector('.sn');

  /* ---------- position de lecture ---------- */
  function setActive(id) {
    links.forEach(function (l) { l.classList.toggle('active', l.dataset.sec === id); });
    var i = els.findIndex(function (s) { return s.id === id; });
    bar.style.width = Math.round(((i + 1) / els.length) * 100) + '%';
  }
  var tick = false;
  function spy() {
    if (tick) return; tick = true;
    requestAnimationFrame(function () {
      tick = false;
      var probe = window.innerHeight * 0.35;
      var cur = els[0];
      els.forEach(function (s) { if (s.el.getBoundingClientRect().top <= probe) cur = s; });
      setActive(cur.id);
    });
  }
  window.addEventListener('scroll', spy, { passive: true });
  window.addEventListener('resize', spy, { passive: true });
  spy();

  /* ---------- sections vues ---------- */
  var seen = {};
  function markSeen(id) {
    if (seen[id]) return;
    seen[id] = true;
    links.forEach(function (l) {
      if (l.dataset.sec !== id) return;
      l.classList.add('done');
      var n = l.querySelector('.n');
      if (n) n.textContent = '✓';
    });
    counter.textContent = Object.keys(seen).length;
  }
  try {
    var d = JSON.parse(localStorage.getItem(SEEN_KEY)) || {};
    (d[CH] || []).forEach(markSeen);
  } catch (e) { }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) markSeen(e.target.id); });
    }, { rootMargin: '0px 0px -55% 0px' });
    els.forEach(function (s) { io.observe(s.el); });
    window.addEventListener('scroll', function () {
      if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 60) markSeen(els[els.length - 1].id);
    }, { passive: true });
  }
})();
