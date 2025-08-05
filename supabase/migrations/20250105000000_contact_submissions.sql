-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    phone VARCHAR(50),
    service VARCHAR(255),
    budget VARCHAR(100),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);

-- Create index for date filtering
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from authenticated users (for admin dashboard)
CREATE POLICY "Allow authenticated users to view contact submissions" ON contact_submissions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow public inserts (for contact form)
CREATE POLICY "Allow public to insert contact submissions" ON contact_submissions
    FOR INSERT WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_contact_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_contact_submissions_updated_at
    BEFORE UPDATE ON contact_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_contact_submissions_updated_at(); 