Write-Host "🔧 FitChain Quick Fix Script" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

# Navigate to client directory
Set-Location -Path $PSScriptRoot

Write-Host "📍 Current directory: $(Get-Location)" -ForegroundColor Gray
Write-Host ""

# Step 1: Clean install
Write-Host "Step 1: Cleaning old dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force node_modules
    Write-Host "✅ Removed node_modules" -ForegroundColor Green
}
if (Test-Path "package-lock.json") {
    Remove-Item package-lock.json
    Write-Host "✅ Removed package-lock.json" -ForegroundColor Green
}

# Step 2: Install dependencies
Write-Host ""
Write-Host "Step 2: Installing fresh dependencies..." -ForegroundColor Yellow
npm install

# Step 3: Check .env
Write-Host ""
Write-Host "Step 3: Checking environment setup..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Gray
    @"
# FitChain Environment Variables
VITE_WALLETCONNECT_PROJECT_ID=
VITE_CONTRACT_ADDRESS=
"@ | Out-File -FilePath .env -Encoding UTF8
    Write-Host "✅ Created .env file" -ForegroundColor Green
}

# Step 4: Start the app
Write-Host ""
Write-Host "Step 4: Starting the development server..." -ForegroundColor Yellow
Write-Host "✅ Setup complete! Starting app..." -ForegroundColor Green
Write-Host ""
Write-Host "The app will open at http://localhost:5173" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Start the dev server
npm run dev
