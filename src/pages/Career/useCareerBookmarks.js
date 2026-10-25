import { useState, useEffect } from 'react';

const STORAGE_KEY = 'uv_saved_internships';

/**
 * Custom Hook: useCareerBookmarks
 *
 * Demonstrates Syllabus Concepts:
 * 1. Custom Hook creation to encapsulate domain state
 * 2. useState initialized from LocalStorage (with safe fallback)
 * 3. useEffect to persist bookmark state to LocalStorage
 * 4. Helper methods: isSaved(id), toggleBookmark(id)
 */
export function useCareerBookmarks() {
  // 1. Initialize state from LocalStorage or default to empty array
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (err) {
      console.error('Error reading saved internships from LocalStorage:', err);
    }
    return [];
  });

  // 2. Persist to LocalStorage whenever savedIds changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
    } catch (err) {
      console.error('Error saving internships to LocalStorage:', err);
    }
  }, [savedIds]);

  // Check if an internship is bookmarked
  const isSaved = (id) => savedIds.includes(id);

  // Toggle bookmark: if already saved, remove; otherwise, add
  const toggleBookmark = (id) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return {
    savedIds,
    isSaved,
    toggleBookmark,
  };
}

export default useCareerBookmarks;
