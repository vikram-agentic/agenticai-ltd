// ARTICLE ANALYTICS DASHBOARD
// Comprehensive analytics and performance tracking for AI-generated articles
// Real-time monitoring of rankings, engagement, and SEO performance

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Eye, MousePointerClick, Search,
  BarChart3, PieChart, Users, Calendar, Clock, Target,
  ArrowUp, ArrowDown, Minus, Filter, Download, RefreshCw
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import useArticles, { Article, ArticleMetrics } from '@/hooks/useArticles';
import { useToast } from '@/hooks/use-toast';

interface PerformanceMetric {
  label: string;
  value: number;
  previousValue: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ElementType;
  format: 'number' | 'percentage' | 'duration' | 'currency';
}

interface RankingData {
  keyword: string;
  currentPosition: number;
  previousPosition: number;
  change: number;
  searchVolume: number;
  difficulty: number;
  url: string;
}

const ArticleAnalytics = () => {
  const { articles, metrics, loading } = useArticles({
    status: ['published'],
    sortBy: 'published_at',
    sortOrder: 'desc'
  });
  const { toast } = useToast();

  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [topPerformers, setTopPerformers] = useState<Article[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [rankingData, setRankingData] = useState<RankingData[]>([]);

  useEffect(() => {
    if (articles.length > 0) {
      calculatePerformanceMetrics();
      identifyTopPerformers();
      mockRankingData(); // In production, fetch from ranking API
    }
  }, [articles]);

  const calculatePerformanceMetrics = () => {
    const totalViews = articles.reduce((sum, article) => sum + article.views_count, 0);
    const totalClicks = articles.reduce((sum, article) => sum + article.clicks_count, 0);
    const avgEngagement = articles.reduce((sum, article) => sum + article.engagement_rate, 0) / articles.length;
    const avgSeoScore = articles.reduce((sum, article) => sum + article.seo_score, 0) / articles.length;

    // Mock previous period data (in production, fetch from database)
    const previousViews = Math.round(totalViews * (0.8 + Math.random() * 0.4));
    const previousClicks = Math.round(totalClicks * (0.8 + Math.random() * 0.4));
    const previousEngagement = avgEngagement * (0.8 + Math.random() * 0.4);
    const previousSeo = avgSeoScore * (0.95 + Math.random() * 0.1);

    const metrics: PerformanceMetric[] = [
      {
        label: 'Total Views',
        value: totalViews,
        previousValue: previousViews,
        change: ((totalViews - previousViews) / previousViews) * 100,
        changeType: totalViews > previousViews ? 'increase' : totalViews < previousViews ? 'decrease' : 'neutral',
        icon: Eye,
        format: 'number'
      },
      {
        label: 'Total Clicks',
        value: totalClicks,
        previousValue: previousClicks,
        change: ((totalClicks - previousClicks) / previousClicks) * 100,
        changeType: totalClicks > previousClicks ? 'increase' : totalClicks < previousClicks ? 'decrease' : 'neutral',
        icon: MousePointerClick,
        format: 'number'
      },
      {
        label: 'Avg Engagement',
        value: avgEngagement * 100,
        previousValue: previousEngagement * 100,
        change: (((avgEngagement - previousEngagement) / previousEngagement) * 100),
        changeType: avgEngagement > previousEngagement ? 'increase' : avgEngagement < previousEngagement ? 'decrease' : 'neutral',
        icon: Users,
        format: 'percentage'
      },
      {
        label: 'Avg SEO Score',
        value: avgSeoScore,
        previousValue: previousSeo,
        change: ((avgSeoScore - previousSeo) / previousSeo) * 100,
        changeType: avgSeoScore > previousSeo ? 'increase' : avgSeoScore < previousSeo ? 'decrease' : 'neutral',
        icon: Search,
        format: 'number'
      }
    ];

    setPerformanceMetrics(metrics);
  };

  const identifyTopPerformers = () => {
    const sorted = [...articles]
      .sort((a, b) => {
        const scoreA = (a.views_count * 0.4) + (a.engagement_rate * 1000 * 0.3) + (a.seo_score * 0.3);
        const scoreB = (b.views_count * 0.4) + (b.engagement_rate * 1000 * 0.3) + (b.seo_score * 0.3);
        return scoreB - scoreA;
      })
      .slice(0, 5);
    
    setTopPerformers(sorted);
  };

  const mockRankingData = () => {
    // In production, this would fetch from your ranking tracking service
    const mockData: RankingData[] = articles.slice(0, 10).map(article => ({
      keyword: article.primary_keyword || 'AI consulting',
      currentPosition: Math.floor(Math.random() * 50) + 1,
      previousPosition: Math.floor(Math.random() * 50) + 1,
      change: 0,
      searchVolume: Math.floor(Math.random() * 10000) + 500,
      difficulty: Math.floor(Math.random() * 80) + 20,
      url: `/blog/${article.slug}`
    }));

    // Calculate changes
    mockData.forEach(item => {
      item.change = item.previousPosition - item.currentPosition;
    });

    setRankingData(mockData);
  };

  const formatValue = (value: number, format: PerformanceMetric['format']) => {
    switch (format) {
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'duration':
        return `${Math.round(value)}min`;
      case 'currency':
        return `$${value.toLocaleString()}`;
      default:
        return value.toLocaleString();
    }
  };

  const getTrendIcon = (changeType: PerformanceMetric['changeType']) => {
    switch (changeType) {
      case 'increase':
        return <ArrowUp className="h-3 w-3 text-green-500" />;
      case 'decrease':
        return <ArrowDown className="h-3 w-3 text-red-500" />;
      default:
        return <Minus className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const exportAnalytics = () => {
    const csvData = articles.map(article => ({
      title: article.title,
      slug: article.slug,
      views: article.views_count,
      clicks: article.clicks_count,
      engagement: article.engagement_rate,
      seoScore: article.seo_score,
      wordCount: article.word_count,
      publishedAt: article.published_at
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `article-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Analytics Exported",
      description: "Analytics data has been downloaded as CSV file.",
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Article Analytics</h1>
          <p className="text-muted-foreground">
            Monitor performance, rankings, and engagement of your AI-generated articles
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={exportAnalytics}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  {getTrendIcon(metric.changeType)}
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.label}
                  </p>
                  <p className="text-2xl font-bold">
                    {formatValue(metric.value, metric.format)}
                  </p>
                  <p className={`text-xs ${
                    metric.changeType === 'increase' ? 'text-green-600' :
                    metric.changeType === 'decrease' ? 'text-red-600' :
                    'text-muted-foreground'
                  }`}>
                    {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}% vs previous period
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="content">Content Analysis</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top Performing Articles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Top Performing Articles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topPerformers.map((article, index) => (
                  <div key={article.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          #{index + 1}
                        </Badge>
                        <h4 className="font-medium line-clamp-1 text-sm">
                          {article.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {article.views_count.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {(article.engagement_rate * 100).toFixed(1)}%
                        </span>
                        <span className="flex items-center gap-1">
                          <Search className="h-3 w-3" />
                          {article.seo_score}/100
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Content Quality Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Content Quality Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Excellent (90-100)</span>
                    <span className="text-sm font-medium">
                      {articles.filter(a => a.seo_score >= 90).length}
                    </span>
                  </div>
                  <Progress 
                    value={(articles.filter(a => a.seo_score >= 90).length / articles.length) * 100} 
                    className="h-2"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Good (80-89)</span>
                    <span className="text-sm font-medium">
                      {articles.filter(a => a.seo_score >= 80 && a.seo_score < 90).length}
                    </span>
                  </div>
                  <Progress 
                    value={(articles.filter(a => a.seo_score >= 80 && a.seo_score < 90).length / articles.length) * 100} 
                    className="h-2"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average (70-79)</span>
                    <span className="text-sm font-medium">
                      {articles.filter(a => a.seo_score >= 70 && a.seo_score < 80).length}
                    </span>
                  </div>
                  <Progress 
                    value={(articles.filter(a => a.seo_score >= 70 && a.seo_score < 80).length / articles.length) * 100} 
                    className="h-2"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Needs Improvement (&lt;70)</span>
                    <span className="text-sm font-medium">
                      {articles.filter(a => a.seo_score < 70).length}
                    </span>
                  </div>
                  <Progress 
                    value={(articles.filter(a => a.seo_score < 70).length / articles.length) * 100} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Rankings Tab */}
        <TabsContent value="rankings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Keyword Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rankingData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium mb-1">{item.keyword}</div>
                      <div className="text-sm text-muted-foreground">
                        Volume: {item.searchVolume.toLocaleString()} • Difficulty: {item.difficulty}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-lg font-bold">{item.currentPosition}</div>
                        <div className="text-xs text-muted-foreground">Current</div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {item.change > 0 ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            <ArrowUp className="h-3 w-3 mr-1" />
                            +{item.change}
                          </Badge>
                        ) : item.change < 0 ? (
                          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                            <ArrowDown className="h-3 w-3 mr-1" />
                            {item.change}
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <Minus className="h-3 w-3 mr-1" />
                            No change
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Article Performance List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Article Performance Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {articles.slice(0, 10).map(article => (
                      <div key={article.id} className="p-4 border border-border/50 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-medium line-clamp-2 flex-1 pr-4">
                            {article.title}
                          </h4>
                          <Badge 
                            variant={article.seo_score >= 80 ? "default" : article.seo_score >= 60 ? "secondary" : "destructive"}
                            className="text-xs"
                          >
                            SEO: {article.seo_score}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Views</div>
                            <div className="font-medium">{article.views_count.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Clicks</div>
                            <div className="font-medium">{article.clicks_count.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Engagement</div>
                            <div className="font-medium">{(article.engagement_rate * 100).toFixed(1)}%</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Words</div>
                            <div className="font-medium">{article.word_count.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Total Articles</span>
                    <span className="font-medium">{metrics.totalArticles}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Published</span>
                    <span className="font-medium">{metrics.publishedArticles}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">In Draft</span>
                    <span className="font-medium">{metrics.draftArticles}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Avg SEO Score</span>
                    <span className="font-medium">{metrics.averageSeoScore}/100</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Avg Word Count</span>
                    <span className="font-medium">{metrics.averageWordCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Total Views</span>
                    <span className="font-medium">{metrics.totalViews.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Content Analysis Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Quality Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">High-performing keywords</span>
                    <span className="text-sm font-medium">
                      {articles.filter(a => a.seo_score >= 85).length}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Articles needing optimization</span>
                    <span className="text-sm font-medium">
                      {articles.filter(a => a.seo_score < 70).length}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg reading time</span>
                    <span className="text-sm font-medium">
                      {Math.round(articles.reduce((sum, a) => sum + a.reading_time, 0) / articles.length)} min
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Automation Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">AI Generated</span>
                    <span className="text-sm font-medium">
                      {articles.filter(a => a.generation_method === 'auto').length}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Manual Creation</span>
                    <span className="text-sm font-medium">
                      {articles.filter(a => a.generation_method === 'manual').length}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg AI Confidence</span>
                    <span className="text-sm font-medium">
                      {Math.round(articles.reduce((sum, a) => sum + (a.ai_confidence_score * 100), 0) / articles.length)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArticleAnalytics;