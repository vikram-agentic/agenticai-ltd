#!/usr/bin/env node

/**
 * API Connection Test Script
 * Tests all external API connections for the Admin Dashboard
 */

// Using native fetch (available in Node.js 18+)

import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

async function testGeminiAPI() {
  console.log('\n🔍 Testing Google Gemini API...');
  
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    console.log('❌ GEMINI_API_KEY not found in environment variables');
    return false;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: 'Hello! Please respond with "Gemini API is working correctly" to confirm the connection is successful.'
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 100,
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.log(`❌ Gemini API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.log(`Error details: ${errorText}`);
      return false;
    }

    const data = await response.json();
    console.log('✅ Gemini API connection successful!');
    console.log(`Response: ${data.candidates[0].content.parts[0].text}`);
    console.log(`Tokens used: ${data.usageMetadata?.totalTokenCount || 'N/A'}`);
    return true;

  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.log('❌ Gemini API request timed out after 30 seconds');
    } else {
      console.log(`❌ Gemini API error: ${error.message}`);
    }
    return false;
  }
}

async function testBFLFluxAPI() {
  console.log('\n🎨 Testing BFL Flux Kontext Pro API...');
  
  const bflApiKey = process.env.BFL_FLUX_API_KEY;
  if (!bflApiKey) {
    console.log('❌ BFL_FLUX_API_KEY not found in environment variables');
    return false;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch('https://api.bfl.ml/v1/flux-kontext-pro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-key': bflApiKey
      },
      body: JSON.stringify({
        prompt: 'A modern AI automation dashboard with purple and blue gradients',
        negative_prompt: 'low quality, blurry, distorted',
        width: 1024,
        height: 1024,
        steps: 20,
        cfg_scale: 7.5,
        seed: -1
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.log(`❌ BFL Flux API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.log(`Error details: ${errorText}`);
      return false;
    }

    const data = await response.json();
    console.log('✅ BFL Flux API connection successful!');
    console.log(`Image generated: ${data.images ? data.images.length : 0} images`);
    return true;

  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.log('❌ BFL Flux API request timed out after 30 seconds');
    } else {
      console.log(`❌ BFL Flux API error: ${error.message}`);
    }
    return false;
  }
}

async function testSupabaseConnection() {
  console.log('\n🗄️ Testing Supabase Connection...');
  
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('❌ Supabase environment variables not found');
    return false;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.log(`❌ Supabase connection error: ${response.status} ${response.statusText}`);
      return false;
    }

    console.log('✅ Supabase connection successful!');
    return true;

  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.log('❌ Supabase request timed out after 10 seconds');
    } else {
      console.log(`❌ Supabase connection error: ${error.message}`);
    }
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting API Connection Tests...\n');
  
  const results = {
    gemini: await testGeminiAPI(),
    bflFlux: await testBFLFluxAPI(),
    supabase: await testSupabaseConnection()
  };

  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  console.log(`Google Gemini API: ${results.gemini ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`BFL Flux API: ${results.bflFlux ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Supabase Connection: ${results.supabase ? '✅ PASS' : '❌ FAIL'}`);

  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;

  console.log(`\nOverall: ${passedTests}/${totalTests} tests passed`);

  if (passedTests === totalTests) {
    console.log('🎉 All API connections are working correctly!');
  } else {
    console.log('⚠️ Some API connections failed. Please check your environment variables and API keys.');
    console.log('\n📝 Next steps:');
    console.log('1. Update your .env.local file with correct API keys');
    console.log('2. Set up Supabase secrets using: npx supabase secrets set GEMINI_API_KEY=your_key');
    console.log('3. Redeploy Supabase functions: npx supabase functions deploy');
  }
}

// Run the tests
runAllTests().catch(console.error); 