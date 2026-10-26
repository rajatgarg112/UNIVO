import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Calendar,
  MapPin,
  Mail,
  Building,
  Target,
  Activity,
  CheckCircle,
  UserPlus,
  LogOut,
  Sparkles,
  ArrowRight,
  Code,
  Cpu,
  Music,
  Trophy,
  Rocket,
  HeartHandshake,
  Camera,
  AlertCircle,
} from 'lucide-react';
import initialClubs from '../../data/clubs.json';
import initialEvents from '../../data/events.json';
import Badge from '../../components/ui/Badge/Badge';
import Toast from '../../components/ui/Toast/Toast';
import Modal from '../../components/ui/Modal/Modal';
import useClubMemberships from '../../hooks/useClubMemberships';
import { useNotifications } from '../../context/NotificationContext';
import './ClubDetails.css';

// Helper to resolve icon
const renderClubIcon = (iconName, color) => {
  const iconProps = { size: 32, color: color || '#D71920' };
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
 * Page 2: Club Details (/clubs/:clubId)
 * Dynamic club profile page fetching parameters via React Router useParams().
 */
const ClubDetails = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();

  const [toast, setToast] = useState(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  // Custom membership hook
  const { isMember, joinClub, leaveClub } = useClubMemberships();
  const { addNotification } = useNotifications();

  // Find club by ID
  const club = initialClubs.find((c) => c.id === clubId) || null;

  // Sync document title and scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (club) {
      document.title = `${club.name} | UNIVO Clubs`;
    } else {
      document.title = 'Club Not Found | UNIVO';
    }
  }, [club]);

  // Find upcoming events organized by this club (filter out Past status)
  const upcomingClubEvents = club
    ? initialEvents.filter(
        (evt) =>
          evt.status !== 'Past' &&
          (evt.organiserClubId === club.id || club.upcomingEventIds?.includes(evt.id))
      )
    : [];

  // Find related clubs (same category, excluding current)
  const relatedClubs = club
    ? initialClubs
        .filter((c) => c.category === club.category && c.id !== club.id)
        .slice(0, 3)
    : [];

  const currentlyMember = club ? isMember(club.id) : false;

  // Membership action handler
  const handleToggleMembership = () => {
    if (!club) return;

    if (currentlyMember) {
      setIsLeaveModalOpen(true);
    } else {
      const res = joinClub(club.id, club.name);
      if (res.success) {
        setToast({ message: res.message, type: 'success' });
        try {
          addNotification({
            title: `Joined ${club.name}`,
            message: `You are now a registered member of ${club.name}. Welcome to the community!`,
            type: 'club',
          });
        } catch {
          // Optional notification safety
        }
      }
    }
  };

  const confirmLeave = () => {
    if (!club) return;
    const res = leaveClub(club.id, club.name);
    setToast({ message: res.message, type: 'info' });
    setIsLeaveModalOpen(false);
  };

  // ── Proper Not-Found State ──
  if (!club) {
    return (
      <div className="club-not-found-page">
        <div className="not-found-card">
          <div className="not-found-icon">
            <AlertCircle size={44} />
          </div>
          <h2 className="not-found-title">Club Not Found</h2>
          <p className="not-found-text">
            We couldn't find any student society registered with the ID "
            <strong>{clubId}</strong>". The club may have been renamed or relocated.
          </p>
          <div className="not-found-actions">
            <Link to="/clubs" className="btn-back-to-clubs">
              <ArrowLeft size={16} />
              <span>Back to Clubs Directory</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="club-details-page">
      {/* ── Top Navigation Breadcrumb ── */}
      <div className="club-details-nav-row">
        <button
          type="button"
          className="btn-back"
          onClick={() => navigate('/clubs')}
          title="Back to clubs"
        >
          <ArrowLeft size={16} />
          <span>Back to Clubs</span>
        </button>

        <div className="club-nav-breadcrumb">
          <Link to="/dashboard">Dashboard</Link>
          <span>/</span>
          <Link to="/clubs">Clubs</Link>
          <span>/</span>
          <span className="current">{club.name}</span>
        </div>
      </div>

      {/* ── Club Hero Banner ── */}
      <div className="club-hero-card">
        <div className="club-hero-left">
          <div
            className="club-hero-avatar"
            style={{
              background: `${club.color || '#D71920'}18`,
              borderColor: `${club.color || '#D71920'}40`,
            }}
          >
            {renderClubIcon(club.icon, club.color)}
          </div>
          <div className="club-hero-info">
            <div className="club-hero-badges">
              <Badge variant={getCategoryVariant(club.category)} size="md">
                {club.category}
              </Badge>
              <span className="club-established-pill">Est. {club.established}</span>
              {currentlyMember ? (
                <span className="club-status-pill member">
                  <CheckCircle size={13} /> Active Member
                </span>
              ) : (
                <span className="club-status-pill open">Open for Membership</span>
              )}
            </div>

            <h1 className="club-hero-title">{club.name}</h1>
            <p className="club-hero-tagline">{club.tagline}</p>
          </div>
        </div>

        {/* Hero Actions */}
        <div className="club-hero-actions">
          <button
            type="button"
            className={`btn-hero-membership ${currentlyMember ? 'leave' : 'join'}`}
            onClick={handleToggleMembership}
          >
            {currentlyMember ? (
              <>
                <LogOut size={16} /> Leave Club
              </>
            ) : (
              <>
                <UserPlus size={16} /> Join Club
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Main Layout: Content & Sidebar ── */}
      <div className="club-details-layout">
        {/* Left Column: Mission, Objectives, Activities, Events */}
        <div className="club-details-main">
          {/* 1. About / Description */}
          <section className="club-section-card">
            <h2 className="section-title">About the Society</h2>
            <p className="club-full-description">{club.description}</p>
          </section>

          {/* 2. Objectives */}
          {club.objectives && club.objectives.length > 0 && (
            <section className="club-section-card">
              <div className="section-title-box">
                <Target size={20} className="section-icon red" />
                <h2 className="section-title">Core Objectives</h2>
              </div>
              <ul className="objectives-list">
                {club.objectives.map((obj, idx) => (
                  <li key={idx} className="objective-item">
                    <span className="objective-bullet">{idx + 1}</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 3. Key Activities */}
          {club.activities && club.activities.length > 0 && (
            <section className="club-section-card">
              <div className="section-title-box">
                <Activity size={20} className="section-icon blue" />
                <h2 className="section-title">Key Activities & Initiatives</h2>
              </div>
              <div className="activities-grid">
                {club.activities.map((act, idx) => (
                  <div key={idx} className="activity-card">
                    <Sparkles size={16} className="activity-icon" />
                    <p>{act}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 4. Upcoming Club Events */}
          <section className="club-section-card">
            <div className="section-title-box">
              <Calendar size={20} className="section-icon purple" />
              <h2 className="section-title">Upcoming Club Events</h2>
            </div>

            {upcomingClubEvents.length === 0 ? (
              <p className="no-events-text">
                No active events currently scheduled for {club.name}. Stay tuned for upcoming
                announcements!
              </p>
            ) : (
              <div className="club-events-list">
                {upcomingClubEvents.map((evt) => (
                  <div key={evt.id} className="club-event-item">
                    <div className="club-event-date-badge">
                      <span className="event-badge-month">
                        {new Date(evt.date).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="event-badge-day">
                        {new Date(evt.date).getDate()}
                      </span>
                    </div>

                    <div className="club-event-details">
                      <h4 className="club-event-title">
                        <Link to={`/events/${evt.id}`}>{evt.title}</Link>
                      </h4>
                      <p className="club-event-desc">{evt.shortDescription}</p>
                      <div className="club-event-meta">
                        <span>
                          <Calendar size={13} /> {evt.displayDate}
                        </span>
                        <span>
                          <MapPin size={13} /> {evt.venue}
                        </span>
                      </div>
                    </div>

                    <Link to={`/events/${evt.id}`} className="btn-event-view">
                      <span>View</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Meeting Info, Faculty, Student Lead, Related Clubs */}
        <aside className="club-details-sidebar">
          {/* Quick Facts Card */}
          <div className="sidebar-card">
            <h3 className="sidebar-card-title">Club Overview</h3>
            <div className="sidebar-fact-list">
              <div className="sidebar-fact-item">
                <span className="fact-label">
                  <Users size={15} /> Members
                </span>
                <span className="fact-value">
                  {club.membersCount + (currentlyMember ? 1 : 0)} Enrolled
                </span>
              </div>

              <div className="sidebar-fact-item">
                <span className="fact-label">
                  <Calendar size={15} /> Schedule
                </span>
                <span className="fact-value">{club.meetingSchedule}</span>
              </div>

              <div className="sidebar-fact-item">
                <span className="fact-label">
                  <MapPin size={15} /> Meeting Venue
                </span>
                <span className="fact-value">{club.venue}</span>
              </div>
            </div>
          </div>

          {/* Faculty Coordinator Card */}
          {club.facultyCoordinator && (
            <div className="sidebar-card">
              <h3 className="sidebar-card-title">Faculty Coordinator</h3>
              <div className="coordinator-box">
                <div className="coordinator-avatar">
                  {club.facultyCoordinator.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="coordinator-info">
                  <h4 className="coordinator-name">{club.facultyCoordinator.name}</h4>
                  <p className="coordinator-dept">{club.facultyCoordinator.department}</p>
                  <p className="coordinator-office">
                    <Building size={12} /> {club.facultyCoordinator.office}
                  </p>
                  <a
                    href={`mailto:${club.facultyCoordinator.email}`}
                    className="coordinator-email"
                  >
                    <Mail size={12} /> {club.facultyCoordinator.email}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Student Lead Card */}
          {club.studentLead && (
            <div className="sidebar-card">
              <h3 className="sidebar-card-title">Student Leadership</h3>
              <div className="student-lead-box">
                <div className="student-lead-avatar">
                  {club.studentLead.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="student-lead-info">
                  <h4 className="student-lead-name">{club.studentLead.name}</h4>
                  <p className="student-lead-role">{club.studentLead.role}</p>
                  <p className="student-lead-roll">Roll No: {club.studentLead.rollNo}</p>
                </div>
              </div>
            </div>
          )}

          {/* Related Clubs */}
          {relatedClubs.length > 0 && (
            <div className="sidebar-card">
              <h3 className="sidebar-card-title">Similar Societies</h3>
              <div className="related-clubs-list">
                {relatedClubs.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/clubs/${rel.id}`}
                    className="related-club-item"
                  >
                    <div className="related-club-icon">
                      {renderClubIcon(rel.icon, rel.color)}
                    </div>
                    <div className="related-club-info">
                      <span className="related-club-name">{rel.name}</span>
                      <span className="related-club-members">{rel.membersCount} members</span>
                    </div>
                    <ArrowRight size={14} className="related-arrow" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* ── Confirmation Modal for Leaving Club ── */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Confirm Membership Cancellation"
        size="sm"
      >
        <div className="modal-leave-confirm-content">
          <p>
            Are you sure you want to cancel your membership in <strong>{club.name}</strong>?
          </p>
          <p className="modal-leave-subtext">
            Your member privileges, committee invitations, and priority access to events will be
            removed. You can rejoin at any point.
          </p>
          <div className="modal-leave-actions">
            <button
              type="button"
              className="modal-btn-cancel"
              onClick={() => setIsLeaveModalOpen(false)}
            >
              Keep Membership
            </button>
            <button
              type="button"
              className="modal-btn-confirm-leave"
              onClick={confirmLeave}
            >
              Confirm Leave
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Toast Notification ── */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default ClubDetails;
