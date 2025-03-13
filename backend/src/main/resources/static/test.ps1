# Room Booking API Test Script

$OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001

# API Base URL
$baseUrl = "http://localhost:8080/api"
$outputFolder = "./"
$outputHtmlFile = "$outputFolder/index.html"

# Create output folder if it doesn't exist
if (!(Test-Path -Path $outputFolder)) {
    New-Item -ItemType Directory -Path $outputFolder | Out-Null
}

# Start HTML content for the output
$htmlContent = @"
<html>
<head>
    <meta charset="UTF-8">
    <title>Room Booking API Test Results</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .success { color: green; }
        .failure { color: red; }
        .info { color: blue; }
        pre { background-color: #f0f0f0; padding: 10px; }
    </style>
</head>
<body>
    <h1>Room Booking API Test Results</h1>
    <div class="info"><strong>Starting the API Test...</strong></div>
"@

# General API Request Function
function Invoke-ApiRequest {
    param (
        [string]$Method,
        [string]$Endpoint,
        [object]$Body = $null,
        [string]$TestName
    )
    
    $uri = "$baseUrl$Endpoint"
    $headers = @{
        "Content-Type" = "application/json"
        "Accept" = "application/json"
    }
    
    $htmlContent += "<div class='info'>Executing Test: $TestName</div>"
    $htmlContent += "<pre>$Method $uri</pre>"
    
    $params = @{
        Method = $Method
        Uri = $uri
        Headers = $headers
    }
    
    if ($Body -and $Method -ne "GET") {
        $jsonBody = $Body | ConvertTo-Json -Depth 10
        $params.Add("Body", $jsonBody)
        $htmlContent += "<pre>Request Body: $jsonBody</pre>"
    }
    
    try {
        $response = Invoke-RestMethod @params
        $htmlContent += "<div class='success'>Status: Success</div>"
        
        # Show the response data in the HTML
        $htmlContent += "<h2>Response Data</h2>"
        $htmlContent += "<pre>" + ($response | ConvertTo-Json -Depth 10) + "</pre>"
        
        return $response
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $statusDesc = $_.Exception.Response.StatusDescription
        $errorDetails = if ($_.ErrorDetails.Message) { $_.ErrorDetails.Message } else { "No details available" }
        
        $htmlContent += "<div class='failure'>Status: Failed ($statusCode $statusDesc)</div>"
        $htmlContent += "<div class='failure'>Error: $errorDetails</div>"
        
        return $null
    }
    finally {
        $htmlContent += "<hr>"
    }
}

Write-Host "Starting Room Booking API Test..." -ForegroundColor Yellow

# 1. Test retrieving all rooms
$rooms = Invoke-ApiRequest -Method "GET" -Endpoint "/rooms" -TestName "get-all-rooms"

# 2. Test retrieving available rooms
$availableRooms = Invoke-ApiRequest -Method "GET" -Endpoint "/rooms/available" -TestName "get-available-rooms"

# 3. Test retrieving a specific room
if ($rooms -and $rooms.Count -gt 0) {
    $roomId = $rooms[0].id
    $room = Invoke-ApiRequest -Method "GET" -Endpoint "/rooms/$roomId" -TestName "get-room-by-id"
}

# 4. Test retrieving all users
$users = Invoke-ApiRequest -Method "GET" -Endpoint "/users" -TestName "get-all-users"

# 5. Test booking creation
if ($rooms -and $rooms.Count -gt 0 -and $users -and $users.Count -gt 0) {
    $roomId = $rooms[0].id
    $userId = $users[0].id
    
    $bookingData = @{
        user = @{ id = $userId }
        room = @{ id = $roomId }
        startTime = (Get-Date).AddDays(1).ToString("yyyy-MM-ddTHH:mm:ss")
        endTime = (Get-Date).AddDays(1).AddHours(2).ToString("yyyy-MM-ddTHH:mm:ss")
        conflictDetected = $false
    }
    
    $newBooking = Invoke-ApiRequest -Method "POST" -Endpoint "/bookings" -Body $bookingData -TestName "create-booking"
    
    # 6. Test retrieving booking details
    if ($newBooking) {
        $bookingId = $newBooking.id
        $booking = Invoke-ApiRequest -Method "GET" -Endpoint "/bookings/$bookingId" -TestName "get-booking-by-id"
        
        # 7. Test canceling booking
        Invoke-ApiRequest -Method "PATCH" -Endpoint "/bookings/$bookingId/cancel" -TestName "cancel-booking"
    }
}

# 8. Test retrieving role list
$roles = Invoke-ApiRequest -Method "GET" -Endpoint "/roles" -TestName "get-all-roles"

# 9. Test retrieving permissions list
$permissions = Invoke-ApiRequest -Method "GET" -Endpoint "/permissions" -TestName "get-all-permissions"

$htmlContent += "<div class='info'><strong>API Test Complete!</strong></div>"
$htmlContent += "<div class='info'>Results saved to $outputFolder directory</div>"

# Save the HTML content to a file
$htmlContent | Out-File -FilePath $outputHtmlFile -Encoding UTF8

Write-Host "Results saved to $outputFolder/index.html"
