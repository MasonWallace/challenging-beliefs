/* The standalone pages (home, about, parallels, privacy) are copied straight to
   the site and never pass through build.js, so they missed the beacon. */
const fs=require('fs'),P=f=>__dirname+'/'+f;
const f=P('analytics-snippet.html');
const snip=fs.existsSync(f)?fs.readFileSync(f,'utf8').trim():'';
const TARGETS=['landing.html','about-src.html','parallels-src.html','prerendered/privacy.html'];
let n=0;
for(const t of TARGETS){
  const p=P(t); if(!fs.existsSync(p)){console.log('  missing '+t);continue}
  let s=fs.readFileSync(p,'utf8');
  s=s.replace(/\s*<!-- Cloudflare Web Analytics -->[\s\S]*?<!-- End Cloudflare Web Analytics -->/g,'');  /* idempotent */
  if(snip){
    if(!s.includes('</title>')){console.log('  no </title> in '+t);continue}
    s=s.replace('</title>','</title>'+snip);
    n++;
  }
  fs.writeFileSync(p,s);
}
console.log(snip?n+'/'+TARGETS.length+' standalone pages carry the beacon':'snippet removed from standalone pages');
