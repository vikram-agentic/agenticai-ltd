import { useState, useEffect, useCallback } from 'react';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { 
  meetingSlotsClient, 
  meetingTypesClient, 
  meetingBookingsClient,
  meetingSubscriptions 
} from '../integrations/supabase/meeting-client';
import {
  AvailableSlotView,
  MeetingType,
  BookingFormData,
  SlotSelectionData,
  MeetingBooking,
  BookingResponse,
  SlotsResponse,
  MeetingTypesResponse
} from '../integrations/supabase/meeting-types';

interface UseMeetingSchedulerOptions {
  autoLoad?: boolean;
  defaultDateRange?: number; // days to look ahead
  timezone?: string;
}

export function useMeetingScheduler(options: UseMeetingSchedulerOptions = {}) {
  const {
    autoLoad = true,
    defaultDateRange = 7,
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  } = options;

  // State
  const [availableSlots, setAvailableSlots] = useState<AvailableSlotView[]>([]);
  const [meetingTypes, setMeetingTypes] = useState<MeetingType[]>([]);
  const [userBookings, setUserBookings] = useState<MeetingBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlotView | null>(null);
  const [selectedMeetingType, setSelectedMeetingType] = useState<MeetingType | null>(null);

  // Load meeting types
  const loadMeetingTypes = useCallback(async () => {
    try {
      setError(null);
      const response: MeetingTypesResponse = await meetingTypesClient.getMeetingTypes();
      
      if (response.success && response.types) {
        setMeetingTypes(response.types);
        return response.types;
      } else {
        throw new Error(response.error || 'Failed to load meeting types');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load meeting types';
      setError(errorMessage);
      console.error('Error loading meeting types:', err);
      return [];
    }
  }, []);

  // Load available slots for a date range
  const loadAvailableSlots = useCallback(async (startDate?: Date, endDate?: Date) => {
    try {
      setIsLoading(true);
      setError(null);

      const start = startDate || new Date();
      const end = endDate || addDays(start, defaultDateRange);

      const response: SlotsResponse = await meetingSlotsClient.getAvailableSlots(
        format(start, 'yyyy-MM-dd'),
        format(end, 'yyyy-MM-dd'),
        timezone
      );

      if (response.success && response.slots) {
        setAvailableSlots(response.slots);
        return response.slots;
      } else {
        throw new Error(response.error || 'Failed to load available slots');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load available slots';
      setError(errorMessage);
      console.error('Error loading available slots:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [defaultDateRange, timezone]);

  // Load user's bookings
  const loadUserBookings = useCallback(async (userEmail: string) => {
    try {
      setError(null);
      const response = await meetingBookingsClient.getUserBookings(userEmail);
      
      if (response.success && response.bookings) {
        setUserBookings(response.bookings);
        return response.bookings;
      } else {
        throw new Error(response.error || 'Failed to load user bookings');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load user bookings';
      setError(errorMessage);
      console.error('Error loading user bookings:', err);
      return [];
    }
  }, []);

  // Book a meeting
  const bookMeeting = useCallback(async (
    bookingData: BookingFormData, 
    slotSelection: SlotSelectionData
  ): Promise<BookingResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await meetingBookingsClient.createBooking(bookingData, slotSelection);
      
      if (response.success && response.booking) {
        // Update local state
        setAvailableSlots(prev => prev.filter(slot => slot.id !== slotSelection.slot_id));
        setUserBookings(prev => [response.booking!, ...prev]);
        setSelectedSlot(null);
        setSelectedMeetingType(null);
      }

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to book meeting';
      setError(errorMessage);
      console.error('Error booking meeting:', err);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cancel a booking
  const cancelBooking = useCallback(async (bookingId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);
      const response = await meetingBookingsClient.cancelBooking(bookingId);
      
      if (response.success) {
        // Update local state
        setUserBookings(prev => prev.filter(booking => booking.id !== bookingId));
        // Reload available slots to show the cancelled slot
        await loadAvailableSlots();
      }

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel booking';
      setError(errorMessage);
      console.error('Error cancelling booking:', err);
      return {
        success: false,
        error: errorMessage
      };
    }
  }, [loadAvailableSlots]);

  // Select a slot
  const selectSlot = useCallback((slot: AvailableSlotView) => {
    setSelectedSlot(slot);
  }, []);

  // Select a meeting type
  const selectMeetingType = useCallback((meetingType: MeetingType) => {
    setSelectedMeetingType(meetingType);
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedSlot(null);
    setSelectedMeetingType(null);
  }, []);

  // Get slots for a specific date
  const getSlotsForDate = useCallback((date: Date) => {
    return availableSlots.filter(slot => {
      const slotDate = new Date(slot.start_time);
      return slotDate.toDateString() === date.toDateString();
    });
  }, [availableSlots]);

  // Get slots for a date range
  const getSlotsForDateRange = useCallback((startDate: Date, endDate: Date) => {
    return availableSlots.filter(slot => {
      const slotDate = new Date(slot.start_time);
      return slotDate >= startDate && slotDate <= endDate;
    });
  }, [availableSlots]);

  // Get slots for this week
  const getSlotsForThisWeek = useCallback(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const end = endOfWeek(new Date(), { weekStartsOn: 1 });
    return getSlotsForDateRange(start, end);
  }, [getSlotsForDateRange]);

  // Get slots for next week
  const getSlotsForNextWeek = useCallback(() => {
    const start = startOfWeek(addDays(new Date(), 7), { weekStartsOn: 1 });
    const end = endOfWeek(addDays(new Date(), 7), { weekStartsOn: 1 });
    return getSlotsForDateRange(start, end);
  }, [getSlotsForDateRange]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!autoLoad) return;

    const subscription = meetingSubscriptions.subscribeToAvailableSlots((payload) => {
      if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
        // Reload slots when there are changes
        loadAvailableSlots();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [autoLoad, loadAvailableSlots]);

  // Auto-load data on mount
  useEffect(() => {
    if (autoLoad) {
      loadMeetingTypes();
      loadAvailableSlots();
    }
  }, [autoLoad, loadMeetingTypes, loadAvailableSlots]);

  return {
    // State
    availableSlots,
    meetingTypes,
    userBookings,
    isLoading,
    error,
    selectedSlot,
    selectedMeetingType,

    // Actions
    loadMeetingTypes,
    loadAvailableSlots,
    loadUserBookings,
    bookMeeting,
    cancelBooking,
    selectSlot,
    selectMeetingType,
    clearSelection,

    // Utilities
    getSlotsForDate,
    getSlotsForDateRange,
    getSlotsForThisWeek,
    getSlotsForNextWeek,

    // Computed values
    hasSelectedSlot: !!selectedSlot,
    hasSelectedMeetingType: !!selectedMeetingType,
    canBook: !!selectedSlot && !!selectedMeetingType,
    totalSlots: availableSlots.length,
    totalBookings: userBookings.length,
    confirmedBookings: userBookings.filter(b => b.status === 'confirmed').length,
    cancelledBookings: userBookings.filter(b => b.status === 'cancelled').length
  };
} 