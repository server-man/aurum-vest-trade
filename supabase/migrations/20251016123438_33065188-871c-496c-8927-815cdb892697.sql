-- Drop contents_bot table
DROP TABLE IF EXISTS public.contents_bot CASCADE;

-- Drop content-bot-media storage bucket
DELETE FROM storage.buckets WHERE id = 'content-bot-media';