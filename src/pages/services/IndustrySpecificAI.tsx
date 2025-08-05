import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, Building2, Heart, ShoppingCart, Factory, Briefcase, GraduationCap } from "lucide-react";

const IndustrySpecificAI = () => {
  const navigate = useNavigate();

  const handleScheduleConsultation = () => {
    window.open("https://calendly.com/vikram-agentic-ai/30min", "_blank");
  };

  const handleContactUs = () => {
    navigate("/contact");
  };

  const industries = [
    {
      icon: Heart,
      title: "Healthcare",
      description: "AI solutions for diagnostics, patient care, and operational efficiency",
      solutions: [
        "Medical image analysis and diagnostics",
        "Drug discovery and development",
        "Electronic health record optimization",
        "Predictive patient monitoring",
        "Clinical decision support systems"
      ],
      caseStudy: "Reduced diagnostic time by 60% with AI-powered radiology analysis"
    },
    {
      icon: Building2,
      title: "Financial Services",
      description: "Advanced AI for fraud detection, risk assessment, and algorithmic trading",
      solutions: [
        "Real-time fraud detection and prevention",
        "Credit risk assessment and scoring",
        "Algorithmic trading strategies",
        "Regulatory compliance automation",
        "Customer service chatbots"
      ],
      caseStudy: "Achieved 99.8% fraud detection accuracy while reducing false positives by 45%"
    },
    {
      icon: ShoppingCart,
      title: "Retail & E-commerce",
      description: "Personalization, inventory management, and customer experience optimization",
      solutions: [
        "Personalized recommendation engines",
        "Dynamic pricing optimization",
        "Inventory demand forecasting",
        "Visual search and product discovery",
        "Customer behavior analytics"
      ],
      caseStudy: "Increased conversion rates by 40% with AI-powered personalization"
    },
    {
      icon: Factory,
      title: "Manufacturing",
      description: "Smart manufacturing, predictive maintenance, and quality control",
      solutions: [
        "Predictive maintenance systems",
        "Quality control automation",
        "Supply chain optimization",
        "Production planning and scheduling",
        "Equipment performance monitoring"
      ],
      caseStudy: "Reduced equipment downtime by 50% with predictive maintenance AI"
    },
    {
      icon: Briefcase,
      title: "Professional Services",
      description: "Document processing, workflow automation, and client insights",
      solutions: [
        "Document analysis and extraction",
        "Contract review automation",
        "Client relationship management",
        "Billing and time tracking optimization",
        "Knowledge management systems"
      ],
      caseStudy: "Automated 80% of document processing, saving 25 hours per week"
    },
    {
      icon: GraduationCap,
      title: "Education",
      description: "Personalized learning, assessment automation, and student analytics",
      solutions: [
        "Adaptive learning platforms",
        "Automated grading and assessment",
        "Student performance analytics",
        "Curriculum optimization",
        "Virtual tutoring systems"
      ],
      caseStudy: "Improved student outcomes by 30% with personalized AI tutoring"
    }
  ];

  const implementationApproach = [
    {
      phase: "Industry Analysis",
      description: "Deep dive into your industry's specific challenges, regulations, and opportunities",
      duration: "1-2 weeks"
    },
    {
      phase: "Solution Design", 
      description: "Custom AI architecture designed for your industry's unique requirements",
      duration: "2-3 weeks"
    },
    {
      phase: "Prototype Development",
      description: "Build and test industry-specific AI models with your data",
      duration: "4-6 weeks"
    },
    {
      phase: "Production Deployment",
      description: "Deploy, monitor, and optimize AI solutions in your environment",
      duration: "2-4 weeks"
    }
  ];

  const benefits = [
    "Industry-specific expertise and understanding",
    "Compliance with sector regulations and standards", 
    "Pre-built solutions for common industry challenges",
    "Domain-specific data models and algorithms",
    "Faster implementation with proven frameworks",
    "Ongoing support from industry AI specialists"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-4">
            <Building2 className="w-4 h-4 mr-2" />
            Industry-Specific AI
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI Solutions Tailored to Your Industry
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Leverage our deep industry expertise to implement AI solutions that understand your sector's unique challenges, regulations, and opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleScheduleConsultation}
              className="bg-gradient-primary hover:opacity-90"
            >
              Explore Industry Solutions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/case-studies')}
            >
              View Industry Case Studies
            </Button>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Industries We Serve</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Specialized AI solutions designed for the unique needs of each industry.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {industries.map((industry, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <industry.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{industry.title}</CardTitle>
                      <CardDescription>{industry.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3">AI Solutions:</h4>
                      <ul className="space-y-2">
                        {industry.solutions.map((solution, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{solution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-primary/5 p-4 rounded-lg">
                      <h4 className="font-semibold text-primary mb-2">Success Story:</h4>
                      <p className="text-sm text-muted-foreground">{industry.caseStudy}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Industry-Specific */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Industry-Specific AI Matters</h2>
              <p className="text-muted-foreground mb-8">
                Generic AI solutions often fall short of addressing the nuanced challenges of specific industries. Our industry-focused approach ensures AI that truly understands your business context.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { metric: "95%", label: "Client Satisfaction", sublabel: "in industry projects" },
                { metric: "60%", label: "Faster Implementation", sublabel: "vs generic solutions" },
                { metric: "40%", label: "Better ROI", sublabel: "with tailored approach" },
                { metric: "24/7", label: "Industry Support", sublabel: "from domain experts" }
              ].map((stat, index) => (
                <Card key={index} className="text-center p-6">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.metric}</div>
                  <div className="font-semibold">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.sublabel}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Approach */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Industry-Focused Approach</h2>
            <p className="text-muted-foreground">
              A systematic methodology that ensures AI solutions align with industry best practices.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {implementationApproach.map((phase, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="text-3xl font-bold text-primary mb-2">{index + 1}</div>
                  <CardTitle className="text-lg">{phase.phase}</CardTitle>
                  <Badge variant="outline">{phase.duration}</Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription>{phase.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance & Standards */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Compliance & Industry Standards</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI solutions are built with industry regulations and standards in mind.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "HIPAA Compliance", description: "Healthcare AI solutions that protect patient data", industry: "Healthcare" },
              { title: "SOX & Financial Regulations", description: "AI systems compliant with financial industry standards", industry: "Finance" },
              { title: "GDPR & Data Privacy", description: "AI solutions that respect consumer privacy rights", industry: "Retail" },
              { title: "FDA Validation", description: "Medical AI systems ready for regulatory approval", industry: "Healthcare" },
              { title: "ISO Standards", description: "Manufacturing AI aligned with quality standards", industry: "Manufacturing" },
              { title: "Educational Standards", description: "AI solutions meeting academic and privacy requirements", industry: "Education" }
            ].map((standard, index) => (
              <Card key={index}>
                <CardHeader>
                  <Badge variant="outline" className="w-fit mb-2">{standard.industry}</Badge>
                  <CardTitle className="text-lg">{standard.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{standard.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Industry AI Investment</h2>
            <p className="text-muted-foreground">
              Pricing tailored to industry complexity and regulatory requirements.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Industry Assessment",
                price: "$10,000 - $25,000",
                timeline: "2-4 weeks",
                features: ["Industry analysis", "Compliance review", "Opportunity assessment", "AI readiness audit", "Implementation roadmap"]
              },
              {
                name: "Sector Solution",
                price: "$50,000 - $150,000",
                timeline: "3-6 months",
                features: ["Industry-specific AI development", "Regulatory compliance", "Custom integrations", "Staff training", "3 months support"],
                popular: true
              },
              {
                name: "Enterprise Platform",
                price: "$200,000+",
                timeline: "6+ months",
                features: ["Multi-department AI platform", "Advanced compliance features", "Dedicated industry team", "Ongoing optimization", "Priority support"]
              }
            ].map((tier, index) => (
              <Card key={index} className={`relative ${tier.popular ? 'border-primary' : ''}`}>
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary">{tier.price}</div>
                  <CardDescription>{tier.timeline}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full mt-6"
                    variant={tier.popular ? "default" : "outline"}
                    onClick={handleScheduleConsultation}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for Industry-Specific AI?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Let's discuss how AI can transform your industry-specific challenges into competitive advantages.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              onClick={handleScheduleConsultation}
            >
              Schedule Industry Consultation
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-primary"
              onClick={handleContactUs}
            >
              Explore Your Industry
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default IndustrySpecificAI;