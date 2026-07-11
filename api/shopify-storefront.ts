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

type AdminProduct = {
  id: string;
  title: string;
  handle: string;
  description?: string;
  createdAt?: string;
  productType?: string;
  tags?: string[];
  featuredMedia?: { preview?: { image?: AdminImage | null } | null } | null;
  media?: { nodes?: Array<{ preview?: { image?: AdminImage | null } | null }> };
  variants?: {
    nodes?: Array<{
      id: string;
      availableForSale?: boolean;
      selectedOptions?: Array<{ name: string; value: string }>;
    }>;
  };
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

const isDevelopment = process.env.NODE_ENV !== 'production';

const isProductListQuery = (query: string) =>
  /\bproducts\s*\(/.test(query);

const isProductHandleQuery = (query: string) =>
  /\bproduct\s*\(\s*handle\s*:/.test(query) || /\bproductByHandle\s*\(/.test(query);

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

const adminProductSelection = `
  id
  title
  handle
  description
  createdAt
  productType
  tags
  featuredMedia { preview { image { url altText } } }
  media(first: 4) { nodes { preview { image { url altText } } } }
  variants(first: 20) { nodes { id availableForSale selectedOptions { name value } } }
  priceRangeV2 { minVariantPrice { amount currencyCode } }
`;

const fetchStorefrontProductForCart = async (domain: string, version: string, handle: string) => {
  const response = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: 'POST',
    headers: buildStorefrontHeaders(),
    body: JSON.stringify({
      query: `
        query ProductForCart($handle: String!) {
          product(handle: $handle) {
            id
            title
            handle
            availableForSale
            variants(first: 20) {
              nodes {
                id
                title
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      `,
      variables: { handle },
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.errors?.length) {
    if (isDevelopment) {
      console.info('[Radiant 34 Shopify] Storefront cart validation failed', {
        handle,
        status: response.status,
        errors: payload.errors,
      });
    }
    return null;
  }

  return (payload.data?.product ?? null) as StorefrontProductForCart | null;
};

const toStorefrontProduct = (product: AdminProduct, storefrontProduct: StorefrontProductForCart | null = null) => {
  const featuredImage = product.featuredMedia?.preview?.image ?? null;
  const images = product.media?.nodes
    ?.map((node) => node.preview?.image)
    .filter((image): image is AdminImage => Boolean(image?.url)) ?? [];
  const adminVariant = product.variants?.nodes?.find((variant) => variant.availableForSale) ?? product.variants?.nodes?.[0] ?? null;
  const storefrontVariants = storefrontProduct?.availableForSale
    ? storefrontProduct.variants?.nodes ?? []
    : [];
  const storefrontVariant = storefrontVariants.find((variant) => variant.availableForSale) ?? null;

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description ?? '',
    createdAt: product.createdAt,
    productType: product.productType ?? '',
    tags: product.tags ?? [],
    featuredImage: featuredImage?.url ? { url: featuredImage.url, altText: featuredImage.altText ?? undefined } : null,
    images: {
      nodes: images.map((image) => ({ url: image.url, altText: image.altText ?? undefined })),
    },
    variants: {
      nodes: storefrontVariants.map((variant) => ({
        id: variant.id,
        title: variant.title,
        availableForSale: variant.availableForSale,
        selectedOptions: variant.selectedOptions ?? [],
      })),
    },
    adminVariantId: adminVariant?.id,
    storefrontVariantId: storefrontVariant?.id,
    canCheckout: Boolean(storefrontVariant),
    priceRange: {
      minVariantPrice: product.priceRangeV2?.minVariantPrice,
    },
  };
};

async function fetchAdminProducts(domain: string, version: string) {
  const token = await getShopifyAccessToken();
  const adminUrl = `https://${domain}/admin/api/${version}/graphql.json`;
  const response = await fetch(adminUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Shopify-Access-Token': token.accessToken,
    },
    body: JSON.stringify({
      query: `
        query RadiantAdminProducts {
          products(first: 24) {
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

  const products = (payload.data?.products?.nodes ?? []) as AdminProduct[];
  const storefrontProducts = await Promise.all(
    products.map((product) => fetchStorefrontProductForCart(domain, version, product.handle)),
  );

  return {
    data: {
      products: {
        nodes: products.map((product, index) => toStorefrontProduct(product, storefrontProducts[index])),
      },
    },
  };
}

async function fetchAdminProductByHandle(domain: string, version: string, handle: string) {
  const token = await getShopifyAccessToken();
  const adminUrl = `https://${domain}/admin/api/${version}/graphql.json`;
  const response = await fetch(adminUrl, {
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
  const storefrontProduct = product
    ? await fetchStorefrontProductForCart(domain, version, product.handle)
    : null;

  return {
    data: {
      product: product ? toStorefrontProduct(product, storefrontProduct) : null,
    },
  };
}

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

    if (isProductListQuery(body.query)) {
      const payload = await fetchAdminProducts(domain, version);
      if (isDevelopment) {
        console.info('[Radiant 34 Shopify] Admin product count returned', payload.data.products.nodes.length);
      }
      return res.status(200).json(payload);
    }

    if (isProductHandleQuery(body.query) && typeof body.variables?.handle === 'string') {
      const payload = await fetchAdminProductByHandle(domain, version, body.variables.handle);
      return res.status(200).json(payload);
    }

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
