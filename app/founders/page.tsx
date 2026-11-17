import { founders } from "@/lib/data";
import { crunchbase } from "@/lib/format";

const link = "underline-offset-4 hover:underline";

export default function FoundersPage() {
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-x-8 text-sm">
      {founders.map((p) => (
        <li key={p.id} className="min-w-0 border-b border-border py-3 [overflow-wrap:anywhere]">
          <a href={crunchbase("person", p.id)} target="_blank" rel="noopener" className={`font-medium ${link}`}>
            {p.n}
          </a>
          <p className="text-muted-foreground">{[p.ro, p.c].filter(Boolean).join(", ")}</p>
          {(p.li || p.x) && (
            <p className="flex gap-3 text-muted-foreground">
              {p.li && (
                <a href={p.li} target="_blank" rel="noopener" className={link}>
                  LinkedIn
                </a>
              )}
              {p.x && (
                <a href={p.x} target="_blank" rel="noopener" className={link}>
                  X
                </a>
              )}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
