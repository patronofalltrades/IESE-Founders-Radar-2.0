import type { Metadata } from "next";
import { NewsList } from "@/components/news-list";
import { startups, type Headline } from "@/lib/data";

export const metadata: Metadata = { title: "News · Founders Radar" };

const headlines: Headline[] = startups
  .flatMap((s) => (s.h ?? []).map(([title, publisher, date, url]) => ({ title, publisher, date, url, startup: s.n })))
  .sort((a, b) => b.date.localeCompare(a.date));

export default function News() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-8">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">News</h1>
      <NewsList headlines={headlines} />
    </main>
  );
}
