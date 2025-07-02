import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  // Auto-redirect to dashboard if already connected
  useEffect(() => {
    if (isConnected) {
      navigate('/dashboard');
    }
  }, [isConnected, navigate]);

  const [stats, setStats] = useState({
    workouts: 0,
    users: 0,
    badges: 0
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activities, setActivities] = useState([]);

  // Animated counter effect
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        workouts: Math.min(prev.workouts + 127, 45678),
        users: Math.min(prev.users + 23, 1234),
        badges: Math.min(prev.badges + 17, 789)
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Hero image slideshow
  const heroImages = [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070',
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070'
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  // Mock live activity feed
  const mockActivities = [
    { id: 1, user: '0x742d...8923', action: 'earned 7-day streak badge', time: '2 mins ago', icon: '🏆' },
    { id: 2, user: '0x8f3a...1234', action: 'logged a workout', time: '5 mins ago', icon: '💪' },
    { id: 3, user: '0x9b2c...5678', action: 'joined FitChain', time: '8 mins ago', icon: '🎉' },
    { id: 4, user: '0x1a3b...9012', action: 'earned 30-day streak badge', time: '12 mins ago', icon: '👑' },
    { id: 5, user: '0x5d4e...3456', action: 'logged a workout', time: '15 mins ago', icon: '💪' },
  ];

  useEffect(() => {
    // Initialize activities
    setActivities(mockActivities.slice(0, 3));

    // Rotate activities every 3 seconds
    const activityInterval = setInterval(() => {
      setActivities(prev => {
        const newActivities = [...prev];
        newActivities.shift();
        const nextIndex = (mockActivities.findIndex(a => a.id === prev[prev.length - 1].id) + 1) % mockActivities.length;
        newActivities.push(mockActivities[nextIndex]);
        return newActivities;
      });
    }, 3000);

    return () => clearInterval(activityInterval);
  }, []);

  const features = [
    {
      icon: '📊',
      title: 'Track Progress',
      description: 'Log daily workouts and watch your streak grow on the blockchain',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: '🏆',
      title: 'Earn NFT Badges',
      description: 'Unlock unique achievement badges for hitting milestone streaks',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: '👥',
      title: 'Join Community',
      description: 'Compete with others and climb the global leaderboard',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: '🔗',
      title: 'Blockchain Secured',
      description: 'Your fitness data lives on-chain, owned by you forever',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const howItWorks = [
    { step: 1, title: 'Connect Wallet', icon: '🦊', description: 'Link your MetaMask wallet to get started' },
    { step: 2, title: 'Log Workouts', icon: '💪', description: 'Track your daily fitness activities' },
    { step: 3, title: 'Earn Rewards', icon: '🏅', description: 'Unlock NFT badges and build your streak' }
  ];

  const featuredBadges = [
    {
      name: '7-Day Streak',
      description: 'Awarded for logging a workout 7 days in a row.',
      image: 'https://i.imgur.com/5gQJdJk.png'
    },
    {
      name: '30-Day Streak',
      description: 'A testament to your dedication, earned after a 30-day streak.',
      image: 'https://i.imgur.com/pZ3wA2M.png'
    },
    {
      name: 'First 100km',
      description: 'Awarded for running or cycling your first 100 kilometers.',
      image: 'https://i.imgur.com/bQ8ZQ1j.png'
    }
  ];

  const partners = [
    { name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/200px-Logo_NIKE.svg.png' },
    { name: 'Adidas', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/200px-Adidas_Logo.svg.png' },
    { name: 'Under Armour', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Under_armour_logo.svg/200px-Under_armour_logo.svg.png' },
    { name: 'Polygon', logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png' },
    { name: 'Chainlink', logo: 'https://cryptologos.cc/logos/chainlink-link-logo.png' }
  ];

  const socialLinks = [
    { name: 'Twitter', icon: '𝕏', url: 'https://twitter.com/fitchain' },
    { name: 'Discord', icon: '💬', url: 'https://discord.gg/fitchain' },
    { name: 'GitHub', icon: '💻', url: 'https://github.com/fitchain' },
    { name: 'Telegram', icon: '✈️', url: 'https://t.me/fitchain' },
    { name: 'Medium', icon: '📝', url: 'https://medium.com/@fitchain' }
  ];

  return (
    <div className="relative min-h-screen bg-gray-900 overflow-x-hidden">
      {/* Hero Section with Slideshow */}
      <div className="relative h-screen">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        ))}
        
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-gray-900/70 to-gray-900" />
        
        <div className="relative h-full flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            FitChain
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mb-8 animate-fade-in-delay">
            Transform your fitness journey into NFT achievements. 
            Track workouts, build streaks, earn rewards.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-delay-2">
            {isConnected ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Go to Dashboard
              </button>
            ) : (
              <div className="connect-button-wrapper">
                <ConnectButton />
              </div>
            )}
            <button
              onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-gray-900 transition-all duration-200"
            >
              Learn More
            </button>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 animate-fade-in-delay-3">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400">{stats.workouts.toLocaleString()}</p>
              <p className="text-gray-400">Workouts Logged</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">{stats.users.toLocaleString()}</p>
              <p className="text-gray-400">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-400">{stats.badges.toLocaleString()}</p>
              <p className="text-gray-400">Badges Earned</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Live Activity Feed */}
      <section className="py-12 px-4 bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <h3 className="text-lg font-semibold text-white">Live Activity</h3>
          </div>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className={`bg-gray-900/80 border border-gray-700 rounded-full px-6 py-3 flex items-center gap-3 transform transition-all duration-500 ${
                  index === 0 ? 'scale-100 opacity-100' : index === 1 ? 'scale-95 opacity-80' : 'scale-90 opacity-60'
                }`}
              >
                <span className="text-2xl">{activity.icon}</span>
                <div className="text-sm">
                  <span className="text-blue-400 font-mono">{activity.user}</span>
                  <span className="text-gray-400 ml-2">{activity.action}</span>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Why Choose FitChain?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-6 hover:transform hover:scale-105 transition-all duration-300 border border-gray-700 hover:border-blue-500"
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center text-3xl mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-4xl mb-4">
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-sm font-bold text-blue-400 border-2 border-blue-400">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Badges Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Featured Badges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredBadges.map((badge, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6 hover:transform hover:scale-105 transition-all duration-300 border border-gray-700 hover:border-purple-500">
                <div className="w-full h-48 bg-gray-700 rounded-lg mb-4 overflow-hidden">
                  <img src={badge.image} alt={badge.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{badge.name}</h3>
                <p className="text-gray-400">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Trusted Partners
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="bg-gray-800/50 rounded-lg p-6 flex items-center justify-center h-24 hover:bg-gray-800 transition-all duration-300 border border-gray-700"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-12 filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Coming Soon to Mobile
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Take your fitness journey anywhere. Track workouts, earn badges, and stay connected with the FitChain community right from your phone.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 border border-gray-700">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-lg font-semibold">App Store</div>
                  </div>
                </button>
                <button className="bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 border border-gray-700">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35l13.69 8.5-13.69 8.5c-.5-.24-.84-.76-.84-1.35zm14.81-8.5L5.05 3.4 17.81 12l-12.76 8.6L17.81 12z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="text-lg font-semibold">Google Play</div>
                  </div>
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                * Mobile apps launching Q2 2024
              </p>
            </div>
            <div className="relative">
              <div className="relative mx-auto w-64 h-[512px]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-[3rem] transform rotate-6"></div>
                <div className="absolute inset-0 bg-gray-900 rounded-[3rem] shadow-2xl overflow-hidden">
                  <div className="bg-gray-800 h-full flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-6xl mb-4 block">📱</span>
                      <p className="text-white font-semibold">FitChain Mobile</p>
                      <p className="text-gray-400 text-sm">Coming Soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Fitness Journey?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of users earning rewards for staying healthy
          </p>
          {isConnected ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="px-12 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-full transform hover:scale-105 transition-all duration-200 shadow-xl text-lg"
            >
              Go to Dashboard
            </button>
          ) : (
            <div className="inline-block">
              <ConnectButton />
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">FitChain</h3>
              <p className="text-gray-400 mb-4">
                Transforming fitness through blockchain technology. Track, earn, and own your fitness journey.
              </p>
              <p className="text-gray-500 text-sm">
                Powered by Ever Booming Health and Wellness®
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Whitepaper</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            {/* Connect */}
            <div>
              <h4 className="text-white font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110"
                    title={social.name}
                  >
                    <span className="text-lg">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 FitChain. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
