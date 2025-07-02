import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { config } from './wagmi.config';
import { useAccount } from 'wagmi';
import { WalletProvider } from './contexts/WalletContext';
import NotificationContainer from './components/NotificationContainer';
import PendingTransactions from './components/PendingTransactions';

// Pages
import LandingPage from './pages/LandingPage';
import ConnectWalletPage from './pages/ConnectWalletPage';
import SimpleConnectPage from './pages/SimpleConnectPage';
import DashboardPage from './pages/DashboardPage';
import DashboardPageClean from './pages/DashboardPageClean';
import TroubleshootingPage from './pages/TroubleshootingPage';
import ProfilePage from './pages/ProfilePage';
import LogWorkoutPage from './pages/LogWorkoutPage';
import LogWorkoutPageClean from './pages/LogWorkoutPageClean';
import BadgeDetailsPage from './pages/BadgeDetailsPage';
import StatsPage from './pages/StatsPage';
import CommunityPage from './pages/CommunityPage';
import ComposablePage from './pages/ComposablePage';
import TestPage from './pages/TestPage';
import DebugPage from './pages/DebugPage';

const queryClient = new QueryClient();

function AppContent() {
  const { isConnected } = useAccount();

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={isConnected ? <DashboardPageClean /> : <Navigate to="/" />} />
          <Route path="/troubleshooting" element={isConnected ? <TroubleshootingPage /> : <Navigate to="/" />} />
          <Route path="/profile" element={isConnected ? <ProfilePage /> : <Navigate to="/" />} />
          <Route path="/log-workout" element={isConnected ? <LogWorkoutPageClean /> : <Navigate to="/" />} />
          <Route path="/badge/:id" element={isConnected ? <BadgeDetailsPage /> : <Navigate to="/" />} />
          <Route path="/stats" element={isConnected ? <StatsPage /> : <Navigate to="/" />} />
          <Route path="/community" element={isConnected ? <CommunityPage /> : <Navigate to="/" />} />
          <Route path="/composable" element={<ComposablePage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/debug" element={<DebugPage />} />
        </Routes>
        <Toaster position="bottom-center" />
        <NotificationContainer />
        <PendingTransactions />
      </div>
    </Router>
  );
}

function App() {
  return (
    <WagmiProvider config={config}>

      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#60A5FA',
            accentColorForeground: 'white',
            borderRadius: 'medium',
          })}
          modalSize="compact"
        >
          <WalletProvider>
            <AppContent />
          </WalletProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
