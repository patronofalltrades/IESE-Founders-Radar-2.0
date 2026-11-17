# Founders Radar

An independent rebuild of [IESE's Founders Radar](https://foundersradar.iese.edu/startups), the directory of startups founded by IESE alumni. Not affiliated with IESE or Crunchbase.

Target: live by Thanksgiving, Thursday 26 November 2026. The plan is in [PLAN.md](PLAN.md); rules for people and agents working here are in [AGENTS.md](AGENTS.md).

## What is here

| Path | What it is |
| --- | --- |
| `app/` | The site: Next.js App Router, TypeScript, Tailwind. Tokens are in `app/globals.css`. |
| `components/ui/` | shadcn components. `startup-globe.tsx` is the home page globe, adapted from the 21st.dev testimonial globe. |
| `prototype/data.json` | The scraped dataset the site reads (1,049 startups, 575 founders). |
| `prototype/index.html` | The earlier single-file prototype: search, sort, filters, founders and news views. |
| `prototype/locations.json` | City and coordinates for 10 startups, each with the company page that states it. |
| `scraper/` | Scripts that rebuild `prototype/data.json` from the source site. |

## Run the site

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:3000. Before pushing, run:

```bash
npm run check
```

Add shadcn components with `npx shadcn@latest add <name>`; they land in `components/ui/`.

## Run the prototype

```bash
python3 -m http.server 8000 --directory prototype
```

Then open http://localhost:8000. It needs a server because the page fetches `data.json`.

## Refresh the data

```bash
./scraper/run.sh
```

This downloads about 190 listing pages at a gentle rate into `scraper/raw/` (git-ignored), parses them, removes duplicates and writes `prototype/data.json`.

## Refresh the locations

```bash
python3 scraper/locations.py
```

This re-reads each source page listed in `scraper/locations.csv`, drops any row whose page no longer states the city, and geocodes the rest with OpenStreetMap Nominatim (data © OpenStreetMap contributors, ODbL).

## Data

The source site takes its data from Crunchbase. Each startup has a name, description, founding year, total raised (when disclosed), last funding date, IESE and other founders, and up to three headlines. There is no country or sector field. Field names are short to keep the file small; `scraper/build.py` is the reference for what each one means.
