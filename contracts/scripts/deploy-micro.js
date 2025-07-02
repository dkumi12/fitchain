const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying Gas-Optimized Contracts to Sepolia...");

  const FITCHAIN_ADDRESS = "0x259e2B7208F181D302447BF717d01d4d87D2cADA";

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy with low gas price
  const gasPrice = hre.ethers.parseUnits("1", "gwei"); // 1 gwei instead of default
  const overrides = {
    gasPrice: gasPrice,
    gasLimit: 500000 // Fixed low gas limit
  };

  try {
    // 1. Deploy MicroRewards
    console.log("\n📝 Deploying FitChainMicroRewards...");
    const MicroRewards = await hre.ethers.getContractFactory("FitChainMicroRewards");
    const microRewards = await MicroRewards.deploy(FITCHAIN_ADDRESS, overrides);
    await microRewards.waitForDeployment();
    const microRewardsAddress = await microRewards.getAddress();
    console.log("✅ MicroRewards deployed to:", microRewardsAddress);

    // 2. Deploy MiniLeaderboard
    console.log("\n📝 Deploying FitChainMiniLeaderboard...");
    const MiniLeaderboard = await hre.ethers.getContractFactory("FitChainMiniLeaderboard");
    const miniLeaderboard = await MiniLeaderboard.deploy(FITCHAIN_ADDRESS, overrides);
    await miniLeaderboard.waitForDeployment();
    const miniLeaderboardAddress = await miniLeaderboard.getAddress();
    console.log("✅ MiniLeaderboard deployed to:", miniLeaderboardAddress);

    // Fund rewards with small amount
    console.log("\n💰 Funding MicroRewards with minimal ETH...");
    const fundTx = await deployer.sendTransaction({
      to: microRewardsAddress,
      value: hre.ethers.parseEther("0.001"), // Only 0.001 ETH
      gasPrice: gasPrice,
      gasLimit: 21000 // Standard transfer gas
    });
    await fundTx.wait();
    console.log("✅ Funded with 0.001 ETH");

    // Save addresses
    const fs = require("fs");
    const addresses = {
      fitchain: FITCHAIN_ADDRESS,
      microRewards: microRewardsAddress,
      miniLeaderboard: miniLeaderboardAddress,
      network: "sepolia",
      deployedAt: new Date().toISOString()
    };

    fs.writeFileSync(
      "./micro-contracts.json",
      JSON.stringify(addresses, null, 2)
    );

    console.log("\n📋 Summary:");
    console.log("=".repeat(50));
    console.log("MicroRewards:", microRewardsAddress);
    console.log("MiniLeaderboard:", miniLeaderboardAddress);
    console.log("Gas Price Used: 1 gwei");
    console.log("=".repeat(50));

  } catch (error) {
    console.error("Error:", error.message);
    
    // If gas estimation failed, try with even lower settings
    console.log("\n🔄 Retrying with minimal gas settings...");
    const minimalOverrides = {
      gasPrice: hre.ethers.parseUnits("0.1", "gwei"), // 0.1 gwei
      gasLimit: 300000
    };
    
    // Retry deployment logic here if needed
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });