import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { useWorkoutTracker } from '../hooks/useWorkoutTracker';
import { useNotificationStore } from '../stores/notificationStore';
import Navigation from '../components/Navigation';

export default function LogWorkoutPage() {
  const navigate = useNavigate();
  const { isConnected, connect } = useWallet();
  const { logWorkout, canLogWorkout, isLoading } = useWorkoutTracker();
  const { addNotification } = useNotificationStore();

  const [workoutType, setWorkoutType] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [distance, setDistance] = useState('');
  const [distanceUnit, setDistanceUnit] = useState('km');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConnected) {
      addNotification({
        status: 'error',
        title: 'Wallet Not Connected',
        message: 'Please connect your wallet to log a workout.',
        duration: 4000,
      });
      await connect();
      return;
    }

    if (!canLogWorkout) {
      addNotification({
        status: 'error',
        title: 'Already Logged Today',
        message: 'You can only log one workout per day.',
        duration: 4000,
      });
      return;
    }

    try {
      await logWorkout({
        workoutType: workoutType || 'General',
        duration: Number(duration) || 30,
        date: new Date(date).getTime(),
        distance: Number(distance) || 0,
        distanceUnit,
        notes
      });

      // Success notification handled in hook
      // Navigate after a delay to show the success notification
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      console.error('Error logging workout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-xl p-6 md:p-8 mt-10">
        <h2 className="text-3xl font-bold text-center mb-6">Log Your Workout</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="workoutType" className="block text-sm font-medium text-gray-300 mb-1">Workout Type</label>
            <select
              id="workoutType"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
              value={workoutType}
              onChange={(e) => setWorkoutType(e.target.value)}
              required
            >
              <option value="">Select a type</option>
              <option value="Running">Running</option>
              <option value="Cycling">Cycling</option>
              <option value="Weightlifting">Weightlifting</option>
              <option value="Yoga">Yoga</option>
              <option value="Swimming">Swimming</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-1">Duration (minutes)</label>
            <input
              type="number"
              id="duration"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 60"
              min="1"
              required
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">Date</label>
            <input
              type="date"
              id="date"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="distance" className="block text-sm font-medium text-gray-300 mb-1">Distance (optional)</label>
            <div className="flex gap-2">
              <input
                type="number"
                id="distance"
                className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="e.g., 5.2"
                step="0.1"
              />
              <select
                className="p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
                value={distanceUnit}
                onChange={(e) => setDistanceUnit(e.target.value)}
              >
                <option value="km">km</option>
                <option value="miles">miles</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">Notes (optional)</label>
            <textarea
              id="notes"
              rows="3"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional details about your workout..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Logging...' : 'Log Workout'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="w-full mt-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200"
          >
            Cancel
          </button>
        </form>
      </div>
      <Navigation />
    </div>
  );
}