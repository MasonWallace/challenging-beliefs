const fs=require('fs');const P=f=>__dirname+'/'+f;
const C=n=>'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(n)+'?width=520';
const M={
'make-god.js':{
 "manuscripts-dead-sea-scrolls":{src:C("Qumran, Dead Sea, Palestine 42.jpg"),cap:"The caves at Qumran, where the Dead Sea Scrolls were found in 1947 (Wikimedia Commons)"},
 "archaeology-ot-corroboration":{src:C("Aramaic Inscription on Basalt Monument, Dan, 9th Century BC (43167226572).jpg"),cap:"The Tel Dan Stele — an enemy king boasts of defeating the 'House of David' (Wikimedia Commons)"},
 "manuscripts-nt-text":{src:C("Codex Vaticanus B, 2Thess. 3,11-18, Hebr. 1,1-2,2.jpg"),cap:"Codex Vaticanus, copied around 300–325 AD — the text you read today (Wikimedia Commons)"},
 "prophecy-isaiah53-psalm22":{src:C("Isaiah scroll at the Shrine of the Book.jpg"),cap:"The Great Isaiah Scroll, copied about 125 BC — the text demonstrably predates the events (Wikimedia Commons)"},
 "archaeology-nt-corroboration":{src:C("Pilate Inscription.JPG"),cap:"The Pilate Stone from Caesarea, naming Pontius Pilate, Prefect of Judaea (Wikimedia Commons)"},
 "existence-fine-tuning":{src:C("Hubble ultra deep field high rez edit1.jpg"),cap:"The Hubble Ultra Deep Field — every smudge is a galaxy (NASA/ESA)"}},
'make-messiah.js':{
 "isaiah-53-rabbinic-messianic-reading":{src:C("Isaiah scroll at the Shrine of the Book.jpg"),cap:"The Great Isaiah Scroll — chapter 53 existed a century before Jesus (Wikimedia Commons)"},
 "yoma-39b-forty-years":{src:C("Jerusalem Modell BW 2.JPG"),cap:"A model of the Second Temple, where the Yom Kippur signs are said to have failed for forty years (Wikimedia Commons)"},
 "atonement-after-the-temple":{src:C("Western wall and its square, jerusalem.jpg"),cap:"The Western Wall — what remains of the Temple platform, and the altar that has been gone since AD 70 (Wikimedia Commons)"},
 "nt-jewish-library":{src:C("Praha Spanish Synagogue Interior 01.jpg"),cap:"A synagogue interior — the setting in which the first Jesus-followers argued from the Tanakh (Wikimedia Commons)"},
 "jeremiah-31-new-covenant":{src:C("Torah ark in Beit El synagogue in Lod.jpg"),cap:"A Torah ark. The 'new covenant' is Jeremiah's phrase, made with Israel and Judah by name (Wikimedia Commons)"},
 "sukkah-52a-two-messiahs":{src:C("VilniusShasPage.jpg"),cap:"A page of the Vilna Talmud — where Sukkah 52a proposes two Messiahs (Wikimedia Commons)"}},
'make-jw.js':{
 "blood-ban-1945-innovation":{src:C("200227-M-YY851-1143.jpg"),cap:"A unit of donated blood. The prohibition dates from 1945, not from the movement's founding (Wikimedia Commons)"},
 "dates-1925-beth-sarim":{src:C("Watchtower, July 1925 (Russian Edition).jpg"),cap:"A 1925 Watchtower. That year was published as the return of Abraham, Isaac and Jacob (Wikimedia Commons)"},
 "avoid-dismiss-persecution-record":{src:C("Kennzeichen für Schutzhäftlinge in den Konzentrations Lagern Nazi Germany concentration camp prisoners' badges.jpg"),cap:"Nazi camp prisoner badges. The purple triangle marked Jehovah's Witnesses (Wikimedia Commons)"},
 "nwt-committee-anonymity-credentials":{src:C("Codex Vaticanus B, 2Thess. 3,11-18, Hebr. 1,1-2,2.jpg"),cap:"Codex Vaticanus — the kind of manuscript a translation committee works from (Wikimedia Commons)"}},
'make-bhi.js':{
 "deut-28-68-ships-to-egypt":{src:C("Brookes slave ship, British Library (cropped).jpg"),cap:"The Brookes, 1788 — the history Deuteronomy 28:68 is read against (Wikimedia Commons)"},
 "ben-ammi-dimona-community":{src:C("PikiWiki Israel 32040 Africans Hebrew Israelites in Dimona.JPG"),cap:"The African Hebrew Israelites of Jerusalem at Dimona — vegan, communal, peaceable (Dr. Avishai Teicher / PikiWiki Israel)"},
 "bloodline-versus-abrahams-offspring-by-faith":{src:C("Torah ark in Beit El synagogue in Lod.jpg"),cap:"A Torah ark. Paul's answer in Galatians: 'if ye be Christ's, then are ye Abraham's seed' (Wikimedia Commons)"}}
};
for(const [f,map] of Object.entries(M)){
  let s=fs.readFileSync(P(f),'utf8');
  if(s.includes('IMGMAP:')){console.log('skip',f);continue}
  s=s.replace('  GLOSSARY: MERGED, primer: PRIMER,','  GLOSSARY: MERGED, primer: PRIMER,\n  IMGMAP: '+JSON.stringify(map)+',');
  fs.writeFileSync(P(f),s);
  console.log('case photos added to '+f+': '+Object.keys(map).length);
}
