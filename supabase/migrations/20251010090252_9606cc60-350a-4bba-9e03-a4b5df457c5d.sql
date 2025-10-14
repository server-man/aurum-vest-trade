-- Create storage bucket for generated media content
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'content-bot-media',
  'content-bot-media',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'audio/mpeg', 'audio/wav']
);

-- Storage policies for content-bot-media bucket
CREATE POLICY "Admins can upload media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'content-bot-media' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update media"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'content-bot-media' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete media"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'content-bot-media' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Public can view media"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'content-bot-media');

-- Create contents_bot table
CREATE TABLE public.contents_bot (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'audio')),
  media_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('runware', 'openrouter')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on contents_bot table
ALTER TABLE public.contents_bot ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contents_bot - Admin only access
CREATE POLICY "Admins can view all content"
ON public.contents_bot
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert content"
ON public.contents_bot
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::app_role) AND
  auth.uid() = user_id
);

CREATE POLICY "Admins can update content"
ON public.contents_bot
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete content"
ON public.contents_bot
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_contents_bot_updated_at
BEFORE UPDATE ON public.contents_bot
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();