# waQup Installation Script 01: Verify Prerequisites (Windows)
# Checks Node.js, npm, Git, and optional tools
# Usage: .\scripts\01-verify-prerequisites.ps1

$ErrorActionPreference = "Stop"

Write-Host "📦 Step 1: Verifying Prerequisites" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command {
    param($Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Green
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "  ✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
    
    $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    
    if ($versionNumber -ge 24) {
        Write-Host "  ✅ Version check passed (>= 24.0.0)" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Node.js version should be >= 24.0.0" -ForegroundColor Red
        Write-Host "     Current: $nodeVersion" -ForegroundColor Yellow
        Write-Host "     Please update from https://nodejs.org/" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "  ❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "     Please install from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check npm
Write-Host ""
Write-Host "Checking npm..." -ForegroundColor Green
if (Test-Command "npm") {
    $npmVersion = npm --version
    Write-Host "  ✅ npm is installed: $npmVersion" -ForegroundColor Green
    
    $npmMajor = [int]($npmVersion -replace '(\d+)\..*', '$1')
    if ($npmMajor -ge 10) {
        Write-Host "  ✅ Version check passed (>= 10.0.0)" -ForegroundColor Green
    } else {
        Write-Host "  ❌ npm version should be >= 10.0.0" -ForegroundColor Red
        Write-Host "     Current: $npmVersion" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "  ❌ npm is not installed!" -ForegroundColor Red
    Write-Host "     npm should come with Node.js. Please reinstall Node.js." -ForegroundColor Yellow
    exit 1
}

# Check Git
Write-Host ""
Write-Host "Checking Git..." -ForegroundColor Green
if (Test-Command "git") {
    $gitVersion = git --version
    Write-Host "  ✅ Git is installed: $gitVersion" -ForegroundColor Green
} else {
    Write-Host "  ❌ Git is not installed!" -ForegroundColor Red
    Write-Host "     Please install from https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Check Expo CLI (optional)
Write-Host ""
Write-Host "Checking Expo CLI (optional)..." -ForegroundColor Green
if (Test-Command "expo") {
    $expoVersion = expo --version 2>$null
    if ($expoVersion) {
        Write-Host "  ✅ Expo CLI is installed: $expoVersion" -ForegroundColor Green
    } else {
        Write-Host "  ✅ Expo CLI is installed" -ForegroundColor Green
    }
} else {
    Write-Host "  ⚠️  Expo CLI is not installed (optional for mobile development)" -ForegroundColor Yellow
    Write-Host "     Install via: npm install -g expo-cli" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Prerequisites check complete!" -ForegroundColor Green
Write-Host ""
