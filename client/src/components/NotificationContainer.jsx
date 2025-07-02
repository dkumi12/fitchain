import { useEffect } from 'react';
import { useNotificationStore } from '../stores/notificationStore';

export default function NotificationContainer() {
  const { notifications, removeNotification, clearOldNotifications } = useNotificationStore();

  // Clear old notifications periodically
  useEffect(() => {
    const interval = setInterval(() => {
      clearOldNotifications();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [clearOldNotifications]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}

function NotificationItem({ notification, onClose }) {
  const getStatusColor = () => {
    switch (notification.status) {
      case 'success': return 'border-green-500 bg-green-900/20';
      case 'error': return 'border-red-500 bg-red-900/20';
      case 'confirming': return 'border-yellow-500 bg-yellow-900/20';
      default: return 'border-blue-500 bg-blue-900/20';
    }
  };

  const getIcon = () => {
    if (notification.icon) return notification.icon;
    switch (notification.status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'confirming': return '⏳';
      default: return '📢';
    }
  };

  const getTimeSince = () => {
    const seconds = Math.floor((new Date() - notification.timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes === 1) return '1 minute ago';
    return `${minutes} minutes ago`;
  };

  return (
    <div className={`
      relative bg-gray-800 rounded-lg p-4 shadow-lg border 
      ${getStatusColor()}
      animate-slide-in-right
      ${notification.status === 'confirming' ? 'animate-pulse' : ''}
    `}>
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
        title="Close notification"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex items-start gap-3 pr-8">
        <span className="text-2xl flex-shrink-0">{getIcon()}</span>
        
        <div className="flex-1">
          <h4 className="font-semibold text-white">
            {notification.title}
          </h4>
          
          <p className="text-sm text-gray-300 mt-1">
            {notification.message}
          </p>

          {notification.status === 'confirming' && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="animate-spin h-3 w-3 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
                <span className="text-xs text-yellow-400">Waiting for confirmation...</span>
              </div>
            </div>
          )}

          {notification.txHash && (
            <a
              href={`https://sepolia.etherscan.io/tx/${notification.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-2"
            >
              View on Etherscan
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-500">{getTimeSince()}</span>
            
            {notification.action && (
              <button
                onClick={notification.action.onClick}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
              >
                {notification.action.label}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}