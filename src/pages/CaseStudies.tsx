import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, DollarSign, Users, Star, ArrowRight } from "lucide-react";

const CaseStudies = () => {
  const mainCaseStudy = {
    client: "Heritage Community Bank",
    industry: "Financial Services",
    challenge: "Manual loan processing taking 15-20 business days with high error rates",
    solution: "Multi-agent AI system for document processing and automated compliance checking",
    results: [
      { metric: "86%", label: "Processing Time Reduction", detail: "From 18 days to 2.5 days" },
      { metric: "$2.4M", label: "Annual Cost Savings", detail: "Operational efficiency gains" },
      { metric: "340%", label: "ROI in 18 Months", detail: "Return on investment" },
      { metric: "75%", label: "Staff Productivity Increase", detail: "Focus on customer relationships" },
      { metric: "94%", label: "Reduction in Manual Errors", detail: "Automated accuracy" },
      { metric: "65%", label: "Customer Satisfaction Improvement", detail: "Faster service delivery" }
    ],
    testimonial: {
      quote: "The AI system has revolutionized our loan processing capabilities. We're now processing loans faster and more accurately than ever before, while our team can focus on customer relationships rather than paperwork.",
      author: "Sarah Mitchell",
      position: "VP of Operations, Heritage Community Bank"
    }
  };

  const additionalTestimonials = [
    {
      quote: "AI Automation Agency transformed our operations completely. The ROI has been incredible.",
      author: "Alex Prindiville",
      position: "CEO, AP Homes"
    },
    {
      quote: "Their expertise in AI implementation is unmatched. A game-changer for our business.",
      author: "Kenneth Blaber",
      position: "Director, Autoboutique"
    },
    {
      quote: "The level of customization and support we received was exceptional.",
      author: "Sarah Louis",
      position: "CTO, H2H Investments"
    }
  ];

  const caseStudyCategories = [
    {
      title: "Financial Services",
      description: "Automated loan processing, fraud detection, and risk assessment",
      projects: 12,
      avgROI: "285%"
    },
    {
      title: "Healthcare",
      description: "Medical imaging analysis and diagnostic assistance systems",
      projects: 8,
      avgROI: "220%"
    },
    {
      title: "Retail & E-commerce",
      description: "Customer experience optimization and inventory management",
      projects: 15,
      avgROI: "190%"
    },
    {
      title: "Manufacturing",
      description: "Predictive maintenance and quality control automation",
      projects: 10,
      avgROI: "310%"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Success Stories
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Real results from real businesses. See how our AI solutions have transformed 
            operations and delivered measurable ROI for 150+ clients.
          </p>
        </div>
      </section>

      {/* Featured Case Study */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Featured Case Study</Badge>
            <h2 className="text-4xl font-heading font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Heritage Community Bank
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              How we reduced loan processing time by 86% and saved $2.4M annually
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 mb-12">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <CardTitle className="text-2xl mb-2">{mainCaseStudy.client}</CardTitle>
                    <Badge variant="secondary">{mainCaseStudy.industry}</Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-heading font-bold bg-gradient-primary bg-clip-text text-transparent">
                      340%
                    </div>
                    <div className="text-sm text-muted-foreground">ROI in 18 months</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-lg font-heading font-bold mb-3 flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      Challenge
                    </h3>
                    <p className="text-muted-foreground">{mainCaseStudy.challenge}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-bold mb-3 flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      Solution
                    </h3>
                    <p className="text-muted-foreground">{mainCaseStudy.solution}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {mainCaseStudy.results.map((result, index) => (
                    <Card key={index} className="bg-background/50 border-primary/10 text-center">
                      <CardContent className="p-6">
                        <div className="text-2xl font-heading font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                          {result.metric}
                        </div>
                        <div className="font-medium mb-1">{result.label}</div>
                        <div className="text-xs text-muted-foreground">{result.detail}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-gradient-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <Star className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-lg italic mb-4">"{mainCaseStudy.testimonial.quote}"</p>
                        <div>
                          <div className="font-heading font-bold">{mainCaseStudy.testimonial.author}</div>
                          <div className="text-sm text-muted-foreground">{mainCaseStudy.testimonial.position}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Testimonials */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Client Testimonials
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear what our clients say about working with us
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {additionalTestimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="italic mb-4">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-heading font-bold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.position}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Success Across Industries
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We've delivered results across diverse industries and use cases
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {caseStudyCategories.map((category, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-heading font-bold mb-2">{category.title}</h3>
                      <p className="text-muted-foreground text-sm">{category.description}</p>
                    </div>
                    <Badge variant="outline">{category.projects} projects</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-heading font-bold bg-gradient-primary bg-clip-text text-transparent">
                        {category.avgROI}
                      </div>
                      <div className="text-sm text-muted-foreground">Average ROI</div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Projects <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-heading font-bold mb-12">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Our Track Record
            </span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: TrendingUp, number: "500+", label: "AI Solutions Deployed" },
              { icon: Users, number: "150+", label: "Happy Clients" },
              { icon: Clock, number: "95%", label: "Success Rate" },
              { icon: DollarSign, number: "340%", label: "Average ROI" }
            ].map((stat, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-heading font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-heading font-bold mb-6">
            Ready to Create Your Success Story?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our growing list of successful clients and see how AI can transform your business.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90">
              Start Your Project
            </Button>
            <Button size="lg" variant="outline">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudies;