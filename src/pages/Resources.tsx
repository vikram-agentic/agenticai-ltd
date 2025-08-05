import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  FileText, 
  BookOpen, 
  Video, 
  Search,
  Clock,
  Star,
  ArrowRight
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const developerGuides = [
    {
      title: "Enterprise RAG Implementation Guide",
      description: "Complete guide to implementing production-ready Retrieval-Augmented Generation systems",
      category: "Implementation",
      readTime: "45 min",
      downloadUrl: "#",
      featured: true
    },
    {
      title: "AI Cost Optimization Strategies",
      description: "Best practices for reducing AI infrastructure costs while maintaining performance",
      category: "Optimization",
      readTime: "30 min",
      downloadUrl: "#"
    },
    {
      title: "Building Your First AI Agent",
      description: "Step-by-step tutorial for creating autonomous AI agents from scratch",
      category: "Tutorial",
      readTime: "60 min",
      downloadUrl: "#"
    },
    {
      title: "AI Framework Comparison 2024",
      description: "Comprehensive comparison of TensorFlow, PyTorch, and emerging frameworks",
      category: "Analysis",
      readTime: "25 min",
      downloadUrl: "#"
    },
    {
      title: "AI Deployment Best Practices",
      description: "Production deployment strategies for ML models and AI systems",
      category: "Deployment",
      readTime: "40 min",
      downloadUrl: "#"
    },
    {
      title: "AI Governance & Ethics Framework",
      description: "Guidelines for responsible AI development and deployment",
      category: "Governance",
      readTime: "35 min",
      downloadUrl: "#"
    }
  ];

  const downloads = [
    {
      title: "AI Implementation Checklist",
      description: "Comprehensive checklist for successful AI project implementation",
      type: "PDF",
      size: "2.5 MB",
      downloadUrl: "#"
    },
    {
      title: "Cost Optimization Template",
      description: "Spreadsheet template for tracking and optimizing AI costs",
      type: "Excel",
      size: "1.2 MB",
      downloadUrl: "#"
    },
    {
      title: "AI Governance Checklist",
      description: "Essential checkpoints for responsible AI development",
      type: "PDF",
      size: "1.8 MB",
      downloadUrl: "#"
    }
  ];

  const blogPosts = [
    {
      title: "The Future of Autonomous Agent Collaboration",
      excerpt: "Exploring how multi-agent systems will reshape business automation",
      author: "Jane Smith",
      date: "2024-01-15",
      readTime: "8 min",
      tags: ["AI Agents", "Automation", "Future Tech"]
    },
    {
      title: "Implementing Agentic Workflows in Enterprise",
      excerpt: "Best practices for deploying autonomous decision-making systems",
      author: "John Doe",
      date: "2024-01-10",
      readTime: "12 min",
      tags: ["Enterprise", "Workflows", "Implementation"]
    },
    {
      title: "Multi-Agent Systems: Coordination Strategies",
      excerpt: "How to design effective communication between AI agents",
      author: "Peter Jones",
      date: "2024-01-05",
      readTime: "10 min",
      tags: ["Multi-Agent", "Coordination", "Design"]
    }
  ];

  const researchReports = [
    {
      title: "The Future of Work with AI Agents",
      description: "In-depth analysis of how AI agents will transform workplace dynamics",
      pages: 45,
      publishDate: "Q4 2024",
      downloadUrl: "#"
    },
    {
      title: "Industry AI Adoption Report 2025",
      description: "Comprehensive survey of AI adoption across different industries",
      pages: 62,
      publishDate: "Q1 2025",
      downloadUrl: "#"
    }
  ];

  const filteredGuides = developerGuides.filter(guide =>
    guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleScheduleConsultation = () => {
    window.open("https://calendly.com/vikram-agentic-ai/30min", "_blank");
  };

  const handleViewServices = () => {
    window.location.href = "/services";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Hero Section */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              AI Resources Hub
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Comprehensive guides, tools, and insights to accelerate your AI journey. 
            From implementation guides to research reports.
          </p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Tabs defaultValue="guides" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="guides">Developer Guides</TabsTrigger>
              <TabsTrigger value="downloads">Downloads</TabsTrigger>
              <TabsTrigger value="blog">Blog</TabsTrigger>
              <TabsTrigger value="reports">Research Reports</TabsTrigger>
            </TabsList>

            {/* Developer Guides */}
            <TabsContent value="guides">
              <div className="grid lg:grid-cols-2 gap-6">
                {filteredGuides.map((guide, index) => (
                  <Card key={index} className={`bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors ${guide.featured ? 'ring-2 ring-primary/50' : ''}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={guide.featured ? "default" : "secondary"}>
                              {guide.category}
                            </Badge>
                            {guide.featured && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                          </div>
                          <CardTitle className="text-xl">{guide.title}</CardTitle>
                        </div>
                        <FileText className="h-6 w-6 text-primary flex-shrink-0" />
                      </div>
                      <p className="text-muted-foreground text-sm">{guide.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {guide.readTime}
                          </div>
                        </div>
                        <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Downloads */}
            <TabsContent value="downloads">
              <div className="grid md:grid-cols-3 gap-6">
                {downloads.map((download, index) => (
                  <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <Download className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-heading font-bold mb-2">{download.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{download.description}</p>
                      <div className="flex justify-center gap-4 mb-4 text-sm text-muted-foreground">
                        <Badge variant="outline">{download.type}</Badge>
                        <span>{download.size}</span>
                      </div>
                      <Button className="w-full bg-gradient-primary hover:opacity-90">
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Blog */}
            <TabsContent value="blog">
              <div className="space-y-6">
                {blogPosts.map((post, index) => (
                  <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-heading font-bold mb-2">{post.title}</h3>
                          <p className="text-muted-foreground mb-3">{post.excerpt}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span>By {post.author}</span>
                            <span>{post.date}</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {post.readTime}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {post.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Read More <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Research Reports */}
            <TabsContent value="reports">
              <div className="grid md:grid-cols-2 gap-6">
                {researchReports.map((report, index) => (
                  <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{report.title}</CardTitle>
                          <p className="text-muted-foreground text-sm">{report.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{report.pages} pages</span>
                          <span>{report.publishDate}</span>
                        </div>
                        <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-heading font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Stay Updated
            </span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get the latest AI insights, guides, and research reports delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <Input placeholder="Enter your email" className="flex-1" />
            <Button className="bg-gradient-primary hover:opacity-90">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-heading font-bold mb-6">
            Need Custom AI Solutions?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our team of experts can help you implement the strategies outlined in these resources.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:opacity-90"
              onClick={handleScheduleConsultation}
            >
              Consult Our Experts
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={handleViewServices}
            >
              View Our Services
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Resources;