#!/usr/bin/env bash

# waQup Master Installation Script (macOS/Linux)
# This script orchestrates the complete installation process
# Usage: ./scripts/install.sh

set -e  # Exit on error

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo -e "${CYAN}🚀 waQup Installation${NC}"
echo -e "${CYAN}====================${NC}\n"

# Step 1: Verify Prerequisites
echo -e "${GREEN}Step 1/4: Verifying Prerequisites...${NC}"
"$SCRIPT_DIR/01-verify-prerequisites.sh" || exit 1

# Step 2: Install Dependencies
echo -e "\n${GREEN}Step 2/4: Installing Dependencies...${NC}"
"$SCRIPT_DIR/02-install-dependencies.sh" || exit 1

# Step 3: Setup Environment
echo -e "\n${GREEN}Step 3/4: Setting Up Environment...${NC}"
"$SCRIPT_DIR/03-setup-environment.sh" || exit 1

# Step 4: Verify Installation
echo -e "\n${GREEN}Step 4/4: Verifying Installation...${NC}"
"$SCRIPT_DIR/04-verify-installation.sh" || exit 1

echo -e "\n${GREEN}✅ Installation Complete!${NC}\n"
echo -e "${CYAN}📚 For more information, see README.md${NC}\n"
