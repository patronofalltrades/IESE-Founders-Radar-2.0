const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function eur(n: number) {
  return n >= 1e9 ? `€${(n / 1e9).toFixed(1)}B` : n >= 1e6 ? `€${(n / 1e6).toFixed(1)}M` : `€${Math.round(n / 1e3)}K`;
}

/** "2023-03-22" → "22 Mar 2023". */
export function day(iso?: string) {
  return iso ? `${+iso.slice(8)} ${MONTHS[+iso.slice(5, 7) - 1]} ${iso.slice(0, 4)}` : "";
}

export const crunchbase = (kind: "organization" | "person", id: string) =>
  `https://www.crunchbase.com/${kind}/${encodeURIComponent(id)}`;
