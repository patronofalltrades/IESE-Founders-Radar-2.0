"use client";

import { useActionState } from "react";
import { login } from "./actions";

const field = "h-10 rounded-md border border-border bg-background px-3";

export default function LoginPage() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <form action={action} className="flex w-full max-w-xs flex-col gap-4">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Log in</h1>
        <label className="flex flex-col gap-1.5 text-sm">
          Password
          <input id="password" name="password" type="password" required autoFocus autoComplete="current-password" className={field} />
        </label>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <button type="submit" disabled={pending} className={`${field} bg-primary font-medium text-primary-foreground disabled:opacity-60`}>
          Log in
        </button>
      </form>
    </main>
  );
}
