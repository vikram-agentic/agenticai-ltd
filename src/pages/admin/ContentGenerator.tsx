import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import RealTimeStatus from '@/components/ui/real-time-status';
import { 
  Brain,
  Sparkles,
  PenTool,
  Search,
  Image,
  RotateCcw,
  CheckCircle,
  Eye,
  Save,
  Trash2,
  Copy,
  Wand2,
  Upload,
  FileText
} from 'lucide-react';

interface GenerationForm {
  contentType: string;
  targetKeywords: string;
  customInstructions: string;
  contentLength: string;
  seoFocus: boolean;
  includeImages: boolean;
  brandAwareness: boolean;
}

interface GenerationStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'skipped';
  progress: number;
}

interface SEOGenerationForm {
  topic: string;
  targetKeywords: string;
  contentType: string;
  tone: string;
}

interface GeneratedSEO {
  titles: string[];
  metaDescriptions: string[];
  selectedTitle: string;
  selectedMeta: string;
}

const ContentGenerator = () => {
  const { toast } = useToast();
  
  // Content Generation States
  const [generationForm, setGenerationForm] = useState<GenerationForm>({
    contentType: 'blog',
    targetKeywords: '',
    customInstructions: '',
    contentLength: '3000+',
    seoFocus: true,
    includeImages: true,
    brandAwareness: true
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([
    { id: 'research', name: 'Keyword Research', status: 'pending', progress: 0 },
    { id: 'serp', name: 'SERP Analysis', status: 'pending', progress: 0 },
    { id: 'content', name: 'Content Generation', status: 'pending', progress: 0 },
    { id: 'images', name: 'Image Generation', status: 'pending', progress: 0 }
  ]);

  // SEO Generator States
  const [seoForm, setSeoForm] = useState<SEOGenerationForm>({
    topic: '',
    targetKeywords: '',
    contentType: 'blog',
    tone: 'professional'
  });

  const [generatedSEO, setGeneratedSEO] = useState<GeneratedSEO>({
    titles: [],
    metaDescriptions: [],
    selectedTitle: '',
    selectedMeta: ''
  });

  const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);
  const [generationHistory, setGenerationHistory] = useState([]);

  useEffect(() => {
    loadGenerationHistory();
  }, []);

  const loadGenerationHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('generated_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setGenerationHistory(data || []);
    } catch (error) {
      console.error('Error loading generation history:', error);
    }
  };

  const updateGenerationStep = (stepId: string, status: 'pending' | 'processing' | 'completed' | 'failed' | 'skipped', progress: number) => {
    setGenerationSteps(steps => 
      steps.map(step => 
        step.id === stepId 
          ? { ...step, status, progress } 
          : step
      )
    );
  };

  const generateSEOContent = async () => {
    if (!seoForm.topic.trim()) {
      toast({
        title: "Missing Topic",
        description: "Please enter a topic for SEO generation",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingSEO(true);

    try {
      const { data, error } = await supabase.functions.invoke('seo-generator-agent', {
        body: {
          topic: seoForm.topic,
          targetKeywords: seoForm.targetKeywords.split(',').map(k => k.trim()),
          contentType: seoForm.contentType,
          tone: seoForm.tone
        }
      });

      if (error) throw error;

      if (data.success) {
        setGeneratedSEO({
          titles: data.titles || [],
          metaDescriptions: data.metaDescriptions || [],
          selectedTitle: data.titles?.[0] || '',
          selectedMeta: data.metaDescriptions?.[0] || ''
        });

        toast({
          title: "SEO Content Generated",
          description: "Titles and meta descriptions have been generated successfully",
        });
      } else {
        throw new Error(data.error || 'SEO generation failed');
      }

    } catch (error: any) {
      console.error('SEO generation error:', error);
      toast({
        title: "SEO Generation Failed",
        description: error.message || 'An unexpected error occurred',
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSEO(false);
    }
  };

  const startAIGeneration = async () => {
    if (!generationForm.targetKeywords.trim()) {
      toast({
        title: "Missing Keywords",
        description: "Please enter target keywords for content generation",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setCurrentStep('Starting AI content generation...');
    
    // Reset generation steps
    setGenerationSteps(steps => steps.map(step => ({ ...step, status: 'pending', progress: 0 })));

    try {
      // Step 1: Create content request
      setCurrentStep('Creating content request...');
      setGenerationProgress(5);

      const { data: requestData, error: requestError } = await supabase
        .from('content_requests')
        .insert({
          title: `AI Generated ${generationForm.contentType}`,
          content_type: generationForm.contentType,
          target_keywords: generationForm.targetKeywords.split(',').map(k => k.trim()),
          status: 'processing',
          progress: 0
        })
        .select()
        .single();

      if (requestError) throw requestError;

      // Step 2: Keyword Research
      setCurrentStep('🔍 Researching keywords...');
      setGenerationProgress(15);
      updateGenerationStep('research', 'processing', 25);

      const { data: keywordData, error: keywordError } = await supabase.functions.invoke('keyword-research-agent', {
        body: {
          requestId: requestData.id,
          seedKeyword: generationForm.targetKeywords.split(',')[0].trim()
        }
      });

      if (keywordError || !keywordData?.success) {
        updateGenerationStep('research', 'failed', 0);
        throw new Error('Keyword research failed');
      }
      
      updateGenerationStep('research', 'completed', 100);

      // Step 3: SERP Analysis
      setCurrentStep('📊 Analyzing search results...');
      setGenerationProgress(35);
      updateGenerationStep('serp', 'processing', 50);

      const { data: serpData, error: serpError } = await supabase.functions.invoke('serp-analysis-agent', {
        body: {
          requestId: requestData.id,
          targetKeyword: keywordData.primaryKeyword || generationForm.targetKeywords.split(',')[0].trim()
        }
      });

      if (serpError || !serpData?.success) {
        console.warn('SERP analysis failed, continuing without SERP data:', serpError?.message);
        // Don't fail the entire process, just log and continue
        updateGenerationStep('serp', 'completed', 100);
      } else {
        updateGenerationStep('serp', 'completed', 100);
      }

      // Step 4: Content Generation
      setCurrentStep('✍️ Generating content with Gemini AI...');
      setGenerationProgress(60);
      updateGenerationStep('content', 'processing', 25);

      const { data: contentData, error: contentError } = await supabase.functions.invoke('content-generator-agent', {
        body: {
          requestId: requestData.id,
          contentType: generationForm.contentType,
          targetKeywords: keywordData.keywords || generationForm.targetKeywords.split(',').map(k => k.trim()),
          customInstructions: generationForm.customInstructions,
          contentLength: generationForm.contentLength,
          seoFocus: generationForm.seoFocus,
          brandAwareness: generationForm.brandAwareness
        }
      });

      if (contentError || !contentData?.success) {
        updateGenerationStep('content', 'failed', 0);
        throw new Error('Content generation failed');
      }
      
      updateGenerationStep('content', 'completed', 100);

      // Step 5: Image Generation (if enabled)
      if (generationForm.includeImages) {
        setCurrentStep('🎨 Generating images with BFL Flux...');
        setGenerationProgress(85);
        updateGenerationStep('images', 'processing', 50);

        try {
          await supabase.functions.invoke('image-generator-agent', {
            body: {
              requestId: requestData.id,
              content: contentData.contentData.content,
              title: contentData.contentData.title
            }
          });
          updateGenerationStep('images', 'completed', 100);
        } catch (imageError) {
          console.warn('Image generation failed:', imageError);
          updateGenerationStep('images', 'failed', 0);
        }
      } else {
        updateGenerationStep('images', 'skipped', 100);
      }

      setCurrentStep('✅ Generation completed successfully!');
      setGenerationProgress(100);

      toast({
        title: "Content Generated Successfully",
        description: "Your AI-powered content is ready!",
      });

      // Refresh generation history
      await loadGenerationHistory();

    } catch (error: any) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: error.message || 'An unexpected error occurred',
        variant: "destructive",
      });
      
      // Mark current step as failed
      const currentStepIndex = generationSteps.findIndex(step => step.status === 'processing');
      if (currentStepIndex !== -1) {
        updateGenerationStep(generationSteps[currentStepIndex].id, 'failed', 0);
      }
    } finally {
      setIsGenerating(false);
      setTimeout(() => {
        setGenerationProgress(0);
        setCurrentStep('');
        setGenerationSteps(steps => steps.map(step => ({ ...step, status: 'pending', progress: 0 })));
      }, 5000);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Text has been copied to your clipboard",
    });
  };

  const handlePublishContent = async (contentId: string) => {
    try {
      await supabase
        .from('generated_content')
        .update({ 
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', contentId);

      toast({
        title: "Content Published",
        description: "Content has been published successfully",
      });

      loadGenerationHistory();
    } catch (error: any) {
      toast({
        title: "Publish Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSaveDraft = async (contentId: string) => {
    try {
      await supabase
        .from('generated_content')
        .update({ 
          status: 'draft',
          published_at: null
        })
        .eq('id', contentId);

      toast({
        title: "Saved as Draft",
        description: "Content has been saved as draft",
      });

      loadGenerationHistory();
    } catch (error: any) {
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CSV Article Generator</h1>
          <p className="text-gray-600">AI-powered content creation with advanced SEO optimization and image generation</p>
        </div>
      </div>

      <Tabs defaultValue="csv-generator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
          <TabsTrigger value="generator" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Brain className="w-4 h-4 mr-2" />
            Content Generator
          </TabsTrigger>
          <TabsTrigger value="csv-generator" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Upload className="w-4 h-4 mr-2" />
            CSV Articles
          </TabsTrigger>
          <TabsTrigger value="seo-tools" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Search className="w-4 h-4 mr-2" />
            SEO Tools
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Eye className="w-4 h-4 mr-2" />
            Generation History
          </TabsTrigger>
        </TabsList>

        {/* Content Generator Tab */}
        <TabsContent value="generator" className="space-y-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
                AI Content Generator
              </CardTitle>
              <CardDescription className="text-gray-600">
                Generate comprehensive, SEO-optimized content with advanced AI research and analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Content Type</Label>
                  <Select 
                    value={generationForm.contentType} 
                    onValueChange={(value) => setGenerationForm({...generationForm, contentType: value})}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blog">Blog Post</SelectItem>
                      <SelectItem value="page">Landing Page</SelectItem>
                      <SelectItem value="service">Service Page</SelectItem>
                      <SelectItem value="resource">Resource Guide</SelectItem>
                      <SelectItem value="case-study">Case Study</SelectItem>
                      <SelectItem value="whitepaper">Whitepaper</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Content Length</Label>
                  <Select 
                    value={generationForm.contentLength} 
                    onValueChange={(value) => setGenerationForm({...generationForm, contentLength: value})}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1500+">1500+ words</SelectItem>
                      <SelectItem value="2500+">2500+ words</SelectItem>
                      <SelectItem value="3000+">3000+ words</SelectItem>
                      <SelectItem value="5000+">5000+ words</SelectItem>
                      <SelectItem value="10000+">10000+ words</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Target Keywords (comma-separated)</Label>
                <Input
                  value={generationForm.targetKeywords}
                  onChange={(e) => setGenerationForm({...generationForm, targetKeywords: e.target.value})}
                  className="border-gray-300"
                  placeholder="AI automation, business efficiency, machine learning, artificial intelligence"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Custom Instructions (optional)</Label>
                <Textarea
                  value={generationForm.customInstructions}
                  onChange={(e) => setGenerationForm({...generationForm, customInstructions: e.target.value})}
                  className="border-gray-300 min-h-[100px]"
                  placeholder="Add specific requirements, tone preferences, brand guidelines, target audience details, or any other custom instructions..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="seoFocus"
                    checked={generationForm.seoFocus}
                    onChange={(e) => setGenerationForm({...generationForm, seoFocus: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="seoFocus" className="text-gray-700">SEO Optimized</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeImages"
                    checked={generationForm.includeImages}
                    onChange={(e) => setGenerationForm({...generationForm, includeImages: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="includeImages" className="text-gray-700">Include Images</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="brandAwareness"
                    checked={generationForm.brandAwareness}
                    onChange={(e) => setGenerationForm({...generationForm, brandAwareness: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="brandAwareness" className="text-gray-700">Brand Awareness</Label>
                </div>
              </div>

              <Button 
                onClick={startAIGeneration}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                {isGenerating ? (
                  <>
                    <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                    Generating Content...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>

              {/* Real-time Generation Status */}
              {(isGenerating || generationSteps.some(step => step.status !== 'pending')) && (
                <RealTimeStatus
                  isGenerating={isGenerating}
                  currentStep={currentStep}
                  progress={generationProgress}
                  steps={generationSteps}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CSV Article Generator Tab */}
        <TabsContent value="csv-generator" className="space-y-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Upload className="w-5 h-5 mr-2 text-blue-500" />
                CSV Article Generator
              </CardTitle>
              <CardDescription className="text-gray-600">
                Generate multiple articles from your CSV file using BFL image generation and Gemini content creation
              </CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tools Tab */}
        <TabsContent value="seo-tools" className="space-y-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Wand2 className="w-5 h-5 mr-2 text-blue-500" />
                SEO Title & Meta Description Generator
              </CardTitle>
              <CardDescription className="text-gray-600">
                Generate optimized titles and meta descriptions using Gemini AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Topic/Subject</Label>
                  <Input
                    value={seoForm.topic}
                    onChange={(e) => setSeoForm({...seoForm, topic: e.target.value})}
                    className="border-gray-300"
                    placeholder="AI automation solutions for businesses"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Content Type</Label>
                  <Select 
                    value={seoForm.contentType} 
                    onValueChange={(value) => setSeoForm({...seoForm, contentType: value})}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blog">Blog Post</SelectItem>
                      <SelectItem value="page">Landing Page</SelectItem>
                      <SelectItem value="service">Service Page</SelectItem>
                      <SelectItem value="product">Product Page</SelectItem>
                      <SelectItem value="category">Category Page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Target Keywords</Label>
                  <Input
                    value={seoForm.targetKeywords}
                    onChange={(e) => setSeoForm({...seoForm, targetKeywords: e.target.value})}
                    className="border-gray-300"
                    placeholder="AI automation, business efficiency"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Tone</Label>
                  <Select 
                    value={seoForm.tone} 
                    onValueChange={(value) => setSeoForm({...seoForm, tone: value})}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="authoritative">Authoritative</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={generateSEOContent}
                disabled={isGeneratingSEO}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
              >
                {isGeneratingSEO ? (
                  <>
                    <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                    Generating SEO Content...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Generate SEO Content
                  </>
                )}
              </Button>

              {/* Generated SEO Content */}
              {(generatedSEO.titles.length > 0 || generatedSEO.metaDescriptions.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Titles */}
                  <div className="space-y-3">
                    <h3 className="text-gray-900 font-medium">Generated Titles</h3>
                    <div className="space-y-2">
                      {generatedSEO.titles.map((title, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-start justify-between">
                            <p className="text-gray-800 text-sm flex-1">{title}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(title)}
                              className="ml-2 h-6 w-6 p-0 hover:bg-gray-200"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {title.length} characters
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Meta Descriptions */}
                  <div className="space-y-3">
                    <h3 className="text-gray-900 font-medium">Generated Meta Descriptions</h3>
                    <div className="space-y-2">
                      {generatedSEO.metaDescriptions.map((meta, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-start justify-between">
                            <p className="text-gray-800 text-sm flex-1">{meta}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(meta)}
                              className="ml-2 h-6 w-6 p-0 hover:bg-gray-200"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {meta.length} characters
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Generation History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Generation History</CardTitle>
              <CardDescription className="text-gray-600">
                View and manage all generated content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generationHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No content generated yet</p>
                  </div>
                ) : (
                  generationHistory.map((content: any) => (
                    <div key={content.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                      <div className="flex-1">
                        <h3 className="text-gray-900 font-medium">{content.title}</h3>
                        <p className="text-gray-600 text-sm">{content.categories?.join(', ') || 'Uncategorized'}</p>
                        <div className="flex items-center space-x-3 mt-2">
                          <Badge variant={content.status === 'published' ? 'default' : 'secondary'}>
                            {content.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(content.created_at).toLocaleDateString()}
                          </span>
                          {content.seo_tags && (
                            <span className="text-xs text-gray-500">
                              Keywords: {content.seo_tags.slice(0, 3).join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-400 text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {content.status !== 'published' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePublishContent(content.id)}
                            className="border-green-400 text-green-600 hover:bg-green-50"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSaveDraft(content.id)}
                            className="border-yellow-400 text-yellow-600 hover:bg-yellow-50"
                          >
                            <Save className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-400 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentGenerator;
