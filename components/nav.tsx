"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["/startups", "Startups"],
  ["/founders", "Founders"],
  ["/news", "News"],
];

export function Nav() {
  const path = usePathname();
  return (
    <nav aria-label="Sections" className="flex gap-1">
      {links.map(([href, label]) => (
        <Link
          key={href}
          href={href}
          aria-current={path === href ? "page" : undefined}
          className="rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground aria-[current]:bg-primary aria-[current]:text-primary-foreground"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
