/* every emitted page must be indexable on its own */
const fs=require('fs'),path=require('path');
const root=__dirname+'/prerendered';
const fails=[]; let n=0; const descLens=[];
function walk(dir){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    const p=path.join(dir,e.name);
    if(e.isDirectory()){walk(p);continue}
    if(e.name!=='index.html')continue;
    n++;
    const s=fs.readFileSync(p,'utf8');
    const rel=p.replace(root+'/','');
    const t=(s.match(/<title>(.*?)<\/title>/)||[])[1];
    const d=(s.match(/name="description" content="(.*?)"/)||[])[1];
    const c=(s.match(/rel="canonical" href="(.*?)"/)||[])[1];
    const body=s.replace(/<script[\s\S]*?<\/script>/g,'').replace(/<style[\s\S]*?<\/style>/g,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
    if(!t||t.length<15)fails.push(rel+': title missing/short');
    if(!d||d.length<50)fails.push(rel+': description '+(d?d.length:0)+' chars');
    if(!c)fails.push(rel+': no canonical');
    if(!/application\/ld\+json/.test(s))fails.push(rel+': no structured data');
    if(body.split(' ').length<150)fails.push(rel+': only '+body.split(' ').length+' words');
    if(/undefined|\[object/.test(s))fails.push(rel+': template leak');
    if(d)descLens.push(d.length);
  }
}
walk(root);
descLens.sort((a,b)=>a-b);
console.log(n+' pages checked · description length median '+descLens[Math.floor(descLens.length/2)]+', min '+descLens[0]+', max '+descLens[descLens.length-1]);
fails.slice(0,10).forEach(x=>console.log('  FAIL '+x));
console.log(fails.length?'  '+fails.length+' FAILURES':'  ALL PASS');
