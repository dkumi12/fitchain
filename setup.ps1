# FitChain MVP Setup Script for Windows
Write-Host "🏋️ FitChain MVP Setup Script" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js version
Write-Host "Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node -v
Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green

# Check if in project root
if (-not (Test-Path "README.md")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Installing contract dependencies..." -ForegroundColor Yellow
Set-Location contracts
npm install

Write-Host ""
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location ../client
npm install

Write-Host ""
Write-Host "🔧 Setting up environment files..." -ForegroundColor Yellow
Set-Location ../contracts
if (-not (Test-Path ".env")) {
    Copy-Item .env.example .env
    Write-Host "✅ Created contracts/.env - Please add your keys" -ForegroundColor Green
} else {
    Write-Host "⚠️  contracts/.env already exists" -ForegroundColor Yellow
}

Set-Location ../client
if (-not (Test-Path ".env")) {
    Copy-Item .env.example .env
    Write-Host "✅ Created client/.env - Please add your configuration" -ForegroundColor Green
} else {
    Write-Host "⚠️  client/.env already exists" -ForegroundColor Yellow
}

Set-Location ..

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Add your private key and RPC URL to contracts/.env"
Write-Host "2. Deploy contract: cd contracts && npx hardhat run scripts/deploy.js --network sepolia"
Write-Host "3. Add contract address to client/.env"
Write-Host "4. Start frontend: cd client && npm run dev"
Write-Host ""
Write-Host "Happy building! 🚀" -ForegroundColor Magenta
