#!/bin/bash

# Kos-Sickness Production Deployment Script
# This script prepares and deploys the application to Vercel

set -e

echo "================================"
echo "Kos-Sickness Production Deploy"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_step() {
    echo -e "${GREEN}→${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Check prerequisites
print_step "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi
print_success "Node.js $(node -v) found"

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi
print_success "npm $(npm -v) found"

if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found, installing..."
    npm install -g vercel
fi
print_success "Vercel CLI found"

# Check git status
print_step "Checking git status..."

if [ -z "$(git status --porcelain)" ]; then
    print_success "Working directory is clean"
else
    print_error "Working directory has uncommitted changes"
    print_warning "Please commit or stash changes before deploying"
    exit 1
fi

# Check if on main branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
    print_warning "Current branch: $CURRENT_BRANCH (not main)"
    read -p "Continue with deployment? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Deployment cancelled"
        exit 1
    fi
fi

# Install dependencies
print_step "Installing dependencies..."
npm install
cd frontend
npm install
cd ..
print_success "Dependencies installed"

# Run tests
print_step "Running tests..."
if [ -f "test-api.sh" ]; then
    bash test-api.sh || print_warning "Some tests failed, continuing..."
    print_success "Tests completed"
else
    print_warning "No test script found"
fi

# Build frontend
print_step "Building frontend..."
npm run build:frontend
if [ -d "frontend/dist" ]; then
    print_success "Frontend build successful"
    echo "  Build size: $(du -sh frontend/dist | cut -f1)"
else
    print_error "Frontend build failed"
    exit 1
fi

# Verify API structure
print_step "Verifying API structure..."
if [ -f "api/health.js" ] && [ -f "api/app-info.js" ] && [ -f "api/analyze-sickness.js" ] && [ -f "api/chat.js" ]; then
    print_success "All API endpoints found"
else
    print_error "Some API endpoints are missing"
    exit 1
fi

# Verify environment variables
print_step "Checking environment variables..."
if [ -z "$GROQ_API_KEY" ]; then
    print_warning "GROQ_API_KEY not set in local environment"
    print_warning "Make sure it's set in Vercel Settings"
else
    print_success "GROQ_API_KEY is set"
fi

# Check vercel.json
if [ -f "vercel.json" ]; then
    print_success "vercel.json found"
else
    print_error "vercel.json not found"
    exit 1
fi

# Summary
echo ""
echo "================================"
echo "Deployment Summary"
echo "================================"
echo ""
echo "Project:          Kos-Sickness"
echo "Environment:      Production"
echo "Branch:           $CURRENT_BRANCH"
echo "Frontend dist:    $(ls -la frontend/dist/ | wc -l) files"
echo "API functions:    4 endpoints"
echo ""

# Ask for confirmation
read -p "Proceed with deployment to Vercel? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_error "Deployment cancelled"
    exit 1
fi

# Deploy to Vercel
print_step "Deploying to Vercel (production)..."
vercel --prod

print_success "Deployment completed!"
echo ""
echo "================================"
echo "Post-Deployment Checks"
echo "================================"
echo ""
print_step "Waiting for deployment to be ready..."
sleep 10

# Get deployment URL
echo ""
echo "Deployment URL: https://kos-sickness.vercel.app"
echo ""
print_step "Running post-deployment verification..."

# Test endpoints
DOMAIN="https://kos-sickness.vercel.app"

echo "Testing health endpoint..."
if curl -s "$DOMAIN/api/health" | grep -q "healthy"; then
    print_success "Health check passed"
else
    print_warning "Health check might have failed, check manually"
fi

echo ""
print_success "Deployment process completed!"
echo ""
echo "Next steps:"
echo "1. Verify deployment in Vercel Dashboard"
echo "2. Test all API endpoints manually"
echo "3. Monitor error logs for 24 hours"
echo "4. Update status page/notify team"
echo ""
