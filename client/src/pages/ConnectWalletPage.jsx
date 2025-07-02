import { useNavigate } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';

export default function ConnectWalletPage() {
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      navigate('/dashboard');
    }
  }, [isConnected, navigate]);

  return (
    <div className="relative flex size-full min-h-screen flex-col justify-between bg-gray-900 text-white overflow-x-hidden">
      <main className="flex-grow flex flex-col">
        <header className="sticky top-0 z-10 bg-gray-900 shadow-md border-b border-gray-700">
          <div className="flex items-center p-4">
            <button 
              onClick={() => navigate('/')}
              className="text-white p-2 -ml-2 hover:bg-gray-800 rounded-full transition-colors">
              <svg fill="currentColor" height="28px" viewBox="0 0 256 256" width="28px">
                <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
              </svg>
            </button>
            <h2 className="text-white text-xl font-semibold leading-tight tracking-tight flex-1 text-center -ml-7">
              Connect Wallet
            </h2>
          </div>
        </header>
        
        <div className="flex-grow flex flex-col items-center justify-center px-6 py-8 text-center">
          <img 
            alt="FitChain Logo" 
            className="w-20 h-20 mb-6 rounded-full shadow-lg border-2 border-blue-500"
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=200&h=200&fit=crop"
          />
          <h1 className="text-white text-3xl font-bold leading-tight tracking-tight mb-3">
            Connect Your Wallet
          </h1>
          <p className="text-gray-400 text-lg font-normal leading-relaxed max-w-sm mb-10">
            Securely connect your wallet to start earning rewards for your fitness activities with FitChain.
          </p>
          
          <div className="w-full max-w-md">
            <ConnectButton />
          </div>
          
          <p className="text-gray-500 text-sm mt-8 max-w-xs">
            By connecting your wallet, you agree to our{' '}
            <a className="font-medium text-blue-500 hover:underline" href="#">
              Terms of Service
            </a>{' '}
            and{' '}
            <a className="font-medium text-blue-500 hover:underline" href="#">
              Privacy Policy
            </a>.
          </p>
        </div>
      </main>
    </div>
  );
}
