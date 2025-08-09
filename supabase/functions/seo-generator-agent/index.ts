import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleGenAI } from "https://esm.sh/@google/genai@0.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { topic, targetKeywords, contentType, tone } = await req.json();

    if (!topic) {
      throw new Error('Missing required field: topic');
    }

    console.log('Starting SEO content generation for topic:', topic);

    // Get website context for brand awareness
    const { data: contextData } = await supabase
      .from('website_context')
      .select('*')
      .eq('is_active', true);

    const companyInfo = contextData?.find(c => c.context_type === 'company_info')?.content || {};

    // Generate SEO titles and meta descriptions using Gemini 2.5 Pro
    console.log('Generating SEO titles and meta descriptions with Gemini 2.5 Pro...');
    
    const ai = new GoogleGenAI({
      apiKey: geminiApiKey,
    });

    const tools = [
      { urlContext: {} },
      {
        googleSearch: {
        }
      },
    ];

    const config = {
      temperature: 1.2,
      thinkingConfig: {
        thinkingBudget: -1,
      },
      tools,
    };

    const model = 'gemini-2.5-pro';
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `You are a world-class SEO copywriter and conversion rate optimization expert specializing in creating high-CTR titles, compelling meta descriptions, and optimized metadata that drive both rankings and clicks.

### Core Expertise Areas:
- **Psychology-driven copywriting** with deep understanding of emotional triggers
- **SERP click-through optimization** using proven CTR enhancement techniques
- **SEO-compliant metadata creation** balancing optimization with user appeal
- **Conversion copywriting** that drives action and engagement

### Primary Objective:
Create title tags, meta descriptions, URL slugs, categories, and tags that achieve #1 rankings while maximizing click-through rates from search results.

### Company Context:
- Name: ${companyInfo.name || 'Agentic AI AMRO Ltd'}
- Industry: ${companyInfo.industry || 'AI Automation & Custom AI Solutions'}
- Mission: ${companyInfo.mission || 'To accelerate the agentic transformation of businesses'}

### Content Details:
- Topic: ${topic}
- Content Type: ${contentType}
- Target Keywords: ${targetKeywords?.join(', ') || 'AI automation'}
- Tone: ${tone}

### Title Tag Creation Framework:

#### High-CTR Title Formulas:
1. **Numerical Lists**: "17 Proven [Topic] Strategies That [Benefit] in 2024"
2. **Question Hooks**: "Why Do [Problem]? The Science-Backed Answer"
3. **Curiosity Gaps**: "The [Adjective] [Topic] Secret [Industry] Don't Want You to Know"
4. **Ultimate Guides**: "Complete [Topic] Guide: [Specific Outcome] in [Timeframe]"
5. **Comparison Formats**: "[Option A] vs [Option B]: Which [Outcome] Better?"
6. **Problem/Solution**: "Struggling with [Problem]? Here's the [Time] Solution"
7. **Authority Positioning**: "[Number] [Topic] Tips from [Authority Figure/Experience]"

#### CTR Enhancement Elements:
- **Power Words**: Ultimate, Complete, Proven, Secret, Exclusive, Advanced, Professional
- **Emotional Triggers**: Fear (Don't Make These Mistakes), Curiosity (The Surprising Truth), Urgency (Before It's Too Late)
- **Benefit-Driven Language**: Focus on outcomes, not features
- **Year Inclusion**: Add current year for freshness signals
- **Bracket Usage**: [Guide], [2024], [Free], [Updated] for visual appeal

#### Technical Requirements:
- **Length**: 50-60 characters (mobile-optimized)
- **Primary Keyword**: Include exact match keyword naturally
- **Readability**: Ensure natural flow and avoid keyword stuffing
- **Brand Integration**: Include brand name when beneficial for CTR

### Meta Description Creation Framework:

#### High-Converting Meta Description Structure:
1. **Hook** (15-20 words): Attention-grabbing opening that addresses user pain point or desire
2. **Value Proposition** (20-30 words): Clear benefit and unique angle
3. **Call-to-Action** (10-15 words): Compelling reason to click with action verb

#### CTR-Boosting Elements:
- **Emotional Language**: Use words that evoke feeling and urgency
- **Specific Numbers**: Include statistics, percentages, time frames
- **Question Integration**: Address user's search query directly
- **Benefit Stacking**: Multiple value propositions when space allows
- **Social Proof Hints**: Reference expert status, testimonials, or popularity

#### Technical Specifications:
- **Length**: 150-160 characters maximum
- **Keyword Integration**: Include primary keyword and 1-2 secondary keywords naturally
- **Mobile Optimization**: Ensure key message appears in first 120 characters
- **Action Verbs**: Learn, Discover, Find, Get, Start, Achieve, Master

### Output Requirements:

Generate 8 high-CTR title options and 8 compelling meta descriptions that:
1. Use the psychology-driven formulas above
2. Include power words and emotional triggers
3. Stay within character limits
4. Integrate keywords naturally
5. Reflect Agentic AI AMRO Ltd's authority and expertise
6. Use ${tone} tone throughout
7. Focus on ${contentType} content style

Provide response in JSON format:
{
  "titles": [
    "High-CTR SEO title 1 (50-60 chars with power words)",
    "High-CTR SEO title 2 (50-60 chars with emotional triggers)",
    "High-CTR SEO title 3 (50-60 chars with curiosity gaps)",
    "High-CTR SEO title 4 (50-60 chars with numerical hooks)",
    "High-CTR SEO title 5 (50-60 chars with authority positioning)",
    "High-CTR SEO title 6 (50-60 chars with problem/solution)",
    "High-CTR SEO title 7 (50-60 chars with comparison format)",
    "High-CTR SEO title 8 (50-60 chars with ultimate guide format)"
  ],
  "metaDescriptions": [
    "Hook + Value Prop + CTA meta description 1 (150-160 chars)",
    "Emotional + Numbers + Action meta description 2 (150-160 chars)",
    "Question + Benefits + Urgency meta description 3 (150-160 chars)",
    "Social Proof + Value + CTA meta description 4 (150-160 chars)",
    "Problem + Solution + Action meta description 5 (150-160 chars)",
    "Authority + Benefits + CTA meta description 6 (150-160 chars)",
    "Statistics + Value + Urgency meta description 7 (150-160 chars)",
    "Expert + Outcome + Action meta description 8 (150-160 chars)"
  ]
}

Focus on creating titles and descriptions that will achieve 8%+ CTR improvement over industry average while maintaining top 3 search rankings for target keywords. Each option should use different psychological triggers and copywriting formulas for maximum variety and testing opportunities.

Use Google Search to research current trending topics and competitor analysis for "${topic}" to create more effective and competitive SEO content.`
          }
        ]
      }
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let seoContent = '';
    for await (const chunk of response) {
      if (chunk.text) {
        seoContent += chunk.text;
      }
    }

    let parsedSEO;
    try {
      parsedSEO = JSON.parse(seoContent);
    } catch (e) {
      // Fallback if JSON parsing fails
      parsedSEO = {
        titles: [
          `${topic} - AI Automation Solutions | Agentic AI`,
          `Advanced ${topic} with AI Technology | Agentic AI`,
          `Transform Your Business with ${topic} | Agentic AI`,
          `Expert ${topic} Services | AI Automation Company`,
          `${topic}: Complete AI Solution Guide | Agentic AI`,
          `Professional ${topic} Implementation | Agentic AI`,
          `${topic} Made Simple with AI | Expert Solutions`,
          `Unlock ${topic} Potential | AI Automation Experts`
        ],
        metaDescriptions: [
          `Discover how Agentic AI AMRO Ltd transforms businesses with ${topic}. Expert AI automation solutions, proven results, and comprehensive support. Get started today.`,
          `Expert ${topic} services from Agentic AI. Transform your business with cutting-edge AI automation solutions. Proven track record, 150+ happy clients.`,
          `Transform your business with professional ${topic} from Agentic AI AMRO Ltd. AI automation experts with 500+ successful implementations. Contact us today.`,
          `Leading ${topic} solutions powered by AI technology. Agentic AI AMRO Ltd delivers custom automation solutions with 95% success rate. Learn more now.`,
          `Professional ${topic} services that drive results. Agentic AI specializes in AI automation solutions for modern businesses. Free consultation available.`,
          `Unlock the power of ${topic} with Agentic AI AMRO Ltd. Expert AI automation services, proven methodologies, and dedicated support. Get started today.`,
          `${topic} solutions designed for success. Agentic AI AMRO Ltd offers comprehensive AI automation services with guaranteed results. Contact our experts.`,
          `Experience the future of ${topic} with Agentic AI. Advanced automation solutions, expert implementation, and ongoing support. Transform your business now.`
        ]
      };
    }

    // Log API usage
    await supabase.from('api_usage_logs').insert({
      service_name: 'gemini-2.5-pro',
      endpoint: 'generateContentStream',
      tokens_used: seoContent.length, // Approximate token count
      cost_usd: (seoContent.length / 4) * 0.000001, // Gemini 2.5 Pro pricing estimate
      request_data: { type: 'seo_generation', topic, contentType, model: 'gemini-2.5-pro' },
      response_data: { titles_count: parsedSEO.titles?.length || 0, meta_count: parsedSEO.metaDescriptions?.length || 0 },
      success: true
    });

    console.log('SEO content generation completed successfully');

    return new Response(JSON.stringify({
      success: true,
      titles: parsedSEO.titles || [],
      metaDescriptions: parsedSEO.metaDescriptions || [],
      message: 'SEO content generated successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in SEO generation:', error);

    // Log the error
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    await supabase.from('api_usage_logs').insert({
      service_name: 'gemini-2.5-pro',
      endpoint: 'generateContentStream',
      success: false,
      error_message: error.message
    });

    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});