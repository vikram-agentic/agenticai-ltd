// 1. Open a new Apps Script project at script.google.com.
// 2. Replace the default code with this entire script.
// 3. Go to Project Settings (gear icon) and enable "Show 'appsscript.json' manifest file in editor".
// 4. In the appsscript.json file, add the "calendar" scope to the "oauthScopes" array. It should look like this:
//    "oauthScopes": ["https://www.googleapis.com/auth/script.webapp.deploy", "https://www.googleapis.com/auth/calendar"]
// 5. Save all changes.
// 6. Deploy the script as a Web App, ensuring "Who has access" is set to "Anyone".
// 7. Provide the generated Web App URL.

const CALENDAR_ID = 'primary';
const WORKING_HOURS = { start: 9, end: 17 }; // 9 AM to 5 PM
const MEETING_DURATION_MINUTES = 30;
const TIMEZONE = 'Europe/London';

function doGet(e) {
  const dateStr = e.parameter.date;
  if (!dateStr) {
    return createJsonResponse({ success: false, error: 'Date parameter is required.' });
  }

  try {
    const availableSlots = getAvailableSlots(dateStr);
    return createJsonResponse({ success: true, slots: availableSlots });
  } catch (error) {
    return createJsonResponse({ success: false, error: error.message });
  }
}

function doPost(e) {
  try {
    const eventData = JSON.parse(e.postData.contents);
    const newEvent = createCalendarEvent(eventData);
    return createJsonResponse({ success: true, event: newEvent });
  } catch (error) {
    return createJsonResponse({ success: false, error: error.message });
  }
}

function getAvailableSlots(dateStr) {
  const targetDate = new Date(dateStr);
  const timeMin = new Date(targetDate.setHours(0, 0, 0, 0));
  const timeMax = new Date(targetDate.setHours(23, 59, 59, 999));

  const events = CalendarApp.getCalendarById(CALENDAR_ID).getEvents(timeMin, timeMax);
  const busySlots = events.map(event => ({
    start: event.getStartTime(),
    end: event.getEndTime(),
  }));

  const availableSlots = [];
  const dayStart = new Date(dateStr);
  dayStart.setHours(WORKING_HOURS.start, 0, 0, 0);

  const dayEnd = new Date(dateStr);
  dayEnd.setHours(WORKING_HOURS.end, 0, 0, 0);

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

function createCalendarEvent(eventData) {
  const { startTime, endTime, summary, description, attendees } = eventData;
  const adminEmail = 'info@agentic-ai.ltd';
  
  // Add admin to the guest list
  const guestList = attendees.map(a => a.email);
  if (!guestList.includes(adminEmail)) {
    guestList.push(adminEmail);
  }

  const eventOptions = {
    description: description,
    guests: guestList.join(','),
    sendInvites: true,
  };

  const eventTitle = `Agentic AI Consultation with ${summary.replace('Consultation: ', '')}`;

  const newEvent = CalendarApp.getCalendarById(CALENDAR_ID).createEvent(eventTitle, new Date(startTime), new Date(endTime), eventOptions);
  return { id: newEvent.getId() };
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
