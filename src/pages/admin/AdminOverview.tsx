import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  FileText,
  MessageCircle,
  Calendar,
  Mail,
  Globe,
  Brain,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Plus
} from 'lucide-react';

interface DashboardStats {
  totalContent: number;
  publishedContent: number;
  draftContent: number;
  totalRequests: number;
  completedRequests: number;
  activeRequests: number;
  totalContacts: number;
  newContacts: number;
  chatbotConversations: number;
  activeChats: number;
  newsletterSubscribers: number;
  meetingBookings: number;
  apiCallsToday: number;
  successRate: number;
}

interface RecentActivity {
  id: string;
  type: 'content' | 'contact' | 'chat' | 'meeting' | 'newsletter';
  title: string;
  description: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'error';
}

const AdminOverview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalContent: 0,
    publishedContent: 0,
    draftContent: 0,
    totalRequests: 0,
    completedRequests: 0,
    activeRequests: 0,
    totalContacts: 0,
    newContacts: 0,
    chatbotConversations: 0,
    activeChats: 0,
    newsletterSubscribers: 0,
    meetingBookings: 0,
    apiCallsToday: 0,
    successRate: 95
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load all data in parallel
      const [
        contentRequests,
        generatedContent,
        contactSubmissions,
        chatbotConversations,
        meetingBookings,
        apiLogs
      ] = await Promise.all([
        supabase.from('content_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('generated_content').select('*').order('created_at', { ascending: false }),
        supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }),
        supabase.from('chatbot_conversations').select('*').order('created_at', { ascending: false }),
        supabase.from('meeting_bookings').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('api_usage_logs').select('*').gte('created_at', new Date(Date.now() - 24*60*60*1000).toISOString())
      ]);

      // Calculate stats
      const newStats: DashboardStats = {
        totalContent: generatedContent.data?.length || 0,
        publishedContent: generatedContent.data?.filter(c => c.status === 'published').length || 0,
        draftContent: generatedContent.data?.filter(c => c.status === 'draft').length || 0,
        totalRequests: contentRequests.data?.length || 0,
        completedRequests: contentRequests.data?.filter(r => r.status === 'completed').length || 0,
        activeRequests: contentRequests.data?.filter(r => r.status === 'processing').length || 0,
        totalContacts: contactSubmissions.data?.length || 0,
        newContacts: contactSubmissions.data?.filter(c => c.status === 'new').length || 0,
        chatbotConversations: chatbotConversations.data?.length || 0,
        activeChats: chatbotConversations.data?.filter(c => c.status === 'active').length || 0,
        newsletterSubscribers: 0, // Will be implemented when newsletter table is created
        meetingBookings: meetingBookings.data?.length || 0,
        apiCallsToday: apiLogs.data?.length || 0,
        successRate: apiLogs.data?.length ? Math.round((apiLogs.data.filter(l => l.success).length / apiLogs.data.length) * 100) : 95
      };

      setStats(newStats);

      // Generate recent activity
      const activities: RecentActivity[] = [
        ...contentRequests.data?.slice(0, 3).map(r => ({
          id: r.id,
          type: 'content' as const,
          title: `Content Request: ${r.title}`,
          description: `${r.content_type} - ${r.status}`,
          timestamp: new Date(r.created_at),
          status: r.status === 'completed' ? 'success' as const : r.status === 'failed' ? 'error' as const : 'pending' as const
        })) || [],
        ...generatedContent.data?.slice(0, 3).map(c => ({
          id: c.id,
          type: 'content' as const,
          title: `Generated: ${c.title}`,
          description: c.status === 'published' ? 'Published' : 'Draft',
          timestamp: new Date(c.created_at),
          status: 'success' as const
        })) || [],
        ...contactSubmissions.data?.slice(0, 2).map(c => ({
          id: c.id,
          type: 'contact' as const,
          title: `Contact: ${c.name}`,
          description: c.email,
          timestamp: new Date(c.created_at),
          status: 'success' as const
        })) || [],
        ...chatbotConversations.data?.slice(0, 2).map(c => ({
          id: c.id,
          type: 'chat' as const,
          title: `Chat: ${c.user_name || 'Anonymous'}`,
          description: c.status,
          timestamp: new Date(c.created_at),
          status: 'success' as const
        })) || []
      ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);

      setRecentActivity(activities);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Generate Content',
      description: 'Create new AI-powered content',
      icon: Brain,
      color: 'purple',
      path: '/admin/content-generator'
    },
    {
      title: 'Manage Website',
      description: 'Update website pages',
      icon: Globe,
      color: 'blue',
      path: '/admin/website'
    },
    {
      title: 'View Contacts',
      description: 'Check new submissions',
      icon: Mail,
      color: 'green',
      path: '/admin/contacts'
    },
    {
      title: 'Configure Chatbot',
      description: 'Update AI responses',
      icon: MessageCircle,
      color: 'yellow',
      path: '/admin/chatbot'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'content': return FileText;
      case 'contact': return Mail;
      case 'chat': return MessageCircle;
      case 'meeting': return Calendar;
      case 'newsletter': return Users;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'pending': return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-slate-900/60 backdrop-blur-xl border-purple-500/30">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-slate-700 rounded w-1/4 mb-4"></div>
                  <div className="h-8 bg-slate-700 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-slate-400">Welcome to your Agentic AI admin dashboard</p>
        </div>
        <Button 
          onClick={loadDashboardData}
          variant="outline" 
          className="border-purple-400 text-purple-300 hover:bg-purple-500/20"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900/60 backdrop-blur-xl border-purple-500/30 hover:border-purple-400/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Content</CardTitle>
            <FileText className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalContent}</div>
            <div className="flex items-center text-xs text-slate-400">
              <TrendingUp className="w-3 h-3 mr-1 text-green-400" />
              {stats.publishedContent} published
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 backdrop-blur-xl border-purple-500/30 hover:border-purple-400/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Active Requests</CardTitle>
            <Activity className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.activeRequests}</div>
            <div className="flex items-center text-xs text-slate-400">
              <Clock className="w-3 h-3 mr-1 text-blue-400" />
              {stats.completedRequests} completed
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 backdrop-blur-xl border-purple-500/30 hover:border-purple-400/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">New Contacts</CardTitle>
            <Mail className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.newContacts}</div>
            <div className="flex items-center text-xs text-slate-400">
              <Users className="w-3 h-3 mr-1 text-green-400" />
              {stats.totalContacts} total
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 backdrop-blur-xl border-purple-500/30 hover:border-purple-400/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.successRate}%</div>
            <div className="flex items-center text-xs text-slate-400">
              <Zap className="w-3 h-3 mr-1 text-yellow-400" />
              {stats.apiCallsToday} API calls today
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-slate-900/60 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription className="text-slate-300">
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start space-y-2 border-slate-700 hover:border-purple-500/50 hover:bg-slate-800/50"
                onClick={() => navigate(action.path)}
              >
                <div className="flex items-center w-full">
                  <action.icon className={`w-5 h-5 mr-2 text-${action.color}-400`} />
                  <ArrowRight className="w-4 h-4 ml-auto text-slate-500" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-white">{action.title}</div>
                  <div className="text-xs text-slate-400">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <Card className="bg-slate-900/60 backdrop-blur-xl border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Content Generation</span>
              <Badge variant="default" className="bg-green-500/20 text-green-400">
                <CheckCircle className="w-3 h-3 mr-1" />
                Online
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Chatbot Service</span>
              <Badge variant="default" className="bg-blue-500/20 text-blue-400">
                <Activity className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Database</span>
              <Badge variant="default" className="bg-purple-500/20 text-purple-400">
                <Zap className="w-3 h-3 mr-1" />
                Healthy
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">API Services</span>
              <Badge variant="default" className="bg-green-500/20 text-green-400">
                <Globe className="w-3 h-3 mr-1" />
                Running
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-slate-900/60 backdrop-blur-xl border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-slate-300">
              Latest system events and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                  <p className="text-slate-400">No recent activity</p>
                </div>
              ) : (
                recentActivity.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-800/30">
                      <Icon className={`w-4 h-4 mt-1 ${getStatusColor(activity.status)}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-200 truncate">{activity.title}</p>
                        <p className="text-xs text-slate-400">{activity.description}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {activity.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/60 backdrop-blur-xl border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Content Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-300">Published</span>
                <span className="text-white">{stats.publishedContent}</span>
              </div>
              <Progress value={(stats.publishedContent / Math.max(stats.totalContent, 1)) * 100} className="h-2" />
              <div className="flex justify-between text-xs text-slate-400">
                <span>Draft: {stats.draftContent}</span>
                <span>Total: {stats.totalContent}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 backdrop-blur-xl border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Request Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-300">Completed</span>
                <span className="text-white">{stats.completedRequests}</span>
              </div>
              <Progress value={(stats.completedRequests / Math.max(stats.totalRequests, 1)) * 100} className="h-2" />
              <div className="flex justify-between text-xs text-slate-400">
                <span>Active: {stats.activeRequests}</span>
                <span>Total: {stats.totalRequests}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 backdrop-blur-xl border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">User Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-300">Contacts</span>
                <span className="text-white">{stats.totalContacts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Chats</span>
                <span className="text-white">{stats.chatbotConversations}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Meetings</span>
                <span className="text-white">{stats.meetingBookings}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;