/* Third round of reader-reported fixes:
   1. <b> and <i> written into case text were being escaped and printed literally.
   2. Defense, verdict and why-this-matters were flat white — no hierarchy at all.
   3. Plain-block headings were still white; give them explicit colour and size.
   4. Verse card smaller again, and it floats so it can't shove the page. */
const fs = require('fs');
const P = f => __dirname + '/' + f;
const check = (l, ok) => { console.log((ok ? 'OK   ' : 'FAIL ') + l); if (!ok) process.exitCode = 1; };

const CSS = `
  /* --- floating verse card: no layout shift, compact --- */
  .versepop{position:fixed;z-index:120;display:none;max-width:560px}
  .versepop.on{display:block;animation:vpop .12s ease-out}
  @keyframes vpop{from{opacity:0;transform:translateY(-3px)}to{opacity:1;transform:none}}
  .versepop .versebox{margin:0;max-height:190px;overflow-y:auto;box-shadow:0 18px 44px rgba(0,0,0,.55);
    background:var(--side,var(--panel2));border:1px solid var(--line2)}
  .claimcol .versebox,.pblk + .versebox,#versebox .versebox{max-height:190px;overflow-y:auto;margin:10px 0 14px}
  .versebox .vtext{font-size:.82rem;line-height:1.58}
  .versebox .vwhy{font-size:.74rem}

  /* --- plain-block headings: coloured and sized, no cascade fights --- */
  .pblk .plab{font-size:.74rem;letter-spacing:.1em}
  .pblk .plab.k-say{color:var(--green)}
  .pblk .plab.k-them{color:var(--red)}
  .pblk .plab.k-text{color:var(--gold)}
  .pblk .plab.k-strength{color:var(--amber)}
  .pblk .plab.k-help{color:var(--acc2)}
  .pblk .plab.k-plain{color:var(--acc)}
  .pblk.k-big p{font-size:1.02rem}

  /* --- defense / verdict / why: give the eye somewhere to land --- */
  .defense p,.vbox p,.why p{color:var(--muted)}
  .defense b,.vbox b,.why b,.claim b,.pblk p b{color:var(--ink);font-weight:600}
  .defense i,.defense em,.vbox i,.why i,.claim i,.pblk p i{color:var(--ink);opacity:.9;font-style:italic}
  .defense p:first-of-type{font-size:1.02rem;color:var(--ink);opacity:.94}
  .vbox .vb{font-size:1.02rem}
  .why .wtail{color:var(--gold);opacity:.9}
  .dsrc a{color:var(--acc);border-bottom:1px dotted color-mix(in srgb,var(--acc) 55%,transparent)}
  .dsrc a:hover{border-bottom-style:solid}
`;

for (const sh of ['study.html', 'islam.html']) {
  let s = fs.readFileSync(P(sh), 'utf8');
  if (!s.includes('.versepop{')) s = s.replace('</style>', CSS + '</style>');

  /* 1. let a safe subset of tags through everywhere, not just in plain blocks */
  const R = 'function rich(raw){return glossify(emphasize(esc(raw)));}';
  if (s.includes(R)) {
    s = s.replace(R, 'function rich(raw){return glossify(emphasize(esc(raw).replace(/&lt;(\\/?)(b|i|em|strong)&gt;/g,"<$1$2>")));}');
    console.log(sh + ' rich() now allows <b> and <i>');
  } else check(sh + ' rich() (already patched?)', s.includes('b|i|em|strong'));

  /* 2. plain headings: explicit kind, set from the heading text */
  const OLD = 'const tone=/^how strong/i.test(b.t)?" strong":/(don\'t|do not|avoid|the rule|embarrass)/i.test(b.t)?" warn":"";';
  check(sh + ' tone line', s.includes(OLD));
  s = s.replace(OLD, 'const t=b.t.toLowerCase();\n    const kind=b.say?"k-say":/^(the objection|what (you|your|people|they)|how it usually)/.test(t)?"k-them":/(verse|text|chapter|says|passage|record|promise|covenant does)/.test(t)?"k-text":/^how strong|^the rule|don\'t|do not use/.test(t)?"k-strength":/^why this|^why it|helps you/.test(t)?"k-help":"k-plain";\n    const big=/(k-text|k-say)/.test(kind)?" k-big":"";');
  const PB = 'return \`<div class="pblk\${b.say?" say":""}"><div class="plab\${tone}">\${esc(b.t)}</div>';
  check(sh + ' plain block markup', s.includes(PB));
  s = s.replace(PB, 'return \`<div class="pblk\${b.say?" say":""}\${big}"><div class="plab \${kind}">\${esc(b.t)}</div>');

  fs.writeFileSync(P(sh), s);
  console.log(sh + ' typography applied');
}
