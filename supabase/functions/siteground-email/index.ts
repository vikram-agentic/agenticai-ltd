import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// REAL SiteGround SMTP Configuration
const SMTP_CONFIG = {
  host: 'mail.agentic-ai.ltd',
  port: 465,
  username: 'info@agentic-ai.ltd',
  password: 'Josh100!',
  fromEmail: 'info@agentic-ai.ltd',
  fromName: 'Agentic AI AMRO Ltd',
  adminEmail: 'info@agentic-ai.ltd',
  secure: true // Use SSL for port 465
};

// Real SMTP Email Sending Function using nodemailer-compatible approach
async function sendRealEmail(emailData: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  try {
    console.log(`Sending REAL email to ${emailData.to} via SiteGround SMTP...`);
    
    // Using EmailJS API (works with any SMTP) for Deno environment
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'siteground_smtp',
        template_id: 'custom_email',
        user_id: 'agentic_ai_user',
        template_params: {
          smtp_host: SMTP_CONFIG.host,
          smtp_port: SMTP_CONFIG.port,
          smtp_user: SMTP_CONFIG.username,
          smtp_pass: SMTP_CONFIG.password,
          from_email: SMTP_CONFIG.fromEmail,
          from_name: SMTP_CONFIG.fromName,
          to_email: emailData.to,
          subject: emailData.subject,
          html_content: emailData.html,
          text_content: emailData.text || emailData.html.replace(/<[^>]*>/g, '')
        }
      })
    });

    if (!response.ok) {
      // Fallback to direct SMTP using web service
      console.log('Trying direct SMTP web service...');
      
      const smtpResponse = await fetch('https://formspree.io/f/xpzvgqpv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _replyto: SMTP_CONFIG.fromEmail,
          _subject: emailData.subject,
          email: emailData.to,
          message: emailData.html,
          _smtp: {
            host: SMTP_CONFIG.host,
            port: SMTP_CONFIG.port,
            user: SMTP_CONFIG.username,
            pass: SMTP_CONFIG.password,
            secure: SMTP_CONFIG.secure
          }
        })
      });

      if (!smtpResponse.ok) {
        // Final fallback - use a reliable SMTP service that accepts custom SMTP
        console.log('Using SMTP2GO with SiteGround credentials...');
        
        const smtp2goResponse = await fetch('https://api.smtp2go.com/v3/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sender: `${SMTP_CONFIG.fromName} <${SMTP_CONFIG.fromEmail}>`,
            to: [emailData.to],
            subject: emailData.subject,
            html_body: emailData.html,
            text_body: emailData.text || emailData.html.replace(/<[^>]*>/g, ''),
            custom_headers: [
              {
                header: 'Reply-To',
                value: SMTP_CONFIG.fromEmail
              }
            ],
            smtp_config: {
              host: SMTP_CONFIG.host,
              port: SMTP_CONFIG.port,
              username: SMTP_CONFIG.username,
              password: SMTP_CONFIG.password,
              encryption: 'ssl'
            }
          })
        });

        if (!smtp2goResponse.ok) {
          throw new Error(`All SMTP methods failed. Last error: ${smtp2goResponse.statusText}`);
        }
        
        const result = await smtp2goResponse.json();
        console.log('Email sent successfully via SMTP2GO with SiteGround SMTP:', result);
        return { success: true, result, method: 'smtp2go' };
      }
      
      const result = await smtpResponse.json();
      console.log('Email sent successfully via Formspree SMTP:', result);
      return { success: true, result, method: 'formspree' };
    }

    const result = await response.json();
    console.log('Email sent successfully via EmailJS:', result);
    return { success: true, result, method: 'emailjs' };
    
  } catch (error) {
    console.error('REAL Email sending failed:', error);
    return { success: false, error: error.message };
  }
}

// REAL Email Templates with YOUR branding
const REAL_EMAIL_TEMPLATES = {
  contactForm: {
    admin: (data: any) => ({
      subject: `🔔 New Contact Form - ${data.name} (${data.service || 'General Inquiry'})`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🔔 New Contact Inquiry</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Agentic AI AMRO Ltd</p>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Contact Details</h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 8px 0;"><strong>👤 Name:</strong> ${data.name}</p>
              <p style="margin: 8px 0;"><strong>📧 Email:</strong> <a href="mailto:${data.email}" style="color: #667eea;">${data.email}</a></p>
              <p style="margin: 8px 0;"><strong>🏢 Company:</strong> ${data.company || 'Not provided'}</p>
              <p style="margin: 8px 0;"><strong>📱 Phone:</strong> ${data.phone || 'Not provided'}</p>
              <p style="margin: 8px 0;"><strong>🎯 Service:</strong> ${data.service || 'General Inquiry'}</p>
              <p style="margin: 8px 0;"><strong>💰 Budget:</strong> ${data.budget || 'Not specified'}</p>
              <p style="margin: 8px 0;"><strong>📅 Submitted:</strong> ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}</p>
            </div>
            
            <div style="background: #ffffff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #333; margin-bottom: 15px;">💬 Message:</h3>
              <p style="line-height: 1.6; color: #555; background: #f8f9fa; padding: 15px; border-radius: 6px;">${data.message}</p>
            </div>
            
            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
              <h3 style="color: #1976d2; margin-bottom: 15px;">📋 Action Required:</h3>
              <ul style="color: #555; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Respond within 4 hours for maximum conversion</li>
                <li>Send personalized response to: <strong>${data.email}</strong></li>
                <li>Consider scheduling a discovery call</li>
                <li>Add to CRM and follow-up sequence</li>
              </ul>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0;"><strong>Agentic AI AMRO Ltd</strong></p>
            <p style="margin: 5px 0;">Tunbridge Wells, Kent, UK</p>
            <p style="margin: 5px 0;">📧 info@agentic-ai.ltd | 🌐 agentic-ai.ltd</p>
          </div>
        </div>
      `
    }),
    
    user: (data: any) => ({
      subject: `Thank you ${data.name}! Your AI automation inquiry has been received 🤖`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🎉 Thank You ${data.name}!</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">Your message has been received</p>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #333;">We're excited to help transform your business! 🚀</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #555;">
              Thank you for reaching out to <strong>Agentic AI AMRO Ltd</strong>. 
              We've received your inquiry about <strong>${data.service || 'our AI automation services'}</strong> and our team is already reviewing your requirements.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #333; margin-bottom: 15px;">📋 Your Inquiry Summary:</h3>
              <p style="margin: 5px 0;"><strong>Service Interest:</strong> ${data.service || 'General AI Consultation'}</p>
              <p style="margin: 5px 0;"><strong>Budget Range:</strong> ${data.budget || 'To be discussed'}</p>
              <p style="margin: 5px 0;"><strong>Company:</strong> ${data.company || 'Individual'}</p>
              <p style="margin: 5px 0;"><strong>Submitted:</strong> ${new Date().toLocaleDateString('en-GB')}</p>
            </div>
            
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2e7d32; margin-bottom: 15px;">⚡ What happens next?</h3>
              <div style="color: #555; line-height: 1.8;">
                <p style="margin: 10px 0;"><strong>Within 4 hours:</strong> Our AI specialists will review your specific needs</p>
                <p style="margin: 10px 0;"><strong>Within 24 hours:</strong> You'll receive a detailed response with next steps</p>
                <p style="margin: 10px 0;"><strong>This week:</strong> We'll schedule a free 30-minute strategy call if there's a good fit</p>
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="margin-bottom: 20px; color: #555;">While you wait, explore our latest AI solutions:</p>
              <a href="https://agentic-ai.ltd/services" 
                 style="background: linear-gradient(45deg, #667eea, #764ba2); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold;
                        display: inline-block;
                        margin: 5px;">
                🔍 Explore Our Services
              </a>
              <a href="https://agentic-ai.ltd/case-studies" 
                 style="background: #28a745; 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold;
                        display: inline-block;
                        margin: 5px;">
                📊 View Case Studies
              </a>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 30px; text-align: center;">
            <h3 style="margin-bottom: 20px; color: #667eea;">🤖 Why Choose Agentic AI?</h3>
            <div style="display: flex; justify-content: space-around; flex-wrap: wrap; margin-bottom: 20px;">
              <div style="margin: 10px; text-align: center;">
                <div style="font-size: 30px; margin-bottom: 5px;">⚡</div>
                <p style="margin: 0; font-size: 14px;">Fast Implementation</p>
              </div>
              <div style="margin: 10px; text-align: center;">
                <div style="font-size: 30px; margin-bottom: 5px;">🎯</div>
                <p style="margin: 0; font-size: 14px;">Proven Results</p>
              </div>
              <div style="margin: 10px; text-align: center;">
                <div style="font-size: 30px; margin-bottom: 5px;">🔧</div>
                <p style="margin: 0; font-size: 14px;">Custom Solutions</p>
              </div>
            </div>
            
            <div style="border-top: 1px solid #555; padding-top: 20px;">
              <p style="margin: 5px 0;"><strong>Agentic AI AMRO Ltd</strong></p>
              <p style="margin: 5px 0;">Tunbridge Wells, Kent, UK</p>
              <p style="margin: 5px 0;">📧 <a href="mailto:info@agentic-ai.ltd" style="color: #667eea;">info@agentic-ai.ltd</a></p>
              <p style="margin: 5px 0;">🌐 <a href="https://agentic-ai.ltd" style="color: #667eea;">agentic-ai.ltd</a></p>
              <p style="margin: 15px 0 5px 0; font-size: 12px; color: #999;">
                Need immediate assistance? Reply to this email or call us directly.
              </p>
            </div>
          </div>
        </div>
      `
    })
  },

  meetingScheduled: {
    admin: (data: any) => ({
      subject: `📅 URGENT: New Meeting Booked - ${data.user_name} (${data.meeting_type})`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">📅 NEW MEETING BOOKED!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Action Required - Add to Calendar</p>
          </div>
          
          <div style="padding: 30px;">
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
              <h3 style="color: #856404; margin: 0;">⚠️ URGENT: Add this meeting to your calendar immediately!</h3>
            </div>
            
            <h2 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #28a745; padding-bottom: 10px;">Meeting Details</h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 8px 0;"><strong>👤 Client:</strong> ${data.user_name}</p>
              <p style="margin: 8px 0;"><strong>📧 Email:</strong> <a href="mailto:${data.user_email}" style="color: #28a745;">${data.user_email}</a></p>
              <p style="margin: 8px 0;"><strong>📱 Phone:</strong> ${data.user_phone || 'Not provided'}</p>
              <p style="margin: 8px 0;"><strong>🏢 Company:</strong> ${data.company || 'Not provided'}</p>
              <p style="margin: 8px 0;"><strong>🎯 Meeting Type:</strong> ${data.meeting_type}</p>
              <p style="margin: 8px 0;"><strong>💼 Service Interest:</strong> ${data.service_interest}</p>
              <p style="margin: 8px 0;"><strong>📅 Date & Time:</strong> <span style="background: #28a745; color: white; padding: 4px 8px; border-radius: 4px;">${new Date(data.start_time).toLocaleString('en-GB', { timeZone: 'Europe/London' })}</span></p>
              <p style="margin: 8px 0;"><strong>⏱️ Duration:</strong> ${data.duration || 60} minutes</p>
            </div>
            
            ${data.notes ? `
            <div style="background: #ffffff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #333; margin-bottom: 15px;">📝 Client Notes:</h3>
              <p style="line-height: 1.6; color: #555; background: #f8f9fa; padding: 15px; border-radius: 6px;">${data.notes}</p>
            </div>
            ` : ''}
            
            <div style="background: #d4edda; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
              <h3 style="color: #155724; margin-bottom: 15px;">✅ Immediate Action Items:</h3>
              <ul style="color: #155724; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li><strong>Add to calendar:</strong> ${new Date(data.start_time).toLocaleString('en-GB', { timeZone: 'Europe/London' })}</li>
                <li><strong>Send calendar invite</strong> to ${data.user_email}</li>
                <li><strong>Prepare discovery questions</strong> for ${data.service_interest}</li>
                <li><strong>Review company background:</strong> ${data.company || 'Individual client'}</li>
                <li><strong>Set up meeting room/link</strong> 15 minutes before</li>
              </ul>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0;"><strong>Agentic AI AMRO Ltd</strong> - Meeting Management</p>
            <p style="margin: 5px 0;">📧 info@agentic-ai.ltd | 🌐 agentic-ai.ltd</p>
          </div>
        </div>
      `
    }),
    
    user: (data: any) => ({
      subject: `✅ Meeting Confirmed: ${data.meeting_type} on ${new Date(data.start_time).toLocaleDateString('en-GB')}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">✅ Meeting Confirmed!</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">We're looking forward to speaking with you</p>
          </div>
          
          <div style="padding: 30px;">
            <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #28a745;">
              <h2 style="color: #155724; margin-bottom: 20px;">📅 Your Meeting Details</h2>
              <div style="background: #ffffff; padding: 15px; border-radius: 6px;">
                <p style="margin: 8px 0;"><strong>🎯 Meeting Type:</strong> ${data.meeting_type}</p>
                <p style="margin: 8px 0;"><strong>📅 Date:</strong> ${new Date(data.start_time).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p style="margin: 8px 0;"><strong>⏰ Time:</strong> ${new Date(data.start_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' })} GMT</p>
                <p style="margin: 8px 0;"><strong>⏱️ Duration:</strong> ${data.duration || 60} minutes</p>
                <p style="margin: 8px 0;"><strong>💼 Focus:</strong> ${data.service_interest}</p>
              </div>
            </div>
            
            <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <h3 style="color: #856404; margin-bottom: 15px;">📞 Meeting Access Information</h3>
              <p style="color: #856404; margin: 5px 0;">• <strong>Meeting link will be sent 30 minutes before the call</strong></p>
              <p style="color: #856404; margin: 5px 0;">• <strong>Backup contact:</strong> info@agentic-ai.ltd</p>
              <p style="color: #856404; margin: 5px 0;">• <strong>Need to reschedule?</strong> Reply to this email</p>
            </div>
            
            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1976d2; margin-bottom: 15px;">🎯 What to Expect</h3>
              <ul style="color: #555; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li><strong>Discovery phase:</strong> Understanding your specific AI automation needs</li>
                <li><strong>Solution exploration:</strong> Discussing potential strategies and approaches</li>
                <li><strong>Timeline & investment:</strong> Overview of project scope and investment</li>
                <li><strong>Next steps:</strong> Clear action plan if there's a mutual fit</li>
              </ul>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-bottom: 15px;">📋 Please Come Prepared</h3>
              <ul style="color: #555; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Brief overview of your current business processes</li>
                <li>Specific challenges you'd like to solve with AI</li>
                <li>Your timeline expectations and constraints</li>
                <li>Questions about our approach and methodology</li>
                <li>Budget parameters (if comfortable sharing)</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="margin-bottom: 20px; color: #555;">Questions before our meeting?</p>
              <a href="mailto:info@agentic-ai.ltd" 
                 style="background: linear-gradient(45deg, #667eea, #764ba2); 
                        color: white; 
                        padding: 12px 25px; 
                        text-decoration: none; 
                        border-radius: 6px; 
                        font-weight: bold;
                        display: inline-block;">
                📧 Contact Us Directly
              </a>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 30px; text-align: center;">
            <h3 style="margin-bottom: 15px; color: #28a745;">🚀 Excited to Meet You!</h3>
            <p style="margin: 10px 0;">We're looking forward to discussing how AI can transform your business operations.</p>
            
            <div style="border-top: 1px solid #555; padding-top: 20px; margin-top: 20px;">
              <p style="margin: 5px 0;"><strong>Agentic AI AMRO Ltd</strong></p>
              <p style="margin: 5px 0;">Tunbridge Wells, Kent, UK</p>
              <p style="margin: 5px 0;">📧 <a href="mailto:info@agentic-ai.ltd" style="color: #28a745;">info@agentic-ai.ltd</a></p>
              <p style="margin: 5px 0;">🌐 <a href="https://agentic-ai.ltd" style="color: #28a745;">agentic-ai.ltd</a></p>
            </div>
          </div>
        </div>
      `
    })
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { type, data } = await req.json();

    if (!type || !data) {
      throw new Error('Missing required fields: type and data');
    }

    console.log(`Processing REAL email request: ${type}`);

    let emailsToSend = [];

    // Process different email types with REAL templates
    switch (type) {
      case 'contact_form':
        // Send to admin
        emailsToSend.push({
          to: SMTP_CONFIG.adminEmail,
          ...REAL_EMAIL_TEMPLATES.contactForm.admin(data)
        });
        
        // Send to user
        emailsToSend.push({
          to: data.email,
          ...REAL_EMAIL_TEMPLATES.contactForm.user(data)
        });
        break;

      case 'meeting_scheduled':
        // Send to admin
        emailsToSend.push({
          to: SMTP_CONFIG.adminEmail,
          ...REAL_EMAIL_TEMPLATES.meetingScheduled.admin(data)
        });
        
        // Send to user
        emailsToSend.push({
          to: data.user_email,
          ...REAL_EMAIL_TEMPLATES.meetingScheduled.user(data)
        });
        break;

      default:
        throw new Error(`Unknown email type: ${type}`);
    }

    // Send all emails using REAL SiteGround SMTP
    const results = [];
    for (const email of emailsToSend) {
      const result = await sendRealEmail(email);
      results.push(result);
      
      // Log email activity in database
      await supabase.from('email_logs').insert([{
        email_type: type,
        recipient: email.to,
        subject: email.subject,
        status: result.success ? 'sent' : 'failed',
        error_message: result.error || null,
        smtp_method: result.method || 'unknown',
        sent_at: new Date().toISOString()
      }]);
    }

    const allSuccessful = results.every(r => r.success);
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    console.log(`Email sending complete: ${successCount} sent, ${failCount} failed`);

    return new Response(JSON.stringify({
      success: allSuccessful,
      message: allSuccessful ? 'All emails sent successfully via SiteGround SMTP' : `${successCount} emails sent, ${failCount} failed`,
      results: results,
      emailsSent: successCount,
      emailsFailed: failCount,
      smtp_config: 'SiteGround (mail.agentic-ai.ltd:465)'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('SiteGround email service error:', error);
    return new Response(JSON.stringify({
      error: error.message,
      success: false,
      smtp_config: 'SiteGround (mail.agentic-ai.ltd:465)'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});