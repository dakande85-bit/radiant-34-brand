import { expect, test, type Page } from '@playwright/test';

const PRODUCT_HANDLE = 'radiant-34-jesus-symbol-50-cotton';
const PRODUCT_TITLE = 'Radiant 34 - Jesus Symbol 50% Cotton';

async function mockProduct(page: Page) {
  const patchScripts = [
    'review-auth',
    'shopify-live-sync',
    'menu-fixes',
    'mobile-menu-fix',
    'contact-page-upgrade',
    'mission-product-slider',
    'shop-catalog-sync-v2',
    'shop-grid-normalizer',
    'mens-outerwear-thumbnail',
    'product-page-content-fix',
    'mission-support',
    'customer-account',
  ];

  for (const script of patchScripts) {
    await page.route(`**/${script}.js**`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: '',
      });
    });
  }

  await page.route('**/api/reviews/summary', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ summaries: {} }),
    });
  });

  await page.route('**/api/reviews?**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ reviews: [] }),
    });
  });

  await page.route('**/api/shopify-storefront', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          product: {
            id: 'gid://shopify/Product/15945216295242',
            title: PRODUCT_TITLE,
            handle: PRODUCT_HANDLE,
            description: 'Black Jesus symbol T-shirt.',
            createdAt: '2026-08-03T12:22:37Z',
            productType: '',
            tags: [],
            featuredImage: {
              url: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/unisex-sports-tee-black-front-6a7087ff9a6c2.jpg?v=1785759762',
              altText: 'Product mockup',
            },
            images: {
              nodes: [
                {
                  url: 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/unisex-sports-tee-black-front-6a7087ff9a6c2.jpg?v=1785759762',
                  altText: 'Product mockup',
                },
              ],
            },
            variants: {
              nodes: ['S', 'M', 'L', 'XL'].map((size, index) => ({
                id: `gid://shopify/ProductVariant/6286134345761${index}`,
                title: size,
                availableForSale: true,
                selectedOptions: [{ name: 'Size', value: size }],
              })),
            },
            storefrontVariantId: 'gid://shopify/ProductVariant/62861343457610',
            canCheckout: true,
            priceRange: {
              minVariantPrice: { amount: '14.0', currencyCode: 'EUR' },
            },
          },
        },
      }),
    });
  });
}

test('Jesus symbol product shows Black instead of fallback Cream colour', async ({ page }) => {
  await mockProduct(page);
  await page.goto(`/products/${PRODUCT_HANDLE}`);

  await expect(page.getByRole('heading', { name: 'Radiant 34 Jesus Symbol T-Shirt' })).toBeVisible();
  await expect(page.locator('.selector-group', { hasText: 'Colour' }).getByRole('button', { name: 'Black' })).toBeVisible();
  await expect(page.locator('.size-guide')).toContainText('Colour selected: Black.');
  await expect(page.locator('.selector-group', { hasText: 'Colour' })).not.toContainText('Cream');
});
