/* Independent check of an agent's refwhy work — the spec's rules, not the agent's word.
   1. no reference quoted in the case prose was dropped
   2. no generic filler reasons
   3. no reason merely restates the citation */
const fs=require('fs');
const F={mormon:null,islam:'islam-data.json',jw:'jw-data.json',bhi:'bhi-data.json',messiah:'messiah-data.json',god:'god-data.json'};
const FIELDS=['bible','bom','quran','hadith','tanakh','nt','wt','rabbinic'];
const GENERIC=/^(relevant|background|supports|see |context|cited|referenced|this (verse|passage) (is|shows))/i;
const FILLER=/\b(relevant background|supports the argument|see context|for context|general background)\b/i;
for(const slug of process.argv.slice(2)){
  const w=JSON.parse(fs.readFileSync(__dirname+'/refwhy-'+slug+'.json','utf8'));
  const d=F[slug]?JSON.parse(fs.readFileSync(__dirname+'/'+F[slug],'utf8'))
    :JSON.parse('['+fs.readFileSync(__dirname+'/index.html','utf8').match(/const DATA=\[([\s\S]*?)\n\];/)[1]+']');
  const byId={};d.forEach(x=>byId[x.id]=x);
  let droppedButQuoted=[],generic=[],restate=[],empty=[],nRe=0,nDr=0,against=0;
  for(const [id,o] of Object.entries(w)){
    const c=byId[id]; if(!c)continue;
    const prose=[c.claim,c.response,c.rationale,(c.plain||[]).map(b=>b.d).join(' ')].filter(Boolean).join(' ');
    /* exact citation only — "Hebrews 1:10" must not match inside "Hebrews 1:10-12" */
    const cited=r=>new RegExp(r.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![\\d:\\-\\u2013])').test(prose);
    for(const r of (o.drop||[])){ nDr++; if(cited(r))droppedButQuoted.push(id+' → '+r) }
    const kept=Object.entries(o.why||{});
    if(!kept.length&&FIELDS.reduce((a,k)=>a+(c[k]||[]).length,0))empty.push(id);
    for(const [ref,why] of kept){
      nRe++;
      if(GENERIC.test(why.trim())||FILLER.test(why))generic.push(id+' → '+ref+': '+why.slice(0,60));
      const bare=why.replace(/[^a-z0-9 ]/gi,' ').trim().toLowerCase();
      if(bare.startsWith(ref.replace(/[^a-z0-9 ]/gi,' ').trim().toLowerCase())&&why.split(/\s+/).length<9)restate.push(id+' → '+ref+': '+why);
      if(/cuts against|supports the other side|strong for the (jewish|muslim|witness|latter|sceptic|skeptic)|against you|not probative|their best|they are right/i.test(why))against++;
    }
  }
  console.log('\n'+slug.toUpperCase()+'  '+Object.keys(w).length+' cases · '+nRe+' reasons · '+nDr+' dropped · '+against+' flagged as helping the other side');
  const show=(t,a)=>{console.log('  '+t+': '+a.length);a.slice(0,5).forEach(x=>console.log('     '+x))};
  show('dropped though quoted in the prose (VIOLATION)',droppedButQuoted);
  show('generic/filler reasons',generic);
  show('reasons that merely restate the citation',restate);
  show('cases left with no reasons at all',empty);
}
