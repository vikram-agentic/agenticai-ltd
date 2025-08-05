import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const bflApiKey = Deno.env.get('BFL_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!bflApiKey) {
      throw new Error('BFL_API_KEY is not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { requestId, content, title } = await req.json();

    if (!requestId || !content || !title) {
      throw new Error('Missing required fields: requestId, content, and title');
    }

    console.log('Starting AI image generation for request:', requestId);

    // Update request status
    await supabase
      .from('content_requests')
      .update({ status: 'generating_images', progress: 85 })
      .eq('id', requestId);

    // Step 1: Generate image prompts from content
    console.log('Generating image prompts from content...');
    
    const promptGenerationResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('ANTHROPIC_API_KEY')}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: `You are an expert image prompt engineer for Agentic AI AMRO Ltd. Create compelling image prompts for the following content:

Title: ${title}
Content: ${content.substring(0, 2000)}...

Requirements:
1. Create 3 different image prompts for different aspects of the content
2. Focus on AI automation, technology, and business themes
3. Include professional, modern, and futuristic elements
4. Optimize for BFL Flux Kontext Pro model
5. Include specific style and quality parameters

Provide response in JSON format:
{
  "imagePrompts": [
    {
      "prompt": "detailed prompt description",
      "aspectRatio": "16:9",
      "style": "professional, modern, tech-focused",
      "purpose": "hero image, featured image, or section illustration"
    }
  ],
  "brandGuidelines": {
    "colorScheme": "purple, blue, white",
    "style": "modern, professional, futuristic",
    "elements": "AI, automation, technology, business"
  }
}

Focus on creating images that represent Agentic AI AMRO Ltd's expertise in AI automation and business solutions.`
          }
        ]
      }),
    });

    if (!promptGenerationResponse.ok) {
      throw new Error(`Claude API error: ${promptGenerationResponse.statusText}`);
    }

    const promptData = await promptGenerationResponse.json();
    const promptContent = promptData.content[0].text;

    let parsedPrompts;
    try {
      parsedPrompts = JSON.parse(promptContent);
    } catch (e) {
      parsedPrompts = {
        imagePrompts: [
          {
            prompt: "Modern AI automation technology concept, purple and blue gradient background, professional business setting, futuristic interface, clean design, high quality, 4K",
            aspectRatio: "16:9",
            style: "professional, modern, tech-focused",
            purpose: "hero image"
          }
        ],
        brandGuidelines: {
          colorScheme: "purple, blue, white",
          style: "modern, professional, futuristic",
          elements: "AI, automation, technology, business"
        }
      };
    }

    // Step 2: Generate images using BFL Flux Kontext Pro
    console.log('Generating images with BFL Flux...');
    
    const generatedImages = [];

    for (const imagePrompt of parsedPrompts.imagePrompts) {
      const bflResponse = await fetch('https://api.bfl.ml/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bflApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'kontext-pro',
          prompt: imagePrompt.prompt,
          aspect_ratio: imagePrompt.aspectRatio,
          quality: 'high',
          style: imagePrompt.style,
          negative_prompt: "blurry, low quality, distorted, amateur, cartoon, anime",
          num_images: 1,
          guidance_scale: 7.5,
          num_inference_steps: 50,
          seed: Math.floor(Math.random() * 1000000)
        }),
      });

      if (!bflResponse.ok) {
        throw new Error(`BFL API error: ${bflResponse.statusText}`);
      }

      const bflData = await bflResponse.json();
      
      if (bflData.data && bflData.data.length > 0) {
        generatedImages.push({
          prompt: imagePrompt.prompt,
          imageUrl: bflData.data[0].url,
          aspectRatio: imagePrompt.aspectRatio,
          purpose: imagePrompt.purpose,
          generationParams: {
            model: 'kontext-pro',
            quality: 'high',
            guidance_scale: 7.5,
            num_inference_steps: 50
          }
        });
      }
    }

    // Log API usage
    await supabase.from('api_usage_logs').insert([
      {
        service_name: 'claude',
        endpoint: 'messages',
        tokens_used: promptData.usage?.output_tokens || 0,
        cost_usd: ((promptData.usage?.input_tokens || 0) * 0.000015) + ((promptData.usage?.output_tokens || 0) * 0.000075),
        request_data: { type: 'image_prompt_generation', requestId },
        response_data: { prompts: parsedPrompts },
        success: true
      },
      {
        service_name: 'bfl_flux',
        endpoint: 'images/generations',
        tokens_used: generatedImages.length,
        cost_usd: generatedImages.length * 0.05, // Approximate cost per image
        request_data: { type: 'image_generation', requestId, model: 'kontext-pro' },
        response_data: { imagesGenerated: generatedImages.length },
        success: true
      }
    ]);

    // Store generated images
    const { data: contentRecord } = await supabase
      .from('generated_content')
      .select('id')
      .eq('request_id', requestId)
      .single();

    if (contentRecord && generatedImages.length > 0) {
      for (const image of generatedImages) {
        await supabase
          .from('ai_generated_images')
          .insert({
            content_id: contentRecord.id,
            prompt: image.prompt,
            image_url: image.imageUrl,
            aspect_ratio: image.aspectRatio,
            generation_params: image.generationParams,
            purpose: image.purpose
          });
      }

      // Update content with featured image
      await supabase
        .from('generated_content')
        .update({ 
          featured_image_url: generatedImages[0].imageUrl,
          status: 'draft'
        })
        .eq('id', contentRecord.id);
    }

    // Update request to completed
    await supabase
      .from('content_requests')
      .update({ status: 'completed', progress: 100 })
      .eq('id', requestId);

    console.log('Image generation completed successfully');

    return new Response(JSON.stringify({
      success: true,
      images: generatedImages,
      message: 'Images generated successfully with BFL Flux Kontext Pro'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in image generation:', error);

    // Log the error
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    await supabase.from('api_usage_logs').insert({
      service_name: 'bfl_flux',
      endpoint: 'images/generations',
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