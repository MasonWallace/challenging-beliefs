/* Regenerate every verses-*.json with 3 verses of context either side,
   flagging the actually-cited verses so the reader can highlight them. */
const fs=require('fs'),P=f=>__dirname+'/'+f;
const ot=require('./ot.json'), nt=require('./nt.json');
const books={}; [...ot.books,...nt.books].forEach(b=>books[b.book.toLowerCase()]=b);
books['psalm']=books['psalms'];
const PAD=3;
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
  });
  const prev=fs.existsSync(P(out))?JSON.parse(fs.readFileSync(P(out),'utf8')):{};
  /* keep non-Bible entries (Book of Mormon, D&C, Quran) that other extractors produced */
  const res={}; let ok=0,ctx=0;
  for(const [k,v] of Object.entries(prev)) res[k]=v;
  cites.forEach(orig=>{
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
