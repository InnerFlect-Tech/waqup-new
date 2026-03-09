-- Audio storage bucket for user-generated content
-- Private by default; marketplace-enabled items get public RLS access

-- Create the audio bucket (private by default)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'audio',
  'audio',
  false,
  52428800, -- 50MB limit per file
  array['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/aac']
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ── RLS Policies ─────────────────────────────────────────────────────────────

-- Owner can upload, read, update, and delete their own files
-- Files are stored at path: {userId}/{contentId}.mp3
create policy "Owner audio access"
  on storage.objects for all
  using (
    bucket_id = 'audio'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'audio'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Marketplace: public read for files whose content_item is marketplace-enabled
-- This allows sharing and discovery outside the app
create policy "Marketplace public read"
  on storage.objects for select
  using (
    bucket_id = 'audio'
    and exists (
      select 1 from public.content_items ci
      where ci.id::text = replace(storage.filename(name), '.mp3', '')
      and ci.marketplace_enabled = true
    )
  );
