// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


/**
 * @title WorkoutTracker
 * @dev A decentralized fitness tracker that rewards users with NFT badges
 * @notice Track workouts and earn achievement badges on-chain
 */
contract WorkoutTracker is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    uint256 public constant STREAK_REQUIREMENT = 7; // Days needed for badge
    uint256 public constant DAY_IN_SECONDS = 86400; // 24 hours

    // User workout data structure
    struct UserData {
        uint256 lastWorkoutTimestamp;
        uint256 currentStreak;
        uint256 totalWorkouts;
        uint256 longestStreak;
        bool hasSevenDayBadge;
        uint256[] badgeTokenIds;
    }

    // Mappings
    mapping(address => UserData) public userData;
    mapping(uint256 => uint256) public tokenToBadgeType; // tokenId => badgeType

    // Events
    event WorkoutLogged(
        address indexed user, 
        uint256 timestamp, 
        uint256 newStreak,
        uint256 totalWorkouts
    );
    
    event BadgeMinted(
        address indexed user, 
        uint256 tokenId, 
        uint256 badgeType,
        string badgeName
    );
    
    event StreakReset(
        address indexed user,
        uint256 previousStreak
    );

    // Constructor
    constructor() ERC721("FitChain Achievement", "FITBADGE") Ownable(msg.sender) {}

    /**
     * @dev Log a workout for the calling user
     * @notice Can only log one workout per day
     */
    function logWorkout(
        string memory _workoutType,
        uint256 _duration,
        uint256 _date,
        uint256 _distance,
        string memory _distanceUnit,
        string memory _notes
    ) external {
        UserData storage user = userData[msg.sender];
        uint256 currentTime = block.timestamp;
        
        // Check if user has already logged a workout today
        if (user.lastWorkoutTimestamp > 0) {
            uint256 timeSinceLastWorkout = currentTime - user.lastWorkoutTimestamp;
            uint256 daysSinceLastWorkout = timeSinceLastWorkout / DAY_IN_SECONDS;            
            if (daysSinceLastWorkout == 0) {
                revert("Already logged workout today");
            } else if (daysSinceLastWorkout == 1) {
                // Consecutive day - increment streak
                user.currentStreak++;
            } else {
                // Missed days - reset streak
                emit StreakReset(msg.sender, user.currentStreak);
                user.currentStreak = 1;
            }
        } else {
            // First workout ever
            user.currentStreak = 1;
        }
        
        // Update user data
        user.lastWorkoutTimestamp = currentTime;
        user.totalWorkouts++;
        
        // Update longest streak if necessary
        if (user.currentStreak > user.longestStreak) {
            user.longestStreak = user.currentStreak;
        }
        
        emit WorkoutLogged(
            msg.sender, 
            currentTime, 
            user.currentStreak, 
            user.totalWorkouts
        );
        
        // Check for 7-day streak achievement
        if (user.currentStreak >= STREAK_REQUIREMENT && !user.hasSevenDayBadge) {            _mintBadge(msg.sender, 1, "7-Day Warrior");
            user.hasSevenDayBadge = true;
        }
        
        // Additional badge milestones can be added here
        // Example: 30-day, 100 total workouts, etc.
    }

    /**
     * @dev Internal function to mint achievement badges
     */
    function _mintBadge(
        address to, 
        uint256 badgeType,
        string memory badgeName
    ) private {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _generateTokenURI(badgeType, badgeName));
        
        tokenToBadgeType[tokenId] = badgeType;
        userData[to].badgeTokenIds.push(tokenId);
        
        emit BadgeMinted(to, tokenId, badgeType, badgeName);
    }

    /**
     * @dev Generate token URI for badges (can be updated to use IPFS)
     */
    function _generateTokenURI(
        uint256 badgeType,        string memory badgeName
    ) private pure returns (string memory) {
        // For MVP, return a simple JSON metadata
        // In production, this would point to IPFS
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                "eyJuYW1lIjoi",
                badgeName,
                "IiwiZGVzY3JpcHRpb24iOiJGaXRDaGFpbiBBY2hpZXZlbWVudCBCYWRnZSIsImltYWdlIjoiIn0="
            )
        );
    }

    /**
     * @dev Get current streak for a user
     */
    function getStreak(address user) external view returns (uint256) {
        return userData[user].currentStreak;
    }

    /**
     * @dev Get complete user data
     */
    function getUserData(address user) external view returns (
        uint256 lastWorkout,
        uint256 currentStreak,
        uint256 totalWorkouts,
        uint256 longestStreak,
        bool hasBadge,
        uint256[] memory badges
    ) {        UserData memory data = userData[user];
        return (
            data.lastWorkoutTimestamp,
            data.currentStreak,
            data.totalWorkouts,
            data.longestStreak,
            data.hasSevenDayBadge,
            data.badgeTokenIds
        );
    }

    /**
     * @dev Check if user can log a workout (hasn't logged today)
     */
    function canLogWorkout(address user) external view returns (bool) {
        uint256 lastWorkout = userData[user].lastWorkoutTimestamp;
        if (lastWorkout == 0) return true;
        
        uint256 timeSince = block.timestamp - lastWorkout;
        return timeSince >= DAY_IN_SECONDS;
    }

    /**
     * @dev Get all badge token IDs for a user
     */
    function getUserBadges(address user) external view returns (uint256[] memory) {
        return userData[user].badgeTokenIds;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
