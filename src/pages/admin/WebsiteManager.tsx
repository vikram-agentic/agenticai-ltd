import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { format, isValid, parseISO } from 'date-fns';
import {
  Globe,
  FileText,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Calendar as CalendarIcon,
  Settings,
  Layout,
  Code,
  Image,
  Palette,
  Monitor,
  Smartphone,
  Tablet,
  ExternalLink,
  Copy,
  Save,
  Upload,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  BarChart3,
  Users,
  Target,
  Zap,
  PieChart,
  BookOpen,
  Tag,
  Archive,
  RefreshCw,
  Share,
  Layers
} from 'lucide-react';

interface WebsitePage {
  id: string;
  title: string;
  slug: string;
  content: string;
  meta_description?: string;
  seo_tags?: string[];
  status: 'draft' | 'published' | 'archived';
  page_type: string;
  template: string;
  featured_image?: string;
  content_images?: string[];
  created_at: string;
  updated_at: string;
  published_at?: string;
}

interface PageTemplate {
  id: string;
  name: string;
  description?: string;
  template_type: string;
  structure: any;
  created_at: string;
  updated_at: string;
}

interface PageFormData {
  title: string;
  slug: string;
  content: string;
  meta_description: string;
  seo_tags: string[];
  page_type: string;
  template: string;
  featured_image: string;
  custom_css: string;
  custom_js: string;
  status: 'draft' | 'published' | 'archived';
}

const WebsiteManager = () => {
  const { toast } = useToast();

  // State Management
  const [pages, setPages] = useState<WebsitePage[]>([]);
  const [templates, setTemplates] = useState<PageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [templateFilter, setTemplateFilter] = useState<string>('all');
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [showPageModal, setShowPageModal] = useState(false);
  const [editingPage, setEditingPage] = useState<WebsitePage | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showPreview, setShowPreview] = useState(false);

  // Form State
  const [formData, setFormData] = useState<PageFormData>({
    title: '',
    slug: '',
    content: '',
    meta_description: '',
    seo_tags: [],
    page_type: 'page',
    template: 'default',
    featured_image: '',
    custom_css: '',
    custom_js: '',
    status: 'draft'
  });
  const [newSeoTag, setNewSeoTag] = useState('');

  // Load Data
  useEffect(() => {
    loadPages();
    loadTemplates();
  }, []);

  const loadPages = async () => {
    try {
      const { data, error } = await supabase
        .from('website_pages')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to load pages: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('page_templates')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      console.error('Error loading templates:', error);
    }
  };

  // Analytics
  const analytics = useMemo(() => {
    const total = pages.length;
    const published = pages.filter(p => p.status === 'published').length;
    const drafts = pages.filter(p => p.status === 'draft').length;
    const archived = pages.filter(p => p.status === 'archived').length;

    const typeDistribution = pages.reduce((acc, page) => {
      acc[page.page_type] = (acc[page.page_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const templateDistribution = pages.reduce((acc, page) => {
      acc[page.template] = (acc[page.template] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentPages = pages.filter(p => 
      new Date(p.updated_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    const publishedThisWeek = pages.filter(p => 
      p.published_at && new Date(p.published_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    return {
      total,
      published,
      drafts,
      archived,
      publishRate: total > 0 ? Math.round((published / total) * 100) : 0,
      typeDistribution,
      templateDistribution,
      recentPages,
      publishedThisWeek
    };
  }, [pages]);

  // Filtered Pages
  const filteredPages = useMemo(() => {
    return pages.filter(page => {
      const matchesSearch = 
        page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
      const matchesType = typeFilter === 'all' || page.page_type === typeFilter;
      const matchesTemplate = templateFilter === 'all' || page.template === templateFilter;
      
      return matchesSearch && matchesStatus && matchesType && matchesTemplate;
    });
  }, [pages, searchTerm, statusFilter, typeFilter, templateFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredPages.length / itemsPerPage);
  const paginatedPages = filteredPages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleCreatePage = async () => {
    if (!formData.title.trim() || !formData.slug.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Title and slug are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      const pageData = {
        ...formData,
        slug: formData.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        seo_tags: formData.seo_tags.filter(tag => tag.trim() !== ''),
        content_images: []
      };

      const { data, error } = await supabase
        .from('website_pages')
        .insert(pageData)
        .select()
        .single();

      if (error) throw error;

      setPages(prev => [data, ...prev]);
      setFormData({
        title: '',
        slug: '',
        content: '',
        meta_description: '',
        seo_tags: [],
        page_type: 'page',
        template: 'default',
        featured_image: '',
        custom_css: '',
        custom_js: '',
        status: 'draft'
      });
      setShowPageModal(false);

      toast({
        title: 'Success',
        description: 'Page created successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to create page: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const handleUpdatePage = async (id: string, updates: Partial<WebsitePage>) => {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      if (updates.status === 'published' && !updates.published_at) {
        updateData.published_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('website_pages')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setPages(prev => prev.map(page => 
        page.id === id ? data : page
      ));

      toast({
        title: 'Success',
        description: 'Page updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to update page: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const handleDeletePage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('website_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPages(prev => prev.filter(page => page.id !== id));
      setSelectedPages(prev => prev.filter(pageId => pageId !== id));

      toast({
        title: 'Success',
        description: 'Page deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to delete page: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const handleBulkOperation = async (operation: string) => {
    if (selectedPages.length === 0) {
      toast({
        title: 'No Selection',
        description: 'Please select pages to perform bulk operations',
        variant: 'destructive',
      });
      return;
    }

    try {
      let updates: Partial<WebsitePage> = {};
      
      switch (operation) {
        case 'publish':
          updates = { status: 'published', published_at: new Date().toISOString() };
          break;
        case 'draft':
          updates = { status: 'draft', published_at: null };
          break;
        case 'archive':
          updates = { status: 'archived' };
          break;
        case 'delete':
          const { error: deleteError } = await supabase
            .from('website_pages')
            .delete()
            .in('id', selectedPages);
          
          if (deleteError) throw deleteError;
          
          setPages(prev => prev.filter(page => !selectedPages.includes(page.id)));
          setSelectedPages([]);
          
          toast({
            title: 'Success',
            description: `Deleted ${selectedPages.length} pages`,
          });
          return;
          
        default:
          return;
      }

      const { error } = await supabase
        .from('website_pages')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .in('id', selectedPages);

      if (error) throw error;

      setPages(prev => prev.map(page => 
        selectedPages.includes(page.id) ? { ...page, ...updates } : page
      ));

      setSelectedPages([]);
      toast({
        title: 'Success',
        description: `Bulk ${operation} completed successfully`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Bulk ${operation} failed: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const handleDuplicatePage = async (pageId: string) => {
    try {
      const originalPage = pages.find(p => p.id === pageId);
      if (!originalPage) return;

      const duplicateData = {
        title: `${originalPage.title} (Copy)`,
        slug: `${originalPage.slug}-copy`,
        content: originalPage.content,
        meta_description: originalPage.meta_description,
        seo_tags: originalPage.seo_tags,
        page_type: originalPage.page_type,
        template: originalPage.template,
        featured_image: originalPage.featured_image,
        content_images: originalPage.content_images,
        status: 'draft' as const
      };

      const { data, error } = await supabase
        .from('website_pages')
        .insert(duplicateData)
        .select()
        .single();

      if (error) throw error;

      setPages(prev => [data, ...prev]);
      
      toast({
        title: 'Success',
        description: 'Page duplicated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to duplicate page: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const addSeoTag = () => {
    if (newSeoTag.trim() && !formData.seo_tags.includes(newSeoTag.trim())) {
      setFormData(prev => ({
        ...prev,
        seo_tags: [...prev.seo_tags, newSeoTag.trim()]
      }));
      setNewSeoTag('');
    }
  };

  const removeSeoTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      seo_tags: prev.seo_tags.filter((_, i) => i !== index)
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPageTypeIcon = (type: string) => {
    switch (type) {
      case 'blog': return <BookOpen className="h-4 w-4" />;
      case 'service': return <Target className="h-4 w-4" />;
      case 'landing': return <Zap className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Website Manager</h1>
          <p className="text-gray-600">Manage website pages, templates, and content</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowPageModal(true)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Page
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="seo">SEO Tools</TabsTrigger>
        </TabsList>

        {/* Pages Tab */}
        <TabsContent value="pages" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.total}</div>
                <p className="text-xs text-muted-foreground">
                  +{analytics.recentPages} this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.published}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.publishRate}% publish rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.drafts}</div>
                <p className="text-xs text-muted-foreground">
                  Work in progress
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Published This Week</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.publishedThisWeek}</div>
                <p className="text-xs text-muted-foreground">
                  Recent activity
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Actions */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-1 items-center gap-4 flex-wrap">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search pages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="page">Page</SelectItem>
                      <SelectItem value="blog">Blog</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="landing">Landing</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={templateFilter} onValueChange={setTemplateFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Templates</SelectItem>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.name}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedPages.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {selectedPages.length} selected
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkOperation('publish')}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Publish
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkOperation('draft')}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Draft
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleBulkOperation('delete')}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paginatedPages.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No pages found</p>
                  </div>
                ) : (
                  paginatedPages.map((page) => (
                    <div
                      key={page.id}
                      className="p-4 border rounded-lg hover:border-purple-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <Checkbox
                            checked={selectedPages.includes(page.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedPages(prev => [...prev, page.id]);
                              } else {
                                setSelectedPages(prev => prev.filter(id => id !== page.id));
                              }
                            }}
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getPageTypeIcon(page.page_type)}
                              <h3 className="font-semibold text-lg">{page.title}</h3>
                              <Badge className={getStatusColor(page.status)}>
                                {page.status}
                              </Badge>
                              <Badge variant="outline">{page.template}</Badge>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <span className="flex items-center gap-1">
                                <Globe className="h-3 w-3" />
                                /{page.slug}
                              </span>
                              <span className="capitalize">{page.page_type}</span>
                              <span>
                                Updated: {format(parseISO(page.updated_at), 'MMM d, yyyy')}
                              </span>
                              {page.published_at && (
                                <span>
                                  Published: {format(parseISO(page.published_at), 'MMM d, yyyy')}
                                </span>
                              )}
                            </div>
                            
                            {page.meta_description && (
                              <p className="text-gray-600 mb-2 line-clamp-2">
                                {page.meta_description}
                              </p>
                            )}
                            
                            {page.seo_tags && page.seo_tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {page.seo_tags.slice(0, 5).map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    <Tag className="h-2 w-2 mr-1" />
                                    {tag}
                                  </Badge>
                                ))}
                                {page.seo_tags.length > 5 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{page.seo_tags.length - 5} more
                                  </Badge>
                                )}
                              </div>
                            )}

                            <div className="text-xs text-gray-500">
                              Content length: {page.content.length.toLocaleString()} characters
                              {page.featured_image && (
                                <span className="ml-4">
                                  <Image className="h-3 w-3 inline mr-1" />
                                  Featured image
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {page.status === 'published' && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowPreview(!showPreview)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Edit Page: {page.title}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Title</Label>
                                    <Input
                                      defaultValue={page.title}
                                      onChange={(e) => {
                                        const newTitle = e.target.value;
                                        handleUpdatePage(page.id, { 
                                          title: newTitle,
                                          slug: generateSlug(newTitle)
                                        });
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <Label>Slug</Label>
                                    <Input
                                      defaultValue={page.slug}
                                      onChange={(e) => handleUpdatePage(page.id, { slug: e.target.value })}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <Label>Meta Description</Label>
                                  <Textarea
                                    defaultValue={page.meta_description}
                                    onChange={(e) => handleUpdatePage(page.id, { meta_description: e.target.value })}
                                    rows={3}
                                  />
                                </div>

                                <div>
                                  <Label>Content</Label>
                                  <Textarea
                                    defaultValue={page.content}
                                    onChange={(e) => handleUpdatePage(page.id, { content: e.target.value })}
                                    rows={10}
                                    className="font-mono text-sm"
                                  />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <Label>Status</Label>
                                    <Select
                                      defaultValue={page.status}
                                      onValueChange={(value) => handleUpdatePage(page.id, { status: value as any })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label>Page Type</Label>
                                    <Select
                                      defaultValue={page.page_type}
                                      onValueChange={(value) => handleUpdatePage(page.id, { page_type: value })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="page">Page</SelectItem>
                                        <SelectItem value="blog">Blog</SelectItem>
                                        <SelectItem value="service">Service</SelectItem>
                                        <SelectItem value="landing">Landing</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label>Template</Label>
                                    <Select
                                      defaultValue={page.template}
                                      onValueChange={(value) => handleUpdatePage(page.id, { template: value })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {templates.map((template) => (
                                          <SelectItem key={template.id} value={template.name}>
                                            {template.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                <div>
                                  <Label>Featured Image URL</Label>
                                  <Input
                                    defaultValue={page.featured_image}
                                    onChange={(e) => handleUpdatePage(page.id, { featured_image: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                  />
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDuplicatePage(page.id)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeletePage(page.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Templates</CardTitle>
              <CardDescription>Manage page templates and layouts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Layout className="h-5 w-5" />
                        {template.name}
                      </CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Badge variant="outline">{template.template_type}</Badge>
                        <p className="text-sm text-gray-600">
                          Used by {analytics.templateDistribution[template.name] || 0} pages
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Page Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.typeDistribution).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getPageTypeIcon(type)}
                        <span className="capitalize">{type}</span>
                      </div>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Template Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.templateDistribution).map(([template, count]) => (
                    <div key={template} className="flex items-center justify-between">
                      <span>{template}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SEO Tools Tab */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Analysis</CardTitle>
              <CardDescription>SEO insights and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Pages without Meta Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {pages.filter(p => !p.meta_description).length}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Pages without SEO Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {pages.filter(p => !p.seo_tags || p.seo_tags.length === 0).length}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Pages without Featured Image</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {pages.filter(p => !p.featured_image).length}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">SEO Recommendations</h3>
                  <div className="space-y-2">
                    {pages.filter(p => !p.meta_description).slice(0, 5).map(page => (
                      <div key={page.id} className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <span className="text-sm">
                          <strong>{page.title}</strong> is missing a meta description
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Page Modal */}
      <Dialog open={showPageModal} onOpenChange={setShowPageModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setFormData(prev => ({ 
                      ...prev, 
                      title,
                      slug: generateSlug(title)
                    }));
                  }}
                  placeholder="Enter page title"
                />
              </div>
              
              <div>
                <Label>Slug</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="page-url-slug"
                />
              </div>
            </div>

            <div>
              <Label>Meta Description</Label>
              <Textarea
                value={formData.meta_description}
                onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                placeholder="Brief description for search engines..."
                rows={3}
              />
            </div>

            <div>
              <Label>Content</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Page content (HTML supported)..."
                rows={10}
                className="font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Page Type</Label>
                <Select
                  value={formData.page_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, page_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="page">Page</SelectItem>
                    <SelectItem value="blog">Blog</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="landing">Landing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Template</Label>
                <Select
                  value={formData.template}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, template: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.name}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Featured Image URL</Label>
              <Input
                value={formData.featured_image}
                onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <Label>SEO Tags</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newSeoTag}
                    onChange={(e) => setNewSeoTag(e.target.value)}
                    placeholder="Add SEO tag"
                    onKeyPress={(e) => e.key === 'Enter' && addSeoTag()}
                  />
                  <Button type="button" onClick={addSeoTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.seo_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {formData.seo_tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeSeoTag(index)}
                          className="ml-1 hover:text-red-500"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowPageModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePage}>
                Create Page
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WebsiteManager;