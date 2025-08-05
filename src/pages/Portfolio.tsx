import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, TrendingUp, Users, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const Portfolio = () => {
  const navigate = useNavigate();

  const projects = [
    {
      title: "Financial Risk Assessment AI",
      industry: "Financial Services",
      description: "Automated risk assessment system that reduced manual review time by 85% and improved accuracy by 40%",
      results: ["$2.5M annual savings", "85% faster processing", "40% improved accuracy"],
      technologies: ["Machine Learning", "Natural Language Processing", "Risk Analytics"],
      timeline: "8 months",
      caseStudyLink: "/case-studies/financial-services"
    },
    {
      title: "Healthcare Diagnostic Assistant",
      industry: "Healthcare",
      description: "AI-powered diagnostic support system helping medical professionals make faster, more accurate diagnoses",
      results: ["30% faster diagnosis", "95% diagnostic accuracy", "500+ patients daily"],
      technologies: ["Computer Vision", "Deep Learning", "Medical AI"],
      timeline: "12 months",
      caseStudyLink: "/case-studies/healthcare"
    },
    {
      title: "Smart Manufacturing Optimization",
      industry: "Manufacturing",
      description: "Predictive maintenance and quality control system that minimized downtime and improved product quality",
      results: ["60% reduced downtime", "$1.8M cost savings", "98% quality score"],
      technologies: ["IoT Integration", "Predictive Analytics", "Computer Vision"],
      timeline: "10 months",
      caseStudyLink: "/case-studies/manufacturing"
    },
    {
      title: "E-commerce Personalization Engine",
      industry: "Retail & E-commerce",
      description: "Advanced recommendation system that boosted sales and improved customer experience",
      results: ["45% increase in sales", "2.3x higher engagement", "25% better retention"],
      technologies: ["Recommendation Systems", "Behavioral Analytics", "A/B Testing"],
      timeline: "6 months",
      caseStudyLink: "/case-studies/retail-ecommerce"
    },
    {
      title: "Intelligent Document Processing",
      industry: "Legal Services",
      description: "Automated contract analysis and document review system for a leading law firm",
      results: ["90% faster reviews", "75% cost reduction", "99.5% accuracy"],
      technologies: ["Natural Language Processing", "OCR", "Legal AI"],
      timeline: "9 months",
      caseStudyLink: null
    },
    {
      title: "Supply Chain Optimization AI",
      industry: "Logistics",
      description: "End-to-end supply chain optimization reducing costs and improving delivery times",
      results: ["35% cost reduction", "50% faster delivery", "20% inventory optimization"],
      technologies: ["Optimization Algorithms", "Predictive Analytics", "Route Planning"],
      timeline: "14 months",
      caseStudyLink: null
    }
  ];

  const stats = [
    { label: "Projects Completed", value: "150+" },
    { label: "Industries Served", value: "12" },
    { label: "Average ROI", value: "340%" },
    { label: "Client Satisfaction", value: "98%" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Portfolio</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Explore our successful AI implementations across industries. Each project showcases our expertise in delivering transformative solutions that drive real business value.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {projects.map((project, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                    <Badge variant="secondary">{project.industry}</Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {project.timeline}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">{project.description}</p>
                
                {/* Results */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Key Results
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {project.results.map((result, i) => (
                      <div key={i} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                        {result}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                {project.caseStudyLink ? (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(project.caseStudyLink)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Detailed Case Study
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open('https://calendly.com/agentic-ai/30min', '_blank')}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Discuss Similar Project
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Add Your Success Story?</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Let's discuss how we can create a custom AI solution that delivers similar results for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => window.open('https://calendly.com/agentic-ai/30min', '_blank')}
                >
                  Start Your Project
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/roi-calculator')}
                >
                  Calculate Your ROI
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

export default Portfolio;