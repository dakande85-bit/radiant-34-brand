/// <reference types="node" />

import {
  getCachedTokenStatus,
  getShopifyAccessToken,
  getShopifyApiVersion,
  getShopifyDomain,
  hasShopifyServerCredentials,
  ShopifyTokenError,
} from './_shopifyAuth.js';

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
    token: getCachedTokenStatus(),
    localProductCount: 6,
    shopifyProductCount: 0,
  };

  try {
    const token = await getShopifyAccessToken();
    let shopifyProductCount = 0;
    const productResponse = await fetch(`https://${getShopifyDomain()}/api/${getShopifyApiVersion()}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token.accessToken}`,
      },
      body: JSON.stringify({
        query: 'query RadiantDebugProducts { products(first: 20) { nodes { id } } }',
        variables: {},
      }),
    });
    const productPayload = await productResponse.json().catch(() => ({}));
    shopifyProductCount = productPayload.data?.products?.nodes?.length ?? 0;

    return res.status(200).json({
      ...diagnostic,
      ok: true,
      tokenRequestStatus: 200,
      shopifyProductCount,
      token: {
        cached: true,
        expiresAt: new Date(token.expiresAt).toISOString(),
      },
    });
  } catch (error) {
    const tokenError = error instanceof ShopifyTokenError ? error : null;
    return res.status(200).json({
      ...diagnostic,
      ok: false,
      shopifyReachable: true,
      tokenRequestStatus: tokenError?.status ?? null,
      shopifyErrorCode: tokenError?.shopifyErrorCode ?? null,
      shopifyErrorDescription: tokenError?.shopifyErrorDescription ?? null,
      tokenError: error instanceof Error ? error.message : 'Unknown Shopify token error',
    });
  }
}
