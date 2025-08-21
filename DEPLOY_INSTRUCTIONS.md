# 🚀 Deploy FitChain to GitHub & Vercel

Follow these steps to deploy your FitChain app:

## 1. Push to GitHub

### Create a new repository on GitHub:
1. Go to https://github.com/new
2. Name it: `fitchain`
3. Make it Public
4. Don't initialize with README (we already have one)
5. Click "Create repository"

### Push your code:
```bash
cd C:\Users\abami\OneDrive\Desktop\Projects\FitChain

# Add your GitHub repository as origin
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/fitchain.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 2. Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Import your `fitchain` repository
5. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. Add Environment Variables:
   ```
   VITE_CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS
   VITE_ALCHEMY_API_KEY=YOUR_ALCHEMY_KEY
   VITE_WALLET_CONNECT_PROJECT_ID=YOUR_WALLETCONNECT_ID
   ```

7. Click "Deploy"

### Option B: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   cd client
   vercel
   ```

3. Follow the prompts:
   - Set up and deploy: Yes
   - Which scope: Your account
   - Link to existing project: No
   - Project name: fitchain
   - Root directory: ./
   - Override settings: No

## 3. Post-Deployment

### Your app will be available at:
- Production: `https://fitchain.vercel.app`
- Preview: `https://fitchain-git-main-yourusername.vercel.app`

### Update your README with the live URL:
1. Edit README.md
2. Update the deployment link
3. Commit and push:
   ```bash
   git add README.md
   git commit -m "Add deployment URL"
   git push
   ```

## 4. Custom Domain (Optional)

1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Environment Variables Reference

```
VITE_CONTRACT_ADDRESS=0x... (Your deployed WorkoutTracker contract)
VITE_ALCHEMY_API_KEY=... (From https://www.alchemy.com/)
VITE_WALLET_CONNECT_PROJECT_ID=... (From https://cloud.walletconnect.com/)
```

## Troubleshooting

- **Build fails**: Check Node version (should be 18+)
- **Wallet not connecting**: Ensure environment variables are set
- **Contract not found**: Verify contract address and network

## Next Steps

1. Test the deployed app
2. Share the URL
3. Monitor usage in Vercel Analytics
4. Set up automatic deployments for future commits

Your FitChain app is now live! 🎉
