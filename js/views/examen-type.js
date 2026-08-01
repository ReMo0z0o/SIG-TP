/* ============================================================
   Examen type — le format réel de l'examen écrit
   Théorie : Vrai/Faux à justifier, questions ouvertes larges,
   mise en situation (agile/SCRUM).
   Pratique : 2 modélisations BPMN + commentaire d'un modèle ArchiMate.
   ============================================================ */
(function () {

  const IDS = [
    'ext-vf1', 'ext-vf2', 'ext-vf3', 'ext-vf4', 'ext-vf5', 'ext-vf6', 'ext-vf7', 'ext-vf8',
    'ext-o-utaut', 'ext-o-silos', 'ext-o-agile', 'ext-o-scrum',
    'ext-b1q', 'ext-b1', 'ext-b2q', 'ext-b2', 'ext-b3-desc', 'ext-b3-tf'
  ];

  function canvasIn(parent, title, tag) {
    const { panel, scroll } = H.canvas(title, tag);
    parent.appendChild(panel);
    return scroll;
  }

  /* ---------- widget Vrai/Faux avec justification ---------- */
  function vfItem(container, spec) {
    const b = QUIZ.h('div', 'q-block open-q');
    b.appendChild(QUIZ.h('div', 'q-text', spec.statement));
    const ta = QUIZ.h('textarea');
    ta.rows = 2;
    ta.placeholder = 'Rédigez d\'abord votre justification en une ou deux phrases (exigée à l\'examen), puis répondez…';
    b.appendChild(ta);

    const row = QUIZ.h('div', 'btn-row');
    const bv = QUIZ.h('button', 'btn', 'VRAI');
    const bf = QUIZ.h('button', 'btn', 'FAUX');
    bv.type = bf.type = 'button';
    row.appendChild(bv); row.appendChild(bf);
    b.appendChild(row);

    const fb = QUIZ.h('div', 'q-feedback');
    b.appendChild(fb);
    const model = QUIZ.h('div', 'model-answer');
    model.appendChild(QUIZ.h('div', 'callout callout-key',
      `<span class="co-ic">${spec.answer ? 'V' : 'F'}</span><div><b>${spec.answer ? 'VRAI' : 'FAUX'} — justification attendue :</b> ${spec.just}</div>`));
    b.appendChild(model);

    const self = QUIZ.h('div', 'self-check');
    self.appendChild(QUIZ.h('span', '', '<b>Et ma justification était…</b>'));
    let vfOk = false;
    [['correcte', 0.5], ['partielle', 0.25], ['à côté', 0]].forEach(([label, sc]) => {
      const btn = QUIZ.h('button', 'btn', label);
      btn.type = 'button';
      btn.addEventListener('click', () => {
        self.querySelectorAll('button').forEach(x => { x.classList.remove('btn-primary'); x.disabled = true; });
        btn.classList.add('btn-primary');
        Progress.set(spec.id, (vfOk ? 0.5 : 0) + sc);
      });
      self.appendChild(btn);
    });
    b.appendChild(self);

    function answer(choice) {
      if (b.dataset.done) return;
      b.dataset.done = '1';
      vfOk = choice === spec.answer;
      bv.disabled = bf.disabled = true;
      (choice ? bv : bf).classList.add('btn-primary');
      fb.classList.add('show', vfOk ? 'good' : 'bad');
      fb.innerHTML = vfOk ? '✓ Bonne réponse — comparez maintenant votre justification.'
        : `✗ C'était ${spec.answer ? 'VRAI' : 'FAUX'} — lisez bien la justification.`;
      model.classList.add('show');
      self.classList.add('show');
    }
    bv.addEventListener('click', () => answer(true));
    bf.addEventListener('click', () => answer(false));

    container.appendChild(b);
  }

  /* ============================================================
     PRATIQUE — B1 : remboursement des frais (BPMN)
     ============================================================ */
  const B1 = {
    w: 1240, h: 640,
    pools: [
      { x: 30, y: 20, w: 1180, h: 60, label: 'Client', band: false },
      { x: 30, y: 100, w: 1180, h: 495, label: 'Assurance — Service remboursements' }
    ],
    nodes: [
      { id: 's', type: 'start', event: 'message', x: 105, y: 265, label: 'demande reçue', lw: 16 },
      { id: 'vd', type: 'task', x: 230, y: 265, w: 112, h: 58, label: 'vérifier le dossier' },
      { id: 'gc', type: 'gateway', gw: 'xor', x: 350, y: 265, label: 'dossier ?', ldy: -6, ldx: 52 },
      /* branche incomplet (haut) */
      { id: 'dpm', type: 'task', x: 490, y: 185, w: 132, h: 56, label: 'demander les pièces manquantes', icon: 'send' },
      { id: 'evg', type: 'gateway', gw: 'event', x: 630, y: 185 },
      { id: 'pr', type: 'catch', event: 'message', x: 750, y: 155, label: 'pièces reçues', ldy: 3, ldx: 54 },
      { id: 't10', type: 'catch', event: 'timer', x: 750, y: 240, label: '10 jours', ldy: 3, ldx: -44 },
      { id: 'css', type: 'end', x: 860, y: 240, label: 'classée sans suite', ldy: 32 },
      /* branche complet (bas) */
      { id: 'gm', type: 'gateway', gw: 'xor', x: 490, y: 375, label: 'montant ?', ldy: 26, ldx: -52 },
      { id: 'va', type: 'task', x: 630, y: 330, w: 126, h: 52, label: 'valider automatiquement' },
      { id: 'vre', type: 'task', x: 630, y: 430, w: 132, h: 56, label: 'faire valider par le responsable' },
      { id: 'gj', type: 'gateway', gw: 'xor', x: 765, y: 375 },
      { id: 'ga', type: 'gateway', gw: 'and', x: 838, y: 375 },
      { id: 'ev', type: 'task', x: 960, y: 330, w: 118, h: 54, label: 'effectuer le virement' },
      { id: 'ec', type: 'task', x: 960, y: 430, w: 122, h: 56, label: 'envoyer la confirmation', icon: 'send' },
      { id: 'gaj', type: 'gateway', gw: 'and', x: 1090, y: 375 },
      { id: 'fin', type: 'end', x: 1160, y: 375 }
    ],
    flows: [
      { id: 'f1', from: 's', to: 'vd' },
      { id: 'f2', from: 'vd', to: 'gc' },
      { id: 'f3', from: 'gc', to: 'dpm', points: [[350, 242], [350, 185], [424, 185]], label: 'incomplet', lx: 370, ly: 172 },
      { id: 'f4', from: 'dpm', to: 'evg', points: [[556, 185], [607, 185]] },
      { id: 'f5', from: 'evg', to: 'pr', points: [[653, 185], [695, 185], [695, 155], [733, 155]] },
      { id: 'f6', from: 'evg', to: 't10', points: [[653, 185], [695, 185], [695, 240], [733, 240]] },
      { id: 'f7', from: 't10', to: 'css', points: [[767, 240], [844, 240]] },
      { id: 'f8', from: 'pr', to: 'vd', points: [[739, 144], [739, 122], [230, 122], [230, 236]], label: 'revérifier', lx: 480, ly: 136 },
      { id: 'f9', from: 'gc', to: 'gm', points: [[350, 288], [350, 375], [467, 375]], label: 'complet', lx: 312, ly: 315 },
      { id: 'f10', from: 'gm', to: 'va', points: [[490, 352], [490, 330], [567, 330]], label: '≤ 500 €', lx: 514, ly: 318 },
      { id: 'f11', from: 'gm', to: 'vre', points: [[490, 398], [490, 430], [564, 430]], label: '> 500 €', lx: 514, ly: 414 },
      { id: 'f12', from: 'va', to: 'gj', points: [[693, 330], [765, 330], [765, 352]] },
      { id: 'f13', from: 'vre', to: 'gj', points: [[696, 430], [765, 430], [765, 398]] },
      { id: 'f14', from: 'gj', to: 'ga' },
      { id: 'f15', from: 'ga', to: 'ev', points: [[838, 352], [838, 330], [901, 330]] },
      { id: 'f16', from: 'ga', to: 'ec', points: [[838, 398], [838, 430], [899, 430]] },
      { id: 'f17', from: 'ev', to: 'gaj', points: [[1019, 330], [1090, 330], [1090, 352]] },
      { id: 'f18', from: 'ec', to: 'gaj', points: [[1021, 430], [1090, 430], [1090, 398]] },
      { id: 'f19', from: 'gaj', to: 'fin' },
      { id: 'm1', from: 's', to: 's', type: 'msg', points: [[105, 50], [105, 247]], label: 'demande', lx: 140, ly: 150 },
      { id: 'm2', from: 'dpm', to: 'dpm', type: 'msg', points: [[490, 157], [490, 80]], label: 'demande de pièces', lx: 420, ly: 118 },
      { id: 'm3', from: 'pr', to: 'pr', type: 'msg', points: [[761, 80], [761, 144]], label: 'pièces', lx: 792, ly: 112 },
      { id: 'm4', from: 'ec', to: 'ec', type: 'msg', points: [[1010, 458], [1010, 560], [1195, 560], [1195, 50], [1075, 50]], label: 'confirmation', lx: 1148, ly: 100 }
    ]
  };

  const B1_STEPS = [
    {
      title: 'Le déclencheur', show: ['s', 'vd'],
      text: '« Le processus démarre à la réception d\'une demande » = <b>start message</b> (pas un start vide !), alimenté par un flux de message venant du pool Client. Première tâche : vérifier le dossier.'
    },
    {
      title: 'Le contrôle de complétude', show: ['gc', 'dpm'],
      text: 'Le sort du dossier dépend d\'une <b>condition immédiatement évaluable</b> (complet ou non) → <b>split XOR</b>. Si incomplet : tâche d\'envoi (icône enveloppe noire) « demander les pièces », avec message sortant vers le client.'
    },
    {
      title: 'L\'attente : pièces OU 10 jours', show: ['evg', 'pr', 't10', 'css'],
      text: 'On attend <b>le premier de deux événements</b> → <b>gateway événementiel</b> suivi d\'un catch message et d\'un catch timer. Sans réponse après 10 jours : fin « classée sans suite » (ce end ne consomme que ce jeton — il n\'y en a qu\'un ici).'
    },
    {
      title: 'Le retour en vérification', show: ['f8'],
      text: 'Si les pièces arrivent, le dossier est <b>revérifié</b> : le flux revient à la tâche « vérifier le dossier ». C\'est cette boucle qui permet de redemander des pièces si le dossier est TOUJOURS incomplet.'
    },
    {
      title: 'La décision sur le montant', show: ['gm', 'va', 'vre', 'gj'],
      text: 'Dossier complet → deuxième <b>split XOR</b> sur le montant : ≤ 500 € validation automatique, sinon validation par le responsable. Les deux chemins se rejoignent par une <b>fusion XOR</b> (un seul jeton passe, pas de synchronisation nécessaire).'
    },
    {
      title: 'Le parallèle final', show: ['ga', 'ev', 'ec', 'gaj', 'fin'],
      text: '« Effectue le virement ET, en parallèle, envoie une confirmation ; se termine quand les deux sont faits » = <b>split AND</b> puis <b>join AND</b> (le join attend les DEUX jetons avant de libérer la fin). La confirmation part en message vers le client.'
    }
  ];

  /* ============================================================
     PRATIQUE — B2 : session de formation trimestrielle (BPMN)
     ============================================================ */
  const B2 = {
    w: 1240, h: 540,
    pools: [
      { x: 30, y: 20, w: 1180, h: 60, label: 'Employés', band: false },
      { x: 30, y: 100, w: 1180, h: 415, label: 'Service RH' }
    ],
    nodes: [
      { id: 's', type: 'start', event: 'timer', x: 105, y: 300, label: 'chaque trimestre', lw: 16 },
      { id: 'rs', type: 'task', x: 225, y: 300, w: 110, h: 56, label: 'réserver une salle' },
      { id: 'pa', type: 'task', x: 360, y: 300, w: 112, h: 58, label: "publier l'annonce", icon: 'send' },
      { id: 'ei', type: 'task', x: 510, y: 300, w: 128, h: 60, label: 'enregistrer les inscriptions', icon: 'receive', marker: 'loop' },
      { id: 'bt', type: 'boundary', event: 'timer', x: 545, y: 330, r: 15, label: '3 semaines — clôture', ldx: 10, ldy: 34 },
      { id: 'gi', type: 'gateway', gw: 'xor', x: 680, y: 390, label: 'inscrits ?', ldy: 16, ldx: -56 },
      { id: 'an', type: 'task', x: 850, y: 330, w: 128, h: 56, label: "prévenir de l'annulation", icon: 'send' },
      { id: 'ea', type: 'end', x: 960, y: 330, label: 'session annulée', ldy: 32 },
      { id: 'cv', type: 'task', x: 850, y: 450, w: 138, h: 60, label: 'envoyer une convocation à chaque inscrit', icon: 'send', marker: 'multiPar' },
      { id: 'df', type: 'task', x: 1005, y: 450, w: 106, h: 56, label: 'donner la formation' },
      { id: 'ae', type: 'task', x: 1125, y: 450, w: 104, h: 56, label: 'archiver les évaluations' },
      { id: 'fin', type: 'end', x: 1192, y: 450, r: 14 }
    ],
    flows: [
      { id: 'f1', from: 's', to: 'rs' },
      { id: 'f2', from: 'rs', to: 'pa' },
      { id: 'f3', from: 'pa', to: 'ei' },
      { id: 'fb', from: 'bt', to: 'gi', points: [[545, 345], [545, 390], [657, 390]] },
      { id: 'f4', from: 'gi', to: 'an', points: [[680, 367], [680, 330], [786, 330]], label: '< 5 inscrits', lx: 712, ly: 318 },
      { id: 'f5', from: 'an', to: 'ea' },
      { id: 'f6', from: 'gi', to: 'cv', points: [[680, 413], [680, 450], [781, 450]], label: '≥ 5 inscrits', lx: 712, ly: 436 },
      { id: 'f7', from: 'cv', to: 'df' },
      { id: 'f8', from: 'df', to: 'ae' },
      { id: 'f9', from: 'ae', to: 'fin' },
      { id: 'm1', from: 'pa', to: 'pa', type: 'msg', points: [[360, 271], [360, 80]], label: 'annonce', lx: 325, ly: 170 },
      { id: 'm2', from: 'ei', to: 'ei', type: 'msg', points: [[510, 80], [510, 270]], label: 'inscriptions', lx: 555, ly: 170 },
      { id: 'm3', from: 'an', to: 'an', type: 'msg', points: [[850, 302], [850, 80]], label: 'annulation', lx: 890, ly: 170 },
      { id: 'm4', from: 'cv', to: 'cv', type: 'msg', points: [[780, 420], [780, 80]], label: 'convocations', lx: 730, ly: 170 }
    ]
  };

  const B2_STEPS = [
    {
      title: 'Le déclencheur temporel', show: ['s', 'rs', 'pa'],
      text: '« Chaque trimestre » = <b>start timer</b> (un moment, pas un message). Puis la préparation : réserver la salle et publier l\'annonce — tâche d\'<b>envoi</b> avec message vers le pool Employés (black box).'
    },
    {
      title: 'Les inscriptions au fil de l\'eau', show: ['ei'],
      text: 'Les inscriptions arrivent une par une pendant 3 semaines : tâche de <b>réception</b> (enveloppe blanche) avec <b>marqueur boucle ↺</b> — elle se répète à chaque inscription reçue.'
    },
    {
      title: 'La clôture : timer frontière', show: ['bt'],
      text: 'Comment sortir d\'une boucle « tant qu\'il arrive des inscriptions » ? Par un <b>timer frontière INTERRUPTIBLE</b> (trait plein) : à 3 semaines, la tâche d\'enregistrement est <b>arrêtée</b> et le jeton sort par le chemin du timer. (Trait pointillé = non-interruptible = la tâche continuerait — pas le sens voulu ici.)'
    },
    {
      title: 'La décision et l\'annulation', show: ['gi', 'an', 'ea'],
      text: 'À la clôture, <b>split XOR</b> sur le nombre d\'inscrits. Moins de 5 : prévenir (message) et terminer sur une fin « session annulée ».'
    },
    {
      title: 'La branche nominale', show: ['cv', 'df', 'ae', 'fin'],
      text: '« Une convocation à CHACUN des inscrits » : le nombre est <b>connu au moment de l\'exécution</b> → <b>multi-instance ∥</b> (pas une boucle !). Puis la formation, l\'archivage des évaluations, et la fin du processus.'
    }
  ];

  /* ============================================================
     PRATIQUE — B3 : MédiaGo (ArchiMate à commenter)
     ============================================================ */
  const B3 = {
    w: 1080, h: 600,
    nodes: [
      { id: 'hab', kind: 'actor', layer: 'business', x: 120, y: 60, w: 140, h: 50, label: 'Habitant', sub: 'Business Actor' },
      { id: 'abo', kind: 'role', layer: 'business', x: 330, y: 60, w: 140, h: 50, label: 'Abonné', sub: 'Business Role' },
      { id: 'serv', kind: 'service', layer: 'business', x: 620, y: 60, w: 190, h: 50, label: 'Emprunt de médias', sub: 'Business Service' },
      { id: 'bib', kind: 'role', layer: 'business', x: 490, y: 130, w: 150, h: 44, label: 'Bibliothécaire', sub: 'Business Role' },
      { id: 'obj', kind: 'object', layer: 'business', x: 250, y: 130, w: 150, h: 44, label: "Dossier d'abonné", sub: 'Business Object' },
      { id: 'proc', container: true, layer: 'business', kind: 'process', x: 140, y: 195, w: 780, h: 115, label: 'Traiter un emprunt (Business Process)', labelX: 748 },
      { id: 'res', kind: 'process', layer: 'business', x: 250, y: 265, w: 130, h: 46, label: 'Réserver un média' },
      { id: 'ret', kind: 'process', layer: 'business', x: 490, y: 265, w: 130, h: 46, label: 'Retirer le média' },
      { id: 'rnd', kind: 'process', layer: 'business', x: 730, y: 265, w: 140, h: 46, label: 'Retourner le média' },
      { id: 'sres', kind: 'service', layer: 'app', x: 250, y: 400, w: 180, h: 48, label: 'Service de réservation en ligne', sub: 'Application Service' },
      { id: 'spre', kind: 'service', layer: 'app', x: 610, y: 400, w: 175, h: 48, label: 'Service de gestion des prêts', sub: 'Application Service' },
      { id: 'snot', kind: 'service', layer: 'app', x: 890, y: 400, w: 155, h: 48, label: 'Service de notification', sub: 'Application Service' },
      { id: 'port', kind: 'component', layer: 'app', x: 250, y: 510, w: 155, h: 50, label: 'Portail MédiaGo' },
      { id: 'sgb', kind: 'component', layer: 'app', x: 610, y: 510, w: 195, h: 54, label: 'Système de gestion de bibliothèque (SGB)' },
      { id: 'dbe', kind: 'object', layer: 'app', x: 890, y: 510, w: 155, h: 46, label: 'Base des emprunts', sub: 'Data Object' }
    ],
    rels: [
      { id: 'r1', from: 'hab', to: 'abo', type: 'assignment', points: [[190, 60], [260, 60]], label: 'assignment', ly: 46 },
      { id: 'r2', from: 'serv', to: 'abo', type: 'serving', points: [[525, 60], [400, 60]], label: 'serving', ly: 46 },
      { id: 'r3', from: 'proc', to: 'serv', type: 'realization', points: [[620, 195], [620, 85]], label: 'realization', lx: 665, ly: 150 },
      { id: 'r4', from: 'bib', to: 'ret', type: 'assignment', points: [[490, 152], [490, 242]], label: 'assignment', lx: 440, ly: 176 },
      { id: 'r5', from: 'res', to: 'obj', type: 'access', points: [[250, 242], [250, 152]], label: 'access', lx: 222, ly: 205 },
      { id: 'r6', from: 'res', to: 'ret', type: 'triggering', points: [[315, 265], [425, 265]] },
      { id: 'r7', from: 'ret', to: 'rnd', type: 'triggering', points: [[555, 265], [660, 265]] },
      { id: 'r8', from: 'sres', to: 'res', type: 'serving', points: [[250, 376], [250, 288]], label: 'serving', lx: 285, ly: 340 },
      { id: 'r9', from: 'spre', to: 'ret', type: 'serving', points: [[610, 376], [610, 340], [490, 340], [490, 288]] },
      { id: 'r10', from: 'spre', to: 'rnd', type: 'serving', points: [[660, 376], [660, 345], [730, 345], [730, 288]] },
      { id: 'r11', from: 'snot', to: 'rnd', type: 'serving', points: [[890, 376], [890, 350], [770, 350], [770, 288]] },
      { id: 'r12', from: 'port', to: 'sres', type: 'realization', points: [[250, 485], [250, 424]], label: 'realization', lx: 205, ly: 455 },
      { id: 'r13', from: 'sgb', to: 'spre', type: 'realization', points: [[610, 483], [610, 424]] },
      { id: 'r14', from: 'sgb', to: 'snot', type: 'realization', points: [[690, 483], [860, 424]] },
      { id: 'r15', from: 'sgb', to: 'dbe', type: 'access', points: [[707, 510], [812, 510]], label: 'access', lx: 760, ly: 496 }
    ]
  };

  /* ============================================================
     La vue
     ============================================================ */
  APP.register('examen-type', {
    title: 'Examen type',
    short: 'Ex',
    module: 'bpmn',
    ids: IDS,
    render(page) {
      page.innerHTML = `
        <p class="eyebrow">Évaluation · Le format réel de l'examen écrit</p>
        <h1>Examen type — entraînez-vous dans les conditions réelles</h1>
        <p class="lead">L'examen écrit compte pour <b>80 % de la note</b> : 40 % de théorie et mises en situation,
        40 % d'exercices de modélisation. Cette page reproduit les <b>types de questions réellement posés</b> :
        vrai/faux <b>à justifier</b>, questions ouvertes larges, mise en situation, deux modélisations BPMN
        et un modèle ArchiMate à commenter.</p>
        <div id="score-board" class="stat-tiles" style="margin:18px 0"></div>
        ${H.callout('key', '✎', `<b>Jouez le jeu de l'examen :</b> travaillez <b>sur papier, sans notes</b>.
          Rédigez réellement vos justifications et vos réponses ouvertes avant de les comparer aux réponses
          modèles — à l'examen, une réponse V/F sans justification ne rapporte rien.`)}
        <div id="content"></div>
      `;

      const board = page.querySelector('#score-board');
      function refreshBoard() {
        const s = Progress.moduleStats(IDS);
        board.innerHTML = `
          <div class="stat-tile"><b>${s.done}<span style="font-size:.9rem;color:var(--ink-3)">/${s.total}</span></b><span>questions traitées</span></div>
          <div class="stat-tile"><b>${s.pct}%</b><span>examen couvert</span></div>
          <div class="stat-tile"><b>${s.done ? Math.round(s.score * 100) + '%' : '—'}</b><span>score moyen</span></div>`;
      }
      refreshBoard();
      Progress.onChange(refreshBoard, board);

      const box = page.querySelector('#content');

      /* ================= PARTIE A — THÉORIE ================= */
      box.insertAdjacentHTML('beforeend', `
        <hr class="sep">
        <h2>Partie A — Théorie &amp; mises en situation <span class="tag">40 % de l'examen</span></h2>`);

      /* ---- A1 : Vrai/Faux justifiés ---- */
      const a1 = QUIZ.exo(box, {
        tag: 'A1', title: 'Vrai ou faux — chaque réponse doit être justifiée',
        ids: IDS.slice(0, 8), anchor: 'ext-a1'
      });
      a1.insertAdjacentHTML('beforeend',
        `<p>Huit affirmations qui balaient tout le cours. Pour chacune : <b>écrivez votre justification</b>,
        répondez, puis auto-évaluez votre justification face à celle attendue.</p>`);
      [
        {
          id: 'ext-vf1', answer: false,
          statement: '« Dans le TAM, l\'utilité perçue influence la facilité d\'utilisation perçue. »',
          just: 'C\'est l\'inverse : la <b>facilité d\'utilisation perçue influence l\'utilité perçue</b> (moins un système demande d\'effort, plus il paraît utile), et les deux influencent l\'intention d\'utilisation.'
        },
        {
          id: 'ext-vf2', answer: true,
          statement: '« Dans l\'UTAUT, les conditions facilitantes n\'influencent pas l\'intention d\'utilisation. »',
          just: 'Leur effet sur l\'intention est déjà capturé par les attentes d\'effort : les conditions facilitantes agissent <b>directement sur l\'utilisation effective</b> (effet modéré par l\'âge et l\'expérience).'
        },
        {
          id: 'ext-vf3', answer: true,
          statement: '« Un ERP répond au problème des silos fonctionnels en faisant travailler tous les départements sur une base de données commune. »',
          just: 'L\'ERP intègre les fonctions (modules) autour d\'une <b>base de données unique et partagée</b> : une information saisie une fois est disponible partout — fin des ressaisies et des données divergentes des silos.'
        },
        {
          id: 'ext-vf4', answer: false,
          statement: '« Dans le modèle Waterfall, revenir à une phase précédente est prévu et peu coûteux. »',
          just: 'La cascade est <b>séquentielle</b> : chaque phase se termine avant la suivante et le retour en arrière est difficile et coûteux (une erreur d\'exigences découverte en test coûte très cher). C\'est précisément la limite que l\'agile corrige avec ses itérations courtes.'
        },
        {
          id: 'ext-vf5', answer: false,
          statement: '« L\'analyse des exigences sert avant tout à choisir les technologies qui seront utilisées. »',
          just: 'L\'ingénierie des exigences définit <b>ce que le système doit faire</b> pour répondre aux besoins métier (exigences fonctionnelles et non-fonctionnelles, priorisées p.ex. avec MoSCoW). Le choix technologique relève de la conception, en aval.'
        },
        {
          id: 'ext-vf6', answer: true,
          statement: '« Dans le cycle de vie BPM, la phase de surveillance compare la performance réelle du processus à des indicateurs (KPI). »',
          just: 'Le monitoring mesure le processus <b>en exploitation</b> (temps, coûts, qualité, volumes) au moyen de KPI et détecte les dérives — ce qui peut relancer un tour du cycle (rediscovery, redesign).'
        },
        {
          id: 'ext-vf7', answer: false,
          statement: '« En BPMN, un flux de message peut relier deux tâches situées dans le même pool. »',
          just: 'Le message flow ne s\'utilise qu\'<b>ENTRE pools distincts</b> (organisations/participants différents). À l\'intérieur d\'un pool — même entre lanes — on utilise le <b>sequence flow</b>.'
        },
        {
          id: 'ext-vf8', answer: true,
          statement: '« En ArchiMate, la relation serving pointe de l\'élément qui fournit le service vers l\'élément qui en bénéficie. »',
          just: 'La flèche ouverte du serving va <b>du fournisseur vers le bénéficiaire</b> : p.ex. un service applicatif → le processus métier qu\'il soutient, ou un service métier → le rôle qui le consomme.'
        }
      ].forEach(specVf => vfItem(a1, specVf));

      /* ---- A2 : question ouverte large (la question de la session passée) ---- */
      const a2 = QUIZ.exo(box, {
        tag: 'A2', title: 'Question ouverte — UTAUT et UTAUT2 (posée à la session passée)',
        ids: ['ext-o-utaut'], anchor: 'ext-a2'
      });
      QUIZ.open(a2, {
        id: 'ext-o-utaut',
        question: `<b>« Présentez le modèle UTAUT (composantes et logique), puis expliquez ce qui change avec
          UTAUT2 et pourquoi. »</b><br><span class="q-note">Attendu : le schéma (de tête), la définition de chaque
          variable, et les différences motivées — comptez 15-20 lignes.</span>`,
        model: `<p><b>UTAUT</b> (Venkatesh et al., 2003) unifie les modèles d'acceptation antérieurs (dont le TAM).
          Quatre <b>déterminants</b> : les <b>attentes de performance</b> (la technologie améliorera mes performances)
          et les <b>attentes d'effort</b> (elle sera facile à utiliser) et l'<b>influence sociale</b> (les autres pensent
          que je devrais l'utiliser) influencent l'<b>intention d'utilisation</b> ; les <b>conditions facilitantes</b>
          (ressources, support) influencent directement l'<b>utilisation effective</b> — pas l'intention.
          L'intention influence l'utilisation. Quatre <b>modérateurs</b> ajustent la force de ces relations :
          genre, âge, expérience, volontarisme (l'influence sociale ne pèse qu'en usage obligatoire).</p>
          <p><b>UTAUT2</b> (Venkatesh, Thong &amp; Xu, 2012) adapte le modèle au contexte <b>consommateur</b> :
          ① trois variables ajoutées — <b>motivation hédonique</b> (plaisir), <b>valeur de prix</b>
          (rapport bénéfices/coût) et <b>habitude</b> (qui agit sur l'intention ET directement sur l'usage) ;
          ② nouvelle flèche <b>conditions facilitantes → intention</b> ; ③ le modérateur <b>volontarisme
          disparaît</b> (l'usage consommateur est volontaire par nature) ; ④ l'effet de l'intention sur l'usage
          <b>diminue avec l'expérience</b> — l'habitude prend le relais.</p>`
      });

      /* ---- A3 : question ouverte large n° 2 ---- */
      const a3 = QUIZ.exo(box, {
        tag: 'A3', title: 'Question ouverte — les silos et les systèmes intégrés',
        ids: ['ext-o-silos'], anchor: 'ext-a3'
      });
      QUIZ.open(a3, {
        id: 'ext-o-silos',
        question: `<b>« Une entreprise en croissance constate que chaque département a acquis son propre logiciel :
          les données clients sont ressaisies plusieurs fois et finissent par diverger. Expliquez le problème,
          puis comment les systèmes intégrés y répondent. »</b>`,
        model: `<p>C'est le problème des <b>silos fonctionnels</b> : des SI développés indépendamment par fonction,
          qui ne communiquent pas. Conséquences : ressaisies multiples (coût, erreurs), données <b>incohérentes</b>
          entre départements, pas de vue globale du client, processus transversaux lents.</p>
          <p>Réponses intégrées : le <b>CRM</b> centralise toute la relation client (vente, marketing, service) ;
          l'<b>ERP</b> intègre les fonctions de l'entreprise en <b>modules</b> autour d'une <b>base de données
          unique</b> — une information saisie une fois est disponible partout ; l'<b>EAI</b> fait communiquer des
          applications existantes qu'on ne veut pas remplacer, via un middleware. Le choix dépend du contexte
          (remplacer les silos → ERP ; les faire dialoguer → EAI).</p>`
      });

      /* ---- A4 : mise en situation agile / SCRUM ---- */
      const a4 = QUIZ.exo(box, {
        tag: 'A4', title: 'Mise en situation — méthode agile & SCRUM',
        ids: ['ext-o-agile', 'ext-o-scrum'], anchor: 'ext-a4'
      });
      a4.insertAdjacentHTML('beforeend', H.callout('key', '📋',
        `<b>Situation.</b> MoveSmart, une PME de mobilité, veut développer une application de covoiturage
        domicile-travail vendue aux entreprises. Les besoins précis des utilisateurs sont encore <b>flous</b>,
        le marché évolue vite, et la direction veut une <b>première version utilisable en trois mois</b>
        pour la tester chez deux clients pilotes et ajuster ensuite.`));
      QUIZ.open(a4, {
        id: 'ext-o-agile',
        question: `<b>1 · Pourquoi la méthode agile est-elle adaptée à ce cas (par opposition au Waterfall) ?</b>`,
        model: `<p>Tous les signaux du cas pointent vers l'agile : les <b>exigences sont incertaines et vont
          changer</b> (besoins flous, marché mouvant) — or Waterfall exige des spécifications stables dès le départ
          et rend les retours en arrière coûteux. L'agile livre par <b>itérations courtes</b> un produit
          fonctionnel, ce qui permet : la <b>première version en trois mois</b> (time-to-market), des
          <b>retours utilisateurs fréquents</b> des clients pilotes réinjectés dans le développement,
          une <b>réduction du risque</b> (on découvre tôt ce qui ne convient pas) et une valeur livrée
          progressivement plutôt qu'un effet tunnel de 18 mois.</p>`
      });
      QUIZ.open(a4, {
        id: 'ext-o-scrum',
        question: `<b>2 · Concrètement, comment MoveSmart développe-t-elle sa solution avec SCRUM ?</b>
          <span class="q-note">Attendu : les rôles, les artefacts et le déroulement d'un sprint.</span>`,
        model: `<p><b>Rôles :</b> un <b>Product Owner</b> porte la vision produit et priorise les besoins ;
          un <b>Scrum Master</b> garant de la méthode lève les obstacles ; une <b>équipe de développement</b>
          pluridisciplinaire et auto-organisée réalise.</p>
          <p><b>Artefacts et déroulement :</b> les besoins sont exprimés dans le <b>product backlog</b>,
          liste priorisée d'user stories. Le travail avance par <b>sprints</b> de 2 à 4 semaines :
          au <b>sprint planning</b>, l'équipe tire les stories prioritaires dans le sprint backlog ;
          le <b>daily scrum</b> (15 min debout) synchronise l'équipe chaque jour ; à la fin du sprint,
          l'équipe livre un <b>incrément potentiellement livrable</b>, le montre aux parties prenantes
          (clients pilotes !) en <b>sprint review</b> — leurs retours alimentent le backlog — puis
          s'améliore en <b>rétrospective</b>. En trois mois ≈ 5-6 sprints : assez pour une première
          version testable chez les pilotes.</p>`
      });

      /* ================= PARTIE B — PRATIQUE ================= */
      box.insertAdjacentHTML('beforeend', `
        <hr class="sep">
        <h2>Partie B — Modélisation <span class="tag">40 % de l'examen</span></h2>
        <p class="lead">Comme à l'examen : <b>deux processus à modéliser en BPMN</b> à partir d'un énoncé textuel,
        et <b>un modèle ArchiMate à commenter</b>. Dessinez d'abord sur papier — la correction se construit
        ensuite pas à pas.</p>`);

      /* ---- B1 ---- */
      const b1 = QUIZ.exo(box, {
        tag: 'B1', title: 'Modélisation BPMN n° 1 — le remboursement des frais',
        ids: ['ext-b1q', 'ext-b1'], anchor: 'ext-b1'
      });
      b1.insertAdjacentHTML('beforeend', H.callout('key', '📋',
        `<b>Énoncé.</b> Une compagnie d'assurance traite les demandes de remboursement. Le processus démarre
        à la réception d'une demande du client. Le service vérifie le dossier. S'il est <b>incomplet</b>, il
        demande les pièces manquantes au client puis attend : si les pièces arrivent, le dossier est revérifié ;
        sans réponse après <b>10 jours</b>, la demande est classée sans suite. Si le dossier est <b>complet</b>,
        tout dépend du montant : jusqu'à 500 €, le remboursement est validé automatiquement ; au-delà, il doit
        être validé par le responsable. Une fois validé, la compagnie <b>effectue le virement et, en parallèle,
        envoie une confirmation</b> au client ; le processus se termine quand les deux sont faits.
        <b>Modélisez en BPMN</b> (le client est un pool externe).`));
      QUIZ.qcm(b1, {
        id: 'ext-b1q',
        question: 'Avant de dessiner — « le virement ET, en parallèle, la confirmation ; terminé quand les deux sont faits ». Quel motif ?',
        options: [
          { t: 'Split AND puis join AND avant l\'événement de fin', ok: true, why: 'Le split lance les deux branches en parallèle, le join AND attend les DEUX jetons : la fin n\'est atteinte que quand tout est fait.' },
          { t: 'Split XOR puis join XOR', why: 'Le XOR ne suivrait qu\'UNE des deux branches — or les deux actions ont lieu.' },
          { t: 'Deux événements de fin séparés, sans join', why: 'Possible syntaxiquement, mais on perd la synchronisation « terminé quand les deux sont faits » exigée par l\'énoncé.' }
        ]
      });
      const apiB1 = BPMN.render(canvasIn(b1, 'Correction — construite pas à pas', ['Correction type', 'tag-ok']), B1,
        { animate: false });
      QUIZ.steps(b1, { id: 'ext-b1', api: apiB1, steps: B1_STEPS });

      /* ---- B2 ---- */
      const b2 = QUIZ.exo(box, {
        tag: 'B2', title: 'Modélisation BPMN n° 2 — la session de formation trimestrielle',
        ids: ['ext-b2q', 'ext-b2'], anchor: 'ext-b2'
      });
      b2.insertAdjacentHTML('beforeend', H.callout('key', '📋',
        `<b>Énoncé.</b> Le service RH organise <b>chaque trimestre</b> une session de formation interne.
        Il réserve une salle puis publie l'annonce auprès des employés. Les inscriptions arrivent au fil de
        l'eau et restent ouvertes <b>3 semaines</b>, puis sont closes. S'il y a <b>moins de 5 inscrits</b>,
        la session est annulée et les employés sont prévenus. Sinon, le service envoie une convocation à
        <b>chacun des inscrits</b>, donne la formation, puis archive les évaluations.
        <b>Modélisez en BPMN</b> (les employés forment un pool externe).`));
      QUIZ.qcm(b2, {
        id: 'ext-b2q',
        question: 'Avant de dessiner — les inscriptions s\'enregistrent en boucle pendant 3 semaines, puis on passe à la suite. Quel mécanisme ?',
        options: [
          { t: 'Une tâche de réception en boucle ↺ avec un timer frontière INTERRUPTIBLE (trait plein) de 3 semaines', ok: true, why: 'Le timer frontière interrompt la tâche répétitive à l\'échéance et fait sortir le jeton par son chemin : exactement « ouvert 3 semaines, puis clos ».' },
          { t: 'Un gateway événementiel après chaque inscription', why: 'Il faudrait reboucler à chaque inscription — lourd, et le délai global de 3 semaines serait réarmé à chaque tour.' },
          { t: 'Un timer frontière NON-interruptible (pointillé)', why: 'La tâche continuerait d\'enregistrer après l\'échéance — or les inscriptions doivent être closes.' }
        ]
      });
      const apiB2 = BPMN.render(canvasIn(b2, 'Correction — construite pas à pas', ['Correction type', 'tag-ok']), B2,
        { animate: false });
      QUIZ.steps(b2, { id: 'ext-b2', api: apiB2, steps: B2_STEPS });

      /* ---- B3 ---- */
      const b3 = QUIZ.exo(box, {
        tag: 'B3', title: 'ArchiMate — décrire et commenter le modèle « MédiaGo »',
        ids: ['ext-b3-desc', 'ext-b3-tf'], anchor: 'ext-b3'
      });
      b3.insertAdjacentHTML('beforeend',
        `<p>La médiathèque municipale « MédiaGo » a modélisé son service d'emprunt en ArchiMate.
        <b>Commentez ce modèle</b> comme à l'examen : décrivez les couches, les éléments, les relations,
        et la façon dont l'application soutient le métier.</p>`);
      ARCHI.render(canvasIn(b3, 'Le modèle à commenter', ['Énoncé', 'tag-info']), B3, {});
      QUIZ.open(b3, {
        id: 'ext-b3-desc',
        question: `<b>1 · Décrivez ce modèle en un paragraphe structuré</b> (couches → éléments → relations →
          articulation), comme vous le feriez sur votre copie.`,
        model: `<p>Le modèle comporte deux couches. <b>Couche métier (jaune)</b> : l'acteur <i>Habitant</i> est
          <b>assigné</b> au rôle <i>Abonné</i>, bénéficiaire (<b>serving</b>) du service métier <i>Emprunt de
          médias</i>. Ce service est <b>réalisé</b> par le processus <i>Traiter un emprunt</i>, composé de trois
          sous-processus en chaîne (<b>triggering</b>) : réserver → retirer → retourner. Le rôle
          <i>Bibliothécaire</i> est <b>assigné</b> au retrait (c'est lui qui l'exécute), et la réservation
          <b>accède</b> (access) au <i>Dossier d'abonné</i>.</p>
          <p><b>Couche application (bleu)</b> : trois services applicatifs <b>servent</b> les sous-processus —
          la réservation en ligne (réalisée par le composant <i>Portail MédiaGo</i>), la gestion des prêts et la
          notification (réalisées par le <i>SGB</i>, qui lit/écrit la <i>Base des emprunts</i> — access).</p>
          <p><b>Articulation des couches</b> : composant → (realization) → service applicatif → (serving) →
          processus métier → (realization) → service métier → (serving) → rôle. C'est le motif canonique du cours.</p>`
      });
      QUIZ.tfTable(b3, {
        id: 'ext-b3-tf',
        question: '<b>2 · Vrai ou faux ?</b> Cinq affirmations d\'examen sur ce modèle :',
        rowHeader: 'Affirmation',
        columns: ['Votre réponse'],
        choices: ['Vrai', 'Faux'],
        rows: [
          { label: 'C\'est l\'Habitant qui joue le rôle d\'Abonné.', answers: ['Vrai'] },
          { label: 'Le service métier « Emprunt de médias » est réalisé par le composant « Portail MédiaGo ».', answers: ['Faux'] },
          { label: 'Chaque sous-processus métier est soutenu par au moins un service applicatif via une relation serving.', answers: ['Vrai'] },
          { label: 'Le SGB lit et/ou écrit les données de la « Base des emprunts ».', answers: ['Vrai'] },
          { label: '« Retourner le média » déclenche « Retirer le média ».', answers: ['Faux'] }
        ],
        explain: `① Assignment acteur→rôle : l'Habitant joue le rôle ✓. ② Le service MÉTIER est réalisé par le
          processus métier ; le Portail réalise le service APPLICATIF de réservation. ③ Réservation, retrait et
          retour reçoivent chacun un serving applicatif ✓. ④ La relation access SGB → Base des emprunts = accès
          aux données ✓. ⑤ Les triggering vont dans l'autre sens : réserver → retirer → retourner.`
      });

      page.insertAdjacentHTML('beforeend', H.callout('key', '★',
        `<b>Après l'examen type :</b> les points faibles en théorie se révisent dans les
        <a href="#/theorie">chapitres du cours</a>, les automatismes BPMN dans les <a href="#/tp1">TP1</a>-<a href="#/tp2">TP2</a>,
        la lecture ArchiMate dans le <a href="#/tp3">TP3</a>. L'<a href="#/examen">examen blanc (20 QCM)</a>
        reste idéal pour un dernier tour rapide des pièges.`));
      H.nextPrev(page, ['tp3', 'TP3 · ArchiMate'], ['examen', 'Examen blanc (QCM)']);
    }
  });
})();
