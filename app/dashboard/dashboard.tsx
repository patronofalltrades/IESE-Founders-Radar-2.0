"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Search, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn, eur } from "@/lib/utils";

export type Founder = {
  id: string;
  n: string;
  ro: string;
  p: string;
  li: string;
  x: string;
  c: string;
  /** Startup id when the company is in the directory. */
  ci: string;
  /** The name agrees with the founder's own Crunchbase or LinkedIn handle. */
  ok: boolean;
};

export type Startup = {
  id: string;
  n: string;
  d: string;
  y?: number;
  r?: number;
  lf?: string;
  /** IESE founders: name, role, LinkedIn, founder id. */
  f?: string[][];
  /** Other founders: name, id. */
  o?: string[][];
  /** Headlines: title, publisher, date, url. */
  h?: string[][];
  city?: string;
  country?: string;
  src?: string;
};

type View = "founders" | "startups";

const VIEWS: Record<View, { label: string; filters: [string, string][]; sorts: [string, string][] }> = {
  founders: {
    label: "Founders",
    filters: [
      ["ok", "Name matches profile"],
      ["li", "LinkedIn"],
      ["funded", "Company funding disclosed"],
    ],
    sorts: [
      ["name", "Name"],
      ["raised", "Company raised"],
    ],
  },
  startups: {
    label: "Startups",
    filters: [
      ["funded", "Funding disclosed"],
      ["iese", "IESE founder named"],
      ["news", "Headlines"],
    ],
    sorts: [
      ["raised", "Raised"],
      ["year", "Founded"],
      ["name", "Name"],
    ],
  },
};

const th = "sticky top-0 border-b bg-background px-3 py-2 text-left text-xs font-medium text-muted-foreground";
const td = "px-3 py-2 align-top";

function External({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "outline" })}>
      {children}
      <ArrowUpRight aria-hidden="true" />
    </a>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2 border-t pt-4">
      <h3 className="text-xs font-medium text-muted-foreground">{title}</h3>
      {children}
    </section>
  );
}

function StartupFacts({ s, onFounder }: { s: Startup; onFounder: (id: string) => void }) {
  const facts = [
    ["Founded", s.y],
    ["Raised", s.r ? eur(s.r) : undefined],
    ["Last funding", s.lf],
    ["Based in", s.city && [s.city, s.country].filter(Boolean).join(", ")],
  ].filter((fact) => fact[1]);
  return (
    <>
      <p className="text-sm text-muted-foreground">{s.d}</p>
      {facts.length > 0 && (
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          {facts.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      )}
      {s.src && (
        <a href={s.src} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground underline underline-offset-4">
          Location source
        </a>
      )}
      {s.f && (
        <Block title="IESE founders">
          <ul className="flex flex-col gap-1 text-sm">
            {s.f.map(([name, role, , id]) => (
              <li key={id}>
                <button type="button" onClick={() => onFounder(id)} className="font-medium underline underline-offset-4">
                  {name}
                </button>
                {role && <span className="text-muted-foreground"> · {role}</span>}
              </li>
            ))}
          </ul>
        </Block>
      )}
      {s.o && (
        <Block title="Other founders">
          <p className="text-sm">{s.o.map((other) => other[0]).join(", ")}</p>
        </Block>
      )}
      {s.h && (
        <Block title="Headlines">
          <ul className="flex flex-col gap-3 text-sm">
            {s.h.map(([title, publisher, date, url]) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                  {title}
                </a>
                <span className="block text-xs text-muted-foreground">{[publisher, date].filter(Boolean).join(" · ")}</span>
              </li>
            ))}
          </ul>
        </Block>
      )}
    </>
  );
}

export function Dashboard({ founders, startups }: { founders: Founder[]; startups: Startup[] }) {
  const [view, setView] = React.useState<View>("founders");
  const [query, setQuery] = React.useState("");
  const [on, setOn] = React.useState<string[]>([]);
  const [sort, setSort] = React.useState("name");
  const [selected, setSelected] = React.useState<{ view: View; id: string } | null>(null);

  const startupById = React.useMemo(() => new Map(startups.map((s) => [s.id, s])), [startups]);
  const founderById = React.useMemo(() => new Map(founders.map((f) => [f.id, f])), [founders]);

  const q = query.trim().toLowerCase();
  const founderRows = React.useMemo(() => {
    const raised = (f: Founder) => startupById.get(f.ci)?.r ?? 0;
    return founders
      .filter(
        (f) =>
          (!q || `${f.n} ${f.c} ${f.ro}`.toLowerCase().includes(q)) &&
          (!on.includes("ok") || f.ok) &&
          (!on.includes("li") || f.li) &&
          (!on.includes("funded") || raised(f) > 0),
      )
      .sort((a, b) => (sort === "raised" ? raised(b) - raised(a) : 0) || a.n.localeCompare(b.n));
  }, [founders, startupById, q, on, sort]);
  const startupRows = React.useMemo(
    () =>
      startups
        .filter(
          (s) =>
            (!q || `${s.n} ${s.d}`.toLowerCase().includes(q)) &&
            (!on.includes("funded") || s.r) &&
            (!on.includes("iese") || s.f) &&
            (!on.includes("news") || s.h),
        )
        .sort(
          (a, b) =>
            (sort === "raised" ? (b.r ?? 0) - (a.r ?? 0) : sort === "year" ? (b.y ?? 0) - (a.y ?? 0) : 0) ||
            a.n.localeCompare(b.n),
        ),
    [startups, q, on, sort],
  );

  const shown = view === "founders" ? founderRows.length : startupRows.length;
  const total = view === "founders" ? founders.length : startups.length;
  const founder = selected?.view === "founders" ? founderById.get(selected.id) : undefined;
  const startup = selected?.view === "startups" ? startupById.get(selected.id) : founder && startupById.get(founder.ci);
  const row = (active: boolean) => cn("cursor-pointer border-b hover:bg-muted", active && "bg-muted");

  return (
    <div className="flex flex-1 flex-col md:h-dvh md:flex-row">
      <aside className="flex shrink-0 flex-col gap-6 border-b bg-sidebar p-4 md:w-64 md:overflow-y-auto md:border-r md:border-b-0">
        <Link href="/" className="font-heading text-lg font-semibold tracking-tight">
          Founders Radar
        </Link>
        <nav className="flex flex-col gap-1">
          {(Object.keys(VIEWS) as View[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-current={view === key ? "page" : undefined}
              onClick={() => {
                setView(key);
                setOn([]);
                setSort(VIEWS[key].sorts[0][0]);
              }}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-sidebar-accent aria-[current]:bg-sidebar-primary aria-[current]:text-sidebar-primary-foreground"
            >
              {VIEWS[key].label}
              <span className="tabular-nums opacity-70">{(key === "founders" ? founders : startups).length.toLocaleString("en")}</span>
            </button>
          ))}
        </nav>
        <label className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-ring/50">
          <Search aria-hidden="true" className="size-4 text-muted-foreground" />
          <input
            type="search"
            aria-label="Search"
            placeholder="Search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-w-0 flex-1 bg-transparent outline-none"
          />
        </label>
        <fieldset className="flex flex-col gap-2 text-sm">
          <legend className="mb-2 text-xs font-medium text-muted-foreground">Filter</legend>
          {VIEWS[view].filters.map(([key, label]) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={on.includes(key)}
                onChange={() => setOn(on.includes(key) ? on.filter((k) => k !== key) : [...on, key])}
                className="size-4 accent-primary"
              />
              {label}
            </label>
          ))}
        </fieldset>
        <label className="flex flex-col gap-2 text-xs font-medium text-muted-foreground">
          Sort
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="rounded-lg border bg-background px-3 py-2 text-sm font-normal text-foreground"
          >
            {VIEWS[view].sorts.map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b px-6">
          <h1 className="font-heading font-semibold tracking-tight">{VIEWS[view].label}</h1>
          <p className="text-sm tabular-nums text-muted-foreground">
            {shown.toLocaleString("en")} of {total.toLocaleString("en")}
          </p>
        </header>
        <div className="flex-1 overflow-auto px-3">
          {view === "founders" ? (
            <table className="w-full border-separate border-spacing-0 text-sm">
              <thead>
                <tr>
                  <th className={th}>Name</th>
                  <th className={cn(th, "hidden lg:table-cell")}>Role</th>
                  <th className={th}>Company</th>
                  <th className={cn(th, "hidden text-right sm:table-cell")}>Raised</th>
                  <th className={th}>Contact</th>
                </tr>
              </thead>
              <tbody>
                {founderRows.map((f) => {
                  const company = startupById.get(f.ci);
                  return (
                    <tr key={f.id} className={row(founder === f)} onClick={() => setSelected({ view: "founders", id: f.id })}>
                      <td className={cn(td, "border-b")}>
                        <button type="button" className="inline-flex items-center gap-1.5 text-left font-medium">
                          {f.n}
                          {f.ok && <BadgeCheck aria-label="Name matches profile" className="size-4 shrink-0 text-muted-foreground" />}
                        </button>
                      </td>
                      <td className={cn(td, "hidden border-b text-muted-foreground lg:table-cell")}>{f.ro}</td>
                      <td className={cn(td, "border-b")}>{f.c}</td>
                      <td className={cn(td, "hidden border-b text-right tabular-nums sm:table-cell")}>{company?.r ? eur(company.r) : ""}</td>
                      <td className={cn(td, "border-b")}>
                        {f.li && (
                          <a
                            href={f.li}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(event) => event.stopPropagation()}
                            className="underline underline-offset-4"
                          >
                            LinkedIn
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className="w-full border-separate border-spacing-0 text-sm">
              <thead>
                <tr>
                  <th className={th}>Startup</th>
                  <th className={cn(th, "hidden lg:table-cell")}>IESE founders</th>
                  <th className={cn(th, "text-right")}>Founded</th>
                  <th className={cn(th, "text-right")}>Raised</th>
                  <th className={cn(th, "hidden text-right sm:table-cell")}>Last funding</th>
                </tr>
              </thead>
              <tbody>
                {startupRows.map((s) => (
                  <tr key={s.id} className={row(startup === s)} onClick={() => setSelected({ view: "startups", id: s.id })}>
                    <td className={cn(td, "border-b")}>
                      <button type="button" className="text-left font-medium">
                        {s.n}
                      </button>
                    </td>
                    <td className={cn(td, "hidden border-b text-muted-foreground lg:table-cell")}>{s.f?.map((f) => f[0]).join(", ")}</td>
                    <td className={cn(td, "border-b text-right tabular-nums")}>{s.y}</td>
                    <td className={cn(td, "border-b text-right tabular-nums")}>{s.r ? eur(s.r) : ""}</td>
                    <td className={cn(td, "hidden border-b text-right whitespace-nowrap tabular-nums sm:table-cell")}>{s.lf}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {(founder || startup) && (
        <aside className="fixed inset-0 z-10 flex flex-col gap-4 overflow-y-auto bg-background p-6 md:static md:w-96 md:shrink-0 md:border-l">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-heading text-xl font-semibold tracking-tight">{founder ? founder.n : startup?.n}</h2>
              {founder && <p className="text-sm text-muted-foreground">{[founder.ro, founder.c].filter(Boolean).join(" · ")}</p>}
            </div>
            <button type="button" aria-label="Close" onClick={() => setSelected(null)} className={buttonVariants({ variant: "ghost", size: "icon" })}>
              <X aria-hidden="true" />
            </button>
          </div>
          {founder && (
            <>
              <p className="flex items-center gap-1.5 text-sm">
                {founder.ok && <BadgeCheck aria-hidden="true" className="size-4" />}
                {founder.ok ? "Name matches profile" : "Name differs from profile"}
              </p>
              {founder.p && <p className="text-sm text-muted-foreground">IESE · {founder.p}</p>}
              <div className="flex flex-wrap gap-2">
                {founder.li && <External href={founder.li}>LinkedIn</External>}
                {founder.x && <External href={founder.x}>X</External>}
              </div>
            </>
          )}
          {founder && startup && (
            <Block title="Company">
              <button
                type="button"
                onClick={() => setSelected({ view: "startups", id: startup.id })}
                className="self-start font-medium underline underline-offset-4"
              >
                {startup.n}
              </button>
            </Block>
          )}
          {startup && <StartupFacts s={startup} onFounder={(id) => founderById.has(id) && setSelected({ view: "founders", id })} />}
        </aside>
      )}
    </div>
  );
}
