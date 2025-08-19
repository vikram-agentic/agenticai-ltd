import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Gmail SMTP Configuration
const GMAIL_CONFIG = {
  host: Deno.env.get('GMAIL_SMTP_HOST') || 'smtp.gmail.com',
  port: parseInt(Deno.env.get('GMAIL_SMTP_PORT') || '587'),
  username: Deno.env.get('GMAIL_SMTP_USER') || 'info@agentic-ai.ltd',
  password: Deno.env.get('GMAIL_SMTP_PASS') || '',
  fromEmail: Deno.env.get('GMAIL_FROM_EMAIL') || 'info@agentic-ai.ltd',
  fromName: Deno.env.get('GMAIL_FROM_NAME') || 'Agentic AI Ltd',
};

// Unified email sending function using Resend API with verified domain
async function sendEmailViaGmail(emailData: {
  to: string;
  subject: string;
  html: string;
}) {
  console.log(`📧 Sending email to ${emailData.to} via Resend API...`);
  
  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY') || 're_LtoAguZy_3iKxUFG5GBthK7taLQZggPkG';
    
    // Use verified domain with info@ email address
    const fromEmail = 'info@agentic-ai.ltd';
    const fromName = 'Agentic AI';
    
    console.log(`🔑 Using Resend API with verified domain: ${fromEmail}`);
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: [emailData.to],
        subject: emailData.subject,
        html: emailData.html,
        reply_to: 'info@agentic-ai.ltd'
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Email successfully sent to ${emailData.to} via Resend!`);
      console.log(`📧 Message ID: ${result.id}`);
      
      return { 
        success: true, 
        method: 'resend-verified-domain',
        provider: 'resend',
        messageId: result.id,
        from: fromEmail,
        timestamp: new Date().toISOString()
      };
    } else {
      const errorText = await response.text();
      console.error(`❌ Resend API error for ${emailData.to}:`, errorText);
      
      try {
        const errorObj = JSON.parse(errorText);
        return { success: false, error: errorObj.message || errorText };
      } catch {
        return { success: false, error: errorText };
      }
    }
    
  } catch (error) {
    console.error(`❌ Email sending error for ${emailData.to}:`, error);
    return { success: false, error: error.message };
  }
}

// Newsletter subscription handler
async function handleSubscription(supabase: any, subscriptionData: any) {
  try {
    console.log('👤 Processing newsletter subscription:', subscriptionData.email);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(subscriptionData.email)) {
      throw new Error('Invalid email format');
    }

    // Check if email already exists
    const { data: existingSubscriber, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('id, status, email')
      .eq('email', subscriptionData.email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw new Error('Failed to check subscription status');
    }

    let result;
    
    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        // Send welcome email even for existing active subscribers
        console.log('👤 Existing active subscriber - sending welcome email anyway');
        const welcomeEmailResult = await sendWelcomeEmail(subscriptionData);
        
        // Update subscriber with new welcome email status
        await supabase
          .from('newsletter_subscribers')
          .update({
            notes: welcomeEmailResult.success 
              ? `Welcome email re-sent successfully via ${welcomeEmailResult.method}` 
              : `Welcome email failed: ${welcomeEmailResult.error}`,
            last_email_sent: new Date().toISOString()
          })
          .eq('id', existingSubscriber.id);

        return {
          success: true,
          message: 'Welcome back! We\'ve sent you a fresh welcome email.',
          subscriberId: existingSubscriber.id,
          alreadySubscribed: true,
          welcomeEmailSent: welcomeEmailResult.success,
          emailMethod: welcomeEmailResult.method
        };
      } else {
        // Reactivate subscription
        const { data: updatedSubscriber, error: updateError } = await supabase
          .from('newsletter_subscribers')
          .update({
            status: 'active',
            name: subscriptionData.name || null,
            source: subscriptionData.source || 'website',
            tags: subscriptionData.tags || [],
            subscribed_at: new Date().toISOString(),
            unsubscribed_at: null
          })
          .eq('id', existingSubscriber.id)
          .select()
          .single();

        if (updateError) throw new Error('Failed to reactivate subscription');
        result = updatedSubscriber;
      }
    } else {
      // Create new subscription
      const { data: newSubscriber, error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email: subscriptionData.email,
          name: subscriptionData.name || null,
          source: subscriptionData.source || 'website',
          tags: subscriptionData.tags || [],
          status: 'active'
        })
        .select()
        .single();

      if (insertError) throw new Error('Failed to create subscription');
      result = newSubscriber;
    }

    // Send welcome email
    const welcomeEmailResult = await sendWelcomeEmail(subscriptionData);
    
    // Update subscriber with email status and timestamp
    await supabase
      .from('newsletter_subscribers')
      .update({
        notes: welcomeEmailResult.success 
          ? `Welcome email sent successfully via ${welcomeEmailResult.method}` 
          : `Welcome email failed: ${welcomeEmailResult.error}`,
        last_email_sent: welcomeEmailResult.success ? new Date().toISOString() : null
      })
      .eq('id', result.id);

    return {
      success: true,
      message: 'Successfully subscribed to newsletter! Check your email for confirmation.',
      subscriberId: result.id,
      welcomeEmailSent: welcomeEmailResult.success,
      emailMethod: welcomeEmailResult.method
    };

  } catch (error) {
    console.error('❌ Error processing subscription:', error);
    throw error;
  }
}

// Send welcome email
async function sendWelcomeEmail(subscriptionData: any) {
  try {
    const subject = '🎉 Welcome to the Agentic AI Newsletter!';
    const name = subscriptionData.name || 'Valued Subscriber';
    const unsubscribeUrl = `${Deno.env.get('VITE_APP_URL') || 'https://agentic-ai.ltd'}/unsubscribe?email=${encodeURIComponent(subscriptionData.email)}`;

    const emailHTML = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Welcome, ${name}!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Thank you for joining our newsletter!</p>
        </div>
        
        <div style="padding: 30px; line-height: 1.6;">
          <p>Hi ${name},</p>
          <p>Welcome to the <strong>Agentic AI Newsletter</strong>! You'll receive:</p>
          <ul>
            <li>✨ Exclusive AI automation insights</li>
            <li>📊 Enterprise case studies</li>
            <li>🚀 Latest industry trends</li>
            <li>💡 Actionable strategies</li>
          </ul>
          <p>Best regards,<br><strong>The Agentic AI Team</strong></p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #6c757d;">
            <a href="${unsubscribeUrl}" style="color: #667eea;">Unsubscribe</a> | 
            <a href="https://agentic-ai.ltd/contact" style="color: #667eea;">Contact Us</a>
          </p>
        </div>
      </div>
    `;

    return await sendEmailViaGmail({
      to: subscriptionData.email,
      subject: subject,
      html: emailHTML
    });
    
  } catch (error) {
    console.error('❌ Welcome email error:', error);
    return { success: false, error: error.message };
  }
}

// Campaign sending handler
async function handleCampaign(supabase: any, campaignRequest: any) {
  try {
    const { campaignId, sendNow = false } = campaignRequest;

    if (!campaignId) {
      throw new Error('Campaign ID is required');
    }

    console.log(`🚀 Processing newsletter campaign: ${campaignId}`);

    // Get campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from('newsletter_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      throw new Error('Campaign not found');
    }

    if (campaign.status === 'sent') {
      throw new Error('Campaign has already been sent');
    }

    if (!sendNow) {
      throw new Error('Only immediate sending is supported in this version');
    }

    // Get active subscribers
    const { data: subscribers, error: subscribersError } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('status', 'active');

    if (subscribersError) throw subscribersError;

    if (!subscribers || subscribers.length === 0) {
      throw new Error('No active subscribers found');
    }

    console.log(`👥 Found ${subscribers.length} active subscribers`);

    let successCount = 0;
    let failCount = 0;
    const emailResults = [];

    // Send emails to all subscribers
    for (const subscriber of subscribers) {
      try {
        // Personalize content
        const personalizedContent = campaign.content
          .replace(/\{\{name\}\}/g, subscriber.name || 'Valued Subscriber')
          .replace(/\{\{email\}\}/g, subscriber.email)
          .replace(/\{\{unsubscribe_url\}\}/g, `https://agentic-ai.ltd/unsubscribe?email=${encodeURIComponent(subscriber.email)}`);

        // Create email HTML
        const emailHTML = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">${campaign.title}</h1>
              <p style="margin: 10px 0 0 0;">From Agentic AI</p>
            </div>
            
            <div style="padding: 30px;">
              ${personalizedContent}
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #6c757d;">
                <a href="https://agentic-ai.ltd/unsubscribe?email=${encodeURIComponent(subscriber.email)}">Unsubscribe</a> | 
                <a href="https://agentic-ai.ltd/contact">Contact Us</a>
              </p>
            </div>
          </div>
        `;

        // Send email
        const result = await sendEmailViaGmail({
          to: subscriber.email,
          subject: campaign.subject,
          html: emailHTML
        });

        if (result.success) {
          successCount++;
          console.log(`✅ ${subscriber.email} - ${result.method}`);
          
          // Update subscriber's last email sent
          await supabase
            .from('newsletter_subscribers')
            .update({ last_email_sent: new Date().toISOString() })
            .eq('id', subscriber.id);
        } else {
          failCount++;
          console.log(`❌ ${subscriber.email} - ${result.error}`);
        }

        emailResults.push({
          email: subscriber.email,
          success: result.success,
          method: result.method,
          error: result.error || null
        });

        // Small delay between emails
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        failCount++;
        console.error(`❌ Failed to send to ${subscriber.email}:`, error);
        emailResults.push({
          email: subscriber.email,
          success: false,
          error: error.message
        });
      }
    }

    // Calculate success rate and status
    const successRate = subscribers.length > 0 ? successCount / subscribers.length : 0;
    const campaignStatus = successCount > 0 ? 'sent' : 'failed';
    
    console.log(`📊 Campaign Results: ${successCount} sent, ${failCount} failed (${(successRate * 100).toFixed(1)}%)`);

    // Update campaign status
    await supabase
      .from('newsletter_campaigns')
      .update({
        status: campaignStatus,
        sent_at: new Date().toISOString(),
        sent_count: successCount
      })
      .eq('id', campaign.id);

    // Log email activity
    await supabase.from('email_logs').insert([{
      email_type: 'newsletter_campaign',
      recipient: 'bulk_send',
      subject: campaign.subject,
      status: campaignStatus,
      sent_at: new Date().toISOString(),
      metadata: {
        campaign_id: campaign.id,
        total_recipients: subscribers.length,
        sent_count: successCount,
        failed_count: failCount,
        success_rate: successRate
      }
    }]);

    return {
      success: true,
      message: `Campaign ${campaignStatus}: ${successCount} of ${subscribers.length} emails sent successfully`,
      campaignId: campaign.id,
      stats: {
        totalSent: successCount,
        failed: failCount,
        totalSubscribers: subscribers.length,
        successRate: Math.round(successRate * 100),
        campaignStatus: campaignStatus
      },
      emailResults: emailResults,
      gmail_config: `${GMAIL_CONFIG.host}:${GMAIL_CONFIG.port}`
    };

  } catch (error) {
    console.error('❌ Error handling campaign:', error);
    throw error;
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
    const action = requestData.action || 'subscribe'; // 'subscribe' or 'campaign'

    console.log(`📧 Gmail Newsletter Action: ${action}`);
    console.log(`🔧 Gmail Config: ${GMAIL_CONFIG.host}:${GMAIL_CONFIG.port} (${GMAIL_CONFIG.username})`);

    let result;

    if (action === 'subscribe') {
      result = await handleSubscription(supabase, requestData);
    } else if (action === 'campaign') {
      result = await handleCampaign(supabase, requestData);
    } else {
      throw new Error('Invalid action. Use "subscribe" or "campaign"');
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Gmail Newsletter Error:', error);

    return new Response(JSON.stringify({
      error: error.message,
      success: false,
      gmail_config: `${GMAIL_CONFIG.host}:${GMAIL_CONFIG.port}`,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});