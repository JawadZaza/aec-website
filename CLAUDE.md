# AEC Website — project notes for Claude

Static site for the Applied Engineering Club at Fullerton College. Plain
HTML/CSS/vanilla JS, no framework, no build step (deploys straight to GitHub
Pages from `main`). Content lives in `/data/*.json` and is editable through
Sveltia CMS at `/admin` (GitHub-backend, PAT auth).

**Live URLs:** `https://aecfullerton.com` (custom domain, DNS via Porkbun) and
`https://jawadzaza.github.io/aec-website/` (still works, same site).

## Workflow

- I (Claude) edit and test locally. The user reviews and commits/pushes via
  GitHub Desktop themselves — **never commit or push on your own.**
- Local clone: this repo. Sveltia CMS writes directly to GitHub, so `git
  pull` before editing — the user's own CMS edits often land between
  sessions.
- No `npm install` / build step. Preview with `python3 -m http.server` from
  the repo root (or PowerShell's `python -m http.server`), then open
  `http://127.0.0.1:<port>/`. **Never open `index.html` via `file://`** — the
  JSON fetches are blocked under that origin and the page renders empty.

## Architecture

- `index.html` — `<template>` tags per section (`tpl-hero`, `tpl-gallery`,
  `tpl-competitions`, `tpl-schools`, `tpl-join`, …), cloned and filled by JS.
- `assets/js/main.js` — the whole renderer. `boot()` fetches everything in
  `DATA_PATHS`, then `SECTION_RENDERERS[id](data)` fills each template.
  Section order/visibility comes from `data/sections-config.json` (drag to
  reorder in the CMS).
- `assets/css/style.css` — CSS custom properties in `:root` (`--navy
  #0f406b`, `--navy-dark #0a2d4d`, `--gold #ffd600`, `--radius: 10px`, etc).
  Reuse these rather than hardcoding colors.
- `admin/config.yml` — Sveltia CMS schema. Every collection here needs a
  matching renderer in `main.js` and a template in `index.html`.

## Patterns worth knowing before editing

- **`imgPath()` helper** strips a leading `/` from any image/file path.
  Sveltia's upload/asset-picker occasionally writes a leading slash, which
  breaks under the GitHub Pages subpath — this bug has recurred 4+ times
  across officers/gallery/hero/advisors. Always route image *and file* `src`
  values through `imgPath()`.
- **Modal pattern**: officer, advisor, and competition cards all open via
  `presentModal(overlay, originEl)` / `dismissModal(overlay)` — a shared FLIP
  animation (grows from the clicked card to a centered modal, shrinks back on
  close). Follow this pattern for any new clickable card rather than
  inventing a new modal style.
- **Competitions & Research is one unified section** (`competitions.json`,
  `renderCompetitions`). Each entry has a `category` field ("Competition" or
  "Research") — cards show a filter-pill row (All / Competition / Research)
  above the grid. Entries can carry an optional `files` array
  (`{label, url}`) that renders as download buttons in the modal — this is
  how the 3D-printed-splint research proposal's PDF/Word download works.
  Dates are `startDate`/`endDate` (not a single `date`) — `formatDateRange()`
  in `main.js` handles same-year vs cross-year display.
- **Transfer schools section** (`data/schools.json`, `.school-logo` CSS):
  every logo is recolored to navy as a flat silhouette so 13 schools' brand
  colors don't clash and so white-only wordmarks aren't invisible. Each
  entry has an optional `scale` multiplier to equalize *optical* size across
  wordmarks with very different internal padding/cap-height — tuned by
  rendering all logos at a fixed height and measuring ink-pixel area, not by
  eye (see the flagged-bias conversation if touching this again: check the
  spread between the largest/smallest ink area, aim under ~2x).
- **Grid line background pattern**: `--grid-line` / `--grid-size` CSS vars,
  fixed-attachment, deliberately subtle — don't remove without asking.

## Known-fragile spots

- Any new CMS-uploaded image/file field needs `media_folder`/`public_folder`
  set explicitly if it shouldn't land in the default
  `assets/images/uploads/`.
- Browser-preview caching in this environment is aggressive (Python's
  `http.server` sends no cache headers, but browsers heuristically cache
  anyway). If a change doesn't appear to take effect, hard-reload with a
  cache-busting query param or open a fresh tab/port before assuming the
  code is wrong.
- The sandboxed preview pane sometimes doesn't composite frames (breaks
  `requestAnimationFrame`, scroll, screenshots) when not actively displayed
  to the user. If animations/scroll seem broken in testing, verify via the
  real-Chrome tool before concluding it's a real bug.

## Standalone assets that live outside the repo

- **Flyer** (print + digital): working files at
  `~/Desktop/aec-flyer/` (Main.dc.html for the Claude Design canvas,
  `render/flyer.html` for a plain standalone copy used to generate the
  final PDF/PNG via headless Chrome print-to-pdf). Finished files ship to
  `~/Desktop/AEC/AEC Club Flyer.pdf` / `.png`. **Edit both `Main.dc.html`
  and `render/flyer.html` in lockstep** — they're duplicated content, not
  templated from one source.
- QR code on the flyer points to `https://aecfullerton.com/` — regenerate
  with the `qrcode` Python package if the domain ever changes again.

## Outstanding / recently flagged

- Fullerton College's campus WiFi (some networks) is blocking
  `aecfullerton.com`, most likely because it's a newly-registered domain
  not yet categorized by the campus content filter. User is emailing ACT
  Help Desk (`acthelpdesk@fullcoll.edu`) to request allowlisting. Until
  resolved, `jawadzaza.github.io/aec-website/` is the reliable fallback link
  for on-campus sharing.
- GitHub Pages "Enforce HTTPS" doesn't appear to be checked yet for the
  custom domain (`http://` serves 200 instead of redirecting to `https://`)
  — low priority, but worth flipping on.
- Egg Drop Challenge event (`data/events.json`) still has `"time": "TBD"` —
  intentionally left out of the flyer for that reason; update the flyer
  once a time is set, if it should be added there too.
