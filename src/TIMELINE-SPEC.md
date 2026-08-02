# Spec — the timeline: fewer turning points, plainer acts

**Working directory:** `/private/tmp/claude-501/-Users-masonwallace-CAIAC-caiac-n8n-workflows/8454f02e-9c8f-4e0f-94ec-0cba23f85380/scratchpad/bom-app`

## The problem

Each section has a timeline built from `TLACTS` — acts, each holding dated events. Two faults:

**1. Everything is a turning point.** 19 of 34 Mormonism events carry `crit:true` — 56%.
The other sections run 45–59%. When more than half are flagged, the flag says nothing.
The owner asked directly: *"is JST Genesis 50 really a turning point?"*

**2. The act names are abstractions.** *Origins · The Hardening · The Reckonings* for
Mormonism; *The Record Before · The Revelation · The Preservation · Modern Reckonings*
for Islam. The reader is an ordinary churchgoer who is not into theology. These do not
tell them what they are about to read.

## What you produce

`timeline-<slug>.json`:

```json
{
  "acts": [
    { "i": 0, "name": "How it started", "desc": "The visions, the plates, and the founding claims" }
  ],
  "turningPoints": {
    "1837": "The Kirtland bank collapsed and took the prophet's credibility with it",
    "1843": "The revelation on plural marriage was written down"
  },
  "demote": ["1830–33", "1824–25"]
}
```

- `acts` — one entry per act, by index. A **plain-English name** (2–5 words, no
  abstractions) and a one-line description a stranger understands.
- `turningPoints` — keyed by the event's `y` (year) field **exactly as it appears in the
  data**. The value is one line saying **why this changed things** — that is what the flag
  is missing. 8–20 words.
- `demote` — the `y` values of events that currently carry `crit:true` and should lose it.

**Aim for 4 to 6 turning points per section, never more than 7.** If everything is
critical, nothing is.

## How to choose a turning point

A turning point is a moment after which the story could not go back — a claim made
publicly, a prediction that failed on the record, a doctrine reversed, a document
surfacing. Not merely an interesting event.

Judge each one on the evidence in the case it links to (`id` field → look it up in the
section's data). If an event has no `id` and no documented consequence, it is not a
turning point.

## Rules

- Never sneer. These are real people and real history.
- Act names must work for someone who has never read theology. *"How it started"*,
  *"When the story changed"*, *"What came out later"* are the register. Not *"Origins"*,
  not *"The Hardening"*.
- Do not invent events, dates or consequences. Everything comes from the existing data.
- Keep every event — you are re-flagging and renaming, not deleting.

`node check-timeline.js <slug>` must print ALL PASS.

## Sections

`mormon` (study.html) · `islam` (islam.html) · `jw` (make-jw.js) · `bhi` (make-bhi.js) ·
`messiah` (make-messiah.js) · `god` (make-god.js) — each holds `const TLACTS = [...]`.

Report: turning points before and after per section, the new act names, and your reasoning
for any event you demoted that looks important.
