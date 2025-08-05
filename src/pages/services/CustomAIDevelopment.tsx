import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, Brain, Code, Zap, Shield, Users, TrendingUp } from "lucide-react";

const CustomAIDevelopment = () => {
  const navigate = useNavigate();

  const handleScheduleConsultation = () => {
    window.open("https://calendly.com/vikram-agentic-ai/30min", "_blank");
  };

  const handleContactUs = () => {
    navigate("/contact");
  };

  const features = [
    "Custom Machine Learning Models",
    "Neural Network Architecture Design",
    "Computer Vision Solutions",
    "Natural Language Processing",
    "Predictive Analytics",
    "Deep Learning Implementation",
    "Model Training & Optimization",
    "API Development & Integration"
  ];

  const technologies = [
    "TensorFlow", "PyTorch", "Scikit-learn", "OpenAI GPT", "Hugging Face",
    "Python", "R", "JavaScript", "Docker", "Kubernetes", "AWS", "Google Cloud"
  ];

  const caseStudies = [
    {
      title: "Healthcare Diagnostic AI",
      description: "Developed custom medical imaging AI that improved diagnostic accuracy by 35%",
      industry: "Healthcare",
      result: "35% improvement in diagnostic accuracy"
    },
    {
      title: "Financial Fraud Detection",
      description: "Built real-time fraud detection system processing 1M+ transactions daily",
      industry: "Finance",
      result: "99.7% fraud detection accuracy"
    },
    {
      title: "Manufacturing Quality Control",
      description: "Computer vision solution for automated quality inspection",
      industry: "Manufacturing", 
      result: "40% reduction in defect rates"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-4">
            <Brain className="w-4 h-4 mr-2" />
            Custom AI Development
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Custom AI Solutions Built for Your Business
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            From concept to deployment, we build tailored AI solutions that solve your unique business challenges and drive measurable results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleScheduleConsultation}
              className="bg-gradient-primary hover:opacity-90"
            >
              Start Your AI Project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleContactUs}
            >
              View Our Portfolio
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What We Build</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We develop custom AI solutions tailored to your specific business needs and industry requirements.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="p-4">
                <CardContent className="p-0">
                  <CheckCircle className="h-6 w-6 text-green-500 mb-3" />
                  <h3 className="font-semibold">{feature}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Technology Stack</h2>
            <p className="text-muted-foreground">
              We use cutting-edge technologies to build robust and scalable AI solutions.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {technologies.map((tech, index) => (
              <Badge key={index} variant="secondary" className="px-4 py-2">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-muted-foreground">
              Real results from custom AI solutions we've built for our clients.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {caseStudies.map((study, index) => (
              <Card key={index}>
                <CardHeader>
                  <Badge variant="outline" className="w-fit mb-2">{study.industry}</Badge>
                  <CardTitle className="text-xl">{study.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {study.description}
                  </CardDescription>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <span className="font-semibold">{study.result}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Development Process</h2>
            <p className="text-muted-foreground">
              A proven methodology that ensures successful AI implementation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: "Discovery & Analysis", description: "We analyze your business needs and identify AI opportunities" },
              { icon: Brain, title: "AI Strategy Design", description: "Custom AI architecture and model selection for your use case" },
              { icon: Code, title: "Development & Training", description: "Build, train, and optimize your custom AI solution" },
              { icon: Zap, title: "Deploy & Scale", description: "Launch your AI solution with ongoing support and optimization" }
            ].map((step, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Investment Levels</h2>
            <p className="text-muted-foreground">
              Transparent pricing for custom AI development projects.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Proof of Concept",
                price: "$15,000 - $30,000",
                duration: "4-6 weeks",
                features: ["Problem validation", "Basic model development", "Feasibility assessment", "Technical documentation"]
              },
              {
                name: "Production Ready",
                price: "$50,000 - $150,000", 
                duration: "3-6 months",
                features: ["Full custom AI solution", "Production deployment", "Performance optimization", "Training & documentation", "90 days support"],
                popular: true
              },
              {
                name: "Enterprise Solution",
                price: "$200,000+",
                duration: "6+ months", 
                features: ["Complex multi-model systems", "Advanced integrations", "Scalable architecture", "Ongoing maintenance", "Dedicated support team"]
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
                  <CardDescription>{tier.duration}</CardDescription>
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
          <h2 className="text-3xl font-bold mb-4">Ready to Build Your Custom AI Solution?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Let's discuss your AI project and create a solution that transforms your business.
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

export default CustomAIDevelopment;