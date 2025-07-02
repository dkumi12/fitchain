import { useState } from 'react';
import { parseGwei } from 'viem';
import { useNotificationStore } from '../stores/notificationStore';

export default function TransactionSpeedSelector({ onSpeedChange, currentGasPrice }) {
  const { addNotification } = useNotificationStore();
  const [showDetails, setShowDetails] = useState(false);

  const speeds = [
    {
      name: 'Slow',
      gasPrice: '0.01',
      time: '5-30 min',
      description: 'Lowest cost, may take longer',
      color: 'text-gray-400',
      bgColor: 'bg-gray-700',
    },
    {
      name: 'Standard',
      gasPrice: '0.1',
      time: '2-10 min',
      description: 'Balanced speed and cost',
      color: 'text-blue-400',
      bgColor: 'bg-blue-700',
    },
    {
      name: 'Fast',
      gasPrice: '1',
      time: '30s-2 min',
      description: 'Quick confirmation',
      color: 'text-orange-400',
      bgColor: 'bg-orange-700',
    },
    {
      name: 'Instant',
      gasPrice: '5',
      time: '< 30s',
      description: 'Priority processing',
      color: 'text-red-400',
      bgColor: 'bg-red-700',
    },
  ];

  const handleSpeedSelect = (speed) => {
    onSpeedChange({
      gasPrice: parseGwei(speed.gasPrice),
      gasLimit: 150000n, // Slightly higher for faster inclusion
    });
    
    addNotification({
      status: 'success',
      title: `Transaction Speed: ${speed.name}`,
      message: `Estimated confirmation time: ${speed.time}`,
      duration: 3000,
    });
  };

  const currentSpeed = speeds.find(s => s.gasPrice === currentGasPrice) || speeds[1];

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-white">Transaction Speed</h4>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-gray-400 hover:text-white"
        >
          {showDetails ? 'Hide' : 'Details'}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-2">
        {speeds.map((speed) => {
          const isSelected = speed.gasPrice === currentGasPrice;
          return (
            <button
              key={speed.name}
              onClick={() => handleSpeedSelect(speed)}
              className={`
                relative p-2 rounded-lg text-center transition-all
                ${isSelected 
                  ? `${speed.bgColor} ring-2 ring-white` 
                  : 'bg-gray-700 hover:bg-gray-600'
                }
              `}
            >
              <div className={`text-xs font-semibold ${isSelected ? 'text-white' : speed.color}`}>
                {speed.name}
              </div>
              <div className="text-xs text-gray-300 mt-1">
                {speed.time}
              </div>
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>

      {showDetails && (
        <div className="mt-3 p-3 bg-gray-900 rounded-lg text-xs">
          <div className="space-y-2">
            <div>
              <span className="text-gray-400">Current Selection:</span>
              <span className={`ml-2 font-semibold ${currentSpeed.color}`}>
                {currentSpeed.name} - {currentSpeed.gasPrice} gwei
              </span>
            </div>
            <div>
              <span className="text-gray-400">Est. Cost:</span>
              <span className="ml-2 text-white">
                ~{(Number(currentSpeed.gasPrice) * 150000 / 1e9).toFixed(6)} ETH
              </span>
            </div>
            <p className="text-gray-400 mt-2">
              {currentSpeed.description}. Times are estimates and may vary based on network congestion.
            </p>
          </div>
        </div>
      )}

      <div className="mt-2 text-xs text-gray-400">
        💡 Tip: Use "Slow" for non-urgent transactions to save gas
      </div>
    </div>
  );
}