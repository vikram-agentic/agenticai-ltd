// Meeting Scheduler TypeScript Types

export interface MeetingSlot {
  id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  is_recurring: boolean;
  recurring_pattern?: any;
  max_duration_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface MeetingBooking {
  id: string;
  slot_id: string;
  user_name: string;
  user_email: string;
  user_phone?: string;
  company?: string;
  service_interest?: string;
  meeting_type: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  timezone: string;
  created_at: string;
  updated_at: string;
  meeting_slots?: {
    start_time: string;
    end_time: string;
  };
}

export interface AdminAvailability {
  id: string;
  day_of_week: number; // 0=Sunday, 1=Monday, etc.
  start_time: string;
  end_time: string;
  is_available: boolean;
  break_start?: string;
  break_end?: string;
  created_at: string;
  updated_at: string;
}

export interface MeetingType {
  id: string;
  name: string;
  description?: string;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AvailableSlotView {
  id: string;
  start_time: string;
  end_time: string;
  max_duration_minutes: number;
  meeting_type_name: string;
  meeting_type_description?: string;
  meeting_type_duration: number;
}

// Form interfaces
export interface BookingFormData {
  user_name: string;
  user_email: string;
  user_phone?: string;
  company?: string;
  service_interest?: string;
  meeting_type: string;
  notes?: string;
  timezone: string;
}

export interface SlotSelectionData {
  slot_id: string;
  meeting_type: string;
  start_time: string;
  end_time: string;
}

// API Response interfaces
export interface BookingResponse {
  success: boolean;
  booking?: MeetingBooking;
  error?: string;
}

export interface SlotsResponse {
  success: boolean;
  slots?: AvailableSlotView[];
  error?: string;
}

export interface MeetingTypesResponse {
  success: boolean;
  types?: MeetingType[];
  error?: string;
}

// Calendar and timezone interfaces
export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
  booking?: MeetingBooking;
}

export interface DaySchedule {
  date: Date;
  slots: TimeSlot[];
  dayOfWeek: number;
}

export interface WeekSchedule {
  startDate: Date;
  endDate: Date;
  days: DaySchedule[];
}

// Recurring pattern interface
export interface RecurringPattern {
  type: 'weekly' | 'monthly';
  interval: number; // every X weeks/months
  daysOfWeek?: number[]; // for weekly: [1,3,5] for Mon,Wed,Fri
  dayOfMonth?: number; // for monthly: 15 for 15th of month
  startDate: string;
  endDate?: string;
  exceptions?: string[]; // dates to exclude
}

// Admin dashboard interfaces
export interface BookingStats {
  total: number;
  confirmed: number;
  cancelled: number;
  completed: number;
  thisWeek: number;
  thisMonth: number;
}

export interface AdminDashboardData {
  stats: BookingStats;
  recentBookings: MeetingBooking[];
  upcomingBookings: MeetingBooking[];
  availability: AdminAvailability[];
}

// Notification interfaces
export interface EmailTemplate {
  subject: string;
  body: string;
  variables: Record<string, string>;
}

export interface NotificationData {
  booking: MeetingBooking;
  slot: MeetingSlot;
  meetingType: MeetingType;
  userTimezone: string;
} 