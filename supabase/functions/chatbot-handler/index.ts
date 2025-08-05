import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenAI } from 'https://esm.sh/@google/genai@1.12.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  message: string
  sessionId: string
  conversationId?: string
  userEmail?: string
  userName?: string
  company?: string
  phone?: string
}

interface ChatResponse {
  success: boolean
  message?: string
  conversationId?: string
  error?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get Gemini API key
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not found in environment variables')
    }

    // Parse request body
    const { message, sessionId, conversationId, userEmail, userName, company, phone }: ChatRequest = await req.json()

    if (!message || !sessionId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Message and sessionId are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Get or create conversation
    let currentConversationId = conversationId
    if (!currentConversationId) {
      const { data: conversation, error: convError } = await supabase
        .from('chatbot_conversations')
        .insert({
          session_id: sessionId,
          user_email: userEmail,
          user_name: userName,
          company: company,
          phone: phone
        })
        .select()
        .single()

      if (convError) {
        console.error('Error creating conversation:', convError)
        throw new Error('Failed to create conversation')
      }

      currentConversationId = conversation.id
    }

    // Get chatbot configuration
    const { data: config, error: configError } = await supabase
      .from('chatbot_configuration')
      .select('*')
      .eq('is_active', true)
      .single()

    if (configError || !config) {
      console.error('Error fetching chatbot config:', configError)
      throw new Error('Failed to fetch chatbot configuration')
    }

    // Get conversation history
    const { data: messages, error: messagesError } = await supabase
      .from('chatbot_messages')
      .select('role, content')
      .eq('conversation_id', currentConversationId)
      .order('created_at', { ascending: true })

    if (messagesError) {
      console.error('Error fetching messages:', messagesError)
      throw new Error('Failed to fetch conversation history')
    }

    // Store user message
    const { error: userMsgError } = await supabase
      .from('chatbot_messages')
      .insert({
        conversation_id: currentConversationId,
        role: 'user',
        content: message
      })

    if (userMsgError) {
      console.error('Error storing user message:', userMsgError)
    }

    // Initialize Gemini
    const ai = new GoogleGenAI({
      apiKey: geminiApiKey,
    })

    const geminiConfig = {
      temperature: config.temperature || 1.2,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 3000,
    }

    const model = config.model || 'gemini-2.5-pro'

    // Prepare conversation history for Gemini
    const contents = [
      {
        role: 'user',
        parts: [{ text: `${config.system_instruction}\n\nConversation history:\n${messages.map(msg => `${msg.role}: ${msg.content}`).join('\n')}\n\nUser: ${message}` }]
      }
    ]

    // Generate response
    const startTime = Date.now()
    const response = await ai.models.generateContentStream({
      model,
      config: geminiConfig,
      contents,
    })

    let assistantResponse = ''
    for await (const chunk of response) {
      if (chunk.text) {
        assistantResponse += chunk.text
      }
    }

    const responseTime = Date.now() - startTime

    // Store assistant message
    const { error: assistantMsgError } = await supabase
      .from('chatbot_messages')
      .insert({
        conversation_id: currentConversationId,
        role: 'assistant',
        content: assistantResponse,
        response_time_ms: responseTime
      })

    if (assistantMsgError) {
      console.error('Error storing assistant message:', assistantMsgError)
    }

    // Update conversation if user provided contact info
    if (userEmail || userName || company || phone) {
      await supabase
        .from('chatbot_conversations')
        .update({
          user_email: userEmail,
          user_name: userName,
          company: company,
          phone: phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentConversationId)
    }

    const responseData: ChatResponse = {
      success: true,
      message: assistantResponse,
      conversationId: currentConversationId
    }

    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Chatbot error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}) 