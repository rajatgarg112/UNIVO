import React from 'react';
import { Search, X, ArrowUpDown, Calendar, CheckCircle2, History } from 'lucide-react';

/**
 * EventFilters Component
 * Handles tab navigation (Upcoming, Registered, Past), keyword search,
 * category filtering, sorting, and results counting.
 *
 * Demonstrates:
 * - Tab navigation pattern
 * - Controlled input handling
 * - Lifting state up to parent page
 * - useRef usage for focusing search
 */
const EventFilters = ({
  activeTab,
  onTabChange,
  counts,
  searchQuery,
  onSearchChange,
  searchInputRef,
  selectedCategory,
  onCategoryChange,
  categories,
  sortBy,
  onSortChange,
  totalMatching,
  onResetFilters,
}) => {
  const isFiltered = searchQuery.trim() !== '' || selectedCategory !== 'All' || sortBy !== 'date-asc';

  return (
    <div className="events-filters-wrapper">
      {/* ── Top Level Tabs: Upcoming | Registered | Past ── */}
      <div className="events-tabs-row" role="tablist" aria-label="Event Status Tabs">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'upcoming'}
          className={`event-tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => onTabChange('upcoming')}
        >
          <Calendar size={16} />
          <span>Upcoming Events</span>
          <span className="event-tab-badge">{counts.upcoming}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'registered'}
          className={`event-tab-btn ${activeTab === 'registered' ? 'active' : ''}`}
          onClick={() => onTabChange('registered')}
        >
          <CheckCircle2 size={16} />
          <span>My Registered Events</span>
          <span className="event-tab-badge highlight">{counts.registered}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'past'}
          className={`event-tab-btn ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => onTabChange('past')}
        >
          <History size={16} />
          <span>Past Events</span>
          <span className="event-tab-badge">{counts.past}</span>
        </button>
      </div>

      {/* ── Search & Sort Controls ── */}
      <div className="events-controls-row">
        {/* Search Input with useRef */}
        <div className="events-search-box">
          <Search size={18} className="events-search-icon" />
          <input
            ref={searchInputRef}
            type="text"
            className="events-search-input"
            placeholder="Search events by title, organiser, or venue..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="events-search-clear-btn"
              onClick={() => {
                onSearchChange('');
                searchInputRef.current?.focus();
              }}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="events-sort-box">
          <label htmlFor="event-sort-select" className="events-sort-label">
            <ArrowUpDown size={15} />
            <span>Sort:</span>
          </label>
          <select
            id="event-sort-select"
            className="events-sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="date-asc">Date: Soonest First</option>
            <option value="date-desc">Date: Latest First</option>
            <option value="title-asc">Title (A – Z)</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {/* ── Categories Bar & Counter ── */}
      <div className="events-category-bar">
        <div className="events-category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="events-count-box">
          <span>
            Showing <strong>{totalMatching}</strong> events
          </span>
          {isFiltered && (
            <button
              type="button"
              className="events-reset-btn"
              onClick={onResetFilters}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventFilters;
