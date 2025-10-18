#!/bin/bash

# Deployment Readiness Check Script
# This script checks if your project is ready for deployment

echo "🔍 Checking Deployment Readiness..."
echo "=================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if git is initialized
if [ -d ".git" ]; then
    echo -e "${GREEN}✓${NC} Git repository initialized"
else
    echo -e "${RED}✗${NC} Git repository not found. Run: git init"
    exit 1
fi

# Check if frontend dependencies are installed
if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Frontend dependencies installed"
else
    echo -e "${YELLOW}!${NC} Frontend dependencies not installed. Run: cd frontend && npm install"
fi

# Check if backend venv exists
if [ -d "backend/venv" ]; then
    echo -e "${GREEN}✓${NC} Backend virtual environment exists"
else
    echo -e "${YELLOW}!${NC} Backend venv not found. Run: cd backend && python -m venv venv"
fi

# Check for vercel.json
if [ -f "vercel.json" ]; then
    echo -e "${GREEN}✓${NC} vercel.json found"
else
    echo -e "${RED}✗${NC} vercel.json not found"
fi

# Check for railway.toml
if [ -f "railway.toml" ]; then
    echo -e "${GREEN}✓${NC} railway.toml found"
else
    echo -e "${RED}✗${NC} railway.toml not found"
fi

# Check for frontend .env.production
if [ -f "frontend/.env.production" ]; then
    echo -e "${GREEN}✓${NC} frontend/.env.production found"
    # Check if it has placeholder
    if grep -q "your-backend.up.railway.app" "frontend/.env.production"; then
        echo -e "${YELLOW}!${NC} Remember to update REACT_APP_API_URL in frontend/.env.production"
    fi
else
    echo -e "${RED}✗${NC} frontend/.env.production not found"
fi

# Check if there are uncommitted changes
if git diff-index --quiet HEAD --; then
    echo -e "${GREEN}✓${NC} No uncommitted changes"
else
    echo -e "${YELLOW}!${NC} You have uncommitted changes. Commit before deploying"
fi

echo ""
echo "=================================="
echo "📋 Next Steps:"
echo "1. Push code to GitHub"
echo "2. Deploy frontend to Vercel"
echo "3. Deploy backend to Railway"
echo "4. Update frontend/.env.production with Railway URL"
echo "5. Redeploy frontend on Vercel"
echo ""
echo "See docs/DEPLOYMENT_COMPLETE.md for detailed instructions"
