import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Users,
  Award,
  AlertCircle,
  FileText,
  ShieldCheck,
  Send,
  ExternalLink,
  Briefcase
} from 'lucide-react';
import initialDrives from '../../data/placements.json';
import { useAuth } from '../../context/AuthContext';
import usePlacementApplications from './usePlacementApplications';
import './Placement.css';

/**
 * Page Component: PlacementDetails
 * Demonstrates:
 * - Dynamic routing with useParams() to extract drive ID
 * - Controlled inputs and form state management with useState()
 * - Form validation (required checks, email format, CGPA numerical range)
 * - Duplicate application prevention with LocalStorage
 * - useEffect to auto-scroll to top and populate user data
 * - Conditional rendering for form vs. already-applied state
 */
export default function PlacementDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isApplied, getApplicationByDriveId, applyForDrive, withdrawApplication } = usePlacementApplications();

  // 1. Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // 2. Find the drive by id from route parameter
  const drive = initialDrives.find((item) => item.id === id);

  // 3. Form State (Controlled inputs)
  const [formData, setFormData] = useState({
    studentName: user?.name || '',
    rollNo: user?.rollNo || '',
    email: user?.email || '',
    cgpa: user?.cgpa ? String(user.cgpa) : '',
    graduationYear: user?.graduationYear ? String(user.graduationYear) : '',
    resumeLink: '',
    statement: '',
    agreeTerms: false,
  });

  // Sync profile data when user is available without overwriting manual user entries
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        studentName: prev.studentName || user.name || '',
        rollNo: prev.rollNo || user.rollNo || '',
        email: prev.email || user.email || '',
        cgpa: prev.cgpa || (user.cgpa ? String(user.cgpa) : ''),
        graduationYear: prev.graduationYear || (user.graduationYear ? String(user.graduationYear) : ''),
      }));
    }
  }, [user]);

  // 4. Form error messages
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // If drive does not exist with this ID
  if (!drive) {
    return (
      <div className="placement-page">
        <button onClick={() => navigate('/placements')} className="btn-back">
          <ArrowLeft size={16} /> Back to Placements
        </button>

        <div className="placement-empty-state" style={{ marginTop: '20px' }}>
          <div className="empty-state-icon">
            <AlertCircle size={32} />
          </div>
          <h3>Placement Drive Not Found</h3>
          <p>
            The placement drive with ID "{id}" was not found or may have expired.
          </p>
          <button onClick={() => navigate('/placements')} className="btn-placement-primary">
            Explore All Placement Drives
          </button>
        </div>
      </div>
    );
  }

  const hasAlreadyApplied = isApplied(drive.id);
  const existingApplication = getApplicationByDriveId(drive.id);

  // 5. Input change handler for form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear individual field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // 6. Form validation logic
  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Full Name is required';
    }

    if (!formData.rollNo.trim()) {
      newErrors.rollNo = 'University Roll Number is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const cgpaNum = parseFloat(formData.cgpa);
    if (!formData.cgpa.trim() || isNaN(cgpaNum)) {
      newErrors.cgpa = 'Valid CGPA is required';
    } else if (cgpaNum < 0 || cgpaNum > 10) {
      newErrors.cgpa = 'CGPA must be between 0.0 and 10.0';
    }

    if (!formData.resumeLink.trim()) {
      newErrors.resumeLink = 'Resume / Portfolio link is required';
    } else if (!formData.resumeLink.startsWith('http://') && !formData.resumeLink.startsWith('https://')) {
      newErrors.resumeLink = 'URL must start with http:// or https://';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must confirm the placement policy agreement';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 7. Handle Application Submission
  const handleSubmitApplication = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Submit via custom hook
    const result = applyForDrive({
      driveId: drive.id,
      company: drive.company,
      role: drive.role,
      packageDisplay: drive.packageDisplay,
      studentName: formData.studentName,
      rollNo: formData.rollNo,
      email: formData.email,
      cgpa: formData.cgpa,
      graduationYear: formData.graduationYear,
      resumeLink: formData.resumeLink,
      notes: formData.statement,
    });

    if (result.success) {
      setSuccessMessage(result.message);
    }
  };

  // 8. Handle Withdraw from this drive details page
  const handleWithdraw = () => {
    if (!existingApplication) return;
    const confirmWithdraw = window.confirm(
      `Are you sure you want to withdraw your application for ${drive.company}?`
    );
    if (confirmWithdraw) {
      withdrawApplication(existingApplication.id);
      setSuccessMessage('Application withdrawn successfully. You may re-apply if needed.');
    }
  };

  const studentCgpa = parseFloat(formData.cgpa);
  const isCgpaEligible = !isNaN(studentCgpa) ? studentCgpa >= drive.minCgpa : true;

  return (
    <div className="placement-page">
      {/* ─── Top Navigation Bar ─── */}
      <div className="placement-details-header">
        <button onClick={() => navigate('/placements')} className="btn-back">
          <ArrowLeft size={16} /> Back to Drives
        </button>

        <Link to="/placements/applications" className="btn-placement-nav">
          <Send size={15} /> My Applications
        </Link>
      </div>

      {/* ─── Hero Banner ─── */}
      <div className="drive-hero-banner">
        <div className="hero-left">
          <div className="hero-company-logo">{drive.company[0]}</div>
          <div>
            <h1 className="hero-company-title">{drive.company}</h1>
            <p className="hero-role-title">
              {drive.role} • <span style={{ color: '#D71920', fontWeight: 600 }}>{drive.category}</span>
            </p>
          </div>
        </div>

        <div className="hero-right">
          <span className="hero-package-display">{drive.packageDisplay}</span>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            Application Deadline: <strong style={{ color: '#f8fafc' }}>{drive.deadline}</strong>
          </span>
        </div>
      </div>

      {/* ─── Success Notification Banner ─── */}
      {successMessage && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '12px 16px',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            fontWeight: 600
          }}
        >
          <CheckCircle size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* ─── Two-Column Details Grid ─── */}
      <div className="details-grid">
        {/* Left Column: Drive Information */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Overview Card */}
          <div className="details-card">
            <h3 className="card-heading">
              <Briefcase size={18} color="#D71920" /> About the Opportunity
            </h3>
            <p className="details-section-text">{drive.description}</p>

            <div className="placement-meta-list">
              <div className="meta-row">
                <span className="meta-row-label">
                  <Award size={13} /> Minimum Eligibility
                </span>
                <span className="meta-row-value">{drive.eligibility}</span>
              </div>
              <div className="meta-row">
                <span className="meta-row-label">
                  <MapPin size={13} /> Job Location
                </span>
                <span className="meta-row-value">{drive.location}</span>
              </div>
              <div className="meta-row">
                <span className="meta-row-label">
                  <Users size={13} /> Total Openings
                </span>
                <span className="meta-row-value">{drive.openings} positions</span>
              </div>
              <div className="meta-row">
                <span className="meta-row-label">
                  <Clock size={13} /> Service Agreement / Bond
                </span>
                <span className="meta-row-value">{drive.bond}</span>
              </div>
            </div>
          </div>

          {/* Key Requirements */}
          <div className="details-card">
            <h3 className="card-heading">
              <ShieldCheck size={18} color="#10b981" /> Candidate Requirements & Skills
            </h3>
            <div className="requirements-list">
              {drive.requirements.map((req, idx) => (
                <div key={idx} className="requirement-item">
                  <CheckCircle size={16} className="requirement-icon" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selection Rounds Timeline */}
          <div className="details-card">
            <h3 className="card-heading">
              <Calendar size={18} color="#a855f7" /> Selection Process & Rounds
            </h3>
            <div className="selection-rounds-list">
              {drive.selectionRounds.map((round) => (
                <div key={round.round} className="round-item">
                  <div className="round-badge-number">{round.round}</div>
                  <div className="round-info">
                    <h4>{round.name}</h4>
                    <p>{round.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Application Form OR Already Applied State */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {hasAlreadyApplied ? (
            /* ─── State A: Already Applied Card (Duplicate Prevention) ─── */
            <div className="details-card">
              <h3 className="card-heading" style={{ color: '#10b981' }}>
                <CheckCircle size={18} color="#10b981" /> Application Submitted
              </h3>

              <div className="applied-success-card">
                <div className="applied-badge-row">
                  <h4>Application on Record</h4>
                  <span className={`status-pill ${existingApplication?.status?.toLowerCase().replace(/\s+/g, '-') || 'under-review'}`}>
                    {existingApplication?.status || 'Under Review'}
                  </span>
                </div>

                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
                  You have already applied for the <strong>{drive.role}</strong> position at <strong>{drive.company}</strong>.
                  Duplicate submissions are prevented.
                </p>

                <div className="applied-meta-grid">
                  <div className="applied-meta-item">
                    <span>Applied On</span>
                    <span>{existingApplication?.appliedDate || 'Recent'}</span>
                  </div>
                  <div className="applied-meta-item">
                    <span>Roll Number</span>
                    <span>{existingApplication?.rollNo || formData.rollNo}</span>
                  </div>
                  <div className="applied-meta-item">
                    <span>Recorded CGPA</span>
                    <span>{existingApplication?.cgpa || formData.cgpa}</span>
                  </div>
                  <div className="applied-meta-item">
                    <span>Package</span>
                    <span>{drive.packageDisplay}</span>
                  </div>
                </div>

                {existingApplication?.resumeLink && (
                  <div style={{ fontSize: '12px', marginTop: '6px' }}>
                    <span style={{ color: '#94a3b8' }}>Submitted Resume: </span>
                    <a
                      href={existingApplication.resumeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#D71920', textDecoration: 'underline' }}
                    >
                      View Link <ExternalLink size={11} style={{ display: 'inline' }} />
                    </a>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link to="/placements/applications" className="btn-placement-primary" style={{ justifyContent: 'center' }}>
                  <FileText size={15} /> Track in My Applications
                </Link>

                <button
                  type="button"
                  onClick={handleWithdraw}
                  className="btn-table-action withdraw"
                  style={{ justifyContent: 'center', padding: '10px' }}
                >
                  Withdraw Application
                </button>
              </div>
            </div>
          ) : (
            /* ─── State B: Application Form with Controlled Inputs & Validation ─── */
            <div className="details-card">
              <h3 className="card-heading">
                <Send size={18} color="#D71920" /> Apply for this Drive
              </h3>

              {/* CGPA Eligibility Notice */}
              {formData.cgpa && !isCgpaEligible && (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    fontSize: '12px',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <AlertCircle size={16} flexShrink={0} />
                  <span>
                    Warning: Your entered CGPA ({formData.cgpa}) is lower than the minimum cutoff ({drive.minCgpa}).
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmitApplication} className="placement-form" noValidate>
                {/* Full Name */}
                <div className="form-field-group">
                  <label className="form-label" htmlFor="studentName">
                    Full Name *
                  </label>
                  <input
                    id="studentName"
                    type="text"
                    name="studentName"
                    className={`form-input-field ${errors.studentName ? 'input-error' : ''}`}
                    value={formData.studentName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                  {errors.studentName && <span className="form-error-msg">{errors.studentName}</span>}
                </div>

                {/* Roll Number & CGPA Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-field-group">
                    <label className="form-label" htmlFor="rollNo">
                      Roll Number *
                    </label>
                    <input
                      id="rollNo"
                      type="text"
                      name="rollNo"
                      className={`form-input-field ${errors.rollNo ? 'input-error' : ''}`}
                      value={formData.rollNo}
                      onChange={handleInputChange}
                      placeholder="e.g. CS2021001"
                    />
                    {errors.rollNo && <span className="form-error-msg">{errors.rollNo}</span>}
                  </div>

                  <div className="form-field-group">
                    <label className="form-label" htmlFor="cgpa">
                      Current CGPA *
                    </label>
                    <input
                      id="cgpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      name="cgpa"
                      className={`form-input-field ${errors.cgpa ? 'input-error' : ''}`}
                      value={formData.cgpa}
                      onChange={handleInputChange}
                      placeholder="e.g. 9.2"
                    />
                    {errors.cgpa && <span className="form-error-msg">{errors.cgpa}</span>}
                  </div>
                </div>

                {/* University Email */}
                <div className="form-field-group">
                  <label className="form-label" htmlFor="email">
                    University Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    className={`form-input-field ${errors.email ? 'input-error' : ''}`}
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="student@universityverse.edu"
                  />
                  {errors.email && <span className="form-error-msg">{errors.email}</span>}
                </div>

                {/* Resume Link */}
                <div className="form-field-group">
                  <label className="form-label" htmlFor="resumeLink">
                    Resume / Portfolio Link *
                  </label>
                  <input
                    id="resumeLink"
                    type="url"
                    name="resumeLink"
                    className={`form-input-field ${errors.resumeLink ? 'input-error' : ''}`}
                    value={formData.resumeLink}
                    onChange={handleInputChange}
                    placeholder="https://your-portfolio-or-resume.com"
                  />
                  {errors.resumeLink && <span className="form-error-msg">{errors.resumeLink}</span>}
                </div>

                {/* Statement of Interest */}
                <div className="form-field-group">
                  <label className="form-label" htmlFor="statement">
                    Statement of Interest / Notes (Optional)
                  </label>
                  <textarea
                    id="statement"
                    name="statement"
                    rows="3"
                    className="form-input-field"
                    style={{ resize: 'vertical' }}
                    value={formData.statement}
                    onChange={handleInputChange}
                    placeholder="Briefly state why you are interested in this position..."
                  />
                </div>

                {/* Confirmation Checkbox */}
                <div className="form-field-group">
                  <label className="form-checkbox-label">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      className="form-checkbox-input"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                    />
                    <span>
                      I confirm that all entered details are accurate and comply with university placement guidelines.
                    </span>
                  </label>
                  {errors.agreeTerms && <span className="form-error-msg">{errors.agreeTerms}</span>}
                </div>

                {/* Submit Application Button */}
                <button type="submit" className="btn-form-submit">
                  <Send size={15} /> Submit Application
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
