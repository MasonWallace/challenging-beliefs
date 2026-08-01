/* The Quick/Full toggle now only swapped the plain blocks for the original claim
   paragraph — everything else was visible either way. Drop the setting; keep the
   claim behind a small expander so nothing is lost. */
const fs=require('fs'),P=f=>__dirname+'/'+f;
const check=(l,ok)=>{console.log((ok?'OK   ':'FAIL ')+l);if(!ok)process.exitCode=1};
const CSS=`
  details.claimfull{margin:14px 0 0;border-top:1px solid var(--line);padding-top:10px}
  details.claimfull>summary{cursor:pointer;list-style:none;font-size:.68rem;font-weight:700;
    letter-spacing:.14em;text-transform:uppercase;color:var(--muted);padding:2px 0}
  details.claimfull>summary::-webkit-details-marker{display:none}
  details.claimfull>summary::after{content:" →"}
  details.claimfull[open]>summary::after{content:" ↓"}
  details.claimfull>summary:hover{color:var(--ink)}
  details.claimfull .claim{margin-top:10px}
  details.claimfull .claim p{font-size:.9rem;color:var(--muted);line-height:1.75}
`;
for(const sh of ['study.html','islam.html']){
  let s=fs.readFileSync(P(sh),'utf8');
  if(!s.includes('details.claimfull')) s=s.replace('</style>',CSS+'</style>');

  /* always show the plain blocks when a case has them; claim moves into an expander */
  const OLD='<div class="claimcol">${(d.plain&&d.plain.length&&!store.full)?plainHtml(d):`<div class="dlab red" style="margin-top:0">The claim</div><div class="claim">${paras(d.claim)}</div>`}<div id="versebox"></div></div>';
  check(sh+' claim column',s.includes(OLD));
  s=s.replace(OLD,'<div class="claimcol">${(d.plain&&d.plain.length)?`${plainHtml(d)}<details class="claimfull"><summary>The claim, stated in full</summary><div class="claim">${paras(d.claim)}</div></details>`:`<div class="dlab red" style="margin-top:0">The claim</div><div class="claim">${paras(d.claim)}</div>`}<div id="versebox"></div></div>');

  /* drop the toggle button and the "back to quick" link */
  const BTN=s.match(/<button id="simplebtn"[\s\S]*?<\/button>\s*/);
  check(sh+' toggle button',!!BTN);
  if(BTN) s=s.replace(BTN[0],'');
  s=s.replace('$("#simplebtn").addEventListener("click",()=>{store.full=!store.full;localStorage.setItem(KEY_FULL,store.full?"1":"0");renderNav();render();});\n  ','');
  s=s.replace('${(d.plain&&d.plain.length&&store.full)?`<button class="quickback" id="toquick">← Show the quick summary</button>`:""}','');
  s=s.replace('const tq=$("#toquick");if(tq)tq.addEventListener("click",()=>{store.full=false;localStorage.setItem(KEY_FULL,"0");renderNav();render();});\n  ','');

  fs.writeFileSync(P(sh),s);
  console.log(sh+' Quick/Full toggle removed; claim kept behind an expander');
}
