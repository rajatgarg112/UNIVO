import React, { useEffect, useState } from 'react';
import './ProgressRing.css';

const ProgressRing = ({
  percentage = 0,
  size = 80,
  strokeWidth = 6,
  color = '#6366f1',
  label,
  showText = true,
}) => {
  const [animatedPercent, setAnimatedPercent] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedPercent / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercent(Math.min(Math.max(percentage, 0), 100));
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="progress-ring-wrapper" style={{ width: size, height: size }}>
      <svg
        className="progress-ring-svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Track */}
        <circle
          className="progress-ring-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
        />
        {/* Progress */}
        <circle
          className="progress-ring-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {showText && (
        <div className="progress-ring-center">
          <span className="progress-ring-value" style={{ color }}>
            {Math.round(animatedPercent)}
            <span className="progress-ring-pct">%</span>
          </span>
          {label && <span className="progress-ring-label">{label}</span>}
        </div>
      )}
    </div>
  );
};

export default ProgressRing;
