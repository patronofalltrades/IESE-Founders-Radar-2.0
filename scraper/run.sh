#!/usr/bin/env bash
# Full refresh: download, parse, write prototype/data.json.
set -euo pipefail
cd "$(dirname "$0")"
./fetch.sh
python3 -I parse.py raw raw/parsed.json
python3 -I build.py raw/parsed.json ../prototype/data.json
