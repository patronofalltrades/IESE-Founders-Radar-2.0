# Plan

Goal: a better Founders Radar, live by Thursday 26 November 2026.

## Done

- Scraped the source site and normalised it into `prototype/data.json` (16 Nov).
- Built a working single-page prototype in `prototype/` (16 Nov).
- Scaffolded the site: Next.js, TypeScript, Tailwind, shadcn (17 Nov).
- Vendored the 21st.dev globe component into `components/ui/testimonial-globe.tsx` (17 Nov).

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
2. **Globe data.** The globe needs a latitude and longitude per pin, and the scraped data has no location at all. Until a source is chosen (Crunchbase headquarters via the Crunchbase connector is the likeliest), the globe stays off the page. It is also built for testimonials: its card shows a quote and star rating and its counters say "reviews", so it needs adapting to startups.
3. **Logos and photos.** The source hotlinks Crunchbase images. Decide whether to hotlink, cache, or stay text-only.
4. **Refresh cadence.** Manual `./scraper/run.sh` for now; a scheduled job only if the site stays up past launch.
5. **Missing fields.** Country and sector are not in the source. Adding them means another data source.
6. **Name and domain.**
