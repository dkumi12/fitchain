# MetaMask Connection Setup Guide

## Prerequisites

1. **Install MetaMask**
   - Go to [metamask.io](https://metamask.io)
   - Install the browser extension
   - Create or import a wallet

2. **Get a WalletConnect Project ID**
   - Go to [WalletConnect Cloud](https://cloud.walletconnect.com)
   - Sign up for a free account
   - Create a new project
   - Copy your Project ID

## Configuration Steps

### 1. Update Environment Variables

Create or update `client/.env` file:

```env
# WalletConnect Project ID (REQUIRED for MetaMask connection)
VITE_WALLETCONNECT_PROJECT_ID=your_actual_project_id_here

# Contract Address (will be added after deployment)
VITE_CONTRACT_ADDRESS=
```

### 2. Add Sepolia Network to MetaMask

1. Open MetaMask
2. Click the network dropdown (usually shows "Ethereum Mainnet")
3. Click "Add Network"
4. Add Sepolia manually with these settings:
   - Network Name: `Sepolia Test Network`
   - RPC URL: `https://sepolia.infura.io/v3/YOUR_INFURA_KEY` or `https://rpc.sepolia.org`
   - Chain ID: `11155111`
   - Currency Symbol: `ETH`
   - Block Explorer URL: `https://sepolia.etherscan.io`

### 3. Get Sepolia Test ETH

1. Go to a Sepolia faucet:
   - [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
   - [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
   
2. Enter your wallet address
3. Request test ETH (you'll need some for gas fees)

## Running the Application

1. **Install dependencies**:
   ```bash
   cd client
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open the app**:
   - Navigate to http://localhost:5173
   - Click "Get Started"
   - Click "Connect Wallet" 
   - MetaMask should popup

## Troubleshooting

### MetaMask doesn't appear when clicking Connect

1. **Check browser console** (F12):
   - Look for any error messages
   - Common issue: Missing WalletConnect Project ID

2. **Verify environment variables**:
   - Make sure `.env` file exists in `client/` directory
   - Restart the dev server after adding environment variables

3. **Clear browser cache**:
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Try incognito/private mode

### "Chain not configured" error

1. Make sure you're on Sepolia network in MetaMask
2. The app only supports Sepolia testnet

### Transaction failures

1. Ensure you have Sepolia ETH for gas
2. Check that the contract is deployed (you need to deploy it first)

## Testing the Connection

1. Click "Get Started" on landing page
2. Click "Connect Wallet" button
3. Select MetaMask from the wallet options
4. Approve the connection in MetaMask
5. You should be redirected to the dashboard

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Project ID required" | Add WalletConnect Project ID to .env |
| MetaMask not detected | Make sure extension is installed and unlocked |
| Wrong network | Switch to Sepolia in MetaMask |
| No popup appears | Check popup blocker settings |
| Connection rejected | Try disconnecting from MetaMask settings and reconnect |

## Need More Help?

1. Check the browser console for specific errors
2. Ensure all dependencies are installed: `npm install`
3. Try a different browser (Chrome/Firefox/Brave work best)
4. Make sure MetaMask is updated to the latest version
