/* Canonical rebuild: shells + data + verses -> built apps, count tokens filled. */
const fs = require('fs');
const cp = require('child_process');
const P = f => __dirname + '/' + f;

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
  console.log(name, 'syntax OK (' + scripts.length + ' scripts)');
}

/* Mormon */
const mData = fs.readFileSync(P('index.html'), 'utf8').match(/const DATA=\[([\s\S]*?)\n\];/)[1];
const mCount = JSON.parse('[' + mData + ']').length;
let m = fs.readFileSync(P('study.html'), 'utf8')
  .replace('/*__DATA__*/', () => mData)
  .replace('/*__VERSES__*/', () => fs.readFileSync(P('verses.json'), 'utf8'))
  .replace(/__N__/g, mCount);
m = wrap(m, {title:'Mormonism vs. the Bible — Challenging Beliefs', desc:mCount+' documented claims examined against the Bible — verdicts, sources, and scripted conversations for every case.', url:'https://masonwallace.github.io/challenging-beliefs/mormonism/', img:'https://commons.wikimedia.org/wiki/Special:FilePath/Book%20of%20Mormon%201830%20edition%20reprint.jpg?width=1200'});
syntaxCheck(m, 'mormon');
fs.writeFileSync(P('index.html'), m);

/* Islam */
const iArr = JSON.parse(fs.readFileSync(P('islam-data.json'), 'utf8'));
const iData = iArr.map(e => JSON.stringify(e)).join(',\n');
let isl = fs.readFileSync(P('islam.html'), 'utf8')
  .replace('/*__DATA__*/', () => iData)
  .replace('/*__VERSES__*/', () => fs.readFileSync(P('verses-islam.json'), 'utf8'))
  .replace(/__N__/g, iArr.length);
isl = wrap(isl, {title:'Islam vs. the Bible — Challenging Beliefs', desc:iArr.length+' documented claims examined against the Bible — verdicts, sources, and scripted conversations for every case.', url:'https://masonwallace.github.io/challenging-beliefs/islam/', img:'https://commons.wikimedia.org/wiki/Special:FilePath/Samarkand%20Kufic%20Quran%2C%201905%20(2022-07-05)%2003.jpg?width=1200'});
syntaxCheck(isl, 'islam');
fs.writeFileSync(P('islam-built.html'), isl);

/* Landing: live counts */
let g = fs.readFileSync(P('landing.html'), 'utf8');
const counts = [mCount, iArr.length];
let ci = 0;
g = g.replace(/Live · \d+ claims/g, () => 'Live · ' + counts[ci++] + ' claims');
fs.writeFileSync(P('landing.html'), g);
console.log('built: mormon', mCount, 'entries; islam', iArr.length, 'entries; landing counts updated');
