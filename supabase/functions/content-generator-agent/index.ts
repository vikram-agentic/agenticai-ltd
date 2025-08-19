import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContentRequest {
  requestId: string;
  contentType: string;
  targetKeywords: string[];
  customInstructions?: string;
  contentLength: string;
  seoFocus: boolean;
  brandAwareness: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let requestBody: ContentRequest;
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    requestBody = await req.json();
    const {
      requestId,
      contentType,
      targetKeywords,
      customInstructions,
      contentLength,
      seoFocus,
      brandAwareness
    } = requestBody;

    if (!requestId || !contentType || !targetKeywords || targetKeywords.length === 0) {
      throw new Error('Missing required parameters');
    }

    console.log('Generating content for request:', requestId);

    // Update request status
    await supabase
      .from('content_requests')
      .update({ status: 'processing', progress: 25 })
      .eq('id', requestId);

    // Real Gemini API call
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const wordCount = contentLength.includes('1500') ? '1500+' : 
                     contentLength.includes('2500') ? '2500+' :
                     contentLength.includes('3000') ? '3000+' :
                     contentLength.includes('5000') ? '5000+' :
                     contentLength.includes('10000') ? '10000+' : '3000+';

    const prompt = `You are an expert content writer and SEO specialist. Create comprehensive, engaging content for:

Content Type: ${contentType}
Target Keywords: ${targetKeywords.join(', ')}
Content Length: ${wordCount} words
SEO Focus: ${seoFocus ? 'Yes - Optimize for search engines' : 'No'}
Brand Awareness: ${brandAwareness ? 'Yes - Include Agentic AI brand mentions' : 'No'}
Custom Instructions: ${customInstructions || 'None'}

BRAND INFORMATION (use if brandAwareness is true):
- Company: Agentic AI AMRO Ltd
- Location: Tunbridge Wells, Kent, UK
- Email: info@agentic-ai.ltd
- Website: https://agentic-ai.ltd
- Services: AI automation, business transformation, intelligent decision-making
- Expertise: Business AI solutions, process automation, AI strategy consulting

CONTENT REQUIREMENTS:
1. Create compelling, well-structured content
2. Include proper headings (H1, H2, H3)
3. Use target keywords naturally throughout
4. Include actionable insights and practical tips
5. Add relevant examples and case studies
6. Ensure content is engaging and valuable
7. Include a compelling introduction and conclusion
8. Add call-to-action sections where appropriate

${seoFocus ? `
SEO REQUIREMENTS:
- Include primary keyword in title and first paragraph
- Use semantic keywords and related terms
- Add internal linking suggestions
- Include meta description suggestions
- Optimize for featured snippets with Q&A sections
- Include schema markup suggestions
` : ''}

Return the response in JSON format:
{
  "title": "Compelling SEO-optimized title",
  "content": "Full content with HTML formatting including headings, paragraphs, lists",
  "metaDescription": "SEO meta description (150-160 characters)",
  "excerpt": "Brief excerpt (150 words max)",
  "seoTags": ["keyword1", "keyword2", "keyword3"],
  "categories": ["category1", "category2"],
  "readingTime": "estimated reading time in minutes",
  "wordCount": "actual word count"
}

Generate high-quality, professional content that provides real value to readers while meeting all SEO requirements.`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        })
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API failed: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    
    if (!geminiData.candidates || !geminiData.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error('No content generated by Gemini');
    }

    const generatedText = geminiData.candidates[0].content.parts[0].text;
    console.log('Generated content length:', generatedText.length);

    // Parse JSON from generated text
    let contentData;
    try {
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        contentData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      
      // Fallback: Extract content manually
      const lines = generatedText.split('\n');
      let title = '';
      let content = '';
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line && !title) {
          title = line.replace(/^#\s*/, '').replace(/"/g, '');
          break;
        }
      }
      
      content = generatedText;
      
      contentData = {
        title: title || `${targetKeywords[0]} - Comprehensive Guide`,
        content: content,
        metaDescription: `Learn everything about ${targetKeywords[0]}. Expert insights, practical tips, and proven strategies.`,
        excerpt: content.substring(0, 150) + '...',
        seoTags: targetKeywords.slice(0, 5),
        categories: [contentType === 'blog' ? 'Blog' : 'Pages'],
        readingTime: Math.ceil(content.split(' ').length / 200) + ' min',
        wordCount: content.split(' ').length.toString()
      };
    }

    // Validate and ensure all required fields
    if (!contentData.title) {
      contentData.title = `${targetKeywords[0]} - Complete Guide ${new Date().getFullYear()}`;
    }
    if (!contentData.content) {
      throw new Error('No content was generated');
    }
    if (!contentData.metaDescription) {
      contentData.metaDescription = `Discover ${targetKeywords[0]} strategies and best practices. Expert insights and actionable tips for success.`;
    }
    if (!contentData.seoTags || !Array.isArray(contentData.seoTags)) {
      contentData.seoTags = targetKeywords.slice(0, 5);
    }
    if (!contentData.categories || !Array.isArray(contentData.categories)) {
      contentData.categories = [contentType === 'blog' ? 'AI & Technology' : 'Business Solutions'];
    }

    // Update progress
    await supabase
      .from('content_requests')
      .update({ status: 'processing', progress: 75 })
      .eq('id', requestId);

    // Save generated content to database
    const { data: savedContent, error: saveError } = await supabase
      .from('generated_content')
      .insert({
        request_id: requestId,
        title: contentData.title,
        content: contentData.content,
        meta_description: contentData.metaDescription,
        excerpt: contentData.excerpt || contentData.content.substring(0, 150) + '...',
        seo_tags: contentData.seoTags,
        categories: contentData.categories,
        content_type: contentType,
        target_keywords: targetKeywords,
        status: 'generated',
        word_count: parseInt(contentData.wordCount || '0') || contentData.content.split(' ').length,
        reading_time: parseInt(contentData.readingTime?.replace(/\D/g, '') || '5') || Math.ceil(contentData.content.split(' ').length / 200),
        primary_keyword: targetKeywords[0],
        generated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (saveError) {
      console.error('Save error:', saveError);
      throw new Error('Failed to save generated content');
    }

    // Update request to completed
    await supabase
      .from('content_requests')
      .update({ 
        status: 'completed', 
        progress: 100,
        completed_at: new Date().toISOString()
      })
      .eq('id', requestId);

    console.log('Content generation completed for request:', requestId);

    return new Response(JSON.stringify({
      success: true,
      requestId,
      contentData: {
        id: savedContent.id,
        title: contentData.title,
        content: contentData.content,
        metaDescription: contentData.metaDescription,
        excerpt: contentData.excerpt,
        seoTags: contentData.seoTags,
        categories: contentData.categories,
        wordCount: contentData.wordCount,
        readingTime: contentData.readingTime
      },
      generatedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Content generation error:', error);

    // Update request status to failed using the already parsed requestBody
    try {
      if (requestBody?.requestId) {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL')!,
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        );
        
        await supabase
          .from('content_requests')
          .update({ 
            status: 'failed',
            error_message: error.message,
            updated_at: new Date().toISOString()
          })
          .eq('id', requestBody.requestId);
      }
    } catch (updateError) {
      console.error('Failed to update request status:', updateError);
    }

    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
