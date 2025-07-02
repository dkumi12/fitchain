const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting FitChain deployment to Sepolia...");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Check account balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy WorkoutTracker contract
  console.log("\n📝 Deploying WorkoutTracker contract...");
  const WorkoutTracker = await hre.ethers.getContractFactory("WorkoutTracker");
  const tracker = await WorkoutTracker.deploy();

  // Wait for deployment
  await tracker.waitForDeployment();
  const contractAddress = await tracker.getAddress();

  console.log("✅ WorkoutTracker deployed to:", contractAddress);

  // Wait for block confirmations
  console.log("\n⏳ Waiting for block confirmations...");
  const deploymentReceipt = await tracker.deploymentTransaction().wait(5);
  console.log("✅ Deployment confirmed at block:", deploymentReceipt.blockNumber);

  // Verify contract on Etherscan
  if (hre.network.name === "sepolia" && process.env.ETHERSCAN_API_KEY) {    console.log("\n🔍 Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Etherscan!");
    } catch (error) {
      console.log("❌ Verification failed:", error.message);
    }
  }

  // Display deployment summary
  console.log("\n📋 Deployment Summary:");
  console.log("=".repeat(50));
  console.log("Network:", hre.network.name);
  console.log("Contract Address:", contractAddress);
  console.log("Deployer Address:", deployer.address);
  console.log("=".repeat(50));

  // Save deployment info
  console.log("\n💡 Next steps:");
  console.log("1. Copy the contract address to your frontend .env file:");
  console.log(`   VITE_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("2. Copy the ABI from artifacts/contracts/WorkoutTracker.sol/WorkoutTracker.json");
  console.log("3. Fund the contract if needed for any operations");
}

// Execute deployment
main()
  .then(() => process.exit(0))  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
