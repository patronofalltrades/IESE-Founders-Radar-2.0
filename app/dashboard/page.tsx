import type { Metadata } from "next";
import data from "@/prototype/data.json";
import locations from "@/prototype/locations.json";
import { Dashboard, type Founder, type Startup } from "./dashboard";

export const metadata: Metadata = { title: "Directory · Founders Radar" };

const letters = (s: string) =>
  s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z ]/g, "");

// A name counts as matching when a surname appears in the founder's own Crunchbase or LinkedIn handle.
function nameMatchesProfile(name: string, id: string, linkedin: string) {
  const handle = linkedin.replace(/[/?#]+$/, "").split("/").pop() ?? "";
  let decoded = handle;
  try {
    decoded = decodeURIComponent(handle);
  } catch {}
  const profile = letters(id + decoded).replace(/ /g, "");
  const parts = letters(name.replace(/-/g, " ")).split(" ").filter(Boolean);
  return (parts.length > 1 ? parts.slice(1) : parts).some((part) => part.length > 2 && profile.includes(part));
}

const places = new Map(locations.map((place) => [place.id, place]));

const startups: Startup[] = (data.startups as Startup[]).map((s) => {
  const place = places.get(s.id);
  return place ? { ...s, city: place.city, country: place.country, src: place.source } : s;
});

const founders: Founder[] = data.founders.map((f) => ({
  id: f.id,
  n: f.n,
  ro: f.ro,
  p: f.p,
  li: f.li,
  x: f.x,
  c: f.c,
  ci: f.in ? f.ci : "",
  ok: nameMatchesProfile(f.n, f.id, f.li),
}));

export default function Page() {
  return <Dashboard founders={founders} startups={startups} />;
}
