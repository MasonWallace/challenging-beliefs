const fs=require('fs');
const SEC={mormon:()=>JSON.parse('['+fs.readFileSync(__dirname+'/index.html','utf8').match(/const DATA=\[([\s\S]*?)\n\];/)[1]+']'),
 islam:()=>JSON.parse(fs.readFileSync(__dirname+'/islam-data.json','utf8')),
 jw:()=>JSON.parse(fs.readFileSync(__dirname+'/jw-data.json','utf8')),
 bhi:()=>JSON.parse(fs.readFileSync(__dirname+'/bhi-data.json','utf8')),
 messiah:()=>JSON.parse(fs.readFileSync(__dirname+'/messiah-data.json','utf8')),
 god:()=>JSON.parse(fs.readFileSync(__dirname+'/god-data.json','utf8'))};
const syll=w=>{w=w.toLowerCase().replace(/[^a-z]/g,'');if(w.length<=3)return 1;
 w=w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/,'').replace(/^y/,'');
 return (w.match(/[aeiouy]{1,2}/g)||['x']).length;};
function stats(t){
  const sents=t.split(/(?<=[.!?])\s+/).filter(x=>x.trim().length>2);
  const words=t.split(/\s+/).filter(Boolean);
  const sy=words.reduce((a,w)=>a+syll(w),0);
  const S=sents.length||1,W=words.length||1;
  const fk=0.39*(W/S)+11.8*(sy/W)-15.59;           // Flesch-Kincaid grade
  const poly=words.filter(w=>syll(w)>=3).length;
  const fog=0.4*((W/S)+100*(poly/W));               // Gunning Fog
  return {grade:(fk+fog)/2, wps:W/S, W};
}
console.log('field'.padEnd(10)+'  '+['mormon','islam','jw','bhi','messiah','god'].map(s=>s.padStart(8)).join(''));
for(const f of ['context','claim','response','rationale']){
  const row=[];
  for(const k of Object.keys(SEC)){
    const d=SEC[k]();
    const vals=d.map(x=>x[f]).filter(Boolean).map(t=>stats(t));
    row.push((vals.reduce((a,c)=>a+c.grade,0)/(vals.length||1)).toFixed(1).padStart(8));
  }
  console.log((f==='context'?'SIMPLIFIED':f).padEnd(10)+'  '+row.join(''));
}
console.log('\nwords per sentence:');
for(const f of ['context','claim','response']){
  const row=[];
  for(const k of Object.keys(SEC)){
    const d=SEC[k]();
    const vals=d.map(x=>x[f]).filter(Boolean).map(t=>stats(t));
    row.push((vals.reduce((a,c)=>a+c.wps,0)/(vals.length||1)).toFixed(1).padStart(8));
  }
  console.log((f==='context'?'SIMPLIFIED':f).padEnd(10)+'  '+row.join(''));
}
console.log('\navg words per field (how much a reader must get through per case):');
for(const k of Object.keys(SEC)){
  const d=SEC[k]();
  const tot=f=>Math.round(d.map(x=>x[f]).filter(Boolean).reduce((a,t)=>a+t.split(/\s+/).length,0)/d.length);
  console.log('  '+k.padEnd(9)+' simplified '+String(tot('context')).padStart(4)+' | claim '+String(tot('claim')).padStart(4)+
    ' | defense '+String(tot('response')).padStart(4)+' | verdict '+String(tot('rationale')).padStart(4)+
    ' | TOTAL '+String(tot('context')+tot('claim')+tot('response')+tot('rationale')).padStart(5));
}
