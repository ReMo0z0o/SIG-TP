/* ============================================================
   QUIZ — moteur d'exercices interactifs
   QCM, tableaux Oui/Non, chasse aux erreurs sur diagramme,
   solutions guidées pas-à-pas, questions ouvertes auto-évaluées.
   Chaque widget remonte un score (0..1) dans Progress.
   ============================================================ */
window.QUIZ = (function () {

  function h(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function report(id, score) {
    if (id && window.Progress) window.Progress.set(id, score);
  }

  const LETTERS = 'ABCDEFGH';

  /* ---------- QCM (choix unique ou multiple) ---------- */
  function qcm(container, spec) {
    const block = h('div', 'q-block');
    block.appendChild(h('div', 'q-text', spec.question));
    if (spec.note) block.appendChild(h('p', 'q-note', spec.note));
    const opts = h('div', 'q-opts');
    const state = new Set();
    const btns = [];

    spec.options.forEach((o, i) => {
      const b = h('button', 'q-opt');
      b.type = 'button';
      b.appendChild(h('span', 'q-letter', LETTERS[i]));
      const body = h('span', '', o.t);
      body.style.flex = '1';
      b.appendChild(body);
      b.addEventListener('click', () => {
        if (block.dataset.done) return;
        if (spec.multi) {
          state.has(i) ? state.delete(i) : state.add(i);
          b.classList.toggle('sel', state.has(i));
        } else {
          state.clear(); state.add(i);
          btns.forEach(x => x.classList.remove('sel'));
          b.classList.add('sel');
        }
        check.disabled = state.size === 0;
      });
      btns.push(b);
      opts.appendChild(b);
    });
    block.appendChild(opts);

    const fb = h('div', 'q-feedback');
    const row = h('div', 'btn-row');
    const check = h('button', 'btn btn-primary', 'Vérifier');
    check.type = 'button';
    check.disabled = true;
    row.appendChild(check);
    block.appendChild(row);
    block.appendChild(fb);

    check.addEventListener('click', () => {
      block.dataset.done = '1';
      let good = 0, total = 0;
      spec.options.forEach((o, i) => {
        btns[i].disabled = true;
        const chosen = state.has(i);
        if (o.ok) {
          total++;
          if (chosen) { btns[i].classList.add('correct'); good++; }
          else btns[i].classList.add('missed');
        } else if (chosen) {
          btns[i].classList.add('wrong'); total++;
        }
        if (o.why && (chosen || o.ok)) {
          const w = h('div', 'q-why', o.why);
          btns[i].insertAdjacentElement('afterend', w);
        }
      });
      const perfect = spec.options.every((o, i) => !!o.ok === state.has(i));
      fb.classList.add('show', perfect ? 'good' : 'bad');
      fb.innerHTML = (perfect ? '✓ Correct !' : '✗ Pas tout à fait.') +
        (spec.explain ? `<div class="q-exp">${spec.explain}</div>` : '');
      check.remove();
      report(spec.id, perfect ? 1 : 0);
      if (spec.onDone) spec.onDone(perfect);
    });

    container.appendChild(block);
    return block;
  }

  /* ---------- tableau Oui/Non (plusieurs colonnes) ---------- */
  function tfTable(container, spec) {
    const block = h('div', 'q-block');
    if (spec.question) block.appendChild(h('div', 'q-text', spec.question));
    const scroll = h('div', 'table-scroll');
    const table = h('table', 'tf-table');
    const thead = h('thead');
    const tr0 = h('tr');
    tr0.appendChild(h('th', '', spec.rowHeader || ''));
    spec.columns.forEach(c => tr0.appendChild(h('th', '', c)));
    thead.appendChild(tr0);
    table.appendChild(thead);

    const choices = spec.choices || ['Oui', 'Non'];
    const state = spec.rows.map(() => spec.columns.map(() => null));
    const segs = [];

    const tbody = h('tbody');
    spec.rows.forEach((r, ri) => {
      const tr = h('tr');
      tr.appendChild(h('td', '', r.label));
      segs[ri] = [];
      spec.columns.forEach((c, ci) => {
        const td = h('td');
        const seg = h('span', 'tf-seg');
        choices.forEach(ch => {
          const b = h('button', '', ch);
          b.type = 'button';
          b.addEventListener('click', () => {
            if (block.dataset.done) return;
            state[ri][ci] = ch;
            seg.querySelectorAll('button').forEach(x => x.classList.remove('sel'));
            b.classList.add('sel');
            check.disabled = !state.every(row => row.every(v => v !== null));
          });
          seg.appendChild(b);
        });
        segs[ri][ci] = seg;
        td.appendChild(seg);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    scroll.appendChild(table);
    block.appendChild(scroll);

    const fb = h('div', 'q-feedback');
    const row = h('div', 'btn-row');
    const check = h('button', 'btn btn-primary', 'Vérifier mes réponses');
    check.type = 'button';
    check.disabled = true;
    row.appendChild(check);
    block.appendChild(row);
    block.appendChild(fb);

    check.addEventListener('click', () => {
      block.dataset.done = '1';
      let good = 0, total = 0;
      spec.rows.forEach((r, ri) => {
        spec.columns.forEach((c, ci) => {
          total++;
          const expected = r.answers[ci];
          const ok = state[ri][ci] === expected;
          if (ok) good++;
          segs[ri][ci].classList.add(ok ? 'reveal-good' : 'reveal-bad');
          if (!ok) {
            // affiche la bonne réponse
            segs[ri][ci].querySelectorAll('button').forEach(b => {
              if (b.textContent === expected) { b.classList.add('sel'); b.style.background = 'var(--ok)'; b.style.color = '#fff'; }
            });
          }
          segs[ri][ci].querySelectorAll('button').forEach(b => b.disabled = true);
        });
      });
      const score = good / total;
      fb.classList.add('show', score === 1 ? 'good' : 'bad');
      fb.innerHTML = `${good}/${total} réponses correctes.` +
        (spec.explain ? `<div class="q-exp">${spec.explain}</div>` : '');
      check.remove();
      report(spec.id, score);
      if (spec.onDone) spec.onDone(score);
    });

    container.appendChild(block);
    return block;
  }

  /* ---------- chasse aux erreurs sur un diagramme ---------- */
  /* api : rendu BPMN/ARCHI ; targets : {id: explication} ; decoys : [{id, why}] */
  function hotspot(container, spec) {
    const block = h('div', 'q-block');
    const targetIds = Object.keys(spec.targets);
    block.appendChild(h('div', 'q-text', spec.question ||
      `Cliquez sur les <b>${targetIds.length} éléments erronés</b> du diagramme, puis validez.`));

    const status = h('div', 'pill-row');
    const counter = h('span', 'tag tag-info', `0 / ${targetIds.length} sélectionné(s)`);
    status.appendChild(counter);
    block.appendChild(status);

    const selected = new Set();
    const clickable = targetIds.concat((spec.decoys || []).map(d => d.id));
    const clicker = spec.api.onNodeClick || spec.api.onTargetClick;
    clicker.call(spec.api, clickable, (id, g) => {
      if (block.dataset.done) return;
      if (selected.has(id)) { selected.delete(id); g.classList.remove('dg-selected'); }
      else { selected.add(id); g.classList.add('dg-selected'); }
      counter.textContent = `${selected.size} / ${targetIds.length} sélectionné(s)`;
      check.disabled = selected.size === 0;
    });

    const fb = h('div', 'q-feedback');
    const list = h('div');
    const row = h('div', 'btn-row');
    const check = h('button', 'btn btn-primary', 'Valider ma sélection');
    check.type = 'button';
    check.disabled = true;
    row.appendChild(check);
    block.appendChild(row);
    block.appendChild(fb);
    block.appendChild(list);

    check.addEventListener('click', () => {
      block.dataset.done = '1';
      let good = 0;
      targetIds.forEach(id => {
        const hit = selected.has(id);
        if (hit) good++;
        spec.api.classify(id, hit ? 'dg-flag-ok' : 'dg-flag-err');
        spec.api.classify(id, 'dg-selected', false);
      });
      let wrongPicks = 0;
      (spec.decoys || []).forEach(d => {
        if (selected.has(d.id)) {
          wrongPicks++;
          spec.api.classify(d.id, 'dg-flag-err');
          spec.api.classify(d.id, 'dg-selected', false);
          list.appendChild(h('div', 'callout callout-warn',
            `<span class="co-ic">✗</span><div><b>Pas une erreur.</b> ${d.why}</div>`));
        }
      });
      targetIds.forEach((id, i) => {
        const hit = selected.has(id);
        list.appendChild(h('div', 'callout ' + (hit ? 'callout-ok' : 'callout-err'),
          `<span class="co-ic">${hit ? '✓' : '!'}</span><div><b>Erreur ${i + 1}${hit ? ' — trouvée' : ' — manquée'}.</b> ${spec.targets[id]}</div>`));
      });
      const score = Math.max(0, (good - wrongPicks * 0.5)) / targetIds.length;
      fb.classList.add('show', score >= 0.999 ? 'good' : 'bad');
      fb.innerHTML = `Vous avez repéré ${good} erreur(s) sur ${targetIds.length}` +
        (wrongPicks ? ` (et ${wrongPicks} fausse(s) alerte(s)).` : '.');
      check.remove();
      report(spec.id, Math.min(1, score));
      if (spec.onDone) spec.onDone(score);
    });

    container.appendChild(block);
    return block;
  }

  /* ---------- solution guidée pas-à-pas sur un diagramme ---------- */
  /* steps : [{title, text, show: [ids]}] — les ids sont révélés cumulativement.
     Les flux non listés sont masqués automatiquement tant qu'une de leurs
     extrémités est masquée (pas de flèches flottantes). */
  function steps(container, spec) {
    const api = spec.api;
    const stepOf = {};
    spec.steps.forEach((s, k) => (s.show || []).forEach(id => { if (!(id in stepOf)) stepOf[id] = k; }));
    const nodes = (api.spec.nodes || []).filter(n => n.id);
    const edges = (api.spec.flows || api.spec.rels || []);
    function applyVisibility(i) {
      const hiddenNodes = new Set();
      nodes.forEach(n => {
        const hid = stepOf[n.id] != null && stepOf[n.id] > i;
        if (hid) hiddenNodes.add(n.id);
        api.setHidden([n.id], hid);
      });
      edges.forEach(e => {
        const key = e.id || (e.from + '->' + e.to);
        let hid;
        if (stepOf[key] != null) hid = stepOf[key] > i;
        else hid = hiddenNodes.has(e.from) || hiddenNodes.has(e.to);
        api.setHidden([key], hid);
      });
    }
    applyVisibility(0);

    const wrapEl = h('div', 'steps');
    const bar = h('div', 'steps-bar');
    const dots = spec.steps.map((s, i) => {
      const d = h('button', 'st-dot', String(i + 1));
      d.type = 'button';
      d.title = s.title;
      d.addEventListener('click', () => go(i));
      bar.appendChild(d);
      if (i < spec.steps.length - 1) bar.appendChild(h('span', 'st-line'));
      return d;
    });
    const text = h('div', 'step-text');
    const row = h('div', 'btn-row');
    const prev = h('button', 'btn', '← Précédent');
    const next = h('button', 'btn btn-primary', 'Étape suivante →');
    prev.type = next.type = 'button';
    row.appendChild(prev); row.appendChild(next);
    wrapEl.appendChild(bar); wrapEl.appendChild(text); wrapEl.appendChild(row);

    let cur = -1, maxSeen = 0;
    function go(i) {
      cur = i;
      maxSeen = Math.max(maxSeen, i);
      applyVisibility(i);
      api.clearClasses('dg-new');
      if (i > 0) (spec.steps[i].show || []).forEach(id => api.classify(id, 'dg-new'));
      const s = spec.steps[i];
      text.innerHTML = `<b>Étape ${i + 1}/${spec.steps.length} — ${s.title}.</b> ${s.text}`;
      dots.forEach((d, k) => {
        d.classList.toggle('cur', k === i);
        d.classList.toggle('seen', k < i);
      });
      prev.disabled = i === 0;
      next.textContent = i === spec.steps.length - 1 ? 'Terminé ✓' : 'Étape suivante →';
      next.disabled = false;
      if (i === spec.steps.length - 1) {
        report(spec.id, 1);
        next.disabled = true;
        api.clearClasses('dg-new');
      }
    }
    prev.addEventListener('click', () => go(Math.max(0, cur - 1)));
    next.addEventListener('click', () => go(Math.min(spec.steps.length - 1, cur + 1)));
    go(0);

    container.appendChild(wrapEl);
    return wrapEl;
  }

  /* ---------- question ouverte + réponse modèle + auto-évaluation ---------- */
  function open(container, spec) {
    const block = h('div', 'q-block open-q');
    block.appendChild(h('div', 'q-text', spec.question));
    const ta = h('textarea');
    ta.placeholder = spec.placeholder || 'Rédigez votre réponse ici avant de comparer avec la réponse modèle…';
    block.appendChild(ta);

    const row = h('div', 'btn-row');
    const reveal = h('button', 'btn btn-primary', 'Comparer avec la réponse modèle');
    reveal.type = 'button';
    row.appendChild(reveal);
    block.appendChild(row);

    const model = h('div', 'model-answer');
    model.appendChild(h('div', 'callout callout-key',
      `<span class="co-ic">✓</span><div><b>Réponse modèle</b>${spec.model}</div>`));
    block.appendChild(model);

    const self = h('div', 'self-check');
    self.appendChild(h('span', '', '<b>Auto-évaluation :</b> ma réponse couvrait…'));
    const marks = [['l’essentiel', 1], ['une partie', 0.5], ['peu / rien', 0.15]];
    marks.forEach(([label, sc]) => {
      const b = h('button', 'btn', label);
      b.type = 'button';
      b.addEventListener('click', () => {
        self.querySelectorAll('button').forEach(x => { x.classList.remove('btn-primary'); x.disabled = true; });
        b.classList.add('btn-primary');
        report(spec.id, sc);
        if (spec.onDone) spec.onDone(sc);
      });
      self.appendChild(b);
    });
    block.appendChild(self);

    reveal.addEventListener('click', () => {
      model.classList.add('show');
      self.classList.add('show');
      reveal.disabled = true;
    });

    container.appendChild(block);
    return block;
  }

  /* ---------- carte d'exercice (habillage) ---------- */
  function exo(container, spec) {
    const card = h('section', 'exo');
    card.id = spec.anchor || '';
    const head = h('div', 'exo-head');
    head.appendChild(h('span', 'tag', spec.tag || 'Exercice'));
    head.appendChild(h('h3', '', spec.title));
    if (spec.ids && spec.ids.length && window.Progress) {
      const st = h('span', 'exo-status');
      const update = () => {
        const scores = spec.ids.map(i => window.Progress.get(i)).filter(s => s != null);
        if (scores.length === spec.ids.length) {
          const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
          st.innerHTML = avg >= 0.8 ? '<span class="tag tag-ok">✓ Réussi</span>'
            : '<span class="tag tag-warn">Revu — à retravailler</span>';
        } else {
          st.innerHTML = '<span class="tag tag-neutral">À faire</span>';
        }
      };
      update();
      window.Progress.onChange(update);
      head.appendChild(st);
    }
    card.appendChild(head);
    const body = h('div', 'exo-body');
    card.appendChild(body);
    container.appendChild(card);
    return body;
  }

  return { qcm, tfTable, hotspot, steps, open, exo, h };
})();
