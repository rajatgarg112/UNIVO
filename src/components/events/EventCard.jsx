import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  History,
} from 'lucide-react';
import Badge from '../ui/Badge/Badge';

const getCategoryVariant = (category) => {
  switch (category) {
    case 'Technical':
      return 'info';
    case 'Cultural':
      return 'purple';
    case 'Sports':
      return 'warning';
    case 'Entrepreneurship':
      return 'purple';
    case 'Social Service':
      return 'success';
    default:
      return 'default';
  }
};

/**
 * EventCard Component
 * Displays an individual event card with date, venue, category, organiser, and registration status.
 *
 * Demonstrates:
 * - Component composition
 * - Conditional styling based on event lifecycle and registration state
 * - Clean responsive UI
 */
function EventCard({ event, isRegistered }) {
  const {
    id,
    title,
    category,
    organiser,
    organiserClubId,
    displayDate,
    time,
    venue,
    shortDescription,
    totalSeats,
    registeredSeats,
    registrationDeadline,
    status,
  } = event;

  // Determine if event is past or registration is closed
  const isPast = status === 'Past' || new Date(event.date + 'T23:59:59') < new Date();
  const seatsLeft = Math.max(0, totalSeats - registeredSeats - (isRegistered ? 1 : 0));
  const isSoldOut = seatsLeft === 0;

  return (
    <div className={`event-card ${isPast ? 'past-event' : ''}`}>
      {/* Card Header: Category & Registration Status Badges */}
      <div className="event-card-header">
        <div className="event-card-category-box">
          <Badge variant={getCategoryVariant(category)} size="sm">
            {category}
          </Badge>
          <span className="event-fee-pill">Free</span>
        </div>

        <div className="event-card-status-badges">
          {isRegistered ? (
            <span className="event-status-badge registered">
              <CheckCircle2 size={12} /> Registered
            </span>
          ) : isPast ? (
            <span className="event-status-badge past">
              <History size={12} /> Concluded
            </span>
          ) : isSoldOut ? (
            <span className="event-status-badge full">
              <AlertTriangle size={12} /> Sold Out
            </span>
          ) : (
            <span className="event-status-badge open">
              <Sparkles size={12} /> Open
            </span>
          )}
        </div>
      </div>

      {/* Body: Title, Organiser, Meta info */}
      <div className="event-card-body">
        <h3 className="event-card-title">
          <Link to={`/events/${id}`}>{title}</Link>
        </h3>

        <div className="event-card-organiser">
          <span>By</span>
          {organiserClubId ? (
            <Link to={`/clubs/${organiserClubId}`} className="organiser-link">
              {organiser}
            </Link>
          ) : (
            <span className="organiser-name">{organiser}</span>
          )}
        </div>

        <p className="event-card-description">{shortDescription}</p>

        {/* Date, Time, Venue Specs */}
        <div className="event-card-specs">
          <div className="event-spec-item">
            <Calendar size={14} className="spec-icon" />
            <span>{displayDate}</span>
          </div>
          <div className="event-spec-item">
            <Clock size={14} className="spec-icon" />
            <span>{time}</span>
          </div>
          <div className="event-spec-item">
            <MapPin size={14} className="spec-icon" />
            <span className="truncate" title={venue}>
              {venue}
            </span>
          </div>
        </div>

        {/* Available seats progress indicator for upcoming events */}
        {!isPast && (
          <div className="event-seats-box">
            <div className="seats-text-row">
              <span className="seats-label">Seats Capacity</span>
              <span className="seats-count">
                <strong>{seatsLeft}</strong> / {totalSeats} seats left
              </span>
            </div>
            <div className="seats-progress-bar">
              <div
                className="seats-progress-fill"
                style={{
                  width: `${Math.min(100, Math.round(((totalSeats - seatsLeft) / totalSeats) * 100))}%`,
                  background: seatsLeft < 20 ? '#ef4444' : '#10b981',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Card Footer: Details Link */}
      <div className="event-card-footer">
        <span className="event-deadline-notice">
          {isPast
            ? 'Event Concluded'
            : `Deadline: ${new Date(registrationDeadline).toLocaleDateString('default', {
              month: 'short',
              day: 'numeric',
            })}`}
        </span>

        <Link to={`/events/${id}`} className="event-card-action-btn">
          <span>{isRegistered ? 'View Pass' : 'View Details'}</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default EventCard;
