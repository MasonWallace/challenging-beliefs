const fs = require('fs');
const P = f => __dirname + '/' + f;
const build = require('./build-section.js');
const GD = require('./glossary-data.js');
const data = JSON.parse(fs.readFileSync(P('jw-data.json'), 'utf8'));

const CATS = {
  "nwt-translation": "The New World Translation", "chronology-607": "607 BC & 1914", "failed-dates": "Failed dates",
  "prophecy-authority": "Prophetic authority", "doctrine-of-god": "God, Christ & the Spirit",
  "two-class-salvation": "The 144,000 & two classes", "blood-doctrine": "The blood doctrine",
  "shunning-exit": "Shunning & leaving", "institutional": "The organization", "practice": "Daily practice"
};
const SECMAP = { "nwt-translation": "text", "chronology-607": "prophecy", "failed-dates": "prophecy", "prophecy-authority": "prophecy", "doctrine-of-god": "doctrine", "two-class-salvation": "doctrine", "blood-doctrine": "life", "shunning-exit": "life", "institutional": "life", "practice": "life" };
data.forEach(d => { d.section = SECMAP[d.category] || 'life'; });

const CATDESC = {
  "nwt-translation": "Verses the Watchtower's own Bible renders differently from every major translation — and why.",
  "chronology-607": "The date the entire 1914 doctrine rests on, and what the evidence says.",
  "failed-dates": "A century of published end-time predictions and what happened to them.",
  "prophecy-authority": "How the organization claims — and disclaims — the authority of God's channel.",
  "doctrine-of-god": "Who Jesus is, what the Spirit is, and what happens at death.",
  "two-class-salvation": "The doctrine that divides believers into a heavenly 144,000 and an earthly great crowd.",
  "blood-doctrine": "The transfusion ban: its 1945 origin, its shifting boundaries, and its cost.",
  "shunning-exit": "What happens to a Witness who doubts, resigns, or is expelled.",
  "institutional": "The organization's own conduct measured by the standard it applies to others.",
  "practice": "Holidays, education, and the shape of a Witness's week."
};
const WHYMAP = {
  "nwt-translation": "If a translation is edited to fit a doctrine, the doctrine can never be tested by the text — the ruler has been bent to match the board.",
  "chronology-607": "1914 is the foundation stone: no 607, no 1914; no 1914, no 1919 appointment; no appointment, no obligation to obey the Governing Body.",
  "failed-dates": "Deuteronomy 18:22 gives one test for a voice claiming to speak for God — and the record here is public, dated, and printed by the organization itself.",
  "prophecy-authority": "Everything a Witness believes arrives through one channel. Whether that channel is what it claims decides everything downstream.",
  "doctrine-of-god": "This is where salvation itself is at stake: a created archangel cannot bear the weight Scripture puts on the Son.",
  "two-class-salvation": "The New Testament knows one flock, one hope, one table — a system that tells most believers not to touch the bread and wine has no apostolic precedent.",
  "blood-doctrine": "This doctrine has a body count, and the line it draws has been redrawn repeatedly by committee.",
  "shunning-exit": "A message that is true does not need exit costs. This is the machinery that keeps every other question unexamined.",
  "institutional": "'By their fruits you will know them' applies to every tree — including the one claiming to be God's only channel.",
  "practice": "Where Scripture leaves liberty, binding every conscience organization-wide is what Jesus rebuked in the Pharisees."
};
const GLOSSARY = [
  { t: "the Governing Body", d: "The eight or so men at world headquarters who define all doctrine; since 2012 they identify themselves alone as the 'faithful and discreet slave' of Matthew 24:45." },
  { t: "the faithful and discreet slave", d: "Their name for the Governing Body, read out of Matthew 24:45 as a prophecy that Christ inspected all religions in 1919 and appointed them over his belongings." },
  { t: "NWT", d: "The New World Translation — the Watchtower's own Bible, produced by an anonymous committee, and the only translation used in their meetings and literature." },
  { t: "the anointed", d: "The 144,000 who go to heaven, are born again, are in the new covenant, and alone may take the Memorial bread and wine." },
  { t: "the great crowd", d: "Everyone else — roughly 99.9% of Witnesses — who hope to survive Armageddon and live forever on a paradise earth as God's 'friends' rather than his sons." },
  { t: "the Memorial", d: "Their one annual observance, on Nisan 14: the bread and wine are passed down the rows and nearly every person present declines them." },
  { t: "publisher", d: "A baptized or approved member who takes part in the preaching work and files a monthly activity report." },
  { t: "pioneer", d: "A publisher who commits to an hour quota in the ministry each month — the status held up to young Witnesses in place of university." },
  { t: "field service", d: "The door-to-door and cart witnessing work, usually organized in groups after a short meeting." },
  { t: "Kingdom Hall", d: "The local meeting place. Two meetings a week are held there; the building is deliberately plain and displays no cross." },
  { t: "disfellowshipped / removed", d: "Expelled after a judicial committee. Renamed 'removed from the congregation' in August 2024; other Witnesses, including family outside the household, cut off normal association." },
  { t: "disassociation", d: "Formally resigning — treated exactly like expulsion since 1981, which is why there is no neutral way to leave." },
  { t: "PIMO", d: "'Physically In, Mentally Out' — a member who no longer believes but keeps attending to avoid losing their family." },
  { t: "apostate", d: "Anyone who persistently disagrees with the Governing Body's teaching. A 2011 Watchtower called apostates 'mentally diseased' and told members to avoid their words entirely." },
  { t: "judicial committee", d: "Three elders meeting privately to decide a member's standing. No observers, no advocate, no recordings permitted." },
  { t: "Bethel", d: "A branch headquarters and the volunteer community that staffs it, under a vow of poverty — the organization's professional religious class, though it isn't called clergy." },
  { t: "the 1914 generation", d: "The teaching that people alive in 1914 would see Armageddon. Redefined in 1995, 2008, and again in 2010 as two 'overlapping' generations." },
  { t: "blood fractions", d: "Components-of-components (including hemoglobin) that individual conscience may accept, even though the whole blood they come from is forbidden." }
];
const has = new Set(data.map(d => d.id));
const pick = (...ids) => ids.filter(i => has.has(i));
const PATHS = [
  { id: "foundation", name: "The foundation: 1914 and the slave", desc: "Pull the one thread everything else hangs from", time: "≈ 25 min", items: pick("chron-607-vs-587", "dates-1874-1914-retrofit", "auth-fds-2012-governing-body", "auth-prophet-paradox") },
  { id: "jesus", name: "Who Jesus is", desc: "The archangel question, and what the NWT does to the verses", time: "≈ 20 min", items: pick("jesus-michael-archangel", "nwt-colossians-other-inserted", "nwt-john-1-1-a-god", "bodily-resurrection-denied") },
  { id: "gospel", name: "The gospel they were never offered", desc: "Two classes, one mediator, and a table almost nobody may touch", time: "≈ 20 min", items: pick("two-class-salvation-system", "memorial-passing-emblems", "mediator-only-144000", "1935-cutoff-abandoned") },
  { id: "cost", name: "What it costs", desc: "Blood, shunning, and the price of asking a question", time: "≈ 20 min", items: pick("blood-ban-1945-innovation", "blood-fractions-incoherence", "shunning-mechanics-family", "faders-pimo-exit-costs") },
  { id: "fair", name: "Where they're right", desc: "Popular criticisms that fail — read these before you talk", time: "≈ 12 min", items: data.filter(d => d.avoid).map(d => d.id).slice(0, 6) }
].filter(p => p.items.length);
const TLACTS = [
  { num: "I", range: "1879–1916", name: "Russell's Watch Tower", desc: "The founding chronology — and the dates that failed first", events: [
    { y: "1879", t: "Zion's Watch Tower founded", p: "Russell begins publishing; Christ's invisible presence is dated to 1874." },
    { y: "1889", side: "claim", crit: true, t: "1914 announced as the END", p: "'The battle of the great day of God Almighty… will end in A.D. 1914 with the complete overthrow of earth's present rulership.'", id: "dates-1874-1914-retrofit" },
    { y: "1878 / 1881", side: "record", t: "The first failures", p: "The saints were to be caught away bodily. They were not.", id: "dates-early-cluster-1878-1881-1918" },
    { y: "1914", side: "record", crit: true, t: "The world does not end", p: "War comes instead of Armageddon; the date is kept and its meaning replaced.", id: "dates-1874-1914-retrofit" }] },
  { num: "II", range: "1917–1975", name: "Rutherford and Knorr", desc: "New dates, new prohibitions, a new Bible", events: [
    { y: "1918", side: "record", t: "Prison and 'The Finished Mystery'", p: "Eight leaders jailed under the Espionage Act; the book's 1918 predictions fail.", id: "dates-early-cluster-1878-1881-1918" },
    { y: "1920–25", side: "claim", crit: true, t: "'Millions Now Living Will Never Die'", p: "Abraham, Isaac and Jacob expected by 1925; a San Diego mansion is deeded for them.", id: "dates-1925-beth-sarim" },
    { y: "1931", side: "record", t: "Vaccination forbidden", p: "'A direct violation of the everlasting covenant' — reversed in 1952.", id: "vaccination-ban-1931" },
    { y: "1945", side: "claim", crit: true, t: "Blood transfusion forbidden", p: "A prohibition the movement did not hold for its first 65 years.", id: "blood-ban-1945-innovation" },
    { y: "1950–61", side: "claim", t: "The New World Translation", p: "An anonymous committee publishes the organization's own Bible.", id: "nwt-committee-anonymity-credentials" },
    { y: "1954–64", side: "record", crit: true, t: "Worship of Jesus reversed", p: "Taught since 1898 and written into the charter — now called unscriptural.", id: "worship-of-jesus-flipflop" },
    { y: "1967", side: "claim", t: "Organ transplants = 'cannibalism'", p: "Reversed to a conscience matter in 1980, without apology.", id: "organ-transplants-cannibalism" },
    { y: "1975", side: "record", crit: true, t: "The 6,000 years end — and nothing happens", p: "Members sold homes; the organization later conceded its own publications built the expectation.", id: "dates-1975" }] },
  { num: "III", range: "1976–2026", name: "The modern reckonings", desc: "Redefinitions, exposures, and the courts", events: [
    { y: "1981", side: "record", crit: true, t: "Jonsson disfellowshipped", p: "The elder who checked the 607 math is expelled; his research has never been rebutted.", id: "chron-jonsson-gentile-times" },
    { y: "1992–2001", side: "record", crit: true, t: "UN NGO membership", p: "Nine years of association with the 'wild beast' — ended days after The Guardian exposed it.", id: "un-ngo-association" },
    { y: "1994", side: "record", t: "'Youths Who Put God First'", p: "Awake! celebrates 26 young people who died refusing blood.", id: "awake-1994-youths-died" },
    { y: "1995 → 2010", side: "claim", crit: true, t: "'This generation' redefined", p: "The masthead promise vanishes; by 2010 a 'generation' spans two overlapping lifetimes.", id: "dates-generation-1914-redefined" },
    { y: "2000", side: "claim", t: "Blood fractions permitted", p: "Hemoglobin becomes a conscience matter while red cells stay forbidden.", id: "blood-fractions-incoherence" },
    { y: "2011", side: "record", t: "'Mentally diseased'", p: "The Watchtower's term for former members who speak.", id: "apostates-mentally-diseased" },
    { y: "2012", side: "claim", crit: true, t: "The slave becomes the Governing Body", p: "Eight men reinterpret the proof-text of their own authority to mean themselves.", id: "auth-fds-2012-governing-body" },
    { y: "2015–16", side: "record", crit: true, t: "Australian Royal Commission", p: "1,006 alleged abusers in their own files; not one reported by the organization.", id: "arc-case-study-29" },
    { y: "2024", side: "record", t: "Shunning softened, not ended", p: "'Disfellowshipped' becomes 'removed'; a greeting is now allowed.", id: "shunning-mechanics-family" }] }
];
const RELATED = {};
data.forEach(d => { RELATED[d.id] = data.filter(x => x.category === d.category && x.id !== d.id && !x.avoid).slice(0, 3).map(x => x.id); });

const TALK = {
  "nwt-translation": "Never say *“your Bible is fake.”* Say: **“Can we read this verse in your Bible and in mine, side by side?”** Then let the insertion do the work — at Colossians 1:16-17 ask, *“Why is ‘other’ in brackets here but not in the 1950 edition? What Greek word is it translating?”* A Witness who checks the Kingdom Interlinear at that verse is doing the whole argument for you.",
  "chronology-607": "Do not lecture on Neo-Babylonian tablets. Ask: **“Where does the Bible say 607?”** It doesn't — 607 comes from subtracting 70 from 537, and every secular source dates the fall of Jerusalem to 587. Then the quiet follow-up: *“If 607 moves, what happens to 1914?”* Leave it there. This is a seed, not a hammer.",
  "failed-dates": "Read Deuteronomy 18:20-22 together first — let Scripture set the test, not you. Then: **“Has the organization ever published a date that didn't happen?”** Most Witnesses know about 1975. Very few know about 1925 and the Beth Sarim mansion. Ask, don't tell — *“Would you look up Beth Sarim in your own library?”*",
  "prophecy-authority": "The paradox is the whole conversation: **“Is the faithful and discreet slave inspired?”** Their publications say no. Then: *“If it isn't inspired, why is disagreeing with it grounds for losing my family?”* Ask it gently and without triumph. This question has walked more Witnesses out than any argument about 607.",
  "doctrine-of-god": "Go to John 20:28 in their own Bible and read it aloud: *“My Lord and my God.”* Then ask, **“What did Jesus say back? Did he correct him?”** Follow with Hebrews 1:6 — *“Does the NWT say the angels worship him, or ‘do obeisance’? What did it say before 1971?”* One verse, in their Bible, beats ten in yours.",
  "two-class-salvation": "At the Memorial the emblems pass by untouched — ask about that: **“Jesus said ‘drink ye all of it.’ Why did you pass it?”** Then 1 Timothy 2:5: *“Is Christ your mediator, or only theirs?”* This is the most personal question on the site. Ask it with tears in your eyes, not a raised eyebrow.",
  "blood-doctrine": "Never open here — it is their identity and their martyrdom. If it comes up: **“Why is hemoglobin a conscience matter when the red cell it came from is a disfellowshipping offense?”** Then Acts 15 in context — *“Is this a dietary ruling for table fellowship, or a medical rule about transfusion?”* One question, then silence.",
  "shunning-exit": "This is the wall around everything else, and the person in front of you may lose their mother over this conversation. Say it out loud: **“I know what this could cost you, and I'm not asking you to pay it today.”** Then the only question that matters: *“If it's the truth, why does leaving it have to cost you your family?”*",
  "institutional": "Use their own standard, never a sneer: **“You test other religions by their fruits — would you apply the same test here?”** Name the UN NGO years and the Royal Commission plainly, from the primary documents, and stop. Contempt for the organization reads as contempt for them.",
  "practice": "Where Scripture leaves liberty, don't argue the liberty — argue the conscience. **“Where does the Bible forbid a birthday?”** and then Romans 14: *“Paul says one man esteems one day above another — why isn't this a conscience matter?”* Keep it light; this is the least important door in the house."
};

const TIPS = {
  verdict: {
    admitted: "The Watchtower's own publications — the bound volumes, the Proclaimers history, the Index — concede the facts of this claim. Only the meaning is defended. You can cite this one entirely from their library.",
    unrefuted: "No adequate published answer exists — or the best defenses concede the core point rather than rebut it.",
    contested: "A serious rebuttal exists. Read both sides; the dispute is genuine.",
    answered: "The best defense holds up. The criticism is weaker than commonly presented — included so nothing is cherry-picked."
  },
  impact: "How serious the claim is, if true: MAJOR strikes at the foundation, MODERATE is significant, MINOR is a detail.",
  strongest: "One of the handful of cases with the most decisive documentary evidence in the entire catalog — if you read only a few, read these."
};
const WHYTAIL = {
  admitted: "The facts here sit in the organization's own publications — the only dispute is what they mean. In conversation, cite them exclusively from Watchtower sources; a Witness can verify every word in their own library.",
  unrefuted: "No adequate answer to this has been published. A Witness must either live with the tension or produce a response the Governing Body has not yet managed.",
  contested: "There is a genuine debate here — the honest move is to read both sides and weigh which explanation asks less of the evidence.",
  answered: "Fairly weighed, the defense wins this one. Christians who keep using it weaken their own credibility on the claims that do stand."
};
const TOURSTEPS = [{"icon": "🚪", "title": "What this is", "body": "<b>__N__ documented claims</b> about Jehovah's Witnesses, weighed against the Bible. Almost every fact is cited from the Watchtower's own publications, so a Witness can check it in their own library. Seven cases exist to tell Christians which arguments to drop."}, {"icon": "📖", "title": "Every case opens in plain English", "body": "Short blocks. One idea per sentence. What they teach, what the record shows, their best answer, how strong the case is, and one line to say at the door. The sourced version is underneath on the same page."}, {"icon": "🏷", "title": "Four verdicts, one glance", "body": "Every claim lands in one of four columns:<div class=\"vrow2\"><div><span class=\"badge v-admitted\">Admitted</span><span>their own publications concede it</span></div><div><span class=\"badge v-unrefuted\">Unrefuted</span><span>no good Watchtower answer exists</span></div><div><span class=\"badge v-contested\">Contested</span><span>they have a real answer — say so</span></div><div><span class=\"badge v-answered\">Answered</span><span>their answer wins, and we say so</span></div></div>"}, {"icon": "💔", "title": "Remember what it costs them", "body": "A Witness who agrees with you may lose their mother. Shunning is organised and it includes family. Say that out loud early — that you know what you are asking, and you are not asking them to pay it today. Nothing else you say lands until they believe you understand."}, {"icon": "🚀", "title": "Where to start", "body": "Read <b>The heart of it</b>. One date holds up everything else: 607 leads to 1914, which leads to 1919, which is the only basis for the Governing Body's authority. Pull the first link and the chain is on the floor.", "cta": "Take me to the heart of it"}];
const CORE = {
  hero: {"src":"https://commons.wikimedia.org/wiki/Special:FilePath/Jehovah's%20witnesses%20Kingdom%20Hall%20Hong%20Kong.png?width=900","cap":"A Kingdom Hall. Two meetings a week, no cross, and — for most of the people inside — a hope that depends on one date."},
  navLabel: "The heart of it", navCount: "1", navTip: "The single chain every other doctrine hangs from — read this first",
  title: "The heart of it: one date holds up everything else",
  intro: "If you read nothing else on this site, read this page. Nearly every distinctive Jehovah's Witness doctrine is suspended from a single chain of four links — and the first link is a date that no historian, and no verse, supports.",
  html: `
  <div class="corebox"><h3>1 · The chain</h3>
  <p><b>607 BC → 1914 → 1919 → the Governing Body.</b> The organization teaches that Jerusalem fell in 607 BC; that 2,520 years from 607 lands on 1914; that Christ returned invisibly in 1914, inspected all religions, and in 1919 appointed the Watchtower Society over his belongings. That 1919 appointment is the entire basis for the Governing Body's authority — and therefore for the blood doctrine, the shunning policy, the two-class salvation system, and the obligation to accept every future adjustment.</p>
  <p>Pull the first link and the whole chain is on the floor. That is why this is the only page you have to read.</p>
  <details class="srcdet"><summary>Open the cases behind this</summary><div class="corelinks" style="margin-top:12px">\${link("chron-607-vs-587")}\${link("auth-fds-2012-governing-body")}</div></details></div>

  <div class="corebox"><h3>2 · 607 is not in the Bible, and it is not in the ground</h3>
  <p>No verse gives the year. 607 is produced by taking 537 BC — the return from exile — and subtracting the seventy years of Jeremiah 25. Every other line of evidence disagrees: Babylonian business tablets, astronomical diaries dated by eclipses and planetary positions, king lists, and synchronisms with Egyptian and Assyrian records all place the fall of Jerusalem at <b>587/586 BC</b>, twenty years later. There is no scholar of the Neo-Babylonian period defending 607.</p>
  <p>In 1977 a Swedish elder named Carl Olof Jonsson submitted a careful study of exactly this to headquarters. He was disfellowshipped. His research has still never been answered.</p>
  <details class="srcdet"><summary>Open the cases behind this</summary><div class="corelinks" style="margin-top:12px">\${link("chron-607-vs-587")}\${link("chron-jonsson-gentile-times")}\${link("chron-70-years-servitude")}</div></details></div>

  <div class="corebox"><h3>3 · 1914 was not the original claim</h3>
  <p>This is the part almost no Witness has been told. Until 1943 the organization taught that Christ's invisible presence began in <b>1874</b>, not 1914 — and 1914 was published as the year the world would <i>end</i>: <i>“the battle of the great day of God Almighty… will end in A.D. 1914 with the complete overthrow of earth's present rulership”</i> (1889). When 1914 came and the world did not end, the date was kept and its meaning was replaced. A prediction that failed became a fulfilment.</p>
  <details class="srcdet"><summary>Open the cases behind this</summary><div class="corelinks" style="margin-top:12px">\${link("dates-1874-1914-retrofit")}\${link("dates-generation-1914-redefined")}</div></details></div>

  <div class="corebox"><h3>4 · The question that does the work</h3>
  <p>Do not argue Babylonian chronology at a doorstep. Ask one thing, kindly, and let it sit:</p>
  <p class="pullq">“Is the faithful and discreet slave inspired?”</p>
  <p>Their own publications answer no — the Governing Body has repeatedly said it is neither inspired nor infallible. Then the second question follows on its own: <b>if it isn't inspired, why does disagreeing with it cost me my family?</b> No date, no Greek, no history required. It is the question that has walked more Witnesses to the door than every chronology argument combined.</p>
  <details class="srcdet"><summary>Open the cases behind this</summary><div class="corelinks" style="margin-top:12px">\${link("auth-prophet-paradox")}\${link("shunning-mechanics-family")}</div></details></div>

  <div class="corebox"><h3>5 · And then the Jesus who is enough</h3>
  <p>Everything above only clears ground. The gospel is what you plant in it. A Witness has spent their life earning a place — hours, returns, studies, the hope of surviving Armageddon and then a thousand-year probation before life is finally secure. Nobody at the Kingdom Hall has ever told them that Jesus is not the archangel but the one at whose name every knee bows, that the Spirit is not a force but the Comforter who lives in them, or that the bread and cup at that Memorial were meant for <i>them</i>.</p>
  <p>Read John 20:28 with them, and 1 John 5:13 — <i>“that ye may know that ye have eternal life.”</i> Not hope. <b>Know.</b> That word is not in their vocabulary, and it is the whole reason to have this conversation at all.</p>
  <p><button class="corelink" data-goto="share">How to actually have this conversation →</button></p></div>`
};

const SHARE = {
  title: "Sharing Jesus with a Jehovah's Witness",
  intro: "Not to win the doorstep. To reach a person who has been taught that leaving will cost them their mother. Built from the testimony of former Witnesses and from ministries that have done this for decades, with gentleness (2 Timothy 2:24–25).",
  html: "<div class=\"pb-h\">Start with what it would cost them</div>\n<p class=\"pd\">This is the most important fact on the page. A Witness who leaves is shunned. Not by acquaintances, but by every person they love: parents, brothers and sisters, lifelong friends, and in many cases their own grown children. The Kingdom Hall is their entire community, calendar and family. So a door conversation is never a debate to win. You are asking someone to risk everyone they have. Nothing else you say will land until they believe you understand that.</p>\n\n<div class=\"pb-h\">The invitation to work toward</div>\n<div class=\"saybox\"><span class=\"who\">You, once there is real trust</span><p>\"Would you read the Gospel of John with me? Just the two of us, in your Bible, with no literature on either side.\"</p></div>\n<p class=\"pd\">This is the ask everything builds to. Witnesses are trained to conduct a study, not to receive one. An offer to read Scripture together as equals is unlike anything else in their week. John is also where the archangel doctrine quietly dies.</p>\n\n<div class=\"pb-h\">What actually reaches a Witness</div>\n<p class=\"pd\">Ranked by what ex-Witnesses report.</p>\n<div class=\"pb-grid\">\n<div class=\"pb\"><span class=\"num\">1</span><h4>A Christian who is still there in a year</h4><p>The organization claims that friendships on the outside are shallow and conditional. A neighbor who keeps showing up, keeps being kind, and never once gloats disproves that without arguing against it. Almost every exit story has one such person in it. The most common regret of ex-Witnesses is that nobody stayed.</p></div>\n<div class=\"pb\"><span class=\"num\">2</span><h4>Questions, never lectures</h4><p>Witnesses are drilled against arguments. Every objection you know already has a scripted counter in the <i>Reasoning</i> book. What they have no script for is a sincere question they cannot answer, asked by someone who obviously likes them. Ask it, then let the silence do the work. A question travels home with them. An argument does not.</p></div>\n<div class=\"pb\"><span class=\"num\">3</span><h4>Their own literature, in their own hands</h4><p>Never bring <i>apostate</i> material. The moment it appears you stop being a person and become a category. Ask them to look something up in their own library instead. The 1889 statement that 1914 would end the present order. Beth Sarim, in the <i>Proclaimers</i> book. The wording of Hebrews 1:6 before 1971. Watchtower facts, found by a Witness, in a Watchtower publication, cannot be waved off as apostate lies.</p></div>\n<div class=\"pb\"><span class=\"num\">4</span><h4>Assurance, which they have never once been offered</h4><p>Ask them: \"Do you know that you have eternal life?\" They cannot say yes. The honest answer is a hope conditioned on the organization, on Armageddon, and on a thousand-year probation after that. Then read 1 John 5:13 in their own Bible: \"that ye may know that ye have eternal life.\" Many former Witnesses date the start of their exit to that one verse.</p></div>\n</div>\n\n<div class=\"pb-h\">The method</div>\n<div class=\"pb-grid\">\n<div class=\"pb do\"><h4>Use their Bible, always</h4><p>Everything on this site can be shown in the New World Translation. Reaching for your own translation lets them file the whole conversation under <i>he does not trust our Bible</i>, and stop listening. John 20:28, 1 Timothy 2:5, 1 John 5:13 and Hebrews 1:6 all work in theirs. Where the New World Translation differs, do not accuse. Ask what Greek word is behind it, and ask them to check the Kingdom Interlinear.</p></div>\n<div class=\"pb do\"><h4>Name the cost out loud, early</h4><p>Say it plainly: \"I know that if you ended up agreeing with me, it could cost you your family. I am not asking you to pay that today.\" That does two things at once. It proves you understand their world. It also puts the shunning policy on the table as something that needs explaining.</p></div>\n<div class=\"pb do\"><h4>One question, then change the subject</h4><p>The doorstep is a poor classroom, and a Witness who feels cornered will not come back. Plant one thing, be genuinely warm, and let them leave wanting to return. The people who reach Witnesses are almost never the ones who won the first conversation. They are the ones who got a second, and a tenth.</p></div>\n<div class=\"pb dont\"><h4>Never mock the organization to their face</h4><p>To them the Governing Body is the channel God uses, and the Kingdom Hall is their whole life. Contempt for it reads as contempt for them. It also confirms exactly what they have been warned about opposers, and it ends the relationship. Honest questions about the organization are fair. Sneering never is.</p></div>\n<div class=\"pb dont\"><h4>Do not open with blood, holidays, or 607</h4><p>Blood is their identity and their martyrdom. Holidays are trivial. The 607 date is a research project. Opening on any of the three wastes the one conversation you may get. Start with who Jesus is, and with whether they can know they are saved. Those two doors lead somewhere.</p></div>\n<div class=\"pb dont\"><h4>Do not try to finish it in one sitting</h4><p>Nobody leaves a high-control group in an afternoon. The typical exit takes years and runs through dozens of small doubts. Your job is to be one of them, and to be the safe person they remember when the doubt finally arrives. Play a long game, or do not play.</p></div>\n</div>\n\n<div class=\"pb-h\">How it actually goes</div>\n<p class=\"sh-open\">Every distinctive doctrine they hold arrives through one channel. Their own publications say that channel is not inspired.</p>\n<p class=\"sh-att\">— the paradox at the centre of every conversation on this site.</p>\n\n<div class=\"sa\"><h4 class=\"sat\">The four questions that do the most work</h4>\n<ol class=\"sh-list\">\n<li><b>Is the slave inspired?</b> Ask it in their words: \"Is the faithful and discreet slave inspired?\" Their own publications answer no. Then ask, gently, why disagreeing with something uninspired is grounds for losing your family. This needs no history, no Greek and no chronology. There is no scripted answer for it.</li>\n<li><b>Do you know you have eternal life?</b> Read 1 John 5:13 in their Bible and let the word <i>know</i> sit there. Their whole system runs on a hope conditioned on performance. Assurance is the one thing the Kingdom Hall cannot give them.</li>\n<li><b>Why did you pass the cup?</b> Ask it after the Memorial, when they have just watched the emblems go by untouched: \"Jesus said drink ye all of it — why did you pass the cup?\" Then 1 Timothy 2:5 follows naturally. Is Christ their mediator, or only the mediator of the other class?</li>\n<li><b>What did Jesus say to Thomas?</b> Ask: \"What did Jesus say when Thomas called him my Lord and my God?\" He accepted it. Then open Hebrews 1:6, and ask what that verse said before 1971. Two verses, both in their own Bible, and the archangel doctrine has nowhere left to stand.</li>\n</ol></div>\n\n<div class=\"sa\"><h4 class=\"sat\">If they are already doubting</h4>\n<p class=\"pd\">A Witness who has begun to doubt is in real danger. They can lose their marriage, their parents and their whole social world in one week. Do not celebrate it. Do not push. Do not tell anyone. Offer three things instead. That you will still be there whatever they decide. That they can ask you anything without it turning into a project. And that the God of the Bible is not the God of the audit. Point them to the ex-Witness support communities for the practical side. You carry the gospel side.</p></div>\n\n<div class=\"sa\"><h4 class=\"sat\">Start here</h4>\n<p class=\"pd\">The <b>foundation path</b> walks the one chain everything else hangs from. Every case page ends with a suggested question and a scripted back-and-forth, so you are ready for the counter-moves.</p>\n<button class=\"start\" data-goto-path=\"foundation\">Open the foundation path →</button></div>"
};

const MERGED = (()=>{
  const all = GLOSSARY.concat(GD.SHARED, GD.JW);
  const seen = new Set(); const out = [];
  for (const g of all) { const k = g.t.toLowerCase(); if (seen.has(k)) continue; seen.add(k); out.push(g); }
  return out.sort((a,b)=>a.t.replace(/^the /i,'').toLowerCase().localeCompare(b.t.replace(/^the /i,'').toLowerCase()));
})();
console.log('jw glossary terms:', MERGED.length);

const PRIMER = {"h":"New here? The story in ninety seconds","p":"<p><b>In 1879 a Pittsburgh haberdasher named Charles Taze Russell began publishing a magazine called <i>Zion's Watch Tower</i>.</b> He taught that Christ had already returned invisibly — in 1874 — and that 1914 would bring the end of the present world order. When 1914 came and brought a world war instead of Armageddon, the date was kept and its meaning was changed: it now marked Christ's invisible enthronement rather than the end.</p>\n    <p>His successor <b>Joseph Rutherford</b>, a lawyer, took control after Russell's death in 1916, gave the movement its name in 1931, predicted the resurrection of Abraham, Isaac and Jacob by 1925, and built <b>Beth Sarim</b>, a San Diego mansion deeded to them. Later leaders added 1975. Each failure was absorbed rather than admitted.</p>\n    <p><b>The chain that holds everything together runs 607 → 1914 → 1919 → the Governing Body.</b> The organization dates Jerusalem's destruction to 607 BC, adds 2,520 years to reach 1914, and teaches that in 1919 Christ inspected all religions and appointed the Watch Tower Society over his belongings. That appointment is the basis of the Governing Body's authority — and therefore of the blood doctrine, the shunning policy, and the obligation to accept every future adjustment.</p>\n    <p>Along the way the organization produced its own Bible, the <b>New World Translation</b>, from an anonymous committee. Names and terms in dotted underline can be hovered anywhere for a definition.</p>"};

build({
  slug: 'jw', dataFile: 'jw-data.json', compFile: 'companion-jw.json',
  fieldMap: { quran: null, hadith: 'wt', bible: 'bible' },
  labels: { quran: 'Watchtower', hadith: 'Watchtower publications', bible: 'Bible' },
  railNote: "Every reference here is cited by this specific claim — click a Bible reference to read it in place. Watchtower citations are listed so a Witness can look them up in their own library.",
  SECTIONS: { text: "The translation", prophecy: "Dates & prophecy", doctrine: "The doctrine", life: "Organization & life" },
  CATS, SECMAP, CATDESC, WHYMAP, PATHS, TLACTS, RELATED,
  GLOSSARY: MERGED, primer: PRIMER,
  defLabel: "How Jehovah's Witnesses answer this \u2014 put at its strongest",
  IMGMAP: {"blood-ban-1945-innovation":{"src":"https://commons.wikimedia.org/wiki/Special:FilePath/200227-M-YY851-1143.jpg?width=520","cap":"A unit of donated blood. The prohibition dates from 1945, not from the movement's founding (Wikimedia Commons)"},"dates-1925-beth-sarim":{"src":"https://commons.wikimedia.org/wiki/Special:FilePath/Watchtower%2C%20July%201925%20(Russian%20Edition).jpg?width=520","cap":"A 1925 Watchtower. That year was published as the return of Abraham, Isaac and Jacob (Wikimedia Commons)"},"avoid-dismiss-persecution-record":{"src":"https://commons.wikimedia.org/wiki/Special:FilePath/Kennzeichen%20f%C3%BCr%20Schutzh%C3%A4ftlinge%20in%20den%20Konzentrations%20Lagern%20Nazi%20Germany%20concentration%20camp%20prisoners'%20badges.jpg?width=520","cap":"Nazi camp prisoner badges. The purple triangle marked Jehovah's Witnesses (Wikimedia Commons)"},"nwt-committee-anonymity-credentials":{"src":"https://commons.wikimedia.org/wiki/Special:FilePath/Codex%20Vaticanus%20B%2C%202Thess.%203%2C11-18%2C%20Hebr.%201%2C1-2%2C2.jpg?width=520","cap":"Codex Vaticanus — the kind of manuscript a translation committee works from (Wikimedia Commons)"}},
  PATHIMG: {"foundation":"https://commons.wikimedia.org/wiki/Special:FilePath/Watchtower%2C%20July%201925%20(Russian%20Edition).jpg?width=900","jesus":"https://commons.wikimedia.org/wiki/Special:FilePath/Codex%20Sinaiticus%2C%20GA%2001.jpg?width=900","gospel":"https://commons.wikimedia.org/wiki/Special:FilePath/Kingdom%20Hall%20of%20Jehovah's%20Witnesses%20in%20Karlsruhe-M%C3%BChlburg%20in%20Baden-W%C3%BCrttemberg.jpg?width=900","fair":"https://commons.wikimedia.org/wiki/Special:FilePath/Kennzeichen%20f%C3%BCr%20Schutzh%C3%A4ftlinge%20in%20den%20Konzentrations%20Lagern%20Nazi%20Germany%20concentration%20camp%20prisoners'%20badges.jpg?width=900"},
  TALK, TIPS, WHYTAIL, TOURSTEPS, core: CORE, share: SHARE,
  timelineIntro: "What was published on the left; what actually happened on the right.",
  lessonsIntro: "The doorstep call and the home Bible study follow a trained sequence — build rapport, establish a felt need, introduce the literature, then the study, the meetings, and baptism. Here is each stage, the one question to ask right then, and the cases behind it. Knowing the script lets you stay warm and unhurried.",
  methodFoot: "Steelman rules: every claim carries the best published Watchtower defense; weak criticisms are marked answered; facts conceded in the organization's own publications are marked admitted.",
  roleNote: "<b>Role:</b> this is the Watchtower teaching the claim examines.",
  refRegex: "(?:The Watchtower[,]?\\\\s(?:[A-Z][a-z]+\\\\s\\\\d{1,2},\\\\s)?\\\\d{4}|Awake![,]?\\\\s(?:[A-Z][a-z]+\\\\s\\\\d{1,2},\\\\s)?\\\\d{4}|w\\\\d{2}\\\\s\\\\d{1,2}/\\\\d{1,2}|Insight on the Scriptures|Proclaimers|Kingdom Interlinear|New World Translation|NWT)",
  VLABEL: { admitted: "Admitted", unrefuted: "Unrefuted", contested: "Contested", answered: "Answered" },
  VDESC: {"admitted": "The Watchtower's own publications admit these facts. You can make this point from their library alone.", "unrefuted": "No good counter-argument has been published by the Watchtower.", "contested": "Witness defenders have a real answer here. Say so before your friend does.", "answered": "The Witness answer holds up. Do not lead with this one."},
  oldBrand: 'ISLAM · VS. THE BIBLE', newBrand: "JEHOVAH'S WITNESSES · VS. THE BIBLE",
  keyPrefix: 'wbjw_',
  textSwaps: [
    ['<title>Challenging Beliefs — Islam, Examined Against the Bible</title>', "<title>Challenging Beliefs — Jehovah's Witnesses, Examined Against the Bible</title>"],
    ["Know your Muslim neighbor", "Know your Jehovah's Witness neighbor"],
    ["The da'wah script", "When they knock"],
    ["Muslim friend", "Witness at your door"]
  ]
});

/* ---- verses: resolve Bible refs from KJV ---- */
const ot = require('./ot.json'), nt = require('./nt.json');
const books = {}; [...ot.books, ...nt.books].forEach(b => books[b.book.toLowerCase()] = b);
books['psalm'] = books['psalms'];
const built = JSON.parse(fs.readFileSync(P('jw-data.built.json'), 'utf8'));
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
fs.writeFileSync(P('verses-jw.json'), JSON.stringify(out));
console.log('verses-jw.json:', ok, 'of', cites.size, 'refs resolved');
