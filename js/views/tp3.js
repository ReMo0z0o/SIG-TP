/* ============================================================
   TP3 — ArchiMate : lire, chasser les erreurs, analyser
   Reproduit fidèlement les 4 exercices du TP3-Archimate.
   ============================================================ */
(function () {

  const IDS = ['tp3-ex1', 'tp3-ex2', 'tp3-ex3', 'tp3-ex4a', 'tp3-ex4b'];

  function canvasIn(parent, title, tag) {
    const { panel, scroll } = H.canvas(title, tag);
    parent.appendChild(panel);
    return scroll;
  }

  /* ---------------- Exercice 1 : Outpatient Care (hôpital) ---------------- */
  const EX1 = {
    w: 1100, h: 620,
    nodes: [
      { id: 'cust', kind: 'actor', layer: 'business', x: 430, y: 60, w: 140, h: 50, label: 'Customer', sub: 'Business Actor' },
      { id: 'pat', kind: 'role', layer: 'business', x: 650, y: 60, w: 140, h: 50, label: 'Patient', sub: 'Business Role' },
      { id: 'oc', kind: 'service', layer: 'business', x: 650, y: 165, w: 160, h: 48, label: 'Outpatient Care', sub: 'Business Service' },
      { id: 'journey', container: true, layer: 'business', kind: 'process', x: 130, y: 250, w: 940, h: 150, label: 'Outpatient Care Customer Journey (Business Process)', labelX: 600 },
      { id: 'pre', container: true, layer: 'business', kind: 'process', x: 150, y: 285, w: 190, h: 100, label: '1. Pre-Service Period', rounded: true },
      { id: 'reg', kind: 'process', layer: 'business', x: 245, y: 350, w: 120, h: 44, label: 'Registration' },
      { id: 'serv', container: true, layer: 'business', kind: 'process', x: 360, y: 285, w: 450, h: 100, label: '2. Service Period', rounded: true },
      { id: 'mov', kind: 'process', layer: 'business', x: 455, y: 350, w: 130, h: 44, label: 'Moving to care service point' },
      { id: 'wait', kind: 'process', layer: 'business', x: 615, y: 350, w: 100, h: 44, label: 'Waiting' },
      { id: 'treat', kind: 'process', layer: 'business', x: 745, y: 350, w: 105, h: 44, label: 'Treatment' },
      { id: 'post', container: true, layer: 'business', kind: 'process', x: 830, y: 285, w: 220, h: 100, label: '3. Post-Service Period', rounded: true },
      { id: 'exit', kind: 'process', layer: 'business', x: 940, y: 350, w: 100, h: 44, label: 'Exit' },
      { id: 'need', kind: 'event', layer: 'business', shape: 'pennant', x: 70, y: 320, w: 110, h: 52, label: 'Observed need for treatment' },
      { id: 'sSelf', kind: 'service', layer: 'app', x: 245, y: 480, w: 150, h: 48, label: 'Self registration service', sub: 'Application Service' },
      { id: 'sGuid', kind: 'service', layer: 'app', x: 455, y: 480, w: 140, h: 48, label: 'Guidance service', sub: 'Application Service' },
      { id: 'sQueue', kind: 'service', layer: 'app', x: 640, y: 480, w: 130, h: 48, label: 'Queuing service', sub: 'Application Service' },
      { id: 'sRec', kind: 'service', layer: 'app', x: 810, y: 480, w: 140, h: 48, label: 'Patient record service', sub: 'Application Service' },
      { id: 'sGuid2', kind: 'service', layer: 'app', x: 985, y: 480, w: 140, h: 48, label: 'Guidance service (copy)', sub: 'Application Service' },
      { id: 'cSelf', kind: 'component', layer: 'app', x: 300, y: 570, w: 150, h: 48, label: 'Self-registration Application' },
      { id: 'cQueue', kind: 'component', layer: 'app', x: 640, y: 570, w: 130, h: 48, label: 'Queue Application' },
      { id: 'cRec', kind: 'component', layer: 'app', x: 810, y: 570, w: 145, h: 48, label: 'Patient Information System' },
      { id: 'cSelf2', kind: 'component', layer: 'app', x: 985, y: 570, w: 145, h: 48, label: 'Self-registration Application' }
    ],
    rels: [
      { id: 'r1', from: 'cust', to: 'pat', type: 'assignment', points: [[500, 60], [580, 60]], label: 'assignment', ly: 48 },
      { id: 'r2', from: 'oc', to: 'pat', type: 'serving', points: [[650, 141], [650, 85]], label: 'serving', lx: 682, ly: 113 },
      { id: 'r3', from: 'journey', to: 'oc', type: 'realization', points: [[650, 250], [650, 189]], label: 'realization', lx: 695, ly: 220 },
      { id: 'r4', from: 'need', to: 'journey', type: 'triggering', points: [[125, 320], [130, 320]], label: 'trigger', lx: 105, ly: 296 },
      { id: 'r5', from: 'reg', to: 'mov', type: 'triggering', points: [[305, 350], [390, 350]] },
      { id: 'r6', from: 'mov', to: 'wait', type: 'triggering', points: [[520, 350], [565, 350]] },
      { id: 'r7', from: 'wait', to: 'treat', type: 'triggering', points: [[665, 350], [692, 350]] },
      { id: 'r8', from: 'treat', to: 'exit', type: 'triggering', points: [[797, 350], [890, 350]] },
      { id: 'r9', from: 'sSelf', to: 'reg', type: 'serving', points: [[245, 456], [245, 372]], label: 'serving', lx: 280, ly: 430 },
      { id: 'r10', from: 'sGuid', to: 'mov', type: 'serving', points: [[455, 456], [455, 372]] },
      { id: 'r11', from: 'sQueue', to: 'wait', type: 'serving', points: [[640, 456], [640, 372]] },
      { id: 'r12', from: 'sRec', to: 'treat', type: 'serving', points: [[810, 456], [810, 372]] },
      { id: 'r13', from: 'sGuid2', to: 'exit', type: 'serving', points: [[985, 456], [985, 372]] },
      { id: 'r14', from: 'cSelf', to: 'sSelf', type: 'realization', points: [[290, 546], [270, 504]], label: 'realization', lx: 235, ly: 540 },
      { id: 'r15', from: 'cSelf', to: 'sGuid', type: 'realization', points: [[350, 546], [430, 504]] },
      { id: 'r16', from: 'cQueue', to: 'sQueue', type: 'realization', points: [[640, 546], [640, 504]] },
      { id: 'r17', from: 'cRec', to: 'sRec', type: 'realization', points: [[810, 546], [810, 504]] },
      { id: 'r18', from: 'cSelf2', to: 'sGuid2', type: 'realization', points: [[985, 546], [985, 504]] }
    ]
  };

  /* ---------------- Exercice 2 : FoodExpress (chasse aux erreurs) ---------------- */
  const EX2 = {
    w: 1160, h: 640,
    nodes: [
      { id: 'evt', kind: 'event', layer: 'business', shape: 'pennant', x: 105, y: 155, w: 130, h: 46, label: 'Customer request' },
      { id: 'roleCS', container: true, layer: 'business', kind: 'role', x: 230, y: 95, w: 870, h: 110, label: 'Customer service', labelAnchor: 'start', labelX: 245, italic: false },
      { id: 'recv', kind: 'process', layer: 'business', x: 340, y: 160, w: 115, h: 44, label: 'Recieve order' },
      { id: 'val', kind: 'process', layer: 'business', x: 620, y: 160, w: 115, h: 44, label: 'Validate order' },
      { id: 'conf', kind: 'process', layer: 'business', x: 950, y: 160, w: 115, h: 44, label: 'Confirm order' },
      { id: 'roleOM', container: true, layer: 'business', kind: 'role', x: 230, y: 205, w: 870, h: 125, label: 'Order Management', labelAnchor: 'start', labelX: 250 },
      { id: 'regO', kind: 'process', layer: 'business', x: 420, y: 280, w: 115, h: 44, label: 'Register order' },
      { id: 'jOr', kind: 'junction', or: true, x: 510, y: 280, label: 'Or' },
      { id: 'payP', kind: 'process', layer: 'business', x: 610, y: 280, w: 115, h: 44, label: 'Process payment' },
      { id: 'jAnd', kind: 'junction', x: 705, y: 280, label: 'And' },
      { id: 'send', kind: 'process', layer: 'business', x: 815, y: 280, w: 125, h: 44, label: 'Send order to delivery' },
      { id: 'roleDS', container: true, layer: 'business', kind: 'role', x: 230, y: 330, w: 870, h: 100, label: 'Delivery Service', labelAnchor: 'start', labelX: 243 },
      { id: 'check', kind: 'process', layer: 'business', x: 595, y: 385, w: 110, h: 44, label: 'Check customer data' },
      { id: 'sOrder', kind: 'service', layer: 'app', x: 420, y: 490, w: 125, h: 46, label: 'Order service' },
      { id: 'sCust', kind: 'service', layer: 'app', x: 595, y: 490, w: 135, h: 46, label: 'Customer service' },
      { id: 'sPay', kind: 'service', layer: 'app', x: 750, y: 490, w: 125, h: 46, label: 'payment service' },
      { id: 'sDel', kind: 'service', layer: 'app', x: 920, y: 490, w: 125, h: 46, label: 'Delivery service' },
      { id: 'cOrder', kind: 'component', layer: 'app', x: 480, y: 585, w: 130, h: 48, label: 'Order system' },
      { id: 'cPay', kind: 'component', layer: 'app', x: 750, y: 585, w: 130, h: 48, label: 'Payment system' },
      { id: 'cDel', kind: 'component', layer: 'app', x: 985, y: 585, w: 130, h: 48, label: 'Delivery system' }
    ],
    rels: [
      { id: 'rEvt', from: 'evt', to: 'recv', type: 'triggering', points: [[170, 155], [282, 160]], label: 'triggering', lx: 222, ly: 178 },
      { id: 'rT1', from: 'recv', to: 'val', type: 'triggering', points: [[398, 160], [562, 160]] },
      { id: 'rT2', from: 'val', to: 'conf', type: 'triggering', points: [[678, 160], [892, 160]] },
      { id: 'rF1', from: 'recv', to: 'regO', type: 'flow', points: [[340, 182], [340, 280], [362, 280]], label: 'Order details', lx: 350, ly: 250 },
      { id: 'rF2', from: 'payP', to: 'val', type: 'flow', points: [[620, 258], [620, 182]], label: 'Payment info', lx: 658, ly: 225 },
      { id: 'rJ1', from: 'regO', to: 'jOr', type: 'triggering', points: [[478, 280], [503, 280]] },
      { id: 'rJ2', from: 'jOr', to: 'payP', type: 'triggering', points: [[517, 280], [552, 280]], label: '[yes]', lx: 535, ly: 298 },
      { id: 'rJ3', from: 'jOr', to: 'check', type: 'triggering', points: [[510, 287], [510, 385], [540, 385]], label: '[no]', lx: 528, ly: 370 },
      { id: 'rJ4', from: 'payP', to: 'jAnd', type: 'triggering', points: [[668, 280], [698, 280]] },
      { id: 'rJ5', from: 'jAnd', to: 'send', type: 'triggering', points: [[712, 280], [752, 280]] },
      { id: 'rJ6', from: 'check', to: 'jAnd', type: 'triggering', points: [[640, 363], [705, 310], [705, 287]] },
      { id: 'rF3', from: 'send', to: 'conf', type: 'flow', points: [[878, 280], [910, 280], [910, 182]], label: 'info 2', lx: 895, ly: 250 },
      { id: 'rS1', from: 'sOrder', to: 'regO', type: 'serving', points: [[420, 467], [420, 302]], label: 'serving', lx: 448, ly: 452 },
      { id: 'rS2', from: 'sCust', to: 'check', type: 'serving', points: [[580, 467], [580, 407]], label: 'serving', lx: 552, ly: 452 },
      { id: 'servInv', from: 'payP', to: 'sCust', type: 'serving', points: [[655, 302], [655, 467]] },
      { id: 'rS3', from: 'sPay', to: 'payP', type: 'serving', points: [[750, 467], [750, 330], [648, 302]], label: 'serving', lx: 778, ly: 452 },
      { id: 'rS4', from: 'sDel', to: 'conf', type: 'serving', points: [[955, 467], [955, 182]], label: 'serving', lx: 983, ly: 452 },
      { id: 'rR1', from: 'cOrder', to: 'sOrder', type: 'realization', points: [[470, 561], [432, 513]], label: 'realization', lx: 420, ly: 545 },
      { id: 'rR1b', from: 'cOrder', to: 'sCust', type: 'realization', points: [[510, 561], [572, 513]] },
      { id: 'rR2', from: 'cPay', to: 'sPay', type: 'realization', points: [[750, 561], [750, 513]], label: 'realization', lx: 700, ly: 545 },
      { id: 'rR3', from: 'cDel', to: 'sDel', type: 'realization', points: [[975, 561], [940, 513]], label: 'realization', lx: 1030, ly: 545 },
      { id: 'rDir1', from: 'cPay', to: 'send', type: 'serving', points: [[725, 561], [795, 302]] },
      { id: 'rDir2', from: 'cPay', to: 'send', type: 'serving', points: [[762, 561], [830, 302]] },
      { id: 'rFl1', from: 'cOrder', to: 'cPay', type: 'flow', points: [[545, 585], [685, 585]], label: 'order data', lx: 615, ly: 573 },
      { id: 'rFl2', from: 'cPay', to: 'cDel', type: 'flow', points: [[815, 585], [920, 585]], label: 'payment data', lx: 868, ly: 573 },
      { id: 'rFl3', from: 'cDel', to: 'cOrder', type: 'flow', points: [[1010, 609], [1010, 630], [480, 630], [480, 609]], label: 'order data', lx: 745, ly: 622 }
    ]
  };

  /* ---------------- Exercice 3 : Location de véhicules (chasse aux erreurs) ---------------- */
  const EX3 = {
    w: 1060, h: 580,
    nodes: [
      { id: 'cust', kind: 'actor', layer: 'business', x: 120, y: 150, w: 115, h: 48, label: 'Customer' },
      { id: 'fleet', container: true, layer: 'business', kind: 'role', x: 380, y: 95, w: 420, h: 105, label: 'Fleet officer', italic: true, labelAnchor: 'start', labelX: 395 },
      { id: 'hand', kind: 'process', layer: 'business', x: 590, y: 160, w: 125, h: 44, label: 'Handover vehicle' },
      { id: 'vcs', kind: 'service', layer: 'business', x: 725, y: 155, w: 130, h: 44, label: 'Vehicle central service' },
      { id: 'agent', container: true, layer: 'business', kind: 'role', x: 380, y: 250, w: 420, h: 105, label: 'Reservation agent', italic: true, labelAnchor: 'start', labelX: 395 },
      { id: 'create', kind: 'process', layer: 'business', x: 480, y: 315, w: 125, h: 44, label: 'Create reservation' },
      { id: 'valid', kind: 'process', layer: 'business', x: 650, y: 315, w: 130, h: 44, label: 'Validate reservation' },
      { id: 'rental', kind: 'event', layer: 'business', shape: 'pennant', x: 120, y: 300, w: 120, h: 46, label: 'Rental request' },
      { id: 'delivered', kind: 'object', layer: 'business', x: 950, y: 285, w: 110, h: 44, label: 'Vehicle delivered' },
      { id: 'sRes', kind: 'service', layer: 'app', x: 480, y: 435, w: 135, h: 48, label: 'Reservation service' },
      { id: 'sCust', kind: 'service', layer: 'app', x: 660, y: 435, w: 140, h: 48, label: 'Customer record service' },
      { id: 'sVeh', kind: 'service', layer: 'app', x: 840, y: 435, w: 140, h: 48, label: 'Vehicle delivery service' },
      { id: 'cRes', kind: 'component', layer: 'app', x: 480, y: 530, w: 140, h: 48, label: 'Reservation System' },
      { id: 'cCrm', kind: 'component', layer: 'app', x: 660, y: 530, w: 120, h: 48, label: 'CRM System' },
      { id: 'cDel', kind: 'component', layer: 'app', x: 840, y: 530, w: 125, h: 48, label: 'Delivery System' },
      { id: 'cust2', kind: 'actor', layer: 'business', x: 280, y: 530, w: 110, h: 46, label: 'Customer' }
    ],
    rels: [
      { id: 'a1', from: 'cust', to: 'agent', type: 'assignment', points: [[178, 150], [310, 150], [310, 280], [380, 280]], label: 'assignment', lx: 310, ly: 235 },
      { id: 'a2', from: 'rental', to: 'create', type: 'triggering', points: [[180, 300], [300, 300], [300, 315], [417, 315]] },
      { id: 'a3', from: 'create', to: 'valid', type: 'triggering', points: [[543, 315], [585, 315]] },
      { id: 'a4', from: 'valid', to: 'hand', type: 'triggering', points: [[640, 293], [640, 205], [610, 182]] },
      { id: 'a7', from: 'hand', to: 'vcs', type: 'triggering', points: [[652, 158], [660, 156]] },
      { id: 'a5', from: 'valid', to: 'hand', type: 'flow', points: [[680, 293], [680, 205], [650, 182]] },
      { id: 'a6', from: 'agent', to: 'delivered', type: 'flow', points: [[800, 285], [895, 285]] },
      { id: 's1', from: 'sRes', to: 'create', type: 'serving', points: [[480, 411], [480, 337]] },
      { id: 's2', from: 'sCust', to: 'valid', type: 'serving', points: [[660, 411], [660, 337]] },
      { id: 's3', from: 'sVeh', to: 'hand', type: 'serving', points: [[840, 411], [840, 220], [700, 195], [640, 182]] },
      { id: 'realInv', from: 'sRes', to: 'cRes', type: 'realization', points: [[480, 459], [480, 506]] },
      { id: 'real2', from: 'cCrm', to: 'sCust', type: 'realization', points: [[660, 506], [660, 459]] },
      { id: 'real3', from: 'cDel', to: 'sVeh', type: 'realization', points: [[840, 506], [840, 459]] },
      { id: 'custDirect', from: 'cust2', to: 'cRes', type: 'serving', points: [[335, 530], [410, 530]] }
    ]
  };

  /* ---------------- Exercice 4 : EasyPharm ---------------- */
  const EX4 = {
    w: 1020, h: 620,
    nodes: [
      { id: 'ohs', kind: 'service', layer: 'business', x: 330, y: 70, w: 160, h: 48, label: 'order handling service' },
      { id: 'cust', kind: 'actor', layer: 'business', x: 170, y: 250, w: 115, h: 50, label: 'Customer' },
      { id: 'roleS', container: true, layer: 'business', kind: 'role', x: 430, y: 40, w: 540, h: 110, label: 'Sales Clerk', labelAnchor: 'start', labelX: 445 },
      { id: 'reg', kind: 'process', layer: 'business', x: 540, y: 105, w: 118, h: 44, label: 'Register order' },
      { id: 'roleK', container: true, layer: 'business', kind: 'role', x: 430, y: 180, w: 540, h: 105, label: 'Stock Clerk', labelAnchor: 'start', labelX: 445 },
      { id: 'chk', kind: 'process', layer: 'business', x: 640, y: 240, w: 112, h: 44, label: 'Check stock' },
      { id: 'roleA', container: true, layer: 'business', kind: 'role', x: 430, y: 315, w: 540, h: 110, label: 'Accounting Clerk', labelAnchor: 'start', labelX: 445 },
      { id: 'inv', kind: 'process', layer: 'business', x: 760, y: 380, w: 118, h: 44, label: 'Prepare invoice' },
      { id: 'notif', kind: 'process', layer: 'business', x: 895, y: 380, w: 112, h: 44, label: 'Notify customer' },
      { id: 'sEntry', kind: 'service', layer: 'app', x: 500, y: 490, w: 130, h: 48, label: 'Order entry service' },
      { id: 'sVerif', kind: 'service', layer: 'app', x: 640, y: 490, w: 132, h: 48, label: 'Stock verification service' },
      { id: 'sInv', kind: 'service', layer: 'app', x: 782, y: 490, w: 120, h: 48, label: 'Invoicing service' },
      { id: 'sNotif', kind: 'service', layer: 'app', x: 918, y: 490, w: 130, h: 48, label: 'Notification service' },
      { id: 'cExcel', kind: 'component', layer: 'app', x: 500, y: 580, w: 130, h: 48, label: 'Excel order file' },
      { id: 'cStock', kind: 'component', layer: 'app', x: 640, y: 580, w: 125, h: 48, label: 'Stock data base' },
      { id: 'cAcc', kind: 'component', layer: 'app', x: 782, y: 580, w: 130, h: 48, label: 'Accounting software' },
      { id: 'cMail', kind: 'component', layer: 'app', x: 918, y: 580, w: 105, h: 48, label: 'Email Tool' }
    ],
    rels: [
      { id: 'r1', from: 'reg', to: 'ohs', type: 'realization', points: [[481, 105], [430, 105], [430, 70], [412, 70]] },
      { id: 'r2', from: 'ohs', to: 'cust', type: 'serving', points: [[280, 94], [225, 130], [190, 224]] },
      { id: 'r3', from: 'reg', to: 'chk', type: 'triggering', points: [[570, 127], [570, 240], [583, 240]] },
      { id: 'r4', from: 'chk', to: 'inv', type: 'triggering', points: [[680, 262], [680, 380], [700, 380]] },
      { id: 'r5', from: 'inv', to: 'notif', type: 'triggering', points: [[820, 380], [838, 380]] },
      { id: 'r6', from: 'sEntry', to: 'reg', type: 'serving', points: [[500, 466], [500, 127]] },
      { id: 'r7', from: 'sVerif', to: 'chk', type: 'serving', points: [[640, 466], [640, 262]] },
      { id: 'r8', from: 'sInv', to: 'inv', type: 'serving', points: [[782, 466], [782, 402]] },
      { id: 'r9', from: 'sNotif', to: 'notif', type: 'serving', points: [[918, 466], [918, 402]] },
      { id: 'r10', from: 'cExcel', to: 'sEntry', type: 'realization', points: [[500, 556], [500, 514]] },
      { id: 'r11', from: 'cStock', to: 'sVerif', type: 'realization', points: [[640, 556], [640, 514]] },
      { id: 'r12', from: 'cAcc', to: 'sInv', type: 'realization', points: [[782, 556], [782, 514]] },
      { id: 'r13', from: 'cMail', to: 'sNotif', type: 'realization', points: [[918, 556], [918, 514]] }
    ]
  };

  APP.register('tp3', {
    title: 'TP3 · ArchiMate',
    short: 'T3',
    module: 'archi',
    ids: IDS,
    render(page) {
      page.innerHTML = `
        <p class="eyebrow">TP3 · ArchiMate — résolution</p>
        <h1>TP3 — Lire un modèle, traquer les erreurs, jouer au consultant</h1>
        <p class="lead">Le TP3 teste trois compétences : <b>expliquer</b> un diagramme ArchiMate (ex. 1),
        <b>identifier des erreurs de modélisation</b> (ex. 2 et 3 — cliquables ci-dessous !) et <b>analyser un système
        d'information</b> en consultant (ex. 4). Gardez la <a href="#/archimate">fiche des relations</a> sous la main.</p>
      `;

      /* ---------- Exercice 1 ---------- */
      let body = QUIZ.exo(page, { title: 'Exercice 1 — Expliquer un diagramme (parcours de soin)', tag: 'Lecture', ids: ['tp3-ex1'], anchor: 'ex1' });
      body.innerHTML = `<div class="enonce"><p><b>Énoncé.</b> Le diagramme suivant représente le fonctionnement actuel du
        système d'information utilisé par une organisation. <b>Expliquez</b> ce que modélise ce diagramme.</p></div>`;
      ARCHI.render(canvasIn(body, 'Exercice 1 — parcours de soin ambulatoire (Outpatient Care)'), EX1,
        { alt: "Modèle ArchiMate d'un parcours patient hospitalier sur deux couches" });
      QUIZ.open(body, {
        id: 'tp3-ex1',
        question: 'Rédigez votre explication (méthode : couche métier de haut en bas, puis couche application), puis comparez.',
        model: `<p><b>Couche métier :</b> l'acteur « Customer » est <b>assigné</b> au rôle « Patient » : la personne joue le rôle
          de patient. Le service métier « Outpatient Care » (soins ambulatoires) <b>sert</b> le patient — c'est ce que l'hôpital
          lui offre. Ce service est <b>réalisé</b> par le processus métier « Outpatient Care Customer Journey », déclenché
          (<b>triggering</b>) par l'événement métier « Observed need for treatment » (un besoin de soin est constaté).
          Le parcours se compose de trois phases en séquence : <b>1. Pre-Service</b> (Registration — enregistrement du patient),
          <b>2. Service</b> (Moving to care service point → Waiting → Treatment), <b>3. Post-Service</b> (Exit).</p>
          <p><b>Couche application :</b> chaque étape du parcours est <b>servie</b> par un service applicatif :
          l'enregistrement par un « Self registration service », le déplacement et la sortie par un « Guidance service »,
          l'attente par un « Queuing service », le traitement par un « Patient record service ». Ces services sont <b>réalisés</b>
          par trois composants applicatifs : la Self-registration Application (qui réalise aussi les deux Guidance services),
          la Queue Application et le Patient Information System.</p>
          <p><b>En une phrase :</b> le diagramme modélise le parcours d'un patient en soins ambulatoires et montre comment chaque
          étape de ce parcours est supportée par les applications de l'hôpital.</p>`
      });

      /* ---------- Exercice 2 ---------- */
      body = QUIZ.exo(page, { title: 'Exercice 2 — FoodExpress : chasse aux erreurs', tag: 'Erreurs', ids: ['tp3-ex2'], anchor: 'ex2' });
      body.innerHTML = `<div class="enonce"><p><b>Énoncé.</b> FoodExpress est une entreprise qui propose un service de livraison
        de repas en ligne. Les clients peuvent passer une commande via le système de l'entreprise, qui est ensuite traitée avant
        d'être envoyée au service de livraison. Le traitement d'une commande implique plusieurs rôles métier. Le système
        d'information supportant ces activités repose sur plusieurs services applicatifs, notamment un système de gestion des
        commandes, un système de paiement et un système de livraison. Le diagramme ci-dessous représente l'architecture actuelle
        de l'entreprise.</p>
        <p>Cependant, ce modèle contient plusieurs <b>erreurs de modélisation</b> liées à l'utilisation des concepts et des
        relations ArchiMate. <b>Identifiez</b> les erreurs de modélisation dans le diagramme. Pour chaque erreur, <b>expliquez</b>
        pourquoi elle est incorrecte.</p></div>`;
      const api2 = ARCHI.render(canvasIn(body, 'Cliquez sur les éléments qui vous semblent erronés'), EX2,
        { alt: 'Architecture FoodExpress contenant des erreurs de modélisation' });
      QUIZ.hotspot(body, {
        id: 'tp3-ex2',
        api: api2,
        question: 'Quatre erreurs de modélisation se cachent dans ce diagramme (les zones marquées du correctif + l’incohérence de placement). Cliquez sur les éléments concernés, puis validez.',
        aliases: { 'rDir1': 'rDir2' },
        targets: {
          'jAnd': `La jonction « <b>And</b> » (et son marquage [yes]/[no] autour du « Or ») importe de la <b>logique de contrôle
            BPMN</b> dans un modèle d'architecture : une junction ArchiMate sert uniquement à combiner plusieurs relations
            du même type — pas à reconstruire des gateways de synchronisation/décision. Ce niveau de détail appartient
            au diagramme de processus BPMN, pas à ArchiMate.`,
          'servInv': `Serving <b>inversé</b> : la flèche part du processus métier « Process payment » et descend <b>vers</b> le
            service applicatif « Customer service ». C'est le monde à l'envers — un service applicatif <b>sert</b> le processus
            métier (flèche vers le haut), un processus métier ne « sert » pas la couche application. Comparez avec sa jumelle
            correcte juste à côté : « payment service » → « Process payment ».`,
          'check': `Le processus « Check customer data » est placé dans le conteneur du rôle <b>« Delivery Service »</b>, alors
            que c'est une activité de gestion de commande (vérifier les données du client avant paiement). Le rôle Delivery
            Service n'exécute par ailleurs <b>aucun</b> processus de livraison — l'affectation processus/rôle est incohérente.`,
          'rDir2': `Le composant « Payment system » est relié <b>directement</b> au processus métier « Send order to delivery »
            (les deux traits qui montent), en court-circuitant la couche des services : la structure en couches veut que le
            composant <b>réalise</b> un service applicatif (« payment service ») et que ce <b>service</b> serve les processus
            métier. Un trait direct composant → processus est une erreur de structure.`
        },
        decoys: [
          { id: 'rS3', why: '« payment service » —serving→ « Process payment » est dans le BON sens : le service applicatif sert le processus métier. C’est sa jumelle croisée (qui DESCEND vers « Customer service ») qui est fausse.' },
          { id: 'rFl1', why: 'Un flow « order data » entre deux composants applicatifs est parfaitement légal : transfert d’information.' },
          { id: 'sDel', why: '« Delivery service » (service applicatif) réalisé par « Delivery system » et servant un processus : la chaîne est correcte.' },
          { id: 'evt', why: 'Un business event qui déclenche (triggering) le premier processus : usage canonique.' }
        ]
      });
      body.insertAdjacentHTML('beforeend', H.callout('info', 'i',
        `<b>Bonus d'observation :</b> « Recieve order » contient une faute d'orthographe (Receive), le rôle « Delivery Service »
        ne contient aucune activité de livraison, et le service applicatif « Customer service » porte le même nom que le rôle
        métier « Customer service » — autant de signes d'un modèle bâclé à mentionner dans une réponse d'examen complète.`));

      /* ---------- Exercice 3 ---------- */
      body = QUIZ.exo(page, { title: 'Exercice 3 — Location de véhicules : chasse aux erreurs', tag: 'Erreurs', ids: ['tp3-ex3'], anchor: 'ex3' });
      body.innerHTML = `<div class="enonce"><p><b>Énoncé.</b> Même exercice : ce modèle d'une société de location de véhicules
        contient des erreurs d'utilisation des concepts et relations ArchiMate. Identifiez-les et expliquez pourquoi elles sont
        incorrectes.</p></div>`;
      const api3 = ARCHI.render(canvasIn(body, 'Cliquez sur les éléments qui vous semblent erronés'), EX3,
        { alt: 'Architecture de location de véhicules contenant des erreurs de modélisation' });
      QUIZ.hotspot(body, {
        id: 'tp3-ex3',
        api: api3,
        question: 'Trois erreurs (celles entourées dans le correctif). Cliquez sur les éléments concernés, puis validez.',
        targets: {
          'vcs': `Le service métier « Vehicle central service » est posé <b>à l'intérieur</b> du conteneur du rôle « Fleet officer »
            et simplement « déclenché » par le processus. Un service est un comportement <b>exposé</b> : il devrait être
            <b>réalisé</b> (realization) par le processus « Handover vehicle », placé hors du rôle, et <b>servir</b> un
            consommateur — pas être posé dans un rôle comme une étiquette au bout d'un triggering.`,
          'realInv': `La realization entre « Reservation service » et « Reservation System » est <b>dans le mauvais sens</b> :
            la flèche pointillée à triangle creux part du service vers le composant. C'est le composant (concret) qui réalise
            le service (abstrait) : Reservation System —realization→ Reservation service.`,
          'custDirect': `L'acteur métier « Customer » est relié <b>directement</b> au composant applicatif « Reservation System ».
            Un acteur métier ne se branche pas sur un composant : il consomme un <b>service</b> (applicatif ou métier) via une
            relation serving — c'est tout l'intérêt de la structure en couches.`
        },
        decoys: [
          { id: 'a1', why: 'Customer —assignment→ rôle « Reservation agent » : l’assignment d’un acteur à un rôle est correcte.' },
          { id: 'real2', why: 'CRM System —realization→ Customer record service : sens correct (composant → service).' },
          { id: 'a2', why: 'L’événement « Rental request » déclenche « Create reservation » : triggering canonique.' }
        ]
      });

      /* ---------- Exercice 4 ---------- */
      body = QUIZ.exo(page, { title: 'Exercice 4 — EasyPharm : l’analyse du consultant', tag: 'Analyse', ids: ['tp3-ex4a', 'tp3-ex4b'], anchor: 'ex4' });
      body.innerHTML = `<div class="enonce"><p><b>Énoncé.</b> La pharmacie <b>EasyPharm</b> utilise plusieurs applications pour
        gérer les commandes des clients. Lorsqu'un client passe une commande, un employé l'enregistre, vérifie le stock, prépare
        la facture et informe ensuite le client. Le diagramme ArchiMate ci-dessous représente le fonctionnement actuel du processus
        métier ainsi que les applications utilisées. Le système fonctionne, mais il semble peu cohérent et inefficace.</p>
        <p>En tant que <b>consultant en systèmes d'information</b>, analysez la situation :
        <b>identifiez</b> les principales faiblesses du SI, <b>expliquez</b> pourquoi ce système peut être considéré comme
        inefficace ou mal organisé, et <b>proposez deux améliorations</b>.</p></div>`;
      ARCHI.render(canvasIn(body, 'EasyPharm — le SI actuel'), EX4, { alt: 'Architecture EasyPharm : un outil différent par activité' });
      QUIZ.open(body, {
        id: 'tp3-ex4a',
        question: 'Listez les faiblesses que vous voyez (regardez : combien d’applications ? qui fait quoi ? où est le client ?), puis comparez avec le correctif.',
        model: `<p><b>Les 5 faiblesses du correctif :</b></p>
          <p><b>1) Trop d'applications séparées.</b> Chaque activité dépend d'un outil distinct :
          Register order → Excel Order File · Check stock → Stock Database · Prepare invoice → Accounting Software ·
          Notify customer → Email Tool ⇒ pas d'intégration, beaucoup de ressaisie.</p>
          <p><b>2) Le processus est séquentiel et manuel.</b> Chaque rôle travaille chacun de son côté : le Sales Clerk fait
          l'encodage, le Stock Clerk vérifie ensuite, l'Accounting Clerk facture ensuite, puis retour manuel vers le client
          ⇒ lenteur, dépendance humaine, risque d'erreur.</p>
          <p><b>3) Le client n'a aucun accès direct à un service numérique.</b> Il dépend entièrement d'un employé pour démarrer
          le processus ⇒ pas de self-service, inefficace.</p>
          <p><b>4) Une application très faible comme composant principal.</b> Excel Order File comme système de commande
          principal ⇒ faiblesse du SI (pas multi-utilisateurs, pas de contrôle, pas d'intégrité).</p>
          <p><b>5) Notification dissociée du reste.</b> La notification au client se fait via un outil e-mail indépendant,
          sans lien réel avec la commande ou la facture ⇒ fragmentation.</p>`
      });
      QUIZ.qcm(body, {
        id: 'tp3-ex4b',
        multi: true,
        question: 'Quelles DEUX améliorations proposeriez-vous en priorité pour rendre le système plus cohérent et efficace ? (2 réponses)',
        options: [
          { t: 'Remplacer les outils dispersés par un système intégré de gestion des commandes (type ERP) qui réalise l’ensemble des services applicatifs — une seule saisie, données partagées', ok: true, why: 'Répond directement aux faiblesses 1, 4 et 5 : intégration, fin de la ressaisie, fin d’Excel comme SI central.' },
          { t: 'Offrir au client un service de commande en ligne (self-service) avec notification automatique liée à la commande et à la facture', ok: true, why: 'Répond aux faiblesses 2, 3 et 5 : le client déclenche lui-même le processus, la notification est intégrée.' },
          { t: 'Ajouter un deuxième fichier Excel de sauvegarde', why: 'On multiplierait la fragmentation et la ressaisie au lieu de les réduire.' },
          { t: 'Supprimer le rôle Accounting Clerk', why: 'Le problème n’est pas l’existence des rôles mais la fragmentation des outils et l’absence d’intégration.' }
        ],
        explain: 'Une bonne réponse de consultant relie chaque amélioration aux faiblesses qu’elle corrige — et pourrait se dessiner en ArchiMate : un seul composant « Order management system » réalisant les 4 services applicatifs + un « Online ordering service » servant directement le Customer.'
      });

      H.nextPrev(page, ['archimate', 'Théorie ArchiMate'], ['examen', 'Examen blanc']);
    }
  });
})();
