import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, CheckCircle2, Loader2, Sparkles } from "lucide-react";

interface NewsletterSubscriptionProps {
  variant?: 'default' | 'compact' | 'inline' | 'footer';
  source?: string;
  className?: string;
  showBenefits?: boolean;
  title?: string;
  description?: string;
}

const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({
  variant = 'default',
  source = 'website',
  className = '',
  showBenefits = true,
  title,
  description
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('gmail-newsletter', {
        body: {
          action: 'subscribe',
          email: email.trim(),
          name: name.trim() || undefined,
          source: source,
          tags: [source, 'website-subscription']
        }
      });

      if (error) throw error;

      setSubscribed(true);
      toast({
        title: "Welcome aboard!",
        description: data.alreadySubscribed ? data.message : "Thank you for subscribing! Check your email for confirmation.",
      });

      // Clear form
      setEmail('');
      setName('');

    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Subscription Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    "💡 Weekly AI insights and industry news",
    "🚀 Exclusive case studies and success stories", 
    "🔧 Practical automation guides and tutorials",
    "📊 Market trends and compliance updates",
    "🎯 Early access to new resources and tools"
  ];

  // Compact variant for sidebars or small spaces
  if (variant === 'compact') {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            {title || "Stay Updated"}
          </CardTitle>
          <CardDescription className="text-sm">
            {description || "Get the latest AI automation insights."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {!subscribed ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="text-sm"
              />
              <Button 
                type="submit" 
                size="sm"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Mail className="h-4 w-4 mr-2" />
                )}
                Subscribe
              </Button>
            </form>
          ) : (
            <div className="text-center py-4">
              <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Successfully subscribed!</p>
              <p className="text-xs text-muted-foreground">Check your email for confirmation.</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Inline variant for embedding in content
  if (variant === 'inline') {
    return (
      <div className={`bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-6 border ${className}`}>
        {!subscribed ? (
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <Sparkles className="h-6 w-6 text-primary mr-2" />
              <h3 className="text-lg font-semibold">
                {title || "Join 5,000+ AI Leaders"}
              </h3>
            </div>
            <p className="text-muted-foreground mb-4 text-sm">
              {description || "Get weekly insights on agentic AI, automation strategies, and industry trends."}
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={loading}
                className="whitespace-nowrap"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Mail className="h-4 w-4 mr-2" />
                )}
                Subscribe Free
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        ) : (
          <div className="text-center">
            <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-400">Welcome to the Community!</h3>
            <p className="text-sm text-muted-foreground">Check your email for your first newsletter.</p>
          </div>
        )}
      </div>
    );
  }

  // Footer variant for page footers
  if (variant === 'footer') {
    return (
      <div className={`${className}`}>
        {!subscribed ? (
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Mail className="h-5 w-5" />
              {title || "Newsletter"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {description || "Weekly AI insights and automation strategies."}
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="bg-background"
              />
              <Button 
                type="submit" 
                size="sm"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Mail className="h-4 w-4 mr-2" />
                )}
                Subscribe
              </Button>
            </form>
          </div>
        ) : (
          <div className="text-center py-4">
            <CheckCircle2 className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Thanks for subscribing!</p>
          </div>
        )}
      </div>
    );
  }

  // Default variant - full featured card
  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">
          {title || "Stay Ahead with AI Insights"}
        </CardTitle>
        <CardDescription>
          {description || "Join thousands of professionals getting weekly insights on agentic AI, automation strategies, and industry trends."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!subscribed ? (
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="name">Name (Optional)</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Mail className="h-4 w-4 mr-2" />
                )}
                Subscribe to Newsletter
              </Button>
            </form>
            
            {showBenefits && (
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-semibold mb-3 text-sm">What you'll get:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                No spam, ever. Unsubscribe with one click.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-800 dark:text-green-400 mb-2">
              Welcome to the Community!
            </h3>
            <p className="text-muted-foreground mb-4">
              Thank you for subscribing! You'll receive your first newsletter soon.
            </p>
            <p className="text-sm text-muted-foreground">
              Check your email for a confirmation message and to manage your preferences.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsletterSubscription;