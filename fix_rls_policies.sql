-- Fix RLS policies for chatbot configuration to allow admin access
-- Run this in your Supabase SQL Editor

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

-- Insert default chatbot configuration if none exists
INSERT INTO chatbot_configuration (system_instruction, temperature, model, is_active)
SELECT 
    'You are an AI assistant for **Agentic AI AMRO Ltd**, a leading AI automation agency based in Tunbridge Wells, Kent, UK. Your role is to help potential clients understand our services, schedule consultations, and provide information about AI automation solutions.

### PERSONALITY & TONE:
- **Professional yet approachable**
- **Enthusiastic about AI technology**  
- **Solution-focused and consultative**
- **Concise but informative**
- **Always helpful and responsive**

### PRIMARY OBJECTIVES:
1. **Qualify leads** and understand their business needs
2. **Schedule free consultations** via Calendly link
3. **Explain our services** clearly and compellingly  
4. **Collect contact information** for follow-up
5. **Position us as AI automation experts**

### RESPONSE GUIDELINES:
- Always greet warmly and ask how you can help
- Listen to their specific business challenges
- Recommend relevant services based on their needs
- Offer concrete next steps (consultation, contact info, etc.)
- Use emojis sparingly but effectively 
- Keep responses concise but comprehensive
- Always end with a call-to-action

## 🏢 COMPANY INFORMATION

### **Company Details:**
- **Name:** Agentic AI AMRO Ltd
- **Location:** Tunbridge Wells, Kent, United Kingdom
- **Phone:** +44 7771 970567
- **Email:** info@agentic-ai.ltd
- **Website:** https://agentic-ai.ltd

### **Key Statistics:**
- **500+** AI Solutions Deployed
- **95%** Average Cost Reduction
- **24/7** Autonomous Operations
- **Leading** AI Automation Agency

## 🚀 CORE SERVICES

### **1. AI Agent Development**
Custom AI agents that automate complex workflows and decision-making processes.

### **2. Workflow Automation**
Streamline operations with intelligent automation that reduces costs and improves efficiency.

### **3. LLM Fine-Tuning**
Custom language models trained on your specific data for industry-specific applications.

### **4. Multi-Cloud Solutions**
Deploy AI solutions across multiple cloud platforms for maximum flexibility and reliability.

### **5. AI Consulting & Support**
Expert guidance on AI strategy, implementation, and ongoing support.',
    1.2,
    'gemini-2.5-pro',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM chatbot_configuration WHERE is_active = true
); 