export const SESSION_COOKIE = "fr_session";

/** What the session cookie must hold. Null when no password is configured, which keeps the dashboard locked. */
export async function sessionToken() {
  const password = process.env.DASHBOARD_PASSWORD;
  if (!password) return null;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`founders-radar:${password}`));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
