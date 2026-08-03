# Spec — the Defense & Verdict blocks

**Working directory:** `/private/tmp/claude-501/-Users-masonwallace-CAIAC-caiac-n8n-workflows/8454f02e-9c8f-4e0f-94ec-0cba23f85380/scratchpad/bom-app`

## The problem, measured

A reader comes down a case page through boxed, colour-coded plain-English blocks at
**reading grade 6.3**. Then they hit two fields that have never been rewritten:

| | words | grade |
|---|---|---|
| `response` — the other side's answer | 105 | **11.2** |
| `rationale` — the verdict | 97 | **10.8** |

That is a cliff. Your job is to close it, and to give each block a one-line summary a
reader can take away if they read nothing else.

## What you produce

`dv-<slug>.json`:

```json
{ "case-id": {
    "responseLead": "They say the word 'steel' just meant any hard metal.",
    "response": "…the full answer, rewritten…",
    "rationaleLead": "Strong for you on the New World half, weak on the Old.",
    "rationale": "…the full verdict, rewritten…"
} }
```

- **`responseLead`** — one sentence, **8–20 words**, stating the other side's answer in
  their favour. It appears in bold above the full text. A reader who stops here must
  still have understood their best reply.
- **`rationaleLead`** — one sentence, 8–20 words, stating where the case lands and
  **who it is strong or weak for**.
- **`response` / `rationale`** — the same content, rewritten.

## Hard limits

`node check-dv.js <slug>` must print **ALL PASS**.

| | grade | avg sentence | longest |
|---|---|---|---|
| `response`, `rationale` | ≤ 9.4 | ≤ 17 words | ≤ 30 words |
| the two lead lines | ≤ 9.0 | — | ≤ 20 words |

Quoted scripture is excluded from the measurement, so quote freely — your own prose
must hit the numbers. Hit them with **short sentences, one idea each**, not by
simplifying vocabulary.

**Paragraph the long fields.** Use `\n\n` between paragraphs. A 105-word block is two or
three paragraphs, split at its natural turn — usually a *"But…"* or *"It also…"*. The
checker requires at least one break in any field over 70 words.

## Rules that matter more than the numbers

1. **Never drop a source, a name, a number or a date.** Every scholar named — Lawson,
   Ayoub, Gee, Ritner, Ehrman, Rashi, whoever — stays named.
2. **The other side's answer must stay at full strength.** `response` is the steelman.
   If your rewrite makes it weaker or easier to dismiss, you have broken the site's
   central promise. Concede first, in their favour, before any disagreement.
3. **Never overclaim in a lead line.** Check the case's `verdict` field. A `contested`
   case cannot have a lead that reads like a knockout; an `answered` case must say
   plainly that this one does not work.
4. **The ⚠ `avoid: true` cases** are warnings to Christians. Their leads say so.
5. **Markup:** only `<b>` and `<i>`. No other tags, no markdown.
6. **Tone:** plain, calm, specific. Never sneer. The believer being described will read it.

## Sections and data

| slug | data file | cases |
|---|---|---|
| `mormon` | `index.html` — parse `const DATA=[...]` | 119 |
| `islam` | `islam-data.json` | 78 |
| `jw` | `jw-data.json` | 50 |
| `bhi` | `bhi-data.json` | 23 |
| `messiah` | `messiah-data.json` | 19 |
| `god` | `god-data.json` | 29 |

Each case already has finished `plain` blocks at grade 6.3 — **read them first.** They
are the register to match, and the lead lines are often already stated there in plain
words.

`messiah` and `god` use different verdict labels (`Conceded` / `Strong` / `Contested` /
`Don't use`) and **`Strong` there means strong for the Christian**. `bhi`'s `answered`
means the text settles it **in the reader's favour** — the opposite of the other
sections. Check `VDESC` in the built file before writing a lead that names a winner.

## Done means

Every case in your section has all four fields, `node check-dv.js <slug>` prints
ALL PASS, and you report grades before and after plus anything you deliberately left.
