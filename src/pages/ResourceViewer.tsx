import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Download,
  FileText,
  Clock,
  TrendingUp,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import allResources from "@/resources.json";
import { EnhancedHero } from "@/components/ui/enhanced-hero";
import BrandedMarkdown from "@/components/ui/branded-markdown";

const ResourceViewer = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const resource = allResources.find((r) => r.viewUrl?.includes(slug || ""));

  useEffect(() => {
    if (resource) {
      document.title = `${resource.title} | Agentic AI AMRO Ltd`;
      const loadContent = async () => {
        try {
          const response = await fetch(resource.downloadUrl);
          if (!response.ok) {
            throw new Error(`Failed to load resource: ${response.status}`);
          }
          const text = await response.text();
          setContent(text);
        } catch (err) {
          console.error("Error loading resource:", err);
          setError("Failed to load resource content");
        } finally {
          setLoading(false);
        }
      };
      loadContent();
    } else {
      setError("Resource not found");
      setLoading(false);
    }
  }, [resource, slug]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navigation />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading resource...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navigation />
        <main className="flex-grow flex items-center justify-center text-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Resource Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              {error || "The requested resource could not be found."}
            </p>
            <Button onClick={() => navigate("/resources")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Resources
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <EnhancedHero
          badge={resource.type}
          title={resource.title}
          subtitle={resource.category}
          description={resource.description}
          primaryAction={{
            text: "Back to Resources",
            onClick: () => navigate("/resources"),
          }}
          stats={[
            {
              label: "Pages",
              value: `${resource.pages}`,
            },
            {
              label: "Read Time",
              value: resource.readTime,
            },
            {
              label: "Difficulty",
              value: resource.difficulty,
            },
          ]}
        />

        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <BrandedMarkdown content={content} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ResourceViewer;
