# Spec — finding images for the cases

**Working directory:** `/private/tmp/claude-501/-Users-masonwallace-CAIAC-caiac-n8n-workflows/8454f02e-9c8f-4e0f-94ec-0cba23f85380/scratchpad/bom-app`

The site is an evangelism reference examining other faiths' claims against the Bible.
Cases are walls of text. The owner wants **many more images — 1 to 5 per case where a
picture genuinely helps**, and a thumbnail beside every claim in the list view.

Today: Mormonism 49/119 cases have an image, Islam 31/78, and **JW, Hebrew Israelites,
Messiah and Case for God have none at all**.

## What you produce

`images-<slug>.json`:

```json
{ "case-id": [
    { "file": "Anthon Transcript.jpg",
      "cap": "The Anthon transcript, the characters Harris showed Charles Anthon in 1828",
      "credit": "Wikimedia Commons",
      "license": "Public domain",
      "where": "claim" }
] }
```

- `file` — the **exact Wikimedia Commons file name**, no `File:` prefix.
- `cap` — a caption that says what the reader is looking at and why it is here. 8–22 words.
- `license` — the actual licence string from Commons (`Public domain`, `CC BY-SA 4.0`, …).
- `where` — one of `claim` / `defense` / `verdict` / `list`. `list` marks the single best
  image to use as the thumbnail in the claims list. **Exactly one `list` image per case**
  wherever the case has any image at all.

Nothing else. Do not edit any other file, do not run `build.js`.

## Finding and verifying images

Images load as `https://commons.wikimedia.org/wiki/Special:FilePath/<url-encoded file>?width=520`.

**Every file must be verified to exist before you record it.** Check with:

```bash
curl -s -o /dev/null -w "%{http_code}" "https://commons.wikimedia.org/wiki/Special:FilePath/Anthon%20Transcript.jpg?width=200"
```

A `200` means it resolves. Anything else — do not use it. Then confirm the licence via the
Commons API (`action=query&prop=imageinfo&iiprop=extmetadata`). **Never guess a licence.**

`node check-images.js <slug>` runs both checks over your file and must print ALL PASS.

## Rules

1. **Only public-domain or freely-licensed Commons images.** No fair-use, no press photos,
   no copyrighted book covers or church-owned artwork still in copyright.
2. **Never a photo of a living private individual**, and never an image that mocks anyone.
   Historical figures, documents, manuscripts, buildings, artefacts, maps, archaeology.
3. **The image must earn its place.** A picture of the actual papyrus, the actual page, the
   actual site. If the honest answer is "no image helps this case," record none — an empty
   entry is a valid result and better than decoration.
4. **Be accurate.** A caption may not claim the image shows something it does not. If a
   photo is a modern reconstruction, a later painting, or a different but comparable
   artefact, the caption must say so.
5. **Do not caption an image with a verdict.** Describe what it is.
6. Prefer: manuscripts and documents · archaeological sites and artefacts · historical
   portraits and photographs · maps · published pages and title pages.

## Where the cases are

| slug | data file |
|---|---|
| `mormon` | `index.html` — parse `const DATA=[...]` |
| `islam` | `islam-data.json` |
| `jw` | `jw-data.json` |
| `bhi` | `bhi-data.json` |
| `messiah` | `messiah-data.json` |
| `god` | `god-data.json` |

Read each case's `title`, `plain` blocks and `claim` before choosing. Existing images for
Mormonism and Islam are in `IMGMAP` in `study.html` / `islam.html` — **do not duplicate
one that is already there**; your file is additions only, keyed by the same case ids.

## What "done" means

`node check-images.js <slug>` prints ALL PASS, and you report: cases covered, total images,
how many carry a `list` thumbnail, and any case you deliberately left without one.
