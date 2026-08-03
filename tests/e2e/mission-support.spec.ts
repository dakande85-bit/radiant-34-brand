import { expect, test } from '@playwright/test';

test('Mission page only shows the approved supported organisation', async ({ page }) => {
  await page.goto('/mission');

  await expect(page.getByRole('heading', { name: "Equip God's People UK" })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Tenerife Family Church' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'The Grassroots Trust' })).toHaveCount(0);
});
