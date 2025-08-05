# Simple Email Test Script
Write-Host "Testing Email Delivery..." -ForegroundColor Green

$uri = "https://jdbqecrmegeykvpqyrtk.supabase.co/functions/v1/contact-form-handler"
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkYnFlY3JtZWdleWt2cHF5cnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMzg5NTgsImV4cCI6MjA2OTkxNDk1OH0.GcnzEaL4Fy5aMpyeP8HnP_4vsdla43Y3cH6gt51Yh_w"
}

$body = @{
    name = "Test User"
    email = "test@example.com"
    company = "Test Company"
    phone = "+44 1234 567890"
    service = "AI Agent Development"
    budget = "£10,000 - £50,000"
    message = "This is a test message to verify email delivery functionality."
} | ConvertTo-Json

Write-Host "Sending request to: $uri" -ForegroundColor Yellow
Write-Host "Body: $body" -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri $uri -Method POST -Headers $headers -Body $body
    Write-Host "✅ SUCCESS!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ ERROR!" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Error Message: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
} 