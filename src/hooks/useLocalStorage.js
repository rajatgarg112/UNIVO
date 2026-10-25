import { useState, useEffect } from 'react';

/**
 * Custom Hook: useLocalStorage
 * Syncs state with the browser's localStorage.
 *
 * @param {string} key - The localStorage key name
 * @param {any} initialValue - Default fallback value if key does not exist
 * @returns {[any, Function]} [storedValue, setStoredValue] - Tuple similar to useState
 */
function useLocalStorage(key, initialValue) {
  // Read saved value from localStorage once on initial render
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error(`Error loading localStorage key "${key}":`, err);
    }
    return initialValue;
  });

  // Write updated value to localStorage whenever key or storedValue changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (err) {
      console.error(`Error saving localStorage key "${key}":`, err);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
