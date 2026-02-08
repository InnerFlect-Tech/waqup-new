# waQup Installation Script 02: Install Dependencies (Windows)
# Installs all core dependencies for Mobile and Web platforms
# Usage: .\scripts\02-install-dependencies.ps1

$ErrorActionPreference = "Stop"

Write-Host "📦 Step 2: Installing Dependencies" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
Set-Location $projectRoot

Write-Host "Project Root: $projectRoot" -ForegroundColor Yellow
Write-Host ""

# Function to install packages in a directory
function Install-Packages {
    param(
        [string]$Dir,
        [string]$Packages,
        [bool]$IsDev = $false
    )
    
    Write-Host "Installing in $Dir..." -ForegroundColor Blue
    Set-Location "$projectRoot\$Dir"
    
    if ($IsDev) {
        npm install --save-dev $Packages --no-audit --no-fund
    } else {
        npm install $Packages --no-audit --no-fund
    }
    
    Set-Location $projectRoot
    Write-Host "✅ Completed $Dir" -ForegroundColor Green
    Write-Host ""
}

# Step 1: Install root dependencies
Write-Host "=== Root Dependencies ===" -ForegroundColor Blue
Write-Host "Installing root workspace dependencies..." -ForegroundColor Yellow
npm install --no-audit --no-fund
Write-Host "✅ Root dependencies installed" -ForegroundColor Green
Write-Host ""

# Step 2: Mobile Dependencies
Write-Host "=== Mobile Platform Dependencies ===" -ForegroundColor Blue

# Navigation
Install-Packages "packages/mobile" "@react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs"

# Navigation peer dependencies
Install-Packages "packages/mobile" "react-native-screens react-native-safe-area-context"

# Audio
Install-Packages "packages/mobile" "expo-av"

# Forms
Install-Packages "packages/mobile" "react-hook-form @hookform/resolvers"

# UI Animations
Install-Packages "packages/mobile" "react-native-reanimated react-native-gesture-handler"

# Utilities
Install-Packages "packages/mobile" "date-fns uuid axios"

# Storage (required for Supabase auth)
Install-Packages "packages/mobile" "@react-native-async-storage/async-storage"

# Dev Dependencies
Install-Packages "packages/mobile" "@types/react-native @types/uuid" -IsDev $true

# Step 3: Web Dependencies
Write-Host "=== Web Platform Dependencies ===" -ForegroundColor Blue

# Forms
Install-Packages "packages/web" "react-hook-form @hookform/resolvers zod"

# Payments (Stripe client)
Install-Packages "packages/web" "@stripe/stripe-js"

# Utilities
Install-Packages "packages/web" "date-fns uuid"

# Dev Dependencies
Install-Packages "packages/web" "@types/uuid" -IsDev $true

# Final step: Ensure all Next.js dependencies (including @next/swc) are installed
Write-Host "=== Verifying Web Dependencies ===" -ForegroundColor Blue
Write-Host "Running final npm install to ensure Next.js dependencies are complete..." -ForegroundColor Yellow
Set-Location "$projectRoot\packages\web"
npm install --no-audit --no-fund
Set-Location $projectRoot
Write-Host "✅ Web dependencies verified" -ForegroundColor Green
Write-Host ""

Write-Host "✅ All dependencies installed successfully!" -ForegroundColor Green
Write-Host ""
