# waQup Installation Script 03: Setup Environment (Windows)
# Creates .env file from .env.example if it doesn't exist
# Usage: .\scripts\03-setup-environment.ps1

$ErrorActionPreference = "Stop"

Write-Host "📦 Step 3: Setting Up Environment" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
Set-Location $projectRoot

# Setup environment file
Write-Host "Setting up environment file..." -ForegroundColor Green
if (Test-Path ".env.example") {
    if (-not (Test-Path ".env")) {
        Copy-Item ".env.example" ".env"
        Write-Host "  ✅ Created .env file from .env.example" -ForegroundColor Green
        Write-Host ""
        Write-Host "⚠️  IMPORTANT: Edit .env file with your credentials:" -ForegroundColor Yellow
        Write-Host "   - EXPO_PUBLIC_SUPABASE_URL" -ForegroundColor Yellow
        Write-Host "   - EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY" -ForegroundColor Yellow
        Write-Host "   - NEXT_PUBLIC_SUPABASE_URL" -ForegroundColor Yellow
        Write-Host "   - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" -ForegroundColor Yellow
        Write-Host "   - SUPABASE_SECRET_KEY" -ForegroundColor Yellow
        Write-Host "   - OPENAI_API_KEY" -ForegroundColor Yellow
        Write-Host "   - STRIPE_PUBLISHABLE_KEY" -ForegroundColor Yellow
        Write-Host "   - STRIPE_SECRET_KEY" -ForegroundColor Yellow
    } else {
        Write-Host "  ✅ .env file already exists" -ForegroundColor Green
    }
} else {
    Write-Host "  ⚠️  .env.example not found. Skipping environment setup." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Environment setup complete!" -ForegroundColor Green
Write-Host ""
