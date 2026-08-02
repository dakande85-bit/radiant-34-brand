import { expect, test, type Page } from '@playwright/test';

const PHONE_CASE_TITLE = 'Radiant 34 Scripture Tough Phone Case';
const PUBLIC_HANDLE = 'radiant-scripture-tough-case';
const SHOPIFY_HANDLE = 'tough-case-3';
const PRIMARY_IMAGE =
  'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/9db4ff38-cb8f-4d85-9fb0-59b229c12ee8.png?v=1785480889';
const SECONDARY_IMAGE =
  'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/9bf7335f-2276-4a33-80bc-f3449df130ab.webp?v=1784645743';
const REMOVED_TITLE_MAPPED_IMAGE =
  'https://cdn.shopify.com/s/files/1/1059/0545/5434/files/radiant34-scripture-tough-case-hover-final.png?v=1784728842';

const toughCaseProduct = {
  id: 'gid://shopify/Product/15921055400266',
  title: PHONE_CASE_TITLE,
  handle: SHOPIFY_HANDLE,
  description: 'Protection with purpose: a durable phone case carrying a bold faith-centred design.',
  createdAt: '2026-08-01T00:00:00Z',
  productType: 'Phone Case',
  tags: ['accessories', 'phone-case'],
  featuredImage: { url: PRIMARY_IMAGE, altText: PHONE_CASE_TITLE },
  images: {
    nodes: [
      { url: PRIMARY_IMAGE, altText: PHONE_CASE_TITLE },
      { url: SECONDARY_IMAGE, altText: `${PHONE_CASE_TITLE} alternate view` },
    ],
  },
  variants: {
    nodes: [
      {
        id: 'gid://shopify/ProductVariant/62668676694346',
        title: 'Default Title',
        availableForSale: true,
        selectedOptions: [{ name: 'Title', value: 'Default Title' }],
      },
    ],
  },
  storefrontVariantId: 'gid://shopify/ProductVariant/62668676694346',
  canCheckout: true,
  priceRange: {
    minVariantPrice: { amount: '24.00', currencyCode: 'USD' },
  },
};

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

  await page.route('**/api/reviews?**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ reviews: [] }),
    });
  });

  await page.route('**/api/shopify-storefront', async (route) => {
    const body = route.request().postDataJSON() as { query?: string; variables?: { handle?: string } };
    const isProductByHandle = body.query?.includes('RadiantProductByHandle') || body.query?.includes('product(handle:');
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: isProductByHandle
          ? { product: body.variables?.handle === SHOPIFY_HANDLE ? toughCaseProduct : null }
          : { products: { nodes: [toughCaseProduct] } },
      }),
    });
  });
}

async function installImageSrcRecorder(page: Page) {
  await page.addInitScript(() => {
    window.__r34ImageSrcChanges = [];
    const srcDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
    if (srcDescriptor?.get && srcDescriptor?.set) {
      Object.defineProperty(HTMLImageElement.prototype, 'src', {
        configurable: true,
        get() {
          return srcDescriptor.get?.call(this);
        },
        set(value) {
          window.__r34ImageSrcChanges.push({
            kind: 'property',
            value: String(value),
            className: String(this.className || ''),
            alt: String(this.alt || ''),
          });
          return srcDescriptor.set?.call(this, value);
        },
      });
    }

    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function setAttribute(name: string, value: string) {
      if (this instanceof HTMLImageElement && name.toLowerCase() === 'src') {
        window.__r34ImageSrcChanges.push({
          kind: 'attribute',
          value: String(value),
          className: String(this.className || ''),
          alt: String(this.alt || ''),
        });
      }
      return originalSetAttribute.call(this, name, value);
    };
  });
}

async function openShopAndCard(page: Page) {
  await mockShopify(page);
  await page.goto('/shop');
  await page.getByRole('button', { name: /Shop All Products|All Products/i }).click();
  const card = page.locator('.shopify-card', { hasText: PHONE_CASE_TITLE }).first();
  await expect(card).toBeVisible();
  await expect(card.locator('.shopify-card__image img').first()).toHaveAttribute('src', PRIMARY_IMAGE);
  await expect(card.locator('.shopify-card__hover')).toHaveAttribute('src', SECONDARY_IMAGE);
  await expect(page.locator(`img[src="${REMOVED_TITLE_MAPPED_IMAGE}"]`)).toHaveCount(0);
  return card;
}

test.describe('Radiant 34 Scripture Tough Phone Case mobile card media', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });

  test('mobile touch keeps the primary image visible while scrolling and opens the product page', async ({ page }) => {
    await installImageSrcRecorder(page);
    const card = await openShopAndCard(page);
    await page.evaluate(() => {
      window.__r34ImageSrcChanges = [];
    });

    await card.scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 360);
    await card.scrollIntoViewIfNeeded();

    await expect(card.locator('.shopify-card__image img').first()).toHaveCSS('opacity', '1');
    await expect(card.locator('.shopify-card__hover')).toHaveCSS('opacity', '0');
    await expect(card.locator('.shopify-card__image img').first()).toHaveAttribute('src', PRIMARY_IMAGE);

    const changes = await page.evaluate(() => window.__r34ImageSrcChanges);
    expect(changes).toEqual([]);

    await card.locator('.shopify-card__main').tap();
    await expect(page).toHaveURL(new RegExp(`/products/${PUBLIC_HANDLE}$`));
    await expect(page.getByRole('heading', { name: PHONE_CASE_TITLE })).toBeVisible();
  });
});

test.describe('Radiant 34 Scripture Tough Phone Case desktop card media', () => {
  test.use({
    viewport: { width: 1280, height: 900 },
  });

  test('desktop hover swaps only to the Shopify secondary product image', async ({ page }) => {
    const card = await openShopAndCard(page);
    const primary = card.locator('.shopify-card__image img').first();
    const hover = card.locator('.shopify-card__hover');

    await expect(primary).toHaveCSS('opacity', '1');
    await expect(hover).toHaveCSS('opacity', '0');
    await expect.poll(() => page.evaluate(() => window.matchMedia('(hover: hover) and (pointer: fine)').matches)).toBe(true);
    const imageBox = await card.locator('.shopify-card__image').boundingBox();
    expect(imageBox).not.toBeNull();
    await page.mouse.move(imageBox!.x + imageBox!.width / 2, imageBox!.y + imageBox!.height / 2);
    await expect.poll(async () => Number(await primary.evaluate((node) => getComputedStyle(node).opacity))).toBeLessThan(0.05);
    await expect.poll(async () => Number(await hover.evaluate((node) => getComputedStyle(node).opacity))).toBeGreaterThan(0.95);
    await expect(hover).toHaveAttribute('src', SECONDARY_IMAGE);
    await expect(page.locator(`img[src="${REMOVED_TITLE_MAPPED_IMAGE}"]`)).toHaveCount(0);
  });
});
