import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, User, BookOpen, Calendar, ClipboardList, FileText,
  LogOut, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import './Sidebar.css';

const navGroups = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
      { label: 'Profile', path: '/profile', icon: <User size={18} /> },
    ],
  },
  {
    label: 'Academic',
    items: [
      { label: 'Attendance', path: '/attendance', icon: <BookOpen size={18} /> },
      { label: 'Timetable', path: '/timetable', icon: <Calendar size={18} /> },
      { label: 'Assignments', path: '/assignments', icon: <ClipboardList size={18} /> },
      { label: 'Notes', path: '/notes', icon: <FileText size={18} /> },
    ],
  },
];

const Sidebar = ({ isCollapsed, onToggle, isMobile, isMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name = '') => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sidebarClass = [
    'sidebar',
    isCollapsed ? 'collapsed' : '',
    isMobile ? 'mobile' : '',
    isMobile && isMobileOpen ? 'mobile-open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <aside className={sidebarClass}>
      {/* ── Logo ── */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">U</div>
        <span className="sidebar-logo-text">UNIVO</span>
        {!isMobile && (
          <button
            className="sidebar-collapse-btn"
            onClick={onToggle}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="sidebar-nav">
        {navGroups.map((group) => (
          <div key={group.label} className="sidebar-group">
            <span className="sidebar-group-label">{group.label}</span>
            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  ['sidebar-nav-item', isActive ? 'active' : ''].filter(Boolean).join(' ')
                }
                title={isCollapsed ? item.label : undefined}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                <span className="sidebar-nav-text">{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* ── User Profile Card ── */}
      <div className="sidebar-user">
        <div className="sidebar-user-avatar">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="sidebar-user-avatar-img" />
          ) : (
            getInitials(user?.name || 'Student User')
          )}
        </div>
        <div className="sidebar-user-info">
          <p className="sidebar-user-name">{user?.name || 'Student User'}</p>
          <p className="sidebar-user-role">{user?.role || 'student'}</p>
        </div>
        <button
          className="sidebar-logout-btn"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
