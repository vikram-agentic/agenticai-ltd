import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Brain, Zap, Shield, Users, Star, TrendingUp, Clock, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-ai-automation.jpg";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Index = () => {
  const handleScheduleConsultation = () => {
    window.open("https://calendly.com/vikram-agentic-ai/30min", "_blank");
  };

  const handleContactUs = () => {
    window.location.href = "/contact";
  };
  const stats = [
    { icon: TrendingUp, number: "500+", label: "AI Solutions Deployed" },
    { icon: Users, number: "150+", label: "Happy Clients" },
    { icon: Clock, number: "95%", label: "Success Rate" },
    { icon: DollarSign, number: "340%", label: "Average ROI" }
  ];

  const testimonials = [
    {
      quote: "The AI system has revolutionized our loan processing capabilities. We're now processing loans faster and more accurately than ever before.",
      author: "Sarah Mitchell",
      position: "VP of Operations, Heritage Community Bank"
    },
    {
      quote: "AI Automation Agency transformed our operations completely. The ROI has been incredible.",
      author: "Alex Prindiville",
      position: "CEO, AP Homes"
    },
    {
      quote: "Their expertise in AI implementation is unmatched. A game-changer for our business.",
      author: "Kenneth Blaber",
      position: "Director, Autoboutique"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
                🚀 500+ AI Solutions Deployed
              </Badge>
              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight">
                Empowering Businesses with{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  AI & Automation
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Transform your business operations with cutting-edge agentic AI solutions. 
                We build autonomous systems that work 24/7, reduce costs by 95%, 
                and deliver 340% ROI in 18 months.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="bg-gradient-primary hover:opacity-90"
                  onClick={handleScheduleConsultation}
                >
                  Start Your AI Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Link to="/case-studies">
                  <Button size="lg" variant="outline">
                    View Our Work
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span>95% Success Rate</span>
                </div>
                <div>24/7 Support</div>
                <div>Tunbridge Wells, Kent</div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-3xl opacity-20" />
              <img 
                src={heroImage} 
                alt="AI Automation Solutions" 
                className="relative rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-heading font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Core Services
            </Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                AI Solutions That Deliver Results
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From custom AI development to agentic automation systems, 
              we provide comprehensive solutions that transform your business operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Brain,
                title: "Custom AI Development",
                description: "Machine learning models, NLP processing, computer vision, and predictive analytics tailored to your needs."
              },
              {
                icon: Zap,
                title: "AI Agent & Automation",
                description: "Intelligent agents for complex workflows, multi-agent systems, and 24/7 autonomous operations."
              },
              {
                icon: Shield,
                title: "Specialized AI Solutions",
                description: "AI security solutions, business intelligence, enterprise RAG implementation, and seamless integration."
              },
              {
                icon: Users,
                title: "Industry-Specific AI",
                description: "Tailored solutions for healthcare, finance, retail, legal, real estate, and education sectors."
              }
            ].map((feature, index) => (
              <Card key={index} className="group bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/10">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Case Study Highlight */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Featured Case Study
            </Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Heritage Community Bank Success
              </span>
            </h2>
          </div>

          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-heading font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                    86%
                  </div>
                  <p className="text-muted-foreground">Processing Time Reduction</p>
                  <p className="text-sm text-muted-foreground">From 18 days to 2.5 days</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-heading font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                    $2.4M
                  </div>
                  <p className="text-muted-foreground">Annual Cost Savings</p>
                  <p className="text-sm text-muted-foreground">Operational efficiency gains</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-heading font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                    340%
                  </div>
                  <p className="text-muted-foreground">ROI in 18 Months</p>
                  <p className="text-sm text-muted-foreground">Return on investment</p>
                </div>
              </div>
              <div className="mt-8 text-center">
                <p className="text-lg italic mb-4">
                  "The AI system has revolutionized our loan processing capabilities. We're now processing loans faster and more accurately than ever before."
                </p>
                <p className="font-medium">Sarah Mitchell, VP of Operations</p>
                <p className="text-sm text-muted-foreground">Heritage Community Bank</p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <Link to="/case-studies">
              <Button size="lg" variant="outline">
                View All Case Studies
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                What Our Clients Say
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear from business leaders who have transformed their operations with our AI solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="italic mb-4">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-primary/5">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the 150+ companies that have already accelerated their growth with our AI solutions. 
            Get started with a free consultation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:opacity-90"
              onClick={handleScheduleConsultation}
            >
              Start Your AI Journey
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={handleContactUs}
            >
              Contact Us
            </Button>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span>📧 info@agentic-ai.ltd</span>
            <span>📞 +44 7771 970567</span>
            <span>📍 Tunbridge Wells, Kent</span>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Index;