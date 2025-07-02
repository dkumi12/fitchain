import { useState } from 'react';
import { parseGwei } from 'viem';

export default function LowGasConfig({ onGasConfigChange }) {
  const [gasConfig, setGasConfig] = useState({
    price: '0.1', // 0.1 gwei default
    limit: '100000' // 100k gas limit
  });

  const updateConfig = (field, value) => {
    const newConfig = { ...gasConfig, [field]: value };
    setGasConfig(newConfig);
    
    // Pass config to parent
    if (onGasConfigChange) {
      onGasConfigChange({
        gasPrice: parseGwei(newConfig.price),
        gasLimit: BigInt(newConfig.limit)
      });
    }
  };

  const presets = [
    { name: 'Ultra Low', price: '0.01', limit: '80000' },
    { name: 'Very Low', price: '0.1', limit: '100000' },
    { name: 'Low', price: '0.5', limit: '150000' },
    { name: 'Standard', price: '1', limit: '200000' }
  ];

  return (
    <div className="bg-gray-800/50 rounded-lg p-3 mb-4 text-xs">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">⛽ Gas Settings</h4>
        <span className="text-gray-400">
          Est: {(Number(gasConfig.price) * Number(gasConfig.limit) / 1e9).toFixed(6)} ETH
        </span>
      </div>
      
      <div className="flex gap-2 mb-2">
        {presets.map(preset => (
          <button
            key={preset.name}
            onClick={() => {
              setGasConfig({ price: preset.price, limit: preset.limit });
              if (onGasConfigChange) {
                onGasConfigChange({
                  gasPrice: parseGwei(preset.price),
                  gasLimit: BigInt(preset.limit)
                });
              }
            }}
            className={`px-2 py-1 rounded ${
              gasConfig.price === preset.price 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-gray-400 block">Gas Price (gwei)</label>
          <input
            type="number"
            step="0.01"
            value={gasConfig.price}
            onChange={(e) => updateConfig('price', e.target.value)}
            className="w-full bg-gray-700 rounded px-2 py-1 mt-1"
          />
        </div>
        <div>
          <label className="text-gray-400 block">Gas Limit</label>
          <input
            type="number"
            value={gasConfig.limit}
            onChange={(e) => updateConfig('limit', e.target.value)}
            className="w-full bg-gray-700 rounded px-2 py-1 mt-1"
          />
        </div>
      </div>
      
      <div className="mt-2 text-yellow-400 text-xs">
        💡 Use Ultra Low for minimal fees (may take longer)
      </div>
    </div>
  );
}