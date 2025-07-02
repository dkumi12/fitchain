export default function Hero() {
  return (
    <div className="max-w-4xl mx-auto text-center py-20">
      <h2 className="text-5xl font-bold mb-6 gradient-fitchain bg-clip-text text-transparent">
        Your Fitness Journey, On-Chain
      </h2>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Track your workouts, build consistency, and earn NFT achievement badges. 
        Connect your wallet to start your decentralized fitness journey.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        <div className="card">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
          <p className="text-gray-600">
            Log daily workouts and watch your streak grow on the blockchain
          </p>
        </div>
        
        <div className="card">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-xl font-semibold mb-2">Earn Badges</h3>
          <p className="text-gray-600">
            Unlock NFT achievement badges for hitting milestone streaks
          </p>
        </div>
        
        <div className="card">
          <div className="text-4xl mb-4">🔗</div>          <h3 className="text-xl font-semibold mb-2">Fully Decentralized</h3>
          <p className="text-gray-600">
            Your fitness data lives on-chain, owned by you forever
          </p>
        </div>
      </div>

      <div className="mt-16 p-6 bg-primary-50 rounded-lg">
        <p className="text-primary-800 font-medium">
          🚀 Connect your wallet above to start tracking workouts and earning rewards!
        </p>
      </div>
    </div>
  );
}
