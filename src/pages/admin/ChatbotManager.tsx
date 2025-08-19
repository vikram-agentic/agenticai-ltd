import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageCircle,
  Bot,
  Users,
  Settings,
  BarChart3,
  RefreshCw,
  Save,
  Eye,
  Trash2,
  Download,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Star
} from 'lucide-react';

interface ChatbotConfig {
  id: string;
  model: string;
  temperature: number;
  system_instruction: string;
  is_active: boolean;
  max_tokens: number;
  response_style: string;
  created_at: string;
  updated_at: string;
}

interface ChatbotConversation {
  id: string;
  user_name: string;
  user_email: string;
  status: string;
  lead_score: number;
  messages: any[];
  created_at: string;
  updated_at: string;
}

const ChatbotManager = () => {
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<ChatbotConfig>({
    id: '',
    model: 'gemini-2.5-pro',
    temperature: 0.8,
    system_instruction: '',
    is_active: true,
    max_tokens: 2000,
    response_style: 'professional',
    created_at: '',
    updated_at: ''
  });
  
  const [conversations, setConversations] = useState<ChatbotConversation[]>([]);
  const [stats, setStats] = useState({
    totalConversations: 0,
    activeConversations: 0,
    averageLeadScore: 0,
    totalMessages: 0,
    responseRate: 0,
    satisfactionRate: 0
  });

  const responseStyles = [
    { value: 'professional', label: 'Professional & Formal' },
    { value: 'friendly', label: 'Friendly & Conversational' },
    { value: 'technical', label: 'Technical & Detailed' },
    { value: 'sales', label: 'Sales-Oriented' },
    { value: 'supportive', label: 'Supportive & Helpful' }
  ];

  const models = [
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
    { value: 'gemini-pro', label: 'Gemini Pro' },
    { value: 'gemini-flash', label: 'Gemini Flash' }
  ];

  useEffect(() => {
    loadChatbotData();
  }, []);

  const loadChatbotData = async () => {
    try {
      setLoading(true);
      
      // Load chatbot configuration
      const { data: configData, error: configError } = await supabase
        .from('chatbot_configuration')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (configError) {
        console.error('Error loading config:', configError);
      } else if (configData && configData.length > 0) {
        setConfig(configData[0]);
      }

      // Load conversations
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('chatbot_conversations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (conversationsError) {
        console.error('Error loading conversations:', conversationsError);
      } else {
        setConversations(conversationsData || []);
        
        // Calculate stats
        const totalConversations = conversationsData?.length || 0;
        const activeConversations = conversationsData?.filter(c => c.status === 'active').length || 0;
        const totalMessages = conversationsData?.reduce((sum, c) => sum + (c.messages?.length || 0), 0) || 0;
        const averageLeadScore = totalConversations > 0 
          ? Math.round(conversationsData.reduce((sum, c) => sum + (c.lead_score || 0), 0) / totalConversations)
          : 0;

        setStats({
          totalConversations,
          activeConversations,
          averageLeadScore,
          totalMessages,
          responseRate: 98, // Mock data
          satisfactionRate: 92 // Mock data
        });
      }

    } catch (error) {
      console.error('Error loading chatbot data:', error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load chatbot data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    try {
      const configData = {
        model: config.model,
        temperature: config.temperature,
        system_instruction: config.system_instruction,
        is_active: config.is_active,
        max_tokens: config.max_tokens,
        response_style: config.response_style,
        updated_at: new Date().toISOString()
      };

      if (config.id) {
        // Update existing config
        const { error } = await supabase
          .from('chatbot_configuration')
          .update(configData)
          .eq('id', config.id);

        if (error) throw error;
      } else {
        // Create new config
        const { data, error } = await supabase
          .from('chatbot_configuration')
          .insert({
            ...configData,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;
        setConfig(data);
      }

      toast({
        title: "Configuration Saved",
        description: "Chatbot configuration has been updated successfully",
      });

    } catch (error: any) {
      console.error('Error saving config:', error);
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save configuration",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    if (!confirm('Are you sure you want to delete this conversation?')) return;

    try {
      const { error } = await supabase
        .from('chatbot_conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;

      toast({
        title: "Conversation Deleted",
        description: "The conversation has been deleted successfully",
      });

      await loadChatbotData();
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'completed': return 'bg-blue-500/20 text-blue-400';
      case 'archived': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <MessageCircle className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'archived': return <Clock className="w-3 h-3" />;
      default: return <XCircle className="w-3 h-3" />;
    }
  };

  const getLeadScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-slate-900/60 backdrop-blur-xl border-purple-500/30">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-slate-700 rounded w-1/4 mb-4"></div>
                  <div className="h-8 bg-slate-700 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chatbot Manager</h1>
          <p className="text-gray-600">Configure and manage AI chatbot interactions</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            onClick={loadChatbotData}
            variant="outline" 
            className="border-blue-400 text-blue-600 hover:bg-blue-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900/60 backdrop-blur-xl border-purple-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Conversations</CardTitle>
            <MessageCircle className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalConversations}</div>
            <p className="text-xs text-slate-400">{stats.activeConversations} active</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 backdrop-blur-xl border-purple-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Average Lead Score</CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.averageLeadScore}%</div>
            <p className="text-xs text-slate-400">Quality metric</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 backdrop-blur-xl border-purple-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.responseRate}%</div>
            <p className="text-xs text-slate-400">{stats.totalMessages} messages</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="configuration" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-900/60 backdrop-blur-xl border-purple-500/30">
          <TabsTrigger value="configuration" className="data-[state=active]:bg-purple-500/30">
            <Settings className="w-4 h-4 mr-2" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="conversations" className="data-[state=active]:bg-purple-500/30">
            <MessageCircle className="w-4 h-4 mr-2" />
            Conversations
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-500/30">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="space-y-6">
          <Card className="bg-slate-900/60 backdrop-blur-xl border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">Chatbot Configuration</CardTitle>
              <CardDescription className="text-slate-300">
                Configure your AI chatbot settings and behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-200">AI Model</Label>
                  <Select value={config.model} onValueChange={(value) => setConfig({...config, model: value})}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {models.map((model) => (
                        <SelectItem key={model.value} value={model.value}>
                          {model.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200">Response Style</Label>
                  <Select value={config.response_style} onValueChange={(value) => setConfig({...config, response_style: value})}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {responseStyles.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-200">Temperature ({config.temperature})</Label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={config.temperature}
                    onChange={(e) => setConfig({...config, temperature: parseFloat(e.target.value)})}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Conservative</span>
                    <span>Balanced</span>
                    <span>Creative</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200">Max Tokens</Label>
                  <Input
                    type="number"
                    value={config.max_tokens}
                    onChange={(e) => setConfig({...config, max_tokens: parseInt(e.target.value)})}
                    className="bg-slate-800/50 border-slate-600 text-white"
                    min="100"
                    max="4000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200">System Instruction</Label>
                <Textarea
                  value={config.system_instruction}
                  onChange={(e) => setConfig({...config, system_instruction: e.target.value})}
                  className="bg-slate-800/50 border-slate-600 text-white min-h-[120px]"
                  placeholder="Enter detailed instructions for the chatbot behavior, tone, and knowledge areas..."
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={config.is_active}
                    onCheckedChange={(checked) => setConfig({...config, is_active: checked})}
                  />
                  <Label className="text-slate-200">Chatbot Active</Label>
                </div>
                
                <Button 
                  onClick={handleSaveConfig}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conversations Tab */}
        <TabsContent value="conversations" className="space-y-6">
          <Card className="bg-slate-900/60 backdrop-blur-xl border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">Recent Conversations</CardTitle>
              <CardDescription className="text-slate-300">
                View and manage chatbot conversations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversations.length === 0 ? (
                  <div className="text-center py-12">
                    <Bot className="mx-auto h-16 w-16 text-slate-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Conversations Yet</h3>
                    <p className="text-slate-400">Chatbot conversations will appear here once users start interacting</p>
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <div key={conversation.id} className="flex items-start justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-medium">
                            {conversation.user_name || 'Anonymous User'}
                          </h3>
                          <Badge className={`${getStatusColor(conversation.status)} border-0`}>
                            {getStatusIcon(conversation.status)}
                            <span className="ml-1">{conversation.status}</span>
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400" />
                            <span className={`text-sm font-medium ${getLeadScoreColor(conversation.lead_score || 0)}`}>
                              {conversation.lead_score || 0}%
                            </span>
                          </div>
                        </div>
                        {conversation.user_email && (
                          <p className="text-slate-400 text-sm mb-1">{conversation.user_email}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-slate-500">
                            Started: {new Date(conversation.created_at).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-slate-500">
                            Messages: {conversation.messages?.length || 0}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-purple-400 text-purple-300 hover:bg-purple-500/20"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteConversation(conversation.id)}
                          className="border-red-400 text-red-300 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-slate-900/60 backdrop-blur-xl border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">Chatbot Analytics</CardTitle>
              <CardDescription className="text-slate-300">
                Performance metrics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="mx-auto h-16 w-16 text-slate-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Analytics Coming Soon</h3>
                <p className="text-slate-400">Detailed analytics and reporting will be available in the next update</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatbotManager;