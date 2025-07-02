import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useWorkoutTracker } from '../hooks/useWorkoutTracker';
import { useUserAvatar } from '../hooks/useUserAvatar';
import Navigation from '../components/Navigation';
import { Logo } from '../components/Logo';
import { GasPriceMonitor } from '../components/GasPriceMonitor';

export default function DashboardPageClean() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { userData, canLogWorkout, isLoading } = useWorkoutTracker();
  const { selectedAvatar } = useUserAvatar();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected && !isLoading) {
      navigate('/');
    }
  }, [isConnected, isLoading, navigate]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const displayData = userData || {
    currentStreak: 0,
    totalWorkouts: 0,
    longestStreak: 0,
    lastWorkout: null,
    hasSevenDayBadge: false,
    badges: [],
  };

  // Calculate time until streak expires
  const getTimeUntilStreakExpires = () => {
    if (!displayData.lastWorkout || displayData.currentStreak === 0) {
      return 'Start your streak today!';
    }
    
    const lastWorkoutDate = new Date(Number(displayData.lastWorkout) * 1000);
    const expiryTime = new Date(lastWorkoutDate);
    expiryTime.setDate(expiryTime.getDate() + 2);
    expiryTime.setHours(0, 0, 0, 0);
    
    const timeLeft = expiryTime - currentTime;
    
    if (timeLeft <= 0) {
      return 'Streak expired! Log a workout to start again';
    }
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m to maintain streak`;
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your fitness data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Clean Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo variant="full" />
            <GasPriceMonitor />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {/* Hero Section - Streak & Primary Action */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Streak Card */}
          <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl p-6 border border-orange-800/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-orange-400">Current Streak</h2>
              <span className="text-4xl">🔥</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">{displayData.currentStreak}</span>
                <span className="text-gray-400">days</span>
              </div>
              <p className="text-sm text-orange-300">{getTimeUntilStreakExpires()}</p>
              <div className="mt-4 pt-4 border-t border-orange-800/30">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Longest Streak</span>
                  <span className="text-white font-medium">{displayData.longestStreak} days</span>
                </div>
              </div>
            </div>
          </div>
          {/* Quick Actions Card */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/log-workout"
                className={`block w-full text-center px-6 py-4 rounded-lg font-semibold transition-all ${
                  canLogWorkout
                    ? 'gradient-fitchain text-white hover:opacity-90'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {canLogWorkout ? '💪 Log Today\'s Workout' : '✅ Already Logged Today'}
              </Link>
              
              <Link
                to="/profile"
                className="block w-full text-center px-6 py-3 rounded-lg font-medium bg-gray-700 hover:bg-gray-600 text-white transition-colors"
              >
                👤 View Profile
              </Link>
              
              <Link
                to="/community"
                className="block w-full text-center px-6 py-3 rounded-lg font-medium bg-gray-700 hover:bg-gray-600 text-white transition-colors"
              >
                🏆 Leaderboard
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold">{displayData.totalWorkouts}</div>
            <div className="text-sm text-gray-400">Total Workouts</div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-3xl mb-2">🏅</div>
            <div className="text-2xl font-bold">{displayData.badges?.length || 0}</div>
            <div className="text-sm text-gray-400">Badges Earned</div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-2xl font-bold">{displayData.totalWorkouts * 250}</div>
            <div className="text-sm text-gray-400">Calories Burned</div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-3xl mb-2">⏱️</div>
            <div className="text-2xl font-bold">{displayData.totalWorkouts * 30}</div>
            <div className="text-sm text-gray-400">Active Minutes</div>
          </div>
        </div>
        {/* Achievement Progress */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold mb-4">Next Achievements</h2>
          <div className="space-y-4">
            {!displayData.hasSevenDayBadge && (
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <p className="font-medium">7-Day Warrior</p>
                    <p className="text-sm text-gray-400">Log workouts for 7 consecutive days</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{displayData.currentStreak}/7</p>
                  <div className="w-20 h-2 bg-gray-600 rounded-full mt-1">
                    <div 
                      className="h-full bg-orange-500 rounded-full transition-all"
                      style={{ width: `${(displayData.currentStreak / 7) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💯</span>
                <div>
                  <p className="font-medium">Century Club</p>
                  <p className="text-sm text-gray-400">Complete 100 total workouts</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{displayData.totalWorkouts}/100</p>
                <div className="w-20 h-2 bg-gray-600 rounded-full mt-1">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${Math.min((displayData.totalWorkouts / 100) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings & Help */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            to="/troubleshooting"
            className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <span>🔧</span> Troubleshooting
            </h3>
            <p className="text-sm text-gray-400">
              Having issues? Check transaction status and network settings
            </p>
          </Link>
          
          <a
            href="https://sepoliafaucet.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <span>💰</span> Get Test ETH
            </h3>
            <p className="text-sm text-gray-400">
              Need Sepolia ETH? Get free test tokens from the faucet
            </p>
          </a>
        </div>
      </main>

      <Navigation />
    </div>
  );
}