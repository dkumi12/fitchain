import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  notifications: [],
  
  addNotification: (notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      ...notification,
      timestamp: new Date(),
      status: 'pending', // pending, confirming, success, error
    };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification]
    }));
    
    // Auto-remove after timeout if not permanent
    if (!notification.permanent && notification.duration !== 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));
      }, notification.duration || 8000);
    }
    
    return id;
  },
  
  updateNotification: (id, updates) => {
    set((state) => ({
      notifications: state.notifications.map(n => 
        n.id === id ? { ...n, ...updates } : n
      )
    }));
  },
  
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },
  
  clearOldNotifications: () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    set((state) => ({
      notifications: state.notifications.filter(n => 
        n.permanent || n.timestamp > fiveMinutesAgo
      )
    }));
  }
}));