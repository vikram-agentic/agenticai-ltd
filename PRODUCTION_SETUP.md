# 🚀 Production Environment Setup Guide

## 🚨 CRITICAL: Environment Variables Issue

Your app is failing in production because environment variables are not properly configured!

## 📋 What's Missing:

### 1. **Environment Variables**
Create these files in your production environment:

**`.env` (Base environment):**
```bash
VITE_SUPABASE_URL=https://jdbqecrmegeykvpqyrtk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkYnFlY3JtZWdleWt2cHF5cnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMzg5NTgsImV4cCI6MjA2OTkxNDk1OH0.GcnzEaL4Fy5aMpyeP8HnP_4vsdla43Y3cH6gt51Yh_w
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_RESEND_API_KEY=187f5487cc987307af79c592a14b615e7da53f3562af6ad8fae915b7d0512964
VITE_APP_NAME=Agentic AI
VITE_APP_URL=https://agentic-ai.ltd
```

### 2. **Supabase Functions Deployment**
Deploy all functions to production:
```bash
npx supabase functions deploy admin-auth
npx supabase functions deploy contact-form-handler
npx supabase functions deploy chatbot-handler
npx supabase functions deploy content-generator-agent
npx supabase functions deploy keyword-research-agent
npx supabase functions deploy serp-analysis-agent
npx supabase functions deploy image-generator-agent
```

### 3. **Environment Variables in Supabase**
Set these in Supabase Dashboard → Settings → Environment Variables:
```bash
RESEND_API_KEY=187f5487cc987307af79c592a14b615e7da53f3562af6ad8fae915b7d0512964
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🔧 Platform-Specific Setup:

### **Vercel:**
1. Go to Project Settings → Environment Variables
2. Add all VITE_* variables
3. Redeploy

### **Netlify:**
1. Go to Site Settings → Environment Variables
2. Add all VITE_* variables
3. Redeploy

### **SiteGround/Shared Hosting:**
1. Create `.env` file in root directory
2. Add all environment variables
3. Upload files via FTP

### **AWS S3 + CloudFront:**
1. Set environment variables in build process
2. Use build-time environment substitution

## 🧪 Testing Production:

### **1. Test Admin Dashboard:**
- URL: `https://yourdomain.com/admin-agentic`
- Email: `info@agentic-ai.ltd`
- Password: `agenticailtd`

### **2. Test Contact Form:**
- Submit a test contact form
- Check if emails are sent
- Verify database storage

### **3. Test Content Generator:**
- Login to admin dashboard
- Try generating content
- Check if AI functions work

## 🚨 Common Issues:

### **404 Errors:**
- Missing `.htaccess` or `web.config`
- Incorrect file paths
- Server configuration issues

### **Authentication Failures:**
- Missing environment variables
- Supabase functions not deployed
- Incorrect API keys

### **Email Not Working:**
- RESEND_API_KEY not set
- Function not deployed
- Network connectivity issues

## ✅ Success Checklist:

- [ ] Environment variables configured
- [ ] Supabase functions deployed
- [ ] Admin dashboard accessible
- [ ] Contact form working
- [ ] Email delivery functional
- [ ] Content generator working
- [ ] Chatbot functional
- [ ] All routes working

## 🆘 If Still Having Issues:

1. Check browser console for errors
2. Verify Supabase function logs
3. Test environment variables
4. Check server configuration
5. Verify file permissions

---

**Remember:** The difference between development and production environments is crucial for React apps with backend integrations! 