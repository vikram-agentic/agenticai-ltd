// ARTICLE MANAGEMENT HOOK
// Comprehensive hook for managing AI-generated articles with real-time updates
// Integrates with the enterprise article generation system

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface Article {
  id: string;
  title: string;
  slug: string;
  meta_title?: string;
  meta_description?: string;
  featured_image_url?: string;
  featured_image_alt?: string;
  content: string;
  excerpt?: string;
  
  // Article Structure & SEO
  outline_structure?: any;
  heading_structure?: any;
  word_count: number;
  reading_time: number;
  
  // Keywords & Optimization
  primary_keyword?: string;
  secondary_keywords?: string[];
  keyword_density?: any;
  target_search_volume?: number;
  keyword_difficulty?: number;
  
  // SEO Scores & Performance
  seo_score: number;
  readability_score: number;
  content_score: number;
  ctr_potential_score?: number;
  
  // Publication & Status
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  scheduled_publish_at?: string;
  published_at?: string;
  
  // Performance Tracking
  views_count: number;
  clicks_count: number;
  engagement_rate: number;
  bounce_rate: number;
  average_session_duration: number;
  
  // Search Engine Performance
  google_ranking?: any;
  serp_features?: string[];
  backlinks_count: number;
  referring_domains: number;
  
  // Social & Sharing
  social_shares?: any;
  internal_links?: string[];
  external_links?: string[];
  
  // Quality Assurance
  ai_confidence_score: number;
  human_review_status: 'pending' | 'approved' | 'needs_revision' | 'rejected';
  quality_flags?: string[];
  plagiarism_score: number;
  
  // Automation & Generation
  generation_method: 'auto' | 'manual' | 'hybrid';
  generation_batch_id?: string;
  source_research?: any;
  competitor_analysis?: any;
  content_gaps_addressed?: string[];
  
  // Metadata
  author: string;
  category?: string;
  tags?: string[];
  language: string;
  target_audience?: string;
  content_type: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  last_optimized_at?: string;
}

export interface ArticleFilters {
  status?: string[];
  category?: string[];
  tags?: string[];
  author?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  minSeoScore?: number;
  minWordCount?: number;
  searchTerm?: string;
  sortBy?: 'created_at' | 'published_at' | 'views_count' | 'seo_score' | 'engagement_rate';
  sortOrder?: 'asc' | 'desc';
}

export interface ArticleMetrics {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  scheduledArticles: number;
  averageSeoScore: number;
  averageWordCount: number;
  totalViews: number;
  averageEngagementRate: number;
}

export const useArticles = (filters?: ArticleFilters) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<ArticleMetrics>({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    scheduledArticles: 0,
    averageSeoScore: 0,
    averageWordCount: 0,
    totalViews: 0,
    averageEngagementRate: 0
  });

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('articles')
        .select('*')
        .order(filters?.sortBy || 'created_at', { 
          ascending: filters?.sortOrder === 'asc' 
        });

      // Apply filters
      if (filters?.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }

      if (filters?.category && filters.category.length > 0) {
        query = query.in('category', filters.category);
      }

      if (filters?.author) {
        query = query.eq('author', filters.author);
      }

      if (filters?.minSeoScore) {
        query = query.gte('seo_score', filters.minSeoScore);
      }

      if (filters?.minWordCount) {
        query = query.gte('word_count', filters.minWordCount);
      }

      if (filters?.dateRange) {
        query = query
          .gte('created_at', filters.dateRange.start)
          .lte('created_at', filters.dateRange.end);
      }

      if (filters?.searchTerm) {
        query = query.or(`title.ilike.%${filters.searchTerm}%,content.ilike.%${filters.searchTerm}%,tags.cs.{${filters.searchTerm}}`);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      setArticles(data || []);
      calculateMetrics(data || []);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch articles');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (articlesData: Article[]) => {
    const total = articlesData.length;
    const published = articlesData.filter(a => a.status === 'published').length;
    const drafts = articlesData.filter(a => a.status === 'draft').length;
    const scheduled = articlesData.filter(a => a.status === 'scheduled').length;
    
    const avgSeo = total > 0 
      ? articlesData.reduce((sum, a) => sum + a.seo_score, 0) / total 
      : 0;
    
    const avgWords = total > 0 
      ? articlesData.reduce((sum, a) => sum + a.word_count, 0) / total 
      : 0;
    
    const totalViews = articlesData.reduce((sum, a) => sum + a.views_count, 0);
    
    const avgEngagement = total > 0 
      ? articlesData.reduce((sum, a) => sum + a.engagement_rate, 0) / total 
      : 0;

    setMetrics({
      totalArticles: total,
      publishedArticles: published,
      draftArticles: drafts,
      scheduledArticles: scheduled,
      averageSeoScore: Math.round(avgSeo),
      averageWordCount: Math.round(avgWords),
      totalViews,
      averageEngagementRate: Math.round(avgEngagement * 100) / 100
    });
  };

  const getArticleBySlug = async (slug: string): Promise<Article | null> => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Article not found
        }
        throw new Error(error.message);
      }

      // Update view count
      await incrementViewCount(data.id);

      return data;
    } catch (err) {
      console.error('Error fetching article by slug:', err);
      return null;
    }
  };

  const incrementViewCount = async (articleId: string) => {
    try {
      const { error } = await supabase.rpc('increment_article_views', {
        article_id: articleId
      });

      if (error) {
        console.error('Error incrementing view count:', error);
      }
    } catch (err) {
      console.error('Error incrementing view count:', err);
    }
  };

  const publishArticle = async (articleId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', articleId);

      if (error) {
        throw new Error(error.message);
      }

      // Refresh articles list
      await fetchArticles();
      return true;

    } catch (err) {
      console.error('Error publishing article:', err);
      return false;
    }
  };

  const scheduleArticle = async (articleId: string, publishAt: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({
          status: 'scheduled',
          scheduled_publish_at: publishAt
        })
        .eq('id', articleId);

      if (error) {
        throw new Error(error.message);
      }

      await fetchArticles();
      return true;

    } catch (err) {
      console.error('Error scheduling article:', err);
      return false;
    }
  };

  const updateArticleStatus = async (articleId: string, status: Article['status']): Promise<boolean> => {
    try {
      const updateData: any = { status };
      
      if (status === 'published') {
        updateData.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('articles')
        .update(updateData)
        .eq('id', articleId);

      if (error) {
        throw new Error(error.message);
      }

      await fetchArticles();
      return true;

    } catch (err) {
      console.error('Error updating article status:', err);
      return false;
    }
  };

  const deleteArticle = async (articleId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleId);

      if (error) {
        throw new Error(error.message);
      }

      await fetchArticles();
      return true;

    } catch (err) {
      console.error('Error deleting article:', err);
      return false;
    }
  };

  const generateArticle = async (params: {
    topic?: string;
    primaryKeyword?: string;
    secondaryKeywords?: string[];
    targetWordCount?: number;
    targetAudience?: string;
    contentType?: string;
  }): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke('enterprise-article-generator', {
        body: params
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        await fetchArticles(); // Refresh the list
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.error || 'Generation failed' };
      }

    } catch (err) {
      console.error('Error generating article:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Generation failed'
      };
    }
  };

  const getRelatedArticles = (currentArticle: Article, limit = 3): Article[] => {
    return articles
      .filter(article => 
        article.id !== currentArticle.id && 
        article.status === 'published'
      )
      .filter(article => {
        // Find articles with similar keywords or category
        const hasSharedKeywords = currentArticle.secondary_keywords?.some(keyword =>
          article.secondary_keywords?.includes(keyword)
        );
        const sameCategory = article.category === currentArticle.category;
        const sharedTags = article.tags?.some(tag => 
          currentArticle.tags?.includes(tag)
        );
        
        return hasSharedKeywords || sameCategory || sharedTags;
      })
      .sort((a, b) => b.seo_score - a.seo_score) // Sort by SEO score
      .slice(0, limit);
  };

  const getTopPerformingArticles = (limit = 5): Article[] => {
    return articles
      .filter(article => article.status === 'published')
      .sort((a, b) => {
        // Sort by a composite score of views, engagement, and SEO
        const scoreA = (a.views_count * 0.4) + (a.engagement_rate * 100 * 0.3) + (a.seo_score * 0.3);
        const scoreB = (b.views_count * 0.4) + (b.engagement_rate * 100 * 0.3) + (b.seo_score * 0.3);
        return scoreB - scoreA;
      })
      .slice(0, limit);
  };

  const searchArticles = async (searchQuery: string): Promise<Article[]> => {
    if (!searchQuery.trim()) {
      return articles.filter(article => article.status === 'published');
    }

    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,primary_keyword.ilike.%${searchQuery}%`)
        .order('seo_score', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (err) {
      console.error('Error searching articles:', err);
      return [];
    }
  };

  // Real-time subscriptions
  useEffect(() => {
    fetchArticles();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('articles_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'articles' 
      }, (payload) => {
        console.log('Article change detected:', payload);
        fetchArticles(); // Refresh on any change
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [filters]);

  return {
    articles,
    loading,
    error,
    metrics,
    refetch: fetchArticles,
    getArticleBySlug,
    publishArticle,
    scheduleArticle,
    updateArticleStatus,
    deleteArticle,
    generateArticle,
    getRelatedArticles,
    getTopPerformingArticles,
    searchArticles,
    incrementViewCount
  };
};

export default useArticles;