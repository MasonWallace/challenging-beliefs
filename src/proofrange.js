/* A proof card quotes a fragment and answers it from a verse a few lines later.
   Show one continuous passage covering both, so the reader sees the answer in
   its place instead of being told to go and look it up. */
module.exports = function combined(v, refs){
  const m=String(v).match(/^(.+?)\s+(\d+):(\d+)(?:\s*[-–]\s*(\d+))?$/);
  if(!m)return null;
  const book=m[1].trim(), ch=m[2];
  let lo=+m[3], hi=+(m[4]||m[3]);
  const plain=String(refs||'').replace(/<[^>]+>/g,' ');
  let found=false;
  for(const part of plain.split(/[·;,]/)){
    const r=part.trim().match(/^(.+?)\s+(\d+):(\d+)(?:\s*[-–]\s*(\d+))?$/);
    if(!r)continue;
    if(r[1].trim().toLowerCase()!==book.toLowerCase()||r[2]!==ch)continue;
    lo=Math.min(lo,+r[3]); hi=Math.max(hi,+(r[4]||r[3])); found=true;
  }
  return found?book+' '+ch+':'+lo+'-'+hi:null;
};
