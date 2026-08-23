import { useEffect } from 'react';

/**
 * useClickOutside – calls `callback` when the user clicks outside
 * the element referenced by `ref`.
 *
 * @param {React.RefObject} ref      - Ref attached to the element to monitor
 * @param {Function}        callback - Function to call on outside click
 */
function useClickOutside(ref, callback) {
  useEffect(() => {
    if (!callback) return;

    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback(event);
      }
    };

    // mousedown fires before blur so dropdowns close properly
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [ref, callback]);
}

export default useClickOutside;
