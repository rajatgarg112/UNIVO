import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import LandingLayout from '../layouts/LandingLayout/LandingLayout';
import AuthLayout from '../layouts/AuthLayout/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout/DashboardLayout';

// Public & Auth Pages
const Landing    = lazy(() => import('../pages/Landing/Landing'));
const LoginPage  = lazy(() => import('../pages/Auth/Login/LoginPage'));
const SignupPage = lazy(() => import('../pages/Auth/Signup/SignupPage'));
const ForgotPasswordPage = lazy(() => import('../pages/Auth/ForgotPassword/ForgotPasswordPage'));
const OTPVerifyPage      = lazy(() => import('../pages/Auth/OTPVerify/OTPVerifyPage'));

// Dashboard Pages
const Dashboard     = lazy(() => import('../pages/Dashboard/Dashboard'));
const Profile       = lazy(() => import('../pages/Profile/Profile'));
const Attendance    = lazy(() => import('../pages/Attendance/Attendance'));
const Timetable     = lazy(() => import('../pages/Timetable/Timetable'));
const Assignments   = lazy(() => import('../pages/Assignments/Assignments'));
const NotesHub      = lazy(() => import('../pages/NotesHub/NotesHub'));
const About         = lazy(() => import('../pages/About/About'));
const NotFound      = lazy(() => import('../pages/NotFound/NotFound'));

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user || !user.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Fallback Loading Component
function LoadingFallback() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0a0f1e',
        color: '#f8fafc',
        fontFamily: 'sans-serif'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            border: '4px solid rgba(99, 102, 241, 0.2)',
            borderTopColor: '#6366f1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Loading UniversityVerse...</p>
      </div>
    </div>
  );
}

function AppRouter() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Landing Layout Routes */}
        <Route element={<LandingLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
        </Route>

        {/* Auth Layout Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/otp-verify" element={<OTPVerifyPage />} />
        </Route>

        {/* Protected Dashboard Layout Routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/notes" element={<NotesHub />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
