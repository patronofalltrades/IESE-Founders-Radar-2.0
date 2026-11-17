import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { scraped } from "@/lib/data";
import { day } from "@/lib/format";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Founders Radar",
  description: "An unofficial directory of startups with IESE-related founders.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-border">
          <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
            <Link href="/" className="font-heading text-lg font-semibold tracking-tight">
              Founders Radar
            </Link>
            <Nav />
          </div>
        </header>
        {children}
        <footer className="mx-auto w-full max-w-5xl px-4 py-8 text-sm text-muted-foreground">
          Unofficial, and not affiliated with IESE or Crunchbase. Data read from{" "}
          <a href="https://foundersradar.iese.edu/startups" className="underline underline-offset-2">
            foundersradar.iese.edu
          </a>{" "}
          on {day(scraped)}; that site takes it from Crunchbase. Funding figures cover only companies with a disclosed amount. A founder is IESE-related when the source lists them under IESE
          Business School, for any programme; “IESE link confirmed” goes to a second public page that says so.
        </footer>
      </body>
    </html>
  );
}
