/* ============================================================
   Théorie du cours — hub des 6 chapitres
   Les chapitres 1-5 sont des apps HTML autonomes (dossier
   theorie/) ; le chapitre 6 synthétise la conclusion & l'examen.
   ============================================================ */
(function () {

  const CHAPTERS = [
    {
      id: 'theorie-ch1', exos: 25, num: 1, file: 'theorie/chapitre-1-introduction-sig.html',
      title: 'Introduction aux SIG',
      blurb: 'Pourquoi les projets IT échouent, données vs information (DIKW), définition et types de SIG, silos fonctionnels, et les systèmes intégrés CRM / ERP / EAI.',
      tags: ['DIKW', 'Types de SIG', 'CRM · ERP · EAI']
    },
    {
      id: 'theorie-ch2', exos: 27, num: 2, file: 'theorie/chapitre-2-sdlc.html',
      title: 'Le cycle de développement (SDLC)',
      blurb: 'Les 7 phases du SDLC, le triangle de gestion de projet, waterfall vs agile/SCRUM, le rôle du Business Analyst et l’ingénierie des exigences (MoSCoW).',
      tags: ['7 phases', 'Waterfall vs Agile', 'MoSCoW']
    },
    {
      id: 'theorie-ch3', exos: 33, num: 3, file: 'theorie/chapitre-3-bpm.html',
      title: 'Gestion & modélisation des processus (BPM)',
      blurb: 'Le cycle de vie BPM, la modélisation BPMN, l’analyse (Lean, valeur ajoutée, root-cause) et l’amélioration des processus (heuristiques de redesign), la surveillance.',
      tags: ['Cycle BPM', 'Lean', 'Redesign']
    },
    {
      id: 'theorie-ch4', exos: 41, num: 4, file: 'theorie/chapitre-4-architecture-entreprise.html',
      title: 'Architecture d’entreprise : TOGAF & ArchiMate',
      blurb: 'Pourquoi l’AE, le cycle ADM de TOGAF phase par phase, les 3 couches ArchiMate, tous les éléments métier & application et les 12 relations.',
      tags: ['TOGAF ADM', '3 couches', '12 relations']
    },
    {
      id: 'theorie-ch5', exos: 21, num: 5, file: 'theorie/chapitre-5-theories-si.html',
      title: 'Recherche & théories des SI',
      blurb: 'Ce qu’est une bonne théorie (4 building blocks), puis la lignée TRA → TAM → UTAUT → UTAUT2 : les modèles d’acceptation des technologies à connaître pour l’examen.',
      tags: ['TAM', 'UTAUT / UTAUT2', 'Building blocks']
    },
    {
      id: 'theorie-ch6', num: 6, file: 'theorie/chapitre-6-conclusion-examen.html',
      title: 'Conclusion & préparation à l’examen',
      blurb: 'Les acquis d’apprentissage, la grille d’évaluation (20/40/40) et surtout les types de questions annoncés pour l’examen, partie par partie, avec où s’entraîner sur ce site.',
      tags: ['Évaluation 20/40/40', 'Questions annoncées']
    }
  ];

  APP.register('theorie', {
    title: 'Théorie du cours',
    short: 'Th',
    module: 'archi',
    ids: CHAPTERS.map(c => c.id),
    render(page) {
      page.innerHTML = `
        <p class="eyebrow">Théorie · Les 6 chapitres du cours</p>
        <h1>Théorie du cours — chapitre par chapitre</h1>
        <p class="lead">Les cinq chapitres de cours magistral, chacun sous forme d'application de révision complète
        (résumés interactifs + exercices), et la conclusion orientée examen. Ouvrez un chapitre, travaillez-le,
        puis marquez-le comme terminé pour suivre votre progression ici.</p>
        ${H.callout('info', 'i', `Ces chapitres s'ouvrent comme des pages dédiées — le bouton flottant
          <b>« ← Parcours SIG »</b> vous ramène ici. Votre case « terminé » est le seul
          suivi partagé : les quiz internes des chapitres ont leur propre logique.`)}
        <div id="ch-grid"></div>
        <hr class="sep">
        <p class="lead" style="font-size:.95rem">La théorie vue, place à la pratique : les
        <a href="#/tp1">TP BPMN</a> et le <a href="#/tp3">TP ArchiMate</a> couvrent les 40 % « exercices »
        de l'examen, et l'<a href="#/examen">examen blanc</a> vérifie les 40 % « théorie ».</p>
      `;

      const grid = page.querySelector('#ch-grid');
      CHAPTERS.forEach(c => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.display = 'grid';
        card.style.gridTemplateColumns = '52px 1fr auto';
        card.style.gap = '18px';
        card.style.alignItems = 'start';

        const done = (Progress.get(c.id) || 0) >= 1;
        card.innerHTML = `
          <div style="width:52px;height:52px;border-radius:12px;display:grid;place-items:center;
            font-family:var(--font-display);font-size:1.5rem;font-weight:700;
            background:${done ? 'var(--ok)' : 'var(--accent-soft)'};
            color:${done ? 'var(--on-accent)' : 'var(--accent-deep)'}">${done ? '✓' : c.num}</div>
          <div>
            <h3 style="margin:.1em 0 .3em">Chapitre ${c.num} — ${c.title}</h3>
            <p style="margin:.2em 0 .6em;font-size:.92rem;color:var(--ink-2)">${c.blurb}</p>
            <div class="pill-row" style="margin:0 0 10px">${c.tags.map(t => `<span class="tag tag-neutral">${t}</span>`).join('')}${c.exos ? `<span class="tag">${c.exos} exercices intégrés</span>` : ''}</div>
            <div class="btn-row" style="margin-top:6px">
              <a class="btn btn-primary" href="${c.file}">Ouvrir le chapitre →</a>
              <button type="button" class="btn mark-done" ${done ? 'disabled' : ''}>${done ? '✓ Terminé' : 'Marquer comme terminé'}</button>
            </div>
          </div>`;
        const btn = card.querySelector('.mark-done');
        btn.addEventListener('click', () => {
          Progress.set(c.id, 1);
          this.render(page); // re-render pour rafraîchir les états
        });
        grid.appendChild(card);
      });
    }
  });
})();
