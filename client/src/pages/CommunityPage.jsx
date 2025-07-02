import Navigation from '../components/Navigation';

export default function CommunityPage() {
  const leaderboard = [
    { rank: 1, name: 'FitChamp', streak: 127, badges: 5, avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=100&h=100&fit=crop' },
    { rank: 2, name: 'HealthHero', streak: 89, badges: 4, avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&h=100&fit=crop' },
    { rank: 3, name: 'GymWarrior', streak: 76, badges: 3, avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=100&h=100&fit=crop' },
    { rank: 4, name: 'RunnerPro', streak: 65, badges: 3, avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=100&h=100&fit=crop' },
    { rank: 5, name: 'YogaMaster', streak: 54, badges: 2, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&fit=crop' },
  ];

  const challenges = [
    { id: 1, name: '30-Day Challenge', participants: 234, daysLeft: 12, type: 'streak' },
    { id: 2, name: 'Summer Body Goals', participants: 567, daysLeft: 45, type: 'special' },
    { id: 3, name: 'Marathon Training', participants: 123, daysLeft: 30, type: 'endurance' },
  ];

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-gray-900 text-white justify-between overflow-x-hidden">
      <div className="flex-grow pb-32">
        <header className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700">
          <div className="flex items-center p-4 justify-between">
            <h1 className="text-white text-xl font-bold">Community</h1>
          </div>
        </header>

        <main className="p-4 space-y-6">
          <section>
            <h2 className="text-lg font-semibold mb-4">Global Leaderboard</h2>
            <div className="space-y-3">
              {leaderboard.map((user) => (
                <div key={user.rank} className="bg-gray-800 rounded-xl p-4 flex items-center gap-4 border border-gray-700 hover:bg-gray-700 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    user.rank === 1 ? 'bg-yellow-500 text-gray-900' :
                    user.rank === 2 ? 'bg-gray-400 text-gray-900' :
                    user.rank === 3 ? 'bg-orange-600 text-white' :
                    'bg-gray-700 text-gray-300'
                  }`}>
                    {user.rank}
                  </div>
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-12 h-12 rounded-full border-2 border-gray-600"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{user.name}</p>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span>🔥 {user.streak} days</span>
                      <span>🏅 {user.badges} badges</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">Active Challenges</h2>
            <div className="space-y-3">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{challenge.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      challenge.type === 'streak' ? 'bg-blue-500/20 text-blue-400' :
                      challenge.type === 'special' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {challenge.type}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>👥 {challenge.participants} participants</span>
                    <span>⏱️ {challenge.daysLeft} days left</span>
                  </div>
                  <button className="mt-3 w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-semibold transition-colors">
                    Join Challenge
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">Community Stats</h2>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-2xl font-bold text-blue-500">1,234</p>
                  <p className="text-sm text-gray-400">Active Users</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-500">45,678</p>
                  <p className="text-sm text-gray-400">Total Workouts</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-500">789</p>
                  <p className="text-sm text-gray-400">Badges Earned</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <Navigation />
    </div>
  );
}
