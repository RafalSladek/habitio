# Setup script for habit.io development on Windows 11
# Run: powershell -ExecutionPolicy Bypass -File scripts/setup.ps1

Write-Host "🔧 Setting up habit.io development environment..." -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 20 or later." -ForegroundColor Red
    Write-Host "   Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Node.js $nodeVersion" -ForegroundColor Green

# Check if Yarn is available
$yarnVersion = yarn --version 2>$null
if (-not $yarnVersion) {
    Write-Host "❌ Yarn is not installed or not in PATH." -ForegroundColor Red
    Write-Host "   Run: corepack enable" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Yarn $yarnVersion" -ForegroundColor Green

# Install dependencies
Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
yarn install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Install Playwright browsers
Write-Host ""
Write-Host "🌐 Installing Playwright browsers (Chromium, Firefox, WebKit)..." -ForegroundColor Cyan
npx playwright install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install Playwright browsers" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Run tests: yarn test" -ForegroundColor White
Write-Host "  2. Run tests in UI mode: yarn test:ui" -ForegroundColor White
Write-Host "  3. View test report: yarn test:report" -ForegroundColor White
