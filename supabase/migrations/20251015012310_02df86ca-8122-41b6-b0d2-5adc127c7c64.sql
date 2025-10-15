-- Create email_templates table
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can manage email templates
CREATE POLICY "Admins can manage email templates"
ON public.email_templates
FOR ALL
TO authenticated
USING (public.is_admin_or_sub_admin(auth.uid()));

-- Create cms_content table
CREATE TABLE IF NOT EXISTS public.cms_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  meta_description TEXT,
  meta_keywords TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  publish_date TIMESTAMPTZ,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can manage CMS content
CREATE POLICY "Admins can manage CMS content"
ON public.cms_content
FOR ALL
TO authenticated
USING (public.is_admin_or_sub_admin(auth.uid()));

-- Policy: Everyone can view published content
CREATE POLICY "Everyone can view published content"
ON public.cms_content
FOR SELECT
TO public
USING (is_published = true);

-- Add updated_at trigger for email_templates
CREATE TRIGGER update_email_templates_updated_at
BEFORE UPDATE ON public.email_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add updated_at trigger for cms_content
CREATE TRIGGER update_cms_content_updated_at
BEFORE UPDATE ON public.cms_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for CMS slug lookup
CREATE INDEX IF NOT EXISTS idx_cms_content_slug ON public.cms_content(slug);
CREATE INDEX IF NOT EXISTS idx_cms_content_published ON public.cms_content(is_published, publish_date);