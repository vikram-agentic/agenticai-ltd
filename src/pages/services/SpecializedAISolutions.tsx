import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, Eye, MessageSquare, Search, BarChart3, Shield, Cpu } from "lucide-react";
import { MeetingBookingModal } from "@/components/MeetingBookingModal";
import { Button } from "@/components/ui/button";

const SpecializedAISolutions = () => {
  const navigate = useNavigate();

  const handleContactUs = () => {
    navigate("/contact");
  };

  const specializations = [
    {
      icon: Eye,
      title: "Computer Vision",
      description: "Advanced image and video analysis for quality control, security, and automation",
      applications: ["Object Detection", "Facial Recognition", "Quality Inspection", "Medical Imaging"]
    },
    {
      icon: MessageSquare,
      title: "Natural Language Processing",
      description: "Intelligent text analysis, chatbots, and language understanding systems",
      applications: ["Sentiment Analysis", "Document Processing", "Chatbots", "Translation"]
    },
    {
      icon: Search,
      title: "Recommendation Systems",
      description: "Personalized content and product recommendations that increase engagement",
      applications: ["Product Recommendations", "Content Curation", "User Matching", "Dynamic Pricing"]
    },
    {
      icon: BarChart3,
      title: "Predictive Analytics",
      description: "Forecast trends, demand, and risks with advanced machine learning models",
      applications: ["Demand Forecasting", "Risk Assessment", "Maintenance Prediction", "Market Analysis"]
    },
    {
      icon: Shield,
      title: "Fraud Detection",
      description: "Real-time fraud detection and prevention using advanced AI algorithms",
      applications: ["Transaction Monitoring", "Identity Verification", "Risk Scoring", "Anomaly Detection"]
    },
    {
      icon: Cpu,
      title: "Edge AI Solutions",
      description: "Deploy AI models directly on devices for real-time processing",
      applications: ["IoT Integration", "Real-time Processing", "Offline Capabilities", "Privacy Protection"]
    }
  ];

  const successStories = [
    {
      title: "Retail Recommendation Engine",
      industry: "E-commerce",
      challenge: "Low conversion rates and poor customer engagement",
      solution: "AI-powered recommendation system analyzing customer behavior and preferences",
      result: "45% increase in conversion rates, 30% boost in average order value",
      technology: "Machine Learning, Collaborative Filtering"
    },
    {
      title: "Medical Image Analysis",
      industry: "Healthcare", 
      challenge: "Time-consuming manual analysis of medical scans",
      solution: "Computer vision system for automated diagnostic assistance",
      result: "60% faster diagnosis, 95% accuracy in detecting abnormalities",
      technology: "Deep Learning, CNN, Medical AI"
    },
    {
      title: "Smart Manufacturing QC",
      industry: "Manufacturing",
      challenge: "Inconsistent quality control and high defect rates",
      solution: "Computer vision system for real-time quality inspection",
      result: "40% reduction in defects, 80% decrease in inspection time",
      technology: "Computer Vision, Edge Computing"
    }
  ];

  const technologies = [
    "TensorFlow", "PyTorch", "OpenCV", "Scikit-learn", "NLTK", "spaCy",
    "Transformers", "YOLO", "ResNet", "BERT", "GPT", "LangChain"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-4">
            <Cpu className="w-4 h-4 mr-2" />
            Specialized AI Solutions
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Advanced AI for Complex Challenges
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Leverage cutting-edge AI technologies like computer vision, NLP, and predictive analytics to solve your most complex business problems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MeetingBookingModal 
              triggerText="Explore AI Solutions"
              triggerSize="lg"
              className="bg-gradient-primary hover:opacity-90"
              serviceType="Specialized AI Solutions"
            >
              Explore AI Solutions
              <ArrowRight className="ml-2 h-4 w-4" />
            </MeetingBookingModal>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleContactUs}
            >
              View Success Stories
            </Button>
          </div>
        </div>
      </section>

      {/* Specializations Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our AI Specializations</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Deep expertise in specialized AI domains that drive real business value.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specializations.map((spec, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <spec.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{spec.title}</CardTitle>
                  <CardDescription>{spec.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Applications:</h4>
                    <div className="flex flex-wrap gap-2">
                      {spec.applications.map((app, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-muted-foreground">
              Real-world implementations that delivered exceptional results.
            </p>
          </div>
          
          <div className="space-y-8">
            {successStories.map((story, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="grid lg:grid-cols-3 gap-6 p-6">
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge variant="outline">{story.industry}</Badge>
                      <h3 className="text-xl font-bold">{story.title}</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-destructive mb-1">Challenge:</h4>
                        <p className="text-muted-foreground">{story.challenge}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-primary mb-1">Solution:</h4>
                        <p className="text-muted-foreground">{story.solution}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-green-600 mb-1">Technology:</h4>
                        <p className="text-muted-foreground">{story.technology}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-primary p-6 rounded-xl text-white">
                    <h4 className="font-bold mb-4">Results Achieved</h4>
                    <p className="text-lg leading-relaxed">{story.result}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Advanced Technology Stack</h2>
            <p className="text-muted-foreground">
              We use the latest AI frameworks and tools to deliver cutting-edge solutions.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {technologies.map((tech, index) => (
              <Badge key={index} variant="outline" className="px-4 py-2 text-sm">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Development Process */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Development Approach</h2>
            <p className="text-muted-foreground">
              A systematic approach to delivering specialized AI solutions that work.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { phase: "Research", description: "Deep dive into your domain and identify the best AI approach", icon: Search },
              { phase: "Prototype", description: "Rapid prototyping to validate concepts and prove feasibility", icon: Cpu },
              { phase: "Develop", description: "Build and train specialized models using state-of-the-art techniques", icon: BarChart3 },
              { phase: "Deploy", description: "Production deployment with monitoring and continuous optimization", icon: Shield }
            ].map((step, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{step.phase}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{step.description}</CardDescription>
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
            <h2 className="text-3xl font-bold mb-4">Specialized AI Investment</h2>
            <p className="text-muted-foreground">
              Pricing that reflects the complexity and value of specialized AI solutions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Research & Prototype",
                price: "$25,000 - $50,000",
                timeline: "6-8 weeks",
                features: ["Problem analysis", "Feasibility study", "Working prototype", "Technology roadmap", "Performance benchmarks"]
              },
              {
                name: "Production Solution",
                price: "$75,000 - $200,000",
                timeline: "3-6 months",
                features: ["Full solution development", "Model training & optimization", "Production deployment", "Integration support", "Documentation & training"],
                popular: true
              },
              {
                name: "Enterprise Platform",
                price: "$250,000+",
                timeline: "6+ months",
                features: ["Multi-domain AI platform", "Custom model development", "Scalable infrastructure", "Ongoing model updates", "Dedicated AI team"]
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
                  <MeetingBookingModal 
                    triggerText="Get Started"
                    className="w-full mt-6"
                    triggerVariant={tier.popular ? "default" : "outline"}
                    serviceType={tier.name}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for Advanced AI Solutions?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Let's discuss your specialized AI needs and create a solution that gives you a competitive advantage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MeetingBookingModal 
              triggerText="Schedule AI Consultation"
              triggerSize="lg"
              triggerVariant="secondary"
              serviceType="Specialized AI Solutions"
            />
            <Button 
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-primary"
              onClick={handleContactUs}
            >
              Explore Case Studies
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SpecializedAISolutions;
