import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { Calendar, Clock, User, Mail, Phone, Building, FileText, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useToast } from './ui/use-toast';

// Define the structure of a slot returned by our Apps Script
interface AvailableSlot {
  start_time: string;
  end_time: string;
}

// Define the structure of the booking form data
interface BookingFormData {
  user_name: string;
  user_email: string;
  user_phone: string;
  company: string;
  service_interest: string;
  notes: string;
}

interface MeetingSchedulerProps {
  onBookingComplete?: (booking: any) => void;
  className?: string;
}

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzGdgPqvPbdxzMICTufbva2MWDUFkbZ9vq3NmOQWmncvdfpbia5BZJSNe1qaKmDilL47g/exec';

export function MeetingScheduler({ onBookingComplete, className = "" }: MeetingSchedulerProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'calendar' | 'slots' | 'form' | 'confirmation'>('calendar');
  const [bookingForm, setBookingForm] = useState<BookingFormData>({
    user_name: '',
    user_email: '',
    user_phone: '',
    company: '',
    service_interest: '',
    notes: '',
  });

  const { toast } = useToast();

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  useEffect(() => {
    if (selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedDate]);

  const loadAvailableSlots = async () => {
    if (!selectedDate) return;
    setIsLoading(true);
    try {
      const startDate = format(selectedDate, 'yyyy-MM-dd');
      const response = await fetch(`${APPS_SCRIPT_URL}?date=${startDate}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to load available slots.');
      }
      setAvailableSlots(data.slots || []);
    } catch (error) {
      console.error('Error loading available slots:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not fetch slots.",
        variant: "destructive"
      });
      setAvailableSlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;
    setIsLoading(true);
    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          startTime: selectedSlot.start_time,
          endTime: selectedSlot.end_time,
          summary: `Consultation: ${bookingForm.user_name}`,
          description: `Service of Interest: ${bookingForm.service_interest}\nCompany: ${bookingForm.company}\nPhone: ${bookingForm.user_phone}\n\nNotes:\n${bookingForm.notes}`,
          attendees: [{ email: bookingForm.user_email }],
        }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to book the meeting.');
      }
      setStep('confirmation');
      onBookingComplete?.(data.event);
    } catch (error) {
      console.error('Error booking meeting:', error);
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Could not book the meeting.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setStep('slots');
  };

  const handleSlotSelect = (slot: AvailableSlot) => {
    setSelectedSlot(slot);
    setStep('form');
  };

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setBookingForm(prev => ({ ...prev, [field]: value }));
  };

  const resetScheduler = () => {
    setSelectedDate(null);
    setSelectedSlot(null);
    setStep('calendar');
    setBookingForm({ user_name: '', user_email: '', user_phone: '', company: '', service_interest: '', notes: '' });
  };

  // --- RENDER FUNCTIONS ---

  const renderCalendar = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Select a Date</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(addDays(currentDate, -7))}>Prev</Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(addDays(currentDate, 7))}>Next</Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">{day}</div>)}
        {weekDays.map(day => (
          <Button
            key={day.toISOString()}
            variant={isSameDay(day, new Date()) ? "default" : "outline"}
            className={`h-16 flex-col ${day < new Date() && !isSameDay(day, new Date()) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/10'}`}
            disabled={day < new Date() && !isSameDay(day, new Date())}
            onClick={() => handleDateSelect(day)}
          >
            <span className="text-sm font-medium">{format(day, 'd')}</span>
            <span className="text-xs text-muted-foreground">{format(day, 'MMM')}</span>
          </Button>
        ))}
      </div>
    </div>
  );

  const renderSlots = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Available Time Slots</h3>
          <p className="text-sm text-muted-foreground">{selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setStep('calendar')}>Back to Calendar</Button>
      </div>
      {isLoading ? <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
        : availableSlots.length === 0 ? <div className="text-center py-8"><Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" /><p className="text-muted-foreground">No available slots for this date.</p></div>
        : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableSlots.map(slot => (
              <Card key={slot.start_time} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleSlotSelect(slot)}>
                <CardContent className="p-4 text-center">
                  <p className="font-medium text-lg">{format(parseISO(slot.start_time), 'h:mm a')}</p>
                </CardContent>
              </Card>
            ))}
          </div>
      }
    </div>
  );

  const renderBookingForm = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Confirm Your Booking</h3>
          <p className="text-sm text-muted-foreground">{selectedDate && format(selectedDate, 'EEEE, d MMMM yyyy')} at {selectedSlot && format(parseISO(selectedSlot.start_time), 'h:mm a')}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setStep('slots')}>Back to Slots</Button>
      </div>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name *</label>
            <input type="text" required value={bookingForm.user_name} onChange={(e) => handleInputChange('user_name', e.target.value)} className="w-full px-3 py-2 border border-input rounded-md" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email *</label>
            <input type="email" required value={bookingForm.user_email} onChange={(e) => handleInputChange('user_email', e.target.value)} className="w-full px-3 py-2 border border-input rounded-md" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Service of Interest</label>
          <input type="text" value={bookingForm.service_interest} onChange={(e) => handleInputChange('service_interest', e.target.value)} className="w-full px-3 py-2 border border-input rounded-md" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Additional Notes</label>
          <textarea value={bookingForm.notes} onChange={(e) => handleInputChange('notes', e.target.value)} rows={3} className="w-full px-3 py-2 border border-input rounded-md" />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Booking...' : 'Confirm Booking'}</Button>
      </form>
    </div>
  );

  const renderConfirmation = () => (
    <div className="text-center space-y-4 py-8">
      <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
      <h3 className="text-xl font-semibold">Booking Confirmed!</h3>
      <p className="text-muted-foreground">A calendar invitation has been sent to your email address.</p>
      <Button onClick={resetScheduler}>Book Another Meeting</Button>
    </div>
  );

  return (
    <Card className={`w-full max-w-4xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />Schedule a Meeting</CardTitle>
        <CardDescription>Choose a date and time that works for you.</CardDescription>
      </CardHeader>
      <CardContent>
        {step === 'calendar' && renderCalendar()}
        {step === 'slots' && renderSlots()}
        {step === 'form' && renderBookingForm()}
        {step === 'confirmation' && renderConfirmation()}
      </CardContent>
    </Card>
  );
}
