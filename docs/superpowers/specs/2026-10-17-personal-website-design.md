# muskalski.com — website design

Status: approved by the user; updated after repository inspection and the user’s instruction to reuse photos without migrating posts or old photo URLs. The local mockup is an approved visual direction, not a production implementation.

## Purpose

Create a polished personal website for Piotr Muskalski: software engineering, music and sound design, sports, and travel. Convey technical ability and personality through thoughtful execution and real photography. Avoid invented achievements, a fabricated hacker persona, employer details, and unsupported NDA claims.

## Agreed direction

Use the dark editorial direction established in `mockups/homepage.html`: charcoal background, warm light text, restrained lime accents, large typography, serif accents, and generous spacing. Keep the existing headline “Code. Sound. Everything in between.” and the tornado hero photograph. Use subtle interactions with reduced-motion support.

About copy:

> Software engineer. Born in Poland.
>
> I build software and explore new technologies. Outside of programming, I enjoy making music, exploring sound design, staying active, and traveling.

Interest strip: Software · Music & sound design · Sports · Travel.

Do not include an employment timeline or employer. Do not announce the game, early access, or Kickstarter yet. Do not invent portfolio projects or include empty project cards. Certifications are deferred from this initial version (builder's recommendation).

## Page and photos

Single homepage with introduction, About, personal gallery, contact, and footer. Navigation uses section anchors. Preserve responsive typography and readable contrast.

The most recent proposed gallery direction supersedes the prototype's 2×2 arrangement: use six thumbnails in three columns on desktop, two on intermediate screens, and one on narrow phones, with even spacing. Clicking a thumbnail opens the uncropped photograph in an accessible lightbox with previous/next, Escape to close, keyboard navigation, focus containment and return, and a visible close control. Each thumbnail has an individually chosen crop; faces and subjects must remain visible. Six-image layout is the builder's recommended interpretation of the request for an Instagram-like orderly gallery; it has not yet been shown in the prototype.

Photos: tornado at Exploratorium, closer highline, stretching, shirtless human flag, Italy amphitheatre, Big Sur bench. The tornado also appears in the hero. Use truthful short captions and useful alt text, without invented dates or locations. The Italy photograph should retain a clear view of the user's face. Preserve original files, generate web-sized derivatives, strip metadata, and avoid shipping unneeded originals. The HEIC duplicate is excluded.

Five originals are available under `/Users/pm/Pictures/muskalski.com/selected/`: `IMG_0411.png`, `P7240399.JPG`, `AI9A8104.JPG`, `_I9A3173.JPG`, and `20151014_133422.jpg`. The Big Sur screenshot is at `/Users/pm/Desktop/muskalski.com:photos:big_sur-us-2:.png`; find the matching original among local Big Sur pictures, visually verify it, or ask for its location. Do not use the screenshot as the production asset. An unavailable original blocks only that asset, not the rest of implementation.

## Contact and links

User favors a contact form to avoid publishing their email. Form fields: name, email, message, with required email and message, accessible labels, validation, submission progress, success and failure states. Use Formspree as the proposed provider (builder's choice pending account setup), with an opaque form ID and provider-side spam protection. Configure the recipient privately in that provider. Do not embed the recipient in source, generated pages, repository history, or client environment variables. No direct mailto link. Explain near the form that submissions are processed by the provider and link to its privacy information once configured. No tracking or marketing opt-in by default.

The owner must provide/configure a real form endpoint and recipient verification before launch. Until then, local previews clearly identify the form as unconfigured and cannot falsely report delivery. No service account creation, subscriptions, or external test messages without appropriate user authorization. A contact form reduces email exposure but does not guarantee zero spam or erase earlier public copies.

LinkedIn URL supplied by owner: `https://www.linkedin.com/in/muskalski/`. A discreet footer link is recommended but not explicitly accepted; obtain the owner's choice before production publication because it may expose employer information. Implement it as optional configuration, absent by default.

## Stack and hosting

Agreed: one public GitHub repository containing source and deployment workflow. Retain GitHub Pages and muskalski.com. No database, accounts, server runtime, or CMS. Proposed stack: current stable Astro, TypeScript, custom CSS, small client scripts for lightbox and form. Confirm supported dependency/runtime versions during implementation and commit a lockfile. React and animation libraries are unnecessary for current scope.

Generate static output. Deploy via GitHub Actions to Pages, configuring canonical URLs for `https://muskalski.com`, custom domain, sitemap, robots, page title/description and social preview. Keep source maps and unpublished assets out of deployed output. Preserve existing domain and DNS configuration unless a verified change is needed. Keep provider credentials in appropriate secret storage; the form endpoint ID is public by design.

Do not replace the current live website until build and preview are reviewed. Inspected public repository: `https://github.com/muskalski/muskalski.github.io`, currently Hugo, source branch `master`, publishing via `.github/workflows/gh-pages.yml` to `gh-pages`. `static/CNAME` contains `muskalski.com`. Replace the Hugo implementation with Astro on an isolated local branch; retain repository history. Per the user’s latest instruction, reuse photos only: do not migrate the three old posts or build compatibility pages for old About/photo/post URLs. Old URLs may return 404 after launch; provide a useful new 404 page. Do not change remote visibility or DNS.

The original Big Sur photo is available in the inspected repository at `content/photos/big_sur-us-2/DSC05860.jpg`; use this asset after visual confirmation. No need to ask the user to supply it.

## Quality and acceptance

- Review desktop, MacBook-sized, tablet and narrow-mobile layouts; no horizontal overflow or hidden faces in crops.
- Keyboard-operable navigation, lightbox and form; meaningful focus indicators; reduced motion.
- Responsive optimized photos, dimensions to avoid layout shift, lazy-load below the fold; do not embed base64 photos as in the mockup.
- Production build and type checks pass; test meaningful lightbox and form failure behavior, links, metadata and missing configuration handling.
- Verify a real successful form submission only after provider configuration and authorization to send the test.
- No employer, premature game announcement, private email, invented work or unsupported claims appear in published content.
- Site is reachable at the existing domain after deployment; verify routes and contact delivery before declaring launch complete.

## Remaining launch inputs

Write access for eventual publication, configured form endpoint, and whether to include LinkedIn. These do not prevent implementing the core site. The user approved this design and the stack; next is implementation-plan review.

## Approved editorial refinement

After reviewing the implementation, the owner approved removing captions from all six gallery thumbnails. Keep useful alt text and plain descriptive captions in the lightbox. Navigation and the lightbox use “Photos”; the gallery label is “02 — A few moments”, retaining “A different kind of balance.” as its heading. Remove the code-centred gallery subheading.

The owner subsequently chose a text-only hero to remove the repeated Exploratorium image. Keep that photo among the six gallery images. This supersedes the initial hero-photo direction; the prior layout is retained in Git for a possible future return with a different gallery photo.

## Contact provider update — 2026-10-18

The owner chose FormSubmit.co after comparing free forwarding services and provided its activated opaque identifier. This supersedes the proposed Formspree AJAX integration. Use a native form POST with provider-default CAPTCHA, `_honey`, an identifying subject and an absolute `_next` URL returning to `/thanks/`. Keep the recipient email out of source and deployment output. The public identifier may be stored in site configuration. The owner will confirm live CAPTCHA and inbox delivery; automated tests must intercept provider requests.

The owner later requested removing visible photo descriptions from the lightbox as well. Keep descriptions and photo-position announcements available to screen readers, with no visible photo caption or counter.
