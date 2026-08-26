/* ============================================================
   Théorie du cours — sommaire détaillé des 6 chapitres
   Chaque section est suivie à deux niveaux :
   · « vue »   — détectée automatiquement pendant la lecture
                 (tracker injecté dans les pages de chapitre,
                 stocké dans localStorage sig-tp-seen-v1)
   · « acquis » — cochée manuellement ici (Progress, 1 id/section)
   La progression du module = sections acquises / total.
   ============================================================ */
(function () {

  const SEEN_KEY = 'sig-tp-seen-v1';

  const CHAPTERS = [
    {
      id: 'theorie-ch1', num: 1, file: 'theorie/chapitre-1-introduction-sig.html',
      title: 'Introduction aux SIG', exos: 25,
      toc: [
        { a: 's1', t: "Pourquoi ce cours ? L'échec des projets IT" },
        { a: 's2', t: '« IT doesn\'t matter » & le Hype Cycle' },
        { a: 's3', t: 'Business Analyst & alignement stratégique' },
        { a: 's4', t: 'Données, information & pyramide DIKW' },
        { a: 's5', t: 'Système & définition du SIG' },
        { a: 's6', t: 'Les types de SIG : trois niveaux managériaux' },
        { a: 's7', t: 'SI fonctionnels & le problème des silos' },
        { a: 's8', t: 'Les systèmes intégrés : CRM, ERP, EAI' },
        { a: 'recap', t: "Récapitulatif : les priorités pour l'examen" },
        { a: 'training', t: "Exercices d'entraînement finaux" }
      ]
    },
    {
      id: 'theorie-ch2', num: 2, file: 'theorie/chapitre-2-sdlc.html',
      title: 'Le cycle de développement (SDLC)', exos: 27,
      toc: [
        { a: 's1', t: 'Les 7 phases du SDLC' },
        { a: 's2', t: 'Avantages du SDLC & triangle de gestion de projet' },
        { a: 's3', t: 'Waterfall : la cascade et ses limites' },
        { a: 's4', t: 'Le modèle agile & SCRUM' },
        { a: 's5', t: "Le Business Analyst et l'analyse métier" },
        { a: 's6', t: "L'ingénierie des exigences & MoSCoW" },
        { a: 's7', t: 'Pourquoi modéliser ? (le pont avec le chap. 1)' },
        { a: 'prio', t: "À maîtriser en priorité pour l'examen" },
        { a: 'train', t: "Exercices d'entraînement" }
      ]
    },
    {
      id: 'theorie-ch3', num: 3, file: 'theorie/chapitre-3-bpm.html',
      title: 'Gestion & modélisation des processus (BPM)', exos: 33,
      toc: [
        { a: 'p0', t: "Vue d'ensemble du chapitre" },
        { a: 'p1', t: 'Introduction à la gestion des processus métiers' },
        { a: 'p2', t: 'Modélisation des processus & BPMN' },
        { a: 'p3', t: 'Analyse et amélioration des processus' },
        { a: 'p4', t: 'Surveillance des processus' },
        { a: 'p5', t: 'Examen & entraînement' }
      ]
    },
    {
      id: 'theorie-ch4', num: 4, file: 'theorie/chapitre-4-architecture-entreprise.html',
      title: 'Architecture d\'entreprise : TOGAF & ArchiMate', exos: 41,
      toc: [
        { a: 's1', t: "Pourquoi l'architecture d'entreprise ?" },
        { a: 's2', t: 'La méthode TOGAF et son cycle ADM' },
        { a: 's3', t: 'ArchiMate : le langage et ses 3 couches' },
        { a: 's4', t: 'La couche Métier : les éléments ★' },
        { a: 's5', t: 'La couche Application : les éléments ★' },
        { a: 's6', t: 'Les 12 relations ArchiMate ★' },
        { a: 's7', t: "L'articulation inter-couches ★" },
        { a: 's8', t: "L'essentiel pour l'examen" },
        { a: 's9', t: "Exercices d'entraînement" }
      ]
    },
    {
      id: 'theorie-ch5', num: 5, file: 'theorie/chapitre-5-theories-si.html',
      title: 'Recherche & théories des SI', exos: 19,
      toc: [
        { a: 's1', t: "Qu'est-ce que la recherche scientifique ?" },
        { a: 's2', t: 'Une (bonne) théorie : types & 4 building blocks' },
        { a: 's3', t: 'La recherche en SI : une science sociale' },
        { a: 's4', t: "TRA — la Théorie de l'Action Raisonnée" },
        { a: 's5', t: 'TAM — Technology Acceptance Model' },
        { a: 's6', t: 'UTAUT — la théorie unifiée' },
        { a: 's7', t: 'UTAUT2 — le contexte consommateur' },
        { a: 's8', t: "L'essentiel pour l'examen & entraînement final" }
      ]
    },
    {
      id: 'theorie-ch6', num: 6, file: 'theorie/chapitre-6-conclusion-examen.html',
      title: 'Conclusion & préparation à l\'examen', exos: 0,
      toc: [
        { a: 's1', t: "Les acquis d'apprentissage" },
        { a: 's2', t: 'Comment serez-vous évalué·e ? (20/40/40)' },
        { a: 's3', t: 'Les questions théoriques annoncées' },
        { a: 's4', t: 'Les questions pratiques annoncées' }
      ]
    }
  ];

  const secId = (ch, a) => ch.id + ':' + a;
  const ALL_IDS = CHAPTERS.flatMap(ch => ch.toc.map(s => secId(ch, s.a)));

  function seenMap() {
    try { return JSON.parse(localStorage.getItem(SEEN_KEY)) || {}; } catch (e) { return {}; }
  }

  /* migration : anciens ids binaires theorie-chX (=1) → toutes les sections acquises */
  function migrate() {
    CHAPTERS.forEach(ch => {
      const old = Progress.get(ch.id);
      if (old != null) {
        if (old >= 1) ch.toc.forEach(s => Progress.set(secId(ch, s.a), 1));
        Progress.unset(ch.id);
      }
    });
  }

  APP.register('theorie', {
    title: 'Théorie du cours',
    short: 'Th',
    module: 'archi',
    ids: ALL_IDS,
    render(page) {
      migrate();
      const seen = seenMap();

      const totalSec = ALL_IDS.length;
      const acquired = ALL_IDS.filter(i => (Progress.get(i) || 0) >= 1).length;
      const seenCount = CHAPTERS.reduce((n, ch) =>
        n + ch.toc.filter(s => (seen[ch.id] || []).includes(s.a) || (Progress.get(secId(ch, s.a)) || 0) >= 1).length, 0);

      page.innerHTML = `
        <p class="eyebrow">Théorie · Les 6 chapitres du cours</p>
        <h1>Sommaire de la théorie — où en êtes-vous ?</h1>
        <p class="lead">Chaque chapitre est détaillé section par section. Cliquez sur une section pour l'ouvrir
        directement dans le chapitre. Pendant votre lecture, les sections traversées sont automatiquement marquées
        « vues » — puis revenez ici cocher « acquis » quand vous maîtrisez la matière.</p>

        <div class="stat-tiles" style="margin:18px 0">
          <div class="stat-tile"><b>${acquired}<span style="font-size:.9rem;color:var(--ink-3)">/${totalSec}</span></b><span>sections acquises</span></div>
          <div class="stat-tile"><b>${seenCount}<span style="font-size:.9rem;color:var(--ink-3)">/${totalSec}</span></b><span>sections vues</span></div>
          <div class="stat-tile"><b>${Math.round((acquired / totalSec) * 100)}%</b><span>théorie maîtrisée</span></div>
        </div>

        <section class="card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div style="flex:1;min-width:240px">
            <h3 style="margin:0 0 4px">Synthèse théorique — 47 pages, en PDF</h3>
            <p style="margin:0;font-size:.94rem;color:var(--ink-2)">Toute la matière théorique du cours en un
            seul document imprimable : les fondements des SIG, le SDLC et l'agile, la gestion des processus,
            TOGAF, les théories de l'acceptation — avec <b>tous les modèles redessinés</b>. Les notations BPMN
            et ArchiMate en sont exclues : elles s'entraînent dans les TP.</p>
          </div>
          <a class="btn btn-primary" href="Synthese-theorique-ECGEB210.pdf" download>Télécharger le PDF ↓</a>
        </section>

        <div class="toc-legend">
          <b>Légende :</b>
          <span><span class="toc-dot" style="display:inline-grid"></span> pas encore vue</span>
          <span><span class="toc-dot" style="display:inline-grid;border-color:var(--warn);background:color-mix(in srgb, var(--warn) 28%, var(--surface))"></span> vue (détectée pendant la lecture)</span>
          <span><span class="toc-dot" style="display:inline-grid;border-color:var(--ok);background:var(--ok)">✓</span> acquise (cochée par vous)</span>
        </div>

        <div id="ch-grid"></div>
        <hr class="sep">
        <p class="lead" style="font-size:.95rem">La théorie vue, place à la pratique : les
        <a href="#/tp1">TP BPMN</a> et le <a href="#/tp3">TP ArchiMate</a> couvrent les 40 % « exercices »
        de l'examen, et l'<a href="#/examen">examen blanc</a> vérifie les 40 % « théorie ».</p>
      `;

      const grid = page.querySelector('#ch-grid');
      CHAPTERS.forEach(ch => {
        const chSeen = seen[ch.id] || [];
        const acq = ch.toc.filter(s => (Progress.get(secId(ch, s.a)) || 0) >= 1).length;
        const pct = Math.round((acq / ch.toc.length) * 100);
        const allDone = acq === ch.toc.length;

        const card = document.createElement('section');
        card.className = 'card ch-card';
        card.innerHTML = `
          <div class="ch-head">
            <div class="ch-num ${allDone ? 'done' : ''}">${allDone ? '✓' : ch.num}</div>
            <div>
              <h3>Chapitre ${ch.num} — ${ch.title}</h3>
              <div class="ch-meta">
                <span class="bar"><i style="width:${pct}%"></i></span>
                <span class="cnt">${acq}/${ch.toc.length} acquises</span>
                ${ch.exos ? `<span>· ${ch.exos} exercices dans le chapitre</span>` : ''}
              </div>
            </div>
          </div>
          <div class="ch-actions">
            <a class="btn btn-primary" href="${ch.file}">Ouvrir le chapitre →</a>
            <button type="button" class="btn mark-all">${allDone ? 'Tout décocher' : 'Tout marquer acquis'}</button>
          </div>
          <div class="toc-list"></div>`;

        const list = card.querySelector('.toc-list');
        ch.toc.forEach(s => {
          const id = secId(ch, s.a);
          const isAcq = (Progress.get(id) || 0) >= 1;
          const isSeen = chSeen.includes(s.a);
          const row = document.createElement('div');
          row.className = 'toc-row' + (isAcq ? ' acquired' : isSeen ? ' seen' : '');
          row.innerHTML = `
            <span class="toc-dot">${isAcq ? '✓' : ''}</span>
            <a href="${ch.file}#${s.a}" title="Ouvrir cette section dans le chapitre">${s.t}</a>
            <span style="display:flex;align-items:center;gap:8px">
              <span class="toc-state">${isAcq ? 'acquise' : isSeen ? 'vue' : ''}</span>
              <button type="button" class="toc-check" aria-pressed="${isAcq}"
                aria-label="${isAcq ? 'Retirer « acquis » pour' : 'Marquer comme acquis :'} ${s.t}">
                ${isAcq ? '✓ Acquis' : 'Acquis ?'}</button>
            </span>`;
          row.querySelector('.toc-check').addEventListener('click', () => {
            if ((Progress.get(id) || 0) >= 1) Progress.unset(id);
            else Progress.set(id, 1);
            this.render(page);
            const el = page.querySelector('#' + CSS.escape(ch.id));
            if (el) el.scrollIntoView({ block: 'nearest' });
          });
          list.appendChild(row);
        });

        card.id = ch.id;
        card.querySelector('.mark-all').addEventListener('click', () => {
          if (allDone) ch.toc.forEach(s => Progress.unset(secId(ch, s.a)));
          else ch.toc.forEach(s => Progress.set(secId(ch, s.a), 1));
          this.render(page);
          const el = page.querySelector('#' + CSS.escape(ch.id));
          if (el) el.scrollIntoView({ block: 'nearest' });
        });

        grid.appendChild(card);
      });
    }
  });
})();
