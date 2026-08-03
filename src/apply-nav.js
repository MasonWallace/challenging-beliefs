/* Consolidate the conversation tools, the guided paths and Know them into one
   group. "Start here" keeps the single entry point; Reference keeps the lookups. */
const fs=require('fs'),P=f=>__dirname+'/'+f;
const build=lessons=>`  const groups=[
    ["Start here",[
      ["core","The heart of it","3","The three strongest cases and the foundation argument — read this first"]]],
    ["More information",[
      ["theysay","Quick answers",THEYSAY.length,"The lines you'll actually hear from them — each with a two-sentence response"],
      ${lessons},
      ["proofs","Verses they quote",PROOFS.length,"Bible verses they cite at you — with the context that answers them"],
      ["share","Sharing Jesus","✝","How to evangelize here: approach, bridges, and cautions"],
      ["paths","Guided paths",PATHS.length,"Curated reading orders — pick a goal and follow the sequence"],
      ["know","Know them","4","Their daily life, surprising true facts, and how they're taught to see you"]]],
    ["Reference",[
      ["timeline","Timeline",TLACTS.length+" acts","Their claims vs. the documented record, era by era"],
      ["glossary","Word guide",GLOSSARY.length,"Doctrine terms and insider vocabulary, explained"]]]
  ];`;
const LESSONS={
 'study.html':`["lessons","When missionaries visit",LESSONS.length,"Their 5-lesson script — and the question to ask at each step"]`,
 'islam.html':`["lessons","How they'll invite you",LESSONS.length,"Da'wah — the 6-step invitation Muslims are taught to give — and the question to ask at each step"]`};
for(const f of ['study.html','islam.html']){
  let s=fs.readFileSync(P(f),'utf8');
  const a=s.indexOf('  const groups=[');
  if(a<0)throw new Error(f+': groups not found');
  const b=s.indexOf('\n  ];',a)+5;
  s=s.slice(0,a)+build(LESSONS[f])+s.slice(b);
  fs.writeFileSync(P(f),s);
  console.log('patched '+f);
}
