import React, { createContext, useContext, useState, useCallback } from 'react';

const SearchContext = createContext(null);

const MOCK_DATA = [
  { id: 's1', title: 'Dashboard', subtitle: 'Overview of your academic stats', module: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { id: 's2', title: 'Attendance', subtitle: 'View your attendance records', module: 'Academics', path: '/attendance', icon: 'CalendarCheck' },
  { id: 's3', title: 'Timetable', subtitle: 'Your weekly class schedule', module: 'Academics', path: '/timetable', icon: 'Clock' },
  { id: 's4', title: 'Assignments', subtitle: 'Pending and submitted assignments', module: 'Academics', path: '/assignments', icon: 'FileText' },
  { id: 's5', title: 'Library', subtitle: 'Search and borrow books', module: 'Library', path: '/library', icon: 'BookOpen' },
  { id: 's6', title: 'Notes Hub', subtitle: 'Study notes and resources', module: 'Academics', path: '/notes', icon: 'StickyNote' },
  { id: 's7', title: 'Clubs', subtitle: 'Join and explore campus clubs', module: 'Campus Life', path: '/clubs', icon: 'Users' },
  { id: 's8', title: 'Events', subtitle: 'Upcoming campus events', module: 'Campus Life', path: '/events', icon: 'Calendar' },
  { id: 's9', title: 'Hostel', subtitle: 'Hostel room and facilities info', module: 'Hostel', path: '/hostel', icon: 'Home' },
  { id: 's10', title: 'Placement', subtitle: 'Job and internship opportunities', module: 'Career', path: '/placement', icon: 'Briefcase' },
  { id: 's11', title: 'Career', subtitle: 'Career counseling and resources', module: 'Career', path: '/career', icon: 'TrendingUp' },
  { id: 's12', title: 'Campus Map', subtitle: 'Interactive map of the campus', module: 'Campus', path: '/campus-map', icon: 'Map' },
  { id: 's13', title: 'Lost & Found', subtitle: 'Report or find lost items', module: 'Campus', path: '/lost-found', icon: 'Search' },
  { id: 's14', title: 'Marketplace', subtitle: 'Buy and sell used items', module: 'Campus', path: '/marketplace', icon: 'ShoppingBag' },
  { id: 's15', title: 'Faculty Directory', subtitle: 'Find faculty contact and info', module: 'Faculty', path: '/faculty', icon: 'UserCheck' },
  { id: 's16', title: 'Parent Portal', subtitle: 'Parent access and student updates', module: 'Parent', path: '/parent', icon: 'Heart' },
  { id: 's17', title: 'Notifications', subtitle: 'All your alerts and messages', module: 'General', path: '/notifications', icon: 'Bell' },
  { id: 's18', title: 'Settings', subtitle: 'Account and app preferences', module: 'General', path: '/settings', icon: 'Settings' },
  { id: 's19', title: 'Analytics', subtitle: 'Academic performance analytics', module: 'Analytics', path: '/analytics', icon: 'BarChart2' },
  { id: 's20', title: 'Help & Support', subtitle: 'FAQs and support resources', module: 'General', path: '/help', icon: 'HelpCircle' },
  { id: 's21', title: 'Profile', subtitle: 'View and edit your profile', module: 'General', path: '/profile', icon: 'User' },
];

export function SearchProvider({ children }) {
  const [query, setQueryState] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const setQuery = useCallback((q) => {
    setQueryState(q);
  }, []);

  const performSearch = useCallback((q) => {
    const trimmed = (q || '').trim().toLowerCase();
    setQueryState(trimmed);
    if (!trimmed) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const filtered = MOCK_DATA.filter(
      (item) =>
        item.title.toLowerCase().includes(trimmed) ||
        item.subtitle.toLowerCase().includes(trimmed) ||
        item.module.toLowerCase().includes(trimmed)
    );
    setResults(filtered);
    setIsSearching(false);
  }, []);

  const clearSearch = useCallback(() => {
    setQueryState('');
    setResults([]);
    setIsSearching(false);
  }, []);

  const value = {
    query,
    results,
    isSearching,
    setQuery,
    performSearch,
    clearSearch,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

export default SearchContext;
