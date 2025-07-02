const hre = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
  console.log("🏃 Simulating 7-day workout streak...\n");
  
  // Deploy new contract for testing
  const WorkoutTracker = await hre.ethers.getContractFactory("WorkoutTracker");
  const tracker = await WorkoutTracker.deploy();
  await tracker.waitForDeployment();
  
  const contractAddress = await tracker.getAddress();
  console.log("✅ Deployed test contract at:", contractAddress);
  
  const [signer] = await hre.ethers.getSigners();
  
  // Simulate 7 days of workouts
  for (let day = 1; day <= 7; day++) {
    console.log(`\n📅 Day ${day}:`);
    
    // Log workout
    console.log("  Logging workout...");
    const tx = await tracker.logWorkout();
    await tx.wait();
    
    // Check streak
    const userData = await tracker.getUserData(signer.address);
    console.log(`  Current streak: ${userData[1]}`);
    console.log(`  Has badge: ${userData[4]}`);
    
    // Skip to next day (except on last day)
    if (day < 7) {
      await time.increase(86400); // 24 hours
      console.log("  ⏰ Advanced 24 hours");
    }
  }
  
  console.log("\n🎉 Simulation complete!");
  console.log("✅ 7-day badge should be earned!");
  
  // Final check
  const finalData = await tracker.getUserData(signer.address);
  console.log("\n📊 Final Stats:");
  console.log("  Total workouts:", finalData[2].toString());
  console.log("  Current streak:", finalData[1].toString());
  console.log("  Has 7-day badge:", finalData[4]);
  console.log("  Total badges:", finalData[5].length);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
