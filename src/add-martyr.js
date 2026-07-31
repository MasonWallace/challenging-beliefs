const fs=require('fs'),P=f=>__dirname+'/'+f;
const d=JSON.parse(fs.readFileSync(P('god-data.json'),'utf8'));
if(d.some(x=>x.id==='resurrection-willing-to-die')){console.log('already present');process.exit(0);}
d.push({
 id:'resurrection-willing-to-die',
 title:"'They died for it' — the argument in the only form that works",
 category:'resurrection-case',
 claim:"The disciples suffered and in several cases died rather than deny that they had seen Jesus alive. People will die for something they sincerely believe, but nobody dies for something they know they made up — and these particular people were in a position to know.",
 response:"The skeptic's reply comes in three parts, and the first two are right. (1) Sincerity proves nothing about truth. The 9/11 hijackers died for their faith; so have Heaven's Gate members, Jim Jones's congregation, and martyrs of every religion on earth. Willingness to die establishes that a person believes what they are saying — nothing more. (2) The historical record for most of the apostles is very thin. Only one apostolic death is recorded in the New Testament: James son of Zebedee, beheaded by Herod Agrippa I around AD 44 (Acts 12:2). The vivid traditions — Thomas speared in India, Bartholomew flayed alive, Andrew on an X-shaped cross, Peter crucified upside down — come from apocryphal Acts written between the second and fourth centuries, which also contain talking animals and resurrected fish. Sean McDowell's <i>The Fate of the Apostles</i> (2015) is the most thorough treatment by a Christian scholar, and he grades the evidence honestly: he judges the martyrdoms of Peter, Paul, James son of Zebedee and James the brother of Jesus as historically well-established, John's death as probably natural, and most of the rest as possible but not demonstrable. (3) And even granting all of it, martyrdom establishes only that the disciples sincerely believed they had seen the risen Jesus — which skeptical scholars like Gerd Lüdemann already concede without difficulty, explaining the belief as visionary experience.",
 responseSource:{name:"Sean McDowell, The Fate of the Apostles (2015); Candida Moss, The Myth of Persecution (2013); Gerd Lüdemann, The Resurrection of Jesus"},
 sources:[
  {name:"Sean McDowell, The Fate of the Apostles (Routledge, 2015)",type:'scholarly',url:'https://www.routledge.com/The-Fate-of-the-Apostles/McDowell/p/book/9781032097213'},
  {name:"1 Clement 5 (c. AD 95) — on Peter and Paul's sufferings",type:'primary',url:'https://www.earlychristianwritings.com/text/1clement-roberts.html'},
  {name:"Josephus, Antiquities 20.200 — the execution of James, the brother of Jesus",type:'primary',url:'https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.01.0146%3Abook%3D20'},
  {name:"Tacitus, Annals 15.44 — the Neronian persecution",type:'primary',url:'https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.02.0078:book=15:chapter=44'},
  {name:"Candida Moss, The Myth of Persecution (HarperOne, 2013)",type:'scholarly',url:'https://www.harpercollins.com/products/the-myth-of-persecution-candida-moss'}
 ],
 bible:['Acts 12:1-2','1 Corinthians 15:14-19','2 Corinthians 11:23-28','Acts 26:9-11'],
 verdict:'contested', severity:'medium',
 rationale:"Graded contested because the popular version fails and the disciplined version holds, and the difference between them is everything. What survives scrutiny is a narrow, real point: the disciples were not in the position of ordinary religious martyrs. A Muslim martyr dies for a revelation he received on someone else's testimony; a Heaven's Gate member dies for a metaphysics nobody could check. The disciples are claiming to have eaten with a man they watched die — a claim about which they personally could not be honestly mistaken in the way a second-hand believer can. Either they saw something or they knew they hadn't. Paul is the sharpest case, because he was persecuting the movement and had every worldly reason not to join it, and 2 Corinthians 11 lists what it cost him in his own hand. So the argument does real work, but bounded work: it establishes sincerity, not truth. It rules out deliberate fraud — the 'they stole the body and made it up' theory — and it rules out nothing else. Present it that way, with the thin evidence for the ten conceded up front, and it is durable. Present it as 'all twelve apostles were tortured to death and none recanted' and you will meet someone who has read McDowell, and you will lose everything you said before it.",
 talk:"Never say 'all twelve were martyred.' Say the narrow thing: **“I'm not arguing that dying for a belief makes it true — plenty of people have died for things that were false. I'm arguing these particular men were in a position to know whether they had made it up, and they behaved for the rest of their lives like men who hadn't.”** Then concede the evidence for most of them is late and thin, and name Paul, who was on the other side first."
});
d.push({
 id:'dontuse-all-twelve-martyred',
 title:"DON'T USE: 'all twelve apostles were martyred and not one recanted'",
 category:'dont-use-apologetics',
 claim:"A staple of sermons and tracts: every one of the twelve was tortured to death, and a single recantation would have ended Christianity — yet not one of them broke.",
 response:"There is no ancient source that says this, and there never was. The New Testament records one apostolic death (James son of Zebedee, Acts 12:2). Peter and Paul's deaths in Rome are early and well-attested — 1 Clement, written around AD 95, speaks of their sufferings, and Tacitus describes Nero's persecution — but the specific details, including the upside-down cross, come from later tradition. For most of the others, the source is a body of apocryphal Acts composed from the second to the fourth century, texts that also feature a talking lion and a resurrected smoked fish. Early Christian tradition holds that John died of old age at Ephesus, which by itself falsifies the 'all twelve' claim. The 'not one recanted' half is worse: it is an argument from the absence of records nobody kept. We have no roster of who held firm because we have no reliable roster of what happened to most of them at all. Sean McDowell, writing as a Christian apologist specifically to defend this line of evidence, is the one who documents how little of it can be established.",
 responseSource:{name:"Sean McDowell, The Fate of the Apostles (2015) — a Christian scholar's own grading of the evidence"},
 sources:[
  {name:"Sean McDowell, The Fate of the Apostles (Routledge, 2015)",type:'scholarly',url:'https://www.routledge.com/The-Fate-of-the-Apostles/McDowell/p/book/9781032097213'},
  {name:"The Acts of Thomas (3rd c. apocryphal)",type:'primary',url:'https://www.newadvent.org/fathers/0805.htm'},
  {name:"Eusebius, Church History 3.31 — John at Ephesus",type:'primary',url:'https://www.newadvent.org/fathers/250103.htm'}
 ],
 bible:['Acts 12:1-2','1 Thessalonians 5:21','Proverbs 12:22'],
 verdict:'answered', severity:'low', avoid:true,
 rationale:"Avoid because it overclaims a real argument into a false one, and because the correction is a single search away. The moment a skeptic checks Thomas or Bartholomew and finds a third-century romance, everything true you said about the crucifixion, the creed and Paul is retroactively suspect — you have taught them that you repeat things you have not verified. The fix is not to drop the evidence but to shrink the claim to what the sources carry: Peter, Paul, James son of Zebedee and James the brother of Jesus, the last of those attested by Josephus, who was not a Christian. Four well-documented deaths made in the strongest possible position of knowledge is a better argument than twelve legendary ones, precisely because it survives being checked.",
 talk:"If you have used this one — and most of us have — say so: **“I used to say all twelve were martyred. That's not what the sources support, and I stopped saying it.”** Then give the four that hold. Nothing rebuilds credibility with a skeptic faster than a Christian correcting a Christian talking point unprompted."
});
fs.writeFileSync(P('god-data.json'),JSON.stringify(d));
console.log('god cases now',d.length,'| avoid entries',d.filter(x=>x.avoid).length);

/* quick answer for the "they just said…" page */
const c=JSON.parse(fs.readFileSync(P('companion-god.json'),'utf8'));
if(!c.theysay.some(t=>/died for it|martyr/i.test(t.say))){
  c.theysay.push({say:"People die for false beliefs all the time — the 9/11 hijackers did. So the apostles dying proves nothing.",
   quick:"**Completely agree — and that's why I don't make that argument.** Sincerity proves sincerity. The narrower point is that these particular men weren't believing someone else's testimony: they were claiming to have eaten with a man they watched die, so they weren't in a position to be honestly mistaken the way a second-hand believer is. Either they saw something or they knew they hadn't. That rules out deliberate fraud and nothing more — and I'll grant you up front that the evidence for most of the twelve is late and thin. Paul is the case worth your time: he was persecuting them first.",
   refs:"Acts 12:2 · Acts 26:9-11 · 2 Corinthians 11:23-28"});
  fs.writeFileSync(P('companion-god.json'),JSON.stringify(c));
}
console.log('theysay entries:',c.theysay.length);
