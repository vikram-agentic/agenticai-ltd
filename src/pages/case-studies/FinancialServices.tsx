import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowRight, DollarSign, Shield, TrendingUp, Clock, Users, BarChart } from "lucide-react";

const FinancialServices = () => {
  const navigate = useNavigate();

  const handleScheduleConsultation = () => {
    window.open("https://calendly.com/vikram-agentic-ai/30min", "_blank");
  };

  const handleContactUs = () => {
    navigate("/contact");
  };

  const caseStudies = [
    {
      title: "Regional Bank Fraud Detection System",
      client: "Mid-Atlantic Regional Bank",
      challenge: "Processing 500,000+ daily transactions with 15% false positive rate in fraud detection, causing customer friction and operational overhead.",
      solution: "Implemented real-time AI fraud detection using ensemble machine learning models with transaction pattern analysis, device fingerprinting, and behavioral analytics.",
      results: [
        "99.7% fraud detection accuracy",
        "45% reduction in false positives",
        "2.3 second average response time",
        "$2.1M annual savings in fraud losses",
        "60% improvement in customer satisfaction"
      ],
      technologies: ["TensorFlow", "Apache Kafka", "Redis", "PostgreSQL", "Python"],
      timeline: "4 months",
      investment: "$180,000"
    },
    {
      title: "Investment Firm Algorithmic Trading Platform",
      client: "Apex Capital Management",
      challenge: "Manual trading strategies limiting portfolio performance and requiring 24/7 human oversight across multiple markets.",
      solution: "Developed AI-powered algorithmic trading system with reinforcement learning for strategy optimization, real-time market analysis, and automated risk management.",
      results: [
        "23% improvement in portfolio returns",
        "65% reduction in human oversight hours", 
        "Real-time execution across 12 markets",
        "50% decrease in trading costs",
        "Risk-adjusted returns increased by 31%"
      ],
      technologies: ["PyTorch", "AWS SageMaker", "Apache Spark", "MongoDB", "Docker"],
      timeline: "6 months",
      investment: "$320,000"
    },
    {
      title: "Credit Union Risk Assessment Automation",
      client: "Community First Credit Union",
      challenge: "Manual credit approval process taking 3-5 days with 28% default rate on approved loans.",
      solution: "Built AI credit scoring system combining traditional financial data with alternative data sources, automated approval workflows, and continuous model monitoring.",
      results: [
        "18% reduction in default rates",
        "80% faster approval process (same day)",
        "35% increase in loan approval volume",
        "92% automation of routine applications",
        "$850K annual operational savings"
      ],
      technologies: ["Scikit-learn", "XGBoost", "FastAPI", "PostgreSQL", "Airflow"],
      timeline: "3 months", 
      investment: "$95,000"
    }
  ];

  const industryStats = [
    { icon: DollarSign, metric: "$12.5M", label: "Total Fraud Losses Prevented" },
    { icon: TrendingUp, metric: "28%", label: "Average ROI Improvement" },
    { icon: Clock, metric: "75%", label: "Processing Time Reduction" },
    { icon: Shield, metric: "99.5%", label: "Average Detection Accuracy" },
    { icon: Users, metric: "50+", label: "Financial Institutions Served" },
    { icon: BarChart, metric: "42%", label: "Cost Reduction Achieved" }
  ];

  const commonChallenges = [
    {
      challenge: "Fraud Detection & Prevention",
      description: "High false positive rates and evolving fraud patterns",
      aiSolution: "Real-time ML models with behavioral analytics and pattern recognition"
    },
    {
      challenge: "Risk Assessment & Credit Scoring", 
      description: "Manual processes and limited data utilization",
      aiSolution: "Automated scoring with alternative data and continuous model updates"
    },
    {
      challenge: "Regulatory Compliance",
      description: "Complex reporting requirements and audit trails",
      aiSolution: "Automated compliance monitoring and intelligent reporting systems"
    },
    {
      challenge: "Customer Service Optimization",
      description: "High volume inquiries and repetitive support tasks",
      aiSolution: "AI chatbots and intelligent routing for personalized customer experiences"
    },
    {
      challenge: "Market Analysis & Trading",
      description: "Data overload and timing-sensitive decision making",
      aiSolution: "Real-time market intelligence and algorithmic trading strategies"
    },
    {
      challenge: "Anti-Money Laundering (AML)",
      description: "Complex transaction monitoring and suspicious activity detection",
      aiSolution: "Intelligent transaction analysis with network analysis and anomaly detection"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-4">
            <DollarSign className="w-4 h-4 mr-2" />
            Financial Services Case Studies
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Transforming Finance with AI
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Discover how leading financial institutions are leveraging AI to enhance security, improve customer experience, and drive operational excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleScheduleConsultation}
              className="bg-gradient-primary hover:opacity-90"
            >
              Schedule Finance AI Consultation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleContactUs}
            >
              Request Custom Case Study
            </Button>
          </div>
        </div>
      </section>

      {/* Industry Stats */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Financial Services AI Impact</h2>
            <p className="text-muted-foreground">
              Measurable results from our AI implementations across the financial sector.
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
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-muted-foreground">
              In-depth case studies showcasing transformative AI implementations.
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
                        <h4 className="font-bold text-destructive mb-2">Challenge</h4>
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
                    <h4 className="font-bold text-xl mb-4">Results Achieved</h4>
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
            <h2 className="text-3xl font-bold mb-4">Financial AI Solutions</h2>
            <p className="text-muted-foreground">
              How AI addresses the most pressing challenges in financial services.
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

      {/* Compliance & Security */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Financial AI Compliance</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI solutions are built with financial regulations and security standards in mind.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "SOX Compliance", description: "Sarbanes-Oxley Act compliance for financial reporting" },
              { title: "PCI DSS", description: "Payment Card Industry Data Security Standards" },
              { title: "GDPR & CCPA", description: "Data privacy and protection compliance" },
              { title: "Basel III", description: "International banking regulations and capital requirements" },
              { title: "FFIEC Guidelines", description: "Federal Financial Institutions Examination Council" },
              { title: "AML/KYC", description: "Anti-Money Laundering and Know Your Customer" },
              { title: "Fair Lending", description: "Equal Credit Opportunity Act compliance" },
              { title: "Model Risk Management", description: "SR 11-7 guidance for model validation" }
            ].map((standard, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">{standard.title}</h3>
                  <p className="text-sm text-muted-foreground">{standard.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Financial AI ROI</h2>
              <p className="text-muted-foreground mb-8">
                Financial institutions typically see significant returns on AI investments within the first year of implementation.
              </p>
              
              <div className="space-y-4">
                {[
                  "Fraud losses reduced by 40-70%",
                  "Operational costs decreased by 30-50%",
                  "Processing times improved by 60-80%",
                  "Customer satisfaction increased by 25-40%",
                  "Compliance costs reduced by 35-60%",
                  "Risk assessment accuracy improved by 20-35%"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-primary p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-6">Typical Financial AI ROI</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span>Implementation Investment:</span>
                  <span className="font-bold">$100K - $500K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Annual Cost Savings:</span>
                  <span className="font-bold">$200K - $2M+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Payback Period:</span>
                  <span className="font-bold">6-18 months</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>3-Year ROI:</span>
                  <span className="font-bold">300-800%</span>
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
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Financial Services?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join leading financial institutions leveraging AI to enhance security, improve efficiency, and deliver superior customer experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              onClick={handleScheduleConsultation}
            >
              Schedule Financial AI Assessment
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-primary"
              onClick={handleContactUs}
            >
              Request Industry Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FinancialServices;