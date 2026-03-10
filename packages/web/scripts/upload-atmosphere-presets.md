# Atmosphere Audio Presets — Upload Guide

The ambient/atmosphere layer requires looping MP3 files uploaded to Supabase Storage.
Until these files are uploaded, the atmosphere layer will be silent.

## Storage Configuration

Bucket name: `atmosphere`
Bucket type: **Public** (required for direct URL playback without signed URLs)

## Files Required

| Preset ID    | Storage path              | Description                        |
|--------------|---------------------------|------------------------------------|
| `rain`       | `atmosphere/rain.mp3`     | Soft, steady rainfall              |
| `forest`     | `atmosphere/forest.mp3`   | Birds, breeze, rustling leaves     |
| `ocean`      | `atmosphere/ocean.mp3`    | Slow, rhythmic waves               |
| `white-noise`| `atmosphere/white-noise.mp3` | Steady broadband ambient sound  |

## Audio Spec

- Format: MP3 (192kbps or higher)
- Sample rate: 44100 Hz stereo
- Duration: 3–5 minutes (the player loops automatically)
- Loudness: Normalize to -14 LUFS before uploading (use the `/api/audio/normalize` endpoint or Auphonic)
- The file must loop cleanly — use a crossfade at the loop point in Audacity/Logic if needed

## Sources (free-use options)

- [Freesound.org](https://freesound.org) — search for "rain loop", "forest ambience", "ocean waves"
- [Pixabay Audio](https://pixabay.com/music/) — Nature & Ambient category
- [BBC Sound Effects Library](https://sound-effects.bbcrewind.co.uk/) — free for personal/non-commercial

## Upload via Supabase Dashboard

1. Go to Supabase Dashboard → Storage → Buckets
2. Create bucket `atmosphere` if it doesn't exist (set to Public)
3. Upload each file to the path listed above
4. Verify the public URL works:
   `https://{your-project}.supabase.co/storage/v1/object/public/atmosphere/rain.mp3`

## Upload via Supabase CLI

```bash
# Install Supabase CLI if needed: npm install -g supabase
supabase storage cp ./atmosphere/rain.mp3 ss://atmosphere/rain.mp3 --project-ref YOUR_PROJECT_REF
supabase storage cp ./atmosphere/forest.mp3 ss://atmosphere/forest.mp3 --project-ref YOUR_PROJECT_REF
supabase storage cp ./atmosphere/ocean.mp3 ss://atmosphere/ocean.mp3 --project-ref YOUR_PROJECT_REF
supabase storage cp ./atmosphere/white-noise.mp3 ss://atmosphere/white-noise.mp3 --project-ref YOUR_PROJECT_REF
```

## After Upload

The URLs are auto-resolved by `packages/web/src/utils/atmosphere.ts` using
`NEXT_PUBLIC_SUPABASE_URL`. No code changes needed after uploading the files.

Run the health check to confirm all files are accessible:
```
GET /api/audio/atmosphere-status
```
