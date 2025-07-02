import { useAccount, useBalance, useChainId, useChains } from 'wagmi';

export default function DebugInfo() {
  const { address, isConnected, connector } = useAccount();
  const chainId = useChainId();
  const chains = useChains();
  const { data: balance } = useBalance({ address });

  // Find current chain from chainId
  const currentChain = chains.find(chain => chain.id === chainId);

  if (!import.meta.env.DEV) return null;

  return (
    <div className="fixed bottom-20 right-4 bg-gray-800 p-4 rounded-lg text-xs text-gray-300 max-w-xs">
      <h3 className="font-bold text-white mb-2">Debug Info</h3>
      <div className="space-y-1">
        <p>Connected: {isConnected ? '✅' : '❌'}</p>
        <p>Address: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'None'}</p>
        <p>Connector: {connector?.name || 'None'}</p>
        <p>Chain: {currentChain?.name || 'None'} ({chainId})</p>
        <p>Balance: {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : 'N/A'}</p>
        <p>WalletConnect ID: {import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ? '✅' : '❌ Missing!'}</p>
        <p>Contract: {import.meta.env.VITE_CONTRACT_ADDRESS || 'Not set'}</p>
      </div>
    </div>
  );
}
