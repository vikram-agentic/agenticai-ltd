import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Upload, 
  FileCheck, 
  RotateCcw, 
  Download, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Zap,
  Settings
} from 'lucide-react';

interface BatchSettings {
  contentLength: string;
  writingStyle: string;
  targetAudience: string;
  includeImages: boolean;
  seoOptimization: boolean;
  brandAwareness: boolean;
}

interface CSVRow {
  topic: string;
  keywords: string;
  contentType: string;
  audience?: string;
  style?: string;
  length?: string;
}

const BatchGeneratorComponent: React.FC = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [currentItem, setCurrentItem] = useState(0);
  const [batchResults, setBatchResults] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const [batchSettings, setBatchSettings] = useState<BatchSettings>({
    contentLength: '3000+',
    writingStyle: 'professional',
    targetAudience: 'business-professionals',
    includeImages: true,
    seoOptimization: true,
    brandAwareness: true
  });

  const parseCSV = (text: string): CSVRow[] => {
    const lines = text.split('\\n').filter(line => line.trim());
    if (lines.length === 0) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['topic', 'keywords'];
    
    const hasRequiredHeaders = requiredHeaders.every(header => 
      headers.some(h => h.includes(header))
    );
    
    if (!hasRequiredHeaders) {
      throw new Error('CSV must contain at least \"topic\" and \"keywords\" columns');
    }
    
    return lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim().replace(/\"/g, ''));
      const row: CSVRow = {
        topic: '',
        keywords: '',
        contentType: 'blog'
      };
      
      headers.forEach((header, i) => {
        const value = values[i] || '';
        if (header.includes('topic')) row.topic = value;
        else if (header.includes('keyword')) row.keywords = value;
        else if (header.includes('type') || header.includes('content')) row.contentType = value || 'blog';
        else if (header.includes('audience')) row.audience = value;
        else if (header.includes('style')) row.style = value;
        else if (header.includes('length')) row.length = value;
      });
      
      if (!row.topic || !row.keywords) {
        throw new Error(`Row ${index + 2}: Missing required topic or keywords`);
      }
      
      return row;
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: \"Invalid File Type\",
        description: \"Please upload a CSV file\",
        variant: \"destructive\"
      });
      return;
    }

    setCsvFile(file);
    
    try {
      const text = await file.text();
      const data = parseCSV(text);
      setCsvData(data);
      setBatchResults([]);
      setErrors([]);
      
      toast({
        title: \"CSV Loaded Successfully\",
        description: `Ready to generate ${data.length} articles`
      });
    } catch (error) {
      console.error('CSV parse error:', error);
      toast({
        title: \"CSV Parse Error\",
        description: error instanceof Error ? error.message : \"Failed to parse CSV file\",
        variant: \"destructive\"
      });
      setCsvFile(null);
      setCsvData([]);
    }
  };

  const startBatchGeneration = async () => {
    if (csvData.length === 0) {
      toast({
        title: \"No Data\",
        description: \"Please upload a CSV file first\",
        variant: \"destructive\"
      });
      return;
    }

    setIsProcessing(true);
    setBatchProgress(0);
    setCurrentItem(0);
    setBatchResults([]);
    setErrors([]);

    try {
      for (let i = 0; i < csvData.length; i++) {
        setCurrentItem(i + 1);
        const row = csvData[i];
        
        try {
          // Create content request
          const { data: requestData, error: requestError } = await supabase
            .from('content_requests')
            .insert({
              title: `Batch Generated: ${row.topic}`,
              content_type: row.contentType,
              target_keywords: row.keywords.split(',').map(k => k.trim()),
              status: 'processing',
              progress: 0,
              batch_id: `batch_${Date.now()}`
            })
            .select()
            .single();

          if (requestError) throw requestError;

          // Generate article using advanced article generator
          const { data: articleData, error: articleError } = await supabase.functions.invoke('advanced-article-generator', {
            body: {
              action: 'generate_article',
              requestId: requestData.id,
              contentType: row.contentType,
              targetKeywords: row.keywords.split(',').map(k => k.trim()),
              contentLength: row.length || batchSettings.contentLength,
              writingStyle: row.style || batchSettings.writingStyle,
              targetAudience: row.audience || batchSettings.targetAudience,
              seoFocus: batchSettings.seoOptimization,
              includeImages: batchSettings.includeImages,
              brandAwareness: batchSettings.brandAwareness,
              includeCallToActions: true,
              includePerplexityResearch: true,
              competitorAnalysis: true,
              readabilityTarget: 'grade-8'
            }
          });

          if (articleError) {
            throw new Error(`Article generation failed: ${articleError.message}`);
          }

          setBatchResults(prev => [...prev, {
            ...articleData.contentData,
            originalRow: row,
            status: 'completed',
            index: i
          }]);

          // Update progress
          const progress = ((i + 1) / csvData.length) * 100;
          setBatchProgress(progress);

          // Add small delay to prevent rate limiting
          if (i < csvData.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }

        } catch (itemError) {
          console.error(`Error generating article ${i + 1}:`, itemError);
          setErrors(prev => [...prev, `Row ${i + 1} (${row.topic}): ${itemError instanceof Error ? itemError.message : 'Unknown error'}`]);
          
          setBatchResults(prev => [...prev, {
            originalRow: row,
            status: 'failed',
            error: itemError instanceof Error ? itemError.message : 'Unknown error',
            index: i
          }]);
        }
      }

      toast({
        title: \"Batch Generation Complete\",
        description: `Generated ${batchResults.filter(r => r.status === 'completed').length} articles successfully`
      });

    } catch (error) {
      console.error('Batch generation error:', error);
      toast({
        title: \"Batch Generation Failed\",
        description: error instanceof Error ? error.message : \"Unexpected error occurred\",
        variant: \"destructive\"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const exportResults = () => {
    const successfulResults = batchResults.filter(r => r.status === 'completed');
    
    if (successfulResults.length === 0) {
      toast({
        title: \"No Results\",
        description: \"No successful articles to export\",
        variant: \"destructive\"
      });
      return;
    }

    const csvContent = [
      'Title,Word Count,SEO Score,Reading Time,Status,Original Topic,Original Keywords',
      ...successfulResults.map(result => 
        `\"${result.title}\",${result.wordCount || 0},${result.seoScore || 0},\"${result.readingTime || '0 min'}\",${result.status},\"${result.originalRow.topic}\",\"${result.originalRow.keywords}\"`
      )
    ].join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `batch_results_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: \"Results Exported\",
      description: \"Batch results have been downloaded as CSV\"
    });
  };

  return (
    <div className=\"space-y-6\">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className=\"flex items-center text-gray-900\">
            <Upload className=\"w-5 h-5 mr-2 text-blue-500\" />
            Upload CSV File
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className=\"border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors\"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className=\"mx-auto h-12 w-12 text-gray-400 mb-4\" />
            <div className=\"space-y-2\">
              <h3 className=\"text-lg font-medium text-gray-900\">Upload CSV File</h3>
              <p className=\"text-gray-600\">
                CSV should contain columns: <strong>topic</strong>, <strong>keywords</strong>, content_type (optional), audience (optional)
              </p>
            </div>
            <input
              ref={fileInputRef}
              type=\"file\"
              accept=\".csv\"
              onChange={handleFileUpload}
              className=\"hidden\"
            />
            <Button variant=\"outline\" className=\"mt-4\">
              Choose CSV File
            </Button>
          </div>
          
          {csvFile && (
            <Alert className=\"mt-4\">
              <FileCheck className=\"h-4 w-4\" />
              <AlertDescription>
                <strong>{csvFile.name}</strong> loaded successfully - Ready to process {csvData.length} articles
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Batch Settings */}
      {csvData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className=\"flex items-center text-gray-900\">
              <Settings className=\"w-5 h-5 mr-2 text-green-500\" />
              Batch Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className=\"grid grid-cols-1 md:grid-cols-3 gap-4\">
              <div className=\"space-y-2\">
                <Label>Default Content Length</Label>
                <Select value={batchSettings.contentLength} onValueChange={(value) => setBatchSettings({...batchSettings, contentLength: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=\"1500+\">1500+ words</SelectItem>
                    <SelectItem value=\"2500+\">2500+ words</SelectItem>
                    <SelectItem value=\"3000+\">3000+ words</SelectItem>
                    <SelectItem value=\"5000+\">5000+ words</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className=\"space-y-2\">
                <Label>Writing Style</Label>
                <Select value={batchSettings.writingStyle} onValueChange={(value) => setBatchSettings({...batchSettings, writingStyle: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=\"professional\">Professional</SelectItem>
                    <SelectItem value=\"conversational\">Conversational</SelectItem>
                    <SelectItem value=\"authoritative\">Authoritative</SelectItem>
                    <SelectItem value=\"friendly\">Friendly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className=\"space-y-2\">
                <Label>Target Audience</Label>
                <Select value={batchSettings.targetAudience} onValueChange={(value) => setBatchSettings({...batchSettings, targetAudience: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=\"business-professionals\">Business Professionals</SelectItem>
                    <SelectItem value=\"technical-experts\">Technical Experts</SelectItem>
                    <SelectItem value=\"decision-makers\">Decision Makers</SelectItem>
                    <SelectItem value=\"general-audience\">General Audience</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className=\"grid grid-cols-3 gap-6 mt-4\">
              <div className=\"flex items-center justify-between\">
                <Label>SEO Optimization</Label>
                <input
                  type=\"checkbox\"
                  checked={batchSettings.seoOptimization}
                  onChange={(e) => setBatchSettings({...batchSettings, seoOptimization: e.target.checked})}
                  className=\"rounded\"
                />
              </div>
              <div className=\"flex items-center justify-between\">
                <Label>Include Images</Label>
                <input
                  type=\"checkbox\"
                  checked={batchSettings.includeImages}
                  onChange={(e) => setBatchSettings({...batchSettings, includeImages: e.target.checked})}
                  className=\"rounded\"
                />
              </div>
              <div className=\"flex items-center justify-between\">
                <Label>Brand Awareness</Label>
                <input
                  type=\"checkbox\"
                  checked={batchSettings.brandAwareness}
                  onChange={(e) => setBatchSettings({...batchSettings, brandAwareness: e.target.checked})}
                  className=\"rounded\"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generation Controls */}
      {csvData.length > 0 && (
        <Card>
          <CardContent className=\"pt-6\">
            <div className=\"space-y-4\">
              <Button 
                onClick={startBatchGeneration}
                disabled={isProcessing}
                className=\"w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 h-12 text-lg font-semibold\"
              >
                {isProcessing ? (
                  <>
                    <RotateCcw className=\"w-5 h-5 mr-2 animate-spin\" />
                    Generating Article {currentItem} of {csvData.length}...
                  </>
                ) : (
                  <>
                    <Zap className=\"w-5 h-5 mr-2\" />
                    Start Batch Generation ({csvData.length} Articles)
                  </>
                )}
              </Button>
              
              {isProcessing && (
                <div className=\"space-y-2\">
                  <div className=\"flex justify-between text-sm text-gray-600\">
                    <span>Progress: {currentItem} of {csvData.length}</span>
                    <span>{Math.round(batchProgress)}%</span>
                  </div>
                  <Progress value={batchProgress} className=\"w-full\" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {batchResults.length > 0 && (
        <Card>
          <CardHeader className=\"flex flex-row items-center justify-between\">
            <CardTitle className=\"flex items-center text-gray-900\">
              <FileText className=\"w-5 h-5 mr-2 text-purple-500\" />
              Batch Results
            </CardTitle>
            <Button onClick={exportResults} variant=\"outline\">
              <Download className=\"w-4 h-4 mr-2\" />
              Export Results
            </Button>
          </CardHeader>
          <CardContent>
            <div className=\"space-y-4\">
              <div className=\"flex items-center space-x-4 text-sm\">
                <Badge className=\"bg-green-100 text-green-800 border-green-200\">
                  <CheckCircle className=\"w-3 h-3 mr-1\" />
                  {batchResults.filter(r => r.status === 'completed').length} Completed
                </Badge>
                {errors.length > 0 && (
                  <Badge className=\"bg-red-100 text-red-800 border-red-200\">
                    <AlertCircle className=\"w-3 h-3 mr-1\" />
                    {errors.length} Failed
                  </Badge>
                )}
              </div>
              
              <div className=\"max-h-96 overflow-y-auto space-y-2\">
                {batchResults.map((result, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${
                    result.status === 'completed' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className=\"flex items-center justify-between\">
                      <div>
                        <h4 className=\"font-medium text-gray-900\">
                          {result.title || result.originalRow.topic}
                        </h4>
                        <p className=\"text-sm text-gray-600\">
                          Keywords: {result.originalRow.keywords}
                        </p>
                      </div>
                      <div className=\"text-right\">
                        {result.status === 'completed' ? (
                          <>
                            <Badge className=\"bg-green-100 text-green-800 border-green-200 mb-1\">
                              <CheckCircle className=\"w-3 h-3 mr-1\" />
                              Completed
                            </Badge>
                            <div className=\"text-xs text-gray-500\">
                              {result.wordCount} words • {result.readingTime}
                            </div>
                          </>
                        ) : (
                          <Badge className=\"bg-red-100 text-red-800 border-red-200\">
                            <AlertCircle className=\"w-3 h-3 mr-1\" />
                            Failed
                          </Badge>
                        )}
                      </div>
                    </div>
                    {result.error && (
                      <p className=\"text-xs text-red-600 mt-2\">{result.error}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Errors Summary */}
      {errors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className=\"flex items-center text-red-700\">
              <AlertCircle className=\"w-5 h-5 mr-2\" />
              Generation Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className=\"space-y-2 max-h-48 overflow-y-auto\">
              {errors.map((error, index) => (
                <Alert key={index} variant=\"destructive\">
                  <AlertCircle className=\"h-4 w-4\" />
                  <AlertDescription className=\"text-sm\">{error}</AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BatchGeneratorComponent;