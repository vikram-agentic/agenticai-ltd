import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { FileText, Image, BarChart3, CheckSquare, Download, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const ResourceGenerator = () => {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("");
  const [resourceType, setResourceType] = useState<'guide' | 'template' | 'report' | 'checklist'>('guide');
  const [includeImages, setIncludeImages] = useState(true);
  const [includeVisualizations, setIncludeVisualizations] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [generationProgress, setGenerationProgress] = useState("");
  const { toast } = useToast();

  const resourceTypes = [
    { value: 'guide', label: 'Implementation Guide', icon: FileText },
    { value: 'template', label: 'Template/Checklist', icon: CheckSquare },
    { value: 'report', label: 'Research Report', icon: BarChart3 },
    { value: 'checklist', label: 'Process Checklist', icon: CheckSquare }
  ];

  const categories = [
    'AI Implementation',
    'Cost Optimization', 
    'Governance',
    'Technical Architecture',
    'Business Strategy',
    'Risk Management',
    'Performance Monitoring',
    'Team Training',
    'Compliance',
    'Innovation'
  ];

  const handleGenerate = async () => {
    if (!topic || !category) {
      toast({
        title: "Error",
        description: "Please provide a topic and category.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setGenerationProgress("Initializing Gemini AI...");
    
    try {
      setGenerationProgress("Generating content with Gemini 2.5 Pro...");
      
      const { data, error } = await supabase.functions.invoke('gemini-resource-generator', {
        body: {
          resourceType,
          topic,
          category,
          includeImages,
          includeVisualizations
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate resource');
      }

      if (!data.success) {
        throw new Error(data.error || 'Resource generation failed');
      }

      setGenerationProgress("Resource generated successfully!");
      
      toast({
        title: "Success! 🎉",
        description: `Resource "${data.title}" generated with ${data.imagesGenerated} images. Content ready for download!`,
        duration: 10000,
      });

      // Create and download the HTML file
      if (data.content) {
        const blob = new Blob([data.content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${data.resourceType}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      // Clear form
      setTopic("");
      setCategory("");
      setGenerationProgress("");

    } catch (error) {
      console.error('Resource generation error:', error);
      setGenerationProgress("");
      toast({
        title: "Generation Failed",
        description: (error as Error).message,
        variant: "destructive",
        duration: 10000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedResourceType = resourceTypes.find(rt => rt.value === resourceType);
  const IconComponent = selectedResourceType?.icon || FileText;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-blue-900 flex items-center justify-center gap-2">
          <IconComponent className="h-6 w-6" />
          AI Resource Generator
        </CardTitle>
        <p className="text-blue-700">Generate professional resources using Gemini 2.5 Pro + Imagen 4.0</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Resource Type Selection */}
          <div>
            <Label htmlFor="resourceType" className="text-sm font-semibold text-gray-700">Resource Type</Label>
            <Select value={resourceType} onValueChange={(value: any) => setResourceType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select resource type" />
              </SelectTrigger>
              <SelectContent>
                {resourceTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Topic Input */}
          <div>
            <Label htmlFor="topic" className="text-sm font-semibold text-gray-700">Topic</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Enterprise RAG Implementation, AI Cost Optimization, ML Model Governance"
              className="mt-1"
            />
          </div>

          {/* Category Selection */}
          <div>
            <Label htmlFor="category" className="text-sm font-semibold text-gray-700">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Generation Options */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-700">Generation Options</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeImages" 
                checked={includeImages}
                onCheckedChange={(checked) => setIncludeImages(checked === true)}
              />
              <Label htmlFor="includeImages" className="text-sm flex items-center gap-2">
                <Image className="h-4 w-4" />
                Generate Images (Imagen 4.0)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeVisualizations" 
                checked={includeVisualizations}
                onCheckedChange={(checked) => setIncludeVisualizations(checked === true)}
              />
              <Label htmlFor="includeVisualizations" className="text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Include Data Visualizations
              </Label>
            </div>
          </div>

          {/* Progress Indicator */}
          {isLoading && (
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-800">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="font-medium">{generationProgress}</span>
              </div>
              <div className="mt-2 text-sm text-blue-600">
                This may take 2-3 minutes for full generation with images...
              </div>
            </div>
          )}

          {/* Generate Button */}
          <Button 
            onClick={handleGenerate} 
            disabled={isLoading || !topic || !category}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating with Gemini AI...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Generate Resource
              </>
            )}
          </Button>

          {/* Info Text */}
          <div className="text-xs text-gray-500 text-center">
            Resources are generated using Gemini 2.5 Pro for content and Imagen 4.0 for visualizations.
            <br />
            Generated files include SEO optimization, branding, and professional styling.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
