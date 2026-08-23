/**
 * studentService.js – Frontend-only student data service for UniversityVerse
 * Reads from embedded mock data; persists profile updates to localStorage.
 */

import { getItem, setItem } from '../utils/storageUtils';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_STUDENTS = {
  STU001: {
    id: 'STU001',
    name: 'Aryan Sharma',
    email: 'aryan@universityverse.edu',
    role: 'student',
    avatar: '',
    department: 'Computer Science',
    semester: '6th',
    rollNo: 'CS2021001',
    phone: '9876543210',
    dob: '2003-05-14',
    address: 'Block C, Room 204, Boys Hostel, UniversityVerse Campus',
    guardianName: 'Mr. Ramesh Sharma',
    guardianPhone: '9988776655',
    cgpa: 8.74,
    creditsEarned: 120,
    joinYear: 2021,
  },
  STU002: {
    id: 'STU002',
    name: 'Sneha Patel',
    email: 'sneha@universityverse.edu',
    role: 'student',
    avatar: '',
    department: 'Electronics',
    semester: '4th',
    rollNo: 'EC2023002',
    phone: '9123456780',
    dob: '2004-08-22',
    address: 'Block A, Room 110, Girls Hostel, UniversityVerse Campus',
    guardianName: 'Mr. Kiran Patel',
    guardianPhone: '9811223344',
    cgpa: 9.12,
    creditsEarned: 80,
    joinYear: 2023,
  },
};

const MOCK_ATTENDANCE = {
  STU001: {
    overall: 82.5,
    subjects: [
      { code: 'CS601', name: 'Data Structures & Algorithms', attended: 38, total: 44, percentage: 86.4 },
      { code: 'CS602', name: 'Operating Systems', attended: 34, total: 44, percentage: 77.3 },
      { code: 'CS603', name: 'Database Management Systems', attended: 40, total: 44, percentage: 90.9 },
      { code: 'CS604', name: 'Computer Networks', attended: 35, total: 44, percentage: 79.5 },
      { code: 'CS605', name: 'Software Engineering', attended: 36, total: 44, percentage: 81.8 },
      { code: 'CS606', name: 'Machine Learning', attended: 30, total: 44, percentage: 68.2 },
    ],
  },
  STU002: {
    overall: 91.3,
    subjects: [
      { code: 'EC401', name: 'Signals & Systems', attended: 42, total: 44, percentage: 95.5 },
      { code: 'EC402', name: 'Digital Electronics', attended: 40, total: 44, percentage: 90.9 },
      { code: 'EC403', name: 'Electromagnetic Fields', attended: 38, total: 44, percentage: 86.4 },
    ],
  },
};

const MOCK_ASSIGNMENTS = {
  STU001: [
    { id: 'A001', subject: 'Data Structures & Algorithms', title: 'Binary Tree Traversal Implementation', dueDate: '2025-02-10', submittedDate: null, status: 'pending', maxMarks: 20, obtainedMarks: null, description: 'Implement pre-order, in-order, and post-order traversal using recursion and iteration.' },
    { id: 'A002', subject: 'Database Management Systems', title: 'ER Diagram – Hospital Management', dueDate: '2025-01-28', submittedDate: '2025-01-25', status: 'submitted', maxMarks: 25, obtainedMarks: 22, description: 'Design a complete ER diagram for a hospital management system.' },
    { id: 'A003', subject: 'Machine Learning', title: 'Linear Regression from Scratch', dueDate: '2025-02-15', submittedDate: null, status: 'pending', maxMarks: 30, obtainedMarks: null, description: 'Implement gradient descent-based linear regression without using sklearn.' },
    { id: 'A004', subject: 'Operating Systems', title: 'Process Scheduling Simulation', dueDate: '2025-01-20', submittedDate: '2025-01-19', status: 'graded', maxMarks: 20, obtainedMarks: 18, description: 'Simulate FCFS, SJF, and Round Robin scheduling algorithms.' },
    { id: 'A005', subject: 'Computer Networks', title: 'Socket Programming – Chat App', dueDate: '2025-02-05', submittedDate: null, status: 'pending', maxMarks: 25, obtainedMarks: null, description: 'Create a multi-client TCP chat application using socket programming in Python.' },
  ],
};

const MOCK_TIMETABLE = {
  STU001: {
    Monday:    [{ time: '09:00–10:00', subject: 'Data Structures', room: 'CS-101', faculty: 'Dr. Rajan Mehta' }, { time: '10:00–11:00', subject: 'Operating Systems', room: 'CS-102', faculty: 'Dr. Anita Bose' }, { time: '12:00–13:00', subject: 'Machine Learning', room: 'CS-201', faculty: 'Dr. Vikram Singh' }],
    Tuesday:   [{ time: '09:00–10:00', subject: 'Database Management', room: 'CS-103', faculty: 'Prof. Suresh Kumar' }, { time: '11:00–12:00', subject: 'Computer Networks', room: 'CS-104', faculty: 'Dr. Meena Joshi' }, { time: '14:00–16:00', subject: 'DSA Lab', room: 'Lab-1', faculty: 'Dr. Rajan Mehta' }],
    Wednesday: [{ time: '09:00–10:00', subject: 'Software Engineering', room: 'CS-105', faculty: 'Prof. Anil Gupta' }, { time: '10:00–11:00', subject: 'Data Structures', room: 'CS-101', faculty: 'Dr. Rajan Mehta' }, { time: '12:00–13:00', subject: 'Operating Systems', room: 'CS-102', faculty: 'Dr. Anita Bose' }],
    Thursday:  [{ time: '09:00–10:00', subject: 'Machine Learning', room: 'CS-201', faculty: 'Dr. Vikram Singh' }, { time: '11:00–12:00', subject: 'Database Management', room: 'CS-103', faculty: 'Prof. Suresh Kumar' }, { time: '14:00–16:00', subject: 'Networks Lab', room: 'Lab-2', faculty: 'Dr. Meena Joshi' }],
    Friday:    [{ time: '09:00–10:00', subject: 'Computer Networks', room: 'CS-104', faculty: 'Dr. Meena Joshi' }, { time: '10:00–11:00', subject: 'Software Engineering', room: 'CS-105', faculty: 'Prof. Anil Gupta' }, { time: '11:00–12:00', subject: 'Machine Learning', room: 'CS-201', faculty: 'Dr. Vikram Singh' }],
    Saturday:  [{ time: '10:00–12:00', subject: 'ML Lab', room: 'Lab-3', faculty: 'Dr. Vikram Singh' }],
  },
};

// ─── Service Functions ────────────────────────────────────────────────────────

/**
 * getStudentById(id) → student object or null
 */
export function getStudentById(id) {
  // Check localStorage for overrides (profile updates)
  const overrides = getItem(`uv_student_profile_${id}`, null);
  const base = MOCK_STUDENTS[id] || null;
  if (!base) return null;
  return overrides ? { ...base, ...overrides } : base;
}

/**
 * getStudentAttendance(studentId) → attendance object
 */
export function getStudentAttendance(studentId) {
  return MOCK_ATTENDANCE[studentId] || {
    overall: 0,
    subjects: [],
  };
}

/**
 * getStudentAssignments(studentId) → assignments array
 */
export function getStudentAssignments(studentId) {
  const stored = getItem(`uv_assignments_${studentId}`, null);
  return stored || MOCK_ASSIGNMENTS[studentId] || [];
}

/**
 * getStudentTimetable(studentId) → timetable object keyed by day
 */
export function getStudentTimetable(studentId) {
  return MOCK_TIMETABLE[studentId] || {};
}

/**
 * updateStudentProfile(id, data) → saves merged data to localStorage
 */
export function updateStudentProfile(id, data) {
  const existing = getItem(`uv_student_profile_${id}`, {});
  const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
  setItem(`uv_student_profile_${id}`, updated);
  return updated;
}

/**
 * getStudentStats(id) → { attendancePercent, assignmentsDue, creditsEarned, cgpa }
 */
export function getStudentStats(id) {
  const student    = getStudentById(id);
  const attendance = getStudentAttendance(id);
  const assignments = getStudentAssignments(id);

  const assignmentsDue = assignments.filter(
    (a) => a.status === 'pending'
  ).length;

  return {
    attendancePercent: attendance.overall || 0,
    assignmentsDue,
    creditsEarned: student ? student.creditsEarned : 0,
    cgpa: student ? student.cgpa : 0,
  };
}
