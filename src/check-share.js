/* Usage: node check-share.js <slug> [slug2 ...] */
const fs=require('fs'),grade=require('./grade.js');
const S=require('./strip.js');
const strip=t=>S.measurable(t);
const OK=new Set(['pb-h','pb-grid','pb','do','dont','num','saybox','who','pd','sh-open','sh-att','sa','sat','sh-list','start','relrow']);
let bad=0;
for(const slug of process.argv.slice(2)){
  const f=__dirname+'/share-'+slug+'.json';
  if(!fs.existsSync(f)){console.log('MISSING share-'+slug+'.json');bad++;continue}
  const o=JSON.parse(fs.readFileSync(f,'utf8'));
  for(const [k,v] of Object.entries(o)){
    const body=strip(v.html);
    const r=grade(body), words=body.split(/\s+/).filter(Boolean).length;
    const tags=[...String(v.html).matchAll(/<([a-z0-9]+)([^>]*)>/gi)].map(m=>m[1].toLowerCase());
    const badTags=[...new Set(tags)].filter(t=>!['div','p','h4','span','ol','li','b','i','button','br'].includes(t));
    const classes=[...String(v.html).matchAll(/class="([^"]+)"/g)].flatMap(m=>m[1].split(/\s+/));
    const badCls=[...new Set(classes)].filter(c=>!OK.has(c));
    const paths=[...String(v.html).matchAll(/data-goto-path="([^"]+)"/g)].map(m=>m[1]);
    const fails=[];
    if(r.grade>9.9)fails.push('grade '+r.grade);
    if(r.wps>16)fails.push('avg '+r.wps+'w');
    if(r.longest>30)fails.push('longest '+r.longest+'w');
    if(words<900||words>1600)fails.push(words+' words');
    if(badTags.length)fails.push('tags: '+badTags.join(','));
    if(badCls.length)fails.push('classes: '+badCls.join(','));
    if(!paths.length)fails.push('no data-goto-path');
    if(!v.title||!v.intro)fails.push('missing title/intro');
    console.log((fails.length?'FAIL ':'PASS ')+k.padEnd(9)+'g'+String(r.grade).padStart(5)+' avg'+String(r.wps).padStart(5)+'w max'+String(r.longest).padStart(3)+'w  '+String(words).padStart(4)+' words  path='+(paths[0]||'—')+(fails.length?'   ← '+fails.join('; '):''));
    if(fails.length)bad++;
  }
}
console.log(bad?bad+' FAILURES':'ALL PASS');
