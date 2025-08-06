# 🚨 COMPLETE ENVIRONMENT VARIABLES GUIDE

## 🎯 **ROOT CAUSE OF YOUR 404 ERRORS & API FAILURES**

Your admin dashboard and API calls are failing because **environment variables are not properly configured** in production!

## 📋 **ALL ENVIRONMENT VARIABLES FOUND IN CODEBASE:**

### **🔧 FRONTEND VARIABLES (VITE_*)**

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://jdbqecrmegeykvpqyrtk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkYnFlY3JtZWdleWt2cHF5cnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMzg5NTgsImV4cCI6MjA2OTkxNDk1OH0.GcnzEaL4Fy5aMpyeP8HnP_4vsdla43Y3cH6gt51Yh_w

# AI API Keys
VITE_GEMINI_API_KEY=817cb1a6703f11996d8d2d947adf2671f5609f1ed40b30b12c9feae8156efa46
VITE_ANTHROPIC_API_KEY=1080594e835b4e2dece8c1870ad24aee214e0c9510ee6941b29abeefac636e1b
VITE_BFL_API_KEY=94f3a2b9746e436f250df0461857cee22a47f3af8738bfd83113dcae04af2ae0
VITE_FLUX_API_KEY=e93aabe2578274f60c011ff63b037e4a85c0fd5946f2a41aa6e6d729748c2302
VITE_PERPLEXITY_API_KEY=44edae165f9a5f9a17a6a8a858cfbe8463e8ba89977e03ba9baac318306079da

# Email Configuration
VITE_RESEND_API_KEY=187f5487cc987307af79c592a14b615e7da53f3562af6ad8fae915b7d0512964

# App Configuration
VITE_APP_NAME=Agentic AI
VITE_APP_URL=https://agentic-ai.ltd
```

### **🔧 BACKEND VARIABLES (Supabase Functions)**

```bash
# Supabase Configuration
SUPABASE_URL=https://jdbqecrmegeykvpqyrtk.supabase.co
SUPABASE_SERVICE_ROLE_KEY=ef02a7d160e1f10272e39ee92a11a2b0e8f72bfb3c41bea781bca5a4c3410001
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkYnFlY3JtZWdleWt2cHF5cnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMzg5NTgsImV4cCI6MjA2OTkxNDk1OH0.GcnzEaL4Fy5aMpyeP8HnP_4vsdla43Y3cH6gt51Yh_w
SUPABASE_DB_URL=d22b9fcf3978bcb4c724baefce1cab88054d5b40aeaaa4d4cccbc3a69ebae930

# AI API Keys
GEMINI_API_KEY=817cb1a6703f11996d8d2d947adf2671f5609f1ed40b30b12c9feae8156efa46
ANTHROPIC_API_KEY=1080594e835b4e2dece8c1870ad24aee214e0c9510ee6941b29abeefac636e1b
BFL_API_KEY=94f3a2b9746e436f250df0461857cee22a47f3af8738bfd83113dcae04af2ae0
BFL_FLUX_API_KEY=94f3a2b9746e436f250df0461857cee22a47f3af8738bfd83113dcae04af2ae0
FLUX_API_KEY=e93aabe2578274f60c011ff63b037e4a85c0fd5946f2a41aa6e6d729748c2302
PERPLEXITY_API_KEY=44edae165f9a5f9a17a6a8a858cfbe8463e8ba89977e03ba9baac318306079da

# Email Configuration
RESEND_API_KEY=187f5487cc987307af79c592a14b615e7da53f3562af6ad8fae915b7d0512964
```

## 📍 **WHERE EACH VARIABLE IS USED:**

### **Frontend Files:**
- `src/integrations/supabase/client.ts`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- `test-api-connections.js`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

### **Backend Functions:**
- `admin-auth`: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- `contact-form-handler`: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`
- `chatbot-handler`: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`
- `content-generator-agent`: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`
- `keyword-research-agent`: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`
- `serp-analysis-agent`: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`
- `image-generator-agent`: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `BFL_API_KEY`, `ANTHROPIC_API_KEY`

## 🚀 **IMMEDIATE FIXES:**

### **For Vercel:**
1. Go to Project Settings → Environment Variables
2. Add ALL the `VITE_*` variables above
3. Redeploy

### **For SiteGround/Shared Hosting:**
1. Create `.env` file in root directory
2. Add ALL variables above
3. Upload via FTP

### **For Supabase Functions:**
All backend variables are already set in Supabase secrets ✅

## 🧪 **TESTING:**

### **1. Test Admin Dashboard:**
- URL: `https://yourdomain.com/admin-agentic`
- Email: `info@agentic-ai.ltd`
- Password: `agenticailtd`

### **2. Test Contact Form:**
- Submit form → Check emails sent
- Verify database storage

### **3. Test Content Generator:**
- Login to admin → Generate content
- Check AI functions work

## 🚨 **WHY THIS FIXES YOUR ISSUES:**

1. **404 Errors**: Environment variables missing → Functions fail → Routes break
2. **Admin Dashboard**: No auth → Can't login → Dashboard inaccessible
3. **API Calls**: Missing keys → Functions fail → No data
4. **Email**: No RESEND_API_KEY → Emails not sent

## ✅ **SUCCESS CHECKLIST:**

- [ ] Add ALL `VITE_*` variables to your hosting platform
- [ ] Verify Supabase functions are deployed
- [ ] Test admin dashboard login
- [ ] Test contact form submission
- [ ] Test content generation
- [ ] Check email delivery

---

**🎯 This is exactly why your admin dashboard and API calls are failing! Fix the environment variables and everything will work!** 