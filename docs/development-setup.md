# FitChain Development Setup

Quick guide to get FitChain running locally.

## Required Tools

1. **Node.js** (v18+)
   ```bash
   node --version  # Should be 18.x or higher
   ```

2. **Git**
   ```bash
   git --version
   ```

3. **MetaMask Browser Extension**
   - Install from [metamask.io](https://metamask.io)
   - Create wallet or import existing
   - Switch to Sepolia network

## Initial Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/fitchain.git
   cd fitchain
   ```

2. **Install Dependencies**
   ```bash
   # Contract dependencies
   cd contracts
   npm install
   
   # Frontend dependencies
   cd ../client
   npm install
   ```
3. **Environment Configuration**

   Create `contracts/.env`:
   ```
   SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
   PRIVATE_KEY=your_wallet_private_key
   ETHERSCAN_API_KEY=your_etherscan_key
   ```

   Create `client/.env`:
   ```
   VITE_CONTRACT_ADDRESS=will_add_after_deployment
   VITE_WALLETCONNECT_PROJECT_ID=your_project_id
   ```

## Local Development

### Option 1: Hardhat Local Network

1. Start local blockchain:
   ```bash
   cd contracts
   npx hardhat node
   ```

2. Deploy contract locally:
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. Update frontend config with local contract address

4. Start frontend:
   ```bash
   cd client
   npm run dev
   ```
### Option 2: Sepolia Testnet

1. Get Sepolia ETH from faucet
2. Deploy to Sepolia:
   ```bash
   cd contracts
   npx hardhat run scripts/deploy.js --network sepolia
   ```
3. Update client/.env with deployed address
4. Start frontend

## VS Code Setup

Recommended extensions:
- Solidity (Juan Blanco)
- ESLint
- Prettier
- Tailwind CSS IntelliSense

## Common Commands

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Start frontend dev server
npm run dev

# Build for production
npm run build

# Clean artifacts
npx hardhat clean
```

## Troubleshooting

**Module not found errors**
- Delete node_modules and reinstall

**MetaMask connection issues**
- Reset account in MetaMask settings
- Clear browser cache

**Transaction failures**
- Check you have enough ETH
- Verify correct network selected
