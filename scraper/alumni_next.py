"""Prints the next founders to search, as the JSON input for scraper/alumni-workflow.js.

    python3 scraper/alumni_next.py <how many> [founders per Haiku agent]

Skips anyone already in alumni.csv or alumni-notfound.csv. Founders of the most-funded startups
come first, then the remaining founder cards in source order.
"""
import csv, json, pathlib, sys

HERE = pathlib.Path(__file__).parent
ids = lambda name: {r["id"] for r in csv.DictReader(open(HERE / name, encoding="utf-8"))}
done = ids("alumni.csv") | ids("alumni-notfound.csv")
data = json.load(open(HERE / "../prototype/data.json"))

queue = {}
for s in sorted(data["startups"], key=lambda s: -s.get("r", 0)):
    for name, role, linkedin, pid in s.get("f", []):
        queue.setdefault(pid, {"id": pid, "name": name, "company": s["n"], "role": role, "linkedin": linkedin})
for p in data["founders"]:
    if p["c"]:
        queue.setdefault(p["id"], {"id": p["id"], "name": p["n"], "company": p["c"], "role": p["ro"], "linkedin": p["li"]})

todo = [f for pid, f in queue.items() if pid not in done]
print(json.dumps({"founders": todo[: int(sys.argv[1])], "perAgent": int(sys.argv[2]) if len(sys.argv) > 2 else 1},
                 ensure_ascii=False))
print(len(todo), "left to search", file=sys.stderr)
