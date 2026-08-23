import React from 'react';
import { Outlet } from 'react-router-dom';
import LandingNavbar from '../../components/common/LandingNavbar/LandingNavbar';
import LandingFooter from '../../components/common/LandingFooter/LandingFooter';
import './LandingLayout.css';

const LandingLayout = () => {
  return (
    <div className="landing-wrapper">
      <LandingNavbar />
      <main className="landing-main">
        <Outlet />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingLayout;
