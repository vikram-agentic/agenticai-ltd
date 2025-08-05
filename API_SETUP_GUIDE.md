# API Setup Guide for Agentic AI Dashboard

This guide will help you set up all the required API keys for the Agentic AI Dashboard to function properly.

## 🔑 Required API Keys

The dashboard uses the following APIs:
1. **Google Gemini API** - For AI content generation, keyword research, and SERP analysis
2. **BFL Flux Kontext Pro API** - For high-quality image generation
3. **Supabase** - For database and backend functions (already configured)

## 📝 Step 1: Get Your API Keys

### Google Gemini API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key (starts with `AIza...`)
5. **Important**: Keep this key secure and never share it publicly

### BFL Flux Kontext Pro API
1. Go to [BFL Flux Dashboard](https://bfl.ml/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Generate a new API key
5. Copy the key for use in the dashboard

## 🔧 Step 2: Configure Environment Variables

Create or update your `.env.local` file in the project root with the following variables:

```env
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# BFL Flux Kontext Pro API
BFL_FLUX_API_KEY=your_bfl_api_key_here

# Supabase (should already be configured)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important Notes:**
- Replace `your_gemini_api_key_here` with your actual Gemini API key
- Replace `your_bfl_api_key_here` with your actual BFL Flux API key
- The Supabase variables should already be configured from your initial setup

## 🚀 Step 3: Configure Supabase Secrets

The Supabase Edge Functions need access to your API keys. Run these commands in your terminal:

```bash
# Set Gemini API key
npx supabase secrets set GEMINI_API_KEY=your_gemini_api_key_here

# Set BFL Flux API key
npx supabase secrets set BFL_FLUX_API_KEY=your_bfl_api_key_here
```

## 🔄 Step 4: Deploy Updated Functions

After setting up the secrets, redeploy the Supabase functions:

```bash
# Deploy all functions
npx supabase functions deploy

# Or deploy specific functions
npx supabase functions deploy keyword-research-agent
npx supabase functions deploy serp-analysis-agent
npx supabase functions deploy content-generator-agent
npx supabase functions deploy image-generator-agent
```

## ✅ Step 5: Test Your Setup

Run the API connection test to verify everything is working:

```bash
npm run test:api
```

This will test:
- ✅ Google Gemini API connection
- ✅ BFL Flux Kontext Pro API connection
- ✅ Supabase connection

## 🎯 Expected Results

When everything is configured correctly, you should see:

```
🚀 Starting API Connection Tests...

🔍 Testing Google Gemini API...
✅ Gemini API connection successful!
Response: Gemini API is working correctly
Tokens used: 15

🎨 Testing BFL Flux Kontext Pro API...
✅ BFL Flux API connection successful!
Image generated: 1 images

🗄️ Testing Supabase Connection...
✅ Supabase connection successful!

📊 Test Results Summary:
========================
Google Gemini API: ✅ PASS
BFL Flux API: ✅ PASS
Supabase Connection: ✅ PASS

Overall: 3/3 tests passed
🎉 All API connections are working correctly!
```

## 🚨 Troubleshooting

### Gemini API Issues
- **401 Unauthorized**: Check that your API key is correct and active
- **403 Forbidden**: Ensure your Google AI Studio account is properly set up
- **Quota Exceeded**: Check your usage limits in Google AI Studio

### BFL Flux API Issues
- **401 Unauthorized**: Verify your API key is correct
- **Invalid Key**: Make sure you're using the correct API key format
- **Rate Limited**: Check your usage limits in the BFL dashboard

### General Issues
- **Environment Variables Not Found**: Ensure `.env.local` is in the project root
- **Supabase Secrets Not Working**: Try redeploying functions after setting secrets
- **Function Deployment Fails**: Check that you're logged into Supabase CLI

## 💰 Cost Considerations

### Google Gemini API Pricing
- **Gemini 2.0 Flash**: $0.0005 per 1M input tokens, $0.0015 per 1M output tokens
- **Gemini 2.0 Flash Exp**: $0.0005 per 1M input tokens, $0.0015 per 1M output tokens
- **Gemini 1.5 Flash**: $0.0005 per 1M input tokens, $0.0015 per 1M output tokens
- **Gemini 1.5 Pro**: $0.003 per 1M input tokens, $0.015 per 1M output tokens

### BFL Flux Kontext Pro Pricing
- Check [BFL Flux Pricing](https://bfl.ml/pricing) for current rates
- Typically pay-per-image generation

## 🔒 Security Best Practices

1. **Never commit API keys to version control**
2. **Use environment variables for local development**
3. **Use Supabase secrets for production deployment**
4. **Rotate API keys regularly**
5. **Monitor API usage to prevent unexpected charges**

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify your API keys are active and have sufficient credits
3. Check the Supabase function logs: `npx supabase functions logs`
4. Review the browser console for frontend errors

---

**Note**: This dashboard now uses Google Gemini API instead of Perplexity and Anthropic Claude, providing more cost-effective and powerful AI capabilities for content generation and analysis. 