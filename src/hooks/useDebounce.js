import { useState, useEffect } from 'react';

/**
 * Custom Hook: useDebounce
 * Delays updating the debounced value until after the specified delay
 * has passed without any new changes.
 *
 * @param {any} value - The input value to debounce (e.g. search term)
 * @param {number} delay - Delay time in milliseconds (e.g. 300ms)
 * @returns {any} debouncedValue - The debounced value
 */
function useDebounce(value, delay = 300) {
  // State to hold the delayed/debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update debouncedValue after the specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: clears the timer if the user types again before delay finishes
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
