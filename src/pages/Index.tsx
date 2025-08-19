import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { EnhancedHero } from "@/components/ui/enhanced-hero";
import { SearchBar } from "@/components/ui/search-bar";
import { InteractiveStats } from "@/components/ui/interactive-stats";
import { AnimatedSection } from "@/components/ui/animated-section";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MeetingBookingModal } from "@/components/MeetingBookingModal";
import { Button } from "@/components/ui/button";
import NewsletterSubscription from "@/components/NewsletterSubscription";
import { 
  Brain,
  Zap, 
  Shield, 
  Building2, 
  Users, 
  ArrowRight, 
  Target,
  TrendingUp,
  Clock,
  DollarSign,
  Calendar
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Enhanced Hero Section */}
      <EnhancedHero
        badge="Leading AI Automation Solutions"
        title="Transform Your Business with Agentic AI"
        subtitle="Autonomous Intelligence for the Modern Enterprise"
        description="Harness the power of autonomous AI agents to automate complex processes, boost productivity, and drive unprecedented growth with our cutting-edge solutions."
        primaryAction={{
          text: "Schedule Free Consultation",
          onClick: () => navigate('/book-meeting')
        }}
        secondaryAction={{
          text: "Learn About Agentic AI",
          onClick: () => navigate('/what-is-agentic-ai')
        }}
        stats={[
          { value: "500+", label: "AI Agents Deployed" },
          { value: "98%", label: "Client Satisfaction" },
          { value: "60%", label: "Average Cost Reduction" },
          { value: "24/7", label: "AI Agent Operation" }
        ]}
        features={[
          { icon: Zap, text: "Lightning Fast Deployment" },
          { icon: Shield, text: "Enterprise Security" },
          { icon: Target, text: "ROI Focused Solutions" }
        ]}
      />

      {/* Search Section */}
      <section className="py-16 bg-gradient-to-br from-muted/20 to-background">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-4">Find What You're Looking For</h2>
            <p className="text-muted-foreground mb-8">
              Explore our services, resources, and success stories
            </p>
            <SearchBar className="max-w-md mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Interactive Stats Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
              Proven Results That Speak for Themselves
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI solutions have transformed businesses across industries, delivering measurable results and exceptional ROI.
            </p>
          </AnimatedSection>
          
          <InteractiveStats 
            stats={[
              { 
                icon: TrendingUp, 
                number: "500+", 
                label: "AI Solutions Deployed",
                description: "Across 50+ industries"
              },
              { 
                icon: Users, 
                number: "98%", 
                label: "Client Satisfaction",
                description: "Based on 150+ reviews"
              },
              { 
                icon: Clock, 
                number: "86%", 
                label: "Time Reduction",
                description: "Average process improvement"
              },
              { 
                icon: DollarSign, 
                number: "340%", 
                label: "Average ROI",
                description: "Within 18 months"
              }
            ]}
          />
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
              Comprehensive AI Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From custom AI development to autonomous agents, we provide end-to-end solutions that transform your business operations.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Brain,
                title: "Custom AI Development",
                description: "Machine learning models, NLP processing, computer vision, and predictive analytics tailored to your needs.",
                link: "/services/custom-ai-development"
              },
              {
                icon: Zap,
                title: "AI Agent & Automation",
                description: "Intelligent agents for complex workflows, multi-agent systems, and 24/7 autonomous operations.",
                link: "/services/ai-agent-automation"
              },
              {
                icon: Shield,
                title: "Specialized AI Solutions",
                description: "AI security solutions, business intelligence, enterprise RAG implementation, and seamless integration.",
                link: "/services/specialized-ai-solutions"
              },
              {
                icon: Building2,
                title: "Industry-Specific AI",
                description: "Tailored solutions for healthcare, finance, retail, legal, real estate, and education sectors.",
                link: "/services/industry-specific-ai"
              }
            ].map((service, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <Card className="group bg-card/50 backdrop-blur-glass border-primary/20 hover:border-primary/40 transition-all hover-lift h-full">
                  <CardHeader>
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <service.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground mb-4">
                      {service.description}
                    </CardDescription>
                    <Link to={service.link}>
                      <Button variant="ghost" size="sm" className="group-hover:text-primary">
                        Learn More
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="text-center mt-12" delay={0.4}>
            <Link to="/services">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                View All Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Stay Ahead of the AI Revolution
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Get exclusive insights, case studies, and trends delivered weekly. Join 5,000+ AI leaders 
              who rely on our newsletter for strategic guidance.
            </p>
          </AnimatedSection>
          
          <div className="flex justify-center">
            <AnimatedSection delay={0.2}>
              <NewsletterSubscription 
                variant="inline"
                source="homepage"
                title="Join 5,000+ AI Leaders"
                description="Weekly insights on agentic AI, automation strategies, compliance updates, and industry trends."
                className="max-w-2xl"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Business with AI?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join the 500+ companies that have already accelerated their growth with our AI solutions. 
              Get started with a free consultation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MeetingBookingModal 
                triggerText="Schedule Free Consultation"
                triggerSize="lg"
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 px-8 py-3 text-lg"
                serviceType="General Inquiry"
              >
                Schedule Free Consultation
                <Calendar className="ml-2 h-5 w-5" />
              </MeetingBookingModal>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="px-8 py-3 text-lg">
                  Contact Our Team
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
