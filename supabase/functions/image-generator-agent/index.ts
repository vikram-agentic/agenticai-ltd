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

    const { 
      requestId, 
      content, 
      title, 
      imageType = 'featured', 
      prompt, 
      aspectRatio = '16:9',
      count = 1 
    } = await req.json();

    if (!requestId && !prompt) {
      throw new Error('Missing required fields: requestId or prompt');
    }

    console.log('Starting image generation with BFL Flux Kontext Pro...');

    let imagePrompts = [];

    if (prompt) {
      // Direct prompt provided
      imagePrompts = [prompt];
    } else {
      // Generate prompts based on content and type
      if (imageType === 'featured') {
        imagePrompts = [generateFeaturedImagePrompt(title, content)];
      } else {
        imagePrompts = generateContentImagePrompts(content, count);
      }
    }

    const generatedImages = [];

    for (const imagePrompt of imagePrompts) {
      try {
        console.log(`Generating image with prompt: ${imagePrompt}`);

        // Submit generation request to BFL API
        const generateResponse = await fetch('https://api.bfl.ai/v1/flux-kontext-pro', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'x-key': bflApiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: imagePrompt,
            aspect_ratio: aspectRatio,
            output_format: 'jpeg',
            safety_tolerance: 2,
            prompt_upsampling: true
          }),
        });

        if (!generateResponse.ok) {
          throw new Error(`BFL API error: ${generateResponse.statusText}`);
        }

        const generateData = await generateResponse.json();
        const requestImageId = generateData.id;
        const pollingUrl = generateData.polling_url;

        console.log(`Image generation started. ID: ${requestImageId}, Polling URL: ${pollingUrl}`);

        // Poll for result
        let imageResult = null;
        let attempts = 0;
        const maxAttempts = 60; // 30 seconds with 0.5s intervals

        while (attempts < maxAttempts && !imageResult) {
          await new Promise(resolve => setTimeout(resolve, 500));
          attempts++;

          const pollResponse = await fetch(pollingUrl, {
            method: 'GET',
            headers: {
              'accept': 'application/json',
              'x-key': bflApiKey,
            },
          });

          if (!pollResponse.ok) {
            console.warn(`Polling attempt ${attempts} failed: ${pollResponse.statusText}`);
            continue;
          }

          const pollData = await pollResponse.json();
          
          if (pollData.status === 'Ready') {
            imageResult = pollData.result;
            console.log(`Image ready: ${imageResult.sample}`);
            break;
          } else if (pollData.status === 'Error' || pollData.status === 'Failed') {
            throw new Error(`Image generation failed: ${JSON.stringify(pollData)}`);
          }
          
          console.log(`Polling attempt ${attempts}: Status ${pollData.status}`);
        }

        if (!imageResult) {
          throw new Error('Image generation timed out after 30 seconds');
        }

        // Download and store the image
        const imageUrl = imageResult.sample;
        const imageResponse = await fetch(imageUrl);
        
        if (!imageResponse.ok) {
          throw new Error(`Failed to download image: ${imageResponse.statusText}`);
        }

        const imageBuffer = await imageResponse.arrayBuffer();
        const imageBase64 = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));

        // Store in database
        const { data: imageRecord, error: insertError } = await supabase
          .from('ai_generated_images')
          .insert({
            request_id: requestId,
            image_type: imageType,
            prompt: imagePrompt,
            image_url: imageUrl,
            image_data: imageBase64,
            aspect_ratio: aspectRatio,
            generation_model: 'flux-kontext-pro',
            generation_params: {
              safety_tolerance: 2,
              prompt_upsampling: true,
              output_format: 'jpeg'
            }
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error storing image:', insertError);
          // Continue with other images even if storage fails
        }

        generatedImages.push({
          id: imageRecord?.id,
          url: imageUrl,
          prompt: imagePrompt,
          type: imageType,
          base64: imageBase64
        });

      } catch (imageError) {
        console.error(`Error generating image for prompt "${imagePrompt}":`, imageError);
        // Continue with other images
        generatedImages.push({
          error: imageError.message,
          prompt: imagePrompt,
          type: imageType
        });
      }
    }

    // Log API usage
    await supabase.from('api_usage_logs').insert({
      service_name: 'bfl-flux-kontext-pro',
      endpoint: 'image-generation',
      tokens_used: imagePrompts.length, // Count of images generated
      cost_usd: imagePrompts.length * 0.055, // BFL pricing estimate
      request_data: { 
        image_type: imageType, 
        prompts_count: imagePrompts.length,
        aspect_ratio: aspectRatio 
      },
      response_data: { 
        generated_count: generatedImages.filter(img => !img.error).length,
        failed_count: generatedImages.filter(img => img.error).length
      },
      success: generatedImages.some(img => !img.error)
    });

    console.log(`Image generation completed. Generated: ${generatedImages.filter(img => !img.error).length}, Failed: ${generatedImages.filter(img => img.error).length}`);

    return new Response(JSON.stringify({
      success: true,
      images: generatedImages,
      message: `Generated ${generatedImages.filter(img => !img.error).length} images successfully`
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
      service_name: 'bfl-flux-kontext-pro',
      endpoint: 'image-generation',
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

function generateFeaturedImagePrompt(title: string, content: string): string {
  // Extract key themes and concepts from title and content
  const keyWords = extractKeywords(title + ' ' + content);
  
  const styles = [
    'professional business photography',
    'modern minimalist design',
    'high-tech corporate aesthetic',
    'sleek digital illustration',
    'contemporary abstract art',
    'futuristic technology visualization'
  ];

  const style = styles[Math.floor(Math.random() * styles.length)];

  return `Professional featured image for "${title}". ${style}, incorporating themes of ${keyWords.slice(0, 3).join(', ')}, clean composition, vibrant colors, high quality, 4K resolution, suitable for blog header or social media, modern and engaging visual design`;
}

function generateContentImagePrompts(content: string, count: number): string[] {
  const prompts = [];
  const sections = content.split('\n\n').filter(section => section.length > 100);
  
  const imageTypes = [
    'infographic style illustration',
    'conceptual diagram',
    'professional photography',
    'modern digital art',
    'technical visualization',
    'abstract representation'
  ];

  for (let i = 0; i < Math.min(count, sections.length); i++) {
    const section = sections[i];
    const keywords = extractKeywords(section);
    const imageType = imageTypes[i % imageTypes.length];
    
    prompts.push(
      `${imageType} representing ${keywords.slice(0, 2).join(' and ')}, professional quality, clean design, suitable for article content, modern aesthetic, high resolution`
    );
  }

  // Fill remaining slots if needed
  while (prompts.length < count) {
    const keywords = extractKeywords(content);
    const imageType = imageTypes[prompts.length % imageTypes.length];
    
    prompts.push(
      `${imageType} about ${keywords[Math.floor(Math.random() * keywords.length)]}, professional business style, clean and modern, high quality`
    );
  }

  return prompts;
}

function extractKeywords(text: string): string[] {
  // Simple keyword extraction
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word))
    .filter(word => !/^\d+$/.test(word));

  // Count word frequency
  const wordCount: { [key: string]: number } = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  // Return top keywords sorted by frequency
  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
}