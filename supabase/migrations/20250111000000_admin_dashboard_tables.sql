-- Create website_pages table for Website Manager
CREATE TABLE IF NOT EXISTS public.website_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  meta_description TEXT,
  seo_tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft', 'archived')),
  page_type TEXT NOT NULL DEFAULT 'page',
  template TEXT NOT NULL DEFAULT 'default',
  featured_image TEXT,
  content_images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Create page_templates table for Website Manager
CREATE TABLE IF NOT EXISTS public.page_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  template_type TEXT NOT NULL DEFAULT 'page',
  structure JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create newsletter_subscribers table for Newsletter Manager
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  source TEXT NOT NULL DEFAULT 'manual',
  tags TEXT[] DEFAULT '{}',
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  last_email_sent TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create newsletter_campaigns table for Newsletter Manager
CREATE TABLE IF NOT EXISTS public.newsletter_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'failed', 'cancelled')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  recipient_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  bounce_count INTEGER DEFAULT 0,
  unsubscribe_count INTEGER DEFAULT 0,
  template_id TEXT,
  sender_name TEXT DEFAULT 'Agentic AI',
  sender_email TEXT DEFAULT 'info@agentic-ai.ltd',
  preview_text TEXT,
  tags TEXT[] DEFAULT '{}',
  target_audience JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update generated_content table to include new fields for enhanced content generation
ALTER TABLE public.generated_content 
ADD COLUMN IF NOT EXISTS primary_keyword TEXT,
ADD COLUMN IF NOT EXISTS secondary_keywords TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS featured_image TEXT,
ADD COLUMN IF NOT EXISTS content_images TEXT[] DEFAULT '{}';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_website_pages_slug ON public.website_pages(slug);
CREATE INDEX IF NOT EXISTS idx_website_pages_status ON public.website_pages(status);
CREATE INDEX IF NOT EXISTS idx_website_pages_page_type ON public.website_pages(page_type);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON public.newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_status ON public.newsletter_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_generated_content_slug ON public.generated_content(slug);
CREATE INDEX IF NOT EXISTS idx_generated_content_status ON public.generated_content(status);

-- Enable RLS
ALTER TABLE public.website_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_campaigns ENABLE ROW LEVEL SECURITY;

-- RLS Policies for website_pages (admin access only)
CREATE POLICY "Admins can manage website pages" 
ON public.website_pages 
FOR ALL 
USING (true);

-- RLS Policies for page_templates (admin access only)
CREATE POLICY "Admins can manage page templates" 
ON public.page_templates 
FOR ALL 
USING (true);

-- RLS Policies for newsletter_subscribers (admin access only)
CREATE POLICY "Admins can manage newsletter subscribers" 
ON public.newsletter_subscribers 
FOR ALL 
USING (true);

-- RLS Policies for newsletter_campaigns (admin access only)
CREATE POLICY "Admins can manage newsletter campaigns" 
ON public.newsletter_campaigns 
FOR ALL 
USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_tables_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_website_pages_updated_at
    BEFORE UPDATE ON public.website_pages
    FOR EACH ROW
    EXECUTE FUNCTION update_admin_tables_updated_at();

CREATE TRIGGER update_page_templates_updated_at
    BEFORE UPDATE ON public.page_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_admin_tables_updated_at();

CREATE TRIGGER update_newsletter_campaigns_updated_at
    BEFORE UPDATE ON public.newsletter_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_admin_tables_updated_at();

CREATE TRIGGER update_newsletter_subscribers_updated_at
    BEFORE UPDATE ON public.newsletter_subscribers
    FOR EACH ROW
    EXECUTE FUNCTION update_admin_tables_updated_at();

-- Insert default page templates
INSERT INTO public.page_templates (name, description, template_type, structure) VALUES
('Default Page', 'Standard page template with header, content, and footer', 'page', '{"sections": ["header", "content", "footer"]}'),
('Service Page', 'Template for service pages with features and CTA', 'service', '{"sections": ["header", "hero", "features", "testimonials", "cta", "footer"]}'),
('Blog Post', 'Template for blog posts with sidebar and related posts', 'blog', '{"sections": ["header", "content", "sidebar", "related", "footer"]}'),
('Landing Page', 'Conversion-focused landing page template', 'landing', '{"sections": ["hero", "benefits", "features", "testimonials", "cta"]}'),
('Case Study', 'Template for case studies with problem-solution format', 'case-study', '{"sections": ["header", "overview", "challenge", "solution", "results", "cta", "footer"]}'),
('Minimal', 'Clean minimal template with focus on content', 'minimal', '{"sections": ["content"]}');

-- Grant necessary permissions
GRANT ALL ON public.website_pages TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.page_templates TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.newsletter_subscribers TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.newsletter_campaigns TO postgres, anon, authenticated, service_role;