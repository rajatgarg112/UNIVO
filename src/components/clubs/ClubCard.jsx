import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  ArrowRight,
  CheckCircle,
  UserPlus,
  LogOut,
  Code,
  Cpu,
  Music,
  Sparkles,
  Trophy,
  Rocket,
  HeartHandshake,
  Camera,
} from 'lucide-react';
import Badge from '../ui/Badge/Badge';

// Helper icon resolver for club types
const renderClubIcon = (iconName, color) => {
  const iconProps = { size: 24, color: color || '#D71920' };
  switch (iconName) {
    case 'Code':
      return <Code {...iconProps} />;
    case 'Cpu':
      return <Cpu {...iconProps} />;
    case 'Music':
      return <Music {...iconProps} />;
    case 'Sparkles':
      return <Sparkles {...iconProps} />;
    case 'Trophy':
      return <Trophy {...iconProps} />;
    case 'Rocket':
      return <Rocket {...iconProps} />;
    case 'HeartHandshake':
      return <HeartHandshake {...iconProps} />;
    case 'Camera':
      return <Camera {...iconProps} />;
    default:
      return <Users {...iconProps} />;
  }
};

// Category badge variant mapping
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
 * ClubCard Component
 * Displays a single university club card.
 *
 * Demonstrates:
 * - Component composition
 * - Prop drilling & handler invocation
 * - Conditional rendering based on membership state
 */
function ClubCard({ club, isMember, onToggleMembership }) {
  const {
    id,
    name,
    category,
    tagline,
    membersCount,
    meetingSchedule,
    icon,
    color,
  } = club;

  return (
    <div className="club-card">
      {/* Top Header: Icon & Category */}
      <div className="club-card-header">
        <div
          className="club-card-avatar"
          style={{ background: `${color || '#D71920'}18`, borderColor: `${color || '#D71920'}33` }}
        >
          {renderClubIcon(icon, color)}
        </div>
        <div className="club-card-header-meta">
          <Badge variant={getCategoryVariant(category)} size="sm">
            {category}
          </Badge>
          {isMember ? (
            <span className="club-status-pill member">
              <CheckCircle size={12} /> Member
            </span>
          ) : (
            <span className="club-status-pill open">Open</span>
          )}
        </div>
      </div>

      {/* Body: Title, Tagline, Stats */}
      <div className="club-card-body">
        <h3 className="club-card-title">
          <Link to={`/clubs/${id}`}>{name}</Link>
        </h3>
        <p className="club-card-tagline">{tagline}</p>

        <div className="club-card-meta-list">
          <div className="club-meta-item">
            <Users size={14} className="club-meta-icon" />
            <span>{membersCount + (isMember ? 1 : 0)} Members</span>
          </div>
          <div className="club-meta-item">
            <Calendar size={14} className="club-meta-icon" />
            <span className="truncate" title={meetingSchedule}>
              {meetingSchedule}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions: Join / Leave & Details Link */}
      <div className="club-card-footer">
        <button
          type="button"
          className={`club-action-btn ${isMember ? 'leave' : 'join'}`}
          onClick={() => onToggleMembership(club)}
          title={isMember ? 'Leave this club' : 'Join this club'}
        >
          {isMember ? (
            <>
              <LogOut size={14} /> Leave Club
            </>
          ) : (
            <>
              <UserPlus size={14} /> Join Club
            </>
          )}
        </button>

        <Link to={`/clubs/${id}`} className="club-details-link">
          <span>Explore</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default ClubCard;
