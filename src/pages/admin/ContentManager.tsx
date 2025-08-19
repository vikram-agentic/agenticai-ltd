import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Brain,
  Sparkles,
  Search,
  CheckCircle,
  Eye,
  Trash2,
  Copy,
  Upload,
  FileText,
  Calendar,
  MoreHorizontal,
  Edit3,
  RefreshCw,
  Filter,
  Plus,
  BarChart3,
  Send,
  BookOpen,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth } from 'date-fns';

interface GeneratedContent {
  id: string;
  request_id?: string;
  title: string;
  meta_description?: string;
  slug: string;
  content: string;
  outline?: any;
  seo_tags?: string[];
  categories?: string[];
  featured_image_url?: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  published_at?: string;
  scheduled_at?: string;
  created_at: string;
  updated_at: string;
}

interface ContentStats {
  totalContent: number;
  publishedContent: number;
  draftContent: number;
  scheduledContent: number;
  thisMonthContent: number;
  totalViews: number;
  avgWordsPerPost: number;
}

interface ArticleForm {
  title: string;
  metaDescription: string;
  slug: string;
  content: string;
  categories: string[];
  seoTags: string[];
  status: 'draft' | 'published' | 'scheduled';
  scheduledAt: string;
  featuredImagePrompt: string;
}

const ContentManager = () => {
  const { toast } = useToast();

  // State Management
  const [articles, setArticles] = useState<GeneratedContent[]>([]);
  const [stats, setStats] = useState<ContentStats>({
    totalContent: 0,
    publishedContent: 0,
    draftContent: 0,
    scheduledContent: 0,
    thisMonthContent: 0,
    totalViews: 0,
    avgWordsPerPost: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<GeneratedContent | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [generatingFromCSV, setGeneratingFromCSV] = useState(false);
  const [csvProgress, setCsvProgress] = useState(0);

  // Article Form State
  const [articleForm, setArticleForm] = useState<ArticleForm>({
    title: '',
    metaDescription: '',
    slug: '',
    content: '',
    categories: [],
    seoTags: [],
    status: 'draft',
    scheduledAt: '',
    featuredImagePrompt: ''
  });

  // Load articles on mount
  useEffect(() => {
    loadArticles();
    calculateStats();
  }, []);

  // Filter articles
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.seo_tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || 
        article.categories?.includes(categoryFilter);
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [articles, searchTerm, statusFilter, categoryFilter]);

  // Get unique categories
  const uniqueCategories = useMemo(() => {
    const categories = articles.flatMap(a => a.categories || []);
    return [...new Set(categories)];
  }, [articles]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('generated_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error: any) {
      console.error('Error loading articles:', error);
      toast({
        title: "Error",
        description: "Failed to load articles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = async () => {
    try {
      const { data, error } = await supabase
        .from('generated_content')
        .select('*');

      if (error) throw error;

      const thisMonth = new Date();
      const startOfCurrentMonth = startOfMonth(thisMonth);
      const endOfCurrentMonth = endOfMonth(thisMonth);

      const totalContent = data?.length || 0;
      const publishedContent = data?.filter(a => a.status === 'published').length || 0;
      const draftContent = data?.filter(a => a.status === 'draft').length || 0;
      const scheduledContent = data?.filter(a => a.status === 'scheduled').length || 0;
      
      const thisMonthContent = data?.filter(a => {
        const created = new Date(a.created_at);
        return created >= startOfCurrentMonth && created <= endOfCurrentMonth;
      }).length || 0;

      const totalWords = data?.reduce((acc, article) => {
        const wordCount = article.content.split(' ').length;
        return acc + wordCount;
      }, 0) || 0;

      setStats({
        totalContent,
        publishedContent,
        draftContent,
        scheduledContent,
        thisMonthContent,
        totalViews: Math.floor(publishedContent * 150), // Estimated
        avgWordsPerPost: totalContent > 0 ? Math.floor(totalWords / totalContent) : 0,
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  };

  const handleGenerateFromCSV = async () => {
    if (!csvFile) {
      toast({
        title: "No File Selected",
        description: "Please select a CSV file to generate articles from",
        variant: "destructive",
      });
      return;
    }

    setGeneratingFromCSV(true);
    setCsvProgress(0);

    try {
      const fileContent = await csvFile.text();
      const lines = fileContent.split('\n');
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
      
      const articles = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = line.split(',').map(v => v.replace(/"/g, '').trim());
        if (values.length >= 4) {
          articles.push({
            Focus_Keyword: values[0] || '',
            Title: values[1] || '',
            Meta_Description: values[2] || '',
            Slug: values[3] || '',
            Category: values[4] || 'General',
            Tags: values[5] || '',
            Featured_Image_Gen_Prompt: values[6] || '',
            Article_Length: values[7] || '2000'
          });
        }
      }

      for (let i = 0; i < articles.length; i++) {
        const articleData = articles[i];
        setCsvProgress(((i + 1) / articles.length) * 100);

        try {
          const response = await fetch('https://jdbqecrmegeykvpqyrtk.supabase.co/functions/v1/csv-article-generator', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkYnFlY3JtZWdleWt2cHF5cnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMzg5NTgsImV4cCI6MjA2OTkxNDk1OH0.GcnzEaL4Fy5aMpyeP8HnP_4vsdla43Y3cH6gt51Yh_w`,
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkYnFlY3JtZWdleWt2cHF5cnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMzg5NTgsImV4cCI6MjA2OTkxNDk1OH0.GcnzEaL4Fy5aMpyeP8HnP_4vsdla43Y3cH6gt51Yh_w'
            },
            body: JSON.stringify({
              articleData,
              generateImages: false
            })
          });

          if (response.ok) {
            const result = await response.json();
            console.log(`✅ Generated: ${articleData.Title}`);
          } else {
            console.error(`❌ Failed: ${articleData.Title}`);
          }
        } catch (error) {
          console.error(`❌ Error generating ${articleData.Title}:`, error);
        }

        // Small delay to avoid rate limiting
        if (i < articles.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      toast({
        title: "CSV Import Complete",
        description: `Generated ${articles.length} articles from CSV`,
      });

      await loadArticles();
      await calculateStats();
    } catch (error: any) {
      console.error('CSV generation error:', error);
      toast({
        title: "CSV Import Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setGeneratingFromCSV(false);
      setCsvProgress(0);
      setCsvFile(null);
    }
  };

  const handleSaveArticle = async () => {
    try {
      const articleData = {
        title: articleForm.title,
        meta_description: articleForm.metaDescription,
        slug: articleForm.slug,
        content: articleForm.content,
        categories: articleForm.categories,
        seo_tags: articleForm.seoTags,
        status: articleForm.status,
        published_at: articleForm.status === 'published' ? new Date().toISOString() : null,
        scheduled_at: articleForm.status === 'scheduled' ? articleForm.scheduledAt : null,
      };

      if (editingArticle) {
        const { error } = await supabase
          .from('generated_content')
          .update(articleData)
          .eq('id', editingArticle.id);

        if (error) throw error;

        toast({
          title: "Article Updated",
          description: "Article has been updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('generated_content')
          .insert(articleData);

        if (error) throw error;

        toast({
          title: "Article Created",
          description: "Article has been created successfully",
        });
      }

      setShowArticleForm(false);
      setEditingArticle(null);
      resetArticleForm();
      await loadArticles();
      await calculateStats();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetArticleForm = () => {
    setArticleForm({
      title: '',
      metaDescription: '',
      slug: '',
      content: '',
      categories: [],
      seoTags: [],
      status: 'draft',
      scheduledAt: '',
      featuredImagePrompt: ''
    });
  };

  const handleEditArticle = (article: GeneratedContent) => {
    setEditingArticle(article);
    setArticleForm({
      title: article.title,
      metaDescription: article.meta_description || '',
      slug: article.slug,
      content: article.content,
      categories: article.categories || [],
      seoTags: article.seo_tags || [],
      status: article.status,
      scheduledAt: article.scheduled_at || '',
      featuredImagePrompt: ''
    });
    setShowArticleForm(true);
  };

  const handleDeleteArticle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('generated_content')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Article Deleted",
        description: "Article has been deleted successfully",
      });

      await loadArticles();
      await calculateStats();
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleBulkStatusUpdate = async (status: 'draft' | 'published' | 'archived') => {
    if (selectedArticles.length === 0) return;

    try {
      const updates: any = { status };
      if (status === 'published') {
        updates.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('generated_content')
        .update(updates)
        .in('id', selectedArticles);

      if (error) throw error;

      toast({
        title: "Bulk Update Complete",
        description: `Updated ${selectedArticles.length} articles to ${status}`,
      });

      setSelectedArticles([]);
      await loadArticles();
      await calculateStats();
    } catch (error: any) {
      toast({
        title: "Bulk Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Calendar helpers
  const calendarDays = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const getArticlesForDate = (date: Date) => {
    return articles.filter(article => {
      const publishDate = article.published_at ? new Date(article.published_at) : null;
      const scheduleDate = article.scheduled_at ? new Date(article.scheduled_at) : null;
      
      return (publishDate && format(publishDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')) ||
             (scheduleDate && format(scheduleDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'scheduled': return 'outline';
      case 'archived': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Manager</h1>
          <p className="text-muted-foreground">
            Comprehensive article management with AI-powered generation and content calendar
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadArticles}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowArticleForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Article
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContent}</div>
            <div className="flex items-center mt-1">
              <div className="text-xs text-green-600 font-medium">
                {stats.publishedContent} published
              </div>
              <div className="text-xs text-muted-foreground ml-2">
                {stats.draftContent} drafts
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">+{stats.thisMonthContent}</div>
            <div className="text-xs text-muted-foreground">
              {stats.scheduledContent} scheduled
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
            <div className="text-xs text-muted-foreground">
              estimated total views
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Words</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgWordsPerPost}</div>
            <div className="text-xs text-muted-foreground">
              per article
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="articles" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="articles">
            <FileText className="h-4 w-4 mr-2" />
            Articles ({stats.totalContent})
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <Calendar className="h-4 w-4 mr-2" />
            Content Calendar
          </TabsTrigger>
          <TabsTrigger value="generator">
            <Brain className="h-4 w-4 mr-2" />
            AI Generator
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Articles Management Tab */}
        <TabsContent value="articles" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Article Management</CardTitle>
                  <CardDescription>
                    Manage your articles with advanced filtering and bulk operations
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-80"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {uniqueCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="text-sm text-muted-foreground">
                  Showing {filteredArticles.length} of {articles.length} articles
                </div>
              </div>

              {/* Bulk Operations */}
              {selectedArticles.length > 0 && (
                <Card className="border-orange-200 bg-orange-50 mb-4">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium">
                          {selectedArticles.length} article(s) selected
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleBulkStatusUpdate('published')}
                        >
                          Publish Selected
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleBulkStatusUpdate('draft')}
                        >
                          Move to Draft
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleBulkStatusUpdate('archived')}
                          className="text-destructive"
                        >
                          Archive Selected
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setSelectedArticles([])}
                        >
                          Clear Selection
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Articles Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={filteredArticles.length > 0 && selectedArticles.length === filteredArticles.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedArticles(filteredArticles.map(a => a.id));
                            } else {
                              setSelectedArticles([]);
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Words</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex items-center justify-center">
                            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                            Loading articles...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredArticles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="text-center">
                            <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-muted-foreground">No articles found.</p>
                            <Button 
                              variant="link" 
                              onClick={() => setShowArticleForm(true)}
                            >
                              Create your first article
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredArticles.map((article) => (
                        <TableRow 
                          key={article.id}
                          className={selectedArticles.includes(article.id) ? 'bg-muted/50' : ''}
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedArticles.includes(article.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedArticles([...selectedArticles, article.id]);
                                } else {
                                  setSelectedArticles(selectedArticles.filter(id => id !== article.id));
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium truncate max-w-xs">
                                {article.title}
                              </div>
                              {article.meta_description && (
                                <div className="text-sm text-muted-foreground truncate max-w-xs">
                                  {article.meta_description}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(article.status)}>
                              {article.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {article.categories && article.categories.length > 0 ? (
                                article.categories.slice(0, 2).map((cat) => (
                                  <Badge key={cat} variant="outline" className="text-xs">
                                    {cat}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-xs text-muted-foreground">Uncategorized</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {format(new Date(article.created_at), 'MMM dd, yyyy')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {article.content.split(' ').length}
                            </span>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditArticle(article)}>
                                  <Edit3 className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                {article.status === 'draft' && (
                                  <DropdownMenuItem>
                                    <Send className="h-4 w-4 mr-2" />
                                    Publish
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => handleDeleteArticle(article.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Calendar Tab */}
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Content Calendar</CardTitle>
                  <CardDescription>
                    Visual calendar view of published and scheduled content
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  >
                    Previous
                  </Button>
                  <div className="text-lg font-semibold min-w-40 text-center">
                    {format(currentDate, 'MMMM yyyy')}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-semibold py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map(day => {
                  const dayArticles = getArticlesForDate(day);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  
                  return (
                    <div
                      key={day.toISOString()}
                      className={`min-h-24 p-2 border rounded-lg ${
                        isToday(day) 
                          ? 'bg-blue-50 border-blue-200' 
                          : isCurrentMonth 
                            ? 'bg-white hover:bg-gray-50' 
                            : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      <div className="text-sm font-semibold mb-1">
                        {format(day, 'd')}
                      </div>
                      <div className="space-y-1">
                        {dayArticles.slice(0, 2).map(article => (
                          <div
                            key={article.id}
                            className={`text-xs p-1 rounded truncate ${
                              article.status === 'published' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                            title={article.title}
                          >
                            {article.title}
                          </div>
                        ))}
                        {dayArticles.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayArticles.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Generator Tab */}
        <TabsContent value="generator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                AI Content Generator
              </CardTitle>
              <CardDescription>
                Generate articles using AI or import from CSV files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">CSV Article Generator</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a CSV file to generate multiple articles at once
                </p>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleGenerateFromCSV}
                    disabled={!csvFile || generatingFromCSV}
                  >
                    {generatingFromCSV ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Generate Articles
                      </>
                    )}
                  </Button>
                </div>
                {generatingFromCSV && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Generating articles...</span>
                      <span>{Math.round(csvProgress)}%</span>
                    </div>
                    <Progress value={csvProgress} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Content Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Published Articles</span>
                    <span className="font-bold">{stats.publishedContent}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Draft Articles</span>
                    <span className="font-bold">{stats.draftContent}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Scheduled Articles</span>
                    <span className="font-bold">{stats.scheduledContent}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Word Count</span>
                    <span className="font-bold">{stats.avgWordsPerPost}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {uniqueCategories.slice(0, 5).map((category, index) => {
                    const count = articles.filter(a => a.categories?.includes(category)).length;
                    const percentage = articles.length > 0 ? (count / articles.length) * 100 : 0;
                    
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">#{index + 1}</Badge>
                          <span className="text-sm font-medium">{category}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">{count}</div>
                          <div className="text-xs text-muted-foreground">
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Article Form Dialog */}
      <Dialog open={showArticleForm} onOpenChange={setShowArticleForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingArticle ? 'Edit Article' : 'Create New Article'}
            </DialogTitle>
            <DialogDescription>
              {editingArticle 
                ? 'Update your article content and settings.' 
                : 'Create a new article with comprehensive content management.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={articleForm.title}
                  onChange={(e) => {
                    setArticleForm({
                      ...articleForm, 
                      title: e.target.value,
                      slug: e.target.value ? generateSlug(e.target.value) : ''
                    });
                  }}
                  placeholder="Enter article title"
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={articleForm.slug}
                  onChange={(e) => setArticleForm({...articleForm, slug: e.target.value})}
                  placeholder="article-slug"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="meta-description">Meta Description</Label>
              <Textarea
                id="meta-description"
                value={articleForm.metaDescription}
                onChange={(e) => setArticleForm({...articleForm, metaDescription: e.target.value})}
                placeholder="Enter meta description for SEO"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={articleForm.content}
                onChange={(e) => setArticleForm({...articleForm, content: e.target.value})}
                placeholder="Enter your article content (HTML supported)"
                rows={15}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="categories">Categories (comma-separated)</Label>
                <Input
                  id="categories"
                  value={articleForm.categories.join(', ')}
                  onChange={(e) => setArticleForm({
                    ...articleForm, 
                    categories: e.target.value.split(',').map(c => c.trim()).filter(Boolean)
                  })}
                  placeholder="Technology, AI, Business"
                />
              </div>
              <div>
                <Label htmlFor="seo-tags">SEO Tags (comma-separated)</Label>
                <Input
                  id="seo-tags"
                  value={articleForm.seoTags.join(', ')}
                  onChange={(e) => setArticleForm({
                    ...articleForm, 
                    seoTags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                  })}
                  placeholder="AI, automation, technology"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={articleForm.status} 
                  onValueChange={(value: any) => setArticleForm({...articleForm, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {articleForm.status === 'scheduled' && (
                <div>
                  <Label htmlFor="scheduled-at">Scheduled Date & Time</Label>
                  <Input
                    id="scheduled-at"
                    type="datetime-local"
                    value={articleForm.scheduledAt}
                    onChange={(e) => setArticleForm({...articleForm, scheduledAt: e.target.value})}
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowArticleForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveArticle}>
              {editingArticle ? 'Update Article' : 'Create Article'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentManager;
