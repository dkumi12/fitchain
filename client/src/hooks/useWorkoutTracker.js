import { useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { useTransactionWithNotification } from './useTransactionWithNotification';
import { useNotificationStore } from '../stores/notificationStore';
import WorkoutTrackerABI from '../abi/WorkoutTracker.json';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export function useWorkoutTracker() {
  const { address, isConnected } = useAccount();
  const { executeTransaction, isLoading, isSuccess } = useTransactionWithNotification();
  const { addNotification } = useNotificationStore();

  // Debug logging
  useEffect(() => {
    console.log('useWorkoutTracker Debug:', {
      CONTRACT_ADDRESS,
      address,
      isConnected,
      hasABI: !!WorkoutTrackerABI?.abi
    });
  }, [address, isConnected]);

  // Read user data from contract
  const { data: userData, error: userDataError, refetch: refetchUserData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: WorkoutTrackerABI.abi,
    functionName: 'getUserData',
    args: [address],
    enabled: !!address && !!CONTRACT_ADDRESS,
  });

  // Check if user can log workout
  const { data: canLogWorkout, error: canLogError, refetch: refetchCanLog } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: WorkoutTrackerABI.abi,
    functionName: 'canLogWorkout',
    args: [address],
    enabled: !!address && !!CONTRACT_ADDRESS,
  });

  // Get user badges
  const { data: userBadges, error: badgesError, refetch: refetchBadges } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: WorkoutTrackerABI.abi,
    functionName: 'getUserBadges',
    args: [address],
    enabled: !!address && !!CONTRACT_ADDRESS,
  });

  // Log errors
  useEffect(() => {
    if (userDataError) console.error('Error reading user data:', userDataError);
    if (canLogError) console.error('Error checking canLogWorkout:', canLogError);
    if (badgesError) console.error('Error reading badges:', badgesError);
  }, [userDataError, canLogError, badgesError]);

  // Log workout function
  const logWorkout = async (workoutData) => {
    if (!canLogWorkout) {
      addNotification({
        status: 'error',
        title: 'Already Logged Today',
        message: 'You can only log one workout per day. Come back tomorrow!',
        duration: 5000,
      });
      return;
    }

    await executeTransaction(
      {
        address: CONTRACT_ADDRESS,
        abi: WorkoutTrackerABI.abi,
        functionName: 'logWorkout',
        args: [
          workoutData.workoutType || 'General',
          workoutData.duration || 30,
          workoutData.date || Date.now(),
          workoutData.distance || 0,
          workoutData.distanceUnit || 'km',
          workoutData.notes || ''
        ],
      },
      {
        title: 'Logging Workout',
        message: `Recording your ${workoutData.workoutType || 'workout'} session...`,
      }
    );
  };

  // Handle transaction success
  useEffect(() => {
    if (isSuccess) {
      // Refetch all data
      refetchUserData();
      refetchCanLog();
      refetchBadges();
      
      // Check for achievements
      if (userData) {
        const formattedData = formatUserData();
        
        // Check for new badges
        if (formattedData.currentStreak === 7 && !formattedData.hasSevenDayBadge) {
          addNotification({
            status: 'success',
            title: '🏆 Achievement Unlocked!',
            message: 'You earned the 7-Day Warrior badge!',
            duration: 8000,
            permanent: true,
            action: {
              label: 'View Badge',
              onClick: () => window.location.href = '/profile'
            }
          });
        }
        
        // Regular success notification
        addNotification({
          status: 'success',
          title: 'Workout Logged!',
          message: `Great job! That's ${formattedData.totalWorkouts + 1} workouts completed!`,
          duration: 5000,
        });
      }
    }
  }, [isSuccess, userData, refetchUserData, refetchCanLog, refetchBadges, addNotification]);

  // Format user data
  const formatUserData = () => {
    if (!userData) return null;
    
    return {
      lastWorkout: userData[0] ? new Date(Number(userData[0]) * 1000) : null,
      currentStreak: Number(userData[1]),
      totalWorkouts: Number(userData[2]),
      longestStreak: Number(userData[3]),
      hasSevenDayBadge: userData[4],
      badges: userData[5] || [],
    };
  };

  return {
    // State
    isConnected,
    address,
    isLoading,
    
    // Data
    userData: formatUserData(),
    canLogWorkout: canLogWorkout || false,
    userBadges: userBadges || [],
    
    // Functions
    logWorkout,
    refetchUserData,
    refetchCanLog,
    refetchBadges,
  };
}