const MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");

export const eur = (n: number) =>
  n >= 1e9 ? `€${(n / 1e9).toFixed(1)}B` : n >= 1e6 ? `€${(n / 1e6).toFixed(1)}M` : `€${Math.round(n / 1e3)}K`;

export const day = (iso: string) => `${+iso.slice(8)} ${MONTHS[+iso.slice(5, 7) - 1]} ${iso.slice(0, 4)}`;

export const fold = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export const crunchbase = (kind: "organization" | "person", id: string) =>
  `https://www.crunchbase.com/${kind}/${encodeURIComponent(id)}`;
