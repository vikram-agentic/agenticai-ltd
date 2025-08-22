// ENTERPRISE ARTICLE DISPLAY PAGE
// SEO-optimized article viewing with social sharing, related articles, and analytics
// Integrated with the automated article generation system

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Helmet } from 'react-helmet-async';
import { 
  Clock, Calendar, User, ArrowRight, Share2, BookOpen, 
  TrendingUp, Eye, MessageSquare, Heart, Bookmark,
  Twitter, Facebook, Linkedin, Link as LinkIcon,
  ChevronLeft, ChevronRight
} from 'lucide-react';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { MeetingBookingModal } from '@/components/MeetingBookingModal';
import useArticles, { Article } from '@/hooks/useArticles';

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getArticleBySlug, getRelatedArticles, incrementViewCount } = useArticles();
  
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    if (slug) {
      loadArticle(slug);
    }
  }, [slug]);

  const loadArticle = async (articleSlug: string) => {
    try {
      setLoading(true);
      const fetchedArticle = await getArticleBySlug(articleSlug);
      
      if (!fetchedArticle) {
        navigate('/blog');
        return;
      }

      setArticle(fetchedArticle);
      const related = getRelatedArticles(fetchedArticle, 3);
      setRelatedArticles(related);
      
    } catch (error) {
      console.error('Error loading article:', error);
      toast({
        title: "Error",
        description: "Failed to load article. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Reading progress tracking
  useEffect(() => {
    const updateReadingProgress = () => {
      const article = document.querySelector('#article-content');
      if (!article) return;
      
      const scrollTop = window.scrollY;
      const docHeight = article.offsetHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = scrollTop / (docHeight - winHeight);
      const progress = Math.min(Math.max(scrollPercent * 100, 0), 100);
      
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', updateReadingProgress);
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getShareUrl = () => {
    return `${window.location.origin}/blog/${article?.slug}`;
  };

  const shareOnTwitter = () => {
    const url = getShareUrl();
    const text = `${article?.title} - ${article?.meta_description?.slice(0, 100)}...`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = getShareUrl();
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnFacebook = () => {
    const url = getShareUrl();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      toast({
        title: "Link Copied!",
        description: "Article link copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Bookmark Removed" : "Article Bookmarked",
      description: isBookmarked ? "Article removed from bookmarks" : "Article saved to your bookmarks",
    });
  };

  const toggleLike = () => {
    setHasLiked(!hasLiked);
    toast({
      title: hasLiked ? "Like Removed" : "Article Liked",
      description: hasLiked ? "Like removed" : "Thanks for liking this article!",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-64 bg-muted rounded"></div>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
            <Link to="/blog">
              <Button className="bg-gradient-primary hover:opacity-90">
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{article.meta_title || article.title}</title>
        <meta name="description" content={article.meta_description || article.excerpt} />
        <meta name="keywords" content={[article.primary_keyword, ...(article.secondary_keywords || [])].filter(Boolean).join(', ')} />
        <meta name="author" content={article.author} />
        <meta property="article:published_time" content={article.published_at || article.created_at} />
        <meta property="article:modified_time" content={article.updated_at} />
        <meta property="article:section" content={article.category} />
        <meta property="article:tag" content={article.tags?.join(', ')} />
        
        {/* Open Graph */}
        <meta property="og:title" content={article.meta_title || article.title} />
        <meta property="og:description" content={article.meta_description || article.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={getShareUrl()} />
        {article.featured_image_url && (
          <meta property="og:image" content={article.featured_image_url} />
        )}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.meta_title || article.title} />
        <meta name="twitter:description" content={article.meta_description || article.excerpt} />
        {article.featured_image_url && (
          <meta name="twitter:image" content={article.featured_image_url} />
        )}
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": article.title,
            "description": article.meta_description || article.excerpt,
            "author": {
              "@type": "Organization",
              "name": article.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "Agentic AI Ltd"
            },
            "datePublished": article.published_at || article.created_at,
            "dateModified": article.updated_at,
            "wordCount": article.word_count,
            "image": article.featured_image_url,
            "url": getShareUrl(),
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": getShareUrl()
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />

        {/* Reading Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-muted/50 z-50">
          <div 
            className="h-full bg-gradient-primary transition-all duration-300"
            style={{ width: `${readingProgress}%` }}
          />
        </div>

        {/* Article Header */}
        <header className="pt-24 pb-12 px-4 bg-gradient-to-br from-muted/20 to-background">
          <div className="container mx-auto max-w-4xl">
            {/* Navigation Breadcrumb */}
            <nav className="mb-8">
              <Link 
                to="/blog" 
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Articles
              </Link>
            </nav>

            {/* Article Metadata */}
            <div className="space-y-6">
              {/* Category and Tags */}
              <div className="flex flex-wrap gap-2">
                {article.category && (
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {article.category}
                  </Badge>
                )}
                {article.tags?.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight">
                <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  {article.title}
                </span>
              </h1>

              {/* Meta Description */}
              {article.meta_description && (
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl">
                  {article.meta_description}
                </p>
              )}

              {/* Author and Meta Info */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{article.author}</div>
                    <div className="text-sm text-muted-foreground">AI Expert & Consultant</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(article.published_at || article.created_at)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {article.reading_time} min read
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    {article.views_count.toLocaleString()} views
                  </div>
                </div>
              </div>

              {/* Social Actions */}
              <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLike}
                  className={`transition-colors ${hasLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
                >
                  <Heart className={`h-4 w-4 mr-2 ${hasLiked ? 'fill-current' : ''}`} />
                  Like
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleBookmark}
                  className={`transition-colors ${isBookmarked ? 'text-yellow-500' : 'text-muted-foreground hover:text-yellow-500'}`}
                >
                  <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                  Save
                </Button>

                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-muted-foreground">Share:</span>
                  <Button variant="ghost" size="sm" onClick={shareOnTwitter}>
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={shareOnLinkedIn}>
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={copyLink}>
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.featured_image_url && (
          <section className="px-4 mb-12">
            <div className="container mx-auto max-w-6xl">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src={article.featured_image_url} 
                  alt={article.featured_image_alt || article.title}
                  className="w-full h-64 md:h-96 lg:h-[32rem] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </section>
        )}

        {/* Article Content */}
        <main className="px-4 pb-16">
          <div className="container mx-auto max-w-4xl">
            <div className="grid lg:grid-cols-4 gap-12">
              {/* Main Content */}
              <article className="lg:col-span-3" id="article-content">
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      img: ({ node, ...props }) => (
                        <img 
                          className="rounded-lg shadow-md my-8 w-full h-auto" 
                          {...props} 
                        />
                      ),
                      h1: ({ node, ...props }) => (
                        <h1 className="text-4xl font-bold my-8 scroll-mt-24" {...props} />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 className="text-3xl font-bold my-6 scroll-mt-24" {...props} />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 className="text-2xl font-bold my-4 scroll-mt-24" {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="text-lg leading-relaxed my-4 text-foreground/90" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc list-inside my-4 space-y-2" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal list-inside my-4 space-y-2" {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="my-2 text-foreground/90" {...props} />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-primary pl-6 my-6 italic text-lg bg-muted/30 py-4 rounded-r-lg" {...props} />
                      ),
                      code: ({ node, inline, ...props }) => (
                        inline ? (
                          <code className="bg-muted px-2 py-1 rounded text-sm font-mono" {...props} />
                        ) : (
                          <code className="block bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto" {...props} />
                        )
                      )
                    }}
                  >
                    {article.content}
                  </ReactMarkdown>
                </div>

                {/* Article Footer */}
                <footer className="mt-16 pt-8 border-t border-border/50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        SEO Score: {article.seo_score}/100
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        {article.word_count.toLocaleString()} words
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      Last updated: {formatDate(article.updated_at)}
                    </div>
                  </div>
                </footer>
              </article>

              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <div className="sticky top-24 space-y-8">
                  {/* Article Stats */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Article Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Views</span>
                        <span className="font-semibold">{article.views_count.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Reading Time</span>
                        <span className="font-semibold">{article.reading_time} min</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">SEO Score</span>
                        <Badge variant={article.seo_score >= 80 ? "default" : article.seo_score >= 60 ? "secondary" : "destructive"}>
                          {article.seo_score}/100
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Engagement</span>
                        <span className="font-semibold">{(article.engagement_rate * 100).toFixed(1)}%</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Keywords */}
                  {(article.primary_keyword || (article.secondary_keywords && article.secondary_keywords.length > 0)) && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Keywords</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {article.primary_keyword && (
                            <Badge className="bg-primary/10 text-primary border-primary/20">
                              {article.primary_keyword}
                            </Badge>
                          )}
                          {article.secondary_keywords?.slice(0, 4).map(keyword => (
                            <Badge key={keyword} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Table of Contents - could be generated from headings */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Quick Navigation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Link 
                          to="/blog" 
                          className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          ← All Articles
                        </Link>
                        <Link 
                          to="/services" 
                          className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Our Services
                        </Link>
                        <Link 
                          to="/contact" 
                          className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Contact Us
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </aside>
            </div>
          </div>
        </main>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="px-4 py-16 bg-muted/20">
            <div className="container mx-auto max-w-6xl">
              <div className="mb-8">
                <h2 className="text-3xl font-heading font-bold mb-2">Related Articles</h2>
                <p className="text-muted-foreground">Continue exploring these related topics</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <Card key={relatedArticle.id} className="group hover:shadow-lg transition-all duration-300">
                    <Link to={`/blog/${relatedArticle.slug}`}>
                      {relatedArticle.featured_image_url && (
                        <div className="relative overflow-hidden rounded-t-lg h-48">
                          <img 
                            src={relatedArticle.featured_image_url} 
                            alt={relatedArticle.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {relatedArticle.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {relatedArticle.excerpt || relatedArticle.meta_description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{relatedArticle.reading_time} min read</span>
                          <div className="flex items-center gap-1">
                            <ArrowRight className="h-3 w-3" />
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="px-4 py-20 bg-gradient-to-br from-muted/40 via-muted/20 to-background">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Ready to Transform Your Business?
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold leading-tight">
                Let's Implement These 
                <span className="bg-gradient-primary bg-clip-text text-transparent"> AI Solutions</span> Together
              </h2>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Get expert guidance on implementing the AI strategies discussed in this article.
                Our team will help you navigate the complexities and maximize your ROI.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                <MeetingBookingModal 
                  triggerText="Book Free Consultation"
                  triggerSize="lg"
                  className="bg-gradient-primary hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300"
                  serviceType="Article Inquiry"
                />
                <Link to="/services">
                  <Button size="lg" variant="outline" className="border-2 hover:bg-muted/50">
                    Explore Our Services
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ArticlePage;