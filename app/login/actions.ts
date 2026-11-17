"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, sessionToken } from "@/lib/auth";

export async function login(_previous: string | null, formData: FormData) {
  const token = await sessionToken();
  if (!token) return "Login is not set up yet. Set DASHBOARD_PASSWORD on the server.";
  if (formData.get("password") !== process.env.DASHBOARD_PASSWORD) return "That password is not right.";
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/dashboard");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/");
}
