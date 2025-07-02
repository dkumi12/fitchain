import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', icon: 'home', label: 'Home' },
    { path: '/composable', icon: 'layers', label: 'Apps' },
    { path: '/log-workout', icon: 'add', label: 'Track', isMain: true },
    { path: '/community', icon: 'groups', label: 'Community' },
    { path: '/profile', icon: 'person', label: 'Profile' }
  ];

  return (
    <footer className="sticky bottom-0 z-10 bg-gray-800/90 backdrop-blur-sm border-t border-gray-700">
      <nav className="flex justify-around items-center px-2 pt-2 pb-safe">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          if (item.isMain) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center gap-0.5 w-1/5 relative"
              >
                <div className="bg-blue-500 text-white rounded-full p-3 -mt-8 shadow-lg">
                  <svg fill="currentColor" height="32px" viewBox="0 0 256 256" width="32px">
                    <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-300 mt-1">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-end gap-0.5 w-1/5 py-1 rounded-lg transition-colors ${
                isActive 
                  ? 'text-blue-500' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="flex h-7 w-7 items-center justify-center">
                {item.icon === 'home' && (
                  <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px">
                    <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"></path>
                  </svg>
                )}
                {item.icon === 'chart_line' && (
                  <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px">
                    <path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0v94.37L90.73,98a8,8,0,0,1,10.07-.38l58.81,44.11L218.73,90a8,8,0,1,1,10.54,12l-64,56a8,8,0,0,1-10.07.38L96.39,114.29,40,163.63V200H224A8,8,0,0,1,232,208Z"></path>
                  </svg>
                )}
                {item.icon === 'layers' && (
                  <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px">
                    <path d="M128,16.08a15.3,15.3,0,0,0-10.3,3.94l-88,64a8,8,0,0,0,0,13l88,64a16,16,0,0,0,20.6,0l88-64a8,8,0,0,0,0-13l-88-64A15.3,15.3,0,0,0,128,16.08ZM128,144.08,48,86l80-58.06L208,86ZM229.31,134.3l-88,64a16,16,0,0,1-20.6,0l-88-64a8,8,0,1,0-9.4,13l88,64a32,32,0,0,0,41.4,0l88-64a8,8,0,1,0-9.4-13Z"></path>
                  </svg>
                )}
                {item.icon === 'groups' && (
                  <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px">
                    <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path>
                  </svg>
                )}
                {item.icon === 'person' && (
                  <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px">
                    <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
                  </svg>
                )}
              </div>
              <p className="text-xs font-medium">{item.label}</p>
            </Link>
          );
        })}
      </nav>
      <div className="text-center text-xs text-gray-500 py-2 bg-gray-800/90">
        Ever Booming Health and Wellness
      </div>
    </footer>
  );
}
