const fs = require('fs');
const P = f => __dirname + '/' + f;
const build = require('./build-section.js');
const data = JSON.parse(fs.readFileSync(P('god-data.json'), 'utf8'));

const CATS = {
  "existence-arguments": "Does God exist?", "resurrection-case": "The resurrection",
  "manuscript-reliability": "The manuscripts", "archaeology-history": "Archaeology & history",
  "prophecy-evidence": "Prophecy", "objections-answered": "Their objections",
  "dont-use-apologetics": "Arguments to retire"
};
const SECMAP = {
  "existence-arguments": "god", "resurrection-case": "jesus",
  "manuscript-reliability": "bible", "archaeology-history": "bible", "prophecy-evidence": "bible",
  "objections-answered": "objections", "dont-use-apologetics": "objections"
};
data.forEach(d => { d.section = SECMAP[d.category] || 'objections'; });

const CATDESC = {
  "existence-arguments": "The four arguments worth actually making — and what the best atheist philosophers say back.",
  "resurrection-case": "What even skeptical scholars grant about Easter, and whether anything but a resurrection accounts for it.",
  "manuscript-reliability": "How the text got here — with the variant count stated honestly rather than spun.",
  "archaeology-history": "Where the spade confirms the record, and one place where it genuinely complicates it.",
  "prophecy-evidence": "Fulfilments that are impressive, fulfilments that are overclaimed, and how to tell the difference.",
  "objections-answered": "The skeptic's strongest arguments — evil, hiddenness, the conquest — answered within their real limits.",
  "dont-use-apologetics": "Popular Christian arguments that are false or embarrassing. Using them costs you everything else."
};
const WHYMAP = {
  "existence-arguments": "These do not deliver Christianity — they deliver the possibility of it. Their job is to move 'obviously not' to 'that's worth thinking about,' which is the only move most conversations need.",
  "resurrection-case": "Christianity is the one faith that stakes itself on a public, datable, falsifiable event. Paul says so himself: if it didn't happen, the whole thing is worthless.",
  "manuscript-reliability": "If the text can't be trusted to be what was written, nothing built on it matters. This is also where honesty pays most — the variant count is not a secret, and pretending otherwise is why people stop listening.",
  "archaeology-history": "The Bible makes checkable claims about real kings, real pools, and real officials. Some check out strikingly. One genuinely doesn't yet, and saying so is what makes the rest credible.",
  "prophecy-evidence": "Prophecy is the argument most often ruined by overclaiming. Handled carefully it is real evidence; handled loosely it converts a skeptic into a skeptic with a good story about you.",
  "objections-answered": "These are not talking points to defeat — they are the reasons people actually don't believe, and several of them are genuinely hard. An answer that pretends they're easy answers nothing.",
  "dont-use-apologetics": "Every one of these is still in circulation, and each one costs a hearing for everything true you have to say. Retiring them is the highest-return thing on this page."
};
const GLOSSARY = [
  { t: "the burden of proof", d: "Who has to make the case. Most atheists hold the 'lack of belief' position — not the claim that God does not exist — which means demanding they disprove God misfires immediately." },
  { t: "the Kalam", d: "'Whatever begins to exist has a cause; the universe began to exist; therefore the universe has a cause.' The most-debated theistic argument of the last fifty years, associated with William Lane Craig." },
  { t: "contingency", d: "The argument from things that could have not existed to something that could not have failed to. Often stronger than the Kalam because it does not depend on cosmology having the beginning right." },
  { t: "fine-tuning", d: "The observation that physical constants sit in extraordinarily narrow life-permitting ranges — the cosmological constant to roughly one part in 10^120. The standard reply is the multiverse." },
  { t: "the multiverse", d: "The proposal that vastly many universes exist with varying constants, so a life-permitting one is unsurprising. A serious hypothesis, and one that is not currently testable — which cuts both ways." },
  { t: "the minimal facts", d: "Gary Habermas's method: build only on data granted by the large majority of scholars, including skeptics — the crucifixion, the disciples' experiences, Paul's conversion, James's conversion, the early proclamation." },
  { t: "the 1 Corinthians 15 creed", d: "A formula Paul says he 'received' and passes on — dated by most scholars to within about five years of the crucifixion. The single biggest problem for legend-development theories." },
  { t: "textual variant", d: "Any difference between manuscripts, including spelling. The famous '400,000 variants' figure is real and almost entirely trivial; the meaningful-and-viable subset is well under 1%." },
  { t: "the problem of evil", d: "Logical form (evil is incompatible with God) is now widely regarded as failed, including by atheist philosophers; the evidential form (the amount and distribution of suffering counts against God) is live and genuinely hard." },
  { t: "divine hiddenness", d: "Schellenberg's argument: a perfectly loving God would ensure no one is non-resistantly unaware of him. The strongest argument in contemporary atheist philosophy after evil." },
  { t: "the deconvert", d: "Someone who was a Christian and is not now. They have heard your material, usually from people they loved, and then watched it answered. Treat them as an expert witness, not a project." },
  { t: "the 'none'", d: "The religiously unaffiliated majority of self-described atheists and agnostics — usually not philosophical atheists, usually not interested in arguments, and reachable mostly by relationship." },
  { t: "scientism", d: "The claim that only scientific methods yield knowledge — a philosophical claim that cannot itself be established scientifically. Point this out once, gently, and never as a gotcha." },
  { t: "methodological naturalism", d: "The working rule that science looks only for natural causes. It is a method, not a metaphysics — conflating the two is the most common mistake on both sides of this conversation." },
  { t: "Bayesian argument", d: "Reasoning about how much a piece of evidence raises or lowers the probability of a hypothesis. Most serious modern apologetics is Bayesian: no single knockdown, a cumulative case." },
  { t: "the Lady Hope story", d: "The claim that Darwin recanted on his deathbed. It is false, was denied by his family at the time, and repeating it is a live demonstration that you do not check your sources." }
];
const has = new Set(data.map(d => d.id));
const pick = (...ids) => ids.filter(i => has.has(i));
const PATHS = [
  { id: "existence", name: "Is there anything there at all?", desc: "The four arguments worth making — and the best replies to each", time: "≈ 25 min", items: pick("existence-kalam-contingency", "existence-fine-tuning", "existence-moral-argument", "existence-argument-from-reason") },
  { id: "easter", name: "The one falsifiable claim", desc: "What skeptical scholars grant, and whether anything else explains it", time: "≈ 22 min", items: pick("resurrection-minimal-facts", "resurrection-early-creed", "resurrection-hallucination-hypotheses") },
  { id: "text", name: "Is the book what was written?", desc: "Manuscripts, the honest variant count, the Scrolls, and the canon", time: "≈ 22 min", items: pick("manuscripts-nt-text", "manuscripts-dead-sea-scrolls", "manuscripts-canon-formation") },
  { id: "hard", name: "The hard questions", desc: "Evil, hiddenness, the conquest — the reasons people actually don't believe", time: "≈ 25 min", items: pick("objection-problem-of-evil", "objection-divine-hiddenness", "objection-canaanite-conquest", "objection-who-made-god") },
  { id: "retire", name: "Arguments to retire", desc: "Read this before you say anything — these cost you the conversation", time: "≈ 15 min", items: data.filter(d => d.avoid).map(d => d.id) }
].filter(p => p.items.length);

const TLACTS = [
  {
    num: "I", range: "AD 30 – 400", name: "The evidence is laid down", desc: "The events, the creed, and the manuscript chain that carries them", events: [
      { y: "AD 30/33", side: "record", crit: true, t: "The crucifixion", p: "Attested by Tacitus, Josephus, and the whole Christian record. Even Bart Ehrman calls it one of the most certain facts of ancient history.", id: "resurrection-minimal-facts" },
      { y: "c. AD 35", side: "record", crit: true, t: "The 1 Corinthians 15 creed forms", p: "A fixed formula Paul says he 'received' — resurrection belief within about five years, not legendary centuries.", id: "resurrection-early-creed" },
      { y: "c. 125", side: "record", t: "P52", p: "A fragment of John's Gospel copied within a generation or two of its writing — the earliest New Testament manuscript known." },
      { y: "c. 200", side: "record", t: "P46 and P66", p: "Substantial papyri of Paul's letters and John, roughly 150 years from composition.", id: "manuscripts-nt-text" },
      { y: "325–400", side: "record", crit: true, t: "Sinaiticus and Vaticanus", p: "Complete Bibles that match today's text. The canon was recognized, not invented at Nicaea.", id: "manuscripts-canon-formation" }
    ]
  },
  {
    num: "II", range: "1748 – 1906", name: "The modern challenge", desc: "The objections that still shape every conversation you'll have", events: [
      { y: "1748", side: "claim", crit: true, t: "Hume, 'Of Miracles'", p: "The argument that testimony can never establish a miracle — still the background of most resurrection skepticism.", id: "resurrection-hallucination-hypotheses" },
      { y: "1835", side: "claim", t: "Strauss's 'Life of Jesus'", p: "The Gospels as myth. The legend-development thesis that the early creed later undercuts.", id: "resurrection-early-creed" },
      { y: "1859", side: "record", t: "'On the Origin of Species'", p: "The event that produced a century of bad Christian arguments — and the deathbed-recantation legend that never happened.", id: "dontuse-darwin-recanted" },
      { y: "1906", side: "record", t: "Schweitzer's 'Quest'", p: "The historical-Jesus project begins in earnest; the criteria that later produce the minimal-facts consensus are forged here." }
    ]
  },
  {
    num: "III", range: "1947 – 2026", name: "What the ground gave up", desc: "A run of discoveries that answered the loudest objections", events: [
      { y: "1947", side: "record", crit: true, t: "The Dead Sea Scrolls", p: "A thousand-year transmission test, passed. Isaiah 53 and Psalm 22 are proved pre-Christian.", id: "manuscripts-dead-sea-scrolls" },
      { y: "1961", side: "record", crit: true, t: "The Pilate Stone", p: "Caesarea yields an inscription naming Pontius Pilate, Prefect of Judaea — a figure once argued to be legendary.", id: "archaeology-nt-corroboration" },
      { y: "1990", side: "record", t: "The Caiaphas ossuary", p: "The bones of the high priest of the trial narrative, in a decorated Jerusalem ossuary.", id: "archaeology-nt-corroboration" },
      { y: "1993", side: "record", crit: true, t: "The Tel Dan Stele", p: "An Aramean king boasts of defeating the 'House of David' — the dynasty minimalists had called a fiction.", id: "archaeology-ot-corroboration" },
      { y: "1998", side: "claim", crit: true, t: "The cosmological constant measured", p: "Dark energy is found to sit at roughly 1 part in 10^120 of its natural value — the sharpest fine-tuning datum there is.", id: "existence-fine-tuning" },
      { y: "2004–05", side: "record", t: "The Pool of Siloam", p: "A sewer repair in Jerusalem uncovers the pool of John 9 — one of the details critics had used to date John late.", id: "archaeology-nt-corroboration" },
      { y: "2006", side: "claim", t: "'The God Delusion'", p: "New Atheism peaks. Its philosophical case is criticized as thin by atheist philosophers themselves — Oppy and Carroll are the ones to read instead.", id: "objection-who-made-god" },
      { y: "2016", side: "record", t: "Schellenberg's hiddenness argument matures", p: "The strongest contemporary atheist argument after evil — and the one most Christians have never heard of.", id: "objection-divine-hiddenness" }
    ]
  }
];
const RELATED = {};
data.forEach(d => { RELATED[d.id] = data.filter(x => x.category === d.category && x.id !== d.id && !x.avoid).slice(0, 3).map(x => x.id); });

const TALK = {
  "existence-arguments": "Do not try to prove God at a dinner table. Aim one notch lower: **“Would you agree this is at least a question worth taking seriously?”** Contingency travels better than the Kalam — *“why is there anything at all, rather than nothing?”* — because it does not depend on any particular cosmology being right.",
  "resurrection-case": "Start where they already agree: **“Do you think Jesus existed and was crucified?”** Almost every informed skeptic says yes. Then, one step at a time: the disciples' experiences, Paul, James, the creed's date. Never assert the Bible is inspired here — you are arguing from documents, not from Scripture.",
  "manuscript-reliability": "Concede the number first, loudly: **“There are hundreds of thousands of variants — and I'll show you what they are.”** Spellings, word order, a handful of meaningful passages that every modern Bible footnotes. Honesty about the number is what makes the conclusion believable.",
  "archaeology-history": "Lead with the strongest and concede the weakest in the same breath: **“Tel Dan, Hezekiah's tunnel, the Pilate stone, the Pool of Siloam — and the Quirinius census is a genuine difficulty I can't fully resolve.”** That second clause is what makes the first one land.",
  "prophecy-evidence": "This is the easiest place to lose a skeptic by overclaiming. Use the Dead Sea Scrolls point — **“the text is provably older than the events”** — and skip the Tyre-brick-by-brick material entirely unless you know its complications cold.",
  "objections-answered": "Never answer these quickly. **“That's the strongest argument against what I believe, and I don't think it has a tidy answer”** buys more than any rebuttal. Then give the real one, with its limits named. On evil, ask what happened to them — very often the argument is a wound wearing a syllogism.",
  "dont-use-apologetics": "If you have used one of these, say so plainly: **“I used to argue that, and it was wrong.”** Nothing else you can do rebuilds credibility that fast, and every skeptic has a list of Christians who could not do it."
};
const TIPS = {
  verdict: {
    admitted: "Skeptical scholars themselves grant the core fact here — you can make the argument entirely from sources hostile to your conclusion, which is the only kind that travels.",
    unrefuted: "No adequate naturalistic answer exists — the published alternatives concede the point or change the subject.",
    contested: "Genuinely open. Serious philosophers argue this both ways, and saying so is what makes you worth talking to.",
    answered: "A popular Christian argument that does not survive scrutiny. Using it costs you the hearing for everything else."
  },
  impact: "How much weight the argument carries: MAJOR is load-bearing, MODERATE is corroborating, MINOR is a detail.",
  strongest: "One of the handful of cases with the most decisive evidence in the entire catalog — if you read only a few, read these."
};
const WHYTAIL = {
  admitted: "Skeptical scholarship grants the core fact here. Argue it from their sources and there is nothing to dispute except what follows from it.",
  unrefuted: "The published naturalistic alternatives do not answer this. Present it once, without pressing, and let it do its own work.",
  contested: "Serious people argue this both ways. Say that out loud before you take a side — a skeptic can tell when a case is being oversold, and that is usually the moment they stop listening.",
  answered: "Do not use this one. It is a popular Christian argument that fails, and it costs you the credibility of every true thing you have said."
};
const TOURSTEPS = [
  { icon: "🌌", title: "This section runs in reverse", body: "Everywhere else on this site the Bible is the standard. Here it isn't yet — so this section argues the other way: <b>__N__ cases</b> making the evidential case that God exists, that Jesus rose, and that the Bible is what it claims, using sources a skeptic already accepts. No verse is quoted as authority to someone who doesn't hold it as one." },
  { icon: "🎯", title: "Which atheist are you talking to?", body: "There is no such thing as 'talking to an atheist.' The <b>philosophical atheist</b> is rare, has real reasons, and enjoys the argument. The <b>apathetic none</b> is the majority and is not looking for one. The <b>deconvert</b> was a Christian, has already heard your best material, and is often carrying an injury. Misreading which one is in front of you is the most common failure — and no argument survives it." },
  { icon: "🏷", title: "Four verdicts, one glance", body: "Every case lands in one of four columns:<div class=\"vrow2\"><div><span class=\"badge v-admitted\">Conceded</span><span>skeptical scholars grant the fact</span></div><div><span class=\"badge v-unrefuted\">Strong</span><span>no adequate answer exists</span></div><div><span class=\"badge v-contested\">Contested</span><span>genuinely argued both ways</span></div><div><span class=\"badge v-answered\">Don't use</span><span>a Christian argument that fails</span></div></div><p style='margin:10px 0 0'>A third of this section is marked <b>Contested</b> on purpose. Overclaiming is how these conversations are lost.</p>" },
  { icon: "🧨", title: "Read the retirement list first", body: "The banana argument. 'No transitional fossils.' The second law of thermodynamics. Darwin's deathbed recantation. Pascal's wager as an opener. 'You secretly believe.' Every one is still circulating, and every one tells a skeptic you don't check your sources. <b>Arguments to retire</b> is the highest-return page on this site." },
  { icon: "🚀", title: "Where to start", body: "Take the <b>Easter path</b>: not 'the Bible says,' but what a room full of skeptical historians grants about AD 30 — a crucifixion, a set of experiences, a persecutor and a skeptical brother who both changed sides, and a creed dated within five years. Then ask what explains it. Replay this tour anytime from the sidebar.", cta: "Take me to the heart of it" }
];
const CORE = {
  navLabel: "The heart of it", navCount: "1", navTip: "The case in one page — argued from sources a skeptic already accepts",
  title: "The heart of it: one claim you can actually check",
  intro: "If you read nothing else on this section, read this page. Christianity is unusual among religions in staking itself on a public, datable event that could in principle be disproved — and its own founding document says so first.",
  html: `
  <div class="corebox"><h3>0 · Work out who is in front of you</h3>
  <p>There are three completely different conversations here. The <b>philosophical atheist</b> is rare, has genuine reasons, reads Oppy and Carroll, and will enjoy an argument conducted well. The <b>apathetic none</b> — the large majority — is not looking for an argument at all and is reachable almost entirely through relationship. The <b>deconvert</b> has already heard your best material, usually from people they loved, and often carries a real injury from the church.</p>
  <p>Deploying a philosophy-seminar case on someone in the third group is the single most common way this goes wrong. Ask first: <i>“what made you land where you are?”</i> — and then listen long enough to actually find out.</p>
  <details class="srcdet"><summary>Open the cases behind this</summary><div class="corelinks" style="margin-top:12px">\${link("dontuse-atheist-mind-reading")}\${link("objection-divine-hiddenness")}</div></details></div>

  <div class="corebox"><h3>1 · Aim lower than proof</h3>
  <p>No argument on this page proves Christianity, and pretending otherwise is why skeptics stop listening. The realistic target is one notch: from <i>“obviously false”</i> to <i>“that's actually worth thinking about.”</i> That move is achievable in a single conversation, and it is the move that matters.</p>
  <p>The arguments that do it best are cumulative, not knockdown: something rather than nothing (contingency); constants that sit in an absurdly narrow window; moral facts that feel discovered rather than invented; and the oddity of trusting a reasoning faculty built entirely by processes indifferent to truth. Each has a serious reply. Together they shift a prior — which is all evidence ever does.</p>
  <details class="srcdet"><summary>Open the cases behind this</summary><div class="corelinks" style="margin-top:12px">\${link("existence-kalam-contingency")}\${link("existence-fine-tuning")}\${link("existence-moral-argument")}</div></details></div>

  <div class="corebox"><h3>2 · The one falsifiable claim</h3>
  <p>Paul stakes the entire religion on a historical event and says plainly that if it did not happen, the faith is worthless and Christians are to be pitied. That is a remarkable thing for a religion to build into its own foundation documents, and it means the conversation can be had with history rather than authority.</p>
  <p>Start where a skeptical historian already is. The large majority of scholars — including agnostics and atheists — grant that Jesus was crucified under Pilate; that his followers had experiences they took to be appearances of the risen Jesus; that <b>Paul</b>, an active persecutor, changed sides after such an experience; that <b>James</b>, a skeptical brother, did too; and that the proclamation began immediately in the city where it could most easily have been refuted.</p>
  <p>Then the dating problem for legend theories: the creed in 1 Corinthians 15 is a fixed formula Paul says he <i>received</i>, and most scholars — again including skeptics — put it within about five years of the crucifixion. Legends take generations. This did not.</p>
  <details class="srcdet"><summary>Open the cases behind this</summary><div class="corelinks" style="margin-top:12px">\${link("resurrection-minimal-facts")}\${link("resurrection-early-creed")}\${link("resurrection-hallucination-hypotheses")}</div></details></div>

  <div class="corebox"><h3>3 · Concede the numbers, and win the argument</h3>
  <p>There are somewhere around 400,000 textual variants in the New Testament manuscript tradition. Say that first, out loud, before anyone asks. Then say what they are: spelling, word order, and a small number of passages — the longer ending of Mark, the woman caught in adultery — that every modern Bible already footnotes. No Christian doctrine rests on a disputed reading.</p>
  <p>The reason the number is large is the reason the text is secure: there are far more manuscripts than for any other ancient work, and more copies means more countable differences. And the Dead Sea Scrolls ran the same test on the Hebrew Bible across a thousand-year gap — and it passed.</p>
  <details class="srcdet"><summary>Open the cases behind this</summary><div class="corelinks" style="margin-top:12px">\${link("manuscripts-nt-text")}\${link("manuscripts-dead-sea-scrolls")}\${link("manuscripts-canon-formation")}</div></details></div>

  <div class="corebox"><h3>4 · Do not flinch at the hard ones</h3>
  <p>The evidential problem of evil and Schellenberg's hiddenness argument are the two strongest arguments in contemporary atheist philosophy, and neither has a tidy answer. The Canaanite conquest passages are genuinely difficult, and the options for reading them all cost something. Say all of that plainly.</p>
  <p class="pullq">"That's the strongest argument against what I believe, and I don't think it has a tidy answer."</p>
  <p>That sentence buys more credibility than any rebuttal, and it is also simply honest. Then give the real response, with its limits named — and on suffering, remember that the argument in front of you is very often a wound wearing a syllogism. Ask what happened to them before you answer what they said.</p>
  <details class="srcdet"><summary>Open the cases behind this</summary><div class="corelinks" style="margin-top:12px">\${link("objection-problem-of-evil")}\${link("objection-divine-hiddenness")}\${link("objection-canaanite-conquest")}</div></details></div>

  <div class="corebox"><h3>5 · Then stop arguing and offer a person</h3>
  <p>Nobody has ever been argued into the kingdom, and the evidence only clears ground. When it is cleared, the offer is not a proposition but a person — the one whose crucifixion even the atheist historians grant, and whose followers went to their deaths saying they had seen him afterwards.</p>
  <p>Ask the question that actually opens things: <i>“If it were true, would you want it to be?”</i> The answer tells you whether you are dealing with an argument or a grief, and those need very different things from you.</p>
  <p><button class="corelink" data-goto="share">How to actually have this conversation →</button></p></div>`
};
const SHARE = {
  title: "Sharing Jesus with a skeptic",
  intro: "Not to win a debate — the debate is almost never the real thing in the room. To be the Christian who is honest about what is hard, who doesn't use arguments they haven't checked, and who is still there next year.",
  html: `
  <div class="pb-h">The invitation to work toward</div>
  <div class="saybox"><span class="who">You, once there's real trust</span><p>"Would you read one Gospel with me — Luke, or Mark — and just tell me what you actually think of him?"</p></div>
  <p class="pd" style="font-size:.78rem;margin:0 0 4px">Most skeptics have opinions about Christianity and have never read a Gospel straight through as an adult. The offer is unusual precisely because it asks for their judgment rather than their agreement.</p>

  <div class="pb-h">What actually reaches a skeptic</div><div class="pb-grid">
  <div class="pb"><span class="num">1</span><h4>Conceding what is genuinely hard — first</h4><p>Evil, hiddenness, the conquest passages, the census of Quirinius. Naming these before you are pushed is the strongest move available to you, because every skeptic has met Christians who couldn't. A person who admits the difficulty is worth listening to on everything else; a person who has an instant answer for everything is worth listening to on nothing.</p></div>
  <div class="pb"><span class="num">2</span><h4>Arguing from sources that don't want your conclusion</h4><p>Bart Ehrman on the crucifixion. Gerd Lüdemann on the disciples' experiences. The dating of the 1 Corinthians 15 creed. The Tel Dan Stele. Every one of these comes from outside the church, and that is exactly why it travels — you are not asking them to trust your book, only to notice what their own side already grants.</p></div>
  <div class="pb"><span class="num">3</span><h4>Asking what happened to them</h4><p>Behind a large share of atheism is not an argument but a story: a church that covered something up, a prayer that went unanswered at the worst possible moment, a parent's funeral. The syllogism is real and deserves an answer, but it is usually not the thing that needs answering first. Ask, and then be quiet for a long time.</p></div>
  <div class="pb"><span class="num">4</span><h4>Being unembarrassing</h4><p>The fastest way to lose this conversation is a bad argument confidently delivered. Retiring the banana, the thermodynamics claim, the transitional-fossil line and the Darwin deathbed legend costs you nothing and buys you the right to be taken seriously on the resurrection.</p></div>
  </div>

  <div class="pb-h">The method</div><div class="pb-grid">
  <div class="pb do"><h4>Aim one notch, not the whole distance</h4><p>From "obviously false" to "worth thinking about" is a realistic single-conversation goal and a genuine victory. Trying to close the whole gap in one evening produces a person who now has a reason to avoid the topic with you.</p></div>
  <div class="pb do"><h4>Say "I don't know" when you don't</h4><p>Then go find out and come back with it. This is the single most credibility-building behaviour available in these conversations, and it is available to anyone regardless of how much philosophy they've read.</p></div>
  <div class="pb do"><h4>Know their best arguments better than they do</h4><p>Read Graham Oppy rather than a Christian summary of Oppy. Watch Sean Carroll's debate with Craig. A Christian who can state the hiddenness argument accurately before answering it is in a completely different category from one who has only met a caricature.</p></div>
  <div class="pb dont"><h4>Don't tell them what they secretly believe</h4><p>"You know God exists and are suppressing it," "you just want to sin," "atheism takes more faith." Each one tells your friend that you are talking to a stereotype rather than to them, and each one ends the conversation while sounding, to you, like a point scored.</p></div>
  <div class="pb dont"><h4>Don't open with Pascal's wager</h4><p>It was never designed as an opener — it addresses someone already persuaded the odds are non-trivial. Led with, it sounds like an invitation to fake a belief for insurance, which is both bad philosophy and bad theology.</p></div>
  <div class="pb dont"><h4>Don't make evolution the battlefield</h4><p>Christianity is not committed to a six-thousand-year-old earth, and large parts of the church have never thought so. Fighting there means the actual claim — a man executed under Pilate and seen alive afterwards — never gets discussed at all.</p></div>
  </div>

  <div class="pb-h" style="margin-top:34px">How it actually goes — the deeper craft</div>
  <p class="sh-open">"One of the most certain facts of history is that <span class="hl">Jesus was crucified</span> on orders of the Roman prefect."</p>
  <p class="sh-att">— Bart Ehrman, agnostic; the most-read skeptical New Testament scholar alive</p>

  <div class="sa"><h4 class="sat">The four questions that do the most work</h4>
  <ol class="sh-list">
    <li><b style="color:var(--ink)">"What made you land where you are?"</b> Ask it first, every time, and listen to the whole answer. It tells you which of the three conversations you are actually in, and nothing you say before knowing that is aimed at anything.</li>
    <li><b style="color:var(--ink)">"Do you think Jesus existed and was crucified?"</b> Almost every informed skeptic says yes. Starting from shared ground and moving one step at a time is the only version of this argument that works.</li>
    <li><b style="color:var(--ink)">"What would it take to change your mind?"</b> A fair question because you must answer it about yourself too — and Paul already did, in 1 Corinthians 15:17. If neither of you can answer it, you are not having an argument, you are having a standoff.</li>
    <li><b style="color:var(--ink)">"If it were true, would you want it to be?"</b> The most revealing question here. The answer distinguishes an intellectual obstacle from a grief or an injury, and those need entirely different things from you.</li>
  </ol></div>

  <div class="sa"><h4 class="sat">Start here</h4>
  <p class="pd">Read <b>Arguments to retire</b> before anything else — it is the highest-return page on the site. Then the <b>Easter path</b>: what skeptical historians grant about AD 30, and what explains it. Every case ends with a scripted back-and-forth ("How the conversation usually goes") with the strongest naturalistic reply included.</p>
  <button class="start" data-goto-path="easter">Open the Easter path →</button></div>`
};

build({
  slug: 'god', dataFile: 'god-data.json', compFile: 'companion-god.json',
  fieldMap: { quran: null, hadith: null, bible: 'bible' },
  labels: { quran: 'Cited', hadith: 'Sources', bible: 'Bible' },
  railNote: "Every reference here is cited by this specific claim — click a Bible reference to read it in place (KJV). Scholarly sources for each case are listed under the claim itself, and most link out.",
  SECTIONS: { god: "Does God exist?", jesus: "The resurrection", bible: "The Bible's reliability", objections: "Objections & missteps" },
  CATS, SECMAP, CATDESC, WHYMAP, GLOSSARY, PATHS, TLACTS, RELATED,
  TALK, TIPS, WHYTAIL, TOURSTEPS, core: CORE, share: SHARE,
  refRegex: "(?:Stanford Encyclopedia|SEP|Habermas|Ehrman|Oppy|Schellenberg|Bauckham|Wright|Licona|Craig|Carroll|4Q\\\\d+)",
  timelineIntro: "Claims and challenges on the left; what the ground and the manuscripts gave up on the right.",
  lessonsIntro: "There is no opposing script to counter here — the stages below are the shape of a conversation that actually goes somewhere: working out who you're talking to, clearing the bad arguments, conceding what's hard, arguing from their sources, and knowing when to stop and offer a person instead. Each stage carries the one thing to do right then, and the cases behind it.",
  methodFoot: "Method: every case carries the strongest naturalistic reply; a third are marked contested on purpose; popular Christian arguments that fail are marked don't use.",
  roleNote: "<b>Role:</b> this is the passage the argument refers to.",
  VLABEL: { admitted: "Conceded", unrefuted: "Strong", contested: "Contested", answered: "Don't use" },
  VDESC: {
    admitted: "Skeptical scholars grant the core fact — argue it from their sources, not yours",
    unrefuted: "No adequate naturalistic answer exists",
    contested: "Genuinely open — serious philosophers argue it both ways",
    answered: "A popular Christian argument that fails — retire it"
  },
  oldBrand: 'ISLAM · VS. THE BIBLE', newBrand: "THE CASE FOR GOD · FOR SKEPTICS",
  keyPrefix: 'wbg_',
  textSwaps: [
    ['<title>Challenging Beliefs — Islam, Examined Against the Bible</title>', "<title>Challenging Beliefs — The Case for God, for Skeptics</title>"],
    ["Know your Muslim neighbor", "Know your skeptical friend"],
    ["The da'wah script", "The shape of the conversation"],
    ["Muslim friend", "skeptical friend"]
  ]
});

/* ---- verses: resolve Bible refs from KJV ---- */
const ot = require('./ot.json'), nt = require('./nt.json');
const books = {}; [...ot.books, ...nt.books].forEach(b => books[b.book.toLowerCase()] = b);
books['psalm'] = books['psalms'];
const built = JSON.parse(fs.readFileSync(P('god-data.built.json'), 'utf8'));
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
fs.writeFileSync(P('verses-god.json'), JSON.stringify(out));
console.log('verses-god.json:', ok, 'of', cites.size, 'refs resolved');
