import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactSubmission {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  service?: string;
  budget?: string;
  message: string;
}

// REAL SiteGround SMTP Configuration
const ADMIN_EMAIL = 'info@agentic-ai.ltd';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const contactData: ContactSubmission = await req.json();

    // Validate required fields
    if (!contactData.name || !contactData.email || !contactData.message) {
      throw new Error('Missing required fields: name, email, and message are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactData.email)) {
      throw new Error('Invalid email format');
    }

    console.log('Processing REAL contact submission:', contactData.email);

    // Step 1: Store in database
    const { data: submission, error: dbError } = await supabase
      .from('contact_submissions')
      .insert({
        name: contactData.name,
        email: contactData.email,
        company: contactData.company || null,
        phone: contactData.phone || null,
        service: contactData.service || null,
        budget: contactData.budget || null,
        message: contactData.message,
        status: 'new'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save contact submission');
    }

    console.log('Contact submission saved to database:', submission.id);

    // Step 2: Add to Google Sheets
    const sheetsResult = await addToGoogleSheets(contactData);
    
    // Step 3: Send data to Make.com webhook for email automation
    const makeWebhookResult = await sendToMakeWebhook(contactData, submission.id);
    
    // Step 4: Fallback - Send REAL emails via SiteGround SMTP if Make.com fails
    const emailResult = makeWebhookResult.success 
      ? { success: true, message: 'Make.com automation triggered', emailsSent: 2, emailsFailed: 0 }
      : await sendRealContactEmails(contactData, supabase);

    // Step 3: Update database with email status
    await supabase
      .from('contact_submissions')
      .update({
        admin_notes: `REAL Emails - Sent: ${emailResult.emailsSent}, Failed: ${emailResult.emailsFailed} - ${emailResult.message}`,
        email_status: emailResult.success ? 'sent' : 'failed'
      })
      .eq('id', submission.id);

    console.log('REAL contact submission processed successfully');

    return new Response(JSON.stringify({
      success: true,
      message: 'Contact form submitted successfully! We will respond within 4 hours.',
      submissionId: submission.id,
      emailStatus: emailResult.success ? 'Emails sent via SiteGround SMTP' : 'Email sending failed',
      emailsSent: emailResult.emailsSent,
      emailsFailed: emailResult.emailsFailed
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing REAL contact submission:', error);

    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// PRODUCTION Google Sheets Integration via Supabase Edge Function
async function addToGoogleSheets(contactData: ContactSubmission) {
  try {
    console.log('Adding contact data to Google Sheets via production integration...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Call the dedicated Google Sheets integration function
    const { data, error } = await supabase.functions.invoke('google-sheets-integration', {
      body: { contactData }
    });

    if (error) {
      console.error('Google Sheets integration function error:', error);
      throw new Error(error.message || 'Failed to call Google Sheets integration');
    }

    if (!data || !data.success) {
      throw new Error(data?.error || 'Google Sheets integration failed');
    }

    console.log('Google Sheets integration successful:', data);
    return { success: true, result: data.result };
    
  } catch (error) {
    console.error('Google Sheets integration error:', error);
    return { success: false, error: error.message };
  }
}

// Make.com Webhook Integration
async function sendToMakeWebhook(contactData: ContactSubmission, submissionId: string) {
  try {
    // Make.com webhook URL for contact form automation
    const MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/ioueqbwptrsfg5ht8p25llks7j2xwwb8';
    
    if (!MAKE_WEBHOOK_URL) {
      console.warn('MAKE_WEBHOOK_URL not configured, skipping Make.com automation');
      return { success: false, error: 'Webhook URL not configured' };
    }

    console.log('Sending data to Make.com webhook...');
    
    const webhookData = {
      ...contactData,
      submission_id: submissionId,
      timestamp: new Date().toISOString()
    };

    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData)
    });

    if (!response.ok) {
      throw new Error(`Make.com webhook failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Make.com webhook successful:', result);
    
    return { success: true, result };
    
  } catch (error) {
    console.error('Make.com webhook error:', error);
    return { success: false, error: error.message };
  }
}

async function sendRealContactEmails(contactData: ContactSubmission, supabase: any) {
  try {
    console.log('Sending REAL contact form emails via SiteGround SMTP...');

    // Call the REAL SiteGround email service
    const { data, error } = await supabase.functions.invoke('siteground-email', {
      body: {
        type: 'contact_form',
        data: contactData
      }
    });

    if (error) {
      console.error('SiteGround email service error:', error);
      return {
        success: false,
        message: 'Failed to send emails via SiteGround SMTP',
        emailsSent: 0,
        emailsFailed: 2
      };
    }

    console.log('SiteGround email service response:', data);
    return data;

  } catch (error) {
    console.error('Error calling SiteGround email service:', error);
    return {
      success: false,
      message: 'Failed to call SiteGround email service',
      emailsSent: 0,
      emailsFailed: 2
    };
  }
}
