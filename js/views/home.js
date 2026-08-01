/* ============================================================
   Accueil — la théorie et la pratique à parts égales,
   puis l'examen. Reflète la pondération réelle du cours :
   examen écrit = 40 % théorie + 40 % modélisation.
   ============================================================ */
APP.register('home', {
  title: 'Accueil',
  short: '⌂',
  module: 'bpmn',
  render(page) {
    const SECTIONS = [
      {
        title: 'La théorie du cours',
        tagline: '40 % de l\'examen écrit — questions de théorie et mises en situation',
        blurb: 'Les 6 chapitres du cours magistral, transformés en apps de révision interactives : ' +
          'lisez, manipulez les modèles, cochez vos acquis section par section.',
        modules: [
          { route: 'theorie', tag: '6 chapitres', title: 'Théorie du cours — le sommaire', desc: 'SIG & systèmes intégrés, SDLC & agile, BPM, TOGAF/ArchiMate, théories des SI (TAM, UTAUT…), préparation à l\'examen — avec suivi de lecture et d\'acquisition par section.', module: 'archi' }
        ]
      },
      {
        title: 'La pratique — BPMN & ArchiMate',
        tagline: '40 % de l\'examen écrit — exercices de modélisation',
        blurb: 'Tous les TP officiels résolus et expliqués : chaque énoncé, chaque correction redessinée ' +
          'et construite pas à pas, avec des exercices interactifs pour vérifier vos réflexes.',
        modules: [
          { route: 'bpmn', tag: 'Notation', title: 'BPMN — l\'essentiel', desc: 'Événements, tâches, gateways XOR/AND/OR, pools & lanes, sous-processus, boucles, événements frontière. Avec simulateur de jetons.', module: 'bpmn' },
          { route: 'tp1', tag: 'TP1', title: 'BPMN de base', desc: '6 exercices de lecture de diagrammes + 3 modélisations complètes résolues pas à pas.', module: 'bpmn' },
          { route: 'tp2', tag: 'TP2', title: 'BPMN avancé', desc: 'Gateway événementiel, multi-instances, timers frontière non-interruptibles : les 3 exercices du TP2.', module: 'bpmn' },
          { route: 'archimate', tag: 'Notation', title: 'ArchiMate — l\'essentiel', desc: 'Couches métier & application, tous les éléments de la fiche récapitulative, les relations et leurs flèches.', module: 'archi' },
          { route: 'tp3', tag: 'TP3', title: 'ArchiMate', desc: 'Lire un modèle, chasser les erreurs de modélisation et analyser un SI en consultant.', module: 'archi' }
        ]
      },
      {
        title: 'L\'examen',
        tagline: 'S\'entraîner dans les conditions réelles',
        blurb: 'D\'abord l\'examen type au format réel (vrai/faux justifiés, questions ouvertes, ' +
          'modélisations) — puis l\'examen blanc pour un dernier tour rapide des pièges en QCM.',
        modules: [
          { route: 'examen-type', tag: 'Format réel', title: 'Examen type', desc: 'Le format des vraies questions : V/F à justifier, questions ouvertes larges (UTAUT vs UTAUT2…), mise en situation agile/SCRUM, 2 modélisations BPMN et un modèle ArchiMate à commenter.', module: 'bpmn' },
          { route: 'examen', tag: 'QCM', title: 'Examen blanc', desc: '20 questions mélangées sur toute la matière pour vérifier que vous êtes prêt·e.', module: 'archi' }
        ]
      }
    ];

    page.innerHTML = `
      <div class="hero">
        <p class="eyebrow">Systèmes d'information de gestion · ECGEB210 · Université de Namur</p>
        <h1>Réussir le cours : la théorie et la pratique, à parts égales</h1>
        <p class="lead">L'examen écrit pèse 80 % de la note — <b>40 % de théorie</b> et
        <b>40 % de modélisation BPMN &amp; ArchiMate</b>. Ce site couvre les deux au même niveau :
        les 6 chapitres du cours en apps interactives, tous les TP corrigés pas à pas,
        et un examen type au format réel pour se tester.</p>
        <div class="btn-row">
          <a class="btn btn-primary" href="#/theorie">Commencer la théorie</a>
          <a class="btn btn-primary" href="#/bpmn">S'entraîner en pratique</a>
          <a class="btn" href="#/examen-type">Passer l'examen type</a>
        </div>
      </div>
      <div class="ring-wrap" id="stats"></div>
      <div id="sections"></div>

      <hr class="sep">
      <h2>Comment travailler avec ce site ?</h2>
      <div class="grid-2">
        ${H.callout('key', '1', '<b>Menez théorie et pratique de front.</b> L\'ordre du cours : un chapitre de théorie, puis les TP qui s\'y rapportent (BPM → TP1-TP2, architecture d\'entreprise → TP3). Les deux pèsent le même poids à l\'examen.')}
        ${H.callout('key', '2', '<b>Essayez avant de regarder.</b> Pour chaque exercice, répondez d\'abord par vous-même — les énoncés sont ceux des supports officiels. La correction ne vous apprend quelque chose que si vous vous êtes d\'abord trompé·e tout seul·e.')}
        ${H.callout('key', '3', '<b>Cochez ce que vous maîtrisez.</b> Sections de théorie « vues » puis « acquises », exercices réussis : visez le vert partout dans la barre latérale avant la session.')}
        ${H.callout('key', '4', '<b>Terminez par l\'examen type.</b> Sur papier, sans notes : vrai/faux justifiés, questions ouvertes, modélisations. Puis l\'examen blanc en QCM pour traquer les derniers pièges.')}
      </div>
      <p class="footer-note">Contenu construit à partir des supports officiels du cours : slides des 6 chapitres,
      TP1 &amp; TP2 (BPMN), TP3 (ArchiMate) et fiche récapitulative ArchiMate. Ce site est un outil
      d'entraînement — en cas de doute, les supports du cours font foi.</p>
    `;

    // sections théorie / pratique / examen
    const secBox = page.querySelector('#sections');
    SECTIONS.forEach(sec => {
      const ids = sec.modules.flatMap(m => (APP.pages[m.route] && APP.pages[m.route].ids) || []);
      const st = ids.length ? Progress.moduleStats(ids) : null;
      const head = document.createElement('div');
      head.innerHTML = `
        <h2 style="margin-bottom:2px">${sec.title}
          ${st ? `<span class="tag ${st.pct === 100 ? 'tag-ok' : ''}" style="margin-left:10px">${st.pct}%</span>` : ''}
        </h2>
        <p class="eyebrow" style="margin:0 0 6px">${sec.tagline}</p>
        <p class="lead" style="font-size:.98rem;margin-bottom:10px">${sec.blurb}</p>`;
      secBox.appendChild(head);

      const grid = document.createElement('div');
      grid.className = 'module-grid';
      sec.modules.forEach(m => {
        const def = APP.pages[m.route];
        const stats = def && def.ids ? Progress.moduleStats(def.ids) : null;
        const a = document.createElement('a');
        a.className = 'module-card';
        a.href = '#/' + m.route;
        a.dataset.module = m.module;
        a.innerHTML = `
          <span class="tag">${m.tag}</span>
          <h3>${m.title}</h3>
          <span class="mc-desc">${m.desc}</span>
          <span class="mc-meta">
            <span class="bar"><i style="width:${stats ? stats.pct : 0}%"></i></span>
            <span>${stats ? stats.done + '/' + stats.total : ''}</span>
          </span>`;
        grid.appendChild(a);
      });
      secBox.appendChild(grid);
    });

    // tuiles de stats globales
    const allIds = Object.values(APP.pages).flatMap(p => p.ids || []);
    const s = Progress.moduleStats(allIds);
    page.querySelector('#stats').innerHTML = `
      <div class="stat-tiles">
        <div class="stat-tile"><b>${s.done}<span style="font-size:.9rem;color:var(--ink-3)">/${s.total}</span></b><span>Exercices faits</span></div>
        <div class="stat-tile"><b>${s.pct}%</b><span>Parcours couvert</span></div>
        <div class="stat-tile"><b>${s.done ? Math.round(s.score * 100) + '%' : '—'}</b><span>Score moyen</span></div>
      </div>`;
  }
});
