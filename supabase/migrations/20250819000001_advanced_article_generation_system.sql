-- Advanced Article Generation System
-- This migration creates tables for the advanced article generation workflow

-- Article Generation Sessions table
CREATE TABLE IF NOT EXISTS public.article_generation_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    seed_keywords TEXT[] NOT NULL,
    industry TEXT NOT NULL DEFAULT 'AI Consulting',
    target_audience TEXT NOT NULL DEFAULT 'Enterprise Decision Makers',
    content_type TEXT NOT NULL DEFAULT 'pillar',
    settings JSONB DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed', 'cancelled')),
    estimated_cost DECIMAL(10,4) DEFAULT 0,
    actual_cost DECIMAL(10,4) DEFAULT 0,
    results JSONB DEFAULT '{}',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Advanced Keywords Research table  
CREATE TABLE IF NOT EXISTS public.advanced_keywords_research (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.article_generation_sessions(id) ON DELETE CASCADE,
    seed_keywords TEXT[] NOT NULL,
    research_method TEXT NOT NULL DEFAULT 'dataforseo' CHECK (research_method IN ('dataforseo', 'advanced', 'manual')),
    total_keywords INTEGER DEFAULT 0,
    high_opportunity_keywords INTEGER DEFAULT 0,
    quick_win_keywords INTEGER DEFAULT 0,
    average_search_volume INTEGER DEFAULT 0,
    average_difficulty INTEGER DEFAULT 0,
    competition_level TEXT DEFAULT 'medium' CHECK (competition_level IN ('low', 'medium', 'high')),
    keywords_data JSONB DEFAULT '[]',
    insights JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- SERP Analysis Results table
CREATE TABLE IF NOT EXISTS public.serp_analysis_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.article_generation_sessions(id) ON DELETE CASCADE,
    keyword TEXT NOT NULL,
    location TEXT DEFAULT 'US',
    device TEXT DEFAULT 'desktop',
    competitors_analyzed INTEGER DEFAULT 0,
    content_gaps_found INTEGER DEFAULT 0,
    serp_features TEXT[] DEFAULT '{}',
    serp_results JSONB DEFAULT '[]',
    content_gaps JSONB DEFAULT '[]',
    competitive_insights JSONB DEFAULT '{}',
    content_strategy JSONB DEFAULT '{}',
    opportunity_score INTEGER DEFAULT 0 CHECK (opportunity_score >= 0 AND opportunity_score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Article Content table
CREATE TABLE IF NOT EXISTS public.generated_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.article_generation_sessions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    excerpt TEXT,
    word_count INTEGER DEFAULT 0,
    readability_score INTEGER DEFAULT 0 CHECK (readability_score >= 0 AND readability_score <= 100),
    seo_score INTEGER DEFAULT 0 CHECK (seo_score >= 0 AND seo_score <= 100),
    keyword_density JSONB DEFAULT '{}',
    heading_structure JSONB DEFAULT '{}',
    internal_links TEXT[] DEFAULT '{}',
    external_links TEXT[] DEFAULT '{}',
    images JSONB DEFAULT '[]',
    content_gaps TEXT[] DEFAULT '{}',
    competitive_advantages TEXT[] DEFAULT '{}',
    estimated_ranking_potential INTEGER DEFAULT 0 CHECK (estimated_ranking_potential >= 0 AND estimated_ranking_potential <= 100),
    generation_method TEXT DEFAULT 'minimax',
    quality_score INTEGER DEFAULT 0 CHECK (quality_score >= 0 AND quality_score <= 100),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Content Quality Metrics table
CREATE TABLE IF NOT EXISTS public.content_quality_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID REFERENCES public.generated_articles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.article_generation_sessions(id) ON DELETE CASCADE,
    metrics_type TEXT DEFAULT 'seo_analysis',
    overall_score INTEGER DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
    readability_score INTEGER DEFAULT 0 CHECK (readability_score >= 0 AND readability_score <= 100),
    seo_score INTEGER DEFAULT 0 CHECK (seo_score >= 0 AND seo_score <= 100),
    keyword_optimization_score INTEGER DEFAULT 0 CHECK (keyword_optimization_score >= 0 AND keyword_optimization_score <= 100),
    content_structure_score INTEGER DEFAULT 0 CHECK (content_structure_score >= 0 AND content_structure_score <= 100),
    uniqueness_score INTEGER DEFAULT 0 CHECK (uniqueness_score >= 0 AND uniqueness_score <= 100),
    detailed_metrics JSONB DEFAULT '{}',
    recommendations TEXT[] DEFAULT '{}',
    issues TEXT[] DEFAULT '{}',
    strengths TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Generation Costs Tracking table
CREATE TABLE IF NOT EXISTS public.generation_costs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.article_generation_sessions(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL, -- 'dataforseo', 'perplexity', 'minimax', 'bfl', 'serp_analysis'
    service_name TEXT NOT NULL,
    api_calls INTEGER DEFAULT 1,
    tokens_used INTEGER DEFAULT 0,
    cost_per_unit DECIMAL(10,6) DEFAULT 0,
    total_cost DECIMAL(10,4) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    billing_details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_article_generation_sessions_status ON public.article_generation_sessions(status);
CREATE INDEX IF NOT EXISTS idx_article_generation_sessions_created_at ON public.article_generation_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_advanced_keywords_research_session_id ON public.advanced_keywords_research(session_id);
CREATE INDEX IF NOT EXISTS idx_serp_analysis_results_session_id ON public.serp_analysis_results(session_id);
CREATE INDEX IF NOT EXISTS idx_serp_analysis_results_keyword ON public.serp_analysis_results(keyword);
CREATE INDEX IF NOT EXISTS idx_generated_articles_session_id ON public.generated_articles(session_id);
CREATE INDEX IF NOT EXISTS idx_generated_articles_status ON public.generated_articles(status);
CREATE INDEX IF NOT EXISTS idx_generated_articles_created_at ON public.generated_articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_quality_metrics_article_id ON public.content_quality_metrics(article_id);
CREATE INDEX IF NOT EXISTS idx_content_quality_metrics_session_id ON public.content_quality_metrics(session_id);
CREATE INDEX IF NOT EXISTS idx_generation_costs_session_id ON public.generation_costs(session_id);

-- Create updated_at trigger for article_generation_sessions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_article_generation_sessions_updated_at BEFORE UPDATE ON public.article_generation_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_generated_articles_updated_at BEFORE UPDATE ON public.generated_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.article_generation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advanced_keywords_research ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.serp_analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_quality_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_costs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all operations for service role, read for authenticated users)
CREATE POLICY "Allow all operations for service role" ON public.article_generation_sessions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow read for authenticated users" ON public.article_generation_sessions FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for service role" ON public.advanced_keywords_research FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow read for authenticated users" ON public.advanced_keywords_research FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for service role" ON public.serp_analysis_results FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow read for authenticated users" ON public.serp_analysis_results FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for service role" ON public.generated_articles FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow read for authenticated users" ON public.generated_articles FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for service role" ON public.content_quality_metrics FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow read for authenticated users" ON public.content_quality_metrics FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for service role" ON public.generation_costs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow read for authenticated users" ON public.generation_costs FOR SELECT USING (auth.role() = 'authenticated');