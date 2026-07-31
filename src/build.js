/* Canonical rebuild: shells + data + verses -> built apps, count tokens filled. */
const fs = require('fs');
const cp = require('child_process');
const P = f => __dirname + '/' + f;
const BASE = 'https://masonwallace.github.io/challenging-beliefs/';

function ogMeta(m) {
  return '<meta name="viewport" content="width=device-width,initial-scale=1">\n' +
    '<meta property="og:type" content="website">\n' +
    '<meta property="og:site_name" content="Challenging Beliefs">\n' +
    '<meta property="og:title" content="' + m.title + '">\n' +
    '<meta property="og:description" content="' + m.desc + '">\n' +
    '<meta property="og:url" content="' + m.url + '">\n' +
    '<meta property="og:image" content="' + m.img + '">\n' +
    '<meta name="twitter:card" content="summary_large_image">\n' +
    '<meta name="description" content="' + m.desc + '">\n';
}
function wrap(c, m) {
  return '<!doctype html>\n<html lang="en" data-theme="dark">\n<head>\n<meta charset="utf-8">\n' + (m ? ogMeta(m) : '') +
    c.replace('<div class="app">', '</head>\n<body>\n<div class="app">') + '\n</body>\n</html>\n';
}
function syntaxCheck(html, name) {
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  scripts.forEach((s, i) => {
    fs.writeFileSync('/tmp/chk.js', s);
    try { cp.execSync('node --check /tmp/chk.js', { stdio: 'pipe' }); }
    catch (e) { console.error('SYNTAX FAIL', name, 'script', i, e.stderr.toString().slice(0, 500)); process.exit(1); }
  });
}

/* every section: how to build it, and how it appears on the landing page */
const SECTIONS = [
  {
    key: 'mormon', shell: 'study.html', out: 'index.html', dir: 'mormonism/', verses: 'verses.json',
    dataFrom: 'inline', glyph: '📖', name: 'Mormonism', group: 'examine',
    blurb: "The Book of Mormon and LDS teaching, weighed — largely from the church's own sources.",
    og: { title: 'Mormonism vs. the Bible — Challenging Beliefs', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Book%20of%20Mormon%201830%20edition%20reprint.jpg?width=1200' }
  },
  {
    key: 'islam', shell: 'islam.html', out: 'islam-built.html', dir: 'islam/', verses: 'verses-islam.json',
    dataFrom: 'islam-data.json', glyph: '☪️', name: 'Islam', group: 'examine',
    blurb: "The Quran's claims about Jesus and the Bible — with scripted conversations for every case.",
    og: { title: 'Islam vs. the Bible — Challenging Beliefs', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Samarkand%20Kufic%20Quran%2C%201905%20(2022-07-05)%2003.jpg?width=1200' }
  },
  {
    key: 'jw', shell: 'jw.html', out: 'jw-built.html', dir: 'jw/', verses: 'verses-jw.json',
    dataFrom: 'jw-data.built.json', glyph: '🚪', name: "Jehovah's Witnesses", group: 'examine',
    blurb: '607, 1914, and the New World Translation — the chain every other doctrine hangs from.',
    og: { title: "Jehovah's Witnesses vs. the Bible — Challenging Beliefs", img: 'https://commons.wikimedia.org/wiki/Special:FilePath/The%20Great%20Isaiah%20Scroll%20MS%20A%20(1QIsa)%20-%20Google%20Art%20Project.jpg?width=1200' }
  },
  {
    key: 'bhi', shell: 'bhi.html', out: 'bhi-built.html', dir: 'hebrew-israelites/', verses: 'verses-bhi.json',
    dataFrom: 'bhi-data.built.json', glyph: '🦁', name: 'Hebrew Israelites', group: 'examine',
    blurb: 'Deuteronomy 28, the 12 Tribes Chart, and a grievance that has to be answered before it is corrected.',
    og: { title: 'Hebrew Israelites vs. the Bible — Challenging Beliefs', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/The%20Great%20Isaiah%20Scroll%20MS%20A%20(1QIsa)%20-%20Google%20Art%20Project.jpg?width=1200' }
  },
  {
    key: 'messiah', shell: 'messiah.html', out: 'messiah-built.html', dir: 'messiah/', verses: 'verses-messiah.json',
    dataFrom: 'messiah-data.built.json', glyph: '🕎', name: 'The Messiah Case', group: 'make',
    blurb: 'For Jewish friends — the case from the Tanakh, the Targum and the Talmud, and the history to name first.',
    og: { title: 'The Messiah Case — from the Tanakh | Challenging Beliefs', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/The%20Great%20Isaiah%20Scroll%20MS%20A%20(1QIsa)%20-%20Google%20Art%20Project.jpg?width=1200' }
  },
  {
    key: 'god', shell: 'god.html', out: 'god-built.html', dir: 'god/', verses: 'verses-god.json',
    dataFrom: 'god-data.built.json', glyph: '🌌', name: 'The Case for God', group: 'make',
    blurb: 'For skeptics — the evidence, argued from sources that do not want the conclusion, and the arguments to retire.',
    og: { title: 'The Case for God — for skeptics | Challenging Beliefs', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hubble%20ultra%20deep%20field%20high%20rez%20edit1.jpg?width=1200' }
  }
];

const counts = {};
for (const s of SECTIONS) {
  let arr, dataStr;
  if (s.dataFrom === 'inline') {
    dataStr = fs.readFileSync(P(s.out), 'utf8').match(/const DATA=\[([\s\S]*?)\n\];/)[1];
    arr = JSON.parse('[' + dataStr + ']');
  } else {
    arr = JSON.parse(fs.readFileSync(P(s.dataFrom), 'utf8'));
    dataStr = arr.map(e => JSON.stringify(e)).join(',\n');
  }
  counts[s.key] = arr.length;
  let html = fs.readFileSync(P(s.shell), 'utf8')
    .replace('/*__DATA__*/', () => dataStr)
    .replace('/*__VERSES__*/', () => fs.readFileSync(P(s.verses), 'utf8'))
    .replace(/__N__/g, arr.length);
  html = wrap(html, {
    title: s.og.title,
    desc: arr.length + ' documented cases — verdicts, sources, and scripted conversations for every one.',
    url: BASE + s.dir, img: s.og.img
  });
  syntaxCheck(html, s.key);
  fs.writeFileSync(P(s.out), html);
  console.log(s.key.padEnd(8), arr.length, 'cases →', s.out);
}

/* ---------- landing page cards ---------- */
const card = (s, d) => `    <a class="card rise ${d}" href="${s.dir}">
      <span class="glyph">${s.glyph}</span><br>
      <span class="tag live">Live · ${counts[s.key]} claims</span>
      <h2>${s.name}</h2>
      <p>${s.blurb}</p>
      <span class="go">${s.group === 'examine' ? 'Enter the examination' : 'Open the case'}</span>
    </a>`;
const examine = SECTIONS.filter(s => s.group === 'examine').map((s, i) => card(s, 'd' + Math.min(5, i + 1))).join('\n');
const make = SECTIONS.filter(s => s.group === 'make').map((s, i) => card(s, 'd' + Math.min(5, i + 4))).join('\n');
const total = Object.values(counts).reduce((a, b) => a + b, 0);

let g = fs.readFileSync(P('landing.html'), 'utf8');
const block = `<main><div class="wrap">
  <h3 class="secttl rise d3">Examining other faiths <span>against the Bible</span></h3>
  <div class="cards">
${examine}
  </div>

  <h3 class="secttl rise d4">Making the case <span>where the Bible isn't shared ground yet</span></h3>
  <div class="cards">
${make}
  </div>

  <a class="aboutbar rise d5" href="parallels.html"><span class="ab-t">🔗 The same pattern, again and again</span><span class="ab-d">One angel, one man, no witnesses — the structures these movements share, and the one test that applies evenly to all of them.</span><span class="go">Read →</span></a>
  <a class="aboutbar rise d5" href="about.html"><span class="ab-t">📖 About this site</span><span class="ab-d">Our method, the four verdict tiers, and how to use the examinations — read this first.</span><span class="go">Read →</span></a>
</div></main>`;
g = g.replace(/<main>[\s\S]*?<\/main>/, () => block);
if (!g.includes('.secttl{')) {
  g = g.replace('</style>', `  .secttl{font-family:var(--serif);font-weight:500;font-size:1.15rem;color:var(--ink);margin:34px 0 14px;letter-spacing:.01em}
  .secttl:first-of-type{margin-top:6px}
  .secttl span{color:var(--dim);font-size:.86rem;font-family:var(--sans);font-style:normal}
  .aboutbar+.aboutbar{margin-top:12px}
</style>`);
}
const desc = `${total} documented cases across ${SECTIONS.length} sections — examined against the Bible, with honest verdicts and scripted conversations.`;
g = g.replace(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="' + desc + '">')
  .replace(/<meta name="description" content="Faith claims, examined against the Bible — [^"]*">/, '<meta name="description" content="' + desc + '">');
fs.writeFileSync(P('landing.html'), g);
console.log('landing: ' + SECTIONS.length + ' cards, ' + total + ' total cases');
