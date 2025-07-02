import { useNavigate } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';
import Navigation from '../components/Navigation';
import { useWorkoutTracker } from '../hooks/useWorkoutTracker';
import { useUserAvatar } from '../hooks/useUserAvatar';
import { fitnessAvatars, getUserAvatars } from '../data/avatars';
import AvatarDisplay from '../components/AvatarDisplay';
import AvatarSelector from '../components/AvatarSelector';
import { useState } from 'react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { userData } = useWorkoutTracker();
  const { selectedAvatar, updateAvatar } = useUserAvatar();
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  const displayData = userData || {
    currentStreak: 0,
    totalWorkouts: 0,
    longestStreak: 0,
    hasSevenDayBadge: false,
  };

  const { available, locked } = getUserAvatars(displayData);

  const handleDisconnect = () => {
    disconnect();
    navigate('/');
  };

  const menuItems = [
    {
      icon: 'wallet',
      title: 'Wallet Address',
      subtitle: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '',
      color: 'blue',
      onClick: () => {},
    },
    {
      icon: 'history',
      title: 'Transaction History',
      subtitle: '',
      color: 'blue',
      onClick: () => navigate('/stats'),
    },
    {
      icon: 'disconnect',
      title: 'Disconnect Wallet',
      subtitle: '',
      color: 'red',
      onClick: handleDisconnect,
    },
  ];

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-gray-900 justify-between overflow-x-hidden">
      <div className="flex-grow pb-32">
        <div className="flex items-center bg-gray-900 p-4 pb-2 justify-between sticky top-0 z-10">
          <button 
            onClick={() => navigate(-1)}
            className="text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-800 transition-colors">
            <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px">
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
            </svg>
          </button>
          <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">
            Profile
          </h2>
        </div>

        <div className="flex p-6">
          <div className="flex w-full flex-col gap-6 items-center">
            <div className="flex gap-4 flex-col items-center">
              <div className="relative">
                <AvatarDisplay
                  avatarId={selectedAvatar}
                  size="xl"
                  userData={displayData}
                  showFrame={true}
                  onClick={() => setShowAvatarSelector(true)}
                  className="cursor-pointer hover:scale-105 transition-transform"
                />
                <button
                  onClick={() => setShowAvatarSelector(true)}
                  className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 rounded-full p-2 transition-colors shadow-lg"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-col items-center justify-center gap-1">
                <p className="text-white text-2xl font-bold leading-tight tracking-[-0.015em] text-center">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Fitness Enthusiast'}
                </p>
                <p className="text-gray-400 text-base font-normal leading-normal text-center">
                  Level {Math.floor(displayData.totalWorkouts / 10) + 1} Athlete
                </p>
                <p className="text-gray-400 text-sm font-normal leading-normal text-center">
                  {displayData.totalWorkouts} workouts • {displayData.currentStreak} day streak
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 space-y-3">
          {/* Avatar Collection Section */}
          <div className="bg-gray-800 rounded-xl p-4 mb-4">
            <h3 className="text-white text-lg font-semibold mb-3">Avatar Collection</h3>
            
            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Progress</span>
                <span>{available.length} / {fitnessAvatars.default.length + fitnessAvatars.unlockable.length}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(available.length / (fitnessAvatars.default.length + fitnessAvatars.unlockable.length)) * 100}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => setShowAvatarSelector(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              View All Avatars
            </button>
          </div>

          <h3 className="text-white text-lg font-semibold leading-tight tracking-[-0.015em] px-2 pb-1 pt-2">
            Account
          </h3>
          
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="flex items-center gap-4 bg-gray-800 px-4 py-3 rounded-xl w-full hover:bg-gray-700 transition-colors"
            >
              <div className={`text-${item.color}-500 flex items-center justify-center rounded-lg bg-gray-700 shrink-0 size-12 p-2`}>
                {item.icon === 'wallet' && (
                  <svg fill="currentColor" height="32px" viewBox="0 0 256 256" width="32px">
                    <path d="M216,72H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,64V192a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V88A16,16,0,0,0,216,72Zm0,128H56a8,8,0,0,1-8-8V86.63A23.84,23.84,0,0,0,56,88H216Zm-48-60a12,12,0,1,1,12,12A12,12,0,0,1,168,140Z"></path>
                  </svg>
                )}
                {item.icon === 'history' && (
                  <svg fill="currentColor" height="32px" viewBox="0 0 256 256" width="32px">
                    <path d="M136,80v43.47l36.12,21.67a8,8,0,0,1-8.24,13.72l-40-24A8,8,0,0,1,120,128V80a8,8,0,0,1,16,0Zm-8-48A95.44,95.44,0,0,0,60.08,60.15C52.81,67.51,46.35,74.59,40,82V64a8,8,0,0,0-16,0v40a8,8,0,0,0,8,8H72a8,8,0,0,0,0-16H49c7.15-8.42,14.27-16.35,22.39-24.57a80,80,0,1,1,1.66,114.75,8,8,0,1,0-11,11.64A96,96,0,1,0,128,32Z"></path>
                  </svg>
                )}
                {item.icon === 'disconnect' && (
                  <svg fill="currentColor" height="32px" viewBox="0 0 256 256" width="32px">
                    <path d="M190.63,65.37a32,32,0,0,0-45.19-.06L133.79,77.52a8,8,0,0,1-11.58-11l11.72-12.29a1.59,1.59,0,0,1,.13-.13,48,48,0,0,1,67.88,67.88,1.59,1.59,0,0,1-.13.13l-12.29,11.72a8,8,0,0,1-11-11.58l12.21-11.65A32,32,0,0,0,190.63,65.37ZM122.21,178.48l-11.65,12.21a32,32,0,0,1-45.25-45.25l12.21-11.65a8,8,0,0,0-11-11.58L54.19,133.93a1.59,1.59,0,0,0-.13.13,48,48,0,0,0,67.88,67.88,1.59,1.59,0,0,0,.13-.13l11.72-12.29a8,8,0,1,0-11.58-11ZM208,152H184a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16ZM48,104H72a8,8,0,0,0,0-16H48a8,8,0,0,0,0,16Zm112,72a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V184A8,8,0,0,0,160,176ZM96,80a8,8,0,0,0,8-8V48a8,8,0,0,0-16,0V72A8,8,0,0,0,96,80Z"></path>
                  </svg>
                )}
              </div>
              <div className="flex flex-col justify-center items-start flex-1">
                <p className={`text-${item.color === 'red' ? 'red' : 'white'} text-base font-medium leading-normal line-clamp-1`}>
                  {item.title}
                </p>
                {item.subtitle && (
                  <p className="text-gray-400 text-sm font-normal leading-normal line-clamp-2">
                    {item.subtitle}
                  </p>
                )}
              </div>
              <div className={`ml-auto text-${item.color === 'red' ? 'red-500/50' : 'gray-400'}`}>
                <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px">
                  <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Navigation />
      
      {/* Avatar Selector Modal */}
      {showAvatarSelector && (
        <AvatarSelector
          currentAvatarId={selectedAvatar}
          userData={displayData}
          onSelect={(avatarId) => {
            updateAvatar(avatarId);
            setShowAvatarSelector(false);
          }}
          onClose={() => setShowAvatarSelector(false)}
        />
      )}
    </div>
  );
}
