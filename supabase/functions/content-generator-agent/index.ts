import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

    const { requestId, contentType, targetKeywords, outline, customInstructions, contentLength, seoFocus, brandAwareness } = await req.json();

    if (!requestId || !contentType) {
      throw new Error('Missing required fields: requestId and contentType');
    }

    console.log('Starting comprehensive content generation for request:', requestId);

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

    // Step 1: Generate SEO-optimized title, meta description, and slug
    console.log('Generating SEO metadata...');
    
    const titleMetaResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a world-class SEO copywriter for Agentic AI AMRO Ltd, a leading AI automation company.

Company Context:
- Name: ${companyInfo.name || 'Agentic AI AMRO Ltd'}
- Industry: ${companyInfo.industry || 'AI Automation & Custom AI Solutions'}
- Mission: ${companyInfo.mission || 'To accelerate the agentic transformation of businesses'}
- Services: ${JSON.stringify(services.services || [])}
- Achievements: ${JSON.stringify(achievements.stats || {})}

Create SEO-optimized title, meta description, and slug for a ${contentType} targeting these keywords: ${targetKeywords?.join(', ') || 'AI automation'}

Requirements:
1. Title: 50-60 characters, includes primary keyword, compelling
2. Meta Description: 150-160 characters, includes call-to-action
3. Slug: SEO-friendly URL, includes primary keyword
4. SEO Tags: 5-8 relevant tags for categorization
5. Categories: 2-3 relevant categories

Provide response in JSON format:
{
  "title": "SEO-optimized title (50-60 chars)",
  "metaDescription": "Compelling meta description (150-160 chars)",
  "slug": "seo-friendly-url-slug",
  "seoTags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "categories": ["category1", "category2"],
  "primaryKeyword": "main target keyword",
  "secondaryKeywords": ["keyword2", "keyword3"]
}

Ensure the content promotes Agentic AI AMRO Ltd's expertise and includes relevant keywords naturally.`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        }
      }),
    });

    if (!titleMetaResponse.ok) {
      throw new Error(`Gemini API error: ${titleMetaResponse.statusText}`);
    }

    const titleMetaData = await titleMetaResponse.json();
    const titleMetaContent = titleMetaData.candidates[0].content.parts[0].text;

    let parsedTitleMeta;
    try {
      parsedTitleMeta = JSON.parse(titleMetaContent);
    } catch (e) {
      parsedTitleMeta = {
        title: "AI Automation Solutions - Agentic AI AMRO Ltd",
        metaDescription: "Transform your business with cutting-edge AI automation solutions from Agentic AI AMRO Ltd. Expert AI development and implementation.",
        slug: "ai-automation-solutions",
        seoTags: ["ai-automation", "business-intelligence", "machine-learning"],
        categories: ["AI Solutions", "Business Automation"],
        primaryKeyword: targetKeywords?.[0] || "AI automation",
        secondaryKeywords: targetKeywords?.slice(1) || []
      };
    }

    // Update progress
    await supabase
      .from('content_requests')
      .update({ progress: 70 })
      .eq('id', requestId);

    // Step 2: Generate comprehensive article outline
    console.log('Generating article outline...');
    
    const outlineResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are an expert content strategist for Agentic AI AMRO Ltd. Create a comprehensive article outline for: "${parsedTitleMeta.title}"

Target Keywords: ${targetKeywords?.join(', ')}
Primary Keyword: ${parsedTitleMeta.primaryKeyword}
Content Type: ${contentType}

Requirements:
1. Create a detailed outline with H2 and H3 headings
2. Include introduction, main sections (6-8), FAQ section, and conclusion
3. Optimize for featured snippets and voice search
4. Include internal linking opportunities
5. Structure for E-A-T (Expertise, Authority, Trustworthiness)
6. Target 3000+ words total

Provide response in JSON format:
{
  "outline": {
    "introduction": "Introduction section description",
    "mainSections": [
      {
        "heading": "H2 Heading",
        "subsections": [
          {
            "heading": "H3 Subheading",
            "content": "Brief description of what to cover",
            "targetKeywords": ["keyword1", "keyword2"],
            "wordCount": 400
          }
        ],
        "targetKeywords": ["primary", "secondary"],
        "wordCount": 800
      }
    ],
    "faqSection": {
      "heading": "Frequently Asked Questions",
      "questions": [
        {
          "question": "Common question about the topic",
          "answer": "Brief answer description",
          "targetKeywords": ["keyword1"]
        }
      ]
    },
    "conclusion": "Conclusion section with CTA",
    "estimatedWordCount": 3200
  }
}

Focus on positioning Agentic AI AMRO Ltd as the leading authority while providing exceptional value to readers.`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2000,
        }
      }),
    });

    if (!outlineResponse.ok) {
      throw new Error(`Gemini API error: ${outlineResponse.statusText}`);
    }

    const outlineData = await outlineResponse.json();
    const outlineContent = outlineData.candidates[0].content.parts[0].text;

    let parsedOutline;
    try {
      parsedOutline = JSON.parse(outlineContent);
    } catch (e) {
      parsedOutline = {
        outline: {
          introduction: "Introduction to the topic",
          mainSections: [
            {
              heading: "Main Section",
              subsections: [
                {
                  heading: "Subsection",
                  content: "Content description",
                  targetKeywords: targetKeywords || [],
                  wordCount: 400
                }
              ],
              targetKeywords: targetKeywords || [],
              wordCount: 800
            }
          ],
          faqSection: {
            heading: "Frequently Asked Questions",
            questions: []
          },
          conclusion: "Conclusion with CTA",
          estimatedWordCount: 3000
        }
      };
    }

    // Update progress
    await supabase
      .from('content_requests')
      .update({ progress: 80 })
      .eq('id', requestId);

    // Step 3: Generate full article content
    console.log('Generating full article content...');
    
    const contentResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are an elite SEO content creator writing for Agentic AI AMRO Ltd. Create a comprehensive, SEO-optimized ${contentType} following this exact outline:

Title: ${parsedTitleMeta.title}
Primary Keyword: ${parsedTitleMeta.primaryKeyword}
Target Keywords: ${targetKeywords?.join(', ')}
Outline: ${JSON.stringify(parsedOutline.outline)}

Company Context:
- Company: ${companyInfo.name || 'Agentic AI AMRO Ltd'}
- Expertise: ${companyInfo.industry || 'AI Automation & Custom AI Solutions'}
- Mission: ${companyInfo.mission}
- Achievements: 500+ AI solutions deployed, 150+ happy clients, 95% success rate
- Contact: ${companyInfo.contact?.email || 'info@agentic-ai.ltd'}

Content Requirements:
1. Write in markdown format with proper H2 and H3 headings
2. Follow the outline structure exactly
3. Naturally integrate all target keywords throughout
4. Reference Agentic AI AMRO Ltd's services and expertise strategically
5. Include call-to-action sections promoting our services
6. Add comprehensive FAQ section with 10 questions
7. Maintain professional, authoritative tone
8. Include relevant statistics and data
9. Optimize for featured snippets and voice search
10. Include internal link opportunities (mention but don't link)
11. Target 3000+ words total
12. Include schema markup suggestions in comments

${customInstructions ? `Custom Instructions: ${customInstructions}` : ''}

Write content that positions Agentic AI AMRO Ltd as the leading authority in AI automation while providing exceptional value to readers. Make it engaging, informative, and conversion-focused.`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8000,
        }
      }),
    });

    if (!contentResponse.ok) {
      throw new Error(`Gemini API error: ${contentResponse.statusText}`);
    }

    const contentData = await contentResponse.json();
    const articleContent = contentData.candidates[0].content.parts[0].text;

    // Log API usage for all three calls
    await supabase.from('api_usage_logs').insert([
      {
        service_name: 'gemini',
        endpoint: 'generateContent',
        tokens_used: titleMetaData.usageMetadata?.totalTokenCount || 0,
        cost_usd: (titleMetaData.usageMetadata?.totalTokenCount || 0) * 0.0000005, // Gemini pricing
        request_data: { type: 'title_meta', requestId },
        response_data: { titleMeta: parsedTitleMeta },
        success: true
      },
      {
        service_name: 'gemini',
        endpoint: 'generateContent',
        tokens_used: outlineData.usageMetadata?.totalTokenCount || 0,
        cost_usd: (outlineData.usageMetadata?.totalTokenCount || 0) * 0.0000005, // Gemini pricing
        request_data: { type: 'article_outline', requestId },
        response_data: { outline: parsedOutline },
        success: true
      },
      {
        service_name: 'gemini',
        endpoint: 'generateContent',
        tokens_used: contentData.usageMetadata?.totalTokenCount || 0,
        cost_usd: (contentData.usageMetadata?.totalTokenCount || 0) * 0.0000005, // Gemini pricing
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
        outline: parsedOutline.outline,
        seo_tags: parsedTitleMeta.seoTags || [],
        categories: parsedTitleMeta.categories || [],
        status: 'draft',
        primary_keyword: parsedTitleMeta.primaryKeyword,
        secondary_keywords: parsedTitleMeta.secondaryKeywords || []
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
      message: 'Content generated successfully with comprehensive SEO optimization'
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