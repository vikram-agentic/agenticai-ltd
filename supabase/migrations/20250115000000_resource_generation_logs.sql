-- Create resource generation logs table
CREATE TABLE IF NOT EXISTS resource_generation_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    resource_type TEXT NOT NULL,
    topic TEXT NOT NULL,
    category TEXT NOT NULL,
    file_path TEXT NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    images_count INTEGER DEFAULT 0,
    content_length INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policy
ALTER TABLE resource_generation_logs ENABLE ROW LEVEL SECURITY;

-- Allow admin users to read all logs
CREATE POLICY "Admin can view resource generation logs" ON resource_generation_logs
    FOR SELECT USING (true);

-- Allow service role to insert logs
CREATE POLICY "Service role can insert resource generation logs" ON resource_generation_logs
    FOR INSERT WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_resource_generation_logs_generated_at ON resource_generation_logs(generated_at DESC);
CREATE INDEX IF NOT EXISTS idx_resource_generation_logs_resource_type ON resource_generation_logs(resource_type);
