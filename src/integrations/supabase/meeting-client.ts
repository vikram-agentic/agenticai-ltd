import { supabase } from './client';
import {
  MeetingSlot,
  MeetingBooking,
  AdminAvailability,
  MeetingType,
  AvailableSlotView,
  BookingFormData,
  SlotSelectionData,
  BookingResponse,
  SlotsResponse,
  MeetingTypesResponse,
  RecurringPattern
} from './meeting-types';

// Meeting Slots Functions
export const meetingSlotsClient = {
  // Get available slots for a specific date range
  async getAvailableSlots(startDate: string, endDate: string, timezone: string = 'UTC'): Promise<SlotsResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('meeting-scheduler', {
        body: {
          action: 'getSlots',
          startDate,
          endDate,
          timezone
        }
      });

      if (error) throw error;

      return {
        success: true,
        slots: data?.slots || []
      };
    } catch (error) {
      console.error('Error fetching available slots:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch available slots'
      };
    }
  },

  // Create a new meeting slot (admin only)
  async createSlot(slot: Partial<MeetingSlot>): Promise<{ success: boolean; slot?: MeetingSlot; error?: string }> {
    try {
      console.log('Sending slot data to Edge Function:', slot);
      
      const { data, error } = await supabase.functions.invoke('meeting-scheduler', {
        body: {
          action: 'createSlots',
          slots: [slot]
        }
      });

      if (error) {
        console.error('Edge Function error:', error);
        throw error;
      }

      console.log('Edge Function response:', data);

      return {
        success: true,
        slot: data?.slots?.[0]
      };
    } catch (error) {
      console.error('Error creating meeting slot:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create meeting slot'
      };
    }
  },

  // Create recurring slots
  async createRecurringSlots(pattern: RecurringPattern, slotTemplate: Partial<MeetingSlot>): Promise<{ success: boolean; slots?: MeetingSlot[]; error?: string }> {
    try {
      // This would typically be handled by a server function
      // For now, we'll create individual slots
      const slots = [];
      const startDate = new Date(pattern.startDate);
      const endDate = pattern.endDate ? new Date(pattern.endDate) : new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days default

      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        if (pattern.type === 'weekly' && pattern.daysOfWeek?.includes(currentDate.getDay())) {
          const slot = {
            ...slotTemplate,
            start_time: new Date(currentDate.getTime() + new Date(slotTemplate.start_time!).getTime()).toISOString(),
            end_time: new Date(currentDate.getTime() + new Date(slotTemplate.end_time!).getTime()).toISOString(),
            is_recurring: true,
            recurring_pattern: pattern
          };
          slots.push(slot);
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const { data, error } = await supabase.functions.invoke('meeting-scheduler', {
        body: {
          action: 'createSlots',
          slots
        }
      });

      if (error) throw error;

      return {
        success: true,
        slots: data?.slots || []
      };
    } catch (error) {
      console.error('Error creating recurring slots:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create recurring slots'
      };
    }
  },

  // Update slot availability
  async updateSlotAvailability(slotId: string, isAvailable: boolean): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('meeting_slots')
        .update({ is_available: isAvailable })
        .eq('id', slotId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error updating slot availability:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update slot availability'
      };
    }
  }
};

// Meeting Bookings Functions
export const meetingBookingsClient = {
  // Create a new booking
  async createBooking(bookingData: BookingFormData, slotSelection: SlotSelectionData): Promise<BookingResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('meeting-scheduler', {
        body: {
          action: 'book',
          bookingData,
          slotSelection
        }
      });

      if (error) throw error;

      return {
        success: true,
        booking: data?.booking
      };
    } catch (error) {
      console.error('Error creating booking:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create booking'
      };
    }
  },

  // Get user's bookings
  async getUserBookings(userEmail: string): Promise<{ success: boolean; bookings?: MeetingBooking[]; error?: string }> {
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
        .eq('user_email', userEmail)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        bookings: data || []
      };
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user bookings'
      };
    }
  },

  // Cancel a booking
  async cancelBooking(bookingId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('meeting-scheduler', {
        body: {
          action: 'cancel',
          bookingId
        }
      });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error cancelling booking:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to cancel booking'
      };
    }
  },

  // Get all bookings (admin only)
  async getAllBookings(): Promise<{ success: boolean; bookings?: MeetingBooking[]; error?: string }> {
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

      return {
        success: true,
        bookings: data || []
      };
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch bookings'
      };
    }
  }
};

// Meeting Types Functions
export const meetingTypesClient = {
  // Get all active meeting types
  async getMeetingTypes(): Promise<MeetingTypesResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('meeting-scheduler', {
        body: {
          action: 'getTypes'
        }
      });

      if (error) throw error;

      return {
        success: true,
        types: data?.types || []
      };
    } catch (error) {
      console.error('Error fetching meeting types:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch meeting types'
      };
    }
  },

  // Create new meeting type (admin only)
  async createMeetingType(meetingType: Partial<MeetingType>): Promise<{ success: boolean; type?: MeetingType; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('meeting_types')
        .insert([meetingType])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        type: data
      };
    } catch (error) {
      console.error('Error creating meeting type:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create meeting type'
      };
    }
  }
};

// Admin Availability Functions
export const adminAvailabilityClient = {
  // Get admin availability
  async getAvailability(): Promise<{ success: boolean; availability?: AdminAvailability[]; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('meeting-scheduler', {
        body: {
          action: 'getAvailability'
        }
      });

      if (error) throw error;

      return {
        success: true,
        availability: data?.availability || []
      };
    } catch (error) {
      console.error('Error fetching admin availability:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch admin availability'
      };
    }
  },

  // Update admin availability
  async updateAvailability(availability: Partial<AdminAvailability>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('admin_availability')
        .upsert([availability], { onConflict: 'day_of_week' });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error updating admin availability:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update admin availability'
      };
    }
  }
};

// Real-time subscriptions
export const meetingSubscriptions = {
  // Subscribe to available slots changes
  subscribeToAvailableSlots(callback: (payload: any) => void) {
    return supabase
      .channel('available_slots_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'meeting_slots'
      }, callback)
      .subscribe();
  },

  // Subscribe to booking changes
  subscribeToBookings(callback: (payload: any) => void) {
    return supabase
      .channel('bookings_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'meeting_bookings'
      }, callback)
      .subscribe();
  },

  // Subscribe to meeting types changes
  subscribeToMeetingTypes(callback: (payload: any) => void) {
    return supabase
      .channel('meeting_types_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'meeting_types'
      }, callback)
      .subscribe();
  },

  // Subscribe to admin availability changes
  subscribeToAdminAvailability(callback: (payload: any) => void) {
    return supabase
      .channel('admin_availability_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'admin_availability'
      }, callback)
      .subscribe();
  }
}; 