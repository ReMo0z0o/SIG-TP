/* ============================================================
   TP2 — BPMN avancé : hypothèques, recrutement, clients défaillants
   Reproduit fidèlement le correctif du TP02 BPMN (2).
   ============================================================ */
(function () {

  const IDS = ['tp2-ex1q', 'tp2-ex1', 'tp2-ex2q', 'tp2-ex2', 'tp2-ex3q', 'tp2-ex3'];

  function canvasIn(parent, title, tag) {
    const { panel, scroll } = H.canvas(title, tag);
    parent.appendChild(panel);
    return scroll;
  }

  /* ---------------- Exercice 1 : Gestion des hypothèques ---------------- */
  const EX1 = {
    w: 1240, h: 660,
    pools: [
      { x: 30, y: 20, w: 1180, h: 100, label: 'Client' },
      {
        x: 30, y: 155, w: 1180, h: 480, label: 'entreprise',
        lanes: [
          { label: 'Service client', h: 175 },
          { label: 'Service administratif', h: 305 }
        ]
      }
    ],
    nodes: [
      /* pool client (white box partielle) */
      { id: 'der', type: 'catch', event: 'message', x: 560, y: 70, label: "demande d'info reçue", ldy: -46, lw: 22 },
      { id: 'ci', type: 'task', x: 690, y: 70, w: 100, h: 50, label: 'compléter info' },
      { id: 'ei', type: 'end', event: 'message', x: 810, y: 70, label: 'envoyer info', ldy: -44 },
      /* service client */
      { id: 's', type: 'start', x: 100, y: 240 },
      { id: 'eo', type: 'task', x: 210, y: 240, w: 106, h: 56, label: 'Envoyer offre', icon: 'send' },
      { id: 'vr', type: 'task', x: 360, y: 240, w: 108, h: 56, label: 'Vérifier réponse', icon: 'receive' },
      { id: 'gd', type: 'gateway', gw: 'xor', x: 480, y: 240, label: 'Décision?', ldy: -6, ldx: 0 },
      { id: 'era', type: 'task', x: 640, y: 240, w: 128, h: 56, label: 'enregistrer refus et annulation' },
      /* service administratif */
      { id: 'gj1', type: 'gateway', gw: 'xor', x: 150, y: 480 },
      { id: 'vci', type: 'task', x: 285, y: 480, w: 118, h: 56, label: 'vérifier complétude info' },
      { id: 'gi', type: 'gateway', gw: 'xor', x: 415, y: 480, label: 'info?', ldy: 48, ldx: -18 },
      { id: 'dim', type: 'task', x: 560, y: 415, w: 118, h: 56, label: 'demander info manquantes', icon: 'send' },
      { id: 'evg', type: 'gateway', gw: 'event', x: 690, y: 415 },
      { id: 'ir', type: 'catch', event: 'message', x: 810, y: 385, label: 'info reçues', ldy: 2, ldx: 44 },
      { id: 'tm', type: 'catch', event: 'timer', x: 810, y: 480, label: '2 semaines', ldy: 4, ldx: -46 },
      { id: 'eea', type: 'task', x: 940, y: 480, w: 124, h: 58, label: 'Enregistrer expiration et annulation' },
      { id: 'ecl', type: 'task', x: 560, y: 565, w: 112, h: 52, label: 'enregistrer clôture' },
      { id: 'gj2', type: 'gateway', gw: 'xor', x: 1050, y: 480 },
      { id: 'gj3', type: 'gateway', gw: 'xor', x: 1115, y: 480 },
      { id: 'fin', type: 'end', x: 1170, y: 480 }
    ],
    flows: [
      { id: 'c1', from: 'der', to: 'ci' },
      { id: 'c2', from: 'ci', to: 'ei' },
      { id: 'f1', from: 's', to: 'eo' },
      { id: 'f2', from: 'eo', to: 'vr' },
      { id: 'f3', from: 'vr', to: 'gd' },
      { id: 'f4', from: 'gd', to: 'era', points: [[503, 240], [576, 240]], label: 'annulation', lx: 540, ly: 258 },
      { id: 'f5', from: 'gd', to: 'gj1', points: [[480, 263], [480, 310], [150, 310], [150, 457]], label: 'continuation', lx: 385, ly: 300 },
      { id: 'f6', from: 'gj1', to: 'vci' },
      { id: 'f7', from: 'vci', to: 'gi' },
      { id: 'f8', from: 'gi', to: 'dim', points: [[415, 457], [415, 415], [501, 415]], label: 'incomplet', lx: 455, ly: 402 },
      { id: 'f9', from: 'gi', to: 'ecl', points: [[415, 503], [415, 565], [504, 565]], label: 'complet', lx: 452, ly: 550 },
      { id: 'f10', from: 'dim', to: 'evg' },
      { id: 'f11', from: 'evg', to: 'ir', points: [[713, 415], [750, 415], [750, 385], [793, 385]] },
      { id: 'f12', from: 'evg', to: 'tm', points: [[713, 415], [750, 415], [750, 480], [793, 480]] },
      { id: 'f13', from: 'ir', to: 'gj1', points: [[810, 368], [810, 342], [150, 342], [150, 457]] },
      { id: 'f14', from: 'tm', to: 'eea' },
      { id: 'f15', from: 'eea', to: 'gj2' },
      { id: 'f16', from: 'ecl', to: 'gj2', points: [[616, 565], [1050, 565], [1050, 503]] },
      { id: 'f17', from: 'gj2', to: 'gj3' },
      { id: 'f18', from: 'era', to: 'gj3', points: [[704, 240], [1115, 240], [1115, 457]] },
      { id: 'f19', from: 'gj3', to: 'fin' },
      { id: 'm1', from: 'eo', to: 'eo', type: 'msg', points: [[210, 212], [210, 120]], label: 'Offre', lx: 180, ly: 165 },
      { id: 'm2', from: 'vr', to: 'vr', type: 'msg', points: [[360, 120], [360, 212]], label: 'Vérifier réponse', lx: 300, ly: 165, lw: 16 },
      { id: 'm3', from: 'dim', to: 'der', type: 'msg', points: [[560, 387], [560, 87]] },
      { id: 'm4', from: 'ei', to: 'ir', type: 'msg', points: [[810, 87], [810, 368]] }
    ]
  };

  /* ---------------- Exercice 2 : Recrutement ---------------- */
  const EX2 = {
    w: 1160, h: 440,
    pools: [
      { x: 30, y: 20, w: 1100, h: 60, label: 'Candidat', band: false },
      { x: 30, y: 115, w: 1100, h: 290, label: 'Recrutement' }
    ],
    nodes: [
      { id: 's', type: 'start', x: 110, y: 250 },
      { id: 'scr', type: 'task', x: 225, y: 250, w: 110, h: 58, label: 'screening des cv', icon: 'receive', marker: 'loop' },
      { id: 'ed', type: 'task', x: 385, y: 250, w: 106, h: 58, label: 'envoyer les dates', icon: 'send' },
      { id: 'sub', type: 'subprocess', x: 650, y: 250, w: 320, h: 165, label: 'interview de chaque candidat', marker: 'multiSeq' },
      { id: 'ts', type: 'catch', event: 'timer', x: 545, y: 250, label: 'Date interview', ldy: 2, lw: 14 },
      { id: 'ic', type: 'task', x: 665, y: 250, w: 108, h: 56, label: 'interviewer candidat', sub: true },
      { id: 'se', type: 'end', x: 770, y: 250, r: 14 },
      { id: 'smc', type: 'task', x: 895, y: 250, w: 112, h: 58, label: 'sélectionner meilleur candidat' },
      { id: 'eo', type: 'task', x: 1035, y: 250, w: 100, h: 58, label: 'envoyer offre', icon: 'send' },
      { id: 'fin', type: 'end', x: 1105, y: 250 },
      { id: 'n1', type: 'note', x: 330, y: 360, w: 130, h: 40, label: "Jusqu'à 5 CV retenus" },
      { id: 'n2', type: 'note', x: 700, y: 385, w: 140, h: 36, label: 'Pour chaque candidat' }
    ],
    flows: [
      { id: 'f1', from: 's', to: 'scr' },
      { id: 'f2', from: 'scr', to: 'ed' },
      { id: 'f3', from: 'ed', to: 'ts', points: [[438, 250], [528, 250]] },
      { id: 'f4', from: 'ts', to: 'ic' },
      { id: 'f5', from: 'ic', to: 'se' },
      { id: 'f6', from: 'sub', to: 'smc', points: [[810, 250], [839, 250]] },
      { id: 'f7', from: 'smc', to: 'eo' },
      { id: 'f8', from: 'eo', to: 'fin' },
      { id: 'a1', from: 'scr', to: 'n1', type: 'assoc', points: [[250, 279], [290, 345]] },
      { id: 'a2', from: 'sub', to: 'n2', type: 'assoc', points: [[660, 333], [672, 368]] },
      { id: 'm1', from: 'scr', to: 'scr', type: 'msg', points: [[225, 80], [225, 221]], label: 'CV', lx: 205, ly: 150 },
      { id: 'm2', from: 'ed', to: 'ed', type: 'msg', points: [[385, 221], [385, 80]], label: 'Date', lx: 362, ly: 150 },
      { id: 'm3', from: 'eo', to: 'eo', type: 'msg', points: [[1035, 221], [1035, 80]], label: 'Offre', lx: 1010, ly: 150 }
    ]
  };

  /* ---------------- Exercice 3 : Clients défaillants ---------------- */
  const EX3 = {
    w: 1300, h: 700,
    pools: [
      { x: 30, y: 20, w: 1240, h: 650, label: 'Employé' }
    ],
    nodes: [
      { id: 's', type: 'start', event: 'timer', x: 105, y: 330, label: 'Tous les matins', lw: 16 },
      { id: 'svg', type: 'task', x: 230, y: 330, w: 118, h: 58, label: 'Sauvegarder la base de données' },
      { id: 'vnc', type: 'task', x: 390, y: 330, w: 126, h: 58, label: 'vérifier nouveaux comptes défaillants' },
      { id: 'gx', type: 'gateway', gw: 'xor', x: 520, y: 330, label: 'Nouveautés?', ldy: 50, ldx: 6 },
      /* sous-processus CRM (haut) */
      { id: 'subCrm', type: 'subprocess', x: 840, y: 160, w: 500, h: 200, label: 'Vérification du CRM' },
      { id: 'cs', type: 'start', x: 650, y: 170, r: 14 },
      { id: 'vec', type: 'task', x: 760, y: 170, w: 110, h: 54, label: 'vérifier entrées du CRM' },
      { id: 'gi', type: 'gateway', gw: 'xor', x: 880, y: 170, label: 'Nouveautés?', ldy: -4, ldx: -8 },
      { id: 'csd', type: 'task', x: 965, y: 225, w: 118, h: 52, label: 'Changer le statut des clients en défaut' },
      { id: 'gj', type: 'gateway', gw: 'xor', x: 1040, y: 170 },
      { id: 'ce', type: 'end', x: 1090, y: 170, r: 14 },
      { id: 'bt1', type: 'boundary', event: 'timer', x: 700, y: 260, r: 15, interrupting: false, label: '16h00', ldx: -34, ldy: -14 },
      { id: 'ns1', type: 'end', event: 'message', x: 780, y: 310, label: 'Notification superviseur', ldy: 4, ldx: 76, lw: 24 },
      /* sous-processus Rapport (bas) */
      { id: 'subRap', type: 'subprocess', x: 810, y: 505, w: 440, h: 170, label: 'Rapport compte défaillant' },
      { id: 'rs', type: 'start', x: 650, y: 510, r: 14 },
      { id: 'ecd', type: 'task', x: 775, y: 510, w: 120, h: 56, label: 'enregistrer client et compte en défaut' },
      { id: 'ccl', type: 'task', x: 925, y: 510, w: 118, h: 56, label: 'création liste clients en défauts' },
      { id: 're', type: 'end', x: 1000, y: 570, r: 14 },
      { id: 'bt2', type: 'boundary', event: 'timer', x: 700, y: 590, r: 15, interrupting: false, label: '14h30', ldx: -34, ldy: -14 },
      { id: 'ns2', type: 'end', event: 'message', x: 780, y: 640, label: 'Notification superviseur', ldy: 4, ldx: 76, lw: 24 },
      /* fin commune */
      { id: 'gjm', type: 'gateway', gw: 'xor', x: 1100, y: 330 },
      { id: 'ras', type: 'task', x: 1185, y: 330, w: 104, h: 58, label: 'rapport au superviseur', icon: 'send' },
      { id: 'fin', type: 'end', x: 1252, y: 330, r: 15 }
    ],
    flows: [
      { id: 'f1', from: 's', to: 'svg' },
      { id: 'f2', from: 'svg', to: 'vnc' },
      { id: 'f3', from: 'vnc', to: 'gx' },
      { id: 'f4', from: 'gx', to: 'subCrm', points: [[520, 307], [520, 160], [590, 160]], label: 'aucun enregistrement', lx: 520, ly: 130, lw: 24 },
      { id: 'f5', from: 'gx', to: 'subRap', points: [[520, 353], [520, 505], [590, 505]], label: 'nouveau enregistrement', lx: 520, ly: 490, lw: 26 },
      /* intérieur CRM */
      { id: 'c1', from: 'cs', to: 'vec' },
      { id: 'c2', from: 'vec', to: 'gi' },
      { id: 'c3', from: 'gi', to: 'gj', points: [[880, 147], [880, 105], [1040, 105], [1040, 147]], label: 'Aucune entrée', lx: 960, ly: 93, lw: 20 },
      { id: 'c4', from: 'gi', to: 'csd', points: [[880, 193], [880, 225], [904, 225]], label: 'Nouvelle entrée', lx: 880, ly: 288, lw: 18 },
      { id: 'c5', from: 'csd', to: 'gj', points: [[1026, 225], [1040, 225], [1040, 193]] },
      { id: 'c6', from: 'gj', to: 'ce', points: [[1063, 170], [1076, 170]] },
      { id: 'b1', from: 'bt1', to: 'ns1', points: [[700, 275], [700, 310], [763, 310]] },
      /* intérieur Rapport */
      { id: 'r1', from: 'rs', to: 'ecd' },
      { id: 'r2', from: 'ecd', to: 'ccl' },
      { id: 'r3', from: 'ccl', to: 're', points: [[984, 538], [984, 570], [986, 570]] },
      { id: 'b2', from: 'bt2', to: 'ns2', points: [[700, 605], [700, 640], [763, 640]] },
      /* sorties des sous-processus */
      { id: 'f6', from: 'subCrm', to: 'gjm', points: [[1090, 160], [1100, 160], [1100, 307]] },
      { id: 'f7', from: 'subRap', to: 'gjm', points: [[1030, 505], [1100, 505], [1100, 353]] },
      { id: 'f8', from: 'gjm', to: 'ras' },
      { id: 'f9', from: 'ras', to: 'fin' }
    ]
  };

  APP.register('tp2', {
    title: 'TP2 · BPMN avancé',
    short: 'T2',
    module: 'bpmn',
    ids: IDS,
    render(page) {
      page.innerHTML = `
        <p class="eyebrow">TP2 · BPMN avancé — résolution</p>
        <h1>TP2 — Trois processus complets, trois motifs avancés</h1>
        <p class="lead">Chaque exercice du TP2 introduit un motif avancé : le <b>gateway événementiel</b> (hypothèques),
        les <b>boucles &amp; multi-instances</b> (recrutement) et les <b>timers frontière non-interruptibles</b> sur
        sous-processus (clients défaillants). Maîtrisez ces trois motifs et le TP est gagné.</p>
      `;

      /* ---------- Exercice 1 ---------- */
      let body = QUIZ.exo(page, { title: 'Exercice 1 — Gestion des hypothèques', tag: 'Modélisation', ids: ['tp2-ex1q', 'tp2-ex1'], anchor: 'ex1' });
      body.innerHTML = `<div class="enonce">
        <p><b>Énoncé.</b> Le représentant du service clientèle envoie une offre de prêt pour le client et attend une réponse
        de sa part. Si le client appelle ou écrit pour indiquer un refus du prêt hypothécaire, les détails du dossier sont mis
        à jour et le travail est ensuite archivé avant l'annulation de l'offre.</p>
        <p>Si le client renvoie les documents de l'offre complétés, alors le dossier est transmis au service administratif pour
        la clôture du dossier. Si tous les documents prérequis ne sont pas fournis, un message est envoyé au client lui demandant
        les documents manquants. Dans tous les cas, <b>si aucune réponse concernant les prérequis manquants n'est reçue au bout de
        deux semaines</b>, les détails de dossier sont mis à jour avant son archivage et l'annulation de l'offre de prêt.
        Une fois le dossier complet, le service administratif finalise le dossier qui est transmis ensuite pour enregistrement
        dans le système.</p></div>`;
      QUIZ.qcm(body, {
        id: 'tp2-ex1q',
        question: 'Échauffement : « on attend la réponse du client, mais au bout de 2 semaines sans réponse, on annule ». Quel motif BPMN ?',
        options: [
          { t: 'Une tâche « Attendre 2 semaines » suivie d’un XOR', why: 'Attendre n’est pas une tâche, et il faut réagir au PREMIER des deux événements — pas aux deux.' },
          { t: 'Un gateway événementiel avec deux issues : catch message « info reçues » et catch timer « 2 semaines »', ok: true, why: 'L’event-based gateway suit le chemin du premier événement attrapé : réponse reçue OU délai expiré.' },
          { t: 'Un timer frontière interruptible sur la tâche « demander info »', why: 'Possible dans d’autres contextes, mais ici l’attente suit l’ENVOI de la demande : le motif du correctif est le gateway événementiel.' }
        ]
      });
      const api1 = BPMN.render(canvasIn(body, 'Solution — construite étape par étape', ['Correctif officiel', 'tag-ok']), EX1,
        { alt: 'Processus hypothèques : pools Client et entreprise (Service client, Service administratif)' });
      QUIZ.steps(body, {
        id: 'tp2-ex1',
        api: api1,
        steps: [
          {
            title: 'Participants', text: `Pool <b>Client</b> (partiellement white box : on y montre juste sa réaction à la demande d'infos)
            et pool <b>entreprise</b> avec 2 lanes : <b>Service client</b> et <b>Service administratif</b>.
            Le service client envoie l'offre (tâche d'envoi + message « Offre ») puis attend et vérifie la réponse (tâche de réception).`,
            show: []
          },
          {
            title: 'La décision du client', text: `XOR « <b>Décision?</b> » : si le client refuse (« annulation ») → « enregistrer refus et annulation »,
            qui file vers la fin du processus. Sinon (« continuation ») le dossier descend au <b>Service administratif</b> via un XOR de convergence
            (il servira aussi au retour de la boucle).`,
            show: ['gd', 'era', 'gj1', 'f4', 'f5']
          },
          {
            title: 'Complétude du dossier', text: `Le service administratif vérifie la complétude : XOR « <b>info?</b> » —
            <b>complet</b> → « enregistrer clôture » ; <b>incomplet</b> → « demander info manquantes » (tâche d'envoi, message vers le Client).`,
            show: ['vci', 'gi', 'dim', 'ecl', 'f6', 'f7', 'f8', 'f9', 'm3']
          },
          {
            title: 'Le gateway événementiel', text: `Après la demande d'infos : gateway <b>événementiel</b> (losange au pentagone).
            Deux événements en compétition : <b>« info reçues »</b> (catch message — le client a complété et renvoyé les infos)
            → retour au XOR de convergence pour re-vérifier la complétude (boucle) ; <b>ou</b> le <b>timer « 2 semaines »</b> expire
            → « Enregistrer expiration et annulation ». Le premier événement qui survient gagne.`,
            show: ['evg', 'ir', 'tm', 'eea', 'f10', 'f11', 'f12', 'f13', 'f14', 'der', 'ci', 'ei', 'c1', 'c2', 'm4']
          },
          {
            title: 'Convergences finales', text: `Les trois issues — clôture enregistrée, expiration, refus du client — convergent via
            deux XOR de fusion vers l'événement de fin unique. Remarquez : chaque chemin d'annulation a bien « mis à jour les détails »
            avant l'archivage, comme l'exige l'énoncé.`,
            show: ['gj2', 'gj3', 'fin', 'f15', 'f16', 'f17', 'f18', 'f19']
          }
        ]
      });
      body.insertAdjacentHTML('beforeend', H.callout('key', '★',
        `<b>À retenir :</b> « attendre X OU l'expiration d'un délai » = <b>gateway événementiel + catch message + catch timer</b>.
        Et la boucle de re-vérification passe par un <b>XOR de convergence placé AVANT</b> la tâche de vérification.`));

      /* ---------- Exercice 2 ---------- */
      body = QUIZ.exo(page, { title: 'Exercice 2 — Processus de recrutement', tag: 'Modélisation', ids: ['tp2-ex2q', 'tp2-ex2'], anchor: 'ex2' });
      body.innerHTML = `<div class="enonce">
        <p><b>Énoncé.</b> Modéliser un processus de recrutement. On reçoit des CV des candidats. On réalise un screening des CV
        <b>jusqu'à ce que</b> cinq candidats potentiels soient retenus. Ensuite, on va procéder à une interview de <b>chacun des
        cinq candidats</b> lors d'une date définie par la société. On choisit le meilleur candidat et on lui fait une offre.</p></div>`;
      QUIZ.qcm(body, {
        id: 'tp2-ex2q',
        question: 'Deux répétitions se cachent dans l’énoncé. Lesquelles, et avec quels marqueurs ?',
        options: [
          { t: 'Screening = boucle ↺ (on ne sait pas combien de CV il faudra) · Interviews = multi-instance (5 instances, une par candidat)', ok: true, why: 'Boucle quand le nombre d’itérations est inconnu à l’avance (« jusqu’à ce que ») ; multi-instance quand il est connu (« chacun des cinq »).' },
          { t: 'Screening = multi-instance · Interviews = boucle', why: 'C’est l’inverse : le screening s’arrête « jusqu’à » une condition (inconnu), les interviews sont au nombre connu de 5.' },
          { t: 'Les deux sont des boucles simples', why: 'Les interviews sont « pour chaque candidat » : le nombre (5) est connu à l’avance → multi-instance.' }
        ]
      });
      BPMN.render(canvasIn(body, 'Solution du correctif', ['Correctif officiel', 'tag-ok']), EX2,
        { alt: 'Processus de recrutement avec pool Candidat, screening en boucle et sous-processus multi-instance' });
      QUIZ.qcm(body, {
        id: 'tp2-ex2',
        question: 'Dans la solution, pourquoi le sous-processus « interview de chaque candidat » démarre-t-il par un événement timer « Date interview » ?',
        options: [
          { t: 'Parce que chaque interview a lieu « lors d’une date définie par la société » : chaque instance attend sa date avant d’interviewer', ok: true, why: 'Le timer catch traduit « lors d’une date définie » ; le marqueur ≡ (séquentiel) répète le sous-processus pour chaque candidat.' },
          { t: 'Parce que tout sous-processus doit commencer par un timer', why: 'Aucune règle de ce genre : un sous-processus démarre par l’événement adapté au contexte.' },
          { t: 'Pour limiter la durée de l’interview', why: 'Un timer de DÉBUT attend un moment ; limiter une durée serait un timer FRONTIÈRE sur la tâche.' }
        ],
        explain: 'Notez aussi les 3 flux de messages avec le pool Candidat : CV (entrant), Date (sortant), Offre (sortant) — et l’annotation « Jusqu’à 5 CV retenus » sur la boucle.'
      });

      /* ---------- Exercice 3 ---------- */
      body = QUIZ.exo(page, { title: 'Exercice 3 — Clients défaillants', tag: 'Modélisation', ids: ['tp2-ex3q', 'tp2-ex3'], anchor: 'ex3' });
      body.innerHTML = `<div class="enonce">
        <p><b>Énoncé.</b> Tous les matins, un employé sauvegarde la base de données et il est vérifié que la table « compte
        défaillant » a de nouveaux enregistrements ou non.</p>
        <p>Si de nouveaux enregistrements existent, il faut créer le rapport « client en défaut » qui consiste à : enregistrer
        les clients en défaut ainsi que le solde de leur compte, ensuite à créer une liste contenant tous ces clients.
        <b>Ce rapport doit être complété avant 14h30, sinon un superviseur doit recevoir un message</b> l'informant que le rapport
        arrivera en retard.</p>
        <p>Si aucun enregistrement n'existe, la vérification du CRM a lieu. C'est-à-dire, l'employé vérifie en détail si le CRM
        contient de nouvelles entrées. Seulement dans l'affirmative, le statut des clients doit être passé à « en défaut » dans
        le CRM. <b>Le CRM doit être vérifié avant 16h00, sinon un superviseur doit recevoir un message</b> l'informant que le rapport
        arrivera en retard.</p>
        <p>Dans les deux cas (rapport « client en défaut » ou vérification du CRM), un rapport détaillé de la situation doit être
        envoyé au superviseur.</p></div>`;
      QUIZ.qcm(body, {
        id: 'tp2-ex3q',
        question: '« Le rapport doit être complété avant 14h30, sinon le superviseur reçoit un message — et le travail continue. » Comment modéliser ?',
        options: [
          { t: 'Un timer frontière INTERRUPTIBLE (trait plein) sur le sous-processus', why: 'Interruptible = le travail est ANNULÉ à 14h30. Or l’énoncé dit juste que le rapport « arrivera en retard » : il continue.' },
          { t: 'Un timer frontière NON-INTERRUPTIBLE (trait pointillé) « 14h30 » sur le sous-processus, menant à un événement de fin message « Notification superviseur »', ok: true, why: 'Le travail continue ET une notification part : exactement la sémantique non-interruptible.' },
          { t: 'Un événement timer sur le flux, avant le rapport', why: 'Un timer SUR le flux ferait ATTENDRE 14h30 — contresens complet.' }
        ]
      });
      const api3 = BPMN.render(canvasIn(body, 'Solution — construite étape par étape', ['Correctif officiel', 'tag-ok']), EX3,
        { alt: 'Processus clients défaillants avec deux sous-processus étendus et timers frontière non-interruptibles' });
      QUIZ.steps(body, {
        id: 'tp2-ex3',
        api: api3,
        steps: [
          {
            title: 'Le déclencheur quotidien', text: `« <b>Tous les matins</b> » = événement de début <b>timer</b>. Puis la séquence :
            « Sauvegarder la base de données » → « vérifier nouveaux comptes défaillants », dans la lane <b>Employé</b>.`, show: []
          },
          {
            title: 'La décision', text: `XOR « <b>Nouveautés?</b> » : <b>nouveau enregistrement</b> → branche du bas (rapport) ;
            <b>aucun enregistrement</b> → branche du haut (vérification du CRM). Chaque branche est un <b>sous-processus étendu</b> :
            un bloc de travail cohérent, ce qui permettra d'y accrocher un timer frontière.`,
            show: ['gx', 'f4', 'f5', 'subCrm', 'subRap', 'cs', 'rs']
          },
          {
            title: 'Sous-processus « Rapport compte défaillant »', text: `« enregistrer client et compte en défaut » <b>puis</b>
            « création liste clients en défauts ». Le timer frontière <b>non-interruptible « 14h30 »</b> (pointillé) déclenche
            un événement de fin <b>message</b> « Notification superviseur » — sans arrêter le rapport.`,
            show: ['ecd', 'ccl', 're', 'bt2', 'ns2', 'r1', 'r2', 'r3', 'b2']
          },
          {
            title: 'Sous-processus « Vérification du CRM »', text: `« vérifier entrées du CRM » puis XOR « Nouveautés? » :
            <b>Nouvelle entrée</b> → « Changer le statut des clients en défaut » ; <b>Aucune entrée</b> → on passe directement à la fusion XOR.
            Timer frontière non-interruptible <b>« 16h00 »</b> → « Notification superviseur ».`,
            show: ['vec', 'gi', 'csd', 'gj', 'ce', 'bt1', 'ns1', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'b1']
          },
          {
            title: 'La fin commune', text: `« Dans les deux cas, un rapport détaillé doit être envoyé au superviseur » :
            les deux sous-processus convergent (XOR), puis « <b>rapport au superviseur</b> » (tâche d'envoi) et l'événement de fin.`,
            show: ['gjm', 'ras', 'fin', 'f6', 'f7', 'f8', 'f9']
          }
        ]
      });
      body.insertAdjacentHTML('beforeend', H.callout('key', '★',
        `<b>Le trio gagnant de cet exercice :</b> ① encapsuler chaque branche dans un <b>sous-processus étendu</b> ;
        ② y accrocher un <b>timer frontière non-interruptible</b> (le travail continue, la notification part) ;
        ③ faire converger les branches par un <b>XOR</b> avant la tâche commune finale.`));

      H.nextPrev(page, ['tp1', 'TP1 · BPMN de base'], ['archimate', 'Théorie ArchiMate']);
    }
  });
})();
