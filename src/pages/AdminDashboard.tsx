import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  FileText, 
  Image, 
  Globe, 
  Bot,
  Users,
  Activity,
  TrendingUp,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Download,
  RefreshCw,
  Settings,
  BarChart3,
  Brain,
  Target,
  BarChart,
  Palette,
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Mail,
  MessageCircle,
  Save,
  X
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [stats, setStats] = useState({
    totalPages: 0,
    totalResources: 0,
    totalBlogs: 0,
    totalServices: 0,
    activeRequests: 0,
    apiUsage: 0,
    totalContent: 0,
    publishedContent: 0,
    totalContacts: 0,
    newContacts: 0
  });
  const [contentRequests, setContentRequests] = useState([]);
  const [generatedContent, setGeneratedContent] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [activityLog, setActivityLog] = useState([]);
  const [lastSync, setLastSync] = useState(new Date());
  const [syncStatus, setSyncStatus] = useState('live');
  const [selectedContent, setSelectedContent] = useState(null);
  const [showContentPreview, setShowContentPreview] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactPreview, setShowContactPreview] = useState(false);
  
  // Chatbot management states
  const [chatbotConfig, setChatbotConfig] = useState({
    systemInstruction: '',
    temperature: 1.2,
    model: 'gemini-2.5-pro',
    isActive: true
  });
  const [chatbotConversations, setChatbotConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showConversationPreview, setShowConversationPreview] = useState(false);

  // Enhanced AI Generation States
  const [generationForm, setGenerationForm] = useState({
    contentType: 'blog',
    targetKeywords: '',
    customInstructions: '',
    contentLength: '3000+',
    seoFocus: true,
    includeImages: true,
    brandAwareness: true
  });

  // Real-time progress tracking
  const [generationSteps, setGenerationSteps] = useState([
    { id: 'research', name: 'Keyword Research', status: 'pending', progress: 0 },
    { id: 'serp', name: 'SERP Analysis', status: 'pending', progress: 0 },
    { id: 'outline', name: 'Content Outline', status: 'pending', progress: 0 },
    { id: 'content', name: 'Content Generation', status: 'pending', progress: 0 },
    { id: 'images', name: 'Image Generation', status: 'pending', progress: 0 }
  ]);

  // Loading states
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadingChatbot, setLoadingChatbot] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
      setupRealtimeSubscriptions();
    }
  }, [isAuthenticated]);

  const setupRealtimeSubscriptions = () => {
    // Subscribe to chatbot conversations
    const chatbotSubscription = supabase
      .channel('chatbot_conversations')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'chatbot_conversations' },
        (payload) => {
          console.log('Chatbot conversation change:', payload);
          loadChatbotData();
        }
      )
      .subscribe();

    // Subscribe to chatbot messages
    const messagesSubscription = supabase
      .channel('chatbot_messages')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'chatbot_messages' },
        (payload) => {
          console.log('Chatbot message change:', payload);
          loadChatbotData();
        }
      )
      .subscribe();

    // Subscribe to contact submissions
    const contactSubscription = supabase
      .channel('contact_submissions')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'contact_submissions' },
        (payload) => {
          console.log('Contact submission change:', payload);
          loadContactSubmissions();
        }
      )
      .subscribe();

    // Subscribe to content requests
    const contentRequestsSubscription = supabase
      .channel('content_requests')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'content_requests' },
        (payload) => {
          console.log('Content request change:', payload);
          loadContentRequests();
        }
      )
      .subscribe();

    // Subscribe to generated content
    const generatedContentSubscription = supabase
      .channel('generated_content')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'generated_content' },
        (payload) => {
          console.log('Generated content change:', payload);
          loadGeneratedContent();
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      chatbotSubscription.unsubscribe();
      messagesSubscription.unsubscribe();
      contactSubscription.unsubscribe();
      contentRequestsSubscription.unsubscribe();
      generatedContentSubscription.unsubscribe();
    };
  };

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: {
          email: loginData.email,
          password: loginData.password
        }
      });

      if (error) throw error;

      if (data.success) {
        localStorage.setItem('admin_token', data.token);
        setIsAuthenticated(true);
        toast({
          title: "Login Successful",
          description: "Welcome to Agentic AI Dashboard",
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    navigate('/');
  };

  const updateGenerationStep = (stepId: string, status: string, progress: number) => {
    setGenerationSteps(steps => 
      steps.map(step => 
        step.id === stepId 
          ? { ...step, status, progress } 
          : step
      )
    );
  };

  const loadDashboardData = async () => {
    try {
      // Load content requests
      await loadContentRequests();

      // Load generated content
      await loadGeneratedContent();

      // Load contact submissions
      await loadContactSubmissions();

      // Load chatbot data
      await loadChatbotData();

      // Calculate stats from loaded data
      const calculatedStats = {
        totalPages: generatedContent.filter((c: any) => c.categories?.includes('page')).length,
        totalResources: generatedContent.filter((c: any) => c.categories?.includes('resource')).length,
        totalBlogs: generatedContent.filter((c: any) => c.categories?.includes('blog')).length,
        totalServices: generatedContent.filter((c: any) => c.categories?.includes('service')).length,
        activeRequests: contentRequests.filter((r: any) => r.status === 'processing').length,
        apiUsage: 0, // Will be calculated from api_usage_logs if needed
        totalContent: generatedContent.length,
        publishedContent: generatedContent.filter((c: any) => c.status === 'published').length,
        totalContacts: contactSubmissions.length,
        newContacts: contactSubmissions.filter((c: any) => c.status === 'new').length
      };

      setStats(calculatedStats);

      // Create activity log from recent data
      const activities = [
        ...contentRequests.slice(0, 10).map((r: any) => ({
          id: r.id,
          timestamp: new Date(r.created_at),
          message: `Content request: ${r.content_type} - ${r.status}`,
          type: r.status
        })),
        ...generatedContent.slice(0, 10).map((c: any) => ({
          id: c.id,
          timestamp: new Date(c.created_at),
          message: `Generated: ${c.title}`,
          type: 'completed'
        })),
        ...contactSubmissions.slice(0, 10).map((c: any) => ({
          id: c.id,
          timestamp: new Date(c.created_at),
          message: `Contact: ${c.name} - ${c.email}`,
          type: 'contact'
        }))
      ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      setActivityLog(activities);

      setLastSync(new Date());
      setSyncStatus('live');

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setSyncStatus('error');
    }
  };

  const startAIGeneration = async () => {
    if (!generationForm.targetKeywords.trim()) {
      toast({
        title: "Missing Keywords",
        description: "Please enter target keywords for content generation",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setCurrentStep('Starting comprehensive AI content generation...');
    
    // Reset generation steps
    setGenerationSteps(steps => steps.map(step => ({ ...step, status: 'pending', progress: 0 })));

    try {
      // Step 1: Create content request
      console.log('Creating content request with data:', {
        title: `AI Generated ${generationForm.contentType}`,
        content_type: generationForm.contentType,
        target_keywords: generationForm.targetKeywords.split(',').map(k => k.trim()),
        status: 'processing',
        progress: 0
      });

      const { data: requestData, error: requestError } = await supabase
        .from('content_requests')
        .insert({
          title: `AI Generated ${generationForm.contentType}`,
          content_type: generationForm.contentType,
          target_keywords: generationForm.targetKeywords.split(',').map(k => k.trim()),
          status: 'processing',
          progress: 0
        })
        .select()
        .single();

      if (requestError) {
        console.error('Content request creation error:', requestError);
        throw new Error(`Failed to create content request: ${requestError.message}`);
      }

      console.log('Content request created successfully:', requestData);

      // Step 1: Keyword Research
      setCurrentStep('🔍 Researching keywords and analyzing search trends...');
      setGenerationProgress(10);
      updateGenerationStep('research', 'processing', 25);

      console.log('Invoking keyword-research-agent with:', {
        requestId: requestData.id,
        keywords: generationForm.targetKeywords.split(',').map(k => k.trim())
      });

      const { data: keywordData, error: keywordError } = await supabase.functions.invoke('keyword-research-agent', {
        body: {
          requestId: requestData.id,
          keywords: generationForm.targetKeywords.split(',').map(k => k.trim())
        }
      });

      if (keywordError) {
        console.error('Keyword research error:', keywordError);
        throw new Error(`Keyword research failed: ${keywordError.message}`);
      }
      
      if (!keywordData || !keywordData.success) {
        console.error('Keyword research returned invalid data:', keywordData);
        throw new Error('Keyword research returned invalid data');
      }
      
      console.log('Keyword research completed successfully:', keywordData);
      updateGenerationStep('research', 'completed', 100);

      // Step 2: SERP Analysis
      setCurrentStep('📊 Analyzing search engine results and competitor content...');
      setGenerationProgress(25);
      updateGenerationStep('serp', 'processing', 50);

      const { data: serpData, error: serpError } = await supabase.functions.invoke('serp-analysis-agent', {
        body: {
          requestId: requestData.id,
          targetKeyword: keywordData.primaryKeyword || generationForm.targetKeywords.split(',')[0].trim()
        }
      });

      if (serpError) {
        console.error('SERP analysis error:', serpError);
        throw new Error(`SERP analysis failed: ${serpError.message}`);
      }
      
      if (!serpData || !serpData.success) {
        throw new Error('SERP analysis returned invalid data');
      }
      
      updateGenerationStep('serp', 'completed', 100);

      // Step 3: Content Generation
    setCurrentStep('✍️ Generating SEO-optimized content with Google Gemini...');
      setGenerationProgress(50);
      updateGenerationStep('outline', 'processing', 75);
      updateGenerationStep('content', 'processing', 25);

      const { data: contentData, error: contentError } = await supabase.functions.invoke('content-generator-agent', {
        body: {
          requestId: requestData.id,
          contentType: generationForm.contentType,
          targetKeywords: keywordData.keywords || generationForm.targetKeywords.split(',').map(k => k.trim()),
          customInstructions: generationForm.customInstructions,
          contentLength: generationForm.contentLength,
          seoFocus: generationForm.seoFocus,
          brandAwareness: generationForm.brandAwareness
        }
      });

      if (contentError) {
        console.error('Content generation error:', contentError);
        throw new Error(`Content generation failed: ${contentError.message}`);
      }
      
      if (!contentData || !contentData.success) {
        throw new Error('Content generation returned invalid data');
      }
      
      updateGenerationStep('outline', 'completed', 100);
      updateGenerationStep('content', 'completed', 100);

      // Step 4: Image Generation (if enabled)
      if (generationForm.includeImages && contentData.contentData) {
        setCurrentStep('🎨 Creating custom images with BFL Flux Kontext Pro...');
      setGenerationProgress(80);
        updateGenerationStep('images', 'processing', 50);

        try {
      const { data: imageData, error: imageError } = await supabase.functions.invoke('image-generator-agent', {
        body: {
          requestId: requestData.id,
          content: contentData.contentData.content,
          title: contentData.contentData.title
        }
      });

          if (imageError) {
            console.warn('Image generation failed:', imageError);
            updateGenerationStep('images', 'failed', 0);
          } else if (imageData && imageData.success) {
            updateGenerationStep('images', 'completed', 100);
          } else {
            updateGenerationStep('images', 'failed', 0);
          }
        } catch (imageError) {
          console.warn('Image generation error:', imageError);
          updateGenerationStep('images', 'failed', 0);
        }
      } else {
        updateGenerationStep('images', 'skipped', 100);
      }

      setCurrentStep('✅ Generation completed successfully!');
      setGenerationProgress(100);

      // Update request status to completed
      await supabase
        .from('content_requests')
        .update({ 
          status: 'completed', 
          progress: 100,
          completed_at: new Date().toISOString()
        })
        .eq('id', requestData.id);

      toast({
        title: "Content Generated Successfully",
        description: "Your AI-powered content package is ready!",
      });

      // Refresh data
      await loadDashboardData();

    } catch (error: any) {
      console.error('Generation error:', error);
      
      toast({
        title: "Generation Failed",
        description: error.message || 'An unexpected error occurred',
        variant: "destructive",
      });
      
      // Mark current step as failed
      const currentStepIndex = generationSteps.findIndex(step => step.status === 'processing');
      if (currentStepIndex !== -1) {
        updateGenerationStep(generationSteps[currentStepIndex].id, 'failed', 0);
      }
    } finally {
      setIsGenerating(false);
      setTimeout(() => {
        setGenerationProgress(0);
        setCurrentStep('');
        setGenerationSteps(steps => steps.map(step => ({ ...step, status: 'pending', progress: 0 })));
      }, 5000);
    }
  };

  const handleContentPreview = (content: any) => {
    setSelectedContent(content);
    setShowContentPreview(true);
  };

  const handlePublishContent = async (contentId: string) => {
    try {
      await supabase
        .from('generated_content')
        .update({ 
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', contentId);

      toast({
        title: "Content Published",
        description: "Content has been published successfully",
      });

      loadDashboardData();
    } catch (error: any) {
      toast({
        title: "Publish Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUnpublishContent = async (contentId: string) => {
    try {
      await supabase
        .from('generated_content')
        .update({ 
          status: 'draft',
          published_at: null
        })
        .eq('id', contentId);

      toast({
        title: "Content Unpublished",
        description: "Content has been unpublished and moved to draft",
      });

      loadDashboardData();
    } catch (error: any) {
      toast({
        title: "Unpublish Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    if (!confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      return;
    }

    try {
      await supabase
        .from('generated_content')
        .delete()
        .eq('id', contentId);

      toast({
        title: "Content Deleted",
        description: "Content has been permanently deleted",
      });

      setShowContentPreview(false);
      setSelectedContent(null);
      loadDashboardData();
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditContent = async (contentId: string, updatedContent: any) => {
    try {
      await supabase
        .from('generated_content')
        .update({
          title: updatedContent.title,
          content: updatedContent.content,
          meta_description: updatedContent.meta_description,
          seo_tags: updatedContent.seo_tags,
          categories: updatedContent.categories,
          updated_at: new Date().toISOString()
        })
        .eq('id', contentId);

      toast({
        title: "Content Updated",
        description: "Content has been updated successfully",
      });

      setShowContentPreview(false);
      setSelectedContent(null);
      loadDashboardData();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRegenerateContent = async (contentId: string) => {
    try {
      // Get the original content request
      const content = generatedContent.find((c: any) => c.id === contentId);
      if (!content) {
        throw new Error('Content not found');
      }

      // Set up regeneration form
      setGenerationForm({
        contentType: content.categories?.[0] || 'blog',
        targetKeywords: content.seo_tags?.join(', ') || '',
        customInstructions: `Regenerate content for: ${content.title}. Original description: ${content.meta_description || ''}`,
        contentLength: '3000+',
        seoFocus: true,
        includeImages: true,
        brandAwareness: true
      });

      // Start regeneration process
      setIsGenerating(true);
      setGenerationProgress(0);
      setCurrentStep('Regenerating content...');

      // Call the content generation function
      const response = await supabase.functions.invoke('content-generator-agent', {
        body: {
          title: content.title,
          contentType: content.categories?.[0] || 'blog',
          targetKeywords: content.seo_tags?.join(', ') || '',
          description: content.meta_description || '',
          regenerate: true,
          originalContentId: contentId
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data?.success) {
        toast({
          title: "Content Regenerated",
          description: "Content has been regenerated successfully",
        });
        
        // Update the existing content
        await supabase
          .from('generated_content')
          .update({
            content: response.data.content,
            outline: response.data.outline,
            updated_at: new Date().toISOString()
          })
          .eq('id', contentId);
      } else {
        throw new Error(response.data?.error || 'Failed to regenerate content');
      }

      loadDashboardData();
    } catch (error: any) {
      console.error('Regeneration error:', error);
      toast({
        title: "Regeneration Failed",
        description: error.message || 'An unexpected error occurred',
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
      setCurrentStep('');
    }
  };

  const handleContactPreview = (contact: any) => {
    setSelectedContact(contact);
    setShowContactPreview(true);
  };

  const handleUpdateContactStatus = async (contactId: string, status: string) => {
    try {
      await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', contactId);

      toast({
        title: "Status Updated",
        description: `Contact marked as ${status}`,
      });

      loadDashboardData();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Chatbot management functions
  const loadChatbotData = async () => {
    try {
      setLoadingChatbot(true);
      console.log('Loading chatbot configuration...');
      
      // First, try to get any existing configuration
      let { data: config, error: configError } = await supabase
        .from('chatbot_configuration')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      // Define a type for the config that can be either from DB or default
      type ConfigType = typeof config & {
        system_instruction: string;
        temperature: number;
        model: string;
        is_active: boolean;
      };

      console.log('Chatbot config query result:', { config, configError });

      if (!config) {
        console.log('No active chatbot configuration found, using default...');
        
        // Use default configuration in memory
        const defaultConfig = {
          system_instruction: 'You are an AI assistant for **Agentic AI AMRO Ltd**, a leading AI automation agency based in Tunbridge Wells, Kent, UK. Your role is to help potential clients understand our services, schedule consultations, and provide information about AI automation solutions.\n\n### PERSONALITY & TONE:\n- **Professional yet approachable**\n- **Enthusiastic about AI technology**\n- **Solution-focused and consultative**\n- **Concise but informative**\n- **Always helpful and responsive**\n\n### PRIMARY OBJECTIVES:\n1. **Qualify leads** and understand their business needs\n2. **Schedule free consultations** via Calendly link\n3. **Explain our services** clearly and compellingly\n4. **Collect contact information** for follow-up\n5. **Position us as AI automation experts**',
          temperature: 1.2,
          model: 'gemini-2.5-pro',
          is_active: true
        } as const;
        
        // Use default config in memory
        config = defaultConfig as ConfigType;
        
        toast({
          title: "Default Configuration Loaded",
          description: "Using default chatbot configuration. Please update settings to save to database.",
        });
      }
      
      if (config) {
        setChatbotConfig({
          systemInstruction: config.system_instruction,
          temperature: config.temperature || 1.2,
          model: config.model || 'gemini-2.5-pro',
          isActive: config.is_active || true
        });
      }

      console.log('Loading chatbot conversations...');
      
      // Load chatbot conversations
      const { data: conversations, error: convError } = await supabase
        .from('chatbot_conversations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      console.log('Chatbot conversations query result:', { conversations, convError });

      if (conversations && !convError) {
        setChatbotConversations(conversations);
      } else if (convError) {
        console.error('Error loading chatbot conversations:', convError);
      }
    } catch (error) {
      console.error('Error loading chatbot data:', error);
    } finally {
      setLoadingChatbot(false);
    }
  };

  const updateChatbotConfig = async () => {
    try {
      // First check if a configuration exists
      const { data: existingConfig } = await supabase
        .from('chatbot_configuration')
        .select('id')
        .eq('is_active', true)
        .maybeSingle();

      let result;
      
      if (existingConfig) {
        // Update existing configuration
        result = await supabase
          .from('chatbot_configuration')
          .update({
            system_instruction: chatbotConfig.systemInstruction,
            temperature: chatbotConfig.temperature,
            model: chatbotConfig.model,
            is_active: chatbotConfig.isActive,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingConfig.id);
      } else {
        // Create new configuration
        result = await supabase
          .from('chatbot_configuration')
          .insert([{
            system_instruction: chatbotConfig.systemInstruction,
            temperature: chatbotConfig.temperature,
            model: chatbotConfig.model,
            is_active: chatbotConfig.isActive
          }] as const);
      }

      if (result.error) throw result.error;

      toast({
        title: "Configuration Updated",
        description: "Chatbot configuration has been updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating chatbot config:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update configuration",
        variant: "destructive",
      });
    }
  };

  const handleConversationPreview = (conversation: any) => {
    setSelectedConversation(conversation);
    setShowConversationPreview(true);
  };

  const handleUpdateConversationStatus = async (conversationId: string, status: string) => {
    try {
      await supabase
        .from('chatbot_conversations')
        .update({ status })
        .eq('id', conversationId);

      toast({
        title: "Status Updated",
        description: `Conversation marked as ${status}`,
      });

      loadChatbotData();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const loadContactSubmissions = async () => {
    try {
      const { data: contacts, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error loading contact submissions:', error);
      } else {
        setContactSubmissions(contacts || []);
      }
    } catch (error) {
      console.error('Error loading contact submissions:', error);
    }
  };

  const loadContentRequests = async () => {
    try {
      const { data: requests, error } = await supabase
        .from('content_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error loading content requests:', error);
      } else {
        setContentRequests(requests || []);
      }
    } catch (error) {
      console.error('Error loading content requests:', error);
    }
  };

  const loadGeneratedContent = async () => {
    try {
      const { data: content, error } = await supabase
        .from('generated_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error loading generated content:', error);
      } else {
        setGeneratedContent(content || []);
      }
    } catch (error) {
      console.error('Error loading generated content:', error);
    }
  };

  const handleRefresh = async () => {
    setSyncStatus('syncing');
    try {
      await loadDashboardData();
      toast({
        title: "Data Refreshed",
        description: "Dashboard data has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh dashboard data.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-purple-300 text-lg">Loading Agentic AI Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border-purple-500/20 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Agentic AI
            </CardTitle>
            <CardDescription className="text-gray-300">
              Admin Dashboard - Advanced Content Management System
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="bg-gray-800/50 border-gray-600 text-white"
                  placeholder="info@agentic-ai.ltd"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="bg-gray-800/50 border-gray-600 text-white"
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-purple-500/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Agentic AI
            </h1>
            <Badge variant="outline" className="border-purple-400 text-purple-300">
              Advanced Content Management System
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${syncStatus === 'live' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-300">
                {syncStatus === 'live' ? 'Live' : 'Syncing'}
              </span>
              <span className="text-xs text-gray-500">
                {lastSync.toLocaleTimeString()}
              </span>
            </div>
            
            <Button 
              onClick={handleRefresh}
              variant="outline" 
              size="sm" 
              className="border-green-400 text-green-300 hover:bg-green-500/20"
              disabled={syncStatus === 'syncing'}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button variant="outline" size="sm" className="border-purple-400 text-purple-300">
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate Sitemap
            </Button>
            
            <Button 
              onClick={handleLogout}
              variant="outline" 
              size="sm"
              className="border-red-400 text-red-300 hover:bg-red-500/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 hover:border-purple-400/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Content</CardTitle>
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalContent}</div>
              <p className="text-xs text-gray-400">{stats.publishedContent} published</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 hover:border-purple-400/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Active Requests</CardTitle>
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.activeRequests}</div>
              <p className="text-xs text-gray-400">In progress</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 hover:border-purple-400/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">AI Usage</CardTitle>
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${stats.apiUsage.toFixed(2)}</div>
              <p className="text-xs text-gray-400">Last 30 days</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 hover:border-purple-400/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium text-gray-300">Success Rate</CardTitle>
               <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold text-white">95%</div>
               <p className="text-xs text-gray-400">Content generation</p>
             </CardContent>
           </Card>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 hover:border-purple-400/40 transition-colors">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium text-gray-300">Contact Forms</CardTitle>
               <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold text-white">{stats.totalContacts}</div>
               <p className="text-xs text-gray-400">{stats.newContacts} new</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="ai-generator" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6 bg-black/40 backdrop-blur-xl border-purple-500/20">
                <TabsTrigger value="ai-generator" className="data-[state=active]:bg-purple-500/20">
                  <Brain className="w-4 h-4 mr-2" />
                  AI Generator
                </TabsTrigger>
                <TabsTrigger value="content" className="data-[state=active]:bg-purple-500/20">
                  <FileText className="w-4 h-4 mr-2" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="requests" className="data-[state=active]:bg-purple-500/20">
                  <Activity className="w-4 h-4 mr-2" />
                  Requests
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-500/20">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="contacts" className="data-[state=active]:bg-purple-500/20">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Forms
                </TabsTrigger>
                <TabsTrigger value="chatbot" className="data-[state=active]:bg-purple-500/20">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chatbot
                </TabsTrigger>
              </TabsList>

              {/* AI Generator Tab */}
              <TabsContent value="ai-generator" className="space-y-6">
                <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                      Advanced AI Content Generation
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                       Generate comprehensive, SEO-optimized content using Google Gemini AI, advanced research, and BFL Flux images
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Generation Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-200">Content Type</Label>
                        <Select 
                          value={generationForm.contentType} 
                          onValueChange={(value) => setGenerationForm({...generationForm, contentType: value})}
                        >
                          <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="blog">Blog Post</SelectItem>
                            <SelectItem value="page">Landing Page</SelectItem>
                            <SelectItem value="service">Service Page</SelectItem>
                            <SelectItem value="resource">Resource Guide</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-200">Content Length</Label>
                        <Select 
                          value={generationForm.contentLength} 
                          onValueChange={(value) => setGenerationForm({...generationForm, contentLength: value})}
                        >
                          <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="1500+">1500+ words</SelectItem>
                            <SelectItem value="2500+">2500+ words</SelectItem>
                            <SelectItem value="3000+">3000+ words</SelectItem>
                            <SelectItem value="5000+">5000+ words</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-200">Target Keywords (comma-separated)</Label>
                        <Input
                          value={generationForm.targetKeywords}
                          onChange={(e) => setGenerationForm({...generationForm, targetKeywords: e.target.value})}
                          className="bg-gray-800/50 border-gray-600 text-white"
                        placeholder="AI automation, business efficiency, machine learning"
                        />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-200">Custom Instructions (optional)</Label>
                      <Textarea
                        value={generationForm.customInstructions}
                        onChange={(e) => setGenerationForm({...generationForm, customInstructions: e.target.value})}
                        className="bg-gray-800/50 border-gray-600 text-white min-h-[100px]"
                        placeholder="Add specific requirements, tone preferences, or brand guidelines..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="seoFocus"
                          checked={generationForm.seoFocus}
                          onChange={(e) => setGenerationForm({...generationForm, seoFocus: e.target.checked})}
                          className="rounded border-gray-600 bg-gray-800"
                        />
                        <Label htmlFor="seoFocus" className="text-gray-200">SEO Optimized</Label>
                        </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="includeImages"
                          checked={generationForm.includeImages}
                          onChange={(e) => setGenerationForm({...generationForm, includeImages: e.target.checked})}
                          className="rounded border-gray-600 bg-gray-800"
                        />
                        <Label htmlFor="includeImages" className="text-gray-200">Include Images</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="brandAwareness"
                          checked={generationForm.brandAwareness}
                          onChange={(e) => setGenerationForm({...generationForm, brandAwareness: e.target.checked})}
                          className="rounded border-gray-600 bg-gray-800"
                        />
                        <Label htmlFor="brandAwareness" className="text-gray-200">Brand Awareness</Label>
                      </div>
                    </div>

                    <Button 
                      onClick={startAIGeneration}
                      disabled={isGenerating}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      {isGenerating ? (
                        <>
                          <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                          Generating Content...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Start AI Generation
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Generation Progress */}
                {isGenerating && (
                  <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                    <CardHeader>
                      <CardTitle className="text-white">Generation Progress</CardTitle>
                      <CardDescription className="text-gray-300">{currentStep}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Progress value={generationProgress} className="h-2" />
                      
                      <div className="space-y-3">
                        {generationSteps.map((step) => (
                          <div key={step.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {step.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-400" />}
                              {step.status === 'processing' && <RotateCcw className="w-4 h-4 text-blue-400 animate-spin" />}
                              {step.status === 'failed' && <XCircle className="w-4 h-4 text-red-400" />}
                              {step.status === 'pending' && <Clock className="w-4 h-4 text-gray-400" />}
                              {step.status === 'skipped' && <AlertCircle className="w-4 h-4 text-yellow-400" />}
                              <span className="text-gray-200">{step.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Progress value={step.progress} className="w-20 h-1" />
                              <span className="text-xs text-gray-400">{step.progress}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-6">
                <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                      <CardHeader>
                    <CardTitle className="text-white">Generated Content</CardTitle>
                            <CardDescription className="text-gray-300">
                      Manage and publish your AI-generated content
                            </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {generatedContent.map((content) => (
                        <div key={content.id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                          <div className="flex-1">
                            <h3 className="text-white font-medium">{content.title}</h3>
                            <p className="text-gray-400 text-sm">{content.content_type}</p>
                            <div className="flex items-center space-x-2 mt-2">
                            <Badge variant={content.status === 'published' ? 'default' : 'secondary'}>
                              {content.status}
                            </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(content.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleContentPreview(content)}
                              className="border-purple-400 text-purple-300"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {content.status !== 'published' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePublishContent(content.id)}
                                className="border-green-400 text-green-300"
                              >
                                <CheckCircle className="w-4 h-4" />
                            </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Requests Tab */}
              <TabsContent value="requests" className="space-y-6">
                <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">Content Requests</CardTitle>
                    <CardDescription className="text-gray-300">
                      Track the status of your content generation requests
                    </CardDescription>
                      </CardHeader>
                      <CardContent>
                    <div className="space-y-4">
                      {contentRequests.map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                          <div className="flex-1">
                            <h3 className="text-white font-medium">{request.title}</h3>
                            <p className="text-gray-400 text-sm">{request.content_type}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant={request.status === 'completed' ? 'default' : 'secondary'}>
                                {request.status}
                            </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(request.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Progress value={request.progress || 0} className="w-20" />
                            <span className="text-xs text-gray-400">{request.progress || 0}%</span>
                          </div>
                        </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">Content Analytics</CardTitle>
                    <CardDescription className="text-gray-300">
                      Performance metrics and insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-white font-medium">Content Distribution</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-300">Blog Posts</span>
                            <span className="text-white">{stats.totalBlogs}</span>
                      </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Pages</span>
                            <span className="text-white">{stats.totalPages}</span>
                      </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Services</span>
                            <span className="text-white">{stats.totalServices}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Resources</span>
                            <span className="text-white">{stats.totalResources}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-white font-medium">API Usage</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-300">Total Cost</span>
                            <span className="text-white">${stats.apiUsage.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Success Rate</span>
                            <span className="text-white">95%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

               {/* Contact Forms Tab */}
               <TabsContent value="contacts" className="space-y-6">
                <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                  <CardHeader>
                     <CardTitle className="text-white">Contact Form Submissions</CardTitle>
                    <CardDescription className="text-gray-300">
                       Manage and respond to contact form submissions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                       {contactSubmissions.map((submission) => (
                         <div key={submission.id} className="flex items-start justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                           <div className="flex-1">
                             <div className="flex items-center gap-3 mb-2">
                               <h3 className="text-white font-medium">{submission.name}</h3>
                               <Badge variant={submission.status === 'new' ? 'default' : 'secondary'}>
                                 {submission.status}
                               </Badge>
                             </div>
                             <p className="text-gray-400 text-sm mb-1">{submission.email}</p>
                             {submission.company && (
                               <p className="text-gray-400 text-sm mb-1">Company: {submission.company}</p>
                             )}
                             {submission.phone && (
                               <p className="text-gray-400 text-sm mb-1">Phone: {submission.phone}</p>
                             )}
                             {submission.service && (
                               <p className="text-gray-400 text-sm mb-1">Service: {submission.service}</p>
                             )}
                             {submission.budget && (
                               <p className="text-gray-400 text-sm mb-1">Budget: {submission.budget}</p>
                             )}
                             <p className="text-gray-300 text-sm mt-2">{submission.message}</p>
                             <div className="flex items-center gap-4 mt-2">
                               <span className="text-xs text-gray-500">
                                 {new Date(submission.created_at).toLocaleDateString()}
                               </span>
                               {submission.admin_notes && (
                                 <span className="text-xs text-gray-500">
                                   Notes: {submission.admin_notes}
                                 </span>
                               )}
                             </div>
                           </div>
                           <div className="flex items-center space-x-2">
                             <Button
                               variant="outline"
                               size="sm"
                               onClick={() => handleContactPreview(submission)}
                               className="border-purple-400 text-purple-300"
                             >
                               <Eye className="w-4 h-4" />
                      </Button>
                             <Button
                               variant="outline"
                               size="sm"
                               onClick={() => handleUpdateContactStatus(submission.id, 'contacted')}
                               className="border-green-400 text-green-300"
                               disabled={submission.status !== 'new'}
                             >
                               <CheckCircle className="w-4 h-4" />
                      </Button>
                           </div>
                         </div>
                       ))}
                     </div>
                   </CardContent>
                 </Card>
               </TabsContent>

               {/* Chatbot Tab */}
               <TabsContent value="chatbot" className="space-y-6">
                 {/* Chatbot Configuration */}
                 <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                   <CardHeader>
                     <CardTitle className="text-white">Chatbot Configuration</CardTitle>
                     <CardDescription className="text-gray-300">
                       Customize the AI chatbot behavior and responses
                     </CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <Label className="text-gray-200">Model</Label>
                         <Select 
                           value={chatbotConfig.model} 
                           onValueChange={(value) => setChatbotConfig({...chatbotConfig, model: value})}
                         >
                           <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                             <SelectValue />
                           </SelectTrigger>
                           <SelectContent className="bg-gray-800 border-gray-600">
                             <SelectItem value="gemini-2.5-pro">Gemini 2.5 Pro</SelectItem>
                             <SelectItem value="gemini-2.0-pro">Gemini 2.0 Pro</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>

                       <div className="space-y-2">
                         <Label className="text-gray-200">Temperature</Label>
                         <Input
                           type="number"
                           min="0"
                           max="2"
                           step="0.1"
                           value={chatbotConfig.temperature}
                           onChange={(e) => setChatbotConfig({...chatbotConfig, temperature: parseFloat(e.target.value)})}
                           className="bg-gray-800/50 border-gray-600 text-white"
                         />
                       </div>
                     </div>

                     <div className="space-y-2">
                       <Label className="text-gray-200">System Instruction</Label>
                       <Textarea
                         value={chatbotConfig.systemInstruction}
                         onChange={(e) => setChatbotConfig({...chatbotConfig, systemInstruction: e.target.value})}
                         className="bg-gray-800/50 border-gray-600 text-white min-h-[200px]"
                         placeholder="Enter the system instruction for the chatbot..."
                       />
                     </div>

                     <div className="flex items-center space-x-2">
                       <input
                         type="checkbox"
                         id="isActive"
                         checked={chatbotConfig.isActive}
                         onChange={(e) => setChatbotConfig({...chatbotConfig, isActive: e.target.checked})}
                         className="rounded border-gray-600 bg-gray-800"
                       />
                       <Label htmlFor="isActive" className="text-gray-200">Active</Label>
                     </div>

                     <Button 
                       onClick={updateChatbotConfig}
                       className="bg-purple-600 hover:bg-purple-700"
                     >
                       Update Configuration
                      </Button>
                   </CardContent>
                 </Card>

                 {/* Chatbot Conversations */}
                 <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                   <CardHeader>
                     <CardTitle className="text-white">Recent Conversations</CardTitle>
                     <CardDescription className="text-gray-300">
                       Monitor and manage chatbot conversations
                     </CardDescription>
                   </CardHeader>
                   <CardContent>
                     {loadingChatbot ? (
                       <div className="flex items-center justify-center py-8">
                         <div className="flex items-center space-x-2">
                           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
                           <span className="text-gray-300">Loading conversations...</span>
                         </div>
                       </div>
                     ) : (
                       <div className="space-y-4">
                         {chatbotConversations.length === 0 ? (
                           <div className="text-center py-8">
                             <p className="text-gray-400">No conversations yet. Start chatting to see conversations here!</p>
                           </div>
                         ) : (
                           chatbotConversations.map((conversation) => (
                             <div key={conversation.id} className="flex items-start justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                               <div className="flex-1">
                                 <div className="flex items-center gap-3 mb-2">
                                   <h3 className="text-white font-medium">
                                     {conversation.user_name || 'Anonymous User'}
                                   </h3>
                                   <Badge variant={conversation.status === 'active' ? 'default' : 'secondary'}>
                                     {conversation.status}
                                   </Badge>
                                 </div>
                                 {conversation.user_email && (
                                   <p className="text-gray-400 text-sm mb-1">{conversation.user_email}</p>
                                 )}
                                 {conversation.company && (
                                   <p className="text-gray-400 text-sm mb-1">Company: {conversation.company}</p>
                                 )}
                                 {conversation.phone && (
                                   <p className="text-gray-400 text-sm mb-1">Phone: {conversation.phone}</p>
                                 )}
                                 <div className="flex items-center gap-4 mt-2">
                                   <span className="text-xs text-gray-500">
                                     Session: {conversation.session_id.substring(0, 8)}...
                                   </span>
                                   <span className="text-xs text-gray-500">
                                     {new Date(conversation.created_at).toLocaleDateString()}
                                   </span>
                                   {conversation.lead_score && (
                                     <span className="text-xs text-purple-400">
                                       Lead Score: {conversation.lead_score}
                                     </span>
                                   )}
                                 </div>
                               </div>
                               <div className="flex items-center space-x-2">
                                 <Button
                                   variant="outline"
                                   size="sm"
                                   onClick={() => handleConversationPreview(conversation)}
                                   className="border-purple-400 text-purple-300"
                                 >
                                   <Eye className="w-4 h-4" />
                                 </Button>
                                 <Button
                                   variant="outline"
                                   size="sm"
                                   onClick={() => handleUpdateConversationStatus(conversation.id, 'qualified')}
                                   className="border-green-400 text-green-300"
                                   disabled={conversation.status === 'qualified'}
                                 >
                                   <CheckCircle className="w-4 h-4" />
                                 </Button>
                               </div>
                             </div>
                           ))
                         )}
                       </div>
                     )}
                   </CardContent>
                 </Card>
               </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Activity Feed */}
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Activity Feed</CardTitle>
                <CardDescription className="text-gray-300">
                  Real-time updates and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {activityLog.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'completed' ? 'bg-green-400' :
                        activity.type === 'processing' ? 'bg-blue-400' :
                        activity.type === 'failed' ? 'bg-red-400' : 'bg-gray-400'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-200">{activity.message}</p>
                        <p className="text-xs text-gray-500">
                          [{activity.timestamp.toLocaleTimeString()}]
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full border-purple-400 text-purple-300">
                  <Download className="w-4 h-4 mr-2" />
                  Export Content
                </Button>
                <Button variant="outline" className="w-full border-blue-400 text-blue-300">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync Data
                </Button>
                <Button variant="outline" className="w-full border-green-400 text-green-300">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

             {/* Content Preview/Edit Dialog */}
       <Dialog open={showContentPreview} onOpenChange={setShowContentPreview}>
         <DialogContent className="max-w-6xl max-h-[90vh] bg-gray-900 border-purple-500/20">
           <DialogHeader>
             <DialogTitle className="text-white flex items-center justify-between">
               <span>{isEditingContent ? 'Edit Content' : selectedContent?.title}</span>
               <div className="flex gap-2">
                 {!isEditingContent && (
                   <>
                     <Button
                       size="sm"
                       variant="outline"
                       onClick={() => {
                         setIsEditingContent(true);
                         setEditingContent({
                           title: selectedContent?.title || '',
                           content: selectedContent?.content || '',
                           meta_description: selectedContent?.meta_description || '',
                           seo_tags: selectedContent?.seo_tags || [],
                           categories: selectedContent?.categories || []
                         });
                       }}
                     >
                       <Edit className="w-4 h-4 mr-2" />
                       Edit
                     </Button>
                     <Button
                       size="sm"
                       variant="outline"
                       onClick={() => handleRegenerateContent(selectedContent?.id)}
                       disabled={isGenerating}
                     >
                       <RotateCcw className="w-4 h-4 mr-2" />
                       Regenerate
                     </Button>
                     {selectedContent?.status === 'published' ? (
                       <Button
                         size="sm"
                         variant="outline"
                         onClick={() => handleUnpublishContent(selectedContent?.id)}
                       >
                         <EyeOff className="w-4 h-4 mr-2" />
                         Unpublish
                       </Button>
                     ) : (
                       <Button
                         size="sm"
                         variant="outline"
                         onClick={() => handlePublishContent(selectedContent?.id)}
                       >
                         <Eye className="w-4 h-4 mr-2" />
                         Publish
                       </Button>
                     )}
                     <Button
                       size="sm"
                       variant="destructive"
                       onClick={() => handleDeleteContent(selectedContent?.id)}
                     >
                       <Trash2 className="w-4 h-4 mr-2" />
                       Delete
                     </Button>
                   </>
                 )}
                 {isEditingContent && (
                   <>
                     <Button
                       size="sm"
                       variant="default"
                       onClick={() => {
                         handleEditContent(selectedContent?.id, editingContent);
                       }}
                     >
                       <Save className="w-4 h-4 mr-2" />
                       Save
                     </Button>
                     <Button
                       size="sm"
                       variant="outline"
                       onClick={() => {
                         setIsEditingContent(false);
                         setEditingContent(null);
                       }}
                     >
                       <X className="w-4 h-4 mr-2" />
                       Cancel
                     </Button>
                   </>
                 )}
               </div>
             </DialogTitle>
             <DialogDescription className="text-gray-300">
               {isEditingContent ? 'Edit content details' : 'Preview and manage generated content'}
             </DialogDescription>
           </DialogHeader>
           
           {isEditingContent ? (
             // Edit Mode
             <div className="space-y-4 max-h-[70vh] overflow-y-auto">
               <div className="grid grid-cols-1 gap-4">
                 <div>
                   <Label className="text-gray-300">Title</Label>
                   <Input
                     value={editingContent?.title || ''}
                     onChange={(e) => setEditingContent(prev => ({ ...prev, title: e.target.value }))}
                     className="bg-gray-800 border-gray-600 text-white"
                   />
                 </div>
                 <div>
                   <Label className="text-gray-300">Meta Description</Label>
                   <Textarea
                     value={editingContent?.meta_description || ''}
                     onChange={(e) => setEditingContent(prev => ({ ...prev, meta_description: e.target.value }))}
                     className="bg-gray-800 border-gray-600 text-white"
                     rows={3}
                   />
                 </div>
                 <div>
                   <Label className="text-gray-300">SEO Tags (comma-separated)</Label>
                   <Input
                     value={editingContent?.seo_tags?.join(', ') || ''}
                     onChange={(e) => setEditingContent(prev => ({ 
                       ...prev, 
                       seo_tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                     }))}
                     className="bg-gray-800 border-gray-600 text-white"
                   />
                 </div>
                 <div>
                   <Label className="text-gray-300">Categories (comma-separated)</Label>
                   <Input
                     value={editingContent?.categories?.join(', ') || ''}
                     onChange={(e) => setEditingContent(prev => ({ 
                       ...prev, 
                       categories: e.target.value.split(',').map(cat => cat.trim()).filter(cat => cat)
                     }))}
                     className="bg-gray-800 border-gray-600 text-white"
                   />
                 </div>
                 <div>
                   <Label className="text-gray-300">Content</Label>
                   <Textarea
                     value={editingContent?.content || ''}
                     onChange={(e) => setEditingContent(prev => ({ ...prev, content: e.target.value }))}
                     className="bg-gray-800 border-gray-600 text-white font-mono text-sm"
                     rows={20}
                   />
                 </div>
               </div>
             </div>
           ) : (
             // Preview Mode
             <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4 text-sm">
                 <div>
                   <Label className="text-gray-300">Status</Label>
                   <Badge variant={selectedContent?.status === 'published' ? 'default' : 'secondary'}>
                     {selectedContent?.status}
                   </Badge>
                 </div>
                 <div>
                   <Label className="text-gray-300">Created</Label>
                   <p className="text-white">{selectedContent?.created_at ? new Date(selectedContent.created_at).toLocaleString() : ''}</p>
                 </div>
                 {selectedContent?.published_at && (
                   <div>
                     <Label className="text-gray-300">Published</Label>
                     <p className="text-white">{new Date(selectedContent.published_at).toLocaleString()}</p>
                   </div>
                 )}
                 <div>
                   <Label className="text-gray-300">Categories</Label>
                   <p className="text-white">{selectedContent?.categories?.join(', ') || 'None'}</p>
                 </div>
               </div>
               
               {selectedContent?.meta_description && (
                 <div>
                   <Label className="text-gray-300">Meta Description</Label>
                   <p className="text-white text-sm">{selectedContent.meta_description}</p>
                 </div>
               )}
               
               {selectedContent?.seo_tags && selectedContent.seo_tags.length > 0 && (
                 <div>
                   <Label className="text-gray-300">SEO Tags</Label>
                   <div className="flex flex-wrap gap-2">
                     {selectedContent.seo_tags.map((tag: string, index: number) => (
                       <Badge key={index} variant="outline" className="text-xs">
                         {tag}
                       </Badge>
                     ))}
                   </div>
                 </div>
               )}
               
               <div>
                 <Label className="text-gray-300">Content Preview</Label>
                 <div className="max-h-96 overflow-y-auto border border-gray-700 rounded-md p-4 bg-gray-800">
                   <div className="prose prose-invert max-w-none text-sm">
                     <div dangerouslySetInnerHTML={{ __html: selectedContent?.content || '' }} />
                   </div>
                 </div>
               </div>
             </div>
           )}
         </DialogContent>
       </Dialog>

       {/* Contact Preview Dialog */}
       <Dialog open={showContactPreview} onOpenChange={setShowContactPreview}>
         <DialogContent className="max-w-2xl bg-gray-900 border-purple-500/20">
           <DialogHeader>
             <DialogTitle className="text-white">Contact Form Submission</DialogTitle>
             <DialogDescription className="text-gray-300">
               {selectedContact?.name} - {selectedContact?.email}
             </DialogDescription>
           </DialogHeader>
           <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <Label className="text-gray-300">Name</Label>
                 <p className="text-white">{selectedContact?.name}</p>
               </div>
               <div>
                 <Label className="text-gray-300">Email</Label>
                 <p className="text-white">{selectedContact?.email}</p>
               </div>
               {selectedContact?.company && (
                 <div>
                   <Label className="text-gray-300">Company</Label>
                   <p className="text-white">{selectedContact.company}</p>
                 </div>
               )}
               {selectedContact?.phone && (
                 <div>
                   <Label className="text-gray-300">Phone</Label>
                   <p className="text-white">{selectedContact.phone}</p>
                 </div>
               )}
               {selectedContact?.service && (
                 <div>
                   <Label className="text-gray-300">Service Interest</Label>
                   <p className="text-white">{selectedContact.service}</p>
                 </div>
               )}
               {selectedContact?.budget && (
                 <div>
                   <Label className="text-gray-300">Budget Range</Label>
                   <p className="text-white">{selectedContact.budget}</p>
                 </div>
               )}
             </div>
             <div>
               <Label className="text-gray-300">Message</Label>
               <p className="text-white whitespace-pre-wrap">{selectedContact?.message}</p>
             </div>
             <div className="flex items-center justify-between pt-4 border-t border-gray-700">
               <span className="text-sm text-gray-400">
                 Submitted: {selectedContact?.created_at ? new Date(selectedContact.created_at).toLocaleString() : ''}
               </span>
               <Badge variant={selectedContact?.status === 'new' ? 'default' : 'secondary'}>
                 {selectedContact?.status}
               </Badge>
             </div>
           </div>
         </DialogContent>
       </Dialog>

       {/* Conversation Preview Dialog */}
       <Dialog open={showConversationPreview} onOpenChange={setShowConversationPreview}>
         <DialogContent className="max-w-4xl bg-gray-900 border-purple-500/20">
           <DialogHeader>
             <DialogTitle className="text-white">Chatbot Conversation</DialogTitle>
             <DialogDescription className="text-gray-300">
               {selectedConversation?.user_name || 'Anonymous User'} - {selectedConversation?.user_email || 'No email'}
             </DialogDescription>
           </DialogHeader>
           <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <Label className="text-gray-300">User Name</Label>
                 <p className="text-white">{selectedConversation?.user_name || 'Anonymous'}</p>
               </div>
               <div>
                 <Label className="text-gray-300">Email</Label>
                 <p className="text-white">{selectedConversation?.user_email || 'Not provided'}</p>
               </div>
               {selectedConversation?.company && (
                 <div>
                   <Label className="text-gray-300">Company</Label>
                   <p className="text-white">{selectedConversation.company}</p>
                 </div>
               )}
               {selectedConversation?.phone && (
                 <div>
                   <Label className="text-gray-300">Phone</Label>
                   <p className="text-white">{selectedConversation.phone}</p>
                 </div>
               )}
               <div>
                 <Label className="text-gray-300">Session ID</Label>
                 <p className="text-white font-mono text-sm">{selectedConversation?.session_id}</p>
               </div>
               <div>
                 <Label className="text-gray-300">Lead Score</Label>
                 <p className="text-white">{selectedConversation?.lead_score || 0}</p>
               </div>
             </div>
             <div className="flex items-center justify-between pt-4 border-t border-gray-700">
               <span className="text-sm text-gray-400">
                 Started: {selectedConversation?.created_at ? new Date(selectedConversation.created_at).toLocaleString() : ''}
               </span>
               <Badge variant={selectedConversation?.status === 'active' ? 'default' : 'secondary'}>
                 {selectedConversation?.status}
               </Badge>
             </div>
           </div>
         </DialogContent>
       </Dialog>
    </div>
  );
};

export default AdminDashboard;