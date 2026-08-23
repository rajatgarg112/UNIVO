import React from 'react';
import './EmptyState.css';

const defaultIllustrations = {
  search: (
    <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
      <circle cx="17" cy="17" r="11" stroke="#6366f1" strokeWidth="2.5" />
      <line x1="25" y1="25" x2="35" y2="35" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="13" y1="17" x2="21" y2="17" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" />
      <line x1="17" y1="13" x2="17" y2="21" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  empty: (
    <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
      <rect x="6" y="10" width="28" height="22" rx="4" stroke="#6366f1" strokeWidth="2.5" />
      <path d="M6 16h28" stroke="#818cf8" strokeWidth="2" />
      <circle cx="20" cy="25" r="4" stroke="#6366f1" strokeWidth="2" />
    </svg>
  ),
  error: (
    <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="15" stroke="#ef4444" strokeWidth="2.5" />
      <line x1="14" y1="14" x2="26" y2="26" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="26" y1="14" x2="14" y2="26" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  success: (
    <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="15" stroke="#10b981" strokeWidth="2.5" />
      <polyline points="13,20 18,25 27,15" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const EmptyState = ({
  icon,
  title = 'Nothing here yet',
  description = 'There is no data to display at the moment.',
  actionLabel,
  onAction,
  illustration = 'empty',
}) => {
  const illustrationNode = defaultIllustrations[illustration] || defaultIllustrations.empty;

  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {icon || illustrationNode}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      {description && (
        <p className="empty-state-description">{description}</p>
      )}
      {actionLabel && onAction && (
        <button className="empty-state-action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
