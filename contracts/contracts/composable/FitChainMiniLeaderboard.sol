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
 * @title FitChainMiniLeaderboard
 * @dev Gas-optimized leaderboard for top 10 users only
 */
contract FitChainMiniLeaderboard {
    IWorkoutTracker public immutable fitchain;
    
    struct Entry {
        address user;
        uint128 workouts;
        uint128 timestamp;
    }
    
    Entry[10] public topTen;
    mapping(address => uint8) public userPosition; // 0 = not on board, 1-10 = position
    
    event LeaderboardUpdated(address indexed user, uint8 position);
    
    constructor(address _fitchainAddress) {
        fitchain = IWorkoutTracker(_fitchainAddress);
    }
    
    /**
     * @dev Update leaderboard - gas optimized
     */
    function updatePosition() external {
        (,, uint256 totalWorkouts,,,) = fitchain.getUserData(msg.sender);
        require(totalWorkouts > 0, "No workouts");
        
        uint128 workouts = uint128(totalWorkouts);
        uint8 currentPos = userPosition[msg.sender];
        
        // If already on board, update in place
        if (currentPos > 0) {
            topTen[currentPos - 1].workouts = workouts;
            topTen[currentPos - 1].timestamp = uint128(block.timestamp);
            _sortFromPosition(currentPos - 1);
            return;
        }
        
        // Find position for new entry
        uint8 insertPos = 10;
        for (uint8 i = 0; i < 10; i++) {
            if (topTen[i].user == address(0) || workouts > topTen[i].workouts) {
                insertPos = i;
                break;
            }
        }
        
        // If doesn't qualify, exit
        if (insertPos == 10) {
            revert("Not enough workouts");
        }
        
        // Shift entries down
        for (uint8 i = 9; i > insertPos; i--) {
            if (topTen[i-1].user != address(0)) {
                topTen[i] = topTen[i-1];
                if (topTen[i].user != address(0)) {
                    userPosition[topTen[i].user] = i + 1;
                }
            }
        }
        
        // Remove user kicked off board
        if (topTen[9].user != address(0) && topTen[9].user != msg.sender) {
            userPosition[topTen[9].user] = 0;
        }
        
        // Insert new entry
        topTen[insertPos] = Entry({
            user: msg.sender,
            workouts: workouts,
            timestamp: uint128(block.timestamp)
        });
        userPosition[msg.sender] = insertPos + 1;
        
        emit LeaderboardUpdated(msg.sender, insertPos + 1);
    }
    
    /**
     * @dev Sort from a specific position (bubble sort for small array)
     */
    function _sortFromPosition(uint8 startPos) private {
        for (uint8 i = startPos; i > 0; i--) {
            if (topTen[i].workouts > topTen[i-1].workouts) {
                // Swap
                Entry memory temp = topTen[i];
                topTen[i] = topTen[i-1];
                topTen[i-1] = temp;
                
                // Update positions
                userPosition[topTen[i].user] = i + 1;
                userPosition[topTen[i-1].user] = i;
            } else {
                break;
            }
        }
    }
    
    /**
     * @dev Get full leaderboard
     */
    function getLeaderboard() external view returns (Entry[10] memory) {
        return topTen;
    }
    
    /**
     * @dev Get user info
     */
    function getUserInfo(address user) external view returns (uint8 position, uint128 workouts) {
        uint8 pos = userPosition[user];
        if (pos > 0) {
            return (pos, topTen[pos-1].workouts);
        }
        return (0, 0);
    }
}