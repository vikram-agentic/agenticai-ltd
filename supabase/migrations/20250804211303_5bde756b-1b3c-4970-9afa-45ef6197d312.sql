-- Create admin authentication table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin users (only admins can access admin data)
CREATE POLICY "Admins can manage admin users" 
ON public.admin_users 
FOR ALL 
USING (email = 'info@agentic-ai.ltd');

-- Create content requests table
CREATE TABLE public.content_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL, -- 'blog_post', 'page', 'resource'
  target_keywords TEXT[],
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'researching', 'generating', 'completed', 'failed'
  progress INTEGER DEFAULT 0, -- 0-100 percentage
  created_by TEXT DEFAULT 'info@agentic-ai.ltd',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.content_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage content requests" 
ON public.content_requests 
FOR ALL 
USING (created_by = 'info@agentic-ai.ltd');

-- Create keywords research table
CREATE TABLE public.keywords_research (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES public.content_requests(id) ON DELETE CASCADE,
  seed_keyword TEXT NOT NULL,
  keywords JSONB NOT NULL, -- Array of keyword objects with metrics
  search_volume_data JSONB,
  competition_analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.keywords_research ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view keywords research" 
ON public.keywords_research 
FOR ALL 
USING (true);

-- Create SERP analysis table
CREATE TABLE public.serp_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES public.content_requests(id) ON DELETE CASCADE,
  target_keyword TEXT NOT NULL,
  top_results JSONB NOT NULL, -- Top 20 results with analysis
  serp_features JSONB, -- Featured snippets, PAA, etc.
  competitor_gaps JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.serp_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view serp analysis" 
ON public.serp_analysis 
FOR ALL 
USING (true);

-- Create generated content table
CREATE TABLE public.generated_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES public.content_requests(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  meta_description TEXT,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  outline JSONB,
  seo_tags TEXT[],
  categories TEXT[],
  featured_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'published', 'archived'
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.generated_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage generated content" 
ON public.generated_content 
FOR ALL 
USING (true);

-- Create AI generated images table
CREATE TABLE public.ai_generated_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID REFERENCES public.generated_content(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  aspect_ratio TEXT DEFAULT '16:9',
  generation_params JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_generated_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage AI images" 
ON public.ai_generated_images 
FOR ALL 
USING (true);

-- Create content performance table
CREATE TABLE public.content_performance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID REFERENCES public.generated_content(id) ON DELETE CASCADE,
  page_views INTEGER DEFAULT 0,
  organic_traffic INTEGER DEFAULT 0,
  search_rankings JSONB, -- keyword -> position mapping
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  engagement_metrics JSONB,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.content_performance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view content performance" 
ON public.content_performance 
FOR ALL 
USING (true);

-- Create content templates table
CREATE TABLE public.content_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  content_type TEXT NOT NULL,
  template_data JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.content_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage templates" 
ON public.content_templates 
FOR ALL 
USING (true);

-- Create API usage logs table
CREATE TABLE public.api_usage_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL, -- 'perplexity', 'claude', 'flux'
  endpoint TEXT NOT NULL,
  tokens_used INTEGER,
  cost_usd DECIMAL(10,4),
  request_data JSONB,
  response_data JSONB,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.api_usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view API logs" 
ON public.api_usage_logs 
FOR ALL 
USING (true);

-- Create website context table
CREATE TABLE public.website_context (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  context_type TEXT NOT NULL, -- 'company_info', 'services', 'testimonials', 'case_studies'
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.website_context ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage website context" 
ON public.website_context 
FOR ALL 
USING (true);

-- Insert default admin user (hashed password for 'agenticailtd')
INSERT INTO public.admin_users (email, password_hash) 
VALUES ('info@agentic-ai.ltd', '$2b$10$rQYmFkqZLCk9VZj2sKsA6.8hK9xG3fXwY4zBwQPr7CvEsNpM8.BxC');

-- Insert default website context
INSERT INTO public.website_context (context_type, title, content) VALUES
('company_info', 'Agentic AI AMRO Ltd', '{
  "name": "Agentic AI AMRO Ltd",
  "industry": "AI Automation & Custom AI Solutions",
  "location": "Tunbridge Wells, Kent, United Kingdom",
  "founded": "2023",
  "mission": "To accelerate the agentic transformation of businesses by building autonomous systems that are not just intelligent, but also responsible, reliable, and aligned with human values.",
  "tagline": "Empowering Businesses with AI & Automation",
  "contact": {
    "email": "info@agentic-ai.ltd",
    "phone": "+44 7771 970567",
    "website": "https://agentic-ai.ltd"
  }
}'),
('services', 'Core Services', '{
  "services": [
    {
      "name": "Custom AI Development",
      "description": "Machine Learning Models, AI Application Development, AI Platform Integration, MLOps & Deployment"
    },
    {
      "name": "AI Agent & Automation Services", 
      "description": "AI Agent Creation, Process Automation, Multi-Agent Systems, 24/7 Operations"
    },
    {
      "name": "Specialized AI Solutions",
      "description": "AI Security Solutions, Business Intelligence, AI Integration, Enterprise RAG Implementation"
    }
  ]
}'),
('achievements', 'Company Statistics', '{
  "stats": {
    "solutions_deployed": "500+",
    "happy_clients": "150+",
    "projects_delivered": "500+",
    "success_rate": "95%",
    "cost_reduction": "95%",
    "average_roi": "340%"
  }
}');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_requests_updated_at
    BEFORE UPDATE ON public.content_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_generated_content_updated_at
    BEFORE UPDATE ON public.generated_content
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_website_context_updated_at
    BEFORE UPDATE ON public.website_context
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();