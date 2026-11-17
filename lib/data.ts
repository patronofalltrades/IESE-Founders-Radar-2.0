import data from "@/prototype/data.json";

// Field names are set by scraper/build.py.
export type Startup = {
  id: string;
  n: string;
  d: string;
  y?: number;
  r?: number;
  lf?: string;
  f?: string[][]; // name, role, LinkedIn, Crunchbase id
  o?: string[][]; // name, Crunchbase id
  h?: string[][]; // title, publisher, date, url
};
export type Founder = { id: string; n: string; c: string; ci: string; in: number; ro: string; li: string; x: string; p: string };
export type Headline = { title: string; publisher: string; date: string; url: string; startup: string };

export const startups = data.startups as Startup[];
export const founders = data.founders as Founder[];
export const scraped = data.scraped;
