import React from 'react';
import { Search, X, ArrowUpDown } from 'lucide-react';

/**
 * ClubFilters Component
 * Renders search bar, category pills, sort dropdown, and results count.
 *
 * Demonstrates:
 * - Controlled inputs
 * - Lifting state up to parent page
 * - useRef usage for focusing search input
 */
const ClubFilters = ({
  searchQuery,
  onSearchChange,
  searchInputRef,
  selectedCategory,
  onCategoryChange,
  categories,
  sortBy,
  onSortChange,
  totalMatching,
  totalClubs,
  onResetFilters,
}) => {
  const isFiltered = searchQuery.trim() !== '' || selectedCategory !== 'All' || sortBy !== 'name-asc';

  return (
    <div className="clubs-filters-wrapper">
      {/* Search and Sort Toolbar */}
      <div className="clubs-toolbar">
        {/* Search Input with useRef attachment */}
        <div className="clubs-search-box">
          <Search size={18} className="clubs-search-icon" />
          <input
            ref={searchInputRef}
            type="text"
            className="clubs-search-input"
            placeholder="Search clubs by name, focus, or keyword..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="clubs-search-clear-btn"
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

        {/* Sort Controls */}
        <div className="clubs-sort-box">
          <label htmlFor="club-sort-select" className="clubs-sort-label">
            <ArrowUpDown size={15} />
            <span>Sort:</span>
          </label>
          <select
            id="club-sort-select"
            className="clubs-sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="name-asc">Name (A – Z)</option>
            <option value="name-desc">Name (Z – A)</option>
            <option value="members-desc">Most Members (Popular)</option>
            <option value="members-asc">Least Members</option>
          </select>
        </div>
      </div>

      {/* Category Pills & Count Summary */}
      <div className="clubs-categories-row">
        <div className="clubs-category-pills" role="tablist" aria-label="Club categories">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={selectedCategory === cat}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="clubs-count-summary">
          <span>
            Showing <strong>{totalMatching}</strong> of {totalClubs} clubs
          </span>
          {isFiltered && (
            <button
              type="button"
              className="clubs-reset-filters-btn"
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

export default ClubFilters;
