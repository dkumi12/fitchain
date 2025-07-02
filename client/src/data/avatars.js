// Fitness Avatar System
export const fitnessAvatars = {
  // Default avatars (always available)
  default: [
    {
      id: 'runner-basic',
      name: 'Runner',
      emoji: '🏃',
      category: 'default',
      description: 'Just getting started',
      colors: ['#3B82F6', '#60A5FA'], // Blue gradient
    },
    {
      id: 'walker-basic',
      name: 'Walker',
      emoji: '🚶',
      category: 'default',
      description: 'Slow and steady',
      colors: ['#10B981', '#34D399'], // Green gradient
    },
    {
      id: 'cyclist-basic',
      name: 'Cyclist',
      emoji: '🚴',
      category: 'default',
      description: 'Ready to ride',
      colors: ['#F59E0B', '#FCD34D'], // Yellow gradient
    },
    {
      id: 'yogi-basic',
      name: 'Yogi',
      emoji: '🧘',
      category: 'default',
      description: 'Finding balance',
      colors: ['#8B5CF6', '#A78BFA'], // Purple gradient
    },
    {
      id: 'lifter-basic',
      name: 'Lifter',
      emoji: '💪',
      category: 'default',
      description: 'Building strength',
      colors: ['#EF4444', '#F87171'], // Red gradient
    },
  ],

  // Unlockable avatars (earned through achievements)
  unlockable: [
    {
      id: 'fire-runner',
      name: 'Fire Runner',
      emoji: '🔥',
      category: 'streak',
      description: 'Unlocked with 7-day streak',
      requirement: { type: 'streak', value: 7 },
      colors: ['#DC2626', '#F97316'], // Fire gradient
      special: true,
    },
    {
      id: 'warrior',
      name: 'Warrior',
      emoji: '⚔️',
      category: 'streak',
      description: 'Unlocked with 14-day streak',
      requirement: { type: 'streak', value: 14 },
      colors: ['#7C3AED', '#2563EB'], // Epic gradient
      special: true,
    },
    {
      id: 'champion',
      name: 'Champion',
      emoji: '👑',
      category: 'streak',
      description: 'Unlocked with 30-day streak',
      requirement: { type: 'streak', value: 30 },
      colors: ['#FBBF24', '#F59E0B'], // Gold gradient
      special: true,
    },
    {
      id: 'lightning',
      name: 'Lightning',
      emoji: '⚡',
      category: 'workouts',
      description: 'Complete 50 workouts',
      requirement: { type: 'totalWorkouts', value: 50 },
      colors: ['#3B82F6', '#06B6D4'], // Electric gradient
      special: true,
    },
    {
      id: 'mountain',
      name: 'Mountain',
      emoji: '🏔️',
      category: 'workouts',
      description: 'Complete 100 workouts',
      requirement: { type: 'totalWorkouts', value: 100 },
      colors: ['#6B7280', '#374151'], // Mountain gradient
      special: true,
    },
    {
      id: 'star',
      name: 'Star',
      emoji: '⭐',
      category: 'badge',
      description: 'Earn your first badge',
      requirement: { type: 'badge', value: true },
      colors: ['#FCD34D', '#FDE68A'], // Star gradient
      special: true,
    },
    {
      id: 'ninja',
      name: 'Ninja',
      emoji: '🥷',
      category: 'special',
      description: 'Secret achievement',
      requirement: { type: 'special', value: 'nightOwl' }, // Log 5 workouts between 10pm-5am
      colors: ['#1F2937', '#000000'], // Dark gradient
      special: true,
    },
    {
      id: 'sunrise',
      name: 'Early Bird',
      emoji: '🌅',
      category: 'special',
      description: 'Morning person',
      requirement: { type: 'special', value: 'earlyBird' }, // Log 5 workouts between 5am-7am
      colors: ['#F59E0B', '#EC4899'], // Sunrise gradient
      special: true,
    },
    {
      id: 'robot',
      name: 'Consistent Bot',
      emoji: '🤖',
      category: 'special',
      description: 'Perfect consistency',
      requirement: { type: 'special', value: 'consistent' }, // Log at same time 7 days in a row
      colors: ['#6366F1', '#8B5CF6'], // Tech gradient
      special: true,
    },
    {
      id: 'dragon',
      name: 'Dragon',
      emoji: '🐉',
      category: 'legendary',
      description: 'Legendary status',
      requirement: { type: 'totalWorkouts', value: 365 },
      colors: ['#DC2626', '#7C3AED'], // Dragon gradient
      special: true,
      legendary: true,
    },
  ],
};

// Avatar frames based on achievements
export const avatarFrames = {
  none: {
    id: 'none',
    name: 'No Frame',
    style: '',
  },
  bronze: {
    id: 'bronze',
    name: 'Bronze Frame',
    requirement: { type: 'totalWorkouts', value: 10 },
    style: 'ring-2 ring-orange-600',
  },
  silver: {
    id: 'silver',
    name: 'Silver Frame',
    requirement: { type: 'totalWorkouts', value: 25 },
    style: 'ring-2 ring-gray-400',
  },
  gold: {
    id: 'gold',
    name: 'Gold Frame',
    requirement: { type: 'totalWorkouts', value: 50 },
    style: 'ring-2 ring-yellow-400',
  },
  diamond: {
    id: 'diamond',
    name: 'Diamond Frame',
    requirement: { type: 'totalWorkouts', value: 100 },
    style: 'ring-2 ring-cyan-400',
  },
  rainbow: {
    id: 'rainbow',
    name: 'Rainbow Frame',
    requirement: { type: 'streak', value: 30 },
    style: 'ring-2 ring-offset-2 ring-offset-gray-900 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500',
  },
};

// Helper function to check if avatar is unlocked
export function isAvatarUnlocked(avatar, userData) {
  if (!avatar.requirement) return true; // Default avatars
  
  const { type, value } = avatar.requirement;
  
  switch (type) {
    case 'streak':
      return userData.currentStreak >= value || userData.longestStreak >= value;
    case 'totalWorkouts':
      return userData.totalWorkouts >= value;
    case 'badge':
      return userData.hasSevenDayBadge;
    case 'special':
      // These would need special tracking
      return userData.specialAchievements?.[value] || false;
    default:
      return false;
  }
}

// Get all available avatars for a user
export function getUserAvatars(userData) {
  const available = [...fitnessAvatars.default];
  const locked = [];
  
  fitnessAvatars.unlockable.forEach(avatar => {
    if (isAvatarUnlocked(avatar, userData)) {
      available.push(avatar);
    } else {
      locked.push(avatar);
    }
  });
  
  return { available, locked };
}

// Get user's frame
export function getUserFrame(userData) {
  let bestFrame = avatarFrames.none;
  
  Object.values(avatarFrames).forEach(frame => {
    if (frame.requirement) {
      const { type, value } = frame.requirement;
      let qualified = false;
      
      if (type === 'totalWorkouts' && userData.totalWorkouts >= value) {
        qualified = true;
      } else if (type === 'streak' && (userData.currentStreak >= value || userData.longestStreak >= value)) {
        qualified = true;
      }
      
      if (qualified && (!bestFrame.requirement || value > bestFrame.requirement.value)) {
        bestFrame = frame;
      }
    }
  });
  
  return bestFrame;
}