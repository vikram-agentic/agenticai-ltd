import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHash } from "https://deno.land/std@0.184.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email, password, action = 'login' } = await req.json();

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    if (action === 'login') {
      // Verify admin credentials
      if (email !== 'info@agentic-ai.ltd' || password !== 'agenticailtd') {
        return new Response(JSON.stringify({ 
          error: 'Invalid credentials',
          success: false 
        }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Generate session token (simplified)
      const sessionToken = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // In a real implementation, you'd store this session in a database
      // For now, we'll just return the token
      
      console.log('Admin login successful for:', email);

      return new Response(JSON.stringify({
        success: true,
        token: sessionToken,
        expiresAt: expiresAt.toISOString(),
        user: {
          email,
          role: 'admin'
        },
        message: 'Login successful'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'verify') {
      // Verify session token
      const { sessionToken } = await req.json();
      
      if (!sessionToken) {
        return new Response(JSON.stringify({ 
          error: 'Session token required',
          success: false 
        }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // In a real implementation, verify the token against database
      // For now, just check if token exists
      return new Response(JSON.stringify({
        success: true,
        valid: true,
        user: {
          email: 'info@agentic-ai.ltd',
          role: 'admin'
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else {
      throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Error in admin auth:', error);

    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});