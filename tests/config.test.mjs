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
test('optional links are absent by default', async () => {
  const config = await loadConfig({});
  assert.equal(config.formEndpoint, undefined); assert.equal(config.linkedInUrl, undefined);
});
test('accepts an owner-approved LinkedIn profile when configured', async () => {
  const url = 'https://www.linkedin.com/in/muskalski/';
  assert.equal((await loadConfig({ PUBLIC_LINKEDIN_URL: url })).linkedInUrl, url);
});
test('rejects recipient email endpoints and non-provider hosts', async () => {
  for (const url of ['https://formspree.io/recipient@example.test', 'https://example.test/f/opaque', 'http://formspree.io/f/opaque']) {
    await assert.rejects(loadConfig({ PUBLIC_FORM_ENDPOINT: url }));
  }
  assert.equal((await loadConfig({ PUBLIC_FORM_ENDPOINT: 'https://formspree.io/f/opaque' })).formEndpoint, 'https://formspree.io/f/opaque');
});
