"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Newspaper, Users } from "lucide-react";
import { logout } from "@/app/login/actions";
import { DashboardButton, DashboardShell } from "@/components/block/dashboard-shell";

type Counts = { startups: number; founders: number; news: number };

export function Dashboard({ counts, children }: { counts: Counts; children: React.ReactNode }) {
  const pathname = usePathname();
  const items = [
    { id: "/dashboard", label: "Startups", icon: Building2, href: "/dashboard", count: counts.startups },
    { id: "/dashboard/founders", label: "Founders", icon: Users, href: "/dashboard/founders", count: counts.founders },
    { id: "/dashboard/news", label: "News", icon: Newspaper, href: "/dashboard/news", count: counts.news },
  ];

  return (
    <DashboardShell
      brand={{ name: "Founders Radar" }}
      navigation={[{ id: "main", items }]}
      activeItemId={pathname}
      linkComponent={Link}
      sidebarFooter={
        <form action={logout}>
          <DashboardButton type="submit" variant="ghost" size="sm">
            Log out
          </DashboardButton>
        </form>
      }
      title={items.find((item) => item.href === pathname)?.label ?? "Founders Radar"}
    >
      <div className="p-4">{children}</div>
    </DashboardShell>
  );
}
