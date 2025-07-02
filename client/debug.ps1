# FitChain Debug Script for Windows
Write-Host "🔍 FitChain Debug Script" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan
Write-Host ""

# Check Node version
Write-Host "1. Checking Node.js version..." -ForegroundColor Yellow
node -v
Write-Host ""

# Check npm version
Write-Host "2. Checking npm version..." -ForegroundColor Yellow
npm -v
Write-Host ""

# Check if node_modules exists
Write-Host "3. Checking if node_modules exists..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✅ node_modules exists" -ForegroundColor Green
} else {
    Write-Host "❌ node_modules NOT found - run 'npm install'" -ForegroundColor Red
}
Write-Host ""

# Check if .env exists
Write-Host "4. Checking if .env exists..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✅ .env exists" -ForegroundColor Green
    Write-Host "   Make sure it contains:" -ForegroundColor Gray
    Write-Host "   VITE_WALLETCONNECT_PROJECT_ID=your_project_id" -ForegroundColor Gray
    Write-Host "   VITE_CONTRACT_ADDRESS=" -ForegroundColor Gray
} else {
    Write-Host "❌ .env NOT found" -ForegroundColor Red
    Write-Host "   Create .env file with:" -ForegroundColor Gray
    Write-Host "   VITE_WALLETCONNECT_PROJECT_ID=your_project_id" -ForegroundColor Gray
    Write-Host "   VITE_CONTRACT_ADDRESS=" -ForegroundColor Gray
}
Write-Host ""

# Check for common issues
Write-Host "5. Common issues to check:" -ForegroundColor Yellow
Write-Host "   - Clear browser cache (Ctrl+Shift+R)" -ForegroundColor Gray
Write-Host "   - Try incognito mode" -ForegroundColor Gray
Write-Host "   - Check browser console for errors (F12)" -ForegroundColor Gray
Write-Host "   - Make sure MetaMask is installed" -ForegroundColor Gray
Write-Host ""

Write-Host "To fix most issues, run:" -ForegroundColor Green
Write-Host "1. npm install" -ForegroundColor White
Write-Host "2. Create .env file if missing" -ForegroundColor White
Write-Host "3. npm run dev" -ForegroundColor White
