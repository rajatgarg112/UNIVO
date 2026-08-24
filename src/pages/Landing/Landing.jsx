import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users, BookOpen, Library, Briefcase, Music, Home,
  Map, BarChart2, Star, ArrowRight, Play, Zap,
  CheckCircle, Award, Clock, TrendingUp
} from 'lucide-react';
import './Landing.css';

/* ── data ─────────────────────────────────────────────── */
const features = [
  {
    icon: <CheckCircle size={22} />,
    title: 'Smart Attendance',
    desc: 'Auto-tracking with biometric integration. Instant 75% threshold alerts sent to students and parents.',
    color: '#D71920',
    bg: 'rgba(215,25,32,0.12)',
  },
  {
    icon: <BookOpen size={22} />,
    title: 'Assignment Hub',
    desc: 'Submit, track, and grade assignments online. Plagiarism detection and rubric-based grading built in.',
    color: '#E8333A',
    bg: 'rgba(139,92,246,0.12)',
  },
  {
    icon: <Library size={22} />,
    title: 'Digital Library',
    desc: 'Access 20,000+ books, journals, and e-resources. Borrow digitally with one click, no queues.',
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.12)',
  },
  {
    icon: <Briefcase size={22} />,
    title: 'Placement Cell',
    desc: 'Connect with 150+ partner companies. Apply to drives, track status, and schedule interviews.',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.12)',
  },
  {
    icon: <Music size={22} />,
    title: 'Club Management',
    desc: 'Join and manage 50+ student clubs. Create events, track memberships, and post announcements.',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
  },
  {
    icon: <Home size={22} />,
    title: 'Hostel Portal',
    desc: 'Manage room allocations, mess menus, and raise maintenance complaints — all from one dashboard.',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
  },
  {
    icon: <Map size={22} />,
    title: 'Campus Map',
    desc: 'Interactive navigation across all buildings, labs, classrooms, and facilities on your campus.',
    color: '#ec4899',
    bg: 'rgba(236,72,153,0.12)',
  },
  {
    icon: <Users size={22} />,
    title: 'Parent Dashboard',
    desc: "Real-time updates on your child's attendance, grades, fees, and campus activities.",
    color: '#14b8a6',
    bg: 'rgba(20,184,166,0.12)',
  },
];

const testimonials = [
  {
    quote:
      'UNIVO completely changed how I manage my semester. Tracking assignments and attendance in one place saves me hours every week.',
    name: 'Priya Sharma',
    dept: 'B.Tech CSE, 3rd Year',
    initials: 'PS',
    avatarBg: 'linear-gradient(135deg, #D71920, #E8333A)',
    stars: 5,
  },
  {
    quote:
      'The placement cell module is phenomenal. I got my dream internship through the platform without going to the placement office even once.',
    name: 'Rahul Mehta',
    dept: 'MBA Finance, 2nd Year',
    initials: 'RM',
    avatarBg: 'linear-gradient(135deg, #06b6d4, #D71920)',
    stars: 5,
  },
  {
    quote:
      "As a parent, the real-time dashboard gives me peace of mind. I always know my daughter's attendance status and upcoming exams.",
    name: 'Sunita Agarwal',
    dept: 'Parent — Ananya Agarwal, B.Sc',
    initials: 'SA',
    avatarBg: 'linear-gradient(135deg, #10b981, #06b6d4)',
    stars: 5,
  },
];

const modules = [
  { label: 'Smart Attendance', icon: '📋' },
  { label: 'Assignment Hub', icon: '📝' },
  { label: 'Digital Library', icon: '📚' },
  { label: 'Placement Cell', icon: '💼' },
  { label: 'Club Management', icon: '🎵' },
  { label: 'Hostel Portal', icon: '🏠' },
  { label: 'Campus Map', icon: '🗺️' },
  { label: 'Parent Dashboard', icon: '👨‍👩‍👧' },
  { label: 'Fee Management', icon: '💳' },
  { label: 'Timetable', icon: '🗓️' },
  { label: 'Exam Portal', icon: '📊' },
  { label: 'Results', icon: '🏆' },
  { label: 'Bus Tracking', icon: '🚌' },
  { label: 'Cafeteria Menu', icon: '🍽️' },
  { label: 'Health Center', icon: '🏥' },
  { label: 'Sports Complex', icon: '⚽' },
  { label: 'Grievance Portal', icon: '📣' },
  { label: 'Alumni Network', icon: '🤝' },
  { label: 'Research Portal', icon: '🔬' },
  { label: 'E-Learning', icon: '🎓' },
  { label: 'News & Notices', icon: '📰' },
  { label: 'Event Management', icon: '🎉' },
];

const stats = [
  { value: '50,000+', label: 'Active Students', icon: <Users size={22} /> },
  { value: '200+', label: 'Faculty Members', icon: <Award size={22} /> },
  { value: '98%', label: 'Satisfaction Rate', icon: <Star size={22} /> },
  { value: '150+', label: 'Partner Companies', icon: <Briefcase size={22} /> },
];

/* ── component ─────────────────────────────────────────── */
export default function Landing() {

  return (
    <div className="landing-page">

      {/* ── Hero Section ── */}
      <section className="hero-section">
        <div className="hero-bg-blob hero-bg-blob-1" />
        <div className="hero-bg-blob hero-bg-blob-2" />
        <div className="hero-bg-blob hero-bg-blob-3" />

        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            The Future of Campus Management
          </div>

          <h1 className="hero-title">
            The Digital{' '}
            <span className="hero-title-gradient">Operating System</span>
            <br />
            for Universities
          </h1>

          <p className="hero-subtitle">
            Unify attendance, assignments, library, placements, clubs, and more into one
            intelligent ecosystem built for modern universities.
          </p>

          <div className="hero-cta-group">
            <Link to="/login" className="btn-primary">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <button className="btn-ghost">
              <Play size={16} /> Watch Demo
            </button>
          </div>

          {/* Mock Dashboard */}
          <div className="hero-dashboard-preview">
            <div className="dashboard-preview-header">
              <span className="preview-dot preview-dot-red" />
              <span className="preview-dot preview-dot-yellow" />
              <span className="preview-dot preview-dot-green" />
              <span className="preview-title">UNIVO — Student Dashboard</span>
            </div>

            <div className="dashboard-preview-grid">
              <div className="preview-stat-card">
                <div className="preview-stat-label">Attendance</div>
                <div className="preview-stat-value green">87.5%</div>
              </div>
              <div className="preview-stat-card">
                <div className="preview-stat-label">Assignments Due</div>
                <div className="preview-stat-value blue">3</div>
              </div>
              <div className="preview-stat-card">
                <div className="preview-stat-label">Current CGPA</div>
                <div className="preview-stat-value purple">8.74</div>
              </div>
              <div className="preview-stat-card">
                <div className="preview-stat-label">Credits Earned</div>
                <div className="preview-stat-value cyan">92</div>
              </div>
            </div>

            <div className="dashboard-preview-row">
              <div className="preview-chart-card">
                <div className="preview-chart-title">Semester Performance Trend</div>
                <div className="preview-chart-bars">
                  {[55, 65, 72, 80, 75, 85, 90, 87].map((h, i) => (
                    <div
                      key={i}
                      className="preview-bar"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="preview-list-card">
                {['Data Structures — 9:00 AM', 'DBMS Lab — 11:00 AM', 'OS Theory — 2:00 PM'].map(
                  (item, i) => (
                    <div key={i} className="preview-list-item">
                      <span className="preview-list-dot" />
                      <span className="preview-list-text">{item}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Hero stat row */}
          <div className="hero-stats-row">
            {[
              { value: '50+', label: 'Universities' },
              { value: '1M+', label: 'Students' },
              { value: '99.9%', label: 'Uptime' },
              { value: '4.9/5', label: 'Rating' },
            ].map((s) => (
              <div key={s.label} className="hero-stat-item">
                <div className="hero-stat-value">{s.value}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Counter Section ── */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stats-grid">
            {stats.map((s) => (
              <div key={s.label} className="stat-counter-card">
                <div className="stat-counter-icon">{s.icon}</div>
                <div className="stat-counter-value">{s.value}</div>
                <div className="stat-counter-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag">
              <Zap size={12} /> Features
            </div>
            <h2 className="section-title">Everything your campus needs, unified</h2>
            <p className="section-subtitle">
              From attendance to placements, every university workflow reimagined for the digital
              era.
            </p>
          </div>

          <div className="features-grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <div
                  className="feature-icon-box"
                  style={{ background: f.bg, color: f.color, border: `1px solid ${f.color}33` }}
                >
                  {f.icon}
                </div>
                <div className="feature-card-title">{f.title}</div>
                <div className="feature-card-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag">
              <Star size={12} /> Testimonials
            </div>
            <h2 className="section-title">Loved by students, trusted by institutions</h2>
            <p className="section-subtitle">
              Hear from the students, faculty, and parents who use UNIVO every day.
            </p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <div key={t.name} className="testimonial-card">
                <div className="testimonial-stars">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <span key={i} className="star-icon">★</span>
                  ))}
                </div>
                <p className="testimonial-quote">"{t.quote}"</p>
                <div className="testimonial-author">
                  <div
                    className="testimonial-avatar"
                    style={{ background: t.avatarBg }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-info">{t.dept}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Modules Showcase ── */}
      <section className="modules-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag">
              <BarChart2 size={12} /> Modules
            </div>
            <h2 className="section-title">22+ powerful modules in one platform</h2>
            <p className="section-subtitle">
              Every corner of campus life — digitised, streamlined, and connected.
            </p>
          </div>
          <div className="modules-grid">
            {modules.map((m) => (
              <div key={m.label} className="module-pill">
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="cta-section">
        <div className="section-container cta-content">
          <div className="section-tag" style={{ margin: '0 auto 20px' }}>
            <TrendingUp size={12} /> Get Started
          </div>
          <h2 className="cta-title">Ready to Transform Your University?</h2>
          <p className="cta-subtitle">
            Join 50+ forward-thinking universities already running on UNIVO. Setup takes
            less than a day.
          </p>
          <div className="cta-btn-group">
            <Link to="/login" className="btn-primary">
              Start Free Trial <ArrowRight size={18} />
            </Link>
            <button className="btn-outline">
              <Clock size={16} /> Request a Demo
            </button>
          </div>
        </div>
      </section>
    </div>

  );
}
