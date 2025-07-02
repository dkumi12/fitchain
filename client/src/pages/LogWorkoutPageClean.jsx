import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWorkoutTracker } from '../hooks/useWorkoutTracker';
import Navigation from '../components/Navigation';
import { Logo } from '../components/Logo';
import toast from 'react-hot-toast';

export default function LogWorkoutPageClean() {
  const navigate = useNavigate();
  const { logWorkout, canLogWorkout, isLoading, userData } = useWorkoutTracker();
  const [selectedType, setSelectedType] = useState('');
  const [duration, setDuration] = useState(30);

  const workoutTypes = [
    { id: 'running', label: 'Running', icon: '🏃', color: 'from-blue-500 to-blue-600' },
    { id: 'cycling', label: 'Cycling', icon: '🚴', color: 'from-green-500 to-green-600' },
    { id: 'gym', label: 'Gym', icon: '🏋️', color: 'from-purple-500 to-purple-600' },
    { id: 'swimming', label: 'Swimming', icon: '🏊', color: 'from-cyan-500 to-cyan-600' },
    { id: 'yoga', label: 'Yoga', icon: '🧘', color: 'from-pink-500 to-pink-600' },
    { id: 'other', label: 'Other', icon: '💪', color: 'from-gray-500 to-gray-600' },
  ];

  const handleLogWorkout = async () => {
    if (!selectedType) {
      toast.error('Please select a workout type');
      return;
    }

    if (!canLogWorkout) {
      toast.error('You already logged a workout today!');
      return;
    }

    const workoutData = {
      workoutType: selectedType,
      duration: duration,
      date: Date.now(),
    };

    await logWorkout(workoutData);
    
    // Navigate to dashboard after logging
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo variant="full" />
            <Link to="/dashboard" className="text-gray-400 hover:text-white">
              Cancel
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <h1 className="text-2xl font-bold mb-8 text-center">Log Your Workout</h1>

        {!canLogWorkout ? (
          <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6 text-center">
            <span className="text-4xl mb-4 block">⚠️</span>
            <h2 className="text-xl font-semibold text-yellow-400 mb-2">Already Logged Today!</h2>
            <p className="text-gray-300 mb-4">You can only log one workout per day. Come back tomorrow!</p>
            <Link
              to="/dashboard"
              className="inline-block px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <>
            {/* Workout Type Selection */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Select Workout Type</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {workoutTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedType === type.id
                        ? 'border-blue-500 bg-gray-800'
                        : 'border-gray-700 bg-gray-800/50 hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-3xl block mb-2">{type.icon}</span>
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
            {/* Duration Selection */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Duration (minutes)</h2>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="5"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full mb-4"
                />
                <div className="text-center">
                  <span className="text-3xl font-bold text-blue-400">{duration}</span>
                  <span className="text-gray-400 ml-2">minutes</span>
                </div>
              </div>
            </div>

            {/* Log Button */}
            <button
              onClick={handleLogWorkout}
              disabled={isLoading || !selectedType}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                isLoading || !selectedType
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'gradient-fitchain text-white hover:opacity-90'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                  Logging Workout...
                </span>
              ) : (
                'Log Workout 💪'
              )}
            </button>
          </>
        )}

        {/* Current Streak Info */}
        {userData && (
          <div className="mt-8 bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
            <p className="text-sm text-gray-400">Current Streak</p>
            <p className="text-2xl font-bold text-orange-400">{userData.currentStreak} days 🔥</p>
          </div>
        )}
      </main>

      <Navigation />
    </div>
  );
}