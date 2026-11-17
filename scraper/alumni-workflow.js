export const meta = {
  name: 'alumni-evidence',
  description: 'Haiku finds a public page stating each founder studied at IESE; Sonnet fact-checks every catch',
  phases: [
    { title: 'Find', detail: 'Haiku searches for a page per founder', model: 'haiku' },
    { title: 'Fact-check', detail: 'Sonnet checks each catch', model: 'sonnet' },
  ],
}

const FOUND = {
  type: 'object',
  properties: {
    results: {
      type: 'array',
      items: {
        type: 'object',
        properties: { id: { type: 'string' }, source: { type: 'string' }, match: { type: 'string' } },
        required: ['id', 'source', 'match'],
      },
    },
  },
  required: ['results'],
}
const CHECKED = {
  type: 'object',
  properties: {
    results: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          verdict: { type: 'string', enum: ['confirmed', 'rejected', 'unsure'] },
          source: { type: 'string' },
          match: { type: 'string' },
          programme: { type: 'string', enum: ['degree', 'executive', 'exchange', 'unknown'] },
          corroboration: { type: 'string' },
          note: { type: 'string' },
        },
        required: ['id', 'verdict', 'source', 'match', 'programme', 'corroboration', 'note'],
      },
    },
  },
  required: ['results'],
}

const RULES = `Allowed sources, best first: pages on iese.edu, the company's own website, press articles or interviews, Wikipedia. NOT allowed as the source: crunchbase.com, linkedin.com, foundersradar.iese.edu.
The page must name the person and their company, so it is certainly this person and not a namesake.
Any IESE programme counts: MBA, Executive MBA, executive programmes such as PDD, PDG, PADE, AMP, and exchange terms.`

const findPrompt = (group) => `Research task. For EACH founder below, find ONE public web page that explicitly states the person studied at IESE Business School.

Founders (JSON): ${JSON.stringify(group)}

${RULES}
Work through the founders one at a time. For each: use web search, then fetch the page and read it yourself to confirm the sentence is really there. Spend about 5 searches per founder at most. Do not guess or infer; "not found" is a perfectly good answer.

Return one result per founder, using the founder's id exactly as given:
- found: source = the page URL; match = a short exact phrase copied character-for-character from the page text, 4 to 15 words, that contains the word IESE.
- not found: source = "" and match = "".`

const checkPrompt = (rows) => `Fact-check task. Another, cheaper model claims each page below states that the named founder studied at IESE Business School. Be sceptical: your job is to catch its mistakes.

Claims (JSON): ${JSON.stringify(rows)}

For EACH claim:
1. Fetch the source page yourself. Check that the quoted phrase is really on it, that it is about this person (not a namesake, not another person on the same page), and that the page ties the person to the named company. A statement in someone else's voice, or a general remark about IESE that does not say this person studied there, is not enough.
2. Look for independent corroboration with web search: a second page of any kind, including the person's LinkedIn profile or a search snippet of it (their LinkedIn URL is given where known). LinkedIn may block fetching; a search-result snippet is acceptable as corroboration, never as the source.
3. If the page is weak but you find a better allowed source, return that page and an exact phrase from it instead.
${RULES}

Return one result per claim, with the id exactly as given:
- verdict: "confirmed" only if you read the statement on the source page yourself; "rejected" if the page does not say it or is about someone else; "unsure" if you could not load the page or cannot tell.
- source and match: the page and exact phrase you verified (4 to 15 words copied character-for-character, containing the word IESE). Repeat the given ones if they hold.
- programme: degree (MBA, EMBA, master), executive (PDD, PDG, PADE, AMP, other executive education), exchange, or unknown.
- corroboration: URL of the second page, or "".
- note: one short sentence on what you found.`

const chunk = (list, n) => list.reduce((acc, x, i) => (i % n ? acc[acc.length - 1].push(x) : acc.push([x]), acc), [])
const byId = Object.fromEntries(args.founders.map((f) => [f.id, f]))

const fresh = pipeline(
  chunk(args.founders, args.perAgent || 1),
  (group, _g, i) => agent(findPrompt(group), { label: `find:${i + 1}`, phase: 'Find', model: 'haiku', schema: FOUND, agentType: 'general-purpose' }),
  async (found, group, i) => {
    const returned = (found && found.results) || []
    const catches = returned.filter((r) => r.source && r.match && byId[r.id])
    const misses = group.filter((f) => !catches.some((c) => c.id === f.id)).map((f) => f.id)
    if (!catches.length) return { misses, checked: [] }
    const claims = catches.map((c) => ({ ...c, name: byId[c.id].name, company: byId[c.id].company, linkedin: byId[c.id].linkedin }))
    const res = await agent(checkPrompt(claims), { label: `check:${i + 1}`, phase: 'Fact-check', model: 'sonnet', schema: CHECKED, agentType: 'general-purpose' })
    return { misses, haiku: catches, checked: (res && res.results) || [] }
  },
)
const again = parallel(
  chunk(args.recheck || [], 6).map((rows, i) => () =>
    agent(checkPrompt(rows), { label: `recheck:${i + 1}`, phase: 'Fact-check', model: 'sonnet', schema: CHECKED, agentType: 'general-purpose' }),
  ),
)
const [f, a] = await Promise.all([fresh, again])
return { fresh: f, recheck: a.filter(Boolean).flatMap((r) => r.results) }