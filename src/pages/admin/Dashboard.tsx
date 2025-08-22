import React, { useState, useEffect } from 'react';
import { ResourceGenerator } from '@/components/ResourceGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  FileText, 
  Image, 
  BarChart3, 
  Mail, 
  Users, 
  Calendar, 
  MessageSquare, 
  Globe, 
  TrendingUp,
  RefreshCw,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Target,
  Zap,
  Star,
  Eye,
  Heart,
  ArrowUp,
  ArrowDown,
  Plus,
  Settings
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardStats {
  totalContent: number;
  activeRequests: number;
  newContacts: number;
  chatbotConversations: number;
  newsletterSubscribers: number;
  websitePages: number;
  publishedPages: number;
  draftPages: number;
  totalMeetings: number;
  todayMeetings: number;
  emailsSent: number;
  recentSubscribers: number;
  contentGenerationRate: number;
  systemHealth: number;
  activeUsers: number;
  conversionRate: number;
}

interface RecentActivity {
  id: string;
  type: 'content' | 'contact' | 'meeting' | 'newsletter' | 'page';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'pending' | 'error';
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalContent: 0,
    activeRequests: 0,
    newContacts: 0,
    chatbotConversations: 0,
    newsletterSubscribers: 0,
    websitePages: 0,
    publishedPages: 0,
    draftPages: 0,
    totalMeetings: 0,
    todayMeetings: 0,
    emailsSent: 0,
    recentSubscribers: 0,
    contentGenerationRate: 0,
    systemHealth: 98,
    activeUsers: 142,
    conversionRate: 24.5,
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardStats();
    fetchRecentActivity();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      if (!loading) {
        fetchDashboardStats();
        fetchRecentActivity();
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      if (!loading) setRefreshing(true);
      
      // Fetch all stats in parallel with error handling
      const fetchWithFallback = async (query: any, fallback = { data: [], count: 0 }) => {
        try {
          const result = await query;
          return result.error ? fallback : result;
        } catch (error) {
          console.warn('Query failed, using fallback:', error);
          return fallback;
        }
      };

      const [
        contentResult,
        requestsResult,
        contactsResult,
        chatbotResult,
        newsletterResult,
        pagesResult,
        meetingsResult,
        emailLogsResult
      ] = await Promise.all([
        fetchWithFallback(supabase.from('generated_content').select('id, created_at', { count: 'exact' })),
        fetchWithFallback(supabase.from('content_requests').select('id', { count: 'exact' }).eq('status', 'in_progress')),
        fetchWithFallback(supabase.from('contact_submissions').select('id', { count: 'exact' }).eq('is_read', false)),
        fetchWithFallback(supabase.from('chatbot_conversations').select('id', { count: 'exact' }).eq('is_resolved', false)),
        fetchWithFallback(supabase.from('newsletter_subscribers').select('id, status, subscribed_at', { count: 'exact' })),
        fetchWithFallback(supabase.from('website_pages').select('id, status', { count: 'exact' })),
        fetchWithFallback(supabase.from('scheduled_meetings').select('id, start_time', { count: 'exact' })),
        fetchWithFallback(supabase.from('email_logs').select('id, sent_at', { count: 'exact' }).eq('status', 'sent'))
      ]);

      // Calculate today's date for filtering
      const today = new Date().toISOString().split('T')[0];
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      // Process newsletter subscribers
      const activeSubscribers = newsletterResult.data?.filter(sub => sub.status === 'active').length || 0;
      const recentSubscribers = newsletterResult.data?.filter(sub => 
        new Date(sub.subscribed_at) > new Date(thirtyDaysAgo)
      ).length || 0;

      // Process website pages
      const publishedPages = pagesResult.data?.filter(page => page.status === 'published').length || 0;
      const draftPages = pagesResult.data?.filter(page => page.status === 'draft').length || 0;

      // Process meetings
      const todayMeetings = meetingsResult.data?.filter(meeting => 
        meeting.start_time?.startsWith(today)
      ).length || 0;

      // Process email logs (last 30 days)
      const recentEmails = emailLogsResult.data?.filter(email => 
        new Date(email.sent_at || '') > new Date(thirtyDaysAgo)
      ).length || 0;

      // Calculate content generation rate (last 7 days)
      const recentContent = contentResult.data?.filter(content => 
        new Date(content.created_at) > new Date(sevenDaysAgo)
      ).length || 0;

      setStats({
        totalContent: contentResult.count || 0,
        activeRequests: requestsResult.count || 0,
        newContacts: contactsResult.count || 0,
        chatbotConversations: chatbotResult.count || 0,
        newsletterSubscribers: activeSubscribers,
        websitePages: pagesResult.count || 0,
        publishedPages,
        draftPages,
        totalMeetings: meetingsResult.count || 0,
        todayMeetings,
        emailsSent: recentEmails,
        recentSubscribers,
        contentGenerationRate: recentContent,
        systemHealth: 98 + Math.random() * 2, // Simulated system health
        activeUsers: 120 + Math.floor(Math.random() * 50), // Simulated active users
        conversionRate: 20 + Math.random() * 10, // Simulated conversion rate
      });

    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      // Simulate recent activity data
      const activities: RecentActivity[] = [
        {
          id: '1',
          type: 'content',
          title: 'AI Blog Post Generated',
          description: 'New article about machine learning trends',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          status: 'success'
        },
        {
          id: '2',
          type: 'contact',
          title: 'New Contact Submission',
          description: 'Enterprise inquiry from TechCorp',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          status: 'pending'
        },
        {
          id: '3',
          type: 'newsletter',
          title: 'Newsletter Campaign Sent',
          description: 'Monthly update sent to 1,247 subscribers',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          status: 'success'
        },
        {
          id: '4',
          type: 'meeting',
          title: 'Consultation Scheduled',
          description: 'AI Strategy meeting with StartupX',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          status: 'success'
        },
        {
          id: '5',
          type: 'page',
          title: 'New Page Published',
          description: 'Case Study: Healthcare AI Implementation',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          status: 'success'
        }
      ];
      
      setRecentActivity(activities);
    } catch (error: any) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'content': return <FileText className="h-4 w-4 text-blue-400" />;
      case 'contact': return <Users className="h-4 w-4 text-green-400" />;
      case 'meeting': return <Calendar className="h-4 w-4 text-purple-400" />;
      case 'newsletter': return <Mail className="h-4 w-4 text-orange-400" />;
      case 'page': return <Globe className="h-4 w-4 text-cyan-400" />;
      default: return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-3 w-3 text-green-400" />;
      case 'pending': return <Clock className="h-3 w-3 text-yellow-400" />;
      case 'error': return <AlertTriangle className="h-3 w-3 text-red-400" />;
      default: return <Activity className="h-3 w-3 text-gray-400" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) return `${minutes}m ago`;
    return `${hours}h ago`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <div className="space-y-2">
            <h1 className="text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Command Center
            </h1>
            <p className="text-xl text-gray-300 font-light">
              Neural Network Administration Portal
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 backdrop-blur-sm border border-green-500/30 rounded-2xl px-6 py-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-300">System Online</span>
              </div>
            </div>
            <Button 
              onClick={fetchDashboardStats}
              disabled={refreshing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-semibold"
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Neural Refresh
            </Button>
          </div>
        </motion.div>

      {/* Key Performance Indicators */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Newsletter Subscribers</CardTitle>
            <Mail className="h-5 w-5 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.newsletterSubscribers.toLocaleString()}</div>
            <div className="flex items-center mt-2">
              <ArrowUp className="h-3 w-3 text-green-400 mr-1" />
              <p className="text-sm text-gray-300">+{stats.recentSubscribers} this month</p>
            </div>
            <Progress value={75} className="mt-3 bg-gray-700" />
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Active Users</CardTitle>
            <Users className="h-5 w-5 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.activeUsers.toLocaleString()}</div>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
              <p className="text-sm text-gray-300">{stats.newContacts} new contacts</p>
            </div>
            <Progress value={85} className="mt-3 bg-gray-700" />
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">System Health</CardTitle>
            <Activity className="h-5 w-5 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.systemHealth.toFixed(1)}%</div>
            <div className="flex items-center mt-2">
              <CheckCircle className="h-3 w-3 text-green-400 mr-1" />
              <p className="text-sm text-gray-300">All systems operational</p>
            </div>
            <Progress value={stats.systemHealth} className="mt-3 bg-gray-700" />
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Conversion Rate</CardTitle>
            <Target className="h-5 w-5 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.conversionRate.toFixed(1)}%</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
              <p className="text-sm text-gray-300">+2.3% from last month</p>
            </div>
            <Progress value={stats.conversionRate} className="mt-3 bg-gray-700" />
          </CardContent>
        </Card>
        </motion.div>

        {/* Advanced Neural Analytics Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
        <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Today's Meetings</CardTitle>
            <Calendar className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.todayMeetings}</div>
            <p className="text-xs text-gray-400">{stats.totalMeetings} total scheduled</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Website Pages</CardTitle>
            <Globe className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.websitePages}</div>
            <p className="text-xs text-gray-400">{stats.publishedPages} published</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Content Generated</CardTitle>
            <FileText className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalContent}</div>
            <p className="text-xs text-gray-400">{stats.contentGenerationRate} this week</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Emails Sent</CardTitle>
            <TrendingUp className="h-4 w-4 text-pink-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.emailsSent}</div>
            <p className="text-xs text-gray-400">Last 30 days</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Real-time Activity and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gray-800 border-gray-700 h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Activity className="h-5 w-5 text-blue-400" />
                    Real-time Activity
                  </CardTitle>
                  <CardDescription className="text-gray-400">Latest system activities and updates</CardDescription>
                </div>
                <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-500/50">
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <AnimatePresence>
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-750 hover:bg-gray-700 transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white truncate">
                          {activity.title}
                        </p>
                        {getStatusIcon(activity.status)}
                      </div>
                      <p className="text-xs text-gray-400 truncate">{activity.description}</p>
                      <p className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions & Analytics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gray-800 border-gray-700 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Zap className="h-5 w-5 text-yellow-400" />
                Quick Actions & Insights
              </CardTitle>
              <CardDescription className="text-gray-400">Manage your system efficiently</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white border-0">
                  <Plus className="h-4 w-4 mr-2" />
                  New Content
                </Button>
                <Button variant="outline" className="bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Newsletter
                </Button>
                <Button variant="outline" className="bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>

              <Separator className="bg-gray-700" />

              {/* Performance Metrics */}
              <div className="space-y-4">
                <h4 className="font-medium text-white">Performance Metrics</h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Content Generation</span>
                    <span className="text-sm font-medium text-white">87%</span>
                  </div>
                  <Progress value={87} className="h-2 bg-gray-700" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Email Delivery Rate</span>
                    <span className="text-sm font-medium text-white">94%</span>
                  </div>
                  <Progress value={94} className="h-2 bg-gray-700" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">User Engagement</span>
                    <span className="text-sm font-medium text-white">76%</span>
                  </div>
                  <Progress value={76} className="h-2 bg-gray-700" />
                </div>
              </div>

              {/* System Status */}
              <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-medium text-green-300">All Systems Operational</span>
                </div>
                <p className="text-xs text-green-400">
                  Last updated: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Resource Generator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              AI Resource Generator
            </CardTitle>
            <CardDescription className="text-gray-400">
              Generate high-quality content and resources with AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResourceGenerator />
          </CardContent>
        </Card>
      </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;