#!/usr/bin/env bash
# =============================================================================
# Run seed script for daniel.indias@gmail.com
# =============================================================================
# Seeds content_items, marketplace_items, practice_sessions, etc. for testing.
# Requires: daniel.indias@gmail.com must exist (sign up in app first).
#
# Usage:
#   Local (supabase start):  npm run seed:daniel
#   Remote:                  DATABASE_URL="postgresql://..." npm run seed:daniel
#
# Get DATABASE_URL from: Supabase Dashboard → Project Settings → Database →
#   Connection string (URI) — use the "Session mode" or "Transaction" pooler URL.
# =============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SEED_FILE="$SCRIPT_DIR/seed_daniel_indias.sql"
cd "$PROJECT_ROOT"

# Load env from common locations (DATABASE_URL for remote Supabase)
for f in .env .env.local .env.development .env.development.local packages/web/.env.local; do
  [[ -f "$f" ]] && set -a && source "$f" && set +a && break
done

if [[ ! -f "$SEED_FILE" ]]; then
  echo "Error: Seed file not found: $SEED_FILE"
  exit 1
fi

# Use DATABASE_URL if set (remote); otherwise use local Supabase defaults
if [[ -n "$DATABASE_URL" ]]; then
  DB_URL="$DATABASE_URL"
  echo "→ Using DATABASE_URL (remote/hosted database)"
else
  # Local Supabase — default postgres connection (supabase start)
  DB_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
  echo "→ Using local Supabase (127.0.0.1:54322)"
  echo "  Tip: For remote, set DATABASE_URL and run again."
fi

if ! command -v psql &> /dev/null; then
  echo "Error: psql not found. Install PostgreSQL client tools or use Homebrew: brew install libpq"
  echo "  Then add to PATH: export PATH=\"/opt/homebrew/opt/libpq/bin:\$PATH\""
  exit 1
fi

echo "→ Running seed for daniel.indias@gmail.com..."
psql "$DB_URL" -f "$SEED_FILE" -v ON_ERROR_STOP=1

echo ""
echo "✅ Seed complete. Visit /marketplace to see example cards."
echo ""
