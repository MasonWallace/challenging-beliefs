/* On a phone the matrix was a 900px table squeezed into 390px: a sticky 216px
   structure column on the left and one clipped movement column on the right,
   the other three off-screen with nothing to say you could scroll. Below 700px
   it now stacks into one card per structure, each movement labelled. */
const fs=require('fs'),P=__dirname+'/parallels-src.html';
let s=fs.readFileSync(P,'utf8');
const must=(a,b,w)=>{if(!s.includes(a))throw new Error('MISSING '+w);s=s.split(a).join(b)};

/* --- 1. label every cell with its movement, so the stacked view can name it --- */
const MOV=['Mormonism','Islam',"Jehovah's Witnesses",'Hebrew Israelites'];
const tb0=s.indexOf('<tbody>'), tb1=s.indexOf('</tbody>');
if(tb0<0||tb1<0)throw new Error('tbody not found');
let body=s.slice(tb0,tb1);
let rows=0,cells=0;
body=body.replace(/<tr>([\s\S]*?)<\/tr>/g,(m,inner)=>{
  let i=0; rows++;
  const out=inner.replace(/<td(\s[^>]*)?>/g,(t,attr)=>{
    const label=MOV[i++]||''; cells++;
    return '<td'+(attr||'')+' data-m="'+label+'">';
  });
  return '<tr>'+out+'</tr>';
});
s=s.slice(0,tb0)+body+s.slice(tb1);

/* --- 2. the stacked layout --- */
const ANCHOR='tbody tr:last-child th,tbody tr:last-child td{border-bottom:0}';
must(ANCHOR, ANCHOR+`
/* phones: a table this wide cannot be read sideways — stack it */
@media (max-width:700px){
  .scroll{overflow-x:visible;border:0;background:none;border-radius:0}
  table{min-width:0;width:100%;display:block}
  thead{display:none}
  tbody,tbody tr,tbody th,tbody td{display:block;width:auto}
  tbody tr{border:1px solid var(--line);border-radius:14px;background:var(--panel);margin:0 0 14px;padding:15px 16px}
  tbody th{position:static;width:auto;min-width:0;background:none;border-right:0;border-bottom:0;padding:0 0 4px;font-size:1.06rem}
  tbody th small{font-size:.78rem;margin-top:5px}
  tbody td{padding:12px 0 0;margin-top:11px;border-top:1px solid var(--line);font-size:.9rem}
  tbody td::before{content:attr(data-m);display:block;font-family:var(--sans);font-size:.66rem;font-weight:700;
    letter-spacing:.13em;text-transform:uppercase;color:var(--gold);margin-bottom:6px}
  tbody td.no::before{color:var(--dim)}
}`, 'stacked css');

/* --- 3. two sentences that did not parse --- */
must('Four movements, born centuries and continents apart, that have never coordinated with each other — and that keep arriving at the same handful of structures. Read <b>down a column</b> and you see one movement. Read <b>across a row</b> and you see why this page exists.',
 'Mormonism, Islam, the Jehovah&rsquo;s Witnesses and the Hebrew Israelites began centuries apart, on different continents. None of them copied the others. Yet all four ended up built on the same six structures. Read <b>down a column</b> to follow one movement. Read <b>across a row</b> to see why this page exists.',
 'lede');
must('One angel, one man, no witnesses. Six structures four unrelated movements share — and the one test Scripture applies evenly to all of them.',
 'One angel, one man, no witnesses. Four movements that never met, built on the same six structures — and the one test Scripture applies evenly to all of them.',
 'meta description');

fs.writeFileSync(P,s);
console.log('labelled '+cells+' cells across '+rows+' rows; stacked layout + both sentences fixed');
