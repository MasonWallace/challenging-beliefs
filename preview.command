#!/bin/bash
# Double-click this to preview whatever branch is currently checked out.
# Opens the site at http://localhost:8000 — this is your local copy only,
# nothing here is live until it's merged to main and pushed.

cd "$(dirname "$0")" || exit 1

BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
echo "----------------------------------------------------"
echo "  Previewing branch: $BRANCH"
echo "  Open: http://localhost:8000"
echo ""
echo "  This is LOCAL ONLY. whichgospel.com is unchanged."
echo "  Press Ctrl+C in this window to stop."
echo "----------------------------------------------------"
echo ""

sleep 1
open "http://localhost:8000" 2>/dev/null &
python3 -m http.server 8000
