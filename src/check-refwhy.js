/* Usage: node check-refwhy.js <slug> */
const fs=require('fs'),grade=require('./grade.js');
const F={mormon:'index.html',islam:'islam-data.json',jw:'jw-data.json',bhi:'bhi-data.json',messiah:'messiah-data.json',god:'god-data.json'};
for(const slug of process.argv.slice(2)){
  const f=__dirname+'/refwhy-'+slug+'.json';
  if(!fs.existsSync(f)){console.log('MISSING refwhy-'+slug+'.json');continue}
  const w=JSON.parse(fs.readFileSync(f,'utf8'));
  const data=slug==='mormon'
    ? JSON.parse('['+fs.readFileSync(__dirname+'/index.html','utf8').match(/const DATA=\[([\s\S]*?)\n\];/)[1]+']')
    : JSON.parse(fs.readFileSync(__dirname+'/'+F[slug],'utf8'));
  const byId={};data.forEach(x=>byId[x.id]=x);
  let cases=0,notes=0,drops=0,bad=[];
  for(const [id,o] of Object.entries(w)){
    const c=byId[id]; if(!c){bad.push(id+': unknown case id');continue}
    cases++;
    const refs=[...(c.bible||[]),...(c.bom||[]),...(c.quran||[]),...(c.hadith||[]),...(c.tanakh||[]),...(c.nt||[]),...(c.wt||[]),...(c.rabbinic||[])];
    const known=new Set(refs);
    for(const r of (o.drop||[])){ drops++; if(!known.has(r))bad.push(id+': drop "'+r+'" is not a reference on this case'); }
    for(const [ref,why] of Object.entries(o.why||{})){
      notes++;
      if(!known.has(ref))bad.push(id+': why "'+ref+'" is not a reference on this case');
      const wds=String(why).split(/\s+/).length;
      if(wds>28)bad.push(id+' / '+ref+': '+wds+' words (max 28)');
      if(grade(why).grade>10.5)bad.push(id+' / '+ref+': grade '+grade(why).grade);
      if(/<[a-z]/i.test(why)&&!/^[^<]*<\/?[bi]>/.test(why))bad.push(id+' / '+ref+': stray tag');
    }
    const covered=new Set([...(o.drop||[]),...Object.keys(o.why||{})]);
    const missed=refs.filter(r=>!covered.has(r));
    if(missed.length)bad.push(id+': '+missed.length+' references neither explained nor dropped');
  }
  console.log(slug+': '+cases+'/'+data.length+' cases, '+notes+' reasons, '+drops+' drops');
  bad.slice(0,12).forEach(x=>console.log('  FAIL '+x));
  console.log(bad.length?'  '+bad.length+' FAILURES':'  ALL PASS');
}
