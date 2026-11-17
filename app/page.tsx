import locations from "@/prototype/locations.json";
import { StartupGlobe } from "@/components/ui/startup-globe";
import { confirmed, founders, startups } from "@/lib/data";
import { eur } from "@/lib/format";

const sum = (list: typeof startups) => eur(list.reduce((total, s) => total + (s.r ?? 0), 0));
const funded = startups.filter((s) => s.r);
const fundedIese = funded.filter((s) => s.f);
const figures = [
  [startups.length.toLocaleString("en"), "startups"],
  [founders.length.toLocaleString("en"), "IESE-related founders"],
  [Object.keys(confirmed).length.toLocaleString("en"), "of them confirmed by a second public page"],
  [sum(funded), `raised by ${funded.length} of them`],
  [sum(fundedIese), `of it by the ${fundedIese.length} that name an IESE-related founder`],
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
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 pt-10">
        <h1 className="sr-only">Founders Radar</h1>
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
