const hre = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS || "YOUR_CONTRACT_ADDRESS";
  
  console.log("🔍 Interacting with WorkoutTracker at:", contractAddress);
  
  const WorkoutTracker = await hre.ethers.getContractAt("WorkoutTracker", contractAddress);
  const [signer] = await hre.ethers.getSigners();
  
  console.log("👤 Using account:", signer.address);
  
  // Check user data
  console.log("\n📊 Fetching user data...");
  const userData = await WorkoutTracker.getUserData(signer.address);
  
  console.log("Last Workout:", userData[0].toString());
  console.log("Current Streak:", userData[1].toString());
  console.log("Total Workouts:", userData[2].toString());
  console.log("Longest Streak:", userData[3].toString());
  console.log("Has Badge:", userData[4]);
  console.log("Badge Count:", userData[5].length);
  
  // Check if can log workout
  const canLog = await WorkoutTracker.canLogWorkout(signer.address);
  console.log("\n✅ Can log workout:", canLog);
  
  if (canLog) {
    console.log("\n💪 Logging workout...");
    const tx = await WorkoutTracker.logWorkout();
    await tx.wait();
    console.log("✅ Workout logged successfully!");
    
    // Check updated data
    const newData = await WorkoutTracker.getUserData(signer.address);
    console.log("New streak:", newData[1].toString());
  } else {
    console.log("\n⏰ Already logged workout today. Come back tomorrow!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
