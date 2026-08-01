/* Blocks the classifier can't name are still separate thoughts. Rotate them
   through three hues so consecutive sections never look identical, at a lighter
   tint than the blocks whose colour actually carries meaning. */
const fs=require('fs'),P=f=>__dirname+'/'+f;
const must=(s,a,b,w)=>{if(!s.includes(a))throw new Error('MISSING '+w);return s.split(a).join(b)};

const OLDFN=`  return (d.plain||[]).map(b=>{`;
const NEWFN=`  let alt=0;
  return (d.plain||[]).map(b=>{`;
const OLDDIV=`    return \`<div class="pblk \${kind}\${b.say?" say":""}\${big}"><div class="plab \${kind}">\${esc(b.t)}</div>\${ps.join("")}</div>\`;`;
const NEWDIV=`    const cls=kind==="k-plain"?"k-plain a"+(alt++%3):kind;
    return \`<div class="pblk \${cls}\${b.say?" say":""}\${big}"><div class="plab \${cls}">\${esc(b.t)}</div>\${ps.join("")}</div>\`;`;

const ANCHOR=`  .pblk .plab.k-say{color:var(--green)}`;
const ADD=ANCHOR+`

  /* unnamed blocks rotate, so two in a row never read as one */
  .pblk.k-plain.a0{background:color-mix(in srgb,var(--gold) 5%,var(--panel2));  border-left-color:color-mix(in srgb,var(--gold) 65%,var(--line2))}
  .pblk.k-plain.a1{background:color-mix(in srgb,var(--teal) 5%,var(--panel2));  border-left-color:color-mix(in srgb,var(--teal) 65%,var(--line2))}
  .pblk.k-plain.a2{background:color-mix(in srgb,var(--amber) 5%,var(--panel2)); border-left-color:color-mix(in srgb,var(--amber) 65%,var(--line2))}
  .pblk .plab.k-plain.a0{color:var(--gold)}
  .pblk .plab.k-plain.a1{color:var(--teal)}
  .pblk .plab.k-plain.a2{color:var(--amber)}`;

const OLDSIZE=`  .pblk .plab{font-size:.8rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase;`;
const NEWSIZE=`  .pblk .plab{font-size:.86rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;`;

for(const f of ['study.html','islam.html']){
  let s=fs.readFileSync(P(f),'utf8');
  s=must(s,OLDFN,NEWFN,f+' counter');
  s=must(s,OLDDIV,NEWDIV,f+' div');
  s=must(s,ANCHOR,ADD,f+' alt css');
  s=must(s,OLDSIZE,NEWSIZE,f+' label size');
  fs.writeFileSync(P(f),s);
  console.log('patched '+f);
}
