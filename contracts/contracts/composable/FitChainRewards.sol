// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IWorkoutTracker {
    function getUserData(address user) external view returns (
        uint256 lastWorkout,
        uint256 currentStreak,
        uint256 totalWorkouts,
        uint256 longestStreak,
        bool hasBadge,
        uint256[] memory badges
    );
    
    function getStreak(address user) external view returns (uint256);
}

/**
 * @title FitChainRewards
 * @dev Rewards users with tokens based on their fitness activity
 */
contract FitChainRewards {
    IWorkoutTracker public immutable fitchain;
    mapping(address => uint256) public lastClaimedWorkout;
    mapping(address => uint256) public totalRewardsClaimed;
    
    uint256 public constant REWARD_PER_WORKOUT = 0.001 ether; // 0.001 ETH per workout
    uint256 public constant STREAK_BONUS_MULTIPLIER = 2; // 2x rewards for 7+ day streaks
    
    event RewardsClaimed(address indexed user, uint256 amount, uint256 workouts);
    event DonationReceived(address indexed donor, uint256 amount);
    
    constructor(address _fitchainAddress) {
        fitchain = IWorkoutTracker(_fitchainAddress);
    }
    
    /**
     * @dev Calculate claimable rewards for a user
     */
    function calculateRewards(address user) public view returns (uint256) {
        (,uint256 currentStreak, uint256 totalWorkouts,,,) = fitchain.getUserData(user);
        
        uint256 claimableWorkouts = totalWorkouts - lastClaimedWorkout[user];
        if (claimableWorkouts == 0) return 0;
        
        uint256 baseReward = claimableWorkouts * REWARD_PER_WORKOUT;
        
        // Apply streak bonus
        if (currentStreak >= 7) {
            baseReward = baseReward * STREAK_BONUS_MULTIPLIER;
        }
        
        return baseReward;
    }
    
    /**
     * @dev Claim rewards based on workout count
     */
    function claimRewards() external {
        uint256 reward = calculateRewards(msg.sender);
        require(reward > 0, "No rewards to claim");
        require(address(this).balance >= reward, "Insufficient contract balance");
        
        (,, uint256 totalWorkouts,,,) = fitchain.getUserData(msg.sender);
        lastClaimedWorkout[msg.sender] = totalWorkouts;
        totalRewardsClaimed[msg.sender] += reward;
        
        (bool success, ) = msg.sender.call{value: reward}("");
        require(success, "Transfer failed");
        
        emit RewardsClaimed(msg.sender, reward, totalWorkouts);
    }
    
    /**
     * @dev Get contract statistics
     */
    function getContractStats() external view returns (
        uint256 balance,
        uint256 rewardPerWorkout,
        uint256 streakMultiplier
    ) {
        return (
            address(this).balance,
            REWARD_PER_WORKOUT,
            STREAK_BONUS_MULTIPLIER
        );
    }
    
    /**
     * @dev Accept donations to fund rewards
     */
    receive() external payable {
        emit DonationReceived(msg.sender, msg.value);
    }
}