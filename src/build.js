/* Canonical rebuild: shells + data + verses -> built apps, count tokens filled. */
const fs = require('fs');
const cp = require('child_process');
const P = f => __dirname + '/' + f;
const gate = require('./gate.js');
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
  gate(arr, s.key);
  syntaxCheck(html, s.key);
  fs.writeFileSync(P(s.out), html);
  console.log(s.key.padEnd(8), arr.length, 'cases →', s.out);
}

/* ---------- landing page cards ---------- */
const CARDS = SECTIONS.map(s => ({
  dir: s.dir, glyph: s.glyph, name: s.name, blurb: s.blurb, group: s.group,
  count: counts[s.key], unit: s.group === 'examine' ? 'claims' : 'cases'
}));
let g = fs.readFileSync(P('landing.html'), 'utf8');
g = g.replace(/const CARDS=\/\*__CARDS__\*\/[\s\S]*?;\n/, 'const CARDS=/*__CARDS__*/' + JSON.stringify(CARDS) + ';\n');
fs.writeFileSync(P('landing.html'), g);
const total = Object.values(counts).reduce((a, b) => a + b, 0);
console.log('landing: ' + CARDS.length + ' cards, ' + total + ' total cases');
