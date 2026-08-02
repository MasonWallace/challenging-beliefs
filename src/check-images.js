/* Every file must resolve on Commons and carry a real licence. */
const fs=require('fs'),cp=require('child_process');
const F={mormon:null,islam:'islam-data.json',jw:'jw-data.json',bhi:'bhi-data.json',messiah:'messiah-data.json',god:'god-data.json'};
const OK=/^(public domain|cc[ -]|pd-|gfdl)/i;
for(const slug of process.argv.slice(2)){
  const f=__dirname+'/images-'+slug+'.json';
  if(!fs.existsSync(f)){console.log('MISSING images-'+slug+'.json');continue}
  const M=JSON.parse(fs.readFileSync(f,'utf8'));
  const d=F[slug]?JSON.parse(fs.readFileSync(__dirname+'/'+F[slug],'utf8'))
    :JSON.parse('['+fs.readFileSync(__dirname+'/index.html','utf8').match(/const DATA=\[([\s\S]*?)\n\];/)[1]+']');
  const ids=new Set(d.map(x=>x.id));
  const fails=[]; let n=0,lists=0;
  for(const [id,arr] of Object.entries(M)){
    if(!ids.has(id)){fails.push(id+': unknown case id');continue}
    if(!Array.isArray(arr)){fails.push(id+': not an array');continue}
    const L=arr.filter(x=>x.where==='list').length;
    if(arr.length&&L!==1)fails.push(`${id}: ${L} list thumbnails (need exactly 1)`);
    lists+=L;
    for(const im of arr){
      n++;
      if(!im.file||!im.cap||!im.license){fails.push(id+': missing file/cap/license');continue}
      if(!OK.test(im.license))fails.push(`${id}: licence "${im.license}" not clearly free`);
      const w=im.cap.trim().split(/\s+/).length;
      if(w<8||w>22)fails.push(`${id}: caption ${w} words — "${im.cap.slice(0,44)}"`);
      const url='https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(im.file)+'?width=200';
      let code='000';
      try{code=cp.execSync(`curl -s -L -o /dev/null -w "%{http_code}" --max-time 20 -A "ChallengingBeliefs/1.0 (image link check)" "${url}"`,{encoding:'utf8'}).trim()}catch(e){}
      if(code!=='200')fails.push(`${id}: ${im.file} → HTTP ${code}`);
    }
  }
  console.log(`${slug}: ${Object.keys(M).length} cases · ${n} images · ${lists} thumbnails`);
  fails.slice(0,12).forEach(x=>console.log('  FAIL '+x));
  console.log(fails.length?`  ${fails.length} FAILURES`:'  ALL PASS');
}
