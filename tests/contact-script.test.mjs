import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import { runInNewContext } from 'node:vm';
const source = stripTypeScriptTypes(await readFile(new URL('../src/scripts/contact.ts', import.meta.url), 'utf8')).replace('export function', 'function');
test('successful delayed delivery retains newer unsent edits', async () => {
  const values = { name: 'Visitor', email: 'visitor@example.test', message: 'Original message' };
  const submit = { disabled: true }; const status = { textContent: '' };
  let handler;
  const form = {
    querySelector: selector => selector.startsWith('button') ? submit : status,
    getAttribute: () => 'https://formspree.io/f/testfixture',
    addEventListener: (_name, listener) => { handler = listener; },
    reportValidity: () => true,
    setAttribute() {}, removeAttribute() {},
    reset: () => { for (const key of Object.keys(values)) values[key] = ''; },
  };
  let respond;
  const response = new Promise(resolve => { respond = resolve; });
  // Substitute browser boundaries only; execute the actual contact controller.
  runInNewContext(`${source}\ninitContactForm(form);`, {
    form, AbortController,
    window: { setTimeout, clearTimeout },
    FormData: class extends Map { constructor() { super(Object.entries(values)); } },
    fetch: async (_endpoint, options) => {
      assert.equal(options.body.get('message'), 'Original message');
      return response;
    },
  });
  const pending = handler({ preventDefault() {} });
  assert.equal(submit.disabled, true);
  values.message = 'New unsent edits';
  respond({ ok: true, json: async () => ({ ok: true }) });
  await pending;
  assert.equal(values.message, 'New unsent edits');
  assert.equal(submit.disabled, false);
  assert.match(status.textContent, /newer edits/i);
});
