import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  FileText, 
  Image, 
  Globe, 
  Bot,
  Users,
  Activity,
  TrendingUp,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Download,
  RefreshCw,
  Settings,
  BarChart3,
  Brain
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [stats, setStats] = useState({
    totalPages: 0,
    totalResources: 0,
    totalBlogs: 0,
    totalServices: 0,
    activeRequests: 0,
    apiUsage: 0
  });
  const [contentRequests, setContentRequests] = useState([]);
  const [generatedContent, setGeneratedContent] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [activityLog, setActivityLog] = useState([]);
  const [lastSync, setLastSync] = useState(new Date());
  const [syncStatus, setSyncStatus] = useState('live');

  // AI Generation States
  const [generationForm, setGenerationForm] = useState({
    contentType: 'blog',
    targetKeywords: '',
    outline: '',
    customInstructions: ''
  });

  useEffect(() => {
    checkAuth();
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: {
          email: loginData.email,
          password: loginData.password
        }
      });

      if (error) throw error;

      if (data.success) {
        localStorage.setItem('admin_token', data.token);
        setIsAuthenticated(true);
        toast({
          title: "Login Successful",
          description: "Welcome to Agentic AI Dashboard",
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    navigate('/');
  };

  const loadDashboardData = async () => {
    try {
      // Load stats
      const { data: requestsData } = await supabase
        .from('content_requests')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: contentData } = await supabase
        .from('generated_content')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: usageData } = await supabase
        .from('api_usage_logs')
        .select('cost_usd')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      setContentRequests(requestsData || []);
      setGeneratedContent(contentData || []);
      
      const totalUsage = usageData?.reduce((sum, log) => sum + (log.cost_usd || 0), 0) || 0;
      
      setStats({
        totalPages: contentData?.filter(c => c.categories?.includes('page'))?.length || 0,
        totalResources: contentData?.filter(c => c.categories?.includes('resource'))?.length || 0,
        totalBlogs: contentData?.filter(c => c.categories?.includes('blog'))?.length || 0,
        totalServices: contentData?.filter(c => c.categories?.includes('service'))?.length || 0,
        activeRequests: requestsData?.filter(r => r.status === 'processing')?.length || 0,
        apiUsage: totalUsage
      });

      // Load activity log
      const activities = [
        ...requestsData?.slice(0, 10).map(r => ({
          id: r.id,
          timestamp: new Date(r.created_at),
          message: `Content request: ${r.content_type} - ${r.status}`,
          type: r.status
        })) || [],
        ...contentData?.slice(0, 10).map(c => ({
          id: c.id,
          timestamp: new Date(c.created_at),
          message: `Generated: ${c.title}`,
          type: 'completed'
        })) || []
      ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      setActivityLog(activities);

    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive",
      });
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

    try {
      // Step 1: Create content request
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

      // Step 1: Keyword Research
      setCurrentStep('🔍 Researching keywords and trends...');
      setGenerationProgress(10);

      const { data: keywordData, error: keywordError } = await supabase.functions.invoke('keyword-research-agent', {
        body: {
          requestId: requestData.id,
          keywords: generationForm.targetKeywords.split(',').map(k => k.trim())
        }
      });

      if (keywordError) throw keywordError;

      // Step 2: SERP Analysis
      setCurrentStep('📊 Analyzing search engine results...');
      setGenerationProgress(25);

      const { data: serpData, error: serpError } = await supabase.functions.invoke('serp-analysis-agent', {
        body: {
          requestId: requestData.id,
          primaryKeyword: keywordData.primaryKeyword
        }
      });

      if (serpError) throw serpError;

      // Step 3: Content Generation
      setCurrentStep('✍️ Generating SEO-optimized content...');
      setGenerationProgress(50);

      const { data: contentData, error: contentError } = await supabase.functions.invoke('content-generator-agent', {
        body: {
          requestId: requestData.id,
          contentType: generationForm.contentType,
          targetKeywords: keywordData.keywords,
          outline: generationForm.outline ? JSON.parse(generationForm.outline) : null
        }
      });

      if (contentError) throw contentError;

      // Step 4: Image Generation
      setCurrentStep('🎨 Creating custom images...');
      setGenerationProgress(80);

      const { data: imageData, error: imageError } = await supabase.functions.invoke('image-generator-agent', {
        body: {
          requestId: requestData.id,
          content: contentData.contentData.content,
          title: contentData.contentData.title
        }
      });

      if (imageError) throw imageError;

      setCurrentStep('✅ Generation completed successfully!');
      setGenerationProgress(100);

      toast({
        title: "Content Generated Successfully",
        description: "Your AI-powered content package is ready!",
      });

      // Refresh data
      await loadDashboardData();

    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setTimeout(() => {
        setGenerationProgress(0);
        setCurrentStep('');
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border-purple-500/20 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Agentic AI
            </CardTitle>
            <CardDescription className="text-gray-300">
              Admin Dashboard - Content Management System
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="bg-gray-800/50 border-gray-600 text-white"
                  placeholder="info@agentic-ai.ltd"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="bg-gray-800/50 border-gray-600 text-white"
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-purple-500/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Agentic AI
            </h1>
            <Badge variant="outline" className="border-purple-400 text-purple-300">
              Content Management System
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${syncStatus === 'live' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-300">
                {syncStatus === 'live' ? 'Live' : 'Syncing'}
              </span>
              <span className="text-xs text-gray-500">
                {lastSync.toLocaleTimeString()}
              </span>
            </div>
            
            <Button variant="outline" size="sm" className="border-purple-400 text-purple-300">
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate Sitemap
            </Button>
            
            <Button 
              onClick={handleLogout}
              variant="outline" 
              size="sm"
              className="border-red-400 text-red-300 hover:bg-red-500/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 hover:border-purple-400/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Active Pages</CardTitle>
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalPages}</div>
              <p className="text-xs text-gray-400">Published pages</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 hover:border-purple-400/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Resources</CardTitle>
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalResources}</div>
              <p className="text-xs text-gray-400">Available resources</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 hover:border-purple-400/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Blog Posts</CardTitle>
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalBlogs}</div>
              <p className="text-xs text-gray-400">Published articles</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 hover:border-purple-400/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">AI Usage</CardTitle>
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${stats.apiUsage.toFixed(2)}</div>
              <p className="text-xs text-gray-400">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="ai-generator" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-black/40 backdrop-blur-xl border border-purple-500/20">
                <TabsTrigger value="ai-generator" className="data-[state=active]:bg-purple-500/20">
                  <Bot className="w-4 h-4 mr-2" />
                  AI Generator
                </TabsTrigger>
                <TabsTrigger value="content" className="data-[state=active]:bg-purple-500/20">
                  <FileText className="w-4 h-4 mr-2" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-500/20">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-purple-500/20">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* AI Generator Tab */}
              <TabsContent value="ai-generator">
                <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">AI Content Generation</CardTitle>
                    <CardDescription className="text-gray-300">
                      Generate high-quality, SEO-optimized content using Claude Sonnet 4
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Generation Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-200">Content Type</Label>
                        <Select 
                          value={generationForm.contentType} 
                          onValueChange={(value) => setGenerationForm({...generationForm, contentType: value})}
                        >
                          <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blog">Blog Post</SelectItem>
                            <SelectItem value="page">Web Page</SelectItem>
                            <SelectItem value="resource">Resource Guide</SelectItem>
                            <SelectItem value="service">Service Page</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-200">Target Keywords</Label>
                        <Input
                          value={generationForm.targetKeywords}
                          onChange={(e) => setGenerationForm({...generationForm, targetKeywords: e.target.value})}
                          placeholder="AI automation, machine learning, business intelligence"
                          className="bg-gray-800/50 border-gray-600 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-200">Custom Instructions (Optional)</Label>
                      <Textarea
                        value={generationForm.customInstructions}
                        onChange={(e) => setGenerationForm({...generationForm, customInstructions: e.target.value})}
                        placeholder="Add any specific instructions for content generation..."
                        className="bg-gray-800/50 border-gray-600 text-white min-h-[100px]"
                      />
                    </div>

                    {/* Generation Progress */}
                    {isGenerating && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <p className="text-purple-300 font-medium">{currentStep}</p>
                        </div>
                        <Progress 
                          value={generationProgress} 
                          className="h-2 bg-gray-800" 
                        />
                        <p className="text-center text-gray-400 text-sm">
                          {generationProgress}% Complete
                        </p>
                      </div>
                    )}

                    <Button 
                      onClick={startAIGeneration}
                      disabled={isGenerating}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      {isGenerating ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Generating Content...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Start AI Generation
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Content Management Tab */}
              <TabsContent value="content">
                <div className="space-y-6">
                  {generatedContent.map((content: any) => (
                    <Card key={content.id} className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-white">{content.title}</CardTitle>
                            <CardDescription className="text-gray-300">
                              {content.categories?.[0] || 'Content'} • {new Date(content.created_at).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={content.status === 'published' ? 'default' : 'secondary'}>
                              {content.status}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 mb-4">{content.meta_description}</p>
                        <div className="flex flex-wrap gap-2">
                          {content.seo_tags?.map((tag: string, index: number) => (
                            <Badge key={index} variant="outline" className="border-purple-400 text-purple-300">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics">
                <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">Content Analytics</CardTitle>
                    <CardDescription className="text-gray-300">
                      Performance metrics and insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{stats.totalBlogs + stats.totalPages}</div>
                        <p className="text-sm text-gray-400">Total Content</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">${stats.apiUsage.toFixed(2)}</div>
                        <p className="text-sm text-gray-400">AI Costs (30d)</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">{stats.activeRequests}</div>
                        <p className="text-sm text-gray-400">Active Requests</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">System Settings</CardTitle>
                    <CardDescription className="text-gray-300">
                      Configure dashboard and AI settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        <Globe className="w-4 h-4 mr-2" />
                        Website Configuration
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Bot className="w-4 h-4 mr-2" />
                        AI Model Settings
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        User Management
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Activity Sidebar */}
          <div className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Real-Time Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {activityLog.map((activity: any) => (
                    <div key={activity.id} className="flex items-start space-x-3 text-sm">
                      <div className="flex-shrink-0 mt-1">
                        {activity.type === 'completed' && <CheckCircle className="w-4 h-4 text-green-400" />}
                        {activity.type === 'processing' && <Clock className="w-4 h-4 text-blue-400 animate-spin" />}
                        {activity.type === 'failed' && <XCircle className="w-4 h-4 text-red-400" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-300">{activity.message}</p>
                        <p className="text-xs text-gray-500">
                          [{activity.timestamp.toLocaleTimeString()}]
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4 border-gray-600 text-gray-300"
                  onClick={() => setActivityLog([])}
                >
                  Clear Log
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Page
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  New Blog Post
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export Content
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Search className="w-4 h-4 mr-2" />
                  SEO Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;