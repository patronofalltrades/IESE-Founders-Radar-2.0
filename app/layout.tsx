import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Dashboard } from "@/components/dashboard";
import { founders, news, pins, startups } from "@/lib/data";

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
  description: "An unofficial directory of startups founded by IESE alumni.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-dvh">
        <Dashboard counts={{ startups: startups.length, founders: founders.length, news: news.length, globe: pins.length }}>
          {children}
        </Dashboard>
      </body>
    </html>
  );
}
