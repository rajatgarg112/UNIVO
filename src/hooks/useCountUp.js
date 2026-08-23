import { useState, useEffect, useRef } from 'react';

/**
 * useCountUp – animates counting from `start` to `end` over `duration` ms.
 * Uses requestAnimationFrame for smooth 60fps animation.
 *
 * @param {number} end      - Target value to count up to
 * @param {number} duration - Animation duration in ms (default 2000)
 * @param {number} start    - Starting value (default 0)
 * @returns {number} current animated count value
 */
function useCountUp(end, duration = 2000, start = 0) {
  const [count, setCount] = useState(start);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    // Reset on prop change
    startTimeRef.current = null;
    setCount(start);

    const animate = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out quad for natural feel
      const easedProgress = 1 - (1 - progress) * (1 - progress);

      const currentValue = Math.round(start + (end - start) * easedProgress);
      setCount(currentValue);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [end, duration, start]);

  return count;
}

export default useCountUp;
