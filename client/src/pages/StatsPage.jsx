import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import Navigation from '../components/Navigation';
import { CONTRACT_ADDRESS } from '../wagmi.config';
import contractABI from '../abi/WorkoutTracker.json';

export default function StatsPage() {
  const { address } = useAccount();
  const [userData, setUserData] = useState(null);

  const { data: userDataRaw } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'getUserData',
    args: [address],
    enabled: !!address,
  });

  useEffect(() => {
    if (userDataRaw) {
      setUserData({
        lastWorkout: Number(userDataRaw[0]),
        currentStreak: Number(userDataRaw[1]),
        totalWorkouts: Number(userDataRaw[2]),
        longestStreak: Number(userDataRaw[3]),
        hasBadge: userDataRaw[4],
      });
    }
  }, [userDataRaw]);

  const stats = [
    { label: 'Total Workouts', value: userData?.totalWorkouts || 0, icon: '💪' },
    { label: 'Current Streak', value: userData?.currentStreak || 0, icon: '🔥' },
    { label: 'Longest Streak', value: userData?.longestStreak || 0, icon: '🏆' },
    { label: 'Badges Earned', value: userData?.hasBadge ? 1 : 0, icon: '🏅' },
  ];

  const formatDate = (timestamp) => {
    if (!timestamp || timestamp === 0) return 'No workouts yet';
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-gray-900 text-white justify-between overflow-x-hidden">
      <div className="flex-grow pb-32">
        <header className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700">
          <div className="flex items-center p-4 justify-between">
            <h1 className="text-white text-xl font-bold">Your Stats</h1>
          </div>
        </header>

        <main className="p-4 space-y-6">
          <section>
            <h2 className="text-lg font-semibold mb-4">Overview</h2>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-800 rounded-xl p-4 text-center border border-gray-700">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <p className="text-2xl font-bold text-blue-500">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">Activity Timeline</h2>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <p className="text-gray-400">Last Workout</p>
                  <p className="text-white">{formatDate(userData?.lastWorkout)}</p>
                </div>
                <div className="flex justify-between items-center py-2">
                  <p className="text-gray-400">Member Since</p>
                  <p className="text-white">December 2023</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">Progress Chart</h2>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
              <p className="text-gray-400">Coming Soon</p>
              <p className="text-sm text-gray-500 mt-2">Visual progress tracking will be available in the next update</p>
            </div>
          </section>
        </main>
      </div>

      <Navigation />
    </div>
  );
}
