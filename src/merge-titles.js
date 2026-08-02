/* Splice the rewritten titles into each section's data, keeping the originals
   in `titleLong` so nothing is lost and the full wording stays searchable. */
const fs=require('fs'),P=f=>__dirname+'/'+f;
const ONLY=process.argv.slice(2);
const T=[['mormon','index.html'],['islam','islam-data.json'],['jw','jw-data.json'],
         ['bhi','bhi-data.json'],['messiah','messiah-data.json'],['god','god-data.json']];
for(const [slug,file] of T){
  if(ONLY.length&&!ONLY.includes(slug))continue;
  const tf=P('titles-'+slug+'.json'); if(!fs.existsSync(tf))continue;
  const nt=JSON.parse(fs.readFileSync(tf,'utf8'));
  const d=slug==='mormon'
    ? JSON.parse('['+fs.readFileSync(P(file),'utf8').match(/const DATA=\[([\s\S]*?)\n\];/)[1]+']')
    : JSON.parse(fs.readFileSync(P(file),'utf8'));
  let hit=0,before=0,after=0;
  for(const x of d){
    const t=nt[x.id]; if(!t)continue;
    if(!x.titleLong)x.titleLong=x.title;      /* keep the original for search */
    before+=x.titleLong.split(/\s+/).length;
    x.title=t; after+=t.split(/\s+/).length; hit++;
  }
  const missing=Object.keys(nt).filter(k=>!d.some(x=>x.id===k));
  if(slug==='mormon'){
    let s=fs.readFileSync(P(file),'utf8');
    const m=s.match(/const DATA=\[([\s\S]*?)\n\];/);
    s=s.slice(0,m.index)+'const DATA=['+d.map(e=>JSON.stringify(e)).join(',\n')+'\n];'+s.slice(m.index+m[0].length);
    fs.writeFileSync(P(file),s);
  } else fs.writeFileSync(P(file),JSON.stringify(d));
  console.log(slug.padEnd(8)+hit+'/'+d.length+' retitled · '+(before/hit).toFixed(1)+' → '+(after/hit).toFixed(1)+' words'
    +(missing.length?'  UNMATCHED: '+missing.join(','):''));
}
