import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, MessageCircle, Phone, Clock, Zap, Shield, Users } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { MeetingBookingModal } from "@/components/MeetingBookingModal";
import { Button } from "@/components/ui/button";

const SupportOptions = () => {
  const navigate = useNavigate();

  const supportTiers = [
    {
      name: "Essential Support",
      price: "$2,500/month",
      icon: <MessageCircle className="h-8 w-8" />,
      description: "Perfect for small to medium businesses starting their AI journey",
      features: [
        "Email support (24h response)",
        "Monthly health checks",
        "Basic monitoring & alerts",
        "Documentation & knowledge base",
        "System updates & patches",
        "Performance reporting"
      ],
      idealFor: "Small to medium businesses",
      responseTime: "24 hours",
      availability: "Business hours"
    },
    {
      name: "Professional Support",
      price: "$6,500/month",
      icon: <Phone className="h-8 w-8" />,
      description: "Comprehensive support for growing businesses with critical AI systems",
      popular: true,
      features: [
        "Priority email & phone support (4h response)",
        "Bi-weekly system optimization",
        "Advanced monitoring & analytics",
        "Dedicated support specialist",
        "Performance optimization",
        "Training & workshops",
        "Custom integration support",
        "Backup & disaster recovery"
      ],
      idealFor: "Growing businesses",
      responseTime: "4 hours",
      availability: "Extended hours"
    },
    {
      name: "Enterprise Support",
      price: "$15,000/month",
      icon: <Shield className="h-8 w-8" />,
      description: "Premium support for mission-critical AI systems with guaranteed SLAs",
      features: [
        "24/7 premium support (1h response)",
        "Weekly system optimization",
        "Real-time monitoring & alerts",
        "Dedicated account manager",
        "Priority feature development",
        "On-site support visits",
        "Compliance & security reviews",
        "Emergency escalation",
        "Custom SLA agreements"
      ],
      idealFor: "Enterprise organizations",
      responseTime: "1 hour",
      availability: "24/7"
    }
  ];

  const additionalServices = [
    {
      title: "AI Strategy Consulting",
      description: "Strategic guidance for AI adoption and digital transformation",
      price: "$500/hour",
      icon: <Users className="h-6 w-6" />
    },
    {
      title: "Performance Optimization",
      description: "Fine-tuning your AI systems for maximum efficiency",
      price: "$8,000/project",
      icon: <Zap className="h-6 w-6" />
    },
    {
      title: "Emergency Support",
      description: "Critical issue resolution outside business hours",
      price: "$1,500/incident",
      icon: <Clock className="h-6 w-6" />
    },
    {
      title: "Training & Workshops",
      description: "Team training on AI systems and best practices",
      price: "$3,500/day",
      icon: <Users className="h-6 w-6" />
    }
  ];

  const features = [
    "Proactive monitoring and maintenance",
    "Regular performance optimization",
    "Security updates and compliance",
    "Dedicated support specialists",
    "Training and knowledge transfer",
    "Integration with existing systems",
    "Backup and disaster recovery",
    "24/7 system monitoring"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Support Options</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive support plans to ensure your AI systems operate at peak performance. 
            Choose the level of support that matches your business needs.
          </p>
        </div>

        {/* Support Tiers */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {supportTiers.map((tier, index) => (
            <Card key={index} className={`relative ${tier.popular ? 'border-primary shadow-lg' : ''}`}>
              {tier.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4 text-primary">
                  {tier.icon}
                </div>
                <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
                <div className="text-3xl font-bold text-primary mb-2">{tier.price}</div>
                <p className="text-muted-foreground">{tier.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-semibold">Response Time</div>
                      <div className="text-muted-foreground">{tier.responseTime}</div>
                    </div>
                    <div>
                      <div className="font-semibold">Availability</div>
                      <div className="text-muted-foreground">{tier.availability}</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-sm mb-2">Ideal For</div>
                    <Badge variant="outline">{tier.idealFor}</Badge>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-start">
                      <Check className="h-4 w-4 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <MeetingBookingModal 
                  triggerText="Get Started"
                  triggerVariant={tier.popular ? "default" : "outline"}
                  className="w-full"
                  serviceType={tier.name}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Services */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Additional Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4 text-primary">
                    {service.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                  <div className="font-bold text-primary">{service.price}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* What's Included */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">What's Included in All Plans</h2>
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-3" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Need Help Choosing?</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our support specialists will help you select the perfect support plan for your business needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <MeetingBookingModal 
                  triggerText="Schedule Consultation"
                  triggerVariant="default"
                  triggerSize="lg"
                  serviceType="General Inquiry"
                />
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/contact')}
                >
                  Contact Our Team
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SupportOptions;
