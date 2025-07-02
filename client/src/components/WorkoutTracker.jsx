import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { toast } from 'react-hot-toast';
import { CONTRACT_ADDRESS } from '../wagmi.config';
import contractABI from '../abi/WorkoutTracker.json';
import StatsDisplay from './StatsDisplay';
import BadgeDisplay from './BadgeDisplay';
import LogWorkoutButton from './LogWorkoutButton';

export default function WorkoutTracker() {
  const { address } = useAccount();
  const [userData, setUserData] = useState(null);
  const [canLog, setCanLog] = useState(false);

  // Read user data
  const { data: userDataRaw, refetch: refetchUserData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'getUserData',
    args: [address],
    enabled: !!address,
  });

  // Check if can log workout
  const { data: canLogWorkout, refetch: refetchCanLog } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'canLogWorkout',
    args: [address],
    enabled: !!address,
  });

  // Log workout transaction
  const { writeContract, data: hash } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Update state when data changes
  useEffect(() => {
    if (userDataRaw) {
      setUserData({
        lastWorkout: Number(userDataRaw[0]),
        currentStreak: Number(userDataRaw[1]),
        totalWorkouts: Number(userDataRaw[2]),
        longestStreak: Number(userDataRaw[3]),
        hasBadge: userDataRaw[4],
        badges: userDataRaw[5],
      });
    }
  }, [userDataRaw]);

  useEffect(() => {
    setCanLog(!!canLogWorkout);
  }, [canLogWorkout]);

  // Handle successful transaction
  useEffect(() => {
    if (isSuccess) {
      toast.success('Workout logged successfully! 💪');
      refetchUserData();
      refetchCanLog();
    }  }, [isSuccess, refetchUserData, refetchCanLog]);

  const handleLogWorkout = async () => {
    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: contractABI,
        functionName: 'logWorkout',
      });
    } catch (error) {
      toast.error('Failed to log workout: ' + error.message);
    }
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stats Section */}
        <div className="space-y-6">
          <StatsDisplay userData={userData} />
          <LogWorkoutButton 
            onLog={handleLogWorkout}
            canLog={canLog}
            isLoading={isConfirming}
          />          
          {/* Milestone notifications */}
          {userData.currentStreak === 6 && (
            <div className="card bg-yellow-50 border border-yellow-200">
              <p className="text-yellow-800 font-medium">
                🎯 One more workout to earn your 7-day streak badge!
              </p>
            </div>
          )}
          
          {userData.currentStreak >= 7 && !userData.hasBadge && (
            <div className="card bg-green-50 border border-green-200">
              <p className="text-green-800 font-medium">
                🎉 Congratulations! You've earned a 7-day streak badge!
              </p>
            </div>
          )}
        </div>

        {/* Badges Section */}
        <div>
          <BadgeDisplay userData={userData} />
        </div>
      </div>
    </div>
  );
}
