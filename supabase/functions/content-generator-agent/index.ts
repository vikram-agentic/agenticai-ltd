import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const claudeApiKey = Deno.env.get('ANTHROPIC_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!claudeApiKey) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { requestId, contentType, targetKeywords, outline } = await req.json();

    if (!requestId || !contentType) {
      throw new Error('Missing required fields: requestId and contentType');
    }

    console.log('Starting content generation for request:', requestId);

    // Update request status
    await supabase
      .from('content_requests')
      .update({ status: 'generating', progress: 60 })
      .eq('id', requestId);

    // Get website context for brand awareness
    const { data: contextData } = await supabase
      .from('website_context')
      .select('*')
      .eq('is_active', true);

    const companyInfo = contextData?.find(c => c.context_type === 'company_info')?.content || {};
    const services = contextData?.find(c => c.context_type === 'services')?.content || {};
    const achievements = contextData?.find(c => c.context_type === 'achievements')?.content || {};

    // Generate title and meta with Claude Opus 4
    const titleMetaResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${claudeApiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `You are a world-class SEO copywriter for Agentic AI AMRO Ltd, a leading AI automation company. 

            Company Context:
            - Name: ${companyInfo.name || 'Agentic AI AMRO Ltd'}
            - Industry: ${companyInfo.industry || 'AI Automation & Custom AI Solutions'}
            - Mission: ${companyInfo.mission || 'To accelerate the agentic transformation of businesses'}
            - Services: ${JSON.stringify(services.services || [])}
            - Achievements: ${JSON.stringify(achievements.stats || {})}

            Create SEO-optimized title, meta description, and slug for a ${contentType} targeting these keywords: ${targetKeywords?.join(', ') || 'AI automation'}

            Provide response in JSON format:
            {
              "title": "SEO-optimized title (50-60 chars)",
              "metaDescription": "Compelling meta description (150-160 chars)",
              "slug": "seo-friendly-url-slug",
              "seoTags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
              "categories": ["category1", "category2"]
            }

            Ensure the content promotes Agentic AI AMRO Ltd's expertise and includes relevant keywords naturally.`
          }
        ]
      }),
    });

    if (!titleMetaResponse.ok) {
      throw new Error(`Claude API error: ${titleMetaResponse.statusText}`);
    }

    const titleMetaData = await titleMetaResponse.json();
    const titleMetaContent = titleMetaData.content[0].text;

    let parsedTitleMeta;
    try {
      parsedTitleMeta = JSON.parse(titleMetaContent);
    } catch (e) {
      parsedTitleMeta = {
        title: "AI Automation Solutions - Agentic AI AMRO Ltd",
        metaDescription: "Transform your business with cutting-edge AI automation solutions from Agentic AI AMRO Ltd. Expert AI development and implementation.",
        slug: "ai-automation-solutions",
        seoTags: ["ai-automation", "business-intelligence", "machine-learning"],
        categories: ["AI Solutions", "Business Automation"]
      };
    }

    // Update progress
    await supabase
      .from('content_requests')
      .update({ progress: 70 })
      .eq('id', requestId);

    // Generate full article content
    const contentResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${claudeApiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: `You are an elite SEO content creator writing for Agentic AI AMRO Ltd. Create a comprehensive, SEO-optimized ${contentType} of 3000+ words.

            Title: ${parsedTitleMeta.title}
            Target Keywords: ${targetKeywords?.join(', ') || 'AI automation'}
            ${outline ? `Outline: ${JSON.stringify(outline)}` : ''}

            Company Context:
            - Company: ${companyInfo.name || 'Agentic AI AMRO Ltd'}
            - Expertise: ${companyInfo.industry || 'AI Automation & Custom AI Solutions'}
            - Mission: ${companyInfo.mission}
            - Achievements: 500+ AI solutions deployed, 150+ happy clients, 95% success rate
            - Contact: ${companyInfo.contact?.email || 'info@agentic-ai.ltd'}

            Requirements:
            1. Write in markdown format
            2. Include H2 and H3 headings optimized for SEO
            3. Naturally integrate keywords throughout
            4. Reference Agentic AI AMRO Ltd's services and expertise
            5. Include call-to-action sections promoting our services
            6. Add FAQ section addressing common questions
            7. Maintain professional, authoritative tone
            8. Include statistics and data when relevant
            9. Structure for featured snippets optimization
            10. Include internal link opportunities (mention but don't link)

            Content Structure:
            - Introduction (300-400 words)
            - Main sections (6-8 sections, 300-500 words each)
            - FAQ section (10 questions)
            - Conclusion with CTA (200-300 words)

            Write content that positions Agentic AI AMRO Ltd as the leading authority in AI automation while providing exceptional value to readers.`
          }
        ]
      }),
    });

    if (!contentResponse.ok) {
      throw new Error(`Claude API error: ${contentResponse.statusText}`);
    }

    const contentData = await contentResponse.json();
    const articleContent = contentData.content[0].text;

    // Log API usage
    await supabase.from('api_usage_logs').insert([
      {
        service_name: 'claude',
        endpoint: 'messages',
        tokens_used: titleMetaData.usage?.output_tokens || 0,
        cost_usd: ((titleMetaData.usage?.input_tokens || 0) * 0.000015) + ((titleMetaData.usage?.output_tokens || 0) * 0.000075),
        request_data: { type: 'title_meta', requestId },
        response_data: { titleMeta: parsedTitleMeta },
        success: true
      },
      {
        service_name: 'claude',
        endpoint: 'messages',
        tokens_used: contentData.usage?.output_tokens || 0,
        cost_usd: ((contentData.usage?.input_tokens || 0) * 0.000015) + ((contentData.usage?.output_tokens || 0) * 0.000075),
        request_data: { type: 'article_content', requestId },
        response_data: { contentLength: articleContent.length },
        success: true
      }
    ]);

    // Store generated content
    const { data: contentRecord } = await supabase
      .from('generated_content')
      .insert({
        request_id: requestId,
        title: parsedTitleMeta.title,
        meta_description: parsedTitleMeta.metaDescription,
        slug: parsedTitleMeta.slug,
        content: articleContent,
        outline: outline || {},
        seo_tags: parsedTitleMeta.seoTags || [],
        categories: parsedTitleMeta.categories || [],
        status: 'draft'
      })
      .select()
      .single();

    // Update request to completed
    await supabase
      .from('content_requests')
      .update({ status: 'completed', progress: 100 })
      .eq('id', requestId);

    console.log('Content generation completed successfully');

    return new Response(JSON.stringify({
      success: true,
      contentData: contentRecord,
      message: 'Content generated successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in content generation:', error);

    // Log the error
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    await supabase.from('api_usage_logs').insert({
      service_name: 'claude',
      endpoint: 'messages',
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