/* ============================================================
   Théorie BPMN — l'essentiel pour réussir les TP
   Basé sur 3_BPM.pdf (pp. 41-66) et le rappel théorique du TP1.
   ============================================================ */
(function () {

  const IDS = ['bpmn-not-ev', 'bpmn-not-fl', 'bpmn-gw-sim', 'bpmn-gw-q', 'bpmn-pool-q', 'bpmn-frontiere', 'bpmn-quiz1', 'bpmn-quiz2', 'bpmn-quiz3'];

  /* --- mini-figures de notation (SVG) --- */
  function figEvent(kind, event) {
    return BPMN.fig((svg, el) => {
      BPMN.drawEvent(el('g', {}, svg), { type: kind, event, x: 60, y: 33, r: kind === 'catch' || kind === 'throw' ? 17 : 16 });
    }, 120, 66);
  }
  function figTask(opts) {
    return BPMN.fig((svg, el) => {
      BPMN.drawTask(el('g', {}, svg), Object.assign({ x: 70, y: 34, w: 110, h: 50 }, opts));
    }, 140, 68);
  }
  function figGateway(gw) {
    return BPMN.fig((svg, el) => {
      BPMN.drawGateway(el('g', {}, svg), { x: 60, y: 34, s: 24, gw });
    }, 120, 68);
  }
  function figFlow(type) {
    return BPMN.fig((svg, el) => {
      const defs = el('defs', {}, svg);
      const m1 = el('marker', { id: 'ff-' + type + '-a', markerWidth: 11, markerHeight: 9, refX: 9.5, refY: 4.5, orient: 'auto' }, defs);
      if (type === 'seq') el('path', { d: 'M 0 0 L 10 4.5 L 0 9 Z', fill: BPMN.INK }, m1);
      else el('path', { d: 'M 0.5 0.5 L 10.5 5 L 0.5 9.5 Z', fill: '#fff', stroke: BPMN.INK, 'stroke-width': 1.1 }, m1);
      const p = el('path', {
        d: 'M 15 33 L 105 33', stroke: BPMN.INK, fill: 'none',
        'stroke-width': type === 'assoc' ? 1.3 : 1.7,
        'marker-end': type === 'assoc' ? '' : `url(#ff-${type}-a)`
      }, svg);
      if (type === 'msg') { p.setAttribute('stroke-dasharray', '5 4'); el('circle', { cx: 13, cy: 33, r: 3.4, fill: '#fff', stroke: BPMN.INK, 'stroke-width': 1.2 }, svg); }
      if (type === 'assoc') p.setAttribute('stroke-dasharray', '2.5 3.5');
    }, 120, 66);
  }

  function notCard(grid, fig, name, desc) {
    const c = document.createElement('div');
    c.className = 'notation-card';
    const f = document.createElement('div'); f.className = 'nc-fig';
    f.appendChild(fig);
    c.appendChild(f);
    c.insertAdjacentHTML('beforeend', `<div class="nc-name">${name}</div><div class="nc-desc">${desc}</div>`);
    grid.appendChild(c);
  }

  /* --- diagramme fil rouge : Demande de Subside (3_BPM p.41) --- */
  const SUBSIDE = {
    w: 1150, h: 500,
    pools: [
      { x: 30, y: 20, w: 1090, h: 70, label: 'Citoyen' },
      { x: 30, y: 130, w: 1090, h: 340, label: 'Région Wallonne' }
    ],
    nodes: [
      { id: 'st', type: 'start', event: 'message', x: 110, y: 330, label: 'Réception Demande Subside', lw: 16 },
      { id: 'ec', type: 'task', x: 235, y: 330, w: 112, h: 58, label: 'Evaluer Complétude de la Demande' },
      { id: 'g1', type: 'gateway', gw: 'xor', x: 355, y: 330, label: 'Demande Complète ?', ldy: 52, lw: 18 },
      { id: 'dim', type: 'task', x: 480, y: 215, w: 116, h: 56, label: 'Demande Informations Manquantes', icon: 'send' },
      { id: 'ri', type: 'catch', event: 'message', x: 610, y: 215, label: 'Réception Infos' },
      { id: 'g2', type: 'gateway', gw: 'xor', x: 610, y: 330 },
      { id: 'ed', type: 'task', x: 725, y: 330, w: 108, h: 58, label: 'Evaluer la Demande' },
      { id: 'g3', type: 'gateway', gw: 'xor', x: 840, y: 330, label: 'Demande Acceptée?', ldy: 52, lw: 18 },
      { id: 'cr', type: 'task', x: 950, y: 215, w: 110, h: 56, label: 'Communication du Refus', icon: 'send' },
      { id: 'fr', type: 'end', x: 1065, y: 215, label: 'Demande Refusée', lw: 14 },
      { id: 'es', type: 'task', x: 950, y: 330, w: 110, h: 58, label: 'Enregistrement du Subside Accordé' },
      { id: 'ca', type: 'task', x: 950, y: 425, w: 110, h: 54, label: 'Communication Acceptation', icon: 'send' },
      { id: 'fa', type: 'end', x: 1065, y: 425, label: 'Demande Acceptée', lw: 14 }
    ],
    flows: [
      { from: 'st', to: 'ec' },
      { from: 'ec', to: 'g1' },
      { id: 'fnon', from: 'g1', to: 'dim', points: [[355, 307], [355, 215], [422, 215]], label: 'Non', lx: 372, ly: 250 },
      { from: 'dim', to: 'ri' },
      { id: 'fri', from: 'ri', to: 'g2', points: [[610, 232], [610, 307]] },
      { id: 'foui', from: 'g1', to: 'g2', points: [[378, 330], [587, 330]], label: 'Oui', lx: 420, ly: 320 },
      { from: 'g2', to: 'ed' },
      { from: 'ed', to: 'g3' },
      { id: 'fref', from: 'g3', to: 'cr', points: [[840, 307], [840, 215], [895, 215]], label: 'Non', lx: 858, ly: 250 },
      { from: 'cr', to: 'fr' },
      { id: 'facc', from: 'g3', to: 'es', points: [[863, 330], [895, 330]], label: 'Oui', lx: 878, ly: 318 },
      { id: 'fes', from: 'es', to: 'ca', points: [[950, 359], [950, 398]] },
      { from: 'ca', to: 'fa' },
      { id: 'm1', from: 'st', to: 'st', type: 'msg', points: [[110, 90], [110, 313]] },
      { id: 'm2', from: 'dim', to: 'dim', type: 'msg', points: [[480, 187], [480, 90]] },
      { id: 'm3', from: 'ri', to: 'ri', type: 'msg', points: [[610, 90], [610, 198]] },
      { id: 'm4', from: 'cr', to: 'cr', type: 'msg', points: [[978, 187], [978, 90]] },
      { id: 'm5', from: 'ca', to: 'ca', type: 'msg', points: [[978, 398], [1010, 398], [1010, 105], [1010, 90]] }
    ]
  };

  /* --- simulateur de gateways --- */
  function buildSimSpec(kind) {
    const lbl = { xor: 'XOR', and: 'AND', or: 'OR' }[kind];
    return {
      w: 720, h: 300,
      nodes: [
        { id: 's', type: 'start', x: 45, y: 150 },
        { id: 'a', type: 'task', x: 140, y: 150, w: 95, h: 52, label: 'Tâche A' },
        { id: 'gs', type: 'gateway', gw: kind, x: 255, y: 150, label: lbl + ' (séparation)', ldy: 56, lw: 14 },
        { id: 'b', type: 'task', x: 390, y: 70, w: 95, h: 52, label: 'Tâche B' },
        { id: 'c', type: 'task', x: 390, y: 230, w: 95, h: 52, label: 'Tâche C' },
        { id: 'gj', type: 'gateway', gw: kind, x: 520, y: 150, label: lbl + ' (fusion)', ldy: 56, lw: 14 },
        { id: 'd', type: 'task', x: 625, y: 150, w: 95, h: 52, label: 'Tâche D' },
        { id: 'e', type: 'end', x: 700, y: 150 }
      ],
      flows: [
        { id: 'f-sa', from: 's', to: 'a' },
        { id: 'f-ag', from: 'a', to: 'gs' },
        { id: 'f-gb', from: 'gs', to: 'b', points: [[255, 127], [255, 70], [342, 70]] },
        { id: 'f-gc', from: 'gs', to: 'c', points: [[255, 173], [255, 230], [342, 230]] },
        { id: 'f-bj', from: 'b', to: 'gj', points: [[438, 70], [520, 70], [520, 127]] },
        { id: 'f-cj', from: 'c', to: 'gj', points: [[438, 230], [520, 230], [520, 173]] },
        { id: 'f-jd', from: 'gj', to: 'd' },
        { id: 'f-de', from: 'd', to: 'e' }
      ]
    };
  }

  APP.register('bpmn', {
    title: 'Théorie · BPMN',
    short: 'B',
    module: 'bpmn',
    ids: IDS,
    render(page) {
      page.innerHTML = `
        <p class="eyebrow">Théorie · Business Process Model and Notation</p>
        <h1>BPMN — le langage des processus métier</h1>
        <p class="lead">Un <b>processus métier</b> est « un ensemble d'événements, d'activités et de décisions impliquant
        des acteurs et des ressources qui collectivement mènent à un résultat de valeur pour l'organisation et ses clients »
        — pensez à une demande de job étudiant ou à une inscription à l'université. <b>BPMN</b> est la notation standard pour
        les modéliser : un langage graphique compris par le métier comme par l'informatique.</p>
        <div id="s-symbols"></div>
        <div id="s-flows"></div>
        <div id="s-pools"></div>
        <div id="s-gateways"></div>
        <div id="s-token"></div>
        <div id="s-sub"></div>
        <div id="s-frontiere"></div>
        <div id="s-quiz"></div>
      `;

      /* ================= 1. Événements & activités ================= */
      let s = page.querySelector('#s-symbols');
      s.innerHTML = `<h2>1 · Événements et activités</h2>
        <p>Un modèle BPMN <b>doit</b> contenir au moins un événement de début et au moins un événement de fin
        (il <b>peut</b> en avoir plusieurs — p.ex. « Demande acceptée » / « Demande refusée »).
        Une <b>activité</b> (tâche) représente une unité de travail « qui peut prendre du temps », réalisée par une personne,
        un système ou les deux. Un événement, lui, se produit « à un instant T », instantanément.</p>`;
      let grid = document.createElement('div');
      grid.className = 'notation-grid';
      s.appendChild(grid);
      notCard(grid, figEvent('start', 'none'), 'Début (none)', 'Cercle à trait fin : le processus démarre, sans précision sur le déclencheur.');
      notCard(grid, figEvent('start', 'message'), 'Début message', 'Le processus démarre à la réception d’un message (demande, formulaire, email…).');
      notCard(grid, figEvent('start', 'timer'), 'Début timer', 'Le processus démarre à un moment particulier (8h00, tous les matins…).');
      notCard(grid, figEvent('end', 'none'), 'Fin', 'Cercle à trait épais : ce chemin du processus se termine (le jeton est consommé).');
      notCard(grid, figEvent('end', 'terminate'), 'Fin terminate', 'Disque noir : détruit TOUS les jetons — toute l’instance s’arrête immédiatement.');
      notCard(grid, figTask({ label: 'Evaluer Demande' }), 'Tâche', 'Rectangle arrondi : une unité de travail. Atomique ou non, elle peut durer.');
      notCard(grid, figTask({ label: 'Envoyer offre', icon: 'send' }), 'Tâche d’envoi', 'Enveloppe noire : envoie un message (throw) à la fin de l’activité.');
      notCard(grid, figTask({ label: 'Recevoir docs', icon: 'receive' }), 'Tâche de réception', 'Enveloppe blanche : attend un message (catch) avant de s’exécuter.');
      notCard(grid, figEvent('catch', 'message'), 'Intermédiaire catch', 'Double cercle, enveloppe blanche : ATTEND la réception d’un message.');
      notCard(grid, figEvent('throw', 'message'), 'Intermédiaire throw', 'Double cercle, enveloppe noire : SIGNALE l’envoi d’un message.');
      notCard(grid, figEvent('catch', 'timer'), 'Intermédiaire timer', 'Attente d’une durée ou d’un moment (« 2 semaines », « 8h00 »). Toujours catch.');
      s.insertAdjacentHTML('beforeend', H.callout('key', '★',
        `<b>Throw vs catch — le réflexe TP :</b> enveloppe <b>noire</b> = j'envoie (throw), enveloppe <b>blanche</b> = j'attends (catch).
        La même logique s'applique aux tâches d'envoi/réception — c'est la notation « alternative » aux événements de message.`));
      QUIZ.qcm(s, {
        id: 'bpmn-not-ev',
        question: 'Quiz éclair — un processus doit attendre 2 semaines la réponse d’un client. Quel symbole ?',
        options: [
          { t: 'Une tâche « Attendre 2 semaines »', why: 'Une tâche représente du TRAVAIL. Attendre n’est pas un travail : c’est un événement.' },
          { t: 'Un événement intermédiaire timer (catch) « 2 semaines »', ok: true, why: 'L’attente d’une durée = timer intermédiaire. Les timers sont toujours « catch ».' },
          { t: 'Un événement intermédiaire timer (throw)', why: 'Les timers ne peuvent pas être « throw » : on ne « lance » pas le temps, on l’attend.' }
        ]
      });

      /* ================= 2. Les flux ================= */
      s = page.querySelector('#s-flows');
      s.innerHTML = `<h2>2 · Les connecteurs : sequence flow, message flow, association</h2>`;
      grid = document.createElement('div');
      grid.className = 'notation-grid';
      s.appendChild(grid);
      notCard(grid, figFlow('seq'), 'Sequence flow', 'Trait plein, pointe pleine : l’ordre d’exécution DANS un pool (peut traverser les lanes).');
      notCard(grid, figFlow('msg'), 'Message flow', 'Pointillé, rond au départ, pointe ouverte : un échange d’information ENTRE deux pools.');
      notCard(grid, figFlow('assoc'), 'Association', 'Petit pointillé : relie un artefact (objet de données, annotation) au flux.');
      s.insertAdjacentHTML('beforeend', H.callout('warn', '!',
        `<b>LA règle qui tombe à chaque TP :</b> un flux de séquence ne peut <b>pas</b> sortir d'une piscine (pool),
         mais il <b>peut</b> traverser des corridors (lanes). Entre deux pools : flux de <b>message</b> uniquement.
         C'est exactement le piège de l'exercice 4 du TP1.`));
      QUIZ.qcm(s, {
        id: 'bpmn-not-fl',
        question: 'La tâche « Analyse Fondement » (lane SPW Territoire) doit être suivie de « Analyse Financière » (lane SPW Finances), les deux lanes appartenant au pool « SPW ». Quel connecteur ?',
        options: [
          { t: 'Un message flow, car on change de lane', why: 'Le message flow ne sert qu’ENTRE pools. Ici on reste dans le pool SPW.' },
          { t: 'Un sequence flow, car on reste dans le même pool', ok: true, why: 'Le sequence flow traverse librement les lanes d’un même pool.' },
          { t: 'Les deux sont acceptés', why: 'Non : dans un même pool, le message flow est interdit.' }
        ]
      });

      /* ================= 3. Pools & exemple fil rouge ================= */
      s = page.querySelector('#s-pools');
      s.innerHTML = `<h2>3 · Pools, lanes et black box — l'exemple « Demande de Subside »</h2>
        <p>Une <b>piscine (pool)</b> représente un acteur (« Citoyen », « ONEM ») ou un processus. Un pool peut être découpé
        en <b>corridors (lanes)</b> : unités ou rôles internes (départements, acheteur/vendeur…). Un pool <b>black box</b>
        est laissé vide : on ne modélise que ses interactions (messages), pas son fonctionnement interne —
        c'est presque toujours le cas du pool « Client ».</p>
        <p>Ce diagramme du cours combine tout ce qu'on a vu : événements de message, tâches d'envoi,
        XOR de décision et de convergence, 5 flux de messages vers le citoyen (black box) :</p>`;
      const cv = H.canvas('Demande de Subside — l’exemple fil rouge du cours (3_BPM, p. 41)');
      s.appendChild(cv.panel);
      BPMN.render(cv.scroll, SUBSIDE, { alt: 'Processus de demande de subside : pool Citoyen black box et pool Région Wallonne' });
      cv.panel.insertAdjacentHTML('beforeend', `<div class="dg-caption">Lisez-le à voix haute : « À la réception d'une demande,
        la Région évalue sa complétude. Si incomplète, elle demande les informations manquantes au citoyen et attend sa réponse.
        Une fois la demande complète, elle est évaluée : refus communiqué, ou subside enregistré puis acceptation communiquée. »</div>`);
      QUIZ.qcm(s, {
        id: 'bpmn-pool-q',
        question: 'Dans ce diagramme, pourquoi « Réception Infos » est-il un événement intermédiaire catch (enveloppe blanche) et non une tâche ?',
        options: [
          { t: 'Parce que c’est plus joli', why: 'Non — chaque symbole a une sémantique précise.' },
          { t: 'Parce que le processus ATTEND passivement la réponse du citoyen : ce n’est pas un travail, c’est un événement attendu', ok: true, why: 'Attendre un message = catch. On aurait aussi pu utiliser une tâche de réception (notation alternative).' },
          { t: 'Parce qu’un pool ne peut pas contenir deux tâches consécutives', why: 'Aucune règle de ce genre n’existe.' }
        ]
      });

      /* ================= 4. Gateways ================= */
      s = page.querySelector('#s-gateways');
      s.innerHTML = `<h2>4 · Les gateways — la logique du processus</h2>
        <p>Les <b>branchements (gateways)</b> ne représentent pas du travail mais la <b>logique</b> : choisir un chemin,
        déclencher des branches parallèles, ou attendre plusieurs flux. Chaque type existe en <b>séparation</b> (split)
        et en <b>fusion</b> (join) — et c'est la fusion qu'on rate le plus souvent en TP.</p>`;
      grid = document.createElement('div');
      grid.className = 'notation-grid';
      s.appendChild(grid);
      notCard(grid, figGateway('xor'), 'Exclusif (XOR)', 'Une seule branche sera suivie. Fusion : s’active dès qu’UNE branche entrante est terminée.');
      notCard(grid, figGateway('and'), 'Parallèle (AND)', 'Toutes les branches sont suivies en parallèle. Fusion : attend TOUTES les branches.');
      notCard(grid, figGateway('or'), 'Inclusif (OR)', 'Une OU plusieurs branches selon les conditions. Fusion : attend toutes les branches actives.');
      notCard(grid, figGateway('event'), 'Événementiel', 'Après le split : le PREMIER événement qui survient (message reçu, délai expiré…) choisit le chemin.');
      s.insertAdjacentHTML('beforeend', `
        <div class="table-scroll"><table class="cmp-table">
          <thead><tr><th></th><th>Exclusif (XOR)</th><th>Parallèle (AND)</th><th>Inclusif (OR)</th></tr></thead>
          <tbody>
            <tr><td><b>Séparation</b><br>(split / fork)</td>
              <td>Suit <b>une seule</b> branche</td>
              <td>Suit <b>toutes</b> les branches</td>
              <td>Suit <b>une ou plusieurs</b> branches selon les conditions</td></tr>
            <tr><td><b>Fusion</b><br>(join)</td>
              <td>S'active lorsqu'<b>une seule</b> branche précédente est terminée</td>
              <td>S'active lorsque <b>toutes</b> les branches précédentes sont terminées</td>
              <td>S'active lorsque <b>toutes les branches précédentes actives</b> sont terminées</td></tr>
          </tbody>
        </table></div>
        <p class="lead" style="font-size:.95rem">C'est le tableau du TP1 — apprenez-le par cœur, il résout les exercices 1, 2, 3 et 5.</p>`);

      /* --- simulateur --- */
      const simBox = document.createElement('div');
      simBox.innerHTML = `<h3>Le simulateur de jetons</h3>
        <p>Une <b>instance</b> de processus est représentée par un <b>jeton</b> qui circule le long des flux.
        Choisissez un type de gateway et lancez la simulation pour voir comment le jeton se divise (ou pas) :</p>`;
      s.appendChild(simBox);
      const simPanel = H.canvas('Simulateur — même processus, trois logiques différentes');
      simBox.appendChild(simPanel.panel);
      const simControls = document.createElement('div');
      simControls.className = 'sim-controls';
      simControls.innerHTML = `
        <span class="tf-seg" id="gw-choice">
          <button type="button" data-gw="xor" class="sel">XOR</button>
          <button type="button" data-gw="and">AND</button>
          <button type="button" data-gw="or">OR</button>
        </span>
        <label id="or-b" style="display:none;font-size:.84rem"><input type="checkbox" checked> condition B vraie</label>
        <label id="or-c" style="display:none;font-size:.84rem"><input type="checkbox" checked> condition C vraie</label>
        <button class="btn btn-primary" type="button" id="sim-run">▶ Lancer</button>
        <span class="sim-log" id="sim-log"></span>`;
      simPanel.panel.appendChild(simControls);

      let simApi = null, simKind = 'xor', simBusy = false;
      function renderSim() {
        simPanel.scroll.innerHTML = '';
        simApi = BPMN.render(simPanel.scroll, buildSimSpec(simKind));
      }
      renderSim();
      simControls.querySelector('#gw-choice').addEventListener('click', e => {
        const b = e.target.closest('button');
        if (!b || simBusy) return;
        simKind = b.dataset.gw;
        simControls.querySelectorAll('#gw-choice button').forEach(x => x.classList.toggle('sel', x === b));
        simControls.querySelector('#or-b').style.display = simKind === 'or' ? '' : 'none';
        simControls.querySelector('#or-c').style.display = simKind === 'or' ? '' : 'none';
        renderSim();
      });
      simControls.querySelector('#sim-run').addEventListener('click', async () => {
        if (simBusy) return;
        simBusy = true;
        Progress.set('bpmn-gw-sim', 1);
        const log = simControls.querySelector('#sim-log');
        const t = simApi.token('#c4453c');
        await t.moveAlong(simApi.flowPts('f-sa'));
        await t.moveAlong(simApi.flowPts('f-ag'));
        const goB = simKind !== 'or' || simControls.querySelector('#or-b input').checked;
        const goC = simKind === 'and' || (simKind === 'or' && simControls.querySelector('#or-c input').checked);
        if (simKind === 'xor') {
          log.textContent = 'XOR : une seule branche (ici B). La fusion laisse passer le jeton dès son arrivée.';
          await t.moveAlong(simApi.flowPts('f-gb'));
          await t.moveAlong(simApi.flowPts('f-bj'));
        } else if (!goB && !goC) {
          log.textContent = 'OR : aucune condition vraie — en pratique au moins une branche doit être choisie !';
          t.remove(); simBusy = false; return;
        } else {
          const parts = [];
          if (goB) parts.push('B');
          if (goC) parts.push('C');
          log.textContent = (simKind === 'and' ? 'AND : le jeton se DUPLIQUE sur toutes les branches. ' :
            `OR : branches actives : ${parts.join(' et ')}. `) + 'La fusion attend toutes les branches actives…';
          const proms = [];
          if (goB) proms.push(t.moveAlong(simApi.flowPts('f-gb')).then(() => t.moveAlong(simApi.flowPts('f-bj'))));
          if (goC) {
            const t2 = simApi.token('#2c5f9e');
            const p = simApi.flowPts('f-gc');
            t2.set(p[0][0], p[0][1]);
            proms.push(t2.moveAlong(p).then(() => t2.moveAlong(simApi.flowPts('f-cj'))).then(() => t2.remove()));
          }
          if (!goB) { t.hide(); await Promise.all(proms); t.set(520, 150); }
          else await Promise.all(proms);
          log.textContent += ' Fusion satisfaite : UN seul jeton continue.';
        }
        await t.moveAlong(simApi.flowPts('f-jd'));
        await t.moveAlong(simApi.flowPts('f-de'));
        log.textContent += ' Tous les jetons sont consommés → l’instance est terminée.';
        t.remove();
        simBusy = false;
      });
      s.insertAdjacentHTML('beforeend', H.callout('key', '★',
        `<b>Fin de processus :</b> une instance est terminée quand <b>tous les jetons</b> ont terminé
        (ou lorsqu'un jeton atteint un événement <b>terminate</b>). Retenez aussi : deux flux qui entrent dans une tâche
        <b>sans gateway</b> ne fusionnent pas — la tâche s'exécutera à chaque jeton reçu.`));
      QUIZ.qcm(s, {
        id: 'bpmn-gw-q',
        question: 'Après un split AND vers les tâches B et C, on veut que D s’exécute UNE seule fois, quand B et C sont toutes deux finies. Quelle fusion ?',
        options: [
          { t: 'Fusion XOR', why: 'La fusion XOR s’active à CHAQUE jeton entrant : D s’exécuterait deux fois.' },
          { t: 'Fusion AND', ok: true, why: 'La fusion AND synchronise : elle attend les deux jetons et n’en laisse passer qu’un.' },
          { t: 'Aucune : deux flèches directes vers D', why: 'Sans gateway, D s’exécute deux fois (une par jeton) — c’est le piège de l’exercice 2 du TP1.' }
        ]
      });

      /* ================= 5. Sous-processus & boucles ================= */
      s = page.querySelector('#s-sub');
      s.innerHTML = `<h2>5 · Sous-processus, boucles et multi-instances</h2>
        <div class="grid-2">
          <div class="card"><h3 style="margin-top:0">Sous-processus replié <span class="kbd">⊞</span></h3>
            <p style="font-size:.92rem">Une tâche marquée ⊞ représente un processus qui peut être décomposé en un ensemble de tâches —
            détaillé dans un autre diagramme. C'est l'outil du « diagramme de haut niveau » (TP1, ex. 9).</p></div>
          <div class="card"><h3 style="margin-top:0">Sous-processus étendu</h3>
            <p style="font-size:.92rem">Un grand rectangle arrondi qui montre directement le processus sous-jacent
            (avec son propre début et sa propre fin) à l'intérieur du diagramme parent.</p></div>
        </div>`;
      grid = document.createElement('div');
      grid.className = 'notation-grid';
      s.appendChild(grid);
      notCard(grid, figTask({ label: 'screening des cv', marker: 'loop' }), 'Boucle ↺', 'Répétition dont le nombre d’itérations n’est PAS connu à l’avance (« jusqu’à ce que… »).');
      notCard(grid, figTask({ label: 'interviewer candidat', marker: 'multi' }), 'Multi-instance ∥', 'Barres verticales : instances multiples en PARALLÈLE, nombre connu à l’avance (« pour chaque… »).');
      notCard(grid, figTask({ label: 'interviewer candidat', marker: 'multiSeq' }), 'Multi-instance ≡', 'Barres horizontales : instances multiples en SÉQUENCE, l’une après l’autre.');
      notCard(grid, figTask({ label: 'Réserver musique', sub: true }), 'Sous-processus ⊞', 'Se décompose en un diagramme détaillé séparé.');
      s.insertAdjacentHTML('beforeend', H.callout('info', 'i',
        `<b>Comment choisir ?</b> « On répète <i>jusqu'à</i> avoir 5 CV » → boucle ↺ (on ne sait pas combien de fois).
        « On interviewe <i>chacun des</i> 5 candidats » → multi-instance (5 instances, nombre connu). Ce distinguo est
        exactement celui de l'exercice 2 du TP2.`));

      /* ================= 6. Événements frontière ================= */
      s = page.querySelector('#s-frontiere');
      s.innerHTML = `<h2>6 · Événements en bordure de tâche (frontière)</h2>
        <p>Un événement (timer, message…) collé sur le bord d'une tâche surveille cette tâche pendant son exécution :</p>
        <div class="grid-2">
          <div class="card"><h3 style="margin-top:0">Interruptible — trait <b>plein</b></h3>
            <p style="font-size:.92rem">Quand l'événement se déclenche, la tâche est <b>annulée</b> et le flux part
            par le chemin de l'événement. Le chemin normal ne sera PAS suivi.</p></div>
          <div class="card"><h3 style="margin-top:0">Non-interruptible — trait <b>pointillé</b></h3>
            <p style="font-size:.92rem">Quand l'événement se déclenche, un jeton supplémentaire part par le chemin
            de l'événement <b>mais la tâche continue</b>. Les deux chemins vivent en parallèle.</p></div>
        </div>
        <p>Testez le scénario du cours — « je commence le rapport mercredi, l'échéance est jeudi » :</p>`;
      const fPanel = H.canvas('Scénario : rapport avec échéance « jeudi »');
      s.appendChild(fPanel.panel);
      const F_SPEC = (inter) => ({
        w: 640, h: 260,
        nodes: [
          { id: 's', type: 'start', x: 45, y: 100 },
          { id: 't', type: 'task', x: 175, y: 100, w: 130, h: 60, label: 'Rédiger le rapport' },
          { id: 'bt', type: 'boundary', event: 'timer', x: 205, y: 130, r: 15, interrupting: inter, label: 'jeudi', ldx: 30, ldy: -12 },
          { id: 'n', type: 'task', x: 400, y: 100, w: 120, h: 56, label: 'Remettre le rapport' },
          { id: 'e1', type: 'end', x: 530, y: 100 },
          { id: 'r', type: 'task', x: 400, y: 205, w: 130, h: 52, label: 'Prévenir le professeur du retard', icon: 'send' },
          { id: 'e2', type: 'end', x: 545, y: 205 }
        ],
        flows: [
          { id: 'f1', from: 's', to: 't' },
          { id: 'f2', from: 't', to: 'n' },
          { id: 'f3', from: 'n', to: 'e1' },
          { id: 'f4', from: 'bt', to: 'r', points: [[205, 145], [205, 205], [335, 205]] },
          { id: 'f5', from: 'r', to: 'e2' }
        ]
      });
      let fInter = true, fApi = BPMN.render(fPanel.scroll, F_SPEC(true)), fBusy = false;
      const fControls = document.createElement('div');
      fControls.className = 'sim-controls';
      fControls.innerHTML = `
        <span class="tf-seg" id="f-choice">
          <button type="button" data-i="1" class="sel">Interruptible (plein)</button>
          <button type="button" data-i="0">Non-interruptible (pointillé)</button>
        </span>
        <button type="button" class="btn btn-primary" id="f-run">▶ Jeudi arrive avant la fin…</button>
        <span class="sim-log" id="f-log"></span>`;
      fPanel.panel.appendChild(fControls);
      fControls.querySelector('#f-choice').addEventListener('click', e => {
        const b = e.target.closest('button');
        if (!b || fBusy) return;
        fInter = b.dataset.i === '1';
        fControls.querySelectorAll('#f-choice button').forEach(x => x.classList.toggle('sel', x === b));
        fPanel.scroll.innerHTML = '';
        fApi = BPMN.render(fPanel.scroll, F_SPEC(fInter));
      });
      fControls.querySelector('#f-run').addEventListener('click', async () => {
        if (fBusy) return;
        fBusy = true;
        Progress.set('bpmn-frontiere', 1);
        const log = fControls.querySelector('#f-log');
        const t = fApi.token('#c4453c');
        await t.moveAlong(fApi.flowPts('f1'));
        t.set(175, 100);
        log.textContent = 'Mercredi : la rédaction commence… jeudi arrive : le timer se déclenche !';
        fApi.classify('bt', 'dg-pulse');
        await new Promise(r => setTimeout(r, 1200));
        fApi.classify('bt', 'dg-pulse', false);
        if (fInter) {
          log.textContent = 'INTERRUPTIBLE : la rédaction est ANNULÉE. Seul le chemin du timer est suivi.';
          await t.moveAlong(fApi.flowPts('f4'));
          await t.moveAlong(fApi.flowPts('f5'));
          t.remove();
        } else {
          log.textContent = 'NON-INTERRUPTIBLE : on prévient le prof… ET on continue de rédiger — deux jetons en parallèle.';
          const t2 = fApi.token('#2c5f9e');
          t2.set(205, 130);
          await Promise.all([
            t2.moveAlong(fApi.flowPts('f4')).then(() => t2.moveAlong(fApi.flowPts('f5'))).then(() => t2.remove()),
            (async () => { await new Promise(r => setTimeout(r, 900)); await t.moveAlong(fApi.flowPts('f2')); await t.moveAlong(fApi.flowPts('f3')); })()
          ]);
          t.remove();
        }
        log.textContent += ' (Trait plein = interrompt · pointillé = n’interrompt pas.)';
        fBusy = false;
      });
      s.insertAdjacentHTML('beforeend', H.callout('warn', '!',
        `<b>Piège d'examen (TP1 ex. 6) :</b> après un événement frontière <b>interruptible</b>, il est impossible que le chemin
        normal ET le chemin de l'événement soient tous deux actifs — une jonction AND qui attend les deux se bloque à jamais.
        Avec un événement <b>non-interruptible</b>, les deux chemins peuvent coexister.`));

      /* ================= 7. Quiz de synthèse ================= */
      s = page.querySelector('#s-quiz');
      s.innerHTML = `<h2>7 · Vérifiez votre compréhension</h2>`;
      QUIZ.qcm(s, {
        id: 'bpmn-quiz1',
        question: 'Un processus contient un événement de fin « terminate » (disque noir). Que se passe-t-il quand un jeton l’atteint ?',
        options: [
          { t: 'Seul ce jeton est consommé, les autres branches continuent', why: 'Ça, c’est l’événement de fin SIMPLE.' },
          { t: 'Tous les jetons de l’instance sont détruits : le processus s’arrête immédiatement', ok: true, why: 'C’est ce qui empêche « servir commande » de se produire dans l’exercice 5 du TP1.' },
          { t: 'Le processus recommence depuis le début', why: 'Aucun événement BPMN ne « redémarre » un processus de cette façon.' }
        ]
      });
      QUIZ.qcm(s, {
        id: 'bpmn-quiz2',
        question: 'Après avoir envoyé une demande, le processus attend SOIT la réponse du client, SOIT l’expiration d’un délai de 30 jours. Quel motif utiliser ?',
        options: [
          { t: 'Un split XOR avec deux conditions', why: 'Le XOR choisit selon une condition évaluable immédiatement — ici on doit ATTENDRE des événements.' },
          { t: 'Un gateway événementiel suivi d’un événement message (catch) et d’un événement timer', ok: true, why: 'L’event-based gateway suit le chemin du PREMIER événement attrapé — motif exact de l’exercice 1 du TP2.' },
          { t: 'Un split AND vers les deux événements', why: 'Le AND activerait les DEUX chemins ; on veut un choix exclusif déterminé par le premier événement.' }
        ]
      });
      QUIZ.qcm(s, {
        id: 'bpmn-quiz3',
        question: 'Que manque-t-il à un modèle qui n’a ni événement de début ni événement de fin ?',
        options: [
          { t: 'Rien, c’est permis même si peu lisible', why: 'Les règles du cours : DOIT inclure au moins un début et au moins une fin.' },
          { t: 'Il viole les règles : tout modèle doit avoir au moins 1 début et au moins 1 fin (ou des fins de types différents pour distinguer les issues)', ok: true, why: 'C’est la « bonne pratique » rappelée dans l’exercice 5 du TP1.' },
          { t: 'Un pool', why: 'Un diagramme sans pool explicite est courant pour un processus interne simple.' }
        ]
      });

      H.nextPrev(page, ['home', 'Accueil'], ['tp1', 'TP1 · BPMN de base']);
    }
  });
})();
