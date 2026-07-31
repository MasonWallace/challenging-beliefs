/* Settings stack: Simplified on its own row above Light mode + Replay tour. */
const fs=require('fs');const P=f=>__dirname+'/'+f;
const check=(l,ok)=>{console.log((ok?'OK   ':'FAIL ')+l);if(!ok)process.exitCode=1};
const NEW = '$("#sideprog").innerHTML=`\n' +
'    <div class="setbox">\n' +
'      <button id="simplebtn" class="setbtn wide${store.simple?" on":""}" title="Explains every case in plain, high-school-level English above the claim">${store.simple?"◆":"◇"} Simplified <b>${store.simple?"on":"off"}</b></button>\n' +
'      <div class="setrow">\n' +
'        <button id="themebtn" class="setbtn">◐ ${document.documentElement.dataset.theme==="light"?"Dark":"Light"}</button>\n' +
'        <button id="tourbtn" class="setbtn">✦ Tour</button>\n' +
'      </div>\n' +
'    </div>`;';
const CSS = `
  .setbox{margin-top:16px;display:flex;flex-direction:column;gap:7px;max-width:210px}
  .setrow{display:flex;gap:7px}
  .setrow .setbtn{flex:1}
  .setbtn{background:none;border:1px solid var(--line2);color:var(--muted);border-radius:8px;padding:6px 10px;
    font-size:.72rem;font-family:inherit;cursor:pointer;text-align:center;white-space:nowrap;transition:border-color .15s,color .15s}
  .setbtn:hover{border-color:var(--acc);color:var(--ink)}
  .setbtn b{font-weight:700;letter-spacing:.04em}
  .setbtn.wide{width:100%}
  .setbtn.on{border-color:var(--acc);color:var(--acc)}
  .setbtn.on:hover{color:var(--ink)}
`;
for(const sh of ['study.html','islam.html']){
  let s=fs.readFileSync(P(sh),'utf8');
  if(s.includes('class="setbox"')){console.log(sh,'already');continue}
  const i=s.indexOf('$("#sideprog").innerHTML=`');
  check(sh+' sideprog',i>=0);
  const end=s.indexOf('`;',i)+2;
  s=s.slice(0,i)+NEW+s.slice(end);
  if(!s.includes('.setbox{')) s=s.replace('</style>',CSS+'</style>');
  fs.writeFileSync(P(sh),s);
  console.log(sh+' settings restacked');
}
