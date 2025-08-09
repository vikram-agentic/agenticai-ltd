import { createServer, IncomingMessage, ServerResponse } from 'http';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const geminiApiKey = process.env.GEMINI_API_KEY as string;
const bflApiKey = process.env.BFL_API_KEY as string;
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

const ai = new GoogleGenAI({apiKey: geminiApiKey});

const callGemini = async (prompt: string, model: string = 'gemini-1.5-pro-latest') => {
  const result = await ai.models.generateContentStream({
    model,
    contents: [{role: 'user', parts: [{text: prompt}]}],
  });
  let text = '';
  for await (const chunk of result) {
    text += chunk.text;
  }
  return text;
};

const callFluxApi = async (prompt: string, aspect_ratio: string = "1:1") => {
    const request = await fetch('https://api.bfl.ai/v1/flux-kontext-pro', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'x-key': bflApiKey,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt,
            aspect_ratio,
        }),
    });

    const response = await request.json();
    const { id, polling_url } = response as { id: string; polling_url: string };

    let result;
    while (true) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const pollResponse = await fetch(polling_url, {
            headers: {
                'accept': 'application/json',
                'x-key': bflApiKey,
            },
        });
        result = await pollResponse.json() as { status: string; result: { sample: string } };
        if (result.status === "Ready") {
            return result.result.sample;
        } else if (["Error", "Failed"].includes(result.status)) {
            throw new Error(`Image generation failed: ${JSON.stringify(result)}`);
        }
    }
};

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  try {
    if (!geminiApiKey || !bflApiKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error('API keys or Supabase credentials are not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let body = '';
    req.on('data', (chunk: Buffer) => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        const { topic } = JSON.parse(body);

        if (!topic) {
          throw new Error('Missing required field: topic');
        }

        // 1. Keyword Research
        const keywordResearchPrompt = `
        You are an expert SEO keyword research specialist with 15+ years of experience in digital marketing and search engine optimization. Your expertise includes understanding search intent, competition analysis, keyword difficulty assessment, and trend identification across all industries.

        Your primary objective is to conduct comprehensive keyword research that identifies high-opportunity keywords with optimal search volume, manageable competition, and strong commercial intent.
        
        When provided with a seed keyword or topic, conduct this comprehensive analysis and present actionable insights for content strategy development.
        
        Topic: ${topic}
        `;
        const keywordResearchResult = await callGemini(keywordResearchPrompt);

        // 2. SERP Analysis
        const serpAnalysisPrompt = `
        You are an elite SERP analysis expert with deep expertise in search engine result page dynamics, ranking factors, and competitive intelligence. You possess advanced analytical skills to dissect search results and extract actionable insights for SEO strategy.

        Retrieve, analyze, and report on the top 20 organic search results for target keywords, providing comprehensive competitive intelligence and actionable SEO recommendations.
        
        Topic: ${topic}
        `;
        const serpAnalysisResult = await callGemini(serpAnalysisPrompt);

        // 3. Title, Meta, Slug, Tags Generation
        const titleMetaPrompt = `
        You are a world-class SEO copywriter and conversion rate optimization expert specializing in creating high-CTR titles, compelling meta descriptions, and optimized metadata that drive both rankings and clicks.

        Create title tags, meta descriptions, URL slugs, categories, and tags that achieve #1 rankings while maximizing click-through rates from search results.
        
        Topic: ${topic}
        `;
        const titleMetaResult = await callGemini(titleMetaPrompt);
        const { title, metaDescription, slug, tags, category } = JSON.parse(titleMetaResult);

        // 4. Article Outline Generation
        const outlinePrompt = `
        You are an elite SEO content strategist and information architect with expertise in creating comprehensive, search-optimized article outlines that consistently achieve top rankings. Your outlines serve as blueprints for content that dominates search results through superior structure, comprehensive coverage, and strategic optimization.

        Create detailed, SEO-enhanced article outlines that address all aspects of user intent while incorporating advanced on-page optimization strategies and competitive intelligence insights.
        
        Topic: ${topic}
        `;
        const outlineResult = await callGemini(outlinePrompt);

        // 5. Article Generation
        const articlePrompt = `
        You are an elite SEO content creator and digital marketing expert with 20+ years of experience producing search-dominating articles. You specialize in creating comprehensive, authoritative content that consistently achieves and maintains #1 rankings while delivering exceptional user value.

        Create 3,000+ word, comprehensive articles that outrank all competitors through superior content quality, strategic optimization, and exceptional user value delivery.
        
        Topic: ${topic}
        Outline: ${outlineResult}
        `;
        const articleResult = await callGemini(articlePrompt);

        // 6. Image Prompt Generation
        const imagePromptGeneratorPrompt = `
        You are an expert image prompt generator. Based on the following article, create 5 detailed and descriptive prompts for generating images. The first prompt should be for a featured image (16:9 aspect ratio), and the other four should be for content images (4:3 aspect ratio).

        Article: ${articleResult}
        `;
        const imagePromptsResult = await callGemini(imagePromptGeneratorPrompt);
        const imagePrompts = JSON.parse(imagePromptsResult);

        // 7. Image Generation
        const featuredImageUrl = await callFluxApi(imagePrompts.featured_image_prompt, "16:9");
        const contentImageUrls = await Promise.all(
            imagePrompts.content_image_prompts.map((prompt: string) => callFluxApi(prompt, "4:3"))
        );

        // Store results in database
        const { data: contentRecord } = await supabase
          .from('generated_content')
          .insert({
            topic,
            keyword_research: JSON.parse(keywordResearchResult),
            serp_analysis: JSON.parse(serpAnalysisResult),
            title,
            meta_description: metaDescription,
            slug,
            tags,
            category,
            outline: JSON.parse(outlineResult),
            content: articleResult,
            featured_image_url: featuredImageUrl,
            content_image_urls: contentImageUrls,
            status: 'draft',
          })
          .select()
          .single();

        res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          contentData: contentRecord,
          message: 'Content generation pipeline completed successfully!'
        }));
    });

  } catch (error) {
    console.error('Error in content generation pipeline:', error);
    res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: (error as Error).message,
      success: false 
    }));
  }
});

server.listen(8000, () => {
    console.log('Server is listening on port 8000');
});
