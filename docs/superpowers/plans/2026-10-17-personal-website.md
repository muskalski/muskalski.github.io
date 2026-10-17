# Personal Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing Hugo site with the approved personal portfolio, preserving GitHub Pages hosting and the custom domain.

**Architecture:** Astro produces static pages. Browser scripts handle the photo lightbox and a hosted contact form; no database or application server. One public repository stores source and deployment configuration.

**Tech Stack:** Stable Astro, TypeScript, custom CSS, npm lockfile, GitHub Actions, proposed Formspree integration, Playwright for meaningful browser behavior checks.

**Spec:** `docs/superpowers/specs/2026-10-17-personal-website-design.md`

## Global Constraints

- Retain GitHub Pages and muskalski.com. One public repository.
- No database, accounts, server runtime, or CMS.
- No employer details, employment timeline, NDA claims, invented projects or game announcement.
- Exact About copy and interest strip are in the approved spec.
- Reuse photos only. The user explicitly removed migration of old posts and photo URLs from scope.
- No recipient address or credentials in source, built output or commits. Public form ID is acceptable.
- LinkedIn is optional configuration, absent by default until confirmed.
- No tracking by default; do not carry over the old Google Analytics configuration.
- Keep live hosting untouched until reviewed; no pushes or deployment during local implementation.

## Review Focus

1. Unconfigured form must not simulate successful delivery (Task 3).
2. Form network failure must preserve the visitor’s message and permit retry (Task 3).
3. Keyboard lightbox use must retain focus and restore it on dismissal (Task 2).
4. Narrow screens and cropped images must preserve readable layout and visible subjects (Tasks 1–2).
5. Direct visits to retired URLs should show a helpful 404 rather than a broken layout (Task 4).

## Repository findings

Read-only inspection checkout: `/tmp/muskalski-site-audit` (re-fetch if unavailable). Remote: `https://github.com/muskalski/muskalski.github.io`. Hugo source is on `master`; existing Actions workflow builds Hugo and publishes to `gh-pages`. `static/CNAME` is `muskalski.com`. Existing repository history should remain intact, but old Hugo code is replaced on the implementation branch.

Original Big Sur image: `content/photos/big_sur-us-2/DSC05860.jpg`. Five selected images: `/Users/pm/Pictures/muskalski.com/selected/`. The design prototype is `mockups/homepage.html` in the current workspace. Production does not use its base64 image embedding.

## File responsibilities

- `astro.config.mjs`, `package.json`, `package-lock.json`, `tsconfig.json`: static build, canonical URL, scripts and dependency versions.
- `src/layouts/BaseLayout.astro`: shared document, metadata, navigation/footer and stylesheet.
- `src/pages/index.astro`: approved homepage composition.
- `src/pages/404.astro`: missing-page explanation and homepage link.
- `src/styles/global.css`: approved design and responsive layouts.
- `src/assets/photos/*`: sanitized, reasonably sized source derivatives; never original metadata-bearing uploads.
- `src/data/photos.ts`: typed photo records, captions, alt text and per-photo crop positioning.
- `src/components/PhotoGallery.astro`, `src/scripts/gallery.ts`: thumbnails and accessible native-dialog lightbox.
- `src/components/ContactForm.astro`, `src/scripts/contact.ts`: provider integration and accessible submission state.
- `src/config/site.ts`: optional public form endpoint and optional LinkedIn URL; no recipient address.
- `public/CNAME`, `public/robots.txt`: domain and crawling configuration; generate sitemap through Astro integration.
- `.github/workflows/gh-pages.yml`: replace Hugo build with Astro build and continue publishing `dist` to existing `gh-pages` branch.
- `tests/gallery.spec.ts`, `tests/contact.spec.ts`, `tests/site.spec.ts`, `playwright.config.ts`: browser acceptance behavior.
- `README.md`, `.gitignore`, `.env.example`: development, deployment, public configuration, and exclusions.

### Task 1: Production homepage and assets

**Interfaces:** `SiteConfig { formEndpoint?: string; linkedInUrl?: string }`; `Photo { id: string; image: ImageMetadata; alt: string; caption: string; objectPosition: string }`; export `siteConfig` and `photos` from their respective modules. IDs: `tornado`, `highline`, `stretch`, `flag`, `italy`, `big-sur`.

- [ ] Establish an isolated branch/checkout using the worktree skill. Preserve current prototype/docs and repository history; inspect applicable repository instructions before edits.
- [ ] Confirm supported stable Astro and Node versions. Add static Astro scaffolding with `site: 'https://muskalski.com'`, trailing slashes, check/build/dev/preview scripts, npm lockfile and no UI framework.
- [ ] Visually verify the six source images, prepare metadata-free derivatives, and configure Astro responsive image output. Preserve full compositions for lightbox display and use per-photo thumbnail positioning.
- [ ] Implement layout, homepage, exact approved copy, interest strip, six-photo gallery, footer and contact-section anchor. Use existing mockup colors and typography, local/system fonts, dimensions for images and lazy loading below the fold.
- [ ] Check `npm run check` and `npm run build`. Preview at 1440×900, 1280×800, 768×1024 and 390×844: no overflow, appropriate columns, legible text and visible subjects. No tests merely duplicating static copy or styles.
- [ ] Commit the independently buildable homepage.

### Task 2: Photo viewing

**Interfaces:** `initGallery(root: HTMLElement): void` in `src/scripts/gallery.ts`; gallery renders a native `<dialog>`, full-photo image, caption, previous/next buttons and close button. It consumes Task 1 photo records.

- [ ] Add Playwright tests in `tests/gallery.spec.ts`: opening any thumbnail selects its matching full photo; previous/next wrap across six photos; arrows navigate while open; Escape closes; focus returns to the originating thumbnail; tab stays in dialog. Run the tests and verify behavior failures before implementation.
- [ ] Implement gallery script with dialog focus behavior, accessible names, and image/caption updates. Keep thumbnails as ordinary links to full images for no-JavaScript fallback; intercept only when dialog support is available.
- [ ] Run gallery tests, visually inspect crops and full-image sizing at desktop/mobile widths, and check reduced-motion mode avoids animated transitions.
- [ ] Commit the gallery interaction.

### Task 3: Private-recipient contact form

**Interfaces:** `initContactForm(form: HTMLFormElement): void` in `src/scripts/contact.ts`; receives public endpoint via form action, submits `FormData`, requests JSON responses, and uses an accessible live status region. Form fields: optional name, required email and message, provider honeypot.

- [ ] Write `tests/contact.spec.ts` with mocked network: absent configuration disables submission with a clear unavailable message; invalid required fields block requests; success appears only after successful provider response; server/network errors retain input and re-enable submit; duplicate submission is prevented. Verify failing tests.
- [ ] Implement form UI and script using public configuration only. Do not expose the recipient. Add provider privacy disclosure and configure spam controls once an account is available. Do not send real test submissions during development.
- [ ] Run contact tests against unconfigured and fixture-configured builds, using intercepted requests so no email is sent. Check keyboard labels, errors, and status announcements.
- [ ] Document Formspree endpoint/recipient verification setup, service ownership and spam settings. Production launch remains pending real configuration and an authorized end-to-end delivery check.
- [ ] Commit the contact feature.

### Task 4: Launch preparation and complete verification

**Interfaces:** `npm run check`, `npm run build`, and browser tests verify the final site; generated output is `dist/`.

- [ ] Add metadata, social preview, sitemap, robots, custom domain file and helpful 404 page. Keep legacy posts/photo routes out of scope. Do not carry over analytics. Avoid bundling originals, local paths, source maps or unpublished content.
- [ ] Replace `.github/workflows/gh-pages.yml` with npm clean-install, checks, build and publishing of `dist` using the existing branch-based deployment model. PRs build only; publishing is limited to pushes to `master`. Verify current supported Actions versions before selecting them. Retain `CNAME` through generated output.
- [ ] Add `tests/site.spec.ts`: narrow viewport has no horizontal overflow; section links reach valid targets; retired path serves the new 404 with working home link. Exercise reduced-motion preference. Run all browser tests, build and type checks once final inputs are settled.
- [ ] Inspect generated output and tracked files for excluded data, recipient details and unneeded images; verify image optimization, canonical URLs and sitemap. Update README with setup, configuration and deployment instructions.
- [ ] Perform final code review and address actionable findings. Show the local preview and state any provider or browser-verification limitations honestly.
- [ ] Commit the reviewed implementation. Obtain write access and production publication approval at handoff; then push/deploy and verify domain, homepage, 404 and authorized real form delivery. Do not change DNS or repository visibility unnecessarily.

## Execution recommendation

Native execution: implement these four closely related tasks in this session, then one independent whole-change review. It avoids repeated context setup for a compact site. Subagent-driven execution is available if the user prefers separate implementer/reviewer cycles per task.

## Plan self-review

Approved design, latest photo-only migration instruction, optional LinkedIn, private recipient, static hosting, old deployment compatibility, and all five Review Focus cases are covered above. Production configuration and publishing access are launch inputs, not reasons to stop local implementation.
