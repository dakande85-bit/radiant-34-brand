import { expect, test } from '@playwright/test';

test('Header has no duplicate Contact or Mission links', async ({ page }) => {
  await page.goto('/');

  const header = page.locator('.site-header');
  await expect(header.getByText('Shop', { exact: true })).toBeVisible();
  await expect(header.getByText('Our Story', { exact: true })).toBeVisible();
  await expect(page.locator('.main-nav > a', { hasText: /^Contact$/ })).toHaveCount(0);
  await expect(page.locator('.header-actions').getByText('Contact', { exact: true })).toHaveCount(1);
  await expect(page.locator('.main-nav > a', { hasText: /^Our Missions?$/ })).toHaveCount(0);
});

test('Mission content is available from the Our Story page', async ({ page }) => {
  await page.goto('/about');

  await expect(page.getByRole('heading', { name: 'A psalm, worn.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Clothing that helps the testimony travel.' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Read the Mission' })).toBeVisible();
});
