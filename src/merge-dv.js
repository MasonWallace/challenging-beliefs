/* Splice the rewritten defense/verdict and their lead lines into each section. */
const fs=require('fs'),P=f=>__dirname+'/'+f;
const T=[['mormon','index.html'],['islam','islam-data.json'],['jw','jw-data.json'],
         ['bhi','bhi-data.json'],['messiah','messiah-data.json'],['god','god-data.json']];
const ONLY=process.argv.slice(2);
for(const [slug,file] of T){
  if(ONLY.length&&!ONLY.includes(slug))continue;
  const f=P('dv-'+slug+'.json'); if(!fs.existsSync(f))continue;
  const O=JSON.parse(fs.readFileSync(f,'utf8'));
  const d=slug==='mormon'
    ? JSON.parse('['+fs.readFileSync(P(file),'utf8').match(/const DATA=\[([\s\S]*?)\n\];/)[1]+']')
    : JSON.parse(fs.readFileSync(P(file),'utf8'));
  let hit=0;
  for(const x of d){
    const o=O[x.id]; if(!o)continue;
    x.responseLead=o.responseLead; x.rationaleLead=o.rationaleLead;
    x.response=o.response; x.rationale=o.rationale; hit++;
  }
  if(slug==='mormon'){
    let s=fs.readFileSync(P(file),'utf8');
    const m=s.match(/const DATA=\[([\s\S]*?)\n\];/);
    fs.writeFileSync(P(file),s.slice(0,m.index)+'const DATA=['+d.map(e=>JSON.stringify(e)).join(',\n')+'\n];'+s.slice(m.index+m[0].length));
  } else fs.writeFileSync(P(file),JSON.stringify(d));
  console.log(slug.padEnd(8)+hit+'/'+d.length+' cases got a lead line and a rewrite');
}
