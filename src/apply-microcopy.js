/* Apply the plain-English rewrites of the site's own furniture. Every find must
   still occur exactly once — if the text moved since the audit, skip and report. */
const fs=require('fs'),P=f=>__dirname+'/'+f;
const M=JSON.parse(fs.readFileSync(P('microcopy.json'),'utf8'));
let ok=0,skipped=[];
for(const [file,edits] of Object.entries(M)){
  if(!fs.existsSync(P(file))){skipped.push(file+': missing');continue}
  let s=fs.readFileSync(P(file),'utf8'),n=0;
  for(const e of edits){
    const c=s.split(e.find).length-1;
    if(c!==1){skipped.push(`${file}: "${e.find.slice(0,50)}" occurs ${c}x`);continue}
    s=s.replace(e.find,e.replace); n++;
  }
  fs.writeFileSync(P(file),s);
  console.log(file.padEnd(20)+n+'/'+edits.length+' applied');
  ok+=n;
}
console.log('\n'+ok+' rewrites applied'+(skipped.length?', '+skipped.length+' skipped':''));
skipped.slice(0,8).forEach(x=>console.log('  SKIP '+x));
