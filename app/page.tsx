import data from "@/prototype/data.json";
import locations from "@/prototype/locations.json";
import { StartupGlobe } from "@/components/ui/startup-globe";

type Startup = { id: string; n: string; y?: number; r?: number; f?: string[][]; o?: string[][] };

const startups = data.startups as Startup[];
const eur = (n: number) => (n >= 1e9 ? `€${(n / 1e9).toFixed(1)}B` : `€${Math.round(n / 1e6)}M`);

const funded = startups.filter((s) => s.r);
const figures = [
  [startups.length.toLocaleString("en"), "startups"],
  [data.founders.length.toLocaleString("en"), "IESE founders"],
  [eur(funded.reduce((sum, s) => sum + (s.r ?? 0), 0)), `raised by ${funded.length} of them`],
];

const byId = new Map(startups.map((s) => [s.id, s]));
const pins = locations.flatMap((place) => {
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

export default function Home() {
  return (
    <main className="flex w-full flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 pt-16">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Founders Radar</h1>
        <dl className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-2">
          {figures.map(([value, label]) => (
            <div key={label} className="contents">
              <dt className="text-right text-4xl font-semibold tabular-nums tracking-tight">{value}</dt>
              <dd className="text-muted-foreground">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
      <StartupGlobe items={pins} aria-label="Startups on the globe" />
    </main>
  );
}
