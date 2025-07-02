export default function TransactionTips() {
  return (
    <div className="bg-blue-900/20 border border-blue-600/50 rounded-lg p-4 mb-6">
      <h4 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
        <span className="text-xl">💡</span>
        Speed Up Sepolia Transactions
      </h4>
      
      <div className="space-y-2 text-sm text-gray-300">
        <div className="flex items-start gap-2">
          <span className="text-green-400">✓</span>
          <div>
            <strong>Use Higher Gas:</strong> Select "Fast" or "Instant" speed for quicker confirmations
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <span className="text-green-400">✓</span>
          <div>
            <strong>Background Processing:</strong> Transactions continue even if you close the page
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <span className="text-green-400">✓</span>
          <div>
            <strong>Multiple Transactions:</strong> You can start new transactions while others are pending
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <span className="text-yellow-400">⚡</span>
          <div>
            <strong>Network Status:</strong> Sepolia can be slower than mainnet during high usage
          </div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-400">
          Average Sepolia confirmation times: Slow (5-30min), Standard (2-10min), Fast (30s-2min)
        </p>
      </div>
    </div>
  );
}