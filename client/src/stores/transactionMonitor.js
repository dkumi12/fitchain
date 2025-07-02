import { create } from 'zustand';
import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { useNotificationStore } from './notificationStore';

// Create a public client for Sepolia
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http('https://eth-sepolia.g.alchemy.com/v2/demo'), // Using public endpoint
});

export const useTransactionMonitor = create((set, get) => ({
  pendingTransactions: [],
  
  addTransaction: (txHash, metadata = {}) => {
    const tx = {
      hash: txHash,
      status: 'pending',
      timestamp: Date.now(),
      ...metadata,
    };
    
    set((state) => ({
      pendingTransactions: [...state.pendingTransactions, tx]
    }));
    
    // Start monitoring
    get().monitorTransaction(txHash);
  },
  
  monitorTransaction: async (txHash) => {
    const checkInterval = setInterval(async () => {
      try {
        const receipt = await publicClient.getTransactionReceipt({ hash: txHash });
        
        if (receipt) {
          clearInterval(checkInterval);
          
          // Update transaction status
          set((state) => ({
            pendingTransactions: state.pendingTransactions.map(tx =>
              tx.hash === txHash 
                ? { ...tx, status: receipt.status === 'success' ? 'confirmed' : 'failed' }
                : tx
            )
          }));
          
          // Show notification
          const { addNotification } = useNotificationStore.getState();
          
          if (receipt.status === 'success') {
            addNotification({
              status: 'success',
              title: '✅ Transaction Confirmed!',
              message: 'Your transaction was confirmed in the background.',
              txHash,
              duration: 5000,
            });
          } else {
            addNotification({
              status: 'error',
              title: '❌ Transaction Failed',
              message: 'Your transaction failed in the background.',
              txHash,
            });
          }
          
          // Remove from pending after a delay
          setTimeout(() => {
            set((state) => ({
              pendingTransactions: state.pendingTransactions.filter(tx => tx.hash !== txHash)
            }));
          }, 5000);
        }
      } catch (error) {
        console.error('Error monitoring transaction:', error);
      }
    }, 5000); // Check every 5 seconds
    
    // Stop checking after 10 minutes
    setTimeout(() => {
      clearInterval(checkInterval);
    }, 600000);
  },
  
  getPendingCount: () => {
    return get().pendingTransactions.filter(tx => tx.status === 'pending').length;
  },
}));