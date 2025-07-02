import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function SimpleLandingPage() {
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      navigate('/dashboard');
    }
  }, [isConnected, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
      <div className="text-center space-y-8 p-8">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          FitChain
        </h1>
        <p className="text-2xl text-gray-300">
          Track your fitness journey on the blockchain
        </p>
        <div className="flex justify-center">
          <ConnectButton />
        </div>
        <div className="mt-8 text-sm text-gray-400">
          <p>Connect your wallet to get started</p>
          <p>Make sure you're on Sepolia testnet</p>
        </div>
      </div>
    </div>
  );
}