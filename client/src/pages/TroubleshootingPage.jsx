import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { ClearStuckTransactions } from '../components/ClearStuckTransactions';
import { ForceResetTransactions } from '../components/ForceResetTransactions';
import { GasPriceMonitor } from '../components/GasPriceMonitor';
import SepoliaFaucetHelper from '../components/SepoliaFaucetHelper';

export default function TroubleshootingPage() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('transactions');

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-gray-400 hover:text-white">
              ← Back
            </Link>
            <h1 className="text-xl font-semibold">Troubleshooting</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'transactions'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Stuck Transactions
          </button>
          <button
            onClick={() => setActiveTab('network')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'network'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Network Issues
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'help'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Help Guide
          </button>
        </div>
        {/* Content based on active tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <GasPriceMonitor />
            <ClearStuckTransactions />
            <ForceResetTransactions />
            
            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
              <h3 className="font-semibold text-blue-400 mb-2">Quick Fix: MetaMask Reset</h3>
              <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                <li>Open MetaMask</li>
                <li>Click Settings → Advanced</li>
                <li>Click "Clear activity tab data"</li>
                <li>Click "Reset Account"</li>
                <li>Refresh this page</li>
              </ol>
            </div>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="space-y-6">
            <SepoliaFaucetHelper />
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="font-semibold mb-4">Network Configuration</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Network</span>
                  <span className="font-mono">Sepolia Testnet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Chain ID</span>
                  <span className="font-mono">11155111</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">RPC URL</span>
                  <span className="font-mono text-xs">https://sepolia.infura.io/v3/</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Your Address</span>
                  <span className="font-mono text-xs">{address?.slice(0, 10)}...</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-400 mb-2">Common Network Issues</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• <strong>Wrong Network:</strong> Make sure MetaMask is on Sepolia</li>
                <li>• <strong>No ETH:</strong> Get free test ETH from the faucet above</li>
                <li>• <strong>Slow Transactions:</strong> Increase gas to 100+ gwei</li>
                <li>• <strong>Connection Failed:</strong> Try refreshing or switching RPC</li>
              </ul>
            </div>
          </div>
        )}
        {activeTab === 'help' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="font-semibold mb-4">How FitChain Works</h3>
              <div className="space-y-4 text-sm text-gray-300">
                <div>
                  <h4 className="font-medium text-white mb-1">1. Log Daily Workouts</h4>
                  <p>Record your fitness activities on the blockchain. You can log one workout per day.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">2. Build Streaks</h4>
                  <p>Log workouts on consecutive days to build your streak. Miss a day and it resets!</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">3. Earn Badges</h4>
                  <p>Reach milestones like 7-day streaks to unlock NFT achievement badges.</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="font-semibold mb-4">Transaction Tips</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>✅ Always use at least 50 gwei gas on Sepolia</li>
                <li>✅ Wait for confirmations before new transactions</li>
                <li>✅ Keep some extra ETH for gas fees</li>
                <li>❌ Don't send multiple transactions at once</li>
                <li>❌ Don't use extremely low gas prices</li>
              </ul>
            </div>

            <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
              <h3 className="font-semibold text-green-400 mb-2">Need More Help?</h3>
              <p className="text-sm text-gray-300 mb-3">
                Join our community or check the documentation for more detailed guides.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://github.com/yourusername/fitchain"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                >
                  GitHub Docs
                </a>
                <Link
                  to="/community"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Community
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Navigation />
    </div>
  );
}