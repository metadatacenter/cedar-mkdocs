#!/usr/bin/env bash
# Fast standalone preview of a single tutorial with live reload — no MkDocs build,
# no Read the Docs wait. Renders docs/tutorials/*.md client-side (marked.js) and
# re-fetches once a second, so edits and regenerated screenshots show immediately.
# This is a lightweight single-page view; for the full themed site use `mkdocs serve`.
#
#   ./preview.sh            # preview docs/tutorials/cedar_tutorial.md
#   ./preview.sh 8123       # on a specific port
# Switch tutorials with the ?src= query, e.g. open:
#   http://localhost:8765/tools/preview/?src=/docs/tutorials/cedar_term_tutorial.md
#   http://localhost:8765/tools/preview/?src=/docs/tutorials/cedar_mcps_tutorial.md
set -euo pipefail
cd "$(dirname "$0")"
PORT="${1:-8765}"
URL="http://localhost:${PORT}/tools/preview/"
echo "Preview at ${URL}  (Ctrl-C to stop)"
command -v open >/dev/null && open "${URL}" &
exec python3 -m http.server "${PORT}" --bind 127.0.0.1
