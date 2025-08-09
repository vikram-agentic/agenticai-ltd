// 1. Open your Google Sheet and go to Extensions > Apps Script.
// 2. Replace the old code with this entire script.
// 3. Click "Save project".
// 4. Click "Deploy" > "Manage deployments".
// 5. Select your active deployment, click the pencil icon ("Edit").
// 6. From the "Version" dropdown, select "New version".
// 7. Click "Deploy". The URL will remain the same.

const SHEET_ID = '1lFbyOscaxt4XPmyEIUBOJ1Coi24rl0dBxOLPe4jddKc';
const SHEET_NAME = 'contact';

function doPost(e) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    if (!spreadsheet) {
      // This error will be thrown if the script can't access the spreadsheet at all.
      throw new Error("Could not open spreadsheet. Please check the SHEET_ID and ensure the script has permission.");
    }

    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      // This error is more specific and helpful.
      throw new Error(`Could not find a sheet named "${SHEET_NAME}". Please check the name of the sheet tab.`);
    }

    const newRow = [
      e.parameter.name || '',
      e.parameter.email || '',
      e.parameter.company || '',
      e.parameter.phone || '',
      e.parameter.service || '',
      e.parameter.budget || '',
      e.parameter.message || '',
      new Date()
    ];

    sheet.appendRow(newRow);

    const headerRange = sheet.getRange(1, 8); // Cell H1
    if (headerRange.getValue() === '') {
      headerRange.setValue('Timestamp');
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Form submitted successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Log the error for debugging within the Apps Script editor
    console.error(error.toString());
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message || 'An unknown error occurred in the script.'
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
