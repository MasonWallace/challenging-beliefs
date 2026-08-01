/* Splice the per-reference reasons into each section's data and drop the
   references an agent judged never load-bearing. */
const fs=require('fs'),P=f=>__dirname+'/'+f;
const FIELDS=['bible','bom','quran','hadith','tanakh','nt','wt','rabbinic'];
const T=[['mormon','index.html'],['islam','islam-data.json'],['jw','jw-data.json'],
         ['bhi','bhi-data.json'],['messiah','messiah-data.json'],['god','god-data.json']];
const ONLY=process.argv.slice(2);
for(const [slug,file] of T){
  if(ONLY.length&&!ONLY.includes(slug))continue;
  const wf=P('refwhy-'+slug+'.json'); if(!fs.existsSync(wf))continue;
  const w=JSON.parse(fs.readFileSync(wf,'utf8'));
  const d=slug==='mormon'
    ? JSON.parse('['+fs.readFileSync(P(file),'utf8').match(/const DATA=\[([\s\S]*?)\n\];/)[1]+']')
    : JSON.parse(fs.readFileSync(P(file),'utf8'));
  let hit=0,reasons=0,dropped=0,before=0,after=0,naked=[];
  for(const x of d){
    before+=FIELDS.reduce((a,k)=>a+(x[k]||[]).length,0);
    const o=w[x.id];
    if(o){
      hit++;
      const drop=new Set(o.drop||[]);
      if(drop.size)for(const k of FIELDS)if(x[k]){const n=x[k].length;x[k]=x[k].filter(r=>!drop.has(r));dropped+=n-x[k].length}
      const why={};
      for(const k of FIELDS)for(const r of (x[k]||[]))if(o.why&&o.why[r])why[r]=o.why[r];
      if(Object.keys(why).length){x.refwhy=why;reasons+=Object.keys(why).length}
    }
    const n=FIELDS.reduce((a,k)=>a+(x[k]||[]).length,0);
    after+=n;
    if(n&&!x.refwhy)naked.push(x.id);
  }
  if(slug==='mormon'){
    let s=fs.readFileSync(P(file),'utf8');
    const m=s.match(/const DATA=\[([\s\S]*?)\n\];/);
    s=s.slice(0,m.index)+'const DATA=['+d.map(e=>JSON.stringify(e)).join(',\n')+'\n];'+s.slice(m.index+m[0].length);
    fs.writeFileSync(P(file),s);
  } else fs.writeFileSync(P(file),JSON.stringify(d));
  console.log(slug.padEnd(8)+hit+'/'+d.length+' cases  '+reasons+' reasons  '+dropped+' refs dropped ('+before+'→'+after+')'
    +(naked.length?'  ⚠ '+naked.length+' cases still bare: '+naked.slice(0,4).join(', '):'  ✓'));
}
