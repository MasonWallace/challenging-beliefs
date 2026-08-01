/* Splice rewritten defense + verdict into a section and mark it as rewritten,
   so the readability gate starts checking it. */
const fs=require('fs'),P=f=>__dirname+'/'+f,grade=require('./grade.js');
const QUOTE=/["\u201c\u2018']([^"\u201d\u2019']{30,})["\u201d\u2019']/g;
const strip=t=>String(t).replace(QUOTE,' a quoted passage. ');
const T=[['mormon','index.html'],['islam','islam-data.json'],['jw','jw-data.json'],
         ['bhi','bhi-data.json'],['messiah','messiah-data.json'],['god','god-data.json']];
for(const [slug,file] of T){
  const ff=P('full-'+slug+'.json'); if(!fs.existsSync(ff))continue;
  const full=JSON.parse(fs.readFileSync(ff,'utf8'));
  const d=slug==='mormon'
    ? JSON.parse('['+fs.readFileSync(P(file),'utf8').match(/const DATA=\[([\s\S]*?)\n\];/)[1]+']')
    : JSON.parse(fs.readFileSync(P(file),'utf8'));
  let hit=0,over=[];
  for(const x of d){
    const f=full[x.id]; if(!f)continue;
    if(f.claim)x.claim=f.claim;
    if(f.response)x.response=f.response;
    if(f.rationale)x.rationale=f.rationale;
    x.rewritten=true; hit++;
    const r=grade(strip([x.claim,x.response,x.rationale].filter(Boolean).join(' ')));
    if(r.grade>10.9||r.wps>20||r.longest>35)over.push([x.id,r.grade,r.wps,r.longest]);
  }
  const missing=Object.keys(full).filter(k=>!d.some(x=>x.id===k));
  if(slug==='mormon'){
    let s=fs.readFileSync(P(file),'utf8');
    const m=s.match(/const DATA=\[([\s\S]*?)\n\];/);
    s=s.slice(0,m.index)+'const DATA=['+d.map(e=>JSON.stringify(e)).join(',\n')+'\n];'+s.slice(m.index+m[0].length);
    fs.writeFileSync(P(file),s);
  } else fs.writeFileSync(P(file),JSON.stringify(d));
  console.log(slug.padEnd(8)+hit+'/'+d.length+' defenses + verdicts rewritten'+(missing.length?'  UNMATCHED: '+missing.join(','):'')+(over.length?'  ⚠ '+over.length+' over limit':'  ✓ within limits'));
  over.slice(0,6).forEach(o=>console.log('    '+o[0]+'  grade '+o[1]+'  avg '+o[2]+'w  longest '+o[3]+'w'));
}
