-- COMPREHENSIVE ARTICLE GENERATION SYSTEM
-- High-performance database schema for automated, enterprise-grade article generation
-- Supports 4-5 high-authority articles per day with full SEO optimization

-- ============================================================================
-- CORE ARTICLE SYSTEM TABLES
-- ============================================================================

-- Enhanced articles table with comprehensive metadata
CREATE TABLE IF NOT EXISTS articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    meta_title TEXT,
    meta_description TEXT,
    featured_image_url TEXT,
    featured_image_alt TEXT,
    content TEXT NOT NULL,
    excerpt TEXT,
    
    -- Article Structure & SEO
    outline_structure JSONB DEFAULT '{}',
    heading_structure JSONB DEFAULT '{}',
    word_count INTEGER DEFAULT 0,
    reading_time INTEGER DEFAULT 0,
    
    -- Keywords & Optimization
    primary_keyword TEXT,
    secondary_keywords TEXT[] DEFAULT '{}',
    keyword_density JSONB DEFAULT '{}',
    target_search_volume INTEGER DEFAULT 0,
    keyword_difficulty INTEGER DEFAULT 0,
    
    -- SEO Scores & Performance
    seo_score INTEGER DEFAULT 0,
    readability_score INTEGER DEFAULT 0,
    content_score INTEGER DEFAULT 0,
    ctr_potential_score INTEGER DEFAULT 0,
    
    -- Publication & Status
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
    scheduled_publish_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Performance Tracking
    views_count INTEGER DEFAULT 0,
    clicks_count INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0.00,
    bounce_rate DECIMAL(5,2) DEFAULT 0.00,
    average_session_duration INTEGER DEFAULT 0,
    
    -- Search Engine Performance
    google_ranking JSONB DEFAULT '{}', -- {keyword: ranking}
    serp_features TEXT[] DEFAULT '{}', -- featured_snippets, people_also_ask, etc
    backlinks_count INTEGER DEFAULT 0,
    referring_domains INTEGER DEFAULT 0,
    
    -- Social & Sharing
    social_shares JSONB DEFAULT '{}', -- {platform: count}
    internal_links TEXT[] DEFAULT '{}',
    external_links TEXT[] DEFAULT '{}',
    
    -- Quality Assurance
    ai_confidence_score DECIMAL(5,2) DEFAULT 0.00,
    human_review_status TEXT DEFAULT 'pending' CHECK (human_review_status IN ('pending', 'approved', 'needs_revision', 'rejected')),
    quality_flags TEXT[] DEFAULT '{}',
    plagiarism_score DECIMAL(5,2) DEFAULT 0.00,
    
    -- Automation & Generation
    generation_method TEXT DEFAULT 'auto' CHECK (generation_method IN ('auto', 'manual', 'hybrid')),
    generation_batch_id TEXT,
    source_research JSONB DEFAULT '{}',
    competitor_analysis JSONB DEFAULT '{}',
    content_gaps_addressed TEXT[] DEFAULT '{}',
    
    -- Metadata
    author TEXT DEFAULT 'AI Content Team',
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    language TEXT DEFAULT 'en',
    target_audience TEXT,
    content_type TEXT DEFAULT 'blog_post',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_optimized_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- KEYWORD RESEARCH & ANALYSIS TABLES
-- ============================================================================

-- Master keywords database with comprehensive data
CREATE TABLE IF NOT EXISTS keywords (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    keyword TEXT NOT NULL UNIQUE,
    search_volume INTEGER DEFAULT 0,
    competition_level TEXT CHECK (competition_level IN ('low', 'medium', 'high')),
    keyword_difficulty INTEGER DEFAULT 0,
    cpc DECIMAL(10,2) DEFAULT 0.00,
    
    -- Semantic Analysis
    intent TEXT CHECK (intent IN ('informational', 'navigational', 'transactional', 'commercial')),
    topic_cluster TEXT,
    related_keywords TEXT[] DEFAULT '{}',
    long_tail_variants TEXT[] DEFAULT '{}',
    
    -- Trend Data
    search_trend JSONB DEFAULT '{}', -- monthly search volume data
    seasonal_trends JSONB DEFAULT '{}',
    trending_score INTEGER DEFAULT 0,
    
    -- Opportunity Analysis
    content_gap_score INTEGER DEFAULT 0,
    authority_opportunity INTEGER DEFAULT 0,
    quick_win_potential BOOLEAN DEFAULT FALSE,
    
    -- SERP Analysis
    serp_features TEXT[] DEFAULT '{}',
    featured_snippet_opportunity BOOLEAN DEFAULT FALSE,
    paa_questions TEXT[] DEFAULT '{}', -- People Also Ask
    
    -- Competitive Data
    top_competitors TEXT[] DEFAULT '{}',
    average_content_length INTEGER DEFAULT 0,
    average_domain_authority INTEGER DEFAULT 0,
    
    -- Business Relevance
    business_value_score INTEGER DEFAULT 0,
    conversion_potential TEXT CHECK (conversion_potential IN ('low', 'medium', 'high')),
    target_persona TEXT,
    
    -- Research Metadata
    last_researched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_source TEXT DEFAULT 'multiple',
    research_quality_score INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Keyword research sessions tracking
CREATE TABLE IF NOT EXISTS keyword_research_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_name TEXT NOT NULL,
    industry_focus TEXT,
    target_audience TEXT,
    research_method TEXT,
    
    -- Research Parameters
    min_search_volume INTEGER DEFAULT 1000,
    max_keyword_difficulty INTEGER DEFAULT 50,
    target_intent TEXT[] DEFAULT '{}',
    geographic_focus TEXT DEFAULT 'global',
    
    -- Results Summary
    total_keywords_found INTEGER DEFAULT 0,
    high_opportunity_keywords INTEGER DEFAULT 0,
    quick_win_keywords INTEGER DEFAULT 0,
    long_term_keywords INTEGER DEFAULT 0,
    
    -- Analysis Results
    research_insights JSONB DEFAULT '{}',
    competitive_landscape JSONB DEFAULT '{}',
    content_opportunities TEXT[] DEFAULT '{}',
    
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Link keywords to research sessions
CREATE TABLE IF NOT EXISTS session_keywords (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES keyword_research_sessions(id) ON DELETE CASCADE,
    keyword_id UUID REFERENCES keywords(id) ON DELETE CASCADE,
    priority_score INTEGER DEFAULT 0,
    selected_for_content BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TOPIC & CONTENT PLANNING TABLES
-- ============================================================================

-- Content topics with comprehensive planning
CREATE TABLE IF NOT EXISTS content_topics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    topic_name TEXT NOT NULL,
    topic_cluster TEXT,
    primary_keyword_id UUID REFERENCES keywords(id),
    
    -- Topic Analysis
    search_demand_score INTEGER DEFAULT 0,
    content_difficulty INTEGER DEFAULT 0,
    expertise_required TEXT CHECK (expertise_required IN ('basic', 'intermediate', 'advanced', 'expert')),
    
    -- Content Planning
    target_word_count INTEGER DEFAULT 2500,
    estimated_research_time INTEGER DEFAULT 120, -- minutes
    content_type TEXT DEFAULT 'comprehensive_guide',
    target_audience_segment TEXT,
    
    -- SEO Planning
    target_serp_features TEXT[] DEFAULT '{}',
    internal_linking_opportunities TEXT[] DEFAULT '{}',
    external_authority_sources TEXT[] DEFAULT '{}',
    
    -- Competitive Analysis
    top_ranking_content JSONB DEFAULT '{}',
    content_gaps TEXT[] DEFAULT '{}',
    unique_angle TEXT,
    
    -- Production Pipeline
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'researching', 'outlining', 'writing', 'optimizing', 'completed')),
    priority INTEGER DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
    estimated_completion_date DATE,
    
    -- Performance Predictions
    estimated_traffic INTEGER DEFAULT 0,
    conversion_potential TEXT CHECK (conversion_potential IN ('low', 'medium', 'high')),
    authority_building_score INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- AUTOMATION & SCHEDULING TABLES
-- ============================================================================

-- Automated article generation schedule
CREATE TABLE IF NOT EXISTS article_generation_schedule (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Schedule Configuration
    schedule_name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'monthly')),
    articles_per_execution INTEGER DEFAULT 4,
    
    -- Time Configuration
    execution_time TIME DEFAULT '06:00:00', -- UTC time
    timezone TEXT DEFAULT 'UTC',
    days_of_week INTEGER[] DEFAULT '{1,2,3,4,5}', -- Monday-Friday
    
    -- Content Strategy
    topic_selection_strategy TEXT DEFAULT 'high_opportunity' CHECK (topic_selection_strategy IN ('high_opportunity', 'seasonal', 'competitive_gaps', 'trending', 'balanced')),
    min_keyword_volume INTEGER DEFAULT 1000,
    max_keyword_difficulty INTEGER DEFAULT 40,
    content_quality_threshold INTEGER DEFAULT 85,
    
    -- Quality Control
    require_human_review BOOLEAN DEFAULT FALSE,
    auto_publish BOOLEAN DEFAULT FALSE,
    quality_checks TEXT[] DEFAULT '{}',
    
    -- Performance Tracking
    total_executions INTEGER DEFAULT 0,
    successful_executions INTEGER DEFAULT 0,
    failed_executions INTEGER DEFAULT 0,
    total_articles_generated INTEGER DEFAULT 0,
    
    -- Last Execution Info
    last_executed_at TIMESTAMP WITH TIME ZONE,
    last_execution_status TEXT,
    last_execution_results JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Individual automation job tracking
CREATE TABLE IF NOT EXISTS automation_jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    schedule_id UUID REFERENCES article_generation_schedule(id) ON DELETE CASCADE,
    job_batch_id TEXT NOT NULL,
    
    -- Job Configuration
    target_articles_count INTEGER NOT NULL,
    selected_topics JSONB DEFAULT '[]',
    generation_parameters JSONB DEFAULT '{}',
    
    -- Execution Status
    status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed', 'cancelled')),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Results Tracking
    articles_generated INTEGER DEFAULT 0,
    articles_published INTEGER DEFAULT 0,
    articles_failed INTEGER DEFAULT 0,
    
    -- Performance Metrics
    average_generation_time INTEGER DEFAULT 0, -- seconds
    average_seo_score DECIMAL(5,2) DEFAULT 0.00,
    average_content_score DECIMAL(5,2) DEFAULT 0.00,
    
    -- Error Handling
    errors JSONB DEFAULT '[]',
    warnings JSONB DEFAULT '[]',
    retry_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Link automation jobs to generated articles
CREATE TABLE IF NOT EXISTS job_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES automation_jobs(id) ON DELETE CASCADE,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    generation_status TEXT DEFAULT 'success',
    generation_time INTEGER DEFAULT 0,
    errors TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PERFORMANCE ANALYTICS & TRACKING TABLES
-- ============================================================================

-- Daily article performance snapshots
CREATE TABLE IF NOT EXISTS article_performance_daily (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- Traffic Metrics
    organic_views INTEGER DEFAULT 0,
    direct_views INTEGER DEFAULT 0,
    referral_views INTEGER DEFAULT 0,
    social_views INTEGER DEFAULT 0,
    total_views INTEGER DEFAULT 0,
    
    -- Engagement Metrics
    avg_time_on_page INTEGER DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0.00,
    scroll_depth_avg DECIMAL(5,2) DEFAULT 0.00,
    social_shares INTEGER DEFAULT 0,
    
    -- Search Performance
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    ctr DECIMAL(5,4) DEFAULT 0.0000,
    avg_position DECIMAL(5,2) DEFAULT 0.00,
    
    -- Conversion Metrics
    leads_generated INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    conversion_value DECIMAL(10,2) DEFAULT 0.00,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(article_id, date)
);

-- Keyword ranking tracking
CREATE TABLE IF NOT EXISTS keyword_rankings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    keyword_id UUID REFERENCES keywords(id) ON DELETE CASCADE,
    
    -- Ranking Data
    current_position INTEGER,
    previous_position INTEGER,
    best_position INTEGER,
    worst_position INTEGER,
    
    -- SERP Features
    has_featured_snippet BOOLEAN DEFAULT FALSE,
    has_paa BOOLEAN DEFAULT FALSE,
    has_image_pack BOOLEAN DEFAULT FALSE,
    has_video_results BOOLEAN DEFAULT FALSE,
    
    -- Tracking Metadata
    search_engine TEXT DEFAULT 'google',
    location TEXT DEFAULT 'us',
    device TEXT DEFAULT 'desktop',
    
    -- Performance Trends
    ranking_trend TEXT, -- 'improving', 'declining', 'stable'
    trend_score INTEGER DEFAULT 0,
    
    last_checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comprehensive SEO audit results
CREATE TABLE IF NOT EXISTS seo_audits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    
    -- Overall Scores
    overall_seo_score INTEGER NOT NULL,
    content_score INTEGER DEFAULT 0,
    technical_score INTEGER DEFAULT 0,
    user_experience_score INTEGER DEFAULT 0,
    
    -- Content Analysis
    keyword_optimization JSONB DEFAULT '{}',
    content_structure JSONB DEFAULT '{}',
    readability_analysis JSONB DEFAULT '{}',
    
    -- Technical SEO
    meta_tags_analysis JSONB DEFAULT '{}',
    heading_structure_analysis JSONB DEFAULT '{}',
    internal_linking_analysis JSONB DEFAULT '{}',
    image_optimization JSONB DEFAULT '{}',
    
    -- Recommendations
    high_priority_issues TEXT[] DEFAULT '{}',
    medium_priority_issues TEXT[] DEFAULT '{}',
    low_priority_issues TEXT[] DEFAULT '{}',
    optimization_suggestions TEXT[] DEFAULT '{}',
    
    -- Improvement Tracking
    improvements_implemented TEXT[] DEFAULT '{}',
    before_score INTEGER,
    after_score INTEGER,
    
    audit_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CONTENT QUALITY & VALIDATION TABLES
-- ============================================================================

-- AI-generated content validation
CREATE TABLE IF NOT EXISTS content_quality_checks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    
    -- Quality Metrics
    human_like_score DECIMAL(5,2) DEFAULT 0.00,
    originality_score DECIMAL(5,2) DEFAULT 0.00,
    factual_accuracy_score DECIMAL(5,2) DEFAULT 0.00,
    engagement_potential DECIMAL(5,2) DEFAULT 0.00,
    
    -- Content Analysis
    ai_detection_score DECIMAL(5,2) DEFAULT 0.00,
    plagiarism_results JSONB DEFAULT '{}',
    fact_check_results JSONB DEFAULT '{}',
    sentiment_analysis JSONB DEFAULT '{}',
    
    -- Title Analysis
    title_ctr_score DECIMAL(5,2) DEFAULT 0.00,
    title_uniqueness DECIMAL(5,2) DEFAULT 0.00,
    emotional_hooks TEXT[] DEFAULT '{}',
    
    -- Quality Flags
    needs_human_review BOOLEAN DEFAULT FALSE,
    quality_issues TEXT[] DEFAULT '{}',
    content_warnings TEXT[] DEFAULT '{}',
    
    -- Validation Status
    validation_status TEXT DEFAULT 'pending' CHECK (validation_status IN ('pending', 'passed', 'failed', 'requires_revision')),
    validator_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- COMPETITIVE INTELLIGENCE TABLES
-- ============================================================================

-- Competitor content analysis
CREATE TABLE IF NOT EXISTS competitor_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    keyword_id UUID REFERENCES keywords(id) ON DELETE CASCADE,
    
    -- Competitor Information
    competitor_domain TEXT NOT NULL,
    competitor_url TEXT NOT NULL,
    competitor_title TEXT,
    competitor_meta_description TEXT,
    
    -- Content Analysis
    word_count INTEGER DEFAULT 0,
    reading_level TEXT,
    content_structure JSONB DEFAULT '{}',
    key_topics TEXT[] DEFAULT '{}',
    
    -- SEO Analysis
    current_ranking INTEGER,
    domain_authority INTEGER DEFAULT 0,
    page_authority INTEGER DEFAULT 0,
    backlinks_count INTEGER DEFAULT 0,
    
    -- Content Gaps & Opportunities
    content_gaps TEXT[] DEFAULT '{}',
    improvement_opportunities TEXT[] DEFAULT '{}',
    unique_elements TEXT[] DEFAULT '{}',
    
    -- Analysis Metadata
    analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    analysis_method TEXT DEFAULT 'automated',
    confidence_score DECIMAL(5,2) DEFAULT 0.00,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR OPTIMAL PERFORMANCE
-- ============================================================================

-- Articles table indexes
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_primary_keyword ON articles(primary_keyword);
CREATE INDEX IF NOT EXISTS idx_articles_generation_batch_id ON articles(generation_batch_id);
CREATE INDEX IF NOT EXISTS idx_articles_seo_score ON articles(seo_score DESC);
CREATE INDEX IF NOT EXISTS idx_articles_views_count ON articles(views_count DESC);

-- Keywords table indexes
CREATE INDEX IF NOT EXISTS idx_keywords_search_volume ON keywords(search_volume DESC);
CREATE INDEX IF NOT EXISTS idx_keywords_difficulty ON keywords(keyword_difficulty);
CREATE INDEX IF NOT EXISTS idx_keywords_opportunity ON keywords(authority_opportunity DESC);
CREATE INDEX IF NOT EXISTS idx_keywords_intent ON keywords(intent);
CREATE INDEX IF NOT EXISTS idx_keywords_topic_cluster ON keywords(topic_cluster);

-- Content topics indexes
CREATE INDEX IF NOT EXISTS idx_content_topics_status ON content_topics(status);
CREATE INDEX IF NOT EXISTS idx_content_topics_priority ON content_topics(priority DESC);
CREATE INDEX IF NOT EXISTS idx_content_topics_cluster ON content_topics(topic_cluster);

-- Automation indexes
CREATE INDEX IF NOT EXISTS idx_automation_jobs_status ON automation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_automation_jobs_batch_id ON automation_jobs(job_batch_id);
CREATE INDEX IF NOT EXISTS idx_automation_jobs_created_at ON automation_jobs(created_at DESC);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_article_performance_daily_date ON article_performance_daily(date DESC);
CREATE INDEX IF NOT EXISTS idx_article_performance_daily_article_id ON article_performance_daily(article_id);
CREATE INDEX IF NOT EXISTS idx_keyword_rankings_article_id ON keyword_rankings(article_id);
CREATE INDEX IF NOT EXISTS idx_keyword_rankings_keyword_id ON keyword_rankings(keyword_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE keyword_research_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_generation_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_performance_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE keyword_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_quality_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_content ENABLE ROW LEVEL SECURITY;

-- Service role policies (full access)
CREATE POLICY "Service role full access to articles" ON articles FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access to keywords" ON keywords FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access to keyword_research_sessions" ON keyword_research_sessions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access to session_keywords" ON session_keywords FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access to content_topics" ON content_topics FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access to article_generation_schedule" ON article_generation_schedule FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access to automation_jobs" ON automation_jobs FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access to job_articles" ON job_articles FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access to article_performance_daily" ON article_performance_daily FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access to keyword_rankings" ON keyword_rankings FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access to seo_audits" ON seo_audits FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access to content_quality_checks" ON content_quality_checks FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access to competitor_content" ON competitor_content FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Authenticated user policies (read access + limited write)
CREATE POLICY "Authenticated read access to published articles" ON articles FOR SELECT TO authenticated USING (status = 'published');
CREATE POLICY "Authenticated read access to keywords" ON keywords FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read access to content_topics" ON content_topics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read access to article_performance_daily" ON article_performance_daily FOR SELECT TO authenticated USING (true);

-- Public policies for published articles
CREATE POLICY "Public read access to published articles" ON articles FOR SELECT TO anon USING (status = 'published');

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Function to calculate article SEO score
CREATE OR REPLACE FUNCTION calculate_article_seo_score(article_id_param UUID)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    seo_score INTEGER := 0;
    article_record RECORD;
BEGIN
    SELECT * INTO article_record FROM articles WHERE id = article_id_param;
    
    IF article_record IS NULL THEN
        RETURN 0;
    END IF;
    
    -- Title optimization (20 points max)
    IF LENGTH(article_record.title) BETWEEN 30 AND 60 THEN
        seo_score := seo_score + 15;
    END IF;
    IF article_record.primary_keyword IS NOT NULL AND LOWER(article_record.title) LIKE '%' || LOWER(article_record.primary_keyword) || '%' THEN
        seo_score := seo_score + 5;
    END IF;
    
    -- Meta description (15 points max)
    IF LENGTH(article_record.meta_description) BETWEEN 120 AND 160 THEN
        seo_score := seo_score + 10;
    END IF;
    IF article_record.primary_keyword IS NOT NULL AND LOWER(article_record.meta_description) LIKE '%' || LOWER(article_record.primary_keyword) || '%' THEN
        seo_score := seo_score + 5;
    END IF;
    
    -- Content length (20 points max)
    IF article_record.word_count >= 2500 THEN
        seo_score := seo_score + 20;
    ELSIF article_record.word_count >= 1500 THEN
        seo_score := seo_score + 15;
    ELSIF article_record.word_count >= 1000 THEN
        seo_score := seo_score + 10;
    END IF;
    
    -- Keyword optimization (15 points max)
    IF article_record.primary_keyword IS NOT NULL THEN
        seo_score := seo_score + 5;
    END IF;
    IF array_length(article_record.secondary_keywords, 1) >= 3 THEN
        seo_score := seo_score + 10;
    END IF;
    
    -- Internal/External links (15 points max)
    IF array_length(article_record.internal_links, 1) >= 3 THEN
        seo_score := seo_score + 8;
    END IF;
    IF array_length(article_record.external_links, 1) >= 2 THEN
        seo_score := seo_score + 7;
    END IF;
    
    -- Image optimization (10 points max)
    IF article_record.featured_image_url IS NOT NULL AND article_record.featured_image_alt IS NOT NULL THEN
        seo_score := seo_score + 10;
    END IF;
    
    -- Readability (5 points max)
    IF article_record.readability_score >= 70 THEN
        seo_score := seo_score + 5;
    END IF;
    
    RETURN LEAST(seo_score, 100);
END;
$$;

-- Function to update article metrics
CREATE OR REPLACE FUNCTION update_article_metrics()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Calculate word count and reading time
    NEW.word_count := array_length(string_to_array(NEW.content, ' '), 1);
    NEW.reading_time := CEIL(NEW.word_count::NUMERIC / 200);
    
    -- Calculate SEO score
    NEW.seo_score := calculate_article_seo_score(NEW.id);
    
    -- Update timestamp
    NEW.updated_at := NOW();
    
    RETURN NEW;
END;
$$;

-- Create trigger for automatic metrics updates
CREATE TRIGGER trigger_update_article_metrics
    BEFORE INSERT OR UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION update_article_metrics();

-- Function to get high-opportunity keywords
CREATE OR REPLACE FUNCTION get_high_opportunity_keywords(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    keyword_text TEXT,
    opportunity_score INTEGER,
    search_volume INTEGER,
    difficulty INTEGER,
    quick_win BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        k.keyword,
        (k.authority_opportunity + k.content_gap_score + CASE WHEN k.quick_win_potential THEN 20 ELSE 0 END) as opportunity_score,
        k.search_volume,
        k.keyword_difficulty,
        k.quick_win_potential
    FROM keywords k
    WHERE k.search_volume >= 1000 
    AND k.keyword_difficulty <= 50
    ORDER BY (k.authority_opportunity + k.content_gap_score + CASE WHEN k.quick_win_potential THEN 20 ELSE 0 END) DESC
    LIMIT limit_count;
END;
$$;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant all permissions to service_role
GRANT ALL ON articles TO service_role;
GRANT ALL ON keywords TO service_role;
GRANT ALL ON keyword_research_sessions TO service_role;
GRANT ALL ON session_keywords TO service_role;
GRANT ALL ON content_topics TO service_role;
GRANT ALL ON article_generation_schedule TO service_role;
GRANT ALL ON automation_jobs TO service_role;
GRANT ALL ON job_articles TO service_role;
GRANT ALL ON article_performance_daily TO service_role;
GRANT ALL ON keyword_rankings TO service_role;
GRANT ALL ON seo_audits TO service_role;
GRANT ALL ON content_quality_checks TO service_role;
GRANT ALL ON competitor_content TO service_role;

-- Grant read permissions to authenticated users
GRANT SELECT ON articles TO authenticated;
GRANT SELECT ON keywords TO authenticated;
GRANT SELECT ON content_topics TO authenticated;
GRANT SELECT ON article_performance_daily TO authenticated;
GRANT SELECT ON keyword_rankings TO authenticated;

-- Initial data seeding for testing
INSERT INTO article_generation_schedule (
    schedule_name,
    is_active,
    frequency,
    articles_per_execution,
    execution_time,
    topic_selection_strategy,
    min_keyword_volume,
    max_keyword_difficulty
) VALUES (
    'Daily High-Authority Article Generation',
    true,
    'daily',
    4,
    '06:00:00',
    'high_opportunity',
    1000,
    40
);

-- Create initial keyword research session
INSERT INTO keyword_research_sessions (
    session_name,
    industry_focus,
    target_audience,
    research_method,
    status
) VALUES (
    'AI Consulting Authority Building',
    'AI Consulting',
    'Enterprise Decision Makers',
    'comprehensive_analysis',
    'active'
);