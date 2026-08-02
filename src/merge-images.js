/* Fold the `list` images into each section's IMGMAP (the claims-list thumbnail).
   Works for both the hand shells (const IMGMAP={...}) and the make-files
   (IMGMAP: {...} inside a config object). Existing thumbnails are never replaced. */
const fs=require('fs'),P=f=>__dirname+'/'+f;
const T=[['mormon','study.html',/const IMGMAP\s*=\s*\{/],['islam','islam.html',/const IMGMAP\s*=\s*\{/],
         ['jw','make-jw.js',/\bIMGMAP\s*:\s*\{/],['bhi','make-bhi.js',/\bIMGMAP\s*:\s*\{/],
         ['messiah','make-messiah.js',/\bIMGMAP\s*:\s*\{/],['god','make-god.js',/\bIMGMAP\s*:\s*\{/]];
const ONLY=process.argv.slice(2);
for(const [slug,file,re] of T){
  if(ONLY.length&&!ONLY.includes(slug))continue;
  const f=P('images-'+slug+'.json'); if(!fs.existsSync(f))continue;
  const raw=JSON.parse(fs.readFileSync(f,'utf8'));
  let s=fs.readFileSync(P(file),'utf8');
  const i=s.search(re); if(i<0)throw new Error(slug+': IMGMAP not found');
  const start=s.indexOf('{',i);
  let j=start,d=0,q=null,end=-1;
  for(;j<s.length;j++){const c=s[j];
    if(q){if(c==='\\'){j++;continue}if(c===q)q=null;continue}
    if(c==='"'||c==="'"||c==='`'){q=c;continue}
    if(c==='{')d++;else if(c==='}'&&--d===0){end=j+1;break}}
  const M=Function('return '+s.slice(start,end))();
  let added=0,kept=0;
  for(const [id,arr] of Object.entries(raw)){
    const L=arr.find(x=>x.where==='list'); if(!L)continue;
    if(M[id]){kept++;continue}
    M[id]={src:'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(L.file)+'?width=520',cap:L.cap};
    added++;
  }
  s=s.slice(0,start)+JSON.stringify(M)+s.slice(end);
  fs.writeFileSync(P(file),s);
  const body=Object.values(raw).reduce((a,x)=>a+x.filter(y=>y.where!=='list').length,0);
  console.log(slug.padEnd(8)+'+'+added+' thumbnails ('+kept+' existing kept) · IMGMAP now '+Object.keys(M).length+' · '+body+' in-body figures');
}
