import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  ChevronDown,
  X,
  Sun,
  Moon,
  BookOpen,
  FileText,
  Users,
  Calendar,
  ShoppingBag,
  HelpCircle,
  Briefcase,
  Home
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useNotifications } from '../../../context/NotificationContext';
import { useTheme } from '../../../context/ThemeContext';

// Import seed data for global search indexing
import initialStudents from '../../../data/students.json';
import initialAssignments from '../../../data/assignments.json';
import initialBooks from '../../../data/books.json';
import initialClubs from '../../../data/clubs.json';
import initialEvents from '../../../data/events.json';
import initialMarketplace from '../../../data/marketplace.json';
import initialLostFound from '../../../data/lostFound.json';
import initialCompanies from '../../../data/companies.json';
import initialHostel from '../../../data/hostel.json';
import initialNotes from '../../../data/notes.json';
import './Topbar.css';

/* ── Derive page title from pathname ── */
const getPageTitle = (pathname) => {
  const map = {
    '/dashboard': 'Dashboard',
    '/profile': 'My Profile',
    '/attendance': 'Attendance',
    '/timetable': 'Timetable',
    '/assignments': 'Assignments',
    '/notes': 'Notes',
  };
  return map[pathname] || 'UniversityVerse';
};

const Topbar = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { isDark, toggleTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchContainerRef = useRef(null);

  const pageTitle = getPageTitle(location.pathname);

  /* Close dropdowns when clicking outside */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* Global Live Search Algorithm */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }

    const q = searchQuery.toLowerCase();
    const results = [];

    // Helper to get array from localStorage or seed
    const getLocalOrSeed = (key, seedData) => {
      try {
        const saved = localStorage.getItem(key);
        if (saved) return JSON.parse(saved);
      } catch (e) {}
      return seedData || [];
    };

    const students = getLocalOrSeed('uv_students_data', initialStudents);
    const assignments = getLocalOrSeed('uv_assignments_local_v1', initialAssignments);
    const books = getLocalOrSeed('uv_library_books_v2', initialBooks);
    const clubs = getLocalOrSeed('uv_clubs_data_v2', initialClubs);
    const events = getLocalOrSeed('uv_events_data_v2', initialEvents);
    const marketplace = getLocalOrSeed('uv_marketplace_data_v3', initialMarketplace);
    const lostFound = getLocalOrSeed('uv_lost_found_data_v3', initialLostFound);
    const notes = getLocalOrSeed('uv_notes_hub_v2', initialNotes);
    const complaints = getLocalOrSeed('uv_hostel_complaints_v3', initialHostel.maintenanceRequests || []);

    // 1. Students
    students.forEach((s) => {
      if ((s.name && s.name.toLowerCase().includes(q)) || (s.rollNo && s.rollNo.toLowerCase().includes(q))) {
        results.push({ id: `stu_${s.id}`, title: s.name, subtitle: `Roll: ${s.rollNo} • ${s.department}`, category: 'Student Profile', path: '/profile', icon: <User size={14} /> });
      }
    });

    // 2. Assignments
    assignments.forEach((a) => {
      if ((a.title && a.title.toLowerCase().includes(q)) || (a.subject && a.subject.toLowerCase().includes(q))) {
        results.push({ id: `asgn_${a.id}`, title: a.title, subtitle: `Subject: ${a.subject} • Status: ${a.status}`, category: 'Assignments', path: '/assignments', icon: <FileText size={14} /> });
      }
    });

    // 3. Books
    books.forEach((b) => {
      if ((b.title && b.title.toLowerCase().includes(q)) || (b.author && b.author.toLowerCase().includes(q))) {
        results.push({ id: `bk_${b.id}`, title: b.title, subtitle: `Author: ${b.author} • Category: ${b.category}`, category: 'Library Book', path: '/library', icon: <BookOpen size={14} /> });
      }
    });

    // 4. Clubs
    clubs.forEach((c) => {
      if ((c.name && c.name.toLowerCase().includes(q)) || (c.description && c.description.toLowerCase().includes(q))) {
        results.push({ id: `clb_${c.id}`, title: c.name, subtitle: `${c.members} Members • ${c.type}`, category: 'Club / Society', path: '/clubs', icon: <Users size={14} /> });
      }
    });

    // 5. Events
    events.forEach((ev) => {
      if ((ev.title && ev.title.toLowerCase().includes(q)) || (ev.venue && ev.venue.toLowerCase().includes(q))) {
        results.push({ id: `ev_${ev.id}`, title: ev.title, subtitle: `Date: ${ev.date} • ${ev.venue}`, category: 'Campus Event', path: '/events', icon: <Calendar size={14} /> });
      }
    });

    // 6. Marketplace
    marketplace.forEach((m) => {
      if ((m.title && m.title.toLowerCase().includes(q)) || (m.category && m.category.toLowerCase().includes(q))) {
        results.push({ id: `mkt_${m.id}`, title: m.title, subtitle: `Price: ₹${m.price} • ${m.category}`, category: 'Marketplace', path: '/marketplace', icon: <ShoppingBag size={14} /> });
      }
    });

    // 7. Lost & Found
    lostFound.forEach((lf) => {
      if ((lf.title && lf.title.toLowerCase().includes(q)) || (lf.location && lf.location.toLowerCase().includes(q))) {
        results.push({ id: `lf_${lf.id}`, title: lf.title, subtitle: `${lf.type.toUpperCase()} at ${lf.location}`, category: 'Lost & Found', path: '/lost-found', icon: <HelpCircle size={14} /> });
      }
    });

    // 8. Notes Hub
    notes.forEach((n) => {
      if ((n.title && n.title.toLowerCase().includes(q)) || (n.subject && n.subject.toLowerCase().includes(q))) {
        results.push({ id: `nt_${n.id}`, title: n.title, subtitle: `Subject: ${n.subject} • ${n.type}`, category: 'Notes Resource', path: '/notes', icon: <FileText size={14} /> });
      }
    });

    // 9. Placement Companies
    initialCompanies.forEach((comp) => {
      if ((comp.name && comp.name.toLowerCase().includes(q)) || (comp.sector && comp.sector.toLowerCase().includes(q))) {
        results.push({ id: `cmp_${comp.id}`, title: comp.name, subtitle: `Package: ${comp.package} • ${comp.sector}`, category: 'Placement Drive', path: '/placement', icon: <Briefcase size={14} /> });
      }
    });

    setSearchResults(results.slice(0, 8));
    setIsSearchOpen(true);
  }, [searchQuery]);

  const handleResultClick = (path) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(path);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate('/login');
  };

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <header className={`topbar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* ── Toggle ── */}
      <button className="topbar-toggle" onClick={onToggle} title="Toggle sidebar">
        <Menu size={20} />
      </button>

      {/* ── Page title ── */}
      <span className="topbar-title">{pageTitle}</span>

      {/* ── Right-aligned controls (Search, Theme, Notification, User Avatar) ── */}
      <div className="topbar-right-controls">
        {/* ── Global Search with Dropdown ── */}
        <div ref={searchContainerRef} style={{ position: 'relative', width: '320px' }}>
        <form className="topbar-search" onSubmit={handleSearchSubmit}>
          <span className="topbar-search-icon">
            <Search size={16} />
          </span>
          <input
            type="text"
            className="topbar-search-input"
            placeholder="Search anything (students, notes, books, events…)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
          />
          {searchQuery && (
            <button
              type="button"
              className="topbar-search-clear"
              onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
            >
              <X size={14} />
            </button>
          )}
        </form>

        {/* Global Live Search Results Dropdown */}
        {isSearchOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              background: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              padding: '8px',
              zIndex: 1000,
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              maxHeight: '360px',
              overflowY: 'auto'
            }}
          >
            {searchResults.length === 0 ? (
              <div style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '13px', textAlign: 'center' }}>
                No matching results found across UniversityVerse.
              </div>
            ) : (
              searchResults.map((res) => (
                <div
                  key={res.id}
                  onClick={() => handleResultClick(res.path)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                    marginBottom: '2px'
                  }}
                  className="topbar-search-result-item"
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ color: '#818cf8', background: 'rgba(99, 102, 241, 0.15)', padding: '6px', borderRadius: '6px' }}>
                      {res.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#f8fafc' }}>{res.title}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>{res.subtitle}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: '#06b6d4', background: 'rgba(6, 182, 212, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                    {res.category}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ── Actions ── */}
      <div className="topbar-actions">
        {/* Theme Toggle Button */}
        <button
          className="topbar-notif-btn"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          onClick={toggleTheme}
        >
          {isDark ? <Sun size={20} color="#f59e0b" /> : <Moon size={20} color="#6366f1" />}
        </button>

        {/* Notification bell */}
        <button
          className="topbar-notif-btn"
          title="Notifications"
          onClick={() => navigate('/notifications')}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="topbar-notif-badge">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* User Avatar & Dropdown */}
        <div className="topbar-user" ref={dropdownRef}>
          <div
            className="topbar-avatar"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              getInitials(user?.name || 'User')
            )}
          </div>

              {isDropdownOpen && (
                <div className="topbar-dropdown">
                  <div className="topbar-dropdown-header">
                    <p className="topbar-dropdown-name">{user?.name || 'Aryan Sharma'}</p>
                    <p className="topbar-dropdown-email">{user?.email || 'aryan@universityverse.edu'}</p>
                  </div>
                  <div className="topbar-dropdown-divider" />
                  <Link
                    to="/profile"
                    className="topbar-dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <User size={16} /> My Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="topbar-dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Settings size={16} /> Settings
                  </Link>
                  <div className="topbar-dropdown-divider" />
                  <button className="topbar-dropdown-item logout" onClick={handleLogout}>
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

export default Topbar;
