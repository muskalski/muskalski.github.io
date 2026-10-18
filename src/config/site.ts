export interface SiteConfig { formEndpoint: string; linkedInUrl?: string }
// This public identifier forwards to the recipient verified privately with FormSubmit.
const formEndpoint = import.meta.env.PUBLIC_FORM_ENDPOINT?.trim()
  || 'https://formsubmit.co/72fec19a5e5bfbf8ea8de7a39d24a57d';
const linkedInUrl = import.meta.env.PUBLIC_LINKEDIN_URL?.trim()
  || 'https://www.linkedin.com/in/muskalski/';
// Never publish a recipient email or use the AJAX route, which bypasses the native verification flow.
if (!/^https:\/\/formsubmit\.co\/[a-f0-9]{32}$/i.test(formEndpoint)) {
  throw new Error('PUBLIC_FORM_ENDPOINT must be https://formsubmit.co/ followed by the 32-character opaque identifier.');
}
if (linkedInUrl && !/^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/.test(linkedInUrl)) {
  throw new Error('PUBLIC_LINKEDIN_URL must be a public LinkedIn profile URL.');
}
export const siteConfig: SiteConfig = { formEndpoint, linkedInUrl };
