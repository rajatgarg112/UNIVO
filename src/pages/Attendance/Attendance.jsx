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
