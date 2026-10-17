import { test, expect } from '@playwright/test';
for (const [width, height] of [[1440, 900], [1280, 800], [768, 1024], [390, 844]]) {
  test(`layout fits ${width} by ${height} with reduced motion`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    for (const link of await page.locator('nav a[href*="#"]').all()) {
      const href = await link.getAttribute('href');
      await link.click();
      await expect(page.locator(href!.slice(href!.indexOf('#')))).toBeInViewport();
    }
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
    expect(await page.locator('.photo-link img').first().evaluate(el => getComputedStyle(el).transitionDuration)).toBe('0s');
  });
}
test('retired URL serves helpful 404 and a working home link', async ({ page }) => {
  const response = await page.goto('/photos/big_sur-us-2/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: /page not found/i })).toBeVisible();
  await page.getByRole('link', { name: 'Back to the homepage' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Code. Sound.');
});
