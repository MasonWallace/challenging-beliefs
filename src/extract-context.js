/* Regenerate every verses-*.json with 3 verses of context either side,
   flagging the actually-cited verses so the reader can highlight them. */
const fs=require('fs'),P=f=>__dirname+'/'+f;
const ot=require('./ot.json'), nt=require('./nt.json');
const books={}; [...ot.books,...nt.books].forEach(b=>books[b.book.toLowerCase()]=b);
books['psalm']=books['psalms'];
const PAD=3;
/* Book of Mormon + Doctrine and Covenants, so LDS references in prose open too */
let BOM=null,DC=null;
try{ BOM={}; for(const b of require('./bom.json').books) BOM[b.book.toLowerCase()]=b; }catch(e){ BOM=null; }
try{ DC=require('./dc.json').sections; }catch(e){ DC=null; }
const BOMBOOKS='(?:1 Nephi|2 Nephi|3 Nephi|4 Nephi|Jacob|Enos|Jarom|Omni|Words of Mormon|Mosiah|Alma|Helaman|Mormon|Ether|Moroni)';
function resolveLDS(orig){
  const c=orig.replace(/[\u2013\u2014]/g,'-').trim();
  const dc=c.match(/^D&C\s+(\d+)(?::([\d,\-\s]+))?$/);
  if(dc&&DC){
    const sec=DC.find(x=>String(x.section)===dc[1]); if(!sec)return null;
    const nums=[]; if(dc[2]) dc[2].split(',').forEach(part=>{const r=part.trim().match(/^(\d+)\s*-\s*(\d+)$/);
      if(r){for(let i=+r[1];i<=+r[2];i++)nums.push(i)} else if(/^\d+$/.test(part.trim()))nums.push(+part.trim())});
    const cited=new Set(nums);
    const all=sec.verses.map((v,i)=>({v:i+1,t:v.text}));
    if(!nums.length){ if(all.length>130)return null; return {ref:'D&C '+dc[1],cited:'',verses:all}; }
    const lo=Math.max(1,Math.min(...nums)-PAD), hi=Math.min(all.length,Math.max(...nums)+PAD);
    const verses=[]; for(let n=lo;n<=hi;n++){const v=all[n-1]; if(v)verses.push(cited.has(n)?{...v,hl:1}:v);}
    return verses.length?{ref:'D&C '+dc[1],cited:dc[2],verses}:null;
  }
  const m=c.match(new RegExp('^('+BOMBOOKS+')\\s+(\\d+)(?::([\\d,\\-\\s]+))?$'));
  if(!m||!BOM)return null;
  const bk=BOM[m[1].toLowerCase()]; if(!bk)return null;
  const ch=bk.chapters[parseInt(m[2],10)-1]; if(!ch)return null;
  const all=ch.verses.map((v,i)=>({v:i+1,t:v.text}));
  if(!m[3]){ if(all.length>130)return null; return {ref:bk.book+' '+ch.chapter,cited:'',verses:all}; }
  const nums=[]; m[3].split(',').forEach(part=>{const r=part.trim().match(/^(\d+)\s*-\s*(\d+)$/);
    if(r){for(let i=+r[1];i<=+r[2];i++)nums.push(i)} else if(/^\d+$/.test(part.trim()))nums.push(+part.trim())});
  if(!nums.length||nums.length>45)return null;
  const cited=new Set(nums);
  const lo=Math.max(1,Math.min(...nums)-PAD), hi=Math.min(all.length,Math.max(...nums)+PAD);
  const verses=[]; for(let n=lo;n<=hi;n++){const v=all[n-1]; if(v)verses.push(cited.has(n)?{...v,hl:1}:v);}
  return verses.length?{ref:bk.book+' '+ch.chapter,cited:m[3].trim(),verses}:null;
}
const SETS=[
 ['verses.json',      ()=>JSON.parse('['+fs.readFileSync(P('index.html'),'utf8').match(/const DATA=\[([\s\S]*?)\n\];/)[1]+']')],
 ['verses-islam.json',()=>JSON.parse(fs.readFileSync(P('islam-data.json'),'utf8'))],
 ['verses-jw.json',   ()=>JSON.parse(fs.readFileSync(P('jw-data.built.json'),'utf8'))],
 ['verses-bhi.json',  ()=>JSON.parse(fs.readFileSync(P('bhi-data.built.json'),'utf8'))],
 ['verses-messiah.json',()=>JSON.parse(fs.readFileSync(P('messiah-data.built.json'),'utf8'))],
 ['verses-god.json',  ()=>JSON.parse(fs.readFileSync(P('god-data.built.json'),'utf8'))]
];
for(const [out,load] of SETS){
  const data=load();
  const cites=new Set();
  data.forEach(d=>['bible','tanakh','nt'].forEach(f=>(d[f]||[]).forEach(c=>cites.add(c))));
  /* also every reference written into the prose, so hovering it in the text works */
  const BOOKS='(?:[1-3]\\s)?(?:Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|Samuel|Kings|Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|Corinthians|Galatians|Ephesians|Philippians|Colossians|Thessalonians|Timothy|Titus|Philemon|Hebrews|James|Peter|Jude|Revelation)';
  const PROSE=new RegExp('\\b('+BOOKS+'\\s+\\d+:\\d+(?:[\\-\\u2013]\\d+(?::\\d+)?)?)','g');
  data.forEach(d=>{
    const txt=[d.claim,d.response,d.rationale,d.talk,...(d.plain||[]).map(b=>b.d)].filter(Boolean).join(' ').replace(/<[^>]+>/g,' ');
    let m; while((m=PROSE.exec(txt))) cites.add(m[1].trim());
    const PROSE2=new RegExp('\\b('+BOOKS+'\\s+\\d+)(?![:\\d])','g');
    while((m=PROSE2.exec(txt))) cites.add(m[1].trim());
    const LDSRE=new RegExp('\\b((?:'+BOMBOOKS+'|D&C)\\s+\\d+(?::\\d+(?:[\\-\\u2013]\\d+)?)?)','g');
    while((m=LDSRE.exec(txt))) cites.add(m[1].trim());
  });
  const prev=fs.existsSync(P(out))?JSON.parse(fs.readFileSync(P(out),'utf8')):{};
  /* keep non-Bible entries (Book of Mormon, D&C, Quran) that other extractors produced */
  const res={}; let ok=0,ctx=0;
  for(const [k,v] of Object.entries(prev)) res[k]=v;
  cites.forEach(orig=>{
    const lds=resolveLDS(orig);
    if(lds){ if(!res[orig]){res[orig]=lds; ok++;} return; }
    const c=orig.replace(/[\u2013\u2014]/g,'-').replace(/\s*\(.*?\)\s*/g,'').trim();

    /* cross-chapter: "Isaiah 52:13-53:12" */
    const cross=c.match(/^([1-3]?\s?[A-Za-z ]+?)\s+(\d+):(\d+)\s*-\s*(\d+):(\d+)$/);
    if(cross){
      const bk=books[cross[1].trim().toLowerCase()]; if(!bk)return;
      const c1=+cross[2],v1=+cross[3],c2=+cross[4],v2=+cross[5];
      const verses=[]; let label=null;
      for(let cn=c1;cn<=c2;cn++){
        const ch=bk.chapters[cn-1]; if(!ch)return;
        if(!label)label=bk.book+' '+c1+'-'+c2;
        const from=(cn===c1?v1:1), to=(cn===c2?v2:ch.verses.length);
        for(let n=from;n<=to;n++){const v=ch.verses[n-1]; if(v)verses.push({v:cn+':'+n,t:v.text,hl:1});}
      }
      if(!verses.length||verses.length>60)return;
      res[orig]={ref:label,cited:c,verses}; ok++; return;
    }

    /* chapter-only: "Isaiah 53", "Romans 11" — show the chapter, nothing highlighted */
    const chOnly=c.match(/^([1-3]?\s?[A-Za-z ]+?)\s+(\d+)$/);
    if(chOnly){
      const bk=books[chOnly[1].trim().toLowerCase()]; if(!bk)return;
      const ch=bk.chapters[parseInt(chOnly[2],10)-1]; if(!ch)return;
      if(ch.verses.length>130)return;
      res[orig]={ref:bk.book+' '+ch.chapter,cited:'',verses:ch.verses.map((v,i)=>({v:i+1,t:v.text}))};
      ok++; return;
    }

    const mm=c.match(/^([1-3]?\s?[A-Za-z ]+?)\s+(\d+):([\d,\-\s]+)$/); if(!mm)return;
    const bk=books[mm[1].trim().toLowerCase()]; if(!bk)return;
    const ch=bk.chapters[parseInt(mm[2],10)-1]; if(!ch)return;
    const nums=[]; mm[3].split(',').forEach(part=>{const r=part.trim().match(/^(\d+)\s*-\s*(\d+)$/);
      if(r){for(let i=+r[1];i<=+r[2];i++)nums.push(i)} else if(/^\d+$/.test(part.trim()))nums.push(+part.trim())});
    if(!nums.length||nums.length>45)return;
    const lo=Math.max(1,Math.min(...nums)-PAD), hi=Math.min(ch.verses.length,Math.max(...nums)+PAD);
    const cited=new Set(nums);
    const verses=[];
    for(let n=lo;n<=hi;n++){const v=ch.verses[n-1]; if(!v)continue;
      verses.push(cited.has(n)?{v:n,t:v.text,hl:1}:{v:n,t:v.text});}
    if(!verses.some(v=>v.hl))return;
    res[orig]={ref:bk.book+' '+ch.chapter,cited:mm[3].trim(),verses};
    ok++; if(verses.length>nums.length)ctx++;
  });
  fs.writeFileSync(P(out),JSON.stringify(res));
  const before=Object.keys(prev).length;
  console.log(out.padEnd(22)+ok+'/'+cites.size+' refs resolved  ('+before+' before)  '+ctx+' now carry surrounding context');
}
