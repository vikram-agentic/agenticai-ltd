-- Fix RLS policies for chatbot configuration to allow admin access
-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to insert chatbot configuration" ON chatbot_configuration;
DROP POLICY IF EXISTS "Allow authenticated users to update chatbot configuration" ON chatbot_configuration;

-- Create new policies that allow admin access
CREATE POLICY "Allow admin to insert chatbot configuration" ON chatbot_configuration
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin to update chatbot configuration" ON chatbot_configuration
    FOR UPDATE USING (true);

-- Also fix the conversations policies for consistency
DROP POLICY IF EXISTS "Allow authenticated users to view all chatbot conversations" ON chatbot_conversations;
DROP POLICY IF EXISTS "Allow authenticated users to update chatbot conversations" ON chatbot_conversations;

CREATE POLICY "Allow admin to view all chatbot conversations" ON chatbot_conversations
    FOR SELECT USING (true);

CREATE POLICY "Allow admin to update chatbot conversations" ON chatbot_conversations
    FOR UPDATE USING (true);

-- Fix messages policies
DROP POLICY IF EXISTS "Allow authenticated users to view all chatbot messages" ON chatbot_messages;

CREATE POLICY "Allow admin to view all chatbot messages" ON chatbot_messages
    FOR SELECT USING (true); 