/// <reference types="https://deno.land/x/deno/cli/types/v1.33.3/runtime.d.ts" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ResourceRequest {
  resourceType: 'guide' | 'template' | 'report' | 'checklist';
  topic: string;
  category: string;
  includeImages: boolean;
  includeVisualizations: boolean;
}

async function generateContentWithGemini(prompt: string): Promise<string> {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': geminiApiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 32768,
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini Content API error: ${error}`);
  }

  const data = await response.json();
  return data.candidates[0]?.content?.parts[0]?.text || '';
}

async function generateImageWithGemini(prompt: string): Promise<string> {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateImages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
      'X-goog-api-key': geminiApiKey,
        },
        body: JSON.stringify({
      prompt: prompt
    })
    });

    if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini Image API error: ${error}`);
  }

  const data = await response.json();
  const imageBytes = data.generatedImages?.[0]?.image?.imageBytes;
  
  if (!imageBytes) {
    throw new Error('No image data received from Gemini');
  }

  return imageBytes;
}

function getResourcePrompts(resourceType: string, topic: string, category: string) {
  const baseCompanyInfo = `
Company: Agentic AI Ltd
Email: info@agentic-ai.ltd
Phone: +44 7771 970567
Website: https://agentic-ai.ltd
Logo: Include watermark positioning for logo placement

CRITICAL REQUIREMENTS:
- Generate EXTREMELY LENGTHY content (minimum 8000+ words)
- Include extensive hyperlinks throughout the text
- SEO-optimized with relevant keywords
- Professional branding and styling
- NO social media links
- Include promotional content about Agentic AI services
- Format as complete HTML document with proper CSS styling
- Include cover page design
- Professional fonts and attractive layout
`;

  const prompts = {
    guide: {
      content: `You are an expert technical writer creating a COMPLETE, FULLY WRITTEN implementation guide about "${topic}" in the "${category}" category. 

CRITICAL: Generate the ENTIRE document with FULL content - not an outline or template. Write every single word, paragraph, and section in complete detail.

${baseCompanyInfo}

Generate a complete HTML document with the following structure. Write EVERY section in full detail with actual content (MINIMUM 8000 words total):

1. Executive Summary (600+ words) - Write a complete executive summary with actual insights, findings, and recommendations
2. Introduction & Problem Statement (800+ words) - Provide detailed background, context, and problem analysis
3. Technical Implementation Details (2500+ words) - Include specific technical instructions, code examples, architecture diagrams, step-by-step procedures
4. Best Practices & Methodologies (1500+ words) - Detail proven methodologies, frameworks, and industry standards
5. Case Studies & Real Examples (1200+ words) - Provide specific real-world examples with data, metrics, and outcomes
6. ROI Analysis & Metrics (800+ words) - Include actual calculations, cost-benefit analysis, and performance metrics
7. Common Challenges & Solutions (1000+ words) - Detail specific problems and their solutions with examples
8. Future Considerations (600+ words) - Provide forward-looking analysis and recommendations

REQUIREMENTS:
- Write COMPLETE paragraphs and sections - no placeholders or [insert content here]
- Include specific data, statistics, and real examples
- Add hyperlinks to actual resources (use real URLs)
- Format as complete HTML with professional CSS styling
- Include detailed technical specifications and procedures
- Make every section substantive and valuable
- Use professional business language
- Include the company branding and contact information

START WRITING THE COMPLETE DOCUMENT NOW:`,

      images: [
        `Professional infographic about ${topic} implementation workflow, modern blue and purple gradient, clean corporate design, high quality`,
        `Data visualization chart showing ${topic} ROI metrics and performance indicators, professional business graphics, clean modern style`,
        `Technical architecture diagram for ${topic} systems, clean design with connected components, professional IT style`,
        `Comparison matrix for ${topic} approaches and methodologies, professional table design with ratings and checkmarks`
      ]
    },

    template: {
      content: `You are a project management expert creating a COMPLETE, FULLY WRITTEN template for "${topic}" in the "${category}" category.

CRITICAL: Generate the ENTIRE template with FULL content - not an outline. Write every task, instruction, and detail completely.

${baseCompanyInfo}

Generate a complete HTML template document with the following structure. Write EVERY section in full detail with actual content (MINIMUM 5000 words total):

1. Template Overview & Instructions (400+ words) - Write complete usage instructions and overview
2. Detailed Task Breakdown (50+ specific actionable tasks) - List 50+ specific, actionable tasks with detailed descriptions
3. Timeline & Milestones (comprehensive scheduling) - Create detailed timeline with specific dates and milestones
4. Team Roles & Responsibilities (detailed assignments) - Define specific roles with detailed responsibilities
5. Risk Assessment Matrix (complete risk analysis) - Create comprehensive risk matrix with mitigation strategies
6. Budget Planning Framework (detailed cost breakdown) - Provide detailed budget categories and cost estimates
7. Success Metrics & KPIs (measurable outcomes) - Define specific, measurable success criteria
8. Quality Assurance Checklist (verification steps) - Create detailed QA checklist with verification procedures

REQUIREMENTS:
- Write COMPLETE content with actual tasks and instructions - no placeholders
- Include specific, actionable items that teams can immediately use
- Add interactive checkboxes and form elements in HTML
- Provide detailed timelines, budgets, and specifications
- Include real resource links and references
- Format as complete HTML with professional styling
- Make it immediately usable for enterprise teams

START WRITING THE COMPLETE TEMPLATE NOW:`,

      images: [
        `Clean project timeline visualization for ${topic} with milestones and phases, Gantt chart style, professional colors`,
        `Team organization chart for ${topic} projects, modern flat design with roles and responsibilities`,
        `Risk assessment matrix for ${topic}, color-coded heat map style, professional business graphics`,
        `Budget allocation chart for ${topic} implementation, professional pie chart with detailed breakdowns`
      ]
    },

    report: {
      content: `You are a senior research analyst creating a COMPLETE, FULLY WRITTEN research report about "${topic}" in the "${category}" category.

CRITICAL: Generate the ENTIRE research document with FULL content - not an outline or template. Write every single word, paragraph, data point, and analysis in complete detail.

${baseCompanyInfo}

Generate a complete HTML research document with the following structure. Write EVERY section in full detail with actual content, data, and analysis (MINIMUM 12000 words total):

1. Executive Summary (800+ words) - Write a complete executive summary with key findings, insights, and strategic recommendations
2. Market Analysis & Trends (2500+ words) - Provide detailed market analysis with actual data, trends, growth rates, and market dynamics
3. Industry Survey Results (2000+ words) - Present comprehensive survey data with tables, percentages, and detailed analysis of findings
4. Competitive Landscape (1500+ words) - Analyze competitors with market share data, strengths/weaknesses, and positioning
5. Technology Deep Dive (3000+ words) - Provide in-depth technical analysis with specifications, capabilities, and implementation details
6. Implementation Case Studies (2500+ words) - Detail specific real-world implementations with data, results, and lessons learned
7. Future Predictions & Recommendations (1500+ words) - Offer detailed predictions with supporting analysis and actionable recommendations
8. Methodology & Data Sources (700+ words) - Explain research methods, data collection, and provide citations

REQUIREMENTS:
- Write COMPLETE content with actual data and analysis - no placeholders
- Include specific statistics, percentages, and numerical data
- Add real hyperlinks to credible sources and research
- Create detailed tables and data presentations
- Use professional research language and academic tone
- Include proper citations and references
- Format as complete HTML with professional styling
- Make every section substantive with real insights

START WRITING THE COMPLETE RESEARCH REPORT NOW:`,

      images: [
        `Market trend analysis chart for ${topic} with multiple data lines and projections, professional business style`,
        `Industry survey results infographic for ${topic} with percentages and statistics, clean modern design`,
        `Competitive analysis radar chart for ${topic} solutions, professional visualization`,
        `Technology adoption timeline for ${topic} showing evolution and predictions, professional chart design`
      ]
    },

    checklist: {
      content: `You are a process management expert creating a COMPLETE, FULLY WRITTEN checklist for "${topic}" in the "${category}" category.

CRITICAL: Generate the ENTIRE checklist with FULL content - not an outline. Write every checklist item, description, and instruction completely.

${baseCompanyInfo}

Generate a complete HTML checklist document with the following structure. Write EVERY section in full detail with actual content (MINIMUM 4000 words total):

1. Checklist Overview & Usage Instructions (500+ words) - Write complete usage instructions and methodology
2. Pre-Implementation Phase (25+ detailed items) - List 25+ specific checklist items with detailed descriptions
3. Planning & Strategy Phase (30+ detailed items) - Provide 30+ specific planning tasks with descriptions
4. Technical Implementation Phase (35+ detailed items) - Detail 35+ technical implementation tasks
5. Testing & Validation Phase (25+ detailed items) - Create 25+ testing and validation checklist items
6. Deployment & Go-Live Phase (20+ detailed items) - List 20+ deployment checklist items
7. Post-Implementation & Optimization (25+ detailed items) - Provide 25+ post-implementation tasks

REQUIREMENTS:
- Write COMPLETE content with actual checklist items - no placeholders
- Include specific, actionable checklist items with detailed descriptions
- Add interactive checkboxes in HTML for each item
- Provide priority levels, time estimates, and responsible parties
- Include success criteria and verification steps for each item
- Add real resource links and references
- Format as complete HTML with professional styling
- Make it immediately actionable for enterprise teams

START WRITING THE COMPLETE CHECKLIST NOW:`,

      images: [
        `Process flow diagram for ${topic} checklist phases, clean professional design with connected steps`,
        `Priority matrix for ${topic} tasks showing importance vs urgency, color-coded professional grid`,
        `Timeline visualization for ${topic} checklist with milestones, Gantt-style professional chart`,
        `Team responsibility matrix for ${topic} showing roles and tasks, organizational chart style`
      ]
    }
  };

  return prompts[resourceType as keyof typeof prompts];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log the request for debugging
    console.log('Resource generator request received:', req.method);
    
    // Check if request has body
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({
        success: false,
        error: 'Method not allowed. Use POST.'
      }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let requestData: ResourceRequest;
    try {
      requestData = await req.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid JSON in request body'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { resourceType, topic, category, includeImages, includeVisualizations } = requestData;

    console.log('Generating resource:', { resourceType, topic, category, includeImages });

    // Validate required fields
    if (!resourceType || !topic || !category) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields: resourceType, topic, category'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get prompts for the resource type
    const prompts = getResourcePrompts(resourceType, topic, category);
    if (!prompts) {
      throw new Error(`Unsupported resource type: ${resourceType}`);
    }

    // Generate main content
    console.log('Generating content with Gemini...');
    console.log('Gemini API Key available:', !!Deno.env.get('GEMINI_API_KEY'));
    
    let content: string;
    try {
      content = await generateContentWithGemini(prompts.content);
      console.log('Content generated successfully, length:', content.length);
    } catch (geminiError) {
      console.error('Gemini generation error:', geminiError);
      return new Response(JSON.stringify({
        success: false,
        error: `Content generation failed: ${geminiError.message}`
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate images if requested
    let generatedImages: string[] = [];
    if (includeImages && prompts.images) {
      console.log('Generating images...');
      for (const imagePrompt of prompts.images) {
        try {
          const imageData = await generateImageWithGemini(imagePrompt);
          generatedImages.push(imageData);
          console.log(`Generated image ${generatedImages.length}/${prompts.images.length}`);
        } catch (error) {
          console.error('Image generation failed:', error);
          // Continue without this image
        }
      }
    }

    // Create final HTML content with embedded images
    let finalHtml = content;
    
    if (generatedImages.length > 0) {
      // Insert images as base64 data URLs at strategic points
      generatedImages.forEach((imageData, index) => {
        const imageTag = `
<div class="image-container" style="margin: 30px 0; text-align: center;">
  <img src="data:image/jpeg;base64,${imageData}" 
       alt="Generated visualization ${index + 1} for ${topic}" 
       style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.15); border: 1px solid #e0e0e0;" />
  <p style="margin-top: 10px; font-size: 14px; color: #666; font-style: italic;">
    Figure ${index + 1}: ${topic} - Generated Visualization
  </p>
</div>`;
        
        // Insert images after headers for better distribution
        const headers = finalHtml.match(/<h[2-4][^>]*>.*?<\/h[2-4]>/g);
        if (headers && headers.length > 0) {
          const headerRegex = new RegExp(`(<h[2-4][^>]*>.*?<\/h[2-4]>)`, 'g');
          let headerCount = 0;
          finalHtml = finalHtml.replace(headerRegex, (match) => {
            headerCount++;
            if (headerCount === (index + 1) * Math.ceil(headers.length / generatedImages.length)) {
              return match + imageTag;
            }
            return match;
          });
        } else {
          // If no headers are found, insert the image at the beginning of the content
          finalHtml = imageTag + finalHtml;
        }
      });
    }

    // Create file name for reference
    const fileName = `${topic.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${resourceType}`;
    const categoryDir = `${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}s`;
    const filePath = `resources/${categoryDir}/${fileName}.html`;

    console.log(`Resource generated: ${filePath}`);

    // Log to Supabase (optional, don't fail if this doesn't work)
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        await supabase.from('resource_generation_logs').insert({
          resource_type: resourceType,
          topic,
          category,
          file_path: filePath,
          generated_at: new Date().toISOString(),
          images_count: generatedImages.length,
          content_length: content.length
        });
      }
    } catch (logError) {
      console.error('Logging error (non-critical):', logError);
    }

    return new Response(JSON.stringify({
      success: true,
      title: topic,
      resourceType,
      category,
      filePath: filePath,
      content: finalHtml,
      imagesGenerated: generatedImages.length,
      contentLength: finalHtml.length,
      message: `Resource "${topic}" generated successfully with ${generatedImages.length} images`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Resource generation error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      details: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
