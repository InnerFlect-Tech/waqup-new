#!/usr/bin/env bash

# waQup Installation Script 04: Verify Installation
# Verifies TypeScript compilation and package installation
# Usage: ./scripts/04-verify-installation.sh

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}📦 Step 4: Verifying Installation${NC}"
echo -e "${CYAN}==================================${NC}\n"

# Get the project root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

ALL_GOOD=true

# Verify Mobile TypeScript compilation
echo -e "${GREEN}Verifying Mobile TypeScript compilation...${NC}"
if [ -d "packages/mobile" ]; then
    cd packages/mobile
    if npm run type-check > /dev/null 2>&1; then
        echo -e "  ✅ Mobile TypeScript compilation successful"
    else
        echo -e "  ${RED}❌ Mobile TypeScript compilation failed${NC}"
        ALL_GOOD=false
    fi
    cd "$PROJECT_ROOT"
else
    echo -e "  ${YELLOW}⚠️  Mobile package not found${NC}"
fi

# Verify Web TypeScript compilation
echo -e "\n${GREEN}Verifying Web TypeScript compilation...${NC}"
if [ -d "packages/web" ]; then
    cd packages/web
    if npx tsc --noEmit > /dev/null 2>&1; then
        echo -e "  ✅ Web TypeScript compilation successful"
    else
        echo -e "  ${RED}❌ Web TypeScript compilation failed${NC}"
        ALL_GOOD=false
    fi
    cd "$PROJECT_ROOT"
else
    echo -e "  ${YELLOW}⚠️  Web package not found${NC}"
fi

# Verify Shared package
echo -e "\n${GREEN}Verifying Shared package...${NC}"
if [ -d "packages/shared" ]; then
    cd packages/shared
    if npm run type-check > /dev/null 2>&1; then
        echo -e "  ✅ Shared package TypeScript compilation successful"
    else
        echo -e "  ${YELLOW}⚠️  Shared package TypeScript check (non-critical)${NC}"
    fi
    cd "$PROJECT_ROOT"
else
    echo -e "  ${YELLOW}⚠️  Shared package not found${NC}"
fi

# Summary
echo -e "\n${CYAN}📋 Installation Summary:${NC}"
if [ "$ALL_GOOD" = true ]; then
    echo -e "${GREEN}✅ All verifications passed!${NC}"
    echo -e ""
    echo -e "${CYAN}Next steps:${NC}"
    echo -e "  1. Edit .env file with your API keys and credentials"
    echo -e "  2. Run: npm run dev:all (to start all dev servers)"
    echo -e "  3. Or run individually:"
    echo -e "     - npm run dev:mobile (for mobile)"
    echo -e "     - npm run dev:web (for web)"
else
    echo -e "${YELLOW}⚠️  Some verifications failed. Please review above.${NC}"
    exit 1
fi

echo ""
