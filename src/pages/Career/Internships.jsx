import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Clock,
  Calendar,
  Briefcase,
  X,
  Bookmark,
  BookmarkCheck,
  Send,
  CheckCircle2
} from 'lucide-react';
import initialInternships from '../../data/internships.json';
import Badge from '../../components/ui/Badge/Badge';
import useCareerBookmarks from './useCareerBookmarks';
import useInternshipApplications from './useInternshipApplications';
import InternshipApplyModal from './InternshipApplyModal';
import './Career.css';

/**
 * Component: InternshipCard
 * Demonstrates: Component Composition, Props, and Reusable UI
 */
function InternshipCard({
  internship,
  isSaved,
  onToggleBookmark,
  hasApplied,
  onOpenApplyModal,
}) {
  const {
    id,
    company,
    role,
    domain,
    stipend,
    duration,
    location,
    workMode,
    deadline,
    description
  } = internship;

  const isRemote = workMode.toLowerCase() === 'remote';

  return (
    <div className="internship-card">
      <div>
        {/* Header: Company, Role & Actions (Stipend + Save Button) */}
        <div className="internship-header-row">
          <div className="internship-company-badge">
            <div className="internship-logo-initial">{company[0]}</div>
            <div>
              <h3 className="internship-role-title">{role}</h3>
              <p className="internship-company-name">{company}</p>
            </div>
          </div>
          <div className="internship-header-actions">
            <span className="stipend-badge">{stipend}</span>
            <button
              type="button"
              className={`btn-bookmark ${isSaved ? 'saved' : ''}`}
              onClick={() => onToggleBookmark(id)}
              aria-label={isSaved ? `Remove ${company} ${role} from saved` : `Save ${company} ${role}`}
              title={isSaved ? 'Saved (click to unsave)' : 'Save internship'}
            >
              {isSaved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Domain and Work Mode Badges */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
          <Badge variant="default" size="sm">
            {domain}
          </Badge>
          <Badge variant={isRemote ? 'success' : 'purple'} size="sm">
            {workMode}
          </Badge>
        </div>

        {/* Short Description */}
        <p className="career-card-desc" style={{ marginTop: '12px' }}>
          {description}
        </p>

        {/* Metadata Grid */}
        <div className="internship-meta-grid" style={{ marginTop: '14px' }}>
          <div className="internship-meta-item">
            <Clock size={13} />
            <span>Duration: <strong>{duration}</strong></span>
          </div>

          <div className="internship-meta-item">
            <MapPin size={13} />
            <span>Location: <strong>{location}</strong></span>
          </div>

          <div className="internship-meta-item" style={{ gridColumn: '1 / -1' }}>
            <Calendar size={13} />
            <span>Deadline: <strong style={{ color: '#D71920' }}>{deadline}</strong></span>
          </div>
        </div>
      </div>

      {/* Card Footer: Apply Action Button */}
      <div className="internship-card-footer">
        {hasApplied ? (
          <span className="internship-applied-pill">
            <CheckCircle2 size={13} /> Applied
          </span>
        ) : (
          <button
            type="button"
            className="btn-apply-internship"
            onClick={() => onOpenApplyModal(internship)}
            aria-label={`Apply for ${role} at ${company}`}
          >
            Apply Now <Send size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Main Page Component: Internships
 *
 * Demonstrates Syllabus Concepts:
 * 1. useState: Search query, work mode filter, domain filter, active view tab, and modal state
 * 2. Custom Hooks: useCareerBookmarks (bookmarks) & useInternshipApplications (application tracking)
 * 3. useMemo: Optimized filtering based on active tab, search, and selected dropdowns
 * 4. Component Composition: Reusable InternshipCard, InternshipApplyModal, Badge, Lucide Icons
 * 5. Controlled Inputs: Search input and select dropdowns
 * 6. Conditional Rendering: Filtered cards vs. targeted empty states (saved-specific vs. search/filter)
 */
export default function Internships() {
  // Custom hook for bookmarking with LocalStorage persistence
  const { savedIds, isSaved, toggleBookmark } = useCareerBookmarks();

  // Custom hook for internship applications with LocalStorage persistence
  const { hasApplied, applyForInternship } = useInternshipApplications();

  // State for active internship application modal
  const [selectedInternshipForApply, setSelectedInternshipForApply] = useState(null);

  // 1. Search, Filter, and Tab States (useState)
  const [searchTerm, setSearchTerm] = useState('');
  const [workModeFilter, setWorkModeFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');
  const [viewTab, setViewTab] = useState('all'); // 'all' | 'saved'

  // 2. Extract unique domains for the dropdown
  const domainList = useMemo(() => {
    return Array.from(new Set(initialInternships.map((item) => item.domain)));
  }, []);

  // 3. Filtered internships calculation using useMemo
  const filteredInternships = useMemo(() => {
    return initialInternships.filter((item) => {
      // Saved tab filter: only include bookmarked internships
      if (viewTab === 'saved' && !savedIds.includes(item.id)) {
        return false;
      }

      // Search filter (company name or role)
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.company.toLowerCase().includes(query) ||
        item.role.toLowerCase().includes(query);

      // Work mode filter (Remote / On-site / All)
      const matchesMode =
        workModeFilter === 'all' ||
        item.workMode.toLowerCase() === workModeFilter.toLowerCase();

      // Domain filter
      const matchesDomain =
        domainFilter === 'all' || item.domain === domainFilter;

      return matchesSearch && matchesMode && matchesDomain;
    });
  }, [searchTerm, workModeFilter, domainFilter, viewTab, savedIds]);

  // 4. Reset helper
  const handleResetFilters = () => {
    setSearchTerm('');
    setWorkModeFilter('all');
    setDomainFilter('all');
  };

  return (
    <div className="career-page">
      {/* ─── Header ─── */}
      <div className="career-header">
        <h1 className="career-title">Internships Hub</h1>
        <p className="career-subtitle">
          Discover summer internships, research apprenticeships, and entry opportunities across leading technology teams.
        </p>
      </div>

      {/* ─── Tabs: All vs Saved Internships ─── */}
      <div className="internship-tabs-row">
        <div className="internship-tab-group">
          <button
            type="button"
            className={`internship-tab-btn ${viewTab === 'all' ? 'active' : ''}`}
            onClick={() => setViewTab('all')}
          >
            All Internships ({initialInternships.length})
          </button>
          <button
            type="button"
            className={`internship-tab-btn ${viewTab === 'saved' ? 'active' : ''}`}
            onClick={() => setViewTab('saved')}
          >
            <BookmarkCheck size={14} />
            Saved ({savedIds.length})
          </button>
        </div>
      </div>

      {/* ─── Search & Filters Toolbar ─── */}
      <div className="career-toolbar">
        {/* Controlled Search Box */}
        <div className="career-search-box">
          <Search size={16} />
          <input
            type="text"
            className="career-search-input"
            placeholder="Search internships by company or role..."
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

        {/* Filter Dropdowns */}
        <div className="career-filter-controls">
          {/* Work Mode Filter */}
          <select
            className="career-select"
            value={workModeFilter}
            onChange={(e) => setWorkModeFilter(e.target.value)}
            aria-label="Filter by work mode"
          >
            <option value="all">All Work Modes</option>
            <option value="remote">Remote</option>
            <option value="on-site">On-site</option>
          </select>

          {/* Domain Filter */}
          <select
            className="career-select"
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            aria-label="Filter by domain"
          >
            <option value="all">All Domains</option>
            {domainList.map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>

          <span style={{ fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
            {filteredInternships.length} {filteredInternships.length === 1 ? 'internship' : 'internships'}
          </span>
        </div>
      </div>

      {/* ─── Internships Cards Grid / Empty State ─── */}
      {filteredInternships.length > 0 ? (
        <div className="career-cards-grid">
          {filteredInternships.map((internship) => (
            <InternshipCard
              key={internship.id}
              internship={internship}
              isSaved={isSaved(internship.id)}
              onToggleBookmark={toggleBookmark}
              hasApplied={hasApplied(internship.id)}
              onOpenApplyModal={setSelectedInternshipForApply}
            />
          ))}
        </div>
      ) : viewTab === 'saved' && savedIds.length === 0 ? (
        <div className="career-empty-state">
          <div className="career-empty-icon">
            <Bookmark size={26} />
          </div>
          <h3>No Saved Internships Yet</h3>
          <p>
            You haven't bookmarked any internships yet. Click the "Save" button on any opportunity to easily find and track it later.
          </p>
          <button
            type="button"
            onClick={() => setViewTab('all')}
            className="btn-reset-skills"
            style={{ marginTop: '6px', padding: '8px 16px', color: '#D71920', borderColor: 'rgba(215, 25, 32, 0.3)' }}
          >
            Browse All Internships
          </button>
        </div>
      ) : (
        <div className="career-empty-state">
          <div className="career-empty-icon">
            <Briefcase size={26} />
          </div>
          <h3>No internships match your criteria</h3>
          <p>
            {viewTab === 'saved'
              ? 'None of your saved internships match the active search keywords or filters.'
              : "We couldn't find any opportunities matching your active search or filters."}{' '}
            Try clearing your keywords or resetting filters to see available openings.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="btn-reset-skills"
            style={{ marginTop: '6px', padding: '8px 16px', color: '#D71920', borderColor: 'rgba(215, 25, 32, 0.3)' }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* ─── Internship Application Modal ─── */}
      <InternshipApplyModal
        isOpen={!!selectedInternshipForApply}
        onClose={() => setSelectedInternshipForApply(null)}
        internship={selectedInternshipForApply}
        hasAlreadyApplied={selectedInternshipForApply ? hasApplied(selectedInternshipForApply.id) : false}
        onApply={applyForInternship}
      />
    </div>
  );
}
