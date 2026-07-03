# PowerShell script to setup backend for XAMPP
# This links/copies backend files to Apache htdocs

$projectRoot = "c:\layanan-setor-sampah"
$xamppHtdocs = "C:\xampp\htdocs"
$backendSrc = "$projectRoot\backend"
$backendDest = "$xamppHtdocs\layanan-setor-sampah\backend"

Write-Host "=== XAMPP Backend Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if XAMPP exists
if (-not (Test-Path $xamppHtdocs)) {
    Write-Host "ERROR: XAMPP htdocs not found at $xamppHtdocs" -ForegroundColor Red
    Write-Host "Please install XAMPP and try again." -ForegroundColor Yellow
    exit 1
}

# Check if backend source exists
if (-not (Test-Path $backendSrc)) {
    Write-Host "ERROR: Backend source not found at $backendSrc" -ForegroundColor Red
    exit 1
}

# Create destination directory if it doesn't exist
if (-not (Test-Path "$xamppHtdocs\layanan-setor-sampah")) {
    New-Item -ItemType Directory -Path "$xamppHtdocs\layanan-setor-sampah" -Force | Out-Null
}

# Copy backend files
Write-Host "Copying backend files..." -ForegroundColor Yellow
if (Test-Path $backendDest) {
    Remove-Item $backendDest -Recurse -Force
}
Copy-Item $backendSrc -Destination $backendDest -Recurse -Force

Write-Host "Backend copied to: $backendDest" -ForegroundColor Green
Write-Host ""

# Verify
$testUrl = "http://localhost/layanan-setor-sampah/backend/api.php/pricing"
Write-Host "Testing backend accessibility..." -ForegroundColor Yellow
Write-Host "URL: $testUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "Make sure:" -ForegroundColor Cyan
Write-Host "  1. XAMPP Apache is running (start it from Control Panel or command line)" -ForegroundColor Cyan
Write-Host "  2. MySQL is running (required for database access)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Then try opening: $testUrl" -ForegroundColor Green
Write-Host ""
Write-Host "If you see JSON pricing data, backend is working." -ForegroundColor Green
