# Spec — the tightening pass

**Working directory:** `/private/tmp/claude-501/-Users-masonwallace-CAIAC-caiac-n8n-workflows/8454f02e-9c8f-4e0f-94ec-0cba23f85380/scratchpad/bom-app`

## Why this exists

The readability gate had a bug. It treated a straight apostrophe as a quotation mark,
so in a sentence like *the rabbis' own reading* it paired that apostrophe with the next
real quote mark and deleted everything between them before measuring. The effect: real
scripture quotations went **unmeasured-as-quotes** while chunks of our own prose were
silently excluded. Sections that reported ALL PASS were being scored on a text that was
missing pieces.

The gate now only treats a matched pair as a quotation, and only counts a straight
apostrophe as an opener when no letter precedes it. Under honest measurement a number of
cases are over the limits. Your job is to bring them back under — **without rewriting
anything that already reads well.**

## What you produce

Updates to the two files your section already has: `full-<slug>.json` and, where listed,
`plain-<slug>.json`. **Only the cases named in your worklist.** Do not touch any other
case, any other file, or run `build.js`.

## Your worklist

Two generated files name exactly which cases fail and on which measure:

- `over-<slug>.txt` — cases whose `claim` / `response` / `rationale` are over
- `overplain-<slug>.txt` — cases whose `plain` blocks are over

Format: `case-id  g11.3 max44` — `g` = reading grade, `avg` = average sentence length,
`max` = longest sentence. Only the measures listed are failing.

| | grade | avg sentence | longest |
|---|---|---|---|
| plain blocks | ≤ 7.9 | ≤ 14 words | ≤ 25 words |
| claim + response + rationale | ≤ 10.9 | ≤ 20 words | ≤ 35 words |

## How to fix an over-limit case

**Split sentences. Do not simplify vocabulary and do not cut content.**

Most failures here are one of two shapes:

1. **The semicolon chain.** A sentence listing four things with semicolons is four
   sentences wearing a trenchcoat. Break it into four. This alone fixes most `max`
   failures.
2. **The stacked subordinate clause.** *Critics respond that X; that Y; that Z; and that
   a further point…* — same fix. Give each claim its own sentence and repeat the subject.

A `g` (grade) failure of 0.1–1.0 over is almost always fixed by splitting the two or
three longest sentences in the case — check the numbers before rewriting more than that.
A grade failure above 12 usually means genuinely dense subject matter; there you may
also need to add a short orienting sentence before the technical one.

**What you must not do:**
- Do not delete a source, a name, a number, a date or a citation to hit a number.
- Do not delete the other side's concession or weaken how strongly it is stated.
- Do not replace a technical term with a vague one. Keep the term; explain it in the
  sentence beside it.
- Do not touch a case that is not on your worklist, even if you think it could be better.

## Check yourself

`node check-section.js <slug>` must print **ALL PASS**. Re-run after every batch —
it now measures honestly, so trust it.

`node list-over.js <slug>` regenerates `over-<slug>.txt` from the current data files;
useful to confirm your worklist is shrinking. (It reads the merged data, so it reflects
the last merge, not your in-progress JSON — `check-section.js` is the live check.)

## Rules carried over

Everything in `REWRITE-SPEC.md` still applies — concede first at full strength, name
every source, no grading jargon in plain blocks, only `<b>` and `<i>`, never sneer.
Read it if you have not.

## What "done" means

Every case on your worklist is under the limits, `check-section.js <slug>` prints
ALL PASS, and you report which cases you changed and what you did to each — plus any
case where hitting the number would have cost content, which you should flag rather
than silently trim.
