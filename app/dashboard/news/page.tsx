import { news } from "@/lib/data";
import { day } from "@/lib/format";

export default function NewsPage() {
  return (
    <ul className="text-sm">
      {news.map((item) => (
        <li key={item.url + item.startup} className="grid gap-x-6 border-b border-border py-3 sm:grid-cols-[6.5rem_minmax(0,1fr)]">
          <span className="tabular-nums text-muted-foreground">{day(item.date)}</span>
          <div className="min-w-0">
            <a href={item.url} target="_blank" rel="noopener" className="font-medium underline-offset-4 hover:underline">
              {item.title}
            </a>
            <p className="text-muted-foreground">
              {item.publisher} · {item.startup}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
