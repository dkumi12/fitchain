export default function LogWorkoutButton({ onLog, canLog, isLoading }) {
  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4">Log Today's Workout</h3>
      
      {canLog ? (
        <>
          <p className="text-gray-600 mb-6">
            Ready to log your workout? Keep your streak alive! 🔥
          </p>
          <button
            onClick={onLog}
            disabled={isLoading}
            className="w-full gradient-fitchain text-white px-6 py-3 rounded-lg font-semibold 
                     hover:opacity-90 transition-opacity duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="spinner w-5 h-5"></div>
                <span>Logging workout...</span>
              </>
            ) : (
              <>
                <span>Log Workout</span>
                <span className="text-2xl">💪</span>
              </>
            )}
          </button>
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500 mb-2">
            You've already logged a workout today! 
          </p>
          <p className="text-sm text-gray-400">
            Come back tomorrow to continue your streak.
          </p>
        </div>
      )}
    </div>
  );
}