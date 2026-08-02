# Images — addendum (read with IMAGES-SPEC.md)

The owner has changed three rules and raised the target.

## Target

- **Every case gets a `list` thumbnail. No exceptions.**
- **2–4 in-case figures on most cases**, up to 5 where they help. Islam currently has
  4 in-case figures across 78 cases — that is the worst gap on the site.
- Spread them with `where`: `claim`, `defense`, `verdict`.

## Relaxation 1 — sources beyond Wikimedia Commons

Anything genuinely **free for commercial use** (the site will carry ads):
Wikimedia Commons · Openverse · Flickr under CC0 / CC BY / CC BY-SA · Unsplash ·
Pexels · public-domain archives (Library of Congress, NYPL Digital Collections,
Internet Archive, national archives).

**Not acceptable:** CC BY-NC, CC ND, "editorial use only", Getty / AP / Reuters,
book covers, film stills, or any organisation's own copyrighted artwork.

For a non-Commons image use a `url` field instead of `file`:

```json
{ "url": "https://live.staticflickr.com/…/xyz_b.jpg",
  "cap": "…", "credit": "Photographer (Flickr)", "license": "CC BY 2.0", "where": "claim" }
```

Every URL must be **hot-linkable and return HTTP 200**. Verify each one:

```bash
curl -s -L -o /dev/null -w "%{http_code}" --max-time 20 -A "ChallengingBeliefs/1.0" "<url>"
```

`check-images.js` only fetches `file` entries, so **you must verify `url` entries
yourself and say in your report that you did.**

## Relaxation 2 — a representative image is allowed, if the caption says so

Where no image of the actual thing exists, use one that paints the picture — a period
photograph, a typical site, a comparable artefact. **The caption must contain an
explicit disclaimer**, e.g. *"Not the actual …"*, *"A representative image; no
photograph of this exists."* A representative image must never read as documentary
evidence.

## Relaxation 3 — subject matter, not accuracy

The owner has said the site is for Christians and he is not concerned about offending
other faiths. Images previously skipped as too pointed are now allowed — temple
garments, and the Islam cluster on marriage, captives and punishment.

**Three limits still hold and are not negotiable:**

1. **No identifiable living private individual held up for ridicule.** Public figures
   at public events are fine.
2. **No fabricated or misleading image.** No AI-generated picture presented as a
   photograph. No caption that says the image is something it is not.
3. **No image whose only job is a sneer.** The asset is the site's credibility with
   its own Christian readers; a jeering picture makes the reader look bad when they
   share it. Pick the image that informs, even when the subject is ugly.

## Output

Write `images2-<slug>.json` — **additions only**, same format. The existing
`images-<slug>.json` files are already merged and live; do not edit them, and do not
repeat anything already in them or in the section's `IMGMAP`.

Exactly one `where:"list"` per case **across both files combined** — so only add a
`list` entry for a case that does not already have one. Check both
`images-<slug>.json` and the section's `IMGMAP` before assigning one.

## Do the work yourself

Do not spawn sub-agents. Search, verify and write the file directly. A previous run
delegated the job and produced nothing.
