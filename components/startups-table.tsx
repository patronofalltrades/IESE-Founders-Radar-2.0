"use client";

import { useState } from "react";
import { crunchbase, day, eur } from "@/lib/format";

export type StartupRow = { id: string; n: string; d: string; y?: number; r?: number; lf?: string };

const SORTS = {
  updated: "Recently updated",
  raised: "Most raised",
  round: "Latest round",
  newest: "Newest",
  name: "A–Z",
} as const;
type Sort = keyof typeof SORTS;

const PAGE = 100;
const fold = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const control = "h-9 rounded-md border border-border bg-background px-3 text-sm";

export function StartupsTable({ rows }: { rows: StartupRow[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("updated");
  const [shown, setShown] = useState(PAGE);

  const q = fold(query.trim());
  let list = q ? rows.filter((s) => fold(`${s.n} ${s.d}`).includes(q)) : rows;
  if (sort === "name") list = [...list].sort((a, b) => a.n.localeCompare(b.n));
  if (sort === "raised") list = list.filter((s) => s.r).sort((a, b) => b.r! - a.r!);
  if (sort === "round") list = list.filter((s) => s.lf).sort((a, b) => (a.lf! < b.lf! ? 1 : -1));
  if (sort === "newest") list = list.filter((s) => s.y).sort((a, b) => b.y! - a.y!);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <input
          id="startup-search"
          type="search"
          aria-label="Search startups"
          placeholder="Search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setShown(PAGE);
          }}
          className={`${control} min-w-0 flex-1 basis-48`}
        />
        <select
          id="startup-sort"
          aria-label="Sort"
          value={sort}
          onChange={(event) => {
            setSort(event.target.value as Sort);
            setShown(PAGE);
          }}
          className={control}
        >
          {Object.entries(SORTS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <span aria-live="polite" className="ml-auto text-sm tabular-nums text-muted-foreground">
          {list.length.toLocaleString("en")} of {rows.length.toLocaleString("en")}
        </span>
      </div>

      <table className="w-full table-fixed border-collapse text-sm">
        <thead className="text-left text-xs text-muted-foreground">
          <tr className="border-b border-border">
            <th className="py-2 pr-4 font-medium">Startup</th>
            <th className="hidden w-20 py-2 pr-4 text-right font-medium sm:table-cell">Founded</th>
            <th className="w-24 py-2 pr-4 text-right font-medium">Raised</th>
            <th className="hidden w-28 py-2 text-right font-medium md:table-cell">Last round</th>
          </tr>
        </thead>
        <tbody>
          {list.slice(0, shown).map((s) => (
            <tr key={s.id} className="border-b border-border align-baseline">
              <td className="py-3 pr-4">
                <a
                  href={crunchbase("organization", s.id)}
                  target="_blank"
                  rel="noopener"
                  className="font-medium underline-offset-4 hover:underline"
                >
                  {s.n}
                </a>
                <p className="truncate text-muted-foreground">{s.d}</p>
              </td>
              <td className="hidden py-3 pr-4 text-right tabular-nums text-muted-foreground sm:table-cell">{s.y}</td>
              <td className="py-3 pr-4 text-right font-medium tabular-nums">{s.r ? eur(s.r) : ""}</td>
              <td className="hidden py-3 text-right tabular-nums text-muted-foreground md:table-cell">{day(s.lf)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {list.length === 0 && <p className="text-muted-foreground">Nothing matches.</p>}
      {list.length > shown && (
        <button type="button" onClick={() => setShown(shown + PAGE)} className={`${control} self-center`}>
          Show more
        </button>
      )}
    </div>
  );
}
