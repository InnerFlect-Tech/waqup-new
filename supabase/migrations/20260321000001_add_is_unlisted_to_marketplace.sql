-- Add is_unlisted flag to marketplace_items.
-- Unlisted items are accessible via direct /play/[id] link but do NOT appear
-- in the public marketplace feed. This enables private sharing via QR codes
-- and direct links without cluttering the main discovery surface.

alter table public.marketplace_items
  add column if not exists is_unlisted boolean not null default false;

-- Index so the marketplace feed query can efficiently filter out unlisted items
create index if not exists marketplace_items_is_unlisted_idx
  on public.marketplace_items (is_unlisted)
  where is_unlisted = false;

-- Update the marketplace feed RLS / query convention: existing queries
-- already filter on is_listed = true. Callers should additionally add
-- is_unlisted = false when building the public discovery feed.
-- No RLS changes needed — the existing row-level policies remain intact.
