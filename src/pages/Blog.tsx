import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Calendar, User, ArrowRight, Search, TrendingUp } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useContent } from "@/hooks/useContent";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { MeetingBookingModal } from "@/components/MeetingBookingModal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Blog = () => {
  const { slug } = useParams<{ slug: string }>();
  const { blogPosts, loading } = useContent();
  const [searchTerm, setSearchTerm] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const [shuffledPosts, setShuffledPosts] = useState([]);

  useEffect(() => {
    if (blogPosts.length > 0) {
      setShuffledPosts(blogPosts.sort(() => Math.random() - 0.5));
    }
  }, [blogPosts]);

  const filteredPosts = shuffledPosts.filter(post => {
    const searchTermLower = searchTerm.toLowerCase();
    const searchKeywords = searchTermLower.split(/\s+/).filter(Boolean); // Split by whitespace and remove empty strings

    if (searchKeywords.length === 0) {
      return true; // Show all posts if search is empty
    }

    const postContent = [
      post.title.toLowerCase(),
      stripHtml(post.content).toLowerCase(),
      ...(post.categories || []).map(c => c.toLowerCase()),
      ...(post.seo_tags || []).map(t => t.toLowerCase())
    ].join(' ');

    return searchKeywords.every(keyword => postContent.includes(keyword));
  });

  const handleNewsletterSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsletterEmail.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubscribing(true);

    try {
      const { data, error } = await supabase.functions.invoke('gmail-newsletter', {
        body: {
          action: 'subscribe',
          email: newsletterEmail.trim(),
          source: 'blog',
          tags: ['blog-subscriber']
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to subscribe to newsletter');
      }

      if (data.alreadySubscribed) {
        toast({
          title: "Already Subscribed!",
          description: data.message,
        });
      } else {
        toast({
          title: "Successfully Subscribed!",
          description: data.message,
        });
      }

      setNewsletterEmail("");
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Subscription Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  // Reading progress functionality
  useEffect(() => {
    if (slug) {
      const updateReadingProgress = () => {
        const article = document.querySelector('main');
        const progressBar = document.getElementById('reading-progress');
        
        if (!article || !progressBar) return;
        
        const scrollTop = window.scrollY;
        const docHeight = article.offsetHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = scrollTop / (docHeight - winHeight);
        const scrollPercentRounded = Math.round(scrollPercent * 100);
        
        progressBar.style.width = `${Math.min(scrollPercentRounded, 100)}%`;
      };

      window.addEventListener('scroll', updateReadingProgress);
      return () => window.removeEventListener('scroll', updateReadingProgress);
    }
  }, [slug]);

  // If we have a slug, we're viewing a single post
  if (slug) {
    const post = blogPosts.find(p => p.slug === slug);
    
    if (!post) {
      return (
        <div className="min-h-screen bg-background">
          <Navigation />
          <div className="pt-24 px-4">
            <div className="container mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
              <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
              <Link to="/blog">
                <Button className="bg-gradient-primary hover:opacity-90">
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
      <div className="min-h-screen bg-background">
        <Navigation />

        {/* Premium Blog Post Layout */}
        <article className="min-h-screen bg-background">
          {/* Navigation Header */}
          <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
            <div className="container mx-auto px-4 py-4 max-w-6xl">
              <div className="flex items-center justify-between">
                <Link 
                  to="/blog" 
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                >
                  <ArrowRight className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  Back to Articles
              </Link>
                
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {calculateReadTime(post.content)}
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    Share
                  </Button>
                </div>
              </div>
            </div>
            </div>
            
          {/* Article Header */}
          <header className="py-12 lg:py-20">
            <div className="container mx-auto px-4 max-w-4xl text-center">
              {/* Categories */}
              {post.categories && post.categories.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {post.categories.map((category, index) => (
                    <Badge 
                      key={index} 
                      className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors px-4 py-2 text-sm font-medium"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold leading-[1.1] mb-8 max-w-4xl mx-auto">
                <span className="bg-gradient-to-br from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                {post.title}
                </span>
              </h1>
              
              {/* Meta Description */}
              {post.meta_description && (
                <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground leading-relaxed mb-12 font-light max-w-3xl mx-auto">
                  {post.meta_description}
                </p>
              )}
              
              {/* Author & Meta Info */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-foreground">Agentic AI Team</div>
                    <div className="text-sm text-muted-foreground">AI Experts & Consultants</div>
                  </div>
                </div>
                
                <div className="h-px w-12 bg-border sm:h-6 sm:w-px" />
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.created_at)}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                    {calculateReadTime(post.content)} read
                </div>
              </div>
            </div>
          </div>
          </header>

          {/* Featured Image */}
          {post.featured_image_url && (
            <div className="mb-16 lg:mb-20">
              <div className="container mx-auto px-4 max-w-6xl">
                <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-muted/20">
                  <img 
                    src={post.featured_image_url} 
                    alt={post.title}
                    className="w-full h-64 md:h-96 lg:h-[40rem] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          )}

        {/* Article Content */}
          <main className="pb-16 lg:pb-24">
            <div className="container mx-auto px-4 max-w-4xl">
              {/* Progress Bar */}
              <div className="sticky top-20 z-40 mb-12">
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-primary w-0 transition-all duration-300" id="reading-progress" />
                </div>
              </div>

              {/* Enhanced Content Renderer */}
              <div className="article-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    img: ({node, ...props}) => <img className="max-w-full h-auto rounded-lg shadow-md my-8" {...props} />,
                    h1: ({node, ...props}) => <h1 className="text-4xl font-bold my-8" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-3xl font-bold my-6" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-2xl font-bold my-4" {...props} />,
                    p: ({node, ...props}) => <p className="text-lg leading-relaxed my-4" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside my-4" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside my-4" {...props} />,
                    li: ({node, ...props}) => <li className="my-2" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-500 pl-4 italic my-4" {...props} />,
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
          </div>
          </main>

          {/* Article Footer & CTA */}
          <footer className="border-t border-border/50 bg-muted/20">
            <div className="container mx-auto px-4 py-16 lg:py-20 max-w-4xl">
              {/* Newsletter Signup */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  Enjoyed this article?
                </div>
                
                <h3 className="text-2xl lg:text-3xl font-heading font-bold mb-4">
                  Get More AI Insights
                </h3>
                <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
                  Subscribe to our newsletter for weekly AI breakthroughs, case studies, and expert analysis.
                </p>
                
                <form onSubmit={handleNewsletterSubscription} className="max-w-md mx-auto">
                  <div className="flex gap-3 p-2 bg-background border-2 border-border/50 rounded-2xl focus-within:border-primary/50 transition-colors">
                    <Input 
                      placeholder="Enter your email" 
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base" 
                      disabled={isSubscribing}
                    />
                    <Button 
                      type="submit"
                      className="bg-gradient-primary hover:opacity-90 px-6 py-2 rounded-xl font-medium"
                      disabled={isSubscribing}
                    >
                      {isSubscribing ? "..." : "Subscribe"}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Share & Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-background/50 rounded-2xl border border-border/50">
                <div>
                  <h4 className="font-semibold mb-2">Share this article</h4>
                  <p className="text-sm text-muted-foreground">Help others discover these AI insights</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm">
                    Copy Link
                  </Button>
                  <Button variant="outline" size="sm">
                    Share on LinkedIn
                  </Button>
                  <Button variant="outline" size="sm">
                    Share on Twitter
                  </Button>
                </div>
              </div>
            </div>
          </footer>
        </article>

        {/* Enhanced CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-muted/40 via-muted/20 to-background relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="container mx-auto text-center relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Ready to Transform Your Business?
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6 leading-tight">
              Let's Implement These 
              <span className="bg-gradient-primary bg-clip-text text-transparent"> AI Solutions</span> Together
            </h2>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Get expert guidance on implementing the AI strategies discussed in this article.
              Our team will help you navigate the complexities and maximize your ROI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <MeetingBookingModal 
                triggerText="Book Free Consultation"
                triggerSize="lg"
                className="bg-gradient-primary hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4"
                serviceType="Blog Inquiry"
              />
              <Link to="/services">
                <Button size="lg" variant="outline" className="border-2 hover:bg-muted/50 px-8 py-4">
                  Explore Our Services
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-1">Quick Implementation</h4>
                <p className="text-sm text-muted-foreground">Get up and running in weeks, not months</p>
              </div>
              <div className="p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-1">Expert Guidance</h4>
                <p className="text-sm text-muted-foreground">Work with certified AI specialists</p>
              </div>
              <div className="p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-1">Proven Results</h4>
                <p className="text-sm text-muted-foreground">Join 100+ successful transformations</p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  // Blog listing page
  const featuredPost = filteredPosts[0]; // First post as featured
  const regularPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Modern Magazine Hero Section */}
      <section className="relative pt-20 pb-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-muted/20" />
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Latest AI Insights
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
                The AI
            </span>
              <br />
              <span className="text-foreground">Magazine</span>
          </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Discover cutting-edge insights, expert analysis, and practical strategies 
              for implementing AI in your business.
            </p>
            
          </div>
        </div>
      </section>

      {/* Featured Article Section */}
      {featuredPost && !loading && (
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-bold mb-2 flex items-center gap-3">
                <span className="w-1 h-8 bg-gradient-primary rounded-full" />
                Featured Article
              </h2>
            </div>
            
            <div className="relative group cursor-pointer">
              <Link to={`/blog/${featuredPost.slug}`}>
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center bg-gradient-to-br from-muted/30 to-muted/10 rounded-3xl p-8 lg:p-12 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl">
                  {/* Content */}
                  <div className="space-y-6 order-2 lg:order-1">
                    {featuredPost.categories && featuredPost.categories.length > 0 && (
                      <div className="flex gap-2">
                        {featuredPost.categories.slice(0, 2).map((category, index) => (
                          <Badge 
                            key={index} 
                            className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold leading-tight group-hover:text-primary/90 transition-colors">
                      {featuredPost.title}
                    </h3>
                    
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                      {featuredPost.meta_description || stripHtml(featuredPost.content).substring(0, 200) + "..."}
                    </p>
                    
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium">Agentic AI Team</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(featuredPost.created_at)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {calculateReadTime(featuredPost.content)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-4 transition-all">
                      Read Full Article 
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                  
                  {/* Image */}
                  {featuredPost.featured_image_url && (
                    <div className="order-1 lg:order-2 relative overflow-hidden rounded-2xl">
                      <img 
                        src={featuredPost.featured_image_url} 
                        alt={featuredPost.title}
                        className="w-full h-64 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Regular Articles Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin h-12 w-12 border-3 border-primary border-t-transparent rounded-full mx-auto mb-6" />
              <p className="text-lg text-muted-foreground">Loading latest articles...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-3xl font-bold mb-4">No Articles Found</h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                {searchTerm ? "No articles match your search criteria. Try different keywords." : "No articles have been published yet. Check back soon!"}
              </p>
              <Link to="/resources">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                  Explore Resources Instead
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          ) : regularPosts.length > 0 ? (
            <>
              <div className="mb-12">
                <h2 className="text-2xl font-heading font-bold mb-2 flex items-center gap-3">
                  <span className="w-1 h-8 bg-gradient-primary rounded-full" />
                  Latest Articles
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post, index) => (
                  <article key={post.id} className={`group cursor-pointer ${index % 3 === 0 ? 'lg:col-span-2' : ''}`}>
                    <Link to={`/blog/${post.slug}`}>
                      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
                        {/* Image */}
                        {post.featured_image_url ? (
                          <div className="relative overflow-hidden h-64">
                            <img 
                              src={post.featured_image_url} 
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            
                            {/* Categories Overlay */}
                            {post.categories && post.categories.length > 0 && (
                              <div className="absolute top-4 left-4">
                                <Badge className="bg-white/90 text-foreground border-0 backdrop-blur-sm">
                                  {post.categories[0]}
                                </Badge>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="h-48 bg-gradient-to-br from-muted/50 to-muted/20 flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <User className="h-8 w-8 text-primary" />
                              </div>
                              <p className="text-sm text-muted-foreground">Agentic AI</p>
                            </div>
                          </div>
                        )}
                    
                        {/* Content */}
                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="text-xl font-heading font-bold mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          
                          <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed flex-grow">
                            {post.meta_description || stripHtml(post.content).substring(0, 120) + "..."}
                          </p>
                          
                          <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(post.created_at)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {calculateReadTime(post.content)}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
                              <span className="text-xs">Read</span>
                              <ArrowRight className="h-3 w-3" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 px-4 bg-gradient-to-br from-muted/40 via-muted/20 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Join 1000+ AI Enthusiasts
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6 leading-tight">
              Never Miss an 
              <span className="bg-gradient-primary bg-clip-text text-transparent"> AI Breakthrough</span>
          </h2>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              Get the latest AI insights, case studies, and industry trends delivered 
              directly to your inbox. Join thousands of business leaders staying ahead of the curve.
            </p>
            
            <form onSubmit={handleNewsletterSubscription} className="max-w-md mx-auto">
              <div className="flex gap-3 p-2 bg-background border-2 border-border/50 rounded-2xl focus-within:border-primary/50 transition-colors">
                <Input 
                  placeholder="Enter your email address" 
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base" 
                  disabled={isSubscribing}
                />
            <Button 
                  type="submit"
                  className="bg-gradient-primary hover:opacity-90 px-6 py-2 rounded-xl font-medium"
                  disabled={isSubscribing}
            >
                  {isSubscribing ? "Subscribing..." : "Subscribe"}
            </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                No spam. Unsubscribe anytime. Read our privacy policy.
              </p>
            </form>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Blog;
