-- Enhanced Content Generator Schema
-- Add new columns to existing tables and create new tables for advanced features

-- Extend generated_content table with new fields
ALTER TABLE generated_content 
ADD COLUMN IF NOT EXISTS heading_structure JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS keyword_density JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS call_to_actions TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS internal_link_suggestions TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS readability_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS seo_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS competitor_analysis JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS perplexity_research JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS batch_id TEXT,
ADD COLUMN IF NOT EXISTS generation_settings JSONB DEFAULT '{}';

-- Create competitor_analysis table
CREATE TABLE IF NOT EXISTS competitor_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    request_id UUID REFERENCES content_requests(id) ON DELETE CASCADE,
    keyword TEXT NOT NULL,
    competitors JSONB NOT NULL DEFAULT '[]',
    analysis_summary JSONB NOT NULL DEFAULT '{}',
    content_gaps TEXT[] DEFAULT '{}',
    opportunities TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create perplexity_research table
CREATE TABLE IF NOT EXISTS perplexity_research (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    request_id UUID REFERENCES content_requests(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    research_data JSONB NOT NULL DEFAULT '{}',
    key_insights TEXT[] DEFAULT '{}',
    market_data JSONB DEFAULT '{}',
    sources TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create article_outlines table
CREATE TABLE IF NOT EXISTS article_outlines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    request_id UUID REFERENCES content_requests(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    outline_structure JSONB NOT NULL DEFAULT '{}',
    estimated_word_count INTEGER DEFAULT 0,
    seo_elements JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create batch_generation_jobs table
CREATE TABLE IF NOT EXISTS batch_generation_jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    batch_id TEXT NOT NULL,
    total_articles INTEGER NOT NULL DEFAULT 0,
    completed_articles INTEGER NOT NULL DEFAULT 0,
    failed_articles INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    settings JSONB NOT NULL DEFAULT '{}',
    csv_data JSONB NOT NULL DEFAULT '[]',
    results JSONB DEFAULT '[]',
    errors TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create content_analytics table
CREATE TABLE IF NOT EXISTS content_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_id UUID REFERENCES generated_content(id) ON DELETE CASCADE,
    word_count INTEGER NOT NULL DEFAULT 0,
    readability_score INTEGER NOT NULL DEFAULT 0,
    seo_score INTEGER NOT NULL DEFAULT 0,
    keyword_density JSONB NOT NULL DEFAULT '{}',
    reading_time INTEGER NOT NULL DEFAULT 0,
    sentence_count INTEGER NOT NULL DEFAULT 0,
    paragraph_count INTEGER NOT NULL DEFAULT 0,
    heading_structure JSONB NOT NULL DEFAULT '{}',
    recommendations TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create seo_optimization_logs table
CREATE TABLE IF NOT EXISTS seo_optimization_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_id UUID REFERENCES generated_content(id) ON DELETE CASCADE,
    original_content TEXT NOT NULL,
    optimized_content TEXT,
    optimization_suggestions TEXT[] DEFAULT '{}',
    before_scores JSONB DEFAULT '{}',
    after_scores JSONB DEFAULT '{}',
    applied_optimizations TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_generated_content_batch_id ON generated_content(batch_id);
CREATE INDEX IF NOT EXISTS idx_competitor_analysis_keyword ON competitor_analysis(keyword);
CREATE INDEX IF NOT EXISTS idx_perplexity_research_topic ON perplexity_research(topic);
CREATE INDEX IF NOT EXISTS idx_batch_generation_jobs_batch_id ON batch_generation_jobs(batch_id);
CREATE INDEX IF NOT EXISTS idx_batch_generation_jobs_status ON batch_generation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_content_analytics_content_id ON content_analytics(content_id);

-- Add RLS policies
ALTER TABLE competitor_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE perplexity_research ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_outlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_generation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_optimization_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for competitor_analysis
CREATE POLICY "Allow full access to competitor_analysis for service role"
ON competitor_analysis FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow read access to competitor_analysis for authenticated users"
ON competitor_analysis FOR SELECT
TO authenticated
USING (true);

-- RLS policies for perplexity_research
CREATE POLICY "Allow full access to perplexity_research for service role"
ON perplexity_research FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow read access to perplexity_research for authenticated users"
ON perplexity_research FOR SELECT
TO authenticated
USING (true);

-- RLS policies for article_outlines
CREATE POLICY "Allow full access to article_outlines for service role"
ON article_outlines FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow read access to article_outlines for authenticated users"
ON article_outlines FOR SELECT
TO authenticated
USING (true);

-- RLS policies for batch_generation_jobs
CREATE POLICY "Allow full access to batch_generation_jobs for service role"
ON batch_generation_jobs FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow read access to batch_generation_jobs for authenticated users"
ON batch_generation_jobs FOR SELECT
TO authenticated
USING (true);

-- RLS policies for content_analytics
CREATE POLICY "Allow full access to content_analytics for service role"
ON content_analytics FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow read access to content_analytics for authenticated users"
ON content_analytics FOR SELECT
TO authenticated
USING (true);

-- RLS policies for seo_optimization_logs
CREATE POLICY "Allow full access to seo_optimization_logs for service role"
ON seo_optimization_logs FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow read access to seo_optimization_logs for authenticated users"
ON seo_optimization_logs FOR SELECT
TO authenticated
USING (true);

-- Create functions for analytics
CREATE OR REPLACE FUNCTION calculate_content_analytics(content_text TEXT, keywords TEXT[])
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    word_count INTEGER;
    sentence_count INTEGER;
    paragraph_count INTEGER;
    reading_time INTEGER;
    result JSONB;
BEGIN
    -- Calculate basic metrics
    word_count := array_length(string_to_array(content_text, ' '), 1);
    sentence_count := array_length(string_to_array(content_text, '.'), 1) - 1;
    paragraph_count := array_length(string_to_array(content_text, E'\n\n'), 1);
    reading_time := CEIL(word_count::NUMERIC / 200);
    
    -- Build result JSON
    result := jsonb_build_object(
        'wordCount', word_count,
        'sentenceCount', sentence_count,
        'paragraphCount', paragraph_count,
        'readingTime', reading_time,
        'calculatedAt', NOW()
    );
    
    RETURN result;
END;
$$;

-- Create function to update content analytics
CREATE OR REPLACE FUNCTION update_content_analytics()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update analytics when content is updated
    IF NEW.content IS DISTINCT FROM OLD.content THEN
        INSERT INTO content_analytics (
            content_id,
            word_count,
            reading_time,
            created_at
        ) VALUES (
            NEW.id,
            array_length(string_to_array(NEW.content, ' '), 1),
            CEIL(array_length(string_to_array(NEW.content, ' '), 1)::NUMERIC / 200),
            NOW()
        )
        ON CONFLICT (content_id) 
        DO UPDATE SET
            word_count = EXCLUDED.word_count,
            reading_time = EXCLUDED.reading_time,
            created_at = NOW();
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger for automatic analytics updates
DROP TRIGGER IF EXISTS trigger_update_content_analytics ON generated_content;
CREATE TRIGGER trigger_update_content_analytics
    AFTER INSERT OR UPDATE ON generated_content
    FOR EACH ROW
    EXECUTE FUNCTION update_content_analytics();

-- Grant necessary permissions
GRANT ALL ON competitor_analysis TO service_role;
GRANT ALL ON perplexity_research TO service_role;
GRANT ALL ON article_outlines TO service_role;
GRANT ALL ON batch_generation_jobs TO service_role;
GRANT ALL ON content_analytics TO service_role;
GRANT ALL ON seo_optimization_logs TO service_role;

GRANT SELECT ON competitor_analysis TO authenticated;
GRANT SELECT ON perplexity_research TO authenticated;
GRANT SELECT ON article_outlines TO authenticated;
GRANT SELECT ON batch_generation_jobs TO authenticated;
GRANT SELECT ON content_analytics TO authenticated;
GRANT SELECT ON seo_optimization_logs TO authenticated;