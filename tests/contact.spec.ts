import { test, expect, type Page } from '@playwright/test';
const provider = 'https://formsubmit.co/**';
const localThanks = 'http://127.0.0.1:4321/thanks/';
async function fill(page: Page) {
  await page.getByLabel('Email', { exact: true }).fill('visitor@example.test');
  await page.getByLabel('Message', { exact: true }).fill('Hello from a browser test.');
}
test.beforeEach(async ({ page }) => {
  // Never send test messages or visit the real provider. More specific handlers below simulate it.
  await page.route(provider, route => route.abort());
  await page.goto('/');
});
test('native submission forwards the message to verification, then returns to this site', async ({ page }) => {
  const submit = page.getByRole('button', { name: 'Send message' });
  await expect(submit).toBeEnabled();
  const action = await page.locator('form').getAttribute('action');
  expect(action).toMatch(/^https:\/\/formsubmit\.co\/[a-f0-9]{32}$/i);
  let payload: URLSearchParams | undefined;
  await page.route(provider, async route => {
    expect(route.request().method()).toBe('POST');
    expect(route.request().isNavigationRequest()).toBe(true);
    payload = new URLSearchParams(route.request().postData()!);
    await route.fulfill({ contentType: 'text/html', body: `<h1>Complete verification</h1><a href="${localThanks}">Continue after verification</a>` });
  });
  await fill(page);
  await submit.click();
  await expect(page).toHaveURL(action!);
  await expect(page.getByRole('heading', { name: 'Complete verification' })).toBeVisible();
  expect(payload!.get('name')).toBe('');
  expect(payload!.get('email')).toBe('visitor@example.test');
  expect(payload!.get('message')).toBe('Hello from a browser test.');
  expect(payload!.get('_honey')).toBe('');
  expect(payload!.get('_captcha')).not.toBe('false');
  expect(payload!.get('_next')).toBe('https://muskalski.com/thanks/');
  expect(payload!.get('_subject')).toContain('muskalski.com');
  await page.getByRole('link', { name: 'Continue after verification' }).click();
  await expect(page).toHaveURL(localThanks);
  await expect(page.getByRole('heading', { name: 'Thank you.' })).toBeVisible();
  await page.getByRole('link', { name: 'Back to the homepage' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Code. Sound.');
});
test('required fields block provider requests', async ({ page }) => {
  const submit = page.getByRole('button', { name: 'Send message' });
  await expect(submit).toBeEnabled();
  let calls = 0;
  await page.route(provider, route => { calls++; return route.abort(); });
  await submit.click();
  expect(await page.locator('form').evaluate((form: HTMLFormElement) => form.checkValidity())).toBe(false);
  await page.getByLabel('Email', { exact: true }).fill('not-an-email');
  await page.getByLabel('Message', { exact: true }).fill('Hello');
  await submit.click();
  expect(calls).toBe(0);
  await expect(page).toHaveURL('http://127.0.0.1:4321/');
});
for (const failure of ['server', 'network']) {
  test(`${failure} failure allows Back to recover the message and retry`, async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Send message' })).toBeEnabled();
    await page.route(provider, route => failure === 'server'
      ? route.fulfill({ status: 503, contentType: 'text/html', body: '<h1>Service unavailable</h1>' })
      : route.abort('failed'));
    await fill(page);
    await page.getByRole('button', { name: 'Send message' }).click();
    // A transport failure may show the browser's own error page instead of the provider URL.
    await expect(page).not.toHaveURL('http://127.0.0.1:4321/');
    await expect(page).not.toHaveURL(/\/thanks\//);
    await page.goBack();
    await expect(page.getByLabel('Email', { exact: true })).toHaveValue('visitor@example.test');
    await expect(page.getByLabel('Message', { exact: true })).toHaveValue('Hello from a browser test.');
    await expect(page.getByRole('button', { name: 'Send message' })).toBeEnabled();
    await page.route(provider, async route => {
      const body = new URLSearchParams(route.request().postData()!);
      expect(body.get('message')).toBe('Hello from a browser test.');
      // Return to the test origin instead of the production _next destination.
      await route.fulfill({ status: 302, headers: { location: localThanks } });
    });
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page).toHaveURL(localThanks);
  });
}
test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('a visitor can still send the native form and return home', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Send message' })).toBeEnabled();
    await page.route(provider, async route => {
      expect(route.request().isNavigationRequest()).toBe(true);
      const body = new URLSearchParams(route.request().postData()!);
      expect(body.get('email')).toBe('visitor@example.test');
      expect(body.get('_captcha')).not.toBe('false');
      await route.fulfill({ status: 302, headers: { location: localThanks } });
    });
    await fill(page);
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.getByRole('heading', { name: 'Thank you.' })).toBeVisible();
  });
});
