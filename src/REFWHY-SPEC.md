# Spec — why each reference is there

**Working directory:** `/private/tmp/claude-501/-Users-masonwallace-CAIAC-caiac-n8n-workflows/8454f02e-9c8f-4e0f-94ec-0cba23f85380/scratchpad/bom-app`

Every case on this site ends with a list headed **"The verses behind this claim."**
Right now it is a bare list of citations. A reader opens it, sees `Isaiah 53:8`, and has
no idea why it is there. The site owner's exact words: *"I don't really understand these
verses why they relate."*

Your job, for the sections you are assigned: write **one line per reference** saying what
that reference does in this specific case — and **cut the references that were never doing
any work**.

## What you produce

One file: `refwhy-<slug>.json`, per assigned section. Nothing else. Do not edit any other
file. Do not run `build.js`.

```json
{
  "case-id": {
    "why": {
      "Isaiah 53:8": "Says the servant was 'cut off out of the land of the living' — the line that puts a death in the passage.",
      "Alma 11:26-29": "Amulek says there is only one God, which is the Book of Mormon text this case turns on."
    },
    "drop": ["Genesis 1:1"]
  }
}
```

- `why` — a reason for every reference you keep.
- `drop` — references the case never actually uses. Omit the key if you drop nothing.
- **Every reference on the case must appear in exactly one of the two.**

## Where the references are

Read the section's data file. The reference arrays are:

| slug | file | arrays |
|---|---|---|
| `mormon` | `index.html` — parse `const DATA=[...]` | `bible`, `bom` |
| `islam` | `islam-data.json` | `bible`, `quran`, `hadith` |
| `jw` | `jw-data.json` | `bible`, `wt` |
| `bhi` | `bhi-data.json` | `bible` |
| `messiah` | `messiah-data.json` | `tanakh`, `nt`, `rabbinic` |
| `god` | `god-data.json` | `bible` |

Use each citation string **exactly as it appears in the array** — same book name, same
spacing, same dash. The check script matches on the exact string.

The case's own text is in `plain` (the rewritten blocks), `claim`, `response`
(the other side's best answer) and `rationale` (the verdict). Read all four before you
write a single reason. The reason must describe what the reference does *in this case*,
not what the passage is about in general.

## What a good reason looks like

The test: **a reader who has never seen this passage should now know why clicking it is
worth their time.** Say what it says, or whose point it serves.

Good:
- `2 Nephi 31:21` — "Says there is 'none other way' — the verse that makes this a matter of salvation, not preference."
- `Quran 4:157` — "The verse that denies the crucifixion. Everything in this case follows from it."
- `Watchtower, 15 Jul 1894` — "The first printed date-setting. Cited here because the organisation later denied setting dates."
- `Hebrews 1:8` — "The Father calls the Son 'God' — the verse the Witness answer has to account for."
- `Isaiah 53:3` — "Supports the other side, not yours: 'despised and rejected' reads naturally as Israel's history."

Bad — never write these:
- "Relevant background." / "Supports the argument." / "See context."
- Restating the citation: "Isaiah 53:8 is in Isaiah 53."
- A summary of the whole chapter when only one clause matters.

**Say when a reference cuts against the Christian case.** Several do. Marking those is
more valuable than marking the friendly ones, and this site's whole credibility rests on
doing it.

## What to drop

Drop a reference when the case does not actually stand on it — a passage listed for
atmosphere, a duplicate of a stronger reference already listed, or a citation the prose
never touches and never needed. Be willing to cut: **a list of six references where three
matter is worse than a list of three.** But never drop:

- a reference quoted in the `plain` blocks, `claim`, `response` or `rationale`
- the other side's own key text (their best proof-text belongs in the list)
- a reference that is the only support for a fact stated in the case

If a case ends up with everything dropped, you have made a mistake — re-read it.

## Hard limits

Run `node check-refwhy.js <slug>` — it must print **ALL PASS**. It verifies every case is
covered, every citation string is real, and:

- each reason **≤ 28 words**
- reading grade **≤ 10.5**
- no markup except `<b>` and `<i>`

Write the file incrementally and re-run the check as you go — do not write 500 entries
and check once.

## Rules

1. **Never invent what a passage says.** If you are not certain of the wording, describe
   its role instead of quoting it. Quoted words inside a reason must be actual words from
   the text.
2. Quote sparingly — a short phrase, in single quotes, not a whole verse.
3. Plain, calm, specific. Never sneering about anyone's faith.
4. The `⚠` don't-use cases (`avoid: true`) still get reasons — usually reasons explaining
   why the reference does **not** prove what people think it proves.

## What "done" means

Every case in your sections appears in the file, `node check-refwhy.js <slug>` prints
ALL PASS, and you report: cases covered, reasons written, references dropped, and the
number of reasons that mark a reference as cutting against the Christian case.
