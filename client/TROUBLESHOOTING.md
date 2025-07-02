# FitChain - MetaMask Connection Troubleshooting

## Current Setup

We've simplified the connection to use direct MetaMask integration without RainbowKit to avoid the errors you were seeing.

## To Test the Connection:

1. **Make sure you're running the app:**
   ```bash
   cd client
   npm install
   npm run dev
   ```

2. **Open http://localhost:5173**

3. **Click "Get Started"**

4. **Click "Connect with MetaMask"**

## If MetaMask doesn't popup:

### 1. Check MetaMask is Installed
- Look for the fox icon in your browser extensions
- If not installed, go to https://metamask.io

### 2. Check Browser Console
- Press F12 to open developer tools
- Look for any red error messages
- Common issues:
  - "MetaMask is not installed" 
  - "User rejected the request"

### 3. Try These Steps:
1. **Refresh the page** (Ctrl+R or Cmd+R)
2. **Clear browser cache** (Ctrl+Shift+R or Cmd+Shift+R)
3. **Disable ad blockers** temporarily
4. **Try incognito/private mode**
5. **Try a different browser** (Chrome, Firefox, or Brave work best)

### 4. Reset MetaMask (if needed):
1. Click MetaMask extension icon
2. Click the account icon (circle) in top right
3. Go to Settings → Advanced
4. Click "Reset Account"

## The errors you were seeing:

The `contentScript.bundle.js` errors were from browser extensions (likely ad blockers or privacy extensions) interfering with the page. These shouldn't affect MetaMask connection.

## Current Status:

- ✅ Removed dependency on RainbowKit (was causing issues)
- ✅ Direct MetaMask integration implemented
- ✅ Simplified connection flow
- ✅ Mock data for testing UI without blockchain

## Once Connected:

You'll be redirected to the dashboard where you can:
- View your workout streak
- Log new workouts
- See your NFT badges
- Check community leaderboard

## Still Having Issues?

1. Make sure MetaMask is unlocked (enter your password)
2. Try connecting on Ethereum Mainnet first, then switch to Sepolia
3. Check if you have any other wallet extensions that might conflict
4. Post the exact error message from the browser console

The app is now using a simplified connection method that should work with just MetaMask installed.
