# Repository instructions

An independent rebuild of IESE's Founders Radar. Read [README.md](README.md) for the layout and [PLAN.md](PLAN.md) for what is next. These rules apply to every agent and person working here.

## Working rules

1. **Make the smallest change that meets the requirement.** Ask before adding code for problems that are only theoretical.
2. **No taglines, helper text or decorative labels.** If a screen needs one to make sense, fix the layout.
3. **One source of truth per fact.** Data lives in `prototype/data.json` and is only written by `scraper/`. Never hand-edit it.
4. **Keep PLAN.md current.** Move finished steps to Done and delete anything that no longer applies.

## Invariants

- Never invent startups, founders, funding figures or headlines. Every fact shown must come from the scraped data.
- Totals shown on the site are computed from the data, with the count they cover.
- Do not use IESE or Crunchbase logos or branding. The site says it is unofficial and names its source.
- Scrape gently: a few requests per second at most, and only the public listing pages.
- Do not make the site public, attach a domain or change hosting without Hanif's approval.
- Never commit secrets.
- Report browser and device checks separately from automated checks. A narrow viewport is not a phone.
