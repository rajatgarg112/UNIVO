import React, { useState } from 'react';
import initialAttendanceData from '../../data/attendance.json';
import { LayoutGrid, List } from 'lucide-react';
import './Attendance.css';

const SEMESTERS = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'];
const GRID_LEVELS = [0, 20, 40, 60, 80, 100];
const MAX_BAR_HEIGHT = 180;

/* Compact SVG Progress Ring Component */
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

/* Subject Attendance Card Component */
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

/* Attendance Chart Component */
function AttendanceChart({ data, title }) {
  const chartTitle = title || 'Subject-wise Attendance Distribution (Semester 6)';

  return (
    <div className="attendance-chart-card">
      <h3 className="attendance-chart-title">
        {chartTitle}
      </h3>

      <div className="attendance-chart-area">
        <div className="chart-y-axis">
          {[...GRID_LEVELS].reverse().map((level) => (
            <span key={level} className="chart-y-label">
              {level}%
            </span>
          ))}
        </div>

        <div className="chart-content-area">
          <div className="chart-grid-lines">
            {GRID_LEVELS.map((level) => (
              <div
                key={level}
                className={`chart-grid-line ${level === 0 ? 'zero-line' : ''}`}
              />
            ))}
          </div>

          <div className="chart-bars-row">
            {data?.labels?.map((label, idx) => {
              const val = data?.datasets?.[0]?.data?.[idx] || 0;
              const barHeightPx = Math.round((val / 100) * MAX_BAR_HEIGHT);
              const isWarning = val < 75;

              return (
                <div key={label} className="chart-bar-item">
                  <span className={`chart-bar-val ${isWarning ? 'warning-val' : 'safe-val'}`}>
                    {val}%
                  </span>
                  <div
                    className={`chart-bar-fill ${isWarning ? 'bar-warning' : 'bar-safe'}`}
                    style={{ height: `${barHeightPx}px` }}
                  />
                </div>
              );
            })}
          </div>

          <div className="chart-x-baseline" />

          <div className="chart-x-labels">
            {data?.labels?.map((label) => (
              <div key={label} className="chart-x-label">
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Attendance() {
  const [selectedSemester, setSelectedSemester] = useState('Semester 6');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const subjects = initialAttendanceData.subjects || [];

  // Summary Calculations
  let totalClassesCount = 0;
  let attendedClassesCount = 0;

  subjects.forEach((s) => {
    totalClassesCount += s.attended !== undefined ? s.total : (s.totalClasses || 0);
    attendedClassesCount += s.attended !== undefined ? s.attended : (s.attendedClasses || 0);
  });

  const missedClassesCount = Math.max(0, totalClassesCount - attendedClassesCount);
  const subjectsTrackedCount = subjects.length;
  const overallPercentage = totalClassesCount > 0 ? Math.round((attendedClassesCount / totalClassesCount) * 100) : 0;
  const needed75Overall = overallPercentage < 75 ? Math.max(0, Math.ceil((0.75 * totalClassesCount - attendedClassesCount) / 0.25)) : 0;

  const getStatus = (pct) => {
    if (pct >= 75) return { label: 'Safe', colorClass: 'pct-safe', bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981' };
    if (pct >= 65) return { label: 'Warning', colorClass: 'pct-warning', bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' };
    return { label: 'Danger', colorClass: 'pct-danger', bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' };
  };

  const overallColorClass = overallPercentage >= 75 ? 'overall-safe' : overallPercentage >= 65 ? 'overall-warning' : 'overall-danger';
  const overallSubClass = overallPercentage >= 75 ? 'sub-safe' : 'sub-warning';

  // Chart Dataset
  const chartData = {
    labels: subjects.map((s) => s.code),
    datasets: [
      {
        label: 'Attendance %',
        data: subjects.map((s) => {
          const att = s.attended !== undefined ? s.attended : (s.attendedClasses || 0);
          const tot = s.total !== undefined ? s.total : (s.totalClasses || 0);
          return tot > 0 ? Math.round((att / tot) * 100) : 0;
        })
      }
    ]
  };

  return (
    <div className="attendance-page">
      {/* Header */}
      <div className="attendance-header">
        <div>
          <div className="attendance-header-title-box">
            <h2 className="attendance-header-title">Attendance Portal</h2>
            <span className="attendance-view-only-badge">
              View-only • Attendance is updated by faculty
            </span>
          </div>
          <p className="attendance-header-subtitle">Semester subject-wise class attendance tracking and summary</p>
        </div>

        <div className="attendance-header-controls">
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="attendance-semester-select"
          >
            {SEMESTERS.map((sem) => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>

          <div className="attendance-view-toggle">
            <button
              onClick={() => setViewMode('grid')}
              className={`attendance-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              title="Grid View"
            >
              <LayoutGrid size={15} /> Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`attendance-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              title="Table View"
            >
              <List size={15} /> Table
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="attendance-summary-grid">
        <div className="attendance-summary-card">
          <span className="summary-card-lbl">Overall Attendance</span>
          <span className={`summary-card-val ${overallColorClass}`}>
            {overallPercentage}%
          </span>
          <span className={`summary-card-sub ${overallSubClass}`}>
            {overallPercentage < 75 ? `Need ${needed75Overall} classes for 75%` : 'Status: Safe Standing'}
          </span>
        </div>

        <div className="attendance-summary-card">
          <span className="summary-card-lbl">Classes Attended</span>
          <span className="summary-card-val attended-color">
            {attendedClassesCount} <span className="summary-card-val-sub">/ {totalClassesCount}</span>
          </span>
          <span className="summary-card-sub">Total Conducted</span>
        </div>

        <div className="attendance-summary-card">
          <span className="summary-card-lbl">Classes Missed</span>
          <span className="summary-card-val missed-color">
            {missedClassesCount}
          </span>
          <span className="summary-card-sub">Total Absent Classes</span>
        </div>

        <div className="attendance-summary-card">
          <span className="summary-card-lbl">Subjects Tracked</span>
          <span className="summary-card-val tracked-color">
            {subjectsTrackedCount}
          </span>
          <span className="summary-card-sub">In {selectedSemester}</span>
        </div>
      </div>

      {/* Grid or Table View */}
      {viewMode === 'grid' ? (
        <div className="attendance-subjects-grid">
          {subjects.map((subj) => (
            <AttendanceCard key={subj.id || subj.code} subject={subj} />
          ))}
        </div>
      ) : (
        <div className="attendance-table-card">
          <table className="attendance-table">
            <thead>
              <tr className="attendance-table-header-row">
                <th className="attendance-th">Subject</th>
                <th className="attendance-th">Code</th>
                <th className="attendance-th">Faculty</th>
                <th className="attendance-th">Attended</th>
                <th className="attendance-th">Total</th>
                <th className="attendance-th">Attendance %</th>
                <th className="attendance-th">Status</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subj) => {
                const att = subj.attended !== undefined ? subj.attended : (subj.attendedClasses || 0);
                const tot = subj.total !== undefined ? subj.total : (subj.totalClasses || 0);
                const pct = tot > 0 ? Math.round((att / tot) * 100) : 0;
                const statusInfo = getStatus(pct);

                return (
                  <tr key={subj.id || subj.code} className="attendance-tr">
                    <td className="attendance-td attendance-td-subject">{subj.name}</td>
                    <td className="attendance-td attendance-td-code">{subj.code}</td>
                    <td className="attendance-td attendance-td-faculty">{subj.faculty}</td>
                    <td className="attendance-td attendance-td-attended">{att}</td>
                    <td className="attendance-td attendance-td-total">{tot}</td>
                    <td className={`attendance-td attendance-td-percent ${statusInfo.colorClass}`}>{pct}%</td>
                    <td className="attendance-td">
                      <span className={`attendance-status-badge status-badge-${statusInfo.label.toLowerCase()}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Chart */}
      <div className="attendance-chart-wrapper">
        <AttendanceChart data={chartData} title={`Subject-wise Attendance Distribution (${selectedSemester})`} />
      </div>
    </div>
  );
}
