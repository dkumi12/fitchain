import { parseGwei } from 'viem';

// Sepolia testnet optimized configuration
export const SEPOLIA_CONFIG = {
  // Gas settings
  minGasPrice: parseGwei('50'), // Minimum 50 gwei
  gasMultiplier: 2, // Always use 2x estimated gas
  defaultGasLimit: 500000n, // Higher gas limit for safety
  
  // Transaction settings
  confirmations: 1, // Don't wait for many confirmations
  timeout: 120000, // 2 minute timeout
  
  // Retry settings
  maxRetries: 3,
  retryDelay: 5000, // 5 seconds between retries
};

// Helper to get optimized gas settings
export async function getOptimizedGasSettings(publicClient) {
  try {
    const gasPrice = await publicClient.getGasPrice();
    const optimizedPrice = gasPrice * BigInt(SEPOLIA_CONFIG.gasMultiplier);
    
    // Ensure minimum gas price
    const finalGasPrice = optimizedPrice < SEPOLIA_CONFIG.minGasPrice 
      ? SEPOLIA_CONFIG.minGasPrice 
      : optimizedPrice;

    return {
      gasPrice: finalGasPrice,
      gasLimit: SEPOLIA_CONFIG.defaultGasLimit,
    };
  } catch (error) {
    // Fallback to safe defaults
    return {
      gasPrice: SEPOLIA_CONFIG.minGasPrice,
      gasLimit: SEPOLIA_CONFIG.defaultGasLimit,
    };
  }
}
