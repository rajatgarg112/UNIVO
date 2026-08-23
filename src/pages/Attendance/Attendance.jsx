import React, { useState } from 'react';
import initialAttendanceData from '../../data/attendance.json';
import AttendanceCard from './AttendanceCard';
import AttendanceChart from '../../components/charts/AttendanceChart/AttendanceChart';
import { LayoutGrid, List } from 'lucide-react';
import './Attendance.css';

const SEMESTERS = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'];

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
    if (pct >= 75) return { label: 'Safe', color: '#10b981', bg: 'var(--uv-success-bg)' };
    if (pct >= 65) return { label: 'Warning', color: '#f59e0b', bg: 'var(--uv-warning-bg)' };
    return { label: 'Danger', color: '#ef4444', bg: 'var(--uv-danger-bg)' };
  };

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--uv-text-primary)', margin: 0 }}>Attendance Portal</h2>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '4px 10px',
              borderRadius: '999px',
              background: 'var(--uv-input-bg)',
              border: '1px solid var(--uv-border)',
              color: 'var(--uv-text-muted)',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              View-only • Attendance is updated by faculty
            </span>
          </div>
          <p style={{ color: 'var(--uv-text-muted)', fontSize: '14px', margin: 0 }}>Semester subject-wise class attendance tracking and summary</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              background: 'var(--uv-bg-card)',
              border: '1px solid var(--uv-border)',
              color: 'var(--uv-text-primary)',
              fontSize: '13px',
              cursor: 'pointer',
              fontWeight: '700',
              boxShadow: 'var(--uv-card-shadow)'
            }}
          >
            {SEMESTERS.map((sem) => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>

          <div style={{ display: 'flex', gap: '4px', background: 'var(--uv-input-bg)', padding: '4px', borderRadius: '10px', border: '1px solid var(--uv-border)' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === 'grid' ? '#6366f1' : 'transparent',
                color: viewMode === 'grid' ? '#ffffff' : 'var(--uv-text-muted)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Grid View"
            >
              <LayoutGrid size={15} /> Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === 'table' ? '#6366f1' : 'transparent',
                color: viewMode === 'table' ? '#ffffff' : 'var(--uv-text-muted)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
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
          <span className="summary-card-val" style={{ color: overallPercentage >= 75 ? '#10b981' : overallPercentage >= 65 ? '#f59e0b' : '#ef4444' }}>
            {overallPercentage}%
          </span>
          <span className="summary-card-sub" style={{ color: overallPercentage >= 75 ? '#10b981' : '#f59e0b', fontWeight: '600' }}>
            {overallPercentage < 75 ? `Need ${needed75Overall} classes for 75%` : 'Status: Safe Standing'}
          </span>
        </div>

        <div className="attendance-summary-card">
          <span className="summary-card-lbl">Classes Attended</span>
          <span className="summary-card-val" style={{ color: '#6366f1' }}>
            {attendedClassesCount} <span style={{ fontSize: '16px', color: 'var(--uv-text-subtle)', fontWeight: '500' }}>/ {totalClassesCount}</span>
          </span>
          <span className="summary-card-sub">Total Conducted</span>
        </div>

        <div className="attendance-summary-card">
          <span className="summary-card-lbl">Classes Missed</span>
          <span className="summary-card-val" style={{ color: '#ef4444' }}>
            {missedClassesCount}
          </span>
          <span className="summary-card-sub">Total Absent Classes</span>
        </div>

        <div className="attendance-summary-card">
          <span className="summary-card-lbl">Subjects Tracked</span>
          <span className="summary-card-val" style={{ color: '#06b6d4' }}>
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
        <div style={{ background: 'var(--uv-bg-card)', border: '1px solid var(--uv-border)', boxShadow: 'var(--uv-card-shadow)', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--uv-bg-page)', borderBottom: '1px solid var(--uv-border)' }}>
                <th style={{ padding: '14px 16px', color: 'var(--uv-text-muted)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Subject</th>
                <th style={{ padding: '14px 16px', color: 'var(--uv-text-muted)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Code</th>
                <th style={{ padding: '14px 16px', color: 'var(--uv-text-muted)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Faculty</th>
                <th style={{ padding: '14px 16px', color: 'var(--uv-text-muted)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Attended</th>
                <th style={{ padding: '14px 16px', color: 'var(--uv-text-muted)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Total</th>
                <th style={{ padding: '14px 16px', color: 'var(--uv-text-muted)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Attendance %</th>
                <th style={{ padding: '14px 16px', color: 'var(--uv-text-muted)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subj) => {
                const att = subj.attended !== undefined ? subj.attended : (subj.attendedClasses || 0);
                const tot = subj.total !== undefined ? subj.total : (subj.totalClasses || 0);
                const pct = tot > 0 ? Math.round((att / tot) * 100) : 0;
                const statusInfo = getStatus(pct);

                return (
                  <tr key={subj.id || subj.code} style={{ borderBottom: '1px solid var(--uv-border)' }}>
                    <td style={{ padding: '14px 16px', color: 'var(--uv-text-primary)', fontWeight: '700' }}>{subj.name}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--uv-primary)', fontSize: '13px', fontWeight: '700' }}>{subj.code}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--uv-text-muted)', fontSize: '13px' }}>{subj.faculty}</td>
                    <td style={{ padding: '14px 16px', color: '#10b981', fontWeight: '700' }}>{att}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--uv-text-primary)', fontWeight: '700' }}>{tot}</td>
                    <td style={{ padding: '14px 16px', color: statusInfo.color, fontWeight: '800', fontSize: '15px' }}>{pct}%</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '999px', background: statusInfo.bg, color: statusInfo.color, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
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
      <div style={{ marginTop: '24px' }}>
        <AttendanceChart data={chartData} title={`Subject-wise Attendance Distribution (${selectedSemester})`} />
      </div>
    </div>
  );
}
