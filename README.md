# Founders Radar

An independent rebuild of [IESE's Founders Radar](https://foundersradar.iese.edu/startups), the directory of startups founded by IESE alumni. Not affiliated with IESE or Crunchbase.

Target: live by Thanksgiving, Thursday 26 November 2026. The plan is in [PLAN.md](PLAN.md); rules for people and agents working here are in [AGENTS.md](AGENTS.md).

## What is here

| Path | What it is |
| --- | --- |
| `prototype/index.html` | Single-file working prototype: search, sort, filters, founders and news views. |
| `prototype/data.json` | The scraped dataset the prototype reads (1,049 startups, 575 founders). |
| `scraper/` | Scripts that rebuild `prototype/data.json` from the source site. |

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

## Data

The source site takes its data from Crunchbase. Each startup has a name, description, founding year, total raised (when disclosed), last funding date, IESE and other founders, and up to three headlines. There is no country or sector field. Field names are short to keep the file small; `scraper/build.py` is the reference for what each one means.
