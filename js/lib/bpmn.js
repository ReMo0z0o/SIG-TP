/* ============================================================
   BPMN — moteur de rendu SVG
   Dessine des diagrammes BPMN 2.0 (pools, lanes, tâches,
   événements, gateways, flux) à partir d'une spec JSON.
   ============================================================ */
window.BPMN = (function () {
  const NS = 'http://www.w3.org/2000/svg';
  const INK = '#2b2b26';
  const TASK_FILL = '#fdfbd4';
  const TASK_STROKE = '#8a8a55';

  let uid = 0;

  function el(name, attrs, parent) {
    const e = document.createElementNS(NS, name);
    for (const k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  function wrap(text, maxChars) {
    if (!text) return [];
    const words = String(text).split(/\s+/);
    const lines = [];
    let cur = '';
    for (const w of words) {
      if ((cur + ' ' + w).trim().length > maxChars && cur) { lines.push(cur); cur = w; }
      else cur = (cur + ' ' + w).trim();
    }
    if (cur) lines.push(cur);
    return lines;
  }

  function textBlock(parent, x, y, label, opts) {
    opts = opts || {};
    const size = opts.size || 12.5;
    const lines = wrap(label, opts.maxChars || 16);
    const lh = size * 1.22;
    const y0 = y - ((lines.length - 1) * lh) / 2;
    const t = el('text', {
      x, y: y0,
      'text-anchor': opts.anchor || 'middle',
      'dominant-baseline': 'middle',
      'font-family': 'system-ui, "Segoe UI", sans-serif',
      'font-size': size,
      'font-weight': opts.weight || 500,
      fill: opts.fill || INK,
      'font-style': opts.italic ? 'italic' : 'normal'
    }, parent);
    lines.forEach((ln, i) => {
      el('tspan', { x, dy: i === 0 ? 0 : lh }, t).textContent = ln;
    });
    return t;
  }

  /* ---------- icônes d'événements ---------- */
  function envelope(g, cx, cy, s, filled) {
    const w = s, h = s * 0.72;
    const x = cx - w / 2, y = cy - h / 2;
    el('rect', {
      x, y, width: w, height: h,
      fill: filled ? INK : 'none',
      stroke: filled ? '#fff' : INK, 'stroke-width': 1.4
    }, g);
    el('path', {
      d: `M ${x} ${y} L ${cx} ${cy + h * 0.12} L ${x + w} ${y}`,
      fill: 'none', stroke: filled ? '#fff' : INK, 'stroke-width': 1.4
    }, g);
  }

  function clock(g, cx, cy, r) {
    el('circle', { cx, cy, r, fill: 'none', stroke: INK, 'stroke-width': 1.4 }, g);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      el('line', {
        x1: cx + Math.cos(a) * r * 0.8, y1: cy + Math.sin(a) * r * 0.8,
        x2: cx + Math.cos(a) * r, y2: cy + Math.sin(a) * r,
        stroke: INK, 'stroke-width': 1
      }, g);
    }
    el('path', {
      d: `M ${cx} ${cy - r * 0.55} L ${cx} ${cy} L ${cx + r * 0.45} ${cy + r * 0.2}`,
      fill: 'none', stroke: INK, 'stroke-width': 1.4, 'stroke-linecap': 'round'
    }, g);
  }

  function gear(g, cx, cy, r) {
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      el('line', {
        x1: cx + Math.cos(a) * r * 0.55, y1: cy + Math.sin(a) * r * 0.55,
        x2: cx + Math.cos(a) * r, y2: cy + Math.sin(a) * r,
        stroke: INK, 'stroke-width': 1.8
      }, g);
    }
    el('circle', { cx, cy, r: r * 0.55, fill: 'none', stroke: INK, 'stroke-width': 1.4 }, g);
    el('circle', { cx, cy, r: r * 0.2, fill: 'none', stroke: INK, 'stroke-width': 1.2 }, g);
  }

  function eventIcon(g, type, cx, cy, opt) {
    opt = opt || {};
    if (type === 'message') envelope(g, cx, cy, 15, !!opt.filled);
    else if (type === 'timer') clock(g, cx, cy, 9);
    else if (type === 'terminate') el('circle', { cx, cy, r: 8.5, fill: INK }, g);
  }

  /* ---------- formes ---------- */
  function drawEvent(g, n) {
    const r = n.r || 17;
    const kind = n.type; // start | end | catch | throw | boundary
    const thick = kind === 'end' ? 3 : 1.6;
    const dash = n.interrupting === false ? '4 3' : null;
    const c1 = el('circle', {
      cx: n.x, cy: n.y, r,
      fill: '#fff', stroke: INK, 'stroke-width': thick,
      class: 'dg-shape'
    }, g);
    if (dash) c1.setAttribute('stroke-dasharray', dash);
    if (kind === 'catch' || kind === 'throw' || kind === 'boundary') {
      const c2 = el('circle', { cx: n.x, cy: n.y, r: r - 3.5, fill: 'none', stroke: INK, 'stroke-width': 1.3 }, g);
      if (dash) c2.setAttribute('stroke-dasharray', dash);
    }
    eventIcon(g, n.event, n.x, n.y, { filled: kind === 'throw' || (kind === 'end' && n.event === 'message') });
    if (n.label) {
      textBlock(g, n.x + (n.ldx || 0), n.y + r + 13 + (n.ldy || 0), n.label, { size: 11.5, maxChars: n.lw || 18 });
    }
  }

  function markerIcons(g, n, w, h) {
    const y = n.y + h / 2 - 11;
    const icons = [];
    if (n.marker) icons.push(n.marker);
    if (n.sub) icons.push('sub');
    const total = icons.length;
    icons.forEach((m, i) => {
      const cx = n.x + (i - (total - 1) / 2) * 20;
      if (m === 'loop') {
        el('path', {
          d: `M ${cx - 5} ${y + 3} A 6 6 0 1 1 ${cx + 5.4} ${y + 1.4}`,
          fill: 'none', stroke: INK, 'stroke-width': 1.5
        }, g);
        el('path', { d: `M ${cx - 8} ${y + 1} L ${cx - 5} ${y + 5} L ${cx - 1.5} ${y + 1.5} Z`, fill: INK }, g);
      } else if (m === 'multi') { // parallèle : barres verticales
        for (let k = -1; k <= 1; k++) el('line', { x1: cx + k * 4, y1: y - 4, x2: cx + k * 4, y2: y + 6, stroke: INK, 'stroke-width': 2 }, g);
      } else if (m === 'multiSeq') { // séquentiel : barres horizontales
        for (let k = -1; k <= 1; k++) el('line', { x1: cx - 6, y1: y + 1 + k * 4, x2: cx + 6, y2: y + 1 + k * 4, stroke: INK, 'stroke-width': 2 }, g);
      } else if (m === 'sub') {
        el('rect', { x: cx - 6, y: y - 5, width: 12, height: 12, fill: '#fff', stroke: INK, 'stroke-width': 1.2 }, g);
        el('line', { x1: cx - 3, y1: y + 1, x2: cx + 3, y2: y + 1, stroke: INK, 'stroke-width': 1.2 }, g);
        el('line', { x1: cx, y1: y - 2, x2: cx, y2: y + 4, stroke: INK, 'stroke-width': 1.2 }, g);
      }
    });
  }

  function drawTask(g, n) {
    const w = n.w || 112, h = n.h || 58;
    el('rect', {
      x: n.x - w / 2, y: n.y - h / 2, width: w, height: h,
      rx: 9, fill: n.fill || TASK_FILL, stroke: TASK_STROKE, 'stroke-width': 1.6,
      class: 'dg-shape'
    }, g);
    if (n.icon === 'send') envelope(g, n.x - w / 2 + 13, n.y - h / 2 + 11, 13, true);
    if (n.icon === 'receive') envelope(g, n.x - w / 2 + 13, n.y - h / 2 + 11, 13, false);
    if (n.icon === 'service') gear(g, n.x - w / 2 + 13, n.y - h / 2 + 12, 7);
    const hasMarker = n.marker || n.sub;
    textBlock(g, n.x, n.y - (hasMarker ? 5 : 0) + (n.icon ? 4 : 0), n.label, { maxChars: Math.max(12, Math.round(w / 7.4)) });
    markerIcons(g, n, w, h);
  }

  function drawSubprocess(g, n) {
    // sous-processus étendu
    const w = n.w, h = n.h;
    el('rect', {
      x: n.x - w / 2, y: n.y - h / 2, width: w, height: h,
      rx: 10, fill: n.fill || '#fffef2', stroke: TASK_STROKE, 'stroke-width': 1.6,
      class: 'dg-shape'
    }, g);
    if (n.label) textBlock(g, n.x - w / 2 + 12, n.y - h / 2 + 15, n.label, { anchor: 'start', size: 12, weight: 600, maxChars: 60 });
    if (n.marker) markerIcons(g, n, w, h);
  }

  function drawGateway(g, n) {
    const s = n.s || 23; // demi-diagonale
    const { x, y } = n;
    el('path', {
      d: `M ${x} ${y - s} L ${x + s} ${y} L ${x} ${y + s} L ${x - s} ${y} Z`,
      fill: '#fff', stroke: INK, 'stroke-width': 1.7, class: 'dg-shape'
    }, g);
    const k = s * 0.42;
    if (n.gw === 'xor') {
      el('line', { x1: x - k, y1: y - k, x2: x + k, y2: y + k, stroke: INK, 'stroke-width': 3.2 }, g);
      el('line', { x1: x - k, y1: y + k, x2: x + k, y2: y - k, stroke: INK, 'stroke-width': 3.2 }, g);
    } else if (n.gw === 'and') {
      el('line', { x1: x, y1: y - k - 2, x2: x, y2: y + k + 2, stroke: INK, 'stroke-width': 3.2 }, g);
      el('line', { x1: x - k - 2, y1: y, x2: x + k + 2, y2: y, stroke: INK, 'stroke-width': 3.2 }, g);
    } else if (n.gw === 'or') {
      el('circle', { cx: x, cy: y, r: k + 1.5, fill: 'none', stroke: INK, 'stroke-width': 2.6 }, g);
    } else if (n.gw === 'event') {
      el('circle', { cx: x, cy: y, r: k + 4, fill: 'none', stroke: INK, 'stroke-width': 1.2 }, g);
      el('circle', { cx: x, cy: y, r: k + 1.5, fill: 'none', stroke: INK, 'stroke-width': 1.2 }, g);
      const p = [];
      for (let i = 0; i < 5; i++) {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        p.push(`${x + Math.cos(a) * (k - 1)},${y + Math.sin(a) * (k - 1)}`);
      }
      el('polygon', { points: p.join(' '), fill: 'none', stroke: INK, 'stroke-width': 1.4 }, g);
    }
    if (n.label) textBlock(g, n.x + (n.ldx || 0), n.y - s - 12 + (n.ldy || 0), n.label, { size: 11.5, weight: 600, maxChars: n.lw || 20 });
  }

  function drawData(g, n) {
    const w = n.w || 44, h = n.h || 54, f = 11;
    const x = n.x - w / 2, y = n.y - h / 2;
    el('path', {
      d: `M ${x} ${y} L ${x + w - f} ${y} L ${x + w} ${y + f} L ${x + w} ${y + h} L ${x} ${y + h} Z`,
      fill: '#fff', stroke: INK, 'stroke-width': 1.4, class: 'dg-shape'
    }, g);
    el('path', { d: `M ${x + w - f} ${y} L ${x + w - f} ${y + f} L ${x + w} ${y + f}`, fill: 'none', stroke: INK, 'stroke-width': 1.4 }, g);
    if (n.label) textBlock(g, n.x, y + h + 14, n.label, { size: 11.5, maxChars: 16 });
  }

  function drawNote(g, n) {
    const w = n.w || 130, h = n.h || 44;
    const x = n.x - w / 2, y = n.y - h / 2;
    el('path', {
      d: `M ${x + 12} ${y} L ${x} ${y} L ${x} ${y + h} L ${x + 12} ${y + h}`,
      fill: 'none', stroke: INK, 'stroke-width': 1.3, class: 'dg-shape'
    }, g);
    textBlock(g, x + 8, n.y, n.label, { anchor: 'start', size: 11.5, maxChars: n.lw || 20 });
  }

  function drawLabel(g, n) {
    textBlock(g, n.x, n.y, n.label, { size: n.size || 12, weight: n.weight || 600, anchor: n.anchor || 'middle', maxChars: n.lw || 40, italic: n.italic });
  }

  /* ---------- ancres & routage ---------- */
  function nodeBox(n) {
    let w, h;
    switch (n.type) {
      case 'task': w = n.w || 112; h = n.h || 58; break;
      case 'subprocess': w = n.w; h = n.h; break;
      case 'gateway': w = h = (n.s || 23) * 2; break;
      case 'data': w = n.w || 44; h = n.h || 54; break;
      case 'note': w = n.w || 130; h = n.h || 44; break;
      default: w = h = (n.r || 17) * 2; // événements
    }
    return { x: n.x - w / 2, y: n.y - h / 2, w, h, cx: n.x, cy: n.y };
  }

  function anchor(n, side, frac) {
    const b = nodeBox(n);
    frac = frac == null ? 0.5 : frac;
    const isRound = !n.type || ['start', 'end', 'catch', 'throw', 'boundary'].includes(n.type);
    const isDiamond = n.type === 'gateway';
    if (isRound) {
      const r = (n.r || 17);
      if (side === 'l') return [n.x - r, n.y];
      if (side === 'r') return [n.x + r, n.y];
      if (side === 't') return [n.x, n.y - r];
      if (side === 'b') return [n.x, n.y + r];
    }
    if (isDiamond) {
      const s = (n.s || 23);
      if (side === 'l') return [n.x - s, n.y];
      if (side === 'r') return [n.x + s, n.y];
      if (side === 't') return [n.x, n.y - s];
      if (side === 'b') return [n.x, n.y + s];
    }
    if (side === 'l') return [b.x, b.y + b.h * frac];
    if (side === 'r') return [b.x + b.w, b.y + b.h * frac];
    if (side === 't') return [b.x + b.w * frac, b.y];
    if (side === 'b') return [b.x + b.w * frac, b.y + b.h];
    return [b.cx, b.cy];
  }

  function autoSides(a, b) {
    const dx = b.cx - a.cx, dy = b.cy - a.cy;
    if (Math.abs(dx) >= Math.abs(dy)) return [dx >= 0 ? 'r' : 'l', dx >= 0 ? 'l' : 'r'];
    return [dy >= 0 ? 'b' : 't', dy >= 0 ? 't' : 'b'];
  }

  function routePoints(nFrom, nTo, f) {
    const bA = nodeBox(nFrom), bB = nodeBox(nTo);
    let [sA, sB] = autoSides(bA, bB);
    if (f.fromSide) sA = f.fromSide;
    if (f.toSide) sB = f.toSide;
    const p0 = anchor(nFrom, sA, f.fromFrac);
    const pn = anchor(nTo, sB, f.toFrac);
    const pts = [p0];
    if (f.via) f.via.forEach(p => pts.push(p));
    else {
      // routage orthogonal simple
      const horizA = sA === 'l' || sA === 'r';
      const horizB = sB === 'l' || sB === 'r';
      if (horizA && horizB && Math.abs(p0[1] - pn[1]) > 2) {
        const mx = (p0[0] + pn[0]) / 2;
        pts.push([mx, p0[1]], [mx, pn[1]]);
      } else if (!horizA && !horizB && Math.abs(p0[0] - pn[0]) > 2) {
        const my = (p0[1] + pn[1]) / 2;
        pts.push([p0[0], my], [pn[0], my]);
      } else if (horizA && !horizB) {
        pts.push([pn[0], p0[1]]);
      } else if (!horizA && horizB) {
        pts.push([p0[0], pn[1]]);
      }
    }
    pts.push(pn);
    return pts;
  }

  function drawFlow(gLayer, f, byId, defsId) {
    const nFrom = byId[f.from], nTo = byId[f.to];
    let pts;
    if (f.points) pts = f.points;
    else pts = routePoints(nFrom, nTo, f);

    const d = pts.map((p, i) => (i === 0 ? 'M' : 'L') + ' ' + p[0] + ' ' + p[1]).join(' ');
    const g = el('g', { class: 'dg-flow', 'data-id': f.id || '' }, gLayer);
    const path = el('path', {
      d, fill: 'none', stroke: INK,
      'stroke-width': f.type === 'msg' ? 1.4 : 1.8,
      class: 'dg-flow-path'
    }, g);
    if (f.type === 'msg') {
      path.setAttribute('stroke-dasharray', '5 4');
      path.setAttribute('marker-end', `url(#${defsId}-msgArrow)`);
      path.setAttribute('marker-start', `url(#${defsId}-msgStart)`);
    } else if (f.type === 'assoc') {
      path.setAttribute('stroke-dasharray', '2.5 3.5');
      path.setAttribute('stroke-width', 1.3);
    } else {
      path.setAttribute('marker-end', `url(#${defsId}-seqArrow)`);
    }
    if (f.label) {
      const mid = f.labelAt != null ? pts[f.labelAt] : pts[Math.floor((pts.length - 1) / 2)];
      const lx = (f.lx != null) ? f.lx : (mid[0] + (pts.length === 2 ? (pts[1][0] - pts[0][0]) / 2 : 0));
      const ly = (f.ly != null) ? f.ly : mid[1] - 10;
      textBlock(g, lx, ly, f.label, { size: 11.5, weight: 600, maxChars: f.lw || 22 });
    }
    return { g, path, pts };
  }

  /* ---------- pools & lanes ---------- */
  function drawPool(gLayer, p) {
    const g = el('g', { class: 'dg-pool' }, gLayer);
    el('rect', { x: p.x, y: p.y, width: p.w, height: p.h, fill: 'none', stroke: INK, 'stroke-width': 1.6 }, g);
    const bandW = p.band === false ? 0 : 26;
    if (bandW) {
      el('line', { x1: p.x + bandW, y1: p.y, x2: p.x + bandW, y2: p.y + p.h, stroke: INK, 'stroke-width': 1.2 }, g);
      const t = el('text', {
        x: p.x + bandW / 2 + 4, y: p.y + p.h / 2,
        'text-anchor': 'middle', 'dominant-baseline': 'middle',
        'font-family': 'system-ui, sans-serif', 'font-size': 12.5, 'font-weight': 600, fill: INK,
        transform: `rotate(-90 ${p.x + bandW / 2 + 4} ${p.y + p.h / 2})`
      }, g);
      t.textContent = p.label || '';
    } else if (p.label) {
      textBlock(g, p.x + p.w / 2, p.y + p.h / 2, p.label, { size: 14, weight: 600 });
    }
    let laneY = p.y;
    (p.lanes || []).forEach((ln, i) => {
      if (i > 0) el('line', { x1: p.x + bandW, y1: laneY, x2: p.x + p.w, y2: laneY, stroke: INK, 'stroke-width': 1 }, g);
      const lb = 24;
      el('line', { x1: p.x + bandW + lb, y1: laneY, x2: p.x + bandW + lb, y2: laneY + ln.h, stroke: INK, 'stroke-width': .8 }, g);
      const t = el('text', {
        x: p.x + bandW + lb / 2 + 4, y: laneY + ln.h / 2,
        'text-anchor': 'middle', 'dominant-baseline': 'middle',
        'font-family': 'system-ui, sans-serif', 'font-size': 11.5, 'font-weight': 500, fill: INK,
        transform: `rotate(-90 ${p.x + bandW + lb / 2 + 4} ${laneY + ln.h / 2})`
      }, g);
      t.textContent = ln.label || '';
      if (ln.ghost) {
        textBlock(g, p.x + p.w - 90, laneY + 16, ln.ghost, { size: 11, fill: '#9a9a90', italic: true, maxChars: 40 });
      }
      laneY += ln.h;
    });
    return g;
  }

  /* ---------- rendu principal ---------- */
  function render(container, spec, opts) {
    opts = opts || {};
    const defsId = 'bp' + (++uid);
    const svg = el('svg', {
      viewBox: `0 0 ${spec.w} ${spec.h}`,
      width: spec.w,
      role: 'img',
      'aria-label': opts.alt || 'Diagramme BPMN',
      style: 'font-family: system-ui, sans-serif; max-width:none;'
    });
    const defs = el('defs', {}, svg);
    // flèche de flux de séquence (pleine)
    const m1 = el('marker', { id: defsId + '-seqArrow', markerWidth: 11, markerHeight: 9, refX: 9.5, refY: 4.5, orient: 'auto' }, defs);
    el('path', { d: 'M 0 0 L 10 4.5 L 0 9 Z', fill: INK }, m1);
    // flèche de flux de message (ouverte)
    const m2 = el('marker', { id: defsId + '-msgArrow', markerWidth: 12, markerHeight: 10, refX: 10, refY: 5, orient: 'auto' }, defs);
    el('path', { d: 'M 0.5 0.5 L 10.5 5 L 0.5 9.5 Z', fill: '#fff', stroke: INK, 'stroke-width': 1.1 }, m2);
    const m3 = el('marker', { id: defsId + '-msgStart', markerWidth: 10, markerHeight: 10, refX: 4.5, refY: 4.5, orient: 'auto' }, defs);
    el('circle', { cx: 4.5, cy: 4.5, r: 3.2, fill: '#fff', stroke: INK, 'stroke-width': 1.1 }, m3);
    // grille pointillée
    const pat = el('pattern', { id: defsId + '-grid', width: 16, height: 16, patternUnits: 'userSpaceOnUse' }, defs);
    el('circle', { cx: 1, cy: 1, r: 0.9, fill: '#d5d9d0' }, pat);
    el('rect', { x: 0, y: 0, width: spec.w, height: spec.h, fill: '#fefefc' }, svg);
    if (spec.grid !== false) el('rect', { x: 0, y: 0, width: spec.w, height: spec.h, fill: `url(#${defsId}-grid)` }, svg);

    const gPools = el('g', {}, svg);
    const gFlows = el('g', {}, svg);
    const gNodes = el('g', {}, svg);
    const gTokens = el('g', {}, svg);

    (spec.pools || []).forEach(p => drawPool(gPools, p));

    const byId = {};
    (spec.nodes || []).forEach(n => { if (n.id) byId[n.id] = n; });

    const flowApis = {};
    (spec.flows || []).forEach(f => {
      flowApis[f.id || (f.from + '->' + f.to)] = drawFlow(gFlows, f, byId, defsId);
    });

    const nodeEls = {};
    (spec.nodes || []).forEach(n => {
      const g = el('g', { class: 'dg-node', 'data-id': n.id || '' }, gNodes);
      switch (n.type) {
        case 'task': drawTask(g, n); break;
        case 'subprocess': drawSubprocess(g, n); break;
        case 'gateway': drawGateway(g, n); break;
        case 'data': drawData(g, n); break;
        case 'note': drawNote(g, n); break;
        case 'label': drawLabel(g, n); break;
        default: drawEvent(g, n);
      }
      if (n.id) nodeEls[n.id] = g;
    });

    container.appendChild(svg);

    /* ---------- API ---------- */
    const api = {
      svg,
      spec,
      nodeEl: id => nodeEls[id],
      flow: id => flowApis[id],
      setHidden(ids, hidden) {
        ids.forEach(id => {
          const target = nodeEls[id] || (flowApis[id] && flowApis[id].g);
          if (target) target.classList.toggle('dg-hidden', hidden);
        });
      },
      classify(id, cls, on) {
        const target = nodeEls[id] || (flowApis[id] && flowApis[id].g);
        if (target) target.classList.toggle(cls, on !== false);
      },
      clearClasses(cls) {
        svg.querySelectorAll('.' + cls).forEach(e => e.classList.remove(cls));
      },
      onNodeClick(ids, cb) {
        ids.forEach(id => {
          const g = nodeEls[id];
          if (!g) return;
          g.classList.add('dg-clickable');
          g.setAttribute('tabindex', '0');
          g.setAttribute('role', 'button');
          const h = () => cb(id, g);
          g.addEventListener('click', h);
          g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); h(); } });
        });
      },
      /* jeton animé le long d'une suite de points */
      token(color) {
        const t = el('circle', { r: 7.5, fill: color || '#c4453c', stroke: '#fff', 'stroke-width': 2, class: 'token' }, gTokens);
        t.style.display = 'none';
        return {
          el: t,
          moveAlong(pts, duration) {
            return new Promise(res => {
              const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
              const segs = [];
              let total = 0;
              for (let i = 1; i < pts.length; i++) {
                const L = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
                segs.push({ a: pts[i - 1], b: pts[i], L });
                total += L;
              }
              t.style.display = '';
              if (reduced || total === 0) {
                const last = pts[pts.length - 1];
                t.setAttribute('cx', last[0]); t.setAttribute('cy', last[1]);
                return setTimeout(res, 60);
              }
              const t0 = performance.now();
              const dur = duration || Math.max(500, total * 2.4);
              function frame(now) {
                let p = Math.min(1, (now - t0) / dur);
                let dist = p * total;
                for (const s of segs) {
                  if (dist <= s.L || s === segs[segs.length - 1]) {
                    const f = s.L === 0 ? 0 : Math.min(1, dist / s.L);
                    t.setAttribute('cx', s.a[0] + (s.b[0] - s.a[0]) * f);
                    t.setAttribute('cy', s.a[1] + (s.b[1] - s.a[1]) * f);
                    break;
                  }
                  dist -= s.L;
                }
                if (p < 1) requestAnimationFrame(frame); else res();
              }
              requestAnimationFrame(frame);
            });
          },
          set(x, y) { t.style.display = ''; t.setAttribute('cx', x); t.setAttribute('cy', y); },
          hide() { t.style.display = 'none'; },
          remove() { t.remove(); }
        };
      },
      flowPts(id) { const f = flowApis[id]; return f ? f.pts : null; }
    };
    return api;
  }

  /* mini-figures pour les cartes de notation */
  function fig(draw, w, h) {
    const div = document.createElement('div');
    const svg = el('svg', { viewBox: `0 0 ${w || 120} ${h || 70}`, width: w || 120, height: h || 70 });
    draw(svg, el);
    div.appendChild(svg);
    return div;
  }

  return { render, el, fig, wrap, textBlock, INK, TASK_FILL, TASK_STROKE, envelope, clock, eventIcon, drawEvent, drawTask, drawGateway };
})();
