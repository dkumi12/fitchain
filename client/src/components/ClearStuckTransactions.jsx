import { useState } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import toast from 'react-hot-toast';

export function ClearStuckTransactions() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [isClearing, setIsClearing] = useState(false);

  const clearStuckTransactions = async () => {
    if (!walletClient || !address) return;

    setIsClearing(true);
    try {
      // Get the current nonce (next transaction count)
      const currentNonce = await publicClient.getTransactionCount({ 
        address: address,
        blockTag: 'latest'
      });

      // Get pending nonce
      const pendingNonce = await publicClient.getTransactionCount({ 
        address: address,
        blockTag: 'pending'
      });

      console.log('Current nonce:', currentNonce, 'Pending nonce:', pendingNonce);

      if (pendingNonce > currentNonce) {
        // We have stuck transactions
        const stuckCount = pendingNonce - currentNonce;        toast.info(`Found ${stuckCount} stuck transaction(s). Clearing...`);

        // Get current gas price and increase it
        const gasPrice = await publicClient.getGasPrice();
        const increasedGasPrice = (gasPrice * 200n) / 100n; // 100% increase for faster processing

        // Clear each stuck transaction
        for (let i = 0; i < stuckCount; i++) {
          const nonceToReplace = currentNonce + i;
          
          try {
            // Send 0 ETH to self with higher gas to replace stuck tx
            const hash = await walletClient.sendTransaction({
              to: address,
              value: 0n,
              gasPrice: increasedGasPrice,
              nonce: nonceToReplace,
              gasLimit: 21000n,
            });

            toast.success(`Replaced stuck transaction #${nonceToReplace}`);
            console.log('Replacement tx:', hash);

            // Wait for confirmation
            await publicClient.waitForTransactionReceipt({ hash });
          } catch (error) {
            console.error(`Failed to replace nonce ${nonceToReplace}:`, error);
            toast.error(`Failed to clear transaction #${nonceToReplace}`);
          }
        }

        toast.success('All stuck transactions cleared!');
      } else {
        toast.info('No stuck transactions found');
      }    } catch (error) {
      console.error('Error clearing stuck transactions:', error);
      toast.error('Failed to clear stuck transactions');
    } finally {
      setIsClearing(false);
    }
  };

  if (!address) return null;

  return (
    <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-yellow-400 mb-2">
        Stuck Transactions?
      </h3>
      <p className="text-sm text-gray-300 mb-4">
        If your transactions are pending for too long, you can clear them by sending replacement transactions with higher gas fees.
      </p>
      <button
        onClick={clearStuckTransactions}
        disabled={isClearing}
        className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        {isClearing ? 'Clearing...' : 'Clear Stuck Transactions'}
      </button>
      <p className="text-xs text-gray-400 mt-2">
        This will cost a small amount of gas to cancel pending transactions.
      </p>
    </div>
  );
}
