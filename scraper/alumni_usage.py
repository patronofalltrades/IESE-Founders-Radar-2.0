"""Adds up token use and API-rate cost from agent transcripts (JSONL), by model.

    python3 scraper/alumni_usage.py <label> <founders> <transcript>...

Prints a row per model and appends them to scraper/alumni-runs.csv. Prices are US dollars per
million tokens at Anthropic's list API rates on 17 Nov 2026: input, 5-minute cache write, cache
read, output. Haiku's cache-read rate is assumed to be a tenth of its input rate.
"""
import csv, json, pathlib, sys

PRICE = {"claude-haiku-5-5": (0.10, 0.125, 0.01, 0.50), "claude-sonnet-5-5": (2.00, 2.50, 0.10, 10.00)}
FIELDS = ("input_tokens", "cache_creation_input_tokens", "cache_read_input_tokens", "output_tokens")

label, founders, paths = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
seen, use, agents = {}, {}, {}
for path in paths:
    for line in open(path, encoding="utf-8", errors="ignore"):
        try:
            m = json.loads(line).get("message") or {}
        except ValueError:
            continue
        if isinstance(m, dict) and m.get("usage") and m.get("id"):
            seen[m["id"]] = (m.get("model", "?"), m["usage"], path)  # one message spans several lines
for model, usage, path in seen.values():
    row = use.setdefault(model, [0, 0, 0, 0])
    for i, f in enumerate(FIELDS):
        row[i] += usage.get(f) or 0
    agents.setdefault(model, set()).add(path)

log = pathlib.Path(__file__).parent / "alumni-runs.csv"
new = not log.exists()
with open(log, "a", newline="") as f:
    w = csv.writer(f)
    if new:
        w.writerow(["run", "model", "founders", "agents", "input", "cache_write", "cache_read", "output", "usd", "usd_per_founder"])
    for model, row in sorted(use.items()):
        usd = sum(t * p for t, p in zip(row, PRICE.get(model, (0, 0, 0, 0)))) / 1e6
        w.writerow([label, model, founders, len(agents[model]), *row, round(usd, 4), round(usd / founders, 4)])
        print(label, model, "agents", len(agents[model]), dict(zip(FIELDS, row)), f"${usd:.4f}", f"${usd / founders:.4f}/founder")
