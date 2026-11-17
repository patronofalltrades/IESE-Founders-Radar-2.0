"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

const PAGE = 100;

export const Ext = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener" className="underline underline-offset-2">
    {children}
  </a>
);

export function Search({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search"
      aria-label="Search"
      autoComplete="off"
      className="h-9 min-w-0 flex-1 basis-56 rounded-md border border-input bg-background px-3 text-sm"
    />
  );
}

// Shows the first 100 rows and a button for the next 100. Give it a key that changes with the filters to start over.
export function Paged<T>({ rows, total, className, children }: { rows: T[]; total: number; className?: string; children: (row: T) => ReactNode }) {
  const [shown, setShown] = useState(PAGE);
  return (
    <>
      <p aria-live="polite" className="text-sm text-muted-foreground tabular-nums">
        {rows.length.toLocaleString("en")} of {total.toLocaleString("en")}
      </p>
      {rows.length > 0 && <div className={className}>{rows.slice(0, shown).map(children)}</div>}
      {rows.length > shown && (
        <Button variant="outline" className="self-center" onClick={() => setShown(shown + PAGE)}>
          Show more
        </Button>
      )}
    </>
  );
}
