import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  conversationId?: string;
  sessionId: string;
  message: string;
  userName?: string;
  userEmail?: string;
  company?: string;
  phone?: string;
  userAgent?: string;
  ipAddress?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { conversationId, sessionId, message, userName, userEmail, company, phone, userAgent, ipAddress }: ChatMessage = await req.json();

    if (!sessionId || !message) {
      throw new Error('Missing required parameters');
    }

    console.log('Processing chat message for session:', sessionId);

    // Get or create conversation
    let conversation;
    if (conversationId) {
      const { data: existingConv } = await supabase
        .from('chatbot_conversations')
        .select('*')
        .eq('id', conversationId)
        .single();
      conversation = existingConv;
    } else {
      // Find by session_id or create new
      const { data: existingConv } = await supabase
        .from('chatbot_conversations')
        .select('*')
        .eq('session_id', sessionId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (existingConv) {
        conversation = existingConv;
      } else {
        // Create new conversation
        const { data: newConv, error: convError } = await supabase
          .from('chatbot_conversations')
          .insert({
            session_id: sessionId,
            user_name: userName,
            user_email: userEmail,
            company: company,
            phone: phone,
            status: 'active',
            lead_score: 0
          })
          .select()
          .single();

        if (convError) {
          console.error('Error creating conversation:', convError);
          throw new Error('Failed to create conversation');
        }
        conversation = newConv;
      }
    }

    // Save user message
    await supabase
      .from('chatbot_messages')
      .insert({
        conversation_id: conversation.id,
        role: 'user',
        content: message
      });

    // Get conversation history for context
    const { data: recentMessages } = await supabase
      .from('chatbot_messages')
      .select('role, content')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true })
      .limit(10);

    // Get chatbot configuration
    const { data: config } = await supabase
      .from('chatbot_configuration')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!config) {
      throw new Error('Chatbot configuration not found');
    }

    // Generate response using real Gemini API
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const botResponse = await generateChatResponse(message, recentMessages, config, GEMINI_API_KEY);

    // Save bot response
    const startTime = Date.now();
    await supabase
      .from('chatbot_messages')
      .insert({
        conversation_id: conversation.id,
        role: 'assistant',
        content: botResponse,
        response_time_ms: Date.now() - startTime
      });

    // Update conversation
    await supabase
      .from('chatbot_conversations')
      .update({
        lead_score: Math.min((conversation.lead_score || 0) + 1, 100)
      })
      .eq('id', conversation.id);

    console.log('Chat response generated for session:', sessionId);

    return new Response(JSON.stringify({
      success: true,
      conversationId: conversation.id,
      sessionId: sessionId,
      message: botResponse,
      respondedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      message: "I'm sorry, I'm experiencing technical difficulties. Please try again in a moment."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateChatResponse(userMessage: string, conversationHistory: any[], config: any, apiKey: string): Promise<string> {
  const contextMessages = conversationHistory.map(msg => 
    `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
  ).join('\n');

  const prompt = `${config.system_instruction}

Previous conversation context:
${contextMessages}

Current user message: ${userMessage}

IMPORTANT INSTRUCTIONS:
1. Respond as an AI assistant for Agentic AI AMRO Ltd
2. Be professional, helpful, and engaging
3. Focus on AI business solutions and automation
4. Keep responses concise but informative (max 200 words)
5. If asked about services, mention AI automation, business transformation, and intelligent decision-making
6. For technical questions, provide practical, actionable advice
7. Always maintain a professional yet friendly tone
8. If the user seems interested in services, gently guide them toward contacting the team

Company Information:
- Agentic AI AMRO Ltd
- Location: Tunbridge Wells, Kent, UK  
- Email: info@agentic-ai.ltd
- Website: https://agentic-ai.ltd
- Services: AI automation, business transformation, intelligent decision-making, process optimization

Respond naturally and helpfully to the user's message:`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: config.temperature || 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: config.max_tokens || 500,
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error('No response generated');
    }

    let botResponse = data.candidates[0].content.parts[0].text.trim();
    
    // Clean up the response
    botResponse = botResponse.replace(/^(Assistant:|Bot:|AI:)\s*/i, '');
    
    // Ensure it's not too long
    if (botResponse.length > 600) {
      botResponse = botResponse.substring(0, 597) + '...';
    }

    return botResponse;

  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Fallback responses based on message content
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return config.welcome_message || "Hello! I'm here to help you with AI solutions for your business. How can I assist you today?";
    }
    
    if (lowerMessage.includes('service') || lowerMessage.includes('ai') || lowerMessage.includes('automation')) {
      return "Agentic AI specializes in business AI solutions including process automation, intelligent decision-making, and business transformation. We help companies in Tunbridge Wells and across the UK optimize their operations with cutting-edge AI technology. Would you like to learn more about how we can help your business?";
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('phone')) {
      return "You can reach our team at info@agentic-ai.ltd or visit our website at https://agentic-ai.ltd. We're based in Tunbridge Wells, Kent, and we'd love to discuss how AI can transform your business operations.";
    }
    
    return config.fallback_responses?.[0] || "I'm here to help you with AI solutions for your business. Could you tell me more about what you're looking for?";
  }
}