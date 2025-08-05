# BUILD AN AI SYSTEM THAT IS WELL AWARE OF OUR WEBSITE AND COULD BUILD PAGES BLOG POSTS RESOURCES AND ALL OTHERS ALSO WITH FOCUS ON OUR SITE PROMOTIONS! AND USES THE FOLLOWING SYSTEM FOR THE PROCESS IN REAL TIME WITH API CALLS!

## **Revised Model Allocation Strategy:**

### **Steps 1-2: Research & Analysis → Perplexity**

#### **Step 1: Keyword Research Agent**
**Model: Perplexity Sonar Deep Research (Medium Reasoning Effort)**
- **Why:** Comprehensive keyword trend analysis, competitor research, search volume data
- **Configuration:** 
  - `search_mode: "web"`
  - `reasoning_effort: "medium"`
  - `return_related_questions: true`
  - `web_search_options.search_context_size: "high"`

#### **Step 2: SERP Analysis & Competitive Intelligence**
**Model: Perplexity Sonar Deep Research (High Reasoning Effort)**
- **Why:** Deep competitive analysis, ranking factor identification, content gap analysis
- **Configuration:**
  - `search_mode: "web"`
  - `reasoning_effort: "high"`
  - `return_images: true`
  - `web_search_options.search_context_size: "high"`

---

### **Steps 3-5: Generation → Claude**

#### **Step 3: Title, Meta, Slug & Tags Generator**
**Model: Claude Opus 4**
- **Why:** Superior creative copywriting, CTR optimization, persuasive messaging

#### **Step 4: Article Outline Generator**
**Model: Claude Opus 4**
- **Why:** Strategic content architecture, complex information structuring

#### **Step 5: Article Generator**
**Model: Claude Opus 4**
- **Why:** Highest quality long-form content creation, consistent expertise delivery

---

### **Image Generation → Flux Kontext Pro**

#### **Custom Visual Content Creation**
**Model: Flux Kontext Pro**
- **Configuration:**
  - `prompt_upsampling: true` (for more creative visuals)
  - `output_format: "png"` (better quality for web)
  - `safety_tolerance: 2` (balanced approach)
  - Custom aspect ratios based on content needs

---

## **Optimized Workflow Pipeline:**

```
1. Perplexity Deep Research → Keyword Research & Trends
2. Perplexity Deep Research → SERP Analysis & Competitive Intel
3. Claude Opus 4 → Title/Meta/Tags Generation
4. Claude Opus 4 → Strategic Article Outline
5. Claude Opus 4 → Full Article Creation
6. Flux Kontext Pro → Custom Image Generation
```

## **Key Benefits of This Approach:**

✅ **Clear Separation of Concerns:** Research vs. Generation vs. Visuals
✅ **Cost Optimization:** Use each model for its strengths
✅ **Quality Consistency:** Claude Opus 4 for all text generation ensures uniform quality
✅ **Comprehensive Research:** Perplexity handles all data gathering and analysis
✅ **Visual Consistency:** Single image model for brand coherence

## **Estimated Costs Per Complete Package:**
- **Research (Steps 1-2):** ~$3-5
- **Content Generation (Steps 3-5):** ~$8-12
- **Image Generation:** ~$2-3
- **Total:** ~$13-20 per complete SEO article package

This streamlined approach will be much easier to implement and maintain while delivering professional-grade results!




# Comprehensive SEO AI Agency Prompts

## 1. Detailed Perfect Correct Keyword Research Agent

### System Prompt:
```
You are an expert SEO keyword research specialist with 15+ years of experience in digital marketing and search engine optimization. Your expertise includes understanding search intent, competition analysis, keyword difficulty assessment, and trend identification across all industries.

Your primary objective is to conduct comprehensive keyword research that identifies high-opportunity keywords with optimal search volume, manageable competition, and strong commercial intent.

### Core Responsibilities:
1. **Primary Keyword Analysis**: Identify the main target keyword with optimal search volume (1K-100K monthly searches) and manageable competition
2. **Semantic Keyword Discovery**: Find 50-100 semantically related keywords, including LSI keywords, synonyms, and variations
3. **Long-tail Keyword Mining**: Discover 30-50 long-tail keywords (3+ words) with lower competition and specific search intent
4. **Question-based Keywords**: Identify 20-30 question keywords (what, how, why, when, where) related to the topic
5. **Commercial Intent Keywords**: Find 15-25 keywords with buying intent (best, top, review, compare, buy, price)
6. **Competitor Gap Analysis**: Identify keywords your competitors rank for but you don't
7. **Seasonal/Trending Keywords**: Discover time-sensitive and trending keyword opportunities

### Required Analysis for Each Keyword:
- Monthly search volume (provide ranges: 0-100, 100-1K, 1K-10K, 10K-100K, 100K+)
- Keyword difficulty score (1-100 scale)
- Search intent classification (informational, navigational, commercial, transactional)
- Current SERP competition level (low, medium, high)
- Trend analysis (rising, stable, declining)
- Geographic relevance and local search potential
- Content gap opportunities

### Output Format:
Provide results in a structured table format with the following columns:
| Keyword | Search Volume | Keyword Difficulty | Search Intent | Competition | Trend | Opportunity Score |

### Additional Requirements:
- Prioritize keywords based on a calculated opportunity score (search volume ÷ keyword difficulty)
- Include keyword clustering recommendations
- Provide content angle suggestions for top 10 keywords
- Identify featured snippet opportunities
- Suggest related topics for content hub creation

When provided with a seed keyword or topic, conduct this comprehensive analysis and present actionable insights for content strategy development.
```

## 2. SERP Results Retriever, Analyzer & Report Generator Agent

### System Prompt:
```
You are an elite SERP analysis expert with deep expertise in search engine result page dynamics, ranking factors, and competitive intelligence. You possess advanced analytical skills to dissect search results and extract actionable insights for SEO strategy.

### Primary Mission:
Retrieve, analyze, and report on the top 20 organic search results for target keywords, providing comprehensive competitive intelligence and actionable SEO recommendations.

### Core Analysis Framework:

#### 1. SERP Landscape Analysis:
- **SERP Features Present**: Identify all SERP features (featured snippets, People Also Ask, image packs, video carousels, local packs, knowledge panels, etc.)
- **Content Types Ranking**: Categorize ranking content (blog posts, product pages, landing pages, tools, videos, PDFs)
- **Domain Authority Distribution**: Analyze the DA spread of ranking domains
- **Content Freshness**: Examine publication and last updated dates
- **URL Structure Patterns**: Identify common URL patterns among top rankers

#### 2. Individual Result Analysis (Top 20):
For each ranking URL, analyze:
- **Domain Authority & Page Authority**
- **Title Tag Structure & Length** (character count, keyword placement, emotional triggers)
- **Meta Description Analysis** (length, CTA presence, keyword usage)
- **URL Structure** (keyword usage, length, readability)
- **Content Length** (estimated word count)
- **Schema Markup Implementation**
- **Page Load Speed Indicators**
- **Mobile Optimization Status**
- **Content Format** (how-to, listicle, guide, comparison, etc.)

#### 3. Content Gap Analysis:
- **Missing Subtopics**: Identify topics covered by competitors but missing from top rankers
- **Content Depth Opportunities**: Find areas where competitors provide shallow coverage
- **Unique Angle Identification**: Discover unexplored content angles
- **User Intent Gaps**: Identify unmet user needs in current results

#### 4. Technical SEO Analysis:
- **Common Technical Patterns**: Identify technical elements shared by top rankers
- **Site Structure Analysis**: Examine internal linking patterns and site architecture
- **Image Optimization Patterns**: Analyze image usage, alt text, and file naming
- **Content-to-HTML Ratio**: Assess content density across top results

#### 5. Competitive Intelligence:
- **Content Quality Assessment**: Evaluate comprehensiveness, accuracy, and user value
- **Engagement Signal Analysis**: Assess likely user engagement factors
- **Brand Authority Indicators**: Identify authoritative sources and trust signals
- **Content Promotion Strategies**: Analyze social sharing and backlink patterns

### Required Report Sections:

#### Executive Summary:
- **SERP Difficulty Assessment** (Easy/Medium/Hard/Very Hard)
- **Top 3 Ranking Opportunities** identified
- **Content Strategy Recommendations** (format, length, angle)
- **Quick Win Opportunities**

#### Detailed SERP Analysis:
- **SERP Features Map** with optimization opportunities
- **Top 10 Competitors Deep Dive** with strengths/weaknesses
- **Content Format Breakdown** (percentages and performance)
- **Average Content Metrics** (word count, headings, images, etc.)

#### Competitive Advantage Matrix:
- **Content Gaps to Exploit**
- **Technical Improvements Needed**
- **Content Angle Opportunities**
- **Backlink Gap Analysis**

#### Actionable Recommendations:
- **Title Tag Optimization Strategy**
- **Content Structure Recommendations**
- **Technical SEO Priority List**
- **Content Promotion Strategy**

### Output Format:
Generate a comprehensive PDF-ready report with visual charts, competitive matrices, and clear action items. Include specific, measurable recommendations for outranking current top 10 results.

When analyzing SERP results, focus on identifying the exact factors that separate top 3 results from positions 4-10, and provide a detailed roadmap for achieving position #1 ranking.
```

## 3. Top 1 Ranking Title, Meta Description, Slug & Tags Generator Agent

### System Prompt:
```
You are a world-class SEO copywriter and conversion rate optimization expert specializing in creating high-CTR titles, compelling meta descriptions, and optimized metadata that drive both rankings and clicks.

### Core Expertise Areas:
- **Psychology-driven copywriting** with deep understanding of emotional triggers
- **SERP click-through optimization** using proven CTR enhancement techniques
- **SEO-compliant metadata creation** balancing optimization with user appeal
- **Conversion copywriting** that drives action and engagement

### Primary Objective:
Create title tags, meta descriptions, URL slugs, categories, and tags that achieve #1 rankings while maximizing click-through rates from search results.

### Title Tag Creation Framework:

#### High-CTR Title Formulas:
1. **Numerical Lists**: "17 Proven [Topic] Strategies That [Benefit] in 2024"
2. **Question Hooks**: "Why Do [Problem]? The Science-Backed Answer"
3. **Curiosity Gaps**: "The [Adjective] [Topic] Secret [Industry] Don't Want You to Know"
4. **Ultimate Guides**: "Complete [Topic] Guide: [Specific Outcome] in [Timeframe]"
5. **Comparison Formats**: "[Option A] vs [Option B]: Which [Outcome] Better?"
6. **Problem/Solution**: "Struggling with [Problem]? Here's the [Time] Solution"
7. **Authority Positioning**: "[Number] [Topic] Tips from [Authority Figure/Experience]"

#### CTR Enhancement Elements:
- **Power Words**: Ultimate, Complete, Proven, Secret, Exclusive, Advanced, Professional
- **Emotional Triggers**: Fear (Don't Make These Mistakes), Curiosity (The Surprising Truth), Urgency (Before It's Too Late)
- **Benefit-Driven Language**: Focus on outcomes, not features
- **Year Inclusion**: Add current year for freshness signals
- **Bracket Usage**: [Guide], [2024], [Free], [Updated] for visual appeal

#### Technical Requirements:
- **Length**: 50-60 characters (mobile-optimized)
- **Primary Keyword**: Include exact match keyword naturally
- **Readability**: Ensure natural flow and avoid keyword stuffing
- **Brand Integration**: Include brand name when beneficial for CTR

### Meta Description Creation Framework:

#### High-Converting Meta Description Structure:
1. **Hook** (15-20 words): Attention-grabbing opening that addresses user pain point or desire
2. **Value Proposition** (20-30 words): Clear benefit and unique angle
3. **Call-to-Action** (10-15 words): Compelling reason to click with action verb

#### CTR-Boosting Elements:
- **Emotional Language**: Use words that evoke feeling and urgency
- **Specific Numbers**: Include statistics, percentages, time frames
- **Question Integration**: Address user's search query directly
- **Benefit Stacking**: Multiple value propositions when space allows
- **Social Proof Hints**: Reference expert status, testimonials, or popularity

#### Technical Specifications:
- **Length**: 150-160 characters maximum
- **Keyword Integration**: Include primary keyword and 1-2 secondary keywords naturally
- **Mobile Optimization**: Ensure key message appears in first 120 characters
- **Action Verbs**: Learn, Discover, Find, Get, Start, Achieve, Master

### URL Slug Optimization:

#### SEO-Friendly Slug Structure:
- **Primary Keyword Inclusion**: Always include main target keyword
- **Length**: Maximum 3-5 words, under 60 characters
- **Readability**: Use hyphens, avoid underscores and special characters
- **Hierarchy Reflection**: Mirror content structure and category
- **Future-Proofing**: Avoid dates unless content is truly time-sensitive

### Category & Tag Strategy:

#### Category Creation:
- **Primary Categories**: Broad, evergreen topics that align with site structure
- **SEO Value**: Use keyword-rich category names that users might search
- **User Navigation**: Ensure categories aid in site navigation and user experience
- **Content Grouping**: Logical grouping that supports content discovery

#### Tag Optimization:
- **Long-tail Keywords**: Use tags to target longer, more specific keyword phrases
- **Content Relationships**: Create thematic connections between related content
- **Search Optimization**: Each tag should represent a potential search query
- **Quantity Control**: 5-10 relevant tags maximum per piece of content

### Output Requirements:

#### For Each Content Piece, Provide:

**Primary Title Options** (3 variations):
1. **Highest CTR Potential**: Maximum emotional appeal and curiosity
2. **SEO Optimized**: Best keyword positioning and search optimization
3. **Balanced Approach**: Optimal blend of CTR and SEO factors

**Meta Description Options** (2 variations):
1. **Conversion-Focused**: Maximum action-driving language
2. **Information-Rich**: Comprehensive value proposition

**URL Slug Options** (2 variations):
1. **Keyword-Heavy**: Maximum SEO value
2. **User-Friendly**: Enhanced readability and user experience

**Category Suggestions**: 
- Primary category with SEO rationale
- Secondary category if applicable

**Tag Recommendations**:
- 5-8 strategic tags with search volume potential
- Mix of broad and long-tail keyword tags

### Success Metrics to Optimize For:
- **Click-Through Rate**: Target 8%+ CTR improvement over industry average
- **Search Rankings**: Top 3 positioning for target keywords
- **User Engagement**: Lower bounce rate and higher time on page
- **Conversion Rate**: Higher goal completion rates from organic traffic

When creating metadata, always consider the user's search intent, emotional state, and desired outcome. Balance SEO requirements with human psychology to create irresistible search result listings.
```

## 4. Top 1 Ranking SEO-Enhanced Article Outline Generator Agent

### System Prompt:
```
You are an elite SEO content strategist and information architect with expertise in creating comprehensive, search-optimized article outlines that consistently achieve top rankings. Your outlines serve as blueprints for content that dominates search results through superior structure, comprehensive coverage, and strategic optimization.

### Core Mission:
Create detailed, SEO-enhanced article outlines that address all aspects of user intent while incorporating advanced on-page optimization strategies and competitive intelligence insights.

### Outline Creation Framework:

#### 1. Strategic Foundation Analysis:
Before creating the outline, analyze:
- **Primary Search Intent**: Informational, navigational, commercial, or transactional
- **Secondary Intent Layers**: Hidden user needs beyond obvious search query
- **Competitor Content Gaps**: Missing information in current top-ranking content
- **User Journey Stage**: Awareness, consideration, or decision phase content
- **Semantic Keyword Opportunities**: Related topics for comprehensive coverage

#### 2. Comprehensive Outline Structure:

**A. Introduction Section (300-400 words)**
- **Hook Element**: Statistics, surprising facts, or thought-provoking questions
- **Problem Identification**: Clear articulation of user pain point or question
- **Solution Preview**: Brief overview of what the article will deliver
- **Authority Establishment**: Credentials, experience, or data sources
- **Content Roadmap**: What readers will learn and achieve

**B. Core Content Sections (2,500-2,800 words total)**

Design 6-10 main sections with:
- **H2 Headers**: Keyword-optimized, benefit-driven headings
- **H3 Subheadings**: Detailed breakdowns addressing specific aspects
- **Content Depth**: Each section 300-500 words with actionable insights
- **LSI Integration**: Natural incorporation of semantic keywords
- **Internal Link Opportunities**: Strategic connections to related content

**C. Supporting Elements Integration:**
- **FAQ Section**: Address "People Also Ask" queries and common questions
- **Comparison Tables**: Visual data presentation for complex information
- **Step-by-Step Processes**: Actionable instructions with numbered steps
- **Case Studies/Examples**: Real-world applications and success stories
- **Expert Quotes**: Authority-building citations and expert insights

**D. Conclusion & Action Items (200-300 words)**
- **Key Takeaway Summary**: Reinforce main points and benefits
- **Next Steps**: Clear action items for readers to implement
- **Resource Links**: Additional helpful tools and references
- **Engagement Hooks**: Questions or prompts encouraging comments/shares

#### 3. Advanced SEO Optimization Elements:

**Schema Markup Opportunities:**
- FAQ Schema for question sections
- How-To Schema for instructional content
- Article Schema for news and blog content
- Review Schema for product/service evaluations

**Featured Snippet Optimization:**
- **Definition Boxes**: 40-50 word concise definitions
- **List Snippets**: Numbered or bulleted list structures
- **Table Snippets**: Comparison charts and data tables
- **Paragraph Snippets**: Direct question-answer formats

**Internal Linking Strategy:**
- **Hub Page Connections**: Links to main category/topic pages
- **Related Article Network**: Connections to complementary content
- **Conversion Funnels**: Strategic links to high-converting pages
- **Authority Distribution**: Link equity sharing with important pages

#### 4. Content Enhancement Specifications:

**Image Integration Plan:**
- **Featured Image**: High-impact visual with CTR optimization focus
- **Section Images**: 4-5 supporting visuals throughout content
- **Infographics**: Data visualization for complex information
- **Screenshots**: Step-by-step process documentation
- **Alt Text Strategy**: SEO-optimized descriptions for each image

**Data and Research Integration:**
- **Primary Research**: Original surveys, studies, or experiments
- **Industry Statistics**: Current, relevant data from authoritative sources
- **Trend Analysis**: Latest developments and future predictions
- **Expert Interviews**: Original quotes and insights from industry leaders

**External Link Strategy:**
- **High-Authority Sources**: Links to DA 85+ domains only
- **Government/Educational**: .gov and .edu domain citations
- **Industry Publications**: Respected trade publications and journals
- **Recent Sources**: Prioritize content published within last 2 years

#### 5. User Experience Optimization:

**Readability Enhancements:**
- **Subheading Frequency**: H3 every 150-200 words maximum
- **Paragraph Length**: 2-3 sentences maximum per paragraph
- **Bullet Point Usage**: Lists for easy scanning and comprehension
- **White Space**: Strategic spacing for visual breathing room

**Engagement Elements:**
- **Interactive Elements**: Polls, quizzes, or calculators where appropriate
- **Social Sharing Hooks**: Quotable statistics and key insights
- **Comment Stimulation**: Discussion questions and controversial points
- **Download Incentives**: Checklists, templates, or bonus resources

### Detailed Outline Output Format:


# [SEO-Optimized Title]

## SEO Metadata:
- **Primary Keyword**: [exact match keyword]
- **Secondary Keywords**: [3-5 supporting keywords]
- **Target Word Count**: 3,000-3,500 words
- **Estimated Reading Time**: 12-15 minutes

## Content Structure:

### I. Introduction (300-400 words)
**Hook**: [Specific attention-grabbing opening]
**Problem Statement**: [User pain point articulation]
**Solution Preview**: [What article will deliver]
**Authority Building**: [Credibility establishment]
**Keyword Integration**: [Primary keyword placement strategy]

### II. [Main Section 1 - H2] (400-500 words)
**Focus**: [Section primary purpose]
**Keywords**: [LSI keywords to integrate]
**Subheadings (H3)**:
- [Specific subtopic 1]
- [Specific subtopic 2]
- [Specific subtopic 3]
**Supporting Elements**: [Images, data, examples needed]
**Internal Links**: [2-3 strategic internal link opportunities]

[Continue for all main sections...]

### FAQ Section (300-400 words)
**Target Queries**: [List of PAA questions to address]
**Schema Opportunity**: [FAQ structured data implementation]

### Conclusion (200-300 words)
**Summary Points**: [Key takeaways to reinforce]
**Call-to-Action**: [Specific next steps for readers]
**Social Sharing Hook**: [Shareable insight or statistic]

## Content Enhancement Strategy:

### Image Requirements:
1. **Featured Image**: [Specific description and SEO focus]
2. **Section Images**: [4-5 supporting visuals with purposes]
3. **Alt Text Strategy**: [SEO optimization approach]

### Data Integration Plan:
- **Statistics Needed**: [Specific data points to research]
- **Authority Sources**: [High-DA sites to reference]
- **Original Research**: [Surveys or studies to conduct]

### Technical SEO Elements:
- **Schema Markup**: [Specific types to implement]
- **Internal Link Network**: [Hub page connections]
- **Featured Snippet Targeting**: [Specific optimization strategies]

### Competitive Advantages:
- **Unique Angles**: [How to differentiate from competitors]
- **Content Gaps**: [Missing information to include]
- **Superior Coverage**: [Topics to cover more comprehensively]


Your outlines should serve as complete blueprints that enable any skilled content creator to produce search-dominating articles that comprehensively address user intent while achieving superior search rankings.
```


## 5. Top 1 Ranking SEO-Enhanced Article Generator Agent

### System Prompt:
```
You are an elite SEO content creator and digital marketing expert with 20+ years of experience producing search-dominating articles. You specialize in creating comprehensive, authoritative content that consistently achieves and maintains #1 rankings while delivering exceptional user value.

### Core Expertise:
- **Advanced On-Page SEO**: Mastery of all ranking factors and optimization techniques
- **Content Psychology**: Understanding user intent, emotional triggers, and engagement drivers
- **Data-Driven Research**: Integration of statistics, studies, and authoritative sources
- **Technical Implementation**: Schema markup, internal linking, and technical optimization
- **Conversion Optimization**: Balancing SEO goals with user experience and conversion rates

### Primary Mission:
Create 3,000+ word, comprehensive articles that outrank all competitors through superior content quality, strategic optimization, and exceptional user value delivery.

### Article Creation Framework:

#### 1. Content Foundation Requirements:

**Minimum Specifications:**
- **Word Count**: 3,000-4,000 words minimum
- **Reading Level**: 8th-9th grade for accessibility
- **Keyword Density**: 1-2% for primary keyword, natural integration
- **Semantic Coverage**: 50+ related keywords naturally integrated
- **External Links**: 15-25 high-authority outbound links (DA 85+)
- **Internal Links**: 10-15 strategic internal connections
- **Images**: 4-5 optimized images with SEO-focused alt text
- **Schema Implementation**: Article, FAQ, and relevant structured data

#### 2. Dynamic Research Integration:

**Real-Time Data Requirements:**
- **Current Statistics**: Latest industry data and trend information
- **Recent Developments**: News and updates from past 6 months
- **Expert Insights**: Quotes and perspectives from industry leaders
- **Case Study Integration**: Real-world examples and success stories
- **Competitive Intelligence**: Insights from top-performing competitor content

**Research Source Hierarchy:**
1. **Government Sources**: .gov domains for statistical data
2. **Educational Institutions**: .edu domains for research and studies
3. **Industry Publications**: Respected trade journals and magazines
4. **Corporate Research**: Company reports and whitepapers
5. **Survey Data**: Original or third-party survey results

#### 3. Advanced SEO Implementation:

**On-Page Optimization:**
- **Title Tag**: 50-60 characters with primary keyword and CTR hooks
- **Meta Description**: 150-160 characters with compelling call-to-action
- **URL Structure**: Clean, keyword-rich slug under 60 characters
- **Header Hierarchy**: Proper H1-H6 structure with keyword integration
- **Image Optimization**: Descriptive filenames, alt text, and compression

**Content Structure for SEO:**
- **Introduction**: Hook, problem, solution preview (300-400 words)
- **Main Sections**: 6-10 comprehensive sections (300-500 words each)
- **FAQ Section**: Address "People Also Ask" queries
- **Conclusion**: Summary, next steps, and engagement hooks (200-300 words)

**Featured Snippet Optimization:**
- **Definition Targeting**: Clear, concise 40-50 word definitions
- **List Creation**: Numbered and bulleted lists for list snippets
- **Table Integration**: Comparison charts and data tables
- **Step-by-Step Processes**: Detailed how-to instructions

#### 4. Content Enhancement Elements:

**Visual Content Strategy:**
- **Featured Image**: High-impact, CTR-optimized visual
- **Section Images**: 4-5 supporting images throughout content
- **Data Visualizations**: Charts, graphs, and infographics
- **Process Screenshots**: Step-by-step visual guidance
- **Custom Graphics**: Original illustrations and diagrams

**Alt Text Optimization Template:**
"[Primary Keyword] [descriptive action/state] showing [specific detail] for [target audience/purpose]"

**Interactive Elements:**
- **Downloadable Resources**: Checklists, templates, guides
- **Embedded Tools**: Calculators, quizzes, assessments
- **Social Sharing Optimization**: Quotable insights and statistics
- **Comment Engagement**: Discussion questions and controversial points

#### 5. Authority and Trust Building:

**Credibility Signals:**
- **Author Bio**: Detailed expertise and credential presentation
- **Source Citations**: Proper attribution with direct links
- **Data Verification**: Cross-referenced statistics and claims
- **Expert Quotes**: Original interviews and authoritative insights
- **Social Proof**: Testimonials, case studies, success stories

**E-A-T Optimization:**
- **Expertise**: Demonstrate deep knowledge and understanding
- **Authoritativeness**: Reference and cite authoritative sources
- **Trustworthiness**: Provide accurate, honest, helpful information

#### 6. User Experience Optimization:

**Readability Enhancement:**
- **Paragraph Length**: 2-3 sentences maximum
- **Subheading Frequency**: H3 every 150-200 words
- **Bullet Points**: Lists for easy scanning
- **White Space**: Strategic spacing for visual comfort
- **Font Hierarchy**: Clear size and weight distinctions

**Engagement Optimization:**
- **Hook Elements**: Statistics, questions, surprising facts
- **Story Integration**: Anecdotes and case studies
- **Action Items**: Clear next steps and implementation guides
- **Resource Links**: Additional tools and helpful references

### Article Output Format:

# [SEO-Optimized Title with CTR Hooks]

[Meta Description: Compelling 150-character summary with call-to-action]

## Introduction
[300-400 words with hook, problem identification, solution preview, and keyword integration]

## [Main Section 1: Primary Subtopic]
[400-500 words with comprehensive coverage, data integration, and strategic keyword placement]

### [H3 Subheading: Specific Aspect]
[Detailed explanation with examples and supporting data]

### [H3 Subheading: Related Aspect]
[Actionable insights and practical applications]

[Continue pattern for all main sections...]

## Frequently Asked Questions

### [Question targeting "People Also Ask" query]
[Concise, accurate answer with additional context]

[Continue for 8-10 FAQ items...]

## Conclusion
[200-300 words summarizing key points, providing next steps, and encouraging engagement]

---

### SEO Implementation Notes:
- **Primary Keywords**: [List with placement strategy]
- **Internal Links**: [Specific pages to link with anchor text]
- **External Authority Links**: [High-DA sources with relevance explanation]
- **Schema Markup**: [Types to implement]
- **Image Requirements**: [Specific visuals needed with alt text]
```

### Quality Assurance Checklist:

**Content Quality:**
- [ ] Comprehensive topic coverage exceeding competitor content
- [ ] Original insights and unique perspectives provided
- [ ] Actionable advice and practical implementations included
- [ ] Current data and recent developments integrated
- [ ] Expert quotes and authoritative sources cited

**SEO Optimization:**
- [ ] Primary keyword naturally integrated throughout
- [ ] 50+ semantic keywords included naturally
- [ ] Featured snippet opportunities optimized
- [ ] Internal linking strategy implemented
- [ ] External authority links properly placed

**User Experience:**
- [ ] Clear, logical content flow and structure
- [ ] Easy scanning with subheadings and bullet points
- [ ] Engaging elements and interaction opportunities
- [ ] Mobile-friendly formatting and layout
- [ ] Fast loading and technically optimized

### Success Metrics Targeting:
- **Search Rankings**: Top 3 position for primary keyword within 6 months
- **Organic Traffic**: 300%+ increase in targeted keyword traffic
- **User Engagement**: 4+ minute average time on page
- **Social Sharing**: 50+ social shares within first month
- **Conversion Rate**: 15%+ improvement in goal completions

Your articles should serve as the definitive resource on their topics, providing such comprehensive value that users bookmark, share, and cite them as authoritative references.
```

---

## Usage Instructions

Each prompt is designed to work as a standalone agent or as part of an integrated SEO content creation workflow. For best results:

1. **Customize Industry Context**: Add specific industry knowledge and terminology to each prompt
2. **Integration Strategy**: Use agents in sequence for comprehensive content campaigns
3. **Quality Control**: Implement verification steps between agent outputs
4. **Performance Tracking**: Monitor ranking improvements and adjust prompts based on results
5. **Continuous Optimization**: Update prompts based on algorithm changes and performance data

These prompts create a complete SEO content creation system capable of producing search-dominating articles that outrank competitors through superior optimization, comprehensive coverage, and exceptional user value.




# PERPLEXITY API

# Chat Completions

> Generates a model's response for the given chat conversation.

## OpenAPI

````yaml post /chat/completions
paths:
  path: /chat/completions
  method: post
  servers:
    - url: https://api.perplexity.ai
  request:
    security:
      - title: HTTPBearer
        parameters:
          query: {}
          header:
            Authorization:
              type: http
              scheme: bearer
          cookie: {}
    parameters:
      path: {}
      query: {}
      header: {}
      cookie: {}
    body:
      application/json:
        schemaArray:
          - type: object
            properties:
              model:
                allOf:
                  - title: Model
                    type: string
                    description: >-
                      The name of the model that will complete your prompt.
                      Refer to [Supported
                      Models](https://docs.perplexity.ai/guides/model-cards) to
                      find all the models offered.
                    example: sonar
              messages:
                allOf:
                  - title: Messages
                    type: array
                    description: A list of messages comprising the conversation so far.
                    items:
                      $ref: '#/components/schemas/ChatCompletionsMessage'
                    example:
                      - role: system
                        content: Be precise and concise.
                      - role: user
                        content: How many stars are there in our galaxy?
              search_mode:
                allOf:
                  - title: Search Mode
                    type: string
                    enum:
                      - academic
                      - web
                    default: web
                    description: >-
                      Controls the search mode used for the request. When set to
                      'academic', results will prioritize scholarly sources like
                      peer-reviewed papers and academic journals. More
                      information about this
                      [here](https://docs.perplexity.ai/guides/academic-filter-guide).
              reasoning_effort:
                allOf:
                  - title: Reasoning Effort
                    type: string
                    enum:
                      - low
                      - medium
                      - high
                    default: medium
                    description: >-
                      Controls how much computational effort the AI dedicates to
                      each query for deep research models. 'low' provides
                      faster, simpler answers with reduced token usage, 'medium'
                      offers a balanced approach, and 'high' delivers deeper,
                      more thorough responses with increased token usage. This
                      parameter directly impacts the amount of reasoning tokens
                      consumed. **WARNING: This parameter is ONLY applicable for
                      sonar-deep-research.**
              max_tokens:
                allOf:
                  - title: Max Tokens
                    type: integer
                    description: >-
                      The maximum number of completion tokens returned by the
                      API. Controls the length of the model's response. If the
                      response would exceed this limit, it will be truncated.
                      Higher values allow for longer responses but may increase
                      processing time and costs.
              temperature:
                allOf:
                  - title: Temperature
                    type: number
                    default: 0.2
                    description: >-
                      The amount of randomness in the response, valued between 0
                      and 2. Lower values (e.g., 0.1) make the output more
                      focused, deterministic, and less creative. Higher values
                      (e.g., 1.5) make the output more random and creative. Use
                      lower values for factual/information retrieval tasks and
                      higher values for creative applications.
                    minimum: 0
                    maximum: 2
                    exclusiveMaximum: true
              top_p:
                allOf:
                  - title: Top P
                    type: number
                    default: 0.9
                    description: >-
                      The nucleus sampling threshold, valued between 0 and 1.
                      Controls the diversity of generated text by considering
                      only the tokens whose cumulative probability exceeds the
                      top_p value. Lower values (e.g., 0.5) make the output more
                      focused and deterministic, while higher values (e.g.,
                      0.95) allow for more diverse outputs. Often used as an
                      alternative to temperature.
              search_domain_filter:
                allOf:
                  - title: Search Domain Filter
                    type: array
                    description: >-
                      A list of domains to limit search results to. Currently
                      limited to 10 domains for Allowlisting and Denylisting.
                      For Denylisting, add a `-` at the beginning of the domain
                      string. More information about this
                      [here](https://docs.perplexity.ai/guides/search-domain-filters).
              return_images:
                allOf:
                  - title: Return Images
                    type: boolean
                    default: false
                    description: Determines whether search results should include images.
              return_related_questions:
                allOf:
                  - title: Return Related Questions
                    type: boolean
                    default: false
                    description: Determines whether related questions should be returned.
              search_recency_filter:
                allOf:
                  - title: Recency Filter
                    type: string
                    description: >-
                      Filters search results based on time (e.g., 'week',
                      'day').
              search_after_date_filter:
                allOf:
                  - title: Search After Date Filter
                    type: string
                    description: >-
                      Filters search results to only include content published
                      after this date. Format should be %m/%d/%Y (e.g. 3/1/2025)
              search_before_date_filter:
                allOf:
                  - title: Search Before Date Filter
                    type: string
                    description: >-
                      Filters search results to only include content published
                      before this date. Format should be %m/%d/%Y (e.g.
                      3/1/2025)
              last_updated_after_filter:
                allOf:
                  - title: Last Updated After Filter
                    type: string
                    description: >-
                      Filters search results to only include content last
                      updated after this date. Format should be %m/%d/%Y (e.g.
                      3/1/2025)
              last_updated_before_filter:
                allOf:
                  - title: Last Updated Before Filter
                    type: string
                    description: >-
                      Filters search results to only include content last
                      updated before this date. Format should be %m/%d/%Y (e.g.
                      3/1/2025)
              top_k:
                allOf:
                  - title: Top K
                    type: number
                    default: 0
                    description: >-
                      The number of tokens to keep for top-k filtering. Limits
                      the model to consider only the k most likely next tokens
                      at each step. Lower values (e.g., 10) make the output more
                      focused and deterministic, while higher values allow for
                      more diverse outputs. A value of 0 disables this filter.
                      Often used in conjunction with top_p to control output
                      randomness.
              stream:
                allOf:
                  - title: Streaming
                    type: boolean
                    default: false
                    description: Determines whether to stream the response incrementally.
              presence_penalty:
                allOf:
                  - title: Presence Penalty
                    type: number
                    default: 0
                    description: >-
                      Positive values increase the likelihood of discussing new
                      topics. Applies a penalty to tokens that have already
                      appeared in the text, encouraging the model to talk about
                      new concepts. Values typically range from 0 (no penalty)
                      to 2.0 (strong penalty). Higher values reduce repetition
                      but may lead to more off-topic text.
              frequency_penalty:
                allOf:
                  - title: Frequency Penalty
                    type: number
                    default: 0
                    description: >-
                      Decreases likelihood of repetition based on prior
                      frequency. Applies a penalty to tokens based on how
                      frequently they've appeared in the text so far. Values
                      typically range from 0 (no penalty) to 2.0 (strong
                      penalty). Higher values (e.g., 1.5) reduce repetition of
                      the same words and phrases. Useful for preventing the
                      model from getting stuck in loops.
              response_format:
                allOf:
                  - title: Response Format
                    type: object
                    description: Enables structured JSON output formatting.
              web_search_options:
                allOf:
                  - title: Web Search Options
                    type: object
                    description: Configuration for using web search in model responses.
                    properties:
                      search_context_size:
                        title: Search Context Size
                        type: string
                        default: low
                        enum:
                          - low
                          - medium
                          - high
                        description: >-
                          Determines how much search context is retrieved for
                          the model. Options are: `low` (minimizes context for
                          cost savings but less comprehensive answers), `medium`
                          (balanced approach suitable for most queries), and
                          `high` (maximizes context for comprehensive answers
                          but at higher cost).
                      user_location:
                        title: Location of the user.
                        type: object
                        description: >-
                          To refine search results based on geography, you can
                          specify an approximate user location.
                        properties:
                          latitude:
                            title: Latitude
                            type: number
                            description: The latitude of the user's location.
                          longitude:
                            title: Longitude
                            type: number
                            description: The longitude of the user's location.
                          country:
                            title: Country
                            type: string
                            description: >-
                              The two letter ISO country code of the user's
                              location.
                    example:
                      search_context_size: high
            required: true
            title: ChatCompletionsRequest
            refIdentifier: '#/components/schemas/ChatCompletionsRequest'
            requiredProperties:
              - model
              - messages
        examples:
          example:
            value:
              model: sonar
              messages:
                - role: system
                  content: Be precise and concise.
                - role: user
                  content: How many stars are there in our galaxy?
              search_mode: web
              reasoning_effort: medium
              max_tokens: 123
              temperature: 0.2
              top_p: 0.9
              search_domain_filter:
                - <any>
              return_images: false
              return_related_questions: false
              search_recency_filter: <string>
              search_after_date_filter: <string>
              search_before_date_filter: <string>
              last_updated_after_filter: <string>
              last_updated_before_filter: <string>
              top_k: 0
              stream: false
              presence_penalty: 0
              frequency_penalty: 0
              response_format: {}
              web_search_options:
                search_context_size: high
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              id:
                allOf:
                  - title: ID
                    type: string
                    description: A unique identifier for the chat completion.
              model:
                allOf:
                  - title: Model
                    type: string
                    description: The model that generated the response.
              created:
                allOf:
                  - title: Created Timestamp
                    type: integer
                    description: >-
                      The Unix timestamp (in seconds) of when the chat
                      completion was created.
              usage:
                allOf:
                  - $ref: '#/components/schemas/UsageInfo'
              object:
                allOf:
                  - title: Object Type
                    type: string
                    default: chat.completion
                    description: The type of object, which is always `chat.completion`.
              choices:
                allOf:
                  - title: Choices
                    type: array
                    items:
                      $ref: '#/components/schemas/ChatCompletionsChoice'
                    description: >-
                      A list of chat completion choices. Can be more than one if
                      `n` is greater than 1.
              citations:
                allOf:
                  - title: Citations
                    type: array
                    items:
                      type: string
                    nullable: true
                    description: A list of citation sources for the response.
              search_results:
                allOf:
                  - title: Search Results
                    type: array
                    items:
                      $ref: '#/components/schemas/ApiPublicSearchResult'
                    nullable: true
                    description: A list of search results related to the response.
            title: ChatCompletionsResponseJson
            refIdentifier: '#/components/schemas/ChatCompletionsResponseJson'
            requiredProperties:
              - id
              - model
              - created
              - usage
              - object
              - choices
        examples:
          example:
            value:
              id: <string>
              model: <string>
              created: 123
              usage:
                prompt_tokens: 123
                completion_tokens: 123
                total_tokens: 123
                search_context_size: <string>
                citation_tokens: 123
                num_search_queries: 123
                reasoning_tokens: 123
              object: chat.completion
              choices:
                - index: 123
                  finish_reason: stop
                  message:
                    content: <string>
                    role: system
              citations:
                - <string>
              search_results:
                - title: <string>
                  url: <string>
                  date: '2023-12-25'
        description: OK
      text/event-stream:
        schemaArray:
          - type: object
            properties:
              id:
                allOf:
                  - title: ID
                    type: string
                    description: A unique identifier for the chat completion chunk.
              model:
                allOf:
                  - title: Model
                    type: string
                    description: The model that generated the response.
              created:
                allOf:
                  - title: Created Timestamp
                    type: integer
                    description: >-
                      The Unix timestamp (in seconds) of when the chat
                      completion chunk was created.
              object:
                allOf:
                  - title: Object Type
                    type: string
                    default: chat.completion.chunk
                    description: >-
                      The type of object, which is always
                      `chat.completion.chunk`.
              choices:
                allOf:
                  - title: Choices
                    type: array
                    items:
                      $ref: '#/components/schemas/ChatCompletionsChunkChoice'
                    description: >-
                      A list of chat completion choices. Can be more than one if
                      `n` is greater than 1.
            title: ChatCompletionsResponseEventStream
            refIdentifier: '#/components/schemas/ChatCompletionsResponseEventStream'
            requiredProperties:
              - id
              - model
              - created
              - object
              - choices
        examples:
          example:
            value:
              id: <string>
              model: <string>
              created: 123
              object: chat.completion.chunk
              choices:
                - index: 123
                  finish_reason: stop
                  delta:
                    content: <string>
                    role: system
        description: OK
  deprecated: false
  type: path
components:
  schemas:
    ChatCompletionsMessage:
      title: Message
      type: object
      required:
        - content
        - role
      properties:
        content:
          title: Message Content
          oneOf:
            - type: string
              description: The text contents of the message.
            - type: array
              items:
                $ref: '#/components/schemas/ChatCompletionsMessageContentChunk'
              description: An array of content parts for multimodal messages.
          description: >-
            The contents of the message in this turn of conversation. Can be a
            string or an array of content parts.
        role:
          title: Role
          type: string
          enum:
            - system
            - user
            - assistant
          description: The role of the speaker in this conversation.
    ChatCompletionsMessageContentChunk:
      title: ChatCompletionsMessageContentChunk
      type: object
      properties:
        type:
          title: Content Part Type
          type: string
          enum:
            - text
            - image_url
          description: The type of the content part.
        text:
          title: Text Content
          type: string
          description: The text content of the part.
        image_url:
          title: Image URL Content
          type: object
          properties:
            url:
              title: Image URL
              type: string
              format: uri
              description: URL for the image (base64 encoded data URI or HTTPS).
          required:
            - url
          description: An object containing the URL of the image.
      required:
        - type
      description: Represents a part of a multimodal message content.
    UsageInfo:
      title: UsageInfo
      type: object
      properties:
        prompt_tokens:
          title: Prompt Tokens
          type: integer
        completion_tokens:
          title: Completion Tokens
          type: integer
        total_tokens:
          title: Total Tokens
          type: integer
        search_context_size:
          title: Search Context Size
          type: string
          nullable: true
        citation_tokens:
          title: Citation Tokens
          type: integer
          nullable: true
        num_search_queries:
          title: Number of Search Queries
          type: integer
          nullable: true
        reasoning_tokens:
          title: Reasoning Tokens
          type: integer
          nullable: true
      required:
        - prompt_tokens
        - completion_tokens
        - total_tokens
    ChatCompletionsChoice:
      title: ChatCompletionsChoice
      type: object
      properties:
        index:
          title: Index
          type: integer
        finish_reason:
          title: Finish Reason
          type: string
          enum:
            - stop
            - length
          nullable: true
        message:
          $ref: '#/components/schemas/ChatCompletionsMessage'
      required:
        - index
        - message
    ChatCompletionsChunkChoice:
      title: ChatCompletionsChunkChoice
      type: object
      properties:
        index:
          title: Index
          type: integer
        finish_reason:
          title: Finish Reason
          type: string
          enum:
            - stop
            - length
          nullable: true
        delta:
          $ref: '#/components/schemas/ChatCompletionsMessage'
      required:
        - index
        - delta
    ApiPublicSearchResult:
      title: ApiPublicSearchResult
      type: object
      properties:
        title:
          title: Title
          type: string
        url:
          title: URL
          type: string
          format: uri
        date:
          title: Date
          type: string
          format: date
          nullable: true
      required:
        - title
        - url

````


# Create Async Chat Completion

> Creates an asynchronous chat completion job.

## OpenAPI

````yaml post /async/chat/completions
paths:
  path: /async/chat/completions
  method: post
  servers:
    - url: https://api.perplexity.ai
  request:
    security:
      - title: HTTPBearer
        parameters:
          query: {}
          header:
            Authorization:
              type: http
              scheme: bearer
          cookie: {}
    parameters:
      path: {}
      query: {}
      header: {}
      cookie: {}
    body:
      application/json:
        schemaArray:
          - type: object
            properties:
              request:
                allOf:
                  - $ref: '#/components/schemas/ChatCompletionsRequest'
            required: true
            title: AsyncApiChatCompletionsRequest
            refIdentifier: '#/components/schemas/AsyncApiChatCompletionsRequest'
            requiredProperties:
              - request
        examples:
          example:
            value:
              request:
                model: sonar
                messages:
                  - role: system
                    content: Be precise and concise.
                  - role: user
                    content: How many stars are there in our galaxy?
                search_mode: web
                reasoning_effort: medium
                max_tokens: 123
                temperature: 0.2
                top_p: 0.9
                search_domain_filter:
                  - <any>
                return_images: false
                return_related_questions: false
                search_recency_filter: <string>
                search_after_date_filter: <string>
                search_before_date_filter: <string>
                last_updated_after_filter: <string>
                last_updated_before_filter: <string>
                top_k: 0
                stream: false
                presence_penalty: 0
                frequency_penalty: 0
                response_format: {}
                web_search_options:
                  search_context_size: high
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              id:
                allOf:
                  - title: ID
                    type: string
                    description: Unique identifier for the asynchronous job.
              model:
                allOf:
                  - title: Model
                    type: string
                    description: The model used for the request.
              created_at:
                allOf:
                  - title: Created At
                    type: integer
                    format: int64
                    description: Unix timestamp of when the job was created.
              started_at:
                allOf:
                  - title: Started At
                    type: integer
                    format: int64
                    nullable: true
                    description: Unix timestamp of when processing started.
              completed_at:
                allOf:
                  - title: Completed At
                    type: integer
                    format: int64
                    nullable: true
                    description: Unix timestamp of when processing completed.
              response:
                allOf:
                  - $ref: '#/components/schemas/ChatCompletionsResponseJson'
                    nullable: true
                    description: >-
                      The actual chat completion response, available when status
                      is COMPLETED.
              failed_at:
                allOf:
                  - title: Failed At
                    type: integer
                    format: int64
                    nullable: true
                    description: Unix timestamp of when processing failed.
              error_message:
                allOf:
                  - title: Error Message
                    type: string
                    nullable: true
                    description: Error message if the job failed.
              status:
                allOf:
                  - $ref: '#/components/schemas/AsyncProcessingStatus'
            title: AsyncApiChatCompletionsResponse
            refIdentifier: '#/components/schemas/AsyncApiChatCompletionsResponse'
            requiredProperties:
              - id
              - model
              - created_at
              - status
        examples:
          example:
            value:
              id: <string>
              model: <string>
              created_at: 123
              started_at: 123
              completed_at: 123
              response:
                id: <string>
                model: <string>
                created: 123
                usage:
                  prompt_tokens: 123
                  completion_tokens: 123
                  total_tokens: 123
                  search_context_size: <string>
                  citation_tokens: 123
                  num_search_queries: 123
                  reasoning_tokens: 123
                object: chat.completion
                choices:
                  - index: 123
                    finish_reason: stop
                    message:
                      content: <string>
                      role: system
                citations:
                  - <string>
                search_results:
                  - title: <string>
                    url: <string>
                    date: '2023-12-25'
              failed_at: 123
              error_message: <string>
              status: CREATED
        description: Successfully created async chat completion job.
  deprecated: false
  type: path
components:
  schemas:
    ChatCompletionsRequest:
      title: ChatCompletionsRequest
      required:
        - model
        - messages
      type: object
      properties:
        model:
          title: Model
          type: string
          description: >-
            The name of the model that will complete your prompt. Refer to
            [Supported Models](https://docs.perplexity.ai/guides/model-cards) to
            find all the models offered.
          example: sonar
        messages:
          title: Messages
          type: array
          description: A list of messages comprising the conversation so far.
          items:
            $ref: '#/components/schemas/ChatCompletionsMessage'
          example:
            - role: system
              content: Be precise and concise.
            - role: user
              content: How many stars are there in our galaxy?
        search_mode:
          title: Search Mode
          type: string
          enum:
            - academic
            - web
          default: web
          description: >-
            Controls the search mode used for the request. When set to
            'academic', results will prioritize scholarly sources like
            peer-reviewed papers and academic journals. More information about
            this
            [here](https://docs.perplexity.ai/guides/academic-filter-guide).
        reasoning_effort:
          title: Reasoning Effort
          type: string
          enum:
            - low
            - medium
            - high
          default: medium
          description: >-
            Controls how much computational effort the AI dedicates to each
            query for deep research models. 'low' provides faster, simpler
            answers with reduced token usage, 'medium' offers a balanced
            approach, and 'high' delivers deeper, more thorough responses with
            increased token usage. This parameter directly impacts the amount of
            reasoning tokens consumed. **WARNING: This parameter is ONLY
            applicable for sonar-deep-research.**
        max_tokens:
          title: Max Tokens
          type: integer
          description: >-
            The maximum number of completion tokens returned by the API.
            Controls the length of the model's response. If the response would
            exceed this limit, it will be truncated. Higher values allow for
            longer responses but may increase processing time and costs.
        temperature:
          title: Temperature
          type: number
          default: 0.2
          description: >-
            The amount of randomness in the response, valued between 0 and 2.
            Lower values (e.g., 0.1) make the output more focused,
            deterministic, and less creative. Higher values (e.g., 1.5) make the
            output more random and creative. Use lower values for
            factual/information retrieval tasks and higher values for creative
            applications.
          minimum: 0
          maximum: 2
          exclusiveMaximum: true
        top_p:
          title: Top P
          type: number
          default: 0.9
          description: >-
            The nucleus sampling threshold, valued between 0 and 1. Controls the
            diversity of generated text by considering only the tokens whose
            cumulative probability exceeds the top_p value. Lower values (e.g.,
            0.5) make the output more focused and deterministic, while higher
            values (e.g., 0.95) allow for more diverse outputs. Often used as an
            alternative to temperature.
        search_domain_filter:
          title: Search Domain Filter
          type: array
          description: >-
            A list of domains to limit search results to. Currently limited to
            10 domains for Allowlisting and Denylisting. For Denylisting, add a
            `-` at the beginning of the domain string. More information about
            this
            [here](https://docs.perplexity.ai/guides/search-domain-filters).
        return_images:
          title: Return Images
          type: boolean
          default: false
          description: Determines whether search results should include images.
        return_related_questions:
          title: Return Related Questions
          type: boolean
          default: false
          description: Determines whether related questions should be returned.
        search_recency_filter:
          title: Recency Filter
          type: string
          description: Filters search results based on time (e.g., 'week', 'day').
        search_after_date_filter:
          title: Search After Date Filter
          type: string
          description: >-
            Filters search results to only include content published after this
            date. Format should be %m/%d/%Y (e.g. 3/1/2025)
        search_before_date_filter:
          title: Search Before Date Filter
          type: string
          description: >-
            Filters search results to only include content published before this
            date. Format should be %m/%d/%Y (e.g. 3/1/2025)
        last_updated_after_filter:
          title: Last Updated After Filter
          type: string
          description: >-
            Filters search results to only include content last updated after
            this date. Format should be %m/%d/%Y (e.g. 3/1/2025)
        last_updated_before_filter:
          title: Last Updated Before Filter
          type: string
          description: >-
            Filters search results to only include content last updated before
            this date. Format should be %m/%d/%Y (e.g. 3/1/2025)
        top_k:
          title: Top K
          type: number
          default: 0
          description: >-
            The number of tokens to keep for top-k filtering. Limits the model
            to consider only the k most likely next tokens at each step. Lower
            values (e.g., 10) make the output more focused and deterministic,
            while higher values allow for more diverse outputs. A value of 0
            disables this filter. Often used in conjunction with top_p to
            control output randomness.
        stream:
          title: Streaming
          type: boolean
          default: false
          description: Determines whether to stream the response incrementally.
        presence_penalty:
          title: Presence Penalty
          type: number
          default: 0
          description: >-
            Positive values increase the likelihood of discussing new topics.
            Applies a penalty to tokens that have already appeared in the text,
            encouraging the model to talk about new concepts. Values typically
            range from 0 (no penalty) to 2.0 (strong penalty). Higher values
            reduce repetition but may lead to more off-topic text.
        frequency_penalty:
          title: Frequency Penalty
          type: number
          default: 0
          description: >-
            Decreases likelihood of repetition based on prior frequency. Applies
            a penalty to tokens based on how frequently they've appeared in the
            text so far. Values typically range from 0 (no penalty) to 2.0
            (strong penalty). Higher values (e.g., 1.5) reduce repetition of the
            same words and phrases. Useful for preventing the model from getting
            stuck in loops.
        response_format:
          title: Response Format
          type: object
          description: Enables structured JSON output formatting.
        web_search_options:
          title: Web Search Options
          type: object
          description: Configuration for using web search in model responses.
          properties:
            search_context_size:
              title: Search Context Size
              type: string
              default: low
              enum:
                - low
                - medium
                - high
              description: >-
                Determines how much search context is retrieved for the model.
                Options are: `low` (minimizes context for cost savings but less
                comprehensive answers), `medium` (balanced approach suitable for
                most queries), and `high` (maximizes context for comprehensive
                answers but at higher cost).
            user_location:
              title: Location of the user.
              type: object
              description: >-
                To refine search results based on geography, you can specify an
                approximate user location.
              properties:
                latitude:
                  title: Latitude
                  type: number
                  description: The latitude of the user's location.
                longitude:
                  title: Longitude
                  type: number
                  description: The longitude of the user's location.
                country:
                  title: Country
                  type: string
                  description: The two letter ISO country code of the user's location.
          example:
            search_context_size: high
    ChatCompletionsMessage:
      title: Message
      type: object
      required:
        - content
        - role
      properties:
        content:
          title: Message Content
          oneOf:
            - type: string
              description: The text contents of the message.
            - type: array
              items:
                $ref: '#/components/schemas/ChatCompletionsMessageContentChunk'
              description: An array of content parts for multimodal messages.
          description: >-
            The contents of the message in this turn of conversation. Can be a
            string or an array of content parts.
        role:
          title: Role
          type: string
          enum:
            - system
            - user
            - assistant
          description: The role of the speaker in this conversation.
    ChatCompletionsMessageContentChunk:
      title: ChatCompletionsMessageContentChunk
      type: object
      properties:
        type:
          title: Content Part Type
          type: string
          enum:
            - text
            - image_url
          description: The type of the content part.
        text:
          title: Text Content
          type: string
          description: The text content of the part.
        image_url:
          title: Image URL Content
          type: object
          properties:
            url:
              title: Image URL
              type: string
              format: uri
              description: URL for the image (base64 encoded data URI or HTTPS).
          required:
            - url
          description: An object containing the URL of the image.
      required:
        - type
      description: Represents a part of a multimodal message content.
    ChatCompletionsResponseJson:
      title: ChatCompletionsResponseJson
      type: object
      properties:
        id:
          title: ID
          type: string
          description: A unique identifier for the chat completion.
        model:
          title: Model
          type: string
          description: The model that generated the response.
        created:
          title: Created Timestamp
          type: integer
          description: >-
            The Unix timestamp (in seconds) of when the chat completion was
            created.
        usage:
          $ref: '#/components/schemas/UsageInfo'
        object:
          title: Object Type
          type: string
          default: chat.completion
          description: The type of object, which is always `chat.completion`.
        choices:
          title: Choices
          type: array
          items:
            $ref: '#/components/schemas/ChatCompletionsChoice'
          description: >-
            A list of chat completion choices. Can be more than one if `n` is
            greater than 1.
        citations:
          title: Citations
          type: array
          items:
            type: string
          nullable: true
          description: A list of citation sources for the response.
        search_results:
          title: Search Results
          type: array
          items:
            $ref: '#/components/schemas/ApiPublicSearchResult'
          nullable: true
          description: A list of search results related to the response.
      required:
        - id
        - model
        - created
        - usage
        - object
        - choices
    UsageInfo:
      title: UsageInfo
      type: object
      properties:
        prompt_tokens:
          title: Prompt Tokens
          type: integer
        completion_tokens:
          title: Completion Tokens
          type: integer
        total_tokens:
          title: Total Tokens
          type: integer
        search_context_size:
          title: Search Context Size
          type: string
          nullable: true
        citation_tokens:
          title: Citation Tokens
          type: integer
          nullable: true
        num_search_queries:
          title: Number of Search Queries
          type: integer
          nullable: true
        reasoning_tokens:
          title: Reasoning Tokens
          type: integer
          nullable: true
      required:
        - prompt_tokens
        - completion_tokens
        - total_tokens
    ChatCompletionsChoice:
      title: ChatCompletionsChoice
      type: object
      properties:
        index:
          title: Index
          type: integer
        finish_reason:
          title: Finish Reason
          type: string
          enum:
            - stop
            - length
          nullable: true
        message:
          $ref: '#/components/schemas/ChatCompletionsMessage'
      required:
        - index
        - message
    ApiPublicSearchResult:
      title: ApiPublicSearchResult
      type: object
      properties:
        title:
          title: Title
          type: string
        url:
          title: URL
          type: string
          format: uri
        date:
          title: Date
          type: string
          format: date
          nullable: true
      required:
        - title
        - url
    AsyncProcessingStatus:
      title: AsyncProcessingStatus
      type: string
      enum:
        - CREATED
        - IN_PROGRESS
        - COMPLETED
        - FAILED
      description: The status of an asynchronous processing job.

````


# List Async Chat Completions

> Lists all asynchronous chat completion requests for the authenticated user.

## OpenAPI

````yaml get /async/chat/completions
paths:
  path: /async/chat/completions
  method: get
  servers:
    - url: https://api.perplexity.ai
  request:
    security:
      - title: HTTPBearer
        parameters:
          query: {}
          header:
            Authorization:
              type: http
              scheme: bearer
          cookie: {}
    parameters:
      path: {}
      query:
        limit:
          schema:
            - type: integer
              required: false
              description: Maximum number of requests to return.
              default: 20
        next_token:
          schema:
            - type: string
              required: false
              description: >-
                Token for fetching the next page of results. Ensure this token
                is URL-encoded when passed as a query parameter.
      header: {}
      cookie: {}
    body: {}
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              next_token:
                allOf:
                  - title: Next Token
                    type: string
                    nullable: true
                    description: Token for fetching the next page of results.
              requests:
                allOf:
                  - title: Requests
                    type: array
                    items:
                      $ref: >-
                        #/components/schemas/AsyncApiChatCompletionsResponseSummary
            title: ListAsyncApiChatCompletionsResponse
            refIdentifier: '#/components/schemas/ListAsyncApiChatCompletionsResponse'
            requiredProperties:
              - requests
        examples:
          example:
            value:
              next_token: <string>
              requests:
                - id: <string>
                  created_at: 123
                  started_at: 123
                  completed_at: 123
                  failed_at: 123
                  model: <string>
                  status: CREATED
        description: Successfully retrieved list of async chat completion requests.
  deprecated: false
  type: path
components:
  schemas:
    AsyncProcessingStatus:
      title: AsyncProcessingStatus
      type: string
      enum:
        - CREATED
        - IN_PROGRESS
        - COMPLETED
        - FAILED
      description: The status of an asynchronous processing job.
    AsyncApiChatCompletionsResponseSummary:
      title: AsyncApiChatCompletionsResponseSummary
      type: object
      properties:
        id:
          title: ID
          type: string
        created_at:
          title: Created At
          type: integer
          format: int64
          description: Unix timestamp of when the request was created.
        started_at:
          title: Started At
          type: integer
          format: int64
          nullable: true
          description: Unix timestamp of when processing started.
        completed_at:
          title: Completed At
          type: integer
          format: int64
          nullable: true
          description: Unix timestamp of when processing completed.
        failed_at:
          title: Failed At
          type: integer
          format: int64
          nullable: true
          description: Unix timestamp of when processing failed.
        model:
          title: Model
          type: string
        status:
          $ref: '#/components/schemas/AsyncProcessingStatus'
      required:
        - id
        - created_at
        - model
        - status

````

# Get Async Chat Completion Response

> Retrieves the status and result of a specific asynchronous chat completion job.

## OpenAPI

````yaml get /async/chat/completions/{request_id}
paths:
  path: /async/chat/completions/{request_id}
  method: get
  servers:
    - url: https://api.perplexity.ai
  request:
    security:
      - title: HTTPBearer
        parameters:
          query: {}
          header:
            Authorization:
              type: http
              scheme: bearer
          cookie: {}
    parameters:
      path:
        request_id:
          schema:
            - type: string
              required: true
              description: The ID of the asynchronous chat completion request.
      query: {}
      header: {}
      cookie: {}
    body: {}
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              id:
                allOf:
                  - title: ID
                    type: string
                    description: Unique identifier for the asynchronous job.
              model:
                allOf:
                  - title: Model
                    type: string
                    description: The model used for the request.
              created_at:
                allOf:
                  - title: Created At
                    type: integer
                    format: int64
                    description: Unix timestamp of when the job was created.
              started_at:
                allOf:
                  - title: Started At
                    type: integer
                    format: int64
                    nullable: true
                    description: Unix timestamp of when processing started.
              completed_at:
                allOf:
                  - title: Completed At
                    type: integer
                    format: int64
                    nullable: true
                    description: Unix timestamp of when processing completed.
              response:
                allOf:
                  - $ref: '#/components/schemas/ChatCompletionsResponseJson'
                    nullable: true
                    description: >-
                      The actual chat completion response, available when status
                      is COMPLETED.
              failed_at:
                allOf:
                  - title: Failed At
                    type: integer
                    format: int64
                    nullable: true
                    description: Unix timestamp of when processing failed.
              error_message:
                allOf:
                  - title: Error Message
                    type: string
                    nullable: true
                    description: Error message if the job failed.
              status:
                allOf:
                  - $ref: '#/components/schemas/AsyncProcessingStatus'
            title: AsyncApiChatCompletionsResponse
            refIdentifier: '#/components/schemas/AsyncApiChatCompletionsResponse'
            requiredProperties:
              - id
              - model
              - created_at
              - status
        examples:
          example:
            value:
              id: <string>
              model: <string>
              created_at: 123
              started_at: 123
              completed_at: 123
              response:
                id: <string>
                model: <string>
                created: 123
                usage:
                  prompt_tokens: 123
                  completion_tokens: 123
                  total_tokens: 123
                  search_context_size: <string>
                  citation_tokens: 123
                  num_search_queries: 123
                  reasoning_tokens: 123
                object: chat.completion
                choices:
                  - index: 123
                    finish_reason: stop
                    message:
                      content: <string>
                      role: system
                citations:
                  - <string>
                search_results:
                  - title: <string>
                    url: <string>
                    date: '2023-12-25'
              failed_at: 123
              error_message: <string>
              status: CREATED
        description: Successfully retrieved async chat completion response.
    '404':
      _mintlify/placeholder:
        schemaArray:
          - type: any
            description: Async chat completion response not found.
        examples: {}
        description: Async chat completion response not found.
  deprecated: false
  type: path
components:
  schemas:
    ChatCompletionsMessage:
      title: Message
      type: object
      required:
        - content
        - role
      properties:
        content:
          title: Message Content
          oneOf:
            - type: string
              description: The text contents of the message.
            - type: array
              items:
                $ref: '#/components/schemas/ChatCompletionsMessageContentChunk'
              description: An array of content parts for multimodal messages.
          description: >-
            The contents of the message in this turn of conversation. Can be a
            string or an array of content parts.
        role:
          title: Role
          type: string
          enum:
            - system
            - user
            - assistant
          description: The role of the speaker in this conversation.
    ChatCompletionsMessageContentChunk:
      title: ChatCompletionsMessageContentChunk
      type: object
      properties:
        type:
          title: Content Part Type
          type: string
          enum:
            - text
            - image_url
          description: The type of the content part.
        text:
          title: Text Content
          type: string
          description: The text content of the part.
        image_url:
          title: Image URL Content
          type: object
          properties:
            url:
              title: Image URL
              type: string
              format: uri
              description: URL for the image (base64 encoded data URI or HTTPS).
          required:
            - url
          description: An object containing the URL of the image.
      required:
        - type
      description: Represents a part of a multimodal message content.
    ChatCompletionsResponseJson:
      title: ChatCompletionsResponseJson
      type: object
      properties:
        id:
          title: ID
          type: string
          description: A unique identifier for the chat completion.
        model:
          title: Model
          type: string
          description: The model that generated the response.
        created:
          title: Created Timestamp
          type: integer
          description: >-
            The Unix timestamp (in seconds) of when the chat completion was
            created.
        usage:
          $ref: '#/components/schemas/UsageInfo'
        object:
          title: Object Type
          type: string
          default: chat.completion
          description: The type of object, which is always `chat.completion`.
        choices:
          title: Choices
          type: array
          items:
            $ref: '#/components/schemas/ChatCompletionsChoice'
          description: >-
            A list of chat completion choices. Can be more than one if `n` is
            greater than 1.
        citations:
          title: Citations
          type: array
          items:
            type: string
          nullable: true
          description: A list of citation sources for the response.
        search_results:
          title: Search Results
          type: array
          items:
            $ref: '#/components/schemas/ApiPublicSearchResult'
          nullable: true
          description: A list of search results related to the response.
      required:
        - id
        - model
        - created
        - usage
        - object
        - choices
    UsageInfo:
      title: UsageInfo
      type: object
      properties:
        prompt_tokens:
          title: Prompt Tokens
          type: integer
        completion_tokens:
          title: Completion Tokens
          type: integer
        total_tokens:
          title: Total Tokens
          type: integer
        search_context_size:
          title: Search Context Size
          type: string
          nullable: true
        citation_tokens:
          title: Citation Tokens
          type: integer
          nullable: true
        num_search_queries:
          title: Number of Search Queries
          type: integer
          nullable: true
        reasoning_tokens:
          title: Reasoning Tokens
          type: integer
          nullable: true
      required:
        - prompt_tokens
        - completion_tokens
        - total_tokens
    ChatCompletionsChoice:
      title: ChatCompletionsChoice
      type: object
      properties:
        index:
          title: Index
          type: integer
        finish_reason:
          title: Finish Reason
          type: string
          enum:
            - stop
            - length
          nullable: true
        message:
          $ref: '#/components/schemas/ChatCompletionsMessage'
      required:
        - index
        - message
    ApiPublicSearchResult:
      title: ApiPublicSearchResult
      type: object
      properties:
        title:
          title: Title
          type: string
        url:
          title: URL
          type: string
          format: uri
        date:
          title: Date
          type: string
          format: date
          nullable: true
      required:
        - title
        - url
    AsyncProcessingStatus:
      title: AsyncProcessingStatus
      type: string
      enum:
        - CREATED
        - IN_PROGRESS
        - COMPLETED
        - FAILED
      description: The status of an asynchronous processing job.

````


# BFL FOR IMAGE GENERATION

# Edit or create an image with Flux Kontext Pro

## OpenAPI

````yaml https://api.bfl.ai/openapi.json post /v1/flux-kontext-pro
paths:
  path: /v1/flux-kontext-pro
  method: post
  servers:
    - url: https://api.bfl.ai
      description: BFL API
  request:
    security:
      - title: APIKeyHeader
        parameters:
          query: {}
          header:
            x-key:
              type: apiKey
          cookie: {}
    parameters:
      path: {}
      query: {}
      header: {}
      cookie: {}
    body:
      application/json:
        schemaArray:
          - type: object
            properties:
              prompt:
                allOf:
                  - type: string
                    title: Prompt
                    description: Text prompt for image generation.
                    example: ein fantastisches bild
              input_image:
                allOf:
                  - anyOf:
                      - type: string
                      - type: 'null'
                    title: Input Image
                    description: Base64 encoded image or URL to use with Kontext.
              seed:
                allOf:
                  - anyOf:
                      - type: integer
                      - type: 'null'
                    title: Seed
                    description: Optional seed for reproducibility.
                    example: 42
              aspect_ratio:
                allOf:
                  - anyOf:
                      - type: string
                      - type: 'null'
                    title: Aspect Ratio
                    description: Aspect ratio of the image between 21:9 and 9:21
              output_format:
                allOf:
                  - anyOf:
                      - $ref: '#/components/schemas/OutputFormat'
                      - type: 'null'
                    description: >-
                      Output format for the generated image. Can be 'jpeg' or
                      'png'.
                    default: png
              webhook_url:
                allOf:
                  - anyOf:
                      - type: string
                        maxLength: 2083
                        minLength: 1
                        format: uri
                      - type: 'null'
                    title: Webhook Url
                    description: URL to receive webhook notifications
              webhook_secret:
                allOf:
                  - anyOf:
                      - type: string
                      - type: 'null'
                    title: Webhook Secret
                    description: Optional secret for webhook signature verification
              prompt_upsampling:
                allOf:
                  - type: boolean
                    title: Prompt Upsampling
                    description: >-
                      Whether to perform upsampling on the prompt. If active,
                      automatically modifies the prompt for more creative
                      generation.
                    default: false
              safety_tolerance:
                allOf:
                  - type: integer
                    maximum: 6
                    minimum: 0
                    title: Safety Tolerance
                    description: >-
                      Tolerance level for input and output moderation. Between 0
                      and 6, 0 being most strict, 6 being least strict. Limit of
                      2 for Image to Image.
                    default: 2
                    example: 2
            required: true
            title: FluxKontextProInputs
            refIdentifier: '#/components/schemas/FluxKontextProInputs'
            requiredProperties:
              - prompt
        examples:
          example:
            value:
              prompt: ein fantastisches bild
              input_image: <string>
              seed: 42
              aspect_ratio: <string>
              output_format: jpeg
              webhook_url: <string>
              webhook_secret: <string>
              prompt_upsampling: false
              safety_tolerance: 2
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              id:
                allOf:
                  - type: string
                    title: Id
              polling_url:
                allOf:
                  - type: string
                    title: Polling Url
            title: AsyncResponse
            refIdentifier: '#/components/schemas/AsyncResponse'
            requiredProperties:
              - id
              - polling_url
          - type: object
            properties:
              id:
                allOf:
                  - type: string
                    title: Id
              status:
                allOf:
                  - type: string
                    title: Status
              webhook_url:
                allOf:
                  - type: string
                    title: Webhook Url
            title: AsyncWebhookResponse
            refIdentifier: '#/components/schemas/AsyncWebhookResponse'
            requiredProperties:
              - id
              - status
              - webhook_url
        examples:
          example:
            value:
              id: <string>
              polling_url: <string>
        description: Successful Response
    '422':
      application/json:
        schemaArray:
          - type: object
            properties:
              detail:
                allOf:
                  - items:
                      $ref: '#/components/schemas/ValidationError'
                    type: array
                    title: Detail
            title: HTTPValidationError
            refIdentifier: '#/components/schemas/HTTPValidationError'
        examples:
          example:
            value:
              detail:
                - loc:
                    - <string>
                  msg: <string>
                  type: <string>
        description: Validation Error
  deprecated: false
  type: path
components:
  schemas:
    OutputFormat:
      type: string
      enum:
        - jpeg
        - png
      title: OutputFormat
    ValidationError:
      properties:
        loc:
          items:
            anyOf:
              - type: string
              - type: integer
          type: array
          title: Location
        msg:
          type: string
          title: Message
        type:
          type: string
          title: Error Type
      type: object
      required:
        - loc
        - msg
        - type
      title: ValidationError

````



# Anthropic Sample Code

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  // defaults to process.env["ANTHROPIC_API_KEY"]
  apiKey: "my_api_key",
});

const msg = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 20000,
  temperature: 1,
  messages: [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "You are an elite SEO content strategist and information architect with expertise in creating comprehensive, search-optimized article outlines that consistently achieve top rankings. Your outlines serve as blueprints for content that dominates search results through superior structure, comprehensive coverage, and strategic optimization.\n\n### Core Mission:\nCreate detailed, SEO-enhanced article outlines that address all aspects of user intent while incorporating advanced on-page optimization strategies and competitive intelligence insights.\n\n### Outline Creation Framework:\n\n#### 1. Strategic Foundation Analysis:\nBefore creating the outline, analyze:\n- **Primary Search Intent**: Informational, navigational, commercial, or transactional\n- **Secondary Intent Layers**: Hidden user needs beyond obvious search query\n- **Competitor Content Gaps**: Missing information in current top-ranking content\n- **User Journey Stage**: Awareness, consideration, or decision phase content\n- **Semantic Keyword Opportunities**: Related topics for comprehensive coverage\n\n#### 2. Comprehensive Outline Structure:\n\n**A. Introduction Section (300-400 words)**\n- **Hook Element**: Statistics, surprising facts, or thought-provoking questions\n- **Problem Identification**: Clear articulation of user pain point or question\n- **Solution Preview**: Brief overview of what the article will deliver\n- **Authority Establishment**: Credentials, experience, or data sources\n- **Content Roadmap**: What readers will learn and achieve\n\n**B. Core Content Sections (2,500-2,800 words total)**\n\nDesign 6-10 main sections with:\n- **H2 Headers**: Keyword-optimized, benefit-driven headings\n- **H3 Subheadings**: Detailed breakdowns addressing specific aspects\n- **Content Depth**: Each section 300-500 words with actionable insights\n- **LSI Integration**: Natural incorporation of semantic keywords\n- **Internal Link Opportunities**: Strategic connections to related content\n\n**C. Supporting Elements Integration:**\n- **FAQ Section**: Address \"People Also Ask\" queries and common questions\n- **Comparison Tables**: Visual data presentation for complex information\n- **Step-by-Step Processes**: Actionable instructions with numbered steps\n- **Case Studies/Examples**: Real-world applications and success stories\n- **Expert Quotes**: Authority-building citations and expert insights\n\n**D. Conclusion & Action Items (200-300 words)**\n- **Key Takeaway Summary**: Reinforce main points and benefits\n- **Next Steps**: Clear action items for readers to implement\n- **Resource Links**: Additional helpful tools and references\n- **Engagement Hooks**: Questions or prompts encouraging comments/shares\n\n#### 3. Advanced SEO Optimization Elements:\n\n**Schema Markup Opportunities:**\n- FAQ Schema for question sections\n- How-To Schema for instructional content\n- Article Schema for news and blog content\n- Review Schema for product/service evaluations\n\n**Featured Snippet Optimization:**\n- **Definition Boxes**: 40-50 word concise definitions\n- **List Snippets**: Numbered or bulleted list structures\n- **Table Snippets**: Comparison charts and data tables\n- **Paragraph Snippets**: Direct question-answer formats\n\n**Internal Linking Strategy:**\n- **Hub Page Connections**: Links to main category/topic pages\n- **Related Article Network**: Connections to complementary content\n- **Conversion Funnels**: Strategic links to high-converting pages\n- **Authority Distribution**: Link equity sharing with important pages\n\n#### 4. Content Enhancement Specifications:\n\n**Image Integration Plan:**\n- **Featured Image**: High-impact visual with CTR optimization focus\n- **Section Images**: 4-5 supporting visuals throughout content\n- **Infographics**: Data visualization for complex information\n- **Screenshots**: Step-by-step process documentation\n- **Alt Text Strategy**: SEO-optimized descriptions for each image\n\n**Data and Research Integration:**\n- **Primary Research**: Original surveys, studies, or experiments\n- **Industry Statistics**: Current, relevant data from authoritative sources\n- **Trend Analysis**: Latest developments and future predictions\n- **Expert Interviews**: Original quotes and insights from industry leaders\n\n**External Link Strategy:**\n- **High-Authority Sources**: Links to DA 85+ domains only\n- **Government/Educational**: .gov and .edu domain citations\n- **Industry Publications**: Respected trade publications and journals\n- **Recent Sources**: Prioritize content published within last 2 years\n\n#### 5. User Experience Optimization:\n\n**Readability Enhancements:**\n- **Subheading Frequency**: H3 every 150-200 words maximum\n- **Paragraph Length**: 2-3 sentences maximum per paragraph\n- **Bullet Point Usage**: Lists for easy scanning and comprehension\n- **White Space**: Strategic spacing for visual breathing room\n\n**Engagement Elements:**\n- **Interactive Elements**: Polls, quizzes, or calculators where appropriate\n- **Social Sharing Hooks**: Quotable statistics and key insights\n- **Comment Stimulation**: Discussion questions and controversial points\n- **Download Incentives**: Checklists, templates, or bonus resources\n\n### Detailed Outline Output Format:\n\n\n# [SEO-Optimized Title]\n\n## SEO Metadata:\n- **Primary Keyword**: [exact match keyword]\n- **Secondary Keywords**: [3-5 supporting keywords]\n- **Target Word Count**: 3,000-3,500 words\n- **Estimated Reading Time**: 12-15 minutes\n\n## Content Structure:\n\n### I. Introduction (300-400 words)\n**Hook**: [Specific attention-grabbing opening]\n**Problem Statement**: [User pain point articulation]\n**Solution Preview**: [What article will deliver]\n**Authority Building**: [Credibility establishment]\n**Keyword Integration**: [Primary keyword placement strategy]\n\n### II. [Main Section 1 - H2] (400-500 words)\n**Focus**: [Section primary purpose]\n**Keywords**: [LSI keywords to integrate]\n**Subheadings (H3)**:\n- [Specific subtopic 1]\n- [Specific subtopic 2]\n- [Specific subtopic 3]\n**Supporting Elements**: [Images, data, examples needed]\n**Internal Links**: [2-3 strategic internal link opportunities]\n\n[Continue for all main sections...]\n\n### FAQ Section (300-400 words)\n**Target Queries**: [List of PAA questions to address]\n**Schema Opportunity**: [FAQ structured data implementation]\n\n### Conclusion (200-300 words)\n**Summary Points**: [Key takeaways to reinforce]\n**Call-to-Action**: [Specific next steps for readers]\n**Social Sharing Hook**: [Shareable insight or statistic]\n\n## Content Enhancement Strategy:\n\n### Image Requirements:\n1. **Featured Image**: [Specific description and SEO focus]\n2. **Section Images**: [4-5 supporting visuals with purposes]\n3. **Alt Text Strategy**: [SEO optimization approach]\n\n### Data Integration Plan:\n- **Statistics Needed**: [Specific data points to research]\n- **Authority Sources**: [High-DA sites to reference]\n- **Original Research**: [Surveys or studies to conduct]\n\n### Technical SEO Elements:\n- **Schema Markup**: [Specific types to implement]\n- **Internal Link Network**: [Hub page connections]\n- **Featured Snippet Targeting**: [Specific optimization strategies]\n\n### Competitive Advantages:\n- **Unique Angles**: [How to differentiate from competitors]\n- **Content Gaps**: [Missing information to include]\n- **Superior Coverage**: [Topics to cover more comprehensively]\n\n\nYour outlines should serve as complete blueprints that enable any skilled content creator to produce search-dominating articles that comprehensively address user intent while achieving superior search rankings."
        }
      ]
    }
  ],
  tools: [
    {
      "strict": false,
      "type": "web_search_20250305",
      "name": "web_search"
    }
  ],
  betas: ["web-search-2025-03-05"]
});
console.log(msg);