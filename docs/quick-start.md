# 🚀 FitChain Quick Start Guide

Get FitChain running in 5 minutes!

## Prerequisites Checklist
- [ ] Node.js v18+ installed
- [ ] MetaMask wallet ready
- [ ] Git installed

## 1️⃣ Clone & Setup (1 minute)

```bash
git clone https://github.com/yourusername/fitchain.git
cd fitchain

# Windows
powershell -ExecutionPolicy Bypass -File setup.ps1

# Mac/Linux
chmod +x setup.sh
./setup.sh
```

## 2️⃣ Get Test ETH (2 minutes)

1. Open MetaMask
2. Switch to Sepolia network
3. Visit https://sepoliafaucet.com/
4. Request 0.5 Sepolia ETH

## 3️⃣ Configure Environment (1 minute)

### Get Required Keys:
- **Alchemy API**: https://alchemy.com (free tier)
- **Etherscan API**: https://etherscan.io/apis (free)
- **WalletConnect**: https://cloud.walletconnect.com (free)
### Update Files:

**contracts/.env**
```
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=your_metamask_private_key
ETHERSCAN_API_KEY=your_etherscan_key
```

**client/.env**
```
VITE_CONTRACT_ADDRESS=pending_deployment
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

## 4️⃣ Deploy Contract (1 minute)

```bash
cd contracts
npx hardhat run scripts/deploy.js --network sepolia
```

Copy the deployed contract address!

## 5️⃣ Launch App

1. Update `client/.env` with contract address
2. Start the app:
   ```bash
   cd client
   npm run dev
   ```
3. Open http://localhost:5173

## 🎉 You're Live!

1. Connect your MetaMask wallet
2. Log your first workout
3. Build your streak
4. Earn your badge!

## 🆘 Need Help?

- Contract not deploying? Check you have Sepolia ETH
- MetaMask issues? Try refreshing or clearing cache
- Can't see transactions? Make sure you're on Sepolia network

Happy fitness tracking! 💪
