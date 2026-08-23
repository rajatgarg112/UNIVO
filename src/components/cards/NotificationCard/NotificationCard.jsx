import React from 'react';
import {
  Bell, AlertCircle, CheckCircle, Info, BookOpen,
  Calendar, MessageSquare, Trash2, Check,
} from 'lucide-react';
import './NotificationCard.css';

const TYPE_CONFIG = {
  alert:    { icon: AlertCircle,   color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  success:  { icon: CheckCircle,   color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  info:     { icon: Info,          color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
  academic: { icon: BookOpen,      color: '#818cf8', bg: 'rgba(99,102,241,0.12)' },
  event:    { icon: Calendar,      color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  message:  { icon: MessageSquare, color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
  default:  { icon: Bell,          color: '#64748b', bg: 'rgba(100,116,139,0.12)' },
};

const getRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

const NotificationCard = ({ notification = {}, onMarkRead, onDelete }) => {
  const {
    type = 'default',
    title = 'Notification',
    message = '',
    time,
    read = false,
    id,
  } = notification;

  const config = TYPE_CONFIG[type] || TYPE_CONFIG.default;
  const IconComponent = config.icon;

  return (
    <div className={`notification-card${read ? '' : ' notification-unread'}`}>
      {!read && <div className="notification-unread-indicator"></div>}
      <div
        className="notification-icon"
        style={{ background: config.bg, color: config.color }}
      >
        <IconComponent size={16} />
      </div>
      <div className="notification-content">
        <div className="notification-title">{title}</div>
        {message && <p className="notification-message">{message}</p>}
        <span className="notification-time">{getRelativeTime(time)}</span>
      </div>
      <div className="notification-actions">
        {!read && onMarkRead && (
          <button
            className="notif-action-btn"
            onClick={() => onMarkRead(id)}
            title="Mark as read"
          >
            <Check size={14} />
          </button>
        )}
        {onDelete && (
          <button
            className="notif-action-btn notif-delete-btn"
            onClick={() => onDelete(id)}
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;
