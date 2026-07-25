/// <reference types="node" />

export type AuthenticatedCustomer = {
  id: string;
  email: string;
  name: string;
  provider?: string;
};

const supabaseUrl = () => process.env.SUPABASE_URL?.replace(/\/$/, '') ?? '';
const serviceKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

export const customerAuthConfigured = () => Boolean(supabaseUrl() && serviceKey());

const bearerToken = (req: any) => {
  const header = String(req.headers?.authorization ?? '');
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() ?? '';
};

const displayName = (user: any) => {
  const metadata = user?.user_metadata ?? {};
  return String(
    metadata.full_name
      ?? metadata.name
      ?? metadata.display_name
      ?? user?.email?.split('@')[0]
      ?? 'Radiant 34 customer',
  ).trim();
};

export async function getAuthenticatedCustomer(req: any): Promise<AuthenticatedCustomer | null> {
  if (!customerAuthConfigured()) return null;
  const token = bearerToken(req);
  if (!token) return null;

  const response = await fetch(`${supabaseUrl()}/auth/v1/user`, {
    method: 'GET',
    headers: {
      apikey: serviceKey(),
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  const user = await response.json().catch(() => null);
  if (!response.ok || !user?.id || !user?.email) return null;

  return {
    id: String(user.id),
    email: String(user.email).trim().toLowerCase(),
    name: displayName(user),
    provider: String(user.app_metadata?.provider ?? ''),
  };
}

export async function refreshCustomerSession(refreshToken: string) {
  if (!customerAuthConfigured() || !refreshToken) return null;

  const response = await fetch(`${supabaseUrl()}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: {
      apikey: serviceKey(),
      Authorization: `Bearer ${serviceKey()}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.access_token) return null;
  return body;
}
