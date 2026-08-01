/* Splice the rewritten "Sharing Jesus" page into the two hand-maintained shells
   and into the SHARE const of each generated section's make-file. */
const fs=require('fs'),P=f=>__dirname+'/'+f;
const J=JSON.stringify;

const AVOID='${DATA.some(d=>d.avoid)?`<div class="pb-h" style="margin-top:30px">Arguments that will embarrass you — do not use these</div><p class="pd" style="font-size:.8rem;margin:0 0 10px">Popular claims that are false or overclaimed. Each links to the correction — repeating them hands the other side an easy win and discredits your true arguments.</p><div class="relrow">${DATA.filter(d=>d.avoid).map(d=>`<button data-open="${d.id}">⚠ ${esc(d.title)}</button>`).join("")}</div>`:""}';

/* find the extent of `const NAME = { … }` allowing backticks and nested braces */
function constExtent(s,name){
  const i=s.indexOf('const '+name+' = {'); if(i<0)throw new Error(name+' not found');
  let j=s.indexOf('{',i),depth=0,tick=false;
  for(;j<s.length;j++){
    const c=s[j];
    if(c==='\\'){j++;continue}
    if(c==='`'){tick=!tick;continue}
    if(tick)continue;
    if(c==='{')depth++;
    else if(c==='}'&&--depth===0){
      const semi=s.indexOf(';',j);
      return [i,semi+1];
    }
  }
  throw new Error(name+': unbalanced');
}

let n=0;
/* --- the two shells --- */
for(const [slug,file] of [['mormon','study.html'],['islam','islam.html']]){
  const sf=P('share-'+slug+'.json'); if(!fs.existsSync(sf))continue;
  const o=JSON.parse(fs.readFileSync(sf,'utf8'))[slug];
  let s=fs.readFileSync(P(file),'utf8');
  const si=s.indexOf('function renderShare(){'); if(si<0)throw new Error(file+': renderShare missing');
  const M='bindOpens();\n}';
  const sEnd=s.indexOf(M,si)+M.length; if(sEnd<M.length)throw new Error(file+': renderShare end missing');
  s=s.slice(0,si)+'function renderShare(){\n'+
    '  $("#main").innerHTML=`<div class="viewhead"><h2>'+o.title+'</h2>\n'+
    '  <p>'+o.intro+'</p></div>'+o.html+AVOID+'`;\n'+
    '  const b=$("#main").querySelector("[data-goto-path]");\n'+
    '  if(b)b.addEventListener("click",()=>{const p=PATHS.find(x=>x.id===b.dataset.gotoPath);if(!p)return;state.pathId=p.id;const read=store.read;const next=p.items.find(i=>!read.has(i))||p.items[0];openCase(next,true);});\n'+
    '  bindOpens();\n}'+s.slice(sEnd);
  fs.writeFileSync(P(file),s);
  console.log('  '+slug.padEnd(8)+'→ '+file+'  ('+o.html.split(/\s+/).length+' words)');n++;
}
/* --- the generated sections --- */
for(const slug of ['jw','bhi','messiah','god']){
  const sf=P('share-'+slug+'.json'); if(!fs.existsSync(sf))continue;
  const o=JSON.parse(fs.readFileSync(sf,'utf8'))[slug];
  const file='make-'+slug+'.js';
  let s=fs.readFileSync(P(file),'utf8');
  const [a,b]=constExtent(s,'SHARE');
  s=s.slice(0,a)+'const SHARE = {\n  title: '+J(o.title)+',\n  intro: '+J(o.intro)+',\n  html: '+J(o.html)+'\n};'+s.slice(b);
  fs.writeFileSync(P(file),s);
  console.log('  '+slug.padEnd(8)+'→ '+file+'  ('+o.html.split(/\s+/).length+' words)');n++;
}
console.log(n+' share pages spliced');
