import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertTriangle,
  History,
  Ticket,
  CalendarCheck,
  Sparkles,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import initialEvents from '../../data/events.json';
import initialClubs from '../../data/clubs.json';
import Badge from '../../components/ui/Badge/Badge';
import Modal from '../../components/ui/Modal/Modal';
import Toast from '../../components/ui/Toast/Toast';
import EventRegistrationForm from '../../components/events/EventRegistrationForm';
import useEventRegistrations from '../../hooks/useEventRegistrations';
import { useNotifications } from '../../context/NotificationContext';
import './EventDetails.css';

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
 * Page 4: Event Details (/events/:eventId)
 * Dynamic event details view featuring seats tracking, agenda timeline,
 * validated registration modal, registration pass rendering, and LocalStorage sync.
 */
const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // Local state for modals and feedback
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom registrations hook
  const { getRegistration, registerForEvent, cancelRegistration } =
    useEventRegistrations();
  const { addNotification } = useNotifications();

  // Locate the target event
  const event = initialEvents.find((e) => e.id === eventId) || null;

  // Associated organising club
  const club = event?.organiserClubId
    ? initialClubs.find((c) => c.id === event.organiserClubId) || null
    : null;

  // Sync window title and scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (event) {
      document.title = `${event.title} | UNIVO Events`;
    } else {
      document.title = 'Event Not Found | UNIVO';
    }
  }, [event]);

  // Registration state for this event
  const registeredInfo = event ? getRegistration(event.id) : null;

  const currentlyRegistered = Boolean(registeredInfo);

  // Lifecycle calculations
  const now = new Date();
  const isPast =
    event?.status === 'Past' ||
    (event && new Date(`${event.date}T23:59:59`) < now);

  const deadlinePassed =
    event && new Date(`${event.registrationDeadline}T23:59:59`) < now;

  const seatsLeft = event
    ? Math.max(0, event.totalSeats - event.registeredSeats - (currentlyRegistered ? 1 : 0))
    : 0;
  const isSoldOut = seatsLeft === 0;

  // ── Handlers ──
  const handleOpenRegister = () => {
    if (isPast || deadlinePassed) {
      setToast({
        message: 'Registration is closed for this event.',
        type: 'error',
      });
      return;
    }
    if (isSoldOut) {
      setToast({
        message: 'This event has reached full seating capacity.',
        type: 'warning',
      });
      return;
    }
    if (currentlyRegistered) {
      setToast({
        message: 'You are already registered for this event.',
        type: 'info',
      });
      return;
    }
    setIsRegisterModalOpen(true);
  };

  const handleFormSubmit = (formData) => {
    setIsSubmitting(true);
    // Simulate quick validation and LocalStorage persistence
    setTimeout(() => {
      const res = registerForEvent(event, formData);
      setIsSubmitting(false);

      if (res.success) {
        setIsRegisterModalOpen(false);
        setToast({ message: res.message, type: 'success' });

        try {
          addNotification({
            title: `Pass Confirmed: ${event.title}`,
            message: `Your registration pass is confirmed. Ticket ID: ${res.registration?.ticketId}.`,
            type: 'event',
          });
        } catch {
          // Notification context optional safety
        }
      } else {
        setToast({ message: res.message, type: 'error' });
      }
    }, 300);
  };

  const handleConfirmCancel = () => {
    if (!event) return;
    const res = cancelRegistration(event.id, event.title);
    setIsCancelModalOpen(false);
    setToast({ message: res.message, type: 'info' });
  };

  // ── Proper Not-Found State ──
  if (!event) {
    return (
      <div className="event-not-found-page">
        <div className="event-not-found-card">
          <div className="not-found-icon">
            <AlertCircle size={44} />
          </div>
          <h2 className="not-found-title">Event Not Found</h2>
          <p className="not-found-text">
            We couldn't find any scheduled campus event with the ID "
            <strong>{eventId}</strong>". The event may have been rescheduled or removed.
          </p>
          <div className="not-found-actions">
            <Link to="/events" className="btn-back-to-events">
              <ArrowLeft size={16} />
              <span>Back to Events Calendar</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="event-details-page">
      {/* ── Top Navigation Row ── */}
      <div className="event-nav-row">
        <button
          type="button"
          className="btn-back"
          onClick={() => navigate('/events')}
          title="Back to events"
        >
          <ArrowLeft size={16} />
          <span>Back to Events</span>
        </button>

        <div className="event-breadcrumb">
          <Link to="/dashboard">Dashboard</Link>
          <span>/</span>
          <Link to="/events">Events</Link>
          <span>/</span>
          <span className="current">{event.title}</span>
        </div>
      </div>

      {/* ── Event Hero Banner ── */}
      <div className="event-hero-card">
        <div className="event-hero-content">
          <div className="event-hero-tags">
            <Badge variant={getCategoryVariant(event.category)} size="md">
              {event.category}
            </Badge>
            <span className="event-hero-fee">Free Admission</span>

            {currentlyRegistered ? (
              <span className="hero-status-pill registered">
                <CheckCircle2 size={13} /> Registered
              </span>
            ) : isPast ? (
              <span className="hero-status-pill concluded">
                <History size={13} /> Concluded
              </span>
            ) : deadlinePassed ? (
              <span className="hero-status-pill deadline">
                <AlertTriangle size={13} /> Registration Closed
              </span>
            ) : isSoldOut ? (
              <span className="hero-status-pill full">Sold Out</span>
            ) : (
              <span className="hero-status-pill open">Registration Active</span>
            )}
          </div>

          <h1 className="event-hero-title">{event.title}</h1>

          <div className="event-hero-host">
            <span>Organised by:</span>
            {club ? (
              <Link to={`/clubs/${club.id}`} className="event-host-link">
                <Users size={15} />
                <span>{event.organiser}</span>
              </Link>
            ) : (
              <span className="event-host-name">{event.organiser}</span>
            )}
          </div>

          <div className="event-hero-meta-grid">
            <div className="hero-meta-item">
              <Calendar size={16} className="hero-meta-icon" />
              <div>
                <span className="hero-meta-label">Date</span>
                <span className="hero-meta-val">{event.displayDate}</span>
              </div>
            </div>

            <div className="hero-meta-item">
              <Clock size={16} className="hero-meta-icon" />
              <div>
                <span className="hero-meta-label">Time</span>
                <span className="hero-meta-val">{event.time}</span>
              </div>
            </div>

            <div className="hero-meta-item">
              <MapPin size={16} className="hero-meta-icon" />
              <div>
                <span className="hero-meta-label">Location / Venue</span>
                <span className="hero-meta-val">{event.venue}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Two-Column Layout ── */}
      <div className="event-details-layout">
        {/* Left Column: Description, Agenda, Guidelines, Prerequisites */}
        <div className="event-details-main">
          {/* 1. Full Description */}
          <section className="event-section-card">
            <h2 className="section-title">About This Event</h2>
            <p className="event-full-desc">{event.description}</p>
          </section>

          {/* 2. Agenda Timeline */}
          {event.agenda && event.agenda.length > 0 && (
            <section className="event-section-card">
              <div className="section-title-box">
                <CalendarCheck size={20} className="section-icon red" />
                <h2 className="section-title">Event Schedule & Agenda</h2>
              </div>

              <div className="event-timeline">
                {event.agenda.map((slot, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-marker" />
                    <div className="timeline-content">
                      <span className="timeline-time">{slot.time}</span>
                      <h4 className="timeline-heading">{slot.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 3. Eligibility & Prerequisites */}
          <section className="event-section-card">
            <div className="section-title-box">
              <Sparkles size={20} className="section-icon blue" />
              <h2 className="section-title">Eligibility & Requirements</h2>
            </div>

            <div className="eligibility-cards-row">
              <div className="eligibility-card">
                <span className="eligibility-card-label">Who Can Attend</span>
                <p>{event.eligibility}</p>
              </div>

              <div className="eligibility-card">
                <span className="eligibility-card-label">What to Bring</span>
                <p>{event.prerequisites}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Registration Card or Pass / Action Widget */}
        <aside className="event-details-sidebar">
          {/* When Registered: Digital Ticket Pass Card */}
          {currentlyRegistered ? (
            <div className="event-pass-card">
              <div className="pass-card-top">
                <div className="pass-badge">
                  <Ticket size={16} />
                  <span>Student Pass</span>
                </div>
                <span className="pass-status-pill">Confirmed</span>
              </div>

              <div className="pass-body">
                <span className="pass-ticket-label">Boarding / Pass ID</span>
                <span className="pass-ticket-code">{registeredInfo.ticketId}</span>

                <div className="pass-details-grid">
                  <div>
                    <span className="pass-info-label">Attendee</span>
                    <span className="pass-info-val">{registeredInfo.studentName}</span>
                  </div>
                  <div>
                    <span className="pass-info-label">Roll Number</span>
                    <span className="pass-info-val">{registeredInfo.rollNo}</span>
                  </div>
                  <div>
                    <span className="pass-info-label">Department</span>
                    <span className="pass-info-val">{registeredInfo.department}</span>
                  </div>
                  <div>
                    <span className="pass-info-label">Registered On</span>
                    <span className="pass-info-val">
                      {new Date(registeredInfo.registeredAt).toLocaleDateString('default', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="pass-guideline-box">
                  <FileCheck2 size={16} className="pass-guideline-icon" />
                  <p>
                    Present this pass on your phone alongside your UNIVO student ID card at the
                    venue registration desk.
                  </p>
                </div>
              </div>

              <div className="pass-footer">
                <button
                  type="button"
                  className="btn-cancel-registration"
                  onClick={() => setIsCancelModalOpen(true)}
                >
                  Cancel Registration
                </button>
              </div>
            </div>
          ) : (
            /* When Not Registered: Registration Action Card */
            <div className="event-action-card">
              <h3 className="action-card-title">Event Registration</h3>

              <div className="action-specs-list">
                <div className="action-spec-row">
                  <span className="spec-name">Registration Fee</span>
                  <span className="spec-val free">Free</span>
                </div>

                <div className="action-spec-row">
                  <span className="spec-name">Deadline</span>
                  <span className="spec-val">
                    {new Date(event.registrationDeadline).toLocaleDateString('default', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {!isPast && (
                  <div className="action-seats-widget">
                    <div className="seats-label-row">
                      <span>Available Seats</span>
                      <strong>
                        {seatsLeft} / {event.totalSeats}
                      </strong>
                    </div>
                    <div className="seats-progress-track">
                      <div
                        className="seats-progress-indicator"
                        style={{
                          width: `${Math.min(100, Math.round(((event.totalSeats - seatsLeft) / event.totalSeats) * 100))}%`,
                          background: seatsLeft < 20 ? '#ef4444' : '#10b981',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              {isPast ? (
                <button type="button" className="btn-register-action disabled" disabled>
                  <History size={16} /> Event Concluded
                </button>
              ) : deadlinePassed ? (
                <button type="button" className="btn-register-action disabled" disabled>
                  <AlertTriangle size={16} /> Deadline Passed
                </button>
              ) : isSoldOut ? (
                <button type="button" className="btn-register-action disabled" disabled>
                  <AlertTriangle size={16} /> All Seats Filled
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-register-action active"
                  onClick={handleOpenRegister}
                >
                  <Ticket size={16} /> Register Now (Free)
                </button>
              )}

              <p className="action-guarantee-note">
                Instant digital boarding pass saved to your account and device LocalStorage.
              </p>
            </div>
          )}

          {/* Organiser Summary Card */}
          {club && (
            <div className="event-host-summary-card">
              <h4 className="host-card-heading">Organising Society</h4>
              <p className="host-card-tagline">{club.tagline}</p>
              <Link to={`/clubs/${club.id}`} className="btn-view-host-club">
                <span>View {club.name}</span>
              </Link>
            </div>
          )}
        </aside>
      </div>

      {/* ── Registration Form Modal ── */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title={`Register for ${event.title}`}
        size="md"
      >
        <EventRegistrationForm
          event={event}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsRegisterModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* ── Cancel Registration Modal ── */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Event Registration"
        size="sm"
      >
        <div className="modal-leave-confirm-content">
          <p>
            Are you sure you want to cancel your pass for <strong>{event.title}</strong>?
          </p>
          <p className="modal-leave-subtext">
            Your reserved seat will be released back to the general pool for other university
            students.
          </p>
          <div className="modal-leave-actions">
            <button
              type="button"
              className="modal-btn-cancel"
              onClick={() => setIsCancelModalOpen(false)}
            >
              Keep My Seat
            </button>
            <button
              type="button"
              className="modal-btn-confirm-leave"
              onClick={handleConfirmCancel}
            >
              Confirm Cancellation
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Toast Feedback Notification ── */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default EventDetails;
