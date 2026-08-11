#!/bin/bash
# Double-click to publish the CURRENT branch to the Cloudflare preview site.
#
#   Preview URL:  https://whichgospel-dev.pages.dev
#
# This NEVER touches whichgospel.com — the live site is on GitHub Pages and
# is only changed by merging into main and pushing.
#
# The first run opens a browser to log in to Cloudflare. After that it's silent.

cd "$(dirname "$0")" || exit 1

WRANGLER="$HOME/CAIAC/caiac-website/node_modules/.bin/wrangler"
[ -x "$WRANGLER" ] || WRANGLER="npx wrangler@latest"

BRANCH=$(git branch --show-current 2>/dev/null || echo dev)

echo "----------------------------------------------------"
echo "  Publishing branch '$BRANCH' to the preview site"
echo "  https://whichgospel-dev.pages.dev"
echo ""
echo "  whichgospel.com is NOT affected."
echo "----------------------------------------------------"
echo ""

# Refresh Cloudflare auth if the token has lapsed (opens a browser once).
if ! $WRANGLER whoami 2>&1 | grep -q "You are logged in"; then
  echo "Cloudflare login needed — a browser window will open."
  $WRANGLER login || { echo "Login failed."; read -r -p "Press return to close."; exit 1; }
fi

$WRANGLER pages deploy . \
  --project-name whichgospel-dev \
  --branch "$BRANCH" \
  --commit-dirty=true

echo ""
echo "Done. If it failed partway with a network error, just run it again —"
echo "already-uploaded files are cached, so the retry picks up where it left off."
echo ""
read -r -p "Press return to close."
