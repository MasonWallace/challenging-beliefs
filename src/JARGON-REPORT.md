# Jargon audit — the words *around* the cases

**Scope.** Site furniture only: tooltips (`TIPS`), verdict descriptions (`VDESC`), category descriptions (`CATDESC`), guided-path names and descriptions (`PATHS`), view headings and intros, navigation labels, button text, empty states, the glossary intro, and the About / landing / parallels prose. Case content (`claim`, `response`, `rationale`, `plain`) was not touched — that has already had its readability pass.

**Deliverable.** `microcopy.json` — **90 rewrites across 9 files**, every `find` string verified present exactly once, and every rewrite dry-run applied and syntax-checked (`node --check` on the four `make-*.js`; inline-script parse on `study.html` and `islam.html`). Three of my first drafts broke the JavaScript by putting raw double quotes inside string literals; those were caught by the dry run and fixed before recording.

| File | Rewrites |
|---|---|
| `study.html` | 17 |
| `islam.html` | 17 |
| `make-jw.js` | 12 |
| `make-god.js` | 11 |
| `make-bhi.js` | 9 |
| `make-messiah.js` | 8 |
| `parallels-src.html` | 7 |
| `about-src.html` | 5 |
| `landing.html` | 4 |
| **Total** | **90** |

**Note on the two worked examples.** Both were applied upstream while this audit was running. `study.html` and `islam.html` now read *"Scholars argue this one both ways, and both sides have a real case. Read both before you use it."* and *"If this claim is right, how much does it matter? …"*. I have therefore (a) dropped those two entries from those two files, (b) propagated the same wording into the four `make-*.js` files, which still carry the old text, and (c) added one follow-up fix — see finding 4.

---

## The ten worst findings, worst first

### 1. `Answered` is a green badge that means "the other side wins"

**Where:** `VLABEL` in `study.html`, `islam.html`, `make-jw.js`, `make-bhi.js` — plus every tour step, the overview column headers, and the About page.

An ordinary reader sees a claim marked **Answered** in calm green and concludes *"good — this one has been dealt with."* It means the opposite: the criticism failed and the Christian should stop using it. `Unrefuted` (red) means the criticism stands. So on the busiest page of the site, the colour and the word both point the wrong way for a first-time reader.

The Messiah and Case-for-God sections already fixed this — they relabel the same four buckets **Conceded / Strong / Contested / Don't use**. "Don't use" cannot be misread by anybody. This is a coordinated change rather than a find/replace, which is why it is not in `microcopy.json`:

- `VLABEL` in `study.html`, `islam.html`, `make-jw.js`, `make-bhi.js` → `{admitted:"Admitted", unrefuted:"Unanswered", contested:"Contested", answered:"Don't use"}`
- the matching `<span>` text inside each `TOURSTEPS` "Four verdicts, one glance" step
- the About page's verdict rules

`Unrefuted` → `Unanswered` in the same pass: "unrefuted" is a debating word, "unanswered" is the same idea in a word a ninth-grader owns. **This is the highest-value change on the list and the cheapest.**

### 2. `islam.html` is showing Mormon text on every Islam case

**Where:** `islam.html` line ~765 (`WHYTAIL`), line ~751 (`TIPS.verdict.admitted`), line ~1118 (the `peculiar` header).

`WHYTAIL` — the italic tail on the "Why this matters" box of **every single Islam case** — is verbatim Mormon copy:

> "The facts here are conceded in **the church's own publications** … cite them exclusively from **LDS sources**…"

`TIPS.verdict.admitted` in `islam.html` likewise begins *"The church's own publications — essays, canon, official statements, sponsored histories…"*, and the `peculiar` section header says *"ranked by how surprising they are to a **non-Mormon**."*

This is not a jargon problem, it is a copy-paste bug, and it is the single most damaging thing on the site: a Muslim reader shown LDS boilerplate concludes the whole page was generated without care, and every verdict on it loses its authority. I deliberately did **not** put this in `microcopy.json` — fixing it means changing names, which is outside the brief you set — but it should be fixed before anything else here. `make-jw.js` shows the correct pattern (its `WHYTAIL` says "the organization's own publications … Watchtower sources"), so the Islam version needs the same treatment with Islamic sources named.

### 3. Guided path names that are riddles

Answering your first question directly — **the paths are still well-sequenced, but four of the twenty-two names or descriptions have gone opaque.** Details in the Guided Paths section below. The worst offenders:

- **`make-jw.js`: "The foundation: 1914 and the slave."** "The slave" is the faithful and discreet slave — meaningless to anyone who has not read the Watchtower, and it names the *first* path a new reader sees. Rewritten to *"1914 and 'the faithful slave'"* with a description that says what it refers to.
- **`make-god.js`: "The one falsifiable claim."** To a first-time reader "falsifiable" sounds like *can be faked* — the opposite of the intended meaning, which is *could have been proved wrong and wasn't*. Rewritten to "The one claim that could be proved wrong."
- **`make-god.js`: "Is the book what was written?" — "Manuscripts, the honest variant count, the Scrolls, and the canon."** Four specialist terms in nine words. This is the densest line of navigation on the site.
- **`study.html`: "The provenance story, in order."** "Provenance" is an auction-house word heading a 45-minute reading path.

### 4. The seriousness scale still has a broken sentence in it

**Where:** `TIPS.impact` in `study.html` and `islam.html` (as currently applied).

The applied rewrite reads: *"MAJOR shakes the foundation of the faith. **MODERATE matters but does not.** MINOR is a detail worth knowing."* The verb in the middle clause has nothing to attach to, so the middle of a three-point scale reads as a typo. Fixed in `microcopy.json` to *"MODERATE — it matters a lot, but the foundation holds."* Same meaning, finished sentence, parallel structure across all three.

Separately, the Messiah and God sections use a **different** scale — *"MAJOR is load-bearing, MODERATE is corroborating, MINOR is a detail"* — with two metaphors borrowed from building sites and courtrooms. Rewritten there too, so all six sections now say the same thing the same way.

### 5. "Steelman" is the site's founding principle and is never explained

**Where:** `about-src.html` (the first of four rules, and both meta descriptions), `study.html` and `islam.html` (`.methodfoot` under the overview, and the `peculiar` header's "steelmanned").

"Steelman first" is the very first rule on the About page — the page the landing page tells a newcomer to read *first*. It is a term from online argument culture; a regular churchgoer will not have met it. Worse, the footer of the main overview page opens with the bare heading **"Steelman rules:"**, which parses as a noun phrase about metal.

The rewrites lead with the plain version and keep the word attached to it — *"Give the other side its best shot first … a habit usually called steelmanning, the opposite of knocking down a straw man."* The term is taught rather than dropped, which is the brief.

Note: the identical sentence *"Our method: steelman first, cite their sources…"* appears in **both** meta tags in `about-src.html` (lines 8 and 11), so it cannot be matched uniquely. Change both by hand. The same duplication exists in `landing.html` lines 8 and 11 — the one entry in `microcopy.json` anchors to the `name="description"` tag and flags the twin.

### 6. "Corpus" is on the door of a whole section

**Where:** the Guided Paths intro in `study.html` and `islam.html`.

> *"Curated routes through the corpus."*

Four words, two of which ("curated", "corpus") belong to museums and linguistics. This is the first sentence of the section your navigation calls "Start here." Rewritten to *"Reading orders we put together for you — pick the one that fits what you need, and read the cases in order."*

### 7. `The da'wah script` is a navigation label in an untranslated foreign word

**Where:** `islam.html` nav (line ~1021) and the view heading (line ~1535).

A sidebar link reading **"The da'wah script"** gives a reader who does not already know the word no way to tell whether the page is for them — and it sits in the "For conversations" group, which is exactly where a nervous first-timer looks. Compare the Mormon equivalent, which is labelled *"When missionaries visit"* — instantly clear.

Rewritten to **"How they'll invite you"** with the term kept in the tooltip and in the page heading (*"How they'll invite you: the da'wah script"*), so the word is still learned, just not used as the only signpost.

### 8. "Exegesis" — and five other seminary words in the guidance text

The single most academic word left anywhere in the site's own voice is in `make-bhi.js`:

> *"Answer the **exegesis** without ever belittling the suffering."*

Alongside it, all now rewritten with the term kept and glossed in the same sentence:

| Word | Where | Problem |
|---|---|---|
| `exegesis` | `make-bhi.js` `WHYMAP` | seminary-only; nothing signals what it means |
| `counter-missionary` | `make-messiah.js` ×3 | the load-bearing term of the whole section, never defined at first contact |
| `naturalistic` | `make-god.js` `TIPS.unrefuted` | names the entire opposing position in one unexplained adjective |
| `Targum` | `make-messiah.js`, `landing.html` | explained in the primer, but the card and the tooltip are read by people who skipped it |
| `tafsir` | `about-src.html` | sits in a list of otherwise recognisable names, so the reader can't tell if they missed something |
| `sahih` | `islam.html` `.methodfoot` | the entire method rests on it — "facts conceded in sahih Islamic sources are marked admitted" |
| `shift a prior` | `make-god.js` `CORE` | Bayesian statistics vocabulary, mid-paragraph, in otherwise clear prose |
| `variant count` | `make-god.js` `CATDESC` | textual-criticism shorthand for a genuinely interesting fact |
| `tu quoque` | `parallels-src.html` | untranslated Latin, leading the sentence |
| `self-authenticating` | `parallels-src.html` | philosophy-of-religion vocabulary at the end of the page's key paragraph |
| `jurisprudence` | `parallels-src.html` | two law-school words where two ordinary ones do |
| `polemics` | `islam.html` `PATHS` | critic's vocabulary in a path description |
| `provenance` | `study.html` `PATHS`, `CATS` | archive vocabulary as a path title |
| `NWT` | `make-jw.js` `PATHS` | bare three-letter acronym in a path description |
| `apathetic none` | `make-god.js` ×2 | survey-research jargon that also reads as an insult |

### 9. The landing page promises an explanation that doesn't exist

**Where:** `landing.html` line 123 → `about-src.html`.

The About link's subtitle reads *"Our method, **the four verdict tiers**, and how to use the examinations."* But the About page never lists the four verdicts. It defines exactly one — Admitted — inside a bullet about something else. A reader who follows that link specifically to find out what the coloured badges mean does not find out.

The explanation exists; it is buried in the **tour overlay** (`TOURSTEPS`, "Four verdicts, one glance"), which only fires for people who take the tour. Two changes:

1. The `microcopy.json` rewrite makes the landing link honest — *"what the four verdict labels on every claim mean."*
2. **Then actually add the four-verdict block to `about-src.html`**, lifted from `TOURSTEPS`. This is a small new section, not a find/replace, so it is not in the JSON. It is the highest-value *addition* on this list.

Related: `landing.html`'s Messiah card puts **Tanakh, Targum and Talmud** — three unexplained proper nouns — into a single blurb on the front door. That is the precise moment a non-theology reader decides the site is not for them. Rewritten to *"books they already hold: the Hebrew Bible, the old Aramaic translation of it, and the Talmud."*

### 10. `Role:` — a database field showing through into the page

**Where:** `ROLENOTE()` in `study.html` and `islam.html`.

When you open a verse that has no "why it's cited" note, the box says:

> **Role:** this is the biblical standard the claim measures against.

"Role:" is a schema label, not a sentence opener, and "the biblical standard the claim measures against" is three abstractions stacked. Rewritten to *"**Why this verse is here:** it is the Bible passage the claim is measured against."*

Same class of problem, also fixed: `"The verses behind this claim — 7 refs"` (nobody outside publishing says "refs"), and `"Select an act to open its record"` on the timeline, where "act" and "record" both assume you already understand the page.

---

## Your three questions

### Do the Guided Paths still make sense?

**Sequencing: yes.** I read all twenty-two paths across the six sections and the ordering logic holds up after the rewrites. Every section follows the same well-judged arc — *foundation → the central doctrinal question → the gospel → the human cost → what critics get wrong* — and the final "where they're right / arguments to retire" path in each section is a genuinely distinctive move that the site is right to keep prominent. Nothing needs resequencing.

**Names and descriptions: four are broken for a non-theology reader**, all fixed in `microcopy.json`:

| Section | Was | Problem |
|---|---|---|
| JW | *The foundation: 1914 and the slave* | "the slave" is unexplained Watchtower shorthand, on the first path new readers see |
| God | *The one falsifiable claim* | "falsifiable" reads as "can be faked" — the opposite of the meaning |
| God | *Manuscripts, the honest variant count, the Scrolls, and the canon* | four specialist terms in nine words |
| Mormonism | *The provenance story, in order* | "provenance" as a path title |

And five more that were merely dense, also rewritten: JW's *"Two classes, one mediator, and a table almost nobody may touch"* (a riddle unless you know about the Memorial emblems); JW's *"what the NWT does to the verses"*; BHI's *"the chart"* (assumes the reader has met the 12 Tribes Chart, but this is the **starting** path) and *"the Khazar theory"* (named, never described); God's *"Is there anything there at all?"* (coy — say "Is there a God at all?").

**Two path names that are excellent and should be the model:** *"The prophecy with a clock in it"* (Messiah) and *"What it costs"* (JW). Both are plain, concrete, and make you want to click. That is the register the other twenty should aim at.

**One structural observation.** The path cards show `desc · time · 3/8 read`, and each path's contents list every case title. On a phone this is a very long card, and the reader must judge a 45-minute commitment from one sentence. A one-line "you'll finish this able to…" would do more than any amount of rewriting — but that is new copy, not a fix, so I have not invented it.

### The "Verses they quote" page — would showing the surrounding verses help?

**Yes, and this is the most valuable single improvement available to you, because the machinery already exists and this page is the only one not using it.**

Right now `renderProofs()` shows, for each of the ~15 entries:

- a heading that is *only the reference* — `1 Corinthians 15:29`, as plain text
- a "They may say" paragraph containing a **fragment** in quotes — *"Why are they then baptized for the dead?"*
- a "You respond" paragraph
- a footer: `Read together: Hebrews 9:27 · Alma 34:32-35 · Luke 16:26` — also plain text

So the reader never sees the verse. They see a fragment quoted by the *other* side, and an answer that repeatedly depends on context they cannot see. The Ezekiel 37 entry is the clearest demonstration: the whole answer is *"keep reading to verse 22"* — and verse 22 is not on the page. The reader has to take it on trust, which is exactly the posture this site exists to avoid.

Meanwhile the case pages already do this properly. `VERSES[cite]` carries the cited verse flagged `hl` **plus the verses either side**; `buildHtml()` renders the surrounding verses in normal type and the cited one in italics, labels it *"— Ezekiel 37:15-17, with the verses either side"*, and auto-scrolls the cited verse into view. There is even a `.ext` fallback chip for references not in the reader.

**What I would change:**

1. **Make `p.v` a chip, not a heading.** Render the reference through the same `chipHtml`/`openVerse` path the case pages use, with a `#versebox` on this view. One click opens the passage with its context, in place, no navigation.
2. **Make the `refs` footer chips too.** `Read together: Hebrews 9:27 · Alma 34:32-35 · Luke 16:26` is currently three dead strings. Those are the verses the reader most needs open, since they are the ones *they* will be reading aloud.
3. **Show the disputed passage expanded by default on this page only.** Everywhere else, opening on demand is right. Here the passage *is* the content — the page is called "Verses they quote". Print the cited verse plus two either side under the heading, before the "They may say" block, so the reader forms their own impression before either side spins it.
4. **Where the answer says "keep reading to verse N", extend the range to include verse N.** Ezekiel 37:15–22 rather than 15–17. This is a data change in `verses*.json`, and it converts the page's strongest argument from an assertion into something the reader watches happen.

Point 3 is the one that changes the experience. Points 1 and 2 are close to free — the components exist and are already wired on the neighbouring view.

### Is anything actively confusing, rather than merely dense?

Four things. In order:

1. **The `Answered` badge (finding 1).** Not dense — *inverted*. A reader who trusts the label will draw the opposite conclusion from the one intended, and the calm green reinforces the error. Everything else on this list makes someone work harder; this one makes them wrong.

2. **The Mormon text on the Islam pages (finding 2).** A Muslim reader — or a Christian preparing to talk to one — hits *"cite them exclusively from LDS sources"* on a page about the Quran. It is not confusing so much as disqualifying: it tells the reader nobody checked.

3. **`Unrefuted` vs `Answered` vs `Admitted` used as a set.** Even once the labels are fixed, note that these three words are all past participles of arguing verbs, and that nothing on the overview page says *who* did the admitting, refuting or answering. The `VDESC` line under each column header does say — *"Their own church publications admit these facts"* — but it is set in muted grey at `.74rem` and reads as a caption. Consider making it the same size as the column title. That single typographic change would do more for comprehension than several of my rewrites.

4. **`MODERATE matters but does not.` (finding 4).** A sentence with a missing predicate, sitting in the middle of a three-point scale. A reader will assume they have misread it and go back — twice.

**Two honourable mentions that are dense but *not* confusing, and should be left alone:** the "shelf" metaphor in the Sharing Jesus view and "friendshipping" — both are introduced with their explanation attached, and both are exactly the kind of insider vocabulary this site should be teaching, since the reader will hear them from their friend. And the `parallels.html` six-structure table is the best-written page on the site; my seven rewrites there are surface-level, and its framing should not be touched.

---

## Not rewritten, deliberately

- **Case content** (`claim`, `response`, `rationale`, `plain`) — out of scope, and already through a readability pass.
- **Anything that would change a fact, name, number or citation** — including the Mormon-text-in-Islam bug (finding 2), which needs correct Islamic source names substituted and is therefore a content decision, not a copy edit.
- **`VLABEL` (finding 1)** and **the four-verdict block for the About page (finding 9)** — both are coordinated multi-file changes or new copy rather than find/replace, and both are more valuable than anything in `microcopy.json`.
- **The duplicated meta descriptions** in `about-src.html` (lines 8, 11) and `landing.html` (lines 8, 11) — identical strings in two tags each, so they cannot be matched uniquely. Both flagged in the JSON's `why` fields; edit by hand.
