import { Dashboard } from "@/components/dashboard";
import { founders, news, startups } from "@/lib/data";

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <div className="h-dvh">
      <Dashboard counts={{ startups: startups.length, founders: founders.length, news: news.length }}>{children}</Dashboard>
    </div>
  );
}
