/* Splices context-<slug>.json (id -> paragraph) into each section's data. */
const fs=require('fs');const P=f=>__dirname+'/'+f;
const T=[['mormon','index.html'],['islam','islam-data.json'],['jw','jw-data.json'],
         ['bhi','bhi-data.json'],['messiah','messiah-data.json'],['god','god-data.json']];
for(const [slug,file] of T){
  const cf=P('context-'+slug+'.json');
  if(!fs.existsSync(cf)){console.log(slug.padEnd(8),'no context file yet');continue}
  const ctx=JSON.parse(fs.readFileSync(cf,'utf8'));
  if(slug==='mormon'){
    let s=fs.readFileSync(P(file),'utf8');
    const m=s.match(/const DATA=\[([\s\S]*?)\n\];/);
    const d=JSON.parse('['+m[1]+']');
    let hit=0; d.forEach(x=>{ if(ctx[x.id]){x.context=ctx[x.id];hit++;} });
    s=s.slice(0,m.index)+'const DATA=['+d.map(e=>JSON.stringify(e)).join(',\n')+'\n];'+s.slice(m.index+m[0].length);
    fs.writeFileSync(P(file),s);
    console.log(slug.padEnd(8), hit+'/'+d.length, 'cases given background');
  } else {
    const d=JSON.parse(fs.readFileSync(P(file),'utf8'));
    let hit=0; d.forEach(x=>{ if(ctx[x.id]){x.context=ctx[x.id];hit++;} });
    fs.writeFileSync(P(file),JSON.stringify(d));
    console.log(slug.padEnd(8), hit+'/'+d.length, 'cases given background');
  }
}
