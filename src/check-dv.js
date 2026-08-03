const fs=require('fs'),grade=require('./grade.js'),S=require('./strip.js');
const F={mormon:null,islam:'islam-data.json',jw:'jw-data.json',bhi:'bhi-data.json',messiah:'messiah-data.json',god:'god-data.json'};
for(const slug of process.argv.slice(2)){
  const f=__dirname+'/dv-'+slug+'.json';
  if(!fs.existsSync(f)){console.log('MISSING dv-'+slug+'.json');continue}
  const O=JSON.parse(fs.readFileSync(f,'utf8'));
  const d=F[slug]?JSON.parse(fs.readFileSync(__dirname+'/'+F[slug],'utf8'))
    :JSON.parse('['+fs.readFileSync(__dirname+'/index.html','utf8').match(/const DATA=\[([\s\S]*?)\n\];/)[1]+']');
  const ids=new Set(d.map(x=>x.id));
  const fails=[]; let n=0,g=0;
  for(const [id,o] of Object.entries(O)){
    if(!ids.has(id)){fails.push(id+': unknown case');continue}
    for(const k of ['responseLead','response','rationaleLead','rationale'])
      if(!o[k]||!String(o[k]).trim()){fails.push(id+': missing '+k)}
    if(fails.length&&fails[fails.length-1].startsWith(id+': missing'))continue;
    n++;
    for(const k of ['responseLead','rationaleLead']){
      const w=String(o[k]).trim().split(/\s+/).length;
      if(w<8||w>20)fails.push(`${id}/${k}: ${w} words`);
      const r=grade(S.measurable(o[k]));
      if(r.grade>9.0)fails.push(`${id}/${k}: grade ${r.grade}`);
    }
    for(const k of ['response','rationale']){
      const t=String(o[k]);
      const r=grade(S.measurable(t)); g+=r.grade;
      if(r.grade>9.4)fails.push(`${id}/${k}: grade ${r.grade}`);
      if(r.wps>17)fails.push(`${id}/${k}: avg ${r.wps}w`);
      if(r.longest>30)fails.push(`${id}/${k}: longest ${r.longest}w`);
      const words=t.split(/\s+/).length;
      if(words>70&&!t.includes('\n\n'))fails.push(`${id}/${k}: ${words} words, no paragraph break`);
      if(/<(?!\/?[bi]>)/.test(t))fails.push(`${id}/${k}: disallowed markup`);
    }
  }
  const missing=d.filter(x=>!O[x.id]).map(x=>x.id);
  if(missing.length)fails.push(missing.length+' cases missing: '+missing.slice(0,4).join(', '));
  console.log(`${slug}: ${n}/${d.length} cases · avg grade ${n?(g/(n*2)).toFixed(1):'—'}`);
  fails.slice(0,10).forEach(x=>console.log('  FAIL '+x));
  console.log(fails.length?`  ${fails.length} FAILURES`:'  ALL PASS');
}
