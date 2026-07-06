// Shopify Storefront API — placeholder until env vars are configured.
// Set VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env

const domain  = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN as string | undefined;
const token   = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN as string | undefined;
const version = (import.meta.env.VITE_SHOPIFY_API_VERSION as string | undefined) ?? '2025-10';

export const shopifyConfigured = Boolean(domain && token);

export async function shopifyFetch<T = unknown>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!shopifyConfigured) {
    throw new Error('Shopify env vars not configured. Set VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN.');
  }
  const url = `https://${domain}/api/${version}/graphql.json`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token!,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Shopify fetch failed: ${res.status} ${res.statusText}`);
  const json = await res.json() as { data: T; errors?: unknown[] };
  if (json.errors?.length) throw new Error(`Shopify GraphQL error: ${JSON.stringify(json.errors)}`);
  return json.data;
}
