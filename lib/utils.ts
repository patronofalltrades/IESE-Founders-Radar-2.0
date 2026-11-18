export { cn } from "cn"

export const eur = (n: number) =>
  n >= 1e9 ? `€${(n / 1e9).toFixed(1)}B` : n >= 1e6 ? `€${Math.round(n / 1e6)}M` : `€${Math.round(n / 1e3)}K`;
