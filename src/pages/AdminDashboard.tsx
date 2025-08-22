import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  LogOut, 
  Users,
  Calendar,
  BarChart3,
  Mail,
  Clock,
  Zap
} from 'lucide-react';
import { ResourceGenerator } from '@/components/ResourceGenerator';
import GeneratedArticlesDisplay from '@/components/GeneratedArticlesDisplay';
import RealTimeAutopilotProgress from '@/components/RealTimeAutopilotProgress';

// --- Data Types ---
interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  created_at: string;
  status: string;
}

interface Meeting {
  id: string;
  user_name: string;
  user_email: string;
  start_time: string;
  status: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Assume authenticated for now
  const [recentContacts, setRecentContacts] = useState<ContactSubmission[]>([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [stats, setStats] = useState({ newContacts: 0, upcomingMeetings: 0, siteVisitors: 0 });

  useEffect(() => {
    // In a real app, you'd have a proper auth check here
    // For now, we'll just load the data
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Fetch recent contacts
      const { data: contacts, error: contactsError } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      if (contactsError) throw contactsError;
      setRecentContacts(contacts || []);
      setStats(prev => ({ ...prev, newContacts: contacts?.length || 0 }));

      // Fetch upcoming meetings
      const { data: meetings, error: meetingsError } = await supabase
        .from('meeting_bookings')
        .select(`
          *,
          meeting_slots (
            start_time
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      if (meetingsError) throw meetingsError;
      
      const formattedMeetings = meetings?.map((m: any) => ({
        ...m,
        start_time: m.meeting_slots.start_time,
      })) || [];
      setUpcomingMeetings(formattedMeetings);
      setStats(prev => ({ ...prev, upcomingMeetings: meetings?.length || 0 }));

      // Placeholder for site visitors
      setStats(prev => ({ ...prev, siteVisitors: 1234 })); // Replace with actual analytics data

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error Loading Data",
        description: "Could not fetch the latest data for the dashboard.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    // In a real app, you'd clear the auth token
    setIsAuthenticated(false);
    navigate('/');
  };

  const triggerAutopilotGeneration = async () => {
    try {
      toast({
        title: "Starting AI Autopilot",
        description: "Generating articles with real-time research and AI content creation...",
      });

      const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/autopilot-article-scheduler`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'execute' })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast({
            title: "Articles Generated Successfully!",
            description: `Generated ${data.data.successCount} articles out of ${data.data.articlesGenerated} attempted.`,
          });
          // Refresh the page to show new articles
          setTimeout(() => window.location.reload(), 2000);
        } else {
          toast({
            title: "Generation Failed",
            description: data.error || "Failed to generate articles. Please check the logs.",
            variant: "destructive",
          });
        }
      } else {
        const errorText = await response.text();
        toast({
          title: "Generation Failed",
          description: `HTTP ${response.status}: ${errorText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error triggering autopilot:', error);
      toast({
        title: "Generation Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">New Contacts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newContacts}</div>
              <p className="text-xs text-muted-foreground">in the last 7 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Meetings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingMeetings}</div>
              <p className="text-xs text-muted-foreground">in the next 7 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Site Visitors</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.siteVisitors}</div>
              <p className="text-xs text-muted-foreground">in the last 24 hours</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Meetings */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Meetings</CardTitle>
              <CardDescription>Here are your next scheduled consultations.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingMeetings.length > 0 ? (
                  upcomingMeetings.map(meeting => (
                    <div key={meeting.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{meeting.user_name}</p>
                        <p className="text-sm text-muted-foreground">{meeting.user_email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium flex items-center">
                          <Clock className="w-3 h-3 mr-1.5" />
                          {new Date(meeting.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(meeting.start_time).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No upcoming meetings.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Contacts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Contacts</CardTitle>
              <CardDescription>Latest submissions from your contact form.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentContacts.length > 0 ? (
                  recentContacts.map(contact => (
                    <div key={contact.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.email}</p>
                      </div>
                      <Badge variant={contact.status === 'new' ? 'default' : 'secondary'}>
                        {contact.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No new contacts.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8">
          <ResourceGenerator />
        </div>
        
        {/* Generated Articles Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-blue-500" />
                AI Autopilot Article Generation
              </CardTitle>
              <CardDescription>
                Automatically generate high-quality, SEO-optimized articles using AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={triggerAutopilotGeneration}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Articles Now
                </Button>
                <div className="text-sm text-gray-600">
                  Generates 4-5 articles with real-time research and AI content creation
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <GeneratedArticlesDisplay />
          </div>
        </div>
        
        {/* Real-Time Autonomous AI Generation */}
        <div className="mt-8">
          <RealTimeAutopilotProgress />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
