import React from 'react';
import './AttendanceCard.css';

/* ── Compact Inline SVG Progress Ring ── */
function ProgressRing({ percent, size = 56, strokeWidth = 5, status }) {
  const safePercent = isNaN(percent) || percent === undefined ? 0 : Math.min(100, Math.max(0, percent));
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safePercent / 100) * circumference;

  const colorMap = {
    safe: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
  };
  const color = colorMap[status] || '#6366f1';

  return (
    <div className="progress-ring-wrapper" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--uv-border)"
          strokeWidth={strokeWidth}
        />
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
        <span className="progress-ring-percent" style={{ color, fontSize: '13px', fontWeight: '800' }}>
          {safePercent}%
        </span>
      </div>
    </div>
  );
}

/* ── Compact Redesigned AttendanceCard Component ── */
function AttendanceCard({ subject }) {
  const {
    id,
    name,
    code,
    attendedClasses,
    attended,
    totalClasses,
    total,
    faculty,
  } = subject;

  // Normalize field names
  const validAttended = attendedClasses !== undefined ? attendedClasses : (attended || 0);
  const validTotal = totalClasses !== undefined ? totalClasses : (total || 0);
  const missedClasses = Math.max(0, validTotal - validAttended);

  // Percentage Formula
  const percent = validTotal > 0 ? Math.round((validAttended / validTotal) * 100) : 0;

  // Status Logic
  let status = 'safe';
  if (percent < 65) status = 'danger';
  else if (percent < 75) status = 'warning';

  const statusLabel = { safe: 'SAFE', warning: 'WARNING', danger: 'CRITICAL' }[status];

  // Calculate classes needed or classes allowed to miss
  const needed75 = percent < 75 ? Math.max(0, Math.ceil((0.75 * validTotal - validAttended) / 0.25)) : 0;
  const canMiss = status === 'safe' ? Math.max(0, Math.floor((validAttended - 0.75 * validTotal) / 0.75)) : 0;

  return (
    <div className={`subject-attendance-card ${status}-card`}>
      {/* TOP SECTION: Subject Name, Code, Faculty, Status Badge, Percentage Ring */}
      <div className="sac-header">
        <div style={{ flex: 1, paddingRight: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <h3 className="subject-name">{name || 'Subject Name'}</h3>
            <span className={`status-badge-inline ${status}`}>{statusLabel}</span>
          </div>
          <div className="subject-faculty-row">
            <span className="code-pill">{code || 'CS301'}</span>
            <span>•</span>
            <span>{faculty || 'Dr. Faculty Name'}</span>
          </div>
        </div>
        <ProgressRing percent={percent} size={54} status={status} />
      </div>

      {/* MIDDLE SECTION: Attended, Total, Missed Stats Grid */}
      <div className="sac-stats-row">
        <div className="sac-stat-col">
          <span className="sac-stat-label">Attended</span>
          <span className="sac-stat-val" style={{ color: '#10b981' }}>{validAttended}</span>
        </div>
        <div className="sac-stat-col">
          <span className="sac-stat-label">Total</span>
          <span className="sac-stat-val">{validTotal}</span>
        </div>
        <div className="sac-stat-col">
          <span className="sac-stat-label">Missed</span>
          <span className="sac-stat-val" style={{ color: '#ef4444' }}>{missedClasses}</span>
        </div>
      </div>

      {/* BOTTOM SECTION: Attendance Guidance Text */}
      <div className={`sac-guidance-box ${status !== 'safe' ? 'warning-guidance' : ''}`}>
        {status === 'safe' && (
          <>You can miss <strong>{canMiss}</strong> more class{canMiss !== 1 ? 'es' : ''}</>
        )}
        {status === 'warning' && (
          <>Attend <strong>{needed75}</strong> more class{needed75 !== 1 ? 'es' : ''} to reach 75%</>
        )}
        {status === 'danger' && (
          <>Critical — attend <strong>{needed75}</strong> consecutive classes</>
        )}
      </div>
    </div>
  );
}

export default AttendanceCard;
