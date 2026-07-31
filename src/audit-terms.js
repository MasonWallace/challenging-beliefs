const fs=require('fs');
const SEC={
  mormon:{data:()=>JSON.parse('['+fs.readFileSync(__dirname+'/index.html','utf8').match(/const DATA=\[([\s\S]*?)\n\];/)[1]+']'), shell:'study.html'},
  islam:{data:()=>JSON.parse(fs.readFileSync(__dirname+'/islam-data.json','utf8')), shell:'islam.html'},
  jw:{data:()=>JSON.parse(fs.readFileSync(__dirname+'/jw-data.json','utf8')), shell:'jw.html'},
  bhi:{data:()=>JSON.parse(fs.readFileSync(__dirname+'/bhi-data.json','utf8')), shell:'bhi.html'},
  messiah:{data:()=>JSON.parse(fs.readFileSync(__dirname+'/messiah-data.json','utf8')), shell:'messiah.html'},
  god:{data:()=>JSON.parse(fs.readFileSync(__dirname+'/god-data.json','utf8')), shell:'god.html'},
};
function glossOf(shell){
  const s=fs.readFileSync(__dirname+'/'+shell,'utf8');
  const i=s.indexOf('const GLOSSARY='); const j=s.indexOf('\n', s.indexOf('}]', i));
  const lit=s.slice(s.indexOf('=',i)+1, s.indexOf('];', i)+1);
  try{ return eval(lit).map(g=>g.t); }catch(e){ return []; }
}
const STOP=new Set(('The A An And But For Not In On At To Of It He She They We You I If When Where What Why How This That These Those There Here As By From With Without Their Its His Her Our Your My Was Were Is Are Be Been Being Do Does Did Have Has Had Will Would Can Could Should May Might Must Every Each All Both Some Any No Nor So Then Than Now Yet Still Also Even Only Just One Two Three Four Five Six Seven Eight Nine Ten First Second Third Most Many Much More Less Least Best Worst Same Other Another Such Own Very Too Once Twice Never Always Often Usually Because Before After During While Until Since Although Though However Instead Rather Whether Either Neither Both Ask Read Note Use Say Said Says Christian Christians Christianity Bible Biblical Scripture Scriptures God Jesus Christ Lord Jehovah Church Gospel Gospels New Old Testament Verse Verses Chapter Book Books Day Days Year Years Century Centuries').split(' '));
const out={};
for(const [key,cfg] of Object.entries(SEC)){
  const data=cfg.data();
  const have=new Set(glossOf(cfg.shell).map(t=>t.toLowerCase()));
  const freq={};
  for(const d of data){
    const txt=[d.claim,d.response,d.rationale,d.talk].filter(Boolean).join(' ');
    // multiword proper nouns and single capitalised terms
    const re=/\b([A-Z][a-zß-ÿA-Za-z’'\-]+(?:\s+(?:of|the|and|al-|ibn|de|van)?\s*[A-Z][a-zß-ÿA-Za-z’'\-]+){0,3})\b/g;
    let m;
    while((m=re.exec(txt))){
      let t=m[1].trim();
      if(t.length<4) continue;
      const words=t.split(/\s+/);
      if(words.length===1 && STOP.has(t)) continue;
      if(words.every(w=>STOP.has(w))) continue;
      freq[t]=(freq[t]||0)+1;
    }
    // lowercase technical terms worth defining
    for(const t of (txt.match(/\b(?:multi-[a-z]+ theory|documentary hypothesis|higher criticism|textual criticism|form criticism|minimal facts|isnad|chiasmus|anachronism|palimpsest|codex|papyr\w+|ossuary|stele|colophon|pericope|variant readings?|autograph|apocrypha\w*|pseudepigrapha|redaction|exegesis|eisegesis|hermeneutic\w*|typology|proof-?text\w*|syncretis\w+|soteriolog\w+|christolog\w+|eschatolog\w+|epistemolog\w+|ontolog\w+|teleolog\w+|providence)\b/gi)||[])) freq[t.toLowerCase()]=(freq[t.toLowerCase()]||0)+1;
  }
  const missing=Object.entries(freq).filter(([t,n])=>n>=2 && !have.has(t.toLowerCase()))
    .sort((a,b)=>b[1]-a[1]);
  out[key]={glossary:have.size, cases:data.length, missing};
  console.log('\n=== '+key.toUpperCase()+' — '+data.length+' cases, glossary has '+have.size+' terms');
  console.log(missing.slice(0,60).map(([t,n])=>t+'('+n+')').join(', '));
}
fs.writeFileSync(__dirname+'/term-audit.json', JSON.stringify(out,null,1));
