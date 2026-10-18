import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
const source = await readFile(new URL('../src/config/site.ts', import.meta.url), 'utf8');
async function loadConfig(env) {
  // Provide Vite's build-time environment at the module boundary, then execute the real module.
  const js = stripTypeScriptTypes(source).replaceAll('import.meta.env', JSON.stringify(env));
  return (await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`)).siteConfig;
}
test('uses the owner-approved LinkedIn profile by default', async () => {
  const config = await loadConfig({});
  assert.equal(config.linkedInUrl, 'https://www.linkedin.com/in/muskalski/');
});
test('accepts an owner-approved LinkedIn profile when configured', async () => {
  const url = 'https://www.linkedin.com/in/muskalski/';
  assert.equal((await loadConfig({ PUBLIC_LINKEDIN_URL: url })).linkedInUrl, url);
});
test('rejects recipient email endpoints and non-provider hosts', async () => {
  for (const url of ['https://formsubmit.co/recipient@example.test', 'https://example.test/00000000000000000000000000000000', 'http://formsubmit.co/00000000000000000000000000000000', 'https://formsubmit.co/ajax/00000000000000000000000000000000', 'https://formspree.io/f/opaque']) {
    await assert.rejects(loadConfig({ PUBLIC_FORM_ENDPOINT: url }));
  }
  const endpoint = 'https://formsubmit.co/00000000000000000000000000000000';
  assert.equal((await loadConfig({ PUBLIC_FORM_ENDPOINT: endpoint })).formEndpoint, endpoint);
});
