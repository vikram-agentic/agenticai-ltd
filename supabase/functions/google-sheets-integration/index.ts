import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// PRODUCTION Google Sheets Configuration
const GOOGLE_SHEETS_CONFIG = {
  spreadsheetId: '1lFbyOscaxt4XPmyEIUBOJ1Coi24rl0dBxOLPe4jddKc',
  range: 'Sheet1!A:H', // Covers all columns A to H (including timestamp)
  apiUrl: 'https://sheets.googleapis.com/v4/spreadsheets',
  scope: 'https://www.googleapis.com/auth/spreadsheets'
};

interface ContactData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  service?: string;
  budget?: string;
  message: string;
}

// PRODUCTION-GRADE: Get Google Sheets access token using service account with proper JWT signing
async function getAccessToken() {
  try {
    const serviceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');
    
    if (!serviceAccountKey) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY environment variable not set');
    }

    const serviceAccount = JSON.parse(serviceAccountKey);
    
    if (!serviceAccount.private_key || !serviceAccount.client_email) {
      throw new Error('Invalid service account credentials - missing private_key or client_email');
    }

    console.log('Creating JWT for service account:', serviceAccount.client_email);

    const now = Math.floor(Date.now() / 1000);
    const jwtHeader = {
      alg: 'RS256',
      typ: 'JWT'
    };

    const jwtPayload = {
      iss: serviceAccount.client_email,
      scope: GOOGLE_SHEETS_CONFIG.scope,
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    };

    // Create proper JWT token with RS256 signing
    const token = await createJWTWithRS256(jwtHeader, jwtPayload, serviceAccount.private_key);
    
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: token
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OAuth token request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.access_token) {
      throw new Error('No access token received from Google OAuth');
    }

    console.log('Successfully obtained access token');
    return data.access_token;
    
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

// PRODUCTION-GRADE: Proper JWT creation with RS256 signing using Web Crypto API
async function createJWTWithRS256(header: any, payload: any, privateKeyPem: string) {
  try {
    // Base64url encode header and payload
    const headerB64 = base64urlEncode(JSON.stringify(header));
    const payloadB64 = base64urlEncode(JSON.stringify(payload));
    const data = `${headerB64}.${payloadB64}`;

    // Import the private key
    const privateKey = await importRSAPrivateKey(privateKeyPem);
    
    // Sign the data
    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      privateKey,
      new TextEncoder().encode(data)
    );

    // Base64url encode the signature
    const signatureB64 = base64urlEncode(new Uint8Array(signature));
    
    return `${data}.${signatureB64}`;
    
  } catch (error) {
    console.error('Error creating JWT:', error);
    throw error;
  }
}

// Helper function to import RSA private key
async function importRSAPrivateKey(pemKey: string) {
  // Remove header/footer and whitespace
  const pemContents = pemKey
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');
  
  // Convert base64 to binary
  const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
  
  // Import the key
  return await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  );
}

// Helper function for base64url encoding
function base64urlEncode(data: string | Uint8Array): string {
  let base64;
  if (typeof data === 'string') {
    base64 = btoa(data);
  } else {
    base64 = btoa(String.fromCharCode(...data));
  }
  
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// PRODUCTION-GRADE: Direct Google Sheets API integration
async function appendToGoogleSheets(contactData: ContactData) {
  try {
    console.log('Adding contact data to Google Sheets via direct API...');
    
    // Get access token
    const accessToken = await getAccessToken();
    
    // Prepare row data matching your sheet headers
    const rowData = [
      contactData.name || '',           // Full Name
      contactData.email || '',          // Email Address
      contactData.company || '',        // Company
      contactData.phone || '',          // Phone Number
      contactData.service || '',        // Service Interest
      contactData.budget || '',         // Project Budget
      contactData.message || '',        // Project Details
      new Date().toLocaleString('en-GB', { 
        timeZone: 'Europe/London',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })  // Timestamp
    ];

    // Use Google Sheets API v4 to append data
    const sheetsUrl = `${GOOGLE_SHEETS_CONFIG.apiUrl}/${GOOGLE_SHEETS_CONFIG.spreadsheetId}/values/${GOOGLE_SHEETS_CONFIG.range}:append`;
    
    const requestBody = {
      range: GOOGLE_SHEETS_CONFIG.range,
      majorDimension: 'ROWS',
      values: [rowData]
    };

    const response = await fetch(`${sheetsUrl}?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Sheets API error: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log('Successfully added to Google Sheets:', result);
    
    // Log the operation in Supabase for monitoring
    await logGoogleSheetsOperation(contactData, result, true);
    
    return { 
      success: true, 
      result,
      row: result.updates?.updatedRows || 1,
      range: result.updates?.updatedRange
    };
    
  } catch (error) {
    console.error('Error adding to Google Sheets:', error);
    
    // Log the error in Supabase for monitoring
    await logGoogleSheetsOperation(contactData, null, false, error.message);
    
    return { success: false, error: error.message };
  }
}

// Helper function to log Google Sheets operations for monitoring
async function logGoogleSheetsOperation(
  contactData: ContactData, 
  result: any, 
  success: boolean, 
  errorMessage?: string
) {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      await supabase.from('google_sheets_logs').insert([{
        email: contactData.email,
        name: contactData.name,
        success: success,
        result: success ? JSON.stringify(result) : null,
        error_message: errorMessage || null,
        processed_at: new Date().toISOString()
      }]);
    }
  } catch (logError) {
    console.error('Error logging Google Sheets operation:', logError);
    // Don't throw here - logging failures shouldn't break the main flow
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contactData } = await req.json();

    if (!contactData) {
      throw new Error('Contact data is required');
    }

    console.log('Processing Google Sheets integration for:', contactData.email);

    const result = await appendToGoogleSheets(contactData);

    return new Response(JSON.stringify({
      success: result.success,
      message: result.success ? 'Data added to Google Sheets successfully' : 'Failed to add data to Google Sheets',
      error: result.error || null
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Google Sheets integration error:', error);
    return new Response(JSON.stringify({
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});




