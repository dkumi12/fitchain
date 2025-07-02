import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useNotificationStore } from '../stores/notificationStore';
import { useTransactionMonitor } from '../stores/transactionMonitor';
import { useEffect, useRef, useState } from 'react';

export function useTransactionWithNotification() {
  const { writeContract, data: txHash, error: writeError, isError: isWriteError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, error: txError } = useWaitForTransactionReceipt({
    hash: txHash,
    confirmations: 1, // Wait for only 1 confirmation instead of default
  });
  
  const { addNotification, updateNotification } = useNotificationStore();
  const { addTransaction } = useTransactionMonitor();
  const notificationIdRef = useRef(null);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const timeoutRef = useRef(null);

  // Handle write errors
  useEffect(() => {
    if (isWriteError && writeError) {
      if (notificationIdRef.current) {
        updateNotification(notificationIdRef.current, {
          status: 'error',
          title: 'Transaction Failed',
          message: writeError.message.includes('user rejected') 
            ? 'You rejected the transaction'
            : 'Failed to submit transaction',
        });
      }
    }
  }, [isWriteError, writeError, updateNotification]);

  // Handle transaction submission
  useEffect(() => {
    if (txHash && notificationIdRef.current) {
      // Add to background monitor
      addTransaction(txHash, {
        type: 'Workout' // This could be passed from the notification config
      });
      
      updateNotification(notificationIdRef.current, {
        status: 'confirming',
        title: 'Transaction Submitted',
        message: 'Waiting for blockchain confirmation...',
        txHash: txHash,
      });

      // Set a timeout for slow transactions
      timeoutRef.current = setTimeout(() => {
        setTimeoutReached(true);
        if (notificationIdRef.current && !isSuccess) {
          updateNotification(notificationIdRef.current, {
            status: 'confirming',
            title: 'Transaction Pending',
            message: 'This is taking longer than usual. The transaction will complete in the background.',
            permanent: false,
            duration: 10000,
            action: {
              label: 'Speed Up',
              onClick: () => {
                window.open(`https://sepolia.etherscan.io/tx/${txHash}`, '_blank');
              }
            }
          });
        }
      }, 30000); // 30 seconds timeout
    }
  }, [txHash, updateNotification, isSuccess]);

  // Handle transaction success
  useEffect(() => {
    if (isSuccess && notificationIdRef.current) {
      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      updateNotification(notificationIdRef.current, {
        status: 'success',
        title: '✅ Transaction Confirmed!',
        message: 'Your transaction has been successfully processed.',
        duration: 5000,
      });
      
      // Clear ref after success
      setTimeout(() => {
        notificationIdRef.current = null;
        setTimeoutReached(false);
      }, 100);
    }
  }, [isSuccess, updateNotification]);

  // Handle transaction errors
  useEffect(() => {
    if (txError && notificationIdRef.current) {
      updateNotification(notificationIdRef.current, {
        status: 'error',
        title: 'Transaction Failed',
        message: 'The transaction failed to confirm on the blockchain.',
      });
    }
  }, [txError, updateNotification]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const executeTransaction = async (config, notificationConfig = {}) => {
    // Create initial notification
    notificationIdRef.current = addNotification({
      status: 'pending',
      title: notificationConfig.title || 'Preparing Transaction',
      message: notificationConfig.message || 'Please confirm in your wallet...',
      permanent: true, // Keep it until resolved
      ...notificationConfig,
    });

    try {
      await writeContract(config);
    } catch (error) {
      console.error('Transaction error:', error);
    }
  };

  return {
    executeTransaction,
    isLoading: isConfirming,
    isSuccess,
    txHash,
    timeoutReached,
  };
}