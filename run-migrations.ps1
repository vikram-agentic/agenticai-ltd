#!/usr/bin/env pwsh
# Script to run Supabase database migrations

Write-Host "🚀 Running Supabase Database Migrations..." -ForegroundColor Green

# Change to supabase directory
Set-Location supabase

# Run migrations
try {
    Write-Host "📊 Pushing migrations to database..." -ForegroundColor Yellow
    npx supabase db push --include-all
    
    Write-Host "✅ Database migrations completed successfully!" -ForegroundColor Green
    Write-Host "🎯 Your admin dashboard database is now ready!" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Migration failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    # Go back to root directory
    Set-Location ..
}

Write-Host "🏁 Done!" -ForegroundColor Green