#!/usr/bin/env bash

# waQup Installation Script 02: Install Dependencies
# Installs all core dependencies for Mobile and Web platforms
# Usage: ./scripts/02-install-dependencies.sh

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}📦 Step 2: Installing Dependencies${NC}"
echo -e "${CYAN}====================================${NC}\n"

# Get the project root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

echo -e "${YELLOW}Project Root: ${PROJECT_ROOT}${NC}\n"

# Function to install packages in a directory
install_packages() {
    local dir=$1
    local packages=$2
    local is_dev=$3
    
    echo -e "${BLUE}Installing in ${dir}...${NC}"
    cd "$PROJECT_ROOT/$dir"
    
    if [ "$is_dev" = "true" ]; then
        npm install --save-dev $packages --no-audit --no-fund
    else
        npm install $packages --no-audit --no-fund
    fi
    
    cd "$PROJECT_ROOT"
    echo -e "${GREEN}✅ Completed ${dir}${NC}\n"
}

# Step 1: Install root dependencies
echo -e "${BLUE}=== Root Dependencies ===${NC}"
echo -e "${YELLOW}Installing root workspace dependencies...${NC}"
npm install --no-audit --no-fund
echo -e "${GREEN}✅ Root dependencies installed${NC}\n"

# Step 2: Mobile Dependencies
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

# Step 3: Web Dependencies
echo -e "${BLUE}=== Web Platform Dependencies ===${NC}"

# Forms
install_packages "packages/web" "react-hook-form @hookform/resolvers"

# Utilities
install_packages "packages/web" "date-fns uuid"

# Dev Dependencies
install_packages "packages/web" "@types/uuid" "true"

echo -e "${GREEN}✅ All dependencies installed successfully!${NC}\n"
