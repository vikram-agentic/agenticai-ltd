# Email Setup Guide for Contact Form

This guide will help you set up email functionality for the contact form using **Resend** - a reliable, free email service.

## 🎯 What We've Built

✅ **Complete Contact Form System**:
- Contact form submissions stored in Supabase database
- Automatic email notifications to `info@agentic-ai.ltd`
- Automatic acknowledgment emails to users
- Admin dashboard integration for managing submissions
- Real-time status tracking

## 📧 Email Service Setup

### Step 1: Sign Up for Resend (Free)

1. Go to [Resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address
4. **Free Tier**: 3,000 emails/month, 100 emails/day

### Step 2: Get Your API Key

1. In your Resend dashboard, go to **API Keys**
2. Click **Create API Key**
3. Give it a name like "Agentic AI Contact Form"
4. Copy the API key (starts with `re_...`)

### Step 3: Configure Environment Variables

Add to your `.env.local` file:
```env
# Email Service (Resend)
RESEND_API_KEY=re_your_actual_api_key_here
```

### Step 4: Set Up Supabase Secrets

```bash
npx supabase secrets set RESEND_API_KEY=re_your_actual_api_key_here
```

### Step 5: Verify Domain (Optional but Recommended)

1. In Resend dashboard, go to **Domains**
2. Add your domain: `agentic-ai.ltd`
3. Follow the DNS verification steps
4. This ensures emails come from your domain instead of `@resend.dev`

## 🚀 How It Works

### When a User Submits the Contact Form:

1. **Form Data Validation**: Validates required fields and email format
2. **Database Storage**: Saves submission to `contact_submissions` table
3. **Admin Notification**: Sends email to `info@agentic-ai.ltd` with all details
4. **User Acknowledgment**: Sends thank you email to the user
5. **Status Tracking**: Logs email success/failure in database

### Email Templates

#### Admin Notification Email:
```
Subject: New Contact Form Submission - [Name]

New Contact Form Submission

Submission ID: [UUID]
Date: [Timestamp]

Contact Details:
- Name: [Name]
- Email: [Email]
- Company: [Company]
- Phone: [Phone]
- Service Interest: [Service]
- Budget Range: [Budget]

Message:
[User's message]

---
This email was sent from the Agentic AI contact form.
Please respond to [email] within 24 hours.
```

#### User Acknowledgment Email:
```
Subject: Thank you for contacting Agentic AI - We'll be in touch soon!

Dear [Name],

Thank you for contacting Agentic AI! We have received your inquiry and are excited to discuss how we can help transform your business with AI.

What happens next:
1. Our team will review your requirements within the next 4 hours
2. We'll schedule a 30-minute discovery call to understand your needs
3. You'll receive a custom proposal tailored to your project

Your submission details:
- Service Interest: [Service]
- Budget Range: [Budget]
- Message: [First 100 characters of message]...

If you have any urgent questions, please don't hesitate to call us at +44 7771 970567.

Best regards,
The Agentic AI Team

---
Agentic AI AMRO Ltd
Tunbridge Wells, Kent, UK
Phone: +44 7771 970567
Email: info@agentic-ai.ltd
Website: https://agentic-ai.ltd
```

## 📊 Admin Dashboard Features

### Contact Forms Tab:
- **View All Submissions**: See all contact form submissions
- **Status Management**: Mark submissions as 'new', 'contacted', 'qualified', 'closed'
- **Detailed Preview**: Click to see full submission details
- **Email Status**: See if admin/user emails were sent successfully
- **Real-time Updates**: Live updates when new submissions arrive

### Statistics:
- **Total Contact Forms**: Number of submissions received
- **New Contacts**: Number of unprocessed submissions
- **Response Rate**: Track how quickly you respond

## 🧪 Testing the System

### 1. Test Contact Form Submission:
1. Go to `/contact` on your website
2. Fill out the form with test data
3. Submit the form
4. Check for success message

### 2. Verify Emails:
1. Check `info@agentic-ai.ltd` for admin notification
2. Check the email you used in the form for acknowledgment
3. Check admin dashboard for new submission

### 3. Test Admin Dashboard:
1. Go to `/admin` and login
2. Navigate to "Contact Forms" tab
3. View the submission details
4. Update status to "contacted"

## 🔧 Troubleshooting

### Common Issues:

#### Emails Not Sending:
- **Check API Key**: Verify `RESEND_API_KEY` is set correctly
- **Check Supabase Secrets**: Ensure secret is set: `npx supabase secrets list`
- **Check Function Logs**: `npx supabase functions logs contact-form-handler`
- **Verify Resend Account**: Check if your Resend account is active

#### Form Submission Fails:
- **Check Network**: Ensure internet connection
- **Check Function**: Verify Edge Function is deployed
- **Check Database**: Ensure `contact_submissions` table exists

#### Admin Dashboard Not Loading:
- **Check Authentication**: Ensure you're logged in as admin
- **Check Database Permissions**: Verify RLS policies are correct

### Debug Steps:
1. **Check Function Logs**:
   ```bash
   npx supabase functions logs contact-form-handler
   ```

2. **Test Function Directly**:
   ```bash
   curl -X POST https://your-project.supabase.co/functions/v1/contact-form-handler \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","message":"Test message"}'
   ```

3. **Check Database**:
   ```bash
   npx supabase db reset
   npx supabase db push
   ```

## 💰 Cost Considerations

### Resend Pricing (Free Tier):
- **3,000 emails/month** - Perfect for most businesses
- **100 emails/day** - Good for daily limits
- **No credit card required** for free tier
- **Professional email delivery** with high deliverability

### Upgrade When Needed:
- **Pro Plan**: $20/month for 50,000 emails
- **Business Plan**: $80/month for 250,000 emails
- **Enterprise**: Custom pricing for high volume

## 🔒 Security Features

- **Input Validation**: Email format and required field validation
- **Rate Limiting**: Built-in protection against spam
- **Secure Storage**: All data encrypted in Supabase
- **Access Control**: Admin-only dashboard access
- **Email Verification**: Validates email format before sending

## 📈 Monitoring & Analytics

### Email Metrics (Resend Dashboard):
- **Delivery Rate**: Track email delivery success
- **Open Rate**: Monitor email engagement
- **Bounce Rate**: Identify invalid email addresses
- **Spam Reports**: Monitor reputation

### Admin Dashboard Metrics:
- **Submission Volume**: Track form usage
- **Response Time**: Monitor how quickly you respond
- **Conversion Rate**: Track submissions to customers
- **Service Preferences**: See which services are most popular

## 🎯 Next Steps

1. **Set up Resend account** and get API key
2. **Configure environment variables** and Supabase secrets
3. **Test the contact form** with real submissions
4. **Monitor email delivery** in Resend dashboard
5. **Set up email templates** customization if needed
6. **Configure domain verification** for professional emails

## 📞 Support

If you encounter issues:
1. Check this troubleshooting guide
2. Review Resend documentation: [docs.resend.com](https://docs.resend.com)
3. Check Supabase function logs
4. Verify all environment variables are set correctly

---

**Your contact form system is now fully functional and ready for production use!** 🚀 