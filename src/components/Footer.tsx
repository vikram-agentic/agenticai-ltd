import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Calendar, Linkedin } from "lucide-react";
import { MeetingBookingModal } from "./MeetingBookingModal";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const handleEmailContact = () => {
    window.location.href = "mailto:info@agentic-ai.ltd";
  };

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
          source: 'footer',
          tags: ['footer-subscriber']
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

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Case Studies", path: "/case-studies" },
  ];

  const resources = [
    { name: "Resources", path: "/resources" },
    { name: "Blog", path: "/blog" },
    { name: "What is Agentic AI?", path: "/what-is-agentic-ai" },
    { name: "Contact", path: "/contact" },
  ];

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "info@agentic-ai.ltd",
      action: () => window.location.href = "mailto:info@agentic-ai.ltd"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+44 7771 970567",
      action: () => window.location.href = "tel:+447771970567"
    },
    {
      icon: Phone,
      label: "Emergency",
      value: "+44 (0) 1892 529563",
      action: () => window.location.href = "tel:+441892529563"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Tunbridge Wells, Kent, UK",
      action: null
    }
  ];

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/assets/logo.png" alt="Agentic AI Logo" className="w-8 h-8" />
              <span className="font-heading font-bold text-xl">
                Agentic AI
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Accelerating the agentic transformation of businesses through intelligent automation and AI solutions.
            </p>
            <div className="flex space-x-3">
              <MeetingBookingModal 
                triggerText="Book Consultation"
                triggerSize="sm"
                className="bg-gradient-primary hover:opacity-90"
                serviceType="Footer Inquiry"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold">Resources</h3>
            <ul className="space-y-2">
              {resources.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-6">
            {/* Newsletter Signup */}
            <div className="space-y-3">
              <h3 className="font-heading font-bold">Stay Updated</h3>
              <p className="text-muted-foreground text-sm">
                Get AI insights delivered to your inbox.
              </p>
              <form onSubmit={handleNewsletterSubscription} className="space-y-2">
                <Input 
                  placeholder="Enter your email" 
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="text-sm" 
                  disabled={isSubscribing}
                />
                <Button 
                  type="submit"
                  size="sm"
                  className="w-full bg-gradient-primary hover:opacity-90"
                  disabled={isSubscribing}
                >
                  {isSubscribing ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <h3 className="font-heading font-bold">Contact</h3>
              <ul className="space-y-2">
                {contactInfo.slice(0, 2).map((info, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <info.icon className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                    <div>
                      {info.action ? (
                        <button
                          onClick={info.action}
                          className="text-xs hover:text-primary transition-colors text-left"
                        >
                          {info.value}
                        </button>
                      ) : (
                        <div className="text-xs">{info.value}</div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-muted-foreground text-sm">
            © 2024 Agentic AI AMRO Ltd. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Link 
              to="/contact" 
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/contact" 
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              Terms of Service
            </Link>
            <Button 
              onClick={handleEmailContact}
              variant="ghost" 
              size="sm"
              className="text-muted-foreground hover:text-primary"
            >
              <Mail className="h-4 w-4" />
            </Button>
            <Button 
              onClick={() => window.open("https://linkedin.com/company/agentic-ai-ltd", "_blank")}
              variant="ghost" 
              size="sm"
              className="text-muted-foreground hover:text-primary"
            >
              <Linkedin className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
