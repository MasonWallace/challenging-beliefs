const fs=require('fs');const P=f=>__dirname+'/'+f;
const check=(l,ok)=>{console.log((ok?'OK   ':'FAIL ')+l);if(!ok)process.exitCode=1};
const CSS=`
  /* --- mobile: settings must stay reachable, and wide blocks must scroll not push --- */
  @media (max-width:720px){
    .side .sideprog{display:block !important;padding:0 10px 10px}
    .setbox{margin-top:8px;max-width:none;flex-direction:row;flex-wrap:wrap;gap:6px}
    .setbox .setbtn.wide{width:auto;flex:1 1 100%}
    .setbox .setrow{flex:1 1 100%}
    .gtab{display:block;overflow-x:auto;max-width:100%;-webkit-overflow-scrolling:touch}
    .gtab td:first-child{white-space:normal}
    .chs,.actgrid,.tl,.tlact{max-width:100%;overflow-x:auto}
    #main table{max-width:100%}
    #main img,#main figure{max-width:100%}
    .corebox,.sa,.pb,.ptcard{max-width:100%;overflow-wrap:anywhere}
  }
`;
for(const sh of ['study.html','islam.html']){
  let s=fs.readFileSync(P(sh),'utf8');
  check(sh+' has mobile hide rule', s.includes('.side .sideprog{display:none}'));
  if(!s.includes('settings must stay reachable')) s=s.replace('</style>',CSS+'</style>');
  fs.writeFileSync(P(sh),s);
  console.log(sh+' mobile fixes applied');
}
