import {
  getShopifyApiVersion,
  getShopifyDomain,
} from './_shopifyAuth.js';

type StorefrontRequestBody = {
  query?: string;
  variables?: Record<string, unknown>;
};

const isDevelopment = process.env.NODE_ENV !== 'production';

const isProductListQuery = (query: string) =>
  /\bproducts\s*\(/.test(query);

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
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body) as StorefrontRequestBody;

  if (!body.query || typeof body.query !== 'string') {
    return res.status(400).json({ error: 'GraphQL query is required.' });
  }

  try {
    const domain = getShopifyDomain();
    const version = getShopifyApiVersion();
    const storefrontUrl = `https://${domain}/api/${version}/graphql.json`;

    const shopifyResponse = await fetch(storefrontUrl, {
      method: 'POST',
      headers: buildStorefrontHeaders(),
      body: JSON.stringify({
        query: body.query,
        variables: body.variables ?? {},
      }),
    });

    const payload = await shopifyResponse.json().catch(() => ({}));

    if (!shopifyResponse.ok) {
      console.error('[Radiant 34 Shopify] Storefront request failed', {
        status: shopifyResponse.status,
        statusText: shopifyResponse.statusText,
        domain,
        version,
      });
      return res.status(shopifyResponse.status).json({
        errors: [{ message: 'Shopify storefront request failed.' }],
      });
    }

    if (payload.errors?.length && isDevelopment) {
      console.error('[Radiant 34 Shopify] Storefront GraphQL errors', {
        errors: payload.errors,
      });
    }

    const productCount = payload.data?.products?.nodes?.length;
    if (typeof productCount === 'number' && isDevelopment) {
      console.info('[Radiant 34 Shopify] Product count returned', productCount);
      if (productCount === 0 && isProductListQuery(body.query)) {
        console.info('[Radiant 34 Shopify] No Storefront products returned. Check product status, sales-channel publishing, and availability.');
      }
    }

    return res.status(200).json(payload);
  } catch (error) {
    console.error('[Radiant 34 Shopify] Storefront proxy error', {
      message: error instanceof Error ? error.message : error,
    });

    return res.status(500).json({
      errors: [{ message: 'Shopify storefront proxy unavailable.' }],
    });
  }
}
