import React from 'react';
import { Link } from 'react-router-dom';
import FormInput from '../../../components/forms/FormInput/FormInput';
import '../Login/LoginPage.css';

export default function SignupPage() {
  return (
    <div className="login-card">
      <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#f8fafc', marginBottom: '8px' }}>Create Account</h2>
      <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>Join UNIVO digital campus</p>
      
      <form onSubmit={(e) => e.preventDefault()}>
        <FormInput label="Full Name" type="text" placeholder="Aryan Sharma" />
        <FormInput label="University Email" type="email" placeholder="aryan@universityverse.edu" />
        <FormInput label="Roll Number" type="text" placeholder="CS2021001" />
        <FormInput label="Password" type="password" placeholder="••••••••" />

        <button type="submit" className="login-btn">Register Account</button>
      </form>

      <p style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', marginTop: '16px' }}>
        Already have an account? <Link to="/login" style={{ color: '#E8333A' }}>Sign In</Link>
      </p>
    </div>
  );
}
