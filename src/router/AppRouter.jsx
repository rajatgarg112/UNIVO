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
const Library       = lazy(() => import('../pages/Library/Library'));
const HostelOverview = lazy(() => import('../pages/Hostel/HostelOverview/HostelOverview'));
const RoomDetailsPage = lazy(() => import('../pages/Hostel/RoomDetails/RoomDetailsPage'));
const HostelRequests = lazy(() => import('../pages/Hostel/HostelRequests/HostelRequests'));
const GatePass       = lazy(() => import('../pages/Hostel/GatePass/GatePass'));
const About         = lazy(() => import('../pages/About/About'));
const NotFound      = lazy(() => import('../pages/NotFound/NotFound'));

// Placement Module Pages
const PlacementList    = lazy(() => import('../pages/Placement/PlacementList'));
const PlacementDetails = lazy(() => import('../pages/Placement/PlacementDetails'));
const MyApplications   = lazy(() => import('../pages/Placement/MyApplications'));

// Career Module Pages
const CareerPathways   = lazy(() => import('../pages/Career/CareerPathways'));
const Internships      = lazy(() => import('../pages/Career/Internships'));

// Clubs & Events Module Pages
const Clubs        = lazy(() => import('../pages/clubs/Clubs'));
const ClubDetails  = lazy(() => import('../pages/clubs/ClubDetails'));
const Events       = lazy(() => import('../pages/events/Events'));
const EventDetails = lazy(() => import('../pages/events/EventDetails'));

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
        <p className="app-loading-text">Loading UNIVO...</p>
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
          <Route path="/library" element={<Library />} />
          <Route path="/hostel" element={<HostelOverview />} />
          <Route path="/hostel/room/:roomId" element={<RoomDetailsPage />} />
          <Route path="/hostel/requests" element={<HostelRequests />} />
          <Route path="/hostel/gatepass" element={<GatePass />} />
          <Route path="/placements" element={<PlacementList />} />
          <Route path="/placements/:id" element={<PlacementDetails />} />
          <Route path="/placements/applications" element={<MyApplications />} />
          <Route path="/placement" element={<Navigate to="/placements" replace />} />
          <Route path="/career" element={<CareerPathways />} />
          <Route path="/career/internships" element={<Internships />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/clubs/:clubId" element={<ClubDetails />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:eventId" element={<EventDetails />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;