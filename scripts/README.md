# Installation Scripts

This directory contains all installation and setup scripts for the waQup project.

## Script Organization

All scripts are numbered in execution order:

### Unix Scripts (macOS/Linux)
- `01-verify-prerequisites.sh` - Verifies Node.js, npm, Git, and optional tools
- `02-install-dependencies.sh` - Installs all project dependencies
- `03-setup-environment.sh` - Creates .env file from .env.example
- `04-verify-installation.sh` - Verifies TypeScript compilation and installation
- `install.sh` - **Master script** - Runs all scripts in order

### Windows Scripts
- `01-verify-prerequisites.ps1` - Verifies Node.js, npm, Git, and optional tools
- `02-install-dependencies.ps1` - Installs all project dependencies
- `03-setup-environment.ps1` - Creates .env file from .env.example
- `04-verify-installation.ps1` - Verifies TypeScript compilation and installation
- `install.ps1` - **Master script** - Runs all scripts in order

## Quick Start

### macOS/Linux
```bash
chmod +x scripts/install.sh
./scripts/install.sh
```

### Windows
```powershell
.\scripts\install.ps1
```

## Running Individual Scripts

You can run scripts individually if needed:

### macOS/Linux
```bash
# Make scripts executable (first time only)
chmod +x scripts/*.sh

# Run individual scripts
./scripts/01-verify-prerequisites.sh
./scripts/02-install-dependencies.sh
./scripts/03-setup-environment.sh
./scripts/04-verify-installation.sh
```

### Windows
```powershell
# Run individual scripts
.\scripts\01-verify-prerequisites.ps1
.\scripts\02-install-dependencies.ps1
.\scripts\03-setup-environment.ps1
.\scripts\04-verify-installation.ps1
```

## Script Details

### 01: Verify Prerequisites
- Checks Node.js version (>=20.9.0 or >=22.0.0)
- Checks npm version (>=10.0.0)
- Checks Git installation
- Checks Expo CLI (optional)
- macOS: Checks Xcode and CocoaPods (optional)

### 02: Install Dependencies
- Installs root workspace dependencies
- Installs mobile platform dependencies (React Navigation with **native-stack**, expo-av, forms, etc.)
- Installs web platform dependencies (forms, **zod**, **@stripe/stripe-js**, utilities)
- Uses `--no-audit --no-fund` flags to prevent hanging
- Installs directly in package directories for reliability
- **Keep in sync**: Packages installed here should also be listed in each package’s `package.json` so a root `npm install` is sufficient.

### 03: Setup Environment
- Copies `.env.example` to `.env` if it doesn't exist
- Provides instructions for editing .env file
- Lists required environment variables

### 04: Verify Installation
- Runs TypeScript compilation checks for mobile, web, and shared packages
- Verifies all packages installed correctly
- Provides summary and next steps

## Troubleshooting

### Scripts won't run (Unix)
```bash
# Make scripts executable
chmod +x scripts/*.sh
```

### npm install hangs
The scripts use `--no-audit --no-fund` flags to prevent hanging. If installation still hangs:
1. Clear npm cache: `npm cache clean --force`
2. Remove node_modules: `rm -rf node_modules packages/*/node_modules`
3. Remove package-lock.json: `rm package-lock.json`
4. Run installation again

### Permission denied (Unix)
```bash
# Make scripts executable
chmod +x scripts/install.sh
chmod +x scripts/*.sh
```

### PowerShell execution policy (Windows)
```powershell
# Allow script execution (run as Administrator)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Notes

- All scripts use relative paths and detect their own location
- Scripts exit on error (`set -e` for bash, `$ErrorActionPreference = "Stop"` for PowerShell)
- Scripts provide colored output for better readability
- Master scripts call individual scripts in order and exit on any failure
