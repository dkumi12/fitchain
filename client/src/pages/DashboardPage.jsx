import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useWorkoutTracker } from '../hooks/useWorkoutTracker';
import { useUserAvatar } from '../hooks/useUserAvatar';
import Navigation from '../components/Navigation';
import RewardsSection from '../components/RewardsSection';
import LeaderboardSection from '../components/LeaderboardSection';
import SepoliaFaucetHelper from '../components/SepoliaFaucetHelper';
import AvatarDisplay from '../components/AvatarDisplay';
import AvatarSelector from '../components/AvatarSelector';
import TransactionTips from '../components/TransactionTips';
import { ClearStuckTransactions } from '../components/ClearStuckTransactions';
import { ForceResetTransactions } from '../components/ForceResetTransactions';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { userData, canLogWorkout, isLoading } = useWorkoutTracker();
  const { selectedAvatar, updateAvatar } = useUserAvatar();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [streakAnimation, setStreakAnimation] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('Dashboard Debug:', {
      isConnected,
      address,
      userData,
      canLogWorkout,
      isLoading
    });
  }, [isConnected, address, userData, canLogWorkout, isLoading]);
  
  // Use blockchain data with fallbacks
  const displayData = userData || {
    currentStreak: 0,
    totalWorkouts: 0,
    longestStreak: 0,
    lastWorkout: null,
    hasSevenDayBadge: false,
    badges: [],
  };
  
  // Calculate additional display data
  const level = Math.floor(displayData.totalWorkouts / 10) + 1;
  const xp = displayData.totalWorkouts * 10;
  const xpToNextLevel = level * 100;
  const calories = displayData.totalWorkouts * 250;
  const activeMinutes = displayData.totalWorkouts * 30;  
  // Calculate weekly workouts (mock for now)
  const weeklyWorkouts = [0, 0, 0, 0, 0, 0, 0];
  if (displayData.lastWorkout) {
    const today = new Date().getDay();
    weeklyWorkouts[today] = 1;
  }

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Trigger streak animation
  useEffect(() => {
    if (displayData.currentStreak > 0) {
      setStreakAnimation(true);
      const timer = setTimeout(() => setStreakAnimation(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [displayData.currentStreak]);

  // Calculate time until streak expires
  const getTimeUntilStreakExpires = () => {
    if (!displayData.lastWorkout) return 'No workouts yet';
    const expiryTime = new Date(displayData.lastWorkout.getTime() + 48 * 60 * 60 * 1000);
    const now = new Date();
    const hoursLeft = Math.floor((expiryTime - now) / (1000 * 60 * 60));
    
    if (hoursLeft <= 0) return 'Streak expired!';
    if (hoursLeft <= 24) return `${hoursLeft} hours left!`;
    return `${Math.floor(hoursLeft / 24)} days left`;
  };
  // Mock achievements
  const recentAchievements = displayData.hasSevenDayBadge ? [
    { id: 1, type: 'streak', value: 7, date: new Date() },
  ] : [];

  // Mock leaderboard position
  const leaderboardPosition = {
    rank: 42,
    totalUsers: 1234,
    percentile: Math.round((1 - 42/1234) * 100)
  };

  const badges = [
    {
      id: '7-day',
      name: '7-Day Warrior',
      description: '7 day streak',
      image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=200&h=200&fit=crop',
      earned: displayData.hasSevenDayBadge,
      earnedDate: displayData.hasSevenDayBadge ? new Date() : null
    },
    {
      id: '14-day',
      name: '14-Day Champion',
      description: '14 day streak',
      image: 'https://images.unsplash.com/photo-1540331547168-8b63109225b7?q=80&w=200&h=200&fit=crop',
      earned: displayData.currentStreak >= 14,
      earnedDate: null
    },
    {
      id: '30-day',
      name: '30-Day Legend',
      description: '30 day streak',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=200&h=200&fit=crop',
      earned: false,
      progress: displayData.currentStreak / 30
    },
  ];
  const quickStats = [
    { label: 'Active Days', value: displayData.totalWorkouts, icon: '📅', color: 'text-blue-400' },
    { label: 'Calories', value: calories.toLocaleString(), icon: '🔥', color: 'text-orange-400' },
    { label: 'Minutes', value: activeMinutes.toLocaleString(), icon: '⏱️', color: 'text-green-400' },
    { label: 'Badges', value: displayData.badges.length, icon: '🏅', color: 'text-purple-400' },
  ];

  // Show loading state
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please connect your wallet</h2>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-gray-900 text-white justify-between overflow-x-hidden">
      <div className="flex-grow pb-32">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700">
          <div className="flex items-center p-4 justify-between">
            <h1 className="text-white text-xl font-bold">FitChain Dashboard</h1>
          </div>
        </header>
        <main className="p-4 space-y-6">
          {/* Faucet Helper */}
          <SepoliaFaucetHelper />
          
          {/* Clear Stuck Transactions */}
          <ClearStuckTransactions />
          
          {/* Force Reset for stubborn transactions */}
          <ForceResetTransactions />
          
          {/* User Profile Section */}
          <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <AvatarDisplay
                    avatarId={selectedAvatar}
                    size="md"
                    userData={displayData}
                    showFrame={true}
                    onClick={() => setShowAvatarSelector(true)}
                    className="transition-transform hover:scale-105"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
                    {level}
                  </div>
                  <button
                    onClick={() => setShowAvatarSelector(true)}
                    className="absolute -top-1 -right-1 bg-gray-700 hover:bg-gray-600 rounded-full p-1 transition-colors"
                    title="Change Avatar"
                  >
                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
                <div>
                  <h2 className="text-xl font-bold">{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'User'}</h2>
                  <p className="text-gray-400 text-sm">FitChain Member</p>
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Level {level}</span>
                      <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                          style={{ width: `${(xp % 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">{xp}/{xpToNextLevel} XP</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Current Streak Hero */}
          <section className="bg-gradient-to-br from-orange-900/20 to-red-900/20 rounded-xl p-6 border border-orange-800/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Current Streak</h3>
                <div className="flex items-baseline gap-3">
                  <span className={`text-5xl font-bold text-orange-400 ${streakAnimation ? 'animate-pulse' : ''}`}>
                    {displayData.currentStreak}
                  </span>
                  <span className="text-gray-400">days</span>
                </div>
                <p className="text-sm text-orange-300 mt-2">
                  🔥 {getTimeUntilStreakExpires()}
                </p>
              </div>
              <div className="text-8xl animate-pulse">
                🔥
              </div>
            </div>
          </section>

          {/* Quick Stats */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-2xl ${stat.color}`}>{stat.icon}</span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </section>
          {/* Log Workout Button */}
          <section className="text-center">
            <Link 
              to="/log-workout"
              className={`inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-colors ${!canLogWorkout ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={(e) => {
                if (!canLogWorkout) {
                  e.preventDefault();
                  alert('You already logged a workout today!');
                }
              }}
            >
              Log Today's Workout
            </Link>
            {!canLogWorkout && (
              <p className="text-gray-400 text-sm mt-2">You've already logged a workout today</p>
            )}
          </section>

          {/* Recent Achievements */}
          {recentAchievements.length > 0 && (
            <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4">Recent Achievements 🎉</h3>
              <div className="space-y-3">
                {recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🏆</span>
                      <div>
                        <p className="font-semibold">{achievement.value}-Day Streak</p>
                        <p className="text-gray-400 text-sm">{achievement.date.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Transaction Tips */}
          <TransactionTips />

          {/* Composable Features Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RewardsSection />
            <LeaderboardSection />
          </div>
        </main>
      </div>
      <Navigation />
      
      {/* Avatar Selector Modal */}
      {showAvatarSelector && (
        <AvatarSelector
          currentAvatarId={selectedAvatar}
          userData={displayData}
          onSelect={(avatarId) => {
            updateAvatar(avatarId);
            setShowAvatarSelector(false);
          }}
          onClose={() => setShowAvatarSelector(false)}
        />
      )}
    </div>
  );
}