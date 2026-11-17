"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Globe, Newspaper, Users } from "lucide-react";
import { DashboardShell } from "@/components/block/dashboard-shell";

type Counts = { startups: number; founders: number; news: number; globe: number };

export function Dashboard({ counts, children }: { counts: Counts; children: React.ReactNode }) {
  const pathname = usePathname();
  const items = [
    { id: "/", label: "Startups", icon: Building2, href: "/", count: counts.startups },
    { id: "/founders", label: "Founders", icon: Users, href: "/founders", count: counts.founders },
    { id: "/news", label: "News", icon: Newspaper, href: "/news", count: counts.news },
    { id: "/globe", label: "Globe", icon: Globe, href: "/globe", count: counts.globe },
  ];

  return (
    <DashboardShell
      brand={{ name: "Founders Radar" }}
      navigation={[{ id: "main", items }]}
      activeItemId={pathname}
      linkComponent={Link}
      title={items.find((item) => item.href === pathname)?.label ?? "Founders Radar"}
    >
      <div className="p-4">{children}</div>
    </DashboardShell>
  );
}
