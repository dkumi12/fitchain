import { useAccount, useChainId, useChains } from 'wagmi';
import { useWorkoutTracker } from '../hooks/useWorkoutTracker';

export default function DebugPage() {
  const { address, isConnected, isConnecting } = useAccount();
  const chainId = useChainId();
  const chains = useChains();
  const hookData = useWorkoutTracker();

  const currentChain = chains.find(chain => chain.id === chainId);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Debug Information</h1>
      
      <div className="space-y-6">
        <section className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Wallet Status</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify({
              isConnected,
              isConnecting,
              address,
              chain: currentChain?.name || 'Not connected',
              chainId: chainId,
            }, null, 2)}
          </pre>
        </section>

        <section className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Environment</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify({
              CONTRACT_ADDRESS: import.meta.env.VITE_CONTRACT_ADDRESS,
              NODE_ENV: import.meta.env.NODE_ENV,
            }, null, 2)}
          </pre>
        </section>

        <section className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Hook Data</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(hookData, null, 2)}
          </pre>
        </section>

        <section className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Make sure MetaMask is installed and unlocked</li>
            <li>Connect to Sepolia testnet (Chain ID: 11155111)</li>
            <li>Connect your wallet from the home page</li>
            <li>Ensure you have some Sepolia ETH for transactions</li>
          </ol>
        </section>
      </div>
    </div>
  );
}