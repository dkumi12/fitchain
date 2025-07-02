const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("🔍 Checking Sepolia Account Status...\n");
  console.log("Address:", deployer.address);
  
  // Get balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  const balanceInEth = hre.ethers.formatEther(balance);
  console.log("Balance:", balanceInEth, "ETH");
  console.log("Balance in Wei:", balance.toString());
  
  // Get current gas price
  const gasPrice = await hre.ethers.provider.getFeeData();
  console.log("\n⛽ Current Network Gas Prices:");
  console.log("Gas Price:", hre.ethers.formatUnits(gasPrice.gasPrice, "gwei"), "gwei");
  console.log("Max Fee:", hre.ethers.formatUnits(gasPrice.maxFeePerGas, "gwei"), "gwei");
  console.log("Priority Fee:", hre.ethers.formatUnits(gasPrice.maxPriorityFeePerGas, "gwei"), "gwei");
  
  // Estimate deployment costs
  console.log("\n💰 Estimated Deployment Costs:");
  const deployGasLimit = 500000n; // Typical contract deployment
  const lowGasPrice = hre.ethers.parseUnits("1", "gwei");
  const ultraLowGasPrice = hre.ethers.parseUnits("0.1", "gwei");
  
  const normalCost = (deployGasLimit * gasPrice.gasPrice) / (10n ** 18n);
  const lowCost = (deployGasLimit * lowGasPrice) / (10n ** 18n);
  const ultraLowCost = (deployGasLimit * ultraLowGasPrice) / (10n ** 18n);
  
  console.log("With current gas price:", hre.ethers.formatEther(normalCost * (10n ** 18n)), "ETH");
  console.log("With 1 gwei:", hre.ethers.formatEther(lowCost * (10n ** 18n)), "ETH");
  console.log("With 0.1 gwei:", hre.ethers.formatEther(ultraLowCost * (10n ** 18n)), "ETH");
  
  // Check if can afford deployment
  console.log("\n✅ Can Deploy?");
  console.log("With current gas:", balance > normalCost * (10n ** 18n) ? "Yes" : "No");
  console.log("With 1 gwei:", balance > lowCost * (10n ** 18n) ? "Yes" : "No");
  console.log("With 0.1 gwei:", balance > ultraLowCost * (10n ** 18n) ? "Yes" : "No");
  
  // Sepolia faucets
  console.log("\n🚰 Get more Sepolia ETH from:");
  console.log("1. https://sepoliafaucet.com");
  console.log("2. https://www.alchemy.com/faucets/ethereum-sepolia");
  console.log("3. https://sepolia-faucet.pk910.de");
  console.log("4. https://cloud.google.com/application/web3/faucet/ethereum/sepolia");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });