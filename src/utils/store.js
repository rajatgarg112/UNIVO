/**
 * store.js - Unified Single Source of Truth Storage Layer for UniversityVerse
 * Manages synchronized data across Student, Faculty, and Parent portals.
 */

import initialStudents from '../data/students.json';
import initialAssignments from '../data/assignments.json';
import initialAttendance from '../data/attendance.json';
import initialTimetable from '../data/timetable.json';
import initialNotices from '../data/notifications.json';

// Centralized Storage Keys
export const KEYS = {
  PROFILE: 'studentProfile',
  ASSIGNMENTS: 'uv_assignments_local_v1',
  ATTENDANCE: 'uv_attendance_data_v2',
  TIMETABLE: 'uv_timetable_data',
  NOTICES: 'uv_faculty_notices_v2'
};

// Safe JSON Parse Helper
function readKey(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    if (item) return JSON.parse(item);
  } catch (e) {
    console.warn(`Error reading key ${key}:`, e);
  }
  return defaultValue;
}

function writeKey(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Dispatch custom event for real-time cross-component sync
    window.dispatchEvent(new Event('uv_store_update'));
  } catch (e) {
    console.warn(`Error writing key ${key}:`, e);
  }
}

/* ---------------- 1. STUDENT PROFILE & CGPA ---------------- */
export function getStudentProfile() {
  const defaultProfile = {
    id: 'STU001',
    name: 'Aryan Sharma',
    rollNumber: 'CS2021001',
    email: 'aryan@universityverse.edu',
    phone: '+91 98765 43210',
    department: 'Computer Science & Engineering',
    semester: '6th Semester',
    cgpa: '8.75',
    credits: 142,
    section: 'A',
    batch: '2022-2026',
    address: '42, Green Park Colony, Bhopal, MP - 462001',
    parentContact: '+91 91234 56789',
    skills: ['React.js', 'Python', 'Java', 'DSA', 'Machine Learning', 'Node.js', 'SQL', 'Git'],
    certificates: [
      { name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', date: '2024-03', url: '#' },
      { name: 'Meta Frontend Developer', issuer: 'Meta / Coursera', date: '2023-11', url: '#' }
    ],
    achievements: [
      { title: 'Academic Excellence Award', description: 'Top 5% in department', year: '2024' },
      { title: 'Hackathon Winner', description: '1st place at TechFest 2024', year: '2024' }
    ]
  };

  const profile = readKey(KEYS.PROFILE, defaultProfile);

  // Guarantee numeric CGPA parsing protection against NaN
  const numCgpa = parseFloat(profile.cgpa);
  profile.parsedCgpa = isNaN(numCgpa) ? 8.75 : numCgpa;
  return profile;
}

export function saveStudentProfile(updatedProfile) {
  writeKey(KEYS.PROFILE, updatedProfile);
}

/* ---------------- 2. ATTENDANCE SINGLE TRUTH ---------------- */
export function getAttendanceData() {
  const defaultAttendance = {
    'Semester 6': initialAttendance.subjects || []
  };

  return readKey(KEYS.ATTENDANCE, defaultAttendance);
}

export function getOverallAttendanceStats(semester = 'Semester 6') {
  const data = getAttendanceData();
  const subjects = data[semester] || data['Semester 6'] || initialAttendance.subjects || [];

  let totalClasses = 0;
  let attendedClasses = 0;

  subjects.forEach((s) => {
    const t = s.totalClasses !== undefined ? s.totalClasses : (s.total || 0);
    const a = s.attendedClasses !== undefined ? s.attendedClasses : (s.attended || 0);
    totalClasses += t;
    attendedClasses += a;
  });

  const percentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 1000) / 10 : 0;
  const isSafe = percentage >= 75;

  return {
    subjects,
    totalClasses,
    attendedClasses,
    missedClasses: Math.max(0, totalClasses - attendedClasses),
    percentage: isNaN(percentage) ? 0 : percentage,
    isSafe,
    neededFor75: percentage < 75 ? Math.max(0, Math.ceil((0.75 * totalClasses - attendedClasses) / 0.25)) : 0
  };
}

export function saveAttendanceData(updatedMap) {
  writeKey(KEYS.ATTENDANCE, updatedMap);
}

/* ---------------- 3. ASSIGNMENTS SINGLE TRUTH ---------------- */
export function getAssignmentsData() {
  return readKey(KEYS.ASSIGNMENTS, initialAssignments || []);
}

export function saveAssignmentsData(assignmentsList) {
  writeKey(KEYS.ASSIGNMENTS, assignmentsList);
}

/* ---------------- 4. TIMETABLE SINGLE TRUTH ---------------- */
export function getTimetableData() {
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const rawMap = initialTimetable.schedule || {};
  const defaultSchedule = {};

  DAYS.forEach((d) => {
    const key = d.toLowerCase();
    defaultSchedule[d] = (rawMap[key] || []).map((slot) => ({
      id: slot.id || 'slot_' + Math.random().toString(36).substr(2, 9),
      subject: slot.subject || 'Lecture',
      code: slot.subjectCode || slot.code || 'CS301',
      faculty: slot.faculty || 'Dr. Priya Nair',
      room: slot.room || 'LH-101',
      type: slot.type || 'Lecture',
      startTime: slot.time ? slot.time.split('-')[0].trim() : '09:00 AM',
      endTime: slot.time ? slot.time.split('-')[1].trim() : '10:00 AM'
    }));
  });

  return readKey(KEYS.TIMETABLE, defaultSchedule);
}

export function saveTimetableData(scheduleMap) {
  writeKey(KEYS.TIMETABLE, scheduleMap);
}
