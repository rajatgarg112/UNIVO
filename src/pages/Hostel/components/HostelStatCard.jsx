import React from 'react';
import './HostelStatCard.css';

/**
 * HostelStatCard
 * Reusable summary metric card for displaying key hostel figures.
 * Props:
 * - title: string (name of the metric)
 * - value: string | number (numerical or formatted value)
 * - description: string (supporting subtitle text)
 */
function HostelStatCard({ title, value, description }) {
  return (
    <div className="hostel-stat-card">
      <p className="hostel-stat-title">{title}</p>
      <h3 className="hostel-stat-value">{value}</h3>
      <p className="hostel-stat-description">{description}</p>
    </div>
  );
}

export default HostelStatCard;
