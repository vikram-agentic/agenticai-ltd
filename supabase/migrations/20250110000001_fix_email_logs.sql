-- Fix email_logs table structure
DROP TABLE IF EXISTS email_logs CASCADE;

-- Create email_logs table for tracking REAL email sending
CREATE TABLE email_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email_type TEXT NOT NULL,
    recipient TEXT NOT NULL,
    subject TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('sent', 'failed')),
    error_message TEXT,
    smtp_method TEXT,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add email_status column to contact_submissions if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_submissions' AND column_name = 'email_status') THEN
        ALTER TABLE contact_submissions ADD COLUMN email_status TEXT DEFAULT 'pending';
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX idx_email_logs_type ON email_logs(email_type);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_sent_at ON email_logs(sent_at);

-- Enable RLS
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for service role to manage email logs
CREATE POLICY "Service role can manage email logs" ON email_logs
    FOR ALL USING (auth.role() = 'service_role');

-- Create policy for authenticated users to read email logs (admin dashboard)
CREATE POLICY "Authenticated users can read email logs" ON email_logs
    FOR SELECT USING (auth.role() = 'authenticated');

COMMENT ON TABLE email_logs IS 'Tracks all REAL emails sent via SiteGround SMTP';