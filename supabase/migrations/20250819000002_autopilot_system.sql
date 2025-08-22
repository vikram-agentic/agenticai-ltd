-- AUTOPILOT CONTENT GENERATION SYSTEM
-- Database schema for fully automated content generation

-- Autopilot Sessions table
CREATE TABLE IF NOT EXISTS public.autopilot_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    domain TEXT NOT NULL,
    config JSONB DEFAULT '{}',
    site_analysis JSONB DEFAULT '{}',
    daily_plan JSONB DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'analyzing' CHECK (status IN ('analyzing', 'planning', 'active', 'paused', 'error')),
    articles_generated INTEGER DEFAULT 0,
    total_planned_articles INTEGER DEFAULT 0,
    next_scheduled_generation TIMESTAMP WITH TIME ZONE,
    average_quality_score DECIMAL(5,2) DEFAULT 0,
    total_cost DECIMAL(10,4) DEFAULT 0,
    estimated_monthly_traffic INTEGER DEFAULT 0,
    last_execution_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Article Generation Schedule table
CREATE TABLE IF NOT EXISTS public.article_generation_schedule (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.autopilot_sessions(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    articles_per_execution INTEGER DEFAULT 5,
    execution_frequency TEXT DEFAULT 'daily' CHECK (execution_frequency IN ('hourly', 'daily', 'weekly')),
    execution_time TIME DEFAULT '06:00:00',
    min_keyword_volume INTEGER DEFAULT 1000,
    max_keyword_difficulty INTEGER DEFAULT 50,
    content_quality_threshold INTEGER DEFAULT 85,
    auto_publish BOOLEAN DEFAULT false,
    require_human_review BOOLEAN DEFAULT true,
    total_executions INTEGER DEFAULT 0,
    successful_executions INTEGER DEFAULT 0,
    total_articles_generated INTEGER DEFAULT 0,
    last_executed_at TIMESTAMP WITH TIME ZONE,
    last_execution_status TEXT DEFAULT 'pending',
    last_execution_results JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Keywords table for autopilot keyword discovery
CREATE TABLE IF NOT EXISTS public.keywords (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    keyword TEXT NOT NULL UNIQUE,
    search_volume INTEGER DEFAULT 0,
    keyword_difficulty INTEGER DEFAULT 0,
    cpc DECIMAL(10,4) DEFAULT 0,
    competition_level TEXT DEFAULT 'medium' CHECK (competition_level IN ('low', 'medium', 'high')),
    topic_cluster TEXT,
    authority_opportunity INTEGER DEFAULT 0 CHECK (authority_opportunity >= 0 AND authority_opportunity <= 100),
    quick_win_potential BOOLEAN DEFAULT false,
    content_gap_score INTEGER DEFAULT 0 CHECK (content_gap_score >= 0 AND content_gap_score <= 100),
    internal_linking_opportunities TEXT[] DEFAULT '{}',
    competitor_keywords TEXT[] DEFAULT '{}',
    search_trends JSONB DEFAULT '[]',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Site Analysis Results table
CREATE TABLE IF NOT EXISTS public.site_analysis_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.autopilot_sessions(id) ON DELETE CASCADE,
    domain TEXT NOT NULL,
    sitemap_pages TEXT[] DEFAULT '{}',
    existing_topics TEXT[] DEFAULT '{}',
    content_gaps TEXT[] DEFAULT '{}',
    keyword_opportunities TEXT[] DEFAULT '{}',
    internal_linking_map JSONB DEFAULT '{}',
    competitor_analysis JSONB DEFAULT '{}',
    seo_health_score INTEGER DEFAULT 0 CHECK (seo_health_score >= 0 AND seo_health_score <= 100),
    content_health_score INTEGER DEFAULT 0 CHECK (content_health_score >= 0 AND content_health_score <= 100),
    total_pages INTEGER DEFAULT 0,
    total_internal_links INTEGER DEFAULT 0,
    analysis_duration INTEGER DEFAULT 0, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Automation Jobs table for tracking execution
CREATE TABLE IF NOT EXISTS public.automation_jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.autopilot_sessions(id) ON DELETE CASCADE,
    job_batch_id TEXT NOT NULL,
    job_type TEXT DEFAULT 'article_generation',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    target_articles_count INTEGER DEFAULT 0,
    articles_generated INTEGER DEFAULT 0,
    articles_published INTEGER DEFAULT 0,
    articles_failed INTEGER DEFAULT 0,
    average_generation_time INTEGER DEFAULT 0, -- in milliseconds
    average_seo_score INTEGER DEFAULT 0,
    average_content_score INTEGER DEFAULT 0,
    total_cost DECIMAL(10,4) DEFAULT 0,
    errors TEXT[] DEFAULT '{}',
    execution_details JSONB DEFAULT '{}',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Content Performance Metrics table
CREATE TABLE IF NOT EXISTS public.content_performance_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID REFERENCES public.generated_articles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.autopilot_sessions(id) ON DELETE CASCADE,
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    time_on_page INTEGER DEFAULT 0, -- in seconds
    social_shares INTEGER DEFAULT 0,
    backlinks_acquired INTEGER DEFAULT 0,
    keyword_rankings JSONB DEFAULT '{}', -- keyword -> position mapping
    organic_traffic INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    estimated_value DECIMAL(10,2) DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_autopilot_sessions_status ON public.autopilot_sessions(status);
CREATE INDEX IF NOT EXISTS idx_autopilot_sessions_domain ON public.autopilot_sessions(domain);
CREATE INDEX IF NOT EXISTS idx_autopilot_sessions_next_scheduled ON public.autopilot_sessions(next_scheduled_generation);
CREATE INDEX IF NOT EXISTS idx_autopilot_sessions_created_at ON public.autopilot_sessions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_article_generation_schedule_active ON public.article_generation_schedule(is_active);
CREATE INDEX IF NOT EXISTS idx_article_generation_schedule_session ON public.article_generation_schedule(session_id);

CREATE INDEX IF NOT EXISTS idx_keywords_search_volume ON public.keywords(search_volume DESC);
CREATE INDEX IF NOT EXISTS idx_keywords_quick_win ON public.keywords(quick_win_potential);
CREATE INDEX IF NOT EXISTS idx_keywords_topic_cluster ON public.keywords(topic_cluster);
CREATE INDEX IF NOT EXISTS idx_keywords_keyword ON public.keywords(keyword);

CREATE INDEX IF NOT EXISTS idx_site_analysis_session_id ON public.site_analysis_results(session_id);
CREATE INDEX IF NOT EXISTS idx_site_analysis_domain ON public.site_analysis_results(domain);

CREATE INDEX IF NOT EXISTS idx_automation_jobs_session_id ON public.automation_jobs(session_id);
CREATE INDEX IF NOT EXISTS idx_automation_jobs_status ON public.automation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_automation_jobs_started_at ON public.automation_jobs(started_at DESC);

CREATE INDEX IF NOT EXISTS idx_content_performance_article_id ON public.content_performance_metrics(article_id);
CREATE INDEX IF NOT EXISTS idx_content_performance_session_id ON public.content_performance_metrics(session_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_autopilot_sessions_updated_at BEFORE UPDATE ON public.autopilot_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_article_generation_schedule_updated_at BEFORE UPDATE ON public.article_generation_schedule FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.autopilot_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_generation_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all operations for service role, read for authenticated users)
CREATE POLICY "Allow all operations for service role" ON public.autopilot_sessions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow read for authenticated users" ON public.autopilot_sessions FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for service role" ON public.article_generation_schedule FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow read for authenticated users" ON public.article_generation_schedule FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for service role" ON public.keywords FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow read for authenticated users" ON public.keywords FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for service role" ON public.site_analysis_results FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow read for authenticated users" ON public.site_analysis_results FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for service role" ON public.automation_jobs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow read for authenticated users" ON public.automation_jobs FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for service role" ON public.content_performance_metrics FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow read for authenticated users" ON public.content_performance_metrics FOR SELECT USING (auth.role() = 'authenticated');

-- Insert some sample keywords to get started
INSERT INTO public.keywords (keyword, search_volume, keyword_difficulty, topic_cluster, authority_opportunity, quick_win_potential) VALUES
('AI consulting services', 5200, 35, 'AI Consulting', 85, true),
('enterprise AI implementation', 3800, 42, 'AI Consulting', 78, true),
('business process automation', 6100, 38, 'Business Automation', 82, true),
('digital transformation strategy', 4500, 45, 'Digital Transformation', 75, false),
('machine learning consulting', 2900, 33, 'AI Consulting', 88, true),
('AI strategy framework', 1800, 28, 'AI Strategy', 92, true),
('automated business solutions', 2100, 31, 'Business Automation', 89, true),
('enterprise automation tools', 1600, 39, 'Business Automation', 79, true),
('artificial intelligence implementation', 3200, 41, 'AI Consulting', 81, true),
('business intelligence automation', 1400, 36, 'Business Intelligence', 84, true),
('custom AI development', 2500, 44, 'AI Development', 77, false),
('AI transformation consulting', 1900, 32, 'AI Consulting', 86, true),
('intelligent process automation', 1700, 37, 'Process Automation', 83, true),
('AI-powered business solutions', 2200, 34, 'AI Solutions', 87, true),
('enterprise machine learning', 1500, 43, 'Machine Learning', 76, false)
ON CONFLICT (keyword) DO NOTHING;