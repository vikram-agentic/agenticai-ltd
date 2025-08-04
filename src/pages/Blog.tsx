import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Calendar, User, ArrowRight, Search } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useContent } from "@/hooks/useContent";

const Blog = () => {
  const { slug } = useParams<{ slug: string }>();
  const { blogPosts, loading } = useContent();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.categories && post.categories.some(cat => 
      cat.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

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

  // If we have a slug, we're viewing a single post
  if (slug) {
    const post = blogPosts.find(p => p.slug === slug);
    
    if (!post) {
      return (
        <div className="min-h-screen bg-background pt-24 px-4">
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
      );
    }

    return (
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-2xl font-bold">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Agentic AI AMRO Ltd
                </span>
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">About</Link>
                <Link to="/services" className="text-foreground/80 hover:text-foreground transition-colors">Services</Link>
                <Link to="/case-studies" className="text-foreground/80 hover:text-foreground transition-colors">Case Studies</Link>
                <Link to="/resources" className="text-foreground/80 hover:text-foreground transition-colors">Resources</Link>
                <Link to="/contact" className="text-foreground/80 hover:text-foreground transition-colors">Contact</Link>
              </div>
              <Link to="/contact">
                <Button className="bg-gradient-primary hover:opacity-90">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Article Header */}
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-8">
              <Link to="/blog" className="text-primary hover:opacity-80 flex items-center gap-2">
                ← Back to Blog
              </Link>
            </div>
            
            {post.featured_image_url && (
              <div className="mb-8">
                <img 
                  src={post.featured_image_url} 
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover rounded-2xl"
                />
              </div>
            )}
            
            <div className="mb-8">
              {post.categories && post.categories.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {post.categories.map((category, index) => (
                    <Badge key={index} variant="outline">
                      {category}
                    </Badge>
                  ))}
                </div>
              )}
              
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                {post.title}
              </h1>
              
              {post.meta_description && (
                <p className="text-xl text-muted-foreground mb-6">
                  {post.meta_description}
                </p>
              )}
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.created_at)}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {calculateReadTime(post.content)}
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Agentic AI Team
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="pb-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div 
              className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground/80 prose-a:text-primary prose-strong:text-foreground prose-ul:text-foreground/80 prose-ol:text-foreground/80"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-heading font-bold mb-6">
              Ready to Implement These AI Solutions?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get expert guidance on implementing the AI strategies discussed in this article.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                  Consult Our Experts
                </Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="outline">
                  View Our Services
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Blog listing page
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Agentic AI AMRO Ltd
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">About</Link>
              <Link to="/services" className="text-foreground/80 hover:text-foreground transition-colors">Services</Link>
              <Link to="/case-studies" className="text-foreground/80 hover:text-foreground transition-colors">Case Studies</Link>
              <Link to="/resources" className="text-foreground/80 hover:text-foreground transition-colors">Resources</Link>
              <Link to="/contact" className="text-foreground/80 hover:text-foreground transition-colors">Contact</Link>
            </div>
            <Link to="/contact">
              <Button className="bg-gradient-primary hover:opacity-90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              AI Insights & Updates
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Stay updated with the latest trends, insights, and best practices in AI automation 
            and agentic systems from our expert team.
          </p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">Loading articles...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">No Articles Found</h3>
              <p className="text-muted-foreground mb-8">
                {searchTerm ? "No articles match your search criteria." : "No articles have been published yet."}
              </p>
              <Link to="/resources">
                <Button className="bg-gradient-primary hover:opacity-90">
                  View Resources Instead
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors group">
                  <CardHeader>
                    {post.featured_image_url && (
                      <div className="mb-4 -mx-6 -mt-6">
                        <img 
                          src={post.featured_image_url} 
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      </div>
                    )}
                    
                    {post.categories && post.categories.length > 0 && (
                      <div className="flex gap-2 mb-2">
                        {post.categories.slice(0, 2).map((category, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.meta_description || stripHtml(post.content).substring(0, 200) + "..."}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(post.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {calculateReadTime(post.content)}
                        </div>
                      </div>
                    </div>
                    
                    <Link to={`/blog/${post.slug}`}>
                      <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80">
                        Read More <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-heading font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Stay Updated
            </span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get the latest AI insights and industry updates delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <Input placeholder="Enter your email" className="flex-1" />
            <Button className="bg-gradient-primary hover:opacity-90">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;