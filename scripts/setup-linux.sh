#!/bin/bash
# waQup Development Environment Setup Script for Linux/macOS
# This script automates the setup of the development environment on Linux and macOS

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}🚀 waQup Development Environment Setup (Linux/macOS)${NC}"
echo -e "${CYAN}===================================================${NC}"
echo ""

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macOS"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="Linux"
else
    OS="Unknown"
fi

echo -e "${GREEN}📦 Detected OS: $OS${NC}"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Step 1: Check Node.js
echo -e "${GREEN}📦 Step 1: Checking Node.js installation...${NC}"
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js is installed: $NODE_VERSION${NC}"
    
    # Check version
    VERSION_NUMBER=$(echo $NODE_VERSION | sed 's/v\([0-9]*\).*/\1/')
    if [ "$VERSION_NUMBER" -lt 24 ]; then
        echo -e "${YELLOW}⚠️  Node.js version should be >= 24.0.0. Current: $NODE_VERSION${NC}"
        echo -e "${YELLOW}   Please update Node.js from https://nodejs.org/${NC}"
    fi
else
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    if [ "$OS" == "macOS" ]; then
        echo -e "${YELLOW}   Install via Homebrew: brew install node@24${NC}"
        echo -e "${YELLOW}   Or download from: https://nodejs.org/${NC}"
    elif [ "$OS" == "Linux" ]; then
        echo -e "${YELLOW}   Install via NodeSource:${NC}"
        echo -e "${YELLOW}   curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -${NC}"
        echo -e "${YELLOW}   sudo apt-get install -y nodejs${NC}"
    fi
    echo -e "${YELLOW}   After installation, run this script again.${NC}"
    exit 1
fi

# Step 2: Check npm
echo ""
echo -e "${GREEN}📦 Step 2: Checking npm installation...${NC}"
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm is installed: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm is not installed!${NC}"
    echo -e "${YELLOW}   npm should come with Node.js. Please reinstall Node.js.${NC}"
    exit 1
fi

# Step 3: Check Git
echo ""
echo -e "${GREEN}📦 Step 3: Checking Git installation...${NC}"
if command_exists git; then
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}✅ Git is installed: $GIT_VERSION${NC}"
else
    echo -e "${RED}❌ Git is not installed!${NC}"
    if [ "$OS" == "macOS" ]; then
        echo -e "${YELLOW}   Install Xcode Command Line Tools: xcode-select --install${NC}"
    elif [ "$OS" == "Linux" ]; then
        echo -e "${YELLOW}   Install via: sudo apt-get install git${NC}"
    fi
    echo -e "${YELLOW}   After installation, run this script again.${NC}"
    exit 1
fi

# Step 4: Install Expo CLI globally
echo ""
echo -e "${GREEN}📦 Step 4: Installing Expo CLI globally...${NC}"
if command_exists expo; then
    echo -e "${GREEN}✅ Expo CLI is already installed${NC}"
else
    echo -e "${YELLOW}   Installing Expo CLI...${NC}"
    sudo npm install -g expo-cli
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Expo CLI installed successfully${NC}"
    else
        echo -e "${RED}❌ Failed to install Expo CLI${NC}"
        echo -e "${YELLOW}   Try running: sudo npm install -g expo-cli${NC}"
    fi
fi

# Step 5: macOS-specific: Check Xcode and CocoaPods
if [ "$OS" == "macOS" ]; then
    echo ""
    echo -e "${GREEN}📦 Step 5: Checking macOS development tools...${NC}"
    
    # Check Xcode
    if command_exists xcodebuild; then
        XCODE_VERSION=$(xcodebuild -version | head -n 1)
        echo -e "${GREEN}✅ Xcode is installed: $XCODE_VERSION${NC}"
    else
        echo -e "${YELLOW}⚠️  Xcode is not installed (required for iOS development)${NC}"
        echo -e "${YELLOW}   Install from App Store: https://apps.apple.com/app/xcode/id497799835${NC}"
    fi
    
    # Check CocoaPods
    if command_exists pod; then
        POD_VERSION=$(pod --version)
        echo -e "${GREEN}✅ CocoaPods is installed: $POD_VERSION${NC}"
    else
        echo -e "${YELLOW}⚠️  CocoaPods is not installed (required for iOS development)${NC}"
        echo -e "${YELLOW}   Install via: sudo gem install cocoapods${NC}"
    fi
fi

# Step 6: Check Android Studio / Android SDK
echo ""
echo -e "${GREEN}📦 Step 6: Checking Android development setup...${NC}"
if [ -n "$ANDROID_HOME" ] && [ -d "$ANDROID_HOME" ]; then
    echo -e "${GREEN}✅ ANDROID_HOME is set: $ANDROID_HOME${NC}"
else
    echo -e "${YELLOW}⚠️  Android SDK not found in environment variables${NC}"
    echo -e "${YELLOW}   For Android development, please:${NC}"
    echo -e "${YELLOW}   1. Install Android Studio from https://developer.android.com/studio${NC}"
    echo -e "${YELLOW}   2. Set up Android SDK (API 33+)${NC}"
    if [ "$OS" == "macOS" ]; then
        echo -e "${YELLOW}   3. Add to ~/.zshrc or ~/.bash_profile:${NC}"
        echo -e "${YELLOW}      export ANDROID_HOME=\$HOME/Library/Android/sdk${NC}"
        echo -e "${YELLOW}      export PATH=\$PATH:\$ANDROID_HOME/platform-tools${NC}"
    elif [ "$OS" == "Linux" ]; then
        echo -e "${YELLOW}   3. Add to ~/.bashrc or ~/.zshrc:${NC}"
        echo -e "${YELLOW}      export ANDROID_HOME=\$HOME/Android/Sdk${NC}"
        echo -e "${YELLOW}      export PATH=\$PATH:\$ANDROID_HOME/platform-tools${NC}"
    fi
fi

# Step 7: Install project dependencies
echo ""
echo -e "${GREEN}📦 Step 7: Installing project dependencies...${NC}"
if [ -f "package.json" ]; then
    echo -e "${YELLOW}   Running npm install...${NC}"
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
    else
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        echo -e "${YELLOW}   Try running: npm install${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  package.json not found. Make sure you're in the project root directory.${NC}"
fi

# Step 8: Setup environment file
echo ""
echo -e "${GREEN}📦 Step 8: Setting up environment file...${NC}"
if [ -f ".env.example" ]; then
    if [ ! -f ".env" ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ Created .env file from .env.example${NC}"
        echo -e "${YELLOW}⚠️  IMPORTANT: Edit .env file with your credentials:${NC}"
        echo -e "${YELLOW}   - EXPO_PUBLIC_SUPABASE_URL${NC}"
        echo -e "${YELLOW}   - EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY${NC}"
        echo -e "${YELLOW}   - NEXT_PUBLIC_SUPABASE_URL${NC}"
        echo -e "${YELLOW}   - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY${NC}"
        echo -e "${YELLOW}   - SUPABASE_SECRET_KEY${NC}"
        echo -e "${YELLOW}   - OPENAI_API_KEY${NC}"
        echo -e "${YELLOW}   - STRIPE_PUBLISHABLE_KEY${NC}"
        echo -e "${YELLOW}   - STRIPE_SECRET_KEY${NC}"
    else
        echo -e "${GREEN}✅ .env file already exists${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  .env.example not found. Skipping environment setup.${NC}"
fi

# Step 9: Verify setup
echo ""
echo -e "${GREEN}📦 Step 9: Verifying setup...${NC}"
ALL_GOOD=true

if ! command_exists node; then
    echo -e "${RED}❌ Node.js check failed${NC}"
    ALL_GOOD=false
else
    NODE_VERSION=$(node --version)
    VERSION_NUMBER=$(echo $NODE_VERSION | sed 's/v\([0-9]*\).*/\1/')
    if [ "$VERSION_NUMBER" -lt 24 ]; then
        echo -e "${YELLOW}⚠️  Node.js version should be >= 24.0.0. Current: $NODE_VERSION${NC}"
    fi
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm check failed${NC}"
    ALL_GOOD=false
else
    NPM_VERSION=$(npm --version)
    NPM_MAJOR=$(echo $NPM_VERSION | cut -d'.' -f1)
    if [ "$NPM_MAJOR" -lt 10 ]; then
        echo -e "${YELLOW}⚠️  npm version should be >= 10.0.0. Current: $NPM_VERSION${NC}"
    fi
fi

if ! command_exists git; then
    echo -e "${RED}❌ Git check failed${NC}"
    ALL_GOOD=false
fi

if ! command_exists expo; then
    echo -e "${YELLOW}⚠️  Expo CLI check failed (optional for web-only development)${NC}"
fi

# Step 10: Verify package versions
echo ""
echo -e "${GREEN}📦 Step 10: Verifying package versions...${NC}"
if [ -f "scripts/verify-versions.sh" ]; then
    echo -e "${YELLOW}   Running version verification script...${NC}"
    chmod +x scripts/verify-versions.sh
    ./scripts/verify-versions.sh
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ All package versions verified${NC}"
    else
        echo -e "${YELLOW}⚠️  Some version checks failed. Please review above.${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Version verification script not found${NC}"
fi

if [ "$ALL_GOOD" = true ]; then
    echo ""
    echo -e "${GREEN}✅ Setup completed successfully!${NC}"
    echo ""
    echo -e "${CYAN}🎉 Next steps:${NC}"
    echo -e "   ${NC}1. Edit .env file with your API keys and credentials"
    echo -e "   ${NC}2. Run: npm run dev:all (to start all dev servers)"
    echo -e "   ${NC}3. Or run individually:"
    echo -e "      ${NC}- npm run dev:mobile (for mobile)"
    echo -e "      ${NC}- npm run dev:web (for web)"
    echo ""
    echo -e "${CYAN}📚 For more information, see rebuild-roadmap/README.md${NC}"
    echo -e "${CYAN}🔍 Run ./scripts/verify-versions.sh anytime to verify all versions${NC}"
else
    echo ""
    echo -e "${YELLOW}⚠️  Setup completed with warnings. Please fix the issues above.${NC}"
fi

echo ""
echo -e "${CYAN}Setup script completed!${NC}"
