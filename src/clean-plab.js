/* Four generations of patches each added their own .plab colour rules, the last
   with !important. Delete the dead ones; the k- block is the only source now. */
const fs=require('fs'),P=f=>__dirname+'/'+f;
const DEAD=[
`  .pblk .plab{color:var(--gold)}
  .pblk .plab.k-them{color:var(--red) !important}
  .pblk .plab.k-text{color:var(--amber) !important}
  .pblk .plab.k-strength{color:var(--purp) !important}
  .pblk .plab.k-help{color:var(--gold) !important}
  .pblk .plab.k-plain{color:var(--muted) !important}
  .pblk .plab.k-say{color:var(--green) !important}
`,
`  .pblk .plab.k-plain{color:var(--purp) !important}
`,
`  .pblk:nth-child(1) .plab{color:var(--red)}
  .pblk:nth-child(3) .plab{color:var(--amber)}
  .pblk:nth-child(4) .plab{color:var(--gold)}
`];
for(const f of ['study.html','islam.html']){
  let s=fs.readFileSync(P(f),'utf8'),n=0;
  for(const d of DEAD){ if(s.includes(d)){s=s.split(d).join('');n++} }
  /* the original .plab declaration is superseded by the k- block; drop its colour only */
  s=s.replace('.pblk .plab{font-size:.63rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;margin-bottom:6px;color:var(--acc)}',
              '.pblk .plab{font-weight:700;text-transform:uppercase}');
  fs.writeFileSync(P(f),s);
  console.log(f+': removed '+n+' dead rule blocks');
}
