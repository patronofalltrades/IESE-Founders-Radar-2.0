import data from "@/prototype/data.json";

const funded = data.startups.filter((s) => "r" in s && s.r);
const raised = funded.reduce((sum, s) => sum + ("r" in s && s.r ? s.r : 0), 0);

const figures = [
  [data.startups.length.toLocaleString("en"), "startups"],
  [data.founders.length.toLocaleString("en"), "IESE founders"],
  [`€${(raised / 1e9).toFixed(1)}B`, `raised by ${funded.length} of them`],
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-16">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">Founders Radar</h1>
      <dl className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-2">
        {figures.map(([value, label]) => (
          <div key={label} className="contents">
            <dt className="text-right text-4xl font-semibold tabular-nums tracking-tight">{value}</dt>
            <dd className="text-muted-foreground">{label}</dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
