import React from 'react';
import './Timeline.css';

const Timeline = ({ items = [] }) => {
  if (!items.length) return null;

  return (
    <div className="timeline">
      {items.map((item, index) => (
        <div
          key={item.id || index}
          className={`timeline-item${index === items.length - 1 ? ' timeline-item-last' : ''}`}
        >
          {/* Connector line */}
          <div className="timeline-line-wrapper">
            <div
              className="timeline-dot"
              style={{ background: item.color || '#6366f1' }}
            >
              {item.icon && (
                <span className="timeline-dot-icon">{item.icon}</span>
              )}
            </div>
            {index < items.length - 1 && (
              <div className="timeline-connector"></div>
            )}
          </div>

          {/* Content */}
          <div className="timeline-content">
            <div className="timeline-header">
              <div className="timeline-header-left">
                <span className="timeline-title">{item.title}</span>
                {item.badge && (
                  <span
                    className="timeline-badge"
                    style={{
                      background: `${item.color || '#6366f1'}22`,
                      color: item.color || '#6366f1',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="timeline-time">{item.time}</span>
            </div>
            {item.subtitle && (
              <p className="timeline-subtitle">{item.subtitle}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
