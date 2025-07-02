import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

// Get WalletConnect Project ID from environment or use a default
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '2b7e87cc20de4512c22c41c5e749d456';

export const config = getDefaultConfig({
  appName: 'FitChain MVP',
  projectId: projectId,
  chains: [sepolia],
  ssr: false,
});

// Contract configuration
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';

// Helper to check if we're on the right network
export const SUPPORTED_CHAIN_ID = sepolia.id;

// Helper to check if contract is configured
export const isContractConfigured = () => {
  return CONTRACT_ADDRESS && CONTRACT_ADDRESS !== '';
};
