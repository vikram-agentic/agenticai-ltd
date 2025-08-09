import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Bot, 
  Shield, 
  Building, 
  HeadphonesIcon,
  Code,
  Zap,
  Settings,
  Hospital,
  CreditCard,
  ShoppingBag,
  Scale,
  Home,
  GraduationCap,
  Target,
  Users,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { MeetingBookingModal } from "@/components/MeetingBookingModal";
import { Button } from "@/components/ui/button";

const Services = () => {
  const navigate = useNavigate();
  const mainServices = [
    {
      icon: Brain,
      title: "Custom AI Development",
      description: "End-to-end AI solutions tailored to your specific business needs",
      features: [
        "Machine Learning Models (Deep Learning, NLP, Computer Vision)",
        "AI Application Development (Web, Mobile, APIs)",
        "AI Platform Integration & Database Connection",
        "MLOps & Deployment with Monitoring"
      ],
      price: "From £10,000"
    },
    {
      icon: Bot,
      title: "AI Agent & Automation Services",
      description: "Intelligent agents for complex workflows and decision-making",
      features: [
        "AI Agent Creation for Complex Workflows",
        "Process Automation with Adaptive Learning",
        "Multi-Agent Systems & AI Orchestration",
        "24/7 Operations with Round-the-Clock Monitoring"
      ],
      price: "From £15,000"
    },
    {
      icon: Shield,
      title: "Specialized AI Solutions",
      description: "Advanced AI solutions for security, analytics, and enterprise needs",
      features: [
        "AI Security Solutions & Threat Detection",
        "Business Intelligence & Predictive Analytics",
        "Seamless AI Integration into Existing Systems",
        "Enterprise RAG Implementation (Production-Ready)"
      ],
      price: "From £20,000"
    },
    {
      icon: Building,
      title: "Industry-Specific AI",
      description: "Tailored AI solutions for specific industry verticals",
      features: [
        "Healthcare: AI-Powered Diagnostic Tools",
        "Finance: Fraud Detection & Loan Processing",
        "Retail: Customer Experience Optimization",
        "Legal: Document Processing & Analysis"
      ],
      price: "Custom Pricing"
    },
    {
      icon: HeadphonesIcon,
      title: "AI Consulting & Support",
      description: "Comprehensive support and governance for your AI initiatives",
      features: [
        "AI Documentation & Training Programs",
        "AI Productization & SaaS MVP Development",
        "AI Governance & Compliance Monitoring",
        "White-label Solutions & Custom Copilots"
      ],
      price: "From £5,000"
    }
  ];

  const industries = [
    { icon: Hospital, name: "Healthcare", description: "AI diagnostic tools for medical imaging" },
    { icon: CreditCard, name: "Finance", description: "Fraud detection and automated processing" },
    { icon: ShoppingBag, name: "Retail", description: "Customer experience optimization" },
    { icon: Scale, name: "Legal", description: "Document processing and analysis" },
    { icon: Home, name: "Real Estate", description: "Property valuation and market analysis" },
    { icon: GraduationCap, name: "Education", description: "Personalized learning systems" }
  ];

  const techStack = [
    "TensorFlow", "PyTorch", "OpenAI GPT", "LangChain", "Hugging Face",
    "AWS SageMaker", "Docker", "Kubernetes", "API Integration", "Real-time Processing"
  ];

  const handleViewCaseStudies = () => {
    window.location.href = "/case-studies";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Hero Section */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              AI Solutions & Services
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Transform your business with our comprehensive AI automation services. 
            From custom AI development to industry-specific solutions.
          </p>
          <MeetingBookingModal 
            triggerText="Get Started Today"
            triggerSize="lg"
            className="bg-gradient-primary hover:opacity-90"
            serviceType="General Inquiry"
          />
        </div>
      </section>

      {/* Main Services */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Core Services
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive AI solutions designed to accelerate your digital transformation
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {[
              {
                icon: Brain,
                title: "Custom AI Development",
                description: "Tailored AI solutions built from the ground up to solve your unique business challenges.",
                features: ["Machine Learning Models", "Neural Networks", "Computer Vision", "Natural Language Processing"],
                price: "Starting at $50,000",
                path: "/services/custom-ai-development"
              },
              {
                icon: Bot,
                title: "AI Agent & Automation",
                description: "Intelligent agents that automate complex workflows and decision-making processes.",
                features: ["Process Automation", "Intelligent Agents", "Workflow Optimization", "Decision Support"],
                price: "Starting at $25,000",
                path: "/services/ai-agent-automation"
              },
              {
                icon: Zap,
                title: "Specialized AI Solutions",
                description: "Advanced AI applications for specific domains like computer vision, NLP, and predictive analytics.",
                features: ["Computer Vision", "Predictive Analytics", "Recommendation Systems", "Fraud Detection"],
                price: "Starting at $75,000",
                path: "/services/specialized-ai-solutions"
              },
              {
                icon: Target,
                title: "Industry-Specific AI",
                description: "AI solutions designed for specific industries with deep domain expertise.",
                features: ["Healthcare AI", "Financial AI", "Retail AI", "Manufacturing AI"],
                price: "Starting at $100,000",
                path: "/services/industry-specific-ai"
              },
              {
                icon: Users,
                title: "AI Consulting & Support",
                description: "Strategic guidance and ongoing support for your AI initiatives.",
                features: ["Strategy Development", "Implementation Planning", "Training Programs", "24/7 Support"],
                price: "Starting at $15,000",
                path: "/services/ai-consulting-support"
              }
            ].map((service, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <Badge variant="secondary">{service.price}</Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full bg-gradient-primary hover:opacity-90"
                    onClick={() => navigate(service.path)}
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Industry Solutions
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Specialized AI solutions tailored for specific industry needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <industry.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-2">{industry.name}</h3>
                  <p className="text-muted-foreground text-sm">{industry.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Technology Stack
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We leverage cutting-edge technologies to build robust AI solutions
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech, index) => (
              <Badge key={index} variant="outline" className="px-4 py-2 border-primary/20">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Process Overview */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Our Process
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From consultation to deployment, we ensure smooth delivery
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Consultation", description: "Understanding your needs and requirements" },
              { step: "02", title: "Planning", description: "Designing the optimal AI solution architecture" },
              { step: "03", title: "Development", description: "Building and training your AI models" },
              { step: "04", title: "Deployment", description: "Launching and monitoring your AI solution" }
            ].map((process, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20 text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-heading font-bold bg-gradient-primary bg-clip-text text-transparent mb-3">
                    {process.step}
                  </div>
                  <h3 className="text-lg font-heading font-bold mb-2">{process.title}</h3>
                  <p className="text-muted-foreground text-sm">{process.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-heading font-bold mb-6">
            Ready to Start Your AI Project?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get a free consultation and discover how AI can transform your business operations.
          </p>
          <div className="flex gap-4 justify-center">
            <MeetingBookingModal 
              triggerText="Free Consultation"
              triggerSize="lg"
              className="bg-gradient-primary hover:opacity-90"
              serviceType="General Inquiry"
            />
            <Button 
              size="lg" 
              variant="outline"
              onClick={handleViewCaseStudies}
            >
              View Case Studies
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Services;
