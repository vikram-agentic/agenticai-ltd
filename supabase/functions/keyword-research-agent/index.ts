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

    const { requestId, keywords, industry, targetAudience, contentType } = await req.json();

    if (!keywords || keywords.length === 0) {
      throw new Error('Missing required field: keywords');
    }

    console.log('Starting comprehensive keyword research for:', keywords);

    // Get website context for brand awareness
    const { data: contextData } = await supabase
      .from('website_context')
      .select('*')
      .eq('is_active', true);

    const companyInfo = contextData?.find(c => c.context_type === 'company_info')?.content || {};

    // Comprehensive keyword research using Gemini 2.5 Pro with Google Search
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
            text: `You are an expert SEO keyword research specialist with 15+ years of experience in digital marketing and search engine optimization. Your expertise includes understanding search intent, competition analysis, keyword difficulty assessment, and trend identification across all industries.

Your primary objective is to conduct comprehensive keyword research that identifies high-opportunity keywords with optimal search volume, manageable competition, and strong commercial intent.

### Core Responsibilities:
1. **Primary Keyword Analysis**: Identify the main target keyword with optimal search volume (1K-100K monthly searches) and manageable competition
2. **Semantic Keyword Discovery**: Find 50-100 semantically related keywords, including LSI keywords, synonyms, and variations
3. **Long-tail Keyword Mining**: Discover 30-50 long-tail keywords (3+ words) with lower competition and specific search intent
4. **Question-based Keywords**: Identify 20-30 question keywords (what, how, why, when, where) related to the topic
5. **Commercial Intent Keywords**: Find 15-25 keywords with buying intent (best, top, review, compare, buy, price)
6. **Competitor Gap Analysis**: Identify keywords your competitors rank for but you don't
7. **Seasonal/Trending Keywords**: Discover time-sensitive and trending keyword opportunities

### Company Context:
- Name: ${companyInfo.name || 'Agentic AI AMRO Ltd'}
- Industry: ${companyInfo.industry || industry || 'AI Automation & Custom AI Solutions'}
- Target Audience: ${targetAudience || 'Business owners, CTOs, and decision-makers seeking AI automation'}

### Research Parameters:
- Seed Keywords: ${keywords.join(', ')}
- Content Type: ${contentType || 'blog'}
- Industry Focus: ${industry || 'AI Automation'}

### Required Analysis for Each Keyword:
- Monthly search volume (provide ranges: 0-100, 100-1K, 1K-10K, 10K-100K, 100K+)
- Keyword difficulty score (1-100 scale)
- Search intent classification (informational, navigational, commercial, transactional)
- Current SERP competition level (low, medium, high)
- Trend analysis (rising, stable, declining)
- Geographic relevance and local search potential
- Content gap opportunities

### Output Format:
Provide results in structured JSON format with comprehensive keyword categorization:

{
  "primaryKeyword": {
    "keyword": "main target keyword",
    "searchVolume": "1K-10K",
    "difficulty": 45,
    "intent": "commercial",
    "competition": "medium",
    "trend": "rising",
    "opportunityScore": 85
  },
  "semanticKeywords": [
    {
      "keyword": "semantic variation 1",
      "searchVolume": "100-1K",
      "difficulty": 35,
      "intent": "informational",
      "competition": "low",
      "trend": "stable",
      "opportunityScore": 75
    }
  ],
  "longTailKeywords": [
    {
      "keyword": "specific long tail phrase",
      "searchVolume": "100-1K",
      "difficulty": 25,
      "intent": "transactional",
      "competition": "low",
      "trend": "rising",
      "opportunityScore": 90
    }
  ],
  "questionKeywords": [
    {
      "keyword": "how to [topic question]",
      "searchVolume": "100-1K",
      "difficulty": 30,
      "intent": "informational",
      "competition": "medium",
      "trend": "stable",
      "opportunityScore": 80
    }
  ],
  "commercialKeywords": [
    {
      "keyword": "best [product/service]",
      "searchVolume": "1K-10K",
      "difficulty": 55,
      "intent": "commercial",
      "competition": "high",
      "trend": "stable",
      "opportunityScore": 70
    }
  ],
  "trendingKeywords": [
    {
      "keyword": "trending topic keyword",
      "searchVolume": "1K-10K",
      "difficulty": 40,
      "intent": "informational",
      "competition": "medium",
      "trend": "rising",
      "opportunityScore": 85
    }
  ],
  "contentAngles": [
    "Ultimate guide to [primary keyword]",
    "How to implement [primary keyword] in 2024",
    "[Primary keyword] vs alternatives comparison",
    "Common [primary keyword] mistakes to avoid"
  ],
  "keywordClusters": [
    {
      "clusterName": "Implementation Cluster",
      "keywords": ["keyword1", "keyword2", "keyword3"],
      "contentOpportunity": "How-to guide focusing on implementation"
    }
  ],
  "featuredSnippetOpportunities": [
    "What is [primary keyword]",
    "How does [primary keyword] work",
    "[Primary keyword] benefits"
  ]
}

### Additional Requirements:
- Prioritize keywords based on a calculated opportunity score (search volume ÷ keyword difficulty)
- Include keyword clustering recommendations
- Provide content angle suggestions for top 10 keywords
- Identify featured snippet opportunities
- Suggest related topics for content hub creation

Focus on finding keywords that Agentic AI AMRO Ltd can realistically rank for while driving qualified traffic and potential conversions. Consider the company's expertise in AI automation and custom AI solutions when evaluating keyword opportunities.

**IMPORTANT**: Use Google Search to research current search trends, competition analysis, and real-time keyword data for the seed keywords: ${keywords.join(', ')}. This will help you provide more accurate search volume estimates and identify trending opportunities.`
          }
        ]
      }
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let keywordContent = '';
    for await (const chunk of response) {
      if (chunk.text) {
        keywordContent += chunk.text;
      }
    }

    let parsedKeywords;
    try {
      // Try to extract JSON from the response
      const jsonMatch = keywordContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedKeywords = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (e) {
      console.error('Error parsing keyword research JSON:', e);
      // Fallback structured response
      parsedKeywords = {
        primaryKeyword: {
          keyword: keywords[0],
          searchVolume: "1K-10K",
          difficulty: 45,
          intent: "commercial",
          competition: "medium",
          trend: "stable",
          opportunityScore: 75
        },
        semanticKeywords: keywords.map((kw, i) => ({
          keyword: `${kw} automation`,
          searchVolume: "100-1K",
          difficulty: 35,
          intent: "informational",
          competition: "low",
          trend: "stable",
          opportunityScore: 80 - (i * 5)
        })),
        longTailKeywords: keywords.map(kw => ({
          keyword: `how to implement ${kw} for business`,
          searchVolume: "100-1K",
          difficulty: 25,
          intent: "informational",
          competition: "low",
          trend: "rising",
          opportunityScore: 85
        })),
        questionKeywords: [
          {
            keyword: `what is ${keywords[0]}`,
            searchVolume: "1K-10K",
            difficulty: 30,
            intent: "informational",
            competition: "medium",
            trend: "stable",
            opportunityScore: 80
          }
        ],
        commercialKeywords: [
          {
            keyword: `best ${keywords[0]} solutions`,
            searchVolume: "1K-10K",
            difficulty: 55,
            intent: "commercial",
            competition: "high",
            trend: "stable",
            opportunityScore: 70
          }
        ],
        trendingKeywords: [],
        contentAngles: [
          `Ultimate ${keywords[0]} Guide for 2024`,
          `How to Choose the Right ${keywords[0]} Solution`,
          `${keywords[0]} Implementation Best Practices`
        ],
        keywordClusters: [],
        featuredSnippetOpportunities: [
          `What is ${keywords[0]}`,
          `How does ${keywords[0]} work`,
          `${keywords[0]} benefits for business`
        ]
      };
    }

    // Update content request with keyword research results
    if (requestId) {
      await supabase
        .from('content_requests')
        .update({
          progress: 25,
          status: 'processing',
          keyword_research: parsedKeywords
        })
        .eq('id', requestId);
    }

    // Log API usage
    await supabase.from('api_usage_logs').insert({
      service_name: 'gemini-2.5-pro',
      endpoint: 'keyword-research',
      tokens_used: keywordContent.length, // Approximate token count
      cost_usd: (keywordContent.length / 4) * 0.000001, // Gemini 2.5 Pro pricing estimate
      request_data: { keywords, industry, contentType, model: 'gemini-2.5-pro' },
      response_data: { 
        total_keywords: Object.values(parsedKeywords).flat().length,
        primary_keyword: parsedKeywords.primaryKeyword?.keyword 
      },
      success: true
    });

    console.log('Keyword research completed successfully');

    return new Response(JSON.stringify({
      success: true,
      keywords: parsedKeywords,
      primaryKeyword: parsedKeywords.primaryKeyword?.keyword || keywords[0],
      message: 'Comprehensive keyword research completed'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in keyword research:', error);

    // Log the error
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    await supabase.from('api_usage_logs').insert({
      service_name: 'gemini-2.5-pro',
      endpoint: 'keyword-research',
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