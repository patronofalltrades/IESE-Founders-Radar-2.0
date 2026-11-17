# Repository instructions

An independent rebuild of IESE's Founders Radar. Read [README.md](README.md) for the layout and [PLAN.md](PLAN.md) for what is next. These rules apply to every agent and person working here.

## Working rules

1. **Make the smallest change that meets the requirement.** Ask before adding code for problems that are only theoretical.
2. **No taglines, helper text or decorative labels.** If a screen needs one to make sense, fix the layout.
3. **One source of truth per fact.** Data lives in `prototype/data.json`, `prototype/locations.json` and `prototype/alumni.json`, all written only by `scraper/`. Never hand-edit them. To add a location, add a row to `scraper/locations.csv` with a page on the company's own site that states the city. To confirm a founder's IESE link, add a row to `scraper/alumni.csv` with a public page and the sentence on it that states the link. Design tokens live in `app/globals.css`.
4. **Keep PLAN.md current.** Move finished steps to Done and delete anything that no longer applies.

## Invariants

- Never invent startups, founders, funding figures or headlines. Every fact shown must come from the scraped data. A location must be stated on the company's own website.
- Totals shown on the site are computed from the data, with the count they cover.
- Do not use IESE or Crunchbase logos or branding. The site says it is unofficial and names its source.
- Scrape gently: a few requests per second at most, and only the public listing pages.
- Do not make the site public, attach a domain or change hosting without Hanif's approval.
- Never commit secrets.
- Run `npm run check` before you push.
- Report browser and device checks separately from automated checks. A narrow viewport is not a phone.
<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
