import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { formatEther, parseGwei } from 'viem';
import { useTransactionWithNotification } from '../hooks/useTransactionWithNotification';
import { useNotificationStore } from '../stores/notificationStore';
import TransactionSpeedSelector from './TransactionSpeedSelector';

const REWARDS_ADDRESS = '0x08d24C60c37D363D8201C665CF575F77604462D0';

const REWARDS_ABI = [
  {
    "inputs": [{"name": "user", "type": "address"}],
    "name": "calculateRewards",
    "outputs": [{"name": "", "type": "uint256"}],
    "type": "function",
    "stateMutability": "view"
  },
  {
    "inputs": [],
    "name": "claimRewards",
    "outputs": [],
    "type": "function",
    "stateMutability": "nonpayable"
  },
  {
    "inputs": [],
    "name": "getContractStats",
    "outputs": [
      {"name": "balance", "type": "uint256"},
      {"name": "rewardPerWorkout", "type": "uint256"},
      {"name": "streakMultiplier", "type": "uint256"}
    ],
    "type": "function",
    "stateMutability": "view"
  },
  {
    "inputs": [{"name": "", "type": "address"}],
    "name": "totalRewardsClaimed",
    "outputs": [{"name": "", "type": "uint256"}],
    "type": "function",
    "stateMutability": "view"
  }
];

export default function RewardsSection() {
  const { address } = useAccount();
  const { executeTransaction, isLoading, isSuccess } = useTransactionWithNotification();
  const { addNotification } = useNotificationStore();
  const [gasConfig, setGasConfig] = useState({
    gasPrice: parseGwei('0.1'),
    gasLimit: 100000n
  });

  // Read claimable rewards
  const { data: claimableRewards, refetch: refetchRewards } = useReadContract({
    address: REWARDS_ADDRESS,
    abi: REWARDS_ABI,
    functionName: 'calculateRewards',
    args: [address],
    enabled: !!address,
  });

  // Read total claimed
  const { data: totalClaimed } = useReadContract({
    address: REWARDS_ADDRESS,
    abi: REWARDS_ABI,
    functionName: 'totalRewardsClaimed',
    args: [address],
    enabled: !!address,
  });

  // Read contract stats
  const { data: contractStats } = useReadContract({
    address: REWARDS_ADDRESS,
    abi: REWARDS_ABI,
    functionName: 'getContractStats',
  });

  const claimRewards = async () => {
    if (!claimableRewards || claimableRewards === 0n) {
      addNotification({
        status: 'error',
        title: 'No Rewards Available',
        message: 'You need to log more workouts to claim rewards.',
        duration: 4000,
      });
      return;
    }

    const rewardAmount = formatEther(claimableRewards);
    
    await executeTransaction(
      {
        address: REWARDS_ADDRESS,
        abi: REWARDS_ABI,
        functionName: 'claimRewards',
        gas: gasConfig.gasLimit,
        gasPrice: gasConfig.gasPrice,
      },
      {
        title: 'Claiming Rewards',
        message: `Claiming ${rewardAmount} ETH in rewards...`,
      }
    );
  };

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      refetchRewards();
      addNotification({
        status: 'success',
        title: '🎉 Rewards Claimed!',
        message: `Successfully claimed your workout rewards!`,
        duration: 5000,
        action: {
          label: 'View Stats',
          onClick: () => window.location.href = '/stats'
        }
      });
    }
  }, [isSuccess, refetchRewards, addNotification]);

  const formatReward = (value) => {
    if (!value) return '0';
    return formatEther(value);
  };

  return (
    <section className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-xl p-6 border border-green-800/50">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="text-3xl">💰</span>
        FitChain Rewards
      </h3>
      
      <TransactionSpeedSelector 
        onSpeedChange={setGasConfig}
        currentGasPrice="0.1"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Claimable Rewards</p>
          <p className="text-2xl font-bold text-green-400">
            {formatReward(claimableRewards)} ETH
          </p>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Total Claimed</p>
          <p className="text-2xl font-bold text-blue-400">
            {formatReward(totalClaimed)} ETH
          </p>
        </div>
      </div>

      {contractStats && (
        <div className="bg-gray-800/30 rounded-lg p-4 mb-6">
          <p className="text-gray-400 text-sm mb-2">Contract Info</p>
          <div className="text-xs space-y-1">
            <p>Pool Balance: {formatReward(contractStats[0])} ETH</p>
            <p>Reward per Workout: {formatReward(contractStats[1])} ETH</p>
            <p>Streak Bonus: {contractStats[2]?.toString()}x</p>
          </div>
        </div>
      )}

      <button
        onClick={claimRewards}
        disabled={isLoading || !claimableRewards || claimableRewards === 0n}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
      >
        {isLoading ? 'Processing...' : 'Claim Rewards'}
      </button>

      <p className="text-xs text-gray-400 mt-4 text-center">
        Earn 0.001 ETH per workout, 2x bonus for 7+ day streaks!
      </p>
    </section>
  );
}