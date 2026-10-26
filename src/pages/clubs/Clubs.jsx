import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Users, Sparkles, CheckCircle2, Calendar, Search } from 'lucide-react';
import initialClubs from '../../data/clubs.json';
import ClubCard from '../../components/clubs/ClubCard';
import ClubFilters from '../../components/clubs/ClubFilters';
import Toast from '../../components/ui/Toast/Toast';
import Modal from '../../components/ui/Modal/Modal';
import useClubMemberships from '../../hooks/useClubMemberships';
import { useNotifications } from '../../context/NotificationContext';
import './Clubs.css';

const CATEGORIES = ['All', 'Technical', 'Cultural', 'Sports', 'Entrepreneurship', 'Social Service'];

/**
 * Page 1: Clubs Home (/clubs)
 * Comprehensive listing of university clubs and societies with real-time search,
 * filtering, sorting, membership toggles, and state persistence.
 */
const Clubs = () => {
  // ── 1. State Management (useState) ──
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');
  const [toast, setToast] = useState(null);

  // Modal confirmation for leaving a club
  const [clubToLeave, setClubToLeave] = useState(null);

  // ── 2. Custom Hook: LocalStorage Synced Memberships ──
  const { isMember, joinClub, leaveClub, totalJoined } = useClubMemberships();
  const { addNotification } = useNotifications();

  // ── 3. DOM Reference (useRef) ──
  // Dedicated ref to programmatically focus the search input
  const searchInputRef = useRef(null);

  // Scroll to top on mount and set document title
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Clubs & Societies | UNIVO';
  }, []);

  // ── 4. Derived & Memoized Data (useMemo) ──
  // Efficiently filter and sort clubs list based on search query, category, and sort mode
  const filteredAndSortedClubs = useMemo(() => {
    let result = [...initialClubs];

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(
        (club) => club.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query (case-insensitive search across name, tagline, description)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (club) =>
          club.name.toLowerCase().includes(q) ||
          club.tagline.toLowerCase().includes(q) ||
          club.category.toLowerCase().includes(q)
      );
    }

    // Sort clubs
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'members-desc':
          return b.membersCount - a.membersCount;
        case 'members-asc':
          return a.membersCount - b.membersCount;
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  // Overall platform statistics
  const stats = useMemo(() => {
    const totalMembers = initialClubs.reduce((acc, c) => acc + c.membersCount, 0);
    return {
      totalClubs: initialClubs.length,
      totalMembers,
      joinedCount: totalJoined,
      activeCategories: CATEGORIES.length - 1,
    };
  }, [totalJoined]);

  // ── 5. Memoized Event Handlers (useCallback) ──
  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const handleSortChange = useCallback((sort) => {
    setSortBy(sort);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('name-asc');
    searchInputRef.current?.focus();
  }, []);

  // Membership toggle logic
  const handleToggleMembership = useCallback(
    (club) => {
      if (isMember(club.id)) {
        // Open confirmation modal before leaving
        setClubToLeave(club);
      } else {
        // Join immediately
        const res = joinClub(club.id, club.name);
        if (res.success) {
          setToast({ message: res.message, type: 'success' });
          // Also sync with portal notification center
          try {
            addNotification({
              title: `Joined ${club.name}`,
              message: `You are now a registered member of ${club.name}. Check your email for orientation schedules.`,
              type: 'club',
            });
          } catch {
            // Notification context optional safety
          }
        }
      }
    },
    [isMember, joinClub, addNotification]
  );

  const confirmLeaveClub = useCallback(() => {
    if (!clubToLeave) return;
    const res = leaveClub(clubToLeave.id, clubToLeave.name);
    setToast({ message: res.message, type: 'info' });
    setClubToLeave(null);
  }, [clubToLeave, leaveClub]);

  return (
    <div className="clubs-page">
      {/* ── Page Header ── */}
      <div className="clubs-header-card">
        <div className="clubs-header-content">
          <div className="clubs-header-badge">
            <Sparkles size={14} />
            <span>Campus Communities</span>
          </div>
          <h1 className="page-title">Clubs & Student Societies</h1>
          <p className="page-subtitle">
            Explore active student organizations, develop technical and creative leadership skills,
            and build lifelong connections across UNIVO.
          </p>
        </div>

        {/* Quick Focus Button utilizing useRef */}
        <button
          type="button"
          className="clubs-quick-search-trigger"
          onClick={() => searchInputRef.current?.focus()}
          title="Jump to search bar"
        >
          <Search size={16} />
          <span>Find a Club</span>
        </button>
      </div>

      {/* ── Summary Stats Cards ── */}
      <div className="clubs-stats-grid">
        <div className="clubs-stat-card">
          <div className="stat-card-icon clubs-icon-blue">
            <Users size={20} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.totalClubs}</span>
            <span className="stat-card-label">Active Societies</span>
          </div>
        </div>

        <div className="clubs-stat-card">
          <div className="stat-card-icon clubs-icon-green">
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.joinedCount}</span>
            <span className="stat-card-label">Your Memberships</span>
          </div>
        </div>

        <div className="clubs-stat-card">
          <div className="stat-card-icon clubs-icon-purple">
            <Sparkles size={20} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.activeCategories}</span>
            <span className="stat-card-label">Domains & Interests</span>
          </div>
        </div>

        <div className="clubs-stat-card">
          <div className="stat-card-icon clubs-icon-red">
            <Calendar size={20} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-value">Weekly</span>
            <span className="stat-card-label">Workshops & Meets</span>
          </div>
        </div>
      </div>

      {/* ── Filters & Search Toolbar (Component Composition & Lifting State Up) ── */}
      <ClubFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchInputRef={searchInputRef}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        categories={CATEGORIES}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        totalMatching={filteredAndSortedClubs.length}
        totalClubs={initialClubs.length}
        onResetFilters={handleResetFilters}
      />

      {/* ── Clubs Cards Grid ── */}
      {filteredAndSortedClubs.length === 0 ? (
        <div className="clubs-empty-state">
          <div className="empty-state-icon">
            <Users size={36} />
          </div>
          <h3 className="empty-state-title">No clubs match your criteria</h3>
          <p className="empty-state-text">
            We couldn't find any student society matching "{searchQuery}" in category "
            {selectedCategory}". Try clearing your filters or searching with a different term.
          </p>
          <button
            type="button"
            className="clubs-reset-btn"
            onClick={handleResetFilters}
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="clubs-cards-grid">
          {filteredAndSortedClubs.map((club) => (
            <ClubCard
              key={club.id}
              club={club}
              isMember={isMember(club.id)}
              onToggleMembership={handleToggleMembership}
            />
          ))}
        </div>
      )}

      {/* ── Leave Club Confirmation Modal ── */}
      <Modal
        isOpen={Boolean(clubToLeave)}
        onClose={() => setClubToLeave(null)}
        title="Leave Club Confirmation"
        size="sm"
      >
        <div className="modal-leave-confirm-content">
          <p>
            Are you sure you want to cancel your membership for{' '}
            <strong>{clubToLeave?.name}</strong>?
          </p>
          <p className="modal-leave-subtext">
            You will no longer receive private club circulars, priority workshop invites, or voting
            rights in club elections. You can re-join anytime.
          </p>
          <div className="modal-leave-actions">
            <button
              type="button"
              className="modal-btn-cancel"
              onClick={() => setClubToLeave(null)}
            >
              Keep Membership
            </button>
            <button
              type="button"
              className="modal-btn-confirm-leave"
              onClick={confirmLeaveClub}
            >
              Confirm Leave
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Toast Feedback Notification ── */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default Clubs;
