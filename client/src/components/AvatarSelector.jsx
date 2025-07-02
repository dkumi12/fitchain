import { useState } from 'react';
import { fitnessAvatars, getUserAvatars, isAvatarUnlocked } from '../data/avatars';
import AvatarDisplay from './AvatarDisplay';

export default function AvatarSelector({ 
  currentAvatarId, 
  userData, 
  onSelect,
  onClose 
}) {
  const [selectedTab, setSelectedTab] = useState('available');
  const { available, locked } = getUserAvatars(userData);

  const tabs = [
    { id: 'available', label: 'Available', count: available.length },
    { id: 'locked', label: 'Locked', count: locked.length }
  ];

  const displayAvatars = selectedTab === 'available' ? available : locked;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Choose Your Avatar</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-4 mt-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Avatar Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-6">
            {displayAvatars.map(avatar => {
              const isSelected = currentAvatarId === avatar.id;
              const isLocked = !isAvatarUnlocked(avatar, userData);
              
              return (
                <div
                  key={avatar.id}
                  className={`
                    text-center p-4 rounded-lg border-2 transition-all
                    ${isLocked ? 'border-gray-700 bg-gray-800/50' : 'border-gray-700 hover:border-blue-500 cursor-pointer'}
                    ${isSelected ? 'border-blue-500 bg-blue-500/20' : ''}
                  `}
                  onClick={() => !isLocked && onSelect(avatar.id)}
                >
                  <AvatarDisplay
                    avatarId={avatar.id}
                    size="md"
                    userData={userData}
                    showFrame={false}
                    isLocked={isLocked}
                  />
                  
                  <h3 className={`mt-3 font-semibold ${isLocked ? 'text-gray-500' : 'text-white'}`}>
                    {avatar.name}
                  </h3>
                  
                  <p className="text-xs text-gray-400 mt-1">
                    {avatar.description}
                  </p>
                  
                  {avatar.requirement && (
                    <div className={`mt-2 text-xs ${isLocked ? 'text-red-400' : 'text-green-400'}`}>
                      {isLocked ? '🔒 ' : '✓ '}
                      {avatar.requirement.type === 'streak' && `${avatar.requirement.value}-day streak`}
                      {avatar.requirement.type === 'totalWorkouts' && `${avatar.requirement.value} workouts`}
                      {avatar.requirement.type === 'badge' && 'Earn a badge'}
                    </div>
                  )}
                  
                  {isSelected && (
                    <div className="mt-2">
                      <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                        Current
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Info */}
        <div className="p-6 border-t border-gray-700 bg-gray-800/50">
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-gray-400">
                Unlocked: <span className="text-white font-semibold">{available.length}</span> / {fitnessAvatars.default.length + fitnessAvatars.unlockable.length}
              </p>
            </div>
            <div className="text-gray-400">
              Keep working out to unlock more avatars! 💪
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}