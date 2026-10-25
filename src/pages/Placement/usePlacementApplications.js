import { useState, useEffect } from 'react';

const STORAGE_KEY = 'uv_placement_applications';

/**
 * Custom Hook: usePlacementApplications
 *
 * Demonstrates Syllabus Concepts:
 * 1. Custom Hook creation to encapsulate domain logic
 * 2. useState for local application records initialized from LocalStorage
 * 3. useEffect to persist state changes into LocalStorage
 * 4. CRUD operations (Create, Read, Delete/Withdraw)
 */
export function usePlacementApplications() {
  // 1. Initialize state from LocalStorage or default to empty array
  const [applications, setApplications] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (err) {
      console.error('Error reading placement applications from LocalStorage:', err);
    }
    return [];
  });

  // 2. Persist to LocalStorage whenever applications state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch (err) {
      console.error('Error saving placement applications to LocalStorage:', err);
    }
  }, [applications]);

  // Check if student has already applied for a specific drive (duplicate prevention)
  const isApplied = (driveId) => {
    return applications.some((app) => app.driveId === driveId);
  };

  // Find an existing application by drive ID
  const getApplicationByDriveId = (driveId) => {
    return applications.find((app) => app.driveId === driveId) || null;
  };

  // Create: Add new placement application
  const applyForDrive = (newApp) => {
    if (isApplied(newApp.driveId)) {
      return { success: false, message: 'You have already applied for this placement drive.' };
    }

    const applicationRecord = {
      ...newApp,
      id: `app-${Date.now()}`,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Under Review',
    };

    setApplications((prev) => [applicationRecord, ...prev]);
    return {
      success: true,
      message: 'Application submitted successfully! Your application is recorded in portal storage.',
      application: applicationRecord,
    };
  };

  // Delete / Withdraw application (CRUD - Delete)
  const withdrawApplication = (appId) => {
    setApplications((prev) => prev.filter((app) => app.id !== appId));
    return { success: true, message: 'Application withdrawn successfully.' };
  };

  return {
    applications,
    isApplied,
    getApplicationByDriveId,
    applyForDrive,
    withdrawApplication,
  };
}

export default usePlacementApplications;
