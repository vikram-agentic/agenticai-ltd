-- Fix Newsletter Schema Migration
-- This migration ensures all newsletter tables have the correct structure

-- Create newsletter_subscribers table if it doesn't exist
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  source TEXT DEFAULT 'website',
  tags TEXT[] DEFAULT '{}',
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  last_email_sent TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create newsletter_campaigns table if it doesn't exist
CREATE TABLE IF NOT EXISTS newsletter_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'failed', 'cancelled')),
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
  target_audience JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add missing columns to newsletter_subscribers if they don't exist
DO $$ 
BEGIN
  -- Add last_email_sent column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_subscribers' AND column_name = 'last_email_sent') THEN
    ALTER TABLE newsletter_subscribers ADD COLUMN last_email_sent TIMESTAMP WITH TIME ZONE;
  END IF;

  -- Add notes column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_subscribers' AND column_name = 'notes') THEN
    ALTER TABLE newsletter_subscribers ADD COLUMN notes TEXT;
  END IF;

  -- Add created_at column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_subscribers' AND column_name = 'created_at') THEN
    ALTER TABLE newsletter_subscribers ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT now();
  END IF;

  -- Add updated_at column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_subscribers' AND column_name = 'updated_at') THEN
    ALTER TABLE newsletter_subscribers ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
  END IF;
END $$;

-- Add missing columns to newsletter_campaigns if they don't exist
DO $$ 
BEGIN
  -- Add preview_text column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_campaigns' AND column_name = 'preview_text') THEN
    ALTER TABLE newsletter_campaigns ADD COLUMN preview_text TEXT;
  END IF;

  -- Add template_id column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_campaigns' AND column_name = 'template_id') THEN
    ALTER TABLE newsletter_campaigns ADD COLUMN template_id TEXT;
  END IF;

  -- Add sender_name column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_campaigns' AND column_name = 'sender_name') THEN
    ALTER TABLE newsletter_campaigns ADD COLUMN sender_name TEXT DEFAULT 'Agentic AI';
  END IF;

  -- Add sender_email column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_campaigns' AND column_name = 'sender_email') THEN
    ALTER TABLE newsletter_campaigns ADD COLUMN sender_email TEXT DEFAULT 'info@agentic-ai.ltd';
  END IF;

  -- Add tags column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_campaigns' AND column_name = 'tags') THEN
    ALTER TABLE newsletter_campaigns ADD COLUMN tags TEXT[] DEFAULT '{}';
  END IF;

  -- Add target_audience column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_campaigns' AND column_name = 'target_audience') THEN
    ALTER TABLE newsletter_campaigns ADD COLUMN target_audience JSONB;
  END IF;

  -- Add created_at column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_campaigns' AND column_name = 'created_at') THEN
    ALTER TABLE newsletter_campaigns ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT now();
  END IF;

  -- Add updated_at column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_campaigns' AND column_name = 'updated_at') THEN
    ALTER TABLE newsletter_campaigns ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_created_at ON newsletter_subscribers(created_at);

CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_status ON newsletter_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_scheduled_at ON newsletter_campaigns(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_created_at ON newsletter_campaigns(created_at);

-- Create update trigger for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to both tables
DROP TRIGGER IF EXISTS update_newsletter_subscribers_updated_at ON newsletter_subscribers;
CREATE TRIGGER update_newsletter_subscribers_updated_at
    BEFORE UPDATE ON newsletter_subscribers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_newsletter_campaigns_updated_at ON newsletter_campaigns;
CREATE TRIGGER update_newsletter_campaigns_updated_at
    BEFORE UPDATE ON newsletter_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_campaigns ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for newsletter_subscribers
DROP POLICY IF EXISTS "Enable read access for all users" ON newsletter_subscribers;
CREATE POLICY "Enable read access for all users" ON newsletter_subscribers
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for all users" ON newsletter_subscribers;
CREATE POLICY "Enable insert for all users" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update for all users" ON newsletter_subscribers;
CREATE POLICY "Enable update for all users" ON newsletter_subscribers
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Enable delete for all users" ON newsletter_subscribers;
CREATE POLICY "Enable delete for all users" ON newsletter_subscribers
    FOR DELETE USING (true);

-- Create RLS policies for newsletter_campaigns
DROP POLICY IF EXISTS "Enable read access for all users" ON newsletter_campaigns;
CREATE POLICY "Enable read access for all users" ON newsletter_campaigns
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for all users" ON newsletter_campaigns;
CREATE POLICY "Enable insert for all users" ON newsletter_campaigns
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update for all users" ON newsletter_campaigns;
CREATE POLICY "Enable update for all users" ON newsletter_campaigns
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Enable delete for all users" ON newsletter_campaigns;
CREATE POLICY "Enable delete for all users" ON newsletter_campaigns
    FOR DELETE USING (true);

-- Insert some sample data for testing
INSERT INTO newsletter_subscribers (email, name, status, source, tags) VALUES
  ('test@agentic-ai.ltd', 'Test User', 'active', 'website', ARRAY['test', 'initial'])
ON CONFLICT (email) DO NOTHING;

-- Log completion
INSERT INTO email_logs (
  email_type,
  recipient, 
  subject, 
  status, 
  sent_at
) VALUES (
  'system',
  'system@agentic-ai.ltd',
  'Newsletter Schema Migration Completed',
  'sent',
  now()
) ON CONFLICT DO NOTHING;