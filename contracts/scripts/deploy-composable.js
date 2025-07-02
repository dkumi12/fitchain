const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting Composable Contracts deployment to Sepolia...");

  // FitChain contract address on Sepolia
  const FITCHAIN_ADDRESS = "0x259e2B7208F181D302447BF717d01d4d87D2cADA";

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Check account balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  // 1. Deploy FitChainRewards
  console.log("\n📝 Deploying FitChainRewards contract...");
  const FitChainRewards = await hre.ethers.getContractFactory("FitChainRewards");
  const rewards = await FitChainRewards.deploy(FITCHAIN_ADDRESS);
  await rewards.waitForDeployment();
  const rewardsAddress = await rewards.getAddress();
  console.log("✅ FitChainRewards deployed to:", rewardsAddress);

  // 2. Deploy FitChainLeaderboard
  console.log("\n📝 Deploying FitChainLeaderboard contract...");
  const FitChainLeaderboard = await hre.ethers.getContractFactory("FitChainLeaderboard");
  const leaderboard = await FitChainLeaderboard.deploy(FITCHAIN_ADDRESS);
  await leaderboard.waitForDeployment();
  const leaderboardAddress = await leaderboard.getAddress();
  console.log("✅ FitChainLeaderboard deployed to:", leaderboardAddress);

  // 3. Deploy FitChainMarketplace
  console.log("\n📝 Deploying FitChainMarketplace contract...");
  const FitChainMarketplace = await hre.ethers.getContractFactory("FitChainMarketplace");
  const marketplace = await FitChainMarketplace.deploy(FITCHAIN_ADDRESS);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("✅ FitChainMarketplace deployed to:", marketplaceAddress);
  // Fund the rewards contract with some ETH
  console.log("\n💰 Funding FitChainRewards contract...");
  const fundTx = await deployer.sendTransaction({
    to: rewardsAddress,
    value: hre.ethers.parseEther("0.01") // 0.01 ETH for testing
  });
  await fundTx.wait();
  console.log("✅ Funded rewards contract with 0.01 ETH");

  // Display deployment summary
  console.log("\n📋 Deployment Summary:");
  console.log("=".repeat(60));
  console.log("FitChain Core Contract:", FITCHAIN_ADDRESS);
  console.log("FitChainRewards:", rewardsAddress);
  console.log("FitChainLeaderboard:", leaderboardAddress);
  console.log("FitChainMarketplace:", marketplaceAddress);
  console.log("=".repeat(60));

  // Save addresses to file
  const fs = require("fs");
  const addresses = {
    fitchain: FITCHAIN_ADDRESS,
    rewards: rewardsAddress,
    leaderboard: leaderboardAddress,
    marketplace: marketplaceAddress,
    network: "sepolia",
    deployedAt: new Date().toISOString()
  };

  fs.writeFileSync(
    "./composable-addresses.json",
    JSON.stringify(addresses, null, 2)
  );
  console.log("\n💾 Addresses saved to composable-addresses.json");
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });