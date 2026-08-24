import React from 'react';
import './AttendanceChart.css';

const GRID_LEVELS = [0, 20, 40, 60, 80, 100];
const MAX_BAR_HEIGHT = 180; // px for 100%

export default function AttendanceChart({ data, title }) {
  const chartTitle = title || 'Subject-wise Attendance Distribution (Semester 6)';

  return (
    <div className="attendance-chart-card">
      <h3 className="attendance-chart-title">
        {chartTitle}
      </h3>

      {/* Chart Area */}
      <div className="attendance-chart-area">
        {/* Y-Axis Labels */}
        <div className="chart-y-axis">
          {[...GRID_LEVELS].reverse().map((level) => (
            <span key={level} className="chart-y-label">
              {level}%
            </span>
          ))}
        </div>

        {/* Grid + Bars Area */}
        <div className="chart-content-area">
          {/* Horizontal Grid Lines */}
          <div className="chart-grid-lines">
            {GRID_LEVELS.map((level) => (
              <div
                key={level}
                className={`chart-grid-line ${level === 0 ? 'zero-line' : ''}`}
              />
            ))}
          </div>

          {/* Bars + Labels Row */}
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

          {/* X-Axis Baseline */}
          <div className="chart-x-baseline" />

          {/* Subject Code Labels */}
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
