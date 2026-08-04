import {
  getShopifyApiVersion,
  getShopifyDomain,
} from './_shopifyAuth.js';

type StorefrontRequestBody = {
  query?: string;
  variables?: Record<string, unknown>;
};

type JsonResponder = {
  json: (payload: unknown) => unknown;
};

type VercelRequest = {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type VercelResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => JsonResponder;
};

type ShopifyImage = {
  url?: string;
  altText?: string | null;
};

type ShopifyVariant = {
  id: string;
  title?: string;
  availableForSale?: boolean;
  selectedOptions?: Array<{ name: string; value: string }>;
};

type StorefrontProduct = {
  id: string;
  title: string;
  handle: string;
  description?: string;
  createdAt?: string;
  productType?: string;
  tags?: string[];
  availableForSale?: boolean;
  featuredImage?: ShopifyImage | null;
  images?: { nodes?: ShopifyImage[] };
  variants?: { nodes?: ShopifyVariant[] };
  priceRange?: { minVariantPrice?: { amount: string; currencyCode: string } };
};

type CatalogPayload = {
  data: {
    products: {
      nodes: ReturnType<typeof toClientProduct>[];
    };
  };
};

const isDevelopment = process.env.NODE_ENV !== 'production';
const catalogCacheTtlMs = 5 * 60_000;
let catalogCache: { expiresAt: number; payload: CatalogPayload } | null = null;

const isProductListQuery = (query: string) => /\bproducts\s*\(/.test(query);
const isProductHandleQuery = (query: string) =>
  /\bproduct\s*\(\s*handle\s*:/.test(query) || /\bproductByHandle\s*\(/.test(query);
const isAllowedCartOperation = (query: string) => {
  const compact = query.replace(/\s+/g, ' ');
  return [
    /\bcart\s*\(\s*id\s*:/,
    /\bcartCreate\s*\(/,
    /\bcartLinesAdd\s*\(/,
    /\bcartLinesUpdate\s*\(/,
    /\bcartLinesRemove\s*\(/,
  ].some((pattern) => pattern.test(compact));
};

const buildStorefrontHeaders = () => {
  const storefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (storefrontToken) headers['X-Shopify-Storefront-Access-Token'] = storefrontToken;
  return headers;
};

const isStorefrontVariantId = (id: string | undefined): id is string =>
  typeof id === 'string' && /^gid:\/\/shopify\/ProductVariant\/\d+$/.test(id);

const containsInvalidVariantId = (variables: Record<string, unknown> | undefined) => {
  if (!variables) return false;
  return Object.entries(variables)
    .filter(([key]) => key.toLowerCase().includes('variantid') || key.toLowerCase().includes('merchandiseid'))
    .some(([, value]) => typeof value !== 'string' || !isStorefrontVariantId(value));
};

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const fetchWithRetry = async (url: string, init: RequestInit, attempts = 2) => {
  let lastResponse: Response | null = null;
  let lastError: unknown = null;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, init);
      lastResponse = response;
      if (response.ok || (response.status < 500 && response.status !== 429)) return response;
    } catch (error) {
      lastError = error;
    }
    if (attempt < attempts - 1) await wait(300 * (attempt + 1));
  }

  if (lastResponse) return lastResponse;
  throw lastError instanceof Error ? lastError : new Error('Shopify request failed.');
};

const productGridSelection = `
  id
  title
  handle
  description
  createdAt
  productType
  tags
  availableForSale
  featuredImage { url altText }
  images(first: 2) { nodes { url altText } }
  variants(first: 1) {
    nodes {
      id
      title
      availableForSale
      selectedOptions { name value }
    }
  }
  priceRange { minVariantPrice { amount currencyCode } }
`;

const productDetailSelection = `
  id
  title
  handle
  description
  createdAt
  productType
  tags
  availableForSale
  featuredImage { url altText }
  images(first: 12) { nodes { url altText } }
  variants(first: 100) {
    nodes {
      id
      title
      availableForSale
      selectedOptions { name value }
    }
  }
  priceRange { minVariantPrice { amount currencyCode } }
`;

const toClientProduct = (product: StorefrontProduct) => {
  const variants = product.variants?.nodes ?? [];
  const checkoutVariant = variants.find((variant) => variant.availableForSale && isStorefrontVariantId(variant.id)) ?? null;

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description ?? '',
    createdAt: product.createdAt,
    productType: product.productType ?? '',
    tags: product.tags ?? [],
    status: product.availableForSale ? 'ACTIVE' : 'ARCHIVED',
    featuredImage: product.featuredImage?.url
      ? { url: product.featuredImage.url, altText: product.featuredImage.altText ?? undefined }
      : null,
    images: {
      nodes: (product.images?.nodes ?? [])
        .filter((image): image is Required<Pick<ShopifyImage, 'url'>> & ShopifyImage => Boolean(image.url))
        .map((image) => ({ url: image.url, altText: image.altText ?? undefined })),
    },
    variants: { nodes: variants },
    storefrontVariantId: checkoutVariant?.id,
    canCheckout: Boolean(checkoutVariant),
    priceRange: product.priceRange,
  };
};

const storefrontUrl = () => `https://${getShopifyDomain()}/api/${getShopifyApiVersion()}/graphql.json`;

const shopifyRequest = async (query: string, variables: Record<string, unknown> = {}) => {
  const response = await fetchWithRetry(storefrontUrl(), {
    method: 'POST',
    headers: buildStorefrontHeaders(),
    body: JSON.stringify({ query, variables }),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error('[Radiant 34 Shopify] Storefront request failed', {
      status: response.status,
      statusText: response.statusText,
    });
    throw new Error('Shopify storefront request failed.');
  }

  if (payload.errors?.length) {
    if (isDevelopment) console.error('[Radiant 34 Shopify] Storefront GraphQL errors', payload.errors);
    throw new Error('Shopify storefront operation failed.');
  }

  return payload;
};

const fetchCatalog = async (): Promise<CatalogPayload> => {
  if (catalogCache && catalogCache.expiresAt > Date.now()) return catalogCache.payload;

  const payload = await shopifyRequest(`
    query RadiantStorefrontCatalog {
      products(first: 36, sortKey: UPDATED_AT, reverse: true) {
        nodes {
          ${productGridSelection}
        }
      }
    }
  `);

  const products = (payload.data?.products?.nodes ?? []) as StorefrontProduct[];
  const clientPayload: CatalogPayload = {
    data: {
      products: {
        nodes: products.filter((product) => product.availableForSale).map(toClientProduct),
      },
    },
  };

  catalogCache = {
    expiresAt: Date.now() + catalogCacheTtlMs,
    payload: clientPayload,
  };

  return clientPayload;
};

const fetchProductByHandle = async (handle: string) => {
  const payload = await shopifyRequest(`
    query RadiantStorefrontProduct($handle: String!) {
      product(handle: $handle) {
        ${productDetailSelection}
      }
    }
  `, { handle });

  const product = payload.data?.product as StorefrontProduct | null | undefined;
  return {
    data: {
      product: product ? toClientProduct(product) : null,
    },
  };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const contentType = String(req.headers?.['content-type'] ?? '');
  if (contentType && !contentType.toLowerCase().includes('application/json')) {
    return res.status(415).json({ errors: [{ message: 'Content-Type must be application/json.' }] });
  }

  const contentLength = Number(req.headers?.['content-length'] ?? 0);
  if (contentLength > 20_000) return res.status(413).json({ errors: [{ message: 'Request body is too large.' }] });

  let body: StorefrontRequestBody;
  try {
    body = (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body ?? {}) as StorefrontRequestBody;
  } catch {
    return res.status(400).json({ errors: [{ message: 'Invalid JSON body.' }] });
  }

  if (!body.query || typeof body.query !== 'string') {
    return res.status(400).json({ errors: [{ message: 'GraphQL query is required.' }] });
  }

  try {
    if (isProductListQuery(body.query)) {
      res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600');
      return res.status(200).json(await fetchCatalog());
    }

    if (isProductHandleQuery(body.query) && typeof body.variables?.handle === 'string') {
      res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600');
      return res.status(200).json(await fetchProductByHandle(body.variables.handle));
    }

    if (!isAllowedCartOperation(body.query)) {
      return res.status(400).json({ errors: [{ message: 'Unsupported Shopify operation.' }] });
    }

    if (containsInvalidVariantId(body.variables)) {
      return res.status(400).json({ errors: [{ message: 'Invalid product variant.' }] });
    }

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(await shopifyRequest(body.query, body.variables ?? {}));
  } catch (error) {
    console.error('[Radiant 34 Shopify] Storefront proxy error', {
      message: error instanceof Error ? error.message : error,
    });

    return res.status(500).json({
      errors: [{ message: 'Shopify storefront proxy unavailable.' }],
    });
  }
}
