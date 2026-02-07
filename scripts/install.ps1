# waQup Master Installation Script (Windows)
# This script orchestrates the complete installation process
# Usage: .\scripts\install.ps1

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir

Write-Host "🚀 waQup Installation" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Verify Prerequisites
Write-Host "Step 1/4: Verifying Prerequisites..." -ForegroundColor Green
& "$scriptDir\01-verify-prerequisites.ps1"
if ($LASTEXITCODE -ne 0) { exit 1 }

# Step 2: Install Dependencies
Write-Host "`nStep 2/4: Installing Dependencies..." -ForegroundColor Green
& "$scriptDir\02-install-dependencies.ps1"
if ($LASTEXITCODE -ne 0) { exit 1 }

# Step 3: Setup Environment
Write-Host "`nStep 3/4: Setting Up Environment..." -ForegroundColor Green
& "$scriptDir\03-setup-environment.ps1"
if ($LASTEXITCODE -ne 0) { exit 1 }

# Step 4: Verify Installation
Write-Host "`nStep 4/4: Verifying Installation..." -ForegroundColor Green
& "$scriptDir\04-verify-installation.ps1"
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "`n✅ Installation Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 For more information, see README.md" -ForegroundColor Cyan
Write-Host ""
