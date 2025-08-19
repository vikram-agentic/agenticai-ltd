import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Meeting confirmation emails using Resend API with verified domain
async function sendMeetingEmails(meetingData: {
  user_name: string;
  user_email: string;
  user_phone?: string;
  company?: string;
  service_interest?: string;
  notes?: string;
  startTime: string;
  endTime: string;
  summary: string;
  eventId: string;
}) {
  console.log(`📧 Processing meeting booking for ${meetingData.user_name}...`);
  
  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY') || 're_LtoAguZy_3iKxUFG5GBthK7taLQZggPkG';
    
    // Use verified domain with info@ email address
    const fromEmail = 'info@agentic-ai.ltd';
    const fromName = 'Agentic AI';
    
    console.log(`🔑 Using Resend API with verified domain: ${fromEmail}`);
    
    const results = [];
    const meetingDate = new Date(meetingData.startTime);
    const formattedDate = meetingDate.toLocaleDateString('en-GB', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const formattedTime = meetingDate.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // 1. Send admin alert email to info@agentic-ai.ltd
    console.log('📧 Sending admin meeting notification...');
    const adminEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: ['info@agentic-ai.ltd'],
        subject: `📅 NEW MEETING BOOKED - ${meetingData.user_name} (${formattedDate})`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">📅 New Meeting Booked</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Consultation scheduled</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
              <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #28a745;">
                <h3 style="color: #155724; margin: 0 0 10px 0;">⏰ Meeting Scheduled</h3>
                <p style="color: #155724; margin: 0;">A new consultation has been booked. Please prepare for the meeting and add it to your calendar.</p>
              </div>
              
              <h2 style="color: #333; margin-top: 0;">Meeting Details</h2>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #dee2e6;">
                    <td style="padding: 8px 0; font-weight: bold; width: 30%;">📅 Date & Time:</td>
                    <td style="padding: 8px 0; color: #667eea; font-weight: bold;">${formattedDate} at ${formattedTime}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #dee2e6;">
                    <td style="padding: 8px 0; font-weight: bold;">👤 Client:</td>
                    <td style="padding: 8px 0;">${meetingData.user_name}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #dee2e6;">
                    <td style="padding: 8px 0; font-weight: bold;">📧 Email:</td>
                    <td style="padding: 8px 0;"><a href="mailto:${meetingData.user_email}" style="color: #667eea;">${meetingData.user_email}</a></td>
                  </tr>
                  ${meetingData.user_phone ? `
                  <tr style="border-bottom: 1px solid #dee2e6;">
                    <td style="padding: 8px 0; font-weight: bold;">📞 Phone:</td>
                    <td style="padding: 8px 0;"><a href="tel:${meetingData.user_phone}" style="color: #667eea;">${meetingData.user_phone}</a></td>
                  </tr>
                  ` : ''}
                  ${meetingData.company ? `
                  <tr style="border-bottom: 1px solid #dee2e6;">
                    <td style="padding: 8px 0; font-weight: bold;">🏢 Company:</td>
                    <td style="padding: 8px 0;">${meetingData.company}</td>
                  </tr>
                  ` : ''}
                  ${meetingData.service_interest ? `
                  <tr style="border-bottom: 1px solid #dee2e6;">
                    <td style="padding: 8px 0; font-weight: bold;">🎯 Service Interest:</td>
                    <td style="padding: 8px 0;">${meetingData.service_interest}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold;">📋 Calendar Event:</td>
                    <td style="padding: 8px 0;">${meetingData.eventId}</td>
                  </tr>
                </table>
              </div>
              
              ${meetingData.notes ? `
              <h3 style="color: #667eea;">💬 Additional Notes:</h3>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 10px 0;">
                <p style="margin: 0; white-space: pre-line;">${meetingData.notes}</p>
              </div>
              ` : ''}
              
              <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                <h4 style="color: #856404; margin: 0 0 10px 0;">📋 Pre-Meeting Preparation:</h4>
                <ol style="color: #856404; margin: 0; padding-left: 20px;">
                  <li>Review client's service interest and requirements</li>
                  <li>Prepare relevant case studies and materials</li>
                  <li>Add meeting to your Google Calendar</li>
                  <li>Send meeting link if virtual consultation</li>
                  <li>Confirm attendance 24 hours before</li>
                </ol>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://calendar.google.com/calendar/u/0/r/eventedit/${meetingData.eventId}" 
                   style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                  📅 View in Google Calendar
                </a>
              </div>
              
              <p style="font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 15px; margin-top: 30px;">
                <strong>Auto-generated meeting notification</strong><br>
                This email was automatically sent when a new meeting was booked.<br>
                The client has also received a confirmation email with meeting details.
              </p>
            </div>
          </div>
        `,
        reply_to: meetingData.user_email
      })
    });

    if (adminEmailResponse.ok) {
      const adminResult = await adminEmailResponse.json();
      console.log(`✅ Admin meeting notification sent! Message ID: ${adminResult.id}`);
      results.push({ type: 'admin_notification', success: true, messageId: adminResult.id });
    } else {
      const adminError = await adminEmailResponse.text();
      console.error(`❌ Admin meeting notification failed:`, adminError);
      results.push({ type: 'admin_notification', success: false, error: adminError });
    }

    // 2. Send confirmation email to the user
    console.log('📧 Sending user meeting confirmation...');
    const userEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: [meetingData.user_email],
        subject: `✅ Meeting Confirmed - ${formattedDate} at ${formattedTime}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">✅ Meeting Confirmed!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Your consultation is scheduled</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
              <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #28a745;">
                <h3 style="color: #155724; margin: 0 0 15px 0;">🎉 Your Meeting is Confirmed!</h3>
                <p style="color: #155724; margin: 0;">Thank you for booking a consultation with Agentic AI. We're excited to discuss your AI needs and how we can help transform your business.</p>
              </div>
              
              <h2 style="color: #333;">📅 Meeting Details</h2>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #667eea;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <div style="background: #667eea; color: white; padding: 15px; border-radius: 8px; display: inline-block;">
                    <h3 style="margin: 0; font-size: 20px;">📅 ${formattedDate}</h3>
                    <p style="margin: 5px 0 0 0; font-size: 18px;">⏰ ${formattedTime}</p>
                  </div>
                </div>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #dee2e6;">
                    <td style="padding: 8px 0; font-weight: bold;">👤 Client:</td>
                    <td style="padding: 8px 0;">${meetingData.user_name}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #dee2e6;">
                    <td style="padding: 8px 0; font-weight: bold;">📧 Email:</td>
                    <td style="padding: 8px 0;">${meetingData.user_email}</td>
                  </tr>
                  ${meetingData.service_interest ? `
                  <tr style="border-bottom: 1px solid #dee2e6;">
                    <td style="padding: 8px 0; font-weight: bold;">🎯 Topic:</td>
                    <td style="padding: 8px 0;">${meetingData.service_interest}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold;">⏱️ Duration:</td>
                    <td style="padding: 8px 0;">30 minutes</td>
                  </tr>
                </table>
              </div>
              
              <h3 style="color: #667eea;">📋 What to Expect:</h3>
              <div style="margin: 20px 0;">
                <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
                  <div style="background: #667eea; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; margin-right: 15px; flex-shrink: 0;">1</div>
                  <div>
                    <h4 style="margin: 0 0 5px 0; color: #333;">Discovery & Requirements</h4>
                    <p style="margin: 0; color: #666; font-size: 14px;">We'll discuss your business needs, challenges, and AI automation goals.</p>
                  </div>
                </div>
                
                <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
                  <div style="background: #667eea; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; margin-right: 15px; flex-shrink: 0;">2</div>
                  <div>
                    <h4 style="margin: 0 0 5px 0; color: #333;">Solutions & Recommendations</h4>
                    <p style="margin: 0; color: #666; font-size: 14px;">Our team will present tailored AI solutions for your specific use case.</p>
                  </div>
                </div>
                
                <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
                  <div style="background: #667eea; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; margin-right: 15px; flex-shrink: 0;">3</div>
                  <div>
                    <h4 style="margin: 0 0 5px 0; color: #333;">Next Steps & Proposal</h4>
                    <p style="margin: 0; color: #666; font-size: 14px;">We'll outline the project timeline, investment, and implementation roadmap.</p>
                  </div>
                </div>
              </div>
              
              <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                <h4 style="color: #856404; margin: 0 0 10px 0;">📝 Prepare for Your Meeting:</h4>
                <ul style="color: #856404; margin: 0; padding-left: 20px;">
                  <li>Think about your current business processes that could benefit from AI</li>
                  <li>Consider your budget and timeline for AI implementation</li>
                  <li>Prepare any specific questions about our services</li>
                  <li>Have details about your industry and company size ready</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <p style="color: #666; margin-bottom: 15px;">Need to reschedule or have questions?</p>
                <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
                  <a href="mailto:info@agentic-ai.ltd" style="color: #667eea; text-decoration: none;">
                    📧 info@agentic-ai.ltd
                  </a>
                  <a href="tel:+447771970567" style="color: #667eea; text-decoration: none;">
                    📞 +44 7771 970567
                  </a>
                </div>
              </div>
              
              <p>We look forward to speaking with you!<br><strong>The Agentic AI Team</strong></p>
              
              <p style="font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 15px; margin-top: 30px;">
                <strong>Meeting Reference:</strong> ${meetingData.eventId}<br>
                A calendar invitation should appear in your email client shortly.<br>
                Please add this meeting to your calendar to receive reminders.
              </p>
            </div>
          </div>
        `,
        reply_to: 'info@agentic-ai.ltd'
      })
    });

    if (userEmailResponse.ok) {
      const userResult = await userEmailResponse.json();
      console.log(`✅ User meeting confirmation sent! Message ID: ${userResult.id}`);
      results.push({ type: 'user_confirmation', success: true, messageId: userResult.id });
    } else {
      const userError = await userEmailResponse.text();
      console.error(`❌ User meeting confirmation failed:`, userError);
      results.push({ type: 'user_confirmation', success: false, error: userError });
    }

    // Return results
    const adminSuccess = results.find(r => r.type === 'admin_notification')?.success || false;
    const userSuccess = results.find(r => r.type === 'user_confirmation')?.success || false;

    return {
      success: adminSuccess && userSuccess,
      adminNotificationSent: adminSuccess,
      userConfirmationSent: userSuccess,
      results: results,
      from: fromEmail
    };
    
  } catch (error) {
    console.error(`❌ Meeting email processing error:`, error);
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

    // Handle different actions
    if (requestData.action === 'get_slots') {
      // Handle slot retrieval (keep existing Google Calendar logic)
      // This would integrate with Google Calendar API
      console.log('📅 Getting available slots for:', requestData.date);
      
      // For now, return some sample slots (you'd replace this with actual Google Calendar integration)
      const sampleSlots = [
        { start_time: `${requestData.date}T09:00:00Z`, end_time: `${requestData.date}T09:30:00Z` },
        { start_time: `${requestData.date}T10:00:00Z`, end_time: `${requestData.date}T10:30:00Z` },
        { start_time: `${requestData.date}T14:00:00Z`, end_time: `${requestData.date}T14:30:00Z` },
        { start_time: `${requestData.date}T15:00:00Z`, end_time: `${requestData.date}T15:30:00Z` },
      ];

      return new Response(JSON.stringify({
        success: true,
        slots: sampleSlots
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else if (requestData.action === 'book_meeting') {
      // Handle meeting booking
      console.log(`📅 Processing meeting booking for ${requestData.user_name}`);

      // Validate required fields
      if (!requestData.user_name || !requestData.user_email || !requestData.startTime || !requestData.endTime) {
        throw new Error('Missing required fields: user_name, user_email, startTime, and endTime are required');
      }

      // 1. Store meeting booking in database
      const { data: dbResult, error: dbError } = await supabase
        .from('meeting_bookings')
        .insert({
          user_name: requestData.user_name,
          user_email: requestData.user_email,
          user_phone: requestData.user_phone || null,
          company: requestData.company || null,
          service_interest: requestData.service_interest || null,
          notes: requestData.notes || null,
          start_time: requestData.startTime,
          end_time: requestData.endTime,
          summary: requestData.summary || `Consultation: ${requestData.user_name}`,
          status: 'confirmed',
          source: 'website_booking',
          calendar_event_id: `meeting-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        })
        .select()
        .single();

      if (dbError) {
        console.error('❌ Database error:', dbError);
        throw new Error('Failed to save meeting booking');
      }

      console.log('✅ Meeting booking saved to database:', dbResult.id);

      // 2. Send emails (admin notification + user confirmation)
      const emailResult = await sendMeetingEmails({
        user_name: requestData.user_name,
        user_email: requestData.user_email,
        user_phone: requestData.user_phone,
        company: requestData.company,
        service_interest: requestData.service_interest,
        notes: requestData.notes,
        startTime: requestData.startTime,
        endTime: requestData.endTime,
        summary: dbResult.summary,
        eventId: dbResult.calendar_event_id
      });

      // 3. Update database record with email status
      await supabase
        .from('meeting_bookings')
        .update({
          admin_notified: emailResult.adminNotificationSent,
          user_confirmed: emailResult.userConfirmationSent,
          email_status: emailResult.success ? 'sent' : 'failed',
          notes: `${dbResult.notes || ''}\n\nEmails: Admin ${emailResult.adminNotificationSent ? 'sent' : 'failed'}, User ${emailResult.userConfirmationSent ? 'sent' : 'failed'}`
        })
        .eq('id', dbResult.id);

      return new Response(JSON.stringify({
        success: true,
        message: 'Meeting booked successfully! Check your email for confirmation.',
        bookingId: dbResult.id,
        eventId: dbResult.calendar_event_id,
        adminNotificationSent: emailResult.adminNotificationSent,
        userConfirmationSent: emailResult.userConfirmationSent,
        from: emailResult.from,
        event: {
          id: dbResult.calendar_event_id,
          summary: dbResult.summary,
          start: requestData.startTime,
          end: requestData.endTime
        },
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      throw new Error('Invalid action. Use "get_slots" or "book_meeting"');
    }

  } catch (error) {
    console.error('❌ Meeting Scheduler Handler Error:', error);

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