import { expect, test, type Page } from '@playwright/test';

const SWEATSHIRT_TITLE = 'Radiant 34 All-Over Print Scripture Sweatshirt';
const DRESS_TITLE = 'Radiant 34 Fearfully & Wonderfully Created T-Shirt Dress';
const TSHIRT_TITLE = 'Radiant 34 Purple Faith over Fear T-Shirt';
const TSHIRT_IMAGE = 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/2250C457-58F8-4EB6-98F3-79609D88A604.png?v=1785234846';
const HEADWEAR_TITLE = 'Radiant 34 Follow God Not Man Snapback';
const NEUTRAL_TEE_CATEGORY_IMAGE = 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/unisex-sports-tee-black-front-6a7087ff9a6c2.jpg?v=1785759762';
const MEN_CATEGORY_IMAGE = '/images/category-men-faith-over-fear.png';
const WOMENS_OUTERWEAR_TITLE = "Radiant 34 Women's All-Over Print Bomber Jacket";
const WOMENS_CATEGORY_IMAGE = 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-womens-dress-editorial.png?v=1784775279';
const WOMENS_OUTERWEAR_CATEGORY_IMAGE = '/images/radiant-cream-hoodie.png';
const ALL_PRODUCTS_CATEGORY_IMAGE = 'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-signature-hoodie-cream-primary_128d2f24-8bd2-4f6b-bdcc-bd432ee36ee6.png?v=1784758611';

const image = (name: string) =>
  `https://cdn.shopify.com/s/files/1/1059/0545/5434/files/${name}.png?v=1785000000`;
const HEADWEAR_IMAGE = image('snapback-hat');
const WOMENS_OUTERWEAR_IMAGE = image('unisex-bomber-jacket-1');

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
  {
    ...makeProduct({
      id: '10000000000003',
      title: TSHIRT_TITLE,
      handle: 'unisex-t-shirt-2',
      productType: 'T-Shirt',
      tags: ['t-shirt', 'faith-over-fear'],
    }),
    featuredImage: { url: TSHIRT_IMAGE, altText: TSHIRT_TITLE },
    images: {
      nodes: [
        { url: TSHIRT_IMAGE, altText: TSHIRT_TITLE },
        { url: image('unisex-t-shirt-2-alt'), altText: `${TSHIRT_TITLE} alternate view` },
      ],
    },
  },
  makeProduct({
    id: '10000000000005',
    title: HEADWEAR_TITLE,
    handle: 'snapback-hat',
    productType: 'Headwear',
    tags: ['men', 'snapback', 'headwear'],
  }),
  makeProduct({
    id: '10000000000001',
    title: SWEATSHIRT_TITLE,
    handle: 'all-over-print-scripture-sweatshirt',
    productType: 'Sweatshirt',
    tags: ['scripture', 'sweatshirt', 'all-over-print'],
  }),
  makeProduct({
    id: '10000000000004',
    title: WOMENS_OUTERWEAR_TITLE,
    handle: 'unisex-bomber-jacket-1',
    productType: 'Bomber Jacket',
    tags: ['women', 'outerwear', 'bomber'],
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

test('T-Shirts category thumbnail uses a neutral product image instead of a women model', async ({ page }) => {
  await mockShopify(page);
  await page.goto('/shop');

  const tshirtCategoryImage = page
    .locator('.r34-shop-category-card[data-r34-category-key="tshirts"] img')
    .first();
  await expect(tshirtCategoryImage).toHaveAttribute('src', NEUTRAL_TEE_CATEGORY_IMAGE);
  await expect(tshirtCategoryImage).toHaveAttribute('alt', 'T-Shirts');
  await expect(tshirtCategoryImage).not.toHaveAttribute('src', TSHIRT_IMAGE);

  await page.getByRole('button', { name: /^Shop T-Shirts$/i }).click();
  const tshirtCardImage = page
    .locator('.shopify-card', { hasText: TSHIRT_TITLE })
    .first()
    .locator('.shopify-card__image img')
    .first();
  await expect(tshirtCardImage).toHaveAttribute('src', TSHIRT_IMAGE);
});

test('category thumbnails stay fixed when matching products change', async ({ page }) => {
  await mockShopify(page);
  await page.goto('/shop');

  const womenImage = page
    .locator('.r34-shop-category-card[data-r34-category-key="women"] img')
    .first();
  await expect(womenImage).toHaveAttribute('src', WOMENS_CATEGORY_IMAGE);
  await expect(womenImage).toHaveAttribute('alt', 'Women');

  const allProductsImage = page
    .locator('.r34-shop-category-card[data-r34-category-key="all"] img')
    .first();
  await expect(allProductsImage).toHaveAttribute('src', ALL_PRODUCTS_CATEGORY_IMAGE);
  await expect(allProductsImage).toHaveAttribute('alt', 'All Products');

  const womensOuterwearImage = page
    .locator('.r34-shop-category-card[data-r34-category-key="womens-outerwear"] img')
    .first();
  await expect(womensOuterwearImage).toHaveAttribute('src', WOMENS_OUTERWEAR_CATEGORY_IMAGE);
  await expect(womensOuterwearImage).toHaveAttribute('alt', 'Women’s Outerwear');

  await page.getByRole('button', { name: /Shop Women.*Outerwear/i }).click();
  const womensOuterwearCardImage = page
    .locator('.shopify-card', { hasText: WOMENS_OUTERWEAR_TITLE })
    .first()
    .locator('.shopify-card__image img')
    .first();
  await expect(womensOuterwearCardImage).toHaveAttribute('src', WOMENS_OUTERWEAR_IMAGE);
});

test('Men category thumbnail uses a neutral product image instead of a women model', async ({ page }) => {
  await mockShopify(page);
  await page.goto('/shop');

  const menImage = page
    .locator('.r34-shop-category-card[data-r34-category-key="men"] img')
    .first();
  await expect(menImage).toHaveAttribute('src', MEN_CATEGORY_IMAGE);
  await expect(menImage).toHaveAttribute('alt', 'Men');
  await expect(menImage).not.toHaveAttribute('src', HEADWEAR_IMAGE);
  await expect(menImage).not.toHaveAttribute('src', TSHIRT_IMAGE);
});
