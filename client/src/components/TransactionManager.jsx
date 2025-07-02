import { useEffect } from 'react';
import { usePublicClient, useWalletClient } from 'wagmi';
import toast from 'react-hot-toast';

export function TransactionManager() {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  // Function to cancel/speed up stuck transactions
  const handleStuckTransaction = async (nonce) => {
    if (!walletClient) return;

    try {
      // Get current gas prices
      const gasPrice = await publicClient.getGasPrice();
      const increasedGasPrice = (gasPrice * 150n) / 100n; // 50% increase

      // Send a 0 ETH transaction to yourself with same nonce but higher gas
      const hash = await walletClient.sendTransaction({
        to: walletClient.account.address,
        value: 0n,
        gasPrice: increasedGasPrice,
        nonce: nonce,
      });

      toast.success('Transaction replaced. Old transaction will be dropped.');
      return hash;
    } catch (error) {
      console.error('Failed to replace transaction:', error);
      toast.error('Failed to replace transaction');
    }
  };

  // Function to check for stuck transactions
  const checkPendingTransactions = async () => {
    if (!walletClient) return;

    try {
      // Get pending transactions from mempool
      const pendingTxs = await publicClient.getFilterChanges({
        filter: await publicClient.createPendingTransactionFilter()
      });

      // Check each pending transaction
      for (const tx of pendingTxs) {
        const transaction = await publicClient.getTransaction({ hash: tx });
        if (transaction && transaction.from.toLowerCase() === walletClient.account.address.toLowerCase()) {
          const receipt = await publicClient.getTransactionReceipt({ hash: tx }).catch(() => null);
          
          // If no receipt after 5 minutes, consider it stuck
          if (!receipt) {
            const block = await publicClient.getBlock();
            const txBlock = await publicClient.getBlock({ blockNumber: transaction.blockNumber });
            const timeDiff = Number(block.timestamp - txBlock.timestamp);
            
            if (timeDiff > 300) { // 5 minutes
              toast.error(`Transaction ${tx.slice(0, 8)}... seems stuck. Consider speeding it up.`);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error checking pending transactions:', error);
    }
  };

  useEffect(() => {
    // Check for stuck transactions every 30 seconds
    const interval = setInterval(checkPendingTransactions, 30000);
    checkPendingTransactions(); // Check immediately

    return () => clearInterval(interval);
  }, [walletClient]);

  return null;
}
