import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Brain, 
  Search, 
  FileText, 
  Image, 
  TrendingUp, 
  Users, 
  Zap, 
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download
} from 'lucide-react';

interface AdminSession {
  sessionToken: string;
  user: {
    email: string;
    role: string;
  };
}

interface ContentRequest {
  id: string;
  title: string;
  content_type: string;
  target_keywords: string[];
  status: string;
  progress: number;
  created_at: string;
}

interface GeneratedContent {
  id: string;
  title: string;
  meta_description: string;
  slug: string;
  content: string;
  status: string;
  created_at: string;
  seo_tags: string[];
  categories: string[];
  featured_image_url?: string;
}

interface ApiUsage {
  service_name: string;
  total_calls: number;
  total_cost: number;
  success_rate: number;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);

  // Dashboard data state
  const [stats, setStats] = useState({
    totalRequests: 0,
    completedContent: 0,
    totalCost: 0,
    successRate: 95
  });
  
  const [contentRequests, setContentRequests] = useState<ContentRequest[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [apiUsage, setApiUsage] = useState<ApiUsage[]>([]);

  // Content creation form state
  const [contentForm, setContentForm] = useState({
    title: '',
    contentType: 'blog_post',
    targetKeywords: '',
    description: ''
  });

  // Check authentication on load
  useEffect(() => {
    const session = localStorage.getItem('adminSession');
    if (session) {
      const parsedSession = JSON.parse(session);
      setAdminSession(parsedSession);
      setIsAuthenticated(true);
      loadDashboardData();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await supabase.functions.invoke('admin-auth', {
        body: {
          email: loginForm.email,
          password: loginForm.password,
          action: 'login'
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data.success) {
        const session = {
          sessionToken: response.data.sessionToken,
          user: response.data.user
        };
        
        setAdminSession(session);
        localStorage.setItem('adminSession', JSON.stringify(session));
        setIsAuthenticated(true);
        
        toast({
          title: "Login Successful",
          description: "Welcome to the AI Content Dashboard",
        });

        loadDashboardData();
      } else {
        throw new Error(response.data.error || 'Login failed');
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || 'Invalid credentials',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    setAdminSession(null);
    setIsAuthenticated(false);
    setActiveTab('dashboard');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const loadDashboardData = async () => {
    try {
      // Load content requests
      const { data: requests } = await supabase
        .from('content_requests')
        .select('*')
        .order('created_at', { ascending: false });

      // Load generated content
      const { data: content } = await supabase
        .from('generated_content')
        .select('*')
        .order('created_at', { ascending: false });

      // Load API usage stats
      const { data: usage } = await supabase
        .from('api_usage_logs')
        .select('service_name, cost_usd, success')
        .order('created_at', { ascending: false })
        .limit(1000);

      setContentRequests(requests || []);
      setGeneratedContent(content || []);

      // Calculate stats
      const totalRequests = requests?.length || 0;
      const completedContent = content?.filter(c => c.status === 'published').length || 0;
      const totalCost = usage?.reduce((sum, u) => sum + (u.cost_usd || 0), 0) || 0;
      const successfulCalls = usage?.filter(u => u.success).length || 0;
      const successRate = usage?.length ? Math.round((successfulCalls / usage.length) * 100) : 100;

      setStats({ totalRequests, completedContent, totalCost, successRate });

      // Group API usage by service
      const groupedUsage = usage?.reduce((acc: any, curr) => {
        const service = curr.service_name;
        if (!acc[service]) {
          acc[service] = { total_calls: 0, total_cost: 0, successful_calls: 0 };
        }
        acc[service].total_calls += 1;
        acc[service].total_cost += curr.cost_usd || 0;
        if (curr.success) acc[service].successful_calls += 1;
        return acc;
      }, {});

      const apiUsageStats = Object.entries(groupedUsage || {}).map(([service, data]: [string, any]) => ({
        service_name: service,
        total_calls: data.total_calls,
        total_cost: data.total_cost,
        success_rate: Math.round((data.successful_calls / data.total_calls) * 100)
      }));

      setApiUsage(apiUsageStats);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    }
  };

  const handleCreateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const keywords = contentForm.targetKeywords.split(',').map(k => k.trim()).filter(k => k);
      
      // Create content request
      const { data: request, error } = await supabase
        .from('content_requests')
        .insert({
          title: contentForm.title,
          content_type: contentForm.contentType,
          target_keywords: keywords,
          status: 'pending',
          progress: 0
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Content Request Created",
        description: "AI agents will begin processing your request",
      });

      // Clear form
      setContentForm({
        title: '',
        contentType: 'blog_post',
        targetKeywords: '',
        description: ''
      });

      // Start AI pipeline (simplified - would be orchestrated)
      startContentGeneration(request.id, keywords[0] || contentForm.title);

      // Reload data
      loadDashboardData();

    } catch (error: any) {
      toast({
        title: "Error Creating Content",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startContentGeneration = async (requestId: string, seedKeyword: string) => {
    try {
      // Start keyword research
      await supabase.functions.invoke('keyword-research-agent', {
        body: { seedKeyword, requestId }
      });

      // Start SERP analysis
      await supabase.functions.invoke('serp-analysis-agent', {
        body: { targetKeyword: seedKeyword, requestId }
      });

      // Start content generation
      setTimeout(async () => {
        await supabase.functions.invoke('content-generator-agent', {
          body: { requestId, contentType: 'blog_post', targetKeywords: [seedKeyword] }
        });
      }, 5000);

    } catch (error) {
      console.error('Error starting content generation:', error);
    }
  };

  // Login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass-card">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold gradient-text">Agentic AI Admin</span>
            </div>
            <CardTitle>Admin Dashboard Login</CardTitle>
            <CardDescription>
              Access the AI content generation system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="info@agentic-ai.ltd"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main admin dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold gradient-text">AI Content Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {adminSession?.user.email}
              </span>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card/30 backdrop-blur-sm border-r min-h-screen p-4">
          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'create', label: 'Create Content', icon: Plus },
              { id: 'content', label: 'Generated Content', icon: FileText },
              { id: 'requests', label: 'Content Requests', icon: Search },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={activeTab === id ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab(id)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </Button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold gradient-text">Dashboard Overview</h1>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Requests</p>
                        <p className="text-2xl font-bold">{stats.totalRequests}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Zap className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Published Content</p>
                        <p className="text-2xl font-bold">{stats.completedContent}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">API Cost</p>
                        <p className="text-2xl font-bold">${stats.totalCost.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Success Rate</p>
                        <p className="text-2xl font-bold">{stats.successRate}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Recent Content Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {contentRequests.slice(0, 5).map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{request.title}</p>
                            <p className="text-sm text-muted-foreground">{request.content_type}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              request.status === 'completed' ? 'default' :
                              request.status === 'generating' ? 'secondary' :
                              request.status === 'failed' ? 'destructive' : 'outline'
                            }>
                              {request.status}
                            </Badge>
                            <Progress value={request.progress} className="w-16" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>API Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {apiUsage.map((usage) => (
                        <div key={usage.service_name} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium capitalize">{usage.service_name}</p>
                            <p className="text-sm text-muted-foreground">{usage.total_calls} calls</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${usage.total_cost.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">{usage.success_rate}% success</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold gradient-text">Create New Content</h1>
              
              <Card className="glass-card max-w-2xl">
                <CardHeader>
                  <CardTitle>AI Content Generation</CardTitle>
                  <CardDescription>
                    Create SEO-optimized content using our AI agents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateContent} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Content Title</Label>
                      <Input
                        id="title"
                        value={contentForm.title}
                        onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                        placeholder="e.g., Complete Guide to AI Automation"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contentType">Content Type</Label>
                      <Select
                        value={contentForm.contentType}
                        onValueChange={(value) => setContentForm({ ...contentForm, contentType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blog_post">Blog Post</SelectItem>
                          <SelectItem value="page">Landing Page</SelectItem>
                          <SelectItem value="resource">Resource Guide</SelectItem>
                          <SelectItem value="case_study">Case Study</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="keywords">Target Keywords</Label>
                      <Input
                        id="keywords"
                        value={contentForm.targetKeywords}
                        onChange={(e) => setContentForm({ ...contentForm, targetKeywords: e.target.value })}
                        placeholder="ai automation, business intelligence, machine learning"
                        required
                      />
                      <p className="text-sm text-muted-foreground">
                        Separate keywords with commas
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        value={contentForm.description}
                        onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })}
                        placeholder="Brief description of the content focus..."
                        rows={3}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Creating Content...' : 'Generate Content with AI'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="glass-card max-w-2xl">
                <CardHeader>
                  <CardTitle>AI Pipeline Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Search className="h-5 w-5 text-primary" />
                      <span>1. Keyword Research (Perplexity AI)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <span>2. SERP Analysis (Perplexity AI)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <span>3. Content Generation (Claude Opus 4)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Image className="h-5 w-5 text-primary" />
                      <span>4. Image Generation (Flux Kontext Pro)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold gradient-text">Generated Content</h1>
                <Button onClick={loadDashboardData}>
                  Refresh
                </Button>
              </div>

              <div className="grid gap-6">
                {generatedContent.map((content) => (
                  <Card key={content.id} className="glass-card">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{content.title}</CardTitle>
                          <CardDescription>{content.meta_description}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={content.status === 'published' ? 'default' : 'secondary'}>
                            {content.status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Slug: /{content.slug}</span>
                        <span>•</span>
                        <span>Created: {new Date(content.created_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{content.content.length} characters</span>
                      </div>
                      
                      {content.seo_tags.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {content.seo_tags.slice(0, 5).map((tag, index) => (
                            <Badge key={index} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                      )}

                      {content.featured_image_url && (
                        <div className="mt-4">
                          <img
                            src={content.featured_image_url}
                            alt={content.title}
                            className="w-full max-w-md h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold gradient-text">Content Requests</h1>
              
              <div className="grid gap-4">
                {contentRequests.map((request) => (
                  <Card key={request.id} className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{request.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Type: {request.content_type} • Keywords: {request.target_keywords.join(', ')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Created: {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <Badge variant={
                              request.status === 'completed' ? 'default' :
                              request.status === 'generating' ? 'secondary' :
                              request.status === 'failed' ? 'destructive' : 'outline'
                            }>
                              {request.status}
                            </Badge>
                            <div className="flex items-center gap-2 mt-2">
                              <Progress value={request.progress} className="w-24" />
                              <span className="text-sm">{request.progress}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold gradient-text">Analytics & Performance</h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>API Usage by Service</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {apiUsage.map((usage) => (
                        <div key={usage.service_name} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium capitalize">{usage.service_name}</span>
                            <span className="text-sm">${usage.total_cost.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{usage.total_calls} calls</span>
                            <span>{usage.success_rate}% success</span>
                          </div>
                          <Progress value={usage.success_rate} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Content Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Total Content Pieces</span>
                        <span className="font-bold">{generatedContent.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Published</span>
                        <span className="font-bold">{generatedContent.filter(c => c.status === 'published').length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Draft</span>
                        <span className="font-bold">{generatedContent.filter(c => c.status === 'draft').length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Average Length</span>
                        <span className="font-bold">
                          {Math.round(generatedContent.reduce((sum, c) => sum + c.content.length, 0) / generatedContent.length || 0)} chars
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}