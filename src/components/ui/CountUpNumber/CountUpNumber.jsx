import React, { useEffect, useRef, useState } from 'react';
import './CountUpNumber.css';

const easeOutQuad = (t) => t * (2 - t);

const CountUpNumber = ({
  end = 0,
  duration = 1800,
  prefix = '',
  suffix = '',
  decimals = 0,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef(null);
  const rafRef = useRef(null);

  const startAnimation = () => {
    const startTime = performance.now();
    const startValue = 0;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuad(progress);
      const current = startValue + (end - startValue) * easedProgress;
      setDisplayValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          startAnimation();
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, duration]);

  const formatted = displayValue.toFixed(decimals);

  return (
    <span ref={containerRef} className="count-up-number">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

export default CountUpNumber;
