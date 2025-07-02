import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { parseGwei } from 'viem';
import { useTransactionWithNotification } from '../hooks/useTransactionWithNotification';
import { useNotificationStore } from '../stores/notificationStore';

const LEADERBOARD_ADDRESS = '0x02C141d3DCc8A69aeb1a3390Bf76176726bc2a73';

const LEADERBOARD_ABI = [
  {
    "inputs": [{"name": "n", "type": "uint256"}],
    "name": "getTopUsers",
    "outputs": [{
      "components": [
        {"name": "user", "type": "address"},
        {"name": "totalWorkouts", "type": "uint256"},
        {"name": "longestStreak", "type": "uint256"},
        {"name": "lastUpdate", "type": "uint256"}
      ],
      "name": "",
      "type": "tuple[]"
    }],
    "type": "function",
    "stateMutability": "view"
  },
  {
    "inputs": [{"name": "user", "type": "address"}],
    "name": "getUserRank",
    "outputs": [
      {"name": "rank", "type": "uint256"},
      {"name": "totalWorkouts", "type": "uint256"}
    ],
    "type": "function",
    "stateMutability": "view"
  },
  {
    "inputs": [],
    "name": "updateLeaderboard",
    "outputs": [],
    "type": "function",
    "stateMutability": "nonpayable"
  },
  {
    "inputs": [],
    "name": "getLeaderboardSize",
    "outputs": [{"name": "", "type": "uint256"}],
    "type": "function",
    "stateMutability": "view"
  }
];

export default function LeaderboardSection() {
  const { address } = useAccount();
  const { executeTransaction, isLoading, isSuccess } = useTransactionWithNotification();
  const { addNotification } = useNotificationStore();

  // Get top 10 users
  const { data: topUsers, refetch: refetchLeaderboard } = useReadContract({
    address: LEADERBOARD_ADDRESS,
    abi: LEADERBOARD_ABI,
    functionName: 'getTopUsers',
    args: [10n],
  });

  // Get user's rank
  const { data: userRank, refetch: refetchUserRank } = useReadContract({
    address: LEADERBOARD_ADDRESS,
    abi: LEADERBOARD_ABI,
    functionName: 'getUserRank',
    args: [address],
    enabled: !!address,
  });

  // Get leaderboard size
  const { data: leaderboardSize } = useReadContract({
    address: LEADERBOARD_ADDRESS,
    abi: LEADERBOARD_ABI,
    functionName: 'getLeaderboardSize',
  });

  const updateMyPosition = async () => {
    await executeTransaction(
      {
        address: LEADERBOARD_ADDRESS,
        abi: LEADERBOARD_ABI,
        functionName: 'updateLeaderboard',
        gas: 100000n,
        gasPrice: parseGwei('0.1'),
      },
      {
        title: 'Updating Leaderboard',
        message: 'Updating your position on the global leaderboard...',
      }
    );
  };

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      refetchLeaderboard();
      refetchUserRank();
      
      const newRank = userRank?.[0];
      if (newRank && newRank > 0) {
        addNotification({
          status: 'success',
          title: '🏆 Leaderboard Updated!',
          message: `You are now ranked #${newRank.toString()} globally!`,
          duration: 5000,
          action: {
            label: 'Share',
            onClick: () => {
              const text = `I'm ranked #${newRank} on FitChain! 💪`;
              window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
            }
          }
        });
      }
    }
  }, [isSuccess, userRank, refetchLeaderboard, refetchUserRank, addNotification]);

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getMedalEmoji = (position) => {
    switch(position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏅';
    }
  };

  return (
    <section className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-800/50">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="text-3xl">🏆</span>
        Global Leaderboard
      </h3>

      {userRank && userRank[0] > 0 && (
        <div className="bg-purple-800/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-300 mb-1">Your Position</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold">
              #{userRank[0].toString()} {getMedalEmoji(Number(userRank[0]))}
            </p>
            <p className="text-gray-400">
              {userRank[1].toString()} workouts
            </p>
          </div>
        </div>
      )}

      <div className="space-y-3 mb-6">
        {topUsers && topUsers.length > 0 ? (
          topUsers.map((entry, index) => (
            <div
              key={entry.user}
              className={`flex items-center justify-between p-3 rounded-lg ${
                entry.user.toLowerCase() === address?.toLowerCase()
                  ? 'bg-purple-800/50 border border-purple-600'
                  : 'bg-gray-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-400">
                  {getMedalEmoji(index + 1)}
                </span>
                <div>
                  <p className="font-mono text-sm">
                    {formatAddress(entry.user)}
                    {entry.user.toLowerCase() === address?.toLowerCase() && (
                      <span className="ml-2 text-xs text-purple-400">(You)</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">
                    Longest streak: {entry.longestStreak.toString()} days
                  </p>
                </div>
              </div>
              <p className="text-lg font-bold">
                {entry.totalWorkouts.toString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 py-8">
            No users on leaderboard yet. Be the first!
          </p>
        )}
      </div>

      <button
        onClick={updateMyPosition}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
      >
        {isLoading ? 'Updating...' : 'Update My Position'}
      </button>

      {leaderboardSize && (
        <p className="text-xs text-gray-400 mt-4 text-center">
          {leaderboardSize.toString()} users on leaderboard
        </p>
      )}
    </section>
  );
}