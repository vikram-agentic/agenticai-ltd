import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Target, 
  FileText, 
  Clock, 
  Star, 
  Gauge, 
  TrendingUp, 
  Eye,
  CheckCircle,
  AlertCircle,
  Lightbulb
} from 'lucide-react';

interface ArticleAnalytics {
  wordCount: number;
  readabilityScore: number;
  seoScore: number;
  keywordDensity: Record<string, number>;
  readingTime: number;
  sentenceCount: number;
  paragraphCount: number;
  headingStructure: Record<string, number>;
}

interface ArticleAnalyticsProps {
  analytics: ArticleAnalytics;
  recommendations?: string[];
  competitorData?: any[];
}

const ArticleAnalyticsComponent: React.FC<ArticleAnalyticsProps> = ({ 
  analytics, 
  recommendations = [],
  competitorData = []
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className=\"space-y-6\">
      {/* Main Metrics */}
      <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6\">
        <Card>
          <CardHeader className=\"pb-2\">
            <CardTitle className=\"text-sm font-medium text-gray-600 flex items-center\">
              <Gauge className=\"w-4 h-4 mr-2\" />
              SEO Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className=\"space-y-2\">
              <div className=\"flex items-center justify-between\">
                <span className={`text-3xl font-bold ${getScoreColor(analytics.seoScore)}`}>
                  {analytics.seoScore}
                </span>
                <Badge className={getScoreBadge(analytics.seoScore)}>
                  {analytics.seoScore >= 80 ? 'Excellent' : 
                   analytics.seoScore >= 60 ? 'Good' : 'Needs Work'}
                </Badge>
              </div>
              <Progress value={analytics.seoScore} className=\"h-2\" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=\"pb-2\">
            <CardTitle className=\"text-sm font-medium text-gray-600 flex items-center\">
              <Star className=\"w-4 h-4 mr-2\" />
              Readability Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className=\"space-y-2\">
              <div className=\"flex items-center justify-between\">
                <span className={`text-3xl font-bold ${getScoreColor(analytics.readabilityScore)}`}>
                  {analytics.readabilityScore}
                </span>
                <Badge className={getScoreBadge(analytics.readabilityScore)}>
                  {analytics.readabilityScore >= 80 ? 'Easy' : 
                   analytics.readabilityScore >= 60 ? 'Moderate' : 'Difficult'}
                </Badge>
              </div>
              <Progress value={analytics.readabilityScore} className=\"h-2\" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=\"pb-2\">
            <CardTitle className=\"text-sm font-medium text-gray-600 flex items-center\">
              <FileText className=\"w-4 h-4 mr-2\" />
              Word Count
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className=\"space-y-2\">
              <span className=\"text-3xl font-bold text-purple-600\">
                {analytics.wordCount.toLocaleString()}
              </span>
              <div className=\"text-sm text-gray-500\">
                {analytics.paragraphCount} paragraphs • {analytics.sentenceCount} sentences
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=\"pb-2\">
            <CardTitle className=\"text-sm font-medium text-gray-600 flex items-center\">
              <Clock className=\"w-4 h-4 mr-2\" />
              Reading Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className=\"space-y-2\">
              <span className=\"text-3xl font-bold text-orange-600\">
                {analytics.readingTime} min
              </span>
              <div className=\"text-sm text-gray-500\">
                Average reading speed
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6\">
        {/* Keyword Density */}
        <Card>
          <CardHeader>
            <CardTitle className=\"flex items-center text-gray-900\">
              <Target className=\"w-5 h-5 mr-2 text-blue-500\" />
              Keyword Density
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className=\"space-y-3\">
              {Object.entries(analytics.keywordDensity).map(([keyword, density]) => (
                <div key={keyword} className=\"space-y-2\">
                  <div className=\"flex justify-between text-sm\">
                    <span className=\"font-medium text-gray-700\">{keyword}</span>
                    <span className={`font-semibold ${
                      density >= 1 && density <= 3 ? 'text-green-600' :
                      density > 3 ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {density}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(density * 20, 100)} 
                    className=\"h-2\"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Heading Structure */}
        <Card>
          <CardHeader>
            <CardTitle className=\"flex items-center text-gray-900\">
              <BarChart3 className=\"w-5 h-5 mr-2 text-green-500\" />
              Heading Structure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className=\"space-y-3\">
              {Object.entries(analytics.headingStructure)
                .filter(([, count]) => count > 0)
                .map(([heading, count]) => (
                <div key={heading} className=\"flex items-center justify-between\">
                  <div className=\"flex items-center\">
                    <Badge variant=\"outline\" className=\"mr-2 text-xs\">
                      {heading.toUpperCase()}
                    </Badge>
                    <span className=\"text-sm text-gray-600\">
                      {heading === 'h1' ? 'Main Title' :
                       heading === 'h2' ? 'Sections' :
                       heading === 'h3' ? 'Subsections' :
                       'Minor Headings'}
                    </span>
                  </div>
                  <span className=\"font-semibold text-gray-900\">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className=\"flex items-center text-gray-900\">
              <Lightbulb className=\"w-5 h-5 mr-2 text-yellow-500\" />
              Optimization Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className=\"space-y-3\">
              {recommendations.map((recommendation, index) => (
                <div key={index} className=\"flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200\">
                  <AlertCircle className=\"w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5\" />
                  <span className=\"text-sm text-yellow-800\">{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Competitor Comparison */}
      {competitorData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className=\"flex items-center text-gray-900\">
              <TrendingUp className=\"w-5 h-5 mr-2 text-purple-500\" />
              Competitor Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className=\"space-y-4\">
              <div className=\"grid grid-cols-1 md:grid-cols-3 gap-4\">
                <div className=\"text-center p-4 bg-green-50 rounded-lg border border-green-200\">
                  <div className=\"text-2xl font-bold text-green-600\">
                    {analytics.wordCount}
                  </div>
                  <div className=\"text-sm text-green-700\">Your Article</div>
                </div>
                <div className=\"text-center p-4 bg-gray-50 rounded-lg border border-gray-200\">
                  <div className=\"text-2xl font-bold text-gray-600\">
                    {Math.round(competitorData.reduce((sum, c) => sum + c.contentLength, 0) / competitorData.length)}
                  </div>
                  <div className=\"text-sm text-gray-700\">Competitor Avg</div>
                </div>
                <div className=\"text-center p-4 bg-blue-50 rounded-lg border border-blue-200\">
                  <div className=\"text-2xl font-bold text-blue-600\">
                    +{analytics.wordCount - Math.round(competitorData.reduce((sum, c) => sum + c.contentLength, 0) / competitorData.length)}
                  </div>
                  <div className=\"text-sm text-blue-700\">Word Advantage</div>
                </div>
              </div>
              
              <div className=\"text-sm text-gray-600\">
                Your content is {analytics.wordCount > Math.round(competitorData.reduce((sum, c) => sum + c.contentLength, 0) / competitorData.length) ? 'more comprehensive' : 'more concise'} than competitor average.
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ArticleAnalyticsComponent;