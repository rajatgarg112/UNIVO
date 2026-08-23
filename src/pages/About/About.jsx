import React from 'react';
import './About.css';

export default function About() {
  return (
    <div className="about-page" style={{ padding: '60px 24px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#f8fafc', marginBottom: '16px', fontFamily: 'Space Grotesk' }}>About UniversityVerse</h1>
      <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: '1.7', marginBottom: '32px' }}>
        UniversityVerse is an enterprise-grade digital operating system designed to eliminate fragmentation in university campus management. It unifies attendance, assignments, library, placements, clubs, hostels, and administration into one intuitive, sleek ecosystem.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <h3 style={{ fontSize: '28px', color: '#6366f1', fontWeight: '800' }}>50+</h3>
          <p style={{ color: '#94a3b8', marginTop: '4px' }}>Universities Empowered</p>
        </div>
        <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <h3 style={{ fontSize: '28px', color: '#06b6d4', fontWeight: '800' }}>1M+</h3>
          <p style={{ color: '#94a3b8', marginTop: '4px' }}>Active Students & Faculty</p>
        </div>
        <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <h3 style={{ fontSize: '28px', color: '#10b981', fontWeight: '800' }}>99.9%</h3>
          <p style={{ color: '#94a3b8', marginTop: '4px' }}>Uptime & Reliability</p>
        </div>
      </div>
    </div>
  );
}
