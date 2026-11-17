import data from "@/prototype/data.json";
import { eur } from "@/lib/format";
import locations from "@/prototype/locations.json";

// Field names are the short keys written by scraper/build.py.
export type Startup = {
  id: string;
  n: string;
  d: string;
  y?: number;
  r?: number;
  lf?: string;
  f?: string[][];
  o?: string[][];
  h?: string[][];
};

export const startups = data.startups as Startup[];
export const founders = data.founders;

export const news = startups
  .flatMap((s) => (s.h ?? []).map(([title, publisher, date, url]) => ({ title, publisher, date, url, startup: s.n })))
  .sort((a, b) => (a.date < b.date ? 1 : -1));

const byId = new Map(startups.map((s) => [s.id, s]));
export const pins = locations.flatMap((place) => {
  const s = byId.get(place.id);
  if (!s) return [];
  return {
    id: s.id,
    name: s.n,
    year: s.y,
    founders: [...(s.f ?? []), ...(s.o ?? [])].map((founder) => founder[0]),
    raised: s.r ? eur(s.r) : undefined,
    city: place.city,
    country: place.country,
    lat: place.lat,
    lng: place.lng,
  };
});
