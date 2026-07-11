/* ============================================================
   Accueil — parcours, progression, mode d'emploi
   ============================================================ */
APP.register('home', {
  title: 'Accueil',
  short: '⌂',
  module: 'bpmn',
  render(page) {
    const MODULES = [
      { route: 'bpmn', tag: 'Théorie', title: 'BPMN — l’essentiel', desc: 'Événements, tâches, gateways XOR/AND/OR, pools & lanes, sous-processus, boucles, événements frontière. Avec simulateur de jetons.', module: 'bpmn' },
      { route: 'tp1', tag: 'TP1', title: 'BPMN de base', desc: '6 exercices de lecture de diagrammes + 3 modélisations complètes (commande, plaintes, Event Bureau) résolues pas à pas.', module: 'bpmn' },
      { route: 'tp2', tag: 'TP2', title: 'BPMN avancé', desc: 'Hypothèques, recrutement, clients défaillants : gateway événementiel, multi-instances, timers frontière non-interruptibles.', module: 'bpmn' },
      { route: 'archimate', tag: 'Théorie', title: 'ArchiMate — l’essentiel', desc: 'Couches métier & application, tous les éléments de la fiche récapitulative, les 11 relations et leurs flèches.', module: 'archi' },
      { route: 'tp3', tag: 'TP3', title: 'ArchiMate', desc: 'Lire un modèle, chasser les erreurs de modélisation (2 diagrammes cliquables) et analyser un SI en consultant.', module: 'archi' },
      { route: 'examen', tag: 'Quiz', title: 'Examen blanc', desc: '20 questions mélangées sur toute la matière pour vérifier que vous êtes prêt·e.', module: 'bpmn' }
    ];

    page.innerHTML = `
      <div class="hero">
        <p class="eyebrow">Systèmes d’information de gestion · ECGEB210 · Université de Namur</p>
        <h1>Comprendre — et réussir — les TP BPMN &amp; ArchiMate</h1>
        <p class="lead">Toute la matière des TP, transformée en parcours interactif : chaque énoncé officiel,
        chaque diagramme de correction redessiné et expliqué pas à pas, et des exercices
        pour vérifier que vous avez vraiment compris.</p>
        <div class="btn-row">
          <a class="btn btn-primary" href="#/bpmn">Commencer par la théorie BPMN</a>
          <a class="btn" href="#/examen">Tester mon niveau</a>
        </div>
      </div>
      <div class="ring-wrap" id="stats"></div>
      <h2>Votre parcours</h2>
      <p class="lead">L’ordre conseillé suit celui du cours : théorie BPMN → TP1 → TP2, puis théorie ArchiMate → TP3, et l’examen blanc pour finir.</p>
      <div class="module-grid" id="modules"></div>

      <hr class="sep">
      <h2>Comment travailler avec ce site ?</h2>
      <div class="grid-2">
        ${H.callout('key', '1', '<b>Essayez avant de regarder.</b> Pour chaque exercice, répondez d’abord par vous-même (les énoncés sont ceux des TP officiels). La correction ne vous apprend quelque chose que si vous vous êtes d’abord trompé·e tout seul·e.')}
        ${H.callout('key', '2', '<b>Suivez les solutions pas à pas.</b> Les diagrammes de correction se construisent étape par étape : à chaque étape, demandez-vous <i>pourquoi</i> cet élément (ce gateway, cet événement) et pas un autre.')}
        ${H.callout('key', '3', '<b>Validez avec les quiz.</b> Chaque notion est suivie de questions. Un module est « réussi » quand tous ses exercices sont faits — visez le vert dans la barre latérale.')}
        ${H.callout('key', '4', '<b>Révisez avec l’examen blanc.</b> La veille de l’examen, refaites l’examen blanc : il pioche dans les pièges classiques des trois TP.')}
      </div>
      <p class="footer-note">Contenu construit à partir des supports officiels du cours : TP1 &amp; TP2 (BPMN), TP3 (ArchiMate),
      fiche récapitulative ArchiMate et slides de théorie (3_BPM, 4_EA). Ce site est un outil d’entraînement — en cas de doute, les supports du cours font foi.</p>
    `;

    // cartes modules
    const grid = page.querySelector('#modules');
    MODULES.forEach(m => {
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
