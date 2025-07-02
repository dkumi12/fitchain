# IMMEDIATE FIX FOR STUCK TRANSACTIONS

## Option 1: MetaMask Reset (Fastest)
1. Open MetaMask
2. Click the account icon (top right)
3. Go to Settings → Advanced
4. Scroll down and click "Clear activity tab data"
5. Then click "Reset Account"
6. Refresh your FitChain app

This will NOT affect your funds, only clears transaction history.

## Option 2: Manual Cancel via Etherscan
1. Go to: https://sepolia.etherscan.io/address/YOUR_ADDRESS
2. Find your stuck transaction
3. Click on it and note the "Nonce" number
4. In MetaMask:
   - Send 0 ETH to yourself
   - Click "Advanced"
   - Set the nonce to the same number as your stuck transaction
   - Set gas price to at least 100 gwei
   - Confirm

## Option 3: Use the Force Reset in FitChain
1. Go to your Dashboard
2. Find the red "Force Reset Transactions" box
3. Click "Check Transaction Status" first
4. Then click "Force Reset"
5. This sends a high-gas transaction to clear the queue

## Why this happens on Sepolia:
- Sepolia testnet can be congested
- Gas prices fluctuate wildly
- Your transactions had too low gas

## Prevention:
- Always use at least 50-100 gwei gas on Sepolia
- Wait for each transaction to confirm before sending another
- Use the gas price monitor on your dashboard

If none of these work, wait 10-15 minutes and try again. 
Sepolia sometimes just needs time to process.
