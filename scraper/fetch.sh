#!/usr/bin/env bash
# Downloads every listing page into scraper/raw/. Page counts are read from the site's own pagination.
set -euo pipefail
cd "$(dirname "$0")"; mkdir -p raw
B=https://foundersradar.iese.edu
last(){ curl -sS -L -A "Mozilla/5.0" "$B/$1" | grep -oE 'page=[0-9]+' | cut -d= -f2 | sort -n | tail -1; }
get(){ curl -sS -L --retry 3 -A "Mozilla/5.0" -o "raw/$1_$2.html" "$B/$3?page=$2"; sleep 0.3; }
export -f get; export B
(for i in $(seq 1 "$(last startups)"); do echo "s $i startups"; done
 for i in $(seq 1 "$(last founders)"); do echo "f $i founders"; done) | xargs -P 3 -L 1 bash -c 'get $0 $1 $2'
ls raw | wc -l
