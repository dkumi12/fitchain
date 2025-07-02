#!/bin/bash

echo "🏋️ FitChain MVP Setup Script"
echo "============================"
echo ""

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "Node.js version: $NODE_VERSION"

# Check if in project root
if [ ! -f "README.md" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo ""
echo "📦 Installing contract dependencies..."
cd contracts
npm install

echo ""
echo "📦 Installing frontend dependencies..."
cd ../client
npm install

echo ""
echo "🔧 Setting up environment files..."
cd ../contracts
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created contracts/.env - Please add your keys"
else
    echo "⚠️  contracts/.env already exists"
fi

cd ../client
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created client/.env - Please add your configuration"
else
    echo "⚠️  client/.env already exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Add your private key and RPC URL to contracts/.env"
echo "2. Deploy contract: cd contracts && npx hardhat run scripts/deploy.js --network sepolia"
echo "3. Add contract address to client/.env"
echo "4. Start frontend: cd client && npm run dev"
echo ""
echo "Happy building! 🚀"
