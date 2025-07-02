import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';

export default function SimpleConnectPage() {
  const navigate = useNavigate();
  const { account, isConnected, isConnecting, error, connect } = useWallet();
  
  // Local state for enhanced features
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState(null);
  const [connectionStep, setConnectionStep] = useState(0);
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);

  // Network configurations
  const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in hex
  const NETWORKS = {
    '0x1': { name: 'Ethereum Mainnet', color: 'bg-gray-600' },
    '0xaa36a7': { name: 'Sepolia Testnet', color: 'bg-green-600' },
    '0x89': { name: 'Polygon', color: 'bg-purple-600' },
    '0x5': { name: 'Goerli', color: 'bg-blue-600' }
  };

  // Check MetaMask installation and network on mount
  useEffect(() => {
    checkMetaMaskStatus();
    
    if (window.ethereum) {
      // Listen for network changes
      window.ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  // Navigate to dashboard if already connected
  useEffect(() => {
    if (isConnected && currentNetwork === SEPOLIA_CHAIN_ID) {
      navigate('/dashboard');
    }
  }, [isConnected, currentNetwork, navigate]);

  const checkMetaMaskStatus = async () => {
    if (typeof window.ethereum !== 'undefined') {
      setIsMetaMaskInstalled(true);
      
      // Get current network
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setCurrentNetwork(chainId);
      } catch (err) {
        console.error('Error getting chain ID:', err);
      }
    } else {
      setIsMetaMaskInstalled(false);
    }
  };

  const handleChainChanged = (chainId) => {
    setCurrentNetwork(chainId);
    // Reload the page as recommended by MetaMask
    window.location.reload();
  };

  const handleConnect = async () => {
    setConnectionStep(1);
    setShowTroubleshooting(false);
    
    try {
      const success = await connect();
      
      if (success) {
        setConnectionStep(2);
        
        // Check if we need to switch networks
        if (currentNetwork !== SEPOLIA_CHAIN_ID) {
          setConnectionStep(3);
          await switchToSepolia();
        } else {
          setConnectionStep(4);
          setTimeout(() => navigate('/dashboard'), 1000);
        }
      }
    } catch (err) {
      setConnectionStep(0);
      setShowTroubleshooting(true);
    }
  };

  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
      setConnectionStep(4);
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (switchError) {
      if (switchError.code === 4902) {
        // Network not added, let's add it
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: SEPOLIA_CHAIN_ID,
              chainName: 'Sepolia Test Network',
              nativeCurrency: {
                name: 'SepoliaETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['https://rpc.sepolia.org'],
              blockExplorerUrls: ['https://sepolia.etherscan.io']
            }],
          });
          setConnectionStep(4);
          setTimeout(() => navigate('/dashboard'), 1000);
        } catch (addError) {
          console.error('Error adding network:', addError);
        }
      }
    }
  };

  const connectionSteps = [
    { id: 1, text: 'Connecting to wallet...', icon: '🔗' },
    { id: 2, text: 'Wallet connected!', icon: '✅' },
    { id: 3, text: 'Switching to Sepolia network...', icon: '🔄' },
    { id: 4, text: 'Success! Redirecting...', icon: '🚀' }
  ];

  const troubleshootingItems = [
    {
      question: "MetaMask doesn't open when I click connect",
      answer: "Make sure MetaMask is unlocked. Click the extension icon and enter your password."
    },
    {
      question: "I see 'User rejected the request'",
      answer: "You need to click 'Connect' in the MetaMask popup. Try connecting again."
    },
    {
      question: "Wrong network error",
      answer: "We'll automatically prompt you to switch to Sepolia. Just approve the network switch in MetaMask."
    },
    {
      question: "I don't have any ETH",
      answer: "You'll need Sepolia test ETH for gas fees. Visit https://sepoliafaucet.com to get free test ETH."
    },
    {
      question: "Connection stuck or not working",
      answer: "Try refreshing the page, or open MetaMask and disconnect from any connected sites, then try again."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mb-6">
            <span className="text-6xl">🏋️</span>
          </div>
          <h2 className="text-3xl font-bold">Connect Your Wallet</h2>
          <p className="mt-2 text-gray-400">
            Connect with MetaMask to access FitChain
          </p>
        </div>

        {/* Connection Status */}
        <div className="space-y-4">
          {/* MetaMask Status */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🦊</span>
                <span className="font-medium">MetaMask</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm ${
                isMetaMaskInstalled ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
              }`}>
                {isMetaMaskInstalled ? 'Installed' : 'Not Installed'}
              </div>
            </div>
          </div>

          {/* Network Status */}
          {currentNetwork && (
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Current Network:</span>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  NETWORKS[currentNetwork]?.color || 'bg-gray-600'
                } text-white`}>
                  {NETWORKS[currentNetwork]?.name || 'Unknown Network'}
                </div>
              </div>
              {currentNetwork !== SEPOLIA_CHAIN_ID && (
                <p className="text-xs text-yellow-400 mt-2">
                  ⚠️ You'll need to switch to Sepolia after connecting
                </p>
              )}
            </div>
          )}

          {/* Connection Progress */}
          {connectionStep > 0 && (
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="space-y-2">
                {connectionSteps.slice(0, connectionStep).map((step) => (
                  <div key={step.id} className="flex items-center gap-3">
                    <span className="text-xl">{step.icon}</span>
                    <span className="text-sm">{step.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Connect Button */}
          {!isMetaMaskInstalled ? (
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <span>🦊</span>
              <span>Install MetaMask</span>
            </a>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isConnecting || connectionStep > 0}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isConnecting || connectionStep > 0 ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <span>🦊</span>
                  <span>Connect with MetaMask</span>
                </>
              )}
            </button>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg">
              <p className="text-sm font-medium text-red-400">Connection Error</p>
              <p className="text-xs text-red-300 mt-1">{error}</p>
              <button
                onClick={() => setShowTroubleshooting(true)}
                className="text-xs text-red-400 underline mt-2"
              >
                Need help? View troubleshooting tips
              </button>
            </div>
          )}

          {/* Account Display */}
          {account && (
            <div className="p-3 bg-green-900/50 border border-green-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-400">Connected Account</p>
                  <p className="font-mono text-sm">{account.slice(0, 6)}...{account.slice(-4)}</p>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(account)}
                  className="text-green-400 hover:text-green-300"
                  title="Copy address"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Troubleshooting Section */}
        {(showTroubleshooting || (!isMetaMaskInstalled && !error)) && (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span>🔧</span>
              Troubleshooting
            </h3>
            <div className="space-y-3">
              {troubleshootingItems.map((item, index) => (
                <details key={index} className="group">
                  <summary className="cursor-pointer text-sm text-gray-300 hover:text-white transition-colors">
                    {item.question}
                  </summary>
                  <p className="text-xs text-gray-400 mt-2 ml-4">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Security Note */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>🔒 We never have access to your private keys</p>
          <p>Only sign transactions you understand</p>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
