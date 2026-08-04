import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8');

test('server never falls back from Storefront variants to Admin variants for checkout', () => {
  const source = read('api/shopify-storefront.ts');

  expect(source).not.toContain('admin/api');
  expect(source).not.toContain('getShopifyAccessToken');
  expect(source).not.toContain('adminVariant');
  expect(source).not.toContain('storefrontVariant ??');
  expect(source).not.toMatch(/storefrontVariantId:[\s\S]{0,120}adminVariant/);
  expect(source).not.toMatch(/canCheckout:[\s\S]{0,120}adminVariant/);
  expect(source).toContain('isStorefrontVariantId(variant.id)');
  expect(source).toContain('canCheckout: Boolean(checkoutVariant)');
  expect(source).toContain('images(first: 2)');
  expect(source).toContain('variants(first: 1)');
});

test('client checkout mapping does not use display variants as a fallback', () => {
  const source = read('src/main.tsx');

  expect(source).not.toContain('product.storefrontVariantId ?? variant?.id');
  expect(source).not.toContain('product.storefrontVariantId ?? displayVariant?.id');
  expect(source).toContain('const checkoutEnabled = Boolean(product.canCheckout && isStorefrontVariantId(product.storefrontVariantId));');
  expect(source).toContain('variantId: checkoutEnabled ? product.storefrontVariantId : undefined');
});

test('shop purchase controls are not hidden by catalogue integrity CSS', () => {
  expect(fs.existsSync(path.join(root, 'public/shop-grid-integrity.css'))).toBe(false);
  const source = read('src/styles.css');

  expect(source).not.toMatch(/\.shop-page\s+\.shopify-card__actions\s*{[^}]*display:\s*none\s*!important/i);
});

test('product detail resolves variants by selected option set', () => {
  const source = read('src/main.tsx');

  expect(source).toContain('findVariantForSelectedOptions');
  expect(source).toContain('[primaryOptionName]: selectedSize');
  expect(source).toContain('[colorOptionName]: selectedColor');
  expect(source).toContain('selections.every');
});

test('Storefront proxy rejects unsupported operations before forwarding to Shopify', () => {
  const source = read('api/shopify-storefront.ts');

  expect(source).toContain('isAllowedCartOperation');
  expect(source).toContain('Unsupported Shopify operation.');
  expect(source).toContain('containsInvalidVariantId');
  expect(source).toContain('Invalid product variant.');
});

test('production diagnostics are removed', () => {
  expect(fs.existsSync(path.join(root, 'api/shopify-token.ts'))).toBe(false);
  expect(fs.existsSync(path.join(root, 'api/shopify-debug.ts'))).toBe(false);
  expect(read('src/lib/shopify.ts')).not.toContain('/api/shopify-token');
});

test('document shell does not load DOM patch assets', () => {
  const source = read('index.html');
  const removedPatchNames = [
    'shopify-live-sync',
    'shop-catalog-sync',
    'shop-grid-normalizer',
    'review-auth',
    'customer-account',
    'product-page-content-fix',
    'mobile-menu-fix',
  ];

  for (const patchName of removedPatchNames) {
    expect(source).not.toContain(patchName);
    expect(fs.existsSync(path.join(root, `public/${patchName}.js`))).toBe(false);
  }
});
