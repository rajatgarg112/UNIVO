import React from 'react';
import './Badge.css';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
}) => {
  const dotColors = {
    success: '#10b981',
    warning: '#f59e0b',
    danger:  '#ef4444',
    info:    '#06b6d4',
    purple:  '#818cf8',
    default: '#94a3b8',
  };

  return (
    <span className={`badge badge-${variant} badge-${size}`}>
      {dot && (
        <span
          className="badge-dot"
          style={{ background: dotColors[variant] || dotColors.default }}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
