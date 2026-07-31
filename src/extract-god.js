const fs=require('fs');
const SD='/Users/masonwallace/.claude/projects/-Users-masonwallace-CAIAC-caiac-n8n-workflows/8454f02e-9c8f-4e0f-94ec-0cba23f85380/subagents/';
const id=process.argv[2], out=process.argv[3];
const lines=fs.readFileSync(SD+'agent-'+id+'.jsonl','utf8').split('\n').filter(Boolean);
let txt='';
for(const l of lines){ let o; try{o=JSON.parse(l)}catch(e){continue}
  const m=o.message; if(!m||m.role!=='assistant')continue;
  for(const c of (m.content||[])) if(c.type==='text') txt+=c.text;
}
const fences=[...txt.matchAll(/```json\s*([\s\S]*?)```/g)].map(m=>m[1]);
let body = fences.length ? fences[fences.length-1] : (txt.match(/```json\s*([\s\S]*)$/)||[,txt])[1];
body=body.replace(/&amp;/g,'&');
/* escape unescaped inner double quotes inside string literals */
function repair(s){
  let o='', inStr=false;
  for(let i=0;i<s.length;i++){
    const c=s[i];
    if(!inStr){ o+=c; if(c==='"') inStr=true; continue; }
    if(c==='\\'){ o+=c+(s[i+1]||''); i++; continue; }
    if(c==='"'){
      // look ahead: a real closing quote is followed by ws then , : } ]  (or EOF)
      let j=i+1; while(j<s.length && /\s/.test(s[j])) j++;
      if(j>=s.length || ',:}]'.includes(s[j])) { o+=c; inStr=false; }
      else o+='\\"';
      continue;
    }
    if(c==='\n'){ o+='\\n'; continue; }
    o+=c;
  }
  return o;
}
let obj;
try{ obj=JSON.parse(body); console.log('parsed clean'); }
catch(e){ obj=JSON.parse(repair(body)); console.log('parsed after repair'); }
const cases=obj.cases||obj;
fs.writeFileSync(__dirname+'/'+out, JSON.stringify(cases));
console.log(out,'cases:',cases.length);
console.log('cats:',[...new Set(cases.map(c=>c.category))].join(','));
console.log('keys:',Object.keys(cases[0]).join(','));
console.log('verdicts:',[...new Set(cases.map(c=>c.verdict))].join(','), '| avoid:',cases.filter(c=>c.avoid).length);
