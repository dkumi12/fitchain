#!/bin/bash
echo "🔍 FitChain Debug Script"
echo "======================"
echo ""

# Check Node version
echo "1. Checking Node.js version..."
node -v
echo ""

# Check npm version
echo "2. Checking npm version..."
npm -v
echo ""

# Check if node_modules exists
echo "3. Checking if node_modules exists..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules exists"
else
    echo "❌ node_modules NOT found - run 'npm install'"
fi
echo ""

# Check if .env exists
echo "4. Checking if .env exists..."
if [ -f ".env" ]; then
    echo "✅ .env exists"
    echo "   Make sure it contains:"
    echo "   VITE_WALLETCONNECT_PROJECT_ID=your_project_id"
    echo "   VITE_CONTRACT_ADDRESS="
else
    echo "❌ .env NOT found"
    echo "   Create .env file with:"
    echo "   VITE_WALLETCONNECT_PROJECT_ID=your_project_id"
    echo "   VITE_CONTRACT_ADDRESS="
fi
echo ""

# Check for common issues
echo "5. Common issues to check:"
echo "   - Clear browser cache (Ctrl+Shift+R)"
echo "   - Try incognito mode"
echo "   - Check browser console for errors (F12)"
echo "   - Make sure MetaMask is installed"
echo ""

echo "To fix most issues, run:"
echo "1. npm install"
echo "2. Create .env file if missing"
echo "3. npm run dev"
