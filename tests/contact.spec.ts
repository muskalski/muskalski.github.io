import { test, expect, type Page } from '@playwright/test';
const configured = !!process.env.PUBLIC_FORM_ENDPOINT;
const endpoint = 'https://formspree.io/f/testfixture';
async function fill(page: Page) {
  await page.getByLabel('Name (optional)').fill('Visitor');
  await page.getByLabel('Email', { exact: true }).fill('visitor@example.test');
  await page.getByLabel('Message', { exact: true }).fill('Hello from a browser test.');
}
test.beforeEach(async ({ page }) => {
  // Every provider request is intercepted; tests never send email.
  await page.route('https://formspree.io/**', route => route.abort());
  await page.goto('/');
});
test('unconfigured form cannot claim or attempt delivery', async ({ page }) => {
  test.skip(configured, 'Run against the default, unconfigured build.');
  await expect(page.getByRole('button', { name: 'Send message' })).toBeDisabled();
  await expect(page.getByRole('status')).toContainText(/unavailable/i);
  await expect(page.locator('form')).not.toHaveAttribute('action', /formspree/);
});
test.describe('configured form', () => {
  test.skip(!configured, 'Run npm run test:contact:configured for this fixture.');
  test('required fields block requests', async ({ page }) => {
    let calls = 0;
    await page.route(endpoint, route => { calls++; return route.fulfill({ json: { ok: true } }); });
    await page.getByRole('button', { name: 'Send message' }).click();
    expect(await page.locator('form').evaluate((form: HTMLFormElement) => form.checkValidity())).toBe(false);
    expect(calls).toBe(0);
    await page.getByLabel('Email', { exact: true }).fill('not-an-email');
    await page.getByLabel('Message', { exact: true }).fill('Hello');
    await page.getByRole('button', { name: 'Send message' }).click();
    expect(calls).toBe(0);
  });
  test('reports success only after response and prevents duplicate requests', async ({ page }) => {
    let calls = 0;
    let release!: () => void;
    const waiting = new Promise<void>(resolve => { release = resolve; });
    await page.route(endpoint, async route => {
      calls++;
      expect(route.request().headers().accept).toBe('application/json');
      expect(route.request().postData()).toContain('Hello from a browser test.');
      await waiting;
      await route.fulfill({ status: 200, json: { ok: true } });
    });
    await fill(page);
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.getByRole('status')).toContainText(/sending/i);
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
    await page.locator('form').evaluate((form: HTMLFormElement) => form.requestSubmit());
    await expect.poll(() => calls).toBe(1);
    await expect(page.getByRole('status')).not.toContainText(/sent/i);
    release();
    await expect(page.getByRole('status')).toContainText(/sent/i);
    await expect(page.getByLabel('Message', { exact: true })).toHaveValue('');
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  });
  test('a successful response preserves edits made while sending', async ({ page }) => {
    let release!: () => void;
    const waiting = new Promise<void>(resolve => { release = resolve; });
    await page.route(endpoint, async route => {
      await waiting;
      await route.fulfill({ status: 200, json: { ok: true } });
    });
    await fill(page);
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.getByRole('status')).toContainText(/sending/i);
    await page.getByLabel('Message', { exact: true }).fill('New unsent edits');
    release();
    await expect(page.getByRole('status')).toContainText(/newer edits/i);
    await expect(page.getByLabel('Message', { exact: true })).toHaveValue('New unsent edits');
  });
  for (const failure of ['server', 'network']) {
    test(`${failure} failure preserves input and allows a successful retry`, async ({ page }) => {
      await page.route(endpoint, route => failure === 'server' ? route.fulfill({ status: 500, json: { errors: [{ message: 'Unavailable' }] } }) : route.abort());
      await fill(page); await page.getByRole('button', { name: 'Send message' }).click();
      await expect(page.getByRole('status')).toContainText(/try again/i);
      await expect(page.getByLabel('Message', { exact: true })).toHaveValue('Hello from a browser test.');
      await expect(page.getByLabel('Email', { exact: true })).toHaveValue('visitor@example.test');
      await expect(page.locator('button[type="submit"]')).toBeEnabled();
      await page.route(endpoint, route => route.fulfill({ status: 200, json: { ok: true } }));
      await page.getByRole('button', { name: 'Send message' }).click();
      await expect(page.getByRole('status')).toContainText(/sent/i);
    });
  }
});
