-- Allow audio/mp4 in the audio bucket for Safari recordings
-- Chrome uses audio/webm; Safari uses audio/mp4. Both are normalized in the upload API.

update storage.buckets
set allowed_mime_types = array['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/mp4', 'audio/aac']
where id = 'audio';
