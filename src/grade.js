const syll=w=>{w=w.toLowerCase().replace(/[^a-z]/g,'');if(w.length<=3)return 1;
 w=w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/,'').replace(/^y/,'');
 return (w.match(/[aeiouy]{1,2}/g)||['x']).length;};
module.exports=function grade(t){
  t=String(t).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
  const sents=t.split(/(?<=[.!?]["'\u201d\u2019)\]]*)\s+/).filter(x=>x.trim().length>2);
  const S=sents.length||1;
  const words=t.split(/\s+/).filter(Boolean),W=words.length||1;
  const sy=words.reduce((a,w)=>a+syll(w),0), poly=words.filter(w=>syll(w)>=3).length;
  const g=((0.39*(W/S)+11.8*(sy/W)-15.59)+(0.4*((W/S)+100*(poly/W))))/2;
  return {grade:+g.toFixed(1), words:W, sents:S, wps:+(W/S).toFixed(1),
    longest:Math.max(...sents.map(s=>s.split(/\s+/).length))};
};
