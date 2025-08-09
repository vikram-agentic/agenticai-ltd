# PowerShell script to test Make.com webhook
$webhookUrl = "https://hook.eu2.make.com/ioueqbwptrsfg5ht8p25llks7j2xwwb8"

$testData = @{
    name = "John Smith"
    email = "john.smith@testcompany.co.uk"
    company = "Tech Innovations Ltd"
    phone = "+44 20 7123 4567"
    service = "AI Agent Automation"
    budget = "£10,000 - £25,000"
    message = "Hi, I'm interested in implementing AI automation for our customer service department. We currently handle about 500 customer inquiries per day and are looking to reduce response time while maintaining quality. Could we schedule a consultation to discuss how your AI agents could help streamline our processes?"
    submission_id = "test-123-456-789"
    timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
} | ConvertTo-Json

Write-Host "Testing Make.com webhook with sample data..."
Write-Host "Webhook URL: $webhookUrl"
Write-Host "Data: $testData"

try {
    $response = Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $testData -ContentType "application/json"
    Write-Host "✅ Webhook test successful!"
    Write-Host "Response: $($response | ConvertTo-Json -Depth 10)"
} catch {
    Write-Host "❌ Webhook test failed!"
    Write-Host "Error: $($_.Exception.Message)"
}