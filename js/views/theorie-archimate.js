/* ============================================================
   Théorie ArchiMate — couches, éléments, relations
   Basé sur 4_EA.pdf (pp. 28-103) et la fiche récapitulative.
   ============================================================ */
(function () {

  const IDS = ['am-layers-q', 'am-elem-q1', 'am-elem-q2', 'am-rel-q1', 'am-rel-q2', 'am-read-q', 'am-quiz1', 'am-quiz2'];

  /* --- mini-figure d'un élément --- */
  function figEl(kind, layer, label, opts) {
    const div = document.createElement('div');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 150 62');
    svg.setAttribute('width', '150');
    div.appendChild(svg);
    const spec = {
      w: 150, h: 62,
      nodes: [Object.assign({ id: 'n', kind, layer, x: 75, y: 31, w: 128, h: 46, label }, opts || {})],
      rels: []
    };
    const tmp = document.createElement('div');
    ARCHI.render(tmp, spec);
    const inner = tmp.querySelector('svg');
    inner.querySelector('rect')?.setAttribute('fill', 'transparent'); // fond
    div.innerHTML = '';
    div.appendChild(inner);
    return div;
  }

  /* --- mini-figure d'une relation --- */
  function figRel(type, extra) {
    const div = document.createElement('div');
    const spec = {
      w: 150, h: 40,
      nodes: [
        { id: 'a', kind: 'label', x: 10, y: 20, label: '' },
        { id: 'b', kind: 'label', x: 140, y: 20, label: '' }
      ],
      rels: [{ from: 'a', to: 'b', type, points: [[14, 20], [136, 20]], label: extra }]
    };
    ARCHI.render(div, spec);
    div.querySelector('svg').querySelector('rect')?.setAttribute('fill', 'transparent');
    return div;
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

  /* --- exemple ArchiSurance (4_EA p.67 / TP3 p.3) --- */
  const ARCHISURANCE = {
    w: 960, h: 620,
    nodes: [
      { id: 'insurant', kind: 'role', layer: 'business', x: 430, y: 55, w: 130, h: 48, label: 'Insurant' },
      { id: 'customer', kind: 'actor', layer: 'business', x: 640, y: 55, w: 120, h: 48, label: 'Customer' },
      { id: 'sReg', kind: 'service', layer: 'business', x: 235, y: 160, w: 140, h: 44, label: 'Claims Registration' },
      { id: 'sAcc', kind: 'service', layer: 'business', x: 430, y: 160, w: 140, h: 44, label: 'Claims Acceptance' },
      { id: 'sPay', kind: 'service', layer: 'business', x: 625, y: 160, w: 140, h: 44, label: 'Claims Payment' },
      { id: 'archisurance', kind: 'actor', layer: 'business', x: 860, y: 130, w: 130, h: 48, label: 'ArchiSurance' },
      { id: 'insurer', kind: 'role', layer: 'business', x: 860, y: 235, w: 130, h: 48, label: 'Insurer' },
      { id: 'proc', container: true, layer: 'business', kind: 'process', x: 160, y: 235, w: 620, h: 110, label: 'Process Claims', labelX: 470, italic: false },
      { id: 'pReg', kind: 'process', layer: 'business', x: 250, y: 300, w: 105, h: 46, label: 'Register' },
      { id: 'pAcc', kind: 'process', layer: 'business', x: 395, y: 300, w: 105, h: 46, label: 'Accept' },
      { id: 'pAdj', kind: 'process', layer: 'business', x: 540, y: 300, w: 105, h: 46, label: 'Adjudicate' },
      { id: 'pPay', kind: 'process', layer: 'business', x: 685, y: 300, w: 105, h: 46, label: 'Pay' },
      { id: 'custInfo', kind: 'object', layer: 'business', x: 90, y: 300, w: 120, h: 46, label: 'Customer Information' },
      { id: 'aCDM', kind: 'service', layer: 'app', x: 320, y: 420, w: 150, h: 44, label: 'Customer Data Management' },
      { id: 'aPP', kind: 'service', layer: 'app', x: 685, y: 420, w: 140, h: 44, label: 'Payment Processing' },
      { id: 'custData', kind: 'dataObject', layer: 'app', x: 120, y: 530, w: 120, h: 46, label: 'Customer Data' },
      { id: 'crm', kind: 'component', layer: 'app', x: 320, y: 530, w: 130, h: 48, label: 'CRM system' },
      { id: 'finapp', kind: 'component', layer: 'app', x: 685, y: 530, w: 130, h: 48, label: 'Financial application' }
    ],
    rels: [
      { id: 'r1', from: 'customer', to: 'insurant', type: 'assignment', points: [[580, 55], [495, 55]] },
      { id: 'r2', from: 'sReg', to: 'insurant', type: 'serving', points: [[270, 138], [395, 79]] },
      { id: 'r3', from: 'sAcc', to: 'insurant', type: 'serving', points: [[430, 138], [430, 79]] },
      { id: 'r4', from: 'sPay', to: 'insurant', type: 'serving', points: [[620, 138], [465, 79]] },
      { id: 'r5', from: 'archisurance', to: 'insurer', type: 'assignment', points: [[860, 154], [860, 211]] },
      { id: 'r6', from: 'insurer', to: 'proc', type: 'assignment', points: [[795, 250], [780, 262]] },
      { id: 'r7', from: 'proc', to: 'sReg', type: 'realization', points: [[240, 235], [240, 182]] },
      { id: 'r8', from: 'proc', to: 'sAcc', type: 'realization', points: [[430, 235], [430, 182]] },
      { id: 'r9', from: 'proc', to: 'sPay', type: 'realization', points: [[625, 235], [625, 182]] },
      { id: 'r10', from: 'pReg', to: 'pAcc', type: 'triggering', points: [[303, 300], [342, 300]] },
      { id: 'r11', from: 'pAcc', to: 'pAdj', type: 'triggering', points: [[448, 300], [487, 300]] },
      { id: 'r12', from: 'pAdj', to: 'pPay', type: 'triggering', points: [[593, 300], [632, 300]] },
      { id: 'r13', from: 'pReg', to: 'custInfo', type: 'access', points: [[197, 300], [150, 300]] },
      { id: 'r14', from: 'aCDM', to: 'pReg', type: 'serving', points: [[300, 398], [300, 345]] },
      { id: 'r15', from: 'aPP', to: 'pPay', type: 'serving', points: [[685, 398], [685, 323]] },
      { id: 'r16', from: 'crm', to: 'aCDM', type: 'realization', points: [[320, 506], [320, 442]] },
      { id: 'r17', from: 'finapp', to: 'aPP', type: 'realization', points: [[685, 506], [685, 442]] },
      { id: 'r18', from: 'crm', to: 'custData', type: 'access', points: [[255, 530], [180, 530]] },
      { id: 'r19', from: 'custData', to: 'custInfo', type: 'realization', points: [[120, 507], [120, 323]] }
    ]
  };

  APP.register('archimate', {
    title: 'Théorie · ArchiMate',
    short: 'A',
    module: 'archi',
    ids: IDS,
    render(page) {
      page.innerHTML = `
        <p class="eyebrow">Théorie · Architecture d'Entreprise</p>
        <h1>ArchiMate — cartographier toute l'entreprise</h1>
        <p class="lead">Là où BPMN zoome sur <i>un</i> processus, <b>ArchiMate</b> montre l'entreprise entière en couches :
        qui fait quoi (couche <b>métier</b>), avec quelles applications (couche <b>systèmes d'information</b>),
        sur quelle infrastructure (couche <b>technologique</b>). C'est le langage de l'architecture d'entreprise,
        complémentaire de TOGAF, et l'outil du TP3 (modélisé avec Archi / Visual Paradigm).</p>
        <div id="s-layers"></div>
        <div id="s-elems"></div>
        <div id="s-rels"></div>
        <div id="s-example"></div>
        <div id="s-errors"></div>
        <div id="s-quiz"></div>
      `;

      /* ============ 1. Les couches ============ */
      let s = page.querySelector('#s-layers');
      s.innerHTML = `<h2>1 · Les trois couches</h2>
        <div class="table-scroll"><table class="cmp-table">
          <thead><tr><th>Couche</th><th>Couleur</th><th>Contenu</th><th>Question type</th></tr></thead>
          <tbody>
            <tr><td><b>Métier (Business)</b></td>
              <td><span class="tag" style="background:#fff6be;color:#6b6015">Jaune</span></td>
              <td>Acteurs, rôles, processus, services métier, événements, objets métier</td>
              <td>« Qui fait quoi, pour offrir quel service à qui ? »</td></tr>
            <tr><td><b>Systèmes d'information (Application)</b></td>
              <td><span class="tag" style="background:#c5eff3;color:#155e66">Bleu clair</span></td>
              <td>Composants applicatifs, services applicatifs, objets de données</td>
              <td>« Quelles applications supportent ces activités ? »</td></tr>
            <tr><td><b>Technologique (Technology)</b></td>
              <td><span class="tag" style="background:#d3e8c5;color:#3c5c26">Vert</span></td>
              <td>Nœuds, serveurs, réseaux, logiciels système</td>
              <td>« Sur quelle infrastructure tournent-elles ? » (hors périmètre du TP3)</td></tr>
          </tbody>
        </table></div>
        ${H.callout('key', '★', `<b>Le principe de lecture vertical :</b> chaque couche <b>expose des services</b> à la couche
        du dessus. Un composant applicatif <b>réalise</b> (realization, pointillé + triangle creux) un service applicatif,
        qui <b>sert</b> (serving, flèche ouverte) un processus métier, qui <b>réalise</b> un service métier, qui <b>sert</b>
        un rôle ou un acteur. Repérer cette chaîne = décoder n'importe quel diagramme du TP3.`)}`;
      QUIZ.qcm(s, {
        id: 'am-layers-q',
        question: 'Un « système de gestion des commandes » utilisé par les employés est modélisé en quelle couche ?',
        options: [
          { t: 'Couche métier (jaune) — c’est un outil de l’entreprise', why: 'La couche métier contient l’organisation (acteurs, rôles, processus), pas les logiciels.' },
          { t: 'Couche application (bleu clair) — c’est un composant applicatif qui expose des services applicatifs', ok: true, why: 'Les logiciels = couche application ; ils soutiennent le métier via des services applicatifs (serving).' },
          { t: 'Couche technologique (vert)', why: 'La couche techno héberge les applications (serveurs, réseaux) — le logiciel applicatif lui-même est en couche application.' }
        ]
      });

      /* ============ 2. Les éléments ============ */
      s = page.querySelector('#s-elems');
      s.innerHTML = `<h2>2 · Les éléments de la fiche récapitulative</h2>
        <p>Règle de forme : coins <b>carrés</b> = structure (qui/quoi), coins <b>arrondis</b> = comportement (activité),
        et l'icône en haut à droite donne le type exact. Voici la couche <b>métier</b> :</p>`;
      let grid = document.createElement('div');
      grid.className = 'notation-grid';
      s.appendChild(grid);
      notCard(grid, figEl('actor', 'business', 'Business actor'), 'Acteur métier', 'Entité organisationnelle capable d’un comportement : une personne, un département, une organisation (« Customer », « ArchiSurance »).');
      notCard(grid, figEl('role', 'business', 'Business role'), 'Rôle métier', 'La responsabilité d’un comportement, à laquelle un acteur peut être ASSIGNÉ (« Insurant », « Reservation agent »).');
      notCard(grid, figEl('collaboration', 'business', 'Business collaboration'), 'Collaboration', 'Agrégat de 2+ éléments de structure qui travaillent ensemble pour un comportement collectif.');
      notCard(grid, figEl('interface', 'business', 'Business interface'), 'Interface métier', 'Point d’accès où un service métier est mis à disposition (téléphone, guichet, e-mail…).');
      notCard(grid, figEl('process', 'business', 'Business process'), 'Processus métier', 'Séquence de comportements qui produit un résultat défini (l’équivalent du processus BPMN).');
      notCard(grid, figEl('function', 'business', 'Business function'), 'Fonction métier', 'Regroupement de comportements par compétences/ressources (ventes, finance…), aligné sur l’organisation.');
      notCard(grid, figEl('event', 'business', 'Business event', { shape: 'pennant', w: 120 }), 'Événement métier', 'Changement d’état organisationnel qui DÉCLENCHE (triggering) un processus (« Customer request »).');
      notCard(grid, figEl('service', 'business', 'Business service'), 'Service métier', 'Comportement métier explicitement EXPOSÉ — ce que l’entreprise offre à ses clients.');
      notCard(grid, figEl('object', 'business', 'Business object'), 'Objet métier', 'Concept d’information du domaine (dossier, police d’assurance, plainte…).');
      s.insertAdjacentHTML('beforeend', `<p>Et la couche <b>systèmes d'information</b> (application) :</p>`);
      grid = document.createElement('div');
      grid.className = 'notation-grid';
      s.appendChild(grid);
      notCard(grid, figEl('component', 'app', 'Application component'), 'Composant applicatif', 'Encapsulation modulaire d’une fonctionnalité applicative : une application (« CRM system », « Excel order file »).');
      notCard(grid, figEl('service', 'app', 'Application service'), 'Service applicatif', 'Comportement applicatif explicitement exposé — ce que l’application OFFRE au métier.');
      notCard(grid, figEl('function', 'app', 'Application function'), 'Fonction applicative', 'Comportement automatisé interne, réalisé par un composant.');
      notCard(grid, figEl('interface', 'app', 'Application interface'), 'Interface applicative', 'Point d’accès des services applicatifs (API, écran…).');
      notCard(grid, figEl('dataObject', 'app', 'Data object'), 'Objet de données', 'Données structurées pour le traitement automatisé — la contrepartie applicative de l’objet métier.');
      notCard(grid, figEl('event', 'app', 'Application event', { shape: 'pennant', w: 120 }), 'Événement applicatif', 'Changement d’état applicatif (notification, message reçu…).');
      QUIZ.qcm(s, {
        id: 'am-elem-q1',
        question: '« Patient » — la casquette que porte la personne quand elle se fait soigner — et « M. Dupont » — la personne. Quels éléments ?',
        options: [
          { t: 'Patient = business role · M. Dupont = business actor, relié par une relation d’assignment (acteur → rôle)', ok: true, why: 'C’est exactement le duo Customer (actor) → Patient (role) de l’exercice 1 du TP3.' },
          { t: 'Les deux sont des business actors', why: '« Patient » est une responsabilité/casquette, pas une entité : c’est un rôle.' },
          { t: 'Patient = business service', why: 'Un service est un comportement exposé, pas une casquette portée par un acteur.' }
        ]
      });
      QUIZ.qcm(s, {
        id: 'am-elem-q2',
        question: 'Quelle est la différence entre un business service et un business process ?',
        options: [
          { t: 'Aucune, ce sont des synonymes', why: 'Leurs formes diffèrent (ovale vs coins arrondis + flèche) et leur sens aussi.' },
          { t: 'Le service est le comportement EXPOSÉ vers l’extérieur (le « quoi » offert) ; le processus est la séquence INTERNE qui le réalise (le « comment »)', ok: true, why: 'D’où la relation type : Process —realization→ Service —serving→ Rôle/Acteur.' },
          { t: 'Le service appartient toujours à la couche application', why: 'Il existe des services métier (jaunes) ET des services applicatifs (bleus).' }
        ]
      });

      /* ============ 3. Les relations ============ */
      s = page.querySelector('#s-rels');
      s.innerHTML = `<h2>3 · Les 11 relations (et leurs flèches)</h2>
        <p>La moitié des erreurs du TP3 sont des erreurs de <b>relations</b> : mauvais type, mauvais sens.
        Apprenez les extrémités par cœur :</p>`;
      grid = document.createElement('div');
      grid.className = 'notation-grid';
      s.appendChild(grid);
      notCard(grid, figRel('composition'), 'Composition', 'Losange PLEIN côté composite : « est composé de ». Le tout possède la partie.');
      notCard(grid, figRel('aggregation'), 'Agrégation', 'Losange CREUX côté agrégat : « regroupe » (sans possession exclusive).');
      notCard(grid, figRel('assignment'), 'Assignment', 'Boule pleine à l’origine + flèche pleine : alloue une responsabilité (acteur→rôle, rôle→processus).');
      notCard(grid, figRel('realization'), 'Realization', 'POINTILLÉ + triangle CREUX vers l’élément abstrait : « réalise » (composant→service, processus→service).');
      notCard(grid, figRel('serving'), 'Serving', 'Trait plein + flèche OUVERTE vers l’élément servi : « fournit sa fonctionnalité à ».');
      notCard(grid, figRel('access'), 'Access', 'POINTILLÉ fin (± flèche) : un comportement lit/écrit un élément passif (objet, donnée).');
      notCard(grid, figRel('influence'), 'Influence', 'Tirets + flèche ouverte, annotée +/− : affecte un élément de motivation.');
      notCard(grid, figRel('triggering'), 'Triggering', 'Trait plein + flèche PLEINE : relation temporelle/causale (événement→processus, étape→étape).');
      notCard(grid, figRel('flow'), 'Flow', 'TIRETS + flèche pleine : transfert (information, matière) d’un élément à l’autre.');
      notCard(grid, figRel('specialization'), 'Specialization', 'Trait plein + triangle creux vers le général : « est une sorte de ».');
      notCard(grid, figRel('association'), 'Association', 'Simple trait : relation non spécifiée par ailleurs.');
      s.insertAdjacentHTML('beforeend', H.callout('warn', '!',
        `<b>Les 3 confusions classiques du TP3 :</b>
        ① <b>Realization vs serving</b> — le composant <i>réalise</i> le service (pointillé, triangle creux, vers le haut) ;
        le service <i>sert</i> le processus (plein, flèche ouverte). ② <b>Le sens de la realization</b> : du concret vers l'abstrait
        (composant → service), jamais l'inverse. ③ <b>Triggering vs flow</b> : triggering = enchaînement causal (plein) ;
        flow = transfert d'information (tirets).`));
      QUIZ.qcm(s, {
        id: 'am-rel-q1',
        question: 'Le composant « CRM system » fournit le service applicatif « Customer Data Management ». Quelle relation, dans quel sens ?',
        options: [
          { t: 'CRM system —realization→ Customer Data Management (pointillé, triangle creux vers le service)', ok: true, why: 'Le concret (composant) réalise l’abstrait (service).' },
          { t: 'Customer Data Management —realization→ CRM system', why: 'Sens inversé : c’est précisément une des erreurs à repérer dans l’exercice 3 du TP3 !' },
          { t: 'CRM system —assignment→ Customer Data Management', why: 'L’assignment alloue une responsabilité (acteur→rôle) ; entre composant et service, c’est la realization.' }
        ]
      });
      QUIZ.qcm(s, {
        id: 'am-rel-q2',
        question: 'Un « Business event » (p.ex. « Rental request ») est relié au processus qu’il déclenche par…',
        options: [
          { t: 'Une relation de triggering (trait plein, flèche pleine)', ok: true, why: 'L’événement déclenche le processus : relation temporelle/causale.' },
          { t: 'Une relation serving', why: 'Un événement ne « fournit pas une fonctionnalité » : il déclenche.' },
          { t: 'Une composition', why: 'L’événement ne fait pas « partie » du processus.' }
        ]
      });

      /* ============ 4. Exemple ArchiSurance ============ */
      s = page.querySelector('#s-example');
      s.innerHTML = `<h2>4 · L'exemple du cours : ArchiSurance</h2>
        <p>Le diagramme de référence du cours et du TP3 : le traitement des sinistres d'une compagnie d'assurance,
        sur deux couches. Lisez-le de bas en haut :</p>`;
      const cv = H.canvas('ArchiSurance — Process Claims (4_EA p. 67, repris au TP3)');
      s.appendChild(cv.panel);
      ARCHI.render(cv.scroll, ARCHISURANCE, { alt: 'Modèle ArchiMate ArchiSurance à deux couches' });
      cv.panel.insertAdjacentHTML('beforeend', `<div class="dg-caption">
        Le CRM system et la Financial application (composants, bleus) <b>réalisent</b> les services applicatifs
        Customer Data Management et Payment Processing, qui <b>servent</b> les étapes du processus métier « Process Claims »
        (Register → Accept → Adjudicate → Pay, en triggering). Ce processus <b>réalise</b> les trois services métier
        (Registration, Acceptance, Payment) qui <b>servent</b> le rôle « Insurant », auquel l'acteur « Customer » est <b>assigné</b>.
        Le processus <b>accède</b> à l'objet métier « Customer Information », réalisé par l'objet de données « Customer Data ».</div>`);
      QUIZ.open(s, {
        id: 'am-read-q',
        question: 'Entraînement à la question d’examen « Expliquez ce que modélise ce diagramme » : rédigez 3-4 phrases sur ArchiSurance, puis comparez.',
        model: `<p>Le modèle décrit le traitement des déclarations de sinistre chez ArchiSurance sur deux couches.
          Au niveau <b>métier</b> : l'acteur « Customer » est assigné au rôle « Insurant », qui consomme trois services métier
          (enregistrement, acceptation et paiement des sinistres). Ces services sont réalisés par le processus métier
          « Process Claims », composé de quatre étapes en séquence (Register → Accept → Adjudicate → Pay), exécuté par
          le rôle « Insurer » assigné à l'acteur « ArchiSurance ». Le processus accède à l'objet métier « Customer Information ».</p>
          <p>Au niveau <b>application</b> : le composant « CRM system » réalise le service applicatif « Customer Data Management »
          qui sert l'étape « Register » ; le composant « Financial application » réalise « Payment Processing » qui sert l'étape
          « Pay ». L'objet de données « Customer Data », accédé par le CRM, réalise l'objet métier « Customer Information ».</p>`
      });

      /* ============ 5. Check-list de décodage ============ */
      s = page.querySelector('#s-errors');
      s.innerHTML = `<h2>5 · La grille de lecture pour le TP3</h2>
        <div class="grid-2">
        ${H.callout('key', '1', '<b>Repérer les couleurs.</b> Jaune = métier, bleu = application. Un diagramme du TP3 se décode couche par couche, de bas en haut.')}
        ${H.callout('key', '2', '<b>Suivre la chaîne de valeur.</b> Composant —réalise→ service applicatif —sert→ processus métier —réalise→ service métier —sert→ rôle/acteur.')}
        ${H.callout('key', '3', '<b>Vérifier chaque relation.</b> Bon type ? Bon sens ? (realization pointillée vers l’abstrait ; serving vers celui qui consomme ; assignment de l’acteur vers le rôle.)')}
        ${H.callout('key', '4', '<b>Chercher les invraisemblances.</b> Un service posé dans un rôle, un acteur branché sur un composant, un rôle sans processus, une application par activité (fragmentation)… — le menu des exercices 2, 3 et 4 du TP3.')}
        </div>`;

      /* ============ 6. Quiz ============ */
      s = page.querySelector('#s-quiz');
      s.innerHTML = `<h2>6 · Vérifiez votre compréhension</h2>`;
      QUIZ.qcm(s, {
        id: 'am-quiz1',
        question: 'Dans un diagramme, une flèche pointillée à triangle creux part du service applicatif « Reservation service » VERS le composant « Reservation System ». Qu’en pensez-vous ?',
        options: [
          { t: 'Correct : le service réalise le composant', why: 'La realization va du concret vers l’abstrait — un service ne « réalise » pas un composant.' },
          { t: 'Erreur de modélisation : la realization doit aller du composant (concret) vers le service (abstrait)', ok: true, why: 'C’est l’erreur exacte de l’exercice 3 du TP3.' },
          { t: 'Correct si le composant est en couche métier', why: 'Un composant applicatif est toujours en couche application, et le sens resterait faux.' }
        ]
      });
      QUIZ.qcm(s, {
        id: 'am-quiz2',
        question: 'Que signifie : Greg (actor) —assignment→ « Travel Insurance Claim Analyst » (role) —specialization→ « Specialist » (role) ?',
        options: [
          { t: 'Greg est composé d’un analyste et d’un spécialiste', why: 'Aucune composition ici.' },
          { t: 'Greg occupe le rôle d’analyste sinistres voyage, lequel est une sorte particulière du rôle « Specialist »', ok: true, why: 'Assignment = allocation de responsabilité ; specialization = « est une sorte de ».' },
          { t: 'Greg sert le rôle Specialist', why: 'Pas de serving ici — les deux relations sont assignment et specialization.' }
        ]
      });

      H.nextPrev(page, ['tp2', 'TP2 · BPMN avancé'], ['tp3', 'TP3 · ArchiMate']);
    }
  });
})();
