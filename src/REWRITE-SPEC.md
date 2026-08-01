# Rewrite spec — Challenging Beliefs

You are rewriting one section of an evangelism reference site so an average adult, or a
15-year-old with no background, can actually use it. The site examines the claims of
other faiths against the Bible, honestly, with every source cited.

**Working directory:** `/private/tmp/claude-501/-Users-masonwallace-CAIAC-caiac-n8n-workflows/8454f02e-9c8f-4e0f-94ec-0cba23f85380/scratchpad/bom-app`

## What you produce — exactly two files

`plain-<slug>.json` and `full-<slug>.json`. Nothing else. Do not edit any other file,
do not run `build.js`, do not deploy.

### plain-<slug>.json
```json
{
  "case-id": [
    {"t": "Heading", "d": "Body text."},
    {"t": "Heading", "d": "Body text."},
    {"say": true, "t": "What to say", "d": "\"A line you'd actually say out loud.\""}
  ]
}
```
- **5 to 6 blocks per case.** The last must have `"say": true` and be titled `What to say`.
- Headings are self-explanatory sentences, not filing labels. Good: *What they teach*,
  *What the text actually says*, *Their answer, at full strength*, *Where that runs out*,
  *How strong is this argument?*, *Why this helps you*. Bad: *Verdict*, *Analysis*.
- The block set replaces the claim on the page. It must tell the whole story on its own —
  a reader who never opens anything else should understand the case completely.

### full-<slug>.json
```json
{ "case-id": { "claim": "...", "response": "...", "rationale": "..." } }
```
Rewrites of the three existing fields. Same facts, same sources, easier sentences.

## Hard limits — a script checks these, so check yourself first

Run `node check-section.js <slug>` in the working directory. It must print **ALL PASS**
before you finish. Re-run it after every edit.

| | reading grade | avg sentence | longest sentence |
|---|---|---|---|
| plain blocks | ≤ 7.9 | ≤ 14 words | ≤ 25 words |
| claim + response + rationale | ≤ 10.9 | ≤ 20 words | ≤ 35 words |

Quoted scripture is excluded from the measurement, so quote freely — but your own prose
must hit the numbers. The way to hit them is **short sentences, one idea each**, not
simpler vocabulary. Keep technical terms; explain them in the sentence.

## Rules that matter more than the numbers

1. **Never drop a source, a name, a number or a date.** Every scholar named in the
   original must still be named — Tovia Singer, Rashi, John Gee, Robert Ritner, Stephen
   Robinson, Bart Ehrman, whoever. Every date, count and citation survives.
2. **Concede first, at full strength.** Every case must state the other side's best
   answer as strongly as they would state it, before disagreeing. If half their critique
   is right, say which half, in their favour, first.
3. **Where a Christian argument is weak, say so plainly.** Some cases exist specifically
   to tell Christians to stop using an argument. Do not soften those into "be careful."
4. **No grading jargon in the plain blocks.** Never write "Graded Unrefuted" or
   "Graded Answered". The verdict badge already says it. Write plainly instead: *Strong
   for you*, *They admit this themselves*, *Genuinely arguable, both ways*,
   *Do not use this one*. Say **who** it is strong or weak *for*.
5. **Quote scripture with its reference** — `Isaiah 53:8`, `D&C 132:38`, `Alma 11:26-29`.
   References in the text become hoverable on the site, so this is functional, not
   decoration. Quote the actual words rather than describing them.
6. **Markup:** only `<b>` and `<i>` are allowed. No other tags. No markdown.
7. **Tone:** plain, calm, specific. No sneering, ever, about anyone's faith. Write as if
   the believer you are describing is reading over your shoulder — because they will be.
8. **The ⚠ don't-use entries** (ids starting `avoid-`, or `avoid: true` in the data) are
   the most sensitive on the site. Be blunt about the error and generous about the person.

## Where the source material is

Read the section's data file first and work from it. Do not invent facts.

| slug | data file | cases |
|---|---|---|
| `jw` | `jw-data.json` | 50 |
| `god` | `god-data.json` | 29 |
| `islam` | `islam-data.json` | 78 |
| `mormon` | `index.html` — parse `const DATA=[...]` | 119 |

Each case has: `id`, `title`, `claim`, `response` (the other side's defense),
`rationale` (the verdict), `verdict`, `severity`, `sources`, `responseSource`,
and sometimes `avoid: true`.

A finished example to match for voice and structure: `plain-messiah.json` and
`full-messiah.json`. Read both before you start.

## What "done" means

Every case in your section appears in both files, and `node check-section.js <slug>`
prints ALL PASS. Report the counts and anything you deliberately left as-is.
