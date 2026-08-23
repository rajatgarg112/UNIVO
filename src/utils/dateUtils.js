/**
 * dateUtils.js – Date/time utility functions for UniversityVerse
 */

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const DAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

/**
 * formatDate('2025-01-15') → 'Jan 15, 2025'
 */
export function formatDate(dateStr) {
  try {
    const date = new Date(dateStr);
    if (isNaN(date)) return '';
    return `${SHORT_MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  } catch {
    return '';
  }
}

/**
 * formatTime('09:30') → '09:30 AM'
 * Accepts HH:MM or ISO strings
 */
export function formatTime(timeStr) {
  try {
    const date = new Date(`1970-01-01T${timeStr}`);
    if (isNaN(date)) {
      // Try treating timeStr as full ISO
      const full = new Date(timeStr);
      if (isNaN(full)) return '';
      return full.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    }
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '';
  }
}

/**
 * formatDateTime('2025-01-15T09:30:00') → 'Jan 15, 2025 at 09:30 AM'
 */
export function formatDateTime(dateStr) {
  try {
    const date = new Date(dateStr);
    if (isNaN(date)) return '';
    const datePart = `${SHORT_MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    const timePart = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return `${datePart} at ${timePart}`;
  } catch {
    return '';
  }
}

/**
 * getRelativeTime('2025-01-15T07:00:00') → '2 hours ago' / 'yesterday' / '3 days ago'
 */
export function getRelativeTime(dateStr) {
  try {
    const date = new Date(dateStr);
    if (isNaN(date)) return '';
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr  = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60)   return 'just now';
    if (diffMin < 60)   return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
    if (diffHr < 24)    return `${diffHr} hour${diffHr !== 1 ? 's' : ''} ago`;
    if (diffDay === 1)  return 'yesterday';
    if (diffDay < 7)    return `${diffDay} days ago`;
    if (diffDay < 30)   return `${Math.floor(diffDay / 7)} week${Math.floor(diffDay / 7) !== 1 ? 's' : ''} ago`;
    if (diffDay < 365)  return `${Math.floor(diffDay / 30)} month${Math.floor(diffDay / 30) !== 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDay / 365)} year${Math.floor(diffDay / 365) !== 1 ? 's' : ''} ago`;
  } catch {
    return '';
  }
}

/**
 * getDayName('2025-01-15') → 'Wednesday'
 */
export function getDayName(dateStr) {
  try {
    const date = new Date(dateStr);
    if (isNaN(date)) return '';
    return DAYS[date.getDay()];
  } catch {
    return '';
  }
}

/**
 * getMonthName(0) → 'January'
 */
export function getMonthName(monthIndex) {
  return MONTHS[monthIndex] || '';
}

/**
 * isToday('2025-01-15') → boolean
 */
export function isToday(dateStr) {
  try {
    const date = new Date(dateStr);
    if (isNaN(date)) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  } catch {
    return false;
  }
}

/**
 * isFuture('2025-12-31') → boolean
 */
export function isFuture(dateStr) {
  try {
    const date = new Date(dateStr);
    if (isNaN(date)) return false;
    return date > new Date();
  } catch {
    return false;
  }
}

/**
 * getDaysUntil('2025-02-14') → number of days until that date
 */
export function getDaysUntil(dateStr) {
  try {
    const target = new Date(dateStr);
    if (isNaN(target)) return 0;
    const now = new Date();
    const diffMs = target - now;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

/**
 * getCurrentSemesterDates() → { start: 'YYYY-MM-DD', end: 'YYYY-MM-DD' }
 * Returns Jan–May for spring, Aug–Dec for fall based on current month.
 */
export function getCurrentSemesterDates() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-indexed

  if (month >= 1 && month <= 5) {
    // Spring semester
    return {
      start: `${year}-01-01`,
      end:   `${year}-05-31`,
    };
  } else if (month >= 6 && month <= 7) {
    // Summer session
    return {
      start: `${year}-06-01`,
      end:   `${year}-07-31`,
    };
  } else {
    // Fall semester
    return {
      start: `${year}-08-01`,
      end:   `${year}-12-31`,
    };
  }
}
