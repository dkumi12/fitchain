import { useTransactionMonitor } from '../stores/transactionMonitor';
import { useState } from 'react';

export default function PendingTransactions() {
  const { pendingTransactions } = useTransactionMonitor();
  const [showDetails, setShowDetails] = useState(false);
  
  const pendingCount = pendingTransactions.filter(tx => tx.status === 'pending').length;
  
  if (pendingCount === 0) return null;
  
  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="bg-gray-800 border border-yellow-500 rounded-lg p-3 shadow-lg">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 text-sm"
        >
          <div className="animate-spin h-4 w-4 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
          <span className="text-yellow-400 font-semibold">
            {pendingCount} Pending Transaction{pendingCount > 1 ? 's' : ''}
          </span>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${showDetails ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {showDetails && (
          <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
            {pendingTransactions
              .filter(tx => tx.status === 'pending')
              .map((tx) => (
                <div key={tx.hash} className="bg-gray-900 rounded-lg p-2 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-400">
                      {tx.type || 'Transaction'}
                    </span>
                    <span className="text-gray-500">
                      {Math.floor((Date.now() - tx.timestamp) / 1000)}s ago
                    </span>
                  </div>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-mono text-xs break-all"
                  >
                    {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                  </a>
                </div>
              ))}
          </div>
        )}
        
        <div className="mt-2 text-xs text-gray-400">
          Transactions will confirm in the background
        </div>
      </div>
    </div>
  );
}