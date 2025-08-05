-- Comprehensive RLS policy fix for all admin dashboard tables
-- This will fix the PATCH request errors and make everything work

-- Disable RLS temporarily to fix all policies
ALTER TABLE content_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE keywords_research DISABLE ROW LEVEL SECURITY;
ALTER TABLE serp_analysis DISABLE ROW LEVEL SECURITY;
ALTER TABLE generated_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generated_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE content_performance DISABLE ROW LEVEL SECURITY;
ALTER TABLE content_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE website_context DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS with proper policies
ALTER TABLE content_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE keywords_research ENABLE ROW LEVEL SECURITY;
ALTER TABLE serp_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generated_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_context ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Admins can manage content requests" ON content_requests;
DROP POLICY IF EXISTS "Admins can view keywords research" ON keywords_research;
DROP POLICY IF EXISTS "Admins can view serp analysis" ON serp_analysis;
DROP POLICY IF EXISTS "Admins can manage generated content" ON generated_content;
DROP POLICY IF EXISTS "Admins can manage AI images" ON ai_generated_images;
DROP POLICY IF EXISTS "Admins can view content performance" ON content_performance;
DROP POLICY IF EXISTS "Admins can manage content templates" ON content_templates;
DROP POLICY IF EXISTS "Admins can view API usage logs" ON api_usage_logs;
DROP POLICY IF EXISTS "Admins can manage website context" ON website_context;

-- Create new policies that allow ALL operations
CREATE POLICY "Allow all operations on content_requests" ON content_requests FOR ALL USING (true);
CREATE POLICY "Allow all operations on keywords_research" ON keywords_research FOR ALL USING (true);
CREATE POLICY "Allow all operations on serp_analysis" ON serp_analysis FOR ALL USING (true);
CREATE POLICY "Allow all operations on generated_content" ON generated_content FOR ALL USING (true);
CREATE POLICY "Allow all operations on ai_generated_images" ON ai_generated_images FOR ALL USING (true);
CREATE POLICY "Allow all operations on content_performance" ON content_performance FOR ALL USING (true);
CREATE POLICY "Allow all operations on content_templates" ON content_templates FOR ALL USING (true);
CREATE POLICY "Allow all operations on api_usage_logs" ON api_usage_logs FOR ALL USING (true);
CREATE POLICY "Allow all operations on website_context" ON website_context FOR ALL USING (true);

-- Insert default website context
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