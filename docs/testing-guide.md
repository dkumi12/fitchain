# FitChain Testing Guide

This guide covers testing strategies for the FitChain MVP.

## Smart Contract Testing

### Running Unit Tests

```bash
cd contracts
npx hardhat test
```

### Test Coverage

```bash
npx hardhat coverage
```

### Key Test Scenarios

1. **Workout Logging**
   - First workout creates new user data
   - Can't log multiple workouts same day
   - Streak increments for consecutive days
   - Streak resets after missing days

2. **Badge Minting**
   - Badge mints after 7-day streak
   - Badge only mints once per achievement
   - NFT ownership transfers correctly

3. **View Functions**
   - User data returns correctly
   - Can check if workout allowed today
   - Badge count accurate
## Local Testing with Hardhat

### Start Local Blockchain

```bash
cd contracts
npx hardhat node
```

### Deploy to Local

In a new terminal:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

### Simulate Streak

```bash
npx hardhat run scripts/simulate-streak.js --network localhost
```

## Frontend Testing

### Manual Testing Checklist

- [ ] Wallet connects properly
- [ ] Network switches to Sepolia
- [ ] Stats display correctly
- [ ] Workout logs on first attempt
- [ ] Can't log second workout same day
- [ ] Streak updates after 24 hours
- [ ] Badge displays after 7 days
- [ ] Transactions show in MetaMask
- [ ] Error messages display properly
### Browser Testing

Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

### Responsive Design

Check layouts at:
- Mobile: 375px
- Tablet: 768px
- Desktop: 1024px+

## Gas Usage Testing

Monitor gas costs for:
- Contract deployment: ~2M gas
- First workout log: ~150k gas
- Subsequent logs: ~50k gas
- Badge minting: ~200k gas

## Security Testing

- [ ] No reentrancy vulnerabilities
- [ ] Proper access controls
- [ ] Integer overflow protection
- [ ] Front-running resistance

## Performance Testing

- Page load < 3 seconds
- Transaction confirmation clear
- Smooth animations
- No memory leaks

## User Acceptance Testing

Share testnet link with 5-10 users:
1. Provide test ETH
2. Guide through onboarding
3. Collect feedback on UX
4. Note any bugs or confusion
5. Iterate based on feedback
