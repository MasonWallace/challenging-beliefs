/* Adds an optional plain-English "The background" block above every claim. */
const fs=require('fs');const P=f=>__dirname+'/'+f;
const OLD='<h2>${esc(d.title)}</h2>\n      <div class="ctop">';
const NEW='<h2>${esc(d.title)}</h2>\n      ${d.context?`<div class="bgbox"><div class="bglab">The background — in plain English</div>${paras(d.context,2)}</div>`:""}\n      <div class="ctop">';
const CSS=`
  .bgbox{background:linear-gradient(120deg,rgba(130,177,216,.07),transparent 60%),var(--panel);border:1px solid var(--line2,var(--line));border-left:3px solid var(--acc);border-radius:0 12px 12px 0;padding:15px 20px 17px;margin:0 0 20px}
  .bglab{font-size:.62rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--acc);margin-bottom:7px}
  .bgbox p{margin:0 0 9px;font-size:.93rem;line-height:1.72;color:var(--ink);opacity:.92}
  .bgbox p:last-child{margin-bottom:0}
`;
let n=0;
for(const sh of ['study.html','islam.html','jw.html','bhi.html','messiah.html','god.html']){
  let s=fs.readFileSync(P(sh),'utf8');
  if(s.includes('bgbox')){console.log(sh,'already patched');continue}
  if(!s.includes(OLD)){console.log('FAIL anchor',sh);process.exitCode=1;continue}
  s=s.replace(OLD,NEW).replace('</style>',CSS+'</style>');
  fs.writeFileSync(P(sh),s);n++;
}
console.log('context block added to',n,'shells');
