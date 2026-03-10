-- Migration: audio_system_buckets
-- Supports the audio system audit implementation: recordings path in audio bucket,
-- and the atmosphere bucket for ambient layer presets.
--
-- 1. Extend the audio bucket to allow recordings/{userId}/... path
--    The existing "Owner audio access" policy uses (storage.foldername(name))[1].
--    For recordings/{userId}/... the first folder is "recordings", not userId.
--    We add a new policy for the recordings path.
--
-- 2. Create the atmosphere bucket (public) for ambient presets (rain, forest, ocean, white-noise).
--    Public so the player can fetch files by URL without signed URLs.

-- ─── 1. Recordings path policy ─────────────────────────────────────────────────
-- Allow authenticated users to upload/read their own recordings at recordings/{userId}/...
-- The existing "Owner audio access" covers {userId}/{contentId}.mp3.
-- This policy covers recordings/{userId}/{contentId}.webm|.mp4
drop policy if exists "Owner recordings access" on storage.objects;
create policy "Owner recordings access"
  on storage.objects for all
  using (
    bucket_id = 'audio'
    and (storage.foldername(name))[1] = 'recordings'
    and auth.uid()::text = (storage.foldername(name))[2]
  )
  with check (
    bucket_id = 'audio'
    and (storage.foldername(name))[1] = 'recordings'
    and auth.uid()::text = (storage.foldername(name))[2]
  );

-- ─── 2. Atmosphere bucket (public) ───────────────────────────────────────────
-- Ambient preset files: atmosphere/rain.mp3, atmosphere/forest.mp3, etc.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'atmosphere',
  'atmosphere',
  true,
  10485760, -- 10MB per file (3–5 min looping MP3s)
  array['audio/mpeg', 'audio/mp3']
)
on conflict (id) do update set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public read — anyone can fetch atmosphere files by URL
drop policy if exists "Public atmosphere read" on storage.objects;
create policy "Public atmosphere read"
  on storage.objects for select
  using (bucket_id = 'atmosphere');

-- Only superadmins can upload atmosphere files (via Dashboard or API).
-- Dashboard uploads use the session; API uploads must use a superadmin session.
drop policy if exists "Superadmin atmosphere write" on storage.objects;
create policy "Superadmin atmosphere write"
  on storage.objects for insert
  with check (
    bucket_id = 'atmosphere'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'superadmin'
    )
  );

-- Superadmins can also update/delete atmosphere files
create policy "Superadmin atmosphere update"
  on storage.objects for update
  using (
    bucket_id = 'atmosphere'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'superadmin')
  );

drop policy if exists "Superadmin atmosphere delete" on storage.objects;
create policy "Superadmin atmosphere delete"
  on storage.objects for delete
  using (
    bucket_id = 'atmosphere'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'superadmin')
  );
