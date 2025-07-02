import { useNavigate, useParams } from 'react-router-dom';
import Navigation from '../components/Navigation';

export default function BadgeDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const badges = {
    '10-day': {
      name: '10-Day Streak',
      description: 'Congratulations! You\'ve completed a 10-day workout streak, showcasing your commitment and determination.',
      image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=800&h=450&fit=crop',
      dateEarned: 'December 15, 2023',
      activity: 'Mixed Workouts',
      streak: '10 days',
      duration: '300 minutes total',
    },
    '30-day': {
      name: '30-Day Warrior',
      description: 'An incredible achievement! You\'ve maintained a 30-day workout streak, proving your dedication to fitness.',
      image: 'https://images.unsplash.com/photo-1540331547168-8b63109225b7?q=80&w=800&h=450&fit=crop',
      dateEarned: 'January 15, 2024',
      activity: 'Mixed Workouts',
      streak: '30 days',
      duration: '900 minutes total',
    },
    '50-day': {
      name: '50-Day Champion',
      description: 'Elite status achieved! Your 50-day streak places you among the most dedicated fitness enthusiasts.',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800&h=450&fit=crop',
      dateEarned: 'Not earned yet',
      activity: 'Mixed Workouts',
      streak: '50 days',
      duration: '1500 minutes total',
    },
  };

  const badge = badges[id] || badges['10-day'];

  return (
    <div className="relative flex size-full min-h-screen flex-col justify-between bg-gray-900 overflow-x-hidden">
      <div className="flex-grow pb-32">
        <header className="sticky top-0 z-10 flex items-center bg-gray-900/80 backdrop-blur-md p-4 pb-3 justify-between shadow-sm border-b border-gray-700">
          <button 
            onClick={() => navigate(-1)}
            className="text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-800 transition-colors">
            <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px">
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
            </svg>
          </button>
          <h2 className="text-white text-xl font-semibold leading-tight tracking-tight flex-1 text-center pr-10">
            Badge Details
          </h2>
        </header>

        <main className="pb-8">
          <div className="aspect-[16/9]">
            <div className="w-full h-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden"
              style={{ backgroundImage: `url("${badge.image}")` }}>
              <div className="bg-gradient-to-t from-gray-900/80 to-transparent p-6 pt-12">
                <h1 className="text-white text-3xl font-bold leading-tight tracking-tight drop-shadow-md">
                  {badge.name}
                </h1>
              </div>
            </div>
          </div>

          <div className="px-5 pt-6">
            <p className="text-gray-400 text-base font-normal leading-relaxed pb-6">
              {badge.description}
            </p>
            
            <h3 className="text-white text-lg font-semibold leading-tight tracking-tight pb-3 pt-2 border-b border-gray-700 mb-3">
              Details
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <p className="text-gray-400 text-sm font-medium leading-normal">Date Earned</p>
                <p className="text-white text-sm font-normal leading-normal">{badge.dateEarned}</p>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <p className="text-gray-400 text-sm font-medium leading-normal">Activity</p>
                <p className="text-white text-sm font-normal leading-normal">{badge.activity}</p>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <p className="text-gray-400 text-sm font-medium leading-normal">Streak</p>
                <p className="text-white text-sm font-normal leading-normal">{badge.streak}</p>
              </div>
              <div className="flex justify-between items-center py-3">
                <p className="text-gray-400 text-sm font-medium leading-normal">Duration</p>
                <p className="text-white text-sm font-normal leading-normal">{badge.duration}</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 bg-gray-800/90 backdrop-blur-md shadow-t-strong border-t border-gray-700">
        <div className="px-4 py-4">
          <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-6 bg-blue-500 text-white text-lg font-bold leading-normal tracking-wide hover:bg-blue-600 transition-opacity">
            <svg className="mr-2" fill="currentColor" height="20" viewBox="0 0 256 256" width="20">
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
            </svg>
            <span className="truncate">Share Badge</span>
          </button>
        </div>
        <Navigation />
      </footer>
    </div>
  );
}
