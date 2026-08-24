import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import './LandingNavbar.css';

const navLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'About', href: '/about' },
  { label: 'Modules', href: '/#modules' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Contact', href: '/#contact' },
];

const LandingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  /* Add/remove "scrolled" class on scroll */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  return (
    <header className={`landing-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="landing-navbar-inner">
        {/* ── Logo ── */}
        <Link to="/" className="landing-navbar-logo">
          <div className="landing-navbar-logo-icon">U</div>
          <span className="landing-navbar-logo-text">UNIVO</span>
        </Link>

        {/* ── Desktop nav links ── */}
        <nav className="landing-navbar-links">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="landing-navbar-link">
              {link.label}
            </a>
          ))}
        </nav>

        {/* ── CTA buttons ── */}
        <div className="landing-navbar-cta">
          <button
            type="button"
            className="landing-navbar-btn-ghost"
            style={{ padding: '8px 12px', display: 'flex', alignItems: 'center' }}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            onClick={toggleTheme}
          >
            {isDark ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#64748b" />}
          </button>
          <Link to="/login" className="landing-navbar-btn-ghost">
            Login
          </Link>
          <Link to="/register" className="landing-navbar-btn-primary">
            Get Started
          </Link>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          className="landing-navbar-hamburger"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {isMobileMenuOpen && (
        <div className="landing-navbar-mobile-menu">
          <nav className="landing-navbar-mobile-links">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="landing-navbar-mobile-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="landing-navbar-mobile-cta">
            <Link to="/login" className="landing-navbar-btn-ghost full-width">
              Login
            </Link>
            <Link to="/register" className="landing-navbar-btn-primary full-width">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;
