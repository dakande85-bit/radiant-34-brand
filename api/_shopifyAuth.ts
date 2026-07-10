/// <reference types="node" />

const DEFAULT_SHOPIFY_API_VERSION = '2026-07';
const TOKEN_EXPIRY_BUFFER_MS = 60_000;

type CachedToken = {
  accessToken: string;
  expiresAt: number;
};

type ShopifyTokenResponse = {
  access_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
};

export class ShopifyTokenError extends Error {
  status: number;
  shopifyErrorCode?: string;
  shopifyErrorDescription?: string;

  constructor(status: number, body: ShopifyTokenResponse) {
    super(`Shopify token request failed: ${status}`);
    this.name = 'ShopifyTokenError';
    this.status = status;
    this.shopifyErrorCode = body.error;
    this.shopifyErrorDescription = body.error_description;
  }
}

let cachedToken: CachedToken | null = null;

export const getShopifyDomain = () =>
  process.env.SHOPIFY_STORE_DOMAIN || 'xagsqp-u0.myshopify.com';

export const getShopifyApiVersion = () =>
  process.env.SHOPIFY_API_VERSION || DEFAULT_SHOPIFY_API_VERSION;

export const hasShopifyServerCredentials = () =>
  Boolean(getShopifyDomain() && process.env.SHOPIFY_CLIENT_ID && process.env.SHOPIFY_CLIENT_SECRET);

export async function getShopifyAccessToken() {
  if (cachedToken && Date.now() < cachedToken.expiresAt - TOKEN_EXPIRY_BUFFER_MS) {
    return cachedToken;
  }

  const domain = getShopifyDomain();
  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

  if (!domain || !clientId || !clientSecret) {
    throw new Error('Missing server Shopify credentials.');
  }

  const tokenUrl = `https://${domain}/admin/oauth/access_token`;
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  const body = await response.json().catch(() => ({})) as ShopifyTokenResponse;

  if (!response.ok || !body.access_token) {
    console.error('[Radiant 34 Shopify] Token request failed', {
      status: response.status,
      statusText: response.statusText,
      error: body.error,
      errorDescription: body.error_description,
    });
    throw new ShopifyTokenError(response.status, body);
  }

  const expiresInMs = Math.max((body.expires_in ?? 3600) * 1000, TOKEN_EXPIRY_BUFFER_MS);
  cachedToken = {
    accessToken: body.access_token,
    expiresAt: Date.now() + expiresInMs,
  };

  return cachedToken;
}

export function getCachedTokenStatus() {
  return {
    cached: Boolean(cachedToken && Date.now() < cachedToken.expiresAt - TOKEN_EXPIRY_BUFFER_MS),
    expiresAt: cachedToken ? new Date(cachedToken.expiresAt).toISOString() : null,
  };
}
