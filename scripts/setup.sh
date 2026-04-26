#!/bin/bash
set -e

echo "🔧 Setting up habit.io development environment..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20 or later."
    exit 1
fi

echo "✓ Node.js $(node --version)"

# Install dependencies
echo
echo "📦 Installing dependencies..."
yarn install

# Install Playwright browsers
echo
echo "🌐 Installing Playwright browsers (Chromium, Firefox, WebKit)..."
npx playwright install

echo
echo "✅ Setup complete!"
echo
echo "Next steps:"
echo "  1. Start the dev server: yarn dev"
echo "  2. Run tests: yarn test"
echo "  3. Run tests in UI mode: yarn test:ui"
