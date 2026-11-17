import type { Metadata } from "next";
import { FounderList } from "@/components/founder-list";
import { founders } from "@/lib/data";

export const metadata: Metadata = { title: "Founders · Founders Radar" };

export default function Founders() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-8">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">Founders</h1>
      <FounderList founders={founders} />
    </main>
  );
}
