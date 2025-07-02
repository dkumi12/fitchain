export default function BadgeDisplay({ userData }) {
  const badges = [
    {
      id: 1,
      name: '7-Day Warrior',
      description: 'Complete a 7-day workout streak',
      emoji: '🏆',
      earned: userData.hasBadge,
      color: 'from-yellow-400 to-yellow-600'
    },
    // Future badges can be added here
    {
      id: 2,
      name: '30-Day Champion',
      description: 'Complete a 30-day workout streak',
      emoji: '👑',
      earned: false,
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: 3,
      name: 'Century Club',
      description: 'Log 100 total workouts',
      emoji: '💯',
      earned: false,
      color: 'from-blue-400 to-blue-600'
    }
  ];

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Achievement Badges</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              badge.earned 
                ? 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100' 
                : 'border-gray-200 bg-gray-50 opacity-50'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${badge.color} 
                              flex items-center justify-center text-3xl
                              ${badge.earned ? 'animate-pulse-slow' : ''}`}>
                {badge.emoji}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{badge.name}</h3>
                <p className="text-sm text-gray-600">{badge.description}</p>
                {badge.earned && (
                  <p className="text-xs text-green-600 font-medium mt-1">
                    ✓ Earned
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {userData.badges.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No badges earned yet. Keep working out to unlock achievements!</p>
        </div>
      )}
    </div>
  );
}