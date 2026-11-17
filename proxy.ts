import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, sessionToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const token = await sessionToken();
  if (token && request.cookies.get(SESSION_COOKIE)?.value === token) return NextResponse.next();
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = { matcher: ["/dashboard", "/dashboard/:path*"] };
