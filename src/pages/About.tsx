import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Eye, Award } from "lucide-react";

const About = () => {
  const teamMembers = [
    {
      name: "John Doe",
      role: "CEO & Founder",
      description: "Visionary leader driving AI innovation across industries"
    },
    {
      name: "Jane Smith",
      role: "CTO & Co-Founder",
      description: "Technical architect behind our cutting-edge AI solutions"
    },
    {
      name: "Peter Jones",
      role: "Lead AI Engineer",
      description: "Expert in machine learning and autonomous agent development"
    }
  ];

  const milestones = [
    { year: "2023", event: "Company Founded", description: "Agentic AI AMRO Ltd established in Tunbridge Wells" },
    { year: "2023", event: "First AI Solutions", description: "Deployed initial automation systems for local businesses" },
    { year: "2024", event: "500+ Solutions", description: "Reached milestone of 500+ AI solutions deployed" },
    { year: "2024", event: "95% Success Rate", description: "Achieved industry-leading 95% project success rate" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              About Agentic AI
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Accelerating the agentic transformation of businesses by building autonomous systems 
            that are not just intelligent, but also responsible, reliable, and aligned with human values.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-8 w-8 text-primary" />
                  <h2 className="text-3xl font-heading font-bold">Our Mission</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To accelerate the agentic transformation of businesses by building autonomous systems 
                  that are not just intelligent, but also responsible, reliable, and aligned with human values.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="h-8 w-8 text-primary" />
                  <h2 className="text-3xl font-heading font-bold">Our Vision</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To revolutionize the adoption of Agentic AI across every sector by delivering seamless, 
                  multi-cloud solutions that require minimal effort and virtually no code.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Meet Our Team
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our leadership team combines deep technical expertise with business acumen 
              to deliver transformative AI solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-2">{member.name}</h3>
                  <Badge variant="secondary" className="mb-3">{member.role}</Badge>
                  <p className="text-muted-foreground text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Our Journey
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From startup to industry leader, here's how we've grown to serve 150+ clients 
              with 500+ AI solutions deployed.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-px h-16 bg-gradient-primary mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline">{milestone.year}</Badge>
                    <h3 className="text-xl font-heading font-bold">{milestone.event}</h3>
                  </div>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Our Impact
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: "500+", label: "AI Solutions Deployed" },
              { number: "150+", label: "Happy Clients" },
              { number: "95%", label: "Success Rate" },
              { number: "340%", label: "Average ROI" }
            ].map((stat, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20 text-center">
                <CardContent className="p-6">
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
            Ready to Transform Your Business?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join 150+ companies that have already accelerated their growth with our AI solutions.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90">
              Start Your AI Journey
            </Button>
            <Button size="lg" variant="outline">
              View Our Work
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;