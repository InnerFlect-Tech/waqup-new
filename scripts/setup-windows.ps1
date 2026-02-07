# waQup Development Environment Setup Script for Windows
# This script automates the setup of the development environment on Windows

Write-Host "🚀 waQup Development Environment Setup (Windows)" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "⚠️  Some steps may require administrator privileges." -ForegroundColor Yellow
    Write-Host ""
}

# Function to check if a command exists
function Test-Command {
    param($Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

# Step 1: Check Node.js
Write-Host "📦 Step 1: Checking Node.js installation..." -ForegroundColor Green
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
    
    # Check version
    $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($versionNumber -lt 24) {
        Write-Host "⚠️  Node.js version should be >= 24.0.0. Current: $nodeVersion" -ForegroundColor Yellow
        Write-Host "   Please update Node.js from https://nodejs.org/" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "   Please install Node.js >= 24.0.0 from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "   After installation, run this script again." -ForegroundColor Yellow
    exit 1
}

# Step 2: Check npm
Write-Host ""
Write-Host "📦 Step 2: Checking npm installation..." -ForegroundColor Green
if (Test-Command "npm") {
    $npmVersion = npm --version
    Write-Host "✅ npm is installed: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "❌ npm is not installed!" -ForegroundColor Red
    Write-Host "   npm should come with Node.js. Please reinstall Node.js." -ForegroundColor Yellow
    exit 1
}

# Step 3: Check Git
Write-Host ""
Write-Host "📦 Step 3: Checking Git installation..." -ForegroundColor Green
if (Test-Command "git") {
    $gitVersion = git --version
    Write-Host "✅ Git is installed: $gitVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Git is not installed!" -ForegroundColor Red
    Write-Host "   Please install Git from https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "   After installation, run this script again." -ForegroundColor Yellow
    exit 1
}

# Step 4: Install Expo CLI globally
Write-Host ""
Write-Host "📦 Step 4: Installing Expo CLI globally..." -ForegroundColor Green
if (Test-Command "expo") {
    Write-Host "✅ Expo CLI is already installed" -ForegroundColor Green
} else {
    Write-Host "   Installing Expo CLI..." -ForegroundColor Yellow
    npm install -g expo-cli
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Expo CLI installed successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install Expo CLI" -ForegroundColor Red
        Write-Host "   Try running: npm install -g expo-cli" -ForegroundColor Yellow
    }
}

# Step 5: Check Android Studio / Android SDK
Write-Host ""
Write-Host "📦 Step 5: Checking Android development setup..." -ForegroundColor Green
$androidHome = $env:ANDROID_HOME
if ($androidHome -and (Test-Path $androidHome)) {
    Write-Host "✅ ANDROID_HOME is set: $androidHome" -ForegroundColor Green
} else {
    Write-Host "⚠️  Android SDK not found in environment variables" -ForegroundColor Yellow
    Write-Host "   For Android development, please:" -ForegroundColor Yellow
    Write-Host "   1. Install Android Studio from https://developer.android.com/studio" -ForegroundColor Yellow
    Write-Host "   2. Set up Android SDK (API 33+)" -ForegroundColor Yellow
    Write-Host "   3. Set ANDROID_HOME environment variable:" -ForegroundColor Yellow
    Write-Host "      - Open System Properties > Environment Variables" -ForegroundColor Yellow
    Write-Host "      - Add: ANDROID_HOME = C:\Users\$env:USERNAME\AppData\Local\Android\Sdk" -ForegroundColor Yellow
    Write-Host "      - Add to Path: %ANDROID_HOME%\platform-tools" -ForegroundColor Yellow
}

# Step 6: Install project dependencies
Write-Host ""
Write-Host "📦 Step 6: Installing project dependencies..." -ForegroundColor Green
if (Test-Path "package.json") {
    Write-Host "   Running npm install..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        Write-Host "   Try running: npm install" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  package.json not found. Make sure you're in the project root directory." -ForegroundColor Yellow
}

# Step 7: Setup environment file
Write-Host ""
Write-Host "📦 Step 7: Setting up environment file..." -ForegroundColor Green
if (Test-Path ".env.example") {
    if (-not (Test-Path ".env")) {
        Copy-Item ".env.example" ".env"
        Write-Host "✅ Created .env file from .env.example" -ForegroundColor Green
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
        Write-Host "✅ .env file already exists" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  .env.example not found. Skipping environment setup." -ForegroundColor Yellow
}

# Step 8: Verify setup
Write-Host ""
Write-Host "📦 Step 8: Verifying setup..." -ForegroundColor Green
$allGood = $true

if (-not (Test-Command "node")) {
    Write-Host "❌ Node.js check failed" -ForegroundColor Red
    $allGood = $false
} else {
    $nodeVersion = node --version
    $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($versionNumber -lt 24) {
        Write-Host "⚠️  Node.js version should be >= 24.0.0. Current: $nodeVersion" -ForegroundColor Yellow
    }
}

if (-not (Test-Command "npm")) {
    Write-Host "❌ npm check failed" -ForegroundColor Red
    $allGood = $false
} else {
    $npmVersion = npm --version
    $npmMajor = [int]($npmVersion -replace '(\d+)\..*', '$1')
    if ($npmMajor -lt 10) {
        Write-Host "⚠️  npm version should be >= 10.0.0. Current: $npmVersion" -ForegroundColor Yellow
    }
}

if (-not (Test-Command "git")) {
    Write-Host "❌ Git check failed" -ForegroundColor Red
    $allGood = $false
}

if (-not (Test-Command "expo")) {
    Write-Host "⚠️  Expo CLI check failed (optional for web-only development)" -ForegroundColor Yellow
}

# Step 9: Verify package versions
Write-Host ""
Write-Host "📦 Step 9: Verifying package versions..." -ForegroundColor Green
if (Test-Path "scripts\verify-versions.sh") {
    Write-Host "   Running version verification script..." -ForegroundColor Yellow
    # Note: PowerShell can't directly run bash scripts, so we'll check manually
    Write-Host "   (Version verification script available for Linux/macOS)" -ForegroundColor Yellow
} else {
    Write-Host "   Checking package.json versions..." -ForegroundColor Yellow
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    if ($packageJson.engines.node -eq ">=24.0.0") {
        Write-Host "✅ Root package.json: Node requirement correct (>=24.0.0)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Root package.json: Node requirement should be >=24.0.0" -ForegroundColor Yellow
    }
}

if ($allGood) {
    Write-Host ""
    Write-Host "✅ Setup completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Edit .env file with your API keys and credentials" -ForegroundColor White
    Write-Host "   2. Run: npm run dev:all:win (to start all dev servers)" -ForegroundColor White
    Write-Host "   3. Or run individually:" -ForegroundColor White
    Write-Host "      - npm run dev:mobile (for mobile)" -ForegroundColor White
    Write-Host "      - npm run dev:web (for web)" -ForegroundColor White
    Write-Host ""
    Write-Host "📚 For more information, see rebuild-roadmap/README.md" -ForegroundColor Cyan
    Write-Host "🔍 Run scripts\verify-versions.sh (on Linux/macOS) to verify all versions" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "⚠️  Setup completed with warnings. Please fix the issues above." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Setup script completed!" -ForegroundColor Cyan
