/* Answered stops looking like good news · the reference list moves to Sources ·
   the Conversation tab stops implying it is about this one case. */
const fs=require('fs'),P=f=>__dirname+'/'+f;
const must=(s,a,b,w)=>{if(!s.includes(a))throw new Error('MISSING '+w);return s.split(a).join(b)};

/* --- 1. "Answered" reads as a win. It means: stop using this. --- */
const OLDV=`const VLABEL={admitted:"Admitted",unrefuted:"Unrefuted",contested:"Contested",answered:"Answered"}`;
const NEWV=`const VLABEL={admitted:"Admitted",unrefuted:"Unrefuted",contested:"Contested",answered:"Don't use"}`;
/* and it must stop being green */
const OLDC1=`.vcol.an header{border-bottom-color:var(--green)}`;
const NEWC1=`.vcol.an header{border-bottom-color:var(--dim)}`;
const OLDC2=`.vcol.an .n{color:var(--green)}`;
const NEWC2=`.vcol.an .n{color:var(--muted)}\n  .vcol.an .t{color:var(--muted)}`;

/* --- 2. the reference list belongs with the sources, not before the argument --- */
const OLDASIDE=`      <details class="vdet"><summary>`;
const NEWASIDE=`      <details class="vdet moved"><summary>`;

for(const f of ['study.html','islam.html']){
  let s=fs.readFileSync(P(f),'utf8');
  s=must(s,OLDV,NEWV,f+' vlabel');
  s=must(s,OLDC1,NEWC1,f+' an border');
  s=must(s,OLDC2,NEWC2,f+' an number');

  /* move the passages block out of the claim rail and into the Sources tab */
  const anchor='<div class="tabpane2" id="pane-src">';
  if(!s.includes(anchor))throw new Error(f+': sources pane not found');
  s=must(s,'${cimg}\n      ${passages}','${cimg}',f+' rail passages')

  fs.writeFileSync(P(f),s);
  console.log('patched '+f);
}
