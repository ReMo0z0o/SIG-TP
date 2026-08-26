/* ==========================================================================
   Paginateur — distribue les blocs du #flow dans des pages A4 explicites.
   Chaque .page devient exactement une page du PDF (@page margin:0).
   Attributs reconnus sur les blocs de premier niveau :
     data-alone="1"   le bloc occupe seul une page entière (couverture)
     data-cls="…"     classes ajoutées à la page créée
     data-break="1"   force une nouvelle page avant ce bloc
     data-part="…"    change le titre courant affiché en pied de page
     class="keep"     ne pas laisser ce bloc seul en bas de page :
                      il descend avec le bloc suivant
   ========================================================================== */
(function () {
  function run() {
    var flow = document.getElementById('flow');
    var book = document.getElementById('book');
    var blocks = [].slice.call(flow.children);
    var pageNo = 0, curPart = '', page = null, body = null, maxH = 0;
    var warnings = [];
    /* garde-fou : aucun contenu ne doit disparaître pendant la pagination */
    var srcLen = flow.textContent.replace(/\s+/g, '').length;

    function newPage(cls) {
      pageNo++;
      page = document.createElement('div');
      page.className = 'page' + (cls ? ' ' + cls : '');
      page.setAttribute('data-page', pageNo);
      page.innerHTML =
        '<div class="page-body"></div>' +
        '<div class="page-foot"><span class="pf-part"></span>' +
        '<span class="pf-num">' + pageNo + '</span></div>';
      book.appendChild(page);
      body = page.querySelector('.page-body');
      maxH = body.clientHeight;
      page.querySelector('.pf-part').textContent = curPart;
      return page;
    }

    function overflows() { return body.scrollHeight > maxH + 1; }

    /* Un tableau trop haut se poursuit sur la page suivante, en-tête répétée,
       plutôt que de basculer en entier et de laisser une demi-page vide. */
    function splitTable(tbl, minRows) {
      var tb = tbl.tBodies[0];
      if (!tb) return null;
      var rows = [].slice.call(tb.rows);
      var hasHead = rows[0] && rows[0].querySelector('th');
      var first = hasHead ? 1 : 0;
      if (tb.rows.length - first < 2) return null;   // rien à couper
      var moved = [];
      while (overflows() && tb.rows.length - first > minRows) {
        moved.unshift(tb.rows[tb.rows.length - 1]);
        tb.deleteRow(tb.rows.length - 1);
      }
      if (!moved.length || overflows()) {            // échec : on remet les lignes
        moved.forEach(function (r) { tb.appendChild(r); });
        return null;
      }
      var cont = tbl.cloneNode(false);
      var cb = document.createElement('tbody');
      cont.appendChild(cb);
      if (hasHead) cb.appendChild(rows[0].cloneNode(true));
      moved.forEach(function (r) { cb.appendChild(r); });
      var cap = tbl.querySelector('caption');
      if (cap) {
        var c2 = document.createElement('caption');
        c2.textContent = cap.textContent + ' (suite)';
        cont.insertBefore(c2, cont.firstChild);
      }
      return cont;
    }

    var queue = blocks.slice();
    while (queue.length) {
      var b = queue.shift();
      if (b.dataset && b.dataset.part) curPart = b.dataset.part;

      if (b.dataset && b.dataset.alone === '1') {
        newPage(b.dataset.cls || '');
        body.appendChild(b);
        page = null;                       // le bloc suivant ouvrira une page
        continue;
      }
      if (!page || (b.dataset && b.dataset.break === '1' && body.children.length)) newPage();

      body.appendChild(b);
      if (!overflows()) continue;

      var alone = body.children.length === 1;

      /* tableau : on le coupe en gardant le début sur cette page.
         Seul sur sa page, on descend jusqu'à une ligne — sinon on en garde deux. */
      if (b.tagName === 'TABLE') {
        var cont = splitTable(b, alone ? 1 : 2);
        if (cont) { queue.unshift(cont); continue; }
      }

      if (alone) {                                   // bloc plus haut qu'une page
        warnings.push((b.className || b.tagName) + ' — ' +
          (b.textContent || '').replace(/\s+/g, ' ').slice(0, 60));
        continue;
      }

      /* sinon on reporte le bloc, avec les titres qui le précèdent */
      body.removeChild(b);
      var carry = [b];
      while (body.lastElementChild && body.lastElementChild.classList.contains('keep')) {
        carry.unshift(body.removeChild(body.lastElementChild));
      }
      newPage();
      carry.forEach(function (c) { body.appendChild(c); });
      if (overflows()) {
        if (b.tagName === 'TABLE') {
          var cont2 = splitTable(b, 1);
          if (cont2) { queue.unshift(cont2); continue; }
        }
        warnings.push((b.className || b.tagName) + ' — ' +
          (b.textContent || '').replace(/\s+/g, ' ').slice(0, 60));
      }
    }

    /* total de pages dans chaque pied de page */
    var total = pageNo;
    [].forEach.call(document.querySelectorAll('.pf-num'), function (el) {
      el.textContent = el.textContent + ' / ' + total;
    });

    /* numéros de page du sommaire */
    [].forEach.call(document.querySelectorAll('[data-toc]'), function (row) {
      var target = document.getElementById(row.getAttribute('data-toc'));
      var slot = row.querySelector('.tr-page, .tp-page');
      if (!target || !slot) return;
      var p = target.closest('.page');
      slot.textContent = p ? p.getAttribute('data-page') : '—';
    });

    var outLen = book.textContent.replace(/\s+/g, '').length;
    flow.remove();
    window.__info = { pages: total, warnings: warnings, srcLen: srcLen, outLen: outLen };
    window.__paginated = true;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
