"""Records one workflow run: Sonnet-confirmed founders go to alumni.csv, everyone else searched
goes to alumni-notfound.csv.

    python3 scraper/alumni_record.py <workflow journal.jsonl> <date>

Run scraper/alumni.py afterwards; move any row it rejects from alumni.csv to alumni-notfound.csv.
"""
import csv, json, pathlib, sys

HERE = pathlib.Path(__file__).parent
journal, date = sys.argv[1], sys.argv[2]
searched, verdicts = set(), {}
for line in open(journal, encoding="utf-8"):
    entry = json.loads(line)
    result = entry.get("result") if entry.get("type") == "result" else None
    for row in (result or {}).get("results", []) if isinstance(result, dict) else []:
        searched.add(row["id"])
        if "verdict" in row:
            verdicts[row["id"]] = row

rows = list(csv.DictReader(open(HERE / "alumni.csv", encoding="utf-8")))
have = {r["id"] for r in rows}
new = [v for v in verdicts.values() if v["verdict"] == "confirmed" and v["id"] not in have]
with open(HERE / "alumni.csv", "a", newline="", encoding="utf-8") as f:
    csv.writer(f).writerows([v["id"], v["source"], v["match"], v["programme"]] for v in new)
have |= {v["id"] for v in new}
known = {r["id"] for r in csv.DictReader(open(HERE / "alumni-notfound.csv"))}
missed = sorted(searched - have - known)
with open(HERE / "alumni-notfound.csv", "a", newline="") as f:
    csv.writer(f).writerows([pid, date] for pid in missed)
print(len(searched), "searched;", len(verdicts), "caught by Haiku;", len(new), "confirmed by Sonnet;", len(missed), "not found")
