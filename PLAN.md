# Plan

Goal: a better Founders Radar, live by Thursday 26 November 2026.

## Done

- Scraped the source site and normalised it into `prototype/data.json` (16 Nov).
- Built a working single-page prototype in `prototype/` (16 Nov).
- Scaffolded the site: Next.js, TypeScript, Tailwind, shadcn (17 Nov).
- Collected locations for 10 startups from their own websites (17 Nov).
- Adapted the 21st.dev globe to startups (`components/ui/startup-globe.tsx`) and put it on the home page with the 10 located startups (17 Nov).
- Removed duplicates from the data in `scraper/build.py`: two repeated company profiles, one repeated founder, two repeated co-founder names and 21 repeated headlines (17 Nov).

## Next

| When | Step | Output |
| --- | --- | --- |
| 17–18 Nov | Jobs to be done. Run Hanif's AI PM course prompts against the source site and the prototype. | `docs/JTBD.md` |
| 18–20 Nov | Design references. Collect patterns from 21st.dev, Arc and Mobbin; pick a direction. | `docs/DESIGN.md` |
| 20–21 Nov | Decide hosting and set up a preview deploy. | Preview URL |
| 21–25 Nov | Build against the jobs and the design direction. | Feature-complete preview |
| 25–26 Nov | Checks on a real phone and by keyboard, then release. | Live site |

## Open decisions

1. **Public or private data.** The data is Crunchbase's, republished by IESE. Check Crunchbase's terms, or ask IESE's Entrepreneurship and Innovation Center, before the site goes public.
2. **Globe.** It shows the 10 startups in `prototype/locations.json`. Open: whether to extend locations (each is a manual lookup, and some sites block scraping or state no address); where employee count or funding stage would come from, since the source has neither (the card shows total raised instead); and how to handle pins that overlap, since eight of the ten are in Europe.
3. **Logos and photos.** The source hotlinks Crunchbase images. Decide whether to hotlink, cache, or stay text-only.
4. **Refresh cadence.** Manual `./scraper/run.sh` for now; a scheduled job only if the site stays up past launch.
5. **Missing fields.** Country and sector are not in the source. Adding them means another data source.
6. **Name and domain.**
