export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

const ALLOWED_DOMAIN = "@iese.net";

/** Only signed-in people with an IESE address may see the dashboard. */
export const isAllowed = (email?: string | null) => !!email && email.toLowerCase().endsWith(ALLOWED_DOMAIN);
