import React from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  Zap,
  Shield,
  Globe,
  BookOpen,
  Users,
} from 'lucide-react';
import './AuthLayout.css';

const features = [
  { icon: <Zap size={18} />, text: 'Real-time academic tracking & analytics' },
  { icon: <BookOpen size={18} />, text: 'Integrated timetable and assignments hub' },
  { icon: <Users size={18} />, text: 'Connect with 50,000+ students & faculty' },
  { icon: <Shield size={18} />, text: 'Enterprise-grade security & privacy' },
  { icon: <Globe size={18} />, text: 'Access from anywhere, on any device' },
  { icon: <CheckCircle size={18} />, text: 'Placement & career readiness tools' },
];

const floatingCards = [
  { label: 'Active Students', value: '52,400+', color: '#6366f1' },
  { label: 'Assignments Submitted', value: '1.2M+', color: '#06b6d4' },
  { label: 'Placement Rate', value: '94.7%', color: '#10b981' },
];

const AuthLayout = () => {
  return (
    <div className="auth-wrapper">
      {/* ───── Left Decorative Panel ───── */}
      <div className="auth-left">
        {/* Brand */}
        <div className="auth-left-top">
          <Link to="/" className="auth-left-brand">
            <div className="auth-left-brand-icon">UV</div>
            <span className="auth-left-brand-name">UniversityVerse</span>
          </Link>

          <h1 className="auth-left-title">
            Your University.<br />
            <span className="auth-left-title-accent">Reimagined.</span>
          </h1>

          <p className="auth-left-subtitle">
            The all-in-one platform that transforms how students, faculty and
            administrators experience campus life.
          </p>

          {/* Feature list */}
          <ul className="auth-left-features">
            {features.map((f, i) => (
              <li key={i} className="auth-left-feature-item">
                <span className="auth-left-feature-icon">{f.icon}</span>
                <span>{f.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Floating stat cards */}
        <div className="auth-left-cards">
          {floatingCards.map((card, i) => (
            <div key={i} className="auth-stat-card" style={{ borderColor: card.color }}>
              <span
                className="auth-stat-value"
                style={{ color: card.color }}
              >
                {card.value}
              </span>
              <span className="auth-stat-label">{card.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ───── Right Form Panel ───── */}
      <div className="auth-right">
        <div className="auth-right-inner">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
