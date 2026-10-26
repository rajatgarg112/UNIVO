import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'uv_event_registrations';

/**
 * Default initial registration state for realistic portal demonstration.
 * Pre-registers the demo student for HackUNIVO.
 */
const DEFAULT_REGISTRATIONS = [
  {
    id: 'reg_demo_01',
    eventId: 'evt-hackunivo-2026',
    eventTitle: 'HackUNIVO 2026: 36-Hour National Hackathon',
    studentName: 'Aryan Sharma',
    email: 'aryan@universityverse.edu',
    rollNo: 'CS2021001',
    department: 'Computer Science',
    semester: '6th',
    phone: '9876543210',
    notes: 'Excited for the AI/ML track and midnight coding sprints!',
    ticketId: 'UV-HACK77',
    status: 'Confirmed',
    registeredAt: '2026-10-20T14:30:00.000Z',
  },
];

/**
 * Custom Hook: useEventRegistrations
 * Handles user event registrations, validation, duplicate prevention, and LocalStorage persistence.
 *
 * Demonstrates:
 * - useState for local records initialized from LocalStorage
 * - useEffect to persist records
 * - useCallback for stable methods
 * - Validation rules (duplicate registration, past events, expired deadline)
 */
export function useEventRegistrations() {
  const [registrations, setRegistrations] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : DEFAULT_REGISTRATIONS;
      }
    } catch (err) {
      console.error('Error reading event registrations from LocalStorage:', err);
    }
    return DEFAULT_REGISTRATIONS;
  });

  // Synchronize state with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
    } catch (err) {
      console.error('Error saving event registrations to LocalStorage:', err);
    }
  }, [registrations]);

  // Check if student is already registered for an event
  const isRegistered = useCallback(
    (eventId) => {
      return registrations.some((reg) => reg.eventId === eventId);
    },
    [registrations]
  );

  // Retrieve a specific registration record by eventId
  const getRegistration = useCallback(
    (eventId) => {
      return registrations.find((reg) => reg.eventId === eventId) || null;
    },
    [registrations]
  );

  // Register for an event with validation checks
  const registerForEvent = useCallback(
    (event, formData) => {
      if (!event || !event.id) {
        return { success: false, message: 'Invalid event information provided.' };
      }

      // 1. Prevent duplicate registration
      if (isRegistered(event.id)) {
        return {
          success: false,
          message: 'You are already registered for this event. Check your Registered Events tab.',
        };
      }

      // 2. Prevent registration for past events
      const now = new Date();
      const isPast =
        event.status === 'Past' ||
        (event.date && new Date(`${event.date}T23:59:59`) < now);
      if (isPast) {
        return {
          success: false,
          message: 'Registration is closed. This event has already concluded.',
        };
      }

      // 3. Prevent registration for expired deadlines
      const isDeadlineExpired =
        event.registrationDeadline &&
        new Date(`${event.registrationDeadline}T23:59:59`) < now;
      if (isDeadlineExpired) {
        return {
          success: false,
          message: 'Registration is closed. The deadline for this event has passed.',
        };
      }

      // 4. Prevent registration if no available seats left (preserving seat count calculation)
      const availableSeats = Math.max(0, (event.totalSeats || 0) - (event.registeredSeats || 0));
      if (availableSeats <= 0) {
        return {
          success: false,
          message: 'This event is sold out. No seats are currently available.',
        };
      }

      // 5. Create registration record
      const ticketId = `UV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const newRegistration = {
        id: `reg_${Date.now()}`,
        eventId: event.id,
        eventTitle: event.title,
        date: event.date,
        venue: event.venue,
        studentName: formData.studentName?.trim() || 'Student',
        email: formData.email?.trim() || '',
        rollNo: formData.rollNo?.trim() || '',
        department: formData.department?.trim() || '',
        semester: formData.semester?.trim() || '',
        phone: formData.phone?.trim() || '',
        notes: formData.notes?.trim() || '',
        ticketId,
        status: 'Confirmed',
        registeredAt: new Date().toISOString(),
      };

      setRegistrations((prev) => [newRegistration, ...prev]);

      return {
        success: true,
        message: `Registration confirmed! Your Pass ID is ${ticketId}.`,
        registration: newRegistration,
      };
    },
    [isRegistered]
  );

  // Cancel an existing registration
  const cancelRegistration = useCallback((eventId, eventTitle = 'Event') => {
    setRegistrations((prev) => prev.filter((reg) => reg.eventId !== eventId));
    return {
      success: true,
      message: `Registration for "${eventTitle}" has been cancelled.`,
    };
  }, []);

  return {
    registrations,
    isRegistered,
    getRegistration,
    registerForEvent,
    cancelRegistration,
    totalRegistered: registrations.length,
  };
}

export default useEventRegistrations;
