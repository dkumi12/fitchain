const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("WorkoutTracker", function () {
  let workoutTracker;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    // Get signers
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy contract
    const WorkoutTracker = await ethers.getContractFactory("WorkoutTracker");
    workoutTracker = await WorkoutTracker.deploy();
    await workoutTracker.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await workoutTracker.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await workoutTracker.name()).to.equal("FitChain Achievement");
      expect(await workoutTracker.symbol()).to.equal("FITBADGE");
    });
  });

  describe("Workout Logging", function () {
    it("Should log first workout correctly", async function () {
      await expect(workoutTracker.connect(user1).logWorkout())
        .to.emit(workoutTracker, "WorkoutLogged")
        .withArgs(user1.address, await time.latest(), 1, 1);

      const userData = await workoutTracker.getUserData(user1.address);
      expect(userData.currentStreak).to.equal(1);
      expect(userData.totalWorkouts).to.equal(1);
    });

    it("Should not allow logging multiple workouts on same day", async function () {
      await workoutTracker.connect(user1).logWorkout();
      
      await expect(
        workoutTracker.connect(user1).logWorkout()
      ).to.be.revertedWith("Already logged workout today");
    });

    it("Should increment streak for consecutive days", async function () {
      // Day 1
      await workoutTracker.connect(user1).logWorkout();
      
      // Day 2
      await time.increase(86400); // 24 hours
      await workoutTracker.connect(user1).logWorkout();
      
      const userData = await workoutTracker.getUserData(user1.address);
      expect(userData.currentStreak).to.equal(2);
    });

    it("Should reset streak after missing days", async function () {
      // Build up a streak
      await workoutTracker.connect(user1).logWorkout();
      await time.increase(86400);
      await workoutTracker.connect(user1).logWorkout();
      await time.increase(86400);
      await workoutTracker.connect(user1).logWorkout();
      
      // Miss 2 days
      await time.increase(86400 * 3);
      
      await expect(workoutTracker.connect(user1).logWorkout())
        .to.emit(workoutTracker, "StreakReset")
        .withArgs(user1.address, 3);
      
      const userData = await workoutTracker.getUserData(user1.address);
      expect(userData.currentStreak).to.equal(1);
      expect(userData.totalWorkouts).to.equal(4);
    });
  });

  describe("Badge Minting", function () {
    it("Should mint badge after 7-day streak", async function () {
      // Log workouts for 7 consecutive days
      for (let i = 0; i < 7; i++) {
        await workoutTracker.connect(user1).logWorkout();
        if (i < 6) {
          await time.increase(86400);
        }
      }
      // Check badge was minted
      const userData = await workoutTracker.getUserData(user1.address);
      expect(userData.hasBadge).to.be.true;
      expect(userData.badges.length).to.equal(1);
      
      // Check NFT ownership
      const balance = await workoutTracker.balanceOf(user1.address);
      expect(balance).to.equal(1);
    });

    it("Should not mint badge twice for 7-day streak", async function () {
      // Get 7-day streak
      for (let i = 0; i < 7; i++) {
        await workoutTracker.connect(user1).logWorkout();
        if (i < 6) await time.increase(86400);
      }

      // Continue streak
      await time.increase(86400);
      await workoutTracker.connect(user1).logWorkout();

      const userData = await workoutTracker.getUserData(user1.address);
      expect(userData.badges.length).to.equal(1); // Still only 1 badge
    });
  });

  describe("View Functions", function () {
    it("Should correctly report if user can log workout", async function () {
      expect(await workoutTracker.canLogWorkout(user1.address)).to.be.true;
            await workoutTracker.connect(user1).logWorkout();
      expect(await workoutTracker.canLogWorkout(user1.address)).to.be.false;
      
      await time.increase(86400);
      expect(await workoutTracker.canLogWorkout(user1.address)).to.be.true;
    });

    it("Should track longest streak correctly", async function () {
      // Build 3-day streak
      for (let i = 0; i < 3; i++) {
        await workoutTracker.connect(user1).logWorkout();
        if (i < 2) await time.increase(86400);
      }

      // Break streak
      await time.increase(86400 * 3);
      await workoutTracker.connect(user1).logWorkout();

      // Build new 5-day streak
      for (let i = 0; i < 4; i++) {
        await time.increase(86400);
        await workoutTracker.connect(user1).logWorkout();
      }

      const userData = await workoutTracker.getUserData(user1.address);
      expect(userData.longestStreak).to.equal(5);
      expect(userData.currentStreak).to.equal(5);
    });
  });
});
