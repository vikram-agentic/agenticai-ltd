-- Create google_sheets_logs table for monitoring Google Sheets integration
CREATE TABLE IF NOT EXISTS google_sheets_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    success BOOLEAN NOT NULL DEFAULT false,
    result JSONB,
    error_message TEXT,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_google_sheets_logs_email ON google_sheets_logs(email);
CREATE INDEX IF NOT EXISTS idx_google_sheets_logs_success ON google_sheets_logs(success);
CREATE INDEX IF NOT EXISTS idx_google_sheets_logs_processed_at ON google_sheets_logs(processed_at);

-- Enable Row Level Security
ALTER TABLE google_sheets_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to manage logs
CREATE POLICY "Allow service role to manage google sheets logs" ON google_sheets_logs
    FOR ALL USING (auth.role() = 'service_role');

-- Create policy to allow authenticated users to view logs (for admin dashboard)
CREATE POLICY "Allow authenticated users to view google sheets logs" ON google_sheets_logs
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create function to clean up old logs (keep only last 30 days)
CREATE OR REPLACE FUNCTION cleanup_google_sheets_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM google_sheets_logs 
    WHERE processed_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run cleanup (if pg_cron is available)
-- SELECT cron.schedule('cleanup-google-sheets-logs', '0 2 * * *', 'SELECT cleanup_google_sheets_logs();');