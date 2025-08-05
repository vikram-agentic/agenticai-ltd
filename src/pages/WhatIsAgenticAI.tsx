import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Target, 
  Zap, 
  Shield, 
  Users, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Settings,
  Network
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const WhatIsAgenticAI = () => {
  const keyCharacteristics = [
    {
      icon: Brain,
      title: "Autonomous Decision Making",
      description: "AI agents can make complex decisions without human intervention, analyzing data and choosing optimal actions based on their objectives."
    },
    {
      icon: Target,
      title: "Goal-Oriented Behavior",
      description: "Agents are designed with specific goals and continuously work towards achieving them, adapting their strategies as needed."
    },
    {
      icon: Network,
      title: "Multi-Agent Collaboration",
      description: "Multiple AI agents can work together, each with specialized roles, communicating and coordinating to solve complex problems."
    },
    {
      icon: Zap,
      title: "Real-Time Adaptation",
      description: "Agents learn from their environment and experiences, continuously improving their performance and decision-making capabilities."
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: "24/7 Operations",
      description: "AI agents work continuously without breaks, ensuring round-the-clock business operations and monitoring."
    },
    {
      icon: Settings,
      title: "Scalable Automation",
      description: "Easily scale operations by deploying additional agents or expanding existing ones' capabilities."
    },
    {
      icon: Shield,
      title: "Reduced Human Error",
      description: "Consistent, rule-based decision making eliminates human errors and ensures reliable outcomes."
    },
    {
      icon: Users,
      title: "Enhanced Productivity",
      description: "Free up human resources for strategic tasks while agents handle routine operations and analysis."
    }
  ];

  const useCases = [
    {
      industry: "Finance",
      applications: [
        "Automated fraud detection and prevention",
        "Real-time risk assessment and management",
        "Intelligent trading and portfolio optimization",
        "Customer service automation"
      ]
    },
    {
      industry: "Healthcare",
      applications: [
        "Medical imaging analysis and diagnosis",
        "Patient monitoring and alert systems",
        "Drug discovery and research assistance",
        "Treatment recommendation engines"
      ]
    },
    {
      industry: "Retail",
      applications: [
        "Dynamic pricing optimization",
        "Inventory management and forecasting",
        "Personalized customer experiences",
        "Supply chain optimization"
      ]
    },
    {
      industry: "Manufacturing",
      applications: [
        "Predictive maintenance systems",
        "Quality control automation",
        "Production line optimization",
        "Supply chain coordination"
      ]
    }
  ];

  const comparisonPoints = [
    {
      traditional: "Reactive: Responds to specific inputs",
      agentic: "Proactive: Takes initiative based on goals"
    },
    {
      traditional: "Static: Fixed responses to scenarios",
      agentic: "Adaptive: Learns and improves over time"
    },
    {
      traditional: "Isolated: Works in silos",
      agentic: "Collaborative: Works with other agents"
    },
    {
      traditional: "Limited: Narrow, specific tasks",
      agentic: "Versatile: Complex, multi-step workflows"
    }
  ];

  const handleScheduleConsultation = () => {
    window.open("https://calendly.com/vikram-agentic-ai/30min", "_blank");
  };

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
              What is Agentic AI?
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
            Agentic AI represents the next evolution in artificial intelligence - autonomous systems 
            that can perceive, reason, plan, and act independently to achieve specific goals, 
            fundamentally transforming how businesses operate.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-primary hover:opacity-90"
            onClick={handleScheduleConsultation}
          >
            Explore AI Solutions
          </Button>
        </div>
      </section>

      {/* Definition Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-primary/5 border-primary/20 mb-16">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">Definition</h2>
                  <p className="text-lg leading-relaxed">
                    Agentic AI refers to artificial intelligence systems that exhibit agency - the ability to 
                    act autonomously in pursuit of specific goals. Unlike traditional AI that responds to 
                    inputs with predetermined outputs, agentic AI systems can plan, make decisions, 
                    learn from experience, and adapt their behavior to changing circumstances.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Key Characteristics */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Key Characteristics
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              What makes agentic AI different from traditional artificial intelligence systems
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {keyCharacteristics.map((characteristic, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <characteristic.icon className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-xl">{characteristic.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{characteristic.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Traditional AI vs Agentic AI */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Traditional AI vs Agentic AI
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Understanding the fundamental differences between conventional AI and agentic systems
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-card/30 backdrop-blur-sm border-muted">
                <CardHeader>
                  <CardTitle className="text-center">Traditional AI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {comparisonPoints.map((point, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm">{point.traditional}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-primary/5 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-center">Agentic AI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {comparisonPoints.map((point, index) => (
                      <div key={index} className="p-3 bg-primary/10 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <p className="text-sm">{point.agentic}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Business Benefits */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Business Benefits
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              How agentic AI transforms business operations and delivers competitive advantages
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-heading font-bold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases by Industry */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Real-World Applications
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See how agentic AI is transforming different industries
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl">{useCase.industry}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {useCase.applications.map((application, appIndex) => (
                      <li key={appIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span className="text-sm">{application}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Process */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Implementation Process
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              How we help you deploy agentic AI in your organization
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "01", title: "Assessment", description: "Analyze your current processes and identify opportunities for agentic AI implementation" },
                { step: "02", title: "Design", description: "Create a custom agentic AI architecture tailored to your specific business goals and requirements" },
                { step: "03", title: "Development", description: "Build and train AI agents with the capabilities needed to achieve your objectives" },
                { step: "04", title: "Deployment", description: "Launch your agentic AI system with monitoring, optimization, and ongoing support" }
              ].map((process, index) => (
                <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20 text-center">
                  <CardContent className="p-6">
                    <div className="text-2xl font-heading font-bold bg-gradient-primary bg-clip-text text-transparent mb-3">
                      {process.step}
                    </div>
                    <h3 className="font-heading font-bold mb-2">{process.title}</h3>
                    <p className="text-muted-foreground text-sm">{process.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-heading font-bold mb-6">
            Ready to Implement Agentic AI?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the companies already leveraging agentic AI to transform their operations 
            and gain competitive advantages.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:opacity-90"
              onClick={handleScheduleConsultation}
            >
              Start Your AI Journey
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={handleViewCaseStudies}
            >
              View Case Studies <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default WhatIsAgenticAI;