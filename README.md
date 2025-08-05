# Agentic AI - Advanced Content Management Dashboard

A comprehensive, modern admin dashboard for AI automation agencies with advanced AI-powered content generation capabilities, real-time synchronization, and professional-grade SEO tools.

## 🚀 Recent Updates

**✅ Successfully migrated to Google Gemini API!**
- Replaced Perplexity and Anthropic Claude with Google Gemini for better performance and cost-effectiveness
- Updated all Supabase Edge Functions to use Gemini 2.0 Flash Exp
- Enhanced content generation with improved AI capabilities
- Maintained all existing functionality while reducing API costs

## ✨ Features

### 🤖 AI-Powered Content Generation
- **Google Gemini Integration**: Advanced AI content generation using Gemini 2.0 Flash Exp
- **Comprehensive Keyword Research**: AI-driven keyword analysis and optimization
- **SERP Analysis**: Detailed search engine results page analysis
- **SEO-Optimized Content**: Automatically generated SEO-friendly content
- **Image Generation**: BFL Flux Kontext Pro integration for custom images

### 📊 Real-Time Dashboard
- **Live Statistics**: Real-time content and request tracking
- **Activity Feed**: Live updates and notifications
- **Progress Tracking**: Step-by-step generation progress
- **Content Management**: Preview, edit, and publish generated content

### 🔐 Secure Authentication
- **Admin Login**: Secure token-based authentication
- **Session Management**: Persistent login sessions
- **Role-Based Access**: Admin-only dashboard access

### 🎨 Modern UI/UX
- **Dark Theme**: Sleek dark mode with purple/blue gradients
- **Glassmorphism Design**: Modern glassmorphism cards and effects
- **Responsive Layout**: Fully responsive design for all devices
- **Real-Time Updates**: Live data synchronization

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Shadcn/ui, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Edge Functions, Realtime)
- **AI Services**: Google Gemini API, BFL Flux Kontext Pro
- **Authentication**: Custom token-based system
- **Deployment**: Vercel-ready

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Google AI Studio account (for Gemini API)
- BFL Flux account (for image generation)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd agentic-ailtd
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key

# BFL Flux Kontext Pro API
BFL_FLUX_API_KEY=your_bfl_api_key
```

### 4. Supabase Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
npx supabase login

# Link your project
npx supabase link --project-ref your_project_ref

# Set up secrets
npx supabase secrets set GEMINI_API_KEY=your_gemini_api_key
npx supabase secrets set BFL_FLUX_API_KEY=your_bfl_api_key

# Deploy functions
npx supabase functions deploy
```

### 5. Database Setup
```bash
# Apply migrations
npx supabase db push
```

### 6. Start Development Server
```bash
npm run dev
```

## 🔑 API Setup

### Google Gemini API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add to `.env.local` and Supabase secrets

### BFL Flux Kontext Pro
1. Go to [BFL Flux Dashboard](https://bfl.ml/)
2. Generate an API key
3. Add to `.env.local` and Supabase secrets

## 🧪 Testing

Test your API connections:
```bash
npm run test:api
```

Expected output:
```
🚀 Starting API Connection Tests...

🔍 Testing Google Gemini API...
✅ Gemini API connection successful!
Response: Gemini API is working correctly
Tokens used: 25

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

## 🚀 Usage

### Admin Dashboard Access
1. Navigate to `/admin` in your browser
2. Login with:
   - **Email**: `info@agentic-ai.ltd`
   - **Password**: `agenticailtd`

### Content Generation
1. Go to the "AI Generator" tab
2. Select content type (blog, page, service, resource)
3. Enter target keywords
4. Configure options (SEO focus, images, brand awareness)
5. Click "Start AI Generation"
6. Monitor real-time progress
7. Preview and publish generated content

### Content Management
- **Preview**: Click the eye icon to preview content
- **Publish**: Click the checkmark to publish content
- **Track**: Monitor generation progress and status
- **Analytics**: View usage statistics and performance

## 📊 Dashboard Features

### Statistics Cards
- **Total Content**: Number of generated content pieces
- **Active Requests**: Currently processing requests
- **AI Usage**: Cost tracking for API usage
- **Success Rate**: Content generation success percentage

### Real-Time Features
- **Live Sync**: Real-time data synchronization
- **Activity Feed**: Live updates and notifications
- **Progress Tracking**: Step-by-step generation progress
- **Status Indicators**: Visual status indicators for all processes

## 🔧 Configuration

### Content Generation Settings
- **Content Types**: Blog posts, landing pages, service pages, resource guides
- **Content Length**: 1500+, 2500+, 3000+, 5000+ words
- **SEO Optimization**: Automatic SEO optimization
- **Image Generation**: Optional custom image generation
- **Brand Awareness**: Company-specific content integration

### AI Models Used
- **Google Gemini 2.0 Flash Exp**: Primary content generation
- **BFL Flux Kontext Pro**: High-quality image generation
- **Custom Prompts**: Optimized for AI automation industry

## 💰 Cost Optimization

### Google Gemini API Pricing
- **Gemini 2.0 Flash**: $0.0005 per 1M input tokens, $0.0015 per 1M output tokens
- **Gemini 2.0 Flash Exp**: $0.0005 per 1M input tokens, $0.0015 per 1M output tokens
- **Cost Effective**: Significantly cheaper than previous solutions

### Usage Monitoring
- Real-time cost tracking in dashboard
- API usage logs and analytics
- Cost optimization recommendations

## 🚨 Troubleshooting

### Common Issues
1. **API Connection Failures**: Check API keys in `.env.local` and Supabase secrets
2. **Function Deployment Issues**: Ensure Supabase CLI is properly configured
3. **Database Connection**: Verify Supabase project settings
4. **Authentication Issues**: Check admin credentials

### Debug Steps
1. Run `npm run test:api` to verify API connections
2. Check Supabase function logs: `npx supabase functions logs`
3. Verify environment variables are loaded correctly
4. Check browser console for frontend errors

## 🔒 Security

- **API Key Management**: Secure storage in environment variables and Supabase secrets
- **Authentication**: Token-based admin authentication
- **Data Protection**: All sensitive data encrypted
- **Access Control**: Admin-only dashboard access

## 📈 Performance

- **Real-Time Updates**: Live data synchronization
- **Optimized Queries**: Efficient database queries
- **Caching**: Smart caching for improved performance
- **CDN Ready**: Optimized for global deployment

## 🎯 Next Steps

1. **Set up BFL Flux API key** for image generation
2. **Configure custom branding** in the dashboard
3. **Set up monitoring** for API usage and costs
4. **Deploy to production** using Vercel or similar platform
5. **Configure custom domains** and SSL certificates

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check Supabase function logs
4. Verify environment configuration

---

**Built with ❤️ for AI automation agencies**
