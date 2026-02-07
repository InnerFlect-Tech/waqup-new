#!/usr/bin/env bash

# waQup Installation Script 03: Setup Environment
# Creates .env file from .env.example if it doesn't exist
# Usage: ./scripts/03-setup-environment.sh

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}📦 Step 3: Setting Up Environment${NC}"
echo -e "${CYAN}===================================${NC}\n"

# Get the project root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

# Setup environment file
echo -e "${GREEN}Setting up environment file...${NC}"
if [ -f ".env.example" ]; then
    if [ ! -f ".env" ]; then
        cp .env.example .env
        echo -e "  ✅ Created .env file from .env.example"
        echo -e ""
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
        echo -e "  ✅ .env file already exists"
    fi
else
    echo -e "  ${YELLOW}⚠️  .env.example not found. Skipping environment setup.${NC}"
fi

echo -e "\n${GREEN}✅ Environment setup complete!${NC}\n"
