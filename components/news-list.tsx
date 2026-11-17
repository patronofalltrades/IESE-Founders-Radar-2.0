"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Headline } from "@/lib/data";
import { day, fold } from "@/lib/format";
import { Ext, Paged, Search } from "@/components/listing";

export function NewsList({ headlines }: { headlines: Headline[] }) {
  const [q, setQ] = useState("");
  const index = useMemo(() => headlines.map((h) => fold([h.title, h.publisher, h.startup].join(" "))), [headlines]);
  const needle = fold(q.trim());
  const rows = headlines.filter((_, i) => index[i].includes(needle));

  return (
    <>
      <div className="flex">
        <Search value={q} onChange={setQ} />
      </div>
      <Paged key={needle} rows={rows} total={headlines.length} className="divide-y divide-border rounded-lg border border-border">
        {(h) => (
          <div key={h.startup + h.url} className="grid gap-x-4 gap-y-0.5 px-4 py-3 text-sm sm:grid-cols-[6.5rem_minmax(0,1fr)]">
            <span className="text-muted-foreground tabular-nums">{day(h.date)}</span>
            <div className="min-w-0 [overflow-wrap:anywhere]">
              <Ext href={h.url}>{h.title}</Ext>
              <div className="text-muted-foreground">
                {h.publisher && `${h.publisher} · `}
                <Link href={`/startups?q=${encodeURIComponent(h.startup)}`} className="underline underline-offset-2">
                  {h.startup}
                </Link>
              </div>
            </div>
          </div>
        )}
      </Paged>
    </>
  );
}
