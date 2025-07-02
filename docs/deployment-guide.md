# FitChain Deployment Guide

This guide walks you through deploying FitChain to the Sepolia testnet.

## Prerequisites

1. **Node.js** v18+ installed
2. **MetaMask** wallet with Sepolia ETH
3. **Alchemy** account for RPC access
4. **Etherscan** API key for verification

## Step 1: Get Sepolia ETH

1. Visit [Sepolia Faucet](https://sepoliafaucet.com/)
2. Enter your wallet address
3. Request test ETH (you'll need ~0.1 ETH for deployment)

## Step 2: Set Up Environment Variables

### For Contracts (contracts/.env)
```bash
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=your_metamask_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### For Frontend (client/.env)
```bash
VITE_CONTRACT_ADDRESS=will_be_set_after_deployment
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_id
```

## Step 3: Install Dependencies

```bash
# Install contract dependencies
cd contracts
npm install

# Install frontend dependencies
cd ../client
npm install
```

## Step 4: Deploy Smart Contract

```bash
cd contracts

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

Save the deployed contract address!

## Step 5: Update Frontend Configuration

1. Copy the contract address from deployment
2. Update `client/.env`:
   ```
   VITE_CONTRACT_ADDRESS=0x...your_contract_address
   ```
3. Copy the ABI file:
   ```bash
   cp contracts/artifacts/contracts/WorkoutTracker.sol/WorkoutTracker.json client/src/abi/
   ```

## Step 6: Run Frontend Locally

```bash
cd client
npm run dev
```

Visit http://localhost:5173

## Step 7: Deploy Frontend to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

## Troubleshooting

### "Insufficient funds" error
- Make sure you have Sepolia ETH in your wallet
- Check that your private key is correct

### "Network error" 
- Verify your Alchemy RPC URL is correct
- Check you're connected to Sepolia in MetaMask

### Contract verification fails
- Wait a few minutes after deployment
- Ensure Etherscan API key is valid

## Next Steps

- Test all functionality on Sepolia
- Share with beta testers
- Consider mainnet deployment strategy
