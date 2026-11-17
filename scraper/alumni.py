"""Writes prototype/alumni.json from scraper/alumni.csv.

Each row names a founder, a public page, and a sentence on that page that states their IESE degree.
A row is only written if the sentence is still on the page and mentions IESE, and the page also
names the person and one of their companies. Pages on the source site, Crunchbase and LinkedIn
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
    page, match, who = fold(get(row["source"])), fold(row["match"]), fold(name).split()
    ok = (who and not host.endswith(BARRED) and "iese" in match.split() and f" {match} " in f" {page} "
          and f" {' '.join(who[:2])} " in f" {page} "
          and any(f" {fold(c).split()[0]} " in f" {page} " for c in companies if fold(c)))
    if ok:
        out.append({"id": row["id"], "source": row["source"]})
    else:
        failed.append(row["id"])
    time.sleep(0.5)

json.dump(out, open(HERE / "../prototype/alumni.json", "w"), ensure_ascii=False, indent=1)
print(len(out), "written;", "failed:", failed or "none")
sys.exit(1 if failed else 0)
