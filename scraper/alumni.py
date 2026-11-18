"""Writes prototype/alumni.json from scraper/alumni.csv.

Each row names a founder, a public page, and a sentence on that page that states their IESE degree.
A row is only written if the sentence is still on the page and mentions IESE, and the page also
names the person and one of their companies (any word of four letters or more from the company name).
The source sometimes gets a name wrong ("Ana Valls" for Ana Maiques). A row's `name` column then
gives the name as the page writes it; it is accepted only if two of its words are in the source's
name or Crunchbase id for that person. Pages on the source site, Crunchbase and LinkedIn
do not count: they are the claim being checked.

Fetches from here fail now and then. A founder already in alumni.json with the same page keeps
that confirmation when the page cannot be read this time: the request fails, the site answers
with an error other than 404 or 410, or it answers without the person's name on it (a bot check).
They are dropped only when the page is gone or loads with their name but without the sentence.
"""
import csv, html, json, pathlib, re, subprocess, sys, time, unicodedata, urllib.parse

HERE = pathlib.Path(__file__).parent
BROWSER = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
BARRED = ("crunchbase.com", "linkedin.com", "foundersradar.iese.edu")


def get(url):
    """Returns the HTTP status (0 if the request failed) and the page."""
    run = subprocess.run(["curl", "-sS", "-L", "-m", "30", "--compressed", "-A", BROWSER, "-w", "\n%{http_code}", url],
                         capture_output=True)
    body, _, status = run.stdout.decode("utf-8", "ignore").rpartition("\n")
    return (int(status) if run.returncode == 0 and status.isdigit() else 0), body


def fold(s):
    s = html.unescape(re.sub(r"<script.*?</script>|<style.*?</style>|<[^>]+>", " ", s, flags=re.S))
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().casefold()
    return " ".join(re.findall(r"[a-z0-9]+", s))


data = json.load(open(HERE / "../prototype/data.json"))
people = {}  # id -> [name, companies]
for p in data["founders"]:
    people[p["id"]] = [p["n"], [p["c"]] if p["c"] else []]
for s in data["startups"]:
    for f in s.get("f", []):
        people.setdefault(f[3], [f[0], []])[1].append(s["n"])

before = {r["id"]: r["source"] for r in json.load(open(HERE / "../prototype/alumni.json"))}
out, kept, failed = [], [], []
for row in csv.DictReader(open(HERE / "alumni.csv", encoding="utf-8")):
    host = urllib.parse.urlparse(row["source"]).netloc
    name, companies = people.get(row["id"], ["", []])
    known = set(fold(name + " " + row["id"]).split())
    who = fold(row.get("name") or name).split()
    match = fold(row["match"])
    for attempt in 1, 2, 3:  # some sites serve a bot check now and then; retrying settles it
        status, page = get(row["source"])
        page = fold(page)
        named = bool(who) and f" {' '.join(who[:2])} " in f" {page} "
        ok = (named and len(known.intersection(who)) >= min(2, len(who)) and not host.endswith(BARRED)
              and "iese" in match.split() and f" {match} " in f" {page} "
              and any(f" {w} " in f" {page} " for c in companies for w in fold(c).split() if len(w) >= 4))
        if ok or attempt == 3:
            break
        time.sleep(20)
    unread = status not in (404, 410) and not (status == 200 and named)
    if ok or (unread and before.get(row["id"]) == row["source"]):
        out.append({"id": row["id"], "source": row["source"]})
        if not ok:
            kept.append(row["id"])
    else:
        failed.append(row["id"])
    time.sleep(0.5)

json.dump(out, open(HERE / "../prototype/alumni.json", "w"), ensure_ascii=False, indent=1)
print(len(out), "written;", "kept without re-reading:", kept or "none", "; failed:", failed or "none")
sys.exit(1 if failed else 0)
