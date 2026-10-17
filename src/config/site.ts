export interface SiteConfig { formEndpoint?: string; linkedInUrl?: string }
const formEndpoint = import.meta.env.PUBLIC_FORM_ENDPOINT?.trim();
const linkedInUrl = import.meta.env.PUBLIC_LINKEDIN_URL?.trim();
// Only opaque Formspree IDs belong in public configuration, never email addresses.
if (formEndpoint && !/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(formEndpoint)) {
  throw new Error('PUBLIC_FORM_ENDPOINT must be an https://formspree.io/f/ opaque form ID.');
}
if (linkedInUrl && !/^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/.test(linkedInUrl)) {
  throw new Error('PUBLIC_LINKEDIN_URL must be a public LinkedIn profile URL.');
}
export const siteConfig: SiteConfig = { formEndpoint, linkedInUrl };
