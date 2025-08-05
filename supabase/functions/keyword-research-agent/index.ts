import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { keywords, requestId } = await req.json();

    if (!keywords || !requestId) {
      throw new Error('Missing required fields: keywords and requestId');
    }

    console.log('Starting comprehensive keyword research for:', keywords);

    // Update request status
    await supabase
      .from('content_requests')
      .update({ status: 'researching', progress: 10 })
      .eq('id', requestId);

    // Step 1: Primary Keyword Research with Gemini
    console.log('Conducting primary keyword research...');
    
    const primaryKeyword = Array.isArray(keywords) ? keywords[0] : keywords;
    
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
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

### Required Analysis for Each Keyword:
- Monthly search volume (provide ranges: 0-100, 100-1K, 1K-10K, 10K-100K, 100K+)
- Keyword difficulty score (1-100 scale)
- Search intent classification (informational, navigational, commercial, transactional)
- Current SERP competition level (low, medium, high)
- Trend analysis (rising, stable, declining)
- Geographic relevance and local search potential
- Content gap opportunities

### Output Format:
Provide results in a structured table format with the following columns:
| Keyword | Search Volume | Keyword Difficulty | Search Intent | Competition | Trend | Opportunity Score |

### Additional Requirements:
- Prioritize keywords based on a calculated opportunity score (search volume ÷ keyword difficulty)
- Include keyword clustering recommendations
- Provide content angle suggestions for top 10 keywords
- Identify featured snippet opportunities
- Suggest related topics for content hub creation

When provided with a seed keyword or topic, conduct this comprehensive analysis and present actionable insights for content strategy development.

Conduct comprehensive keyword research for the seed keyword: "${primaryKeyword}".

Company Context: Agentic AI AMRO Ltd - AI Automation & Custom AI Solutions
Focus Areas: AI automation, machine learning, business intelligence, custom AI development, AI agents, process automation

Provide results in the following JSON structure:
{
  "primaryKeywords": [
    {
      "keyword": "example keyword",
      "searchVolume": "1K-10K",
      "difficulty": 65,
      "intent": "informational",
      "competition": "medium",
      "trend": "rising",
      "opportunityScore": 8.5,
      "cpc": 2.50,
      "relatedTopics": ["topic1", "topic2"]
    }
  ],
  "longTailKeywords": [
    {
      "keyword": "long tail example",
      "searchVolume": "100-1K",
      "difficulty": 35,
      "intent": "commercial",
      "competition": "low",
      "opportunityScore": 9.2
    }
  ],
  "questionKeywords": [
    {
      "keyword": "how to example",
      "searchVolume": "500-1K",
      "difficulty": 25,
      "intent": "informational",
      "opportunityScore": 8.8
    }
  ],
  "commercialKeywords": [
    {
      "keyword": "best example tool",
      "searchVolume": "1K-5K",
      "difficulty": 45,
      "intent": "commercial",
      "opportunityScore": 7.5
    }
  ],
  "relatedTopics": ["topic1", "topic2", "topic3"],
  "contentAngles": ["angle1", "angle2", "angle3"],
  "searchIntent": {
    "informational": 40,
    "commercial": 35,
    "transactional": 25
  },
  "competitionAnalysis": {
    "lowCompetition": 15,
    "mediumCompetition": 45,
    "highCompetition": 40
  }
}

Focus on AI automation, business intelligence, and enterprise AI solutions keywords related to "${primaryKeyword}". Prioritize keywords that align with Agentic AI AMRO Ltd's services and expertise.`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 3000,
        }
      }),
    });

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`);
    }

    const geminiData = await geminiResponse.json();
    const keywordData = geminiData.candidates[0].content.parts[0].text;

    // Step 2: SERP Analysis for top keywords
    console.log('Analyzing SERP for top keywords...');
    
    const serpAnalysisResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are an expert SEO analyst specializing in SERP analysis for AI automation and business intelligence keywords.

Analyze the search engine results for the keyword: "${primaryKeyword}".

Provide SERP analysis in JSON format:
{
  "serpFeatures": {
    "featuredSnippets": ["snippet1", "snippet2"],
    "peopleAlsoAsk": ["question1", "question2", "question3"],
    "relatedSearches": ["search1", "search2"],
    "knowledgeGraph": "present/absent"
  },
  "topCompetitors": [
    {
      "domain": "competitor.com",
      "title": "Competitor Title",
      "strengths": ["strength1", "strength2"],
      "weaknesses": ["weakness1", "weakness2"],
      "contentGaps": ["gap1", "gap2"]
    }
  ],
  "contentOpportunities": [
    {
      "opportunity": "opportunity description",
      "keyword": "related keyword",
      "difficulty": 45,
      "potential": "high/medium/low"
    }
  ],
  "rankingFactors": {
    "contentLength": "average word count",
    "backlinks": "average domain authority",
    "userIntent": "primary intent type",
    "contentType": "blog/article/guide"
  }
}

Focus on identifying content gaps and opportunities for Agentic AI AMRO Ltd to rank for "${primaryKeyword}".`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2000,
        }
      }),
    });

    if (!serpAnalysisResponse.ok) {
      throw new Error(`Gemini SERP API error: ${serpAnalysisResponse.statusText}`);
    }

    const serpData = await serpAnalysisResponse.json();
    const serpAnalysis = serpData.candidates[0].content.parts[0].text;

    // Log API usage for both calls
    await supabase.from('api_usage_logs').insert([
      {
        service_name: 'gemini',
        endpoint: 'generateContent',
        tokens_used: geminiData.usageMetadata?.totalTokenCount || 0,
        cost_usd: (geminiData.usageMetadata?.totalTokenCount || 0) * 0.0000005, // Gemini pricing
        request_data: { primaryKeyword, model: 'gemini-2.0-flash-exp', type: 'keyword_research' },
        response_data: { keywordData },
        success: true
      },
      {
        service_name: 'gemini',
        endpoint: 'generateContent',
        tokens_used: serpData.usageMetadata?.totalTokenCount || 0,
        cost_usd: (serpData.usageMetadata?.totalTokenCount || 0) * 0.0000005, // Gemini pricing
        request_data: { primaryKeyword, model: 'gemini-2.0-flash-exp', type: 'serp_analysis' },
        response_data: { serpAnalysis },
        success: true
      }
    ]);

    // Parse and store keyword research results
    let parsedKeywords;
    try {
      parsedKeywords = JSON.parse(keywordData);
    } catch (e) {
      parsedKeywords = {
        primaryKeywords: [{ keyword: primaryKeyword, searchVolume: "1K-10K", difficulty: 50, intent: "informational" }],
        longTailKeywords: [],
        questionKeywords: [],
        commercialKeywords: [],
        relatedTopics: [],
        contentAngles: []
      };
    }

    let parsedSerp;
    try {
      parsedSerp = JSON.parse(serpAnalysis);
    } catch (e) {
      parsedSerp = {
        serpFeatures: {},
        topCompetitors: [],
        contentOpportunities: [],
        rankingFactors: {}
      };
    }

    // Store results in database
    const { data: keywordRecord } = await supabase
      .from('keywords_research')
      .insert({
        request_id: requestId,
        seed_keyword: primaryKeyword,
        keywords: parsedKeywords,
        serp_analysis: parsedSerp,
        search_volume_data: {
          totalKeywords: Object.values(parsedKeywords).flat().length,
          averageDifficulty: 45,
          topOpportunities: parsedKeywords.primaryKeywords?.slice(0, 5) || []
        },
        competition_analysis: {
          lowCompetition: parsedKeywords.longTailKeywords?.length || 0,
          mediumCompetition: parsedKeywords.primaryKeywords?.length || 0,
          highCompetition: parsedKeywords.commercialKeywords?.length || 0
        }
      })
      .select()
      .single();

    // Update request progress
    await supabase
      .from('content_requests')
      .update({ status: 'researching', progress: 25 })
      .eq('id', requestId);

    console.log('Keyword research completed successfully');

    return new Response(JSON.stringify({
      success: true,
      keywordData: keywordRecord,
      primaryKeyword: primaryKeyword,
      message: 'Comprehensive keyword research completed successfully'
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
      service_name: 'gemini',
      endpoint: 'generateContent',
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