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
    storefrontAccessTokenExists: Boolean(process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN),
    localProductCount: 6,
    adminProductCount: 0,
    storefrontProductCount: 0,
  };

  try {
    const token = await getShopifyAccessToken();
    const admin = await getAdminProductCount(token.accessToken);
    const storefront = diagnostic.storefrontAccessTokenExists
      ? await getStorefrontProductCount()
      : null;

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
      storefrontRequestStatus: storefront?.status ?? null,
      storefrontProductCount: storefront?.productCount ?? 0,
      storefrontProductTitles: storefront?.productTitles ?? [],
      storefrontProducts: storefront?.products ?? [],
      storefrontErrors: storefront?.errors ?? [],
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
