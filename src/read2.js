const fs=require('fs');
const syll=w=>{w=w.toLowerCase().replace(/[^a-z]/g,'');if(w.length<=3)return 1;
 w=w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/,'').replace(/^y/,'');
 return (w.match(/[aeiouy]{1,2}/g)||['x']).length;};
function grade(t){
  t=String(t).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
  const S=t.split(/(?<=[.!?])\s+/).filter(x=>x.trim().length>2).length||1;
  const words=t.split(/\s+/).filter(Boolean),W=words.length||1;
  const sy=words.reduce((a,w)=>a+syll(w),0), poly=words.filter(w=>syll(w)>=3).length;
  return ((0.39*(W/S)+11.8*(sy/W)-15.59)+(0.4*((W/S)+100*(poly/W))))/2;
}
/* pull the non-case prose out of a built page */
function konst(s,name){const i=s.indexOf('const '+name+'=');if(i<0)return null;
  const st=s.indexOf('=',i)+1;let d=0,q=null,j=st;
  for(;j<s.length;j++){const c=s[j],p=s[j-1];
    if(q){if(c===q&&p!=='\\')q=null;continue}
    if(c==='"'||c==="'"||c==='`'){q=c;continue}
    if('{[('.includes(c))d++;else if('}])'.includes(c)){d--;if(!d){j++;break}}else if(!d&&c===';')break;}
  try{return eval('('+s.slice(st,j)+')')}catch(e){return null}}
function textOf(o){const out=[];(function walk(x){if(!x)return;if(typeof x==='string'){if(x.length>40&&!/^https?:/.test(x))out.push(x);return}
  if(Array.isArray(x)){x.forEach(walk);return}if(typeof x==='object')Object.values(x).forEach(walk)})(o);return out}
const PAGES={mormon:'index.html',islam:'islam-built.html',jw:'jw-built.html',bhi:'bhi-built.html',messiah:'messiah-built.html',god:'god-built.html'};
const CONSTS=['CATDESC','WHYMAP','TALK','GLOSSARY','THEYSAY','LESSONS','PROOFS','KNOW','DIALOG','TOURSTEPS','WHYTAIL','TIPS','TLACTS','PATHS'];
const agg={};
for(const [k,f] of Object.entries(PAGES)){
  const s=fs.readFileSync(f,'utf8');
  for(const c of CONSTS){
    const o=konst(s,c); if(!o)continue;
    const t=textOf(o); if(!t.length)continue;
    const g=t.reduce((a,x)=>a+grade(x),0)/t.length;
    (agg[c]=agg[c]||[]).push(g);
  }
  // hand-written pages: renderCore + renderShare template text
  for(const [nm,fn] of [['core page','renderCore'],['share page','renderShare']]){
    const i=s.indexOf('function '+fn+'(){'); if(i<0)continue;
    const chunk=s.slice(i,i+14000).replace(/<[^>]+>/g,' ').replace(/\$\{[^}]*\}/g,' ').replace(/\s+/g,' ');
    (agg[nm]=agg[nm]||[]).push(grade(chunk));
  }
}
console.log('non-case prose — average reading grade across all six sections\n');
const rows=Object.entries(agg).map(([k,v])=>[k,v.reduce((a,c)=>a+c,0)/v.length]).sort((a,b)=>b[1]-a[1]);
for(const [k,g] of rows) console.log('  '+k.padEnd(12)+g.toFixed(1).padStart(6)+'   '+(g>13?'▲ too hard':g>11?'· borderline':'✓ ok'));
