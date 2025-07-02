import { useState, useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import { formatGwei } from 'viem';

export function GasPriceMonitor() {
  const publicClient = usePublicClient();
  const [gasPrice, setGasPrice] = useState(null);
  const [isHighGas, setIsHighGas] = useState(false);

  useEffect(() => {
    const checkGasPrice = async () => {
      try {
        const price = await publicClient.getGasPrice();
        setGasPrice(price);
        
        // Consider gas high if above 50 gwei on Sepolia
        const gweiPrice = Number(formatGwei(price));
        setIsHighGas(gweiPrice > 50);
      } catch (error) {
        console.error('Failed to fetch gas price:', error);
      }
    };

    // Check immediately and then every 15 seconds
    checkGasPrice();
    const interval = setInterval(checkGasPrice, 15000);

    return () => clearInterval(interval);
  }, [publicClient]);

  if (!gasPrice) return null;

  return (
    <div className={`rounded-lg p-3 text-sm ${
      isHighGas 
        ? 'bg-red-900/20 border border-red-800' 
        : 'bg-green-900/20 border border-green-800'
    }`}>
      <div className="flex items-center justify-between">
        <span className="text-gray-300">Current Gas Price:</span>
        <span className={`font-mono font-bold ${
          isHighGas ? 'text-red-400' : 'text-green-400'
        }`}>
          {formatGwei(gasPrice)} gwei
        </span>
      </div>
      {isHighGas && (
        <p className="text-xs text-red-400 mt-1">
          ⚠️ Gas prices are high. Consider waiting or increasing gas limit.
        </p>
      )}
    </div>
  );
}
