# Deploy Resource Generator Functions to Supabase

Write-Host "🚀 Deploying Gemini Resource Generator to Supabase..." -ForegroundColor Green

# Check if Supabase CLI is installed
try {
    $supabaseVersion = npx supabase --version
    Write-Host "✅ Supabase CLI found: $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

# Deploy the functions
Write-Host "📦 Deploying gemini-resource-generator function..." -ForegroundColor Blue
try {
    npx supabase functions deploy gemini-resource-generator
    Write-Host "✅ gemini-resource-generator deployed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to deploy gemini-resource-generator" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

# Run database migrations
Write-Host "🗄️ Running database migrations..." -ForegroundColor Blue
try {
    npx supabase db push
    Write-Host "✅ Database migrations applied successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to apply database migrations" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

# Set environment variables reminder
Write-Host ""
Write-Host "⚠️  IMPORTANT: Make sure to set the following environment variables in Supabase:" -ForegroundColor Yellow
Write-Host "1. GEMINI_API_KEY - Your Google Gemini API key" -ForegroundColor Yellow
Write-Host "2. SUPABASE_URL - Your Supabase project URL" -ForegroundColor Yellow
Write-Host "3. SUPABASE_SERVICE_ROLE_KEY - Your Supabase service role key" -ForegroundColor Yellow
Write-Host ""
Write-Host "You can set these in the Supabase dashboard under Settings > Edge Functions" -ForegroundColor Cyan

Write-Host ""
Write-Host "🎉 Resource Generator deployment complete!" -ForegroundColor Green
Write-Host "The AI Resource Generator is now available in your admin dashboard." -ForegroundColor Green
