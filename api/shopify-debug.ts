/// <reference types="node" />

import {
  getCachedTokenStatus,
  getShopifyAccessToken,
  getShopifyApiVersion,
  getShopifyDomain,
  hasShopifyServerCredentials,
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
  };

  try {
    const token = await getShopifyAccessToken();
    return res.status(200).json({
      ...diagnostic,
      ok: true,
      token: {
        cached: true,
        expiresAt: new Date(token.expiresAt).toISOString(),
      },
    });
  } catch (error) {
    return res.status(200).json({
      ...diagnostic,
      ok: false,
      shopifyReachable: true,
      tokenError: error instanceof Error ? error.message : 'Unknown Shopify token error',
    });
  }
}
