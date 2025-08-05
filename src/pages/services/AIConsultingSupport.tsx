import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, Users, Lightbulb, Target, BookOpen, PhoneCall, Headphones } from "lucide-react";

const AIConsultingSupport = () => {
  const navigate = useNavigate();

  const handleScheduleConsultation = () => {
    window.open("https://calendly.com/vikram-agentic-ai/30min", "_blank");
  };

  const handleContactUs = () => {
    navigate("/contact");
  };

  const services = [
    {
      icon: Lightbulb,
      title: "AI Strategy Consulting",
      description: "Develop comprehensive AI strategies aligned with your business goals",
      features: [
        "AI readiness assessment",
        "Technology roadmap development",
        "ROI analysis and business case",
        "Risk assessment and mitigation",
        "Change management planning"
      ],
      duration: "2-4 weeks",
      price: "$15,000 - $35,000"
    },
    {
      icon: Target,
      title: "AI Implementation Planning",
      description: "Detailed planning and project management for AI initiatives",
      features: [
        "Project scoping and timeline",
        "Resource allocation planning",
        "Vendor evaluation and selection",
        "Team structure recommendations",
        "Success metrics definition"
      ],
      duration: "3-6 weeks", 
      price: "$20,000 - $45,000"
    },
    {
      icon: BookOpen,
      title: "AI Training & Education",
      description: "Comprehensive AI training programs for your team",
      features: [
        "Executive AI workshops",
        "Technical team training",
        "AI literacy programs",
        "Custom curriculum development",
        "Certification programs"
      ],
      duration: "Ongoing",
      price: "$5,000 - $25,000"
    },
    {
      icon: Headphones,
      title: "Ongoing AI Support",
      description: "Continuous support and optimization for your AI systems",
      features: [
        "24/7 technical support",
        "Performance monitoring",
        "Model optimization",
        "System maintenance",
        "Feature updates and improvements"
      ],
      duration: "Monthly/Annual",
      price: "$10,000 - $50,000/month"
    }
  ];

  const consultingProcess = [
    {
      step: "Assessment",
      description: "Comprehensive evaluation of your current state and AI opportunities",
      deliverables: ["Current state analysis", "Opportunity identification", "Readiness assessment"]
    },
    {
      step: "Strategy",
      description: "Development of tailored AI strategy and implementation roadmap",
      deliverables: ["AI strategy document", "Implementation roadmap", "Business case"]
    },
    {
      step: "Planning",
      description: "Detailed project planning and resource allocation",
      deliverables: ["Project plans", "Resource requirements", "Risk mitigation strategies"]
    },
    {
      step: "Execution",
      description: "Hands-on support during implementation and deployment",
      deliverables: ["Implementation guidance", "Quality assurance", "Performance optimization"]
    }
  ];

  const supportTiers = [
    {
      name: "Basic Support",
      price: "$5,000/month",
      features: [
        "Email support (48hr response)",
        "Monthly health checks",
        "Basic performance monitoring",
        "Documentation updates",
        "Best practices guidance"
      ],
      ideal: "Small teams with basic AI implementations"
    },
    {
      name: "Professional Support",
      price: "$15,000/month", 
      features: [
        "Priority support (24hr response)",
        "Weekly performance reviews",
        "Advanced monitoring & alerts",
        "Model optimization quarterly",
        "Training session credits",
        "Dedicated support manager"
      ],
      ideal: "Growing businesses with multiple AI systems",
      popular: true
    },
    {
      name: "Enterprise Support",
      price: "$35,000+/month",
      features: [
        "24/7 premium support",
        "Daily monitoring & reporting",
        "Proactive optimization",
        "Unlimited training & consulting",
        "Dedicated AI team",
        "Custom SLA agreements"
      ],
      ideal: "Large enterprises with mission-critical AI"
    }
  ];

  const whyChooseUs = [
    "10+ years of combined AI expertise",
    "Proven track record with 200+ clients",
    "Industry-agnostic consulting experience",
    "Technology-neutral recommendations",
    "End-to-end project support",
    "Flexible engagement models"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-4">
            <Users className="w-4 h-4 mr-2" />
            AI Consulting & Support
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Expert AI Guidance Every Step of the Way
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            From strategy development to ongoing support, our AI experts help you navigate the complex world of artificial intelligence with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleScheduleConsultation}
              className="bg-gradient-primary hover:opacity-90"
            >
              Get Expert AI Guidance
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/support-options')}
            >
              Explore Support Options
            </Button>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Consulting Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive AI consulting and support services to accelerate your AI journey.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Badge variant="outline">{service.duration}</Badge>
                    <Badge variant="secondary">{service.price}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full mt-6" 
                    variant="outline"
                    onClick={() => navigate('/support-options')}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Consulting Process */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Consulting Process</h2>
            <p className="text-muted-foreground">
              A systematic approach to AI consulting that ensures successful outcomes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {consultingProcess.map((phase, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="text-3xl font-bold text-primary mb-2">{index + 1}</div>
                  <CardTitle className="text-lg">{phase.step}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription>{phase.description}</CardDescription>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Deliverables:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {phase.deliverables.map((deliverable, idx) => (
                        <li key={idx}>• {deliverable}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Tiers */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ongoing Support Plans</h2>
            <p className="text-muted-foreground">
              Choose the support level that matches your AI operations and growth plans.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {supportTiers.map((tier, index) => (
              <Card key={index} className={`relative ${tier.popular ? 'border-primary' : ''}`}>
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary">{tier.price}</div>
                  <CardDescription className="text-xs">{tier.ideal}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full"
                    variant={tier.popular ? "default" : "outline"}
                    onClick={handleScheduleConsultation}
                  >
                    Choose Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose Our AI Consulting?</h2>
              <p className="text-muted-foreground mb-8">
                Our team combines deep technical expertise with business acumen to deliver AI strategies that actually work in the real world.
              </p>
              
              <div className="space-y-4">
                {whyChooseUs.map((reason, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-primary p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-6">Client Success Metrics</h3>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { metric: "95%", label: "Client Satisfaction" },
                  { metric: "200+", label: "Projects Completed" },
                  { metric: "60%", label: "Faster Time to Value" },
                  { metric: "24/7", label: "Expert Support" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold mb-2">{stat.metric}</div>
                    <div className="text-sm opacity-90">{stat.label}</div>
                  </div>
                ))}
              </div>
              <Button 
                variant="secondary" 
                className="w-full mt-6"
                onClick={handleScheduleConsultation}
              >
                Start Your AI Journey
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Training Programs */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">AI Training Programs</h2>
            <p className="text-muted-foreground">
              Empower your team with AI knowledge and skills through our comprehensive training programs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Executive AI Workshop",
                duration: "1-2 days",
                audience: "C-level executives and decision makers",
                focus: "AI strategy, business impact, and ROI",
                price: "$5,000 - $10,000"
              },
              {
                title: "Technical AI Training",
                duration: "1-2 weeks", 
                audience: "Developers, data scientists, engineers",
                focus: "Hands-on AI development and implementation",
                price: "$15,000 - $25,000"
              },
              {
                title: "AI Literacy Program",
                duration: "Ongoing",
                audience: "All employees across departments",
                focus: "AI basics, tools, and practical applications",
                price: "$10,000 - $20,000"
              }
            ].map((program, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">{program.title}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline">{program.duration}</Badge>
                    <Badge variant="secondary">{program.price}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm">Target Audience:</h4>
                    <p className="text-sm text-muted-foreground">{program.audience}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Focus Areas:</h4>
                    <p className="text-sm text-muted-foreground">{program.focus}</p>
                  </div>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={handleScheduleConsultation}
                  >
                    Learn More
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
          <h2 className="text-3xl font-bold mb-4">Ready to Accelerate Your AI Journey?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Get expert guidance from our AI consultants and ensure your AI initiatives deliver maximum value.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              onClick={handleScheduleConsultation}
            >
              Schedule Free Consultation
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-primary"
              onClick={handleContactUs}
            >
              Contact Our Team
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AIConsultingSupport;