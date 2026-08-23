import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import Badge from '../../ui/Badge/Badge';
import './EventCard.css';

const BADGE_VARIANTS = {
  Workshop: 'info',
  Seminar: 'purple',
  Cultural: 'warning',
  Sports: 'success',
  Tech: 'info',
  Academic: 'default',
  Other: 'default',
};

const useCountdown = (targetDate) => {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    if (!targetDate) return;
    const update = () => {
      const diff = new Date(targetDate) - Date.now();
      if (diff <= 0) { setCountdown('Started'); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      if (d > 0) setCountdown(`${d}d ${h}h left`);
      else if (h > 0) setCountdown(`${h}h ${m}m left`);
      else setCountdown(`${m}m left`);
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [targetDate]);

  return countdown;
};

const EventCard = ({ event = {}, onRegister, compact = false }) => {
  const {
    title = 'Event Title',
    type = 'Other',
    date = '',
    time = '',
    venue = 'Main Campus',
    participants = 0,
    maxParticipants,
    color = '#6366f1',
    registered = false,
    image,
  } = event;

  const countdown = useCountdown(date);
  const badgeVariant = BADGE_VARIANTS[type] || 'default';

  return (
    <div className={`event-card${compact ? ' event-card-compact' : ''}`}>
      {/* Header */}
      <div
        className="event-card-header"
        style={{
          background: image
            ? `url(${image}) center/cover`
            : `linear-gradient(135deg, ${color}cc, ${color}55)`,
        }}
      >
        <Badge variant={badgeVariant}>{type}</Badge>
        {countdown && (
          <span className="event-countdown">
            <Clock size={11} />
            {countdown}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="event-card-body">
        <h3 className="event-title">{title}</h3>
        <div className="event-meta">
          <div className="event-meta-item">
            <Calendar size={13} />
            <span>{date} {time && `• ${time}`}</span>
          </div>
          <div className="event-meta-item">
            <MapPin size={13} />
            <span>{venue}</span>
          </div>
          <div className="event-meta-item">
            <Users size={13} />
            <span>
              {participants} registered
              {maxParticipants ? ` / ${maxParticipants}` : ''}
            </span>
          </div>
        </div>

        {!compact && (
          <button
            className={`event-register-btn${registered ? ' registered' : ''}`}
            style={{ '--event-color': color }}
            onClick={() => onRegister && onRegister(event)}
            disabled={registered}
          >
            {registered ? '✓ Registered' : 'Register Now'}
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
