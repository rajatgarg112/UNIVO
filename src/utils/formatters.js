/**
 * formatters.js – Display/formatting utilities for UniversityVerse
 */

/**
 * formatNumber(1234) → '1,234'
 * formatNumber(12500) → '12.5K'
 * formatNumber(1500000) → '1.5M'
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  const n = Number(num);
  if (isNaN(n)) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000)    return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString('en-IN');
}

/**
 * formatPercentage(75, 100) → '75.0%'
 * formatPercentage(1, 3)    → '33.3%'
 */
export function formatPercentage(value, total) {
  if (!total || total === 0) return '0.0%';
  return `${((value / total) * 100).toFixed(1)}%`;
}

/**
 * formatFileSize(2621440) → '2.5 MB'
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1);
  return `${size} ${units[i]}`;
}

/**
 * truncateText('Hello World from UniversityVerse', 15) → 'Hello World fro...'
 */
export function truncateText(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * capitalizeWords('computer science engineering') → 'Computer Science Engineering'
 */
export function capitalizeWords(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * getInitials('Aryan Sharma') → 'AS'
 * getInitials('Dr. Priya Nair') → 'PN'  (skips honorifics)
 */
export function getInitials(name) {
  if (!name) return '?';
  const honorifics = ['dr', 'mr', 'mrs', 'ms', 'prof', 'sir'];
  const parts = name
    .split(' ')
    .filter((p) => !honorifics.includes(p.replace('.', '').toLowerCase()))
    .filter(Boolean);
  if (parts.length === 0) return name.charAt(0).toUpperCase();
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

/**
 * formatRollNo('cs2021001') → 'CS2021001'
 */
export function formatRollNo(rollNo) {
  if (!rollNo) return '';
  return String(rollNo).toUpperCase().trim();
}

/**
 * formatPhone('9876543210') → '+91 98765 43210'
 * formatPhone('+919876543210') → '+91 98765 43210'
 */
export function formatPhone(phone) {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  const local = digits.startsWith('91') && digits.length === 12
    ? digits.slice(2)
    : digits;
  if (local.length === 10) {
    return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
  }
  return phone;
}

/**
 * getGradeColor(percentage) → hex color
 * ≥90 → green, ≥75 → indigo, ≥60 → amber, else → red
 */
export function getGradeColor(percentage) {
  const p = Number(percentage);
  if (isNaN(p)) return '#94a3b8';
  if (p >= 90) return '#10b981';
  if (p >= 75) return '#6366f1';
  if (p >= 60) return '#f59e0b';
  return '#ef4444';
}

/**
 * getStatusColor(status) → hex color for badge/label styling
 */
export function getStatusColor(status) {
  const map = {
    // General
    active:      '#10b981',
    inactive:    '#6b7280',
    pending:     '#f59e0b',
    approved:    '#10b981',
    rejected:    '#ef4444',
    cancelled:   '#ef4444',
    completed:   '#6366f1',
    ongoing:     '#3b82f6',
    upcoming:    '#8b5cf6',
    // Academic
    submitted:   '#10b981',
    graded:      '#6366f1',
    late:        '#f59e0b',
    missing:     '#ef4444',
    draft:       '#6b7280',
    // Library
    available:   '#10b981',
    borrowed:    '#f59e0b',
    overdue:     '#ef4444',
    reserved:    '#3b82f6',
    // Placement
    open:        '#10b981',
    closed:      '#ef4444',
    shortlisted: '#6366f1',
    // Hostel
    occupied:    '#3b82f6',
    vacant:      '#10b981',
    maintenance: '#f59e0b',
  };
  return map[String(status).toLowerCase()] || '#6b7280';
}
