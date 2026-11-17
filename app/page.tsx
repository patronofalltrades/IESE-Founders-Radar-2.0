import { StartupsTable } from "@/components/startups-table";
import { startups } from "@/lib/data";

const rows = startups.map(({ id, n, d, y, r, lf }) => ({ id, n, d, y, r, lf }));

export default function StartupsPage() {
  return <StartupsTable rows={rows} />;
}
