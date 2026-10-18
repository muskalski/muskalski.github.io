import { test, expect } from '@playwright/test';
test.beforeEach(async ({ page }) => { await page.goto('/'); });
test('each thumbnail opens its matching uncropped image and restores focus', async ({ page }) => {
  for (const id of ['tornado', 'highline', 'stretch', 'flag', 'italy', 'big-sur']) {
    const link = page.locator(`[data-photo="${id}"]`);
    const source = await link.getAttribute('href');
    const alt = await link.locator('img').getAttribute('alt');
    await link.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('img')).toHaveAttribute('src', new URL(source!, page.url()).href);
    await expect(dialog.locator('img')).toHaveAttribute('alt', alt!);
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(link).toBeFocused();
  }
});
test('previous, next and arrow keys wrap across all six images', async ({ page }) => {
  await page.locator('[data-photo="tornado"]').click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Previous photo' }).click();
  await expect(dialog.locator('img')).toHaveAttribute('alt', /Big Sur/);
  await expect(dialog).toHaveAccessibleDescription(/Sitting on a bench overlooking the Pacific coast at Big Sur/);
  await dialog.getByRole('button', { name: 'Next photo' }).click();
  await expect(dialog.locator('img')).toHaveAttribute('alt', /tornado/);
  await page.keyboard.press('ArrowRight');
  await expect(dialog.locator('img')).toHaveAttribute('alt', /highline/);
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await expect(dialog.locator('img')).toHaveAttribute('alt', /Big Sur/);
  await expect(dialog).toHaveAccessibleDescription(/Sitting on a bench overlooking the Pacific coast at Big Sur/);
});
test('tab and shift-tab remain in the dialog; close returns to opener', async ({ page }) => {
  const opener = page.locator('[data-photo="italy"]');
  await opener.focus(); await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog');
  for (const key of ['Tab', 'Tab', 'Tab', 'Tab', 'Shift+Tab', 'Shift+Tab', 'Shift+Tab', 'Shift+Tab']) {
    await page.keyboard.press(key);
    expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
  }
  await dialog.getByRole('button', { name: 'Close photo viewer' }).click();
  await expect(opener).toBeFocused();
});
test('without JavaScript thumbnails link to real image files', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage(); await page.goto('http://127.0.0.1:4321');
  const href = await page.locator('[data-photo="flag"]').getAttribute('href');
  const response = await page.request.get(new URL(href!, page.url()).href);
  expect(response.ok()).toBe(true); expect(response.headers()['content-type']).toContain('image/');
  await context.close();
});
