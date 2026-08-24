import React from 'react';
import './About.css';

export default function About() {
  return (
    <div className="about-page" style={{ padding: '60px 24px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 className="about-title" style={{ fontSize: '36px', fontWeight: '800', marginBottom: '16px', fontFamily: 'Space Grotesk' }}>About UNIVO</h1>
      <p className="about-desc" style={{ fontSize: '18px', lineHeight: '1.7', marginBottom: '32px' }}>
        UNIVO is an enterprise-grade digital operating system designed to eliminate fragmentation in university campus management. It unifies attendance, assignments, library, placements, clubs, hostels, and administration into one intuitive, sleek ecosystem.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <div className="about-stat-card" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '28px', color: '#D71920', fontWeight: '800' }}>50+</h3>
          <p className="about-stat-label" style={{ marginTop: '4px' }}>Universities Empowered</p>
        </div>
        <div className="about-stat-card" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '28px', color: '#06b6d4', fontWeight: '800' }}>1M+</h3>
          <p className="about-stat-label" style={{ marginTop: '4px' }}>Active Students &amp; Faculty</p>
        </div>
        <div className="about-stat-card" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '28px', color: '#10b981', fontWeight: '800' }}>99.9%</h3>
          <p className="about-stat-label" style={{ marginTop: '4px' }}>Uptime &amp; Reliability</p>
        </div>
      </div>
    </div>
  );
}
