# Local implementation verification — 2026-10-17

Implemented in the isolated `implementation/` checkout on `feat/personal-website`, based on `d5f0453`. The parent approved docs and visual mockup remain untouched. Existing repository history is retained. Nothing has been pushed or deployed.

## Delivered

Astro homepage matching the approved dark editorial design; exact About copy; six sanitized photo derivatives; responsive three/two/one-column gallery; keyboard-operable full-photo lightbox; optional Formspree contact; optional LinkedIn link; social metadata; sitemap; custom-domain files; helpful 404; branch-based deployment workflow; browser acceptance tests and setup documentation. Original uploads and retired content/routes are excluded from the new source.

## Verification

- Clean `npm ci` succeeds from the generated lockfile. Installation audit reported zero vulnerabilities.
- `npm run check`: zero errors, warnings or hints.
- `npm run build`: static homepage and 404, 34 optimized image variants, sitemap, robots and CNAME produced successfully.
- `npm run test:unit`: 4/4 pass. Both functional review regressions were observed failing before fixes, then passing.
- `npm test`: 10 browser tests pass; 5 configured-form cases intentionally deferred to the configured run.
- `npm run test:contact:configured`: 5 browser tests pass; the unconfigured case intentionally skipped. Every provider request is intercepted; no email is sent.
- Browser tests run against built static output in `.test-dist/`, separate from the real unconfigured `dist/` preview.
- Visual review at 1440×900, 1280×800, 768×1024 and 390×844: no horizontal overflow, appropriate columns, legible content and visible faces. Desktop/mobile lightbox and retired-route 404 screenshots reviewed. No page-script errors observed.
- Output audit confirms canonical homepage URL, homepage-only sitemap, retained CNAME, no metadata-bearing original photos, local filesystem paths, source maps, analytics, recipient links, test endpoint or unapproved LinkedIn URL.
- `git diff --check` passes.

Verification environment: Node 24.14.1, Astro 7.4.0, Playwright 1.64.1 driving installed Chromium 149. macOS 13 cannot install the newest bundled Chromium; the documented `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` override selects the compatible local browser. Firefox and Safari were not tested. Node's type-stripping and inherited terminal color flags produce informational tool warnings.

## Independent review

One independent whole-change review was performed. No second reviewer was dispatched. Findings addressed:

1. Successful contact submission erased edits made during delivery: preserve inputs when their current values differ from the submitted snapshot. Node regression and delayed-response browser test pass.
2. Valid owner LinkedIn URL was rejected: correct scheme escaping. Configuration regression passes; link remains absent by default.
3. Missing lockfile and runtime verification: installation succeeded after network escalation became available; clean installation, Astro checks/build and browser checks now pass.
4. Stretching thumbnail clipped the head: move crop from 56% to 40% and inspect the rendered result.

No deferred minor findings remain.

## Execution decisions

- Used an isolated clone because the supplied workspace was not a repository; it can be relocated if needed.
- Continued source preparation during the original environment block, then completed integration verification once access was available. That verification gap is now closed.
- Treated the clipped head as a required correction; the cost of a different visual preference is one crop-position adjustment.
- Normalized a test's expected image URL to an absolute URL; the first browser run exposed a test assertion mismatch rather than a wrong selected photograph.
- Used compatible Chromium 149 on macOS 13; newer-browser and other-engine behavior remain outside this local verification.
- Saved one consolidated implementation commit after the deferred verification completed, rather than artificial task commits; the tradeoff is less granular history.
- Legacy routes remain excluded, so old bookmarks receive the helpful 404.
- LinkedIn remains an owner decision and is absent until explicitly configured.
- Provider ownership, recipient verification, spam settings, live Pages/DNS verification and authorized real delivery remain launch work. Mocked tests do not prove external delivery.

## Local preview and launch handoff

The unconfigured production preview is running at `http://127.0.0.1:4322/`. Screenshots are in the parent workspace's `previews/` directory. To restart: `npm run build` then `npm run preview -- --port 4322`. To stop the managed preview: `npx astro preview stop`.

Keep the branch local until owner approval. Launch requires the real Formspree endpoint/recipient setup, the LinkedIn publication decision, write access and explicit push/deployment authorization. No real submissions, DNS changes or visibility changes were made.

## Approved gallery refinement

Removed all thumbnail captions and numbering; retained plain factual descriptions in the lightbox and useful image alt text. Navigation/lightbox now say “Photos”, and the section label is “02 — A few moments”, without the code-centred subtitle. Astro check/build and all 10 applicable browser tests pass; four viewport screenshots were refreshed and the desktop gallery visually inspected. Photo selection is unchanged.
