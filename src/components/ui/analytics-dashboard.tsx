import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  FileText,
  MessageCircle,
  Calendar,
  Zap,
  Clock,
  CheckCircle
} from 'lucide-react';

interface AnalyticsData {
  totalContent: number;
  publishedContent: number;
  draftContent: number;
  totalContacts: number;
  newContacts: number;
  chatbotConversations: number;
  activeConversations: number;
  contentRequests: number;
  completedRequests: number;
  successRate: number;
  averageGenerationTime: number;
  totalApiCalls: number;
  monthlyGrowth: number;
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
  isLoading?: boolean;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data, isLoading = false }) => {
  const metrics = [
    {
      title: "Content Generated",
      value: data.totalContent,
      change: data.monthlyGrowth,
      icon: FileText,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      trend: data.monthlyGrowth > 0 ? 'up' : 'down'
    },
    {
      title: "Success Rate",
      value: `${data.successRate}%`,
      change: 2.5,
      icon: CheckCircle,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      trend: 'up'
    },
    {
      title: "Active Conversations",
      value: data.activeConversations,
      change: 15,
      icon: MessageCircle,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      trend: 'up'
    },
    {
      title: "API Calls",
      value: data.totalApiCalls,
      change: -5,
      icon: Zap,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
      trend: 'down'
    }
  ];

  const contentStats = [
    { label: "Published", value: data.publishedContent, total: data.totalContent, color: "bg-green-500" },
    { label: "Draft", value: data.draftContent, total: data.totalContent, color: "bg-yellow-500" },
    { label: "In Progress", value: data.contentRequests - data.completedRequests, total: data.totalContent, color: "bg-blue-500" }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
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
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-slate-900/60 backdrop-blur-xl border-purple-500/30 hover:border-purple-400/50 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{metric.title}</p>
                  <p className="text-2xl font-bold text-white">{metric.value}</p>
                  <div className="flex items-center mt-2">
                    {metric.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
                    )}
                    <span className={`text-sm ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {Math.abs(metric.change)}%
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${metric.bgColor}`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Distribution */}
      <Card className="bg-slate-900/60 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Content Distribution</CardTitle>
          <CardDescription className="text-slate-300">
            Overview of content status and distribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contentStats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">{stat.label}</span>
                  <span className="text-white font-medium">
                    {stat.value} ({stat.total > 0 ? Math.round((stat.value / stat.total) * 100) : 0}%)
                  </span>
                </div>
                <Progress 
                  value={stat.total > 0 ? (stat.value / stat.total) * 100 : 0} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900/60 backdrop-blur-xl border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Generation Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Average Generation Time</span>
                <span className="text-white font-medium">{data.averageGenerationTime}s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Success Rate</span>
                <Badge variant="default" className="bg-green-500/20 text-green-400">
                  {data.successRate}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Total Requests</span>
                <span className="text-white font-medium">{data.contentRequests}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 backdrop-blur-xl border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">User Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Total Contacts</span>
                <span className="text-white font-medium">{data.totalContacts}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">New This Month</span>
                <Badge variant="default" className="bg-blue-500/20 text-blue-400">
                  {data.newContacts}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Chatbot Conversations</span>
                <span className="text-white font-medium">{data.chatbotConversations}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card className="bg-slate-900/60 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">System Health</CardTitle>
          <CardDescription className="text-slate-300">
            Real-time system status and performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mx-auto mb-2">
                <Activity className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">99.9%</div>
              <div className="text-sm text-slate-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mx-auto mb-2">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">{data.averageGenerationTime}s</div>
              <div className="text-sm text-slate-400">Avg Response</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-full mx-auto mb-2">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">{data.totalApiCalls}</div>
              <div className="text-sm text-slate-400">API Calls</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;