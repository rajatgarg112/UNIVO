import React from 'react';
import './SkeletonLoader.css';

const SkeletonCard = () => (
  <div className="skeleton skeleton-card">
    <div className="skeleton-card-header">
      <div className="skeleton skeleton-avatar"></div>
      <div className="skeleton-card-lines">
        <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
      </div>
    </div>
    <div className="skeleton skeleton-text"></div>
    <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
    <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
  </div>
);

const SkeletonTable = () => (
  <div className="skeleton-table">
    <div className="skeleton-table-header">
      {[100, 140, 80, 120, 60].map((w, i) => (
        <div key={i} className="skeleton skeleton-text" style={{ width: w }}></div>
      ))}
    </div>
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="skeleton-table-row">
        <div className="skeleton skeleton-avatar skeleton-avatar-sm"></div>
        <div className="skeleton skeleton-text" style={{ width: 120 }}></div>
        <div className="skeleton skeleton-text" style={{ width: 80 }}></div>
        <div className="skeleton skeleton-text" style={{ width: 100 }}></div>
        <div className="skeleton skeleton-pill" style={{ width: 60 }}></div>
      </div>
    ))}
  </div>
);

const SkeletonList = () => (
  <div className="skeleton-list">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="skeleton-list-item">
        <div className="skeleton skeleton-avatar"></div>
        <div className="skeleton-list-content">
          <div className="skeleton skeleton-text" style={{ width: '55%' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '35%' }}></div>
        </div>
        <div className="skeleton skeleton-text" style={{ width: 50 }}></div>
      </div>
    ))}
  </div>
);

const SkeletonProfile = () => (
  <div className="skeleton-profile">
    <div className="skeleton skeleton-avatar skeleton-avatar-lg"></div>
    <div className="skeleton skeleton-text" style={{ width: 160, marginTop: 12 }}></div>
    <div className="skeleton skeleton-text" style={{ width: 100 }}></div>
    <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton skeleton-stat-box"></div>
      ))}
    </div>
  </div>
);

const SkeletonText = ({ count }) => (
  <div className="skeleton-text-block">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="skeleton skeleton-text"
        style={{ width: i === count - 1 ? '60%' : '100%' }}
      ></div>
    ))}
  </div>
);

const SkeletonLoader = ({
  type = 'card',
  count = 1,
  width,
  height,
}) => {
  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  const renderSkeleton = () => {
    switch (type) {
      case 'card':     return <SkeletonCard />;
      case 'table':    return <SkeletonTable />;
      case 'list':     return <SkeletonList />;
      case 'profile':  return <SkeletonProfile />;
      case 'text':     return <SkeletonText count={count} />;
      default:         return <div className="skeleton" style={style}></div>;
    }
  };

  if (type === 'text' || type === 'table' || type === 'list' || type === 'profile') {
    return renderSkeleton();
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={style}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
};

export default SkeletonLoader;
