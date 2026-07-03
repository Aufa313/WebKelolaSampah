# PowerShell script to import xampp-database-schema.sql into MySQL
# Usage: Run this script in PowerShell (requires MySQL to be running via XAMPP)

# Configuration
$SCHEMA_FILE = "c:\layanan-setor-sampah\xampp-database-schema.sql"
$MYSQL_PATH = "C:\xampp\mysql\bin\mysql.exe"
$MYSQL_USER = "root"
$MYSQL_PASS = ""  # Default XAMPP MySQL password is empty; change if needed

# Check if schema file exists
if (-not (Test-Path $SCHEMA_FILE)) {
    Write-Host "ERROR: Schema file not found at $SCHEMA_FILE" -ForegroundColor Red
    exit 1
}

# Check if MySQL executable exists
if (-not (Test-Path $MYSQL_PATH)) {
    Write-Host "ERROR: MySQL executable not found at $MYSQL_PATH" -ForegroundColor Red
    Write-Host "Make sure XAMPP is installed and MySQL is available." -ForegroundColor Yellow
    exit 1
}

# Import schema
Write-Host "Importing schema from: $SCHEMA_FILE" -ForegroundColor Cyan
Write-Host "Target: MySQL at $MYSQL_PATH" -ForegroundColor Cyan
Write-Host ""

# Read schema file and pipe to MySQL
$schemaContent = Get-Content $SCHEMA_FILE -Raw
if ($MYSQL_PASS) {
    $schemaContent | & $MYSQL_PATH -u $MYSQL_USER -p$MYSQL_PASS
} else {
    $schemaContent | & $MYSQL_PATH -u $MYSQL_USER
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS: Schema imported successfully!" -ForegroundColor Green
    Write-Host "Database 'layanan_setor_sampah' is now ready to use." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "ERROR: Import failed with exit code $LASTEXITCODE" -ForegroundColor Red
}
