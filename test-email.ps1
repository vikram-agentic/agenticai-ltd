# Test Email Delivery Script for Agentic AI Contact Form
# Run this script to test the email functionality

$uri = "https://jdbqecrmegeykvpqyrtk.supabase.co/functions/v1/contact-form-handler"
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkYnFlY3JtZWdleWt2cHF5cnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0OTcyOTcsImV4cCI6MjA0OTA3MzI5N30.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8"
}

# Test data
$testData = @{
    name = "Test User"
    email = "test@example.com"
    company = "Test Company"
    phone = "+44 1234 567890"
    service = "AI Agent Development"
    budget = "£10,000 - £50,000"
    message = "This is a test message to verify email delivery functionality. Please confirm receipt."
}

# Convert to JSON
$body = $testData | ConvertTo-Json

Write-Host "Testing email delivery..." -ForegroundColor Green
Write-Host "Sending test data: $body" -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri $uri -Method POST -Headers $headers -Body $body
    Write-Host "✅ SUCCESS!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json -Depth 10)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📧 Check these emails:" -ForegroundColor Yellow
    Write-Host "1. Admin notification: info@agentic-ai.ltd" -ForegroundColor White
    Write-Host "2. User acknowledgment: test@example.com" -ForegroundColor White
    Write-Host ""
    Write-Host "🔍 Also check Supabase Dashboard → Table Editor → contact_submissions" -ForegroundColor Yellow
} catch {
    Write-Host "❌ ERROR!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
} 