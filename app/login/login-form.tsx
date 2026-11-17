"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { isAllowed, SUPABASE_KEY, SUPABASE_URL } from "@/lib/auth";

const ERRORS: Record<string, string> = {
  domain: "Use your @iese.net account.",
  failed: "That sign-in did not complete. Try again.",
};
const field = "h-10 rounded-md border border-border bg-background px-3";

export function LoginForm() {
  const [message, setMessage] = useState(ERRORS[useSearchParams().get("error") ?? ""] ?? "");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function run(start: (supabase: ReturnType<typeof createBrowserClient>, redirectTo: string) => Promise<{ error: unknown }>) {
    if (!SUPABASE_URL || !SUPABASE_KEY) return setMessage("Login is not set up yet.");
    setBusy(true);
    setMessage("");
    const { error } = await start(createBrowserClient(SUPABASE_URL, SUPABASE_KEY), `${location.origin}/auth/callback`);
    setBusy(false);
    if (error) setMessage(ERRORS.failed);
    return !error;
  }

  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <div className="flex w-full max-w-xs flex-col gap-4">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Log in</h1>
        <button
          type="button"
          disabled={busy}
          onClick={() => run((supabase, redirectTo) => supabase.auth.signInWithOAuth({ provider: "azure", options: { scopes: "email", redirectTo } }))}
          className={`${field} bg-primary font-medium text-primary-foreground disabled:opacity-60`}
        >
          Sign in with Microsoft
        </button>
        <form
          className="flex flex-col gap-2"
          onSubmit={async (event) => {
            event.preventDefault();
            const email = String(new FormData(event.currentTarget).get("email")).trim();
            if (!isAllowed(email)) return setMessage(ERRORS.domain);
            if (await run((supabase, emailRedirectTo) => supabase.auth.signInWithOtp({ email, options: { emailRedirectTo } }))) setSent(true);
          }}
        >
          <label htmlFor="email" className="text-sm">
            IESE email
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className={field} />
          <button type="submit" disabled={busy} className={`${field} font-medium disabled:opacity-60`}>
            Email me a link
          </button>
        </form>
        <p role="status" className="min-h-5 text-sm">
          {sent ? "Check your inbox and open the link in this browser." : ""}
        </p>
        {message && (
          <p role="alert" className="text-sm text-destructive">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
