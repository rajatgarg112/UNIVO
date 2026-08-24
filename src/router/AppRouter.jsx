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
    <div className="app-loading-fallback">
      <div className="app-loading-spinner-box">
        <div className="app-loading-spinner" />
        <p className="app-loading-text">Loading UniversityVerse...</p>
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
