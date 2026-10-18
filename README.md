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
npm run test:contact
npm run build
npm run preview
```

`npm run dev` runs the development server; `npm run preview` serves `dist/` locally. Browser tests build into the ignored `.test-dist/` directory and start their own production preview on port 4321, so stop other servers on that port first. Test output never replaces the normal `dist/` build. Check the layout at 1440×900, 1280×800, 768×1024 and 390×844. Tests exercise real UI behavior and intercept all provider requests; no email is sent.

For an older operating system unsupported by the newest Playwright Chromium, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to a compatible installed Chromium executable. Verification on macOS 13 used Chromium 149. Other browsers have not been tested. `ASTRO_TELEMETRY_DISABLED=1` disables Astro's development-tool telemetry; the website itself has no tracking.

## Public configuration

Copy `.env.example` to `.env`. Both settings are optional and embedded into static output at build time. Restart/rebuild after changes. Never put a recipient email, API token, or other credential in these values.

- `PUBLIC_FORM_ENDPOINT`: optional override for the public FormSubmit endpoint, `https://formsubmit.co/` followed by the 32-character identifier. By default the site uses the owner-provided identifier in `src/config/site.ts`. Empty values use that default. A recipient email or AJAX endpoint is rejected at build time.
- `PUBLIC_LINKEDIN_URL`: optional LinkedIn profile. Leave absent until the owner approves publishing it.

For deployment, the existing GitHub repository variables can override these public settings; no provider secret is required. Never enter an email address as the endpoint.

## Contact form

The form uses a regular browser POST to FormSubmit. Visitors may complete the provider's default CAPTCHA before returning to `https://muskalski.com/thanks/`. The optional name, required visitor email and required message are forwarded to the privately verified recipient. The recipient email is not included in the source or built website; only the public forwarding identifier is included. The visitor email field supplies Reply-To. `_honey` provides an extra honeypot, and `_subject` identifies messages from the site. The form works without JavaScript.

If the provider is unavailable, visitors can use browser Back to recover their inputs and retry. The site does not report an AJAX success or reset the form before verification. The thank-you page contains no submitted data, makes no inbox-delivery guarantee, and is excluded from the sitemap and indexing.

The owner activated the recipient through the provider's demo. If FormSubmit asks for a separate confirmation for the live site, complete that confirmation privately. To change the destination, activate it directly with FormSubmit and replace only the opaque identifier. Never publish the recipient in this public repository.

`npm test` includes the contact tests; `npm run test:contact` runs them alone. Tests intercept every FormSubmit request and simulate provider verification, redirects, server/network failures and browser Back/retry. No real test email is sent. Actual CAPTCHA and inbox delivery still need a manual live check by the owner. Do not automate or bypass the provider's CAPTCHA.

Provider documentation: [FormSubmit](https://formsubmit.co/documentation), [privacy](https://formsubmit.co/privacy.pdf).

## Photos and content

`src/data/photos.ts` owns alt text and individual thumbnail positions. `src/assets/photos` contains six metadata-free JPEG derivatives with a maximum dimension of 2000px. Original files stay outside this source tree. Astro generates responsive WebP thumbnails and separate full-composition lightbox images. Gallery thumbnails are lazy-loaded; full images load when opened. No external fonts, analytics, old articles, or legacy route mappings are included.

## Publication

Do not push or deploy until local checks, one independent final review, and owner visual review are complete. The workflow builds pull requests without publication. Only a push to `master` publishes `dist` to the existing `gh-pages` branch. It retains `CNAME`; keep existing Pages branch settings and DNS unchanged. The workflow uses the committed npm lockfile for clean installs.

Publication requires repository write access and owner approval. The configured contact form uses the owner-activated FormSubmit identifier. Publish LinkedIn only after owner approval. After publication, verify HTTPS, homepage, a retired URL/404 and the custom domain. A real delivery check requires configured Formspree and authorization to send a test message.

Dependency references: [Astro prerequisites](https://docs.astro.build/en/install-and-setup/), [Astro registry metadata](https://registry.npmjs.org/astro/latest), [GitHub Pages action](https://github.com/peaceiris/actions-gh-pages).
