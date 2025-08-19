import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  source?: string;
  preferredContact?: string;
  meetingType?: string;
  scheduleMeeting?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const {
      name,
      email,
      phone,
      company,
      message,
      source = 'website',
      preferredContact = 'email',
      meetingType,
      scheduleMeeting = false
    }: ContactSubmission = await req.json();

    if (!name || !email || !message) {
      throw new Error('Missing required fields: name, email, and message');
    }

    console.log('Processing contact submission from:', email);

    // Calculate lead score based on submission data
    const leadScore = calculateLeadScore({
      hasCompany: !!company,
      hasPhone: !!phone,
      messageLength: message.length,
      wantsMeeting: scheduleMeeting,
      source: source
    });

    // Determine priority based on lead score and content
    const priority = determinePriority(message, leadScore, scheduleMeeting);

    // Extract tags from message content
    const tags = extractTags(message, company);

    // Save contact submission to database
    const { data: contact, error: contactError } = await supabase
      .from('contact_submissions')
      .insert({
        name,
        email,
        phone,
        company,
        message,
        source,
        status: 'new',
        priority,
        lead_score: leadScore,
        tags,
        is_read: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (contactError) {
      console.error('Database error:', contactError);
      throw new Error('Failed to save contact submission');
    }

    // Send notification emails
    const emailResults = await Promise.allSettled([
      sendAdminNotification(contact),
      sendCustomerConfirmation(contact)
    ]);

    const emailErrors = emailResults
      .filter(result => result.status === 'rejected')
      .map(result => (result as PromiseRejectedResult).reason);

    if (emailErrors.length > 0) {
      console.error('Email errors:', emailErrors);
    }

    // If meeting is requested, create initial meeting record
    let meetingId = null;
    if (scheduleMeeting && meetingType) {
      try {
        const { data: meeting, error: meetingError } = await supabase
          .from('scheduled_meetings')
          .insert({
            contact_id: contact.id,
            attendee_name: name,
            attendee_email: email,
            attendee_phone: phone,
            meeting_type: meetingType,
            title: `${meetingType} with ${name}`,
            description: `Meeting requested via contact form: ${message.substring(0, 100)}...`,
            status: 'scheduled',
            duration: meetingType === 'consultation' ? 30 : 60,
            timezone: 'Europe/London',
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (!meetingError) {
          meetingId = meeting.id;
          console.log('Meeting record created:', meetingId);
        }
      } catch (meetingErr) {
        console.error('Meeting creation error:', meetingErr);
      }
    }

    console.log('Contact submission processed successfully:', contact.id);

    return new Response(JSON.stringify({
      success: true,
      contactId: contact.id,
      meetingId,
      leadScore,
      priority,
      message: 'Thank you for your message! We will get back to you soon.',
      submittedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Contact manager error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      message: 'Sorry, there was an error submitting your message. Please try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function sendAdminNotification(contact: any): Promise<void> {
  const SMTP_HOST = Deno.env.get('SITEGROUND_SMTP_HOST');
  const SMTP_USER = Deno.env.get('SITEGROUND_SMTP_USER');
  const SMTP_PASS = Deno.env.get('SITEGROUND_SMTP_PASS');
  const ADMIN_EMAIL = Deno.env.get('SITEGROUND_ADMIN_EMAIL') || 'info@agentic-ai.ltd';

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.log('SMTP not configured, skipping admin notification');
    return;
  }

  const subject = `New Contact Submission - ${contact.priority.toUpperCase()} Priority`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0; }
        .info-item { background: #f8f9fa; padding: 10px; border-radius: 5px; }
        .priority-high { border-left: 4px solid #dc2626; }
        .priority-medium { border-left: 4px solid #f59e0b; }
        .priority-low { border-left: 4px solid #10b981; }
        .message-box { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .actions { background: #e5e7eb; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>New Contact Submission</h1>
        <p>Priority: ${contact.priority.toUpperCase()} | Score: ${contact.lead_score}/100</p>
      </div>
      
      <div class="content">
        <div class="info-grid">
          <div class="info-item">
            <strong>Name:</strong> ${contact.name}
          </div>
          <div class="info-item">
            <strong>Email:</strong> ${contact.email}
          </div>
          <div class="info-item">
            <strong>Phone:</strong> ${contact.phone || 'Not provided'}
          </div>
          <div class="info-item">
            <strong>Company:</strong> ${contact.company || 'Not provided'}
          </div>
          <div class="info-item">
            <strong>Source:</strong> ${contact.source}
          </div>
          <div class="info-item">
            <strong>Submitted:</strong> ${new Date(contact.created_at).toLocaleString('en-GB')}
          </div>
        </div>

        ${contact.tags && contact.tags.length > 0 ? `
        <div class="info-item">
          <strong>Tags:</strong> ${contact.tags.join(', ')}
        </div>
        ` : ''}

        <div class="message-box priority-${contact.priority}">
          <h3>Message:</h3>
          <p>${contact.message.replace(/\n/g, '<br>')}</p>
        </div>

        <div class="actions">
          <h3>Recommended Actions:</h3>
          <ul>
            ${contact.priority === 'high' ? '<li><strong>Respond within 1 hour</strong></li>' : ''}
            ${contact.priority === 'medium' ? '<li>Respond within 4 hours</li>' : ''}
            ${contact.priority === 'low' ? '<li>Respond within 24 hours</li>' : ''}
            <li>${contact.phone ? `Call: ${contact.phone}` : 'No phone provided'}</li>
            <li>Reply to: ${contact.email}</li>
            ${contact.company ? `<li>Research company: ${contact.company}</li>` : ''}
          </ul>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: 'default_service',
        template_id: 'default_template',
        user_id: 'default_user',
        template_params: {
          to_email: ADMIN_EMAIL,
          from_email: SMTP_USER,
          subject: subject,
          html_content: html
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Email API error: ${response.status}`);
    }

    console.log('Admin notification sent successfully');
  } catch (error) {
    console.error('Failed to send admin notification:', error);
    throw error;
  }
}

async function sendCustomerConfirmation(contact: any): Promise<void> {
  const SMTP_HOST = Deno.env.get('SITEGROUND_SMTP_HOST');
  const SMTP_USER = Deno.env.get('SITEGROUND_SMTP_USER');
  const SMTP_PASS = Deno.env.get('SITEGROUND_SMTP_PASS');

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.log('SMTP not configured, skipping customer confirmation');
    return;
  }

  const responseTimeMap = {
    high: '1 hour',
    medium: '4 hours',
    low: '24 hours'
  };

  const subject = 'Thank you for contacting Agentic AI - We\'ll be in touch soon!';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #1e40af; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; max-width: 600px; margin: 0 auto; }
        .highlight { background: #e0f2fe; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; }
        .contact-info { background: #f0f9ff; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Thank you for contacting Agentic AI!</h1>
        <p>Your AI transformation partner in Tunbridge Wells</p>
      </div>
      
      <div class="content">
        <h2>Hello ${contact.name},</h2>
        
        <p>Thank you for reaching out to Agentic AI AMRO Ltd! We've received your message and our team is excited to help you explore how AI can transform your business operations.</p>
        
        <div class="highlight">
          <h3>Your Submission Summary:</h3>
          <p><strong>Name:</strong> ${contact.name}</p>
          <p><strong>Email:</strong> ${contact.email}</p>
          ${contact.company ? `<p><strong>Company:</strong> ${contact.company}</p>` : ''}
          <p><strong>Submitted:</strong> ${new Date(contact.created_at).toLocaleString('en-GB')}</p>
          <p><strong>Expected Response Time:</strong> Within ${responseTimeMap[contact.priority] || '24 hours'}</p>
        </div>

        <h3>What happens next?</h3>
        <ol>
          <li><strong>Review:</strong> Our AI specialists will review your requirements</li>
          <li><strong>Response:</strong> We'll get back to you within ${responseTimeMap[contact.priority] || '24 hours'}</li>
          <li><strong>Consultation:</strong> We'll schedule a free consultation to discuss your AI strategy</li>
          <li><strong>Proposal:</strong> We'll create a tailored AI solution for your business</li>
        </ol>

        <div class="contact-info">
          <h3>Need immediate assistance?</h3>
          <p><strong>Email:</strong> info@agentic-ai.ltd</p>
          <p><strong>Website:</strong> https://agentic-ai.ltd</p>
          <p><strong>Location:</strong> Tunbridge Wells, Kent, UK</p>
        </div>

        <p>We specialize in:</p>
        <ul>
          <li><strong>Process Automation</strong> - Streamline repetitive tasks</li>
          <li><strong>Intelligent Decision Making</strong> - AI-powered insights</li>
          <li><strong>Business Transformation</strong> - Complete digital makeover</li>
          <li><strong>AI Integration</strong> - Seamless technology adoption</li>
        </ul>

        <p>Looking forward to helping you unlock the power of AI for your business!</p>
        
        <p>Best regards,<br>
        <strong>The Agentic AI Team</strong><br>
        Tunbridge Wells, Kent</p>
      </div>

      <div class="footer">
        <p>© 2024 Agentic AI AMRO Ltd | Tunbridge Wells, Kent, UK</p>
        <p>This is an automated confirmation. Please do not reply to this email.</p>
      </div>
    </body>
    </html>
  `;

  try {
    // Using a simplified email sending approach
    console.log('Customer confirmation email prepared for:', contact.email);
    // In production, this would use the actual SMTP configuration
    
  } catch (error) {
    console.error('Failed to send customer confirmation:', error);
    throw error;
  }
}

function calculateLeadScore(data: {
  hasCompany: boolean;
  hasPhone: boolean;
  messageLength: number;
  wantsMeeting: boolean;
  source: string;
}): number {
  let score = 0;
  
  // Base score
  score += 20;
  
  // Company information
  if (data.hasCompany) score += 25;
  
  // Phone number provided
  if (data.hasPhone) score += 15;
  
  // Message quality
  if (data.messageLength > 100) score += 20;
  if (data.messageLength > 300) score += 10;
  
  // Meeting interest
  if (data.wantsMeeting) score += 30;
  
  // Source quality
  if (data.source === 'referral') score += 20;
  if (data.source === 'linkedin') score += 15;
  if (data.source === 'google') score += 10;
  
  return Math.min(score, 100);
}

function determinePriority(message: string, leadScore: number, wantsMeeting: boolean): string {
  const lowerMessage = message.toLowerCase();
  
  // High priority keywords
  const urgentKeywords = ['urgent', 'asap', 'immediately', 'deadline', 'enterprise', 'large company', 'budget'];
  const hasUrgentKeywords = urgentKeywords.some(keyword => lowerMessage.includes(keyword));
  
  if (hasUrgentKeywords || leadScore >= 80 || wantsMeeting) {
    return 'high';
  }
  
  if (leadScore >= 60 || lowerMessage.includes('interested') || lowerMessage.includes('proposal')) {
    return 'medium';
  }
  
  return 'low';
}

function extractTags(message: string, company?: string): string[] {
  const tags = [];
  const lowerMessage = message.toLowerCase();
  
  // Service-related tags
  if (lowerMessage.includes('automation')) tags.push('automation');
  if (lowerMessage.includes('ai') || lowerMessage.includes('artificial intelligence')) tags.push('ai');
  if (lowerMessage.includes('chatbot')) tags.push('chatbot');
  if (lowerMessage.includes('data') || lowerMessage.includes('analytics')) tags.push('data-analytics');
  if (lowerMessage.includes('process')) tags.push('process-optimization');
  if (lowerMessage.includes('integration')) tags.push('integration');
  if (lowerMessage.includes('consultation')) tags.push('consultation');
  if (lowerMessage.includes('training')) tags.push('training');
  
  // Industry tags
  if (company) {
    const lowerCompany = company.toLowerCase();
    if (lowerCompany.includes('tech') || lowerCompany.includes('software')) tags.push('technology');
    if (lowerCompany.includes('finance') || lowerCompany.includes('bank')) tags.push('finance');
    if (lowerCompany.includes('retail') || lowerCompany.includes('shop')) tags.push('retail');
    if (lowerCompany.includes('health') || lowerCompany.includes('medical')) tags.push('healthcare');
  }
  
  // Intent tags
  if (lowerMessage.includes('quote') || lowerMessage.includes('price')) tags.push('pricing-inquiry');
  if (lowerMessage.includes('demo') || lowerMessage.includes('presentation')) tags.push('demo-request');
  if (lowerMessage.includes('partner') || lowerMessage.includes('collaboration')) tags.push('partnership');
  
  return [...new Set(tags)]; // Remove duplicates
}
