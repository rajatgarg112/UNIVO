/**
 * notificationService.js – Frontend-only notification service for UniversityVerse
 * Reads and writes notifications to localStorage.
 */

import { getItem, setItem } from '../utils/storageUtils';

const STORAGE_KEY = 'uv_notifications';

// ─── Sample Seed Data ─────────────────────────────────────────────────────────

const SEED_NOTIFICATIONS = [
  {
    id: 'notif_001',
    title: 'Assignment Deadline Reminder',
    message: 'Your Data Structures assignment is due tomorrow at 11:59 PM.',
    type: 'academic',
    isRead: false,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    icon: 'BookOpen',
    userId: 'STU001',
  },
  {
    id: 'notif_002',
    title: 'Placement Drive: TechCorp India',
    message: 'TechCorp India will be visiting campus on Feb 15. Register before Feb 10.',
    type: 'placement',
    isRead: false,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    icon: 'Briefcase',
    userId: 'STU001',
  },
  {
    id: 'notif_003',
    title: 'Coding Club – Hackathon 2025',
    message: 'Register now for the 24-hour hackathon hosted by the Coding Club on Feb 20.',
    type: 'club',
    isRead: false,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    icon: 'Code',
    userId: 'STU001',
  },
  {
    id: 'notif_004',
    title: 'Annual Sports Fest',
    message: 'Annual Sports Fest starts on March 1. Sign up for your preferred events.',
    type: 'event',
    isRead: true,
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    icon: 'Trophy',
    userId: 'STU001',
  },
  {
    id: 'notif_005',
    title: 'Hostel Maintenance Notice',
    message: 'Water supply will be interrupted on Jan 28 from 10 AM to 2 PM for maintenance.',
    type: 'hostel',
    isRead: true,
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    icon: 'Home',
    userId: 'STU001',
  },
  {
    id: 'notif_006',
    title: 'Library Book Due Soon',
    message: 'Your borrowed book "Clean Code" is due in 2 days. Please return or renew.',
    type: 'academic',
    isRead: false,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    icon: 'BookOpen',
    userId: 'STU002',
  },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

function loadAll() {
  const stored = getItem(STORAGE_KEY, null);
  if (!stored || !Array.isArray(stored) || stored.length === 0) {
    setItem(STORAGE_KEY, SEED_NOTIFICATIONS);
    return SEED_NOTIFICATIONS;
  }
  return stored;
}

function saveAll(notifications) {
  setItem(STORAGE_KEY, notifications);
}

// ─── Service Functions ────────────────────────────────────────────────────────

/**
 * getNotifications(userId) → notifications array for a specific user
 * If userId is null/undefined, returns all notifications
 */
export function getNotifications(userId) {
  const all = loadAll();
  if (!userId) return all;
  return all.filter((n) => !n.userId || n.userId === userId);
}

/**
 * getUnreadCount(userId) → number of unread notifications
 */
export function getUnreadCount(userId) {
  return getNotifications(userId).filter((n) => !n.isRead).length;
}

/**
 * markRead(notificationId) → updates localStorage, returns updated notification
 */
export function markRead(notificationId) {
  const all = loadAll();
  const updated = all.map((n) =>
    n.id === notificationId ? { ...n, isRead: true } : n
  );
  saveAll(updated);
  return updated.find((n) => n.id === notificationId) || null;
}

/**
 * markAllRead(userId) → marks all notifications for a user as read
 */
export function markAllRead(userId) {
  const all = loadAll();
  const updated = all.map((n) =>
    !n.userId || n.userId === userId ? { ...n, isRead: true } : n
  );
  saveAll(updated);
  return updated;
}

/**
 * getNotificationsByType(type) → filtered array by type
 * type: 'academic' | 'placement' | 'club' | 'event' | 'hostel'
 */
export function getNotificationsByType(type) {
  const all = loadAll();
  if (!type) return all;
  return all.filter((n) => n.type === type);
}

/**
 * addNotification(notification) → saves new notification to localStorage
 */
export function addNotification(notification) {
  const all = loadAll();
  const newNotif = {
    id: `notif_${Date.now()}`,
    isRead: false,
    timestamp: new Date().toISOString(),
    icon: 'Bell',
    ...notification,
  };
  const updated = [newNotif, ...all];
  saveAll(updated);
  return newNotif;
}

/**
 * deleteNotification(notificationId) → removes a notification
 */
export function deleteNotification(notificationId) {
  const all = loadAll();
  const updated = all.filter((n) => n.id !== notificationId);
  saveAll(updated);
  return updated;
}
