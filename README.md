# Founders Radar

An independent rebuild of [IESE's Founders Radar](https://foundersradar.iese.edu/startups), the directory of startups founded by IESE alumni. Not affiliated with IESE or Crunchbase.

Target: live by Thanksgiving, Thursday 26 November 2026. The plan is in [PLAN.md](PLAN.md); rules for people and agents working here are in [AGENTS.md](AGENTS.md).

## What is here

| Path | What it is |
| --- | --- |
| `app/` | The site: Next.js App Router, TypeScript, Tailwind. `/` is the public globe; `/dashboard` (startups), `/dashboard/founders` and `/dashboard/news` are behind `/login`. Tokens are in `app/globals.css`. |
| `proxy.ts` | Sends anyone who is not signed in with an `@iese.net` address from `/dashboard` to `/login`. The allowed domain is in `lib/auth.ts`. |
| `components/dashboard.tsx` | The sidebar and header around every page. Add a nav item here when you add a route. |
| `components/block/dashboard-shell.tsx` | The ObsidianUI dashboard shell, copied from `https://www.obsidianui.dev/r/dashboard-shell.json`. Its colours are in `dashboard-shell.css` beside it. |
| `components/ui/` | shadcn components. `startup-globe.tsx` is adapted from the 21st.dev testimonial globe. |
| `lib/data.ts` | The one place pages read the scraped data from. |
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

Then open http://localhost:3000.

The dashboard is locked until Supabase is configured. People sign in with their `@iese.net` Microsoft account, or with a link emailed to that address. Put the project's URL and publishable key in `.env.local` (git-ignored) for local work, and add the same two variables under Settings → Environment Variables on Vercel. Both values are public by design; no secret key is used.

```bash
printf 'NEXT_PUBLIC_SUPABASE_URL=https://fvwzptutdwnjenbivqrh.supabase.co\nNEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=paste-the-publishable-key\n' > .env.local
```

The Microsoft button needs the Azure provider enabled in Supabase with its tenant URL set to IESE's tenant, `https://login.microsoftonline.com/ed0cd196-c46d-43d9-813e-500e8c413eda`, so only IESE accounts can use it. Every address the site runs on needs `<address>/auth/callback` in Supabase's redirect URL list.

Before pushing, run:

```bash
npm run check
```

Add shadcn components with `npx shadcn@latest add <name>`; they land in `components/ui/`. The project uses shadcn's Base UI style, so the CLI rewrites Radix `asChild` props in third-party blocks and breaks them. If a block built on Radix fails to typecheck after install, replace the file with the registry's original source.

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
