const fs=require('fs'),P=f=>__dirname+'/'+f, grade=require('./grade.js');
const S=require('./strip.js');
const strip=t=>S.measurable(t);
const T=[['mormon','index.html'],['islam','islam-data.json'],['jw','jw-data.json'],
         ['bhi','bhi-data.json'],['messiah','messiah-data.json'],['god','god-data.json']];
const ONLY=process.argv.slice(2);
for(const [slug,file] of T){
  if(ONLY.length&&!ONLY.includes(slug))continue;
  const pf=P('plain-'+slug+'.json'); if(!fs.existsSync(pf))continue;
  const plain=JSON.parse(fs.readFileSync(pf,'utf8'));
  const load=()=>slug==='mormon'
    ? JSON.parse('['+fs.readFileSync(P(file),'utf8').match(/const DATA=\[([\s\S]*?)\n\];/)[1]+']')
    : JSON.parse(fs.readFileSync(P(file),'utf8'));
  const d=load(); let hit=0,over=[];
  for(const x of d){
    if(!plain[x.id])continue;
    x.plain=plain[x.id]; delete x.context; hit++;
    const r=grade(strip(x.plain.map(b=>b.d).join(' ')));
    if(r.grade>7.9||r.wps>14||r.longest>25) over.push([x.id,r.grade,r.wps,r.longest]);
  }
  const missing=Object.keys(plain).filter(k=>!d.some(x=>x.id===k));
  if(slug==='mormon'){
    let s=fs.readFileSync(P(file),'utf8');
    const m=s.match(/const DATA=\[([\s\S]*?)\n\];/);
    s=s.slice(0,m.index)+'const DATA=['+d.map(e=>JSON.stringify(e)).join(',\n')+'\n];'+s.slice(m.index+m[0].length);
    fs.writeFileSync(P(file),s);
  } else fs.writeFileSync(P(file),JSON.stringify(d));
  console.log(slug.padEnd(8)+hit+'/'+d.length+' cases got plain blocks'+(missing.length?'  UNMATCHED IDS: '+missing.join(','):'')+(over.length?'  ⚠ '+over.length+' over limit':'  ✓ all within limits'));
  over.slice(0,8).forEach(o=>console.log('    '+o[0]+' grade '+o[1]+' avg '+o[2]+'w longest '+o[3]+'w'));
}
