import { useState, useEffect } from 'react';

const STORAGE_KEY = 'uv_internship_applications';

/**
 * Custom Hook: useInternshipApplications
 *
 * Demonstrates Syllabus Concepts:
 * 1. Custom Hook creation to encapsulate domain state
 * 2. useState initialized from LocalStorage with safe Array.isArray fallback
 * 3. useEffect to persist application records to LocalStorage
 * 4. Duplicate application prevention
 */
export function useInternshipApplications() {
  // 1. Initialize state from LocalStorage or default to empty array
  const [applications, setApplications] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (err) {
      console.error('Error reading internship applications from LocalStorage:', err);
    }
    return [];
  });

  // 2. Persist to LocalStorage whenever applications state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch (err) {
      console.error('Error saving internship applications to LocalStorage:', err);
    }
  }, [applications]);

  // Check if student has already applied for a specific internship (duplicate prevention)
  const hasApplied = (internshipId) => {
    return applications.some((app) => app.internshipId === internshipId);
  };

  // Submit a new internship application
  const applyForInternship = (newApp) => {
    if (hasApplied(newApp.internshipId)) {
      return {
        success: false,
        message: 'You have already applied for this internship opportunity.',
      };
    }

    const applicationRecord = {
      ...newApp,
      id: `intern-app-${Date.now()}`,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
    };

    setApplications((prev) => [applicationRecord, ...prev]);
    return {
      success: true,
      message: 'Application submitted successfully! Your application is recorded in portal records.',
      application: applicationRecord,
    };
  };

  return {
    applications,
    hasApplied,
    applyForInternship,
  };
}

export default useInternshipApplications;
