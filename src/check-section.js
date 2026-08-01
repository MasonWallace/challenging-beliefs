/* Self-check for a section's rewrite. Usage: node check-section.js <slug> */
const fs=require('fs'),grade=require('./grade.js');
const slug=process.argv[2];
const QUOTE=/["“‘']([^"”’']{30,})["”’']/g;
const strip=t=>String(t).replace(QUOTE,' a quoted passage. ').replace(/<[^>]+>/g,' ');
const P=f=>__dirname+'/'+f;
const plain=fs.existsSync(P('plain-'+slug+'.json'))?JSON.parse(fs.readFileSync(P('plain-'+slug+'.json'),'utf8')):{};
const full=fs.existsSync(P('full-'+slug+'.json'))?JSON.parse(fs.readFileSync(P('full-'+slug+'.json'),'utf8')):{};
let bad=0;
console.log('PLAIN  limits: grade<=7.9  avg sentence<=14w  longest<=25w');
for(const [id,blocks] of Object.entries(plain)){
  const r=grade(strip(blocks.map(b=>b.d).join(' ')));
  const jargon=/Graded <b>|Graded [A-Z]/.test(blocks.map(b=>b.d).join(' '));
  const hasSay=blocks.some(b=>b.say);
  const bad1=r.grade>7.9||r.wps>14||r.longest>25||jargon||!hasSay;
  if(bad1){bad++;console.log('  FAIL '+id+'  g'+r.grade+' avg'+r.wps+' max'+r.longest+(jargon?'  [grading jargon]':'')+(hasSay?'':'  [no What to say block]'));}
}
console.log('FULL   limits: grade<=10.9  avg sentence<=20w  longest<=35w');
for(const [id,o] of Object.entries(full)){
  const r=grade(strip([o.claim,o.response,o.rationale].filter(Boolean).join(' ')));
  if(r.grade>10.9||r.wps>20||r.longest>35){bad++;console.log('  FAIL '+id+'  g'+r.grade+' avg'+r.wps+' max'+r.longest);}
}
console.log(bad===0?'ALL PASS ('+Object.keys(plain).length+' plain, '+Object.keys(full).length+' full)'
  :bad+' FAILURES — fix and re-run ('+Object.keys(plain).length+' plain, '+Object.keys(full).length+' full)');
