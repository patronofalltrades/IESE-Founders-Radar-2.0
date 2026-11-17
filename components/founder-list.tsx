"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Founder } from "@/lib/data";
import { crunchbase, fold } from "@/lib/format";
import { Ext, Paged, Search } from "@/components/listing";

export function FounderList({ founders }: { founders: Founder[] }) {
  const [q, setQ] = useState("");
  const index = useMemo(() => founders.map((p) => fold([p.n, p.c, p.ro, p.p].join(" "))), [founders]);
  const needle = fold(q.trim());
  const rows = founders.filter((_, i) => index[i].includes(needle));

  return (
    <>
      <div className="flex">
        <Search value={q} onChange={setQ} />
      </div>
      <Paged key={needle} rows={rows} total={founders.length} className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-px overflow-hidden rounded-lg border border-border bg-border">
        {(p) => (
          <div key={p.id} className="min-w-0 bg-background px-4 py-3 text-sm [overflow-wrap:anywhere]">
            <div className="text-base font-medium">
              <Ext href={crunchbase("person", p.id)}>{p.n}</Ext>
            </div>
            {p.c && (
              <div>
                {p.in ? (
                  <Link href={`/startups?q=${encodeURIComponent(p.c)}`} className="underline underline-offset-2">
                    {p.c}
                  </Link>
                ) : (
                  p.c
                )}
              </div>
            )}
            {p.ro && <div className="text-muted-foreground">{p.ro}</div>}
            {p.p && <div className="text-muted-foreground">{p.p}</div>}
            {(p.li || p.x) && (
              <div className="mt-1 flex gap-3">
                {p.li && <Ext href={p.li}>LinkedIn</Ext>}
                {p.x && <Ext href={p.x}>X</Ext>}
              </div>
            )}
          </div>
        )}
      </Paged>
    </>
  );
}
