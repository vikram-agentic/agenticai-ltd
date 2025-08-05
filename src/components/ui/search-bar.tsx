import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, FileText, Users, Lightbulb } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: "page" | "service" | "resource" | "case-study";
  url: string;
  tags?: string[];
}

// Mock search data - in real app, this would come from API/CMS
const searchData: SearchResult[] = [
  {
    id: "1",
    title: "AI Agent Automation",
    description: "Intelligent agents that work autonomously to handle complex business processes",
    category: "service",
    url: "/services/ai-agent-automation",
    tags: ["automation", "agents", "AI"]
  },
  {
    id: "2",
    title: "Custom AI Development",
    description: "Tailored AI solutions designed specifically for your business needs",
    category: "service",
    url: "/services/custom-ai-development",
    tags: ["custom", "development", "AI"]
  },
  {
    id: "3",
    title: "Financial Services Case Study",
    description: "How we transformed a traditional bank with AI automation",
    category: "case-study",
    url: "/case-studies/financial-services",
    tags: ["finance", "banking", "case study"]
  },
  {
    id: "4",
    title: "ROI Calculator",
    description: "Calculate the potential return on investment for AI automation",
    category: "page",
    url: "/roi-calculator",
    tags: ["ROI", "calculator", "investment"]
  },
  {
    id: "5",
    title: "What is Agentic AI?",
    description: "Learn about the revolutionary approach to artificial intelligence",
    category: "resource",
    url: "/what-is-agentic-ai",
    tags: ["agentic", "AI", "learning"]
  }
];

const categoryConfig = {
  page: { icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10" },
  service: { icon: Lightbulb, color: "text-primary", bg: "bg-primary/10" },
  resource: { icon: FileText, color: "text-green-400", bg: "bg-green-500/10" },
  "case-study": { icon: Users, color: "text-purple-400", bg: "bg-purple-500/10" }
};

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onClose?: () => void;
  isExpanded?: boolean;
}

export function SearchBar({ 
  placeholder = "Search services, resources, case studies...", 
  className = "",
  onClose,
  isExpanded = false 
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(isExpanded);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim()) {
      const filtered = searchData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleResultClick = (url: string) => {
    navigate(url);
    setQuery("");
    setIsOpen(false);
    onClose?.();
  };

  const clearSearch = () => {
    setQuery("");
    setIsOpen(false);
    onClose?.();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10 bg-background/50 backdrop-blur-glass border-border/50 focus:border-primary/50"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-destructive/20"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-full z-50"
          >
            <Card className="border-border/50 backdrop-blur-glass bg-card/95 shadow-2xl overflow-hidden">
              <div className="p-2 max-h-96 overflow-y-auto">
                {results.map((result, index) => {
                  const categoryInfo = categoryConfig[result.category];
                  const Icon = categoryInfo.icon;
                  
                  return (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group"
                    >
                      <button
                        onClick={() => handleResultClick(result.url)}
                        className="w-full p-3 rounded-lg hover:bg-accent/10 transition-colors text-left flex items-start gap-3"
                      >
                        <div className={`p-2 rounded-md ${categoryInfo.bg} flex-shrink-0`}>
                          <Icon className={`w-4 h-4 ${categoryInfo.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                              {result.title}
                            </h4>
                            <Badge variant="outline" className="text-xs capitalize">
                              {result.category.replace("-", " ")}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {result.description}
                          </p>
                          {result.tags && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {result.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 text-xs bg-muted/50 text-muted-foreground rounded-md"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
              
              <div className="border-t border-border/50 p-3 bg-muted/20">
                <p className="text-xs text-muted-foreground text-center">
                  Showing {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && results.length === 0 && query.trim() && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full mt-2 w-full z-50"
        >
          <Card className="border-border/50 backdrop-blur-glass bg-card/95 p-4 text-center">
            <p className="text-sm text-muted-foreground">
              No results found for "{query}"
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Try searching for "AI automation", "case studies", or "ROI calculator"
            </p>
          </Card>
        </motion.div>
      )}
    </div>
  );
}