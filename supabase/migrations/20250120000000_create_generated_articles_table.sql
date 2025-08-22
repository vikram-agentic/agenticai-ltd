-- Create generated_articles table for autopilot article generation system
CREATE TABLE IF NOT EXISTS public.generated_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'pending_review')),
    word_count INTEGER DEFAULT 0,
    reading_time INTEGER DEFAULT 0,
    quality_score INTEGER DEFAULT 0,
    seo_score INTEGER DEFAULT 0,
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT[],
    tags TEXT[],
    author_id TEXT DEFAULT 'autopilot-system',
    featured_image TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    scheduled_publish_at TIMESTAMP WITH TIME ZONE,
    human_review_status TEXT DEFAULT 'pending' CHECK (human_review_status IN ('pending', 'approved', 'rejected', 'not_required')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_generated_articles_status ON public.generated_articles(status);
CREATE INDEX IF NOT EXISTS idx_generated_articles_published_at ON public.generated_articles(published_at);
CREATE INDEX IF NOT EXISTS idx_generated_articles_created_at ON public.generated_articles(created_at);
CREATE INDEX IF NOT EXISTS idx_generated_articles_author_id ON public.generated_articles(author_id);
CREATE INDEX IF NOT EXISTS idx_generated_articles_quality_score ON public.generated_articles(quality_score);

-- Enable RLS
ALTER TABLE public.generated_articles ENABLE ROW LEVEL SECURITY;

-- Create policies for generated articles
CREATE POLICY "Allow public to view published articles" ON public.generated_articles
    FOR SELECT USING (status = 'published');

CREATE POLICY "Allow authenticated users to manage articles" ON public.generated_articles
    FOR ALL USING (auth.role() = 'authenticated');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_generated_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_generated_articles_updated_at
    BEFORE UPDATE ON public.generated_articles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_generated_articles_updated_at();

-- Enable real-time for generated_articles table
ALTER TABLE public.generated_articles REPLICA IDENTITY FULL;

-- Add the table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.generated_articles;
