#!/usr/bin/env bash
# Run verify_database.sql against the Supabase database.
# Requires either DATABASE_URL (from .env.local or env) or run manually in Dashboard.

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Load DATABASE_URL from .env.local if not already set
if [[ -z "${DATABASE_URL:-}" ]] && [[ -f "$PROJECT_ROOT/.env.local" ]]; then
  val=$(grep -E '^DATABASE_URL=' "$PROJECT_ROOT/.env.local" 2>/dev/null | sed 's/^DATABASE_URL=//')
  [[ -n "$val" ]] && export DATABASE_URL="$val"
fi
if [[ -z "${DATABASE_URL:-}" ]] && [[ -f "$PROJECT_ROOT/packages/web/.env.local" ]]; then
  val=$(grep -E '^DATABASE_URL=' "$PROJECT_ROOT/packages/web/.env.local" 2>/dev/null | sed 's/^DATABASE_URL=//')
  [[ -n "$val" ]] && export DATABASE_URL="$val"
fi

if [[ -n "${DATABASE_URL:-}" ]]; then
  echo "Running verify_database.sql via psql..."
  psql "$DATABASE_URL" -f "$SCRIPT_DIR/verify_database.sql"
else
  echo "DATABASE_URL not set. To run verify automatically:"
  echo "  1. Get connection string from Supabase Dashboard → Project Settings → Database"
  echo "  2. Add to .env.local: DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"
  echo "  3. Run: npm run verify:db"
  echo ""
  echo "Or run manually:"
  echo "  1. Open https://supabase.com/dashboard → your project → SQL Editor"
  echo "  2. Paste contents of: supabase/scripts/verify_database.sql"
  echo "  3. Run"
  echo ""
  echo "Migrations status: running supabase db push..."
  cd "$PROJECT_ROOT" && npx supabase db push
fi
