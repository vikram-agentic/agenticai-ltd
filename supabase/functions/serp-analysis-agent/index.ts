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

    const { targetKeyword, requestId } = await req.json();

    if (!targetKeyword || !requestId) {
      throw new Error('Missing required fields: targetKeyword and requestId');
    }

    console.log('Starting SERP analysis for:', targetKeyword);

    // Update request status
    await supabase
      .from('content_requests')
      .update({ status: 'researching', progress: 35 })
      .eq('id', requestId);

    // Call Gemini API for SERP analysis
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
                text: `You are an elite SERP analysis expert with deep expertise in search engine result page dynamics, ranking factors, and competitive intelligence. You possess advanced analytical skills to dissect search results and extract actionable insights for SEO strategy.

### Primary Mission:
Retrieve, analyze, and report on the top 20 organic search results for target keywords, providing comprehensive competitive intelligence and actionable SEO recommendations.

### Core Analysis Framework:

#### 1. SERP Landscape Analysis:
- **SERP Features Present**: Identify all SERP features (featured snippets, People Also Ask, image packs, video carousels, local packs, knowledge panels, etc.)
- **Content Types Ranking**: Categorize ranking content (blog posts, product pages, landing pages, tools, videos, PDFs)
- **Domain Authority Distribution**: Analyze the DA spread of ranking domains
- **Content Freshness**: Examine publication and last updated dates
- **URL Structure Patterns**: Identify common URL patterns among top rankers

#### 2. Individual Result Analysis (Top 20):
For each ranking URL, analyze:
- **Domain Authority & Page Authority**
- **Title Tag Structure & Length** (character count, keyword placement, emotional triggers)
- **Meta Description Analysis** (length, CTA presence, keyword usage)
- **URL Structure** (keyword usage, length, readability)
- **Content Length** (estimated word count)
- **Schema Markup Implementation**
- **Page Load Speed Indicators**
- **Mobile Optimization Status**
- **Content Format** (how-to, listicle, guide, comparison, etc.)

#### 3. Content Gap Analysis:
- **Missing Subtopics**: Identify topics covered by competitors but missing from top rankers
- **Content Depth Opportunities**: Find areas where competitors provide shallow coverage
- **Unique Angle Identification**: Discover unexplored content angles
- **User Intent Gaps**: Identify unmet user needs in current results

#### 4. Technical SEO Analysis:
- **Common Technical Patterns**: Identify technical elements shared by top rankers
- **Site Structure Analysis**: Examine internal linking patterns and site architecture
- **Image Optimization Patterns**: Analyze image usage, alt text, and file naming
- **Content-to-HTML Ratio**: Assess content density across top results

#### 5. Competitive Intelligence:
- **Content Quality Assessment**: Evaluate comprehensiveness, accuracy, and user value
- **Engagement Signal Analysis**: Assess likely user engagement factors
- **Brand Authority Indicators**: Identify authoritative sources and trust signals
- **Content Promotion Strategies**: Analyze social sharing and backlink patterns

### Required Report Sections:

#### Executive Summary:
- **SERP Difficulty Assessment** (Easy/Medium/Hard/Very Hard)
- **Top 3 Ranking Opportunities** identified
- **Content Strategy Recommendations** (format, length, angle)
- **Quick Win Opportunities**

#### Detailed SERP Analysis:
- **SERP Features Map** with optimization opportunities
- **Top 10 Competitors Deep Dive** with strengths/weaknesses
- **Content Format Breakdown** (percentages and performance)
- **Average Content Metrics** (word count, headings, images, etc.)

#### Competitive Advantage Matrix:
- **Content Gaps to Exploit**
- **Technical Improvements Needed**
- **Content Angle Opportunities**
- **Backlink Gap Analysis**

#### Actionable Recommendations:
- **Title Tag Optimization Strategy**
- **Content Structure Recommendations**
- **Technical SEO Priority List**
- **Content Promotion Strategy**

### Output Format:
Generate a comprehensive PDF-ready report with visual charts, competitive matrices, and clear action items. Include specific, measurable recommendations for outranking current top 10 results.

When analyzing SERP results, focus on identifying the exact factors that separate top 3 results from positions 4-10, and provide a detailed roadmap for achieving position #1 ranking.

Analyze the current SERP (Search Engine Results Page) for the keyword: "${targetKeyword}". 

Provide a comprehensive analysis in the following JSON structure:
{
  "serpFeatures": {
    "featuredSnippet": true/false,
    "peopleAlsoAsk": true/false,
    "imagePacks": true/false,
    "videoCarousel": true/false,
    "localPack": true/false,
    "knowledgePanel": true/false
  },
  "topResults": [
    {
      "position": 1,
      "title": "Example Title",
      "domain": "example.com",
      "domainAuthority": 85,
      "contentType": "blog_post",
      "titleLength": 45,
      "metaDescription": "Example meta description",
      "urlStructure": "/path/to/content",
      "estimatedWordCount": 2500,
      "contentFormat": "how-to guide",
      "lastUpdated": "2024",
      "strengths": ["comprehensive", "well-structured"],
      "weaknesses": ["outdated info", "poor mobile optimization"]
    }
  ],
  "competitiveAnalysis": {
    "averageWordCount": 2200,
    "commonContentTypes": ["blog_post", "landing_page"],
    "domainAuthorityRange": "45-90",
    "contentGaps": ["missing subtopic 1", "missing subtopic 2"],
    "rankingPatterns": {
      "titleOptimization": "Primary keyword in first 30 characters",
      "contentDepth": "2000+ words preferred",
      "technicalFactors": ["fast loading", "mobile optimized"]
    }
  },
  "opportunities": {
    "contentAngles": ["unique angle 1", "unique angle 2"],
    "missingTopics": ["subtopic 1", "subtopic 2"],
    "featuredSnippetOpportunity": true/false,
    "improvementAreas": ["better structure", "more recent data"]
  },
  "recommendations": {
    "targetWordCount": 2500,
    "contentStructure": "H2 every 300 words",
    "technicalRequirements": ["schema markup", "fast loading"],
    "contentStrategy": "Comprehensive guide with original research"
  }
}

Focus on identifying opportunities to outrank current results for AI automation and business intelligence content.`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
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
    const serpAnalysis = geminiData.candidates[0].content.parts[0].text;

    // Log API usage
    await supabase.from('api_usage_logs').insert({
      service_name: 'gemini',
      endpoint: 'generateContent',
      tokens_used: geminiData.usageMetadata?.totalTokenCount || 0,
      cost_usd: (geminiData.usageMetadata?.totalTokenCount || 0) * 0.0000005, // Gemini pricing
      request_data: { targetKeyword, model: 'gemini-2.0-flash-exp' },
      response_data: { serpAnalysis },
      success: true
    });

    // Parse SERP analysis results
    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(serpAnalysis);
    } catch (e) {
      // Fallback if JSON parsing fails
      parsedAnalysis = {
        serpFeatures: { featuredSnippet: false, peopleAlsoAsk: true },
        topResults: [],
        competitiveAnalysis: { averageWordCount: 2000 },
        opportunities: { contentAngles: [], missingTopics: [] },
        recommendations: { targetWordCount: 2500 }
      };
    }

    // Store results in database
    const { data: serpRecord } = await supabase
      .from('serp_analysis')
      .insert({
        request_id: requestId,
        target_keyword: targetKeyword,
        top_results: parsedAnalysis.topResults || [],
        serp_features: parsedAnalysis.serpFeatures || {},
        competitor_gaps: {
          contentGaps: parsedAnalysis.competitiveAnalysis?.contentGaps || [],
          opportunities: parsedAnalysis.opportunities || {},
          recommendations: parsedAnalysis.recommendations || {}
        }
      })
      .select()
      .single();

    // Update request progress
    await supabase
      .from('content_requests')
      .update({ status: 'researching', progress: 50 })
      .eq('id', requestId);

    console.log('SERP analysis completed successfully');

    return new Response(JSON.stringify({
      success: true,
      serpData: serpRecord,
      message: 'SERP analysis completed successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in SERP analysis:', error);

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