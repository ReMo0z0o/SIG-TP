/* ============================================================
   Examen blanc — 20 questions mélangées sur toute la matière
   ============================================================ */
(function () {

  const QUESTIONS = [
    /* ---- BPMN : notation ---- */
    {
      id: 'ex-q1', theme: 'BPMN',
      question: 'Un flux de séquence peut-il traverser la frontière entre deux lanes du même pool ?',
      options: [
        { t: 'Oui — il ne peut simplement pas sortir du pool', ok: true, why: 'Règle du cours : le sequence flow traverse les corridors mais jamais les piscines.' },
        { t: 'Non — il faut un message flow', why: 'Le message flow ne s’utilise qu’ENTRE pools distincts.' },
        { t: 'Oui, mais uniquement vers le bas', why: 'Aucune contrainte de direction n’existe.' }
      ]
    },
    {
      id: 'ex-q2', theme: 'BPMN',
      question: 'Quel symbole pour « le processus démarre tous les matins » ?',
      options: [
        { t: 'Événement de début message', why: 'Le message correspond à la réception d’une information, pas à un moment.' },
        { t: 'Événement de début timer', ok: true, why: 'Un démarrage « à un moment particulier dans le temps » = start timer (cf. TP2 ex. 3).' },
        { t: 'Événement intermédiaire timer', why: 'Intermédiaire = pendant le processus ; ici c’est le déclencheur initial.' }
      ]
    },
    {
      id: 'ex-q3', theme: 'BPMN',
      question: 'Une enveloppe NOIRE dans un événement intermédiaire signifie…',
      options: [
        { t: 'Throw : le processus envoie un message', ok: true, why: 'Noir = throw (envoi), blanc = catch (attente/réception).' },
        { t: 'Catch : le processus attend un message', why: 'C’est l’enveloppe blanche.' },
        { t: 'Une erreur dans le processus', why: 'L’événement d’erreur a un symbole éclair, pas une enveloppe.' }
      ]
    },
    {
      id: 'ex-q4', theme: 'BPMN — gateways',
      question: 'Une fusion XOR reçoit deux jetons (un par branche). Combien de fois la tâche suivante s’exécute-t-elle ?',
      options: [
        { t: 'Une fois', why: 'La fusion XOR ne synchronise pas : elle laisse passer CHAQUE jeton.' },
        { t: 'Deux fois', ok: true, why: 'La fusion exclusive s’active à chaque branche terminée — pour synchroniser, il faut un AND.' },
        { t: 'Zéro fois : le modèle est invalide', why: 'Le modèle est valide, simplement la tâche s’exécute deux fois.' }
      ]
    },
    {
      id: 'ex-q5', theme: 'BPMN — gateways',
      question: 'Quelle est LA différence entre la fusion OR et la fusion AND ?',
      options: [
        { t: 'Aucune', why: 'La nuance est précisément dans les branches attendues.' },
        { t: 'La fusion OR n’attend que les branches réellement ACTIVES ; la fusion AND attend TOUTES les branches entrantes', ok: true, why: 'C’est la ligne « fusion » du tableau des gateways du TP1.' },
        { t: 'La fusion OR choisit une branche au hasard', why: 'Rien n’est aléatoire dans les gateways.' }
      ]
    },
    {
      id: 'ex-q6', theme: 'BPMN — jetons',
      question: 'Quand une instance de processus est-elle terminée ?',
      options: [
        { t: 'Dès qu’un jeton atteint un événement de fin quelconque', why: 'Un end simple ne consomme que SON jeton.' },
        { t: 'Quand tous les jetons ont terminé, ou dès qu’un jeton atteint un événement terminate', ok: true, why: 'La règle exacte du rappel du TP1 (et la clé des exercices 3 et 5).' },
        { t: 'Après la dernière tâche du diagramme', why: 'La fin dépend des jetons, pas de la position des tâches.' }
      ]
    },
    {
      id: 'ex-q7', theme: 'BPMN — événements frontière',
      question: 'Un timer frontière en trait POINTILLÉ se déclenche pendant la tâche. Que se passe-t-il ?',
      options: [
        { t: 'La tâche est annulée et le flux part par le chemin du timer', why: 'Ça, c’est le trait PLEIN (interruptible).' },
        { t: 'Un jeton part par le chemin du timer ET la tâche continue', ok: true, why: 'Non-interruptible : les deux chemins coexistent (TP1 ex. 6, TP2 ex. 3).' },
        { t: 'Rien tant que la tâche n’est pas finie', why: 'L’événement frontière agit précisément PENDANT la tâche.' }
      ]
    },
    {
      id: 'ex-q8', theme: 'BPMN — motifs',
      question: '« Après l’envoi du rappel, on attend la réponse du client OU 2 semaines, selon ce qui arrive en premier. » Quel motif ?',
      options: [
        { t: 'Gateway événementiel + catch message + catch timer', ok: true, why: 'Le motif central du TP2 ex. 1.' },
        { t: 'Split AND vers message et timer', why: 'Le AND suivrait LES DEUX chemins — on veut le premier seulement.' },
        { t: 'Split XOR avec conditions « réponse » / « pas de réponse »', why: 'Un XOR décide sur une condition immédiatement évaluable, pas en attendant des événements.' }
      ]
    },
    {
      id: 'ex-q9', theme: 'BPMN — répétitions',
      question: '« Contacter des groupes de musique jusqu’à obtenir un accord » vs « interviewer chacun des 5 candidats » :',
      options: [
        { t: 'Boucle (nombre inconnu) pour les groupes ; multi-instance (nombre connu) pour les candidats', ok: true, why: 'Boucle ↺ = « jusqu’à ce que » ; multi-instance ∥/≡ = « pour chacun des N ».' },
        { t: 'Multi-instance pour les deux', why: 'On ignore combien de groupes il faudra contacter.' },
        { t: 'Boucle pour les deux', why: 'Le nombre de candidats (5) est connu à l’avance.' }
      ]
    },
    {
      id: 'ex-q10', theme: 'BPMN — pools',
      question: 'Le pool « Client » est laissé vide dans la plupart des corrections. Pourquoi ?',
      options: [
        { t: 'Par manque de place', why: 'C’est un choix de modélisation, pas de mise en page.' },
        { t: 'C’est une black box : on ne modélise que ses interactions (messages), pas son fonctionnement interne', ok: true, why: 'Définition exacte du cours (3_BPM p. 50).' },
        { t: 'Un pool externe doit obligatoirement être vide', why: 'On PEUT le détailler (white box) si utile — cf. TP2 ex. 1.' }
      ]
    },
    /* ---- ArchiMate ---- */
    {
      id: 'ex-q11', theme: 'ArchiMate — couches',
      question: 'Jaune et bleu clair dans un diagramme ArchiMate du cours correspondent à…',
      options: [
        { t: 'Couche métier (jaune) et couche application (bleu clair)', ok: true, why: 'Le code couleur canonique — le vert étant la couche technologique.' },
        { t: 'Processus (jaune) et acteurs (bleu)', why: 'La couleur encode la COUCHE, pas le type d’élément.' },
        { t: 'Éléments corrects (jaune) et erronés (bleu)', why: 'Non — les erreurs ne sont pas encodées par couleur !' }
      ]
    },
    {
      id: 'ex-q12', theme: 'ArchiMate — éléments',
      question: 'Coins arrondis vs coins carrés sur les rectangles ArchiMate :',
      options: [
        { t: 'Arrondis = comportement (processus, service…) ; carrés = structure (acteur, rôle, composant, objet)', ok: true, why: 'Le réflexe de lecture le plus utile de la fiche récapitulative.' },
        { t: 'Arrondis = couche application', why: 'La couche est donnée par la couleur, pas les coins.' },
        { t: 'Purement esthétique', why: 'Tout est sémantique dans la notation.' }
      ]
    },
    {
      id: 'ex-q13', theme: 'ArchiMate — éléments',
      question: '« ArchiSurance Contact Center est composé de Greg, Joan et Larry. » Quelle relation, quel marqueur ?',
      options: [
        { t: 'Composition — losange NOIR du côté du Contact Center', ok: true, why: '« Consists of » = composition, losange plein côté composite.' },
        { t: 'Agrégation — losange blanc', why: 'L’agrégation regroupe sans possession ; ici les employés font partie intégrante du centre.' },
        { t: 'Assignment — boule et flèche', why: 'L’assignment alloue un comportement/rôle, pas une appartenance structurelle.' }
      ]
    },
    {
      id: 'ex-q14', theme: 'ArchiMate — relations',
      question: 'Trait pointillé terminé par un triangle CREUX =',
      options: [
        { t: 'Realization : l’élément concret réalise l’élément abstrait', ok: true, why: 'Composant → service, processus → service : toujours vers l’abstrait.' },
        { t: 'Flow', why: 'Le flow est en tirets avec flèche PLEINE.' },
        { t: 'Access', why: 'L’access est pointillé avec une petite flèche ouverte (ou sans flèche).' }
      ]
    },
    {
      id: 'ex-q15', theme: 'ArchiMate — relations',
      question: 'Pour dire « le service applicatif soutient le processus métier », on utilise…',
      options: [
        { t: 'Serving : service —flèche ouverte→ processus', ok: true, why: '« Provides its functionality to » : le service sert le processus.' },
        { t: 'Realization : service ⇢ processus', why: 'La realization relie concret→abstrait (composant→service, processus→service), pas service→processus.' },
        { t: 'Assignment : service ●→ processus', why: 'L’assignment alloue une responsabilité à une structure active (acteur→rôle).' }
      ]
    },
    {
      id: 'ex-q16', theme: 'ArchiMate — erreurs',
      question: 'Dans un modèle, un acteur métier est relié par un trait direct à un composant applicatif. Verdict ?',
      options: [
        { t: 'Erreur : l’acteur consomme des SERVICES ; le composant expose ses fonctionnalités via un service applicatif', ok: true, why: 'L’erreur « Customer → Reservation System » de l’exercice 3 du TP3.' },
        { t: 'Correct si l’acteur utilise vraiment l’application', why: 'Même si c’est vrai dans les faits, le modèle doit passer par la couche service.' },
        { t: 'Correct uniquement en couche technologique', why: 'La couche techno n’a rien à voir ici.' }
      ]
    },
    {
      id: 'ex-q17', theme: 'ArchiMate — junctions',
      question: 'Une junction (petit cercle) posée entre UNE relation entrante et UNE relation sortante…',
      options: [
        { t: 'Est inutile/incorrecte : une junction sert à combiner PLUSIEURS relations du même type', ok: true, why: 'L’erreur du « And » de FoodExpress (TP3 ex. 2).' },
        { t: 'Est obligatoire entre deux processus', why: 'Deux processus se relient directement par triggering.' },
        { t: 'Représente une décision comme un XOR BPMN', why: 'ArchiMate ne modélise pas la logique de contrôle fine — c’est le rôle de BPMN.' }
      ]
    },
    {
      id: 'ex-q18', theme: 'ArchiMate — analyse',
      question: 'Symptôme : chaque activité du processus dépend d’une application différente, non intégrée. Diagnostic de consultant ?',
      options: [
        { t: 'Fragmentation du SI : ressaisie, risque d’erreurs, lenteur → proposer une intégration (ERP / système unique)', ok: true, why: 'Le cœur du diagnostic EasyPharm (TP3 ex. 4).' },
        { t: 'C’est une bonne pratique de séparation des responsabilités', why: 'Séparer les RESPONSABILITÉS ≠ éparpiller les DONNÉES dans des outils déconnectés.' },
        { t: 'Le problème est purement matériel', why: 'Rien n’indique un problème d’infrastructure : c’est l’architecture applicative qui est incohérente.' }
      ]
    },
    {
      id: 'ex-q19', theme: 'BPMN ↔ ArchiMate',
      question: 'Quelle affirmation compare correctement BPMN et ArchiMate ?',
      options: [
        { t: 'BPMN détaille le déroulement d’UN processus (gateways, événements, jetons) ; ArchiMate cartographie l’architecture globale (couches métier/application/techno)', ok: true, why: 'Les deux se complètent : ArchiMate montre QUELLES applications supportent le processus, BPMN COMMENT il se déroule.' },
        { t: 'ArchiMate remplace BPMN', why: 'Ils n’ont pas le même objet : zoom processus vs vue d’ensemble.' },
        { t: 'BPMN modélise l’infrastructure technique', why: 'L’infrastructure relève de la couche technologique… d’ArchiMate.' }
      ]
    },
    {
      id: 'ex-q20', theme: 'BPMN — lecture',
      question: 'Deux flux entrent DIRECTEMENT dans la tâche D (sans gateway), un jeton arrive par chacun. Résultat ?',
      options: [
        { t: 'D s’exécute deux fois — sans jonction, les jetons ne fusionnent pas', ok: true, why: 'Le piège de l’exercice 2 du TP1 (« deux messages ! »).' },
        { t: 'D s’exécute une fois', why: 'Il faudrait une fusion AND pour synchroniser les jetons en un seul.' },
        { t: 'Le modèle est syntaxiquement interdit', why: 'C’est permis (et parfois voulu) — mais rarement ce qu’on veut dire.' }
      ]
    }
  ];

  APP.register('examen', {
    title: 'Examen blanc',
    short: 'Ex',
    module: 'bpmn',
    ids: QUESTIONS.map(q => q.id),
    render(page) {
      page.innerHTML = `
        <p class="eyebrow">Évaluation · 20 questions</p>
        <h1>Examen blanc — êtes-vous prêt·e ?</h1>
        <p class="lead">Vingt questions qui balaient les pièges des trois TP : notation, sémantique des jetons, motifs avancés,
        couches et relations ArchiMate, erreurs de modélisation. Répondez à tout — les explications valent le détour même
        quand vous avez juste.</p>
        <div id="score-board" class="stat-tiles" style="margin: 18px 0"></div>
        <div id="questions"></div>
      `;
      const qBox = page.querySelector('#questions');
      const board = page.querySelector('#score-board');

      function refreshBoard() {
        const scores = QUESTIONS.map(q => Progress.get(q.id)).filter(s => s != null);
        const good = scores.filter(s => s >= 0.99).length;
        board.innerHTML = `
          <div class="stat-tile"><b>${scores.length}<span style="font-size:.9rem;color:var(--ink-3)">/${QUESTIONS.length}</span></b><span>répondues</span></div>
          <div class="stat-tile"><b>${good}</b><span>correctes</span></div>
          <div class="stat-tile"><b>${scores.length ? Math.round((good / scores.length) * 100) + '%' : '—'}</b><span>taux de réussite</span></div>`;
      }
      refreshBoard();

      QUESTIONS.forEach((q, i) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<span class="tag ${q.theme.startsWith('Archi') ? 'tag-info' : ''}">${q.theme}</span>
          <p style="margin:.6em 0 0"><b>Question ${i + 1}/${QUESTIONS.length}</b></p>`;
        qBox.appendChild(card);
        QUIZ.qcm(card, {
          id: q.id,
          question: q.question,
          options: q.options,
          multi: q.multi,
          onDone: refreshBoard
        });
      });

      page.insertAdjacentHTML('beforeend', H.callout('key', '★',
        `<b>Score < 80 % ?</b> Retournez sur les modules concernés : les questions BPMN renvoient aux
        <a href="#/tp1">TP1</a>/<a href="#/tp2">TP2</a>, les questions ArchiMate au <a href="#/tp3">TP3</a>
        et à la <a href="#/archimate">fiche des relations</a>.`));
      H.nextPrev(page, ['tp3', 'TP3 · ArchiMate'], null);
    }
  });
})();
