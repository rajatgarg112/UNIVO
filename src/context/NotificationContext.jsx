import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext(null);

const STORAGE_KEY = 'uv_notifications';

const SAMPLE_NOTIFICATIONS = [
  {
    id: 'notif_001',
    title: 'Assignment Deadline Reminder',
    message: 'Your Data Structures assignment is due tomorrow at 11:59 PM.',
    type: 'academic',
    isRead: false,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    icon: 'BookOpen',
  },
  {
    id: 'notif_002',
    title: 'Placement Drive: TechCorp India',
    message: 'TechCorp India will be visiting campus on Feb 15. Register before Feb 10.',
    type: 'placement',
    isRead: false,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    icon: 'Briefcase',
  },
  {
    id: 'notif_003',
    title: 'Coding Club – Hackathon 2025',
    message: 'Register now for the 24-hour hackathon hosted by the Coding Club on Feb 20.',
    type: 'club',
    isRead: false,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    icon: 'Code',
  },
  {
    id: 'notif_004',
    title: 'Annual Sports Fest',
    message: 'Annual Sports Fest starts on March 1. Sign up for your preferred events.',
    type: 'event',
    isRead: true,
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    icon: 'Trophy',
  },
  {
    id: 'notif_005',
    title: 'Hostel Maintenance Notice',
    message: 'Water supply will be interrupted on Jan 28 from 10 AM to 2 PM for maintenance.',
    type: 'hostel',
    isRead: true,
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    icon: 'Home',
  },
];

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : SAMPLE_NOTIFICATIONS;
      }
      return SAMPLE_NOTIFICATIONS;
    } catch {
      return SAMPLE_NOTIFICATIONS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notif) => {
    const newNotif = {
      id: `notif_${Date.now()}`,
      isRead: false,
      timestamp: new Date().toISOString(),
      icon: 'Bell',
      ...notif,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const value = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    unreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export default NotificationContext;
