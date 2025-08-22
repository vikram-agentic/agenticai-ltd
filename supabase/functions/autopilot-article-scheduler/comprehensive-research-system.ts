// 🚀 COMPREHENSIVE AI RESEARCH & CONTENT GENERATION SYSTEM
// FULL WEBSITE ANALYSIS + SERP RESEARCH + COMPETITOR ANALYSIS + RANK #1 CONTENT

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface WebsiteAnalysis {
  url: string;
  title: string;
  description: string;
  keywords: string[];
  content: string;
  structure: any;
  competitors: string[];
}

interface ResearchReport {
  websiteAnalysis: WebsiteAnalysis;
  keywordResearch: any[];
  serpAnalysis: any[];
  competitorAnalysis: any[];
  contentStrategy: any;
  targetKeywords: string[];
}

interface ContentStrategy {
  primaryKeywords: string[];
  secondaryKeywords: string[];
  contentStructure: any[];
  targetAudience: string;
  contentTone: string;
  seoStrategy: any;
}

interface GeneratedArticle {
  title: string;
  content: string;
  metaDescription: string;
  keywords: string[];
  featureImage: string;
  contentImages: string[];
  seoScore: number;
  wordCount: number;
  readingTime: number;
}

class ComprehensiveResearchSystem {
  private supabase: any;
  private dataforSeoApiKey: string;
  private perplexityApiKey: string;
  private minimaxApiKey: string;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.dataforSeoApiKey = Deno.env.get('DATAFORSEO_API_PASSWORD') || '';
    this.perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY') || '';
    this.minimaxApiKey = Deno.env.get('MINIMAX_API_KEY') || '';
  }

  // 🔍 PHASE 1: COMPREHENSIVE WEBSITE ANALYSIS
  async analyzeWebsite(url: string): Promise<WebsiteAnalysis> {
    console.log(`🔍 Analyzing website: ${url}`);
    
    // Use Perplexity for deep website analysis
    const analysisPrompt = `Analyze this website thoroughly: ${url}
    
    Provide comprehensive analysis including:
    1. Website title and main purpose
    2. Target audience and market positioning
    3. Main topics and content themes
    4. Key competitors in the space
    5. Content structure and navigation
    6. SEO strengths and weaknesses
    7. Content gaps and opportunities
    
    Return structured analysis data.`;
    
    const analysis = await this.callPerplexity(analysisPrompt, 'sonar-deep-research');
    
    return {
      url,
      title: analysis.title || 'Website Analysis',
      description: analysis.description || '',
      keywords: analysis.keywords || [],
      content: analysis.content || '',
      structure: analysis.structure || {},
      competitors: analysis.competitors || []
    };
  }

  // 📊 PHASE 2: COMPREHENSIVE KEYWORD RESEARCH
  async performKeywordResearch(websiteAnalysis: WebsiteAnalysis): Promise<any[]> {
    console.log('📊 Performing comprehensive keyword research...');
    
    const keywords = [];
    
    // Research primary keywords from website analysis
    for (const keyword of websiteAnalysis.keywords.slice(0, 5)) {
      const keywordData = await this.researchKeywordWithDataForSEO(keyword);
      keywords.push(...keywordData);
    }
    
    // Research competitor keywords
    for (const competitor of websiteAnalysis.competitors.slice(0, 3)) {
      const competitorKeywords = await this.researchCompetitorKeywords(competitor);
      keywords.push(...competitorKeywords);
    }
    
    return this.analyzeAndFilterKeywords(keywords);
  }

  // 🔍 PHASE 3: SERP ANALYSIS
  async performSerpAnalysis(targetKeywords: string[]): Promise<any[]> {
    console.log('🔍 Performing SERP analysis...');
    
    const serpResults = [];
    
    for (const keyword of targetKeywords.slice(0, 10)) {
      const serpData = await this.analyzeSerpForKeyword(keyword);
      serpResults.push(serpData);
    }
    
    return serpResults;
  }

  // 🏆 PHASE 4: COMPETITOR ANALYSIS
  async performCompetitorAnalysis(competitors: string[]): Promise<any[]> {
    console.log('🏆 Performing competitor analysis...');
    
    const competitorReports = [];
    
    for (const competitor of competitors.slice(0, 5)) {
      const competitorReport = await this.analyzeCompetitor(competitor);
      competitorReports.push(competitorReport);
    }
    
    return competitorReports;
  }

  // 🎯 PHASE 5: CONTENT STRATEGY GENERATION
  async generateContentStrategy(researchReport: ResearchReport): Promise<ContentStrategy> {
    console.log('🎯 Generating content strategy...');
    
    const strategyPrompt = `Based on this comprehensive research, create a content strategy:
    
    RESEARCH DATA:
    ${JSON.stringify(researchReport, null, 2)}
    
    Generate:
    1. Primary target keywords (3-5)
    2. Secondary keywords (10-15)
    3. Content structure and outline
    4. Target audience definition
    5. Content tone and style
    6. SEO strategy for ranking #1
    
    Focus on creating content that will outrank competitors.`;
    
    const strategy = await this.callMinimax(strategyPrompt);
    
    return {
      primaryKeywords: strategy.primaryKeywords || [],
      secondaryKeywords: strategy.secondaryKeywords || [],
      contentStructure: strategy.contentStructure || [],
      targetAudience: strategy.targetAudience || '',
      contentTone: strategy.contentTone || '',
      seoStrategy: strategy.seoStrategy || {}
    };
  }

  // ✍️ PHASE 6: RANK #1 ARTICLE GENERATION
  async generateRankOneArticle(
    keyword: string, 
    researchReport: ResearchReport, 
    contentStrategy: ContentStrategy
  ): Promise<GeneratedArticle> {
    console.log(`✍️ Generating Rank #1 article for: ${keyword}`);
    
    // Generate article content
    const articlePrompt = `Create a COMPREHENSIVE, AUTHORITATIVE article about "${keyword}" that will rank #1 on Google.

    RESEARCH DATA:
    ${JSON.stringify(researchReport, null, 2)}
    
    CONTENT STRATEGY:
    ${JSON.stringify(contentStrategy, null, 2)}
    
    REQUIREMENTS:
    - Minimum 4000 words
    - Professional, authoritative tone
    - Use research data and statistics
    - Include actionable insights
    - Optimize for search engines naturally
    - Structure with clear headings
    - Include real examples and case studies
    
    FORMAT: Complete article in markdown with proper structure.`;
    
    const articleContent = await this.callMinimax(articlePrompt);
    
    // Generate feature image
    const featureImagePrompt = `Create a compelling feature image for an article about "${keyword}". 
    The image should be professional, modern, and represent the topic clearly.`;
    
    const featureImage = await this.generateImageWithMinimax(featureImagePrompt);
    
    // Generate content images
    const contentImages = await this.generateContentImages(articleContent, keyword);
    
    return {
      title: this.extractTitleFromContent(articleContent),
      content: articleContent,
      metaDescription: this.generateMetaDescription(articleContent),
      keywords: this.extractKeywordsFromContent(articleContent),
      featureImage,
      contentImages,
      seoScore: this.calculateSeoScore(articleContent),
      wordCount: this.calculateWordCount(articleContent),
      readingTime: this.calculateReadingTime(articleContent)
    };
  }

  // 🖼️ PHASE 7: IMAGE GENERATION
  async generateImageWithMinimax(prompt: string): Promise<string> {
    console.log('🖼️ Generating image with Minimax...');
    
    // Use Minimax image generation API
    const response = await fetch('https://api.minimax.io/v1/text/image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.minimaxApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "MiniMax-V1",
        prompt: prompt,
        width: 1200,
        height: 630,
        quality: "high"
      })
    });
    
    if (!response.ok) {
      throw new Error(`Image generation failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.image_url || '';
  }

  // 🔧 HELPER METHODS
  private async callPerplexity(prompt: string, model: string = 'sonar-deep-research'): Promise<any> {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.perplexityApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 4000,
        stream: false
      })
    });
    
    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  }

  private async callMinimax(prompt: string): Promise<any> {
    const response = await fetch('https://api.minimax.io/v1/text/chatcompletion_v2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.minimaxApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "MiniMax-M1",
        messages: [
          {
            role: "system",
            name: "MiniMax AI",
            content: "You are a world-class content strategist and SEO expert."
          },
          {
            role: "user",
            name: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 40000,
        stream: false
      })
    });
    
    if (!response.ok) {
      throw new Error(`Minimax API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  }

  // Main execution method
  async executeComprehensiveResearch(url: string): Promise<ResearchReport> {
    console.log('🚀 Starting comprehensive research system...');
    
    // Phase 1: Website Analysis
    const websiteAnalysis = await this.analyzeWebsite(url);
    
    // Phase 2: Keyword Research
    const keywordResearch = await this.performKeywordResearch(websiteAnalysis);
    
    // Phase 3: SERP Analysis
    const serpAnalysis = await this.performSerpAnalysis(keywordResearch.map(k => k.keyword));
    
    // Phase 4: Competitor Analysis
    const competitorAnalysis = await this.performCompetitorAnalysis(websiteAnalysis.competitors);
    
    // Phase 5: Content Strategy
    const contentStrategy = await this.generateContentStrategy({
      websiteAnalysis,
      keywordResearch,
      serpAnalysis,
      competitorAnalysis,
      contentStrategy: null,
      targetKeywords: keywordResearch.map(k => k.keyword)
    });
    
    return {
      websiteAnalysis,
      keywordResearch,
      serpAnalysis,
      competitorAnalysis,
      contentStrategy,
      targetKeywords: keywordResearch.map(k => k.keyword)
    };
  }

  // 🔧 ADDITIONAL HELPER METHODS
  private async researchKeywordWithDataForSEO(keyword: string): Promise<any[]> {
    console.log(`🔍 Researching keyword: ${keyword}`);
    
    try {
      const credentials = `vikram@agentic-ai.ltd:${this.dataforSeoApiKey}`;
      const encodedCredentials = btoa(credentials);
      
      const response = await fetch('https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${encodedCredentials}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
          search_partners: true,
          keywords: [keyword],
          location_code: 2840,
          language_code: "en",
          sort_by: "competition_index",
          include_adult_keywords: true
        }])
      });
      
      if (!response.ok) {
        throw new Error(`DataForSEO API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.tasks?.[0]?.result || [];
    } catch (error) {
      console.error(`❌ Keyword research failed for ${keyword}:`, error);
      return [];
    }
  }

  private async researchCompetitorKeywords(competitor: string): Promise<any[]> {
    console.log(`🏆 Researching competitor: ${competitor}`);
    
    try {
      const prompt = `Analyze this competitor website: ${competitor}
      
      Identify their main target keywords and content themes.
      Return a list of 10-15 relevant keywords they're targeting.`;
      
      const response = await this.callPerplexity(prompt, 'sonar-deep-research');
      return response.keywords || [];
    } catch (error) {
      console.error(`❌ Competitor keyword research failed for ${competitor}:`, error);
      return [];
    }
  }

  private analyzeAndFilterKeywords(keywords: any[]): any[] {
    console.log('🔍 Analyzing and filtering keywords...');
    
    // Filter out duplicates and low-quality keywords
    const uniqueKeywords = [...new Set(keywords)];
    
    // Sort by relevance and search volume
    return uniqueKeywords
      .filter(k => k && typeof k === 'string')
      .slice(0, 20); // Limit to top 20 keywords
  }

  private async analyzeSerpForKeyword(keyword: string): Promise<any> {
    console.log(`🔍 Analyzing SERP for: ${keyword}`);
    
    try {
      const prompt = `Analyze the search engine results page (SERP) for "${keyword}".
      
      Research:
      1. Top 10 ranking pages
      2. Content types and formats
      3. Common themes and topics
      4. Content gaps and opportunities
      5. What makes top results successful
      
      Return structured analysis data.`;
      
      const analysis = await this.callPerplexity(prompt, 'sonar-deep-research');
      return {
        keyword,
        analysis,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`❌ SERP analysis failed for ${keyword}:`, error);
      return { keyword, analysis: null, error: error.message };
    }
  }

  private async analyzeCompetitor(competitor: string): Promise<any> {
    console.log(`🏆 Analyzing competitor: ${competitor}`);
    
    try {
      const prompt = `Perform comprehensive competitor analysis for: ${competitor}
      
      Analyze:
      1. Business model and positioning
      2. Content strategy and themes
      3. SEO strengths and weaknesses
      4. Target audience
      5. Content gaps and opportunities
      6. Competitive advantages
      
      Return structured competitor analysis.`;
      
      const analysis = await this.callPerplexity(prompt, 'sonar-deep-research');
      return {
        competitor,
        analysis,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`❌ Competitor analysis failed for ${competitor}:`, error);
      return { competitor, analysis: null, error: error.message };
    }
  }

  private async generateContentImages(content: string, keyword: string): Promise<string[]> {
    console.log('🖼️ Generating content images...');
    
    const images = [];
    
    try {
      // Generate 3-5 content images based on article sections
      const sections = content.split('\n\n').filter(s => s.trim().length > 50).slice(0, 5);
      
      for (const section of sections) {
        const imagePrompt = `Create a relevant image for this content section about "${keyword}":
        
        ${section.substring(0, 200)}...
        
        The image should be professional, modern, and illustrate the content clearly.`;
        
        const imageUrl = await this.generateImageWithMinimax(imagePrompt);
        if (imageUrl) {
          images.push(imageUrl);
        }
      }
    } catch (error) {
      console.error('❌ Content image generation failed:', error);
    }
    
    return images;
  }

  private extractTitleFromContent(content: string): string {
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.startsWith('# ') && line.length > 3) {
        return line.substring(2).trim();
      }
    }
    return 'Generated Article';
  }

  private generateMetaDescription(content: string): string {
    const cleanContent = content.replace(/[#*`]/g, '').replace(/\n/g, ' ');
    return cleanContent.substring(0, 160) + (cleanContent.length > 160 ? '...' : '');
  }

  private extractKeywordsFromContent(content: string): string[] {
    // Simple keyword extraction - in production, use more sophisticated NLP
    const words = content.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const wordCount = {};
    
    words.forEach(word => {
      if (wordCount[word]) wordCount[word]++;
      else wordCount[word] = 1;
    });
    
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  private calculateSeoScore(content: string): number {
    // Basic SEO scoring - in production, use more sophisticated analysis
    let score = 0;
    
    if (content.length > 4000) score += 25;
    if (content.includes('## ')) score += 20;
    if (content.includes('### ')) score += 15;
    if (content.includes('**')) score += 10;
    if (content.includes('- ')) score += 10;
    if (content.includes('[')) score += 10;
    if (content.includes('![')) score += 10;
    
    return Math.min(score, 100);
  }

  private calculateWordCount(content: string): number {
    return content.split(/\s+/).filter(word => word.length > 0).length;
  }

  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = this.calculateWordCount(content);
    return Math.ceil(wordCount / wordsPerMinute);
  }
}

export { ComprehensiveResearchSystem };
