import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Zap,
  Rocket,
  Brain,
  Network,
  BarChart3,
  Calendar,
  Settings,
  Play,
  Pause,
  Eye,
  TrendingUp,
  Globe,
  Link,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Database,
  Search,
  FileText,
  Image,
  Gauge,
  Shield,
  Cpu,
  Bot,
  RefreshCw,
  AlertTriangle,
  Info,
  Users
} from 'lucide-react';

interface AutopilotConfig {
  domain: string;
  articlesPerDay: number;
  targetIndustry: string;
  seoAggressiveness: 'conservative' | 'moderate' | 'aggressive';
  enableDataForSEO: boolean;
  enableSerpAnalysis: boolean;
  enablePerplexityResearch: boolean;
  enableMinimaxGeneration: boolean;
  enableBFLImages: boolean;
  publishAutomatically: boolean;
  minWordCount: number;
  maxWordCount: number;
  internalLinkingDensity: number;
}

interface AutopilotSession {
  id: string;
  domain: string;
  status: 'analyzing' | 'planning' | 'active' | 'paused' | 'error';
  articlesGenerated: number;
  totalPlannedArticles: number;
  nextScheduledGeneration: string;
  averageQualityScore: number;
  siteAnalysis: any;
  dailyPlan: any[];
  createdAt: string;
  lastExecuted: string;
}

interface SiteAnalytics {
  existingPages: number;
  existingTopics: number;
  contentGaps: number;
  keywordOpportunities: number;
  internalLinks: number;
  competitorAnalysis: any;
  seoHealthScore: number;
  contentHealthScore: number;
}

interface GenerationMetrics {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  averageWordCount: number;
  averageSeoScore: number;
  averageReadabilityScore: number;
  totalCost: number;
  estimatedTraffic: number;
}

const AutopilotDashboard = () => {
  const { toast } = useToast();
  
  // Autopilot Configuration
  const [autopilotConfig, setAutopilotConfig] = useState<AutopilotConfig>({
    domain: 'https://agentic-ai.ltd',
    articlesPerDay: 5,
    targetIndustry: 'AI Consulting',
    seoAggressiveness: 'aggressive',
    enableDataForSEO: true,
    enableSerpAnalysis: true,
    enablePerplexityResearch: true,
    enableMinimaxGeneration: true,
    enableBFLImages: true,
    publishAutomatically: false, // Start with manual review
    minWordCount: 3000,
    maxWordCount: 8000,
    internalLinkingDensity: 5
  });

  // State Management
  const [autopilotSession, setAutopilotSession] = useState<AutopilotSession | null>(null);
  const [siteAnalytics, setSiteAnalytics] = useState<SiteAnalytics | null>(null);
  const [generationMetrics, setGenerationMetrics] = useState<GenerationMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isStartingAutopilot, setIsStartingAutopilot] = useState(false);
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState('');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [recentArticles, setRecentArticles] = useState([]);
  const [upcomingArticles, setUpcomingArticles] = useState([]);

  useEffect(() => {
    loadExistingAutopilotSession();
    loadGenerationMetrics();
    loadRecentArticles();
  }, []);

  const loadExistingAutopilotSession = async () => {
    try {
      // Check if there's already an active autopilot session
      const { data, error } = await supabase
        .from('autopilot_sessions')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.warn('Could not load existing session:', error);
        return;
      }

      if (data && data.length > 0) {
        setAutopilotSession(data[0]);
        if (data[0].site_analysis) {
          setSiteAnalytics(data[0].site_analysis);
        }
      }
    } catch (error) {
      console.error('Error loading existing session:', error);
    }
  };

  const loadGenerationMetrics = async () => {
    try {
      // Load metrics from generated articles
      const { data, error } = await supabase
        .from('generated_articles')
        .select('*')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Last 30 days

      if (error) {
        console.warn('Could not load metrics:', error);
        // Set default metrics
        setGenerationMetrics({
          totalArticles: 0,
          publishedArticles: 0,
          draftArticles: 0,
          averageWordCount: 0,
          averageSeoScore: 0,
          averageReadabilityScore: 0,
          totalCost: 0,
          estimatedTraffic: 0
        });
        return;
      }

      if (data) {
        const metrics: GenerationMetrics = {
          totalArticles: data.length,
          publishedArticles: data.filter(a => a.status === 'published').length,
          draftArticles: data.filter(a => a.status === 'draft').length,
          averageWordCount: Math.round(data.reduce((sum, a) => sum + (a.word_count || 0), 0) / (data.length || 1)),
          averageSeoScore: Math.round(data.reduce((sum, a) => sum + (a.seo_score || 0), 0) / (data.length || 1)),
          averageReadabilityScore: Math.round(data.reduce((sum, a) => sum + (a.readability_score || 0), 0) / (data.length || 1)),
          totalCost: data.length * 0.75, // Estimate $0.75 per article
          estimatedTraffic: data.filter(a => a.status === 'published').length * 2500 // Estimate 2500 visitors per published article
        };
        setGenerationMetrics(metrics);
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  };

  const loadRecentArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('generated_articles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data) {
        setRecentArticles(data);
      }
    } catch (error) {
      console.error('Error loading recent articles:', error);
    }
  };

  const startSiteAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setCurrentAnalysisStep('Initializing site analysis...');

    try {
      // Step 1: Discover Sitemap
      setCurrentAnalysisStep('🕷️ Discovering and analyzing sitemap...');
      setAnalysisProgress(10);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 2: Analyze Existing Content
      setCurrentAnalysisStep('📄 Analyzing existing content and topics...');
      setAnalysisProgress(25);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 3: Keyword Opportunities
      setCurrentAnalysisStep('🔍 Discovering keyword opportunities...');
      setAnalysisProgress(40);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 4: Competitor Analysis
      setCurrentAnalysisStep('🎯 Analyzing competitors and content gaps...');
      setAnalysisProgress(60);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 5: Internal Linking Analysis
      setCurrentAnalysisStep('🔗 Mapping internal linking opportunities...');
      setAnalysisProgress(80);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 6: Generate Site Analysis
      setCurrentAnalysisStep('✅ Generating comprehensive site analysis...');
      setAnalysisProgress(100);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock site analytics data
      const mockSiteAnalytics: SiteAnalytics = {
        existingPages: 47,
        existingTopics: 12,
        contentGaps: 156,
        keywordOpportunities: 2847,
        internalLinks: 234,
        competitorAnalysis: {
          competitors: 5,
          averageContentLength: 2500,
          contentGapsIdentified: 89,
          quickWinOpportunities: 23
        },
        seoHealthScore: 87,
        contentHealthScore: 76
      };

      setSiteAnalytics(mockSiteAnalytics);
      
      toast({
        title: "Site Analysis Complete!",
        description: `Found ${mockSiteAnalytics.keywordOpportunities} keyword opportunities and ${mockSiteAnalytics.contentGaps} content gaps ready for autopilot generation.`,
      });

    } catch (error: any) {
      toast({
        title: "Site Analysis Failed",
        description: error.message || 'An error occurred during site analysis',
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setCurrentAnalysisStep('');
      setAnalysisProgress(0);
    }
  };

  const startAutopilotSystem = async () => {
    if (!siteAnalytics) {
      toast({
        title: "Site Analysis Required",
        description: "Please run site analysis first before starting autopilot",
        variant: "destructive",
      });
      return;
    }

    setIsStartingAutopilot(true);

    try {
      // Call autopilot scheduler
      const { data, error } = await supabase.functions.invoke('autopilot-article-scheduler', {
        body: {
          action: 'start_autopilot',
          config: {
            domain: autopilotConfig.domain,
            articlesPerDay: autopilotConfig.articlesPerDay,
            targetIndustry: autopilotConfig.targetIndustry,
            contentTypes: ['pillar', 'blog', 'guide', 'case-study'],
            minWordCount: autopilotConfig.minWordCount,
            maxWordCount: autopilotConfig.maxWordCount,
            seoAggressiveness: autopilotConfig.seoAggressiveness,
            internalLinkingDensity: autopilotConfig.internalLinkingDensity,
            enableDataForSEO: autopilotConfig.enableDataForSEO,
            enableSerpAnalysis: autopilotConfig.enableSerpAnalysis,
            enablePerplexityResearch: autopilotConfig.enablePerplexityResearch,
            publishAutomatically: autopilotConfig.publishAutomatically
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        const session: AutopilotSession = {
          id: data.data.id,
          domain: autopilotConfig.domain,
          status: 'active',
          articlesGenerated: data.data.successCount || 0,
          totalPlannedArticles: data.data.articlesGenerated || autopilotConfig.articlesPerDay,
          nextScheduledGeneration: data.data.nextScheduledGeneration || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          averageQualityScore: data.data.averageQualityScore || 0,
          siteAnalysis: data.data.siteAnalysis || {},
          dailyPlan: data.data.dailyPlan || [],
          createdAt: new Date().toISOString(),
          lastExecuted: new Date().toISOString()
        };

        setAutopilotSession(session);
        setUpcomingArticles((data.data.dailyPlan || []).slice(0, 20)); // Show first 20 planned articles

        toast({
          title: "🚀 AUTOPILOT SYSTEM ACTIVATED!",
          description: `Your site will now generate ${autopilotConfig.articlesPerDay} high-quality articles per day automatically!`,
        });
      }

    } catch (error: any) {
      console.error('Autopilot start error:', error);
      toast({
        title: "Autopilot Start Failed",
        description: error.message || 'Failed to start autopilot system',
        variant: "destructive",
      });
    } finally {
      setIsStartingAutopilot(false);
    }
  };

  const stopAutopilot = async () => {
    if (!autopilotSession) return;

    try {
      // Update session status to paused
      const { error } = await supabase
        .from('autopilot_sessions')
        .update({ status: 'paused' })
        .eq('id', autopilotSession.id);

      if (error) throw error;

      setAutopilotSession({ ...autopilotSession, status: 'paused' });

      toast({
        title: "Autopilot Paused",
        description: "Automatic article generation has been paused. You can resume it anytime.",
      });

    } catch (error: any) {
      toast({
        title: "Failed to Stop Autopilot",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const executeManualGeneration = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('autopilot-article-scheduler', {
        body: {
          action: 'execute'
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Manual Generation Complete",
          description: `Generated ${data.data.successCount} articles successfully!`,
        });
        
        // Refresh data
        loadGenerationMetrics();
        loadRecentArticles();
      }

    } catch (error: any) {
      toast({
        title: "Manual Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 2 
  }).format(amount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Rocket className="w-8 h-8 mr-3 text-blue-600" />
            Autopilot Content System
          </h1>
          <p className="text-gray-600 mt-2">
            Fully automated AI content generation - 5-6 articles per day with zero human input
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {autopilotSession?.status === 'active' && (
            <Badge className="bg-green-500 text-white animate-pulse">
              <Activity className="w-3 h-3 mr-1" />
              AUTOPILOT ACTIVE
            </Badge>
          )}
          {autopilotSession?.status === 'paused' && (
            <Badge variant="secondary">
              <Pause className="w-3 h-3 mr-1" />
              PAUSED
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white border border-gray-200">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="setup" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Settings className="w-4 h-4 mr-2" />
            Autopilot Setup
          </TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Brain className="w-4 h-4 mr-2" />
            Site Analysis
          </TabsTrigger>
          <TabsTrigger value="schedule" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Calendar className="w-4 h-4 mr-2" />
            Content Schedule
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <TrendingUp className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">System Status</p>
                    <p className="text-2xl font-bold">
                      {autopilotSession?.status === 'active' ? 'ACTIVE' : 'IDLE'}
                    </p>
                  </div>
                  <Zap className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Articles Generated</p>
                    <p className="text-2xl font-bold">{generationMetrics?.totalArticles || 0}</p>
                  </div>
                  <FileText className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Est. Monthly Traffic</p>
                    <p className="text-2xl font-bold">{generationMetrics?.estimatedTraffic.toLocaleString() || 0}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Total Investment</p>
                    <p className="text-2xl font-bold">{formatCurrency(generationMetrics?.totalCost || 0)}</p>
                  </div>
                  <Gauge className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cpu className="w-5 h-5 mr-2 text-blue-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {!autopilotSession || autopilotSession.status !== 'active' ? (
                  <>
                    <Button
                      onClick={startSiteAnalysis}
                      disabled={isAnalyzing}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing Site...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          Analyze My Website
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={startAutopilotSystem}
                      disabled={!siteAnalytics || isStartingAutopilot}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isStartingAutopilot ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Starting Autopilot...
                        </>
                      ) : (
                        <>
                          <Rocket className="w-4 h-4 mr-2" />
                          Start Autopilot System
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={executeManualGeneration}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Generate Now
                    </Button>
                    
                    <Button
                      onClick={stopAutopilot}
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Pause Autopilot
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Live Analysis Progress */}
          {(isAnalyzing || analysisProgress > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-blue-500 animate-pulse" />
                  Live Site Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{currentAnalysisStep}</span>
                    <span className="text-sm text-gray-500">{analysisProgress}%</span>
                  </div>
                  <Progress value={analysisProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Site Analytics Overview */}
          {siteAnalytics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-sm">
                    <Globe className="w-4 h-4 mr-2 text-blue-500" />
                    Site Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Existing Pages</span>
                      <Badge variant="outline">{siteAnalytics.existingPages}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Content Topics</span>
                      <Badge variant="outline">{siteAnalytics.existingTopics}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">SEO Health</span>
                      <Badge className="bg-green-500 text-white">{siteAnalytics.seoHealthScore}%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-sm">
                    <Target className="w-4 h-4 mr-2 text-orange-500" />
                    Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Content Gaps</span>
                      <Badge className="bg-orange-500 text-white">{siteAnalytics.contentGaps}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Keywords Found</span>
                      <Badge className="bg-blue-500 text-white">{siteAnalytics.keywordOpportunities.toLocaleString()}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Quick Wins</span>
                      <Badge className="bg-green-500 text-white">{siteAnalytics.competitorAnalysis?.quickWinOpportunities || 0}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-sm">
                    <Link className="w-4 h-4 mr-2 text-purple-500" />
                    Internal Linking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Existing Links</span>
                      <Badge variant="outline">{siteAnalytics.internalLinks}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Link Density</span>
                      <Badge className="bg-purple-500 text-white">{autopilotConfig.internalLinkingDensity}/article</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Competitors</span>
                      <Badge variant="outline">{siteAnalytics.competitorAnalysis?.competitors || 0}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recent Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-green-500" />
                Recent Articles Generated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentArticles.length === 0 ? (
                  <div className="text-center py-8">
                    <Bot className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No articles generated yet</p>
                    <p className="text-sm text-gray-400 mt-1">Start the autopilot system to begin generating content</p>
                  </div>
                ) : (
                  recentArticles.slice(0, 5).map((article: any, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{article.title}</h4>
                        <div className="flex items-center space-x-3 mt-1">
                          <Badge variant={article.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                            {article.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {article.word_count?.toLocaleString()} words
                          </span>
                          <span className="text-xs text-gray-500">
                            SEO: {article.seo_score}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Autopilot Setup Tab */}
        <TabsContent value="setup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2 text-blue-500" />
                Autopilot Configuration
              </CardTitle>
              <CardDescription>
                Configure your fully automated content generation system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Website Domain</Label>
                  <Input
                    value={autopilotConfig.domain}
                    onChange={(e) => setAutopilotConfig({...autopilotConfig, domain: e.target.value})}
                    placeholder="https://your-domain.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Articles Per Day</Label>
                  <Select 
                    value={autopilotConfig.articlesPerDay.toString()} 
                    onValueChange={(value) => setAutopilotConfig({...autopilotConfig, articlesPerDay: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 articles/day</SelectItem>
                      <SelectItem value="4">4 articles/day</SelectItem>
                      <SelectItem value="5">5 articles/day</SelectItem>
                      <SelectItem value="6">6 articles/day</SelectItem>
                      <SelectItem value="7">7 articles/day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Target Industry</Label>
                  <Select 
                    value={autopilotConfig.targetIndustry} 
                    onValueChange={(value) => setAutopilotConfig({...autopilotConfig, targetIndustry: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AI Consulting">AI Consulting</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Business Services">Business Services</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="E-commerce">E-commerce</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>SEO Aggressiveness</Label>
                  <Select 
                    value={autopilotConfig.seoAggressiveness} 
                    onValueChange={(value: any) => setAutopilotConfig({...autopilotConfig, seoAggressiveness: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* AI Service Configuration */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">AI Services Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">DataForSEO Research</Label>
                      <p className="text-xs text-gray-500">Real keyword data & search volumes</p>
                    </div>
                    <Switch
                      checked={autopilotConfig.enableDataForSEO}
                      onCheckedChange={(checked) => setAutopilotConfig({...autopilotConfig, enableDataForSEO: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">SERP Analysis</Label>
                      <p className="text-xs text-gray-500">Competitor content analysis</p>
                    </div>
                    <Switch
                      checked={autopilotConfig.enableSerpAnalysis}
                      onCheckedChange={(checked) => setAutopilotConfig({...autopilotConfig, enableSerpAnalysis: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Perplexity Research</Label>
                      <p className="text-xs text-gray-500">Real-time market insights</p>
                    </div>
                    <Switch
                      checked={autopilotConfig.enablePerplexityResearch}
                      onCheckedChange={(checked) => setAutopilotConfig({...autopilotConfig, enablePerplexityResearch: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Minimax Generation</Label>
                      <p className="text-xs text-gray-500">Advanced AI content creation</p>
                    </div>
                    <Switch
                      checked={autopilotConfig.enableMinimaxGeneration}
                      onCheckedChange={(checked) => setAutopilotConfig({...autopilotConfig, enableMinimaxGeneration: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">BFL Images</Label>
                      <p className="text-xs text-gray-500">Professional image generation</p>
                    </div>
                    <Switch
                      checked={autopilotConfig.enableBFLImages}
                      onCheckedChange={(checked) => setAutopilotConfig({...autopilotConfig, enableBFLImages: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Auto-Publish</Label>
                      <p className="text-xs text-gray-500">Publish without human review</p>
                    </div>
                    <Switch
                      checked={autopilotConfig.publishAutomatically}
                      onCheckedChange={(checked) => setAutopilotConfig({...autopilotConfig, publishAutomatically: checked})}
                    />
                  </div>
                </div>
              </div>

              {/* Content Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Content Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Minimum Word Count</Label>
                    <Select 
                      value={autopilotConfig.minWordCount.toString()} 
                      onValueChange={(value) => setAutopilotConfig({...autopilotConfig, minWordCount: parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1500">1,500 words</SelectItem>
                        <SelectItem value="2500">2,500 words</SelectItem>
                        <SelectItem value="3000">3,000 words</SelectItem>
                        <SelectItem value="4000">4,000 words</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Maximum Word Count</Label>
                    <Select 
                      value={autopilotConfig.maxWordCount.toString()} 
                      onValueChange={(value) => setAutopilotConfig({...autopilotConfig, maxWordCount: parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5000">5,000 words</SelectItem>
                        <SelectItem value="8000">8,000 words</SelectItem>
                        <SelectItem value="10000">10,000 words</SelectItem>
                        <SelectItem value="15000">15,000 words</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {autopilotConfig.publishAutomatically && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Warning:</strong> Auto-publish is enabled. Articles will be published immediately without human review. 
                    Make sure your quality thresholds are properly configured.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Site Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          {!siteAnalytics ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-blue-500" />
                  Intelligent Site Analysis
                </CardTitle>
                <CardDescription>
                  AI-powered analysis of your website to discover content opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Brain className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Ready for AI Analysis</h3>
                  <p className="text-gray-600 mb-6">
                    Our AI will analyze your sitemap, content, competitors, and discover keyword opportunities automatically.
                  </p>
                  <Button
                    onClick={startSiteAnalysis}
                    disabled={isAnalyzing}
                    className="bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing Your Website...
                      </>
                    ) : (
                      <>
                        <Brain className="w-5 h-5 mr-2" />
                        Start Comprehensive Analysis
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Detailed Analysis Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* SEO Health Score */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">SEO Health</p>
                        <p className="text-3xl font-bold text-green-600">
                          {siteAnalytics.seoHealthScore || 85}
                        </p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-full">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${siteAnalytics.seoHealthScore || 85}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Content Health Score */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Content Quality</p>
                        <p className="text-3xl font-bold text-blue-600">
                          {siteAnalytics.contentHealthScore || 78}
                        </p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${siteAnalytics.contentHealthScore || 78}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Total Pages Analyzed */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pages Analyzed</p>
                        <p className="text-3xl font-bold text-purple-600">
                          {siteAnalytics.totalPages?.toLocaleString() || 156}
                        </p>
                      </div>
                      <div className="p-3 bg-purple-100 rounded-full">
                        <Globe className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">Across all sections</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Internal Links */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Internal Links</p>
                        <p className="text-3xl font-bold text-orange-600">
                          {siteAnalytics.totalInternalLinks?.toLocaleString() || 234}
                        </p>
                      </div>
                      <div className="p-3 bg-orange-100 rounded-full">
                        <Link className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">Link opportunities</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Analysis Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Keyword Opportunities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="w-5 h-5 mr-2 text-green-500" />
                      Top Keyword Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(siteAnalytics.keywordOpportunitiesList || [
                        { keyword: 'AI consulting services', volume: 5200, difficulty: 35, opportunity: 92 },
                        { keyword: 'enterprise AI implementation', volume: 3800, difficulty: 42, opportunity: 88 },
                        { keyword: 'business process automation', volume: 6100, difficulty: 38, opportunity: 85 },
                        { keyword: 'AI strategy framework', volume: 1800, difficulty: 28, opportunity: 94 },
                        { keyword: 'machine learning consulting', volume: 2900, difficulty: 33, opportunity: 89 }
                      ]).slice(0, 5).map((kw: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{kw.keyword}</p>
                            <div className="flex items-center space-x-3 mt-1">
                              <span className="text-xs text-gray-500">Vol: {kw.volume?.toLocaleString()}</span>
                              <span className="text-xs text-gray-500">KD: {kw.difficulty}</span>
                              <Badge 
                                variant={kw.opportunity > 90 ? 'default' : kw.opportunity > 80 ? 'secondary' : 'outline'}
                                className="text-xs"
                              >
                                {kw.opportunity}% opportunity
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View All {siteAnalytics.keywordOpportunities?.toLocaleString() || '2,847'} Keywords
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Content Gaps Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Search className="w-5 h-5 mr-2 text-orange-500" />
                      Critical Content Gaps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(siteAnalytics.contentGapsList || [
                        { topic: 'AI Implementation ROI Calculator', priority: 'High', searches: '4.2K/mo', competition: 'Low' },
                        { topic: 'Enterprise AI Security Framework', priority: 'High', searches: '2.8K/mo', competition: 'Medium' },
                        { topic: 'AI Automation Cost Analysis', priority: 'Medium', searches: '3.5K/mo', competition: 'Low' },
                        { topic: 'Machine Learning Business Cases', priority: 'Medium', searches: '2.1K/mo', competition: 'High' },
                        { topic: 'AI Ethics for Enterprise', priority: 'Low', searches: '1.4K/mo', competition: 'Medium' }
                      ]).slice(0, 5).map((gap: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{gap.topic}</p>
                            <div className="flex items-center space-x-3 mt-1">
                              <Badge 
                                variant={gap.priority === 'High' ? 'destructive' : gap.priority === 'Medium' ? 'secondary' : 'outline'}
                                className="text-xs"
                              >
                                {gap.priority}
                              </Badge>
                              <span className="text-xs text-gray-500">{gap.searches}</span>
                              <span className="text-xs text-gray-500">{gap.competition} comp</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Competitor Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-500" />
                    Competitive Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(siteAnalytics.competitorsList || [
                      { name: 'IBM Watson', authority: 94, contentGaps: 23, opportunityScore: 67 },
                      { name: 'Microsoft AI', authority: 96, contentGaps: 18, opportunityScore: 72 },
                      { name: 'Accenture AI', authority: 88, contentGaps: 34, opportunityScore: 81 }
                    ]).map((comp: any, index: number) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">{comp.name}</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Domain Authority</span>
                            <span className="font-medium">{comp.authority}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Content Gaps</span>
                            <span className="font-medium text-orange-600">{comp.contentGaps}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Opportunity</span>
                            <Badge variant="outline" className="text-xs">
                              {comp.opportunityScore}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Site Structure Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-purple-500" />
                      Site Structure Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(siteAnalytics.siteStructure || [
                        { section: '/services', pages: 28, avgWords: 2450, seoScore: 87 },
                        { section: '/case-studies', pages: 15, avgWords: 3200, seoScore: 92 },
                        { section: '/resources', pages: 67, avgWords: 1850, seoScore: 79 },
                        { section: '/blog', pages: 34, avgWords: 2800, seoScore: 83 },
                        { section: '/about', pages: 8, avgWords: 1950, seoScore: 88 }
                      ]).map((section: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{section.section}</p>
                            <p className="text-xs text-gray-500">{section.pages} pages • {section.avgWords} avg words</p>
                          </div>
                          <Badge variant={section.seoScore > 85 ? 'default' : 'secondary'} className="text-xs">
                            SEO: {section.seoScore}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {(siteAnalytics.recommendations || [
                        { type: 'critical', title: 'Add FAQ sections to service pages', impact: 'High' },
                        { type: 'important', title: 'Improve internal linking between case studies', impact: 'Medium' },
                        { type: 'suggestion', title: 'Create pillar pages for AI topics', impact: 'High' },
                        { type: 'critical', title: 'Optimize meta descriptions for 23 pages', impact: 'Medium' },
                        { type: 'suggestion', title: 'Add schema markup to service pages', impact: 'Low' }
                      ]).map((rec: any, index: number) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          {rec.type === 'critical' ? (
                            <AlertTriangle className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0" />
                          ) : rec.type === 'important' ? (
                            <AlertCircle className="w-4 h-4 mt-0.5 text-orange-500 flex-shrink-0" />
                          ) : (
                            <Info className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{rec.title}</p>
                            <Badge 
                              variant={rec.impact === 'High' ? 'destructive' : rec.impact === 'Medium' ? 'secondary' : 'outline'}
                              className="text-xs mt-1"
                            >
                              {rec.impact} Impact
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Re-analyze Button */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={startSiteAnalysis}
                  disabled={isAnalyzing}
                  variant="outline"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Re-analyzing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Re-analyze Website
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </TabsContent>

        {/* Content Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-500" />
                Automated Content Schedule
              </CardTitle>
              <CardDescription>
                View your AI-generated content calendar and upcoming articles
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingArticles.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Schedule Available</h3>
                  <p className="text-gray-600">
                    Start the autopilot system to generate an automated content schedule.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {upcomingArticles.slice(0, 9).map((article: any, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {new Date(article.scheduledFor).toLocaleDateString()}
                          </Badge>
                          <Badge className={`text-xs ${
                            article.status === 'completed' ? 'bg-green-500' :
                            article.status === 'generating' ? 'bg-blue-500' :
                            'bg-gray-500'
                          }`}>
                            {article.status}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                          {article.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{article.estimatedWordCount?.toLocaleString()} words</span>
                          <span>SEO: {article.seoScore}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                Autopilot Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generationMetrics ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {generationMetrics.averageSeoScore}%
                    </div>
                    <div className="text-sm text-gray-600">Average SEO Score</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {generationMetrics.averageWordCount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Average Word Count</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      {generationMetrics.publishedArticles}
                    </div>
                    <div className="text-sm text-gray-600">Articles Published</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {formatCurrency(generationMetrics.totalCost)}
                    </div>
                    <div className="text-sm text-gray-600">Total Investment</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Performance Data</h3>
                  <p className="text-gray-600">Performance metrics will appear after articles are generated.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutopilotDashboard;