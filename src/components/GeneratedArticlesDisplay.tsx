import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  BarChart3,
  Calendar,
  User,
  Tag,
  BookOpen,
  TrendingUp,
  Zap,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GeneratedArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'published' | 'archived' | 'pending_review';
  word_count: number;
  reading_time: number;
  quality_score: number;
  seo_score: number;
  meta_title: string;
  meta_description: string;
  keywords: string[];
  tags: string[];
  author_id: string;
  featured_image: string | null;
  published_at: string | null;
  scheduled_publish_at: string | null;
  human_review_status: 'pending' | 'approved' | 'rejected' | 'not_required';
  created_at: string;
  updated_at: string;
}

const GeneratedArticlesDisplay = () => {
  const { toast } = useToast();
  const [articles, setArticles] = useState<GeneratedArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<GeneratedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedArticle, setSelectedArticle] = useState<GeneratedArticle | null>(null);
  const [showArticleModal, setShowArticleModal] = useState(false);

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    filterAndSortArticles();
  }, [articles, searchTerm, statusFilter, sortBy, sortOrder]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('generated_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading articles:', error);
        toast({
          title: "Error Loading Articles",
          description: "Failed to load generated articles. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setArticles(data || []);
      console.log(`Loaded ${data?.length || 0} articles from database`);
      
    } catch (error) {
      console.error('Error loading articles:', error);
      toast({
        title: "Error Loading Articles",
        description: "An unexpected error occurred while loading articles.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortArticles = () => {
    let filtered = [...articles];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(article => article.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchLower) ||
        article.excerpt?.toLowerCase().includes(searchLower) ||
        article.keywords?.some(keyword => keyword.toLowerCase().includes(searchLower)) ||
        article.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof GeneratedArticle];
      let bValue: any = b[sortBy as keyof GeneratedArticle];

      if (sortBy === 'created_at' || sortBy === 'updated_at' || sortBy === 'published_at') {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredArticles(filtered);
  };

  const updateArticleStatus = async (articleId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('generated_articles')
        .update({ 
          status: newStatus,
          published_at: newStatus === 'published' ? new Date().toISOString() : null
        })
        .eq('id', articleId);

      if (error) throw error;

      // Update local state
      setArticles(prev => prev.map(article => 
        article.id === articleId 
          ? { ...article, status: newStatus as any, published_at: newStatus === 'published' ? new Date().toISOString() : null }
          : article
      ));

      toast({
        title: "Status Updated",
        description: `Article status changed to ${newStatus}`,
      });

    } catch (error) {
      console.error('Error updating article status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update article status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteArticle = async (articleId: string) => {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('generated_articles')
        .delete()
        .eq('id', articleId);

      if (error) throw error;

      // Update local state
      setArticles(prev => prev.filter(article => article.id !== articleId));

      toast({
        title: "Article Deleted",
        description: "The article has been permanently deleted.",
      });

    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete article. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'pending_review': return 'outline';
      case 'archived': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle className="w-4 h-4" />;
      case 'draft': return <FileText className="w-4 h-4" />;
      case 'pending_review': return <Clock className="w-4 h-4" />;
      case 'archived': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>Loading generated articles...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Generated Articles</h1>
          <p className="text-gray-600 mt-2">
            Manage and review all articles generated by the AI Autopilot system
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Zap className="w-3 h-3 mr-1" />
            {articles.length} Articles
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            {articles.filter(a => a.status === 'published').length} Published
          </Badge>
          <Button onClick={loadArticles} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending_review">Pending Review</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Created Date</SelectItem>
                <SelectItem value="updated_at">Updated Date</SelectItem>
                <SelectItem value="published_at">Published Date</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="word_count">Word Count</SelectItem>
                <SelectItem value="quality_score">Quality Score</SelectItem>
                <SelectItem value="seo_score">SEO Score</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
              <SelectTrigger>
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredArticles.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {articles.length === 0 ? 'No Articles Generated Yet' : 'No Articles Match Your Filters'}
            </h3>
            <p className="text-gray-600">
              {articles.length === 0 
                ? 'Start the AI Autopilot system to generate your first articles.'
                : 'Try adjusting your search terms or filters to see more results.'
              }
            </p>
          </div>
        ) : (
          filteredArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2 mb-2">
                      {article.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant={getStatusBadgeVariant(article.status)} className="flex items-center">
                        {getStatusIcon(article.status)}
                        <span className="ml-1 capitalize">{article.status.replace('_', ' ')}</span>
                      </Badge>
                      {article.human_review_status !== 'not_required' && (
                        <Badge variant="outline" className="text-xs">
                          {article.human_review_status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Article Stats */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    <span>{article.word_count.toLocaleString()} words</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{article.reading_time} min read</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-gray-400" />
                    <span>Quality: {article.quality_score}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span>SEO: {article.seo_score}%</span>
                  </div>
                </div>

                {/* Excerpt */}
                {article.excerpt && (
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {truncateText(article.excerpt, 150)}
                  </p>
                )}

                {/* Keywords and Tags */}
                <div className="space-y-2">
                  {article.keywords && article.keywords.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-gray-500">Keywords:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {article.keywords.slice(0, 3).map((keyword, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                        {article.keywords.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{article.keywords.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {article.tags && article.tags.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-gray-500">Tags:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {article.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{article.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Meta Info */}
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex items-center space-x-2">
                    <User className="w-3 h-3" />
                    <span>{article.author_id}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3" />
                    <span>Created: {formatDate(article.created_at)}</span>
                  </div>
                  {article.published_at && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>Published: {formatDate(article.published_at)}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedArticle(article);
                      setShowArticleModal(true);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  
                  {article.status === 'draft' && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => updateArticleStatus(article.id, 'published')}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Publish
                    </Button>
                  )}
                  
                  {article.status === 'published' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => updateArticleStatus(article.id, 'draft')}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Unpublish
                    </Button>
                  )}
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteArticle(article.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Article Modal */}
      {showArticleModal && selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{selectedArticle.title}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowArticleModal(false)}
                >
                  ×
                </Button>
              </div>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <span>Status: {selectedArticle.status}</span>
                <span>•</span>
                <span>{selectedArticle.word_count.toLocaleString()} words</span>
                <span>•</span>
                <span>{selectedArticle.reading_time} min read</span>
                <span>•</span>
                <span>Quality: {selectedArticle.quality_score}%</span>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
              </div>
            </div>
            
            <div className="p-6 border-t bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Generated on {formatDate(selectedArticle.created_at)}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowArticleModal(false)}
                  >
                    Close
                  </Button>
                  {selectedArticle.status === 'draft' && (
                    <Button
                      onClick={() => {
                        updateArticleStatus(selectedArticle.id, 'published');
                        setShowArticleModal(false);
                      }}
                    >
                      Publish Article
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratedArticlesDisplay;
