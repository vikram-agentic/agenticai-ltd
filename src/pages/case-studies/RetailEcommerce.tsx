import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShoppingCart, TrendingUp, Users, Eye, Target, BarChart } from "lucide-react";
import { MeetingBookingModal } from "@/components/MeetingBookingModal";
import { Button } from "@/components/ui/button";

const RetailEcommerce = () => {
  const navigate = useNavigate();

  const handleContactUs = () => {
    navigate("/contact");
  };

  const caseStudies = [
    {
      title: "E-commerce Personalization Engine",
      client: "Fashion Forward Online",
      challenge: "Low conversion rates of 2.1% and high cart abandonment of 68%, with generic product recommendations driving minimal engagement.",
      solution: "Implemented AI-powered personalization engine using collaborative filtering, real-time behavioral analysis, and dynamic content optimization.",
      results: [
        "40% increase in conversion rates (2.1% to 2.9%)",
        "55% boost in average order value",
        "32% reduction in cart abandonment",
        "200% improvement in email click-through rates",
        "$3.2M additional annual revenue"
      ],
      technologies: ["TensorFlow", "Apache Kafka", "Redis", "PostgreSQL", "React"],
      timeline: "4 months",
      investment: "$145,000"
    },
    {
      title: "Inventory Demand Forecasting System",
      client: "GreenGrocer Supermarket Chain",
      challenge: "30% inventory waste from overstock and frequent stockouts leading to $2.5M annual losses and customer dissatisfaction.",
      solution: "Deployed ML-powered demand forecasting system analyzing historical sales, weather patterns, seasonality, and local events.",
      results: [
        "65% reduction in inventory waste",
        "45% decrease in stockout incidents",
        "25% improvement in inventory turnover",
        "92% forecast accuracy achieved",
        "$1.8M annual cost savings"
      ],
      technologies: ["XGBoost", "Prophet", "Apache Airflow", "BigQuery", "Looker"],
      timeline: "5 months",
      investment: "$220,000"
    },
    {
      title: "Visual Search and Discovery Platform",
      client: "Home & Decor Marketplace",
      challenge: "Customers struggling to find products they visualized, with 45% of searches returning irrelevant results and low product discovery.",
      solution: "Built computer vision-powered visual search allowing customers to upload photos and find similar products instantly.",
      results: [
        "78% improvement in search relevance",
        "35% increase in product page views",
        "28% boost in search-to-purchase conversion",
        "50% reduction in customer support queries",
        "42% increase in average session duration"
      ],
      technologies: ["PyTorch", "OpenCV", "Elasticsearch", "AWS Rekognition", "Vue.js"],
      timeline: "6 months",
      investment: "$185,000"
    }
  ];

  const industryStats = [
    { icon: TrendingUp, metric: "42%", label: "Average Conversion Rate Improvement" },
    { icon: ShoppingCart, metric: "48%", label: "Average Order Value Increase" },
    { icon: Users, metric: "60+", label: "Retail Clients Served" },
    { icon: Eye, metric: "85%", label: "Customer Engagement Boost" },
    { icon: Target, metric: "35%", label: "Cart Abandonment Reduction" },
    { icon: BarChart, metric: "$15M+", label: "Additional Revenue Generated" }
  ];

  const commonChallenges = [
    {
      challenge: "Low Conversion Rates",
      description: "Generic experiences failing to engage customers effectively",
      aiSolution: "Personalized recommendations and dynamic content optimization"
    },
    {
      challenge: "Inventory Management",
      description: "Overstock, stockouts, and demand forecasting difficulties",
      aiSolution: "ML-powered demand forecasting and automated inventory optimization"
    },
    {
      challenge: "Customer Service Overload",
      description: "High volume of repetitive customer inquiries and support requests",
      aiSolution: "AI chatbots and intelligent customer service automation"
    },
    {
      challenge: "Price Optimization",
      description: "Static pricing models not responding to market dynamics",
      aiSolution: "Dynamic pricing algorithms based on demand, competition, and customer behavior"
    },
    {
      challenge: "Product Discovery",
      description: "Customers unable to find relevant products easily",
      aiSolution: "Visual search, intelligent product recommendations, and semantic search"
    },
    {
      challenge: "Fraud Prevention",
      description: "Payment fraud and account takeover attempts",
      aiSolution: "Real-time fraud detection using behavioral analytics and ML models"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-4">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Retail & E-commerce Case Studies
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI-Driven Retail Excellence
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            See how forward-thinking retailers are using AI to personalize experiences, optimize operations, and drive unprecedented growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MeetingBookingModal 
              triggerText="Schedule Retail AI Consultation"
              triggerSize="lg"
              className="bg-gradient-primary hover:opacity-90"
              serviceType="Retail & E-commerce AI"
            >
              Schedule Retail AI Consultation
              <ArrowRight className="ml-2 h-4 w-4" />
            </MeetingBookingModal>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleContactUs}
            >
              Request Retail Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Industry Stats */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Retail AI Impact</h2>
            <p className="text-muted-foreground">
              Transformative results across the retail and e-commerce sector.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industryStats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.metric}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Case Studies */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Retail Success Stories</h2>
            <p className="text-muted-foreground">
              Real implementations driving measurable business growth.
            </p>
          </div>
          
          <div className="space-y-12">
            {caseStudies.map((study, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="grid lg:grid-cols-3 gap-8 p-8">
                  <div className="lg:col-span-2">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold mb-2">{study.title}</h3>
                      <p className="text-muted-foreground font-medium">{study.client}</p>
                      <div className="flex gap-2 mt-3">
                        <Badge variant="outline">{study.timeline}</Badge>
                        <Badge variant="secondary">{study.investment}</Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-bold text-destructive mb-2">Business Challenge</h4>
                        <p className="text-muted-foreground">{study.challenge}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-primary mb-2">AI Solution</h4>
                        <p className="text-muted-foreground">{study.solution}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-bold mb-2">Technologies Used</h4>
                        <div className="flex flex-wrap gap-2">
                          {study.technologies.map((tech, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-primary p-6 rounded-xl text-white">
                    <h4 className="font-bold text-xl mb-4">Business Results</h4>
                    <ul className="space-y-3">
                      {study.results.map((result, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-sm leading-relaxed">{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Common Challenges */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Retail AI Solutions</h2>
            <p className="text-muted-foreground">
              How AI addresses the most pressing challenges in retail and e-commerce.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {commonChallenges.map((item, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">{item.challenge}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary mb-2">AI Solution:</h4>
                    <p className="text-sm text-muted-foreground">{item.aiSolution}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Retail AI ROI</h2>
              <p className="text-muted-foreground mb-8">
                Retail AI implementations typically deliver strong returns through increased sales, improved efficiency, and cost reduction.
              </p>
              
              <div className="space-y-4">
                {[
                  "Conversion rates improved by 25-50%",
                  "Average order value increased by 30-60%",
                  "Inventory costs reduced by 20-40%",
                  "Customer service costs decreased by 40-70%",
                  "Operational efficiency improved by 25-45%",
                  "Customer satisfaction scores increased by 20-35%"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-primary p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-6">Typical Retail AI ROI</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span>Implementation Investment:</span>
                  <span className="font-bold">$75K - $300K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Annual Revenue Increase:</span>
                  <span className="font-bold">$500K - $5M+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Payback Period:</span>
                  <span className="font-bold">3-12 months</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>3-Year ROI:</span>
                  <span className="font-bold">400-1200%</span>
                </div>
                <Button 
                  variant="secondary" 
                  className="w-full mt-4"
                  onClick={() => navigate('/roi-calculator')}
                >
                  Calculate Your ROI
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Retail Business?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join leading retailers leveraging AI to personalize experiences, optimize operations, and drive unprecedented growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MeetingBookingModal 
              triggerText="Schedule Retail AI Assessment"
              triggerSize="lg"
              triggerVariant="secondary"
              serviceType="Retail & E-commerce AI"
            />
            <Button 
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-primary"
              onClick={handleContactUs}
            >
              Request Retail Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RetailEcommerce;
