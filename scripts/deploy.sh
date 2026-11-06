#!/bin/sh
# Build + publication en production sur Netlify.
# Utilisé par le hook .githooks/post-commit, et appelable à la main.

cd "$(git rev-parse --show-toplevel)" || exit 1

LOG=".freebuff/logs/deploy.log"
SITE="e3696b71-4a9c-4090-9c20-fb0beb56e0ee"
MSG="auto: $(git log -1 --pretty=%s 2>/dev/null)"

mkdir -p .freebuff/logs
echo "=== $(date '+%Y-%m-%d %H:%M:%S') $MSG ===" >> "$LOG"

if npm run build >> "$LOG" 2>&1 \
  && npx --no-install netlify-cli deploy --prod --dir=dist --site "$SITE" --message "$MSG" >> "$LOG" 2>&1; then
  echo "✔ Publié sur https://auren-architecture.netlify.app — $MSG"
  echo "  Log : $LOG"
else
  echo "✖ Déploiement échoué — voir $LOG"
  exit 1
fi
