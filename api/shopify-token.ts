/// <reference types="node" />

import {
  getCachedTokenStatus,
  getShopifyAccessToken,
  getShopifyDomain,
  hasShopifyServerCredentials,
} from './_shopifyAuth.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = await getShopifyAccessToken();
    return res.status(200).json({
      ok: true,
      domainLoaded: Boolean(getShopifyDomain()),
      clientIdExists: Boolean(process.env.SHOPIFY_CLIENT_ID),
      clientSecretExists: Boolean(process.env.SHOPIFY_CLIENT_SECRET),
      configured: hasShopifyServerCredentials(),
      tokenCached: true,
      expiresAt: new Date(token.expiresAt).toISOString(),
    });
  } catch (error) {
    console.error('[Radiant 34 Shopify] Token route failed', {
      message: error instanceof Error ? error.message : error,
      cache: getCachedTokenStatus(),
    });

    return res.status(500).json({
      ok: false,
      domainLoaded: Boolean(getShopifyDomain()),
      clientIdExists: Boolean(process.env.SHOPIFY_CLIENT_ID),
      clientSecretExists: Boolean(process.env.SHOPIFY_CLIENT_SECRET),
      configured: hasShopifyServerCredentials(),
      error: 'Shopify token unavailable',
    });
  }
}
