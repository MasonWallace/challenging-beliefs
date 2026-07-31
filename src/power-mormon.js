/* ---------- they just said / lessons / verse arsenal (Mormon) ---------- */
const THEYSAY=[
{say:"I prayed about it, and the Holy Ghost told me it's true.",quick:"I believe you felt something real — but Muslims, Catholics, and Strangites report the **same confirming feeling** about contradictory books, so the feeling can't be the tiebreaker. God's own test runs the other way: **doctrine tests experience** (Deuteronomy 13:1–3; 1 John 4:1), never the reverse.",id:"burning-in-bosom-epistemology"},
{say:"The Bible is missing plain and precious truths — that's why we need the Restoration.",quick:"The Dead Sea Scrolls give us the Old Testament from **before Christ**, and Isaiah reads the same then as now. If plain and precious parts were stripped out, why has no early manuscript ever been found that still has them?",id:"plain-precious-things-removed"},
{say:"We believe in the same Jesus you do.",quick:"President Hinckley himself said the opposite: *'The traditional Christ of whom they speak is not the Christ of whom I speak'* (1998). The LDS Jesus is Lucifer's spirit brother and a created being — John 1:3 says **all** things were made through Him.",id:"different-jesus-hinckley-1998"},
{say:"How could an uneducated farm boy have written the Book of Mormon?",quick:"The book quotes the 1769 KJV verbatim — **including its translation errors** — and tracks 19th-century sources like The Late War. The question isn't whether a farm boy could write scripture; it's why God's translation copies a printed English Bible's mistakes.",id:"source-parallels-voth-late-war"},
{say:"That's anti-Mormon material. Where did you hear that?",quick:"Almost everything on this site cites the church's **own sources** — the Gospel Topics essays, the Joseph Smith Papers, the Journal of Discourses. Ask them: have you read the church's own essay on this topic?",id:"ces-letter-gospel-topics-visibility"},
{say:"The witnesses never denied what they saw — even after leaving the church.",quick:"Martin Harris said he saw the plates with *'the eye of faith'* and *'spiritual eyes'* — and most witnesses later followed **other** prophets and seers, including James Strang and his equally-witnessed plates. Consistency isn't the issue; the nature of the 'seeing' is.",id:"witnesses-character-and-vision"},
{say:"Prophets are imperfect men. That doesn't make them false.",quick:"Sinning is human — **teaching false doctrine as God's word** is what Deuteronomy 18 says a true prophet cannot do. D&C 135:3 claims Joseph did more for salvation than anyone but Jesus; the question is whether his testable claims passed the test.",id:"prophetic-fallibility-unfalsifiable"},
{say:"There was a Great Apostasy — the church had to be restored.",quick:"Jesus promised the gates of hell would **not** prevail against His church (Matthew 16:18), and Paul cursed even an angel who brings 'another gospel' (Galatians 1:8). A total apostasy makes Jesus's promise fail — that's a high price for the Restoration narrative.",id:"another-gospel-canon-closure"},
{say:"Don't you want to be with your family forever?",quick:"I do — and Jesus offers that without a recommend card: everyone in Christ is family forever, no temple gate between a mother and her child's wedding. Ask gently: **who was excluded from yours?**",id:"temple-wedding-family-exclusion"},
{say:"Baptism for the dead is in the Bible — 1 Corinthians 15:29.",quick:"Paul says 'what shall **they** do' — citing someone else's practice, not commanding ours — and the Book of Mormon itself teaches **no** second chance after death (Alma 34:32–35). One ambiguous verse can't carry a temple system that the rest of Scripture contradicts (Hebrews 9:27).",id:"no-postmortem-repentance"},
{say:"God has a body of flesh and bone — we're His literal children.",quick:"Jesus said God is **spirit** (John 4:24) and 'a spirit hath not flesh and bones' (Luke 24:39). The exalted-man doctrine came from the 1844 King Follett discourse — and it contradicts the Book of Mormon itself (Moroni 8:18).",id:"god-exalted-man-flesh-and-bone"},
{say:"As man now is, God once was; as God now is, man may be.",quick:"Psalm 90:2 — 'from everlasting to everlasting, thou art God.' No career before deity. And the Book of Mormon agrees: God is 'unchangeable from all eternity to all eternity' — Lorenzo Snow's couplet contradicts their own keystone scripture.",id:"unchangeable-god-vs-king-follett"},
{say:"Polygamy was commanded by God, like with Abraham.",quick:"The church's own essay concedes Joseph married about 30–40 women — one at 14, some with living husbands — under threat from *'an angel with a drawn sword.'* Galatians 1:8 covers exactly this: even an angel preaching another gospel is accursed.",id:"polygamy-coercion-angel-sword"},
{say:"DNA can't disprove the Book of Mormon — small groups vanish into larger populations.",quick:"That defense works only by abandoning what prophets taught for 150 years: that Lamanites are the **principal** ancestors of Native Americans. The church quietly edited the book's introduction in 2006 — the claim retreats every time evidence arrives.",id:"dna-native-american-origins"},
{say:"Nahom — the NHM altars in Yemen prove the Book of Mormon.",quick:"Grant it fully: a three-consonant tribal name on the Old-World leg, where Lehi followed known trade routes. Then ask why the **New** World — where a thousand years of Nephite civilization unfolded — has produced nothing at all.",id:"nahom-nhm-altars"},
{say:"The papyri were just a catalyst — the Book of Abraham came by revelation.",quick:"Joseph published the facsimiles with his own translations of specific figures — and the readable captions name Osiris, Isis, and Maat, not Abraham and Pharaoh. 'Catalyst' quietly concedes that what he called a translation wasn't one — in the **one case we can check**.",id:"book-of-abraham-papyri"},
{say:"Just read the Book of Mormon and ask God with a sincere heart (Moroni 10:4).",quick:"James 1:5 is about wisdom in trials, not testing scripture — the Bereans were praised for checking Paul **against the scriptures** (Acts 17:11). Offer a trade: you'll read Moroni 10 if they'll read Isaiah 43–46 with you.",id:"burning-in-bosom-epistemology"},
{say:"That was never official doctrine — you're taking it out of context.",quick:"Brigham Young taught Adam–God from the conference pulpit for 25 years and put it in the temple lecture; President Kimball later denounced it as **false doctrine**. Either test: it was doctrine and it was false, or 'doctrine' has no fixed meaning.",id:"adam-god-doctrine"},
{say:"We are saved by grace — after all we can do.",quick:"Paul puts it in the opposite order: saved by grace **not** of works (Ephesians 2:8–9), with works as the fruit. Ask the question that opens hearts: *'Have you ever done all you can do — and how would you know?'*",id:"grace-after-all-we-can-do"},
{say:"Look at the church's growth and its fruits — could a false church do that?",quick:"Growth measures effort and birthrate, not truth — Islam grows faster, and Jehovah's Witnesses knock on more doors. The test God actually gave a prophet is Deuteronomy 18: did what he prophesied **happen**?",id:"joseph-smith-failed-prophecies"},
{say:"Joseph Smith sealed his testimony with his blood — he died a martyr.",quick:"He died in a gunfight, firing a smuggled pistol, after ordering a printing press destroyed for exposing his secret polygamy. That's a tragedy — but it's not Stephen's martyrdom, and dying doesn't make claims true.",id:"nauvoo-expositor-carthage"},
{say:"Joseph saw God the Father and Jesus Christ in the Sacred Grove.",quick:"His own **1832 handwritten account** mentions one personage and says he'd already concluded all churches were false before praying — the Father and Son version arrived in 1838. Read the 1832 account together on the church's own website.",id:"first-vision-multiple-accounts"},
{say:"The Book of Mormon has never changed — unlike the Bible's thousands of variants.",quick:"The 1837 edition changed 'the Son of' in four verses about Jesus's deity, 'white and delightsome' became 'pure and delightsome,' and thousands of other edits are documented in the church's own critical text project. The claim is simply false.",id:"1837-son-of-edits"},
{say:"Why do you persecute us? We're Christians too.",quick:"This isn't persecution — it's the conversation Mormonism itself started by declaring all other churches' creeds an **abomination** (JS–History 1:19). The question was never sincerity; it's whether the LDS Godhead is the God of the Bible.",id:"trinity-vs-godhead"}
];
const LESSONS=[
{n:"Before they knock",t:"How to host missionaries well",what:["They're 18–25, far from home, family-funded, on a rigid schedule — feed them, learn their first names, and treat them as guests, not opponents.","They teach from a fixed manual: Preach My Gospel. You can know their script better than they do.","Your goal is not to win the visit; it's to be the one household that asked questions they can't unhear — and stayed kind."],ask:"“Can I ask you some honest questions as we go? I promise to actually read what you leave me if you'll look at one thing I show you.”",ids:["missionary-program-realities"]},
{n:"Lesson 1",t:"The Restoration",what:["God is our loving Heavenly Father; prophets lead dispensations.","The Great Apostasy: after the apostles died, the church and its authority were lost from the earth.","Joseph Smith's First Vision restored the truth; the Book of Mormon is the evidence.","You'll be invited to read it and pray about it (Moroni 10:4)."],ask:"“Jesus promised the gates of hell would not prevail against His church (Matthew 16:18) — when exactly did that promise fail? And which First Vision account should I pray about — the 1832 one with one personage, or the 1838 one with two?”",ids:["another-gospel-canon-closure","first-vision-multiple-accounts","burning-in-bosom-epistemology","kjv-isaiah-block-quotation"]},
{n:"Lesson 2",t:"The Plan of Salvation",what:["Premortal life: you lived as a spirit child of Heavenly Parents before birth.","The Fall was a necessary step forward; no original sin.","After death: spirit paradise/prison, then three kingdoms of glory — nearly everyone is saved into some glory.","Exaltation in the celestial kingdom = becoming like God, with your family."],ask:"“Alma 34:32–35 says this life is the time to prepare and after death comes no repentance — where do the second chances in spirit prison come from, if not from later revelation that contradicts the Book of Mormon itself?”",ids:["premortal-spirit-children","fortunate-fall","no-postmortem-repentance","exaltation-eternal-progression"]},
{n:"Lesson 3",t:"The Gospel of Jesus Christ",what:["Faith, repentance, baptism by proper authority, the gift of the Holy Ghost, enduring to the end.","Grace is taught — but as what makes exaltation possible after covenant-keeping: '2 Nephi 25:23: saved by grace, after all we can do.'"],ask:"“Have you ever done *all you can do*? How would you know when you had? — Paul says the opposite order: by grace through faith, not of works, so that no one can boast (Ephesians 2:8–9).”",ids:["grace-after-all-we-can-do"]},
{n:"Lesson 4",t:"The Commandments",what:["The Word of Wisdom (no coffee, tea, alcohol, tobacco) as a covenant marker.","Tithing: 10% of income; both are required for temple recommends.","Law of chastity, Sabbath observance, sustaining church leaders."],ask:"“Colossians 2:16 says let no one judge you in questions of food and drink — when did a health guideline become a gate between a family and their own daughter's wedding?”",ids:["word-of-wisdom-dietary-law","tithing-enforcement","temple-wedding-family-exclusion"]},
{n:"Lesson 5",t:"Laws and Ordinances",what:["The priesthood: restored through John the Baptist and Peter, James, and John; required for valid ordinances.","Temple work: endowment, sealings, and baptism for the dead on behalf of your ancestors.","Callings, missionary work, enduring in the church."],ask:"“No record describes those angelic ordinations until five years after the church was founded, and the revelations were expanded after the fact — can we look at the Book of Commandments and D&C 27 side by side on the Joseph Smith Papers site?”",ids:["priesthood-restoration-late-account","book-of-commandments-revisions","endowment-masonic-origins"]}
];
const WHYVERSE={
"Deuteronomy 18:21-22":"The prophet test, from God himself: one failed prophecy disqualifies. Carries more cases on this site than any other passage.",
"Isaiah 43:10":"'Before me there was no God formed, neither shall there be after me' — six words that end eternal progression, exaltation, and a God who was once a man.",
"Proverbs 12:22":"'Lying lips are abomination to the LORD' — the honesty test for the polygamy denials, the post-Manifesto years, and every 'faith-promoting' embellishment.",
"1 Thessalonians 5:21":"'Prove all things; hold fast that which is good' — your permission slip for this entire site. Testing claims is obedience, not faithlessness.",
"Psalm 90:2":"'From everlasting to everlasting, thou art God' — no career before deity, no exaltation track record. Pairs with Moroni 8:18 from their own book.",
"Numbers 23:19":"'God is not a man' — the plainest sentence in Scripture against the exalted-man doctrine, and it's in the books they accept.",
"Deuteronomy 4:2":"'Ye shall not add unto the word' — the canon question in one verse, for D&C 132, the Book of Abraham, and every revision after.",
"Deuteronomy 6:4":"The Shema — 'the LORD our God is one LORD.' The monotheism every Israelite prophet died defending, against a plurality of gods.",
"Isaiah 44:6-8":"'Beside me there is no God... I know not any' — God himself denies knowledge of other gods. Read slowly with a Latter-day Saint friend.",
"Isaiah 45:5":"'There is none beside me' — Isaiah 43–46 says it a dozen ways; count them together out loud.",
"Ephesians 4:25":"'Putting away lying, speak every man truth' — the standard for institutions as well as men.",
"Galatians 1:6-9":"'Though we, or an angel from heaven, preach any other gospel... let him be accursed' — written as if Paul had met Moroni.",
"Isaiah 53":"The suffering servant, complete in the Great Isaiah Scroll a century before Christ — proof the text was preserved, and the gospel in one chapter.",
"Matthew 5:44":"'Love your enemies' — the posture verse. You will never argue anyone into the kingdom whom you haven't loved first.",
"1 Timothy 3:2":"'The husband of one wife' — the New Testament's marriage standard for leaders, three words long.",
"Acts 17:11":"The Bereans were called noble for checking the apostle Paul against Scripture daily — the biblical alternative to praying for a feeling."
};
function bindOpens(){document.querySelectorAll("#main [data-open]").forEach(b=>b.addEventListener("click",()=>openCase(b.dataset.open)));}
function renderTheySay(){
  $("#main").innerHTML=`<div class="viewhead"><h2>They just said…</h2>
  <p>Real conversations don't start with topics — they start with a line. Find the line you just heard, answer in two sentences, then open the full case together. Use the search box to jump (Ctrl+F works too).</p></div>`+
  THEYSAY.map(t=>`<div class="ptcard"><h3 class="ptv">“${esc(t.say)}”</h3>
    <div class="who you">Your two sentences</div><p class="pt">${rich(t.quick)}</p>
    <div class="relrow"><button data-open="${t.id}">Open the full case: ${esc(byId[t.id].title)}</button></div></div>`).join("");
  bindOpens();
}
function renderLessons(){
  $("#main").innerHTML=`<div class="viewhead"><h2>When the missionaries come</h2>
  <p>LDS missionaries teach a fixed curriculum — <i>Preach My Gospel</i>, Lessons 1–5. Here is what each lesson will say, the one question to ask right then, and the cases behind it. Knowing their script lets you be relaxed, warm, and ready.</p></div>`+
  LESSONS.map(L=>`<div class="ptcard"><div class="who them">${esc(L.n)}</div><h3 class="ptv">${esc(L.t)}</h3>
    <div class="who them" style="margin-top:8px">They will teach</div><p class="pt">${L.what.map(w=>"• "+esc(w)).join("<br>")}</p>
    <div class="who you">The question to ask</div><p class="pt">${rich(L.ask)}</p>
    <div class="relrow">${L.ids.map(id=>byId[id]?`<button data-open="${id}">${esc(byId[id].title)}</button>`:"").join("")}</div></div>`).join("");
  bindOpens();
}
function renderArsenal(){
  const cnt={};
  DATA.forEach(d=>(d.bible||[]).forEach(r=>{const k=r.replace(/–/g,"-").trim();(cnt[k]=cnt[k]||[]).push(d.id);}));
  const top=Object.entries(cnt).sort((a,b)=>b[1].length-a[1].length).slice(0,16);
  $("#main").innerHTML=`<div class="viewhead"><h2>Verse arsenal</h2>
  <p>Two tools. <b>Look up any reference</b> — theirs or the Bible's — to find every case that cites it ("she quoted Alma 7:10 — now what?"). Below it, the Bible verses that carry the most weight across all ${DATA.length} cases: memorize these and you are armed for most conversations on this site.</p></div>
  <input class="arsinput" id="arsq" placeholder="Type any reference — e.g. Alma 7:10, D&amp;C 132, Isaiah 43, Moroni 10…" autocomplete="off">
  <div id="arsout"></div>
  <div class="dlab" style="margin-top:26px">The verses that do the most work</div>`+
  top.map(([ref,ids])=>`<div class="ptcard"><h3 class="ptv">${esc(ref)} <span class="cnt" style="font-size:.7rem">${ids.length} case${ids.length>1?"s":""}</span></h3>
    ${WHYVERSE[ref]?`<p class="pt">${rich(WHYVERSE[ref])}</p>`:""}
    <div class="relrow">${ids.slice(0,6).map(id=>`<button data-open="${id}">${esc(byId[id].title)}</button>`).join("")}</div></div>`).join("");
  bindOpens();
  const box=$("#arsq"),out=$("#arsout");
  box.addEventListener("input",()=>{
    const q=box.value.toLowerCase().replace(/–/g,"-").replace(/\s+/g," ").trim();
    if(q.length<3){out.innerHTML="";return;}
    const hits=DATA.filter(d=>["bom","bible","quran","hadith"].some(k=>(d[k]||[]).some(r=>r.toLowerCase().replace(/–/g,"-").includes(q))));
    out.innerHTML=hits.length?`<div class="dlab">${hits.length} case${hits.length>1?"s":""} cite a matching reference</div><div class="relrow">${hits.slice(0,20).map(d=>`<button data-open="${d.id}">${esc(d.title)}</button>`).join("")}</div>`:`<p class="pt" style="color:var(--muted)">No case cites a reference matching “${esc(box.value)}” — try just the book and chapter (e.g. “Alma 7”).</p>`;
    document.querySelectorAll("#arsout [data-open]").forEach(b=>b.addEventListener("click",()=>openCase(b.dataset.open)));
  });
}
