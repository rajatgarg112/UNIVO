import React from 'react';
import './AttendanceCard.css';

/* Compact SVG Progress Ring */
function ProgressRing({ percent, size = 56, strokeWidth = 5, status }) {
  const safePercent = Math.min(100, Math.max(0, percent || 0));
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safePercent / 100) * circumference;

  const colorMap = { safe: '#10b981', warning: '#f59e0b', danger: '#ef4444' };
  const color = colorMap[status] || '#D71920';

  return (
    <div className="progress-ring-wrapper" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="progress-ring-svg">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="progress-ring-text">
        <span className="progress-ring-percent" style={{ color }}>
          {safePercent}%
        </span>
      </div>
    </div>
  );
}

/* AttendanceCard Component */
function AttendanceCard({ subject }) {
  const attended = subject.attended || subject.attendedClasses || 0;
  const total = subject.total || subject.totalClasses || 0;
  const missed = Math.max(0, total - attended);
  const percent = total > 0 ? Math.round((attended / total) * 100) : 0;

  let status = 'safe';
  if (percent < 65) status = 'danger';
  else if (percent < 75) status = 'warning';

  const statusLabel = { safe: 'SAFE', warning: 'WARNING', danger: 'CRITICAL' }[status];
  const needed75 = percent < 75 ? Math.max(0, Math.ceil((0.75 * total - attended) / 0.25)) : 0;
  const canMiss = status === 'safe' ? Math.max(0, Math.floor((attended - 0.75 * total) / 0.75)) : 0;

  return (
    <div className={`subject-attendance-card ${status}-card`}>
      <div className="sac-header">
        <div className="sac-header-left">
          <div className="sac-title-row">
            <h3 className="subject-name">{subject.name}</h3>
            <span className={`status-badge-inline ${status}`}>{statusLabel}</span>
          </div>
          <div className="subject-faculty-row">
            <span className="code-pill">{subject.code}</span>
            <span>•</span>
            <span>{subject.faculty}</span>
          </div>
        </div>
        <ProgressRing percent={percent} size={54} status={status} />
      </div>

      <div className="sac-stats-row">
        <div className="sac-stat-col">
          <span className="sac-stat-label">Attended</span>
          <span className="sac-stat-val attended-green">{attended}</span>
        </div>
        <div className="sac-stat-col">
          <span className="sac-stat-label">Total</span>
          <span className="sac-stat-val">{total}</span>
        </div>
        <div className="sac-stat-col">
          <span className="sac-stat-label">Missed</span>
          <span className="sac-stat-val missed-red">{missed}</span>
        </div>
      </div>

      <div className={`sac-guidance-box ${status !== 'safe' ? 'warning-guidance' : ''}`}>
        {status === 'safe' && <>You can miss <strong>{canMiss}</strong> more class{canMiss !== 1 ? 'es' : ''}</>}
        {status === 'warning' && <>Attend <strong>{needed75}</strong> more class{needed75 !== 1 ? 'es' : ''} to reach 75%</>}
        {status === 'danger' && <>Critical — attend <strong>{needed75}</strong> consecutive classes</>}
      </div>
    </div>
  );
}

export default AttendanceCard;
