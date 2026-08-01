/* 1. Plain blocks take the place of "The claim" — no expander; the image, defense,
      verdict, conversation and sources all stay visible where they were.
   2. Plain text may use <b> and <i>; they were being escaped and printed literally.
   3. One clean verse handler: hover to peek, click to pin. */
const fs = require('fs');
const P = f => __dirname + '/' + f;
const check = (l, ok) => { console.log((ok ? 'OK   ' : 'FAIL ') + l); if (!ok) process.exitCode = 1; };

const PLAINHTML = `function plainHtml(d){
  const rt=t=>glossify(emphasize(esc(t).replace(/&lt;(\\/?)(b|i)&gt;/g,"<$1$2>")));
  return (d.plain||[]).map(b=>{
    const ss=splitSentences(b.d),ps=[];
    for(let i=0;i<ss.length;i+=2)ps.push("<p>"+rt(ss.slice(i,i+2).join(" "))+"</p>");
    return \`<div class="pblk\${b.say?" say":""}"><div class="plab">\${esc(b.t)}</div>\${ps.join("")}</div>\`;
  }).join("");
}
`;

const VERSEJS = `let pinnedCite=null;
  const clearVerse=()=>{pinnedCite=null;const b=$("#versebox");if(b)b.innerHTML="";
    document.querySelectorAll(".chip.open,.chip.peek").forEach(x=>x.classList.remove("open","peek"));};
  const showVerse=(ch,pin)=>{
    const cite=ch.dataset.cite,v=VERSES[cite],box=$("#versebox");
    if(!box)return;
    document.querySelectorAll(".chip.open,.chip.peek").forEach(x=>x.classList.remove("open","peek"));
    ch.classList.add(pin?"open":"peek");
    if(pin)pinnedCite=cite;
    if(!v||!v.verses){
      box.innerHTML=\`<div class="versebox vmiss"><div class="vr"><span>\${esc(cite)}</span><button data-close>✕ close</button></div><div class="vwhy">This reference is cited by the claim but isn't in the built-in reader — open it in your own Bible.</div></div>\`;
    }else{
      const side=ch.closest("[data-side]")?ch.closest("[data-side]").dataset.side:"";
      const why=findWhy(d,cite);
      const whyHtml=why?\`<b>Why it's cited:</b> \${esc(why)}\`:ROLENOTE(side);
      const anyHl=v.verses.some(x=>x.hl);
      const ctx=(anyHl&&v.verses.some(x=>!x.hl))?\` <span class="vcited">— \${esc(v.ref)}, with the verses either side</span>\`:"";
      box.innerHTML=\`<div class="versebox"><div class="vr"><span>\${esc(cite)}\${ctx}</span><button data-close>✕ close</button></div><div class="vtext">\${v.verses.map(x=>\`<span class="vs\${(x.hl||!anyHl)?" hl":""}"><span class="vnum">\${x.v}</span>\${(x.hl&&anyHl&&v.verses.some(y=>!y.hl))?\`<em>\${esc(x.t)}</em>\`:esc(x.t)} </span>\`).join("")}</div><div class="vwhy">\${whyHtml}</div></div>\`;
    }
    const cb=box.querySelector("[data-close]");if(cb)cb.addEventListener("click",clearVerse);
    if(pin)requestAnimationFrame(()=>box.scrollIntoView({behavior:"smooth",block:"nearest"}));
  };
  const canHover=window.matchMedia("(hover:hover)").matches;
  document.querySelectorAll(".chip").forEach(ch=>{
    ch.addEventListener("click",()=>{
      if(ch.dataset.ext){window.open(ch.dataset.ext,"_blank");return;}
      if(pinnedCite===ch.dataset.cite){clearVerse();return;}
      showVerse(ch,true);
    });
    if(!ch.dataset.ext&&canHover){
      ch.addEventListener("mouseenter",()=>{if(!pinnedCite)showVerse(ch,false);});
      ch.addEventListener("mouseleave",()=>{if(!pinnedCite)clearVerse();});
    }
  });
  `;

for (const sh of ['study.html', 'islam.html']) {
  let s = fs.readFileSync(P(sh), 'utf8');

  /* --- plainHtml that allows <b>/<i> --- */
  const pi = s.indexOf('function plainHtml(d){');
  if (s.includes('const rt=t=>glossify')) { console.log(sh + ' plainHtml already ok'); } else
  check(sh + ' plainHtml', pi >= 0);
  const pEnd = s.indexOf('\n}\n', pi) + 3;
  s = s.slice(0, pi) + PLAINHTML + s.slice(pEnd);

  /* --- remove the expander wrapper --- */
  const OPEN = '${(d.plain&&d.plain.length&&!store.full)?`<div class="plainwrap">${plainHtml(d)}<details class="fullcase"><summary>Read the full case — sources, the defense in their own words, and the verdict</summary><div class="fullbody">`:(d.plain&&d.plain.length)?`<button class="quickback" id="toquick">← Show the quick summary</button>`:""}';
  check(sh + ' expander open', s.includes(OPEN));
  s = s.replace(OPEN, '${(d.plain&&d.plain.length&&store.full)?`<button class="quickback" id="toquick">← Show the quick summary</button>`:""}');
  const CLOSE = '\n    ${(d.plain&&d.plain.length&&!store.full)?`</div></details></div>`:""}';
  check(sh + ' expander close', s.includes(CLOSE));
  s = s.replace(CLOSE, '');

  /* --- plain blocks sit where the claim was --- */
  const CLAIM = '<div class="claimcol"><div class="dlab red" style="margin-top:0">The claim</div><div class="claim">${paras(d.claim)}</div><div id="versebox"></div></div>';
  check(sh + ' claim column', s.includes(CLAIM));
  s = s.replace(CLAIM, '<div class="claimcol">${(d.plain&&d.plain.length&&!store.full)?plainHtml(d):`<div class="dlab red" style="margin-top:0">The claim</div><div class="claim">${paras(d.claim)}</div>`}<div id="versebox"></div></div>');

  /* --- one clean verse handler --- */
  const vi = s.indexOf('let __pinned=null;');
  check(sh + ' old verse handler', vi >= 0);
  const vEnd = s.indexOf('document.querySelectorAll(".cimg-x")', vi);
  check(sh + ' verse handler end', vEnd > vi);
  s = s.slice(0, vi) + VERSEJS + s.slice(vEnd);

  /* the role note differs per section — lift it into a helper the handler can call */
  if (!s.includes('function ROLENOTE')) {
    const note = sh === 'study.html'
      ? 'function ROLENOTE(side){return side==="bom"?"<b>Role:</b> this is the Book of Mormon passage the claim examines.":"<b>Role:</b> this is the biblical standard the claim measures against.";}\n'
      : 'function ROLENOTE(side){return side==="quran"?"<b>Role:</b> this is the Quran passage the claim examines.":"<b>Role:</b> this is the biblical standard the claim measures against.";}\n';
    s = s.replace('function plainHtml(d){', note + 'function plainHtml(d){');
  }

  fs.writeFileSync(P(sh), s);
  console.log(sh + ' case restructured');
}
