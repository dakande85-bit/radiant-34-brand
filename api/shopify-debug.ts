/// <reference types="node" />

import {
  getShopifyApiVersion,
  getShopifyDomain,
} from './_shopifyAuth.js';

const buildStorefrontHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const storefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (storefrontToken) {
    headers['X-Shopify-Storefront-Access-Token'] = storefrontToken;
  }

  return headers;
};

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
    storefrontAccessTokenExists: Boolean(process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN),
    localProductCount: 6,
    shopifyProductCount: 0,
    shopifyErrors: [] as unknown[],
  };

  try {
    const productResponse = await fetch(`https://${getShopifyDomain()}/api/${getShopifyApiVersion()}/graphql.json`, {
      method: 'POST',
      headers: buildStorefrontHeaders(),
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

    return res.status(200).json({
      ...diagnostic,
      ok: productResponse.ok && !productPayload.errors?.length,
      storefrontRequestStatus: productResponse.status,
      shopifyProductCount: productNodes.length,
      shopifyProductTitles: productNodes.map((product: { title: string }) => product.title),
      shopifyProducts: productNodes.map((product: {
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
      shopifyErrors: productPayload.errors ?? [],
    });
  } catch (error) {
    return res.status(200).json({
      ...diagnostic,
      ok: false,
      storefrontReachable: false,
      storefrontError: error instanceof Error ? error.message : 'Unknown Shopify Storefront error',
    });
  }
}
