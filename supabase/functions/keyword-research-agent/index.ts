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

    const { seedKeyword, requestId } = await req.json();

    if (!seedKeyword || !requestId) {
      throw new Error('Missing required fields: seedKeyword and requestId');
    }

    console.log('Starting keyword research for:', seedKeyword);

    // Update request status
    await supabase
      .from('content_requests')
      .update({ status: 'researching', progress: 10 })
      .eq('id', requestId);

    // Call Perplexity API for keyword research
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
            content: `You are an expert SEO keyword research specialist with 15+ years of experience. Conduct comprehensive keyword research and provide results in JSON format.`
          },
          {
            role: 'user',
            content: `Conduct comprehensive keyword research for the seed keyword: "${seedKeyword}". 

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
                  "opportunityScore": 8.5
                }
              ],
              "longTailKeywords": [
                {
                  "keyword": "long tail example",
                  "searchVolume": "100-1K",
                  "difficulty": 35,
                  "intent": "commercial",
                  "competition": "low"
                }
              ],
              "questionKeywords": [
                {
                  "keyword": "how to example",
                  "searchVolume": "500-1K",
                  "difficulty": 25,
                  "intent": "informational"
                }
              ],
              "commercialKeywords": [
                {
                  "keyword": "best example tool",
                  "searchVolume": "1K-5K",
                  "difficulty": 45,
                  "intent": "commercial"
                }
              ],
              "relatedTopics": ["topic1", "topic2", "topic3"],
              "contentAngles": ["angle1", "angle2", "angle3"]
            }

            Focus on AI automation, business intelligence, and enterprise AI solutions keywords related to "${seedKeyword}".`
          }
        ],
        reasoning_effort: 'medium',
        search_mode: 'web',
        return_related_questions: true,
        web_search_options: {
          search_context_size: 'high'
        },
        temperature: 0.2,
        max_tokens: 2000
      }),
    });

    if (!perplexityResponse.ok) {
      throw new Error(`Perplexity API error: ${perplexityResponse.statusText}`);
    }

    const perplexityData = await perplexityResponse.json();
    const keywordData = perplexityData.choices[0].message.content;

    // Log API usage
    await supabase.from('api_usage_logs').insert({
      service_name: 'perplexity',
      endpoint: 'chat/completions',
      tokens_used: perplexityData.usage?.total_tokens || 0,
      cost_usd: (perplexityData.usage?.total_tokens || 0) * 0.000002, // Approximate cost
      request_data: { seedKeyword, model: 'sonar-deep-research' },
      response_data: { keywordData },
      success: true
    });

    // Parse and store keyword research results
    let parsedKeywords;
    try {
      parsedKeywords = JSON.parse(keywordData);
    } catch (e) {
      // If JSON parsing fails, create a structured response
      parsedKeywords = {
        primaryKeywords: [{ keyword: seedKeyword, searchVolume: "1K-10K", difficulty: 50, intent: "informational" }],
        longTailKeywords: [],
        questionKeywords: [],
        commercialKeywords: [],
        relatedTopics: [],
        contentAngles: []
      };
    }

    // Store results in database
    const { data: keywordRecord } = await supabase
      .from('keywords_research')
      .insert({
        request_id: requestId,
        seed_keyword: seedKeyword,
        keywords: parsedKeywords,
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
      message: 'Keyword research completed successfully'
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