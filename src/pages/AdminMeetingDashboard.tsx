import React, { useState, useEffect } from 'react';
import { format, parseISO, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Filter,
  Download
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../components/ui/use-toast';
import { 
  meetingBookingsClient, 
  meetingSlotsClient, 
  meetingTypesClient, 
  adminAvailabilityClient,
  meetingSubscriptions
} from '../integrations/supabase/meeting-client';
import {
  MeetingBooking,
  MeetingSlot,
  MeetingType,
  AdminAvailability,
  BookingStats,
  RecurringPattern
} from '../integrations/supabase/meeting-types';

export function AdminMeetingDashboard() {
  const [bookings, setBookings] = useState<MeetingBooking[]>([]);
  const [slots, setSlots] = useState<MeetingSlot[]>([]);
  const [meetingTypes, setMeetingTypes] = useState<MeetingType[]>([]);
  const [availability, setAvailability] = useState<AdminAvailability[]>([]);
  const [stats, setStats] = useState<BookingStats>({
    total: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
    thisWeek: 0,
    thisMonth: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateSlotOpen, setIsCreateSlotOpen] = useState(false);
  const [isCreateTypeOpen, setIsCreateTypeOpen] = useState(false);
  const [newSlot, setNewSlot] = useState({
    start_time: '',
    end_time: '',
    max_duration_minutes: 60,
    is_recurring: false
  });
  const [newMeetingType, setNewMeetingType] = useState({
    name: '',
    description: '',
    duration_minutes: 60
  });

  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
    const { bookingSubscription, slotSubscription, typeSubscription, availabilitySubscription } = setupRealTimeSubscriptions();
    return () => {
      bookingSubscription.unsubscribe();
      slotSubscription.unsubscribe();
      typeSubscription.unsubscribe();
      availabilitySubscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    loadSlots();
  }, [selectedDate]);

  const setupRealTimeSubscriptions = () => {
    // Subscribe to booking changes
    const bookingSubscription = meetingSubscriptions.subscribeToBookings((payload) => {
      console.log('Booking change:', payload);
      if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE' || payload.eventType === 'DELETE') {
        loadDashboardData();
      }
    });

    // Subscribe to slot changes
    const slotSubscription = meetingSubscriptions.subscribeToAvailableSlots((payload) => {
      console.log('Slot change:', payload);
      if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE' || payload.eventType === 'DELETE') {
        loadDashboardData();
      }
    });

    // Subscribe to meeting type changes
    const typeSubscription = meetingSubscriptions.subscribeToMeetingTypes((payload) => {
      console.log('Meeting type change:', payload);
      if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE' || payload.eventType === 'DELETE') {
        loadMeetingTypes();
      }
    });

    // Subscribe to availability changes
    const availabilitySubscription = meetingSubscriptions.subscribeToAdminAvailability((payload) => {
      console.log('Availability change:', payload);
      if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE' || payload.eventType === 'DELETE') {
        loadAvailability();
      }
    });

    return {
      bookingSubscription,
      slotSubscription,
      typeSubscription,
      availabilitySubscription
    };
  };

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadBookings(),
        loadSlots(),
        loadMeetingTypes(),
        loadAvailability()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadBookings = async () => {
    const response = await meetingBookingsClient.getAllBookings();
    if (response.success && response.bookings) {
      setBookings(response.bookings);
      calculateStats(response.bookings);
    }
  };

  const loadSlots = async () => {
    const startDate = format(startOfWeek(selectedDate), 'yyyy-MM-dd');
    const endDate = format(endOfWeek(selectedDate), 'yyyy-MM-dd');
    
    const response = await meetingSlotsClient.getAvailableSlots(startDate, endDate);
    if (response.success && response.slots) {
      setSlots(response.slots as any);
    }
  };

  const loadMeetingTypes = async () => {
    const response = await meetingTypesClient.getMeetingTypes();
    if (response.success && response.types) {
      setMeetingTypes(response.types);
    }
  };

  const loadAvailability = async () => {
    const response = await adminAvailabilityClient.getAvailability();
    if (response.success && response.availability) {
      setAvailability(response.availability);
    }
  };

  const calculateStats = (allBookings: MeetingBooking[]) => {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats: BookingStats = {
      total: allBookings.length,
      confirmed: allBookings.filter(b => b.status === 'confirmed').length,
      cancelled: allBookings.filter(b => b.status === 'cancelled').length,
      completed: allBookings.filter(b => b.status === 'completed').length,
      thisWeek: allBookings.filter(b => parseISO(b.created_at) >= weekStart).length,
      thisMonth: allBookings.filter(b => parseISO(b.created_at) >= monthStart).length
    };

    setStats(stats);
  };

  const handleCreateSlot = async () => {
    try {
      // Validate that we have start and end times
      if (!newSlot.start_time || !newSlot.end_time) {
        toast({
          title: "Error",
          description: "Start time and end time are required",
          variant: "destructive"
        });
        return;
      }

      // Convert local datetime to ISO string
      const startTime = new Date(newSlot.start_time).toISOString();
      const endTime = new Date(newSlot.end_time).toISOString();

      console.log('Creating slot with:', { startTime, endTime, max_duration_minutes: newSlot.max_duration_minutes });

      const response = await meetingSlotsClient.createSlot({
        start_time: startTime,
        end_time: endTime,
        max_duration_minutes: newSlot.max_duration_minutes,
        is_recurring: newSlot.is_recurring
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Slot created successfully"
        });
        setIsCreateSlotOpen(false);
        setNewSlot({ start_time: '', end_time: '', max_duration_minutes: 60, is_recurring: false });
        loadSlots();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error creating slot:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create slot",
        variant: "destructive"
      });
    }
  };

  const handleCreateMeetingType = async () => {
    try {
      const response = await meetingTypesClient.createMeetingType(newMeetingType);
      if (response.success) {
        toast({
          title: "Success",
          description: "Meeting type created successfully"
        });
        setIsCreateTypeOpen(false);
        setNewMeetingType({ name: '', description: '', duration_minutes: 60 });
        loadDashboardData();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create meeting type",
        variant: "destructive"
      });
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const response = await meetingBookingsClient.cancelBooking(bookingId);
      if (response.success) {
        toast({
          title: "Success",
          description: "Booking cancelled successfully"
        });
        loadDashboardData();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cancel booking",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Confirmed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filterStatus === 'all') return true;
    return booking.status === filterStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meeting Dashboard</h1>
          <p className="text-muted-foreground">Manage bookings, slots, and availability</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateSlotOpen} onOpenChange={setIsCreateSlotOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Slot
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Slot</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Time</Label>
                    <Input
                      type="datetime-local"
                      value={newSlot.start_time}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, start_time: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>End Time</Label>
                    <Input
                      type="datetime-local"
                      value={newSlot.end_time}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, end_time: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label>Max Duration (minutes)</Label>
                  <Input
                    type="number"
                    value={newSlot.max_duration_minutes}
                    onChange={(e) => setNewSlot(prev => ({ ...prev, max_duration_minutes: parseInt(e.target.value) }))}
                  />
                </div>
                <Button onClick={handleCreateSlot} className="w-full">Create Slot</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateTypeOpen} onOpenChange={setIsCreateTypeOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Meeting Type
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Meeting Type</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={newMeetingType.name}
                    onChange={(e) => setNewMeetingType(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., AI Strategy Session"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newMeetingType.description}
                    onChange={(e) => setNewMeetingType(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the meeting type"
                  />
                </div>
                <div>
                  <Label>Duration (minutes)</Label>
                  <Input
                    type="number"
                    value={newMeetingType.duration_minutes}
                    onChange={(e) => setNewMeetingType(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) }))}
                  />
                </div>
                <Button onClick={handleCreateMeetingType} className="w-full">Create Meeting Type</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total Bookings</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Confirmed</p>
                <p className="text-2xl font-bold">{stats.confirmed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">Cancelled</p>
                <p className="text-2xl font-bold">{stats.cancelled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">This Week</p>
                <p className="text-2xl font-bold">{stats.thisWeek}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">This Month</p>
                <p className="text-2xl font-bold">{stats.thisMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="bookings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="slots">Available Slots</TabsTrigger>
          <TabsTrigger value="types">Meeting Types</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">All Bookings</h2>
            <div className="flex items-center gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Meeting Type</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booking.user_name}</p>
                        {booking.company && <p className="text-sm text-muted-foreground">{booking.company}</p>}
                      </div>
                    </TableCell>
                    <TableCell>{booking.user_email}</TableCell>
                    <TableCell>{booking.meeting_type}</TableCell>
                    <TableCell>
                      {booking.meeting_slots && (
                        <div>
                          <p className="font-medium">
                            {format(parseISO(booking.meeting_slots.start_time), 'MMM d, yyyy')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(parseISO(booking.meeting_slots.start_time), 'h:mm a')} - 
                            {format(parseISO(booking.meeting_slots.end_time), 'h:mm a')}
                          </p>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {booking.status === 'confirmed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Cancel
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="slots" className="space-y-4">
          <h2 className="text-xl font-semibold">Available Slots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {slots.map((slot) => (
              <Card key={slot.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <Badge variant={slot.is_available ? "default" : "secondary"}>
                      {slot.is_available ? "Available" : "Booked"}
                    </Badge>
                  </div>
                  <p className="font-medium">
                    {format(parseISO(slot.start_time), 'MMM d, yyyy')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(slot.start_time), 'h:mm a')} - {format(parseISO(slot.end_time), 'h:mm a')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Max duration: {slot.max_duration_minutes} minutes
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => meetingSlotsClient.updateSlotAvailability(slot.id, !slot.is_available)}
                  >
                    {slot.is_available ? 'Mark as Unavailable' : 'Mark as Available'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          <h2 className="text-xl font-semibold">Meeting Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {meetingTypes.map((type) => (
              <Card key={type.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{type.name}</h3>
                    <Badge variant="outline">{type.duration_minutes}min</Badge>
                  </div>
                  {type.description && (
                    <p className="text-sm text-muted-foreground mb-2">{type.description}</p>
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="availability" className="space-y-4">
          <h2 className="text-xl font-semibold">Weekly Availability</h2>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availability.map((day) => (
                  <TableRow key={day.id}>
                    <TableCell>
                      {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day.day_of_week]}
                    </TableCell>
                    <TableCell>{day.start_time}</TableCell>
                    <TableCell>{day.end_time}</TableCell>
                    <TableCell>
                      <Badge variant={day.is_available ? "default" : "secondary"}>
                        {day.is_available ? "Available" : "Unavailable"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
