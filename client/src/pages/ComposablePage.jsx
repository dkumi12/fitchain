import { useAccount } from 'wagmi';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import RewardsSection from '../components/RewardsSection';
import LeaderboardSection from '../components/LeaderboardSection';

export default function ComposablePage() {
  const { isConnected, address } = useAccount();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Connect your wallet to access composable features</h2>
          <Link 
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const composableExamples = [
    {
      title: "FitChain Rewards",
      description: "Earn ETH rewards for your workouts",
      status: "✅ Live on Sepolia",
      address: "0x08d24C60c37D363D8201C665CF575F77604462D0",
      features: [
        "0.001 ETH per workout",
        "2x bonus for 7+ day streaks",
        "Instant claiming",
        "Funded reward pool"
      ]
    },
    {
      title: "Global Leaderboard",
      description: "Compete with other fitness enthusiasts",
      status: "✅ Live on Sepolia",
      address: "0x02C141d3DCc8A69aeb1a3390Bf76176726bc2a73",
      features: [
        "Top 100 users ranked",
        "Update position hourly",
        "Track longest streaks",
        "Global competition"
      ]
    },
    {
      title: "Badge Marketplace",
      description: "Trade your achievement NFTs",
      status: "🚧 Coming Soon",
      address: "Not deployed",
      features: [
        "List badges for sale",
        "2.5% marketplace fee",
        "Instant transfers",
        "Price discovery"
      ]
    },
    {
      title: "Fitness DAO",
      description: "Governance based on workout activity",
      status: "📋 Planned",
      features: [
        "Voting power from workouts",
        "Propose new features",
        "Community treasury",
        "Decentralized decisions"
      ]
    },
    {
      title: "DeFi Integration",
      description: "Stake badges for yield",
      status: "📋 Planned",
      features: [
        "Stake NFT badges",
        "Earn passive income",
        "Liquidity pools",
        "Cross-chain bridges"
      ]
    },
    {
      title: "Game Integration",
      description: "Use fitness data in Web3 games",
      status: "📋 Planned",
      features: [
        "Character buffs from workouts",
        "Special abilities from badges",
        "Cross-game compatibility",
        "Play-to-earn mechanics"
      ]
    }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto p-4 pb-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            FitChain Composability
          </h1>
          <p className="text-gray-300 text-lg">
            Other developers can build on top of FitChain's smart contracts. Here are live examples!
          </p>
        </div>

        {/* Live Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <RewardsSection />
          <LeaderboardSection />
        </div>

        {/* All Composable Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">🧩 Composable Ecosystem</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {composableExamples.map((example, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold">{example.title}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-700">
                    {example.status}
                  </span>
                </div>
                <p className="text-gray-400 mb-4">{example.description}</p>
                
                {example.address && example.address !== "Not deployed" && (
                  <div className="mb-4 p-3 bg-gray-900 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Contract Address</p>
                    <p className="font-mono text-xs text-blue-400 break-all">
                      {example.address}
                    </p>
                  </div>
                )}

                <ul className="space-y-2">
                  {example.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Details */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">🔧 How It Works</h2>
          <div className="space-y-4 text-gray-300">
            <p>
              FitChain's main contract (<code className="text-blue-400">0x259e2B7208F181D302447BF717d01d4d87D2cADA</code>) 
              exposes public functions that other contracts can call:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><code className="text-green-400">getUserData()</code> - Get workout stats for any user</li>
              <li><code className="text-green-400">getStreak()</code> - Check current streak</li>
              <li><code className="text-green-400">getUserBadges()</code> - List NFT badges owned</li>
              <li><code className="text-green-400">Events</code> - Listen to WorkoutLogged, BadgeMinted</li>
            </ul>
            <p>
              This allows developers to build DeFi protocols, games, marketplaces, and more 
              that integrate with real fitness data!
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center mt-12">
          <h3 className="text-xl font-semibold mb-4">Want to build on FitChain?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://sepolia.etherscan.io/address/0x259e2B7208F181D302447BF717d01d4d87D2cADA#code"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              View Contract on Etherscan
            </a>
            <a
              href="https://github.com/fitchain"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              GitHub Documentation
            </a>
          </div>
        </section>
      </div>

      <Navigation />
    </div>
  );
}