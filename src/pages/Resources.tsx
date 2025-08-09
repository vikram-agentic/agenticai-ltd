import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Clock,
  FileText,
  Eye,
  Download,
  ArrowRight,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { MeetingBookingModal } from "@/components/MeetingBookingModal";
import { Button } from "@/components/ui/button";
import allResources from "@/resources.json";
import { EnhancedHero } from "@/components/ui/enhanced-hero";

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title =
      "AI Resources Hub - Free Guides, Templates & Reports | Agentic AI";
  }, []);

  const filteredResources = allResources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="flex-grow">
        <EnhancedHero
          badge="Exclusive Resources"
          title="AI Resource Hub"
          subtitle="Your Gateway to Autonomous Intelligence"
          description="Explore our comprehensive collection of AI implementation guides, compliance frameworks, and strategic playbooks. Proven methodologies from over 500+ successful AI implementations."
          primaryAction={{
            text: "Explore All Resources",
            onClick: () =>
              document
                .getElementById("resources-section")
                ?.scrollIntoView({ behavior: "smooth" }),
          }}
          secondaryAction={{
            text: "Get Expert Help",
            onClick: () => navigate("/book-meeting"),
          }}
        />

        <section id="resources-section" className="py-16 md:py-24 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="flex justify-center mb-12">
              <div className="relative w-full max-w-lg">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for guides, frameworks, playbooks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 w-full bg-background/50 backdrop-blur-glass border-border text-foreground placeholder:text-muted-foreground focus:bg-background/70"
                />
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 bg-transparent p-0">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="guides">Guides</TabsTrigger>
                <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
                <TabsTrigger value="tools">Tools</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <ResourceGrid resources={filteredResources} navigate={navigate} />
              </TabsContent>
              <TabsContent value="guides">
                <ResourceGrid
                  resources={filteredResources.filter((r) => r.type === "Guide")}
                  navigate={navigate}
                />
              </TabsContent>
              <TabsContent value="frameworks">
                <ResourceGrid
                  resources={filteredResources.filter(
                    (r) => r.type === "Framework"
                  )}
                  navigate={navigate}
                />
              </TabsContent>
              <TabsContent value="compliance">
                <ResourceGrid
                  resources={filteredResources.filter(
                    (r) => r.category === "Compliance"
                  )}
                  navigate={navigate}
                />
              </TabsContent>
              <TabsContent value="tools">
                <ResourceGrid
                  resources={filteredResources.filter((r) => r.type === "Toolkit")}
                  navigate={navigate}
                />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our expert team delivers proven results with a 95% success rate
              and 340% average ROI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MeetingBookingModal
                triggerText="Schedule Free Strategy Session"
                triggerSize="lg"
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 px-8 py-3 text-lg"
              />
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-3 text-lg"
                onClick={() => navigate("/services")}
              >
                Explore Our Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const ResourceGrid = ({ resources, navigate }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
    {resources.map((resource) => (
      <Card
        key={resource.title}
        className="bg-card/50 backdrop-blur-glass border-primary/10 hover:border-primary/30 transition-all hover-lift h-full flex flex-col"
      >
        <CardHeader>
          <div className="flex items-center justify-between mb-3">
            <Badge className="bg-primary/10 text-primary border-primary/20">
              {resource.type}
            </Badge>
            <Badge variant="outline" className="border-accent/20 text-accent">
              {resource.category}
            </Badge>
          </div>
          <CardTitle className="text-xl font-heading text-foreground">
            {resource.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
          <p className="text-muted-foreground mb-4 flex-grow">
            {resource.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground my-4">
            <div className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              <span>{resource.pages} pages</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{resource.readTime}</span>
            </div>
          </div>
          <div className="flex gap-3 mt-auto">
            <Button
              size="sm"
              className="w-full bg-primary/80 hover:bg-primary"
              onClick={() => navigate(resource.viewUrl)}
            >
              <Eye className="mr-2 h-4 w-4" /> View Full Resource
            </Button>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default Resources;
