const fs = require('fs');
const P = f => __dirname + '/' + f;
const build = require('./build-section.js');
const GD = require('./glossary-data.js');
const data = JSON.parse(fs.readFileSync(P('bhi-data.json'), 'utf8'));

const CATS = {
  "identity-claims": "Who is Israel?", "curses-reading": "The curses of Deuteronomy 28",
  "history-genetics": "History & genetics", "race-doctrine": "The race doctrines",
  "law-and-salvation": "Law & salvation", "movement-history": "Where the movement came from",
  "practice": "Inside the camps"
};
const SECMAP = {
  "identity-claims": "claim", "curses-reading": "claim",
  "race-doctrine": "race", "history-genetics": "race",
  "law-and-salvation": "gospel",
  "movement-history": "movement", "practice": "movement"
};
data.forEach(d => { d.section = SECMAP[d.category] || 'movement'; });

const CATDESC = {
  "identity-claims": "The founding claim — that Black, Hispanic and Native Americans are the literal twelve tribes — and the texts it rests on.",
  "curses-reading": "Deuteronomy 28 is the movement's cornerstone. Here is what the chapter actually says, and to whom.",
  "history-genetics": "What the historical and genetic record shows about both African-American ancestry and modern Jewish ancestry, stated honestly.",
  "race-doctrine": "The teachings about Esau, Edom, and who may be saved — the doctrines the movement's own moderates are most uneasy about.",
  "law-and-salvation": "Whether salvation comes by keeping the law and by bloodline, or by faith in the Messiah.",
  "movement-history": "The documented origin of a movement that claims an ancient identity — founders, dates, splits, and one failed prophecy.",
  "practice": "Life inside the street camps: authority, women, polygamy, and the method of reading Scripture."
};
const WHYMAP = {
  "identity-claims": "Everything else follows from this. If the identity claim is a reading error rather than a recovered truth, the whole system rests on nothing — and if it is true, the church owes them an apology.",
  "curses-reading": "This is the emotional engine of the movement: a people who suffered enormously find their suffering named in Scripture. Answer the exegesis without ever belittling the suffering.",
  "history-genetics": "Because the claim is historical, it can be checked — and because the history involved is real atrocity, it must be checked carefully and without triumph.",
  "race-doctrine": "A gospel with a racial door on it is a different gospel. Galatians was written against exactly this, in the other direction.",
  "law-and-salvation": "This is the actual dividing line. Half of their critique of the modern church is fair; their remedy is the one Paul spent his life opposing.",
  "movement-history": "A movement claiming a recovered ancient identity has a documented American origin with names and dates. That gap is worth a conversation.",
  "practice": "How a group treats its women, its dissenters and its texts tells you what it is — and the answer here is uneven enough that fairness matters."
};
const GLOSSARY = [
  { t: "the camps", d: "Street-preaching schools — IUIC, ISUPK, GMS, and others — that teach in public with a podium, uniforms and an amplifier. They are not one organization; they disagree sharply and often bitterly with each other." },
  { t: "IUIC", d: "Israel United in Christ — the largest and most media-visible camp, founded 2003. Comparatively less confrontational in style than ISUPK, and it does teach Christ." },
  { t: "ISUPK", d: "Israelite School of Universal Practical Knowledge — the camp behind most viral street-confrontation footage. Its rhetoric on other races is the harshest in the movement." },
  { t: "1WT / 'One West'", d: "The One West Camp lineage (from a Harlem address), the doctrinal root of most of the confrontational street camps, including their race eschatology." },
  { t: "so-called Negro / so-called Black", d: "Their standard phrase for Black Americans — the point being that 'Black' is a slave-master label imposed over a stolen national identity." },
  { t: "the 12 Tribes Chart", d: "A chart mapping the twelve tribes onto modern nationalities — Judah to Black Americans, Benjamin to West Indians, and so on. It has no ancient source; it was assembled in the twentieth century." },
  { t: "Edomite", d: "In camp teaching, white people — identified as the descendants of Esau. This is the doctrine that carries the movement's judgment language." },
  { t: "the Most High / Ahayah", d: "Their preferred name for God, from a reading of the Hebrew of Exodus 3:14. Many camps regard 'God' and 'Lord' as pagan titles." },
  { t: "Yashaya / Yahawashi", d: "Sacred-name renderings of 'Jesus.' Camps differ; some treat the English name Jesus as a deliberate corruption." },
  { t: "precept upon precept", d: "Their method, taken from Isaiah 28:10 — chaining verses from across Scripture to build a teaching. In context, Isaiah 28:10 is a mocker's imitation of a prophet, which verse 13 turns into judgment." },
  { t: "waking up", d: "Conversion language: realising you are an Israelite. The opposite is 'sleep' — accepting the identity the slave trade assigned you." },
  { t: "the heathen / the gentile", d: "Everyone outside the twelve tribes. In the strongest camp teaching, the heathen are excluded from salvation or admitted only as servants in the kingdom." },
  { t: "Deuteronomy 28", d: "The covenant curses chapter, and the movement's cornerstone text — especially verse 68, 'the LORD shall bring thee into Egypt again with ships.'" },
  { t: "the transgression", d: "The reason for the curses: Israel's disobedience. In camp preaching, everything that has happened to Black America since 1619 is read as this chapter running its course." },
  { t: "officers", d: "Uniformed camp members who manage the crowd, the equipment and the confrontations around a street teaching. The setup is deliberately theatrical." },
  { t: "Ben Ammi & Dimona", d: "Ben Ammi Ben-Israel led a group from Chicago to Liberia in 1967 and then to Dimona, Israel, in 1969. That community — the African Hebrew Israelites of Jerusalem — is vegan, peaceable, and nothing like the street camps." },
  { t: "Church of God and Saints of Christ", d: "Founded 1896 by William Saunders Crowdy, a formerly enslaved Union Army veteran — the oldest documented Black Hebrew Israelite body, and still a functioning denomination." },
  { t: "Commandment Keepers", d: "Wentworth Arthur Matthew's Harlem congregation (1919), the strand that moved closest to rabbinic Judaism." }
];
const has = new Set(data.map(d => d.id));
const pick = (...ids) => ids.filter(i => has.has(i));
const PATHS = [
  { id: "identity", name: "The identity claim", desc: "Deuteronomy 28, the chart, and who the chapter is addressed to", time: "≈ 22 min", items: pick("deut-28-68-ships-to-egypt", "deut-28-curses-already-fulfilled", "twelve-tribes-chart", "exclusive-israel-claim") },
  { id: "race", name: "Race, text and history", desc: "Esau, Revelation 1, the Khazar theory, and what the genetics actually says", time: "≈ 20 min", items: pick("esau-edom-white-people", "revelation-hair-like-wool", "khazar-impostor-theory", "african-american-genetic-ancestry") },
  { id: "gospel", name: "Law, bloodline and the gospel", desc: "The real dividing line — and the half of their critique that lands", time: "≈ 18 min", items: pick("law-keeping-salvation", "bloodline-versus-abrahams-offspring-by-faith", "gentile-exclusion-and-race-eschatology") },
  { id: "movement", name: "Where the movement came from", desc: "1896 to today: founders, splits, a failed date, and the peaceful strand", time: "≈ 18 min", items: pick("movement-origins-1886-1969", "year-2000-failed-prophecy", "ben-ammi-dimona-community", "splc-hate-designation") },
  { id: "fair", name: "Where they're right", desc: "Popular Christian arguments that fail — read these before you talk", time: "≈ 10 min", items: data.filter(d => d.avoid).map(d => d.id) }
].filter(p => p.items.length);

const TLACTS = [
  {
    num: "I", range: "1896–1930", name: "The founding generation", desc: "Born out of Reconstruction's collapse — and nothing like the street camps", events: [
      { y: "1896", side: "record", crit: true, t: "Crowdy founds the Church of God and Saints of Christ", p: "William Saunders Crowdy — born enslaved in Maryland in 1847, a Union Army veteran — begins the oldest documented Black Hebrew Israelite body. It still exists.", id: "movement-origins-1886-1969" },
      { y: "1899", side: "record", t: "Frank Cherry's Church of the Living God", p: "A second independent founding, teaching that the biblical Israelites were Black." },
      { y: "1919", side: "record", t: "Wentworth Matthew's Commandment Keepers", p: "The Harlem strand that moved closest to rabbinic Judaism — Hebrew, Torah, and a rabbinical seminary.", id: "movement-origins-1886-1969" }
    ]
  },
  {
    num: "II", range: "1960–2000", name: "Dimona, One West, and the street", desc: "The movement splits into a farming village and a megaphone", events: [
      { y: "1966–69", side: "record", crit: true, t: "Ben Ammi leads the exodus to Dimona", p: "Chicago to Liberia to Israel. The community is vegan, communal, peaceable — and a living rebuttal to the claim that the movement is one thing.", id: "ben-ammi-dimona-community" },
      { y: "1969–80s", side: "record", crit: true, t: "The One West Camp", p: "A Harlem address becomes the doctrinal root of the confrontational street camps — the 12 Tribes Chart, the Edomite doctrine, the uniforms.", id: "twelve-tribes-chart" },
      { y: "1990s", side: "claim", t: "The chart goes national", p: "Tribe-to-nationality mapping spreads through the camps as settled fact, though no source older than the twentieth century has ever been produced.", id: "twelve-tribes-chart" },
      { y: "2000", side: "record", crit: true, t: "The year-2000 prophecy fails", p: "A dated prediction, a failure, a rebrand, and a succession — all documented in the movement's own record.", id: "year-2000-failed-prophecy" }
    ]
  },
  {
    num: "III", range: "2003–2026", name: "The viral era", desc: "New camps, new audiences, and a fight over what the movement is", events: [
      { y: "2003", side: "record", t: "IUIC founded", p: "Israel United in Christ becomes the largest and most media-savvy camp — and teaches Christ, unlike the strictest One West descendants." },
      { y: "2010s", side: "record", t: "The confrontation clips", p: "Street footage makes the movement famous for its harshest five minutes — a frame that fits neither Dimona nor the 1896 church.", id: "avoid-viral-media-frames" },
      { y: "2016", side: "record", crit: true, t: "The hate-group designation", p: "The SPLC lists specific radical camps. The camps are right that a listing is not a refutation; critics are right that the teaching listed is real.", id: "splc-hate-designation" },
      { y: "2019–", side: "record", t: "Attacks claimed and disowned", p: "Violence by individuals citing the identity, condemned by most of the movement — the reason blanket labels are both wrong and useless.", id: "avoid-blanket-hate-group-label" }
    ]
  }
];
const RELATED = {};
data.forEach(d => { RELATED[d.id] = data.filter(x => x.category === d.category && x.id !== d.id && !x.avoid).slice(0, 3).map(x => x.id); });

const TALK = {
  "identity-claims": "Never start with *“you're not Israel.”* Start with the part that's true: **“You're right that the church has been silent about what was done to your people, and right that God's word takes your suffering seriously.”** Then one question, not a lecture: *“Who is Deuteronomy 28 addressed to in verse 1?”* Let them read it out loud.",
  "curses-reading": "The chapter is their whole case, so go to the chapter — in their Bible, at their pace. **“Read me verse 1. Who is Moses speaking to?”** Then verse 68 in context, then Deuteronomy 30:1-5, where the same covenant promises the return. Never rush this; it's the only argument that matters and it must be theirs to find.",
  "history-genetics": "Genetics is the worst door in the building. If it comes up, be honest and brief: **“The record shows what it shows, and it can't tell you whether God loves you.”** Then move: *“Even if every genetic claim were granted, would that change how a person is saved?”* That question is where the conversation actually lives.",
  "race-doctrine": "Do not argue about who Esau was. Ask instead: **“If a white man repents and believes, is he saved?”** The answers you get will differ camp to camp, and the disagreement inside the movement is more persuasive than anything you could say. Then Galatians 3:28 — a book written against exactly this, in the other direction.",
  "law-and-salvation": "Concede first, and mean it: **“You're right that a lot of churches preach a grace with no obedience in it. That's a real problem.”** Then Galatians 3:10 and 5:3 — *“if you're keeping the law to be saved, are you keeping all of it? What's the atonement when you fail?”* That question has no answer inside the system.",
  "movement-history": "Ask, with curiosity rather than gotcha: **“When did the movement start teaching this, and who first taught it?”** The names — Crowdy 1896, Matthew 1919, One West in the seventies — are in the movement's own histories. A recovered ancient identity with a documented modern founder is worth thinking about slowly.",
  "practice": "The method is the door. **“Isaiah 28:10 — read me the next three verses.”** Verse 13 turns 'precept upon precept' into judgment on people who wouldn't listen. That's not a gotcha; it's an invitation to read chapters instead of chains of single lines — and the whole edifice depends on the chains."
};
const TIPS = {
  verdict: {
    admitted: "The movement's own teachers and published materials state these facts openly — the dispute is only about what they mean. You can cite this one entirely from their sources.",
    unrefuted: "No adequate answer exists in camp materials — usually because the specific objection is never engaged at all.",
    contested: "A serious rebuttal exists. Read both sides; the dispute is genuine, and both sides here hold something true.",
    answered: "The claim has a decisive answer from the text or the record — but state the concession inside it before you give the answer."
  },
  impact: "How serious the claim is, if true: MAJOR strikes at the foundation, MODERATE is significant, MINOR is a detail.",
  strongest: "One of the handful of cases with the most decisive evidence in the entire catalog — if you read only a few, read these."
};
const WHYTAIL = {
  admitted: "The facts here are stated openly by the movement's own teachers — the only dispute is what they mean. Cite them from camp sources and there is nothing to argue about except the interpretation.",
  unrefuted: "This specific objection is not engaged in camp materials. Ask it plainly, then wait; there is no prepared answer.",
  contested: "There is a genuine debate here, and both sides hold something true — say so out loud before you take a position.",
  answered: "The text answers this one — but the grievance underneath it is legitimate, and the concession has to come before the answer or nothing will be heard."
};
const TOURSTEPS = [
  { icon: "🦁", title: "Welcome to the examination", body: "<b>__N__ documented claims</b> taught in the Hebrew Israelite camps, each weighed against the Bible — with the biblical text cited on every case. Every claim carries the <b>strongest camp defense</b>, and where the camps are right, we say so. Popular Christian responses that fail are marked <b>do not use</b>." },
  { icon: "⚖", title: "One movement, or many?", body: "The first thing to get right: <b>this is not one organization.</b> It runs from a 130-year-old denomination founded by a formerly enslaved Union veteran, through a vegan farming community in Israel, to the confrontational street camps in the viral clips. They disagree with each other bitterly. Arguments that treat them as one thing fail immediately — and deserve to." },
  { icon: "🏷", title: "Four verdicts, one glance", body: "Every claim lands in one of four columns:<div class=\"vrow2\"><div><span class=\"badge v-admitted\">Admitted</span><span>the camps state it openly themselves</span></div><div><span class=\"badge v-unrefuted\">Unanswered</span><span>the objection is never engaged</span></div><div><span class=\"badge v-contested\">Contested</span><span>both sides hold something true</span></div><div><span class=\"badge v-answered\">Answered</span><span>the text settles it — after the concession</span></div></div>" },
  { icon: "💬", title: "Concede before you answer", body: "Nearly every case on this site opens by granting what is true inside the claim — the church's long silence about slavery, the reality of the curses, the failure of cheap grace. That is not a rhetorical trick; it is the only order in which any of this can be heard. Each case ends with <b>“How the conversation usually goes”</b>, a scripted back-and-forth so you're never without the next move." },
  { icon: "🚀", title: "Where to start", body: "Take the <b>identity path</b>: read Deuteronomy 28 verse 1 — <i>who is being addressed?</i> — then verse 68 in context, then chapter 30, where the same covenant promises the return. One chapter, read whole, is the entire argument. Replay this tour anytime from the sidebar.", cta: "Take me to the heart of it" }
];
const CORE = {
  hero: {"src":"https://commons.wikimedia.org/wiki/Special:FilePath/Brookes%20slave%20ship%2C%20British%20Library%20(cropped).jpg?width=900","cap":"The Brookes, 1788. This is the history Deuteronomy 28:68 is read against — and the reason the chapter has the force it has."},
  navLabel: "The heart of it", navCount: "1", navTip: "One chapter, read whole — the argument everything else depends on",
  title: "The heart of it: read the whole chapter",
  intro: "If you read nothing else on this site, read this page. The Hebrew Israelite case is built almost entirely on one chapter of Deuteronomy — and it is answered by that same chapter, read from verse 1 to the end and on into chapter 30. But it cannot be answered until something else is said first.",
  html: `
  <div class="corebox"><h3>1 · Say the true thing first, and mean it</h3>
  <p>People did not join this movement because a chart persuaded them. They joined because they were told, for the first time, that their history was in the Bible and that God had not forgotten what was done to their families — and because the church that could have said that was largely silent about slavery, and in many cases blessed it.</p>
  <p>That grievance is real, and it is <b>not</b> the part to argue with. Say so out loud, early, without a "but": the church owes an apology it has mostly not made. Nothing further you say will be heard until that is on the table.</p>
  <details class="srcdet"><summary>Open the cases behind this</summary><div class="corelinks" style="margin-top:12px">\${link("avoid-dismissing-the-longing")}\${link("suffering-as-identity-proof")}</div></details></div>

  <div class="corebox"><h3>2 · Deuteronomy 28, from verse 1</h3>
  <p>The chapter is quoted from the middle. Read it from the top and it names its own audience: Moses, at Moab, addressing the covenant nation about the consequences of covenant disobedience. Verse 68 — <i>"the LORD shall bring thee into Egypt again with ships"</i> — is the last of a long list, and "Egypt" is literal Egypt everywhere else in the book.</p>
  <p>Then keep reading. <b>Deuteronomy 30:1–5</b> is the same covenant's own resolution: when the curses come, and you return, God gathers you back. The curses were never a permanent identity — the chapter that pronounces them also ends them.</p>
  <details class="srcdet"><summary>Open the cases behind this</summary><div class="corelinks" style="margin-top:12px">\${link("deut-28-68-ships-to-egypt")}\${link("deut-28-curses-already-fulfilled")}</div></details></div>

  <div class="corebox"><h3>3 · Suffering is not a genealogy</h3>
  <p>The engine of the movement is an argument that looks like this: <i>the curses describe us, therefore we are the cursed people</i>. But suffering the described consequences does not establish descent. The Armenians, the Irish, the Cambodians and the Rwandans could each read Deuteronomy 28 and find their own century in it — the chapter's power is precisely that it describes what happens to human beings under judgment, not a fingerprint.</p>
  <p>And the chart that assigns tribes to modern nationalities has no ancient source at all. It was assembled in the twentieth century, and when that is pointed out the reply is that the records were destroyed — which is true of the records, and also makes the claim impossible to test in either direction.</p>
  <details class="srcdet"><summary>Open the cases behind this</summary><div class="corelinks" style="margin-top:12px">\${link("suffering-as-identity-proof")}\${link("twelve-tribes-chart")}</div></details></div>

  <div class="corebox"><h3>4 · The real dividing line is not race — it is the gospel</h3>
  <p>You could concede every genealogical claim on the site and the central question would be untouched: <b>how is a person saved?</b> The camps answer with bloodline and law-keeping. Paul spent his life answering that question the other way — and Galatians was written against exactly this error, running in the opposite direction, when Jewish believers wanted Gentiles kept out.</p>
  <p class="pullq">"If ye be Christ's, then are ye Abraham's seed, and heirs according to the promise." — Galatians 3:29</p>
  <p>Ask the question that has no answer inside the system: <i>if salvation is by keeping the law, are you keeping all of it — and what is the atonement when you fail?</i> There has been no altar since AD 70.</p>
  <details class="srcdet"><summary>Open the cases behind this</summary><div class="corelinks" style="margin-top:12px">\${link("law-keeping-salvation")}\${link("bloodline-versus-abrahams-offspring-by-faith")}\${link("gentile-exclusion-and-race-eschatology")}</div></details></div>

  <div class="corebox"><h3>5 · The dignity they are looking for is already theirs</h3>
  <p>Underneath the chart and the megaphone is a true and God-given hunger: <i>I want to matter in God's story.</i> The answer is not that they don't — it is that in Christ they are not a footnote to Israel but a co-heir with the Messiah, adopted, named, and seated. That is a larger dignity than the chart offers, and it does not depend on a genealogy nobody can produce.</p>
  <p><button class="corelink" data-goto="share">How to actually have this conversation →</button></p></div>`
};
const SHARE = {
  title: "Sharing Jesus with a Hebrew Israelite",
  intro: "Not to win a street exchange — those are unwinnable by design — but to reach a person whose grievance is real and whose remedy is not. Concede first, ask second, and never take the bait of the crowd.",
  html: `
  <div class="pb-h">The invitation to work toward</div>
  <div class="saybox"><span class="who">You, away from the crowd</span><p>"Would you read Deuteronomy 28 and 30 with me, start to finish, and then Galatians — just us, no podium, no camera?"</p></div>
  <p class="pd" style="font-size:.78rem;margin:0 0 4px">Everything on this site is designed for that conversation and not for the street. Whole chapters, read together, dismantle the chain-of-verses method without your ever having to attack it.</p>

  <div class="pb-h">What actually reaches someone in the camps</div><div class="pb-grid">
  <div class="pb"><span class="num">1</span><h4>Naming what the church got wrong — first, and without a "but"</h4><p>American Christianity was largely silent about slavery and often complicit in it. Say that plainly before you say anything else. Every person in front of you has been told that Christians will deny it or minimize it, and the moment you don't, you have become something they have no category for.</p></div>
  <div class="pb"><span class="num">2</span><h4>Reading whole chapters instead of trading verses</h4><p>The camps teach "precept upon precept" — chains of single lines from across the Bible. The method is the vulnerability. Read Deuteronomy 28 from verse 1, or Isaiah 28 through verse 13, and the chain breaks on its own. You are not arguing against their verses; you are reading around them.</p></div>
  <div class="pb"><span class="num">3</span><h4>One question, then genuine silence</h4><p>"Who is verse 1 addressed to?" "If a white man repents, is he saved?" "What is the atonement when you break the law?" These are not gotchas — each one is a real question with no prepared camp answer, and they work precisely because you stop talking afterwards.</p></div>
  <div class="pb"><span class="num">4</span><h4>Being the Christian who is still around next month</h4><p>Street teaching is a performance space; friendship is not. Almost nobody leaves this movement because of an argument, and almost everybody who leaves has one patient person who kept treating them as a human being rather than as a debate.</p></div>
  </div>

  <div class="pb-h">The method</div><div class="pb-grid">
  <div class="pb do"><h4>Concede the true half, out loud</h4><p>Cheap grace is a real distortion. The church's silence on slavery is a real failure. Replacement theology — the idea that God is finished with Israel — is a real error the New Testament explicitly forbids (Romans 11:1). Grant all three before you contest anything, and you will be arguing with a person instead of a wall.</p></div>
  <div class="pb do"><h4>Distinguish the strands, always</h4><p>The 1896 church, the Dimona community, IUIC and ISUPK are not the same thing and do not like each other. Knowing the difference signals that you did the work — and it quietly makes the point that a "recovered ancient identity" is currently at war with itself over what it is.</p></div>
  <div class="pb do"><h4>Move the conversation off the street</h4><p>A podium, an amplifier, officers and a circle of phones is a stage, and every exchange there is scored by the crowd. Ask for coffee. If the answer is no, that itself tells you the exchange was never about the question.</p></div>
  <div class="pb dont"><h4>Don't fight about skin color</h4><p>The historical Jesus was a first-century Judean and did not look like a European painting — that much is simply true, and defending the painting makes you the caricature they preach about. It is also not the argument. Concede the point and go to whether he is the Messiah.</p></div>
  <div class="pb dont"><h4>Don't call the movement a hate group</h4><p>It is factually wrong as a blanket claim — it sweeps in a peaceable Israeli farming village and a 130-year-old denomination — and it ends the conversation instantly. Name a specific teaching if you must name something; never the whole movement.</p></div>
  <div class="pb dont"><h4>Don't bring the viral clip</h4><p>Confrontation footage ages badly, gets re-cut, and tells your listener only which outlet you watch. It trades a durable argument from the text for a perishable one from the news cycle.</p></div>
  </div>

  <div class="pb-h" style="margin-top:34px">How it actually goes — the deeper craft</div>
  <p class="sh-open">People do not join because the chart is <span class="hl">academically compelling</span>. They join because someone finally told them their history was in the Bible.</p>
  <p class="sh-att">— the thing to answer, and the thing never to mock</p>

  <div class="sa"><h4 class="sat">The four questions that do the most work</h4>
  <ol class="sh-list">
    <li><b style="color:var(--ink)">"Who is Deuteronomy 28:1 addressed to?"</b> Ask them to read it aloud. The chapter names its own audience, and the whole edifice is built on quoting it from the middle.</li>
    <li><b style="color:var(--ink)">"What does Deuteronomy 30 say happens after the curses?"</b> The same covenant that pronounces them promises the gathering back. The curses were never designed to be a permanent identity.</li>
    <li><b style="color:var(--ink)">"If salvation is by keeping the law, what is the atonement when you fail?"</b> There has been no altar since AD 70. This question has no answer inside the system, and it is the one that reaches people.</li>
    <li><b style="color:var(--ink)">"If a white man repents and believes, is he saved?"</b> Ask it gently. The answers differ camp to camp, and the disagreement inside the movement makes the point better than you can.</li>
  </ol></div>

  <div class="sa"><h4 class="sat">Start here</h4>
  <p class="pd">The <b>identity path</b> walks the one chapter everything else depends on; every case page ends with a suggested question and a scripted back-and-forth ("How the conversation usually goes") so you are ready for the counter-moves.</p>
  <button class="start" data-goto-path="identity">Open the identity path →</button></div>`
};

const MERGED = (()=>{
  const all = GLOSSARY.concat(GD.SHARED, GD.BHI);
  const seen = new Set(); const out = [];
  for (const g of all) { const k = g.t.toLowerCase(); if (seen.has(k)) continue; seen.add(k); out.push(g); }
  return out.sort((a,b)=>a.t.replace(/^the /i,'').toLowerCase().localeCompare(b.t.replace(/^the /i,'').toLowerCase()));
})();
console.log('bhi glossary terms:', MERGED.length);

const PRIMER = {"h":"New here? The story in ninety seconds","p":"<p><b>The core claim is that Black, Hispanic and Native Americans are the literal descendants of the twelve tribes of Israel</b> — and that the people known as Jews today are not. The argument runs almost entirely through one chapter: <b>Deuteronomy 28</b>, the covenant curses, and especially verse 68, which says the LORD will bring Israel back to Egypt in ships to be sold as slaves. Read as a prophecy of the transatlantic slave trade, the chapter appears to describe African-American history in detail.</p>\n    <p>Attached to it is a <b>12 Tribes Chart</b> mapping each tribe onto a modern nationality, and a doctrine identifying <b>Esau</b> and <b>Edom</b> with white people. Salvation, in the strongest camp teaching, is bounded by descent and by law-keeping.</p>\n    <p><b>This is not one organization, and that matters enormously.</b> It runs from the Church of God and Saints of Christ — founded in 1896 by William Saunders Crowdy, born enslaved, a Union Army veteran, and still a functioning denomination — through a vegan farming community at <b>Dimona</b> in Israel, to the confrontational street camps of the viral videos. They disagree with each other bitterly. Any argument that treats them as a single thing fails immediately.</p>\n    <p>And underneath all of it is a real grievance: the church was largely silent about slavery, and often worse. Names and terms in dotted underline can be hovered anywhere for a definition.</p>"};

build({
  slug: 'bhi', dataFile: 'bhi-data.json', compFile: 'companion-bhi.json',
  fieldMap: { quran: null, hadith: null, bible: 'bible' },
  labels: { quran: 'Cited', hadith: 'Camp sources', bible: 'Bible' },
  railNote: "Every reference here is cited by this specific claim — click a Bible reference to read the passage in place, in the King James Version the camps themselves use.",
  SECTIONS: { claim: "The identity claim", race: "Race, history & genetics", gospel: "Law & gospel", movement: "The movement" },
  CATS, SECMAP, CATDESC, WHYMAP, PATHS, TLACTS, RELATED,
  GLOSSARY: MERGED, primer: PRIMER,
  PATHIMG: {"identity":"https://commons.wikimedia.org/wiki/Special:FilePath/Open%20Torah%20scroll.jpg?width=900","race":"https://commons.wikimedia.org/wiki/Special:FilePath/Brookes%20slave%20ship%2C%20British%20Library%20(cropped).jpg?width=900","movement":"https://commons.wikimedia.org/wiki/Special:FilePath/PikiWiki%20Israel%2032040%20Africans%20Hebrew%20Israelites%20in%20Dimona.JPG?width=900"},
  TALK, TIPS, WHYTAIL, TOURSTEPS, core: CORE, share: SHARE,
  refRegex: "(?:12 Tribes Chart|One West|1WT|IUIC|ISUPK|Great Millstone|Commandment Keepers|Church of God and Saints of Christ)",
  timelineIntro: "What the movement teaches on the left; what its own documented history shows on the right.",
  lessonsIntro: "A street teaching follows a practised sequence — draw the crowd, establish the grievance, produce the chart, deliver the curses, then the call to wake up. Here is each stage, the one question to ask right then, and the cases behind it. Knowing the sequence lets you stay warm and unhurried.",
  methodFoot: "Steelman rules: every claim carries the strongest published camp defense; where the camps are right the case says so; popular Christian responses that fail are marked do not use.",
  roleNote: "<b>Role:</b> this is the passage the claim is built on.",
  VLABEL: { admitted: "Admitted", unrefuted: "Unanswered", contested: "Contested", answered: "Answered" },
  VDESC: {
    admitted: "The movement's own teachers state these facts openly — cite them from camp sources alone",
    unrefuted: "The objection is not engaged in camp materials — ask it, then wait",
    contested: "A serious rebuttal exists, and both sides hold something true",
    answered: "The text settles it — but the concession has to come first"
  },
  oldBrand: 'ISLAM · VS. THE BIBLE', newBrand: "HEBREW ISRAELITES · VS. THE BIBLE",
  keyPrefix: 'wbb_',
  textSwaps: [
    ['<title>Challenging Beliefs — Islam, Examined Against the Bible</title>', "<title>Challenging Beliefs — Hebrew Israelites, Examined Against the Bible</title>"],
    ["Know your Muslim neighbor", "Know the movement"],
    ["The da'wah script", "The street teaching"],
    ["Muslim friend", "friend in the camps"]
  ]
});

/* ---- verses: resolve Bible refs from KJV ---- */
const ot = require('./ot.json'), nt = require('./nt.json');
const books = {}; [...ot.books, ...nt.books].forEach(b => books[b.book.toLowerCase()] = b);
books['psalm'] = books['psalms'];
const built = JSON.parse(fs.readFileSync(P('bhi-data.built.json'), 'utf8'));
const cites = new Set(); built.forEach(d => (d.bible || []).forEach(c => cites.add(c)));
const out = {}; let ok = 0;
cites.forEach(orig => {
  let c = orig.replace(/[–—]/g, '-').replace(/\s*\(.*?\)\s*/g, '').trim();
  const mm = c.match(/^([1-3]?\s?[A-Za-z ]+?)\s+(\d+):([\d,\-\s]+)$/);
  if (!mm) return;
  const bk = books[mm[1].trim().toLowerCase()]; if (!bk) return;
  const ch = bk.chapters[parseInt(mm[2], 10) - 1]; if (!ch) return;
  const nums = []; mm[3].split(',').forEach(part => { const r = part.trim().match(/^(\d+)\s*-\s*(\d+)$/); if (r) { for (let i = +r[1]; i <= +r[2]; i++) nums.push(i); } else if (/^\d+$/.test(part.trim())) nums.push(+part.trim()); });
  const verses = nums.map(n => { const v = ch.verses[n - 1]; return v ? { v: n, t: v.text } : null; }).filter(Boolean);
  if (verses.length && verses.length <= 16) { out[orig] = { ref: bk.book + ' ' + ch.chapter, verses }; ok++; }
});
fs.writeFileSync(P('verses-bhi.json'), JSON.stringify(out));
console.log('verses-bhi.json:', ok, 'of', cites.size, 'refs resolved');
