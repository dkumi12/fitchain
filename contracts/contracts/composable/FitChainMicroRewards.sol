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
}

/**
 * @title FitChainMicroRewards
 * @dev Optimized for minimal gas costs with micro rewards
 */
contract FitChainMicroRewards {
    IWorkoutTracker public immutable fitchain;
    
    // Packed struct to save gas
    struct UserRewards {
        uint128 lastClaimedWorkout;
        uint128 totalClaimed;
    }
    
    mapping(address => UserRewards) public userRewards;
    
    // Micro rewards in wei (much smaller to reduce gas)
    uint256 public constant REWARD_PER_WORKOUT = 0.0001 ether; // 0.0001 ETH
    uint256 public constant STREAK_BONUS = 150; // 1.5x for streaks (150%)
    
    event MicroRewardClaimed(address indexed user, uint256 amount);
    
    constructor(address _fitchainAddress) {
        fitchain = IWorkoutTracker(_fitchainAddress);
    }
    
    /**
     * @dev Calculate rewards (view function - no gas)
     */
    function calculateRewards(address user) public view returns (uint256) {
        (,uint256 streak, uint256 totalWorkouts,,,) = fitchain.getUserData(user);
        
        uint256 claimableWorkouts = totalWorkouts - userRewards[user].lastClaimedWorkout;
        if (claimableWorkouts == 0) return 0;
        
        uint256 reward = claimableWorkouts * REWARD_PER_WORKOUT;
        
        // Small bonus for streaks
        if (streak >= 7) {
            reward = (reward * STREAK_BONUS) / 100;
        }
        
        return reward;
    }
    
    /**
     * @dev Claim micro rewards - optimized for gas
     */
    function claimRewards() external {
        uint256 reward = calculateRewards(msg.sender);
        require(reward > 0, "No rewards");
        require(address(this).balance >= reward, "Pool empty");
        
        (,, uint256 totalWorkouts,,,) = fitchain.getUserData(msg.sender);
        
        // Update state efficiently
        userRewards[msg.sender] = UserRewards({
            lastClaimedWorkout: uint128(totalWorkouts),
            totalClaimed: userRewards[msg.sender].totalClaimed + uint128(reward)
        });
        
        // Transfer
        (bool success, ) = msg.sender.call{value: reward}("");
        require(success, "Transfer failed");
        
        emit MicroRewardClaimed(msg.sender, reward);
    }
    
    /**
     * @dev Get user stats
     */
    function getUserStats(address user) external view returns (
        uint256 claimable,
        uint256 totalClaimed,
        uint256 poolBalance
    ) {
        return (
            calculateRewards(user),
            userRewards[user].totalClaimed,
            address(this).balance
        );
    }
    
    // Accept donations
    receive() external payable {}
}