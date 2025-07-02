import { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { parseGwei } from 'viem';

export default function GasOptimizedActions() {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const [gasPrice, setGasPrice] = useState('0.1'); // Start with 0.1 gwei

  // Function to execute with custom gas settings
  const executeWithLowGas = async (contractCall) => {
    try {
      // Set very low gas price
      const txConfig = {
        gasPrice: parseGwei(gasPrice),
        gasLimit: 100000n, // Fixed low limit
      };
      
      await contractCall(txConfig);
    } catch (error) {
      console.error('Transaction failed:', error);
      if (error.message.includes('insufficient funds')) {
        alert('Not enough ETH. Try lowering gas price or get more Sepolia ETH.');
      }
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <h4 className="text-sm font-semibold mb-2">⛽ Gas Settings</h4>
      
      <div className="space-y-2 text-xs">
        <div>
          <p className="text-gray-400">Your Balance: {balance ? `${balance.formatted} ${balance.symbol}` : 'Loading...'}</p>
        </div>
        
        <div>
          <label className="text-gray-400">Gas Price (gwei):</label>
          <select 
            value={gasPrice} 
            onChange={(e) => setGasPrice(e.target.value)}
            className="ml-2 bg-gray-700 rounded px-2 py-1"
          >
            <option value="0.01">0.01 (Ultra Low)</option>
            <option value="0.1">0.1 (Very Low)</option>
            <option value="0.5">0.5 (Low)</option>
            <option value="1">1 (Standard)</option>
          </select>
        </div>
        
        <div className="text-gray-500">
          <p>Estimated transaction cost: ~{(0.00000001 * Number(gasPrice) * 100000).toFixed(8)} ETH</p>
        </div>
      </div>

      <div className="mt-3 p-2 bg-yellow-900/20 rounded text-yellow-400 text-xs">
        <p>💡 Tips for low balance:</p>
        <ul className="list-disc list-inside mt-1">
          <li>Use 0.01-0.1 gwei gas price</li>
          <li>Transactions may take longer</li>
          <li>Get free Sepolia ETH from faucets</li>
        </ul>
      </div>
    </div>
  );
}