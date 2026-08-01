/* Each plain block is a distinct move in the argument. Give each kind its own
   box and its own colour so a reader can see the shape of the case at a glance.
   Fixes three things at once:
     - every label rendered purple, because an !important rule beat the k- colours
     - the classifier put 55% of blocks in one catch-all bucket
     - blocks ran together as undifferentiated prose */
const fs=require('fs'),P=f=>__dirname+'/'+f;
const must=(s,a,b,w)=>{if(!s.includes(a))throw new Error('MISSING '+w);return s.split(a).join(b)};

/* --- 1. a seventh hue, so every kind can be its own colour --- */
const DARKVARS  = '    --purp:#b394e0; --purp-bg:#2c2440;';
const DARKVARS2 = DARKVARS + '\n    --teal:#6cb6ad; --teal-bg:#16302e;';
const LIGHTVARS  = '    --purp:#6b4fa1; --purp-bg:#ece5f6;';
const LIGHTVARS2 = LIGHTVARS + '\n    --teal:#26706a; --teal-bg:#e0eeec;';

/* --- 2. a classifier that actually separates the moves --- */
const OLDKIND = `    const kind=b.say?"k-say":/^(the objection|what (you|your|people|they)|how it usually)/.test(t)?"k-them":/(verse|text|chapter|says|passage|record|promise|covenant does)/.test(t)?"k-text":/^how strong|^the rule|don't|do not use/.test(t)?"k-strength":/^why this|^why it|helps you/.test(t)?"k-help":"k-plain";`;
const NEWKIND = `    const kind=b.say?"k-say"
      :/answer,? at full strength|^their answer|^the .{2,22} answer\\b|^how (they|.*s) (answer|explain)|best (defense|answer)|at its strongest|^the (rabbinic|muslim|witness|sceptic|skeptic) (reply|answer)/.test(t)?"k-def"
      :/^how strong|^the rule\\b|^where it lands|^the verdict|don't use|do not use/.test(t)?"k-strength"
      :/^why this|^why it|helps you|^what it cost|^what to do instead|^what to say instead|^the takeaway|^why that matters/.test(t)?"k-help"
      :/runs out|problem|^why that is|^where it breaks|^what that misses|^the gap|^why it is wrong|^the trouble|^what it does not/.test(t)?"k-gap"
      :/verse|text|chapter|\\bsays\\b|passage|record|scripture|evidence|the numbers|what survives|the hadith|manuscript|papyri|inscription/.test(t)?"k-text"
      :/^the claim|^what is taught|^what (they|the book|the movement|the church|the camps) |^what happened|^how it (usually|ended|came out)|objection|^what (you|your|people)|describes|^the story|^what is at stake/.test(t)?"k-claim"
      :"k-plain";`;
const OLDBIG = `    const big=/(k-text|k-say)/.test(kind)?" k-big":"";`;
const NEWBIG = `    const big=/(k-text|k-say)/.test(kind)?" k-big":"";`;
const OLDDIV = `    return \`<div class="pblk\${b.say?" say":""}\${big}"><div class="plab \${kind}">\${esc(b.t)}</div>\${ps.join("")}</div>\`;`;
const NEWDIV = `    return \`<div class="pblk \${kind}\${b.say?" say":""}\${big}"><div class="plab \${kind}">\${esc(b.t)}</div>\${ps.join("")}</div>\`;`;

/* --- 3. the boxes. Replaces the !important block that flattened everything. --- */
const OLDCSS = `  /* --- plain-block headings are labels, not body text --- */
  .pblk .plab{color:var(--acc) !important}
  .pblk.say .plab{color:var(--green) !important}
  .pblk .plab.warn{color:var(--amber) !important}
  .pblk .plab.strong{color:var(--gold) !important}`;
const NEWCSS = `  /* --- plain blocks: one box per move in the argument, each its own colour --- */
  .pblk{padding:13px 16px 12px;border-radius:10px;border:1px solid var(--line);
    border-left:3px solid var(--line2);background:var(--panel2)}
  .pblk .plab{font-size:.8rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase;
    margin-bottom:8px;line-height:1.35;color:var(--muted)}
  .pblk p{color:var(--ink)}
  .pblk p b{color:var(--ink);font-weight:700}
  .pblk + .pblk{margin-top:12px}

  .pblk.k-claim   {background:color-mix(in srgb,var(--red) 7%,var(--panel2));   border-left-color:var(--red)}
  .pblk.k-text    {background:color-mix(in srgb,var(--gold) 7%,var(--panel2));  border-left-color:var(--gold)}
  .pblk.k-def     {background:color-mix(in srgb,var(--purp) 8%,var(--panel2));  border-left-color:var(--purp)}
  .pblk.k-gap     {background:color-mix(in srgb,var(--amber) 8%,var(--panel2)); border-left-color:var(--amber)}
  .pblk.k-strength{background:color-mix(in srgb,var(--teal) 8%,var(--panel2));  border-left-color:var(--teal)}
  .pblk.k-help    {background:var(--panel);                                     border-left-color:var(--muted)}
  .pblk.k-plain   {background:var(--panel2);                                    border-left-color:var(--line2)}

  .pblk .plab.k-claim{color:var(--red)}
  .pblk .plab.k-text{color:var(--gold)}
  .pblk .plab.k-def{color:var(--purp)}
  .pblk .plab.k-gap{color:var(--amber)}
  .pblk .plab.k-strength{color:var(--teal)}
  .pblk .plab.k-help{color:var(--ink)}
  .pblk .plab.k-plain{color:var(--muted)}
  .pblk .plab.k-say{color:var(--green)}`;

/* the later duplicate rule-set is now redundant — it only re-set colours */
const OLDLATE = `  /* --- plain-block headings: coloured and sized, no cascade fights --- */
  .pblk .plab{font-size:.74rem;letter-spacing:.1em}
  .pblk .plab.k-say{color:var(--green)}
  .pblk .plab.k-them{color:var(--red)}
  .pblk .plab.k-text{color:var(--gold)}
  .pblk .plab.k-strength{color:var(--amber)}
  .pblk .plab.k-help{color:var(--acc2)}
  .pblk .plab.k-plain{color:var(--acc)}
  .pblk.k-big p{font-size:1.02rem}`;
const NEWLATE = `  .pblk.k-big p{font-size:1.02rem}`;

for(const f of ['study.html','islam.html']){
  let s=fs.readFileSync(P(f),'utf8');
  s=must(s,DARKVARS,DARKVARS2,f+' dark vars');
  s=must(s,LIGHTVARS,LIGHTVARS2,f+' light vars');
  s=must(s,OLDKIND,NEWKIND,f+' classifier');
  s=must(s,OLDDIV,NEWDIV,f+' block div');
  s=must(s,OLDCSS,NEWCSS,f+' block css');
  s=must(s,OLDLATE,NEWLATE,f+' late css');
  fs.writeFileSync(P(f),s);
  console.log('patched '+f);
}
