#!/usr/bin/env bash

# waQup Installation Script 01: Verify Prerequisites
# Checks Node.js, npm, Git, and optional tools (Expo CLI, Xcode, CocoaPods)
# Usage: ./scripts/01-verify-prerequisites.sh

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}📦 Step 1: Verifying Prerequisites${NC}"
echo -e "${CYAN}===================================${NC}\n"

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macOS"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="Linux"
else
    OS="Unknown"
fi

echo -e "${GREEN}Detected OS: $OS${NC}\n"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Node.js
echo -e "${GREEN}Checking Node.js...${NC}"
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "  ✅ Node.js is installed: $NODE_VERSION"
    
    # Check version (>=20.9.0 or >=22.0.0)
    VERSION_NUMBER=$(echo $NODE_VERSION | sed 's/v\([0-9]*\).*/\1/')
    MINOR_VERSION=$(echo $NODE_VERSION | sed 's/v[0-9]*\.\([0-9]*\).*/\1/')
    
    if [ "$VERSION_NUMBER" -ge 22 ]; then
        echo -e "  ✅ Version check passed (>= 22.0.0)"
    elif [ "$VERSION_NUMBER" -eq 20 ] && [ "$MINOR_VERSION" -ge 9 ]; then
        echo -e "  ✅ Version check passed (>= 20.9.0)"
    elif [ "$VERSION_NUMBER" -gt 20 ]; then
        echo -e "  ✅ Version check passed"
    else
        echo -e "  ${RED}❌ Node.js version should be 20.9.0+ or 22.0.0+${NC}"
        echo -e "  ${YELLOW}   Current: $NODE_VERSION${NC}"
        echo -e "  ${YELLOW}   Please update from https://nodejs.org/${NC}"
        exit 1
    fi
else
    echo -e "  ${RED}❌ Node.js is not installed!${NC}"
    if [ "$OS" == "macOS" ]; then
        echo -e "  ${YELLOW}   Install via Homebrew: brew install node@22${NC}"
    elif [ "$OS" == "Linux" ]; then
        echo -e "  ${YELLOW}   Install via NodeSource:${NC}"
        echo -e "  ${YELLOW}   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -${NC}"
    fi
    echo -e "  ${YELLOW}   Or download from: https://nodejs.org/${NC}"
    exit 1
fi

# Check npm
echo -e "\n${GREEN}Checking npm...${NC}"
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo -e "  ✅ npm is installed: $NPM_VERSION"
    
    NPM_MAJOR=$(echo $NPM_VERSION | cut -d'.' -f1)
    if [ "$NPM_MAJOR" -ge 10 ]; then
        echo -e "  ✅ Version check passed (>= 10.0.0)"
    else
        echo -e "  ${RED}❌ npm version should be >= 10.0.0${NC}"
        echo -e "  ${YELLOW}   Current: $NPM_VERSION${NC}"
        exit 1
    fi
else
    echo -e "  ${RED}❌ npm is not installed!${NC}"
    echo -e "  ${YELLOW}   npm should come with Node.js. Please reinstall Node.js.${NC}"
    exit 1
fi

# Check Git
echo -e "\n${GREEN}Checking Git...${NC}"
if command_exists git; then
    GIT_VERSION=$(git --version)
    echo -e "  ✅ Git is installed: $GIT_VERSION"
else
    echo -e "  ${RED}❌ Git is not installed!${NC}"
    if [ "$OS" == "macOS" ]; then
        echo -e "  ${YELLOW}   Install Xcode Command Line Tools: xcode-select --install${NC}"
    elif [ "$OS" == "Linux" ]; then
        echo -e "  ${YELLOW}   Install via: sudo apt-get install git${NC}"
    fi
    exit 1
fi

# Check Expo CLI (optional)
echo -e "\n${GREEN}Checking Expo CLI (optional)...${NC}"
if command_exists expo; then
    EXPO_VERSION=$(expo --version 2>/dev/null || echo "installed")
    echo -e "  ✅ Expo CLI is installed: $EXPO_VERSION"
else
    echo -e "  ${YELLOW}⚠️  Expo CLI is not installed (optional for mobile development)${NC}"
    echo -e "  ${YELLOW}   Install via: npm install -g expo-cli${NC}"
fi

# macOS-specific checks
if [ "$OS" == "macOS" ]; then
    echo -e "\n${GREEN}Checking macOS development tools (optional)...${NC}"
    
    # Check Xcode
    if command_exists xcodebuild; then
        XCODE_VERSION=$(xcodebuild -version | head -n 1)
        echo -e "  ✅ Xcode is installed: $XCODE_VERSION"
    else
        echo -e "  ${YELLOW}⚠️  Xcode is not installed (optional, for iOS builds)${NC}"
    fi
    
    # Check CocoaPods
    if command_exists pod; then
        POD_VERSION=$(pod --version)
        echo -e "  ✅ CocoaPods is installed: $POD_VERSION"
    else
        echo -e "  ${YELLOW}⚠️  CocoaPods is not installed (optional, for iOS builds)${NC}"
    fi
fi

echo -e "\n${GREEN}✅ Prerequisites check complete!${NC}\n"
