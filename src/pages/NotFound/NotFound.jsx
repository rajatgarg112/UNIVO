import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="notfound-page">
      <h1 style={{ fontSize: '96px', fontWeight: '900', color: '#6366f1', fontFamily: 'Space Grotesk' }}>404</h1>
      <h2 style={{ fontSize: '24px', color: '#f8fafc', margin: '16px 0 8px' }}>Page Not Found</h2>
      <p style={{ color: '#94a3b8', marginBottom: '24px' }}>The page you are looking for does not exist or has been moved.</p>
      <Link to="/dashboard" style={{ padding: '12px 24px', background: '#6366f1', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontWeight: '600' }}>
        Back to Dashboard
      </Link>
    </div>
  );
}
