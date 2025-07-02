import { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';

export default function SepoliaFaucetHelper() {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const [copied, setCopied] = useState(false);

  const faucets = [
    {
      name: 'Alchemy Faucet',
      url: 'https://www.alchemy.com/faucets/ethereum-sepolia',
      amount: '0.5 ETH',
      requirement: 'Alchemy account'
    },
    {
      name: 'Sepolia PoW Faucet',
      url: 'https://sepolia-faucet.pk910.de',
      amount: 'Variable',
      requirement: 'Mine with CPU'
    },
    {
      name: 'Google Cloud Faucet',
      url: 'https://cloud.google.com/application/web3/faucet/ethereum/sepolia',
      amount: '0.05 ETH',
      requirement: 'Google account'
    },
    {
      name: 'Infura Faucet',
      url: 'https://www.infura.io/faucet/sepolia',
      amount: '0.5 ETH',
      requirement: 'Infura account'
    }
  ];

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isLowBalance = balance && parseFloat(balance.formatted) < 0.01;

  if (!isLowBalance) return null;

  return (
    <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <span className="text-2xl">⚠️</span>
        <div className="flex-1">
          <h4 className="font-semibold text-yellow-400 mb-2">Low Sepolia ETH Balance</h4>
          <p className="text-sm text-gray-300 mb-3">
            Your balance ({balance?.formatted} ETH) is low. Get free testnet ETH from these faucets:
          </p>
          
          <div className="bg-gray-800 rounded p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">Your address:</span>
              <button
                onClick={copyAddress}
                className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
            <code className="text-xs text-blue-400 break-all">{address}</code>
          </div>

          <div className="space-y-2">
            {faucets.map((faucet, index) => (
              <a
                key={index}
                href={faucet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gray-800 hover:bg-gray-700 rounded p-3 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{faucet.name}</p>
                    <p className="text-xs text-gray-400">
                      {faucet.amount} • {faucet.requirement}
                    </p>
                  </div>
                  <span className="text-gray-400">→</span>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-3 text-xs text-gray-400">
            💡 Tip: Use multiple faucets to get more ETH quickly
          </div>
        </div>
      </div>
    </div>
  );
}