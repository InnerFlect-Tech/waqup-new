# waQup Installation Script 04: Verify Installation (Windows)
# Verifies TypeScript compilation and package installation
# Usage: .\scripts\04-verify-installation.ps1

$ErrorActionPreference = "Stop"

Write-Host "📦 Step 4: Verifying Installation" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
Set-Location $projectRoot

$allGood = $true

# Verify Mobile TypeScript compilation
Write-Host "Verifying Mobile TypeScript compilation..." -ForegroundColor Green
if (Test-Path "packages\mobile") {
    Set-Location "packages\mobile"
    npm run type-check 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Mobile TypeScript compilation successful" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Mobile TypeScript compilation failed" -ForegroundColor Red
        $allGood = $false
    }
    Set-Location $projectRoot
} else {
    Write-Host "  ⚠️  Mobile package not found" -ForegroundColor Yellow
}

# Verify Web TypeScript compilation
Write-Host ""
Write-Host "Verifying Web TypeScript compilation..." -ForegroundColor Green
if (Test-Path "packages\web") {
    Set-Location "packages\web"
    npx tsc --noEmit 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Web TypeScript compilation successful" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Web TypeScript compilation failed" -ForegroundColor Red
        $allGood = $false
    }
    Set-Location $projectRoot
} else {
    Write-Host "  ⚠️  Web package not found" -ForegroundColor Yellow
}

# Verify Shared package
Write-Host ""
Write-Host "Verifying Shared package..." -ForegroundColor Green
if (Test-Path "packages\shared") {
    Set-Location "packages\shared"
    npm run type-check 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Shared package TypeScript compilation successful" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Shared package TypeScript check (non-critical)" -ForegroundColor Yellow
    }
    Set-Location $projectRoot
} else {
    Write-Host "  ⚠️  Shared package not found" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "📋 Installation Summary:" -ForegroundColor Cyan
if ($allGood) {
    Write-Host "✅ All verifications passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Edit .env file with your API keys and credentials"
    Write-Host "  2. Run: npm run dev:all:win (to start all dev servers)"
    Write-Host "  3. Or run individually:"
    Write-Host "     - npm run dev:mobile (for mobile)"
    Write-Host "     - npm run dev:web (for web)"
} else {
    Write-Host "⚠️  Some verifications failed. Please review above." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
