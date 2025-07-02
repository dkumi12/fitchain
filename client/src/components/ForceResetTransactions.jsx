import { useState } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { parseGwei } from 'viem';
import toast from 'react-hot-toast';

export function ForceResetTransactions() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [isResetting, setIsResetting] = useState(false);
  const [manualNonce, setManualNonce] = useState('');

  const forceReset = async () => {
    if (!walletClient || !address) return;

    setIsResetting(true);
    try {
      // Get the current confirmed nonce
      const currentNonce = await publicClient.getTransactionCount({ 
        address: address,
        blockTag: 'latest'
      });

      toast.info(`Your next nonce should be: ${currentNonce}`);

      // Send a self-transaction with very high gas to clear the queue
      const gasPrice = await publicClient.getGasPrice();
      const veryHighGasPrice = (gasPrice * 300n) / 100n; // 3x gas price

      const hash = await walletClient.sendTransaction({
        to: address,
        value: 0n,
        nonce: parseInt(manualNonce) || currentNonce,
        gasPrice: veryHighGasPrice,
        gasLimit: 21000n,
      });

      toast.success(`Reset transaction sent: ${hash.slice(0, 10)}...`);
      
      // Wait for confirmation
      const receipt = await publicClient.waitForTransactionReceipt({ 
        hash,
        timeout: 60_000 // 60 seconds timeout
      });

      if (receipt.status === 'success') {
        toast.success('Transaction queue cleared successfully!');
      }
    } catch (error) {
      console.error('Reset failed:', error);
      toast.error(`Failed: ${error.message}`);
    } finally {
      setIsResetting(false);
    }
  };

  const getNonceInfo = async () => {
    if (!address) return;

    try {
      const latest = await publicClient.getTransactionCount({ 
        address: address,
        blockTag: 'latest'
      });
      const pending = await publicClient.getTransactionCount({ 
        address: address,
        blockTag: 'pending'
      });

      toast.info(`Latest nonce: ${latest}, Pending nonce: ${pending}`);
      
      if (pending > latest) {
        toast.warning(`You have ${pending - latest} stuck transaction(s)`);
      }
    } catch (error) {
      toast.error('Failed to get nonce info');
    }
  };

  return (
    <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-semibold text-red-400">
        Force Reset Transactions
      </h3>
      
      <div className="space-y-3">
        <button
          onClick={getNonceInfo}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Check Transaction Status
        </button>

        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Manual nonce (optional)"
            value={manualNonce}
            onChange={(e) => setManualNonce(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
          />
          <button
            onClick={forceReset}
            disabled={isResetting}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {isResetting ? 'Resetting...' : 'Force Reset'}
          </button>
        </div>
      </div>

      <div className="text-xs text-gray-400 space-y-1">
        <p>⚠️ This sends a high-gas self-transaction to clear the queue</p>
        <p>💡 If this doesn't work, try MetaMask Settings → Advanced → Reset Account</p>
      </div>
    </div>
  );
}
