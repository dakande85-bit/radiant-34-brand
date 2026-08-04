/// <reference types="node" />

import type { ApiRequest, ApiResponse } from './_types.js';
import {
  getShopifyAccessToken,
  getShopifyApiVersion,
  getShopifyDomain,
  hasShopifyServerCredentials,
} from './_shopifyAuth.js';

type ShopifyGraphqlResponse<T> = {
  data?: T;
  errors?: Array<{ message?: string }>;
};

type CustomerNode = {
  id: string;
  email?: string;
};

type CustomerPayload = {
  customers?: {
    nodes?: CustomerNode[];
  };
  customerCreate?: {
    customer?: CustomerNode | null;
    userErrors?: Array<{ message: string }>;
  };
  customerEmailMarketingConsentUpdate?: {
    customer?: CustomerNode | null;
    userErrors?: Array<{ message: string }>;
  };
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rateLimitWindowMs = 15 * 60_000;
const rateLimitMax = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

const requestIp = (req: ApiRequest) => {
  const forwarded = String(req.headers['x-forwarded-for'] ?? '').split(',')[0]?.trim();
  return forwarded || req.socket?.remoteAddress || 'unknown';
};

const checkRateLimit = (key: string) => {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + rateLimitWindowMs });
    return true;
  }
  if (current.count >= rateLimitMax) return false;
  current.count += 1;
  return true;
};

const normaliseEmail = (value: unknown) => String(value ?? '').trim().toLowerCase();

const shopifyAdminGraphql = async <T>(query: string, variables: Record<string, unknown>) => {
  const token = await getShopifyAccessToken();
  const response = await fetch(`https://${getShopifyDomain()}/admin/api/${getShopifyApiVersion()}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Shopify-Access-Token': token.accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  const payload = await response.json().catch(() => ({})) as ShopifyGraphqlResponse<T>;
  if (!response.ok || payload.errors?.length) {
    console.error('[Radiant 34 Newsletter] Shopify Admin request failed', {
      status: response.status,
      errors: payload.errors?.map((error) => error.message).filter(Boolean),
    });
    throw new Error('Newsletter provider unavailable.');
  }

  return payload.data;
};

const findCustomerByEmail = async (email: string) => {
  const data = await shopifyAdminGraphql<CustomerPayload>(`
    query RadiantNewsletterCustomer($query: String!) {
      customers(first: 1, query: $query) {
        nodes { id email }
      }
    }
  `, { query: `email:${email}` });

  return data?.customers?.nodes?.[0] ?? null;
};

const createCustomer = async (email: string) => {
  const data = await shopifyAdminGraphql<CustomerPayload>(`
    mutation RadiantNewsletterCustomerCreate($input: CustomerInput!) {
      customerCreate(input: $input) {
        customer { id email }
        userErrors { message }
      }
    }
  `, { input: { email } });

  const error = data?.customerCreate?.userErrors?.[0]?.message;
  if (error || !data?.customerCreate?.customer?.id) throw new Error(error ?? 'Unable to create subscriber.');
  return data.customerCreate.customer;
};

const setMarketingConsent = async (customerId: string) => {
  const data = await shopifyAdminGraphql<CustomerPayload>(`
    mutation RadiantNewsletterConsent($customerId: ID!, $input: CustomerEmailMarketingConsentUpdateInput!) {
      customerEmailMarketingConsentUpdate(customerId: $customerId, emailMarketingConsent: $input) {
        customer { id email }
        userErrors { message }
      }
    }
  `, {
    customerId,
    input: {
      marketingState: 'SUBSCRIBED',
      marketingOptInLevel: 'SINGLE_OPT_IN',
    },
  });

  const error = data?.customerEmailMarketingConsentUpdate?.userErrors?.[0]?.message;
  if (error || !data?.customerEmailMarketingConsentUpdate?.customer?.id) {
    throw new Error(error ?? 'Unable to subscribe email.');
  }
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!hasShopifyServerCredentials()) {
    return res.status(503).json({ error: 'Newsletter signup is not configured.' });
  }

  let body: Record<string, unknown>;
  try {
    body = (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body ?? {}) as Record<string, unknown>;
  } catch {
    return res.status(400).json({ error: 'Invalid request body.' });
  }

  if (String(body.company ?? '').trim()) {
    return res.status(400).json({ error: 'Unable to subscribe this email.' });
  }

  const email = normaliseEmail(body.email);
  if (!emailPattern.test(email) || email.length > 254) {
    return res.status(400).json({ error: 'Enter a valid email address.' });
  }

  if (!checkRateLimit(`${requestIp(req)}:${email}`)) {
    return res.status(429).json({ error: 'Too many signup attempts. Please try again later.' });
  }

  try {
    const customer = await findCustomerByEmail(email) ?? await createCustomer(email);
    await setMarketingConsent(customer.id);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('[Radiant 34 Newsletter] Signup failed', {
      message: error instanceof Error ? error.message : error,
    });
    return res.status(502).json({ error: 'Newsletter signup is temporarily unavailable.' });
  }
}
