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

// Email service configuration (using Resend - free tier available)
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const ADMIN_EMAIL = 'info@agentic-ai.ltd';
const FROM_EMAIL = 'onboarding@resend.dev'; // Use Resend's default sender until domain is verified

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

    console.log('Processing contact submission:', contactData.email);

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

    // Step 2: Send email to admin
    const adminEmailSent = await sendAdminEmail(contactData, submission.id);
    
    // Step 3: Send acknowledgment email to user
    const userEmailSent = await sendUserAcknowledgment(contactData);

    // Step 4: Log email status
    await supabase
      .from('contact_submissions')
      .update({
        admin_notes: `Admin email: ${adminEmailSent ? 'Sent' : 'Failed'}, User email: ${userEmailSent ? 'Sent' : 'Failed'}`
      })
      .eq('id', submission.id);

    console.log('Contact submission processed successfully');

    return new Response(JSON.stringify({
      success: true,
      message: 'Contact form submitted successfully. We will get back to you within 24 hours.',
      submissionId: submission.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing contact submission:', error);

    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function sendAdminEmail(contactData: ContactSubmission, submissionId: string): Promise<boolean> {
  try {
    if (!RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured, skipping admin email');
      return false;
    }

    const adminEmailContent = `
New Contact Form Submission

Submission ID: ${submissionId}
Date: ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}

Contact Details:
- Name: ${contactData.name}
- Email: ${contactData.email}
- Company: ${contactData.company || 'Not provided'}
- Phone: ${contactData.phone || 'Not provided'}
- Service Interest: ${contactData.service || 'Not specified'}
- Budget Range: ${contactData.budget || 'Not specified'}

Message:
${contactData.message}

---
This email was sent from the Agentic AI contact form.
Please respond to ${contactData.email} within 24 hours.
    `;

    console.log('Sending admin email to:', ADMIN_EMAIL);
    console.log('Using Resend API key:', RESEND_API_KEY ? 'Configured' : 'Missing');
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `New Contact Form Submission - ${contactData.name}`,
        text: adminEmailContent,
        html: adminEmailContent.replace(/\n/g, '<br>')
      }),
    });

    console.log('Resend API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Admin email failed. Status:', response.status, 'Error:', errorText);
      return false;
    }

    const responseData = await response.json();
    console.log('Resend API response:', responseData);

    console.log('Admin email sent successfully');
    return true;

  } catch (error) {
    console.error('Error sending admin email:', error);
    return false;
  }
}

async function sendUserAcknowledgment(contactData: ContactSubmission): Promise<boolean> {
  try {
    if (!RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured, skipping user acknowledgment email');
      return false;
    }

    const userEmailContent = `
Dear ${contactData.name},

Thank you for contacting Agentic AI! We have received your inquiry and are excited to discuss how we can help transform your business with AI.

What happens next:
1. Our team will review your requirements within the next 4 hours
2. We'll schedule a 30-minute discovery call to understand your needs
3. You'll receive a custom proposal tailored to your project

Your submission details:
- Service Interest: ${contactData.service || 'Not specified'}
- Budget Range: ${contactData.budget || 'Not specified'}
- Message: ${contactData.message.substring(0, 100)}${contactData.message.length > 100 ? '...' : ''}

If you have any urgent questions, please don't hesitate to call us at +44 7771 970567.

Best regards,
The Agentic AI Team

---
Agentic AI AMRO Ltd
Tunbridge Wells, Kent, UK
Phone: +44 7771 970567
Email: info@agentic-ai.ltd
Website: https://agentic-ai.ltd

This is an automated acknowledgment. Please do not reply to this email.
    `;

    console.log('Sending user acknowledgment email to:', contactData.email);
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: contactData.email,
        subject: 'Thank you for contacting Agentic AI - We\'ll be in touch soon!',
        text: userEmailContent,
        html: userEmailContent.replace(/\n/g, '<br>')
      }),
    });

    console.log('User email Resend API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('User acknowledgment email failed. Status:', response.status, 'Error:', errorText);
      return false;
    }

    const responseData = await response.json();
    console.log('User email Resend API response:', responseData);

    console.log('User acknowledgment email sent successfully');
    return true;

  } catch (error) {
    console.error('Error sending user acknowledgment email:', error);
    return false;
  }
} 