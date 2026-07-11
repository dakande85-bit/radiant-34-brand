/// <reference types="node" />

import {
  getShopifyAccessToken,
  getShopifyApiVersion,
  getShopifyDomain,
  hasShopifyServerCredentials,
  ShopifyTokenError,
} from './_shopifyAuth.js';

const storefrontHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    headers['X-Shopify-Storefront-Access-Token'] = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  }

  return headers;
};

async function getAdminProductCount(accessToken: string) {
  const productResponse = await fetch(`https://${getShopifyDomain()}/admin/api/${getShopifyApiVersion()}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Shopify-Access-Token': accessToken,
    },
    body: JSON.stringify({
      query: 'query RadiantDebugProducts { products(first: 20) { nodes { id title handle } } }',
      variables: {},
    }),
  });

  const productPayload = await productResponse.json().catch(() => ({}));
  const productNodes = productPayload.data?.products?.nodes ?? [];

  return {
    ok: productResponse.ok && !productPayload.errors?.length,
    status: productResponse.status,
    productCount: productNodes.length,
    productTitles: productNodes.map((product: { title: string }) => product.title),
    products: productNodes.map((product: { title: string; handle: string }) => ({
      title: product.title,
      handle: product.handle,
    })),
    errors: productPayload.errors ?? [],
  };
}

async function getAdminProductsWithVariants(accessToken: string) {
  const productResponse = await fetch(`https://${getShopifyDomain()}/admin/api/${getShopifyApiVersion()}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Shopify-Access-Token': accessToken,
    },
    body: JSON.stringify({
      query: `query RadiantDebugProductsWithVariants {
        products(first: 20) {
          nodes {
            title
            handle
            variants(first: 5) {
              nodes {
                id
                availableForSale
              }
            }
          }
        }
      }`,
      variables: {},
    }),
  });

  const productPayload = await productResponse.json().catch(() => ({}));
  const productNodes = productPayload.data?.products?.nodes ?? [];

  return {
    ok: productResponse.ok && !productPayload.errors?.length,
    status: productResponse.status,
    products: productNodes as Array<{
      title: string;
      handle: string;
      variants?: { nodes?: Array<{ id: string; availableForSale?: boolean }> };
    }>,
    errors: productPayload.errors ?? [],
  };
}

async function testTokenlessCart(variantId?: string) {
  if (!variantId) {
    return {
      attempted: false,
      ok: false,
      status: null,
      reason: 'No variant ID available',
    };
  }

  const response = await fetch(`https://${getShopifyDomain()}/api/${getShopifyApiVersion()}/graphql.json`, {
    method: 'POST',
    headers: storefrontHeaders(),
    body: JSON.stringify({
      query: `mutation RadiantDebugCart($variantId: ID!, $quantity: Int!) {
        cartCreate(input: { lines: [{ merchandiseId: $variantId, quantity: $quantity }] }) {
          cart {
            id
            checkoutUrl
            totalQuantity
          }
          userErrors {
            field
            message
          }
        }
      }`,
      variables: { variantId, quantity: 1 },
    }),
  });

  const payload = await response.json().catch(() => ({}));
  const userErrors = payload.data?.cartCreate?.userErrors ?? [];

  return {
    attempted: true,
    ok: response.ok && !payload.errors?.length && userErrors.length === 0 && Boolean(payload.data?.cartCreate?.cart?.checkoutUrl),
    status: response.status,
    cartCreated: Boolean(payload.data?.cartCreate?.cart?.id),
    checkoutUrlReturned: Boolean(payload.data?.cartCreate?.cart?.checkoutUrl),
    userErrors,
    errors: payload.errors ?? [],
  };
}

async function getStorefrontProductForCart(handle: string) {
  const response = await fetch(`https://${getShopifyDomain()}/api/${getShopifyApiVersion()}/graphql.json`, {
    method: 'POST',
    headers: storefrontHeaders(),
    body: JSON.stringify({
      query: `query ProductForCart($handle: String!) {
        product(handle: $handle) {
          id
          title
          handle
          availableForSale
          variants(first: 20) {
            nodes {
              id
              title
              availableForSale
            }
          }
        }
      }`,
      variables: { handle },
    }),
  });

  const payload = await response.json().catch(() => ({}));
  const product = payload.data?.product ?? null;

  return {
    ok: response.ok && !payload.errors?.length && Boolean(product),
    status: response.status,
    product: product as null | {
      title: string;
      handle: string;
      availableForSale: boolean;
      variants?: { nodes?: Array<{ id: string; title: string; availableForSale: boolean }> };
    },
    errors: payload.errors ?? [],
  };
}

const localProductMap = [
  { title: 'Psalm 34 Tee', handle: 'premium-unisex-crewneck-t-shirt-bella-canvas-3001' },
  { title: 'Radiant Hoodie', handle: 'unisex-hoodie' },
  { title: 'Radiant Backpack', handle: 'minimalist-backpack' },
  { title: 'Radiant Duffle Bag', handle: 'duffle-bag' },
  { title: 'Radiant Mug', handle: 'white-glossy-mug' },
];

async function getStorefrontProductCount() {
  const productResponse = await fetch(`https://${getShopifyDomain()}/api/${getShopifyApiVersion()}/graphql.json`, {
    method: 'POST',
    headers: storefrontHeaders(),
    body: JSON.stringify({
      query: `query RadiantDebugProducts {
        products(first: 20) {
          nodes {
            id
            title
            handle
            availableForSale
            variants(first: 5) {
              nodes {
                id
                availableForSale
              }
            }
          }
        }
      }`,
      variables: {},
    }),
  });

  const productPayload = await productResponse.json().catch(() => ({}));
  const productNodes = productPayload.data?.products?.nodes ?? [];

  return {
    ok: productResponse.ok && !productPayload.errors?.length,
    status: productResponse.status,
    productCount: productNodes.length,
    productTitles: productNodes.map((product: { title: string }) => product.title),
    products: productNodes.map((product: {
      title: string;
      handle: string;
      availableForSale: boolean;
      variants?: { nodes?: Array<{ id: string; availableForSale: boolean }> };
    }) => ({
      title: product.title,
      handle: product.handle,
      availableForSale: product.availableForSale,
      variantCount: product.variants?.nodes?.length ?? 0,
      availableVariantCount: product.variants?.nodes?.filter((variant) => variant.availableForSale).length ?? 0,
    })),
    errors: productPayload.errors ?? [],
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const diagnostic = {
    ok: false,
    project: 'radiant-34-brand',
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'unknown',
    domainLoaded: Boolean(getShopifyDomain()),
    shopifyDomain: getShopifyDomain(),
    apiVersion: getShopifyApiVersion(),
    clientIdExists: Boolean(process.env.SHOPIFY_CLIENT_ID),
    clientSecretExists: Boolean(process.env.SHOPIFY_CLIENT_SECRET),
    configured: hasShopifyServerCredentials(),
    storefrontTokenExists: Boolean(process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN),
    localProductCount: localProductMap.length,
    activeShopifyProductCount: 0,
    adminProductCount: 0,
    storefrontProductCount: 0,
    matchedProductCount: 0,
    adminVariantIdCount: 0,
    storefrontVariantIdCount: 0,
    storefrontVisibleProductHandles: [] as string[],
    checkoutEnabledProductTitles: [] as string[],
    checkoutDisabledProductTitles: [] as string[],
    matchedHandles: [] as string[],
    lastCartError: null as unknown,
  };

  try {
    const token = await getShopifyAccessToken();
    const admin = await getAdminProductCount(token.accessToken);
    const adminWithVariants = await getAdminProductsWithVariants(token.accessToken);
    const localHandles = localProductMap.map((product) => product.handle);
    const matchedProducts = adminWithVariants.products.filter((product) => localHandles.includes(product.handle));
    const adminVariantIdCount = matchedProducts.filter((product) => product.variants?.nodes?.some((variant) => variant.id)).length;
    const storefront = await getStorefrontProductCount();
    const storefrontChecks = await Promise.all(
      localProductMap.map(async (localProduct) => ({
        localTitle: localProduct.title,
        localHandle: localProduct.handle,
        result: await getStorefrontProductForCart(localProduct.handle),
      })),
    );
    const cartEnabled = storefrontChecks.filter((check) =>
      check.result.product?.availableForSale
      && check.result.product.variants?.nodes?.some((variant) => variant.availableForSale),
    );
    const activeStorefrontProducts = storefront.products.filter((product) =>
      product.availableForSale && product.availableVariantCount > 0);
    const firstStorefrontVariantId = cartEnabled
      .flatMap((check) => check.result.product?.variants?.nodes ?? [])
      .find((variant) => variant.availableForSale)?.id;
    const cartTest = await testTokenlessCart(firstStorefrontVariantId);
    const lastCartError = cartTest.ok
      ? null
      : ('reason' in cartTest ? cartTest.reason : cartTest.errors?.[0] ?? cartTest.userErrors?.[0] ?? null);

    return res.status(200).json({
      ...diagnostic,
      ok: admin.ok || Boolean(storefront?.ok),
      tokenRequestStatus: 200,
      tokenCached: true,
      tokenExpiresAt: new Date(token.expiresAt).toISOString(),
      adminRequestStatus: admin.status,
      adminProductCount: admin.productCount,
      adminProductTitles: admin.productTitles,
      adminProducts: admin.products,
      adminErrors: admin.errors,
      adminVariantIdCount,
      storefrontRequestStatus: storefront.status,
      storefrontTokenExists: diagnostic.storefrontTokenExists,
      storefrontProductCount: storefront.productCount,
      storefrontProductTitles: storefront.productTitles,
      storefrontProducts: storefront.products,
      storefrontErrors: storefront.errors,
      storefrontVisibleProductHandles: activeStorefrontProducts.map((product) => product.handle),
      matchedProductCount: matchedProducts.length,
      activeShopifyProductCount: activeStorefrontProducts.length,
      storefrontVisibleProductCount: activeStorefrontProducts.length,
      storefrontVariantIdCount: activeStorefrontProducts.length,
      checkoutEnabledProductCount: activeStorefrontProducts.length,
      checkoutEnabledProductTitles: activeStorefrontProducts.map((product) =>
        localProductMap.find((item) => item.handle === product.handle)?.title ?? product.title),
      checkoutDisabledProductTitles: storefront.products
        .filter((product) => !activeStorefrontProducts.includes(product))
        .map((product) => product.title),
      matchedHandles: matchedProducts.map((product) => product.handle),
      lastCartError,
      storefrontCartTokenlessTest: cartTest,
    });
  } catch (error) {
    const tokenError = error instanceof ShopifyTokenError ? error : null;
    return res.status(200).json({
      ...diagnostic,
      ok: false,
      tokenRequestStatus: tokenError?.status ?? null,
      shopifyErrorCode: tokenError?.shopifyErrorCode ?? null,
      shopifyErrorDescription: tokenError?.shopifyErrorDescription ?? null,
      tokenError: error instanceof Error ? error.message : 'Unknown Shopify error',
    });
  }
}
