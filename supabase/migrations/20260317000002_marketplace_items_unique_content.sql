-- Migration: marketplace_items unique content_item_id
-- Required for upsert in POST /api/marketplace/items (onConflict: 'content_item_id').
-- One content item can only have one marketplace listing.

create unique index if not exists marketplace_items_content_item_id_key
  on public.marketplace_items (content_item_id);
