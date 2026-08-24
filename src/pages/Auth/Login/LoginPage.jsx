import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import './LoginPage.css';

const DEMO_CREDENTIALS = {
  student: { email: 'aryan@universityverse.edu', pass: 'student123' },
  faculty: { email: 'priya@universityverse.edu', pass: 'faculty123' },
  parent: { email: 'ramesh@gmail.com', pass: 'parent123' },
  admin: { email: 'admin@universityverse.edu', pass: 'admin123' }
};

const ROLE_ROUTES = {
  student: '/dashboard',
  faculty: '/faculty',
  parent: '/parent',
  admin: '/dashboard'
};

export default function LoginPage() {
  const [role, setRole] = useState(() => {
    return localStorage.getItem('uv_selected_role') || 'student';
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    localStorage.setItem('uv_selected_role', selectedRole);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const validateEmail = (val) => {
    return String(val)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim()) {
      setErrorMsg('Email address is required.');
      return;
    }

    if (!validateEmail(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setErrorMsg('Password is required.');
      return;
    }

    // Demo Credential Verification Warning or Accept
    const expected = DEMO_CREDENTIALS[role];
    if (expected && (email.trim() !== expected.email || password !== expected.pass)) {
      setErrorMsg(`Invalid credentials for ${role}. Click a "Demo ${role.charAt(0).toUpperCase() + role.slice(1)}" button below to auto-fill valid credentials.`);
      return;
    }

    const userData = {
      id: role.toUpperCase() + '001',
      name: email.split('@')[0].replace('.', ' '),
      email: email.trim(),
      role: role,
      isLoggedIn: true
    };

    login(userData);
    setSuccessMsg(`Login successful! Redirecting to ${role} portal...`);

    setTimeout(() => {
      navigate(ROLE_ROUTES[role] || '/dashboard');
    }, 600);
  };

  const handleDemoAutoFill = (demoRole) => {
    handleRoleSelect(demoRole);
    const creds = DEMO_CREDENTIALS[demoRole];
    if (creds) {
      setEmail(creds.email);
      setPassword(creds.pass);
      setErrorMsg('');
      setSuccessMsg(`Auto-filled ${demoRole} credentials.`);
      setTimeout(() => setSuccessMsg(''), 2500);
    }
  };

  return (
    <div className="login-card">
      <div className="login-card-header">
        <h2>Welcome Back</h2>
        <p>Sign in to access your UNIVO portal</p>
      </div>

      {/* Role Selection Tabs */}
      <div className="login-role-tabs">
        {['student', 'faculty', 'parent', 'admin'].map((r) => (
          <button
            key={r}
            type="button"
            className={`role-tab ${role === r ? 'active' : ''}`}
            onClick={() => handleRoleSelect(r)}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>

      {/* Validation / Alert Banner */}
      {errorMsg && (
        <div className="login-alert error">
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="login-alert success">
          <CheckCircle size={16} /> {successMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLoginSubmit}>
        <div className="form-group-field">
          <label>Email Address</label>
          <div className="input-icon-wrapper">
            <Mail size={18} className="field-icon" />
            <input
              type="email"
              placeholder="your.email@universityverse.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
            />
          </div>
        </div>

        <div className="form-group-field">
          <label>Password</label>
          <div className="input-icon-wrapper">
            <Lock size={18} className="field-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
            <button
              type="button"
              className="toggle-pass-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button type="submit" className="login-btn">
          Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
        </button>
      </form>

      {/* Quick Demo One-Click Access */}
      <div className="demo-section-wrap">
        <p className="demo-section-label">Quick Demo Auto-Fill Access:</p>
        <div className="demo-grid">
          <button type="button" className={`demo-btn ${role === 'student' ? 'active' : ''}`} onClick={() => handleDemoAutoFill('student')}>
            Demo Student
          </button>
          <button type="button" className={`demo-btn ${role === 'faculty' ? 'active' : ''}`} onClick={() => handleDemoAutoFill('faculty')}>
            Demo Faculty
          </button>
          <button type="button" className={`demo-btn ${role === 'parent' ? 'active' : ''}`} onClick={() => handleDemoAutoFill('parent')}>
            Demo Parent
          </button>
          <button type="button" className={`demo-btn ${role === 'admin' ? 'active' : ''}`} onClick={() => handleDemoAutoFill('admin')}>
            Demo Admin
          </button>
        </div>
      </div>
    </div>
  );
}
