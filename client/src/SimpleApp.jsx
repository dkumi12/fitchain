import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { WalletProvider, useWallet } from './contexts/WalletContext';
import { useEffect } from 'react';

// Pages
import LandingPage from './pages/LandingPage';
import SimpleConnectPage from './pages/SimpleConnectPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import LogWorkoutPage from './pages/LogWorkoutPage';
import BadgeDetailsPage from './pages/BadgeDetailsPage';
import StatsPage from './pages/StatsPage';
import CommunityPage from './pages/CommunityPage';

function AppRoutes() {
  const { isConnected } = useWallet();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={!isConnected ? <LandingPage /> : <Navigate to="/dashboard" />} />
      <Route path="/connect" element={!isConnected ? <SimpleConnectPage /> : <Navigate to="/dashboard" />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={isConnected ? <DashboardPage /> : <Navigate to="/connect" />} />
      <Route path="/profile" element={isConnected ? <ProfilePage /> : <Navigate to="/connect" />} />
      <Route path="/log-workout" element={isConnected ? <LogWorkoutPage /> : <Navigate to="/connect" />} />
      <Route path="/badge/:id" element={isConnected ? <BadgeDetailsPage /> : <Navigate to="/connect" />} />
      <Route path="/stats" element={isConnected ? <StatsPage /> : <Navigate to="/connect" />} />
      <Route path="/community" element={isConnected ? <CommunityPage /> : <Navigate to="/connect" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
          <AppRoutes />
          <Toaster position="bottom-center" />
        </div>
      </Router>
    </WalletProvider>
  );
}
