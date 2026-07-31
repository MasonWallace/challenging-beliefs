const fs=require('fs');const P=f=>__dirname+'/'+f;
const C=n=>'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(n)+'?width=900';
const IMG={
'make-jw.js':{
  hero:{src:C("Jehovah's witnesses Kingdom Hall Hong Kong.png"),cap:"A Kingdom Hall. Two meetings a week, no cross, and — for most of the people inside — a hope that depends on one date."},
  paths:{foundation:C("Watchtower, July 1925 (Russian Edition).jpg"),
         jesus:C("Codex Sinaiticus, GA 01.jpg"),
         gospel:C("Kingdom Hall of Jehovah's Witnesses in Karlsruhe-Mühlburg in Baden-Württemberg.jpg"),
         fair:C("Kennzeichen für Schutzhäftlinge in den Konzentrations Lagern Nazi Germany concentration camp prisoners' badges.jpg")}},
'make-bhi.js':{
  hero:{src:C("Brookes slave ship, British Library (cropped).jpg"),cap:"The Brookes, 1788. This is the history Deuteronomy 28:68 is read against — and the reason the chapter has the force it has."},
  paths:{identity:C("Open Torah scroll.jpg"),
         race:C("Brookes slave ship, British Library (cropped).jpg"),
         movement:C("PikiWiki Israel 32040 Africans Hebrew Israelites in Dimona.JPG")}},
'make-messiah.js':{
  hero:{src:C("The Great Isaiah Scroll MS A (1QIsa) - Google Art Project.jpg"),cap:"The Great Isaiah Scroll, copied about 125 BC. Chapter 53 was already there, more than a century before Jesus was born."},
  paths:{servant:C("The Great Isaiah Scroll MS A (1QIsa) - Google Art Project.jpg"),
         clock:C("VilniusShasPage.jpg"),
         portrait:C("Targum.jpg"),
         covenant:C("Open Torah scroll.jpg")}},
'make-god.js':{
  hero:{src:C("Hubble ultra deep field high rez edit1.jpg"),cap:"The Hubble Ultra Deep Field. Every smudge is a galaxy — and the constants that allow any of it are the fine-tuning argument."},
  paths:{existence:C("Hubble ultra deep field high rez edit1.jpg"),
         easter:C("Pilate Inscription.JPG"),
         text:C("Codex Sinaiticus, GA 01.jpg"),
         hard:C("Pool of Siloam.jpg")}}
};
for(const [f,cfg] of Object.entries(IMG)){
  let s=fs.readFileSync(P(f),'utf8');
  if(s.includes('PATHIMG:')){console.log('skip',f);continue}
  s=s.replace('  GLOSSARY: MERGED, primer: PRIMER,',
    '  GLOSSARY: MERGED, primer: PRIMER,\n  PATHIMG: '+JSON.stringify(cfg.paths)+',');
  s=s.replace('const CORE = {','const CORE = {\n  hero: '+JSON.stringify(cfg.hero)+',');
  fs.writeFileSync(P(f),s);
  console.log('images added to',f);
}
