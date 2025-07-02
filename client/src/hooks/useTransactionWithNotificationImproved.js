import { useWriteContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi';
import { useNotificationStore } from '../stores/notificationStore';
import { useTransactionMonitor } from '../stores/transactionMonitor';
import { useEffect, useRef, useState } from 'react';
import { parseGwei } from 'viem';

export function useTransactionWithNotification() {
  const publicClient = usePublicClient();
  const { writeContract, data: txHash, error: writeError, isError: isWriteError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, error: txError } = useWaitForTransactionReceipt({
    hash: txHash,
    confirmations: 1,
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
      addTransaction(txHash, {
        type: 'Workout'
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
        if (notificationIdRef.current) {
          updateNotification(notificationIdRef.current, {
            status: 'warning',
            title: 'Transaction is Taking Longer',
            message: 'Your transaction is still being processed. This is normal during network congestion.',
            permanent: true,
          });
        }
      }, 30000); // 30 seconds
    }
  }, [txHash, updateNotification, addTransaction]);

  // Handle transaction success
  useEffect(() => {
    if (isSuccess && notificationIdRef.current) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      updateNotification(notificationIdRef.current, {
        status: 'success',
        title: '✅ Transaction Confirmed!',
        message: 'Your transaction has been successfully processed.',
        duration: 5000,
      });
      
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
      permanent: true,
      ...notificationConfig,
    });

    try {
      // Get current gas price and increase it for faster processing
      const gasPrice = await publicClient.getGasPrice();
      const increasedGasPrice = (gasPrice * 120n) / 100n; // 20% increase
      
      // Add gas configuration to the transaction
      const configWithGas = {
        ...config,
        gas: 300000n, // Set a reasonable gas limit
        gasPrice: increasedGasPrice,
      };

      await writeContract(configWithGas);
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
