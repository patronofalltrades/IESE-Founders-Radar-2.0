import Link from "next/link";
import { StartupGlobe } from "@/components/ui/startup-globe";
import { pins } from "@/lib/data";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between px-4 py-4 sm:px-8">
        <h1 className="font-heading text-lg font-semibold tracking-tight">Founders Radar</h1>
        <Link href="/dashboard" className="text-sm font-medium underline-offset-4 hover:underline">
          Log in
        </Link>
      </header>
      <div className="flex flex-1 items-center">
        <StartupGlobe items={pins} size={560} autoplay aria-label="Startups on the globe" />
      </div>
    </main>
  );
}
