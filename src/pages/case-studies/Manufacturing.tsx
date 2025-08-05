import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Factory, Cog, TrendingDown, Clock, Shield, BarChart } from "lucide-react";

const Manufacturing = () => {
  const navigate = useNavigate();

  const handleScheduleConsultation = () => {
    window.open("https://calendly.com/vikram-agentic-ai/30min", "_blank");
  };

  const handleContactUs = () => {
    navigate("/contact");
  };

  const caseStudies = [
    {
      title: "Predictive Maintenance AI System",
      client: "AutoTech Manufacturing",
      challenge: "Unexpected equipment failures causing 15% unplanned downtime, resulting in $3.2M annual losses and delayed production schedules.",
      solution: "Implemented IoT sensors with ML-powered predictive maintenance system analyzing vibration, temperature, and performance data to predict failures 2-4 weeks in advance.",
      results: [
        "50% reduction in unplanned downtime",
        "35% decrease in maintenance costs",
        "85% accuracy in failure prediction",
        "25% improvement in equipment lifespan",
        "$2.1M annual cost savings"
      ],
      technologies: ["TensorFlow", "Apache Kafka", "InfluxDB", "Grafana", "Python"],
      timeline: "4 months",
      investment: "$165,000"
    },
    {
      title: "Quality Control Computer Vision",
      client: "Precision Electronics Corp",
      challenge: "Manual quality inspection missing 12% of defects, leading to customer returns and damaged brand reputation in critical electronics components.",
      solution: "Deployed computer vision system with deep learning models for automated defect detection, classification, and quality scoring of electronic components.",
      results: [
        "99.5% defect detection accuracy",
        "75% reduction in inspection time",
        "40% decrease in customer returns",
        "90% reduction in human inspection errors",
        "$1.5M savings in rework and returns"
      ],
      technologies: ["PyTorch", "OpenCV", "NVIDIA TensorRT", "MongoDB", "FastAPI"],
      timeline: "5 months",
      investment: "$210,000"
    },
    {
      title: "Supply Chain Optimization Platform",
      client: "Global Manufacturing Solutions",
      challenge: "Complex supply chain with 200+ suppliers causing inventory bottlenecks, 20% overstocking, and frequent material shortages affecting production.",
      solution: "Built AI-powered supply chain management system with demand forecasting, supplier risk assessment, and automated procurement optimization.",
      results: [
        "30% reduction in inventory holding costs",
        "45% improvement in on-time delivery",
        "60% decrease in stockout incidents",
        "25% reduction in procurement costs",
        "$3.8M annual operational savings"
      ],
      technologies: ["XGBoost", "Apache Airflow", "PostgreSQL", "Docker", "Kubernetes"],
      timeline: "7 months",
      investment: "$340,000"
    }
  ];

  const industryStats = [
    { icon: TrendingDown, metric: "45%", label: "Average Downtime Reduction" },
    { icon: Cog, metric: "35%", label: "Efficiency Improvement" },
    { icon: Factory, metric: "40+", label: "Manufacturing Clients" },
    { icon: Clock, metric: "99.5%", label: "Quality Detection Accuracy" },
    { icon: Shield, metric: "30%", label: "Cost Reduction Achieved" },
    { icon: BarChart, metric: "$25M+", label: "Total Savings Generated" }
  ];

  const commonChallenges = [
    {
      challenge: "Equipment Downtime",
      description: "Unexpected machine failures disrupting production schedules",
      aiSolution: "Predictive maintenance using IoT sensors and machine learning algorithms"
    },
    {
      challenge: "Quality Control Issues",
      description: "Manual inspection missing defects and quality inconsistencies",
      aiSolution: "Computer vision systems for automated defect detection and quality scoring"
    },
    {
      challenge: "Supply Chain Complexity",
      description: "Inventory optimization and supplier management challenges",
      aiSolution: "AI-powered demand forecasting and supply chain optimization"
    },
    {
      challenge: "Production Planning",
      description: "Inefficient scheduling and resource allocation",
      aiSolution: "ML-based production scheduling and capacity optimization"
    },
    {
      challenge: "Energy Consumption",
      description: "High energy costs and inefficient resource utilization",
      aiSolution: "Smart energy management systems and consumption optimization"
    },
    {
      challenge: "Worker Safety",
      description: "Workplace accidents and safety compliance monitoring",
      aiSolution: "Computer vision for safety monitoring and hazard detection"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-4">
            <Factory className="w-4 h-4 mr-2" />
            Manufacturing Case Studies
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Smart Manufacturing with AI
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Discover how leading manufacturers are using AI to optimize operations, improve quality, and reduce costs through intelligent automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleScheduleConsultation}
              className="bg-gradient-primary hover:opacity-90"
            >
              Schedule Manufacturing AI Consultation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleContactUs}
            >
              Request Manufacturing Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Industry Stats */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Manufacturing AI Impact</h2>
            <p className="text-muted-foreground">
              Measurable improvements in operational efficiency and cost reduction.
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
            <h2 className="text-3xl font-bold mb-4">Manufacturing Success Stories</h2>
            <p className="text-muted-foreground">
              Real implementations driving operational excellence and cost savings.
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
                        <h4 className="font-bold text-destructive mb-2">Operational Challenge</h4>
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
                    <h4 className="font-bold text-xl mb-4">Operational Results</h4>
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
            <h2 className="text-3xl font-bold mb-4">Manufacturing AI Solutions</h2>
            <p className="text-muted-foreground">
              How AI addresses the most critical challenges in modern manufacturing.
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
              <h2 className="text-3xl font-bold mb-6">Manufacturing AI ROI</h2>
              <p className="text-muted-foreground mb-8">
                Manufacturing AI investments typically deliver strong returns through reduced downtime, improved quality, and operational efficiency.
              </p>
              
              <div className="space-y-4">
                {[
                  "Equipment downtime reduced by 30-60%",
                  "Quality defect rates decreased by 40-80%",
                  "Maintenance costs reduced by 20-40%",
                  "Energy consumption optimized by 15-30%",
                  "Production efficiency improved by 25-50%",
                  "Supply chain costs reduced by 20-35%"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <TrendingDown className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-primary p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-6">Typical Manufacturing AI ROI</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span>Implementation Investment:</span>
                  <span className="font-bold">$150K - $500K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Annual Cost Savings:</span>
                  <span className="font-bold">$500K - $5M+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Payback Period:</span>
                  <span className="font-bold">6-18 months</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>3-Year ROI:</span>
                  <span className="font-bold">300-1000%</span>
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

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Modernize Your Manufacturing?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join leading manufacturers leveraging AI to optimize operations, improve quality, and reduce costs through intelligent automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              onClick={handleScheduleConsultation}
            >
              Schedule Manufacturing Assessment
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-primary"
              onClick={handleContactUs}
            >
              Request Manufacturing Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Manufacturing;