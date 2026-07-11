/* ============================================================
   TP1 — BPMN de base : lecture de diagrammes & modélisation
   Reproduit fidèlement les 9 exercices du TP01/TP03 BPMN (1).
   ============================================================ */
(function () {

  const IDS = ['tp1-ex1', 'tp1-ex2', 'tp1-ex3', 'tp1-ex4', 'tp1-ex5', 'tp1-ex6',
    'tp1-ex7', 'tp1-ex8', 'tp1-ex9a', 'tp1-ex9b', 'tp1-ex9c'];

  function canvasIn(parent, title, tag) {
    const { panel, scroll } = H.canvas(title, tag);
    parent.appendChild(panel);
    return scroll;
  }

  /* ---------------- Diagrammes Exercice 1 ---------------- */
  const EX1_D1 = {
    w: 560, h: 300,
    nodes: [
      { id: 'a', type: 'task', x: 85, y: 60, w: 100, h: 50, label: 'Tâche A' },
      { id: 'b', type: 'task', x: 85, y: 150, w: 100, h: 50, label: 'Tâche B' },
      { id: 'c', type: 'task', x: 85, y: 240, w: 100, h: 50, label: 'Tâche C' },
      { id: 'g1', type: 'gateway', gw: 'and', x: 250, y: 105 },
      { id: 'g2', type: 'gateway', gw: 'and', x: 250, y: 195 },
      { id: 'gx', type: 'gateway', gw: 'xor', x: 360, y: 150 },
      { id: 'd', type: 'task', x: 480, y: 150, w: 100, h: 50, label: 'Tâche D' }
    ],
    flows: [
      { from: 'a', to: 'g1', points: [[135, 60], [250, 60], [250, 82]] },
      { from: 'b', to: 'g1', points: [[135, 150], [250, 150], [250, 128]] },
      { from: 'b', to: 'g2', points: [[135, 150], [250, 150], [250, 172]] },
      { from: 'c', to: 'g2', points: [[135, 240], [250, 240], [250, 218]] },
      { from: 'g1', to: 'gx', points: [[273, 105], [318, 105], [318, 138]] },
      { from: 'g2', to: 'gx', points: [[273, 195], [318, 195], [318, 162]] },
      { from: 'gx', to: 'd', points: [[383, 150], [430, 150]] }
    ]
  };
  const EX1_D2 = {
    w: 560, h: 300,
    nodes: [
      { id: 'a', type: 'task', x: 85, y: 65, w: 100, h: 50, label: 'Tâche A' },
      { id: 'c', type: 'task', x: 85, y: 155, w: 100, h: 50, label: 'Tâche C' },
      { id: 'b', type: 'task', x: 85, y: 245, w: 100, h: 50, label: 'Tâche B' },
      { id: 'gx', type: 'gateway', gw: 'xor', x: 255, y: 110 },
      { id: 'ga', type: 'gateway', gw: 'and', x: 355, y: 200 },
      { id: 'd', type: 'task', x: 480, y: 200, w: 100, h: 50, label: 'Tâche D' }
    ],
    flows: [
      { from: 'a', to: 'gx', points: [[135, 65], [255, 65], [255, 87]] },
      { from: 'c', to: 'gx', points: [[135, 155], [255, 155], [255, 133]] },
      { from: 'gx', to: 'ga', points: [[255, 133], [355, 133], [355, 177]], fromSide: 'b' },
      { from: 'b', to: 'ga', points: [[135, 245], [355, 245], [355, 223]] },
      { from: 'ga', to: 'd', points: [[378, 200], [430, 200]] }
    ]
  };

  /* ---------------- Diagrammes Exercice 2 ---------------- */
  const EX2_D1 = {
    w: 640, h: 270,
    nodes: [
      { id: 's', type: 'start', x: 45, y: 135 },
      { id: 'a', type: 'task', x: 140, y: 135, w: 100, h: 52, label: 'tâche A' },
      { id: 'g', type: 'gateway', gw: 'and', x: 255, y: 135 },
      { id: 'b', type: 'task', x: 380, y: 60, w: 100, h: 52, label: 'tâche B' },
      { id: 'c', type: 'task', x: 380, y: 210, w: 100, h: 52, label: 'Tâche C' },
      { id: 'm', type: 'throw', event: 'message', x: 505, y: 135 },
      { id: 'd', type: 'task', x: 590, y: 135, w: 90, h: 52, label: 'tâche D' }
    ],
    flows: [
      { from: 's', to: 'a' },
      { from: 'a', to: 'g' },
      { from: 'g', to: 'b', points: [[255, 112], [255, 60], [330, 60]] },
      { from: 'g', to: 'c', points: [[255, 158], [255, 210], [330, 210]] },
      { from: 'b', to: 'm', points: [[430, 60], [505, 60], [505, 118]] },
      { from: 'c', to: 'm', points: [[430, 210], [505, 210], [505, 152]] },
      { from: 'm', to: 'd' }
    ]
  };
  const EX2_D2 = {
    w: 700, h: 270,
    nodes: [
      { id: 's', type: 'start', x: 40, y: 135 },
      { id: 'a', type: 'task', x: 130, y: 135, w: 95, h: 52, label: 'tâche A' },
      { id: 'g1', type: 'gateway', gw: 'and', x: 240, y: 135 },
      { id: 'b', type: 'task', x: 360, y: 60, w: 95, h: 52, label: 'tâche B' },
      { id: 'c', type: 'task', x: 360, y: 210, w: 95, h: 52, label: 'Tâche C' },
      { id: 'g2', type: 'gateway', gw: 'and', x: 480, y: 135 },
      { id: 'm', type: 'throw', event: 'message', x: 555, y: 135 },
      { id: 'd', type: 'task', x: 640, y: 135, w: 90, h: 52, label: 'tâche D' }
    ],
    flows: [
      { from: 's', to: 'a' },
      { from: 'a', to: 'g1' },
      { from: 'g1', to: 'b', points: [[240, 112], [240, 60], [312, 60]] },
      { from: 'g1', to: 'c', points: [[240, 158], [240, 210], [312, 210]] },
      { from: 'b', to: 'g2', points: [[408, 60], [480, 60], [480, 112]] },
      { from: 'c', to: 'g2', points: [[408, 210], [480, 210], [480, 158]] },
      { from: 'g2', to: 'm' },
      { from: 'm', to: 'd' }
    ]
  };

  /* ---------------- Diagramme Exercice 3 (boucle infinie) ---------------- */
  const EX3 = {
    w: 800, h: 340,
    nodes: [
      { id: 's', type: 'start', x: 50, y: 170 },
      { id: 'a', type: 'task', x: 145, y: 170, w: 100, h: 52, label: 'Tâche A' },
      { id: 'gx', type: 'gateway', gw: 'xor', x: 265, y: 170 },
      { id: 'b', type: 'task', x: 420, y: 65, w: 100, h: 52, label: 'Tâche B' },
      { id: 'c', type: 'task', x: 420, y: 275, w: 100, h: 52, label: 'Tâche C' },
      { id: 'ga', type: 'gateway', gw: 'and', x: 580, y: 170 },
      { id: 'd', type: 'task', x: 690, y: 170, w: 100, h: 52, label: 'Tâche D' },
      { id: 'e', type: 'end', x: 775, y: 170 }
    ],
    flows: [
      { id: 'f-sa', from: 's', to: 'a' },
      { id: 'f-ax', from: 'a', to: 'gx' },
      { id: 'f-xc', from: 'gx', to: 'c', points: [[265, 193], [265, 275], [370, 275]] },
      { id: 'f-cg', from: 'c', to: 'ga', points: [[470, 275], [580, 275], [580, 193]] },
      { id: 'f-gb', from: 'ga', to: 'b', points: [[580, 147], [580, 65], [470, 65]] },
      { id: 'f-bx', from: 'b', to: 'gx', points: [[370, 65], [265, 65], [265, 147]] },
      { id: 'f-gd', from: 'ga', to: 'd', points: [[603, 170], [640, 170]] },
      { id: 'f-de', from: 'd', to: 'e' }
    ]
  };

  /* ---------------- Diagrammes Exercice 4 (pools) ---------------- */
  function ex4Spec(msg) {
    return {
      w: 560, h: 330,
      pools: [
        { x: 20, y: 15, w: 520, h: 130, label: 'Pool 1' },
        { x: 20, y: 185, w: 520, h: 130, label: 'Pool 2' }
      ],
      nodes: [
        { id: 's1', type: 'start', x: 90, y: 80 },
        { id: 't1', type: 'task', x: 185, y: 80, w: 100, h: 50, label: 'Tâche 1' },
        { id: 't4', type: 'task', x: 400, y: 80, w: 100, h: 50, label: 'Tâche 4' },
        { id: 'e1', type: 'end', x: 495, y: 80 },
        { id: 's2', type: 'start', x: 90, y: 250 },
        { id: 't2', type: 'task', x: 185, y: 250, w: 100, h: 50, label: 'Tâche 2' },
        { id: 't3', type: 'task', x: 330, y: 250, w: 100, h: 50, label: 'Tâche 3' },
        { id: 'e2', type: 'end', x: 480, y: 250 }
      ],
      flows: [
        { from: 's1', to: 't1' }, { from: 't1', to: 't4' }, { from: 't4', to: 'e1' },
        { from: 's2', to: 't2' }, { from: 't2', to: 't3' }, { from: 't3', to: 'e2' },
        { id: 'x1', from: 't1', to: 't2', type: msg ? 'msg' : 'seq', points: [[185, 105], [185, 225]] },
        { id: 'x2', from: 't3', to: 't4', type: msg ? 'msg' : 'seq', points: [[365, 225], [365, 105]], fromSide: 't' }
      ]
    };
  }

  /* ---------------- Diagrammes Exercice 5 ---------------- */
  function ex5Spec(terminate) {
    return {
      w: 720, h: 310,
      nodes: [
        { id: 's', type: 'start', x: 45, y: 140 },
        { id: 'rc', type: 'task', x: 145, y: 140, w: 105, h: 55, label: 'recevoir la commande' },
        { id: 'g1', type: 'gateway', gw: 'and', x: 265, y: 140 },
        { id: 'pp', type: 'task', x: 390, y: 65, w: 105, h: 52, label: 'préparer plats' },
        { id: 'pb', type: 'task', x: 390, y: 165, w: 105, h: 52, label: 'préparer boissons' },
        { id: 'fin2', type: 'end', x: 390, y: 262, event: terminate ? 'terminate' : 'none' },
        { id: 'g2', type: 'gateway', gw: 'and', x: 510, y: 110 },
        { id: 'sc', type: 'task', x: 620, y: 110, w: 108, h: 52, label: 'servir commande' },
        { id: 'e', type: 'end', x: 700, y: 110 }
      ],
      flows: [
        { from: 's', to: 'rc' },
        { from: 'rc', to: 'g1' },
        { from: 'g1', to: 'pp', points: [[265, 117], [265, 65], [337, 65]] },
        { from: 'g1', to: 'pb', points: [[288, 140], [310, 140], [310, 165], [337, 165]] },
        { from: 'g1', to: 'fin2', points: [[265, 163], [265, 262], [373, 262]] },
        { from: 'pp', to: 'g2', points: [[443, 65], [510, 65], [510, 87]] },
        { from: 'pb', to: 'g2', points: [[443, 165], [510, 165], [510, 133]] },
        { from: 'g2', to: 'sc' },
        { from: 'sc', to: 'e' }
      ]
    };
  }

  /* ---------------- Diagrammes Exercice 6 ---------------- */
  function ex6Spec(nonInterrupting) {
    return {
      w: 760, h: 320,
      nodes: [
        { id: 's', type: 'start', x: 40, y: 110 },
        { id: 't1', type: 'task', x: 160, y: 110, w: 118, h: 58, label: 'rentrer ses données banquaires' },
        { id: 'bt', type: 'boundary', event: 'timer', x: 160, y: 139, r: 15, interrupting: !nonInterrupting, label: 'durée expirée', ldx: -55, ldy: -14 },
        { id: 't2', type: 'task', x: 330, y: 110, w: 112, h: 58, label: 'confirmer commande' },
        { id: 'g', type: 'gateway', gw: 'and', x: 470, y: 110 },
        { id: 't3', type: 'task', x: 600, y: 110, w: 112, h: 58, label: 'verifier coordonnées' },
        { id: 'e', type: 'end', x: 700, y: 110 },
        {
          id: 'tr', type: 'task', x: 330, y: 245, w: 128, h: 58,
          label: nonInterrupting ? 'notifier vendeur delais depasse pour commande' : 'rafraichir la page',
          icon: nonInterrupting ? 'service' : null
        }
      ],
      flows: [
        { from: 's', to: 't1' },
        { from: 't1', to: 't2' },
        { from: 't2', to: 'g' },
        { from: 'g', to: 't3' },
        { from: 't3', to: 'e' },
        { id: 'fb', from: 'bt', to: 'tr', points: [[160, 154], [160, 245], [266, 245]] },
        { id: 'fj', from: 'tr', to: 'g', points: [[394, 245], [470, 245], [470, 133]] }
      ]
    };
  }

  /* ---------------- Exercice 7 : Gestion de commande (solution) ---------------- */
  const EX7 = {
    w: 990, h: 580,
    pools: [
      { x: 40, y: 20, w: 910, h: 60, label: 'Client', band: false },
      {
        x: 40, y: 115, w: 910, h: 440, label: 'Entreprise',
        lanes: [
          { label: 'Vente', h: 110 },
          { label: 'Production', h: 108 },
          { label: 'Finance', h: 108 },
          { label: 'Expédition', h: 114 }
        ]
      }
    ],
    nodes: [
      { id: 'ms', type: 'catch', event: 'message', x: 150, y: 170 },
      { id: 'enr', type: 'task', x: 260, y: 170, w: 112, h: 56, label: 'Enregistrer commande' },
      { id: 'gs', type: 'gateway', gw: 'and', x: 385, y: 170 },
      { id: 'mpp', type: 'task', x: 505, y: 278, w: 122, h: 56, label: 'Modifier planning de production' },
      { id: 'rf', type: 'task', x: 505, y: 388, w: 112, h: 56, label: 'Réaliser facture' },
      { id: 'pt', type: 'task', x: 680, y: 495, w: 108, h: 56, label: 'prévoir transport' },
      { id: 'gj', type: 'gateway', gw: 'and', x: 815, y: 495 },
      { id: 'ef', type: 'task', x: 815, y: 170, w: 108, h: 56, label: 'envoyer facture', icon: 'send' },
      { id: 'fin', type: 'end', x: 915, y: 170 },
      { id: 'dl', type: 'data', x: 680, y: 335, label: 'Date de livraison' }
    ],
    flows: [
      { id: 'f1', from: 'ms', to: 'enr' },
      { id: 'f2', from: 'enr', to: 'gs' },
      { id: 'f3', from: 'gs', to: 'mpp', points: [[385, 193], [385, 278], [444, 278]] },
      { id: 'f4', from: 'gs', to: 'rf', points: [[385, 193], [385, 388], [449, 388]] },
      { id: 'f5', from: 'mpp', to: 'pt', points: [[566, 278], [600, 278], [600, 495], [626, 495]] },
      { id: 'f6', from: 'rf', to: 'gj', points: [[561, 388], [580, 388], [580, 535], [815, 535], [815, 518]] },
      { id: 'f7', from: 'pt', to: 'gj', points: [[734, 495], [792, 495]] },
      { id: 'f8', from: 'gj', to: 'ef', points: [[815, 472], [815, 198]] },
      { id: 'f9', from: 'ef', to: 'fin' },
      { id: 'a1', from: 'pt', to: 'dl', type: 'assoc', points: [[680, 467], [680, 362]] },
      { id: 'a2', from: 'dl', to: 'ef', type: 'assoc', points: [[680, 308], [680, 240], [782, 240], [782, 198]] },
      { id: 'm1', from: 'ms', to: 'ms', type: 'msg', points: [[150, 80], [150, 153]], label: 'Commande', lx: 205, ly: 95 },
      { id: 'm2', from: 'ef', to: 'ef', type: 'msg', points: [[848, 142], [848, 80]], label: 'facture envoyée', lx: 770, ly: 95 }
    ]
  };

  /* ---------------- Exercice 8 : Plaintes (solution) ---------------- */
  const EX8 = {
    w: 1190, h: 580,
    pools: [
      { x: 30, y: 20, w: 1130, h: 58, label: 'Client', band: false },
      {
        x: 30, y: 112, w: 1130, h: 445, label: 'Agence Y',
        lanes: [
          { label: 'dep gestion plaintes', h: 235 },
          { label: 'dep logistique', h: 210 }
        ]
      }
    ],
    nodes: [
      { id: 's', type: 'start', x: 135, y: 455 },
      { id: 'enp', type: 'task', x: 255, y: 455, w: 112, h: 56, label: 'Enregistrer la plainte' },
      { id: 'dd', type: 'task', x: 255, y: 225, w: 112, h: 56, label: 'Demander des détails', icon: 'send' },
      { id: 'rd', type: 'task', x: 405, y: 225, w: 112, h: 56, label: 'Réception des détails', icon: 'receive' },
      { id: 'g1', type: 'gateway', gw: 'and', x: 520, y: 225 },
      { id: 'rr', type: 'task', x: 630, y: 225, w: 108, h: 56, label: 'Rédiger un rapport' },
      { id: 'g2', type: 'gateway', gw: 'and', x: 750, y: 225 },
      { id: 'ev', type: 'task', x: 855, y: 225, w: 104, h: 56, label: 'Evaluer la plainte' },
      { id: 'gx', type: 'gateway', gw: 'xor', x: 950, y: 225, label: 'Etat ?', ldx: 26, ldy: 4 },
      { id: 'nc', type: 'throw', event: 'message', x: 1000, y: 152, label: 'Notifier le client', ldy: -46 },
      { id: 'ms', type: 'task', x: 1010, y: 305, w: 116, h: 56, label: 'Mettre en place la solution' },
      { id: 'gj', type: 'gateway', gw: 'xor', x: 1090, y: 225 },
      { id: 'fin', type: 'end', x: 1140, y: 225 },
      { id: 'cs', type: 'task', x: 610, y: 455, w: 116, h: 56, label: 'Change le statut de la plainte' },
      { id: 'rh', type: 'task', x: 760, y: 455, w: 118, h: 56, label: "Récupérer l'historique client" }
    ],
    flows: [
      { from: 's', to: 'enp' },
      { id: 'f-up', from: 'enp', to: 'dd', points: [[255, 427], [255, 253]] },
      { from: 'dd', to: 'rd' },
      { from: 'rd', to: 'g1' },
      { from: 'g1', to: 'rr' },
      { id: 'f-down', from: 'g1', to: 'cs', points: [[520, 248], [520, 455], [552, 455]] },
      { from: 'cs', to: 'rh' },
      { id: 'f-hup', from: 'rh', to: 'g2', points: [[760, 427], [760, 320], [750, 320], [750, 248]] },
      { from: 'rr', to: 'g2' },
      { from: 'g2', to: 'ev' },
      { from: 'ev', to: 'gx' },
      { id: 'f-ko', from: 'gx', to: 'nc', points: [[950, 202], [950, 152], [983, 152]], label: 'Solution KO', lx: 905, ly: 140 },
      { id: 'f-ko2', from: 'nc', to: 'gj', points: [[1017, 152], [1090, 152], [1090, 202]] },
      { id: 'f-ok', from: 'gx', to: 'ms', points: [[950, 248], [950, 305], [952, 305]], label: 'Solution OK', lx: 902, ly: 295 },
      { id: 'f-ok2', from: 'ms', to: 'gj', points: [[1068, 305], [1090, 305], [1090, 248]] },
      { from: 'gj', to: 'fin' },
      { id: 'm1', from: 'dd', to: 'dd', type: 'msg', points: [[255, 197], [255, 78]] },
      { id: 'm2', from: 'rd', to: 'rd', type: 'msg', points: [[405, 78], [405, 197]] },
      { id: 'm3', from: 'nc', to: 'nc', type: 'msg', points: [[1000, 135], [1000, 78]] }
    ]
  };

  /* ---------------- Exercice 9.1 : haut niveau ---------------- */
  const EX9A = {
    w: 880, h: 500,
    pools: [
      { x: 40, y: 20, w: 800, h: 290, label: 'Event Bureau' },
      { x: 40, y: 350, w: 800, h: 120, label: 'Client' }
    ],
    nodes: [
      { id: 'ms', type: 'catch', event: 'message', x: 300, y: 165 },
      { id: 'gs', type: 'gateway', gw: 'and', x: 380, y: 165 },
      { id: 'rm', type: 'task', x: 500, y: 95, w: 116, h: 58, label: 'Réserver musique', sub: true },
      { id: 're', type: 'task', x: 500, y: 235, w: 116, h: 58, label: 'Réserver emplacement', sub: true },
      { id: 'gj', type: 'gateway', gw: 'and', x: 620, y: 165 },
      { id: 'rn', type: 'task', x: 730, y: 165, w: 118, h: 58, label: 'Réserver nourriture et boissons' },
      { id: 'fin', type: 'end', x: 815, y: 165 },
      { id: 's2', type: 'start', x: 150, y: 410 },
      { id: 'enc', type: 'task', x: 300, y: 410, w: 112, h: 56, label: 'encoder une demande', icon: 'send' },
      { id: 'e2', type: 'end', x: 430, y: 410 }
    ],
    flows: [
      { from: 'ms', to: 'gs' },
      { from: 'gs', to: 'rm', points: [[380, 142], [380, 95], [442, 95]] },
      { from: 'gs', to: 're', points: [[380, 188], [380, 235], [442, 235]] },
      { from: 'rm', to: 'gj', points: [[558, 95], [620, 95], [620, 142]] },
      { from: 're', to: 'gj', points: [[558, 235], [620, 235], [620, 188]] },
      { from: 'gj', to: 'rn' },
      { from: 'rn', to: 'fin' },
      { from: 's2', to: 'enc' },
      { from: 'enc', to: 'e2' },
      { id: 'm1', from: 'enc', to: 'ms', type: 'msg', points: [[300, 382], [300, 182]], label: "Demande d'évènement", lx: 385, ly: 330 }
    ]
  };

  /* ---------------- Exercice 9.2 : sous-processus musique ---------------- */
  const EX9B = {
    w: 1270, h: 450,
    pools: [
      { x: 30, y: 18, w: 1210, h: 55, label: 'Groupe de musique', band: false },
      { x: 30, y: 105, w: 1210, h: 320, label: "gestion d'évènement" }
    ],
    nodes: [
      { id: 's', type: 'start', x: 105, y: 265 },
      { id: 'g0', type: 'gateway', gw: 'xor', x: 175, y: 265 },
      { id: 'sg', type: 'task', x: 310, y: 185, w: 112, h: 56, label: 'sélectionner un groupe' },
      { id: 'ng', type: 'task', x: 460, y: 185, w: 106, h: 56, label: 'notifier le groupe', icon: 'send' },
      { id: 'ga', type: 'gateway', gw: 'xor', x: 575, y: 185, label: 'acceptation', ldx: 40, ldy: -2 },
      { id: 'enc', type: 'task', x: 700, y: 185, w: 118, h: 56, label: 'Encoder informations sur le groupe' },
      { id: 'gn', type: 'gateway', gw: 'xor', x: 815, y: 185 },
      { id: 'ev', type: 'task', x: 930, y: 120, w: 110, h: 52, label: 'évaluation du groupe' },
      { id: 'gj1', type: 'gateway', gw: 'xor', x: 1030, y: 185 },
      { id: 'inv', type: 'task', x: 1130, y: 185, w: 106, h: 56, label: 'invitation du groupe' },
      { id: 'lm', type: 'task', x: 460, y: 345, w: 110, h: 56, label: 'location du matériel', sub: true },
      { id: 'im', type: 'task', x: 620, y: 345, w: 112, h: 56, label: 'installation du matériel', sub: true },
      { id: 'gf', type: 'gateway', gw: 'xor', x: 1130, y: 345 },
      { id: 'fin', type: 'end', x: 1200, y: 345 }
    ],
    flows: [
      { from: 's', to: 'g0' },
      { id: 'f-top', from: 'g0', to: 'sg', points: [[175, 242], [175, 185], [254, 185]] },
      { id: 'f-bot', from: 'g0', to: 'lm', points: [[175, 288], [175, 345], [405, 345]] },
      { from: 'sg', to: 'ng' },
      { from: 'ng', to: 'ga' },
      { id: 'f-acc', from: 'ga', to: 'enc', points: [[598, 185], [641, 185]] },
      { id: 'f-ref', from: 'ga', to: 'sg', points: [[575, 208], [575, 250], [310, 250], [310, 213]], label: 'refus', lx: 440, ly: 240 },
      { from: 'enc', to: 'gn' },
      { id: 'f-new', from: 'gn', to: 'ev', points: [[815, 162], [815, 120], [875, 120]], label: 'groupe nouveau', lx: 815, ly: 100, lw: 30 },
      { id: 'f-known', from: 'gn', to: 'gj1', points: [[838, 185], [1007, 185]], label: 'groupe connu', lx: 922, ly: 202 },
      { id: 'f-ev', from: 'ev', to: 'gj1', points: [[985, 120], [1030, 120], [1030, 162]] },
      { from: 'gj1', to: 'inv' },
      { id: 'f-inv', from: 'inv', to: 'gf', points: [[1130, 213], [1130, 322]] },
      { from: 'lm', to: 'im' },
      { id: 'f-im', from: 'im', to: 'gf', points: [[676, 345], [1107, 345]] },
      { from: 'gf', to: 'fin' },
      { id: 'm1', from: 'ng', to: 'ng', type: 'msg', points: [[460, 157], [460, 73]], label: 'demande', lx: 425, ly: 100 }
    ]
  };

  /* ---------------- Exercice 9.3 : sous-processus emplacement ---------------- */
  const EX9C = {
    w: 1180, h: 540,
    pools: [
      { x: 30, y: 20, w: 1120, h: 495, label: "gestion d'évènement" }
    ],
    nodes: [
      { id: 's', type: 'start', x: 100, y: 260 },
      { id: 'g0', type: 'gateway', gw: 'xor', x: 170, y: 260 },
      { id: 'sub', type: 'subprocess', x: 445, y: 135, w: 390, h: 150, label: 'louer une salle' },
      { id: 'ss', type: 'start', x: 300, y: 150 },
      { id: 'con', type: 'task', x: 405, y: 150, w: 110, h: 54, label: 'se connecter au système' },
      { id: 'rem', type: 'task', x: 550, y: 150, w: 112, h: 54, label: 'remplir le formulaire de location' },
      { id: 'se', type: 'end', x: 625, y: 220, r: 14 },
      { id: 'gp', type: 'gateway', gw: 'and', x: 260, y: 345 },
      { id: 'le', type: 'task', x: 400, y: 280, w: 108, h: 54, label: 'louer un endroit', sub: true },
      { id: 'gx1', type: 'gateway', gw: 'xor', x: 415, y: 425 },
      { id: 'lc', type: 'task', x: 545, y: 390, w: 106, h: 52, label: 'louer un chapiteau' },
      { id: 'lt', type: 'task', x: 545, y: 470, w: 106, h: 52, label: 'louer une tonnelle' },
      { id: 'gx2', type: 'gateway', gw: 'xor', x: 665, y: 425 },
      { id: 'gpj', type: 'gateway', gw: 'and', x: 745, y: 345 },
      { id: 'gm', type: 'gateway', gw: 'xor', x: 830, y: 260 },
      { id: 'gperm', type: 'gateway', gw: 'xor', x: 905, y: 260, label: 'permission de nuit?', ldy: 46, ldx: 8, lw: 24 },
      { id: 'dem', type: 'task', x: 1030, y: 140, w: 118, h: 56, label: 'démarches pour permission de nuit', sub: true },
      { id: 'gfin', type: 'gateway', gw: 'xor', x: 1030, y: 260 },
      { id: 'fin', type: 'end', x: 1105, y: 260 }
    ],
    flows: [
      { from: 's', to: 'g0' },
      { id: 'f-salle', from: 'g0', to: 'sub', points: [[170, 237], [170, 135], [250, 135]] },
      { id: 'f-ext', from: 'g0', to: 'gp', points: [[170, 283], [170, 345], [237, 345]], label: 'extérieur', lx: 200, ly: 320 },
      { from: 'ss', to: 'con' },
      { from: 'con', to: 'rem' },
      { id: 'f-rem', from: 'rem', to: 'se', points: [[606, 177], [606, 220], [611, 220]] },
      { id: 'f-gp1', from: 'gp', to: 'le', points: [[260, 322], [260, 280], [346, 280]] },
      { id: 'f-gp2', from: 'gp', to: 'gx1', points: [[260, 368], [260, 425], [392, 425]] },
      { id: 'f-c1', from: 'gx1', to: 'lc', points: [[415, 402], [415, 390], [492, 390]] },
      { id: 'f-c2', from: 'gx1', to: 'lt', points: [[415, 448], [415, 470], [492, 470]] },
      { id: 'f-c3', from: 'lc', to: 'gx2', points: [[598, 390], [665, 390], [665, 402]] },
      { id: 'f-c4', from: 'lt', to: 'gx2', points: [[598, 470], [665, 470], [665, 448]] },
      { id: 'f-j1', from: 'le', to: 'gpj', points: [[454, 280], [745, 280], [745, 322]] },
      { id: 'f-j2', from: 'gx2', to: 'gpj', points: [[688, 425], [745, 425], [745, 368]] },
      { id: 'f-m1', from: 'sub', to: 'gm', points: [[640, 135], [830, 135], [830, 237]] },
      { id: 'f-m2', from: 'gpj', to: 'gm', points: [[768, 345], [830, 345], [830, 283]] },
      { from: 'gm', to: 'gperm' },
      { id: 'f-oui', from: 'gperm', to: 'dem', points: [[905, 237], [905, 140], [971, 140]], label: 'oui', lx: 925, ly: 175 },
      { id: 'f-dem', from: 'dem', to: 'gfin', points: [[1030, 168], [1030, 237]] },
      { id: 'f-non', from: 'gperm', to: 'gfin', points: [[928, 260], [1007, 260]], label: 'non', lx: 967, ly: 250 },
      { from: 'gfin', to: 'fin' }
    ]
  };

  /* ============================================================ */
  APP.register('tp1', {
    title: 'TP1 · BPMN de base',
    short: 'T1',
    module: 'bpmn',
    ids: IDS,
    render(page) {
      page.innerHTML = `
        <p class="eyebrow">TP1 · BPMN de base — lecture &amp; modélisation</p>
        <h1>TP1 — Lire, comprendre et construire des diagrammes BPMN</h1>
        <p class="lead">Les 6 exercices de lecture testent des pièges précis (sémantique des gateways, jetons,
        flux entre pools, événements de fin, événements frontière). Les 3 modélisations construisent des
        processus complets. Répondez avant de dérouler les solutions !</p>
        ${H.callout('info', 'i', 'Besoin d’un rappel ? Retournez au module <a href="#/bpmn">Théorie BPMN</a> — notamment le tableau des gateways et la règle du jeton.')}
      `;

      /* ---------- Exercice 1 ---------- */
      let body = QUIZ.exo(page, { title: 'Exercice 1 — Lecture : ces diagrammes sont-ils équivalents ?', tag: 'Lecture', ids: ['tp1-ex1'], anchor: 'ex1' });
      body.innerHTML = `<div class="enonce"><p><b>Énoncé.</b> Les diagrammes suivants sont-ils équivalents ?
        À la fin de chaque tâche (ou combinaison de tâches) terminée, spécifiez si la tâche D est activée.</p></div>`;
      BPMN.render(canvasIn(body, 'Diagramme 1 (D1)'), EX1_D1, { alt: 'D1 : A et B rejoignent un AND, B et C rejoignent un autre AND, les deux AND rejoignent un XOR vers D' });
      BPMN.render(canvasIn(body, 'Diagramme 2 (D2)'), EX1_D2, { alt: 'D2 : A et C rejoignent un XOR, puis un AND avec B, vers D' });
      QUIZ.tfTable(body, {
        id: 'tp1-ex1',
        question: 'Pour chaque combinaison de tâches terminées, D est-elle activée ?',
        rowHeader: 'Tâches terminées',
        columns: ['D1', 'D2'],
        rows: [
          { label: 'A', answers: ['Non', 'Non'] },
          { label: 'B', answers: ['Non', 'Non'] },
          { label: 'C', answers: ['Non', 'Non'] },
          { label: 'A, B', answers: ['Oui', 'Oui'] },
          { label: 'A, C', answers: ['Non', 'Non'] },
          { label: 'B, C', answers: ['Oui', 'Oui'] },
          { label: 'A, B, C', answers: ['Oui', 'Oui'] }
        ],
        explain: `<b>Les deux diagrammes sont équivalents.</b> D1 : D est activée si (A <i>et</i> B) <i>ou</i> (B <i>et</i> C)
          — le XOR (fusion exclusive) s'active dès qu'<i>une</i> branche précédente est terminée.
          D2 : D est activée si (A <i>ou</i> C) <i>et</i> B — le AND (fusion parallèle) attend <i>toutes</i> ses entrées.
          Logiquement : (A∧B) ∨ (B∧C) = B ∧ (A∨C). B est indispensable dans les deux cas.`
      });

      /* ---------- Exercice 2 ---------- */
      body = QUIZ.exo(page, { title: 'Exercice 2 — Lecture : combien de messages sont envoyés ?', tag: 'Lecture', ids: ['tp1-ex2'], anchor: 'ex2' });
      body.innerHTML = `<div class="enonce"><p><b>Énoncé.</b> Une fois que D est activée, combien de messages sont envoyés ?
        L'événement <b>⊠</b> (enveloppe noire) est un événement intermédiaire d'<b>envoi</b> de message.</p></div>`;
      BPMN.render(canvasIn(body, 'Diagramme 1 — événement message directement après les deux branches'), EX2_D1);
      BPMN.render(canvasIn(body, 'Diagramme 2 — jonction AND avant l’événement message'), EX2_D2);
      QUIZ.qcm(body, {
        id: 'tp1-ex2',
        question: 'Combien de messages sont envoyés dans chaque diagramme ?',
        options: [
          { t: 'D1 : 1 message · D2 : 1 message', why: 'Non : dans D1, il n’y a pas de jonction — chaque jeton qui sort de B ou de C traverse l’événement message.' },
          { t: 'D1 : 2 messages · D2 : 1 message', ok: true, why: 'Dans D1, les jetons de B et de C traversent chacun l’événement d’envoi → 2 messages (et tâche D exécutée 2 fois !). Dans D2, la jonction AND fusionne les 2 jetons en un seul avant l’événement → 1 message.' },
          { t: 'D1 : 2 messages · D2 : 2 messages', why: 'Non : dans D2, la jonction AND attend les deux branches et ne laisse passer qu’un seul jeton.' }
        ],
        explain: 'Sans gateway de jonction, les flux qui « se rejoignent » sur un même élément ne fusionnent pas : chaque jeton continue sa route indépendamment.'
      });

      /* ---------- Exercice 3 ---------- */
      body = QUIZ.exo(page, { title: 'Exercice 3 — Lecture : ce processus va-t-il se terminer ?', tag: 'Lecture', ids: ['tp1-ex3'], anchor: 'ex3' });
      body.innerHTML = `<div class="enonce"><p><b>Énoncé.</b> Est-ce que ce processus va se terminer ?</p></div>`;
      const ex3Canvas = canvasIn(body, 'Suivez le jeton…');
      const api3 = BPMN.render(ex3Canvas, EX3, { alt: 'Boucle : A vers XOR, XOR vers C, C vers AND split qui alimente D et B, B revient au XOR' });
      const simRow = document.createElement('div');
      simRow.className = 'sim-controls';
      simRow.innerHTML = `<button class="btn btn-primary" type="button" id="sim3">▶ Simuler les jetons</button>
        <span class="sim-log" id="log3"></span>`;
      ex3Canvas.parentElement.parentElement.appendChild(simRow);
      let simRunning = false;
      simRow.querySelector('#sim3').addEventListener('click', async (e) => {
        if (simRunning) return;
        simRunning = true;
        e.target.disabled = true;
        const log = simRow.querySelector('#log3');
        const t1 = api3.token('#c4453c');
        log.textContent = 'Instance démarrée…';
        await t1.moveAlong(api3.flowPts('f-sa'));
        await t1.moveAlong(api3.flowPts('f-ax'));
        for (let lap = 1; lap <= 3; lap++) {
          log.textContent = `Boucle n°${lap} : C s'exécute, le AND duplique le jeton…`;
          await t1.moveAlong(api3.flowPts('f-xc'));
          await t1.moveAlong(api3.flowPts('f-cg'));
          if (lap === 1) {
            const t2 = api3.token('#2c5f9e');
            const p = api3.flowPts('f-gd');
            t2.set(p[0][0], p[0][1]);
            t2.moveAlong(p).then(() => t2.moveAlong(api3.flowPts('f-de'))).then(() => {
              log.textContent += ' Le jeton bleu atteint la fin — mais l’instance continue !';
            });
          }
          await t1.moveAlong(api3.flowPts('f-gb'));
          await t1.moveAlong(api3.flowPts('f-bx'));
        }
        log.textContent = '… et la boucle C → B continue indéfiniment. L’instance ne se termine jamais.';
        t1.hide();
        e.target.disabled = false;
        simRunning = false;
      });
      QUIZ.qcm(body, {
        id: 'tp1-ex3',
        question: 'Ce processus va-t-il se terminer ?',
        options: [
          { t: 'Oui : la tâche D s’exécute puis l’événement de fin est atteint.', why: 'Le flux passant par D se termine, mais un processus n’est fini que lorsque TOUS les jetons de l’instance sont consommés.' },
          { t: 'Non : la boucle « Tâche C – Tâche B » est infinie. D s’exécutera et ce flux se termine, mais le flux de la boucle continuera.', ok: true, why: 'C’est la réponse du correctif : le branchement parallèle après C renvoie un jeton vers B à chaque tour — aucune condition de sortie.' },
          { t: 'Non : la tâche D ne sera jamais activée.', why: 'Faux : le AND (split) duplique le jeton, donc D est bien activée (à chaque tour, même).' }
        ],
        explain: 'Règle de fin : une instance se termine quand tous ses jetons ont terminé (ou lorsqu’un jeton atteint un événement « terminate »).'
      });

      /* ---------- Exercice 4 ---------- */
      body = QUIZ.exo(page, { title: 'Exercice 4 — Lecture : communiquer entre pools', tag: 'Lecture', ids: ['tp1-ex4'], anchor: 'ex4' });
      body.innerHTML = `<div class="enonce"><p><b>Énoncé.</b> Quel(s) diagramme(s) est/sont correct(s) si la tâche 4 doit être réalisée après la tâche 3 ?</p></div>`;
      const w4 = document.createElement('div');
      w4.className = 'grid-2';
      body.appendChild(w4);
      const c4a = document.createElement('div'); const c4b = document.createElement('div');
      w4.appendChild(c4a); w4.appendChild(c4b);
      BPMN.render(canvasIn(c4a, 'Diagramme 1 — flux de séquence entre pools'), ex4Spec(false));
      BPMN.render(canvasIn(c4b, 'Diagramme 2 — flux de message entre pools'), ex4Spec(true));
      QUIZ.qcm(body, {
        id: 'tp1-ex4',
        question: 'Quel diagramme est correct ?',
        options: [
          { t: 'Diagramme 1', why: 'Interdit : un flux de séquence (trait plein) ne peut pas sortir d’une piste (pool). Il peut seulement traverser des corridors (lanes) à l’intérieur d’un même pool.' },
          { t: 'Diagramme 2', ok: true, why: 'Entre pools, on communique par flux de message (pointillé, rond au départ, flèche ouverte à l’arrivée). Le message de la tâche 3 vers la tâche 4 garantit que 4 attend 3.' },
          { t: 'Les deux', why: 'Le diagramme 1 viole la règle : pas de flux de séquence entre deux pools.' }
        ],
        explain: '<b>Règle clé :</b> un flux de séquence ne peut pas sortir d’une piscine (pool), mais peut traverser des corridors (lanes). Entre piscines : flux de message uniquement.'
      });

      /* ---------- Exercice 5 ---------- */
      body = QUIZ.exo(page, { title: 'Exercice 5 — Lecture : « servir commande » se produira-t-elle ?', tag: 'Lecture', ids: ['tp1-ex5'], anchor: 'ex5' });
      body.innerHTML = `<div class="enonce"><p><b>Énoncé.</b> Pour chaque diagramme, est-ce que la tâche « servir commande » se produira ?
        Observez bien le <b>type</b> des événements de fin.</p></div>`;
      BPMN.render(canvasIn(body, 'Diagramme 1 — la 3ᵉ branche mène à un événement de fin TERMINATE (cercle plein)'), ex5Spec(true));
      BPMN.render(canvasIn(body, 'Diagramme 2 — la 3ᵉ branche mène à un événement de fin simple'), ex5Spec(false));
      QUIZ.tfTable(body, {
        id: 'tp1-ex5',
        rowHeader: 'Diagramme',
        columns: ['« servir commande » se produira ?'],
        rows: [
          { label: 'Diagramme 1', answers: ['Non'] },
          { label: 'Diagramme 2', answers: ['Oui'] }
        ],
        explain: `Dans le diagramme 1, la troisième branche atteint un événement <b>terminate</b> (cercle noir plein) :
          il détruit immédiatement <b>tous</b> les jetons de l'instance — le processus s'arrête avant de servir.
          Dans le diagramme 2, l'événement de fin simple ne consomme que <b>son</b> jeton : les branches
          « plats » et « boissons » continuent, la jonction AND s'active, la commande est servie.
          <br><b>Bonne pratique :</b> min. 1 évènement de début &amp; 1 de fin (ou évènements de fin de types différents).`
      });

      /* ---------- Exercice 6 ---------- */
      body = QUIZ.exo(page, { title: 'Exercice 6 — Lecture : événement frontière et jonction AND', tag: 'Lecture', ids: ['tp1-ex6'], anchor: 'ex6' });
      body.innerHTML = `<div class="enonce"><p><b>Énoncé.</b> Quel diagramme est possible ?
        Observez le <b>trait</b> de l'événement timer en bordure de la première tâche : plein = interruptible, pointillé = non-interruptible.</p></div>`;
      BPMN.render(canvasIn(body, 'Diagramme 1 — timer frontière INTERRUPTIBLE (trait plein)'), ex6Spec(false));
      BPMN.render(canvasIn(body, 'Diagramme 2 — timer frontière NON-INTERRUPTIBLE (trait pointillé)'), ex6Spec(true));
      QUIZ.qcm(body, {
        id: 'tp1-ex6',
        question: 'Quel diagramme est possible (c’est-à-dire : peut réellement atteindre la fin) ?',
        options: [
          { t: 'Diagramme 1', why: 'Impossible : l’événement interruptible ANNULE la tâche quand il se déclenche. Le jeton part soit par le chemin normal, soit par le chemin du timer — jamais les deux. La jonction AND attend ses 2 entrées pour toujours (deadlock).' },
          { t: 'Diagramme 2', ok: true, why: 'Réponse du correctif : l’évènement est non-interruptible. Une instance pourra donc se trouver sur la tâche « confirmer commande » ET sur la tâche « notifier vendeur… », satisfaisant ainsi le branchement parallèle.' },
          { t: 'Les deux', why: 'Le diagramme 1 se bloque : après interruption, une seule des deux entrées du AND recevra un jeton.' }
        ]
      });

      /* ---------- Exercice 7 ---------- */
      body = QUIZ.exo(page, { title: 'Exercice 7 — Modélisation : gestion de commande', tag: 'Modélisation', ids: ['tp1-ex7'], anchor: 'ex7' });
      body.innerHTML = `<div class="enonce">
        <p><b>Énoncé.</b> Quand une commande entre dans mon entreprise, elle arrive dans le département des ventes.
        Des collaborateurs y enregistrent la commande dans le système.</p>
        <p>Ensuite, dans le département de gestion de la production, on modifie le planning de production en conséquence.
        <b>En même temps</b>, une facture est réalisée par le service Finance de mon entreprise.</p>
        <p><b>Une fois que</b> l'on sait quand le produit sera manufacturé, on prévoit le transport.
        Ceci est sous la responsabilité du département des expéditions.</p>
        <p>Finalement, le département des ventes envoie la facture au client (en y mentionnant la date de livraison).</p></div>
        ${H.callout('key', '?', '<b>Avant de regarder :</b> combien de pools ? combien de lanes ? où sont les mots-déclencheurs de parallélisme et de synchronisation dans l’énoncé ?')}`;
      const api7 = BPMN.render(canvasIn(body, 'Solution — construite étape par étape', ['Correctif officiel', 'tag-ok']), EX7,
        { alt: 'Pool Client et pool Entreprise avec lanes Vente, Production, Finance, Expédition' });
      QUIZ.steps(body, {
        id: 'tp1-ex7',
        api: api7,
        steps: [
          {
            title: 'Les participants', text: `L'énoncé cite un <b>Client</b> externe (pool boîte noire — on ne modélise pas son fonctionnement)
            et l'<b>Entreprise</b>, découpée en 4 lanes : Vente, Production, Finance, Expédition. Un flux de séquence ne peut pas sortir d'un pool,
            mais peut traverser les lanes.`, show: []
          },
          {
            title: 'Le déclencheur', text: `« Quand une commande <b>entre</b> » : le processus démarre à la réception d'un message.
            → Événement de début de type <b>message</b> dans la lane Vente, alimenté par un <b>flux de message</b> « Commande » venant du pool Client.
            Puis la tâche « Enregistrer commande ».`, show: ['ms', 'enr', 'm1', 'f1']
          },
          {
            title: 'Le parallélisme', text: `« <b>En même temps</b> » = branchement <b>parallèle (AND)</b> : après l'enregistrement,
            la Production modifie le planning PENDANT QUE la Finance réalise la facture. Deux jetons vivent en même temps.`,
            show: ['gs', 'mpp', 'rf', 'f2', 'f3', 'f4']
          },
          {
            title: 'L’enchaînement Production → Expédition', text: `« <b>Une fois que</b> l'on sait quand le produit sera manufacturé, on prévoit le transport » :
            « prévoir transport » (lane Expédition) suit directement « Modifier planning de production ». Pas besoin de gateway : c'est une simple séquence.`,
            show: ['pt', 'f5']
          },
          {
            title: 'La synchronisation', text: `Pour envoyer la facture, il faut la facture (Finance) <b>et</b> la date de livraison (Expédition) :
            jonction <b>AND</b> qui attend les deux branches, puis « envoyer facture » dans la lane Vente (tâche d'envoi, enveloppe noire).`,
            show: ['gj', 'ef', 'f6', 'f7', 'f8']
          },
          {
            title: 'Données et fin', text: `L'objet de données « <b>Date de livraison</b> » est produit par « prévoir transport » et consommé par
            « envoyer facture » (associations pointillées). L'envoi au client = <b>flux de message</b> « facture envoyée » vers le pool Client. L'instance se termine.`,
            show: ['dl', 'a1', 'a2', 'm2', 'fin', 'f9']
          }
        ]
      });

      /* ---------- Exercice 8 ---------- */
      body = QUIZ.exo(page, { title: 'Exercice 8 — Modélisation : gestion des plaintes', tag: 'Modélisation', ids: ['tp1-ex8'], anchor: 'ex8' });
      body.innerHTML = `<div class="enonce">
        <p><b>Énoncé.</b> Chaque année, l'agence de voyages Y reçoit environ 10.000 plaintes. Il y a un département spécifique
        chargé de la gestion de ces plaintes, bien que le département logistique intervient également dans le processus.</p>
        <p>Chaque fois qu'une plainte est reçue, un employé du département logistique l'enregistre. Après l'enregistrement,
        un formulaire est envoyé au client pour demander plus de détails. Cela est réalisé par un collaborateur du département
        des plaintes. Une fois la réception et la consultation de ces détails, le collaborateur débute la rédaction d'un rapport
        écrit (problème + solution). <b>En même temps</b>, le département logistique met le statut de la plainte comme étant « traité »
        puis récupère tout l'historique du client. Une fois que le rapport est rédigé <b>et</b> que l'historique est récupéré,
        le département de gestion des plaintes évalue la plainte. S'il estime que la solution proposée est adéquate au problème
        et au profil client, alors le problème est résolu. Si non, le client est notifié que sa plainte ne sera pas traitée.</p></div>`;
      QUIZ.qcm(body, {
        id: 'tp1-ex8q',
        question: 'Échauffement : comment modéliser « le rapport est rédigé ET l’historique est récupéré » avant l’évaluation ?',
        options: [
          { t: 'Un XOR (jonction exclusive) : on continue dès qu’une des deux conditions est remplie.', why: 'Le XOR s’active dès UNE branche terminée — ici il faut attendre les deux.' },
          { t: 'Une jonction AND : elle attend que TOUTES les branches entrantes soient terminées.', ok: true, why: 'Exactement : split AND après la réception des détails, jonction AND avant « Evaluer la plainte ».' },
          { t: 'Rien : deux flèches qui entrent dans « Evaluer la plainte » suffisent.', why: 'Deux flux entrant directement dans une tâche = la tâche s’exécute à CHAQUE jeton reçu (2 fois) — cf. exercice 2 !' }
        ]
      });
      const api8 = BPMN.render(canvasIn(body, 'Solution — construite étape par étape', ['Correctif officiel', 'tag-ok']), EX8,
        { alt: 'Pool Client, pool Agence Y avec lanes dep gestion plaintes et dep logistique' });
      QUIZ.steps(body, {
        id: 'tp1-ex8',
        api: api8,
        steps: [
          {
            title: 'Participants', text: `Un pool <b>Client</b> (boîte noire) et un pool <b>Agence Y</b> avec 2 lanes :
            <b>dep gestion plaintes</b> et <b>dep logistique</b>. « Chaque fois qu'une plainte est reçue » : début simple,
            puis « Enregistrer la plainte » côté logistique.`, show: []
          },
          {
            title: 'Demande de détails au client', text: `Le département des plaintes envoie un formulaire (tâche d'<b>envoi</b>,
            flux de message vers le Client) puis attend la réponse (tâche de <b>réception</b>, flux de message depuis le Client).
            Le flux de séquence traverse les lanes — c'est permis.`, show: ['dd', 'rd', 'f-up', 'm1', 'm2']
          },
          {
            title: 'Parallélisme entre départements', text: `« <b>En même temps</b> » : split <b>AND</b>. Branche 1 (gestion plaintes) :
            « Rédiger un rapport ». Branche 2 (logistique) : « Change le statut de la plainte » <b>puis</b> « Récupérer l'historique client » (séquence).`,
            show: ['g1', 'rr', 'cs', 'rh', 'f-down']
          },
          {
            title: 'Synchronisation', text: `« Une fois que le rapport est rédigé <b>et</b> que l'historique est récupéré » :
            jonction <b>AND</b>, puis « Evaluer la plainte ».`, show: ['g2', 'ev', 'f-hup']
          },
          {
            title: 'La décision', text: `Gateway <b>XOR</b> « Etat ? » : si la solution est adéquate (<b>Solution OK</b>) → « Mettre en place la solution ».
            Sinon (<b>Solution KO</b>) → notifier le client — modélisé par un événement intermédiaire d'<b>envoi de message</b> avec flux de message vers le Client.
            Les deux chemins fusionnent dans un XOR avant la fin.`,
            show: ['gx', 'nc', 'ms', 'gj', 'fin', 'f-ko', 'f-ko2', 'f-ok', 'f-ok2', 'm3']
          }
        ]
      });

      /* ---------- Exercice 9 ---------- */
      body = QUIZ.exo(page, { title: 'Exercice 9 — Modélisation : Event Bureau (haut niveau + sous-processus)', tag: 'Modélisation', ids: ['tp1-ex9a', 'tp1-ex9b', 'tp1-ex9c'], anchor: 'ex9' });
      body.innerHTML = `<div class="enonce">
        <p><b>Énoncé.</b> Un groupe d'étudiants souhaite formaliser le fonctionnement d'une petite structure qui organise des soirées
        et événements festifs, appelée communément sur le campus <b>Event Bureau</b>. Le client devra indiquer dans la demande d'organisation
        d'un événement le budget alloué, le nombre de personnes invitées et l'endroit où l'événement devrait être organisé.</p>
        <p>Lorsque l'emplacement est à l'<b>intérieur</b>, une salle doit être louée en se connectant au système afin de remplir le formulaire
        de location correspondant. Au cas où l'emplacement est à l'<b>extérieur</b>, un endroit doit être loué, ainsi qu'un chapiteau <b>ou</b> une
        tonnelle. Si nécessaire, les démarches visant à obtenir une permission de bruit après 22 heures doivent être réalisées.</p>
        <p>Il y a aussi deux sortes de <b>musique</b> possibles : utilisation de CD's — demandant l'installation et la location de matériel
        spécifique — ou engagement d'un groupe de musique. Pour inviter un groupe, il faut d'abord le sélectionner et lui envoyer un courrier.
        Si le groupe refuse, un autre groupe est sélectionné et contacté <b>jusqu'à</b> obtenir une réponse positive. S'il accepte, ses informations
        sont encodées sur une fiche signalétique. Ensuite, le groupe est évalué afin de vérifier sa qualité — les groupes <b>connus</b> ne sont pas
        à nouveau évalués. Finalement, le groupe est invité.</p>
        <p>Après la sélection de l'emplacement et de la musique, la nourriture et les boissons sont commandées.</p></div>
        <p>La démarche du TP : d'abord un <b>diagramme de haut niveau</b> avec les grandes étapes (des sous-processus repliés <span class="kbd">⊞</span>),
        puis chaque activité complexe est détaillée dans son propre diagramme.</p>`;

      const api9a = BPMN.render(canvasIn(body, '9.1 — Diagramme de haut niveau', ['Correctif officiel', 'tag-ok']), EX9A);
      QUIZ.steps(body, {
        id: 'tp1-ex9a',
        api: api9a,
        steps: [
          {
            title: 'Vue d’ensemble', text: `Le <b>Client</b> encode une demande (tâche d'envoi) → flux de message « Demande d'évènement »
            vers l'<b>Event Bureau</b>, qui démarre sur un événement de début message.`, show: []
          },
          {
            title: 'Deux réservations en parallèle', text: `« Réserver musique » et « Réserver emplacement » sont indépendantes :
            split <b>AND</b>, deux <b>sous-processus repliés</b> (marqueur ⊞) — leurs détails viendront en 9.2 et 9.3.`,
            show: ['gs', 'rm', 're']
          },
          {
            title: 'Synchronisation puis nourriture', text: `« <b>Après</b> la sélection de l'emplacement et de la musique » : jonction AND,
            puis « Réserver nourriture et boissons », et fin du processus.`,
            show: ['gj', 'rn', 'fin']
          }
        ]
      });

      const api9b = BPMN.render(canvasIn(body, '9.2 — Sous-processus « réserver musique »', ['Correctif officiel', 'tag-ok']), EX9B);
      QUIZ.steps(body, {
        id: 'tp1-ex9b',
        api: api9b,
        steps: [
          {
            title: 'Le choix CD ou groupe', text: `Deux sortes de musique : gateway <b>XOR</b> au départ.
            Branche du bas = CD's : « location du matériel » puis « installation du matériel » (deux sous-processus).`, show: []
          },
          {
            title: 'La boucle de contact', text: `« Si le groupe refuse, un autre groupe est sélectionné et contacté <b>jusqu'à</b> obtenir une réponse positive » :
            sélectionner → notifier (message « demande » au pool <b>Groupe de musique</b>) → XOR : <b>refus</b> = retour à la sélection (boucle), <b>acceptation</b> = on continue.`,
            show: ['sg', 'ng', 'ga', 'm1', 'f-top', 'f-acc', 'f-ref']
          },
          {
            title: 'Évaluer… sauf si connu', text: `Encoder la fiche signalétique, puis XOR : <b>groupe nouveau</b> → « évaluation du groupe » ;
            <b>groupe connu</b> → on saute l'évaluation. Les deux chemins fusionnent (XOR), puis « invitation du groupe ».`,
            show: ['enc', 'gn', 'ev', 'gj1', 'inv', 'f-new', 'f-known', 'f-ev', 'f-inv']
          },
          {
            title: 'Fusion finale', text: `Le chemin « CD's » et le chemin « groupe » se rejoignent dans un <b>XOR</b> final — une seule des
            deux branches a été empruntée. Fin du sous-processus.`,
            show: ['lm', 'im', 'gf', 'fin', 'f-bot', 'f-im']
          }
        ]
      });

      const api9c = BPMN.render(canvasIn(body, '9.3 — Sous-processus « réserver emplacement »', ['Correctif officiel', 'tag-ok']), EX9C);
      QUIZ.steps(body, {
        id: 'tp1-ex9c',
        api: api9c,
        steps: [
          {
            title: 'Intérieur ou extérieur', text: `XOR de départ. <b>Intérieur</b> : le sous-processus <b>étendu</b> « louer une salle »
            montre son contenu : se connecter au système → remplir le formulaire de location.`, show: []
          },
          {
            title: 'Extérieur : deux choses à la fois', text: `« un endroit doit être loué, <b>ainsi qu'</b>un chapiteau ou une tonnelle » :
            split <b>AND</b> — louer un endroit EN PARALLÈLE du choix chapiteau <b>ou</b> tonnelle (XOR), puis jonctions symétriques (XOR puis AND).`,
            show: ['gp', 'le', 'gx1', 'lc', 'lt', 'gx2', 'gpj', 'f-ext', 'f-gp1', 'f-gp2', 'f-c1', 'f-c2', 'f-c3', 'f-c4', 'f-j1', 'f-j2']
          },
          {
            title: 'La permission de bruit', text: `Les deux branches (salle / extérieur) fusionnent (XOR), puis « <b>Si nécessaire</b> » :
            XOR « permission de nuit ? » — <b>oui</b> → démarches (sous-processus) ; <b>non</b> → directement la fin. Fusion XOR et fin.`,
            show: ['gm', 'gperm', 'dem', 'gfin', 'fin', 'f-m1', 'f-m2', 'f-oui', 'f-dem', 'f-non']
          }
        ]
      });

      H.nextPrev(page, ['bpmn', 'Théorie BPMN'], ['tp2', 'TP2 · BPMN avancé']);
    }
  });
})();
