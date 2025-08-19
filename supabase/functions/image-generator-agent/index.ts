import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ImageRequest {
  requestId: string;
  content: string;
  title: string;
  imageCount?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { requestId, content, title, imageCount = 3 }: ImageRequest = await req.json();

    if (!requestId || !content || !title) {
      throw new Error('Missing required parameters');
    }

    console.log('Generating images for request:', requestId);

    // Real BFL API call
    const BFL_API_KEY = Deno.env.get('BFL_API_KEY');
    if (!BFL_API_KEY) {
      throw new Error('BFL_API_KEY not configured');
    }

    // Extract key themes from content for image generation
    const imagePrompts = generateImagePrompts(title, content, imageCount);
    const generatedImages = [];

    for (let i = 0; i < imagePrompts.length; i++) {
      try {
        console.log(`Generating image ${i + 1}/${imagePrompts.length}: ${imagePrompts[i].substring(0, 100)}...`);

        const bflResponse = await fetch('https://api.bfl.ml/v1/flux-pro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Key': BFL_API_KEY,
          },
          body: JSON.stringify({
            prompt: imagePrompts[i],
            width: 1024,
            height: 768,
            prompt_upsampling: false,
            safety_tolerance: 5,
            seed: Math.floor(Math.random() * 1000000)
          })
        });

        if (!bflResponse.ok) {
          const errorText = await bflResponse.text();
          console.error(`BFL API error for image ${i + 1}:`, errorText);
          continue; // Skip this image and continue with others
        }

        const bflData = await bflResponse.json();
        
        if (bflData.id) {
          // Poll for result
          const imageResult = await pollForImageResult(bflData.id, BFL_API_KEY);
          
          if (imageResult && imageResult.result && imageResult.result.sample) {
            generatedImages.push({
              prompt: imagePrompts[i],
              url: imageResult.result.sample,
              taskId: bflData.id,
              filename: `${requestId}-image-${i + 1}.jpg`,
              altText: generateAltText(imagePrompts[i], title)
            });
          }
        }

        // Add delay between requests to respect rate limits
        if (i < imagePrompts.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

      } catch (imageError) {
        console.error(`Error generating image ${i + 1}:`, imageError);
        continue;
      }
    }

    // Save generated images to database
    if (generatedImages.length > 0) {
      const { error: saveError } = await supabase
        .from('generated_images')
        .insert(
          generatedImages.map(img => ({
            request_id: requestId,
            image_url: img.url,
            prompt: img.prompt,
            alt_text: img.altText,
            filename: img.filename,
            task_id: img.taskId,
            generated_at: new Date().toISOString()
          }))
        );

      if (saveError) {
        console.error('Error saving images:', saveError);
      }
    }

    console.log(`Generated ${generatedImages.length} images for request:`, requestId);

    return new Response(JSON.stringify({
      success: true,
      requestId,
      images: generatedImages,
      generatedCount: generatedImages.length,
      requestedCount: imageCount,
      generatedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Image generation error:', error);

    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      images: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateImagePrompts(title: string, content: string, count: number): string[] {
  // Extract key themes and concepts from the content
  const basePrompt = `Professional, high-quality illustration for "${title}"`;
  
  const prompts = [
    `${basePrompt}, modern minimalist design, clean aesthetic, business professional, high resolution, detailed`,
    `${basePrompt}, abstract concept visualization, geometric shapes, tech-focused, futuristic design, vibrant colors`,
    `${basePrompt}, infographic style, data visualization, charts and graphs, professional presentation, clear and informative`
  ];

  // Add more specific prompts based on content analysis
  if (content.toLowerCase().includes('ai') || content.toLowerCase().includes('artificial intelligence')) {
    prompts.push(`AI and machine learning visualization, neural networks, digital brain, technology concept, futuristic, professional quality`);
  }

  if (content.toLowerCase().includes('business') || content.toLowerCase().includes('strategy')) {
    prompts.push(`Business strategy visualization, team collaboration, office environment, professional setting, success concept`);
  }

  if (content.toLowerCase().includes('data') || content.toLowerCase().includes('analytics')) {
    prompts.push(`Data analytics dashboard, charts and metrics, business intelligence, professional presentation, detailed visualization`);
  }

  // Return the requested number of prompts
  return prompts.slice(0, count);
}

function generateAltText(prompt: string, title: string): string {
  // Generate SEO-friendly alt text based on the prompt and title
  const cleanPrompt = prompt.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const keywords = cleanPrompt.split(' ').slice(0, 8).join(' ');
  return `${title} - ${keywords}`.substring(0, 125);
}

async function pollForImageResult(taskId: string, apiKey: string, maxAttempts: number = 30): Promise<any> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between polls

      const response = await fetch(`https://api.bfl.ml/v1/get_result?id=${taskId}`, {
        headers: {
          'X-Key': apiKey,
        }
      });

      if (!response.ok) {
        console.error(`Polling error attempt ${attempt + 1}:`, response.statusText);
        continue;
      }

      const result = await response.json();
      
      if (result.status === 'Ready' && result.result) {
        return result;
      } else if (result.status === 'Error') {
        console.error('BFL task failed:', result);
        return null;
      }
      
      // Continue polling if status is 'Pending'
      console.log(`Image generation in progress... (${attempt + 1}/${maxAttempts})`);
      
    } catch (pollError) {
      console.error(`Polling attempt ${attempt + 1} failed:`, pollError);
    }
  }
  
  console.error('Max polling attempts reached for task:', taskId);
  return null;
}
