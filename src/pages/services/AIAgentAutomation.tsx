import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, Bot, Zap, Clock, DollarSign, BarChart, Settings } from "lucide-react";

const AIAgentAutomation = () => {
  const navigate = useNavigate();

  const handleScheduleConsultation = () => {
    window.open("https://calendly.com/vikram-agentic-ai/30min", "_blank");
  };

  const handleContactUs = () => {
    navigate("/contact");
  };

  const automationAreas = [
    { icon: Bot, title: "Customer Service Agents", description: "24/7 intelligent customer support with human-like interactions" },
    { icon: Settings, title: "Business Process Automation", description: "Streamline workflows and eliminate manual tasks" },
    { icon: BarChart, title: "Data Processing Agents", description: "Automated data analysis and reporting systems" },
    { icon: Clock, title: "Scheduling & Planning", description: "Intelligent scheduling and resource optimization" },
    { icon: DollarSign, title: "Sales & Lead Generation", description: "Automated lead qualification and nurturing" },
    { icon: Zap, title: "Integration Automation", description: "Seamless system-to-system communication" }
  ];

  const benefits = [
    "Up to 80% reduction in manual tasks",
    "24/7 operational capability", 
    "Consistent quality and accuracy",
    "Scalable without additional headcount",
    "Real-time decision making",
    "Cost savings of 40-60%"
  ];

  const useCases = [
    {
      title: "Customer Support Automation",
      description: "AI agents that handle customer inquiries, resolve issues, and escalate complex cases to humans.",
      savings: "70% reduction in support costs",
      industry: "E-commerce"
    },
    {
      title: "Invoice Processing",
      description: "Automated invoice extraction, validation, and processing with 99.5% accuracy.",
      savings: "85% time savings",
      industry: "Finance"
    },
    {
      title: "Lead Qualification", 
      description: "AI agents that qualify leads, schedule meetings, and update CRM systems automatically.",
      savings: "60% more qualified leads",
      industry: "Sales"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-4">
            <Bot className="w-4 h-4 mr-2" />
            AI Agent & Automation
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Intelligent Automation That Works 24/7
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Deploy AI agents that automate complex business processes, reduce costs, and scale your operations without limits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleScheduleConsultation}
              className="bg-gradient-primary hover:opacity-90"
            >
              Automate Your Business
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleContactUs}
            >
              See Automation Examples
            </Button>
          </div>
        </div>
      </section>

      {/* Automation Areas */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What We Automate</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From customer service to complex business processes, our AI agents handle it all.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {automationAreas.map((area, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardHeader className="p-0 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <area.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{area.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <CardDescription>{area.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose AI Automation?</h2>
              <p className="text-muted-foreground mb-8">
                AI agents work tirelessly to improve your business efficiency, reduce costs, and eliminate human error from repetitive tasks.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-primary p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-4">ROI Calculator</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Average time saved per employee:</span>
                  <span className="font-bold">20+ hours/week</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cost reduction:</span>
                  <span className="font-bold">40-60%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Typical ROI timeframe:</span>
                  <span className="font-bold">3-6 months</span>
                </div>
                <Button 
                  variant="secondary" 
                  className="w-full mt-4"
                  onClick={handleScheduleConsultation}
                >
                  Calculate Your ROI
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Real-World Automation Examples</h2>
            <p className="text-muted-foreground">
              See how our AI agents have transformed businesses across industries.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index}>
                <CardHeader>
                  <Badge variant="outline" className="w-fit mb-2">{useCase.industry}</Badge>
                  <CardTitle className="text-xl">{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {useCase.description}
                  </CardDescription>
                  <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <BarChart className="h-4 w-4 mr-2" />
                      <span className="font-semibold">{useCase.savings}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Process */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Automation Process</h2>
            <p className="text-muted-foreground">
              From assessment to deployment, we ensure seamless automation integration.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Process Audit", description: "Identify automation opportunities and measure current efficiency" },
              { step: "02", title: "AI Agent Design", description: "Create intelligent agents tailored to your specific workflows" },
              { step: "03", title: "Integration & Testing", description: "Seamlessly integrate with existing systems and test thoroughly" },
              { step: "04", title: "Launch & Optimize", description: "Deploy agents and continuously optimize performance" }
            ].map((process, index) => (
              <Card key={index} className="text-center relative">
                <CardHeader>
                  <div className="text-3xl font-bold text-primary mb-2">{process.step}</div>
                  <CardTitle className="text-lg">{process.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{process.description}</CardDescription>
                </CardContent>
                {index < 3 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-muted-foreground" />
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Automation Packages</h2>
            <p className="text-muted-foreground">
              Choose the automation level that fits your business needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Starter Automation",
                price: "$5,000 - $15,000",
                setup: "2-4 weeks",
                features: ["1-2 automated processes", "Basic AI agents", "Email support", "Training included"]
              },
              {
                name: "Business Automation",
                price: "$20,000 - $50,000",
                setup: "4-8 weeks", 
                features: ["3-5 automated processes", "Advanced AI agents", "System integrations", "Priority support", "Performance monitoring"],
                popular: true
              },
              {
                name: "Enterprise Automation",
                price: "$75,000+",
                setup: "8+ weeks",
                features: ["Unlimited processes", "Custom AI development", "Full system integration", "Dedicated support", "Ongoing optimization"]
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
                  <CardDescription>Setup: {tier.setup}</CardDescription>
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
                    Start Automation
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
          <h2 className="text-3xl font-bold mb-4">Ready to Automate Your Business?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Let our AI agents handle the repetitive work so your team can focus on what matters most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              onClick={handleScheduleConsultation}
            >
              Schedule Automation Audit
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-primary"
              onClick={handleContactUs}
            >
              See Live Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AIAgentAutomation;