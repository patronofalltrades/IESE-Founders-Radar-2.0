import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAllowed } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase-server";

/** Microsoft and emailed links both land here with a one-time code to swap for a session. */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const supabase = await supabaseServer();
  const { data, error } = code ? await supabase.auth.exchangeCodeForSession(code) : { data: null, error: true };
  if (error || !data) return NextResponse.redirect(new URL("/login?error=failed", request.url));
  if (!isAllowed(data.user.email)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/login?error=domain", request.url));
  }
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
