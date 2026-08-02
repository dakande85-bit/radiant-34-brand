import { expect, test, type Page } from '@playwright/test';

const SWEATSHIRT_TITLE = 'Radiant 34 All-Over Print Scripture Sweatshirt';
const DRESS_TITLE = 'Radiant 34 Fearfully & Wonderfully Created T-Shirt Dress';

const image = (name: string) =>
  `https://cdn.shopify.com/s/files/1/1059/0545/5434/files/${name}.png?v=1785000000`;

const makeProduct = ({
  id,
  title,
  handle,
  productType,
  tags = [],
}: {
  id: string;
  title: string;
  handle: string;
  productType: string;
  tags?: string[];
}) => ({
  id: `gid://shopify/Product/${id}`,
  title,
  handle,
  description: `${title} test product.`,
  createdAt: '2026-08-01T00:00:00Z',
  productType,
  tags,
  featuredImage: { url: image(handle), altText: title },
  images: {
    nodes: [
      { url: image(handle), altText: title },
      { url: image(`${handle}-alt`), altText: `${title} alternate view` },
    ],
  },
  variants: {
    nodes: [
      {
        id: `gid://shopify/ProductVariant/${id}01`,
        title: 'Default Title',
        availableForSale: true,
        selectedOptions: [{ name: 'Title', value: 'Default Title' }],
      },
    ],
  },
  storefrontVariantId: `gid://shopify/ProductVariant/${id}01`,
  canCheckout: true,
  priceRange: {
    minVariantPrice: { amount: '64.00', currencyCode: 'USD' },
  },
});

const products = [
  makeProduct({
    id: '10000000000001',
    title: SWEATSHIRT_TITLE,
    handle: 'all-over-print-scripture-sweatshirt',
    productType: 'Sweatshirt',
    tags: ['scripture', 'sweatshirt', 'all-over-print'],
  }),
  makeProduct({
    id: '10000000000002',
    title: DRESS_TITLE,
    handle: 't-shirt-dress',
    productType: 'Dress',
    tags: ['women', 'dress'],
  }),
];

async function mockShopify(page: Page) {
  await page.route('**/api/shopify-token', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, configured: true, tokenCached: true }),
    });
  });

  await page.route('**/api/reviews/summary', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ summaries: {} }),
    });
  });

  await page.route('**/api/shopify-storefront', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: { products: { nodes: products } } }),
    });
  });
}

test('Women category excludes unisex/all-over scripture sweatshirts', async ({ page }) => {
  await mockShopify(page);
  await page.goto('/shop');

  await page.getByRole('button', { name: /Shop All Products|All Products/i }).click();
  const sweatshirtCard = page.locator('.shopify-card', { hasText: SWEATSHIRT_TITLE }).first();
  await expect(sweatshirtCard).toBeVisible();

  await page.getByRole('button', { name: /^Shop Women$/i }).click();
  await expect(sweatshirtCard).toBeHidden();
  await expect(page.locator('.shopify-card', { hasText: DRESS_TITLE }).first()).toBeVisible();
});
