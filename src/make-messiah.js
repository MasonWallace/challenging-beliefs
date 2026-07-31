const fs = require('fs');
const P = f => __dirname + '/' + f;
const build = require('./build-section.js');
const GD = require('./glossary-data.js');
const data = JSON.parse(fs.readFileSync(P('messiah-data.json'), 'utf8'));

const CATS = {
  "suffering-servant": "The suffering servant", "messianic-prophecy": "Messianic prophecy",
  "daniel-timeline": "Daniel's timeline", "temple-atonement": "The Temple & atonement",
  "new-covenant": "The new covenant", "rabbinic-objections": "The objections",
  "nt-jewishness": "The Jewish New Testament"
};
const SECMAP = {
  "suffering-servant": "portraits", "messianic-prophecy": "portraits",
  "daniel-timeline": "timing",
  "temple-atonement": "atonement", "new-covenant": "atonement",
  "rabbinic-objections": "objections", "nt-jewishness": "objections"
};
data.forEach(d => { d.section = SECMAP[d.category] || 'objections'; });

const CATDESC = {
  "suffering-servant": "Isaiah 52:13–53:12 — and the rabbinic literature that read it of the Messiah long before there was any reason to argue about it.",
  "messianic-prophecy": "The specific texts: Bethlehem, the pierced one, the scepter of Judah, and the expectation that was alive before Jesus was born.",
  "daniel-timeline": "The one prophecy with a clock in it — an anointed one cut off before the Second Temple falls.",
  "temple-atonement": "Leviticus 17:11, the vanished altar, and the forty years of failed signs the Talmud itself records.",
  "new-covenant": "Jeremiah 31 — the Tanakh's own promise of a new covenant, made to Israel and Judah by name.",
  "rabbinic-objections": "The counter-missionary case at its strongest, answered without contempt — and the Christian arguments that must be retired.",
  "nt-jewishness": "The New Testament as a first-century Jewish library, and the frame that forbids contempt: Romans 11."
};
const WHYMAP = {
  "suffering-servant": "This is the chapter the conversation is usually about. Getting it right — including what the rabbis themselves wrote about it — is the difference between a real conversation and a shouting match.",
  "messianic-prophecy": "Any one of these can be argued about. The cumulative case is what asks to be explained: a specific portrait, written centuries early, in texts your friend already holds as Scripture.",
  "daniel-timeline": "Every other prophecy can be placed anywhere in history. This one cannot — it has a terminus, and the Temple it names is gone.",
  "temple-atonement": "The Torah itself grounds atonement in blood on an altar. There has been no altar for nineteen centuries; something has to answer that.",
  "new-covenant": "The idea that a new covenant is a Christian invention is answered by a Jewish prophet, in the Jewish Scriptures, addressed to Israel by name.",
  "rabbinic-objections": "These are serious arguments made by serious people. Answering the strongest form of them is the only kind of answering that counts — and dropping the bad Christian arguments is part of the same discipline.",
  "nt-jewishness": "The single biggest obstacle is not an argument but a history: 'Christian' has meant something terrible to Jewish families. Romans 11 is the frame that forbids what was done."
};
const GLOSSARY = [
  { t: "Tanakh", d: "The Hebrew Bible, from the initials T-N-K: Torah (law), Nevi'im (prophets), Ketuvim (writings). The same books as the Christian Old Testament, in a different order — never call it 'the Old Testament' in conversation." },
  { t: "Mashiach", d: "'Anointed one' — Messiah. In mainstream Jewish expectation a human king of David's line who gathers the exiles, rebuilds the Temple, and brings world peace — which is precisely why a crucified Messiah reads as a contradiction in terms." },
  { t: "counter-missionary", d: "The organized Jewish response to Christian outreach — Outreach Judaism (Tovia Singer), Jews for Judaism. Well-prepared, well-funded, and worth reading before you speak." },
  { t: "Targum", d: "Ancient Aramaic renderings of the Hebrew Scriptures, read alongside the text in the synagogue. Targum Jonathan on Isaiah 52:13 opens: 'Behold, my servant the Messiah.'" },
  { t: "Talmud", d: "The vast rabbinic compilation (Mishnah plus Gemara, completed c. 500 AD). Two tractates matter most here: Sukkah 52a on two Messiahs, and Yoma 39b on the Temple's failed signs." },
  { t: "Rashi", d: "Rabbi Shlomo Yitzchaki (1040–1105), the most influential Jewish commentator. He read Isaiah 53 as national Israel — a reading that became standard after him, and was not standard before." },
  { t: "Messiah ben Joseph / ben David", d: "The rabbinic two-Messiah doctrine (Sukkah 52a): one who suffers and is killed, one who reigns. It exists because the texts genuinely present two portraits." },
  { t: "almah / betulah", d: "The two Hebrew words at the centre of the Isaiah 7:14 argument — 'young woman' and 'virgin'. Handle this one carefully; the Christian case here is weaker than it is usually presented." },
  { t: "kaari / kaaru", d: "The disputed word in Psalm 22:16 — 'like a lion' in the Masoretic text, 'they pierced' in the Septuagint and in a Dead Sea Scroll fragment from Nahal Hever." },
  { t: "avodah zarah", d: "'Foreign worship' — idolatry. To an observant Jew, worshipping a man is not a doctrinal disagreement but the gravest possible sin, which is why the incarnation is the real wall." },
  { t: "Shema", d: "'Hear, O Israel: the LORD our God, the LORD is one' (Deuteronomy 6:4) — recited twice daily, and the reason God's oneness is non-negotiable in any conversation." },
  { t: "Shoah", d: "The Holocaust. Christian Europe is where it happened, and Christian theology supplied centuries of its vocabulary. This is not background to the conversation — it is the room the conversation happens in." },
  { t: "supersessionism / replacement theology", d: "The teaching that the church has replaced Israel. Romans 11 explicitly denies it, and the historic Christian versions of it are behind much of what was done to Jewish communities." },
  { t: "Messianic Jew", d: "A Jewish person who believes Jesus is the Messiah. Most of the Jewish community regards the category as illegitimate — expect the term itself to be contested." },
  { t: "4Q521", d: "A Dead Sea Scroll fragment describing a Messiah who heals the blind and raises the dead — pre-Christian, and almost word for word what Jesus sends back to John the Baptist in Matthew 11." },
  { t: "Yoma 39b", d: "The Talmudic passage recording that for the forty years before the Temple's destruction the Yom Kippur lot came up wrong, the crimson thread stopped turning white, and the western lamp went out." }
];
const has = new Set(data.map(d => d.id));
const pick = (...ids) => ids.filter(i => has.has(i));
const PATHS = [
  { id: "servant", name: "The servant of Isaiah 53", desc: "The chapter, and what the rabbis wrote about it before the argument started", time: "≈ 22 min", items: pick("isaiah-53-rabbinic-messianic-reading", "isaiah-53-servant-distinct-from-israel", "sukkah-52a-two-messiahs") },
  { id: "clock", name: "The prophecy with a clock in it", desc: "Daniel 9, the Second Temple, and the forty years of failed signs", time: "≈ 20 min", items: pick("daniel-9-cut-off-before-destruction", "yoma-39b-forty-years", "atonement-after-the-temple") },
  { id: "portrait", name: "The portrait, text by text", desc: "Bethlehem, the pierced one, the scepter, and the expectation before Jesus", time: "≈ 25 min", items: pick("micah-5-2-bethlehem", "zechariah-12-10-pierced", "genesis-49-10-shiloh", "second-temple-messianic-expectation") },
  { id: "covenant", name: "The new covenant is a Jewish promise", desc: "Jeremiah 31, made to Israel and Judah by name", time: "≈ 15 min", items: pick("jeremiah-31-new-covenant", "nt-jewish-library", "hosea-blindness-restoration-romans-11") },
  { id: "fair", name: "Arguments to retire", desc: "Christian claims that fail — read these before you say anything", time: "≈ 12 min", items: data.filter(d => d.avoid).map(d => d.id) }
].filter(p => p.items.length);

const TLACTS = [
  {
    num: "I", range: "200 BC – AD 30", name: "The expectation", desc: "What Jewish people were waiting for, in their own pre-Christian sources", events: [
      { y: "c. 150 BC", side: "record", crit: true, t: "The Great Isaiah Scroll is copied", p: "Isaiah 53 sealed in a Qumran cave, more than a century before Jesus — the text is not a Christian edit.", id: "isaiah-53-rabbinic-messianic-reading" },
      { y: "c. 100 BC", side: "record", t: "Psalms of Solomon", p: "A Davidic king expected to purge Jerusalem and gather the tribes — the royal portrait, in Jewish hands." },
      { y: "c. 100 BC", side: "record", crit: true, t: "4Q521", p: "A Dead Sea Scroll Messiah who heals the blind and raises the dead — the exact answer Jesus later sends to John the Baptist.", id: "second-temple-messianic-expectation" },
      { y: "c. 200 BC", side: "record", t: "The Septuagint", p: "Jewish translators render Isaiah 7:14 'almah' as 'parthenos' — centuries before there was any Christian reason to.", id: "isaiah-7-14-almah" }
    ]
  },
  {
    num: "II", range: "AD 30 – 135", name: "Inside Judaism", desc: "A Jewish movement, a Jewish argument, and the Temple's end", events: [
      { y: "AD 30", side: "record", crit: true, t: "The forty years begin", p: "Yoma 39b: from this point the Yom Kippur lot fails, the crimson thread stops whitening, the western lamp goes out.", id: "yoma-39b-forty-years" },
      { y: "AD 50s", side: "record", t: "Paul writes Romans 9–11", p: "'Hath God cast away his people? God forbid.' The frame that forbids Christian contempt is in the New Testament itself.", id: "hosea-blindness-restoration-romans-11" },
      { y: "AD 70", side: "record", crit: true, t: "The Temple is destroyed", p: "The altar of Leviticus 17:11 ends. Daniel 9's anointed one was to be cut off before this, not after.", id: "daniel-9-cut-off-before-destruction" },
      { y: "AD 132–135", side: "record", t: "Bar Kokhba", p: "Rabbi Akiva declares Bar Kokhba the Messiah; the revolt is crushed. Messianic claims were live, mainstream, and testable." }
    ]
  },
  {
    num: "III", range: "AD 500 – 2026", name: "The long estrangement — and the recovery", desc: "How the argument hardened, what Christians did, and what changed", events: [
      { y: "c. 500", side: "record", crit: true, t: "Sukkah 52a", p: "The Talmud's two Messiahs — one who suffers and dies, one who reigns. The two portraits are conceded inside the tradition.", id: "sukkah-52a-two-messiahs" },
      { y: "1096", side: "record", crit: true, t: "The Rhineland massacres", p: "Crusaders slaughter Jewish communities on the way to Jerusalem. This is where 'Christian' begins to mean what it means.", id: "avoid-jews-killed-jesus" },
      { y: "1144", side: "record", t: "The blood libel is born at Norwich", p: "A fabrication that would kill Jewish people for eight centuries, invented by Christians." },
      { y: "c. 1100", side: "claim", crit: true, t: "Rashi reads Isaiah 53 as Israel", p: "The national reading becomes standard — and it was not standard before him.", id: "isaiah-53-servant-distinct-from-israel" },
      { y: "1290 / 1492", side: "record", t: "Expulsions", p: "England, then Spain. Forced disputations and Talmud burnings run alongside." },
      { y: "1543", side: "record", crit: true, t: "Luther, 'On the Jews and Their Lies'", p: "Quoted approvingly four centuries later by the Nazi party. Christians should name this before a Jewish friend has to." },
      { y: "1941–45", side: "record", crit: true, t: "The Shoah", p: "Six million, in Christian Europe. Nothing you say lands until you have acknowledged the room you are standing in." },
      { y: "1947", side: "record", crit: true, t: "The Dead Sea Scrolls surface", p: "Isaiah 53 and Psalm 22 are proved to predate Jesus by a century. The 'Christians changed the text' argument closes.", id: "prophecy-isaiah53-psalm22" },
      { y: "1990s–", side: "record", t: "Jewish scholarship reads the New Testament", p: "Levine, Boyarin, the Jewish Annotated New Testament — the NT recovered as a Jewish library, by Jewish scholars.", id: "nt-jewish-library" }
    ]
  }
];
const RELATED = {};
data.forEach(d => { RELATED[d.id] = data.filter(x => x.category === d.category && x.id !== d.id && !x.avoid).slice(0, 3).map(x => x.id); });

const TALK = {
  "suffering-servant": "Never open with *“read Isaiah 53.”* They have read it, and they have an answer. Open with the history instead: **“Did you know the Targum on this chapter calls the servant the Messiah?”** Then Sukkah 52a. You are not telling them what their book says — you are asking about their own tradition, and that is a completely different conversation.",
  "messianic-prophecy": "Never stack twelve prophecies in a row; it reads as a sales pitch and each one invites a rebuttal. Take **one** — Micah 5:2 or Zechariah 12:10 — and ask, *“How do you read this one?”* Then genuinely listen. The cumulative case only works if each piece was actually examined.",
  "daniel-timeline": "This is the one prophecy with a deadline, so let the deadline do the work: **“Daniel says an anointed one is cut off before the city and sanctuary are destroyed. The Temple fell in 70. Who was that?”** Don't argue about the exact arithmetic of the weeks — the terminus is the argument.",
  "temple-atonement": "Ask it as a real question, because it is one: **“Leviticus 17:11 says atonement is by blood on the altar. There has been no altar since 70 — what grounds atonement now?”** The answers are prayer, repentance and good deeds. Then, gently: *where does the Torah say that?* Ask once and stop.",
  "new-covenant": "The word 'new covenant' is not a Christian import — it is Jeremiah's. **“Who is the new covenant of Jeremiah 31 made with?”** Read the verse: with the house of Israel and the house of Judah. That single verse dissolves the 'you made up a new religion' frame before it forms.",
  "rabbinic-objections": "Counter-missionary arguments are serious, prepared, and often better than what you have. Say so: **“That's a real argument — let me think about it.”** Then answer the strongest form of it or admit you can't yet. Bluffing here is fatal; they have heard every bluff.",
  "nt-jewishness": "Before any text, name the history: **“I know what the word Christian has meant to Jewish families — the Crusades, the expulsions, Luther, and then Europe in 1941.”** Say it unprompted. Then Romans 11:1: *“has God cast away his people? God forbid.”* Nothing else you say will be heard until that is on the table."
};
const TIPS = {
  verdict: {
    admitted: "Jewish sources themselves — Targum, Talmud, medieval commentators, or contemporary Jewish scholarship — concede the core fact here. Cite it from their side of the aisle, not yours.",
    unrefuted: "No adequate counter-missionary answer exists — the strongest published replies concede the point or change the subject.",
    contested: "Genuinely open. Serious people argue this both ways, and the honest move is to say so.",
    answered: "A popular Christian argument that does not survive scrutiny. Using it costs you the conversation and the credibility of everything else."
  },
  impact: "How much weight the argument carries: MAJOR is load-bearing, MODERATE is corroborating, MINOR is a detail.",
  strongest: "One of the handful of cases with the most decisive evidence in the entire catalog — if you read only a few, read these."
};
const WHYTAIL = {
  admitted: "The core fact here is conceded in Jewish sources — Targum, Talmud, or Jewish scholarship. That means you can make this argument entirely from their library, which is the only way it will be heard.",
  unrefuted: "The published counter-missionary replies do not answer this. Present it once, without pressing, and let it sit.",
  contested: "This is genuinely argued both ways by serious people. Say that out loud before you take a side — pretending otherwise is how trust is lost.",
  answered: "Do not use this one. It is a popular Christian argument that fails, and using it hands away the credibility of everything true you have said."
};
const TOURSTEPS = [
  { icon: "🕎", title: "This section runs in reverse", body: "The rest of this site examines a religion's claims against the Bible. Here the Bible is <b>not</b> a shared standard yet — so this section does the opposite: it makes the case, from the <b>Tanakh alone</b>, that Jesus is Israel's Messiah, using sources a Jewish friend already holds. <b>__N__ cases</b>, each carrying the strongest counter-missionary reply." },
  { icon: "🕯", title: "First, the room you're standing in", body: "The Crusades, the blood libel, the expulsions, forced disputations, Luther's <i>On the Jews and Their Lies</i>, and then Christian Europe in 1941. That history is not background to this conversation — it <b>is</b> the conversation until you name it yourself, unprompted. Romans 11 forbids everything that was done. Say so before you open a single text." },
  { icon: "🏷", title: "Four verdicts, one glance", body: "Every case lands in one of four columns:<div class=\"vrow2\"><div><span class=\"badge v-admitted\">Conceded</span><span>Jewish sources grant the core fact</span></div><div><span class=\"badge v-unrefuted\">Strong</span><span>no adequate reply exists</span></div><div><span class=\"badge v-contested\">Contested</span><span>genuinely argued both ways</span></div><div><span class=\"badge v-answered\">Don't use</span><span>a Christian argument that fails</span></div></div><p style='margin:10px 0 0'><b>Conceded</b> is the strongest kind of argument here: made entirely from the Targum, the Talmud, and Jewish scholarship.</p>" },
  { icon: "💬", title: "One text, then listen", body: "Never stack twelve prophecies — it reads as a sales pitch and invites twelve rebuttals. Take one, ask <i>“how do you read this?”</i>, and mean it. Every case ends with <b>“How the conversation usually goes”</b>: a real back-and-forth with the counter-missionary reply included, because your friend will have it." },
  { icon: "🚀", title: "Where to start", body: "Take the <b>servant path</b>: Isaiah 53, and what the Targum and the Talmud said about it long before there was anything to argue about. It is the only argument on this site that is made entirely out of their own tradition. Replay this tour anytime from the sidebar.", cta: "Take me to the heart of it" }
];
const CORE = {
  hero: {"src":"https://commons.wikimedia.org/wiki/Special:FilePath/The%20Great%20Isaiah%20Scroll%20MS%20A%20(1QIsa)%20-%20Google%20Art%20Project.jpg?width=900","cap":"The Great Isaiah Scroll, copied about 125 BC. Chapter 53 was already there, more than a century before Jesus was born."},
  navLabel: "The heart of it", navCount: "1", navTip: "The case in one page — made from their sources, not ours",
  title: "The heart of it: the two portraits, and the clock",
  intro: "If you read nothing else on this section, read this page. The case that Jesus is Israel's Messiah does not require the New Testament — it can be made from the Tanakh, the Targum, and the Talmud. But it cannot be made at all until something else is said first.",
  html: `
  <div class="corebox"><h3>0 · Before any text — name the history</h3>
  <p>The Rhineland massacres of 1096. The blood libel born at Norwich in 1144. Expulsion from England in 1290 and Spain in 1492. Forced disputations, Talmud burnings, Luther's <i>On the Jews and Their Lies</i> — quoted approvingly by the Nazi party four centuries later. Then Christian Europe, 1941–1945.</p>
  <p>Say this <b>unprompted</b>, before you open a single verse. Not as a preamble to get past, but because it is true, and because your friend has spent their life waiting for a Christian who will say it without being pushed. Romans 11 forbade every bit of it: <i>"Hath God cast away his people? God forbid."</i></p>
  <details class="srcdet"><summary>Open the cases behind this</summary><div class="corelinks" style="margin-top:12px">\${link("hosea-blindness-restoration-romans-11")}\${link("avoid-jews-killed-jesus")}</div></details></div>

  <div class="corebox"><h3>1 · Two portraits, conceded inside the tradition</h3>
  <p>The Tanakh gives two pictures of the coming one that appear impossible to reconcile: a conquering king of David's line, and a servant who is despised, pierced, and killed. This is not a Christian observation. The rabbis saw it, and Sukkah 52a resolves it with <b>two Messiahs</b> — Messiah ben Joseph, who suffers and is slain, and Messiah ben David, who reigns.</p>
  <p>The Christian claim is smaller than it sounds: not two figures, but one, twice. He came the first time as the servant; he comes again as the king. Every element of the rabbinic solution is preserved — only the arithmetic changes.</p>
  <details class="srcdet"><summary>Open the cases behind this</summary><div class="corelinks" style="margin-top:12px">\${link("sukkah-52a-two-messiahs")}\${link("isaiah-53-servant-distinct-from-israel")}</div></details></div>

  <div class="corebox"><h3>2 · Isaiah 53 was read of the Messiah before the argument started</h3>
  <p>Targum Jonathan — the ancient Aramaic rendering read in synagogues — opens the passage: <i>"Behold, my servant <b>the Messiah</b> shall prosper."</i> The national reading, that the servant is Israel, became standard only after Rashi in the eleventh century, when there was a very good reason for it to.</p>
  <p>And the chapter itself distinguishes the servant from the nation: he is stricken <i>"for the transgression of <b>my people</b>"</i> (53:8). A people cannot be stricken for the transgression of that same people. He is also sinless — <i>"he had done no violence, neither was any deceit in his mouth"</i> — which the prophets never say about Israel.</p>
  <p>The Great Isaiah Scroll settles the other objection permanently: the text was copied at Qumran more than a century before Jesus. Nobody edited it.</p>
  <details class="srcdet"><summary>Open the cases behind this</summary><div class="corelinks" style="margin-top:12px">\${link("isaiah-53-rabbinic-messianic-reading")}\${link("isaiah-53-servant-distinct-from-israel")}</div></details></div>

  <div class="corebox"><h3>3 · The one prophecy with a deadline</h3>
  <p>Almost any prophecy can be placed anywhere in history. Daniel 9 cannot: an anointed one is <b>cut off</b>, and only <i>afterwards</i> do the people of a coming prince destroy "the city and the sanctuary." The sanctuary fell in AD 70. Whatever the exact arithmetic of the seventy weeks — and the arithmetic is genuinely argued — the sequence has a terminus, and it has passed.</p>
  <p>Alongside it sits a record from the Talmud itself. <b>Yoma 39b</b> reports that for the <b>forty years before the destruction</b> the Yom Kippur lot ceased coming up in the right hand, the crimson thread stopped turning white, and the western lamp went out. Forty years before 70 is AD 30. That is not a Christian source; it is theirs.</p>
  <details class="srcdet"><summary>Open the cases behind this</summary><div class="corelinks" style="margin-top:12px">\${link("daniel-9-cut-off-before-destruction")}\${link("yoma-39b-forty-years")}</div></details></div>

  <div class="corebox"><h3>4 · The question the Torah leaves open</h3>
  <p>Leviticus 17:11 grounds atonement in blood on the altar. There has been no altar for nineteen centuries. The modern answer — prayer, repentance, and good deeds — is a serious and ancient adaptation, but it is not what the Torah says, and Judaism after 70 has had to build it.</p>
  <p>Ask it as a genuine question, once: <b>what grounds atonement now?</b> Then stop talking. And note that Jeremiah 31 — the promise of a <i>new covenant</i>, written on the heart, with sins remembered no more — is not a Christian invention at all. It is made, by name, with the house of Israel and the house of Judah.</p>
  <p class="pullq">"Behold, the days come, saith the LORD, that I will make a new covenant with the house of Israel, and with the house of Judah." — Jeremiah 31:31</p>
  <details class="srcdet"><summary>Open the cases behind this</summary><div class="corelinks" style="margin-top:12px">\${link("atonement-after-the-temple")}\${link("jeremiah-31-new-covenant")}</div></details></div>

  <div class="corebox"><h3>5 · You are not asking them to stop being Jewish</h3>
  <p>This is the sentence that reframes everything, and it should be said plainly: the first generation of Jesus-followers was entirely Jewish, arguing from the Tanakh in synagogues, keeping the feasts. The New Testament is a Jewish library — and modern Jewish scholars, Amy-Jill Levine and Daniel Boyarin among them, read it that way.</p>
  <p>The claim is not that a Gentile religion replaced Israel. Romans 11 says the opposite, explicitly, and calls Gentile believers the branch grafted in — warned, in the same breath, not to boast against the root. Whatever you say, do not repeat the error that produced a millennium of blood.</p>
  <p><button class="corelink" data-goto="share">How to actually have this conversation →</button></p></div>`
};
const SHARE = {
  title: "Sharing Jesus with a Jewish friend",
  intro: "The hardest conversation on this site, and the one that most demands humility. Not a campaign, not a technique — a friendship in which a real history is named honestly and a real question is eventually asked.",
  html: `
  <div class="pb-h">The invitation to work toward</div>
  <div class="saybox"><span class="who">You, after real trust exists</span><p>"Would you read Isaiah 53 with me — and would you show me how the Targum and Sukkah 52a read it? I'd rather hear it from your sources than mine."</p></div>
  <p class="pd" style="font-size:.78rem;margin:0 0 4px">The whole posture is in that sentence: their library, their reading first, and you asking rather than telling. This is the one section of the site where you should expect to learn more than you teach.</p>

  <div class="pb-h">What actually reaches a Jewish friend</div><div class="pb-grid">
  <div class="pb"><span class="num">1</span><h4>Naming the history before you are asked</h4><p>Crusades, blood libel, expulsions, disputations, Luther, the Shoah. Say it unprompted and without a "but." Almost every Jewish person has met Christians who deflect this; being the one who doesn't is not a tactic, it is the minimum price of admission — and it is simply true.</p></div>
  <div class="pb"><span class="num">2</span><h4>Arguing from their sources, not yours</h4><p>The Targum on Isaiah 53. Sukkah 52a on the two Messiahs. Yoma 39b on the forty years. 4Q521 from the Dead Sea Scrolls. Every one of these is Jewish, most are pre-Christian or rabbinic, and none of them can be dismissed as a Christian gloss. This is the entire strategic difference between this section and the others.</p></div>
  <div class="pb"><span class="num">3</span><h4>One text at a time, with genuine listening</h4><p>Stacking prophecies feels powerful and lands as a pitch. Take one, ask how they read it, and actually consider the answer. Counter-missionary responses are serious and well-prepared; a Christian who engages the strongest form is rarer than one who has memorized twelve verses.</p></div>
  <div class="pb"><span class="num">4</span><h4>Friendship measured in years</h4><p>There is no version of this that works quickly, and pressure reads as exactly the coercion their ancestors experienced. The realistic aim of any single conversation is that they would be willing to have another one.</p></div>
  </div>

  <div class="pb-h">The method</div><div class="pb-grid">
  <div class="pb do"><h4>Say "Tanakh," not "Old Testament"</h4><p>"Old" implies superseded, and supersession is the theology behind the history. Small vocabulary choices — Tanakh, Yeshua if it's natural, "the Hebrew Scriptures" — signal that you know whose book you are holding.</p></div>
  <div class="pb do"><h4>Concede what is genuinely contested</h4><p>Isaiah 7:14 is weaker than most Christians are taught. Psalm 22:16 has a real textual question. Daniel's seventy weeks have several defensible arithmetics. Saying so, unprompted, is what buys credibility for Isaiah 53, Daniel's terminus, and Yoma 39b — the arguments that actually hold.</p></div>
  <div class="pb do"><h4>Let Romans 11 govern your posture</h4><p>Not a courtesy — a command. God has not cast away his people; the Gentile branch is grafted in and told explicitly not to boast against the root. A Christian who holds that verse cannot patronize a Jewish friend, and one who doesn't will eventually do so.</p></div>
  <div class="pb dont"><h4>Never say "the Jews killed Jesus"</h4><p>The deicide charge is the theological engine of a thousand years of massacre. It is also bad theology — a Roman prefect ordered the execution, and the New Testament's own account puts the responsibility on all of us. If it is in your vocabulary, take it out permanently.</p></div>
  <div class="pb dont"><h4>Don't quote-mine the Talmud</h4><p>Most viral "the Talmud says…" quotations are fabricated, mistranslated, or stripped of a context that reverses them — and they descend directly from medieval disputation propaganda. If you cannot read the passage in context on Sefaria, do not use it.</p></div>
  <div class="pb dont"><h4>Don't caricature Judaism as works-righteousness</h4><p>Second-Temple Judaism was a religion of covenant grace with obligations, not a merit ledger — and saying otherwise tells your friend you have never actually asked them what they believe. Ask instead. You will learn something, and you will be trusted with the answer.</p></div>
  </div>

  <div class="pb-h" style="margin-top:34px">How it actually goes — the deeper craft</div>
  <p class="sh-open">Targum Jonathan opens Isaiah 52:13: <span class="hl">"Behold, my servant the Messiah shall prosper."</span></p>
  <p class="sh-att">— an ancient Jewish rendering, read in synagogues, long before there was an argument to win</p>

  <div class="sa"><h4 class="sat">The four questions that do the most work</h4>
  <ol class="sh-list">
    <li><b style="color:var(--ink)">"How do you read Sukkah 52a?"</b> The two-Messiah doctrine concedes the two portraits. You are not disputing their tradition — you are asking why one figure twice is harder than two figures once.</li>
    <li><b style="color:var(--ink)">"Daniel says an anointed one is cut off before the sanctuary is destroyed. Who?"</b> The sequence has a terminus and the terminus has passed. Skip the arithmetic of the weeks; the order of events is the argument.</li>
    <li><b style="color:var(--ink)">"Leviticus 17:11 grounds atonement in blood on an altar. What grounds it now?"</b> Ask once, gently, and stop. It is the question Judaism has had to answer for nineteen centuries without the text that names the answer.</li>
    <li><b style="color:var(--ink)">"Who is Jeremiah's new covenant made with?"</b> Israel and Judah, by name. The phrase is not a Christian import; it is a Jewish prophet's promise, and it dissolves the "you invented a new religion" frame before it forms.</li>
  </ol></div>

  <div class="sa"><h4 class="sat">Start here</h4>
  <p class="pd">The <b>servant path</b> walks Isaiah 53 through the Targum and the Talmud — the one argument made entirely from their own library. Every case page ends with a suggested question and a scripted back-and-forth ("How the conversation usually goes") with the counter-missionary reply included.</p>
  <button class="start" data-goto-path="servant">Open the servant path →</button></div>`
};

const MERGED = (()=>{
  const all = GLOSSARY.concat(GD.SHARED, GD.MESSIAH);
  const seen = new Set(); const out = [];
  for (const g of all) { const k = g.t.toLowerCase(); if (seen.has(k)) continue; seen.add(k); out.push(g); }
  return out.sort((a,b)=>a.t.replace(/^the /i,'').toLowerCase().localeCompare(b.t.replace(/^the /i,'').toLowerCase()));
})();
console.log('messiah glossary terms:', MERGED.length);

const PRIMER = {"h":"New here? What this section is actually arguing","p":"<p><b>This section runs in the opposite direction from the rest of the site.</b> Everywhere else, the Bible is the shared standard and a movement's claims are weighed against it. Here the New Testament is not shared ground — so the case is made from the <b>Tanakh</b> (the Hebrew Bible), from the <b>Targum</b>, and from the <b>Talmud</b>: sources a Jewish friend already holds.</p>\n    <p><b>The central problem is that the Hebrew Scriptures give two portraits</b> of the one to come: a conquering king of David's line, and a servant who is despised, pierced and killed (Isaiah 53). These look irreconcilable — and the rabbis saw it too. <b>Sukkah 52a</b> resolves it with two Messiahs: Messiah ben Joseph, who is slain, and Messiah ben David, who reigns. The Christian claim is smaller than it sounds: not two figures, but one, twice.</p>\n    <p>Alongside that sit two datable arguments. <b>Daniel 9</b> has an anointed one cut off <i>before</i> the Temple is destroyed — and the Temple fell in AD 70. And <b>Yoma 39b</b>, in the Talmud itself, records that for the forty years before that destruction the Yom Kippur signs failed. Forty years before 70 is AD 30.</p>\n    <p><b>None of it can be said until something else is.</b> The Crusades, the blood libel, the expulsions, forced disputations, Luther, and the <b>Shoah</b> — that history is the room this conversation happens in, and it must be named first and unprompted. Terms in dotted underline can be hovered anywhere for a definition.</p>"};

build({
  slug: 'messiah', dataFile: 'messiah-data.json', compFile: 'companion-messiah.json',
  fieldMap: { quran: null, hadith: 'rabbinic', bible: ['tanakh', 'nt'] },
  labels: { quran: 'Cited', hadith: 'Rabbinic sources', bible: 'Tanakh & New Testament' },
  railNote: "Every reference here is cited by this specific claim — click a Scripture reference to read it in place (KJV); rabbinic citations open on Sefaria so your friend can check them in the original.",
  hadithUrlBody: 'function hadithUrl(h){\n  const m=String(h).match(/^([A-Za-z\' ]+?)\\s+(\\d+[ab]?)(?::(\\d+))?/);\n  if(!m)return null;\n  const t=m[1].trim().replace(/\\s+/g,"_");\n  return "https://www.sefaria.org/search?q="+encodeURIComponent(String(h));\n}\n',
  SECTIONS: { portraits: "The two portraits", timing: "The timing", atonement: "Atonement & covenant", objections: "The objections" },
  CATS, SECMAP, CATDESC, WHYMAP, PATHS, TLACTS, RELATED,
  GLOSSARY: MERGED, primer: PRIMER,
  PATHIMG: {"servant":"https://commons.wikimedia.org/wiki/Special:FilePath/The%20Great%20Isaiah%20Scroll%20MS%20A%20(1QIsa)%20-%20Google%20Art%20Project.jpg?width=900","clock":"https://commons.wikimedia.org/wiki/Special:FilePath/VilniusShasPage.jpg?width=900","portrait":"https://commons.wikimedia.org/wiki/Special:FilePath/Targum.jpg?width=900","covenant":"https://commons.wikimedia.org/wiki/Special:FilePath/Open%20Torah%20scroll.jpg?width=900"},
  TALK, TIPS, WHYTAIL, TOURSTEPS, core: CORE, share: SHARE,
  refRegex: "(?:Targum(?:\\\\sJonathan)?|Sukkah\\\\s\\\\d+[ab]|Yoma\\\\s\\\\d+[ab]|Sanhedrin\\\\s\\\\d+[ab]|Midrash\\\\s[A-Za-z]+|Rashi|Ibn\\\\sEzra|Maimonides|Mishnah|Talmud|4Q\\\\d+)",
  timelineIntro: "What was expected on the left; what happened and what was recorded on the right.",
  lessonsIntro: "There is no script to counter here — this is the other direction. These are the stages of a real friendship in which this conversation becomes possible: earning the right to speak, listening first, asking rather than telling, and knowing when to stop. Each stage carries the one thing to do right then, and the cases behind it.",
  methodFoot: "Method: every case carries the strongest published counter-missionary reply; arguments that fail are marked don't use; the strongest cases are the ones made from Jewish sources alone.",
  roleNote: "<b>Role:</b> this is the passage the argument rests on.",
  VLABEL: { admitted: "Conceded", unrefuted: "Strong", contested: "Contested", answered: "Don't use" },
  VDESC: {
    admitted: "Jewish sources themselves concede the core fact — the strongest kind of argument here",
    unrefuted: "No adequate counter-missionary reply exists",
    contested: "Genuinely open — serious people argue it both ways",
    answered: "A popular Christian argument that fails — retire it"
  },
  oldBrand: 'ISLAM · VS. THE BIBLE', newBrand: "THE MESSIAH CASE · FROM THE TANAKH",
  keyPrefix: 'wbm_',
  textSwaps: [
    ['<title>Challenging Beliefs — Islam, Examined Against the Bible</title>', "<title>Challenging Beliefs — The Messiah Case, from the Tanakh</title>"],
    ["Know your Muslim neighbor", "Know your Jewish friend"],
    ["The da'wah script", "Earning the conversation"],
    ["Muslim friend", "Jewish friend"]
  ]
});

/* ---- verses: resolve Tanakh + NT refs from KJV ---- */
const ot = require('./ot.json'), nt = require('./nt.json');
const books = {}; [...ot.books, ...nt.books].forEach(b => books[b.book.toLowerCase()] = b);
books['psalm'] = books['psalms'];
const built = JSON.parse(fs.readFileSync(P('messiah-data.built.json'), 'utf8'));
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
fs.writeFileSync(P('verses-messiah.json'), JSON.stringify(out));
console.log('verses-messiah.json:', ok, 'of', cites.size, 'refs resolved');
