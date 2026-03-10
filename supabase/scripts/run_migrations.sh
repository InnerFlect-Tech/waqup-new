#!/usr/bin/env bash
# =============================================================================
# waQup — Run Supabase Migrations
# =============================================================================
# Applies all migrations in supabase/migrations/ to the linked remote project.
# Use: ./supabase/scripts/run_migrations.sh
# Or:  npm run supabase:push
# =============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$PROJECT_ROOT"

# Check Supabase CLI
if ! command -v supabase &> /dev/null; then
  echo "Error: Supabase CLI not found. Install with: npm install -g supabase"
  exit 1
fi

# Check if linked (optional — db push will prompt if not)
if ! supabase status &> /dev/null 2>&1; then
  echo "Note: Project may not be linked. Run 'supabase link --project-ref YOUR_REF' first for remote."
  echo "For local: run 'supabase start' then 'supabase db reset'"
  echo ""
fi

echo "→ Pushing migrations to database..."
supabase db push

echo ""
echo "✅ Migrations applied successfully."
echo ""
echo "Next: Run verify_database.sql in Supabase SQL Editor to confirm schema."
echo "  File: supabase/scripts/verify_database.sql"
echo ""
