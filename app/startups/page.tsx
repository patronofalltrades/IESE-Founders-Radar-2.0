import type { Metadata } from "next";
import { Suspense } from "react";
import { StartupList } from "@/components/startup-list";
import { confirmed, startups } from "@/lib/data";

export const metadata: Metadata = { title: "Startups · Founders Radar" };

export default function Startups() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-8">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">Startups</h1>
      <Suspense>
        <StartupList startups={startups} confirmed={confirmed} />
      </Suspense>
    </main>
  );
}
