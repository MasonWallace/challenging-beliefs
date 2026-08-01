/* Readability gate. Plain: grade <=7.9, avg sentence <=14, max 25.
   Full : grade <=10.9, avg sentence <=20, max 35. Reports drift; never silently passes. */
const grade = require('./grade.js');
/* A 40-word sentence from the King James Bible is not our prose being unclear.
   Measure the writing, not the quotations — but count how much we lean on them. */
const S = require('./strip.js');
const stripQuotes = t => S.measurable(t);
const quoteShare = t => S.quoteShare(S.stripTags(t));
const LIMITS = { plain: { g: 7.9, avg: 14, max: 25 }, full: { g: 10.9, avg: 20, max: 35 } };
module.exports = function gate(arr, label) {
  const rows = { plain: [], full: [] };
  const fails = [];
  for (const d of arr) {
    if (d.plain && d.plain.length) {
      const t = d.plain.map(b => b.d).join(' ');
      const r = grade(stripQuotes(t)); r.q = quoteShare(t); rows.plain.push(r);
      const L = LIMITS.plain;
      if (r.grade > L.g || r.wps > L.avg || r.longest > L.max)
        fails.push(['plain', d.id, r.grade, r.wps, r.longest]);
    }
    if (d.rewritten) {
      const t = [d.claim, d.response, d.rationale].filter(Boolean).join(' ');
      const r = grade(stripQuotes(t)); r.q = quoteShare(t); rows.full.push(r);
      const L = LIMITS.full;
      if (r.grade > L.g || r.wps > L.avg || r.longest > L.max)
        fails.push(['full', d.id, r.grade, r.wps, r.longest]);
    }
  }
  const avg = a => a.length ? (a.reduce((s, c) => s + c.grade, 0) / a.length).toFixed(1) : '—';
  const worst = a => a.length ? Math.max(...a.map(c => c.longest)) : '—';
  console.log('  readability ' + label.padEnd(8) +
    ' plain ' + String(rows.plain.length).padStart(3) + ' cases g' + String(avg(rows.plain)).padStart(5) + ' longest ' + String(worst(rows.plain)).padStart(3) +
    ' | full ' + String(rows.full.length).padStart(3) + ' cases g' + String(avg(rows.full)).padStart(5) + ' longest ' + String(worst(rows.full)).padStart(3) +
    (rows.full.length ? '  quoted ' + Math.round(100*rows.full.reduce((a,c)=>a+(c.q||0),0)/rows.full.length) + '%' : '') +
    (fails.length ? '   ⚠ ' + fails.length + ' over limit' : '   ✓'));
  fails.slice(0, 6).forEach(f => console.log('      ' + f[0] + ' ' + f[1] + ' — grade ' + f[2] + ', avg ' + f[3] + 'w, longest ' + f[4] + 'w'));
  return fails;
};
