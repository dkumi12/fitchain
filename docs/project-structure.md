# FitChain Project Structure

```
FitChain/
│
├── contracts/                 # Smart contract development
│   ├── contracts/            # Solidity contracts
│   │   └── WorkoutTracker.sol
│   ├── scripts/              # Deployment & interaction scripts
│   │   ├── deploy.js
│   │   ├── interact.js
│   │   └── simulate-streak.js
│   ├── test/                 # Contract tests
│   │   └── WorkoutTracker.test.js
│   ├── hardhat.config.js     # Hardhat configuration
│   ├── package.json          # Contract dependencies
│   └── .env.example          # Environment template
│
├── client/                   # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Header.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── WorkoutTracker.jsx
│   │   │   ├── StatsDisplay.jsx
│   │   │   ├── LogWorkoutButton.jsx
│   │   │   └── BadgeDisplay.jsx
│   │   ├── abi/             # Contract ABI
│   │   │   └── WorkoutTracker.json
│   │   ├── assets/          # Images, icons
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   ├── index.css        # Global styles
│   │   └── wagmi.config.js  # Web3 configuration
│   ├── index.html           # HTML template
│   ├── vite.config.js       # Vite configuration
│   ├── tailwind.config.js   # Tailwind configuration
│   ├── postcss.config.js    # PostCSS configuration
│   ├── package.json         # Frontend dependencies
│   └── .env.example         # Environment template
│
├── docs/                    # Documentation
│   ├── deployment-guide.md  # Deployment instructions
│   ├── testing-guide.md     # Testing procedures
│   └── development-setup.md # Dev environment setup
│
├── scripts/                 # Project-wide scripts
│
├── .gitignore              # Git ignore file
└── README.md               # Project overview
```

## Key Files Explained

### Smart Contract Files
- **WorkoutTracker.sol**: Main contract handling workout logging, streak tracking, and NFT badge minting
- **deploy.js**: Automated deployment script for Sepolia
- **hardhat.config.js**: Network and compiler configuration

### Frontend Files
- **App.jsx**: Root component with Web3 providers
- **WorkoutTracker.jsx**: Main workout tracking interface
- **wagmi.config.js**: RainbowKit and chain configuration

### Configuration Files
- **.env files**: Store private keys and API endpoints (never commit!)
- **package.json**: Dependencies and scripts for each module

## Next Steps

1. Run `npm install` in both `/contracts` and `/client`
2. Configure your `.env` files
3. Deploy contract to Sepolia
4. Update frontend with contract address
5. Start building your fitness journey on-chain! 🏋️‍♂️
