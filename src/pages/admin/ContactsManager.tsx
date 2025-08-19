import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { format, isValid, parseISO } from 'date-fns';
import {
  Mail,
  Phone,
  Building,
  User,
  Search,
  Filter,
  Calendar as CalendarIcon,
  Edit,
  Trash2,
  Eye,
  Clock,
  Star,
  TrendingUp,
  UserCheck,
  Users,
  MessageSquare,
  Tag,
  MoreVertical,
  Send,
  CheckCircle,
  AlertCircle,
  Ban,
  Target,
  Zap,
  BarChart3,
  PieChart,
  Download,
  Upload,
  Plus,
  Settings,
  Archive,
  ExternalLink
} from 'lucide-react';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  service?: string;
  source?: string;
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed' | 'spam';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  lead_score?: number;
  tags?: string[];
  notes?: string;
  assigned_to?: string;
  is_read?: boolean;
  is_newsletter_subscriber?: boolean;
  newsletter_tags?: string[];
  follow_up_date?: string;
  last_contacted?: string;
  converted_at?: string;
  created_at: string;
  updated_at: string;
}

interface EmailLog {
  id: string;
  email_to: string;
  email_type: string;
  subject: string;
  status: string;
  sent_at: string;
}

const ContactsManager = () => {
  const { toast } = useToast();

  // State Management
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactSubmission | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Form State
  const [responseData, setResponseData] = useState({
    subject: '',
    message: '',
    template: 'custom'
  });
  const [followUpDate, setFollowUpDate] = useState<Date>();
  const [newTag, setNewTag] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');

  // Load Data with real-time updates
  useEffect(() => {
    loadContacts();
    loadEmailLogs();
    
    // Set up real-time updates every 30 seconds for new contacts
    const interval = setInterval(() => {
      loadContacts();
      loadEmailLogs();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to load contacts: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadEmailLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('email_logs')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setEmailLogs(data || []);
    } catch (error: any) {
      console.error('Error loading email logs:', error);
    }
  };

  // Analytics
  const analytics = useMemo(() => {
    const total = contacts.length;
    const newContacts = contacts.filter(c => c.status === 'new').length;
    const qualified = contacts.filter(c => c.status === 'qualified').length;
    const converted = contacts.filter(c => c.status === 'converted').length;
    const unread = contacts.filter(c => !c.is_read).length;

    const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;
    const avgLeadScore = contacts.reduce((sum, c) => sum + (c.lead_score || 0), 0) / Math.max(total, 1);

    const sourceDistribution = contacts.reduce((acc, contact) => {
      const source = contact.source || 'unknown';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentContacts = contacts.filter(c => 
      new Date(c.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    const highPriority = contacts.filter(c => c.priority === 'high' || c.priority === 'urgent').length;
    const needFollowUp = contacts.filter(c => 
      c.follow_up_date && new Date(c.follow_up_date) <= new Date() && c.status !== 'converted'
    ).length;

    return {
      total,
      newContacts,
      qualified,
      converted,
      unread,
      conversionRate,
      avgLeadScore: Math.round(avgLeadScore),
      sourceDistribution,
      recentContacts,
      highPriority,
      needFollowUp
    };
  }, [contacts]);

  // Filtered Contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesSearch = 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.message.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || contact.priority === priorityFilter;
      const matchesSource = sourceFilter === 'all' || contact.source === sourceFilter;
      const matchesAssignee = assigneeFilter === 'all' || contact.assigned_to === assigneeFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesSource && matchesAssignee;
    });
  }, [contacts, searchTerm, statusFilter, priorityFilter, sourceFilter, assigneeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleUpdateContact = async (id: string, updates: Partial<ContactSubmission>) => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setContacts(prev => prev.map(contact => 
        contact.id === id ? { ...contact, ...data } : contact
      ));

      toast({
        title: 'Success',
        description: 'Contact updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to update contact: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const handleBulkOperation = async (operation: string) => {
    if (selectedContacts.length === 0) {
      toast({
        title: 'No Selection',
        description: 'Please select contacts to perform bulk operations',
        variant: 'destructive',
      });
      return;
    }

    try {
      let updates: Partial<ContactSubmission> = {};
      
      switch (operation) {
        case 'mark-read':
          updates = { is_read: true };
          break;
        case 'mark-qualified':
          updates = { status: 'qualified' };
          break;
        case 'assign-high':
          updates = { priority: 'high' };
          break;
        case 'mark-spam':
          updates = { status: 'spam' };
          break;
        case 'delete':
          const { error: deleteError } = await supabase
            .from('contact_submissions')
            .delete()
            .in('id', selectedContacts);
          
          if (deleteError) throw deleteError;
          
          setContacts(prev => prev.filter(contact => !selectedContacts.includes(contact.id)));
          setSelectedContacts([]);
          
          toast({
            title: 'Success',
            description: `Deleted ${selectedContacts.length} contacts`,
          });
          return;
          
        default:
          return;
      }

      const { error } = await supabase
        .from('contact_submissions')
        .update(updates)
        .in('id', selectedContacts);

      if (error) throw error;

      setContacts(prev => prev.map(contact => 
        selectedContacts.includes(contact.id) ? { ...contact, ...updates } : contact
      ));

      setSelectedContacts([]);
      toast({
        title: 'Success',
        description: `Bulk ${operation} completed successfully`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Bulk ${operation} failed: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const handleSendResponse = async (contactId: string) => {
    if (!responseData.subject || !responseData.message) {
      toast({
        title: 'Validation Error',
        description: 'Please provide both subject and message',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Find the contact
      const contact = contacts.find(c => c.id === contactId);
      if (!contact) throw new Error('Contact not found');

      // Send email via our unified contact-handler
      const { data, error } = await supabase.functions.invoke('contact-handler', {
        body: {
          action: 'admin_response',
          to: contact.email,
          subject: responseData.subject,
          message: responseData.message.replace(/\n/g, '<br>'),
          contact_id: contactId,
          admin_name: 'Agentic AI Team'
        }
      });

      if (error) throw error;

      // Update contact status
      await handleUpdateContact(contactId, {
        status: 'contacted',
        last_contacted: new Date().toISOString(),
        is_read: true
      });

      // Reset form
      setResponseData({ subject: '', message: '', template: 'custom' });
      
      toast({
        title: 'Success',
        description: 'Response sent successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to send response: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const handleAddTag = (contactId: string, tag: string) => {
    if (!tag.trim()) return;

    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;

    const currentTags = contact.tags || [];
    if (currentTags.includes(tag.trim())) return;

    const updatedTags = [...currentTags, tag.trim()];
    handleUpdateContact(contactId, { tags: updatedTags });
  };

  const handleRemoveTag = (contactId: string, tagToRemove: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;

    const updatedTags = (contact.tags || []).filter(tag => tag !== tagToRemove);
    handleUpdateContact(contactId, { tags: updatedTags });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'spam': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-600';
      case 'medium': return 'bg-blue-100 text-blue-600';
      case 'high': return 'bg-orange-100 text-orange-600';
      case 'urgent': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getLeadScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contacts Manager</h1>
          <p className="text-gray-600">Manage contact form submissions and lead communications</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => { loadContacts(); loadEmailLogs(); }}
            className="bg-purple-50 border-purple-200 hover:bg-purple-100"
          >
            <Settings className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" className="bg-green-50 border-green-200 hover:bg-green-100">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" className="bg-blue-50 border-blue-200 hover:bg-blue-100">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      <Tabs defaultValue="contacts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="email-logs">Email Logs</TabsTrigger>
          <TabsTrigger value="follow-ups">Follow-ups</TabsTrigger>
        </TabsList>

        {/* Contacts Tab */}
        <TabsContent value="contacts" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.total}</div>
                <p className="text-xs text-muted-foreground">
                  +{analytics.recentContacts} this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">New/Unread</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.unread}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.newContacts} new contacts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.conversionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.converted} converted
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Follow-ups Due</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.needFollowUp}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.highPriority} high priority
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Actions */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-1 items-center gap-4 flex-wrap">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search contacts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="spam">Spam</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sourceFilter} onValueChange={setSourceFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="campaign">Campaign</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedContacts.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {selectedContacts.length} selected
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkOperation('mark-read')}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark Read
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkOperation('mark-qualified')}
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      Qualify
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleBulkOperation('delete')}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paginatedContacts.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No contacts found</p>
                  </div>
                ) : (
                  paginatedContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`p-4 border rounded-lg hover:border-purple-300 transition-colors ${
                        !contact.is_read ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <Checkbox
                            checked={selectedContacts.includes(contact.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedContacts(prev => [...prev, contact.id]);
                              } else {
                                setSelectedContacts(prev => prev.filter(id => id !== contact.id));
                              }
                            }}
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500" />
                                <h3 className="font-semibold text-lg">{contact.name}</h3>
                                {!contact.is_read && (
                                  <Badge variant="secondary" className="text-xs">New</Badge>
                                )}
                              </div>
                              <Badge className={getStatusColor(contact.status)}>
                                {contact.status || 'new'}
                              </Badge>
                              {contact.priority && (
                                <Badge className={getPriorityColor(contact.priority)}>
                                  {contact.priority}
                                </Badge>
                              )}
                              {contact.lead_score && (
                                <Badge variant="outline">
                                  <Star className={`h-3 w-3 mr-1 ${getLeadScoreColor(contact.lead_score)}`} />
                                  {contact.lead_score}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {contact.email}
                              </span>
                              {contact.company && (
                                <span className="flex items-center gap-1">
                                  <Building className="h-3 w-3" />
                                  {contact.company}
                                </span>
                              )}
                              {contact.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {contact.phone}
                                </span>
                              )}
                              <span>
                                {format(parseISO(contact.created_at), 'MMM d, yyyy')}
                              </span>
                            </div>
                            
                            <p className="text-gray-700 mb-2 line-clamp-2">
                              {contact.message}
                            </p>
                            
                            {contact.tags && contact.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {contact.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    <Tag className="h-2 w-2 mr-1" />
                                    {tag}
                                    <button
                                      onClick={() => handleRemoveTag(contact.id, tag)}
                                      className="ml-1 hover:text-red-500"
                                    >
                                      ×
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {contact.notes && (
                              <div className="bg-gray-50 p-2 rounded text-sm mt-2">
                                <strong>Notes:</strong> {contact.notes}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Respond to {contact.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Template</Label>
                                  <Select
                                    value={responseData.template}
                                    onValueChange={(value) => {
                                      setResponseData(prev => ({ ...prev, template: value }));
                                      // You could load pre-defined templates here
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="custom">Custom Response</SelectItem>
                                      <SelectItem value="consultation">Consultation Offer</SelectItem>
                                      <SelectItem value="quote">Quote Request</SelectItem>
                                      <SelectItem value="follow-up">Follow-up</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Subject</Label>
                                  <Input
                                    value={responseData.subject}
                                    onChange={(e) => setResponseData(prev => ({ ...prev, subject: e.target.value }))}
                                    placeholder="Response subject..."
                                  />
                                </div>
                                <div>
                                  <Label>Message</Label>
                                  <Textarea
                                    value={responseData.message}
                                    onChange={(e) => setResponseData(prev => ({ ...prev, message: e.target.value }))}
                                    placeholder="Your response message..."
                                    rows={6}
                                  />
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button
                                    onClick={() => handleSendResponse(contact.id)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <Send className="h-4 w-4 mr-2" />
                                    Send Response
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Contact: {contact.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Status</Label>
                                    <Select
                                      defaultValue={contact.status || 'new'}
                                      onValueChange={(value) => handleUpdateContact(contact.id, { status: value as any })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="new">New</SelectItem>
                                        <SelectItem value="contacted">Contacted</SelectItem>
                                        <SelectItem value="qualified">Qualified</SelectItem>
                                        <SelectItem value="converted">Converted</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                        <SelectItem value="spam">Spam</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label>Priority</Label>
                                    <Select
                                      defaultValue={contact.priority || 'medium'}
                                      onValueChange={(value) => handleUpdateContact(contact.id, { priority: value as any })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="urgent">Urgent</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                <div>
                                  <Label>Add Tag</Label>
                                  <div className="flex gap-2">
                                    <Input
                                      value={newTag}
                                      onChange={(e) => setNewTag(e.target.value)}
                                      placeholder="Enter tag name"
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          handleAddTag(contact.id, newTag);
                                          setNewTag('');
                                        }
                                      }}
                                    />
                                    <Button
                                      onClick={() => {
                                        handleAddTag(contact.id, newTag);
                                        setNewTag('');
                                      }}
                                      variant="outline"
                                    >
                                      Add
                                    </Button>
                                  </div>
                                </div>

                                <div>
                                  <Label>Lead Score (0-100)</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    defaultValue={contact.lead_score || 0}
                                    onChange={(e) => {
                                      const score = parseInt(e.target.value) || 0;
                                      handleUpdateContact(contact.id, { lead_score: Math.min(100, Math.max(0, score)) });
                                    }}
                                  />
                                </div>

                                <div>
                                  <Label>Notes</Label>
                                  <Textarea
                                    defaultValue={contact.notes || ''}
                                    placeholder="Add notes about this contact..."
                                    onBlur={(e) => handleUpdateContact(contact.id, { notes: e.target.value })}
                                    rows={3}
                                  />
                                </div>

                                <div>
                                  <Label>Follow-up Date</Label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button variant="outline" className="w-full justify-start">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {followUpDate ? format(followUpDate, 'PPP') : 'Set follow-up date'}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                      <Calendar
                                        mode="single"
                                        selected={followUpDate}
                                        onSelect={(date) => {
                                          setFollowUpDate(date);
                                          if (date) {
                                            handleUpdateContact(contact.id, { follow_up_date: date.toISOString() });
                                          }
                                        }}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleBulkOperation('delete')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Contact Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.sourceDistribution).map(([source, count]) => (
                    <div key={source} className="flex items-center justify-between">
                      <span className="capitalize">{source}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Conversion Rate</span>
                    <span className="font-semibold">{analytics.conversionRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Lead Score</span>
                    <span className="font-semibold">{analytics.avgLeadScore}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Response Rate</span>
                    <span className="font-semibold">
                      {analytics.total > 0 ? Math.round((analytics.qualified / analytics.total) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Email Logs Tab */}
        <TabsContent value="email-logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Email Activity</CardTitle>
              <CardDescription>Email communications with contacts</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {emailLogs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No email logs found
                    </div>
                  ) : (
                    emailLogs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{log.subject}</span>
                            <Badge variant="outline">{log.email_type}</Badge>
                          </div>
                          <div className="text-sm text-gray-500">
                            To: {log.email_to} • Status: {log.status}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(parseISO(log.sent_at), 'MMM d, HH:mm')}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Follow-ups Tab */}
        <TabsContent value="follow-ups" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Follow-ups</CardTitle>
              <CardDescription>Contacts that need follow-up attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contacts
                  .filter(c => c.follow_up_date && new Date(c.follow_up_date) <= new Date() && c.status !== 'converted')
                  .map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-4 w-4 text-orange-500" />
                          <span className="font-medium">{contact.name}</span>
                          <span className="text-sm text-gray-500">{contact.email}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Due: {contact.follow_up_date && format(parseISO(contact.follow_up_date), 'MMM d, yyyy')}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateContact(contact.id, { 
                            follow_up_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() 
                          })}
                        >
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactsManager;