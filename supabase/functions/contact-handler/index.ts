import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Contact email sending function using Resend API with verified domain
async function sendContactEmails(contactData: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  service?: string;
  budget?: string;
  message: string;
}) {
  console.log(`📧 Processing contact form submission from ${contactData.email}...`);
  
  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY') || 're_LtoAguZy_3iKxUFG5GBthK7taLQZggPkG';
    
    // Use verified domain with info@ email address
    const fromEmail = 'info@agentic-ai.ltd';
    const fromName = 'Agentic AI';
    
    console.log(`🔑 Using Resend API with verified domain: ${fromEmail}`);
    
    const results = [];

    // 1. Send admin alert email to info@agentic-ai.ltd
    console.log('📧 Sending admin alert email...');
    const adminEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: ['info@agentic-ai.ltd'],
        subject: `🚨 NEW CONTACT QUERY - ${contactData.name} (${contactData.company || 'Individual'})`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">🚨 New Contact Query</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Immediate attention required</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
              <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
                <h3 style="color: #856404; margin: 0 0 10px 0;">⚡ Action Required</h3>
                <p style="color: #856404; margin: 0;">A new contact form has been submitted. Please respond within 4 hours as promised.</p>
              </div>
              
              <h2 style="color: #333; margin-top: 0;">Contact Details</h2>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #dee2e6;">
                    <td style="padding: 8px 0; font-weight: bold; width: 30%;">Name:</td>
                    <td style="padding: 8px 0;">${contactData.name}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #dee2e6;">
                    <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                    <td style="padding: 8px 0;"><a href="mailto:${contactData.email}" style="color: #667eea;">${contactData.email}</a></td>
                  </tr>
                  ${contactData.company ? `
                  <tr style="border-bottom: 1px solid #dee2e6;">
                    <td style="padding: 8px 0; font-weight: bold;">Company:</td>
                    <td style="padding: 8px 0;">${contactData.company}</td>
                  </tr>
                  ` : ''}
                  ${contactData.phone ? `
                  <tr style="border-bottom: 1px solid #dee2e6;">
                    <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
                    <td style="padding: 8px 0;"><a href="tel:${contactData.phone}" style="color: #667eea;">${contactData.phone}</a></td>
                  </tr>
                  ` : ''}
                  ${contactData.service ? `
                  <tr style="border-bottom: 1px solid #dee2e6;">
                    <td style="padding: 8px 0; font-weight: bold;">Service:</td>
                    <td style="padding: 8px 0;">${contactData.service}</td>
                  </tr>
                  ` : ''}
                  ${contactData.budget ? `
                  <tr style="border-bottom: 1px solid #dee2e6;">
                    <td style="padding: 8px 0; font-weight: bold;">Budget:</td>
                    <td style="padding: 8px 0;">${contactData.budget}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Submitted:</td>
                    <td style="padding: 8px 0;">${new Date().toLocaleString()}</td>
                  </tr>
                </table>
              </div>
              
              <h3 style="color: #667eea;">💬 Project Details:</h3>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 10px 0;">
                <p style="margin: 0; white-space: pre-line;">${contactData.message}</p>
              </div>
              
              <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
                <h4 style="color: #155724; margin: 0 0 10px 0;">📋 Next Steps:</h4>
                <ol style="color: #155724; margin: 0; padding-left: 20px;">
                  <li>Review the inquiry details above</li>
                  <li>Research the client/company if needed</li>
                  <li>Prepare initial response within 4 hours</li>
                  <li>Schedule discovery call if appropriate</li>
                  <li>Log interaction in CRM system</li>
                </ol>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="mailto:${contactData.email}?subject=Re: Your inquiry about ${contactData.service || 'our AI services'}&body=Hi ${contactData.name},%0D%0A%0D%0AThank you for reaching out to us regarding ${contactData.service || 'our AI services'}. I've reviewed your inquiry and would like to discuss your project in more detail.%0D%0A%0D%0ABest regards,%0D%0AThe Agentic AI Team" 
                   style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                  📧 Reply to ${contactData.name}
                </a>
              </div>
              
              <p style="font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 15px; margin-top: 30px;">
                <strong>Auto-generated admin alert</strong><br>
                This email was automatically sent when a new contact form was submitted.<br>
                The customer has also received an acknowledgment email.
              </p>
            </div>
          </div>
        `,
        reply_to: contactData.email
      })
    });

    if (adminEmailResponse.ok) {
      const adminResult = await adminEmailResponse.json();
      console.log(`✅ Admin alert email sent successfully! Message ID: ${adminResult.id}`);
      results.push({ type: 'admin_alert', success: true, messageId: adminResult.id });
    } else {
      const adminError = await adminEmailResponse.text();
      console.error(`❌ Admin alert email failed:`, adminError);
      results.push({ type: 'admin_alert', success: false, error: adminError });
    }

    // 2. Send acknowledgment email to the user
    console.log('📧 Sending user acknowledgment email...');
    const userEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: [contactData.email],
        subject: `✅ We've received your inquiry - Agentic AI`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">✅ Thank You, ${contactData.name}!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">We've received your inquiry</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
              <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #28a745;">
                <h3 style="color: #155724; margin: 0 0 15px 0;">🎉 Your Message Has Been Received!</h3>
                <p style="color: #155724; margin: 0;">Thank you for reaching out to Agentic AI. We've received your inquiry and our team will review it shortly.</p>
              </div>
              
              <h2 style="color: #333;">What Happens Next?</h2>
              
              <div style="margin: 20px 0;">
                <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
                  <div style="background: #667eea; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; margin-right: 15px; flex-shrink: 0;">1</div>
                  <div>
                    <h4 style="margin: 0 0 5px 0; color: #333;">Immediate Review (Within 4 hours)</h4>
                    <p style="margin: 0; color: #666; font-size: 14px;">Our team will review your inquiry and prepare for our initial conversation.</p>
                  </div>
                </div>
                
                <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
                  <div style="background: #667eea; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; margin-right: 15px; flex-shrink: 0;">2</div>
                  <div>
                    <h4 style="margin: 0 0 5px 0; color: #333;">Initial Response (Within 24 hours)</h4>
                    <p style="margin: 0; color: #666; font-size: 14px;">You'll receive a personalized response addressing your specific requirements.</p>
                  </div>
                </div>
                
                <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
                  <div style="background: #667eea; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; margin-right: 15px; flex-shrink: 0;">3</div>
                  <div>
                    <h4 style="margin: 0 0 5px 0; color: #333;">Discovery Call (If needed)</h4>
                    <p style="margin: 0; color: #666; font-size: 14px;">We'll schedule a 30-minute consultation to understand your needs in detail.</p>
                  </div>
                </div>
              </div>
              
              <h3 style="color: #667eea;">📋 Your Inquiry Summary:</h3>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 10px 0;">
                ${contactData.service ? `<p><strong>Service Interest:</strong> ${contactData.service}</p>` : ''}
                ${contactData.budget ? `<p><strong>Project Budget:</strong> ${contactData.budget}</p>` : ''}
                ${contactData.company ? `<p><strong>Company:</strong> ${contactData.company}</p>` : ''}
                <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
              </div>
              
              <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                <h4 style="color: #856404; margin: 0 0 10px 0;">🚀 While You Wait...</h4>
                <p style="color: #856404; margin: 0 0 10px 0;">Feel free to explore more about our services:</p>
                <ul style="color: #856404; margin: 0; padding-left: 20px;">
                  <li><a href="https://agentic-ai.ltd/services" style="color: #667eea;">Browse Our Services</a></li>
                  <li><a href="https://agentic-ai.ltd/case-studies" style="color: #667eea;">Read Success Stories</a></li>
                  <li><a href="https://agentic-ai.ltd/resources" style="color: #667eea;">Download Resources</a></li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <p style="color: #666; margin-bottom: 15px;">Need immediate assistance?</p>
                <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
                  <a href="mailto:info@agentic-ai.ltd" style="color: #667eea; text-decoration: none;">
                    📧 info@agentic-ai.ltd
                  </a>
                  <a href="tel:+447771970567" style="color: #667eea; text-decoration: none;">
                    📞 +44 7771 970567
                  </a>
                </div>
              </div>
              
              <p>Best regards,<br><strong>The Agentic AI Team</strong></p>
              
              <p style="font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 15px; margin-top: 30px;">
                <strong>Reference:</strong> Contact inquiry received at ${new Date().toISOString()}<br>
                If you didn't submit this inquiry, please contact us immediately at info@agentic-ai.ltd
              </p>
            </div>
          </div>
        `,
        reply_to: 'info@agentic-ai.ltd'
      })
    });

    if (userEmailResponse.ok) {
      const userResult = await userEmailResponse.json();
      console.log(`✅ User acknowledgment email sent successfully! Message ID: ${userResult.id}`);
      results.push({ type: 'user_acknowledgment', success: true, messageId: userResult.id });
    } else {
      const userError = await userEmailResponse.text();
      console.error(`❌ User acknowledgment email failed:`, userError);
      results.push({ type: 'user_acknowledgment', success: false, error: userError });
    }

    // Return results
    const adminSuccess = results.find(r => r.type === 'admin_alert')?.success || false;
    const userSuccess = results.find(r => r.type === 'user_acknowledgment')?.success || false;

    return {
      success: adminSuccess && userSuccess,
      adminAlertSent: adminSuccess,
      userAckSent: userSuccess,
      results: results,
      from: fromEmail
    };
    
  } catch (error) {
    console.error(`❌ Contact email processing error:`, error);
    return { success: false, error: error.message };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const requestData = await req.json();

    // Handle admin OTP requests
    if (requestData.action === 'admin_otp') {
      if (!requestData.to || !requestData.subject || !requestData.message) {
        throw new Error('Missing required fields for OTP: to, subject, and message are required');
      }

      const resendApiKey = Deno.env.get('RESEND_API_KEY') || 're_LtoAguZy_3iKxUFG5GBthK7taLQZggPkG';
      
      // Send OTP email using Resend API
      const otpEmailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: `${requestData.admin_name || 'Agentic AI Security'} <info@agentic-ai.ltd>`,
          to: [requestData.to],
          subject: requestData.subject,
          html: requestData.message
        })
      });

      if (!otpEmailResponse.ok) {
        const error = await otpEmailResponse.text();
        console.error('❌ OTP email failed:', error);
        throw new Error('Failed to send OTP email');
      }

      const result = await otpEmailResponse.json();
      console.log(`✅ OTP email sent successfully to ${requestData.to}! Message ID: ${result.id}`);

      return new Response(JSON.stringify({
        success: true,
        message: 'OTP email sent successfully',
        messageId: result.id,
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle regular contact form submissions
    const contactData = requestData;

    // Validate required fields for contact form
    if (!contactData.name || !contactData.email || !contactData.message) {
      throw new Error('Missing required fields: name, email, and message are required');
    }

    console.log(`📧 Processing contact form submission from ${contactData.name} (${contactData.email})`);

    // 1. Store contact submission in database
    const { data: dbResult, error: dbError } = await supabase
      .from('contact_submissions')
      .insert({
        name: contactData.name,
        email: contactData.email,
        company: contactData.company || null,
        phone: contactData.phone || null,
        service: contactData.service || null,
        budget: contactData.budget || null,
        message: contactData.message,
        status: 'new',
        source: 'website_contact_form'
      })
      .select()
      .single();

    if (dbError) {
      console.error('❌ Database error:', dbError);
      throw new Error('Failed to save contact submission');
    }

    console.log('✅ Contact submission saved to database:', dbResult.id);

    // 2. Send emails (admin alert + user acknowledgment)
    const emailResult = await sendContactEmails(contactData);

    // 3. Update database record with email status
    await supabase
      .from('contact_submissions')
      .update({
        admin_notified: emailResult.adminAlertSent,
        user_acknowledged: emailResult.userAckSent,
        email_status: emailResult.success ? 'sent' : 'failed',
        notes: `Emails: Admin ${emailResult.adminAlertSent ? 'sent' : 'failed'}, User ${emailResult.userAckSent ? 'sent' : 'failed'}`
      })
      .eq('id', dbResult.id);

    return new Response(JSON.stringify({
      success: true,
      message: 'Contact form submitted successfully! Check your email for confirmation.',
      submissionId: dbResult.id,
      adminAlertSent: emailResult.adminAlertSent,
      userAcknowledgmentSent: emailResult.userAckSent,
      from: emailResult.from,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Contact Handler Error:', error);

    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});