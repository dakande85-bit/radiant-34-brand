import {
  getShopifyAccessToken,
  getShopifyApiVersion,
  getShopifyDomain,
} from './_shopifyAuth.js';

type StorefrontRequestBody = {
  query?: string;
  variables?: Record<string, unknown>;
};

type AdminImage = {
  url?: string;
  altText?: string | null;
};

type AdminVariant = {
  id: string;
  title?: string;
  availableForSale?: boolean;
  selectedOptions?: Array<{ name: string; value: string }>;
};

type AdminProduct = {
  id: string;
  title: string;
  handle: string;
  description?: string;
  createdAt?: string;
  productType?: string;
  tags?: string[];
  status?: string;
  featuredMedia?: { preview?: { image?: AdminImage | null } | null } | null;
  media?: { nodes?: Array<{ preview?: { image?: AdminImage | null } | null }> };
  variants?: { nodes?: AdminVariant[] };
  priceRangeV2?: { minVariantPrice?: { amount: string; currencyCode: string } };
};

type StorefrontProductForCart = {
  id: string;
  title: string;
  handle: string;
  availableForSale: boolean;
  variants?: {
    nodes?: Array<{
      id: string;
      title: string;
      availableForSale: boolean;
      selectedOptions?: Array<{ name: string; value: string }>;
    }>;
  };
};

type CatalogProduct = ReturnType<typeof toStorefrontProduct>;

type CatalogPayload = {
  data: {
    products: {
      nodes: CatalogProduct[];
    };
  };
};

const isDevelopment = process.env.NODE_ENV !== 'production';
const catalogCacheTtlMs = 60_000;
const productCacheTtlMs = 5 * 60_000;
const shopifyRequestTimeoutMs = 8_000;
let catalogCache: { expiresAt: number; payload: CatalogPayload } | null = null;
const productCache = new Map<string, { expiresAt: number; product: CatalogProduct }>();

const isProductListQuery = (query: string) => /\bproducts\s*\(/.test(query);
const isProductHandleQuery = (query: string) =>
  /\bproduct\s*\(\s*handle\s*:/.test(query) || /\bproductByHandle\s*\(/.test(query);

const buildStorefrontHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const storefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (storefrontToken) headers['X-Shopify-Storefront-Access-Token'] = storefrontToken;
  return headers;
};

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const fetchWithRetry = async (url: string, init: RequestInit, attempts = 2) => {
  let lastResponse: Response | null = null;
  let lastError: unknown = null;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), shopifyRequestTimeoutMs);

    try {
      const response = await fetch(url, { ...init, signal: controller.signal });
      lastResponse = response;
      if (response.ok || (response.status < 500 && response.status !== 429)) return response;
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timeoutId);
    }

    if (attempt < attempts - 1) await wait(300 * (attempt + 1));
  }

  if (lastResponse) return lastResponse;
  throw lastError instanceof Error ? lastError : new Error('Shopify request failed.');
};

const adminProductSelection = `
  id
  title
  handle
  description
  createdAt
  productType
  tags
  status
  featuredMedia { preview { image { url altText } } }
  media(first: 8) { nodes { preview { image { url altText } } } }
  variants(first: 100) {
    nodes {
      id
      title
      availableForSale
      selectedOptions { name value }
    }
  }
  priceRangeV2 { minVariantPrice { amount currencyCode } }
`;

const storefrontProductSelection = `
  id
  title
  handle
  availableForSale
  variants(first: 100) {
    nodes {
      id
      title
      availableForSale
      selectedOptions { name value }
    }
  }
`;

const fetchStorefrontProductsForCart = async (domain: string, version: string) => {
  const response = await fetchWithRetry(`https://${domain}/api/${version}/graphql.json`, {
    method: 'POST',
    headers: buildStorefrontHeaders(),
    body: JSON.stringify({
      query: `
        query RadiantStorefrontProducts {
          products(first: 100) {
            nodes {
              ${storefrontProductSelection}
            }
          }
        }
      `,
      variables: {},
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.errors?.length) {
    console.error('[Radiant 34 Shopify] Storefront product validation failed', {
      status: response.status,
      errors: payload.errors,
    });
    return new Map<string, StorefrontProductForCart>();
  }

  const products = (payload.data?.products?.nodes ?? []) as StorefrontProductForCart[];
  return new Map(products.map((product) => [product.handle, product]));
};

const toStorefrontProduct = (
  product: AdminProduct,
  storefrontProduct: StorefrontProductForCart | null = null,
) => {
  const featuredImage = product.featuredMedia?.preview?.image ?? null;
  const images = product.media?.nodes
    ?.map((node) => node.preview?.image)
    .filter((image): image is AdminImage => Boolean(image?.url)) ?? [];

  const adminVariants = product.variants?.nodes ?? [];
  const adminVariant = adminVariants.find((variant) => variant.availableForSale) ?? adminVariants[0] ?? null;
  const storefrontVariants = storefrontProduct?.variants?.nodes ?? [];
  const storefrontVariant = storefrontVariants.find((variant) => variant.availableForSale) ?? null;
  const checkoutVariant = storefrontVariant ?? (adminVariant?.availableForSale ? adminVariant : null);

  const displayVariants = storefrontVariants.length
    ? storefrontVariants
    : adminVariants.map((variant) => ({
      id: variant.id,
      title: variant.title ?? 'Default Title',
      availableForSale: Boolean(variant.availableForSale),
      selectedOptions: variant.selectedOptions ?? [],
    }));

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description ?? '',
    createdAt: product.createdAt,
    productType: product.productType ?? '',
    tags: product.tags ?? [],
    status: product.status ?? 'ACTIVE',
    featuredImage: featuredImage?.url
      ? { url: featuredImage.url, altText: featuredImage.altText ?? undefined }
      : null,
    images: {
      nodes: images.map((image) => ({
        url: image.url,
        altText: image.altText ?? undefined,
      })),
    },
    variants: { nodes: displayVariants },
    adminVariantId: adminVariant?.id,
    storefrontVariantId: checkoutVariant?.id,
    canCheckout: Boolean(checkoutVariant),
    priceRange: {
      minVariantPrice: product.priceRangeV2?.minVariantPrice,
    },
  };
};

const fetchAdminProductNodes = async (domain: string, version: string) => {
  const token = await getShopifyAccessToken();
  const adminUrl = `https://${domain}/admin/api/${version}/graphql.json`;
  const response = await fetchWithRetry(adminUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Shopify-Access-Token': token.accessToken,
    },
    body: JSON.stringify({
      query: `
        query RadiantAdminProducts {
          products(first: 50, query: "status:active", sortKey: UPDATED_AT, reverse: true) {
            nodes {
              ${adminProductSelection}
            }
          }
        }
      `,
      variables: {},
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.errors?.length) {
    console.error('[Radiant 34 Shopify] Admin products request failed', {
      status: response.status,
      errors: payload.errors,
    });
    throw new Error(`Shopify Admin products request failed: ${response.status}`);
  }

  return (payload.data?.products?.nodes ?? []) as AdminProduct[];
};

async function fetchAdminProducts(domain: string, version: string): Promise<CatalogPayload> {
  if (catalogCache && catalogCache.expiresAt > Date.now()) return catalogCache.payload;

  const [products, storefrontProducts] = await Promise.all([
    fetchAdminProductNodes(domain, version),
    fetchStorefrontProductsForCart(domain, version).catch((error) => {
      console.error('[Radiant 34 Shopify] Storefront catalogue validation skipped', {
        message: error instanceof Error ? error.message : error,
      });
      return new Map<string, StorefrontProductForCart>();
    }),
  ]);

  const activeProducts = products.filter((product) => product.status === 'ACTIVE');
  const payload: CatalogPayload = {
    data: {
      products: {
        nodes: activeProducts.map((product) =>
          toStorefrontProduct(product, storefrontProducts.get(product.handle) ?? null)),
      },
    },
  };

  catalogCache = {
    expiresAt: Date.now() + catalogCacheTtlMs,
    payload,
  };

  for (const product of payload.data.products.nodes) {
    productCache.set(product.handle, {
      expiresAt: Date.now() + productCacheTtlMs,
      product,
    });
  }

  return payload;
}

async function fetchAdminProductByHandle(domain: string, version: string, handle: string) {
  const cachedProduct = productCache.get(handle);
  if (cachedProduct && cachedProduct.expiresAt > Date.now()) {
    return { data: { product: cachedProduct.product } };
  }

  const catalogProduct = catalogCache?.payload.data.products.nodes.find((product) => product.handle === handle);
  if (catalogProduct && catalogCache && catalogCache.expiresAt > Date.now()) {
    return { data: { product: catalogProduct } };
  }

  const token = await getShopifyAccessToken();
  const adminUrl = `https://${domain}/admin/api/${version}/graphql.json`;
  const response = await fetchWithRetry(adminUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Shopify-Access-Token': token.accessToken,
    },
    body: JSON.stringify({
      query: `
        query RadiantAdminProductByIdentifier($identifier: ProductIdentifierInput!) {
          product: productByIdentifier(identifier: $identifier) {
            ${adminProductSelection}
          }
        }
      `,
      variables: { identifier: { handle } },
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.errors?.length) {
    console.error('[Radiant 34 Shopify] Admin product handle request failed', {
      status: response.status,
      errors: payload.errors,
    });
    throw new Error(`Shopify Admin product request failed: ${response.status}`);
  }

  const product = payload.data?.product as AdminProduct | null | undefined;
  const mappedProduct = product ? toStorefrontProduct(product, null) : null;

  if (mappedProduct) {
    productCache.set(handle, {
      expiresAt: Date.now() + productCacheTtlMs,
      product: mappedProduct,
    });
  }

  return {
    data: {
      product: mappedProduct,
    },
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = (
    typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body
  ) as StorefrontRequestBody;

  if (!body.query || typeof body.query !== 'string') {
    return res.status(400).json({ error: 'GraphQL query is required.' });
  }

  try {
    const domain = getShopifyDomain();
    const version = getShopifyApiVersion();

    if (isProductListQuery(body.query)) {
      const payload = await fetchAdminProducts(domain, version);
      if (isDevelopment) {
        console.info(
          '[Radiant 34 Shopify] Active Admin product count returned',
          payload.data.products.nodes.length,
        );
      }
      return res.status(200).json(payload);
    }

    if (isProductHandleQuery(body.query) && typeof body.variables?.handle === 'string') {
      const payload = await fetchAdminProductByHandle(domain, version, body.variables.handle);
      return res.status(200).json(payload);
    }

    const storefrontUrl = `https://${domain}/api/${version}/graphql.json`;
    const shopifyResponse = await fetchWithRetry(storefrontUrl, {
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
