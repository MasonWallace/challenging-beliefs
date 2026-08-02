/* Titles must be short, concrete, unique — and must not quietly lose the fact
   that made the case worth reading. */
const fs=require('fs');
const F={mormon:null,islam:'islam-data.json',jw:'jw-data.json',bhi:'bhi-data.json',messiah:'messiah-data.json',god:'god-data.json'};
const VAGUE=/\b(issues?|problems? with|concerns? about|various|certain|aspects?|matters?|things|stuff|controversy|questions? (about|around))\b/i;
const LIMP=/^(the claim that|regarding|on the|about the|a look at|an examination|concerning)\b/i;
/* A distinctive token: a number, a proper noun, or any content word of 4+ letters.
   Case is ignored — an earlier version only counted capitalised words, which meant
   a shared lowercase word ("horses", "steel") did not count and pushed rewrites
   toward needless capitalisation. */
const tokens=t=>{
  const out=new Set();
  (String(t).match(/\b\d{3,4}\b|\b\d+(?:[–-]\d+)?\b/g)||[]).forEach(x=>out.add(x));
  (String(t).match(/\b[A-Za-z][a-zA-Z']{2,}\b/g)||[]).forEach(x=>out.add(x.toLowerCase()));
  return out;
};
const STOP=new Set(['the','and','but','for','how','why','what','when','who','one','not','its','this','that','with','from','have','has','was','were']);
let bad=0;
for(const slug of process.argv.slice(2)){
  const f=__dirname+'/titles-'+slug+'.json';
  if(!fs.existsSync(f)){console.log('MISSING titles-'+slug+'.json');bad++;continue}
  const T=JSON.parse(fs.readFileSync(f,'utf8'));
  const d=F[slug]?JSON.parse(fs.readFileSync(__dirname+'/'+F[slug],'utf8'))
    :JSON.parse('['+fs.readFileSync(__dirname+'/index.html','utf8').match(/const DATA=\[([\s\S]*?)\n\];/)[1]+']');
  const byId={};d.forEach(x=>byId[x.id]=x);
  const seen=new Map(); const fails=[];
  for(const [id,t] of Object.entries(T)){
    const c=byId[id]; if(!c){fails.push(id+': unknown case id');continue}
    const w=t.trim().split(/\s+/).length;
    if(w<3||w>9)fails.push(`${id}: ${w} words — "${t}"`);
    if(t.length>66)fails.push(`${id}: ${t.length} chars — "${t}"`);
    if(VAGUE.test(t))fails.push(`${id}: vague wording — "${t}"`);
    if(LIMP.test(t))fails.push(`${id}: limp opening — "${t}"`);
    if(/[.]$/.test(t.trim()))fails.push(`${id}: ends in a full stop`);
    if(/<[a-z]/i.test(t))fails.push(`${id}: contains markup`);
    const key=t.toLowerCase().replace(/[^a-z0-9 ]/g,'');
    if(seen.has(key))fails.push(`${id}: duplicate of ${seen.get(key)}`); else seen.set(key,id);
    /* the anchor check: keep a proper noun or number from the original where one existed */
    const orig=tokens(c.title), now=tokens(t);
    const meaningful=[...orig].filter(x=>!STOP.has(x));
    if(meaningful.length&&![...now].some(x=>orig.has(x)))
      fails.push(`${id}: lost every specific from the original — was "${c.title}" now "${t}"`);
  }
  const missing=d.filter(x=>!T[x.id]).map(x=>x.id);
  if(missing.length)fails.push(missing.length+' cases with no new title: '+missing.slice(0,5).join(', '));
  const wc=Object.values(T).map(t=>t.trim().split(/\s+/).length);
  const avg=wc.length?(wc.reduce((a,b)=>a+b,0)/wc.length).toFixed(1):'—';
  console.log(`${slug}: ${Object.keys(T).length}/${d.length} titles · avg ${avg} words`);
  fails.slice(0,10).forEach(x=>console.log('  FAIL '+x));
  console.log(fails.length?`  ${fails.length} FAILURES`:'  ALL PASS');
  if(fails.length)bad++;
}
process.exit(0);
