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
  PenTool,
  Rocket,
  Database,
  Network,
  Shield
} from 'lucide-react';

interface AdvancedGenerationForm {
  seedKeywords: string[];
  industry: string;
  targetAudience: string;
  contentType: string;
  contentLength: string;
  writingStyle: string;
  seoFocus: boolean;
  includeDataForSEO: boolean;
  includeSerpAnalysis: boolean;
  includeCompetitorAnalysis: boolean;
  includePerplexityResearch: boolean;
  includeMinimaxGeneration: boolean;
  includeBFLImages: boolean;
  customInstructions: string;
  readabilityTarget: string;
  includeCallToActions: boolean;
  minSearchVolume: number;
  maxKeywordDifficulty: number;
  competitorDomains: string[];
}

interface GenerationStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'skipped';
  progress: number;
  duration?: number;
  data?: any;
}

interface KeywordAnalytics {
  totalKeywords: number;
  highOpportunityKeywords: number;
  quickWinKeywords: number;
  averageSearchVolume: number;
  averageDifficulty: number;
  competitionLevel: string;
}

interface ArticleMetrics {
  wordCount: number;
  readabilityScore: number;
  seoScore: number;
  keywordDensity: Record<string, number>;
  headingStructure: Record<string, number>;
  contentGaps: string[];
  competitiveAdvantages: string[];
  estimatedRankingPotential: number;
}

const AdvancedArticleGenerator = () => {
  const { toast } = useToast();
  
  // Advanced Generation Form State
  const [generationForm, setGenerationForm] = useState<AdvancedGenerationForm>({
    seedKeywords: [],
    industry: 'AI Consulting',
    targetAudience: 'Enterprise Decision Makers',
    contentType: 'pillar',
    contentLength: '5000+',
    writingStyle: 'authoritative',
    seoFocus: true,
    includeDataForSEO: true,
    includeSerpAnalysis: true,
    includeCompetitorAnalysis: true,
    includePerplexityResearch: true,
    includeMinimaxGeneration: true,
    includeBFLImages: true,
    customInstructions: '',
    readabilityTarget: 'grade-8',
    includeCallToActions: true,
    minSearchVolume: 1000,
    maxKeywordDifficulty: 50,
    competitorDomains: []
  });

  const [seedKeywordInput, setSeedKeywordInput] = useState('');
  const [competitorInput, setCompetitorInput] = useState('');

  // Generation Process State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([
    { 
      id: 'setup', 
      name: 'System Setup', 
      description: 'Initialize generation request and validate parameters',
      status: 'pending', 
      progress: 0 
    },
    { 
      id: 'keyword-research', 
      name: 'DataForSEO Keyword Research', 
      description: 'Comprehensive keyword analysis with real search volume data',
      status: 'pending', 
      progress: 0 
    },
    { 
      id: 'advanced-keyword-analysis', 
      name: 'Advanced Keyword Analysis', 
      description: 'AI-powered keyword expansion and opportunity scoring',
      status: 'pending', 
      progress: 0 
    },
    { 
      id: 'serp-analysis', 
      name: 'SERP Analysis', 
      description: 'Detailed competitor analysis and content gap identification',
      status: 'pending', 
      progress: 0 
    },
    { 
      id: 'perplexity-research', 
      name: 'Perplexity Research', 
      description: 'Real-time market research and trend analysis',
      status: 'pending', 
      progress: 0 
    },
    { 
      id: 'content-strategy', 
      name: 'Content Strategy', 
      description: 'AI-driven content planning and outline generation',
      status: 'pending', 
      progress: 0 
    },
    { 
      id: 'article-generation', 
      name: 'Minimax Article Generation', 
      description: 'High-quality content creation with advanced AI',
      status: 'pending', 
      progress: 0 
    },
    { 
      id: 'seo-optimization', 
      name: 'SEO Optimization', 
      description: 'Content optimization for search engine ranking',
      status: 'pending', 
      progress: 0 
    },
    { 
      id: 'image-generation', 
      name: 'BFL Image Generation', 
      description: 'Professional image creation for article enhancement',
      status: 'pending', 
      progress: 0 
    },
    { 
      id: 'quality-assurance', 
      name: 'Quality Assurance', 
      description: 'Final review and optimization recommendations',
      status: 'pending', 
      progress: 0 
    }
  ]);

  // Analytics State
  const [keywordAnalytics, setKeywordAnalytics] = useState<KeywordAnalytics | null>(null);
  const [articleMetrics, setArticleMetrics] = useState<ArticleMetrics | null>(null);
  const [generationHistory, setGenerationHistory] = useState([]);
  const [estimatedCost, setEstimatedCost] = useState(0);

  useEffect(() => {
    calculateEstimatedCost();
    loadGenerationHistory();
  }, [generationForm]);

  const calculateEstimatedCost = () => {
    let cost = 0;
    if (generationForm.includeDataForSEO) cost += 0.075; // DataForSEO API cost
    if (generationForm.includeSerpAnalysis) cost += 0.05; // SERP analysis
    if (generationForm.includePerplexityResearch) cost += 0.10; // Perplexity research
    if (generationForm.includeMinimaxGeneration) cost += 0.25; // Minimax generation
    if (generationForm.includeBFLImages) cost += 0.20; // BFL image generation
    
    setEstimatedCost(parseFloat(cost.toFixed(2)));
  };

  const loadGenerationHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('article_generation_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        // If table doesn't exist, just set empty history
        if (error.code === '42P01') {
          console.log('Database tables not yet created. Using fallback data.');
          setGenerationHistory([]);
          return;
        }
        throw error;
      }
      setGenerationHistory(data || []);
    } catch (error) {
      console.error('Error loading generation history:', error);
      setGenerationHistory([]);
    }
  };

  const addSeedKeyword = () => {
    if (seedKeywordInput.trim()) {
      setGenerationForm(prev => ({
        ...prev,
        seedKeywords: [...prev.seedKeywords, seedKeywordInput.trim()]
      }));
      setSeedKeywordInput('');
    }
  };

  const removeSeedKeyword = (index: number) => {
    setGenerationForm(prev => ({
      ...prev,
      seedKeywords: prev.seedKeywords.filter((_, i) => i !== index)
    }));
  };

  const addCompetitorDomain = () => {
    if (competitorInput.trim()) {
      setGenerationForm(prev => ({
        ...prev,
        competitorDomains: [...prev.competitorDomains, competitorInput.trim()]
      }));
      setCompetitorInput('');
    }
  };

  const removeCompetitorDomain = (index: number) => {
    setGenerationForm(prev => ({
      ...prev,
      competitorDomains: prev.competitorDomains.filter((_, i) => i !== index)
    }));
  };

  const updateGenerationStep = (stepId: string, status: GenerationStep['status'], progress: number, data?: any) => {
    setGenerationSteps(steps => 
      steps.map(step => 
        step.id === stepId 
          ? { ...step, status, progress, data, duration: status === 'completed' ? Date.now() - (step.duration || Date.now()) : step.duration } 
          : step
      )
    );
  };

  const startAdvancedGeneration = async () => {
    if (generationForm.seedKeywords.length === 0) {
      toast({
        title: "Missing Seed Keywords",
        description: "Please add at least one seed keyword to start generation",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setCurrentStep('Initializing advanced article generation system...');
    
    // Reset all steps
    setGenerationSteps(steps => steps.map(step => ({ ...step, status: 'pending', progress: 0 })));

    try {
      // Step 1: System Setup
      setCurrentStep('🚀 Setting up generation environment...');
      updateGenerationStep('setup', 'processing', 25);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const sessionData = {
        seed_keywords: generationForm.seedKeywords,
        industry: generationForm.industry,
        target_audience: generationForm.targetAudience,
        content_type: generationForm.contentType,
        settings: generationForm,
        status: 'processing',
        estimated_cost: estimatedCost
      };

      let session;
      try {
        const { data: sessionData_result, error: sessionError } = await supabase
          .from('article_generation_sessions')
          .insert(sessionData)
          .select()
          .single();

        if (sessionError) {
          if (sessionError.code === '42P01') {
            // Table doesn't exist, create a mock session for demo
            console.log('Database tables not yet created. Using mock session.');
            session = { 
              id: 'mock-session-' + Date.now(), 
              ...sessionData,
              created_at: new Date().toISOString()
            };
          } else {
            throw sessionError;
          }
        } else {
          session = sessionData_result;
        }
      } catch (error) {
        console.warn('Database error, using mock session:', error);
        session = { 
          id: 'mock-session-' + Date.now(), 
          ...sessionData,
          created_at: new Date().toISOString()
        };
      }
      updateGenerationStep('setup', 'completed', 100, { sessionId: session.id });
      setGenerationProgress(10);

      // Step 2: DataForSEO Keyword Research
      if (generationForm.includeDataForSEO) {
        setCurrentStep('🔍 Conducting DataForSEO keyword research...');
        updateGenerationStep('keyword-research', 'processing', 30);

        const { data: keywordData, error: keywordError } = await supabase.functions.invoke('keyword-research-agent', {
          body: {
            requestId: session.id,
            seedKeyword: generationForm.seedKeywords[0],
            location: 'United States',
            language: 'English'
          }
        });

        if (keywordError || !keywordData?.success) {
          updateGenerationStep('keyword-research', 'failed', 0);
          throw new Error(`Keyword research failed: ${keywordError?.message || 'Unknown error'}`);
        }
        
        updateGenerationStep('keyword-research', 'completed', 100, keywordData);
        setGenerationProgress(20);

        // Update keyword analytics
        setKeywordAnalytics({
          totalKeywords: keywordData.keywordCount || 0,
          highOpportunityKeywords: keywordData.keywords?.filter((k: any) => k.opportunity_score >= 70).length || 0,
          quickWinKeywords: keywordData.keywords?.filter((k: any) => k.keyword_difficulty <= 30).length || 0,
          averageSearchVolume: Math.round(keywordData.keywords?.reduce((sum: number, k: any) => sum + (k.search_volume || 0), 0) / (keywordData.keywords?.length || 1)),
          averageDifficulty: Math.round(keywordData.averageDifficulty || 0),
          competitionLevel: keywordData.averageDifficulty > 60 ? 'High' : keywordData.averageDifficulty > 30 ? 'Medium' : 'Low'
        });
      } else {
        updateGenerationStep('keyword-research', 'skipped', 100);
        setGenerationProgress(20);
      }

      // Step 3: Advanced Keyword Analysis
      if (generationForm.includeDataForSEO) {
        setCurrentStep('📊 Running advanced keyword analysis...');
        updateGenerationStep('advanced-keyword-analysis', 'processing', 50);

        const { data: advancedData, error: advancedError } = await supabase.functions.invoke('advanced-keyword-research', {
          body: {
            seedKeywords: generationForm.seedKeywords,
            industry: generationForm.industry,
            targetAudience: generationForm.targetAudience,
            minSearchVolume: generationForm.minSearchVolume,
            maxKeywordDifficulty: generationForm.maxKeywordDifficulty,
            includeQuestions: true,
            includeLongTail: true,
            competitorDomains: generationForm.competitorDomains
          }
        });

        if (advancedError || !advancedData?.success) {
          console.warn('Advanced keyword analysis failed, continuing...', advancedError);
          updateGenerationStep('advanced-keyword-analysis', 'failed', 0);
        } else {
          updateGenerationStep('advanced-keyword-analysis', 'completed', 100, advancedData);
        }
        setGenerationProgress(30);
      } else {
        updateGenerationStep('advanced-keyword-analysis', 'skipped', 100);
        setGenerationProgress(30);
      }

      // Step 4: SERP Analysis
      if (generationForm.includeSerpAnalysis) {
        setCurrentStep('🎯 Analyzing search engine results...');
        updateGenerationStep('serp-analysis', 'processing', 40);

        const { data: serpData, error: serpError } = await supabase.functions.invoke('serp-analysis-agent', {
          body: {
            keyword: generationForm.seedKeywords[0],
            location: 'US',
            language: 'en',
            device: 'desktop',
            competitors: generationForm.competitorDomains,
            analysisDepth: 'comprehensive'
          }
        });

        if (serpError || !serpData?.success) {
          console.warn('SERP analysis failed, continuing...', serpError);
          updateGenerationStep('serp-analysis', 'failed', 0);
        } else {
          updateGenerationStep('serp-analysis', 'completed', 100, serpData);
        }
        setGenerationProgress(40);
      } else {
        updateGenerationStep('serp-analysis', 'skipped', 100);
        setGenerationProgress(40);
      }

      // Step 5: Perplexity Research
      if (generationForm.includePerplexityResearch) {
        setCurrentStep('🧠 Conducting Perplexity research...');
        updateGenerationStep('perplexity-research', 'processing', 60);

        // This would integrate with Perplexity API through our advanced article generator
        const { data: perplexityData, error: perplexityError } = await supabase.functions.invoke('advanced-article-generator', {
          body: {
            action: 'perplexity_research',
            sessionId: session.id,
            keywords: generationForm.seedKeywords,
            industry: generationForm.industry,
            targetAudience: generationForm.targetAudience
          }
        });

        if (perplexityError) {
          console.warn('Perplexity research failed, continuing...', perplexityError);
          updateGenerationStep('perplexity-research', 'failed', 0);
        } else {
          updateGenerationStep('perplexity-research', 'completed', 100, perplexityData);
        }
        setGenerationProgress(50);
      } else {
        updateGenerationStep('perplexity-research', 'skipped', 100);
        setGenerationProgress(50);
      }

      // Step 6: Content Strategy
      setCurrentStep('📝 Developing content strategy...');
      updateGenerationStep('content-strategy', 'processing', 70);

      const { data: strategyData, error: strategyError } = await supabase.functions.invoke('advanced-article-generator', {
        body: {
          action: 'content_strategy',
          sessionId: session.id,
          keywords: generationForm.seedKeywords,
          contentType: generationForm.contentType,
          targetAudience: generationForm.targetAudience,
          competitorAnalysis: generationSteps.find(s => s.id === 'serp-analysis')?.data,
          keywordResearch: generationSteps.find(s => s.id === 'keyword-research')?.data
        }
      });

      if (strategyError) {
        console.warn('Content strategy failed, continuing...', strategyError);
        updateGenerationStep('content-strategy', 'failed', 0);
      } else {
        updateGenerationStep('content-strategy', 'completed', 100, strategyData);
      }
      setGenerationProgress(60);

      // Step 7: Minimax Article Generation
      if (generationForm.includeMinimaxGeneration) {
        setCurrentStep('✍️ Generating article with Minimax AI...');
        updateGenerationStep('article-generation', 'processing', 30);

        const { data: articleData, error: articleError } = await supabase.functions.invoke('advanced-article-generator', {
          body: {
            action: 'generate_article',
            sessionId: session.id,
            contentType: generationForm.contentType,
            targetKeywords: generationForm.seedKeywords,
            customInstructions: generationForm.customInstructions,
            contentLength: generationForm.contentLength,
            writingStyle: generationForm.writingStyle,
            targetAudience: generationForm.targetAudience,
            seoFocus: generationForm.seoFocus,
            readabilityTarget: generationForm.readabilityTarget,
            includeCallToActions: generationForm.includeCallToActions,
            contentStrategy: generationSteps.find(s => s.id === 'content-strategy')?.data,
            keywordData: generationSteps.find(s => s.id === 'keyword-research')?.data,
            serpAnalysis: generationSteps.find(s => s.id === 'serp-analysis')?.data
          }
        });

        if (articleError || !articleData?.success) {
          updateGenerationStep('article-generation', 'failed', 0);
          throw new Error(`Article generation failed: ${articleError?.message || 'Unknown error'}`);
        }

        updateGenerationStep('article-generation', 'completed', 100, articleData);
        setGenerationProgress(75);
      } else {
        updateGenerationStep('article-generation', 'skipped', 100);
        setGenerationProgress(75);
      }

      // Step 8: SEO Optimization
      if (generationForm.seoFocus) {
        setCurrentStep('🎯 Optimizing for SEO...');
        updateGenerationStep('seo-optimization', 'processing', 80);

        const { data: seoData, error: seoError } = await supabase.functions.invoke('content-quality-assurance', {
          body: {
            sessionId: session.id,
            content: generationSteps.find(s => s.id === 'article-generation')?.data?.content,
            targetKeywords: generationForm.seedKeywords,
            competitorAnalysis: generationSteps.find(s => s.id === 'serp-analysis')?.data
          }
        });

        if (seoError) {
          console.warn('SEO optimization failed, continuing...', seoError);
          updateGenerationStep('seo-optimization', 'failed', 0);
        } else {
          updateGenerationStep('seo-optimization', 'completed', 100, seoData);
          
          // Update article metrics
          if (seoData?.metrics) {
            setArticleMetrics(seoData.metrics);
          }
        }
        setGenerationProgress(85);
      } else {
        updateGenerationStep('seo-optimization', 'skipped', 100);
        setGenerationProgress(85);
      }

      // Step 9: BFL Image Generation
      if (generationForm.includeBFLImages) {
        setCurrentStep('🎨 Generating professional images...');
        updateGenerationStep('image-generation', 'processing', 50);

        const { data: imageData, error: imageError } = await supabase.functions.invoke('advanced-article-generator', {
          body: {
            action: 'generate_images',
            sessionId: session.id,
            content: generationSteps.find(s => s.id === 'article-generation')?.data?.content,
            title: generationSteps.find(s => s.id === 'article-generation')?.data?.title,
            keywords: generationForm.seedKeywords,
            imageCount: 5
          }
        });

        if (imageError) {
          console.warn('Image generation failed, continuing...', imageError);
          updateGenerationStep('image-generation', 'failed', 0);
        } else {
          updateGenerationStep('image-generation', 'completed', 100, imageData);
        }
        setGenerationProgress(95);
      } else {
        updateGenerationStep('image-generation', 'skipped', 100);
        setGenerationProgress(95);
      }

      // Step 10: Quality Assurance
      setCurrentStep('✅ Running final quality assurance...');
      updateGenerationStep('quality-assurance', 'processing', 90);

      const { data: qaData, error: qaError } = await supabase.functions.invoke('content-quality-assurance', {
        body: {
          action: 'final_review',
          sessionId: session.id,
          fullContent: generationSteps.find(s => s.id === 'article-generation')?.data,
          targetKeywords: generationForm.seedKeywords,
          seoOptimization: generationSteps.find(s => s.id === 'seo-optimization')?.data,
          images: generationSteps.find(s => s.id === 'image-generation')?.data
        }
      });

      if (qaError) {
        console.warn('Quality assurance failed, continuing...', qaError);
        updateGenerationStep('quality-assurance', 'failed', 0);
      } else {
        updateGenerationStep('quality-assurance', 'completed', 100, qaData);
      }

      // Update session as completed (if not a mock session)
      if (!session.id.startsWith('mock-session-')) {
        try {
          await supabase
            .from('article_generation_sessions')
            .update({ 
              status: 'completed',
              completed_at: new Date().toISOString(),
              results: {
                steps: generationSteps,
                keywordAnalytics,
                articleMetrics,
                finalContent: generationSteps.find(s => s.id === 'article-generation')?.data
              }
            })
            .eq('id', session.id);
        } catch (error) {
          console.warn('Could not update session in database:', error);
        }
      }

      setCurrentStep('🎉 Advanced article generation completed successfully!');
      setGenerationProgress(100);

      toast({
        title: "Advanced Article Generated Successfully!",
        description: `Your professional, SEO-optimized article is ready. Total cost: $${estimatedCost}`,
      });

      // Refresh history
      await loadGenerationHistory();

    } catch (error: any) {
      console.error('Advanced generation error:', error);
      toast({
        title: "Generation Failed",
        description: error.message || 'An unexpected error occurred during generation',
        variant: "destructive",
      });
      
      // Mark current processing step as failed
      const processingStep = generationSteps.find(step => step.status === 'processing');
      if (processingStep) {
        updateGenerationStep(processingStep.id, 'failed', 0);
      }
    } finally {
      setIsGenerating(false);
      
      // Clear progress after 10 seconds to show final state
      setTimeout(() => {
        if (!isGenerating) {
          setGenerationProgress(0);
          setCurrentStep('');
          setGenerationSteps(steps => steps.map(step => ({ ...step, status: 'pending', progress: 0 })));
        }
      }, 10000);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Text has been copied to your clipboard",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Article Generator</h1>
          <p className="text-gray-600 mt-2">
            Professional AI-powered content creation with DataForSEO research, SERP analysis, Perplexity insights, and Minimax generation
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Database className="w-3 h-3 mr-1" />
            DataForSEO
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Network className="w-3 h-3 mr-1" />
            Perplexity
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Zap className="w-3 h-3 mr-1" />
            Minimax
          </Badge>
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            <Gauge className="w-3 h-3 mr-1" />
            Est. ${estimatedCost}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
          <TabsTrigger value="generator" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Rocket className="w-4 h-4 mr-2" />
            Article Generator
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Live Analytics
          </TabsTrigger>
          <TabsTrigger value="research" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Search className="w-4 h-4 mr-2" />
            Research Tools
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Eye className="w-4 h-4 mr-2" />
            Generation History
          </TabsTrigger>
        </TabsList>

        {/* Advanced Generator Tab */}
        <TabsContent value="generator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Configuration */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <Settings className="w-5 h-5 mr-2 text-blue-500" />
                    Article Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure your advanced article generation settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Seed Keywords */}
                  <div className="space-y-3">
                    <Label className="text-gray-700 font-medium">Seed Keywords</Label>
                    <div className="flex space-x-2">
                      <Input
                        value={seedKeywordInput}
                        onChange={(e) => setSeedKeywordInput(e.target.value)}
                        placeholder="Enter a seed keyword..."
                        className="flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && addSeedKeyword()}
                      />
                      <Button onClick={addSeedKeyword} variant="outline">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {generationForm.seedKeywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {keyword}
                          <button onClick={() => removeSeedKeyword(index)} className="ml-1 hover:bg-gray-200 rounded">
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Basic Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Industry</Label>
                      <Select 
                        value={generationForm.industry} 
                        onValueChange={(value) => setGenerationForm({...generationForm, industry: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AI Consulting">AI Consulting</SelectItem>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="E-commerce">E-commerce</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Target Audience</Label>
                      <Select 
                        value={generationForm.targetAudience} 
                        onValueChange={(value) => setGenerationForm({...generationForm, targetAudience: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Enterprise Decision Makers">Enterprise Decision Makers</SelectItem>
                          <SelectItem value="Technical Professionals">Technical Professionals</SelectItem>
                          <SelectItem value="Business Owners">Business Owners</SelectItem>
                          <SelectItem value="Marketing Professionals">Marketing Professionals</SelectItem>
                          <SelectItem value="General Audience">General Audience</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Content Type</Label>
                      <Select 
                        value={generationForm.contentType} 
                        onValueChange={(value) => setGenerationForm({...generationForm, contentType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pillar">Pillar Content</SelectItem>
                          <SelectItem value="blog">Blog Post</SelectItem>
                          <SelectItem value="whitepaper">Whitepaper</SelectItem>
                          <SelectItem value="case-study">Case Study</SelectItem>
                          <SelectItem value="resource-guide">Resource Guide</SelectItem>
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
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3000+">3000+ words</SelectItem>
                          <SelectItem value="5000+">5000+ words</SelectItem>
                          <SelectItem value="8000+">8000+ words</SelectItem>
                          <SelectItem value="10000+">10000+ words</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Advanced Options */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">AI & Research Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-gray-700 text-sm font-medium">DataForSEO Research</Label>
                          <p className="text-xs text-gray-500">Real keyword data & search volumes</p>
                        </div>
                        <Switch
                          checked={generationForm.includeDataForSEO}
                          onCheckedChange={(checked) => setGenerationForm({...generationForm, includeDataForSEO: checked})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-gray-700 text-sm font-medium">SERP Analysis</Label>
                          <p className="text-xs text-gray-500">Competitor content analysis</p>
                        </div>
                        <Switch
                          checked={generationForm.includeSerpAnalysis}
                          onCheckedChange={(checked) => setGenerationForm({...generationForm, includeSerpAnalysis: checked})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-gray-700 text-sm font-medium">Perplexity Research</Label>
                          <p className="text-xs text-gray-500">Real-time market insights</p>
                        </div>
                        <Switch
                          checked={generationForm.includePerplexityResearch}
                          onCheckedChange={(checked) => setGenerationForm({...generationForm, includePerplexityResearch: checked})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-gray-700 text-sm font-medium">Minimax Generation</Label>
                          <p className="text-xs text-gray-500">Advanced AI content creation</p>
                        </div>
                        <Switch
                          checked={generationForm.includeMinimaxGeneration}
                          onCheckedChange={(checked) => setGenerationForm({...generationForm, includeMinimaxGeneration: checked})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-gray-700 text-sm font-medium">BFL Images</Label>
                          <p className="text-xs text-gray-500">Professional image generation</p>
                        </div>
                        <Switch
                          checked={generationForm.includeBFLImages}
                          onCheckedChange={(checked) => setGenerationForm({...generationForm, includeBFLImages: checked})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-gray-700 text-sm font-medium">SEO Optimization</Label>
                          <p className="text-xs text-gray-500">Advanced SEO scoring & optimization</p>
                        </div>
                        <Switch
                          checked={generationForm.seoFocus}
                          onCheckedChange={(checked) => setGenerationForm({...generationForm, seoFocus: checked})}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Competitor Domains */}
                  <div className="space-y-3">
                    <Label className="text-gray-700 font-medium">Competitor Domains (Optional)</Label>
                    <div className="flex space-x-2">
                      <Input
                        value={competitorInput}
                        onChange={(e) => setCompetitorInput(e.target.value)}
                        placeholder="Enter competitor domain (e.g., competitor.com)..."
                        className="flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && addCompetitorDomain()}
                      />
                      <Button onClick={addCompetitorDomain} variant="outline">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {generationForm.competitorDomains.map((domain, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {domain}
                          <button onClick={() => removeCompetitorDomain(index)} className="ml-1 hover:bg-gray-200 rounded">
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Custom Instructions */}
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Custom Instructions (Optional)</Label>
                    <Textarea
                      value={generationForm.customInstructions}
                      onChange={(e) => setGenerationForm({...generationForm, customInstructions: e.target.value})}
                      placeholder="Add specific requirements, brand guidelines, tone preferences, or other custom instructions..."
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Generate Button */}
                  <Button 
                    onClick={startAdvancedGeneration}
                    disabled={isGenerating || generationForm.seedKeywords.length === 0}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-14 text-lg font-semibold"
                  >
                    {isGenerating ? (
                      <>
                        <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
                        Generating Professional Article...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-5 h-5 mr-2" />
                        Generate Advanced Article (${estimatedCost})
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Cost Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <Gauge className="w-4 h-4 mr-2 text-green-500" />
                    Cost Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">DataForSEO API</span>
                      <span className="text-sm font-medium">{generationForm.includeDataForSEO ? '$0.075' : '$0.000'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">SERP Analysis</span>
                      <span className="text-sm font-medium">{generationForm.includeSerpAnalysis ? '$0.050' : '$0.000'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Perplexity Research</span>
                      <span className="text-sm font-medium">{generationForm.includePerplexityResearch ? '$0.100' : '$0.000'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Minimax Generation</span>
                      <span className="text-sm font-medium">{generationForm.includeMinimaxGeneration ? '$0.250' : '$0.000'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">BFL Images</span>
                      <span className="text-sm font-medium">{generationForm.includeBFLImages ? '$0.200' : '$0.000'}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between items-center font-semibold">
                      <span className="text-gray-900">Total Estimated</span>
                      <span className="text-green-600">${estimatedCost}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Keyword Analytics */}
              {keywordAnalytics && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-gray-900">
                      <BarChart3 className="w-4 h-4 mr-2 text-blue-500" />
                      Keyword Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Keywords</span>
                        <Badge variant="outline">{keywordAnalytics.totalKeywords}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">High Opportunity</span>
                        <Badge variant="default" className="bg-green-500">{keywordAnalytics.highOpportunityKeywords}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Quick Wins</span>
                        <Badge variant="secondary">{keywordAnalytics.quickWinKeywords}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Avg. Search Volume</span>
                        <span className="text-sm font-medium">{keywordAnalytics.averageSearchVolume.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Competition</span>
                        <Badge variant={keywordAnalytics.competitionLevel === 'High' ? 'destructive' : keywordAnalytics.competitionLevel === 'Medium' ? 'secondary' : 'default'}>
                          {keywordAnalytics.competitionLevel}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Article Metrics */}
              {articleMetrics && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-gray-900">
                      <Target className="w-4 h-4 mr-2 text-orange-500" />
                      Article Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Word Count</span>
                        <span className="text-sm font-medium">{articleMetrics.wordCount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Readability Score</span>
                        <Badge variant="outline">{articleMetrics.readabilityScore}%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">SEO Score</span>
                        <Badge variant="outline">{articleMetrics.seoScore}%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Ranking Potential</span>
                        <Badge variant="default" className="bg-blue-500">{articleMetrics.estimatedRankingPotential}%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Generation Progress */}
          {(isGenerating || generationSteps.some(step => step.status !== 'pending')) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-green-500" />
                    Advanced Generation Progress
                  </span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {generationProgress}% Complete
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{currentStep}</span>
                      <span className="text-sm text-gray-500">{generationProgress}%</span>
                    </div>
                    <Progress value={generationProgress} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    {generationSteps.map((step) => (
                      <div key={step.id} className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {step.status === 'completed' && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          {step.status === 'processing' && (
                            <RotateCcw className="w-4 h-4 text-blue-500 animate-spin" />
                          )}
                          {step.status === 'failed' && (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                          {step.status === 'skipped' && (
                            <Clock className="w-4 h-4 text-gray-400" />
                          )}
                          {step.status === 'pending' && (
                            <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className={`text-sm font-medium ${
                              step.status === 'completed' ? 'text-green-700' :
                              step.status === 'processing' ? 'text-blue-700' :
                              step.status === 'failed' ? 'text-red-700' :
                              step.status === 'skipped' ? 'text-gray-500' :
                              'text-gray-600'
                            }`}>
                              {step.name}
                            </span>
                            {step.status !== 'pending' && (
                              <Badge variant="outline" className="text-xs">
                                {step.status === 'skipped' ? 'Skipped' : `${step.progress}%`}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Live Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardContent className="text-center py-12">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Live Analytics</h3>
              <p className="text-gray-600">Generate an article to see detailed analytics and performance metrics.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Research Tools Tab */}
        <TabsContent value="research" className="space-y-6">
          <Card>
            <CardContent className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Research Tools</h3>
              <p className="text-gray-600">Advanced research tools will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Generation History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Generation History</CardTitle>
              <CardDescription className="text-gray-600">
                View and manage all generated articles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generationHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No articles generated yet</p>
                    <p className="text-sm text-gray-400 mt-1">Start your first advanced article generation above</p>
                  </div>
                ) : (
                  generationHistory.map((session: any) => (
                    <div key={session.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                      <div className="flex-1">
                        <h3 className="text-gray-900 font-medium">
                          {session.seed_keywords?.join(', ') || 'Untitled Article'}
                        </h3>
                        <p className="text-gray-600 text-sm">{session.industry} • {session.target_audience}</p>
                        <div className="flex items-center space-x-3 mt-2">
                          <Badge variant={session.status === 'completed' ? 'default' : session.status === 'processing' ? 'secondary' : 'destructive'}>
                            {session.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(session.created_at).toLocaleDateString()}
                          </span>
                          {session.estimated_cost && (
                            <span className="text-xs text-gray-500">
                              Cost: ${session.estimated_cost}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="border-blue-400 text-blue-600 hover:bg-blue-50">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="border-green-400 text-green-600 hover:bg-green-50">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="border-red-400 text-red-600 hover:bg-red-50">
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

export default AdvancedArticleGenerator;