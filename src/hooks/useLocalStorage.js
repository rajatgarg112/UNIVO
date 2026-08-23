import { useState, useEffect, useCallback } from 'react';

/**
 * useLocalStorage – syncs React state with localStorage.
 * Supports cross-tab synchronization via the 'storage' event.
 *
 * @param {string} key - localStorage key
 * @param {*} initialValue - fallback value if key is not found
 * @returns {[*, Function]} [storedValue, setValue]
 */
function useLocalStorage(key, initialValue) {
  const readValue = useCallback(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`useLocalStorage: Error reading key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState(readValue);

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore =
          typeof value === 'function' ? value(storedValue) : value;
        setStoredValue(valueToStore);
        localStorage.setItem(key, JSON.stringify(valueToStore));
        // Dispatch event so other hooks on the same key also update
        window.dispatchEvent(
          new StorageEvent('storage', {
            key,
            newValue: JSON.stringify(valueToStore),
          })
        );
      } catch (error) {
        console.warn(`useLocalStorage: Error setting key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Cross-tab sync
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key) {
        try {
          setStoredValue(
            event.newValue !== null ? JSON.parse(event.newValue) : initialValue
          );
        } catch {
          setStoredValue(initialValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue];
}

export default useLocalStorage;
