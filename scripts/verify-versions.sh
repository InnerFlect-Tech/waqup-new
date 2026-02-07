#!/bin/bash

# Version Verification Script for waQup
# Verifies all package versions are consistent and correct

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}🔍 Verifying package versions...${NC}\n"

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1)
NODE_MINOR=$(echo $NODE_VERSION | cut -d'.' -f2)

if [ "$NODE_MAJOR" -ge 24 ]; then
    echo -e "${GREEN}✅ Node.js version: $NODE_VERSION (>= 24.0.0)${NC}"
else
    echo -e "${RED}❌ Node.js version: $NODE_VERSION (requires >= 24.0.0)${NC}"
    exit 1
fi

# Check npm version
NPM_VERSION=$(npm --version)
NPM_MAJOR=$(echo $NPM_VERSION | cut -d'.' -f1)

if [ "$NPM_MAJOR" -ge 10 ]; then
    echo -e "${GREEN}✅ npm version: $NPM_VERSION (>= 10.0.0)${NC}"
else
    echo -e "${RED}❌ npm version: $NPM_VERSION (requires >= 10.0.0)${NC}"
    exit 1
fi

echo ""

# Check root package.json
echo -e "${CYAN}📦 Checking root package.json...${NC}"
if grep -q '"node": ">=24.0.0"' package.json; then
    echo -e "${GREEN}✅ Root package.json: Node requirement correct${NC}"
else
    echo -e "${RED}❌ Root package.json: Node requirement incorrect${NC}"
    exit 1
fi

if grep -q '"@types/node": "\^24.0.0"' package.json; then
    echo -e "${GREEN}✅ Root package.json: @types/node version correct${NC}"
else
    echo -e "${RED}❌ Root package.json: @types/node version incorrect${NC}"
    exit 1
fi

# Check shared package.json
echo -e "\n${CYAN}📦 Checking shared package.json...${NC}"
if grep -q '"@types/node": "\^24.0.0"' packages/shared/package.json; then
    echo -e "${GREEN}✅ Shared package.json: @types/node version correct${NC}"
else
    echo -e "${RED}❌ Shared package.json: @types/node version incorrect${NC}"
    exit 1
fi

if grep -q '"typescript": "\^5.9.3"' packages/shared/package.json; then
    echo -e "${GREEN}✅ Shared package.json: TypeScript version correct${NC}"
else
    echo -e "${RED}❌ Shared package.json: TypeScript version incorrect${NC}"
    exit 1
fi

# Check mobile package.json
echo -e "\n${CYAN}📦 Checking mobile package.json...${NC}"
if grep -q '"@react-navigation/native": "\^7.1.28"' packages/mobile/package.json; then
    echo -e "${GREEN}✅ Mobile package.json: React Navigation v7 installed${NC}"
else
    echo -e "${RED}❌ Mobile package.json: React Navigation version incorrect${NC}"
    exit 1
fi

if grep -q '"react": "19.1.0"' packages/mobile/package.json; then
    echo -e "${GREEN}✅ Mobile package.json: React version correct (19.1.0 for Expo SDK 54)${NC}"
else
    echo -e "${RED}❌ Mobile package.json: React version incorrect${NC}"
    exit 1
fi

if grep -q '"typescript": "~5.9.3"' packages/mobile/package.json; then
    echo -e "${GREEN}✅ Mobile package.json: TypeScript version correct${NC}"
else
    echo -e "${RED}❌ Mobile package.json: TypeScript version incorrect${NC}"
    exit 1
fi

# Check web package.json
echo -e "\n${CYAN}📦 Checking web package.json...${NC}"
if grep -q '"typescript": "\^5.9.3"' packages/web/package.json; then
    echo -e "${GREEN}✅ Web package.json: TypeScript version correct${NC}"
else
    echo -e "${RED}❌ Web package.json: TypeScript version incorrect${NC}"
    exit 1
fi

if grep -q '"react": "19.2.3"' packages/web/package.json; then
    echo -e "${GREEN}✅ Web package.json: React version correct (19.2.3 for Next.js)${NC}"
else
    echo -e "${RED}❌ Web package.json: React version incorrect${NC}"
    exit 1
fi

# Verify rebuild-roadmap path exists
echo -e "\n${CYAN}📁 Checking rebuild-roadmap path...${NC}"
if [ -d "rebuild-roadmap" ]; then
    echo -e "${GREEN}✅ rebuild-roadmap directory exists${NC}"
else
    echo -e "${RED}❌ rebuild-roadmap directory not found${NC}"
    exit 1
fi

echo -e "\n${GREEN}✅ All version checks passed!${NC}\n"

echo -e "${CYAN}📋 Summary:${NC}"
echo -e "  • Node.js: $NODE_VERSION"
echo -e "  • npm: $NPM_VERSION"
echo -e "  • TypeScript: 5.9.3 (all packages)"
echo -e "  • React Navigation: v7 (mobile)"
echo -e "  • React: 19.1.0 (mobile), 19.2.3 (web)"
echo -e "  • @types/node: 24.0.0 (root & shared)"
echo ""
