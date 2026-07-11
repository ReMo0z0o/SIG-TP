/* ============================================================
   ARCHI — moteur de rendu SVG ArchiMate 3.x
   Couche métier (jaune) & couche application (bleu clair),
   relations structurelles / de dépendance / dynamiques.
   ============================================================ */
window.ARCHI = (function () {
  const NS = 'http://www.w3.org/2000/svg';
  const INK = '#33332c';
  const LAYERS = {
    business: { fill: '#fff6be', stroke: '#a89b45' },
    app:      { fill: '#c5eff3', stroke: '#4d939c' },
    tech:     { fill: '#d3e8c5', stroke: '#6f9455' },
    none:     { fill: '#ffffff', stroke: '#8a8a80' }
  };
  let uid = 0;

  function el(name, attrs, parent) {
    const e = document.createElementNS(NS, name);
    for (const k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  const wrap = window.BPMN ? window.BPMN.wrap : (t) => [t];

  function textBlock(parent, x, y, label, opts) {
    opts = opts || {};
    const size = opts.size || 12;
    const lines = wrap(label, opts.maxChars || 18);
    const lh = size * 1.2;
    const y0 = y - ((lines.length - 1) * lh) / 2;
    const t = el('text', {
      x, y: y0,
      'text-anchor': opts.anchor || 'middle',
      'dominant-baseline': 'middle',
      'font-family': 'system-ui, "Segoe UI", sans-serif',
      'font-size': size, 'font-weight': opts.weight || 500,
      fill: opts.fill || INK,
      'font-style': opts.italic ? 'italic' : 'normal'
    }, parent);
    lines.forEach((ln, i) => { el('tspan', { x, dy: i === 0 ? 0 : lh }, t).textContent = ln; });
    return t;
  }

  /* ---------- icônes coin supérieur droit ---------- */
  function icon(g, type, x, y) {
    // x,y = coin supérieur droit intérieur
    const s = 1;
    if (type === 'actor') {
      const cx = x - 7, cy = y + 6;
      el('circle', { cx, cy, r: 3, fill: 'none', stroke: INK, 'stroke-width': 1.2 }, g);
      el('line', { x1: cx, y1: cy + 3, x2: cx, y2: cy + 9, stroke: INK, 'stroke-width': 1.2 }, g);
      el('line', { x1: cx - 4, y1: cy + 5.5, x2: cx + 4, y2: cy + 5.5, stroke: INK, 'stroke-width': 1.2 }, g);
      el('line', { x1: cx, y1: cy + 9, x2: cx - 3.5, y2: cy + 13, stroke: INK, 'stroke-width': 1.2 }, g);
      el('line', { x1: cx, y1: cy + 9, x2: cx + 3.5, y2: cy + 13, stroke: INK, 'stroke-width': 1.2 }, g);
    } else if (type === 'role') {
      const cx = x - 10, cy = y + 9;
      el('path', { d: `M ${cx - 5} ${cy - 4} L ${cx + 3} ${cy - 4} M ${cx - 5} ${cy + 4} L ${cx + 3} ${cy + 4}`, stroke: INK, 'stroke-width': 1.2, fill: 'none' }, g);
      el('ellipse', { cx: cx + 3, cy, rx: 2.6, ry: 4, fill: 'none', stroke: INK, 'stroke-width': 1.2 }, g);
      el('path', { d: `M ${cx - 5} ${cy - 4} A 2.6 4 0 0 0 ${cx - 5} ${cy + 4}`, fill: 'none', stroke: INK, 'stroke-width': 1.2 }, g);
    } else if (type === 'process') {
      el('path', { d: `M ${x - 16} ${y + 6} L ${x - 9} ${y + 6} L ${x - 9} ${y + 3} L ${x - 4} ${y + 8} L ${x - 9} ${y + 13} L ${x - 9} ${y + 10} L ${x - 16} ${y + 10} Z`, fill: 'none', stroke: INK, 'stroke-width': 1.1 }, g);
    } else if (type === 'service') {
      el('rect', { x: x - 17, y: y + 4, width: 13, height: 8, rx: 4, fill: 'none', stroke: INK, 'stroke-width': 1.2 }, g);
    } else if (type === 'function') {
      el('path', { d: `M ${x - 15} ${y + 13} L ${x - 15} ${y + 7} L ${x - 10} ${y + 3} L ${x - 5} ${y + 7} L ${x - 5} ${y + 13} L ${x - 10} ${y + 9} Z`, fill: 'none', stroke: INK, 'stroke-width': 1.1 }, g);
    } else if (type === 'event') {
      el('path', { d: `M ${x - 16} ${y + 4} L ${x - 8} ${y + 4} A 4.5 4.5 0 0 1 ${x - 8} ${y + 12} L ${x - 16} ${y + 12} L ${x - 12.5} ${y + 8} Z`, fill: 'none', stroke: INK, 'stroke-width': 1.1 }, g);
    } else if (type === 'object') {
      el('rect', { x: x - 17, y: y + 4, width: 13, height: 9, fill: 'none', stroke: INK, 'stroke-width': 1.1 }, g);
      el('line', { x1: x - 17, y1: y + 7, x2: x - 4, y2: y + 7, stroke: INK, 'stroke-width': 1.1 }, g);
    } else if (type === 'component') {
      el('rect', { x: x - 14, y: y + 3, width: 10, height: 12, fill: 'none', stroke: INK, 'stroke-width': 1.1 }, g);
      el('rect', { x: x - 17, y: y + 5, width: 6, height: 3, fill: '#fff', stroke: INK, 'stroke-width': 1.1 }, g);
      el('rect', { x: x - 17, y: y + 10, width: 6, height: 3, fill: '#fff', stroke: INK, 'stroke-width': 1.1 }, g);
    } else if (type === 'collaboration') {
      el('circle', { cx: x - 13, cy: y + 8, r: 4.5, fill: 'none', stroke: INK, 'stroke-width': 1.1 }, g);
      el('circle', { cx: x - 7, cy: y + 8, r: 4.5, fill: 'none', stroke: INK, 'stroke-width': 1.1 }, g);
    } else if (type === 'interface') {
      el('line', { x1: x - 17, y1: y + 8, x2: x - 10, y2: y + 8, stroke: INK, 'stroke-width': 1.1 }, g);
      el('circle', { cx: x - 7, cy: y + 8, r: 3.5, fill: 'none', stroke: INK, 'stroke-width': 1.1 }, g);
    } else if (type === 'interaction') {
      el('path', { d: `M ${x - 12.5} ${y + 3.5} A 4.5 4.5 0 0 0 ${x - 12.5} ${y + 12.5} Z`, fill: 'none', stroke: INK, 'stroke-width': 1.1 }, g);
      el('path', { d: `M ${x - 9.5} ${y + 3.5} A 4.5 4.5 0 0 1 ${x - 9.5} ${y + 12.5} Z`, fill: 'none', stroke: INK, 'stroke-width': 1.1 }, g);
    }
  }

  /* ---------- éléments ---------- */
  function drawNode(gLayer, n) {
    const g = el('g', { class: 'dg-node', 'data-id': n.id || '' }, gLayer);
    const L = LAYERS[n.layer || 'business'];
    const w = n.w || 130, h = n.h || 52;
    const x = n.x - w / 2, y = n.y - h / 2;
    const fill = n.fill || L.fill, stroke = n.strokeCol || L.stroke;

    const behav = ['process', 'function', 'interaction', 'event', 'service'].includes(n.kind);

    if (n.kind === 'service' && n.shape !== 'rect') {
      // forme "stade" arrondie
      el('rect', { x, y, width: w, height: h, rx: h / 2, fill, stroke, 'stroke-width': 1.5, class: 'dg-shape' }, g);
      textBlock(g, n.x, n.y, n.label, { maxChars: Math.max(12, Math.round(w / 7)) });
    } else if (n.kind === 'event' && n.shape === 'pennant') {
      // bannière pointue (notation alternative des événements dans les TP)
      const k = 16;
      el('path', {
        d: `M ${x} ${y} L ${x + w - k} ${y} L ${x + w} ${n.y} L ${x + w - k} ${y + h} L ${x} ${y + h} Z`,
        fill, stroke, 'stroke-width': 1.5, class: 'dg-shape'
      }, g);
      textBlock(g, n.x - k / 3, n.y, n.label, { maxChars: Math.max(12, Math.round(w / 7.4)) });
    } else if (n.kind === 'junction') {
      el('circle', { cx: n.x, cy: n.y, r: 7, fill: n.or ? '#fff' : INK, stroke: INK, 'stroke-width': 1.5, class: 'dg-shape' }, g);
      if (n.label) textBlock(g, n.x, n.y - 16, n.label, { size: 11, weight: 600 });
    } else {
      el('rect', {
        x, y, width: w, height: h,
        rx: behav ? 12 : 0,
        fill, stroke, 'stroke-width': 1.5, class: 'dg-shape'
      }, g);
      if (n.kind === 'object' || n.kind === 'dataObject') {
        el('line', { x1: x, y1: y + 12, x2: x + w, y2: y + 12, stroke, 'stroke-width': 1.3 }, g);
      }
      icon(g, n.kind === 'dataObject' ? null : n.kind, x + w - 4, y + 2);
      const cap = n.sub ? n.label + ' ' : n.label;
      textBlock(g, n.x, n.y + (n.container ? 0 : 2), cap, { maxChars: Math.max(12, Math.round(w / 7)), weight: n.container ? 600 : 500 });
    }
    if (n.sub) {
      textBlock(g, n.x, n.y + 14, '(' + n.sub + ')', { size: 10.5, fill: '#6b6b60', maxChars: Math.round(w / 6) });
    }
    return g;
  }

  function drawContainer(gLayer, n) {
    // grand conteneur (processus englobant, rôle englobant…)
    const g = el('g', { class: 'dg-node', 'data-id': n.id || '' }, gLayer);
    const L = LAYERS[n.layer || 'business'];
    const x = n.x, y = n.y, w = n.w, h = n.h;
    el('rect', {
      x, y, width: w, height: h,
      rx: n.rounded ? 14 : 0,
      fill: n.fill || L.fill, stroke: n.strokeCol || L.stroke, 'stroke-width': 1.5,
      class: 'dg-shape'
    }, g);
    if (n.kind) icon(g, n.kind, x + w - 4, y + 2);
    if (n.label) {
      textBlock(g, n.labelX != null ? n.labelX : x + w / 2, y + 15, n.label, {
        weight: 600, italic: n.italic, size: 12, maxChars: Math.round(w / 6.4),
        anchor: n.labelAnchor || 'middle'
      });
    }
    return g;
  }

  /* ---------- relations ---------- */
  function nodeBox(n) {
    if (n.container) return { x: n.x, y: n.y, w: n.w, h: n.h, cx: n.x + n.w / 2, cy: n.y + n.h / 2 };
    const w = n.w || 130, h = n.h || 52;
    return { x: n.x - w / 2, y: n.y - h / 2, w, h, cx: n.x, cy: n.y };
  }

  function anchor(n, side, frac) {
    const b = nodeBox(n);
    frac = frac == null ? 0.5 : frac;
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

  const REL_STYLE = {
    assignment:    { dash: null,      end: 'solid', start: 'ball' },
    realization:   { dash: '3 3',     end: 'hollow' },
    serving:       { dash: null,      end: 'open' },
    access:        { dash: '2 3',     end: 'open-small' },
    influence:     { dash: '7 4',     end: 'open' },
    triggering:    { dash: null,      end: 'solid' },
    flow:          { dash: '6 4',     end: 'solid' },
    composition:   { dash: null,      start: 'diamond-filled' },
    aggregation:   { dash: null,      start: 'diamond-open' },
    specialization:{ dash: null,      end: 'hollow' },
    association:   { dash: null }
  };

  function drawRel(gLayer, r, byId, defsId) {
    const nFrom = byId[r.from], nTo = byId[r.to];
    let pts;
    if (r.points) pts = r.points;
    else {
      const bA = nodeBox(nFrom), bB = nodeBox(nTo);
      let [sA, sB] = autoSides(bA, bB);
      if (r.fromSide) sA = r.fromSide;
      if (r.toSide) sB = r.toSide;
      const p0 = anchor(nFrom, sA, r.fromFrac);
      const pn = anchor(nTo, sB, r.toFrac);
      pts = [p0];
      if (r.via) r.via.forEach(p => pts.push(p));
      else {
        const horizA = sA === 'l' || sA === 'r', horizB = sB === 'l' || sB === 'r';
        if (horizA && horizB && Math.abs(p0[1] - pn[1]) > 2) {
          const mx = (p0[0] + pn[0]) / 2; pts.push([mx, p0[1]], [mx, pn[1]]);
        } else if (!horizA && !horizB && Math.abs(p0[0] - pn[0]) > 2) {
          const my = (p0[1] + pn[1]) / 2; pts.push([p0[0], my], [pn[0], my]);
        } else if (horizA && !horizB) pts.push([pn[0], p0[1]]);
        else if (!horizA && horizB) pts.push([p0[0], pn[1]]);
      }
      pts.push(pn);
    }

    const style = REL_STYLE[r.type] || {};
    const g = el('g', { class: 'dg-flow', 'data-id': r.id || '' }, gLayer);
    const d = pts.map((p, i) => (i === 0 ? 'M' : 'L') + ' ' + p[0] + ' ' + p[1]).join(' ');
    const path = el('path', { d, fill: 'none', stroke: r.stroke || INK, 'stroke-width': r.width || 1.5, class: 'dg-flow-path' }, g);
    if (style.dash) path.setAttribute('stroke-dasharray', style.dash);
    if (style.end) path.setAttribute('marker-end', `url(#${defsId}-${style.end})`);
    if (style.start) path.setAttribute('marker-start', `url(#${defsId}-${style.start})`);
    if (r.label) {
      const mid = pts[r.labelAt != null ? r.labelAt : Math.floor((pts.length - 1) / 2)];
      const lx = r.lx != null ? r.lx : (mid[0] + pts[Math.min(r.labelAt != null ? r.labelAt + 1 : 1, pts.length - 1)][0]) / 2;
      const ly = r.ly != null ? r.ly : (mid[1] + pts[Math.min(r.labelAt != null ? r.labelAt + 1 : 1, pts.length - 1)][1]) / 2 - 8;
      textBlock(g, lx, ly, r.label, { size: 10.5, fill: '#5a5a52', maxChars: 26 });
    }
    return { g, path, pts };
  }

  /* ---------- rendu ---------- */
  function render(container, spec, opts) {
    opts = opts || {};
    const defsId = 'am' + (++uid);
    const svg = el('svg', {
      viewBox: `0 0 ${spec.w} ${spec.h}`, width: spec.w,
      role: 'img', 'aria-label': opts.alt || 'Diagramme ArchiMate',
      style: 'font-family: system-ui, sans-serif; max-width:none;'
    });
    const defs = el('defs', {}, svg);
    const mk = (id, w, h, refX, refY) => el('marker', { id: defsId + '-' + id, markerWidth: w, markerHeight: h, refX, refY, orient: 'auto' }, defs);
    let m = mk('solid', 11, 9, 9.5, 4.5); el('path', { d: 'M 0 0 L 10 4.5 L 0 9 Z', fill: INK }, m);
    m = mk('open', 12, 11, 10.5, 5.5); el('path', { d: 'M 1 1 L 11 5.5 L 1 10', fill: 'none', stroke: INK, 'stroke-width': 1.3 }, m);
    m = mk('open-small', 9, 9, 7.5, 4.5); el('path', { d: 'M 1 1 L 8 4.5 L 1 8', fill: 'none', stroke: INK, 'stroke-width': 1.2 }, m);
    m = mk('hollow', 13, 11, 12, 5.5); el('path', { d: 'M 1 1 L 12 5.5 L 1 10 Z', fill: '#fff', stroke: INK, 'stroke-width': 1.2 }, m);
    m = mk('ball', 8, 8, 3.5, 4); el('circle', { cx: 4, cy: 4, r: 3, fill: INK }, m);
    m = mk('diamond-filled', 16, 10, 1, 5); el('path', { d: 'M 1 5 L 8 1 L 15 5 L 8 9 Z', fill: INK }, m);
    m = mk('diamond-open', 16, 10, 1, 5); el('path', { d: 'M 1 5 L 8 1 L 15 5 L 8 9 Z', fill: '#fff', stroke: INK, 'stroke-width': 1.2 }, m);

    el('rect', { x: 0, y: 0, width: spec.w, height: spec.h, fill: '#fefefc' }, svg);

    const gContainers = el('g', {}, svg);
    const gRels = el('g', {}, svg);
    const gNodes = el('g', {}, svg);

    const byId = {};
    (spec.nodes || []).forEach(n => { if (n.id) byId[n.id] = n; });

    const nodeEls = {};
    // conteneurs d'abord (dessous)
    (spec.nodes || []).filter(n => n.container).forEach(n => { nodeEls[n.id] = drawContainer(gContainers, n); });

    const relApis = {};
    (spec.rels || []).forEach(r => { relApis[r.id || (r.from + '->' + r.to)] = drawRel(gRels, r, byId, defsId); });

    (spec.nodes || []).filter(n => !n.container).forEach(n => {
      if (n.kind === 'label') {
        const g = el('g', { class: 'dg-node', 'data-id': n.id || '' }, gNodes);
        textBlock(g, n.x, n.y, n.label, { size: n.size || 11.5, weight: n.weight || 500, italic: n.italic, fill: n.fill || '#6b6b60', anchor: n.anchorT || 'middle', maxChars: n.lw || 40 });
        if (n.id) nodeEls[n.id] = g;
      } else {
        nodeEls[n.id || '_' + Math.random()] = drawNode(gNodes, n);
      }
    });

    container.appendChild(svg);

    return {
      svg, spec,
      nodeEl: id => nodeEls[id],
      rel: id => relApis[id],
      classify(id, cls, on) {
        const t = nodeEls[id] || (relApis[id] && relApis[id].g);
        if (t) t.classList.toggle(cls, on !== false);
      },
      clearClasses(cls) { svg.querySelectorAll('.' + cls).forEach(e => e.classList.remove(cls)); },
      setHidden(ids, hidden) {
        ids.forEach(id => {
          const t = nodeEls[id] || (relApis[id] && relApis[id].g);
          if (t) t.classList.toggle('dg-hidden', hidden);
        });
      },
      onTargetClick(ids, cb) {
        ids.forEach(id => {
          const t = nodeEls[id] || (relApis[id] && relApis[id].g);
          if (!t) return;
          t.classList.add('dg-clickable');
          t.setAttribute('tabindex', '0');
          t.setAttribute('role', 'button');
          if (t.classList.contains('dg-flow')) {
            // zone de clic élargie pour les relations
            const p = t.querySelector('.dg-flow-path');
            const hit = p.cloneNode();
            hit.setAttribute('stroke', 'transparent');
            hit.setAttribute('stroke-width', 14);
            hit.removeAttribute('marker-end'); hit.removeAttribute('marker-start');
            hit.removeAttribute('stroke-dasharray');
            hit.classList.remove('dg-flow-path');
            t.appendChild(hit);
          }
          const h = () => cb(id, t);
          t.addEventListener('click', h);
          t.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); h(); } });
        });
      }
    };
  }

  return { render, el, LAYERS, INK, icon, textBlock };
})();
