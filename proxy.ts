import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAllowed, SUPABASE_KEY, SUPABASE_URL } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const login = NextResponse.redirect(new URL("/login", request.url));
  if (!SUPABASE_URL || !SUPABASE_KEY) return login; // not configured: stay locked

  // Supabase may refresh the session while checking it, so its new cookies go on the response.
  const response = NextResponse.next({ request });
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list, headers) => {
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });
  const { data } = await supabase.auth.getUser();
  return isAllowed(data.user?.email) ? response : login;
}

export const config = { matcher: ["/dashboard", "/dashboard/:path*"] };
