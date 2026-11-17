"""Writes prototype/alumni.json from scraper/alumni.csv.

Each row names a founder, a public page, and a sentence on that page that states their IESE degree.
A row is only written if the sentence is still on the page and mentions IESE, and the page also
names the person and one of their companies (any word of four letters or more from the company name).
The source sometimes gets a name wrong ("Ana Valls" for Ana Maiques). A row's `name` column then
gives the name as the page writes it; it is accepted only if two of its words are in the source's
name or Crunchbase id for that person. Pages on the source site, Crunchbase and LinkedIn
do not count: they are the claim being checked.
"""
import csv, html, json, pathlib, re, subprocess, sys, time, unicodedata, urllib.parse

HERE = pathlib.Path(__file__).parent
BROWSER = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
BARRED = ("crunchbase.com", "linkedin.com", "foundersradar.iese.edu")


def get(url):
    return subprocess.run(["curl", "-sS", "-L", "-m", "30", "--compressed", "-A", BROWSER, url],
                          capture_output=True).stdout.decode("utf-8", "ignore")


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

out, failed = [], []
for row in csv.DictReader(open(HERE / "alumni.csv", encoding="utf-8")):
    host = urllib.parse.urlparse(row["source"]).netloc
    name, companies = people.get(row["id"], ["", []])
    known = set(fold(name + " " + row["id"]).split())
    who = fold(row.get("name") or name).split()
    match = fold(row["match"])
    for attempt in 1, 2:  # some sites serve a bot check now and then; one retry settles it
        page = fold(get(row["source"]))
        ok = (who and len(known.intersection(who)) >= min(2, len(who)) and not host.endswith(BARRED)
              and "iese" in match.split() and f" {match} " in f" {page} "
              and f" {' '.join(who[:2])} " in f" {page} "
              and any(f" {w} " in f" {page} " for c in companies for w in fold(c).split() if len(w) >= 4))
        if ok or attempt == 2:
            break
        time.sleep(5)
    if ok:
        out.append({"id": row["id"], "source": row["source"]})
    else:
        failed.append(row["id"])
    time.sleep(0.5)

json.dump(out, open(HERE / "../prototype/alumni.json", "w"), ensure_ascii=False, indent=1)
print(len(out), "written;", "failed:", failed or "none")
sys.exit(1 if failed else 0)
