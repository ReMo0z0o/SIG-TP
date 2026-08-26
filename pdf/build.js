/* ==========================================================================
   Génère les PDF du cours à partir des fragments HTML de pdf/src*.
   Usage :  NODE_PATH=/opt/node22/lib/node_modules node pdf/build.js [doc] [--preview]
     doc        « synthese » (défaut) ou « theories »
     --preview  exporte aussi un PNG de chaque page dans pdf/build/<doc>/
   Les fragments sont pris dans l'ordre alphabétique du dossier source.
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = __dirname;
const BUILD = path.join(ROOT, 'build');

const DOCS = {
  synthese: {
    dir: 'src',
    out: 'Synthese-theorique-ECGEB210.pdf',
    title: "Synthèse théorique — Systèmes d'information de gestion (ECGEB210)"
  },
  theories: {
    dir: 'src-theories',
    out: 'Theories-acceptation-ECGEB210.pdf',
    title: "Les théories de l'acceptation des technologies — TRA, TAM, UTAUT, UTAUT2 (ECGEB210)"
  }
};

const DOC_NAME = process.argv.slice(2).find(a => !a.startsWith('--')) || 'synthese';
const DOC = DOCS[DOC_NAME];
if (!DOC) {
  console.error('Document inconnu : ' + DOC_NAME + ' (attendu : ' + Object.keys(DOCS).join(', ') + ')');
  process.exit(1);
}
const SRC = path.join(ROOT, DOC.dir);
const SHARED = path.join(ROOT, 'src');            // style.css et paginate.js sont partagés
const PDF_OUT = path.join(ROOT, '..', DOC.out);
const FRAGMENTS = fs.readdirSync(SRC).filter(f => f.endsWith('.html')).sort();

(async () => {
  fs.mkdirSync(BUILD, { recursive: true });

  const css = fs.readFileSync(path.join(SHARED, 'style.css'), 'utf8');
  const js = fs.readFileSync(path.join(SHARED, 'paginate.js'), 'utf8');
  const body = FRAGMENTS
    .filter(f => fs.existsSync(path.join(SRC, f)))
    .map(f => '<!-- ' + f + ' -->\n' + fs.readFileSync(path.join(SRC, f), 'utf8'))
    .join('\n');

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>${DOC.title}</title>
<style>
${css}
</style>
</head>
<body>
<div id="flow">
${body}
</div>
<div id="book"></div>
<script>
${js}
</script>
</body>
</html>`;

  const htmlPath = path.join(BUILD, DOC_NAME + '.html');
  fs.writeFileSync(htmlPath, html);

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1100, height: 1400 } });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto('file://' + htmlPath, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__paginated === true, { timeout: 30000 });
  const info = await page.evaluate(() => window.__info);

  await page.pdf({
    path: PDF_OUT,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  if (process.argv.includes('--preview')) {
    const dir = path.join(BUILD, DOC_NAME);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    const pages = await page.locator('.page').all();
    for (let i = 0; i < pages.length; i++) {
      await pages[i].screenshot({ path: path.join(dir, String(i + 1).padStart(2, '0') + '.png') });
    }
    console.log('aperçus  : ' + dir);
  }

  await browser.close();

  const kb = Math.round(fs.statSync(PDF_OUT).size / 1024);
  console.log('pages    : ' + info.pages);
  console.log('poids    : ' + kb + ' Ko');
  console.log('pdf      : ' + PDF_OUT);
  const lost = info.srcLen - info.outLen;
  console.log('contenu  : ' + (lost > 0
    ? '⚠ ' + lost + ' caractères PERDUS à la pagination'
    : 'intact (' + info.outLen + ' caractères' +
      (lost < 0 ? ', dont ' + (-lost) + ' répétés : en-têtes de tableaux continués' : '') + ')'));
  if (info.warnings.length) {
    console.log('\n⚠ blocs plus hauts qu’une page (' + info.warnings.length + ') :');
    info.warnings.forEach(w => console.log('   · ' + w));
  } else {
    console.log('débordements : aucun');
  }
  if (errs.length) console.log('\n⚠ erreurs JS : ' + errs.join(' | '));
})();
