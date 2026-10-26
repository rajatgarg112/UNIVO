import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  Search,
  CheckCircle,
  Clock,
  ExternalLink,
  Trash2,
  Briefcase,
  ArrowRight
} from 'lucide-react';
import usePlacementApplications from './usePlacementApplications';
import './Placement.css';

/**
 * Page Component: MyApplications
 * Demonstrates:
 * - LocalStorage persistence across page reloads (via usePlacementApplications hook)
 * - Filtering by status (All, Under Review, Shortlisted, etc.)
 * - Search by company or role name
 * - Controlled input with useState
 * - Optimized list calculation with useMemo
 * - CRUD: Delete / Withdraw application record with user confirmation
 * - Conditional rendering for empty state vs. applications table
 */
export default function MyApplications() {
  const { applications, withdrawApplication } = usePlacementApplications();

  // 1. Search and status filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // 2. Filtered list calculation with useMemo
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Filter by status
      const matchesStatus =
        statusFilter === 'all' ||
        app.status.toLowerCase().replace(/\s+/g, '-') === statusFilter.toLowerCase().replace(/\s+/g, '-');

      // Filter by search query
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        app.company.toLowerCase().includes(query) ||
        app.role.toLowerCase().includes(query) ||
        (app.studentName && app.studentName.toLowerCase().includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [applications, statusFilter, searchTerm]);

  // 3. Stats summary
  const stats = useMemo(() => {
    const total = applications.length;
    const underReview = applications.filter((a) => a.status.toLowerCase() === 'under review').length;
    const shortlisted = applications.filter((a) => a.status.toLowerCase() === 'shortlisted').length;
    return { total, underReview, shortlisted };
  }, [applications]);

  // 4. Handle withdraw action
  const handleWithdraw = (appId, companyName) => {
    const confirmed = window.confirm(
      `Are you sure you want to withdraw your application for ${companyName}?`
    );
    if (confirmed) {
      withdrawApplication(appId);
    }
  };

  // Helper for status pill styling
  const getStatusClass = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('shortlist')) return 'shortlisted';
    if (s.includes('interview')) return 'interview-scheduled';
    if (s.includes('reject')) return 'rejected';
    return 'under-review';
  };

  return (
    <div className="placement-page">
      {/* ─── Header ─── */}
      <div className="placement-header">
        <div className="placement-header-left">
          <h1 className="placement-title">My Applications</h1>
          <p className="placement-subtitle">
            Track and manage your submitted placement applications in one place.
          </p>
        </div>

        <div className="placement-header-actions">
          <Link to="/placements" className="btn-placement-nav">
            <Briefcase size={15} /> Browse Placement Drives
          </Link>
        </div>
      </div>

      {/* ─── Summary Stats Cards ─── */}
      <div className="placement-stats-grid">
        <div className="placement-stat-card">
          <div className="stat-icon-wrapper red">
            <Send size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Applications</span>
          </div>
        </div>

        <div className="placement-stat-card">
          <div className="stat-icon-wrapper blue">
            <Clock size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.underReview}</span>
            <span className="stat-label">Under Review</span>
          </div>
        </div>

        <div className="placement-stat-card">
          <div className="stat-icon-wrapper green">
            <CheckCircle size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.shortlisted}</span>
            <span className="stat-label">Shortlisted</span>
          </div>
        </div>
      </div>

      {/* ─── Search & Status Filters ─── */}
      <div className="placement-toolbar">
        {/* Search */}
        <div className="placement-search-box">
          <Search size={16} />
          <input
            type="text"
            className="placement-search-input"
            placeholder="Search applications by company or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter controls */}
        <div className="placement-filter-controls">
          <select
            className="placement-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by application status"
          >
            <option value="all">All Statuses</option>
            <option value="under-review">Under Review</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview-scheduled">Interview Scheduled</option>
            <option value="rejected">Rejected</option>
          </select>

          <span className="results-count-badge">
            {filteredApplications.length} {filteredApplications.length === 1 ? 'record' : 'records'}
          </span>
        </div>
      </div>

      {/* ─── Applications Table or Empty State ─── */}
      {filteredApplications.length > 0 ? (
        <div className="applications-table-wrapper">
          <table className="applications-table">
            <thead>
              <tr>
                <th>Company & Role</th>
                <th>Package</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Resume</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app.id}>
                  {/* Company & Role */}
                  <td>
                    <div className="app-company-cell">
                      <div className="company-logo-initial">{app.company[0]}</div>
                      <div>
                        <div className="app-company-name">{app.company}</div>
                        <div className="app-role-subtitle">{app.role}</div>
                      </div>
                    </div>
                  </td>

                  {/* Package */}
                  <td>
                    <span className="package-badge">{app.packageDisplay}</span>
                  </td>

                  {/* Applied Date */}
                  <td>
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                      {app.appliedDate || 'Recent'}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td>
                    <span className={`status-pill ${getStatusClass(app.status)}`}>
                      {app.status}
                    </span>
                  </td>

                  {/* Resume Link */}
                  <td>
                    {app.resumeLink ? (
                      <a
                        href={app.resumeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '12px',
                          color: '#D71920',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        Resume <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span style={{ color: '#64748b', fontSize: '12px' }}>On file</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                      <Link
                        to={`/placements/${app.driveId}`}
                        className="btn-table-action"
                        title="View Drive Details"
                      >
                        Details <ArrowRight size={12} />
                      </Link>

                      <button
                        onClick={() => handleWithdraw(app.id, app.company)}
                        className="btn-table-action withdraw"
                        title="Withdraw this application"
                        aria-label={`Withdraw application for ${app.company}`}
                      >
                        <Trash2 size={13} /> Withdraw
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty State */
        <div className="placement-empty-state">
          <div className="empty-state-icon">
            <Send size={28} />
          </div>
          <h3>
            {applications.length === 0
              ? 'No applications submitted yet'
              : 'No applications match your filter'}
          </h3>
          <p>
            {applications.length === 0
              ? 'You have not submitted any placement applications yet. Explore active campus drives and apply for top tech roles.'
              : 'Try clearing your search term or changing the status filter to see all your applications.'}
          </p>
          {applications.length === 0 ? (
            <Link to="/placements" className="btn-placement-primary">
              <Briefcase size={15} /> Explore Active Drives
            </Link>
          ) : (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="btn-placement-primary"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
