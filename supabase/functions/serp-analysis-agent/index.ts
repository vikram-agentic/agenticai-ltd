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
    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');

    if (!perplexityApiKey) {
      throw new Error('PERPLEXITY_API_KEY is not configured');
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

    // Call Perplexity API for SERP analysis
    const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-deep-research',
        messages: [
          {
            role: 'system',
            content: `You are an elite SERP analysis expert with deep expertise in search engine result page dynamics, ranking factors, and competitive intelligence. Analyze the top 20 search results and provide comprehensive competitive intelligence.`
          },
          {
            role: 'user',
            content: `Analyze the current SERP (Search Engine Results Page) for the keyword: "${targetKeyword}". 

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
        ],
        reasoning_effort: 'high',
        search_mode: 'web',
        return_images: true,
        web_search_options: {
          search_context_size: 'high'
        },
        temperature: 0.1,
        max_tokens: 3000
      }),
    });

    if (!perplexityResponse.ok) {
      throw new Error(`Perplexity API error: ${perplexityResponse.statusText}`);
    }

    const perplexityData = await perplexityResponse.json();
    const serpAnalysis = perplexityData.choices[0].message.content;

    // Log API usage
    await supabase.from('api_usage_logs').insert({
      service_name: 'perplexity',
      endpoint: 'chat/completions',
      tokens_used: perplexityData.usage?.total_tokens || 0,
      cost_usd: (perplexityData.usage?.total_tokens || 0) * 0.000002,
      request_data: { targetKeyword, model: 'sonar-deep-research' },
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
      service_name: 'perplexity',
      endpoint: 'chat/completions',
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