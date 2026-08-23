import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-logo-container">
        <div className="loading-logo-ring"></div>
        <div className="loading-logo-inner">UV</div>
      </div>
      <div className="loading-text">UniversityVerse</div>
      <div className="loading-dots">
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
