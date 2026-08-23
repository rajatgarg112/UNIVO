import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  Share2,
  MessageSquare,
  ArrowRight,
  Mail,
} from 'lucide-react';
import './LandingFooter.css';

const footerColumns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'Modules', href: '/#modules' },
      { label: 'Pricing', href: '/#pricing' },
      { label: 'Roadmap', href: '/roadmap' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press Kit', href: '/press' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Documentation', href: '/docs' },
      { label: 'Community', href: '/community' },
      { label: 'System Status', href: '/status' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Security', href: '/security' },
    ],
  },
];

const socialLinks = [
  { icon: <Globe size={18} />, href: 'https://universityverse.edu', label: 'Website' },
  { icon: <Share2 size={18} />, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: <MessageSquare size={18} />, href: 'https://twitter.com', label: 'Twitter' },
  { icon: <Mail size={18} />, href: 'mailto:contact@universityverse.edu', label: 'Email' },
];

const LandingFooter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="landing-footer">
      {/* Top gradient accent */}
      <div className="footer-accent-bar" />

      <div className="landing-footer-inner">
        {/* ── Top section ── */}
        <div className="footer-top">
          {/* Brand + tagline + newsletter */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand">
              <div className="footer-brand-icon">UV</div>
              <span className="footer-brand-name">UniversityVerse</span>
            </Link>
            <p className="footer-tagline">
              Transforming the university experience — one campus at a time.
              The all-in-one platform for students, faculty, and administrators.
            </p>

            {/* Newsletter */}
            <div className="footer-newsletter">
              <p className="footer-newsletter-label">
                <Mail size={14} />
                <span>Stay in the loop</span>
              </p>
              {subscribed ? (
                <p className="footer-newsletter-success">
                  ✓ Thanks for subscribing! We'll be in touch.
                </p>
              ) : (
                <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    className="footer-newsletter-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="footer-newsletter-btn">
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Link columns */}
          <div className="footer-links-grid">
            {footerColumns.map((col) => (
              <div key={col.title} className="footer-link-col">
                <h4 className="footer-link-col-title">{col.title}</h4>
                <ul className="footer-link-list">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="footer-link">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="footer-divider" />

        {/* ── Bottom bar ── */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} UniversityVerse. All rights reserved.
            Built with ❤️ for students everywhere.
          </p>
          <div className="footer-socials">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label={s.label}
                title={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
