import React from 'react';

const GRID_LEVELS = [0, 20, 40, 60, 80, 100];
const MAX_BAR_HEIGHT = 180; // px for 100%

export default function AttendanceChart({ data, title }) {
  const chartTitle = title || 'Subject-wise Attendance Distribution (Semester 6)';

  return (
    <div
      style={{
        background: 'var(--uv-bg-card)',
        border: '1px solid var(--uv-border)',
        boxShadow: 'var(--uv-card-shadow)',
        padding: '24px',
        borderRadius: '16px'
      }}
    >
      <h3 style={{ fontSize: '16px', color: 'var(--uv-text-primary)', marginBottom: '20px', fontWeight: '700' }}>
        {chartTitle}
      </h3>

      {/* Chart Area */}
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          gap: '0',
          background: 'var(--uv-input-bg)',
          border: '1px solid var(--uv-border)',
          borderRadius: '14px',
          padding: '20px 24px 16px 12px',
          overflow: 'hidden'
        }}
      >
        {/* Y-Axis Labels */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingRight: '10px',
            height: `${MAX_BAR_HEIGHT + 30}px`,
            flexShrink: 0,
            paddingBottom: '30px'
          }}
        >
          {[...GRID_LEVELS].reverse().map((level) => (
            <span
              key={level}
              style={{
                fontSize: '11px',
                color: 'var(--uv-text-subtle)',
                fontWeight: '600',
                lineHeight: 1
              }}
            >
              {level}%
            </span>
          ))}
        </div>

        {/* Grid + Bars Area */}
        <div style={{ flex: 1, position: 'relative' }}>
          {/* Horizontal Grid Lines */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: `${MAX_BAR_HEIGHT}px`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              pointerEvents: 'none'
            }}
          >
            {GRID_LEVELS.map((level) => (
              <div
                key={level}
                style={{
                  width: '100%',
                  height: '1px',
                  background: level === 0 ? 'var(--uv-border)' : 'rgba(148, 163, 184, 0.15)',
                  position: 'relative'
                }}
              />
            ))}
          </div>

          {/* Bars + Labels Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              height: `${MAX_BAR_HEIGHT}px`,
              gap: '32px',
              position: 'relative'
            }}
          >
            {data?.labels?.map((label, idx) => {
              const val = data?.datasets?.[0]?.data?.[idx] || 0;
              const barHeightPx = Math.round((val / 100) * MAX_BAR_HEIGHT);
              const isWarning = val < 75;

              return (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    height: '100%'
                  }}
                >
                  {/* Percentage above bar */}
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '800',
                      color: isWarning ? '#f59e0b' : '#10b981',
                      marginBottom: '5px',
                      letterSpacing: '0.2px'
                    }}
                  >
                    {val}%
                  </span>

                  {/* Bar */}
                  <div
                    style={{
                      width: '96px',
                      height: `${barHeightPx}px`,
                      background: isWarning
                        ? 'linear-gradient(180deg, #f59e0b, #ef4444)'
                        : 'linear-gradient(180deg, #6366f1, #10b981)',
                      borderRadius: '6px 6px 0 0',
                      boxShadow: isWarning
                        ? '0 4px 14px rgba(245, 158, 11, 0.3)'
                        : '0 4px 14px rgba(99, 102, 241, 0.3)',
                      transition: 'height 0.5s ease'
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* X-Axis Baseline */}
          <div
            style={{
              height: '1px',
              background: 'var(--uv-border)',
              width: '100%',
              marginTop: '0'
            }}
          />

          {/* Subject Code Labels */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '32px',
              marginTop: '10px'
            }}
          >
            {data?.labels?.map((label) => (
              <div
                key={label}
                style={{
                  width: '96px',
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: 'var(--uv-text-subtle)'
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
