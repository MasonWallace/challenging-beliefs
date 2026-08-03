/* Point every image at the local mirror.

   Two things this has to get right, both of which bit me on the first attempt:
   - Commons filenames contain parentheses and apostrophes, so the URL pattern
     must not treat those as delimiters (it did, and truncated 200+ URLs).
   - A URL sitting inside a single-quoted string ends with a quote that is NOT
     part of the filename, so it is trimmed and re-attached.

   The app also rewrote ?width= at runtime (160 for list thumbs, 1400 for the
   lightbox). We ship exactly two sizes, so that logic is replaced. */
const fs = require('fs'), P = f => __dirname + '/' + f;
const map = JSON.parse(fs.readFileSync(P('img-map.json'), 'utf8'));

const QUOTE = String.fromCharCode(39);
const URL_RE = /https:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath\/[^"`\\\s<>]+/g;

/* how deep each file sits relative to the site root */
const REL = {
  'study.html': '../img/', 'islam.html': '../img/',
  'make-jw.js': '../img/', 'make-bhi.js': '../img/',
  'make-messiah.js': '../img/', 'make-god.js': '../img/',
  'landing.html': 'img/', 'about-src.html': 'img/', 'parallels-src.html': 'img/'
};

let files = 0, hits = 0;
const missing = new Set();

function rewrite(txt, prefix) {
  return txt.replace(URL_RE, u => {
    const tail = u.endsWith(QUOTE) ? QUOTE : '';
    const clean = tail ? u.slice(0, -1) : u;
    const wm = clean.match(/\?width=(\d+)$/);
    const width = wm ? Number(wm[1]) : 520;
    const key = clean.replace(/\?width=\d+$/, '');
    const m = map[key];
    if (!m) { missing.add(key); return u; }
    hits++;
    return prefix + (width <= 320 ? m.s : m.m).replace(/^img\//, '') + tail;
  });
}

for (const [f, prefix] of Object.entries(REL)) {
  if (!fs.existsSync(P(f))) continue;
  const before = fs.readFileSync(P(f), 'utf8');
  let s = rewrite(before, prefix);
  /* the runtime width swaps no longer apply — both sizes are already chosen */
  s = s.replace(/\.replace\("width=520","width=160"\)/g, '.replace("-m.webp","-s.webp")');
  s = s.replace(/\.replace\("width=520","width=1400"\)/g, '');
  if (s !== before) { fs.writeFileSync(P(f), s); files++; }
}

fs.writeFileSync(P('img-missing.txt'), [...missing].join('\n'));
console.log(files + ' source files rewritten · ' + hits + ' references repointed · ' + missing.size + ' with no local copy');
