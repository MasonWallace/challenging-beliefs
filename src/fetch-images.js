/* Download every Commons image once and serve it from the site instead of
   hotlinking. Two WebP sizes: -s for the claims-list thumbnails, -m for figures
   and the lightbox. Resumable: anything already converted is skipped. */
const fs=require('fs'),cp=require('child_process'),P=f=>__dirname+'/'+f;
const OUT=P('img'); fs.mkdirSync(OUT,{recursive:true});
const TMP='/tmp/imgsrc'; fs.mkdirSync(TMP,{recursive:true});
const UA='ChallengingBeliefs/1.0 (https://whichgospel.com/; static site image mirror)';
const urls=fs.readFileSync(P('img-urls.txt'),'utf8').split('\n').filter(Boolean);

/* stable, collision-free local name */
function slug(u){
  const raw=decodeURIComponent(u.split('FilePath/')[1]||'x');
  const base=raw.replace(/\.[a-z0-9]+$/i,'').replace(/[^A-Za-z0-9]+/g,'-').replace(/^-|-$/g,'').toLowerCase().slice(0,60);
  let h=0; for(let i=0;i<u.length;i++){h=(h*31+u.charCodeAt(i))>>>0}
  return base+'-'+h.toString(36);
}
const map={}; let done=0,skipped=0,failed=[];
const sh=c=>{try{return cp.execSync(c,{stdio:'pipe',timeout:120000}).toString()}catch(e){return null}};

urls.forEach((u,i)=>{
  const s=slug(u);
  map[u]={s:'img/'+s+'-s.webp',m:'img/'+s+'-m.webp'};
  if(fs.existsSync(OUT+'/'+s+'-m.webp')&&fs.existsSync(OUT+'/'+s+'-s.webp')){skipped++;return}
  const src=TMP+'/'+s+'.src';
  /* fetch once at 1000px and derive both sizes locally — one request per file */
  let ok=false;
  for(let a=0;a<4&&!ok;a++){
    const code=sh(`curl -s -L --max-time 60 -A ${JSON.stringify(UA)} -o ${JSON.stringify(src)} -w '%{http_code}' ${JSON.stringify(u+'?width=1000')}`);
    if(code==='200'&&fs.existsSync(src)&&fs.statSync(src).size>500){ok=true;break}
    sh('sleep '+(2*(a+1)));
  }
  if(!ok){failed.push(u);return}
  const EXT_PASSTHRU=/\.(gif|svg)$/i;
  if(EXT_PASSTHRU.test(u)){
    const ext=u.match(EXT_PASSTHRU)[1].toLowerCase();
    fs.copyFileSync(src,OUT+'/'+s+'-m.'+ext); fs.copyFileSync(src,OUT+'/'+s+'-s.'+ext);
    map[u]={s:'img/'+s+'-s.'+ext,m:'img/'+s+'-m.'+ext};
    try{fs.unlinkSync(src)}catch(e){} done++; return;
  }
  const q='-quiet -q 82';
  const a=sh(`cwebp ${q} -resize 800 0 ${JSON.stringify(src)} -o ${JSON.stringify(OUT+'/'+s+'-m.webp')}`);
  const b=sh(`cwebp ${q} -resize 320 0 ${JSON.stringify(src)} -o ${JSON.stringify(OUT+'/'+s+'-s.webp')}`);
  if(!fs.existsSync(OUT+'/'+s+'-m.webp')||!fs.existsSync(OUT+'/'+s+'-s.webp')){failed.push(u);return}
  try{fs.unlinkSync(src)}catch(e){}
  done++;
  if(done%50===0)console.log('  '+done+' fetched, '+(i+1)+'/'+urls.length+' seen, '+failed.length+' failed');
});
fs.writeFileSync(P('img-map.json'),JSON.stringify(map,null,1));
fs.writeFileSync(P('img-failed.txt'),failed.join('\n'));
const size=sh(`du -sh ${JSON.stringify(OUT)}`)||'';
console.log('\nfetched '+done+' · skipped '+skipped+' · failed '+failed.length+' · total on disk '+size.trim().split('\t')[0]);
