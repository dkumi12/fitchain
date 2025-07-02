import { useAccount } from 'wagmi';
import { useWorkoutTracker } from '../hooks/useWorkoutTracker';
import Navigation from '../components/Navigation';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { userData, canLogWorkout, isLoading } = useWorkoutTracker();

  // Show connection required message
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please connect your wallet</h2>
          <Link 
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading your data...</p>
        </div>
      </div>
    );
  }

  const displayData = userData || {
    currentStreak: 0,
    totalWorkouts: 0,
    longestStreak: 0,
    lastWorkout: null,
    hasSevenDayBadge: false,
    badges: [],
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto p-4 pb-24">
        <h1 className="text-3xl font-bold mb-8">FitChain Dashboard</h1>
        
        {/* User Info */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Welcome</h2>
          <p className="text-gray-400">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
        </div>

        {/* Stats */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400">Current Streak</p>
              <p className="text-3xl font-bold text-orange-400">{displayData.currentStreak} days</p>
            </div>
            <div>
              <p className="text-gray-400">Total Workouts</p>
              <p className="text-3xl font-bold text-blue-400">{displayData.totalWorkouts}</p>
            </div>
            <div>
              <p className="text-gray-400">Longest Streak</p>
              <p className="text-3xl font-bold text-green-400">{displayData.longestStreak} days</p>
            </div>
            <div>
              <p className="text-gray-400">7-Day Badge</p>
              <p className="text-3xl font-bold text-purple-400">{displayData.hasSevenDayBadge ? '✅' : '❌'}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="text-center">
          <Link 
            to="/log-workout"
            className={`inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-colors ${!canLogWorkout ? 'opacity-50' : ''}`}
          >
            {canLogWorkout ? 'Log Today\'s Workout' : 'Already Logged Today'}
          </Link>
        </div>

        {/* Debug Info */}
        <div className="mt-8 bg-gray-800 rounded-lg p-4 text-xs">
          <h3 className="font-semibold mb-2">Debug Info:</h3>
          <pre className="text-gray-400">
            {JSON.stringify({ 
              contract: import.meta.env.VITE_CONTRACT_ADDRESS,
              address,
              userData: displayData,
              canLogWorkout 
            }, null, 2)}
          </pre>
        </div>
      </div>

      <Navigation />
    </div>
  );
}