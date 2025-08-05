-- Fix ALL RLS policies for admin dashboard functionality
-- Run this in your Supabase SQL Editor

-- Fix content_requests RLS
DROP POLICY IF EXISTS "Admins can manage content requests" ON content_requests;
CREATE POLICY "Admins can manage content requests" 
ON content_requests 
FOR ALL 
USING (true);

-- Fix keywords_research RLS
DROP POLICY IF EXISTS "Admins can view keywords research" ON keywords_research;
CREATE POLICY "Admins can manage keywords research" 
ON keywords_research 
FOR ALL 
USING (true);

-- Fix serp_analysis RLS
DROP POLICY IF EXISTS "Admins can view serp analysis" ON serp_analysis;
CREATE POLICY "Admins can manage serp analysis" 
ON serp_analysis 
FOR ALL 
USING (true);

-- Fix generated_content RLS
DROP POLICY IF EXISTS "Admins can manage generated content" ON generated_content;
CREATE POLICY "Admins can manage generated content" 
ON generated_content 
FOR ALL 
USING (true);

-- Fix ai_generated_images RLS
DROP POLICY IF EXISTS "Admins can manage AI images" ON ai_generated_images;
CREATE POLICY "Admins can manage AI images" 
ON ai_generated_images 
FOR ALL 
USING (true);

-- Fix content_performance RLS
DROP POLICY IF EXISTS "Admins can view content performance" ON content_performance;
CREATE POLICY "Admins can manage content performance" 
ON content_performance 
FOR ALL 
USING (true);

-- Fix content_templates RLS
DROP POLICY IF EXISTS "Admins can manage content templates" ON content_templates;
CREATE POLICY "Admins can manage content templates" 
ON content_templates 
FOR ALL 
USING (true);

-- Fix api_usage_logs RLS
DROP POLICY IF EXISTS "Admins can view API usage logs" ON api_usage_logs;
CREATE POLICY "Admins can manage API usage logs" 
ON api_usage_logs 
FOR ALL 
USING (true);

-- Fix website_context RLS
DROP POLICY IF EXISTS "Admins can manage website context" ON website_context;
CREATE POLICY "Admins can manage website context" 
ON website_context 
FOR ALL 
USING (true);

-- Fix admin_users RLS (keep this restricted)
DROP POLICY IF EXISTS "Admins can manage admin users" ON admin_users;
CREATE POLICY "Admins can manage admin users" 
ON admin_users 
FOR ALL 
USING (email = 'info@agentic-ai.ltd');

-- Insert default website context if none exists
INSERT INTO website_context (context_type, title, content, is_active)
SELECT 
    'company_info',
    'Company Information',
    '{"name": "Agentic AI AMRO Ltd", "industry": "AI Automation & Custom AI Solutions", "mission": "To accelerate the agentic transformation of businesses", "location": "Tunbridge Wells, Kent, UK", "phone": "+44 7771 970567", "email": "info@agentic-ai.ltd", "website": "https://agentic-ai.ltd"}',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM website_context WHERE context_type = 'company_info' AND is_active = true
);

INSERT INTO website_context (context_type, title, content, is_active)
SELECT 
    'services',
    'Services',
    '{"services": ["AI Agent Development", "Workflow Automation", "LLM Fine-Tuning", "Multi-Cloud Solutions", "AI Consulting & Support"]}',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM website_context WHERE context_type = 'services' AND is_active = true
);

INSERT INTO website_context (context_type, title, content, is_active)
SELECT 
    'achievements',
    'Achievements',
    '{"stats": {"solutions_deployed": "500+", "cost_reduction": "95%", "operations": "24/7", "satisfaction_rate": "98%"}}',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM website_context WHERE context_type = 'achievements' AND is_active = true
); 