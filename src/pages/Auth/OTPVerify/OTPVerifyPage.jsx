import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OTPInput from '../../../components/forms/OTPInput/OTPInput';
import '../Login/LoginPage.css';

export default function OTPVerifyPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const navigate = useNavigate();

  const handleVerify = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="login-card">
      <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#f8fafc', marginBottom: '8px' }}>Verify OTP</h2>
      <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>Enter the 6-digit code sent to your email</p>
      
      <form onSubmit={handleVerify}>
        <div style={{ marginBottom: '24px' }}>
          <OTPInput value={otp} onChange={setOtp} />
        </div>
        <button type="submit" className="login-btn">Verify & Continue</button>
      </form>
    </div>
  );
}
