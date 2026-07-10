export const shopifyConfigured = true;
export const shopifyDomainLoaded = true;
export const shopifyTokenExists = false;

type ProxyResponse<T> = {
  data?: T;
  errors?: Array<{ message?: string }>;
};

const shopifyCheckoutDomain = 'xagsqp-u0.myshopify.com';

type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
};

function normalizeCheckoutUrl(checkoutUrl: string) {
  try {
    const url = new URL(checkoutUrl);
    const hostedDomains = new Set(['radiant34.com', 'www.radiant34.com']);
    if (hostedDomains.has(url.hostname) && url.pathname.startsWith('/cart/')) {
      url.hostname = shopifyCheckoutDomain;
      url.protocol = 'https:';
    }
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

function storeCart(cart: ShopifyCart) {
  const normalizedCart = {
    ...cart,
    checkoutUrl: normalizeCheckoutUrl(cart.checkoutUrl),
  };

  localStorage.setItem('radiant34CartId', normalizedCart.id);
  localStorage.setItem('radiant34CheckoutUrl', normalizedCart.checkoutUrl);
  return normalizedCart;
}

export function logShopifyDebug(message: string, detail?: unknown) {
  if (!import.meta.env.DEV) return;
  if (detail === undefined) {
    console.info(`[Radiant 34 Shopify] ${message}`);
    return;
  }
  console.info(`[Radiant 34 Shopify] ${message}`, detail);
}

export async function checkShopifyProxy() {
  if (!import.meta.env.DEV) return;

  try {
    const response = await fetch('/api/shopify-token');
    const body = await response.json().catch(() => ({}));
    logShopifyDebug('Proxy token route status', {
      ok: response.ok,
      domainLoaded: body.domainLoaded,
      clientIdExists: body.clientIdExists,
      clientSecretExists: body.clientSecretExists,
      configured: body.configured,
      tokenCached: body.tokenCached,
    });
  } catch (error) {
    logShopifyDebug('Proxy token route failed', error instanceof Error ? error.message : error);
  }
}

export async function shopifyFetch<T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const response = await fetch('/api/shopify-storefront', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json().catch(() => ({})) as ProxyResponse<T>;

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message ?? `Shopify proxy failed: ${response.status}`);
  }

  if (json.errors?.length) {
    throw new Error(`Shopify GraphQL error: ${JSON.stringify(json.errors)}`);
  }

  if (!json.data) {
    throw new Error('Shopify proxy returned no data.');
  }

  return json.data;
}

export async function createCart(variantId: string, quantity = 1) {
  const mutation = `
    mutation CreateRadiantCart($variantId: ID!, $quantity: Int!) {
      cartCreate(input: { lines: [{ merchandiseId: $variantId, quantity: $quantity }] }) {
        cart {
          id
          checkoutUrl
          totalQuantity
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    cartCreate: {
      cart?: ShopifyCart;
      userErrors: Array<{ field?: string[]; message: string }>;
    };
  }>(mutation, { variantId, quantity });

  if (data.cartCreate.userErrors.length || !data.cartCreate.cart) {
    throw new Error(data.cartCreate.userErrors[0]?.message ?? 'Unable to create cart.');
  }

  return storeCart(data.cartCreate.cart);
}

export async function addToExistingCart(cartId: string, variantId: string, quantity = 1) {
  const mutation = `
    mutation AddRadiantCartLine($cartId: ID!, $variantId: ID!, $quantity: Int!) {
      cartLinesAdd(cartId: $cartId, lines: [{ merchandiseId: $variantId, quantity: $quantity }]) {
        cart {
          id
          checkoutUrl
          totalQuantity
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    cartLinesAdd: {
      cart?: ShopifyCart;
      userErrors: Array<{ field?: string[]; message: string }>;
    };
  }>(mutation, { cartId, variantId, quantity });

  if (data.cartLinesAdd.userErrors.length || !data.cartLinesAdd.cart) {
    throw new Error(data.cartLinesAdd.userErrors[0]?.message ?? 'Unable to update cart.');
  }

  return storeCart(data.cartLinesAdd.cart);
}

export async function addVariantToCart(variantId: string, quantity = 1) {
  const cartId = localStorage.getItem('radiant34CartId');

  if (!cartId) return createCart(variantId, quantity);

  try {
    return await addToExistingCart(cartId, variantId, quantity);
  } catch {
    return createCart(variantId, quantity);
  }
}
