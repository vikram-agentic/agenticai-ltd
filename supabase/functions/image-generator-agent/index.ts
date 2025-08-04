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
    const fluxApiKey = Deno.env.get('FLUX_API_KEY');

    if (!fluxApiKey) {
      throw new Error('FLUX_API_KEY is not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { contentId, prompt, aspectRatio = '16:9' } = await req.json();

    if (!contentId || !prompt) {
      throw new Error('Missing required fields: contentId and prompt');
    }

    console.log('Starting image generation for content:', contentId);

    // Enhanced prompt for Agentic AI branding
    const enhancedPrompt = `${prompt}. Professional, high-quality, tech-focused image with purple and pink gradient accents. Modern AI and automation theme. Corporate and futuristic aesthetic. Ultra high resolution.`;

    // Call Flux Kontext Pro API
    const fluxResponse = await fetch('https://api.bfl.ai/v1/flux-kontext-pro', {
      method: 'POST',
      headers: {
        'x-key': fluxApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        aspect_ratio: aspectRatio,
        output_format: 'png',
        prompt_upsampling: true,
        safety_tolerance: 2
      }),
    });

    if (!fluxResponse.ok) {
      throw new Error(`Flux API error: ${fluxResponse.statusText}`);
    }

    const fluxData = await fluxResponse.json();
    console.log('Flux API response:', fluxData);

    // If we get a polling URL, we need to wait for the image to be generated
    let imageUrl = '';
    if (fluxData.polling_url) {
      // Poll for completion (simplified for this example)
      let attempts = 0;
      const maxAttempts = 30; // 30 attempts = ~5 minutes

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
        
        const pollResponse = await fetch(fluxData.polling_url, {
          headers: { 'x-key': fluxApiKey }
        });
        
        if (pollResponse.ok) {
          const pollData = await pollResponse.json();
          
          if (pollData.status === 'completed' && pollData.result?.sample) {
            imageUrl = pollData.result.sample;
            break;
          } else if (pollData.status === 'failed') {
            throw new Error('Image generation failed');
          }
        }
        
        attempts++;
      }

      if (!imageUrl) {
        throw new Error('Image generation timed out');
      }
    } else if (fluxData.result?.sample) {
      imageUrl = fluxData.result.sample;
    } else {
      throw new Error('No image URL received from Flux API');
    }

    // Log API usage
    await supabase.from('api_usage_logs').insert({
      service_name: 'flux',
      endpoint: 'flux-kontext-pro',
      cost_usd: 0.05, // Approximate cost per image
      request_data: { prompt: enhancedPrompt, aspectRatio },
      response_data: { imageUrl },
      success: true
    });

    // Store image record
    const { data: imageRecord } = await supabase
      .from('ai_generated_images')
      .insert({
        content_id: contentId,
        prompt: enhancedPrompt,
        image_url: imageUrl,
        aspect_ratio: aspectRatio,
        generation_params: {
          model: 'flux-kontext-pro',
          prompt_upsampling: true,
          safety_tolerance: 2,
          output_format: 'png'
        }
      })
      .select()
      .single();

    // Update the content record with the featured image
    await supabase
      .from('generated_content')
      .update({ featured_image_url: imageUrl })
      .eq('id', contentId);

    console.log('Image generation completed successfully');

    return new Response(JSON.stringify({
      success: true,
      imageData: imageRecord,
      imageUrl: imageUrl,
      message: 'Image generated successfully'
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
      service_name: 'flux',
      endpoint: 'flux-kontext-pro',
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