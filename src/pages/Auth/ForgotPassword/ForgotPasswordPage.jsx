import React from 'react';
import { Link } from 'react-router-dom';
import FormInput from '../../../components/forms/FormInput/FormInput';
import '../Login/LoginPage.css';

export default function ForgotPasswordPage() {
  return (
    <div className="login-card">
      <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#f8fafc', marginBottom: '8px' }}>Reset Password</h2>
      <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>Enter your registered email to receive an OTP</p>
      
      <form onSubmit={(e) => e.preventDefault()}>
        <FormInput label="Email Address" type="email" placeholder="your.email@universityverse.edu" />
        <button type="submit" className="login-btn">Send OTP Code</button>
      </form>

      <p style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', marginTop: '16px' }}>
        Remember your password? <Link to="/login" style={{ color: '#818cf8' }}>Back to Login</Link>
      </p>
    </div>
  );
}
