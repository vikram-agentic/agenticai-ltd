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
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import RealTimeStatus from '@/components/ui/real-time-status';
import ArticleAnalyticsComponent from '@/components/ui/article-analytics';
import BatchGeneratorComponent from '@/components/ui/batch-generator';
import { 
  Brain,
  Sparkles,
  Search,
  RotateCcw,
  CheckCircle,
  Eye,
  Save,
  Trash2,
  Copy,
  Wand2,
  Upload,
  FileText,
  BarChart3,
  Target,
  TrendingUp,
  Lightbulb,
  Settings,
  Download,
  Globe,
  Clock,
  Star,
  Zap,
  FileCheck,
  AlertCircle,
  Gauge,
  PenTool
} from 'lucide-react';

interface GenerationForm {
  contentType: string;
  targetKeywords: string;
  customInstructions: string;
  contentLength: string;
  seoFocus: boolean;
  includeImages: boolean;
  brandAwareness: boolean;
  targetAudience: string;
  writingStyle: string;
  includePerplexityResearch: boolean;
  competitorAnalysis: boolean;
  readabilityTarget: string;
  includeCallToActions: boolean;
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

interface ArticleAnalytics {
  wordCount: number;
  readabilityScore: number;
  seoScore: number;
  keywordDensity: Record<string, number>;
  readingTime: number;
  sentenceCount: number;
  paragraphCount: number;
  headingStructure: Record<string, number>;
}

interface CompetitorData {
  domain: string;
  title: string;
  contentLength: number;
  headingStructure: string[];
  keywords: string[];
  strengths: string[];
  weaknesses: string[];
}

const EnhancedContentGenerator = () => {
  const { toast } = useToast();
  
  // Content Generation States
  const [generationForm, setGenerationForm] = useState<GenerationForm>({
    contentType: 'blog',
    targetKeywords: '',
    customInstructions: '',
    contentLength: '3000+',
    seoFocus: true,
    includeImages: true,
    brandAwareness: true,
    targetAudience: 'business-professionals',
    writingStyle: 'professional',
    includePerplexityResearch: true,
    competitorAnalysis: true,
    readabilityTarget: 'grade-8',
    includeCallToActions: true
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([
    { id: 'research', name: 'Keyword Research', status: 'pending', progress: 0 },
    { id: 'perplexity', name: 'Perplexity Research', status: 'pending', progress: 0 },
    { id: 'serp', name: 'SERP Analysis', status: 'pending', progress: 0 },
    { id: 'competitor', name: 'Competitor Analysis', status: 'pending', progress: 0 },
    { id: 'outline', name: 'Article Outline', status: 'pending', progress: 0 },
    { id: 'content', name: 'Content Generation', status: 'pending', progress: 0 },
    { id: 'optimization', name: 'SEO Optimization', status: 'pending', progress: 0 },
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
  
  // Article Analytics States
  const [articleAnalytics, setArticleAnalytics] = useState<ArticleAnalytics | null>(null);
  const [competitorData, setCompetitorData] = useState<CompetitorData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisContent, setAnalysisContent] = useState('');
  const [analysisKeywords, setAnalysisKeywords] = useState('');

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

  const startAdvancedGeneration = async () => {
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
    setCurrentStep('Starting advanced AI content generation...');
    
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
      setGenerationProgress(10);
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

      // Step 2.5: Perplexity Research (if enabled)
      if (generationForm.includePerplexityResearch) {
        setCurrentStep('🧠 Conducting Perplexity research...');
        setGenerationProgress(18);
        updateGenerationStep('perplexity', 'processing', 50);

        try {
          const { data: perplexityData, error: perplexityError } = await supabase.functions.invoke('advanced-article-generator', {
            body: {
              action: 'perplexity_research',
              requestId: requestData.id,
              topic: generationForm.targetKeywords.split(',')[0].trim()
            }
          });

          if (perplexityError) {
            console.warn('Perplexity research failed:', perplexityError);
            updateGenerationStep('perplexity', 'failed', 0);
          } else {
            updateGenerationStep('perplexity', 'completed', 100);
          }
        } catch (error) {
          console.warn('Perplexity research error:', error);
          updateGenerationStep('perplexity', 'failed', 0);
        }
      } else {
        updateGenerationStep('perplexity', 'skipped', 100);
      }

      // Step 3: SERP Analysis
      setCurrentStep('📊 Analyzing search results...');
      setGenerationProgress(25);
      updateGenerationStep('serp', 'processing', 50);

      const { data: serpData, error: serpError } = await supabase.functions.invoke('serp-analysis-agent', {
        body: {
          requestId: requestData.id,
          targetKeyword: keywordData.primaryKeyword || generationForm.targetKeywords.split(',')[0].trim()
        }
      });

      if (serpError || !serpData?.success) {
        console.warn('SERP analysis failed, continuing without SERP data:', serpError?.message);
        updateGenerationStep('serp', 'completed', 100);
      } else {
        updateGenerationStep('serp', 'completed', 100);
      }

      // Step 4: Competitor Analysis (if enabled)
      if (generationForm.competitorAnalysis) {
        setCurrentStep('🎯 Analyzing competitors...');
        setGenerationProgress(35);
        updateGenerationStep('competitor', 'processing', 50);

        try {
          const { data: competitorAnalysisData, error: competitorError } = await supabase.functions.invoke('advanced-article-generator', {
            body: {
              action: 'competitor_analysis',
              requestId: requestData.id,
              keyword: keywordData.primaryKeyword || generationForm.targetKeywords.split(',')[0].trim()
            }
          });

          if (competitorError) {
            console.warn('Competitor analysis failed:', competitorError);
            updateGenerationStep('competitor', 'failed', 0);
          } else {
            updateGenerationStep('competitor', 'completed', 100);
            if (competitorAnalysisData.competitors) {
              setCompetitorData(competitorAnalysisData.competitors);
            }
          }
        } catch (error) {
          console.warn('Competitor analysis error:', error);
          updateGenerationStep('competitor', 'failed', 0);
        }
      } else {
        updateGenerationStep('competitor', 'skipped', 100);
      }

      // Step 5: Article Outline Generation
      setCurrentStep('📝 Creating article outline...');
      setGenerationProgress(45);
      updateGenerationStep('outline', 'processing', 50);

      try {
        const { data: outlineData, error: outlineError } = await supabase.functions.invoke('advanced-article-generator', {
          body: {
            action: 'generate_outline',
            requestId: requestData.id,
            keywords: keywordData.keywords || generationForm.targetKeywords.split(',').map(k => k.trim()),
            competitorData: competitorData,
            contentType: generationForm.contentType,
            targetAudience: generationForm.targetAudience
          }
        });

        if (outlineError) {
          console.warn('Outline generation failed:', outlineError);
          updateGenerationStep('outline', 'failed', 0);
        } else {
          updateGenerationStep('outline', 'completed', 100);
        }
      } catch (error) {
        console.warn('Outline generation error:', error);
        updateGenerationStep('outline', 'failed', 0);
      }

      // Step 6: Content Generation
      setCurrentStep('✍️ Generating content with Minimax AI...');
      setGenerationProgress(60);
      updateGenerationStep('content', 'processing', 25);

      const { data: contentData, error: contentError } = await supabase.functions.invoke('advanced-article-generator', {
        body: {
          action: 'generate_article',
          requestId: requestData.id,
          contentType: generationForm.contentType,
          targetKeywords: keywordData.keywords || generationForm.targetKeywords.split(',').map(k => k.trim()),
          customInstructions: generationForm.customInstructions,
          contentLength: generationForm.contentLength,
          seoFocus: generationForm.seoFocus,
          brandAwareness: generationForm.brandAwareness,
          targetAudience: generationForm.targetAudience,
          writingStyle: generationForm.writingStyle,
          readabilityTarget: generationForm.readabilityTarget,
          includeCallToActions: generationForm.includeCallToActions,
          competitorData: competitorData
        }
      });

      if (contentError || !contentData?.success) {
        updateGenerationStep('content', 'failed', 0);
        throw new Error('Content generation failed');
      }
      
      updateGenerationStep('content', 'completed', 100);

      // Step 7: SEO Optimization
      setCurrentStep('🎯 Optimizing for SEO...');
      setGenerationProgress(80);
      updateGenerationStep('optimization', 'processing', 50);

      try {
        const { data: optimizationData, error: optimizationError } = await supabase.functions.invoke('advanced-article-generator', {
          body: {
            action: 'seo_optimization',
            requestId: requestData.id,
            content: contentData.contentData.content,
            targetKeywords: keywordData.keywords || generationForm.targetKeywords.split(',').map(k => k.trim())
          }
        });

        if (optimizationError) {
          console.warn('SEO optimization failed:', optimizationError);
          updateGenerationStep('optimization', 'failed', 0);
        } else {
          updateGenerationStep('optimization', 'completed', 100);
          if (optimizationData.analytics) {
            setArticleAnalytics(optimizationData.analytics);
          }
        }
      } catch (error) {
        console.warn('SEO optimization error:', error);
        updateGenerationStep('optimization', 'failed', 0);
      }

      // Step 8: Image Generation (if enabled)
      if (generationForm.includeImages) {
        setCurrentStep('🎨 Generating images with advanced AI...');
        setGenerationProgress(90);
        updateGenerationStep('images', 'processing', 50);

        try {
          await supabase.functions.invoke('advanced-article-generator', {
            body: {
              action: 'generate_images',
              requestId: requestData.id,
              content: contentData.contentData.content,
              title: contentData.contentData.title,
              imageCount: 5
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
        title: "Advanced Article Generated Successfully",
        description: "Your rank-1 quality content is ready!",
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

  const analyzeContent = async () => {
    if (!analysisContent.trim() || !analysisKeywords.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both content and keywords for analysis",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('advanced-article-generator', {
        body: {
          action: 'seo_optimization',
          requestId: 'analysis_' + Date.now(),
          content: analysisContent,
          targetKeywords: analysisKeywords.split(',').map(k => k.trim())
        }
      });

      if (error) throw error;

      if (data.analytics) {
        setArticleAnalytics(data.analytics);
        toast({
          title: "Content Analysis Complete",
          description: "Detailed analytics and recommendations are ready",
        });
      }

    } catch (error: any) {
      console.error('Content analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || 'An unexpected error occurred',
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
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
          <h1 className="text-3xl font-bold text-gray-900">Advanced Article Generator</h1>
          <p className="text-gray-600">Professional AI-powered content creation with comprehensive SEO optimization, competitor analysis, and quality scoring</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
            <Zap className="w-3 h-3 mr-1" />
            Minimax AI
          </Badge>
          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
            <Globe className="w-3 h-3 mr-1" />
            Perplexity Research
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-white border border-gray-200">
          <TabsTrigger value="generator" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Brain className="w-4 h-4 mr-2" />
            Article Generator
          </TabsTrigger>
          <TabsTrigger value="batch-generator" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Upload className="w-4 h-4 mr-2" />
            Batch Generator
          </TabsTrigger>
          <TabsTrigger value="optimizer" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Target className="w-4 h-4 mr-2" />
            Content Optimizer
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="seo-tools" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Search className="w-4 h-4 mr-2" />
            SEO Tools
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Eye className="w-4 h-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        {/* Advanced Article Generator Tab */}
        <TabsContent value="generator" className="space-y-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
                Advanced Article Generator
              </CardTitle>
              <CardDescription className="text-gray-600">
                Generate rank-1 quality articles with Minimax AI, Perplexity research, competitor analysis, and comprehensive SEO optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <SelectItem value="pillar">Pillar Content</SelectItem>
                      <SelectItem value="comparison">Comparison Article</SelectItem>
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

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Target Audience</Label>
                  <Select 
                    value={generationForm.targetAudience} 
                    onValueChange={(value) => setGenerationForm({...generationForm, targetAudience: value})}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business-professionals">Business Professionals</SelectItem>
                      <SelectItem value="technical-experts">Technical Experts</SelectItem>
                      <SelectItem value="decision-makers">Decision Makers</SelectItem>
                      <SelectItem value="general-audience">General Audience</SelectItem>
                      <SelectItem value="beginners">Beginners</SelectItem>
                      <SelectItem value="advanced-users">Advanced Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Writing Style</Label>
                  <Select 
                    value={generationForm.writingStyle} 
                    onValueChange={(value) => setGenerationForm({...generationForm, writingStyle: value})}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="conversational">Conversational</SelectItem>
                      <SelectItem value="authoritative">Authoritative</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="persuasive">Persuasive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Readability Target</Label>
                  <Select 
                    value={generationForm.readabilityTarget} 
                    onValueChange={(value) => setGenerationForm({...generationForm, readabilityTarget: value})}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grade-6">Grade 6 (Simple)</SelectItem>
                      <SelectItem value="grade-8">Grade 8 (Standard)</SelectItem>
                      <SelectItem value="grade-10">Grade 10 (Advanced)</SelectItem>
                      <SelectItem value="grade-12">Grade 12 (Professional)</SelectItem>
                      <SelectItem value="college">College Level</SelectItem>
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

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Advanced Options</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="seoFocus" className="text-gray-700 text-sm">SEO Optimization</Label>
                    <Switch
                      id="seoFocus"
                      checked={generationForm.seoFocus}
                      onCheckedChange={(checked) => setGenerationForm({...generationForm, seoFocus: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="includeImages" className="text-gray-700 text-sm">Include Images</Label>
                    <Switch
                      id="includeImages"
                      checked={generationForm.includeImages}
                      onCheckedChange={(checked) => setGenerationForm({...generationForm, includeImages: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="brandAwareness" className="text-gray-700 text-sm">Brand Mentions</Label>
                    <Switch
                      id="brandAwareness"
                      checked={generationForm.brandAwareness}
                      onCheckedChange={(checked) => setGenerationForm({...generationForm, brandAwareness: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="includeCallToActions" className="text-gray-700 text-sm">Call-to-Actions</Label>
                    <Switch
                      id="includeCallToActions"
                      checked={generationForm.includeCallToActions}
                      onCheckedChange={(checked) => setGenerationForm({...generationForm, includeCallToActions: checked})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="includePerplexityResearch" className="text-gray-700 text-sm">Perplexity Research</Label>
                    <Switch
                      id="includePerplexityResearch"
                      checked={generationForm.includePerplexityResearch}
                      onCheckedChange={(checked) => setGenerationForm({...generationForm, includePerplexityResearch: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="competitorAnalysis" className="text-gray-700 text-sm">Competitor Analysis</Label>
                    <Switch
                      id="competitorAnalysis"
                      checked={generationForm.competitorAnalysis}
                      onCheckedChange={(checked) => setGenerationForm({...generationForm, competitorAnalysis: checked})}
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={startAdvancedGeneration}
                disabled={isGenerating || !generationForm.targetKeywords.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 h-12 text-lg font-semibold"
              >
                {isGenerating ? (
                  <>
                    <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
                    Generating Professional Article...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate High-Ranking Article
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

        {/* Batch Generator Tab */}
        <TabsContent value="batch-generator" className="space-y-6">
          <BatchGeneratorComponent />
        </TabsContent>

        {/* Content Optimizer Tab */}
        <TabsContent value="optimizer" className="space-y-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Target className="w-5 h-5 mr-2 text-blue-500" />
                Content Optimizer
              </CardTitle>
              <CardDescription className="text-gray-600">
                Analyze and optimize existing content for better SEO performance and readability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Content to Optimize</Label>
                  <Textarea
                    value={analysisContent}
                    onChange={(e) => setAnalysisContent(e.target.value)}
                    placeholder="Paste your content here to get detailed analysis and optimization suggestions..."
                    className="min-h-[200px] border-gray-300"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Target Keywords</Label>
                    <Input
                      value={analysisKeywords}
                      onChange={(e) => setAnalysisKeywords(e.target.value)}
                      placeholder="Enter keywords to optimize for..."
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Content Type</Label>
                    <Select defaultValue="blog">
                      <SelectTrigger className="border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blog">Blog Post</SelectItem>
                        <SelectItem value="page">Landing Page</SelectItem>
                        <SelectItem value="product">Product Page</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button 
                  onClick={analyzeContent}
                  disabled={isAnalyzing || !analysisContent.trim() || !analysisKeywords.trim()}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  {isAnalyzing ? (
                    <>
                      <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing Content...
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 mr-2" />
                      Analyze & Optimize
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {articleAnalytics ? (
            <ArticleAnalyticsComponent 
              analytics={articleAnalytics} 
              competitorData={competitorData}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Available</h3>
                <p className="text-gray-600">Generate an article or analyze content to see detailed analytics and performance metrics.</p>
              </CardContent>
            </Card>
          )}
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
                Generate optimized titles and meta descriptions using advanced AI
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

export default EnhancedContentGenerator;