# Plan

Goal: a better Founders Radar, live by Thursday 26 November 2026.

## Done

- Scraped the source site and normalised it into `prototype/data.json` (16 Nov).
- Built a working single-page prototype in `prototype/` (16 Nov).
- Scaffolded the site: Next.js, TypeScript, Tailwind, shadcn (17 Nov).
- Collected locations for 10 startups from their own websites (17 Nov).
- Adapted the 21st.dev globe to startups (`components/ui/startup-globe.tsx`) and put it on the home page with the 10 located startups (17 Nov).
- Removed duplicates from the data in `scraper/build.py`: two repeated company profiles, one repeated founder, two repeated co-founder names and 21 repeated headlines (17 Nov).
- Checked the data against the downloaded pages and fixed two parser bugs: one missed founder, six headlines without a date (17 Nov).
- Kept only headlines whose title or URL names the company: 486 of 1,041 (17 Nov).
- Confirmed 36 founders' IESE link against a second public page, found by Haiku and fact-checked by Sonnet, and set up a daily scheduled run for the rest (17 Nov).
- Reworded the site to "IESE-related founders"; executive and exchange programmes count (17 Nov).
- Started the build: Startups, Founders and News pages with search, sort and filters; shared header and footer; both funding totals on the home page (17 Nov).

## Next

| When | Step | Output |
| --- | --- | --- |
| 17–18 Nov | Jobs to be done. Run Hanif's AI PM course prompts against the source site and the prototype. | `docs/JTBD.md` |
| 18–20 Nov | Design references. Collect patterns from 21st.dev, Arc and Mobbin; pick a direction. | `docs/DESIGN.md` |
| 20–21 Nov | Decide hosting and set up a preview deploy. | Preview URL |
| 21–25 Nov | Finish the build against the jobs and the design direction. Not yet ported from the prototype: the founding-year chart that filters the list. | Feature-complete preview |
| 25–26 Nov | Checks on a real phone and by keyboard, then release. | Live site |

## Open decisions

1. **Public or private data.** The data is Crunchbase's, republished by IESE. Check Crunchbase's terms, or ask IESE's Entrepreneurship and Innovation Center, before the site goes public.
2. **Globe.** It shows the 10 startups in `prototype/locations.json`. Open: whether to extend locations (each is a manual lookup, and some sites block scraping or state no address); where employee count or funding stage would come from, since the source has neither (the card shows total raised instead); and how to handle pins that overlap, since eight of the ten are in Europe.
3. **Logos and photos.** The source hotlinks Crunchbase images. Decide whether to hotlink, cache, or stay text-only.
4. **Refresh cadence.** Manual `./scraper/run.sh` for now; a scheduled job only if the site stays up past launch.
5. **Missing fields.** Country and sector are not in the source. Adding them means another data source.
6. **Name and domain.**
7. **Unconfirmed IESE links.** The source labels all 574 founders "IESE Business School" on Crunchbase's word. 36 are confirmed so far and a daily run searches 60 more until the list is done (480 left); `scraper/alumni-runs.csv` has the cost of each run. Open: searching one founder per Haiku agent recovered 7 of the 15 that five-per-agent missed, so one per agent stays; Sonnet costs $0.12 a claim at one claim per agent against $0.05 at five, so grouping its claims would cut the largest cost; six founders Sonnet confirmed were rejected by `alumni.py`, four because the source's name for the person differs from the page (Ana Maiques, Ignasi Vilajosana, David Hernández Pumarega, José Manuel Martínez), and need a manual look along with Marc Antoni Macia, Andreas Emmenegger, Sam Glasswell and Jonathan Lipnik.
8. **What the source does not support.** Found in the 17 Nov data check; decide how the build handles each.
   - 613 of 1,047 startups name no IESE founder (424 name no founder at all). They hold 62% of the €23.6B total raised; Lazada alone is 31%. The home page shows both totals; the list still includes them, with an "IESE founder named" filter.
   - 238 of 574 founder cards name a company that is not in the startup list, and the role shown is the person's current job, not always a founding role.
   - The "last updated" date is 4 Jul 2022 on every card, so it says nothing.
   - Six startups have a last funding date earlier than their founding year.
