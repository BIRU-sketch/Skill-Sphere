# Firebase Admin SDK Setup Script
# This script helps you add Firebase Admin credentials to .env.local

Write-Host "=== Firebase Admin SDK Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (-not (Test-Path .env.local)) {
    Write-Host "ERROR: .env.local file not found!" -ForegroundColor Red
    Write-Host "Please create .env.local first with your Firebase client config." -ForegroundColor Yellow
    exit 1
}

# Ask for JSON file path
Write-Host "Step 1: Locate your Firebase Admin SDK JSON file" -ForegroundColor Yellow
Write-Host ""
Write-Host "To get the JSON file:" -ForegroundColor White
Write-Host "1. Go to: https://console.firebase.google.com/" -ForegroundColor Gray
Write-Host "2. Select project: learning-53c35" -ForegroundColor Gray
Write-Host "3. Click gear icon > Project Settings" -ForegroundColor Gray
Write-Host "4. Go to 'Service Accounts' tab" -ForegroundColor Gray
Write-Host "5. Click 'Generate new private key'" -ForegroundColor Gray
Write-Host "6. Save the downloaded JSON file" -ForegroundColor Gray
Write-Host ""

$jsonPath = Read-Host "Enter the full path to your JSON file (or drag & drop the file here)"

# Remove quotes if present (from drag & drop)
$jsonPath = $jsonPath.Trim('"')

# Verify file exists
if (-not (Test-Path $jsonPath)) {
    Write-Host ""
    Write-Host "ERROR: File not found: $jsonPath" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Reading JSON file..." -ForegroundColor Green

# Read and parse JSON
try {
    $json = Get-Content $jsonPath -Raw | ConvertFrom-Json
    
    $projectId = $json.project_id
    $clientEmail = $json.client_email
    $privateKey = $json.private_key
    
    # Verify we have all required fields
    if (-not $projectId -or -not $clientEmail -or -not $privateKey) {
        Write-Host "ERROR: JSON file is missing required fields!" -ForegroundColor Red
        Write-Host "Required: project_id, client_email, private_key" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "✓ Successfully extracted credentials" -ForegroundColor Green
    Write-Host ""
    Write-Host "Project ID: $projectId" -ForegroundColor Cyan
    Write-Host "Client Email: $clientEmail" -ForegroundColor Cyan
    Write-Host "Private Key: (hidden)" -ForegroundColor Gray
    Write-Host ""
    
    # Check if credentials already exist in .env.local
    $envContent = Get-Content .env.local -Raw
    
    if ($envContent -match "FIREBASE_ADMIN_PROJECT_ID") {
        Write-Host "Admin SDK credentials already exist in .env.local" -ForegroundColor Yellow
        $overwrite = Read-Host "Overwrite? (y/N)"
        if ($overwrite -ne "y" -and $overwrite -ne "Y") {
            Write-Host "Cancelled." -ForegroundColor Yellow
            exit 0
        }
        
        # Remove existing admin section
        $lines = Get-Content .env.local
        $newLines = @()
        $skip = $false
        
        foreach ($line in $lines) {
            if ($line -match "^# ===.*FIREBASE ADMIN SDK") {
                $skip = $true
            }
            if ($skip -and ($line -match "^# ===.*====" -or ($line -match "^NEXT_PUBLIC_APP_URL" -and $skip))) {
                $skip = $false
            }
            if (-not $skip) {
                $newLines += $line
            }
        }
        
        $newLines | Set-Content .env.local
    }
    
    # Escape private key for .env file
    $escapedPrivateKey = $privateKey -replace "`n", "\n" -replace "`r", ""
    $escapedPrivateKey = "`"$escapedPrivateKey`""
    
    # Add Admin SDK credentials
    Write-Host "Adding credentials to .env.local..." -ForegroundColor Green
    
    $adminSection = @"

# ============================================
# FIREBASE ADMIN SDK (For Server-Side Operations)
# ============================================
FIREBASE_ADMIN_PROJECT_ID=$projectId
FIREBASE_ADMIN_CLIENT_EMAIL=$clientEmail
FIREBASE_ADMIN_PRIVATE_KEY=$escapedPrivateKey

"@
    
    Add-Content -Path .env.local -Value $adminSection
    
    Write-Host ""
    Write-Host "✓ Successfully added Firebase Admin SDK credentials!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Restart your development server (Ctrl+C then npm run dev)" -ForegroundColor White
    Write-Host "2. Your server-side Firebase operations should now work" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Never commit .env.local to Git!" -ForegroundColor Red
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "ERROR: Failed to parse JSON file!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Yellow
    exit 1
}

