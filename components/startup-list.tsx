"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Startup } from "@/lib/data";
import { crunchbase, day, eur, fold } from "@/lib/format";
import { Ext, Paged, Search } from "@/components/listing";

const sorts: Record<string, [string, (a: Startup, b: Startup) => number]> = {
  r: ["Most raised", (a, b) => (b.r ?? 0) - (a.r ?? 0)],
  lf: ["Latest round", (a, b) => (b.lf ?? "").localeCompare(a.lf ?? "")],
  y: ["Newest", (a, b) => (b.y ?? 0) - (a.y ?? 0)],
  o: ["Oldest", (a, b) => (a.y ?? 9999) - (b.y ?? 9999)],
  n: ["A–Z", (a, b) => a.n.localeCompare(b.n)],
};

const chip =
  "h-9 rounded-md border border-input px-3 text-sm aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground";

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <h2 className="mb-1.5 text-xs font-semibold text-muted-foreground">{title}</h2>
      <ul className="grid gap-2 text-sm [overflow-wrap:anywhere]">{children}</ul>
    </div>
  );
}

function Row({ s }: { s: Startup }) {
  return (
    <details className="group border-b border-border last:border-b-0">
      <summary className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-0.5 px-4 py-3 hover:bg-muted group-open:bg-muted sm:grid-cols-[minmax(0,1fr)_3rem_5rem_6.5rem] sm:items-baseline [&::-webkit-details-marker]:hidden">
        <span className="col-span-full min-w-0 sm:col-span-1">
          <span className="block font-medium">{s.n}</span>
          <span className="block truncate text-sm text-muted-foreground group-open:whitespace-normal">{s.d}</span>
        </span>
        <span className="text-sm text-muted-foreground tabular-nums sm:text-right">{s.y}</span>
        <span className="text-sm font-medium tabular-nums sm:text-right">{s.r ? eur(s.r) : ""}</span>
        <span className="text-sm text-muted-foreground tabular-nums max-sm:hidden sm:text-right">{s.lf ? day(s.lf) : ""}</span>
      </summary>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-x-8 gap-y-5 px-4 pt-1 pb-5">
        {s.f && (
          <Group title="IESE founders">
            {s.f.map(([name, role, linkedin, id]) => (
              <li key={id}>
                <Ext href={crunchbase("person", id)}>{name}</Ext>
                {role && <div className="text-muted-foreground">{role}</div>}
                {linkedin && (
                  <div className="text-muted-foreground">
                    <Ext href={linkedin}>LinkedIn</Ext>
                  </div>
                )}
              </li>
            ))}
          </Group>
        )}
        {s.o && (
          <Group title="Other founders">
            {s.o.map(([name, id]) => (
              <li key={id}>
                <Ext href={crunchbase("person", id)}>{name}</Ext>
              </li>
            ))}
          </Group>
        )}
        {s.h && (
          <Group title="Headlines">
            {s.h.map(([title, publisher, date, url]) => (
              <li key={url}>
                <Ext href={url}>{title}</Ext>
                <div className="text-muted-foreground">{[publisher, date && day(date)].filter(Boolean).join(" · ")}</div>
              </li>
            ))}
          </Group>
        )}
        <Group title="Record">
          <li>
            <Ext href={crunchbase("organization", s.id)}>Crunchbase profile</Ext>
          </li>
          {s.lf && <li className="text-muted-foreground sm:hidden">Last round {day(s.lf)}</li>}
        </Group>
      </div>
    </details>
  );
}

export function StartupList({ startups }: { startups: Startup[] }) {
  const [q, setQ] = useState(useSearchParams().get("q") ?? "");
  const [sort, setSort] = useState("r");
  const [funded, setFunded] = useState(false);
  const [iese, setIese] = useState(false);

  const index = useMemo(
    () => startups.map((s) => fold([s.n, s.d, ...(s.f ?? []).map((f) => f[0]), ...(s.o ?? []).map((f) => f[0])].join(" "))),
    [startups],
  );
  const needle = fold(q.trim());
  const rows = startups
    .filter((s, i) => index[i].includes(needle) && (!funded || s.r) && (!iese || s.f))
    .sort(sorts[sort][1]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Search value={q} onChange={setQ} />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort"
          className="h-9 rounded-md border border-input bg-background px-2 text-sm"
        >
          {Object.entries(sorts).map(([key, [label]]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <button className={chip} aria-pressed={funded} onClick={() => setFunded(!funded)}>
          Funding disclosed
        </button>
        <button className={chip} aria-pressed={iese} onClick={() => setIese(!iese)}>
          IESE founder named
        </button>
      </div>
      <Paged key={`${needle}|${sort}|${funded}|${iese}`} rows={rows} total={startups.length} className="rounded-lg border border-border">
        {(s) => <Row key={s.id} s={s} />}
      </Paged>
    </>
  );
}
