import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Users, 
  Mail, 
  TrendingUp, 
  UserMinus, 
  AlertTriangle,
  Plus,
  Search,
  Download,
  Trash2,
  Edit3,
  Eye,
  Upload,
  Filter,
  MoreHorizontal,
  Send,
  Calendar,
  BarChart3,
  FileText,
  Settings,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  Copy
} from "lucide-react";
// Newsletter types
interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  status: 'active' | 'inactive' | 'unsubscribed';
  subscribed_at: string;
  source?: string;
  tags?: string[];
  notes?: string;
  last_email_sent?: string;
}

interface NewsletterCampaign {
  id: string;
  title: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  created_at: string;
  updated_at: string;
  scheduled_for?: string;
  sent_at?: string;
  recipient_count?: number;
  open_rate?: number;
  click_rate?: number;
}
import { formatDistanceToNow, format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Email Templates
const EMAIL_TEMPLATES = {
  welcome: {
    name: 'Welcome Email',
    subject: 'Welcome to {{company_name}}!',
    content: `<h1>Welcome to {{company_name}}!</h1>
<p>Hi {{subscriber_name}},</p>
<p>Thank you for subscribing to our newsletter. We're excited to have you on board!</p>
<p>Best regards,<br>The {{company_name}} Team</p>`
  },
  newsletter: {
    name: 'Newsletter Template',
    subject: '{{company_name}} Newsletter - {{date}}',
    content: `<h1>{{newsletter_title}}</h1>
<p>Hi {{subscriber_name}},</p>
<p>Here's what's new this week...</p>
<div>{{newsletter_content}}</div>
<p>Best regards,<br>The {{company_name}} Team</p>`
  },
  announcement: {
    name: 'Announcement Template',
    subject: 'Important Update from {{company_name}}',
    content: `<h1>Important Update</h1>
<p>Hi {{subscriber_name}},</p>
<p>We have an important announcement to share with you...</p>
<div>{{announcement_content}}</div>
<p>Best regards,<br>The {{company_name}} Team</p>`
  }
};

// Campaign Create/Edit Form Component
const CampaignForm = ({ 
  campaign, 
  onSubmit, 
  onCancel 
}: { 
  campaign?: NewsletterCampaign;
  onSubmit: (data: Omit<NewsletterCampaign, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    title: campaign?.title || '',
    subject: campaign?.subject || '',
    content: campaign?.content || '',
    status: (campaign?.status || 'draft') as const,
    scheduled_at: campaign?.scheduled_at || '',
  });

  const [selectedTemplate, setSelectedTemplate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a clean campaign object with only valid database columns
    const campaignData = {
      title: formData.title,
      subject: formData.subject,
      content: formData.content,
      status: formData.status,
      ...(formData.scheduled_at && { scheduled_at: formData.scheduled_at }),
    };
    
    onSubmit(campaignData);
  };

  const applyTemplate = (templateKey: string) => {
    const template = EMAIL_TEMPLATES[templateKey as keyof typeof EMAIL_TEMPLATES];
    if (template) {
      setFormData({
        ...formData,
        subject: template.subject,
        content: template.content,
      });
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Template Selection */}
      <div className="space-y-2">
        <Label>Email Template</Label>
        <Select value={selectedTemplate} onValueChange={(value) => {
          setSelectedTemplate(value);
          if (value) applyTemplate(value);
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a template (optional)" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(EMAIL_TEMPLATES).map(([key, template]) => (
              <SelectItem key={key} value={key}>{template.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Campaign Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter campaign title"
            required
          />
        </div>
        <div>
          <Label htmlFor="subject">Email Subject</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Enter email subject"
            required
          />
        </div>
      </div>
      

      {/* Status and Scheduling */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => 
            setFormData({ ...formData, status: value as any })
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {formData.status === 'scheduled' && (
          <div>
            <Label htmlFor="scheduled_at">Schedule Date & Time</Label>
            <Input
              id="scheduled_at"
              type="datetime-local"
              value={formData.scheduled_at}
              onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
            />
          </div>
        )}
      </div>


      {/* Content */}
      <div>
        <Label htmlFor="content">Email Content (HTML)</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Enter your email content (HTML supported)\n\nAvailable variables:\n{{subscriber_name}} - Subscriber's name\n{{company_name}} - Your company name\n{{unsubscribe_url}} - Unsubscribe link"
          rows={12}
          required
        />
      </div>

      {/* Preview */}
      <div>
        <Label>Preview</Label>
        <div className="border rounded-md p-4 bg-muted/50 max-h-40 overflow-y-auto">
          <div dangerouslySetInnerHTML={{ __html: formData.content || '<em>No content yet...</em>' }} />
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          {campaign ? 'Update Campaign' : 'Create Campaign'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

// Bulk Operations Component
const BulkOperations = ({ 
  selectedSubscribers, 
  onBulkUpdate,
  onClearSelection 
}: {
  selectedSubscribers: string[];
  onBulkUpdate: (operation: string, value?: string) => void;
  onClearSelection: () => void;
}) => {
  if (selectedSubscribers.length === 0) return null;

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium">
              {selectedSubscribers.length} subscriber(s) selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Select onValueChange={(value) => onBulkUpdate('status', value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Change status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Set Active</SelectItem>
                <SelectItem value="unsubscribed">Set Unsubscribed</SelectItem>
                <SelectItem value="bounced">Set Bounced</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onBulkUpdate('delete')}
              className="text-destructive"
            >
              Delete Selected
            </Button>
            <Button variant="outline" size="sm" onClick={onClearSelection}>
              Clear Selection
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const NewsletterManager = () => {
  // State management
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    activeSubscribers: 0,
    totalCampaigns: 0,
    sentCampaigns: 0,
    averageOpenRate: 0,
    averageClickRate: 0
  });
  
  const { toast } = useToast();

  // Data fetching functions
  const fetchSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load subscribers',
        variant: 'destructive',
      });
    }
  };

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast({
        title: 'Error',
        description: 'Failed to load campaigns',
        variant: 'destructive',
      });
    }
  };

  // Initialize data
  React.useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([fetchSubscribers(), fetchCampaigns()]);
      setLoading(false);
    };
    initializeData();
  }, []);

  // Update stats when data changes
  React.useEffect(() => {
    const totalSubscribers = subscribers.length;
    const activeSubscribers = subscribers.filter(s => s.status === 'active').length;
    const totalCampaigns = campaigns.length;
    const sentCampaigns = campaigns.filter(c => c.status === 'sent').length;

    setStats({
      totalSubscribers,
      activeSubscribers,
      totalCampaigns,
      sentCampaigns,
      averageOpenRate: campaigns.reduce((sum, c) => sum + (c.open_rate || 0), 0) / Math.max(totalCampaigns, 1),
      averageClickRate: campaigns.reduce((sum, c) => sum + (c.click_rate || 0), 0) / Math.max(totalCampaigns, 1)
    });
  }, [subscribers, campaigns]);

  // Additional state management
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [newSubscriberEmail, setNewSubscriberEmail] = useState("");
  const [newSubscriberName, setNewSubscriberName] = useState("");
  const [isAddingSubscriber, setIsAddingSubscriber] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<NewsletterCampaign | null>(null);
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [importData, setImportData] = useState("");
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Enhanced filtering
  const filteredSubscribers = useMemo(() => {
    return subscribers.filter(subscriber => {
      const matchesSearch = 
        subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (subscriber.name && subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === "all" || subscriber.status === statusFilter;
      const matchesSource = sourceFilter === "all" || subscriber.source === sourceFilter;
      
      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [subscribers, searchTerm, statusFilter, sourceFilter]);

  // Get unique sources for filter
  const uniqueSources = useMemo(() => {
    const sources = subscribers.map(s => s.source).filter(Boolean);
    return [...new Set(sources)];
  }, [subscribers]);

  // Enhanced operations with immediate welcome email
  const handleAddSubscriber = async () => {
    if (!newSubscriberEmail.trim()) return;

    setIsAddingSubscriber(true);
    try {
      // Use the gmail-newsletter function directly for immediate welcome email
      const { data, error } = await supabase.functions.invoke('gmail-newsletter', {
        body: {
          action: 'subscribe',
          email: newSubscriberEmail.trim(),
          name: newSubscriberName.trim() || undefined,
          source: 'admin-manual',
          tags: ['admin-added']
        }
      });

      if (error) throw error;

      // Show success with welcome email status
      toast({
        title: "✅ Subscriber Added!",
        description: data.welcomeEmailSent 
          ? `Welcome email sent to ${newSubscriberEmail.trim()} from info@agentic-ai.ltd`
          : `Subscriber added (welcome email failed: ${data.error || 'unknown error'})`,
      });

      setNewSubscriberEmail("");
      setNewSubscriberName("");
      
      // Refresh the subscriber list
      await fetchSubscribers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add subscriber",
        variant: "destructive",
      });
    } finally {
      setIsAddingSubscriber(false);
    }
  };

  const handleBulkUpdate = async (operation: string, value?: string) => {
    if (selectedSubscribers.length === 0) return;

    try {
      if (operation === 'status' && value) {
        await Promise.all(
          selectedSubscribers.map(id => 
            updateSubscriberStatus(id, value as any)
          )
        );
        toast({
          title: "Success",
          description: `Updated ${selectedSubscribers.length} subscribers`,
        });
      } else if (operation === 'delete') {
        await Promise.all(
          selectedSubscribers.map(id => deleteSubscriber(id))
        );
        toast({
          title: "Success",
          description: `Deleted ${selectedSubscribers.length} subscribers`,
        });
      }
      setSelectedSubscribers([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to perform bulk operation",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchSubscribers(), fetchCampaigns()]);
      toast({
        title: "Success",
        description: "Data refreshed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh data",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleSelectSubscriber = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedSubscribers([...selectedSubscribers, id]);
    } else {
      setSelectedSubscribers(selectedSubscribers.filter(sid => sid !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSubscribers(filteredSubscribers.map(s => s.id));
    } else {
      setSelectedSubscribers([]);
    }
  };

  const handleImportSubscribers = async () => {
    if (!importData.trim()) return;

    try {
      const lines = importData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const emailIndex = headers.findIndex(h => h.includes('email'));
      const nameIndex = headers.findIndex(h => h.includes('name'));

      if (emailIndex === -1) {
        throw new Error('Email column not found');
      }

      const importPromises = lines.slice(1).map(async (line) => {
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const email = values[emailIndex];
        const name = nameIndex !== -1 ? values[nameIndex] : undefined;

        if (email && email.includes('@')) {
          try {
            await subscribeEmail(email, name, 'import', ['imported']);
          } catch (error) {
            console.error(`Failed to import ${email}:`, error);
          }
        }
      });

      await Promise.allSettled(importPromises);
      
      toast({
        title: "Success",
        description: `Imported subscribers from CSV`,
      });
      
      setImportData("");
      setShowImportDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import subscribers. Check CSV format.",
        variant: "destructive",
      });
    }
  };

  const handleCreateCampaign = async (campaignData: Omit<NewsletterCampaign, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      let campaignId;
      if (editingCampaign) {
        await updateCampaign(editingCampaign.id, campaignData);
        campaignId = editingCampaign.id;
        setEditingCampaign(null);
      } else {
        const newCampaign = await createCampaign(campaignData);
        campaignId = newCampaign.id;
      }
      
      // If campaign status is 'sent', trigger email sending
      if (campaignData.status === 'sent') {
        await handleSendCampaign(campaignId, true);
      }
      
      setShowCampaignForm(false);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleEditCampaign = (campaign: NewsletterCampaign) => {
    setEditingCampaign(campaign);
    setShowCampaignForm(true);
  };

  const handleCancelCampaignForm = () => {
    setEditingCampaign(null);
    setShowCampaignForm(false);
  };

  const handleSendCampaign = async (campaignId: string, sendNow: boolean = true) => {
    try {
      // Show loading toast
      const loadingToast = toast({
        title: "Sending Campaign...",
        description: "Your campaign is being sent to all subscribers. This may take a few moments.",
      });

      const { data, error } = await supabase.functions.invoke('gmail-newsletter', {
        body: {
          action: 'campaign',
          campaignId,
          sendNow
        }
      });

      if (error) throw error;

      // Show success with detailed stats
      toast({
        title: "🎉 Campaign Sent Successfully!",
        description: `${data.message || "Campaign sent!"} | From: info@agentic-ai.ltd`,
      });

      // Show detailed statistics if available
      if (data.stats) {
        setTimeout(() => {
          toast({
            title: `📊 Campaign Statistics`,
            description: `✅ ${data.stats.totalSent} emails sent (${data.stats.successRate}% success rate)`,
          });
        }, 1000);
      }

      // Refresh campaigns to show updated status
      await fetchCampaigns();
    } catch (error: any) {
      console.error('Error sending campaign:', error);
      toast({
        title: "❌ Campaign Failed",
        description: error.message || "Failed to send campaign. Check your email configuration.",
        variant: "destructive",
      });
    }
  };

  const duplicateCampaign = async (campaign: NewsletterCampaign) => {
    try {
      const duplicatedCampaign = {
        ...campaign,
        title: `${campaign.title} (Copy)`,
        status: 'draft' as const,
        scheduled_at: undefined,
        sent_at: undefined,
      };
      delete (duplicatedCampaign as any).id;
      delete (duplicatedCampaign as any).created_at;
      delete (duplicatedCampaign as any).updated_at;
      
      await createCampaign(duplicatedCampaign);
      toast({
        title: "Success",
        description: "Campaign duplicated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate campaign",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'unsubscribed': return 'secondary';
      case 'bounced': return 'destructive';
      default: return 'outline';
    }
  };

  const getCampaignStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'draft': return <FileText className="h-4 w-4 text-gray-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCampaignStatusVariant = (status: string) => {
    switch (status) {
      case 'sent': return 'default';
      case 'scheduled': return 'outline';
      case 'draft': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  const exportSubscribers = (format: 'csv' | 'json' = 'csv') => {
    const dataToExport = selectedSubscribers.length > 0 
      ? subscribers.filter(s => selectedSubscribers.includes(s.id))
      : filteredSubscribers;

    if (format === 'csv') {
      const csvContent = [
        ['Email', 'Name', 'Status', 'Source', 'Subscribed At', 'Unsubscribed At', 'Notes'],
        ...dataToExport.map(sub => [
          sub.email,
          sub.name || '',
          sub.status,
          sub.source || '',
          new Date(sub.subscribed_at).toLocaleDateString(),
          sub.unsubscribed_at ? new Date(sub.unsubscribed_at).toLocaleDateString() : '',
          sub.notes || ''
        ])
      ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      const jsonContent = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }

    toast({
      title: "Success",
      description: `Exported ${dataToExport.length} subscribers as ${format.toUpperCase()}`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Newsletter Manager</h1>
          <p className="text-gray-400">
            Comprehensive newsletter management with advanced analytics and automation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowImportDialog(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Import Subscribers
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportSubscribers('csv')}>
                <Download className="h-4 w-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportSubscribers('json')}>
                <Download className="h-4 w-4 mr-2" />
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubscribers}</div>
            <div className="flex items-center mt-1">
              <div className="text-xs text-green-600 font-medium">
                {stats.activeSubscribers} active
              </div>
              <div className="text-xs text-muted-foreground ml-2">
                ({stats.totalSubscribers > 0 ? Math.round((stats.activeSubscribers / stats.totalSubscribers) * 100) : 0}%)
              </div>
            </div>
            <Progress 
              value={stats.totalSubscribers > 0 ? (stats.activeSubscribers / stats.totalSubscribers) * 100 : 0} 
              className="mt-2" 
            />
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Growth (30 days)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{stats.recentSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              new subscribers this month
            </p>
            <div className="text-xs text-muted-foreground mt-1">
              {stats.unsubscribedCount} unsubscribed | {stats.bouncedCount} bounced
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Campaign Performance</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.campaignsSent}</div>
            <p className="text-xs text-muted-foreground">campaigns sent</p>
            <div className="flex items-center mt-1 gap-2">
              <div className="text-xs">
                <span className="text-blue-600 font-medium">{stats.averageOpenRate}%</span>
                <span className="text-muted-foreground"> open</span>
              </div>
              <div className="text-xs">
                <span className="text-purple-600 font-medium">{stats.averageClickRate}%</span>
                <span className="text-muted-foreground"> click</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">List Health</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalSubscribers > 0 ? Math.round(((stats.totalSubscribers - stats.unsubscribedCount - stats.bouncedCount) / stats.totalSubscribers) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">health score</p>
            <div className="text-xs text-red-600 mt-1">
              {stats.unsubscribedCount + stats.bouncedCount} inactive
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Operations */}
      <BulkOperations 
        selectedSubscribers={selectedSubscribers}
        onBulkUpdate={handleBulkUpdate}
        onClearSelection={() => setSelectedSubscribers([])}
      />

      <Tabs defaultValue="subscribers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="subscribers">
            <Users className="h-4 w-4 mr-2" />
            Subscribers ({stats.totalSubscribers})
          </TabsTrigger>
          <TabsTrigger value="campaigns">
            <Mail className="h-4 w-4 mr-2" />
            Campaigns ({campaigns.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="templates">
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subscribers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Subscribers Management</CardTitle>
                  <CardDescription>
                    Manage your newsletter subscribers with advanced filtering and bulk operations
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => exportSubscribers('csv')}>
                        Export as CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => exportSubscribers('json')}>
                        Export as JSON
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Subscriber
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Subscriber</DialogTitle>
                        <DialogDescription>
                          Manually add a new subscriber to your newsletter.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="subscriber@example.com"
                            value={newSubscriberEmail}
                            onChange={(e) => setNewSubscriberEmail(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="name">Name (Optional)</Label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            value={newSubscriberName}
                            onChange={(e) => setNewSubscriberName(e.target.value)}
                          />
                        </div>
                        <Button 
                          onClick={handleAddSubscriber} 
                          disabled={isAddingSubscriber || !newSubscriberEmail.trim()}
                          className="w-full"
                        >
                          {isAddingSubscriber ? "Adding..." : "Add Subscriber"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Enhanced Search and Filters */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by email or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-80"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                      <SelectItem value="bounced">Bounced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    {uniqueSources.map(source => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="text-sm text-muted-foreground">
                  Showing {filteredSubscribers.length} of {subscribers.length} subscribers
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={filteredSubscribers.length > 0 && selectedSubscribers.length === filteredSubscribers.length}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Subscriber</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Subscribed</TableHead>
                      <TableHead>Last Email</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex items-center justify-center">
                            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                            Loading subscribers...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredSubscribers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="text-center">
                            <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-muted-foreground">No subscribers found.</p>
                            {searchTerm || statusFilter !== 'all' || sourceFilter !== 'all' ? (
                              <Button
                                variant="link"
                                onClick={() => {
                                  setSearchTerm('')
                                  setStatusFilter('all')
                                  setSourceFilter('all')
                                }}
                              >
                                Clear filters
                              </Button>
                            ) : null}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSubscribers.map((subscriber) => (
                        <TableRow 
                          key={subscriber.id}
                          className={selectedSubscribers.includes(subscriber.id) ? 'bg-muted/50' : ''}
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedSubscribers.includes(subscriber.id)}
                              onCheckedChange={(checked) => handleSelectSubscriber(subscriber.id, checked as boolean)}
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{subscriber.email}</div>
                              {subscriber.name && (
                                <div className="text-sm text-muted-foreground">{subscriber.name}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(subscriber.status)}>
                              {subscriber.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {subscriber.source || 'unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {format(new Date(subscriber.subscribed_at), 'MMM dd, yyyy')}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(subscriber.subscribed_at), { addSuffix: true })}
                            </div>
                          </TableCell>
                          <TableCell>
                            {subscriber.last_email_sent ? (
                              <div className="text-sm">
                                <div className="text-green-600">✅ Sent</div>
                                <div className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(subscriber.last_email_sent), { addSuffix: true })}
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground">
                                <div>No emails sent</div>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Select
                                value={subscriber.status}
                                onValueChange={(value) => 
                                  updateSubscriberStatus(subscriber.id, value as any)
                                }
                              >
                                <SelectTrigger className="w-28 h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                                  <SelectItem value="bounced">Bounced</SelectItem>
                                </SelectContent>
                              </Select>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => deleteSubscriber(subscriber.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Campaign Management</CardTitle>
                  <CardDescription>
                    Create, manage, and track your email campaigns with detailed analytics
                  </CardDescription>
                </div>
                <Button 
                  size="sm"
                  onClick={() => setShowCampaignForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex items-center justify-center">
                            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                            Loading campaigns...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : campaigns.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="text-center">
                            <Mail className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-muted-foreground mb-2">No campaigns yet</p>
                            <Button onClick={() => setShowCampaignForm(true)}>
                              Create your first campaign
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      campaigns.map((campaign) => (
                        <TableRow key={campaign.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{campaign.title}</div>
                              <div className="text-sm text-muted-foreground">{campaign.subject}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getCampaignStatusIcon(campaign.status)}
                              <Badge variant={getCampaignStatusVariant(campaign.status)}>
                                {campaign.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">
                                <span className="font-medium">0</span> recipients
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {campaign.open_count || 0} opens • {campaign.click_count || 0} clicks
                              </div>
                              {(campaign.open_count || 0) > 0 && (
                                <div className="text-xs">
                                  <span className="text-blue-600">{campaign.open_count || 0}% open</span> • 
                                  <span className="text-purple-600 ml-1">{campaign.click_count || 0}% click</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {campaign.scheduled_at ? (
                                <div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {format(new Date(campaign.scheduled_at), 'MMM dd, yyyy')}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {format(new Date(campaign.scheduled_at), 'HH:mm')}
                                  </div>
                                </div>
                              ) : campaign.sent_at ? (
                                <div>
                                  <div className="text-green-600">Sent</div>
                                  <div className="text-xs text-muted-foreground">
                                    {format(new Date(campaign.sent_at), 'MMM dd, yyyy HH:mm')}
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="text-muted-foreground">Draft</div>
                                  <div className="text-xs text-muted-foreground">
                                    Created {formatDistanceToNow(new Date(campaign.updated_at), { addSuffix: true })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditCampaign(campaign)}>
                                  <Edit3 className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => duplicateCampaign(campaign)}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                {campaign.status === 'draft' && (
                                  <DropdownMenuItem onClick={() => handleSendCampaign(campaign.id)}>
                                    <Send className="h-4 w-4 mr-2" />
                                    Send Now
                                  </DropdownMenuItem>
                                )}
                                {campaign.status === 'scheduled' && (
                                  <DropdownMenuItem onClick={() => handleSendCampaign(campaign.id)}>
                                    <Send className="h-4 w-4 mr-2" />
                                    Send Immediately
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => deleteCampaign(campaign.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Subscriber Growth</CardTitle>
                <CardDescription>Track your subscriber growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">+{stats.recentSubscriptions}</div>
                      <div className="text-sm text-muted-foreground">Last 30 days</div>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <Progress value={65} className="w-full" />
                  <div className="text-xs text-muted-foreground">65% growth compared to last month</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Engagement Metrics</CardTitle>
                <CardDescription>Email campaign performance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-lg font-bold text-blue-600">{stats.averageOpenRate}%</div>
                      <div className="text-xs text-muted-foreground">Average Open Rate</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-600">{stats.averageClickRate}%</div>
                      <div className="text-xs text-muted-foreground">Average Click Rate</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{stats.campaignsSent}</div>
                    <div className="text-xs text-muted-foreground">Total Campaigns Sent</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">List Health</CardTitle>
                <CardDescription>Monitor your email list quality</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-green-600">{stats.activeSubscribers}</div>
                      <div className="text-xs text-muted-foreground">Active</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-orange-600">{stats.unsubscribedCount}</div>
                      <div className="text-xs text-muted-foreground">Unsubscribed</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-red-600">{stats.bouncedCount}</div>
                      <div className="text-xs text-muted-foreground">Bounced</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {stats.totalSubscribers > 0 ? Math.round(((stats.totalSubscribers - stats.unsubscribedCount - stats.bouncedCount) / stats.totalSubscribers) * 100) : 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">Overall Health Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Sources</CardTitle>
                <CardDescription>Where your subscribers are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {uniqueSources.slice(0, 5).map((source, index) => {
                    const count = subscribers.filter(s => s.source === source).length;
                    const percentage = stats.totalSubscribers > 0 ? (count / stats.totalSubscribers) * 100 : 0;
                    return (
                      <div key={source} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="w-16 justify-center">#{index + 1}</Badge>
                          <span className="text-sm font-medium">{source}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">{count}</div>
                          <div className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Pre-built templates to speed up your campaign creation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(EMAIL_TEMPLATES).map(([key, template]) => (
                  <Card key={key} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-medium">Subject:</div>
                          <div className="text-sm text-muted-foreground">{template.subject}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Preview:</div>
                          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                            {template.content.substring(0, 100)}...
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            setEditingCampaign(null);
                            setShowCampaignForm(true);
                          }}
                        >
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Campaign Form Dialog */}
      <Dialog open={showCampaignForm} onOpenChange={setShowCampaignForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
            </DialogTitle>
            <DialogDescription>
              {editingCampaign 
                ? 'Update your campaign details and content.' 
                : 'Create a new email campaign to send to your subscribers.'
              }
            </DialogDescription>
          </DialogHeader>
          <CampaignForm 
            campaign={editingCampaign || undefined}
            onSubmit={handleCreateCampaign}
            onCancel={handleCancelCampaignForm}
          />
        </DialogContent>
      </Dialog>

      {/* Import Subscribers Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Subscribers</DialogTitle>
            <DialogDescription>
              Import subscribers from a CSV file. Make sure your CSV has 'email' and 'name' columns.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="csv-data">CSV Data</Label>
              <Textarea
                id="csv-data"
                placeholder="email,name
john@example.com,John Doe
jane@example.com,Jane Smith"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                rows={10}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <strong>Format:</strong> First row should contain headers. Email column is required, name is optional.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleImportSubscribers} disabled={!importData.trim()}>
              Import Subscribers
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewsletterManager;
