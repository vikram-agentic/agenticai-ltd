import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, User, Mail, Phone, Building, FileText } from 'lucide-react';

interface Meeting {
  id: string;
  user_name: string;
  user_email: string;
  user_phone?: string;
  company?: string;
  service_interest?: string;
  notes?: string;
  start_time: string;
  end_time: string;
  status: string;
}

const AdminMeetingDashboard = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('meeting_bookings')
        .select(`
          *,
          meeting_slots (
            start_time,
            end_time
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedMeetings = data?.map((m: any) => ({
        ...m,
        start_time: m.meeting_slots.start_time,
        end_time: m.meeting_slots.end_time,
      })) || [];
      setMeetings(formattedMeetings);
    } catch (error) {
      console.error('Error loading meetings:', error);
      toast({
        title: "Error Loading Meetings",
        description: "Could not fetch the meeting schedule.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Meeting Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>All Scheduled Meetings</CardTitle>
          <CardDescription>View and manage all past and upcoming consultations.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading meetings...</p>
          ) : meetings.length === 0 ? (
            <p>No meetings have been scheduled yet.</p>
          ) : (
            <div className="space-y-4">
              {meetings.map(meeting => (
                <Card key={meeting.id} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg">{meeting.user_name}</h3>
                        <Badge>{meeting.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center"><Mail className="w-3 h-3 mr-2" />{meeting.user_email}</p>
                      {meeting.user_phone && <p className="text-sm text-muted-foreground flex items-center"><Phone className="w-3 h-3 mr-2" />{meeting.user_phone}</p>}
                      {meeting.company && <p className="text-sm text-muted-foreground flex items-center"><Building className="w-3 h-3 mr-2" />{meeting.company}</p>}
                      {meeting.service_interest && <p className="text-sm text-muted-foreground flex items-center"><FileText className="w-3 h-3 mr-2" />{meeting.service_interest}</p>}
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold flex items-center"><Calendar className="w-3 h-3 mr-2" />{new Date(meeting.start_time).toLocaleDateString()}</p>
                      <p className="text-muted-foreground flex items-center"><Clock className="w-3 h-3 mr-2" />
                        {new Date(meeting.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                        {new Date(meeting.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {meeting.notes && <p className="mt-2 pt-2 border-t text-xs text-muted-foreground">Notes: {meeting.notes}</p>}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMeetingDashboard;
