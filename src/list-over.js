/* Which cases actually fail the honest gate, and on what. */
const fs=require('fs'),grade=require('./grade.js');
const S=require('./strip.js');
const strip=t=>S.measurable(t);
const F={mormon:null,islam:'islam-data.json',jw:'jw-data.json',bhi:'bhi-data.json',messiah:'messiah-data.json',god:'god-data.json'};
const want=process.argv[2];
for(const [slug,f] of Object.entries(F)){
  if(want&&slug!==want)continue;
  const d=f?JSON.parse(fs.readFileSync(f,'utf8')):JSON.parse('['+fs.readFileSync('index.html','utf8').match(/const DATA=\[([\s\S]*?)\n\];/)[1]+']');
  const out=[];
  for(const x of d){
    if(!x.rewritten)continue;
    const r=grade(strip([x.claim,x.response,x.rationale].filter(Boolean).join(' ')));
    const why=[];
    if(r.grade>10.9)why.push('g'+r.grade);
    if(r.wps>20)why.push('avg'+r.wps);
    if(r.longest>35)why.push('max'+r.longest);
    if(why.length)out.push(x.id+'  '+why.join(' '));
  }
  fs.writeFileSync(__dirname+'/over-'+slug+'.txt',out.join('\n')+'\n');
  console.log(slug.padEnd(8)+out.length+'/'+d.length+' cases over the full limits → over-'+slug+'.txt');
}
