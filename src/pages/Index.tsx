import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  Zap, 
  Shield, 
  Gauge, 
  Target, 
  CheckCircle, 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin,
  Bot,
  Cpu,
  Network,
  Sparkles,
  TrendingUp,
  Clock,
  Users,
  Star,
  Calendar,
  Download
} from "lucide-react";
import heroImage from "@/assets/hero-ai-automation.jpg";

const Index = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you within 24 hours to discuss your AI automation needs.",
      });
      setFormData({ name: "", email: "", company: "", service: "", message: "" });
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-card border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold gradient-text">Agentic AI AMRO</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="hover:text-primary transition-colors">Services</a>
              <a href="#case-studies" className="hover:text-primary transition-colors">Case Studies</a>
              <a href="#about" className="hover:text-primary transition-colors">About</a>
              <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
              <Button variant="gradient" size="sm">
                Free Consultation
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 neural-grid opacity-30"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background"></div>
        
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
              Empowering Businesses with AI & Automation
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto">
              Accelerate your agentic transformation with autonomous AI systems that are intelligent, 
              responsible, and aligned with your business values.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="glow" size="xl" className="animate-pulse-glow">
                <Sparkles className="mr-2" />
                Start Your AI Journey
              </Button>
              <Button variant="gradient-outline" size="xl">
                <Calendar className="mr-2" />
                Free Consultation
              </Button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {[
              { number: "500+", label: "AI Solutions Deployed" },
              { number: "150+", label: "Happy Clients" },
              { number: "95%", label: "Success Rate" },
              { number: "340%", label: "Average ROI" }
            ].map((stat, index) => (
              <Card key={index} className="glass-card border-0 text-center animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold gradient-text">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-b from-background to-card/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">Our AI Solutions</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive AI automation services designed to transform your business operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Custom AI Development",
                description: "Machine Learning Models, NLP Processing, Computer Vision, and Predictive Analytics tailored to your needs.",
                features: ["Deep Learning Models", "API Development", "Cloud Integration", "MLOps Deployment"]
              },
              {
                icon: Bot,
                title: "AI Agent & Automation",
                description: "Intelligent agents for complex workflows, multi-agent systems, and 24/7 autonomous operations.",
                features: ["AI Agent Creation", "Process Automation", "Multi-Agent Systems", "24/7 Operations"]
              },
              {
                icon: Shield,
                title: "AI Security Solutions",
                description: "Advanced threat detection, automated security response, and enterprise-grade protection.",
                features: ["Threat Detection", "Security Response", "Compliance Monitoring", "Audit Trails"]
              },
              {
                icon: Cpu,
                title: "Business Intelligence",
                description: "Predictive analytics and ML models that deliver actionable insights for data-driven decisions.",
                features: ["Predictive Analytics", "ML Models", "Data Insights", "Performance Metrics"]
              },
              {
                icon: Network,
                title: "Enterprise RAG Implementation",
                description: "Production-ready Retrieval-Augmented Generation systems for enhanced AI capabilities.",
                features: ["RAG Systems", "Document Processing", "Knowledge Bases", "Search Enhancement"]
              },
              {
                icon: Target,
                title: "Industry-Specific AI",
                description: "Specialized solutions for Healthcare, Finance, Retail, Legal, Real Estate, and Education.",
                features: ["Healthcare AI", "Finance Automation", "Retail Optimization", "Legal Processing"]
              }
            ].map((service, index) => (
              <Card key={index} className="glass-card border-0 hover:scale-105 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-lg bg-gradient-primary">
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-primary mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Section */}
      <section id="case-studies" className="py-20 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">Success Stories</h2>
            <p className="text-xl text-muted-foreground">Real results from our AI automation implementations</p>
          </div>

          <Card className="glass-card border-0 max-w-6xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">Heritage Community Bank</CardTitle>
              <p className="text-muted-foreground">Loan Processing Automation</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-primary">Challenge</h4>
                  <p className="text-muted-foreground mb-6">
                    Manual loan processing taking 15-20 business days with high error rates and significant operational costs.
                  </p>
                  
                  <h4 className="text-lg font-semibold mb-3 text-primary">Solution</h4>
                  <p className="text-muted-foreground">
                    Multi-agent AI system for document processing and automated compliance checking with real-time validation.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-primary">Results</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { metric: "86%", label: "Processing Time Reduction" },
                      { metric: "$2.4M", label: "Annual Cost Savings" },
                      { metric: "340%", label: "ROI in 18 Months" },
                      { metric: "94%", label: "Error Reduction" }
                    ].map((result, index) => (
                      <div key={index} className="text-center p-4 rounded-lg bg-gradient-primary/10">
                        <div className="text-2xl font-bold gradient-text">{result.metric}</div>
                        <div className="text-sm text-muted-foreground">{result.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-6 rounded-lg bg-muted/50 border-l-4 border-primary">
                <p className="italic text-muted-foreground">
                  "The AI system has revolutionized our loan processing capabilities. We're now processing loans faster 
                  and more accurately than ever before, while our team can focus on customer relationships rather than paperwork."
                </p>
                <p className="mt-2 font-semibold">— Sarah Mitchell, VP of Operations, Heritage Community Bank</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">What Our Clients Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "AI Automation Agency transformed our operations completely. The ROI has been incredible.",
                author: "Alex Prindiville",
                title: "CEO, AP Homes"
              },
              {
                quote: "Their expertise in AI implementation is unmatched. A game-changer for our business.",
                author: "Kenneth Blaber",
                title: "Director, Autoboutique"
              },
              {
                quote: "The level of customization and support we received was exceptional.",
                author: "Sarah Louis",
                title: "CTO, H2H Investments"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="glass-card border-0">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">About Agentic AI AMRO</h2>
              <p className="text-xl text-muted-foreground mb-6">
                Founded in 2023 and based in Tunbridge Wells, Kent, we're pioneers in agentic AI transformation, 
                specializing in autonomous systems that revolutionize business operations.
              </p>
              <p className="text-muted-foreground mb-8">
                Our mission is to accelerate the agentic transformation of businesses by building autonomous systems 
                that are not just intelligent, but also responsible, reliable, and aligned with human values.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: TrendingUp, label: "500+ Projects Delivered" },
                  { icon: Clock, label: "24/7 Support Available" },
                  { icon: Users, label: "150+ Happy Clients" },
                  { icon: Gauge, label: "95% Success Rate" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gradient-primary">
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="gradient-text">Our Technology Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "TensorFlow", "PyTorch", "OpenAI GPT", "LangChain",
                    "Hugging Face", "AWS SageMaker", "Docker", "Kubernetes"
                  ].map((tech, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">{tech}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">Start Your AI Transformation</h2>
            <p className="text-xl text-muted-foreground">
              Ready to revolutionize your business with AI automation? Let's discuss your project.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-2xl gradient-text">Get in Touch</CardTitle>
                <p className="text-muted-foreground">Fill out the form and we'll get back to you within 24 hours</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Name *</label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="bg-muted/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email *</label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="bg-muted/50"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Company</label>
                    <Input
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="bg-muted/50"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Service Interest</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-md bg-muted/50 border border-border"
                    >
                      <option value="">Select a service</option>
                      <option value="custom-ai">Custom AI Development</option>
                      <option value="ai-agents">AI Agent & Automation</option>
                      <option value="security">AI Security Solutions</option>
                      <option value="bi">Business Intelligence</option>
                      <option value="rag">Enterprise RAG</option>
                      <option value="industry">Industry-Specific AI</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Project Details</label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="bg-muted/50"
                      placeholder="Tell us about your project requirements..."
                    />
                  </div>
                  
                  <Button type="submit" variant="gradient" size="lg" className="w-full">
                    <Zap className="mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <Card className="glass-card border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 rounded-lg bg-gradient-primary">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Phone</h4>
                      <p className="text-muted-foreground">+44 7771 970567</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 rounded-lg bg-gradient-primary">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Email</h4>
                      <p className="text-muted-foreground">info@agentic-ai.ltd</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-lg bg-gradient-primary">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Location</h4>
                      <p className="text-muted-foreground">Tunbridge Wells, Kent, UK</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="gradient-text">Book a Free Consultation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Schedule a 30-minute consultation to discuss your AI automation needs.
                  </p>
                  <Button variant="gradient-outline" size="lg" className="w-full">
                    <Calendar className="mr-2" />
                    Schedule Meeting
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="gradient-text">Download Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "AI Implementation Guide",
                      "Cost Optimization Strategies",
                      "Industry AI Report 2025"
                    ].map((resource, index) => (
                      <Button key={index} variant="ghost" className="w-full justify-start">
                        <Download className="mr-2 h-4 w-4" />
                        {resource}
                        <ArrowRight className="ml-auto h-4 w-4" />
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/50 border-t py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Bot className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold gradient-text">Agentic AI AMRO Ltd</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Empowering Businesses with AI & Automation
            </p>
            <p className="text-sm text-muted-foreground">
              © 2023 Agentic AI AMRO Ltd. All rights reserved. | Tunbridge Wells, Kent, UK
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;