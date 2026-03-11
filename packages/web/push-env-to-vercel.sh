#!/usr/bin/env bash
# One-time script: push packages/web/.env.local vars to Vercel (Production).
# Reads .env.local and pipes each value to vercel env add (no secrets in argv/history).
# Requires: VERCEL_TOKEN in env or in .env.local (create at https://vercel.com/account/tokens).
# Run from packages/web: bash push-env-to-vercel.sh
#
# SAFETY: These vars are NEVER pushed (set them in Vercel Dashboard for production):
#   - VERCEL_TOKEN (CLI only)
#   - NEXT_PUBLIC_APP_URL (local is localhost; production must be your live URL in Vercel)
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
# Load VERCEL_TOKEN from .env.local if not already set (create at https://vercel.com/account/tokens)
if [[ -z "$VERCEL_TOKEN" ]] && [[ -f .env.local ]]; then
  v="$(grep -E '^VERCEL_TOKEN=' .env.local 2>/dev/null | cut -d= -f2- | tr -d '"' | tr -d "'")"
  [[ -n "$v" ]] && export VERCEL_TOKEN="$v"
fi
PROJECT_ID="${VERCEL_PROJECT_ID:-prj_lsSCOtyHGFYhVNxgKlx0ZroGn4Zl}"
SCOPE="${VERCEL_SCOPE:-indiasfernandes-projects}"
VERCEL_EXTRA=()
[[ -n "$VERCEL_TOKEN" ]] && VERCEL_EXTRA=(--token "$VERCEL_TOKEN")
# Ensure project is linked (idempotent if already linked; scope required in non-interactive)
npx vercel link --project "$PROJECT_ID" --scope "$SCOPE" --yes "${VERCEL_EXTRA[@]}" 2>/dev/null || true
ENV_FILE=".env.local"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE"
  exit 1
fi
while IFS= read -r line; do
  line="${line%%#*}"
  line="${line#"${line%%[![:space:]]*}"}"
  line="${line%"${line##*[![:space:]]}"}"
  [[ -z "$line" ]] && continue
  if [[ "$line" != *=* ]]; then continue; fi
  name="${line%%=*}"
  name="${name%"${name##*[![:space:]]}"}"
  value="${line#*=}"
  value="${value#"${value%%[![:space:]]*}"}"
  [[ -z "$name" ]] && continue
  # Don't push CLI token to Vercel env
  [[ "$name" == "VERCEL_TOKEN" ]] && continue
  # Never push app URL: local is localhost; production must be set in Vercel Dashboard
  [[ "$name" == "NEXT_PUBLIC_APP_URL" ]] && continue
  printf '%s' "$value" | npx vercel env add "$name" production --scope "$SCOPE" "${VERCEL_EXTRA[@]}" 2>&1 || true
done < "$ENV_FILE"
echo "Done."
