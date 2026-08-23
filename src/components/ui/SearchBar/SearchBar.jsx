import React, { useRef } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import './SearchBar.css';

const SearchBar = ({
  placeholder = 'Search…',
  value = '',
  onChange,
  onSearch,
  size = 'md',
  showFilter = false,
  onFilterClick,
}) => {
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    if (onChange) onChange({ target: { value: '' } });
    inputRef.current?.focus();
  };

  return (
    <div className={`search-bar search-bar-${size}`}>
      <div className="search-bar-wrapper">
        <span className="search-icon">
          <Search size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
        </span>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          aria-label={placeholder}
        />
        {value && (
          <button className="search-clear" onClick={handleClear} aria-label="Clear search">
            <X size={14} />
          </button>
        )}
        {showFilter && (
          <button
            className="search-filter-btn"
            onClick={onFilterClick}
            aria-label="Open filters"
          >
            <SlidersHorizontal size={15} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
