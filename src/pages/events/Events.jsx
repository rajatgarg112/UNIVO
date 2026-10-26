import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { CalendarDays, Sparkles, CheckCircle2, History, Search } from 'lucide-react';
import initialEvents from '../../data/events.json';
import EventCard from '../../components/events/EventCard';
import EventFilters from '../../components/events/EventFilters';
import Toast from '../../components/ui/Toast/Toast';
import useEventRegistrations from '../../hooks/useEventRegistrations';
import './Events.css';

const EVENT_CATEGORIES = ['All', 'Technical', 'Cultural', 'Sports', 'Entrepreneurship', 'Social Service'];

/**
 * Page 3: Events Home (/events)
 * Complete campus events discovery page with Tab navigation (Upcoming, Registered, Past),
 * live search, category filters, date sorting, and registration state badges.
 */
const Events = () => {
  // ── 1. State Management (useState) ──
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'registered' | 'past'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date-asc');
  const [toast, setToast] = useState(null);

  // ── 2. Custom Hook: Registrations synced with LocalStorage ──
  const { isRegistered, totalRegistered } = useEventRegistrations();

  // ── 3. DOM Reference (useRef) ──
  const searchInputRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Campus Events & Activities | UNIVO';
  }, []);

  // ── 4. Derived Tab Counts (useMemo) ──
  const tabCounts = useMemo(() => {
    const upcomingCount = initialEvents.filter((e) => e.status !== 'Past').length;
    const pastCount = initialEvents.filter((e) => e.status === 'Past').length;

    return {
      upcoming: upcomingCount,
      registered: totalRegistered,
      past: pastCount,
    };
  }, [totalRegistered]);

  // ── 5. Filtering & Sorting Logic (useMemo) ──
  const filteredAndSortedEvents = useMemo(() => {
    let result = [...initialEvents];

    // Step A: Filter by Active Tab
    if (activeTab === 'upcoming') {
      result = result.filter((e) => e.status !== 'Past');
    } else if (activeTab === 'past') {
      result = result.filter((e) => e.status === 'Past');
    } else if (activeTab === 'registered') {
      // Show events the user is registered for
      result = result.filter((e) => isRegistered(e.id));
    }

    // Step B: Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter(
        (e) => e.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Step C: Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.organiser.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      );
    }

    // Step D: Sort Events
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'popular':
          return (b.registeredSeats || 0) - (a.registeredSeats || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [activeTab, selectedCategory, searchQuery, sortBy, isRegistered]);

  // Overall platform statistics
  const stats = useMemo(() => {
    return {
      total: initialEvents.length,
      upcoming: initialEvents.filter((e) => e.status !== 'Past').length,
      registered: totalRegistered,
      concluded: initialEvents.filter((e) => e.status === 'Past').length,
    };
  }, [totalRegistered]);

  // ── 6. Memoized Handlers (useCallback) ──
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleSearchChange = useCallback((val) => {
    setSearchQuery(val);
  }, []);

  const handleCategoryChange = useCallback((cat) => {
    setSelectedCategory(cat);
  }, []);

  const handleSortChange = useCallback((sort) => {
    setSortBy(sort);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('date-asc');
    searchInputRef.current?.focus();
  }, []);

  return (
    <div className="events-page">
      {/* ── Page Header ── */}
      <div className="events-header-card">
        <div className="events-header-content">
          <div className="events-header-badge">
            <Sparkles size={14} />
            <span>Campus Activities</span>
          </div>
          <h1 className="page-title">Campus Events & Hackathons</h1>
          <p className="page-subtitle">
            Discover hackathons, technical symposiums, cultural fests, sports leagues, and founder
            summits. Reserve your student passes early.
          </p>
        </div>

        {/* Quick Search Focus Trigger (useRef) */}
        <button
          type="button"
          className="events-quick-search-trigger"
          onClick={() => searchInputRef.current?.focus()}
          title="Search events"
        >
          <Search size={16} />
          <span>Find Events</span>
        </button>
      </div>

      {/* ── Stat Metric Cards Grid ── */}
      <div className="events-stats-grid">
        <div className="events-stat-card">
          <div className="stat-card-icon events-icon-blue">
            <CalendarDays size={20} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.upcoming}</span>
            <span className="stat-card-label">Upcoming Events</span>
          </div>
        </div>

        <div className="events-stat-card">
          <div className="stat-card-icon events-icon-green">
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.registered}</span>
            <span className="stat-card-label">Your Booked Passes</span>
          </div>
        </div>

        <div className="events-stat-card">
          <div className="stat-card-icon events-icon-purple">
            <Sparkles size={20} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.total}</span>
            <span className="stat-card-label">Total Semester Events</span>
          </div>
        </div>

        <div className="events-stat-card">
          <div className="stat-card-icon events-icon-red">
            <History size={20} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.concluded}</span>
            <span className="stat-card-label">Concluded Events</span>
          </div>
        </div>
      </div>

      {/* ── Filters & Tabs Toolbar (Component Composition) ── */}
      <EventFilters
        activeTab={activeTab}
        onTabChange={handleTabChange}
        counts={tabCounts}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchInputRef={searchInputRef}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        categories={EVENT_CATEGORIES}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        totalMatching={filteredAndSortedEvents.length}
        onResetFilters={handleResetFilters}
      />

      {/* ── Events Cards Grid ── */}
      {filteredAndSortedEvents.length === 0 ? (
        <div className="events-empty-state">
          <div className="empty-state-icon">
            {activeTab === 'registered' ? (
              <CheckCircle2 size={36} />
            ) : (
              <CalendarDays size={36} />
            )}
          </div>
          <h3 className="empty-state-title">
            {activeTab === 'registered'
              ? 'No Registered Events Found'
              : 'No matching events found'}
          </h3>
          <p className="empty-state-text">
            {activeTab === 'registered'
              ? "You haven't registered for any events yet. Switch to the Upcoming tab to discover exciting hackathons and fests!"
              : `We couldn't find any events matching your search or filters in the ${activeTab} section.`}
          </p>
          {activeTab === 'registered' ? (
            <button
              type="button"
              className="events-reset-btn"
              onClick={() => setActiveTab('upcoming')}
            >
              Browse Upcoming Events
            </button>
          ) : (
            <button
              type="button"
              className="events-reset-btn"
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="events-cards-grid">
          {filteredAndSortedEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isRegistered={isRegistered(event.id)}
            />
          ))}
        </div>
      )}

      {/* ── Toast Feedback Notification ── */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default Events;
