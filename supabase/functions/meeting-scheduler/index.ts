import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Helper function to format dates without date-fns dependency
function formatDate(date: Date, formatStr: string): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return formatStr
    .replace('yyyy', String(year))
    .replace('MM', month)
    .replace('dd', day)
    .replace('HH', hours)
    .replace('mm', minutes);
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export default async (req: Request) => {
  console.log('Meeting scheduler function invoked.');
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key for admin operations
    const supabaseClient = createClient(
      process.env.SUPABASE_URL ?? '',
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
      {
        global: {
          headers: { Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}` },
        },
      }
    );

    const { method, url } = req;
    const urlObj = new URL(url);
    const path = urlObj.pathname.split('/').pop();

    // Handle POST requests with action-based routing
    if (method === 'POST') {
      const body = await req.json() as { action: string };
      const { action } = body;

      switch (action) {
        case 'getSlots':
          return await handleGetSlots(body, supabaseClient)
        case 'getTypes':
          return await handleGetMeetingTypes(supabaseClient)
        case 'getAvailability':
          return await handleGetAvailability(supabaseClient)
        case 'book':
          return await handleBookMeeting(body, supabaseClient)
        case 'createSlots':
          return await handleCreateSlots(body, supabaseClient)
        case 'cancel':
          return await handleCancelBooking(body, supabaseClient)
        default:
          return new Response(JSON.stringify({ error: 'Invalid action' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
      }
    }

    // Handle GET requests for backward compatibility
    if (method === 'GET') {
      const url = new URL(req.url)
      const startDate = url.searchParams.get('startDate')
      const endDate = url.searchParams.get('endDate')
      const timezone = url.searchParams.get('timezone') || 'UTC'
      
      switch (path) {
        case 'slots':
          return await handleGetSlots({ startDate, endDate, timezone }, supabaseClient)
        case 'types':
          return await handleGetMeetingTypes(supabaseClient)
        case 'availability':
          return await handleGetAvailability(supabaseClient)
      }
    }

    return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
};

// Get available slots by calling the database function
async function handleGetSlots(body: any, supabase: any) {
  const { startDate, endDate } = body;

  if (!startDate || !endDate) {
    return new Response(JSON.stringify({ error: 'startDate and endDate are required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    console.log(`Getting slots for date range: ${startDate} to ${endDate}`);
    console.time('rpc-get-available-slots');

    const { data: slots, error } = await supabase.rpc('get_available_slots', {
      start_date_param: startDate,
      end_date_param: endDate,
    });

    console.timeEnd('rpc-get-available-slots');

    if (error) {
      console.error('Error calling get_available_slots function:', error);
      throw error;
    }

    console.log(`Found ${slots.length} available slots.`);
    return new Response(JSON.stringify({ success: true, slots }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching slots:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch slots',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Get meeting types
async function handleGetMeetingTypes(supabase: any) {
  try {
    const { data, error } = await supabase
      .from('meeting_types')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) throw error

    return new Response(JSON.stringify({ success: true, types: data || [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching meeting types:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch meeting types' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

// Get admin availability
async function handleGetAvailability(supabase: any) {
  try {
    const { data, error } = await supabase
      .from('admin_availability')
      .select('*')
      .order('day_of_week', { ascending: true })

    if (error) throw error

    return new Response(JSON.stringify({ success: true, availability: data || [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching availability:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch availability' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

// Book a meeting
async function handleBookMeeting(body: any, supabase: any) {
  try {
    const { bookingData, slotSelection } = body

    // Validate required fields
    if (!bookingData?.user_name || !bookingData?.user_email || !slotSelection?.slot_id) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // First, create or get the slot in the meeting_slots table
    const { data: existingSlot, error: slotCheckError } = await supabase
      .from('meeting_slots')
      .select('*')
      .eq('start_time', slotSelection.start_time)
      .single();

    let slotId;
    if (existingSlot) {
      slotId = existingSlot.id;
      // Check if slot is still available
      if (!existingSlot.is_available) {
        return new Response(JSON.stringify({ error: 'This time slot is no longer available. Please select another time.' }), {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    } else {
      // Create new slot
      const { data: newSlot, error: slotCreateError } = await supabase
        .from('meeting_slots')
        .insert([{
          start_time: slotSelection.start_time,
          end_time: slotSelection.end_time,
          is_available: false, // Mark as unavailable since we're booking it
          max_duration_minutes: 60
        }])
        .select()
        .single();

      if (slotCreateError) throw slotCreateError;
      slotId = newSlot.id;
    }

    // Check if there's already a booking for this slot
    const { data: existingBooking, error: existingBookingError } = await supabase
      .from('meeting_bookings')
      .select('*')
      .eq('slot_id', slotId)
      .in('status', ['confirmed', 'rescheduled'])
      .single();

    if (existingBooking) {
      return new Response(JSON.stringify({ error: 'This time slot is no longer available. Please select another time.' }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Create booking
    const booking = {
      slot_id: slotId,
      user_name: bookingData.user_name,
      user_email: bookingData.user_email,
      user_phone: bookingData.user_phone,
      company: bookingData.company,
      service_interest: bookingData.service_interest,
      meeting_type: bookingData.meeting_type,
      notes: bookingData.notes,
      timezone: bookingData.timezone || 'UTC'
    }

    const { data: newBooking, error: bookingError } = await supabase
      .from('meeting_bookings')
      .insert([booking])
      .select()
      .single()

    if (bookingError) throw bookingError

    // Update slot availability
    if (existingSlot) {
      await supabase
        .from('meeting_slots')
        .update({ is_available: false })
        .eq('id', slotId);
    }

    // Send REAL confirmation emails via SiteGround SMTP
    try {
      await sendRealMeetingEmails({
        ...newBooking,
        start_time: slotSelection.start_time,
        end_time: slotSelection.end_time
      }, supabase)
    } catch (error) {
      console.error('Error sending REAL meeting confirmation emails:', error)
      // Don't block booking if email fails, but log it
    }

    return new Response(JSON.stringify({ success: true, booking: newBooking }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error booking meeting:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to book meeting',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

// Create slots (admin only)
async function handleCreateSlots(body: any, supabase: any) {
  try {
    const { slots } = body

    if (!Array.isArray(slots) || slots.length === 0) {
      return new Response(JSON.stringify({ error: 'Slots array is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Validate slot data
    for (const slot of slots) {
      if (!slot.start_time || !slot.end_time) {
        return new Response(JSON.stringify({ error: 'start_time and end_time are required for each slot' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    const { data, error } = await supabase
      .from('meeting_slots')
      .insert(slots)
      .select()

    if (error) {
      console.error('Database error creating slots:', error)
      return new Response(JSON.stringify({ 
        error: 'Database error creating slots',
        details: error.message,
        code: error.code
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true, slots: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error creating slots:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to create slots',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

// Cancel booking
async function handleCancelBooking(body: any, supabase: any) {
  try {
    const { bookingId } = body

    if (!bookingId) {
      return new Response(JSON.stringify({ error: 'bookingId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get booking to find slot_id
    const { data: booking, error: fetchError } = await supabase
      .from('meeting_bookings')
      .select('slot_id')
      .eq('id', bookingId)
      .single()

    if (fetchError) throw fetchError

    // Update booking status
    const { error: updateError } = await supabase
      .from('meeting_bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)

    if (updateError) throw updateError

    // Make slot available again
    if (booking?.slot_id) {
      await supabase
        .from('meeting_slots')
        .update({ is_available: true })
        .eq('id', booking.slot_id)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error cancelling booking:', error)
    return new Response(JSON.stringify({ error: 'Failed to cancel booking' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

// Send REAL meeting emails using SiteGround SMTP
async function sendRealMeetingEmails(bookingData: any, supabase: any) {
  try {
    console.log('Sending REAL meeting confirmation emails via SiteGround SMTP...');

    // Call the REAL SiteGround email service
    const { data, error } = await supabase.functions.invoke('siteground-email', {
      body: {
        type: 'meeting_scheduled',
        data: bookingData
      }
    });

    if (error) {
      console.error('SiteGround email service error for meeting:', error);
      throw error;
    }

    console.log('REAL meeting emails sent successfully via SiteGround SMTP:', data);
    return data;

  } catch (error) {
    console.error('Error sending REAL meeting emails:', error);
    throw error;
  }
}
