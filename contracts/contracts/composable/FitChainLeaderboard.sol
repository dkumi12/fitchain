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
 * @title FitChainLeaderboard
 * @dev Global leaderboard tracking top FitChain users
 */
contract FitChainLeaderboard {
    IWorkoutTracker public immutable fitchain;
    
    struct LeaderboardEntry {
        address user;
        uint256 totalWorkouts;
        uint256 longestStreak;
        uint256 lastUpdate;
    }
    
    LeaderboardEntry[] public leaderboard;
    mapping(address => uint256) public userPosition; // 0 means not on leaderboard
    
    uint256 public constant MAX_LEADERBOARD_SIZE = 100;
    uint256 public constant UPDATE_COOLDOWN = 1 hours;
    mapping(address => uint256) public lastUpdateTime;
    
    event LeaderboardUpdated(address indexed user, uint256 position, uint256 totalWorkouts);
    event NewLeader(address indexed user, uint256 totalWorkouts);
    
    constructor(address _fitchainAddress) {
        fitchain = IWorkoutTracker(_fitchainAddress);
    }
    
    /**
     * @dev Update user's position on leaderboard
     */
    function updateLeaderboard() external {
        require(
            block.timestamp >= lastUpdateTime[msg.sender] + UPDATE_COOLDOWN,
            "Update cooldown active"
        );
        
        (,, uint256 totalWorkouts, uint256 longestStreak,,) = fitchain.getUserData(msg.sender);
        require(totalWorkouts > 0, "No workouts logged");
        
        lastUpdateTime[msg.sender] = block.timestamp;
        
        // Check if user is already on leaderboard
        uint256 currentPos = userPosition[msg.sender];
        
        if (currentPos > 0) {
            // Update existing entry
            leaderboard[currentPos - 1].totalWorkouts = totalWorkouts;
            leaderboard[currentPos - 1].longestStreak = longestStreak;
            leaderboard[currentPos - 1].lastUpdate = block.timestamp;
        } else if (leaderboard.length < MAX_LEADERBOARD_SIZE) {
            // Add new entry
            leaderboard.push(LeaderboardEntry({
                user: msg.sender,
                totalWorkouts: totalWorkouts,
                longestStreak: longestStreak,
                lastUpdate: block.timestamp
            }));
            userPosition[msg.sender] = leaderboard.length;
        } else {
            // Check if user qualifies
            uint256 lowestWorkouts = leaderboard[leaderboard.length - 1].totalWorkouts;
            if (totalWorkouts > lowestWorkouts) {
                // Replace lowest entry
                address removedUser = leaderboard[leaderboard.length - 1].user;
                userPosition[removedUser] = 0;
                
                leaderboard[leaderboard.length - 1] = LeaderboardEntry({
                    user: msg.sender,
                    totalWorkouts: totalWorkouts,
                    longestStreak: longestStreak,
                    lastUpdate: block.timestamp
                });
                userPosition[msg.sender] = leaderboard.length;
            } else {
                revert("Not enough workouts to qualify");
            }
        }
        
        // Sort leaderboard (simple bubble sort for small array)
        _sortLeaderboard();
        
        // Update positions
        for (uint i = 0; i < leaderboard.length; i++) {
            userPosition[leaderboard[i].user] = i + 1;
            
            if (i == 0 && leaderboard[i].user == msg.sender) {
                emit NewLeader(msg.sender, totalWorkouts);
            }
        }
        
        emit LeaderboardUpdated(msg.sender, userPosition[msg.sender], totalWorkouts);
    }    
    /**
     * @dev Internal function to sort leaderboard
     */
    function _sortLeaderboard() private {
        uint n = leaderboard.length;
        for (uint i = 0; i < n - 1; i++) {
            for (uint j = 0; j < n - i - 1; j++) {
                if (leaderboard[j].totalWorkouts < leaderboard[j + 1].totalWorkouts) {
                    LeaderboardEntry memory temp = leaderboard[j];
                    leaderboard[j] = leaderboard[j + 1];
                    leaderboard[j + 1] = temp;
                }
            }
        }
    }
    
    /**
     * @dev Get top N users
     */
    function getTopUsers(uint256 n) external view returns (LeaderboardEntry[] memory) {
        uint256 count = n > leaderboard.length ? leaderboard.length : n;
        LeaderboardEntry[] memory topUsers = new LeaderboardEntry[](count);
        
        for (uint256 i = 0; i < count; i++) {
            topUsers[i] = leaderboard[i];
        }
        
        return topUsers;
    }
    
    /**
     * @dev Get user's rank
     */
    function getUserRank(address user) external view returns (uint256 rank, uint256 totalWorkouts) {
        uint256 pos = userPosition[user];
        if (pos == 0) return (0, 0);
        
        return (pos, leaderboard[pos - 1].totalWorkouts);
    }
    
    /**
     * @dev Get leaderboard size
     */
    function getLeaderboardSize() external view returns (uint256) {
        return leaderboard.length;
    }
}