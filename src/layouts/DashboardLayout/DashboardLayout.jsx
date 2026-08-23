import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar/Sidebar';
import Topbar from '../../components/common/Topbar/Topbar';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleToggle = () => {
    if (isMobile) {
      setIsMobileSidebarOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  };

  const handleOverlayClick = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Mobile overlay */}
      {isMobile && isMobileSidebarOpen && (
        <div className="sidebar-overlay" onClick={handleOverlayClick} />
      )}

      <Sidebar
        isCollapsed={isMobile ? false : isCollapsed}
        onToggle={handleToggle}
        isMobile={isMobile}
        isMobileOpen={isMobileSidebarOpen}
      />

      <div
        className={`dashboard-body ${isCollapsed && !isMobile ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''}`}
      >
        <Topbar
          isCollapsed={isMobile ? false : isCollapsed}
          onToggle={handleToggle}
        />

        <main className="dashboard-main">
          <div className="dashboard-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
