/* Quick answers, the visit page, Verses they quote and Guided paths become tabs
   inside Know them (renamed "More information") rather than sidebar entries. */
const fs=require('fs'),P=f=>__dirname+'/'+f;
const must=(s,a,b,w)=>{if(!s.includes(a))throw new Error('MISSING '+w);return s.split(a).join(b)};

const LESSONLABEL={'study.html':"When missionaries visit",'islam.html':"How they'll invite you"};

const NAV=`  const groups=[
    ["Start here",[
      ["core","The heart of it","3","The three strongest cases and the foundation argument — read this first"]]],
    ["For conversations",[
      ["share","Sharing Jesus","✝","How to evangelize here: approach, bridges, and cautions"],
      ["know","More information","8","Quick answers, their script, the verses they quote, guided paths, and how they live"]]],
    ["Reference",[
      ["timeline","Timeline",TLACTS.length+" acts","Their claims vs. the documented record, era by era"],
      ["glossary","Word guide",GLOSSARY.length,"Doctrine terms and insider vocabulary, explained"]]]
  ];`;

for(const f of ['study.html','islam.html']){
  let s=fs.readFileSync(P(f),'utf8');

  /* --- 1. sidebar --- */
  const a=s.indexOf('  const groups=[');
  const b=s.indexOf('\n  ];',a)+5;
  s=s.slice(0,a)+NAV+s.slice(b);

  /* --- 2. the four views become tabs; the tab bar re-renders --- */
  const OLDTABS=`  const tabs=[["kt-facts","✨ Did you know?"],["kt-week","🗓 Inside their week"],["kt-you","👀 What they're taught about you"]];
  if(KNOW.doctrine)tabs.push(["kt-doct","📖 Side by side"]);
  const on=state.knowTab||"kt-facts";`;
  const NEWTABS=`  const tabs=[["kt-facts","✨ Did you know?"],["kt-week","🗓 Inside their week"],["kt-you","👀 What they're taught about you"]];
  if(KNOW.doctrine)tabs.push(["kt-doct","📖 Side by side"]);
  /* four pages that used to sit in the sidebar now live here as tabs */
  const BORROW={"kt-theysay":renderTheySay,"kt-lessons":renderLessons,"kt-proofs":renderProofs,"kt-paths":renderPaths};
  const allTabs=tabs.concat([["kt-theysay","💬 Quick answers"],["kt-lessons","🚪 ${LESSONLABEL[f]}"],["kt-proofs","📜 Verses they quote"],["kt-paths","🧭 Guided paths"]]);
  const on=state.knowTab||"kt-facts";
  const ktBar=\`<div class="tabs2">\${allTabs.map(([k,l])=>\`<button class="ktab \${on===k?"on":""}" data-ktab="\${k}">\${esc(l)}</button>\`).join("")}</div>\`;
  const ktBind=()=>document.querySelectorAll("#main .ktab").forEach(t=>
    t.addEventListener("click",()=>{state.knowTab=t.dataset.ktab;renderKnow();window.scrollTo({top:0});}));
  if(BORROW[on]){
    BORROW[on]();
    const vh=$("#main").querySelector(".viewhead");
    if(vh)vh.insertAdjacentHTML("afterend",ktBar); else $("#main").insertAdjacentHTML("afterbegin",ktBar);
    ktBind();
    return;
  }`;
  s=must(s,OLDTABS,NEWTABS,f+' know tabs');

  /* the own-tab bar becomes the shared one */
  const OLDBAR='  <div class="tabs2">${tabs.map(([k,l])=>`<button class="tab2 ${on===k?"on":""}" data-pane="${k}">${l}</button>`).join("")}</div>';
  s=must(s,OLDBAR,'  ${ktBar}',f+' own tab bar');
  const OLDBIND='  document.querySelectorAll("#main .tab2").forEach(t=>t.addEventListener("click",()=>{state.knowTab=t.dataset.pane;}));';
  s=must(s,OLDBIND,'  ktBind();',f+' own tab bind');

  /* --- 3. old view names redirect, so hotkeys and back-navigation still work --- */
  const OLDR='  if(state.view==="paths")return renderPaths(),renderPreview();';
  const NEWR=`  const KTAB={paths:"kt-paths",theysay:"kt-theysay",lessons:"kt-lessons",proofs:"kt-proofs"};
  if(KTAB[state.view]){state.knowTab=KTAB[state.view];state.view="know";}
  if(state.view==="paths")return renderPaths(),renderPreview();`;
  s=must(s,OLDR,NEWR,f+' router redirect');

  /* --- 4. tab styling --- */
  const OLDCSS='  .tab2{font-size:.82rem;';
  s=must(s,OLDCSS,'  .ktab{font-size:.82rem;padding:10px 18px;border:1px solid transparent;border-bottom:0;border-radius:10px 10px 0 0;color:var(--muted);cursor:pointer;background:none;font-family:inherit}\n  .ktab.on{color:var(--ink);border-color:var(--line2);background:var(--panel)}\n  .ktab:hover{color:var(--ink)}\n'+OLDCSS,f+' ktab css');

  fs.writeFileSync(P(f),s);
  console.log('patched '+f);
}
