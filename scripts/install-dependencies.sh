#!/bin/bash

# waQup Dependency Installation Script
# This script installs all core dependencies for Mobile and Web platforms
# Usage: ./scripts/install-dependencies.sh

set -e  # Exit on error

echo "🚀 Installing waQup dependencies..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to install packages in a directory
install_packages() {
    local dir=$1
    local packages=$2
    local is_dev=$3
    
    echo -e "${BLUE}Installing in ${dir}...${NC}"
    cd "$dir"
    
    if [ "$is_dev" = "true" ]; then
        npm install --save-dev $packages --no-audit --no-fund
    else
        npm install $packages --no-audit --no-fund
    fi
    
    cd - > /dev/null
    echo -e "${GREEN}✅ Completed ${dir}${NC}"
    echo ""
}

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo -e "${YELLOW}Project Root: ${PROJECT_ROOT}${NC}"
echo ""

# Mobile Dependencies
echo -e "${BLUE}=== Mobile Platform Dependencies ===${NC}"

# Navigation
install_packages "packages/mobile" "@react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs"

# Navigation peer dependencies
install_packages "packages/mobile" "react-native-screens react-native-safe-area-context"

# Audio
install_packages "packages/mobile" "expo-av"

# Forms
install_packages "packages/mobile" "react-hook-form @hookform/resolvers"

# UI Animations
install_packages "packages/mobile" "react-native-reanimated react-native-gesture-handler"

# Utilities
install_packages "packages/mobile" "date-fns uuid axios"

# Storage (required for Supabase auth)
install_packages "packages/mobile" "@react-native-async-storage/async-storage"

# Dev Dependencies
install_packages "packages/mobile" "@types/react-native @types/uuid" "true"

# Web Dependencies
echo -e "${BLUE}=== Web Platform Dependencies ===${NC}"

# Forms
install_packages "packages/web" "react-hook-form @hookform/resolvers"

# Utilities
install_packages "packages/web" "date-fns uuid"

# Dev Dependencies
install_packages "packages/web" "@types/uuid" "true"

echo -e "${GREEN}🎉 All dependencies installed successfully!${NC}"
echo ""
echo "Next steps:"
echo "1. Run 'npm run type-check' in packages/mobile to verify TypeScript compilation"
echo "2. Run 'npx tsc --noEmit' in packages/web to verify TypeScript compilation"
echo "3. Test apps: 'npm run dev:mobile' and 'npm run dev:web'"
