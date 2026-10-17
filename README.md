# muskalski.com

A static Astro personal website. Source stays in this repository; GitHub Pages serves `gh-pages` at `muskalski.com`. Only selected photos are reused. Retired posts and photo URLs intentionally receive the new 404 page.

## Local development

Use Node 24 LTS (`nvm use`; install it first if needed). Astro requires Node >=22.22.0.

```sh
npm ci
npx playwright install chromium
npm run check
npm run test:unit
npm test
npm run test:contact:configured
npm run build
npm run preview
```

`npm run dev` runs the development server; `npm run preview` serves `dist/` locally. Browser tests build into the ignored `.test-dist/` directory and start their own production preview on port 4321, so stop other servers on that port first. The fixture endpoint never replaces the normal `dist/` build. Check the layout at 1440×900, 1280×800, 768×1024 and 390×844. Tests exercise real UI behavior and intercept all provider requests; no email is sent.

For an older operating system unsupported by the newest Playwright Chromium, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to a compatible installed Chromium executable. Verification on macOS 13 used Chromium 149. Other browsers have not been tested. `ASTRO_TELEMETRY_DISABLED=1` disables Astro's development-tool telemetry; the website itself has no tracking.

## Public configuration

Copy `.env.example` to `.env`. Both settings are optional and embedded into static output at build time. Restart/rebuild after changes. Never put a recipient email, API token, or other credential in these values.

- `PUBLIC_FORM_ENDPOINT`: `https://formspree.io/f/` followed by the opaque form ID. Absent by default: submission is disabled and visitors see an unavailable message.
- `PUBLIC_LINKEDIN_URL`: optional LinkedIn profile. Leave absent until the owner approves publishing it.

The configured contact-test command sets a fake endpoint for a separate server. Tests intercept it and simulate validation, pending requests, success, server failure and network failure. Run the default suite with `PUBLIC_FORM_ENDPOINT` unset and no endpoint in `.env` to test the unconfigured site. Tests must never be run against a live provider endpoint.

## Contact form setup

The site owner should own the Formspree account and form. Create the form and configure/verify the recipient privately in the provider dashboard. Enable provider spam filtering, retain the `_gotcha` honeypot, and configure domain restrictions for `muskalski.com` where available. Review any CAPTCHA configuration against this AJAX form before enabling it; a challenge must be supported by the chosen integration. Review service limits, privacy settings and notification routing in that account.

Put only the opaque public endpoint in local `.env` and the GitHub repository variable `PUBLIC_FORM_ENDPOINT`. The privacy disclosure links to Formspree only when configured. Obtain authorization for one real end-to-end delivery check after setup, then confirm receipt privately. Mocked tests cannot prove delivery. No service account, subscription, or real test message was created during implementation.

Provider documentation: [AJAX submissions](https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax/), [privacy](https://formspree.io/legal/privacy-policy/).

## Photos and content

`src/data/photos.ts` owns captions, alt text and individual thumbnail positions. `src/assets/photos` contains six metadata-free JPEG derivatives with a maximum dimension of 2000px. Original files stay outside this source tree. Astro generates responsive WebP thumbnails and separate full-composition lightbox images. Gallery thumbnails are lazy-loaded; full images load when opened. No external fonts, analytics, old articles, or legacy route mappings are included.

## Publication

Do not push or deploy until local checks, one independent final review, and owner visual review are complete. The workflow builds pull requests without publication. Only a push to `master` publishes `dist` to the existing `gh-pages` branch. It retains `CNAME`; keep existing Pages branch settings and DNS unchanged. The workflow uses the committed npm lockfile for clean installs.

Publication requires repository write access and owner approval. The contact form can remain visibly unavailable until the owner configures Formspree. Publish LinkedIn only after owner approval. After publication, verify HTTPS, homepage, a retired URL/404 and the custom domain. A real delivery check requires configured Formspree and authorization to send a test message.

Dependency references: [Astro prerequisites](https://docs.astro.build/en/install-and-setup/), [Astro registry metadata](https://registry.npmjs.org/astro/latest), [GitHub Pages action](https://github.com/peaceiris/actions-gh-pages).
