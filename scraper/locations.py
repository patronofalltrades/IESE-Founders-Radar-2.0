"""Writes prototype/locations.json from scraper/locations.csv.

Each row names a startup, a city, and a page on the company's own site that states it.
A row is only written if `match` still appears on that page; the city is then geocoded
with OpenStreetMap Nominatim (data © OpenStreetMap contributors, ODbL).
"""
import csv, html, json, pathlib, re, subprocess, sys, time, urllib.parse

HERE = pathlib.Path(__file__).parent
BROWSER = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36"


def get(url, agent):
    return subprocess.run(["curl", "-sS", "-L", "-m", "30", "--compressed", "-A", agent, url],
                          capture_output=True, check=True).stdout.decode("utf-8", "ignore")


def text(page):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<style.*?</style>|<[^>]+>", " ", page, flags=re.S)))


known = {s["id"] for s in json.load(open(HERE / "../prototype/data.json"))["startups"]}
out, failed = [], []
for row in csv.DictReader(open(HERE / "locations.csv", encoding="utf-8")):
    page = get(row["source"], BROWSER)
    if row["id"] not in known or (row["match"] not in page and row["match"] not in text(page)):
        failed.append(row["id"])
        continue
    q = urllib.parse.urlencode({"city": row["city"], "countrycodes": row["country"].lower(), "format": "json", "limit": 1})
    hit = json.loads(get("https://nominatim.openstreetmap.org/search?" + q, "founders-radar-scraper/0.1"))[0]
    out.append({"id": row["id"], "city": row["city"], "country": row["country"],
                "lat": round(float(hit["lat"]), 2), "lng": round(float(hit["lon"]), 2), "source": row["source"]})
    time.sleep(1.1)  # Nominatim allows one request per second

json.dump(out, open(HERE / "../prototype/locations.json", "w"), ensure_ascii=False, indent=1)
print(len(out), "written;", "failed:", failed or "none")
sys.exit(1 if failed else 0)
