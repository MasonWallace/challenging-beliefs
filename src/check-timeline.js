/* Turning points must be few, keyed to real events, and say why. */
const fs=require('fs');
const SRC={mormon:'study.html',islam:'islam.html',jw:'make-jw.js',bhi:'make-bhi.js',messiah:'make-messiah.js',god:'make-god.js'};
function grab(s){const i=s.search(/const TLACTS\s*=\s*\[/);if(i<0)return null;let j=s.indexOf('[',i),d=0,q=null;
 for(;j<s.length;j++){const c=s[j];if(q){if(c==='\\'){j++;continue}if(c===q)q=null;continue}
 if(c==='"'||c==="'"||c==='`'){q=c;continue}if(c==='[')d++;else if(c===']'&&--d===0)return Function('return '+s.slice(s.indexOf('[',i),j+1))();}return null}
for(const slug of process.argv.slice(2)){
  const f=__dirname+'/timeline-'+slug+'.json';
  if(!fs.existsSync(f)){console.log('MISSING timeline-'+slug+'.json');continue}
  const T=JSON.parse(fs.readFileSync(f,'utf8'));
  const A=grab(fs.readFileSync(__dirname+'/'+SRC[slug],'utf8'));
  const ev=A.flatMap(a=>a.events||[]); const years=new Set(ev.map(e=>e.y));
  const fails=[];
  if(!T.acts||T.acts.length!==A.length)fails.push(`acts: ${T.acts?T.acts.length:0} given, ${A.length} needed`);
  for(const a of (T.acts||[])){
    if(!a.name||!a.desc){fails.push('act '+a.i+': missing name/desc');continue}
    const w=a.name.trim().split(/\s+/).length;
    if(w<2||w>5)fails.push(`act ${a.i}: name is ${w} words — "${a.name}"`);
    if(/^(origins?|the hardening|the reckonings?|preservation|revelation)$/i.test(a.name.trim()))
      fails.push(`act ${a.i}: "${a.name}" is the abstraction we are replacing`);
  }
  const tp=Object.entries(T.turningPoints||{});
  if(tp.length<3||tp.length>7)fails.push(`${tp.length} turning points (want 4-6, max 7)`);
  for(const [y,why] of tp){
    if(!years.has(y))fails.push(`turning point "${y}" is not an event year in the data`);
    const w=String(why).split(/\s+/).length;
    if(w<8||w>20)fails.push(`"${y}": reason is ${w} words`);
  }
  for(const y of (T.demote||[])) if(!years.has(y))fails.push(`demote "${y}" is not an event year`);
  const before=ev.filter(e=>e.crit).length;
  console.log(`${slug}: ${before} turning points → ${tp.length} · ${ev.length} events · ${(T.acts||[]).map(a=>a.name).join(' / ')}`);
  fails.slice(0,10).forEach(x=>console.log('  FAIL '+x));
  console.log(fails.length?`  ${fails.length} FAILURES`:'  ALL PASS');
}
