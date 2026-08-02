/* Rename the acts in plain English, cut the turning points to the few that earn
   it, and give each one a line saying what changed — the flag said nothing before. */
const fs=require('fs'),P=f=>__dirname+'/'+f;
const SRC={mormon:'study.html',islam:'islam.html',jw:'make-jw.js',bhi:'make-bhi.js',messiah:'make-messiah.js',god:'make-god.js'};
function span(s){const i=s.search(/const TLACTS\s*=\s*\[/);if(i<0)return null;
  let j=s.indexOf('[',i),d=0,q=null;
  for(;j<s.length;j++){const c=s[j];
    if(q){if(c==='\\'){j++;continue}if(c===q)q=null;continue}
    if(c==='"'||c==="'"||c==='`'){q=c;continue}
    if(c==='[')d++;else if(c===']'&&--d===0)return [s.indexOf('[',i),j+1];}
  return null}
for(const [slug,file] of Object.entries(SRC)){
  const tf=P('timeline-'+slug+'.json'); if(!fs.existsSync(tf))continue;
  const T=JSON.parse(fs.readFileSync(tf,'utf8'));
  let s=fs.readFileSync(P(file),'utf8');
  const sp=span(s); if(!sp)throw new Error(slug+': TLACTS not found');
  const A=Function('return '+s.slice(sp[0],sp[1]))();
  for(const a of T.acts){ if(!A[a.i])throw new Error(slug+': no act '+a.i);
    A[a.i].name=a.name; A[a.i].desc=a.desc; }
  let kept=0,dropped=0;
  for(const act of A) for(const e of (act.events||[])){
    const why=T.turningPoints[e.y];
    if(why){ e.crit=true; e.why=why; kept++; }
    else { if(e.crit)dropped++; delete e.crit; delete e.why; }
  }
  s=s.slice(0,sp[0])+JSON.stringify(A,null,0)+s.slice(sp[1]);
  fs.writeFileSync(P(file),s);
  console.log(slug.padEnd(8)+kept+' turning points kept, '+dropped+' demoted · '+T.acts.map(a=>a.name).join(' / '));
}
