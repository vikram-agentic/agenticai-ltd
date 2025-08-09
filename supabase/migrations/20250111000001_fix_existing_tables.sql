-- Fix contact_submissions table to add missing fields for newsletter functionality
ALTER TABLE public.contact_submissions 
ADD COLUMN IF NOT EXISTS is_newsletter_subscriber BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS newsletter_tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS last_contacted TIMESTAMP WITH TIME ZONE;

-- Fix chatbot_conversations table to add missing fields
ALTER TABLE public.chatbot_conversations 
ADD COLUMN IF NOT EXISTS is_resolved BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
ADD COLUMN IF NOT EXISTS assigned_to TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create admin_sessions table for better session management
CREATE TABLE IF NOT EXISTS public.admin_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  admin_email TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for admin_sessions
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policy for admin_sessions
CREATE POLICY "Admins can manage their sessions" 
ON public.admin_sessions 
FOR ALL 
USING (admin_email = 'info@agentic-ai.ltd');

-- Create content_generation_history table for tracking generation history
CREATE TABLE IF NOT EXISTS public.content_generation_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES public.content_requests(id) ON DELETE CASCADE,
  step_name TEXT NOT NULL,
  step_status TEXT NOT NULL CHECK (step_status IN ('pending', 'in_progress', 'completed', 'failed')),
  step_data JSONB DEFAULT '{}',
  error_message TEXT,
  tokens_used INTEGER DEFAULT 0,
  processing_time_ms INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for content_generation_history
ALTER TABLE public.content_generation_history ENABLE ROW LEVEL SECURITY;

-- RLS Policy for content_generation_history
CREATE POLICY "Admins can view content generation history" 
ON public.content_generation_history 
FOR ALL 
USING (true);

-- Create image_generation_requests table for BFL Flux integration
CREATE TABLE IF NOT EXISTS public.image_generation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id TEXT NOT NULL, -- BFL API request ID
  content_id UUID REFERENCES public.generated_content(id) ON DELETE CASCADE,
  image_type TEXT NOT NULL CHECK (image_type IN ('featured', 'content')),
  prompt TEXT NOT NULL,
  aspect_ratio TEXT NOT NULL DEFAULT '1:1',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  image_url TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS for image_generation_requests
ALTER TABLE public.image_generation_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policy for image_generation_requests
CREATE POLICY "Admins can manage image generation requests" 
ON public.image_generation_requests 
FOR ALL 
USING (true);

-- Create indexes for new tables
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON public.admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON public.admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_content_generation_history_request ON public.content_generation_history(request_id);
CREATE INDEX IF NOT EXISTS idx_content_generation_history_status ON public.content_generation_history(step_status);
CREATE INDEX IF NOT EXISTS idx_image_generation_requests_content ON public.image_generation_requests(content_id);
CREATE INDEX IF NOT EXISTS idx_image_generation_requests_status ON public.image_generation_requests(status);

-- Add trigger for content_generation_history updated_at
CREATE TRIGGER update_content_generation_history_updated_at
    BEFORE UPDATE ON public.content_generation_history
    FOR EACH ROW
    EXECUTE FUNCTION update_admin_tables_updated_at();

-- Grant permissions
GRANT ALL ON public.admin_sessions TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.content_generation_history TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.image_generation_requests TO postgres, anon, authenticated, service_role;

-- Insert default admin user (info@agentic-ai.ltd)
INSERT INTO public.admin_users (email, password_hash) 
VALUES ('info@agentic-ai.ltd', '$2b$10$example.hash.for.agenticailtd.password')
ON CONFLICT (email) DO NOTHING;

-- Create function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM public.admin_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create function to get admin dashboard stats
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_content', (SELECT COUNT(*) FROM public.generated_content),
        'active_requests', (SELECT COUNT(*) FROM public.content_requests WHERE status = 'in_progress'),
        'new_contacts', (SELECT COUNT(*) FROM public.contact_submissions WHERE is_read = false),
        'chatbot_conversations', (SELECT COUNT(*) FROM public.chatbot_conversations WHERE is_resolved = false),
        'newsletter_subscribers', (SELECT COUNT(*) FROM public.newsletter_subscribers WHERE status = 'active'),
        'website_pages', (SELECT COUNT(*) FROM public.website_pages),
        'published_pages', (SELECT COUNT(*) FROM public.website_pages WHERE status = 'published'),
        'draft_pages', (SELECT COUNT(*) FROM public.website_pages WHERE status = 'draft')
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission on functions
GRANT EXECUTE ON FUNCTION cleanup_expired_sessions() TO postgres, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_admin_dashboard_stats() TO postgres, authenticated, service_role;