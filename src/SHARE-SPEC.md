# Spec — rewriting the "Sharing Jesus" page

**Working directory:** `/private/tmp/claude-501/-Users-masonwallace-CAIAC-caiac-n8n-workflows/8454f02e-9c8f-4e0f-94ec-0cba23f85380/scratchpad/bom-app`

Every section of this site has one page about the person rather than the argument.
It is the page that matters most and it currently reads at **grade 13.8** — the worst
on the site. Your job is to rewrite it for the sections you are given.

## What you produce

One file **per section**: `share-<slug>.json`.

```json
{
  "<slug>": {
    "title": "Sharing Jesus with …",
    "intro": "One or two sentences under the heading.",
    "html": "…the body of the page…"
  }
}
```

Nothing else. Do not edit any other file. Do not run `build.js`.

## Where the current version is

- `mormon` → in `study.html`, inside `function renderShare(){ … }`
- `islam` → in `islam.html`, same function
- `jw`, `bhi`, `messiah`, `god` → in `make-jw.js`, `make-bhi.js`, `make-bhi.js`,
  `make-messiah.js`, `make-god.js` — the `const SHARE = { … }` object

Read the existing one for your section before rewriting. Keep everything true in it.
You are changing the sentences, not the content.

## The html field — allowed markup only

These classes exist and are styled. Use only these:

```html
<div class="pb-h">A section heading</div>
<div class="pb-grid">
  <div class="pb"><span class="num">1</span><h4>Heading</h4><p>Body.</p></div>
  <div class="pb do"><h4>Do this</h4><p>Body.</p></div>
  <div class="pb dont"><h4>Not this</h4><p>Body.</p></div>
</div>
<div class="saybox"><span class="who">You, once trust is real</span><p>"A spoken line."</p></div>
<p class="pd">A short explanatory paragraph.</p>
<p class="sh-open">A pull quote.</p>
<p class="sh-att">— attribution for the pull quote</p>
<div class="sa"><h4 class="sat">A boxed section</h4><p class="pd">Body.</p>
  <ol class="sh-list"><li><b>Lead-in.</b> Body.</li></ol></div>
<button class="start" data-goto-path="PATH_ID">Open the … path →</button>
```

`<b>` and `<i>` are allowed inside paragraphs. Nothing else — no markdown, no other tags,
no inline styles beyond what appears above. The final `data-goto-path` must be a real
path id for that section: read `PATHS` in the section's shell or make-file.

## Hard limits

Run `node check-share.js <slug>` — it must print **PASS**.

- Reading grade **≤ 9.9**
- Average sentence **≤ 16 words**
- Longest sentence **≤ 30 words**
- Body between **900 and 1,600 words** (the current versions run to 2,300 — they are too long)

Quoted speech is excluded from the measurement. Hit the numbers with short sentences,
one idea each — not by simplifying vocabulary or cutting substance.

## Rules

1. **Keep every fact, study, name and number.** The Woodberry findings, the survey
   percentages, the named ministries, the historical dates — all survive.
2. **This page is about a person, not an argument.** Every section's version should
   leave the reader knowing what to *do* on Tuesday, not what to prove.
3. **Keep the do/don't structure.** The "don't" items are the most valuable content on
   the page — they stop a Christian doing damage. Do not soften them into advice.
4. **Keep the section's own hard-won warnings**: honour for Islam, the cost of leaving
   for Witnesses, conceding the church's silence on slavery for Hebrew Israelites,
   naming the history first for Jewish friends, working out which atheist you are
   talking to, never mocking the temple for Latter-day Saints.
5. **Tone:** plain, warm, specific, unhurried. Never smug. Write as if the believer
   being described is reading over your shoulder.

## Reference for voice

`plain-messiah.json` and `plain-god.json` are finished work at the right register.
Read one before you start.
