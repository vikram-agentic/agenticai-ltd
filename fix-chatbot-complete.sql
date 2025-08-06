-- Comprehensive fix for chatbot functionality

-- 1. Disable RLS temporarily for chatbot tables
ALTER TABLE chatbot_configuration DISABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_messages DISABLE ROW LEVEL SECURITY;

-- 2. Clear existing data
DELETE FROM chatbot_messages;
DELETE FROM chatbot_conversations;
DELETE FROM chatbot_configuration;

-- 3. Insert default chatbot configuration
INSERT INTO chatbot_configuration (
    id,
    system_instruction,
    temperature,
    model,
    is_active,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'You are AgenticAI, an AI assistant for Agentic AI AMRO Ltd. You help businesses understand and implement AI automation solutions. You are knowledgeable about AI agents, automation, and business transformation. Always be helpful, professional, and provide actionable advice. If you don''t know something, suggest contacting the team at info@agentic-ai.ltd.',
    1.2,
    'gemini-2.5-pro',
    true,
    NOW(),
    NOW()
);

-- 4. Re-enable RLS
ALTER TABLE chatbot_configuration ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_messages ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies
DROP POLICY IF EXISTS "Allow admin to insert chatbot configuration" ON chatbot_configuration;
DROP POLICY IF EXISTS "Allow admin to update chatbot configuration" ON chatbot_configuration;
DROP POLICY IF EXISTS "Allow admin to select chatbot configuration" ON chatbot_configuration;

DROP POLICY IF EXISTS "Allow admin to insert chatbot conversations" ON chatbot_conversations;
DROP POLICY IF EXISTS "Allow admin to update chatbot conversations" ON chatbot_conversations;
DROP POLICY IF EXISTS "Allow admin to select chatbot conversations" ON chatbot_conversations;

DROP POLICY IF EXISTS "Allow admin to insert chatbot messages" ON chatbot_messages;
DROP POLICY IF EXISTS "Allow admin to update chatbot messages" ON chatbot_messages;
DROP POLICY IF EXISTS "Allow admin to select chatbot messages" ON chatbot_messages;

-- 6. Create new policies that allow all operations
CREATE POLICY "Allow all operations on chatbot_configuration" ON chatbot_configuration FOR ALL USING (true);
CREATE POLICY "Allow all operations on chatbot_conversations" ON chatbot_conversations FOR ALL USING (true);
CREATE POLICY "Allow all operations on chatbot_messages" ON chatbot_messages FOR ALL USING (true);

-- 7. Verify the configuration
SELECT 'Chatbot configuration count:' as info, COUNT(*) as count FROM chatbot_configuration WHERE is_active = true; 