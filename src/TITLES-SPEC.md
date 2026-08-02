# Spec — rewriting the case titles

**Working directory:** `/private/tmp/claude-501/-Users-masonwallace-CAIAC-caiac-n8n-workflows/8454f02e-9c8f-4e0f-94ec-0cba23f85380/scratchpad/bom-app`

## Why

Every case on this site carries a title, and those titles are how a reader chooses
what to open. They currently read like conference-paper headings — averaging ten
words, often longer:

> *Pervasive New Testament phrasing in allegedly pre-Christian Nephite texts*
> *Book of Mormon Isaiah variants cluster on KJV italicized words*
> *Anachronistic institutional terms: 'church,' 'synagogue,' 'Bible'*

The site owner's words: the titles are *"a bit wordy … they don't really seem very
interesting with how they are all worded."* He wants each one **obvious to a reader with
no background, and interesting enough to click.**

## What you produce

One file per section: `titles-<slug>.json`.

```json
{ "case-id": "The new title", "another-case-id": "Another title" }
```

Nothing else. Do not edit any other file. Do not run `build.js`.

## Where the titles appear

In a list, grouped under a heading that already states the verdict — *Admitted*,
*Unrefuted*, *Contested*, *Answered* — with a sentence explaining what that group
means. **So the title does not need to carry the verdict.** It needs to say what the
case is *about*, concretely, in a way a stranger understands.

## Hard limits

`node check-titles.js <slug>` must print **ALL PASS**.

- **3 to 9 words**, and **66 characters or fewer** (it has to hold one line)
- unique within the section
- no full stop at the end; no markup
- no vague filler: *issues, problems with, concerns about, various, certain, aspects*
- no limp openings: *The claim that…, Regarding…, On the…, A look at…*
- **must keep at least one specific** — a proper noun, a date or a number — from the
  original title, wherever the original had one. This is the anti-drift check: a title
  may not become generic. *"Horses (and chariots) in pre-Columbian America"* → *"Horses
  in America, 1,500 years too early"* keeps `horses`/`America`. → *"An animal problem"*
  fails, and deserves to.

## What makes a good title here

**Name the concrete thing, and let the oddity do the work.** The facts on this site are
striking on their own; they do not need selling.

| before | after |
|---|---|
| Isaiah chapters reproduced verbatim in King James English | A 600 BC book quoting a 1611 Bible |
| Horses (and chariots) in pre-Columbian America | Horses in America, 1,500 years too early |
| Steel and an iron industry in the pre-Columbian New World | Steel swords, in a continent without iron |
| Pervasive New Testament phrasing in allegedly pre-Christian Nephite texts | New Testament language, centuries too early |
| 2023 SEC settlement: $5M fine for two decades of concealed holdings via shell LLCs | A $5M SEC fine for hidden billions |

**Rules that matter more than the numbers:**

1. **Never overclaim.** The title must be honest about where the case actually lands.
   A `contested` case must not read like a knockout. A case whose verdict is `answered`
   — meaning the other side answers it well — must not be titled as if it were damning.
   Check each case's `verdict` field before you write its title.
2. **The ⚠ don't-use cases** (`avoid: true`) are warnings to Christians. Title them so a
   reader can see that instantly: *"Why the caffeine joke backfires"*, not a title that
   reads like an accusation.
3. **Never sneer**, and never write a title that mocks a person, a prophet, a scripture
   or a practice. Describe. The believer being described will read this.
4. **No clickbait.** No *"You won't believe…"*, no manufactured questions, no withholding
   the point to force a click. The interest comes from the fact itself.
5. **Plain words.** A 15-year-old with no background is the test. Keep a technical term
   only when it *is* the subject and no plain phrase exists.
6. Keep numbers and dates when they are the hook — *1,500 years*, *$5M*, *1852–1978*.

## Where the source is

| slug | data file |
|---|---|
| `mormon` | `index.html` — parse `const DATA=[...]` |
| `islam` | `islam-data.json` |
| `jw` | `jw-data.json` |
| `bhi` | `bhi-data.json` |
| `messiah` | `messiah-data.json` |
| `god` | `god-data.json` |

Each case has `id`, `title`, `verdict`, `severity`, `claim`, `plain` (the rewritten
plain-English blocks), `rationale`, and sometimes `avoid`. **Read the `plain` blocks
before retitling** — they say, in plain words, what the case actually argues. The best
new title is usually hiding in the first plain block.

## `messiah` and `god` — read the verdict labels, they differ

These two sections use `Conceded` / `Strong` / `Contested` / `Don't use` instead of
`Admitted` / `Unrefuted` / `Contested` / `Answered`. **They are not reversed polarity** —
this was stated wrongly in an earlier brief and two agents had to correct it from the
data. Verify before writing:

- the `claim` field holds the **Christian argument**; `response` holds the other side's
  best reply
- **`unrefuted` → "Strong"** means no good counter-argument has been published — strong
  **for the Christian**
- **`answered` → "Don't use"** means *this Christian argument does not hold up. Drop it.*
- **`admitted` → "Conceded"** means Jewish sources, or sceptical scholars, grant the
  point themselves

Confirm against `VDESC` in the built section file before titling. If a brief and the
data disagree, the data wins — say so in your report.

## What "done" means

Every case in your sections has a new title, `node check-titles.js <slug>` prints
ALL PASS, and you report: how many you rewrote, the average word count before and
after, your six best, and any case where you deliberately kept the original because
it was already right.
