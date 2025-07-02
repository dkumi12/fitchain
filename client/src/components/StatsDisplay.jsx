export default function StatsDisplay({ userData }) {
  const formatDate = (timestamp) => {
    if (!timestamp || timestamp === 0) return 'No workouts yet';
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Your Fitness Stats</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="stat-box bg-blue-50">
          <p className="text-4xl font-bold text-blue-600">
            {userData.currentStreak}
          </p>
          <p className="text-gray-600 text-sm">Current Streak</p>
        </div>
        
        <div className="stat-box bg-green-50">
          <p className="text-4xl font-bold text-green-600">
            {userData.totalWorkouts}
          </p>
          <p className="text-gray-600 text-sm">Total Workouts</p>
        </div>
        
        <div className="stat-box bg-purple-50">
          <p className="text-4xl font-bold text-purple-600">
            {userData.longestStreak}
          </p>
          <p className="text-gray-600 text-sm">Longest Streak</p>
        </div>
        
        <div className="stat-box bg-orange-50">
          <p className="text-4xl font-bold text-orange-600">
            {userData.badges.length}
          </p>
          <p className="text-gray-600 text-sm">Badges Earned</p>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <p className="text-sm text-gray-500">
          Last workout: {formatDate(userData.lastWorkout)}
        </p>
      </div>
    </div>
  );
}