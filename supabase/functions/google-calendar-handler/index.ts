import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// --- Google API Configuration ---
const GOOGLE_API_SCOPE = 'https://www.googleapis.com/auth/calendar';
const CALENDAR_ID = 'primary'; // Use the primary calendar of the service account owner

// --- Meeting Configuration ---
const WORKING_HOURS = {
  start: { hour: 9, minute: 0 },  // 9:00 AM
  end: { hour: 17, minute: 0 },   // 5:00 PM
};
const MEETING_DURATION_MINUTES = 30;
const TIMEZONE = 'Europe/London'; // Your local timezone

// --- Helper function to get Google API Access Token ---
async function getAccessToken() {
  const serviceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');
  if (!serviceAccountKey) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY environment variable not set');
  }
  const serviceAccount = JSON.parse(serviceAccountKey);

  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };
  const payload = {
    iss: serviceAccount.client_email,
    scope: GOOGLE_API_SCOPE,
    aud: 'https://oauth2.googleapis.com/token',
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000)
  };

  // Using a simplified JWT creation for Deno environment
  const token = await createJwt(header, payload, serviceAccount.private_key);

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: token
    })
  });

  const data = await response.json();
  if (!data.access_token) {
    throw new Error('Failed to retrieve access token from Google.');
  }
  return data.access_token;
}

// --- Main Request Handler ---
serve(async (req) => {
  // This is needed to handle CORS preflight requests.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { action, date, eventData } = body;

    if (action === 'getAvailableSlots') {
      const slots = await getAvailableSlots(date);
      return new Response(JSON.stringify({ success: true, slots }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'createEvent') {
      const newEvent = await createCalendarEvent(eventData);
      return new Response(JSON.stringify({ success: true, event: newEvent }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// --- Function to get available slots ---
async function getAvailableSlots(dateStr: string) {
  const accessToken = await getAccessToken();
  const targetDate = new Date(dateStr);

  // Set timeMin and timeMax for the entire day in the specified timezone
  const timeMin = new Date(targetDate.setHours(0, 0, 0, 0)).toISOString();
  const timeMax = new Date(targetDate.setHours(23, 59, 59, 999)).toISOString();

  const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;

  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch calendar events.');
  }

  const data = await response.json();
  const busySlots = data.items.map((event: any) => ({
    start: new Date(event.start.dateTime || event.start.date),
    end: new Date(event.end.dateTime || event.end.date),
  }));

  // --- Calculate available slots ---
  const availableSlots = [];
  const dayStart = new Date(dateStr);
  dayStart.setHours(WORKING_HOURS.start.hour, WORKING_HOURS.start.minute, 0, 0);

  const dayEnd = new Date(dateStr);
  dayEnd.setHours(WORKING_HOURS.end.hour, WORKING_HOURS.end.minute, 0, 0);

  let currentTime = dayStart;

  while (currentTime < dayEnd) {
    const slotEnd = new Date(currentTime.getTime() + MEETING_DURATION_MINUTES * 60000);

    let isBusy = false;
    for (const busy of busySlots) {
      if (currentTime < busy.end && slotEnd > busy.start) {
        isBusy = true;
        break;
      }
    }

    if (!isBusy && slotEnd <= dayEnd) {
      availableSlots.push({
        start_time: currentTime.toISOString(),
        end_time: slotEnd.toISOString(),
      });
    }

    currentTime = slotEnd;
  }

  return availableSlots;
}

// --- Function to create a new calendar event ---
async function createCalendarEvent(eventData: any) {
  const accessToken = await getAccessToken();
  const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?sendUpdates=all`;

  const { startTime, endTime, summary, description, attendees } = eventData;

  const event = {
    summary: summary,
    description: description,
    start: {
      dateTime: startTime,
      timeZone: TIMEZONE,
    },
    end: {
      dateTime: endTime,
      timeZone: TIMEZONE,
    },
    attendees: attendees, // e.g., [{ email: 'user@example.com' }]
    reminders: {
      useDefault: true,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    console.error("Google Calendar API Error:", errorBody);
    throw new Error('Failed to create calendar event.');
  }

  return await response.json();
}


// --- JWT Creation Helper (simplified for Deno) ---
async function createJwt(header: any, payload: any, privateKeyPem: string) {
    const pemContents = privateKeyPem
        .replace('-----BEGIN PRIVATE KEY-----', '')
        .replace('-----END PRIVATE KEY-----', '')
        .replace(/\s/g, '');
    const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

    const importedKey = await crypto.subtle.importKey(
        'pkcs8',
        binaryKey,
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const payloadB64 = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const data = `${headerB64}.${payloadB64}`;

    const signature = await crypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        importedKey,
        new TextEncoder().encode(data)
    );

    const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    
    return `${data}.${signatureB64}`;
}
