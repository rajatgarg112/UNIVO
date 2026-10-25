import React, { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Search,
  MapPin,
  Users,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Send,
  FileCheck2,
  X
} from 'lucide-react';
import initialDrives from '../../data/placements.json';
import { useAuth } from '../../context/AuthContext';
import usePlacementApplications from './usePlacementApplications';
import './Placement.css';

/**
 * Helper Component: DriveCard
 * Demonstrates: Component Composition, Props, and Conditional Rendering
 */
function DriveCard({ drive, isApplied, onViewDetails }) {
  const {
    id,
    company,
    role,
    packageDisplay,
    eligibility,
    deadline,
    location,
    openings,
    description,
    jobType,
    category
  } = drive;

  // Calculate if deadline is closing soon (within the next 7 days and not yet passed)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);

  const diffInDays = Math.round((deadlineDate - today) / (1000 * 60 * 60 * 24));
  const isUrgent = diffInDays >= 0 && diffInDays <= 7;

  return (
    <div className="placement-card">
      <div>
        {/* Card Header: Logo, Name, Role & Package */}
        <div className="placement-card-top">
          <div className="company-avatar-box">
            <div className="company-logo-initial">{company[0]}</div>
            <div className="company-info">
              <h3>{company}</h3>
              <p className="company-role-title">{role}</p>
            </div>
          </div>
          <span className="package-badge">{packageDisplay}</span>
        </div>

        {/* Short Description */}
        <p className="placement-card-desc" style={{ marginTop: '12px' }}>
          {description}
        </p>

        {/* Drive Metadata List */}
        <div className="placement-meta-list" style={{ marginTop: '14px' }}>
          <div className="meta-row">
            <span className="meta-row-label">
              <Award size={13} /> Eligibility
            </span>
            <span className="meta-row-value">{eligibility}</span>
          </div>

          <div className="meta-row">
            <span className="meta-row-label">
              <MapPin size={13} /> Location
            </span>
            <span className="meta-row-value">{location}</span>
          </div>

          <div className="meta-row">
            <span className="meta-row-label">
              <Clock size={13} /> Deadline
            </span>
            <span className={`meta-row-value ${isUrgent ? 'deadline-urgent' : ''}`}>
              {deadline} {isUrgent && '(Closing Soon)'}
            </span>
          </div>

          <div className="meta-row">
            <span className="meta-row-label">
              <Users size={13} /> Openings & Type
            </span>
            <span className="meta-row-value">
              {openings} Posts • {jobType}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer: Status & Action Button */}
      <div className="placement-card-footer">
        {isApplied ? (
          <span className="applied-pill">
            <CheckCircle2 size={13} /> Applied
          </span>
        ) : (
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
            Category: <strong style={{ color: '#D71920' }}>{category || 'Standard'}</strong>
          </span>
        )}

        <button
          onClick={() => onViewDetails(id)}
          className="btn-card-action"
          aria-label={`View details for ${company}`}
        >
          {isApplied ? 'View Status' : 'View & Apply'} <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

/**
 * Main Page Component: PlacementList
 * Demonstrates:
 * - useState for search, filter, and sorting states
 * - useMemo for performant search/filter/sorting calculation
 * - useCallback for event handlers
 * - Custom hook integration (usePlacementApplications)
 * - Conditional rendering for empty state and applied status
 */
export default function PlacementList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { applications, isApplied } = usePlacementApplications();

  // Read student's CGPA from AuthContext if available
  const studentCgpa = user?.cgpa ? parseFloat(user.cgpa) : null;

  // 1. Search, Filter, and Sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedEligibility, setSelectedEligibility] = useState('all');
  const [sortBy, setSortBy] = useState('package-desc');

  // 2. Clear filters helper
  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedRole('all');
    setSelectedEligibility('all');
    setSortBy('package-desc');
  }, []);

  // 3. Filter and Sort logic wrapped in useMemo for optimal performance
  const filteredDrives = useMemo(() => {
    let result = [...initialDrives];

    // Search query filter (company name or role)
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase().trim();
      result = result.filter(
        (drive) =>
          drive.company.toLowerCase().includes(query) ||
          drive.role.toLowerCase().includes(query) ||
          drive.location.toLowerCase().includes(query)
      );
    }

    // Role filter
    if (selectedRole !== 'all') {
      result = result.filter((drive) => {
        if (selectedRole === 'software') {
          return drive.role.toLowerCase().includes('software') || drive.role.toLowerCase().includes('engineer');
        }
        if (selectedRole === 'cloud') {
          return drive.role.toLowerCase().includes('cloud') || drive.role.toLowerCase().includes('network');
        }
        if (selectedRole === 'analyst') {
          return drive.role.toLowerCase().includes('analyst');
        }
        if (selectedRole === 'frontend') {
          return drive.role.toLowerCase().includes('frontend') || drive.role.toLowerCase().includes('react');
        }
        return true;
      });
    }

    // Eligibility filter (based on minimum CGPA)
    if (selectedEligibility !== 'all') {
      const maxAllowedMinCgpa = parseFloat(selectedEligibility);
      result = result.filter((drive) => drive.minCgpa <= maxAllowedMinCgpa);
    }

    // Sorting logic
    result.sort((a, b) => {
      if (sortBy === 'package-desc') {
        return b.package - a.package;
      }
      if (sortBy === 'package-asc') {
        return a.package - b.package;
      }
      if (sortBy === 'deadline-asc') {
        return a.deadline.localeCompare(b.deadline);
      }
      if (sortBy === 'company-asc') {
        return a.company.localeCompare(b.company);
      }
      return 0;
    });

    return result;
  }, [searchTerm, selectedRole, selectedEligibility, sortBy]);

  // 4. Quick Statistics calculations using useMemo
  const stats = useMemo(() => {
    const total = initialDrives.length;
    const appliedCount = applications.length;
    const topPackage = Math.max(...initialDrives.map((d) => d.package));
    // Calculate eligible drives where drive's minimum CGPA is met, or all if profile CGPA not set
    const eligibleCount =
      studentCgpa !== null
        ? initialDrives.filter((d) => d.minCgpa <= studentCgpa).length
        : initialDrives.length;

    return { total, appliedCount, topPackage, eligibleCount };
  }, [applications, studentCgpa]);

  // 5. Navigation handler to dynamic route
  const handleViewDetails = (driveId) => {
    navigate(`/placements/${driveId}`);
  };

  return (
    <div className="placement-page">
      {/* ─── Page Header ─── */}
      <div className="placement-header">
        <div className="placement-header-left">
          <h1 className="placement-title">Campus Placements</h1>
          <p className="placement-subtitle">
            Explore recruitment drives, review eligibility criteria, and submit applications.
          </p>
        </div>

        <div className="placement-header-actions">
          <Link to="/placements/applications" className="btn-placement-nav">
            <Send size={15} />
            My Applications ({applications.length})
          </Link>
        </div>
      </div>

      {/* ─── Statistics Cards ─── */}
      <div className="placement-stats-grid">
        <div className="placement-stat-card">
          <div className="stat-icon-wrapper red">
            <Briefcase size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Active Drives</span>
          </div>
        </div>

        <div className="placement-stat-card">
          <div className="stat-icon-wrapper green">
            <FileCheck2 size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.appliedCount}</span>
            <span className="stat-label">Applications Sent</span>
          </div>
        </div>

        <div className="placement-stat-card">
          <div className="stat-icon-wrapper purple">
            <TrendingUp size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-value">₹{stats.topPackage} LPA</span>
            <span className="stat-label">Highest Package</span>
          </div>
        </div>

        <div className="placement-stat-card">
          <div className="stat-icon-wrapper blue">
            <Award size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.eligibleCount}</span>
            <span className="stat-label">Eligible Drives</span>
          </div>
        </div>
      </div>

      {/* ─── Search, Filter & Sort Toolbar ─── */}
      <div className="placement-toolbar">
        {/* Search Input (Controlled Component) */}
        <div className="placement-search-box">
          <Search size={16} />
          <input
            type="text"
            className="placement-search-input"
            placeholder="Search by company name, role, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{ color: '#94a3b8', cursor: 'pointer' }}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter & Sort Controls */}
        <div className="placement-filter-controls">
          {/* Filter by Role */}
          <select
            className="placement-select"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            aria-label="Filter by role"
          >
            <option value="all">All Roles</option>
            <option value="software">Software / SDE</option>
            <option value="cloud">Cloud / Networking</option>
            <option value="analyst">Technology Analyst</option>
            <option value="frontend">Frontend / React</option>
          </select>

          {/* Filter by Eligibility */}
          <select
            className="placement-select"
            value={selectedEligibility}
            onChange={(e) => setSelectedEligibility(e.target.value)}
            aria-label="Filter by eligibility"
          >
            <option value="all">All Eligibility</option>
            <option value="6.5">Min CGPA ≤ 6.5</option>
            <option value="7.0">Min CGPA ≤ 7.0</option>
            <option value="7.5">Min CGPA ≤ 7.5</option>
            <option value="8.0">Min CGPA ≤ 8.0</option>
          </select>

          {/* Sort By */}
          <select
            className="placement-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort placement drives"
          >
            <option value="package-desc">Package: High to Low</option>
            <option value="package-asc">Package: Low to High</option>
            <option value="deadline-asc">Deadline: Earliest First</option>
            <option value="company-asc">Company: A to Z</option>
          </select>

          <span className="results-count-badge">
            {filteredDrives.length} {filteredDrives.length === 1 ? 'drive' : 'drives'}
          </span>
        </div>
      </div>

      {/* ─── Placement Drive Cards / Empty State ─── */}
      {filteredDrives.length > 0 ? (
        <div className="placement-cards-grid">
          {filteredDrives.map((drive) => (
            <DriveCard
              key={drive.id}
              drive={drive}
              isApplied={isApplied(drive.id)}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="placement-empty-state">
          <div className="empty-state-icon">
            <Search size={28} />
          </div>
          <h3>No placement drives match your criteria</h3>
          <p>
            We couldn't find any drives matching your search query or selected filters.
            Try resetting your filters to see all available opportunities.
          </p>
          <button onClick={handleResetFilters} className="btn-placement-primary">
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
