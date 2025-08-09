import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SaveResourceRequest {
  filePath: string;
  content: string;
  resourceType: string;
  topic: string;
  category: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { filePath, content, resourceType, topic, category }: SaveResourceRequest = await req.json();

    // Create directory structure if it doesn't exist
    const pathParts = filePath.split('/');
    let currentPath = '';
    
    for (let i = 0; i < pathParts.length - 1; i++) {
      currentPath += pathParts[i] + '/';
      try {
        await Deno.mkdir(currentPath, { recursive: true });
      } catch (error) {
        // Directory might already exist, continue
        console.log(`Directory creation info: ${error.message}`);
      }
    }

    // Write the file
    await Deno.writeTextFile(filePath, content);
    
    console.log(`Resource saved successfully: ${filePath}`);

    return new Response(JSON.stringify({
      success: true,
      message: 'Resource file saved successfully',
      filePath
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Save resource error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
