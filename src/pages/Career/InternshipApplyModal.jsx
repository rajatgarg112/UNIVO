import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, Mail, User, Globe, FileText } from 'lucide-react';
import Modal from '../../components/ui/Modal/Modal';
import Badge from '../../components/ui/Badge/Badge';
import { useAuth } from '../../context/AuthContext';
import './Career.css';

/**
 * Component: InternshipApplyModal
 *
 * Demonstrates Syllabus Concepts:
 * 1. Component Composition: Reuses global Modal and Badge components
 * 2. Controlled Inputs with useState
 * 3. Form Validation with friendly, accessible error alerts
 * 4. Context consumption: useAuth to prefill student profile
 * 5. Conditional Rendering: Success feedback vs. form vs. already-applied banner
 */
export default function InternshipApplyModal({
  isOpen,
  onClose,
  internship,
  hasAlreadyApplied,
  onApply,
}) {
  const { user } = useAuth();

  // Controlled form state
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    portfolioUrl: '',
    coverNote: '',
  });

  // Validation errors & feedback states
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Synchronize initial state when modal opens or user/internship changes
  useEffect(() => {
    if (isOpen && internship) {
      setFormData({
        studentName: user?.name || '',
        email: user?.email || '',
        portfolioUrl: '',
        coverNote: '',
      });
      setErrors({});
      setSubmitSuccess(false);
    }
  }, [isOpen, internship, user]);

  if (!internship) return null;

  const isRemote = internship.workMode?.toLowerCase() === 'remote';

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validation rules
  const validate = () => {
    const newErrors = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Full Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.portfolioUrl.trim()) {
      if (!/^https?:\/\//i.test(formData.portfolioUrl.trim())) {
        newErrors.portfolioUrl = 'Portfolio URL must start with http:// or https://';
      }
    }

    if (!formData.coverNote.trim()) {
      newErrors.coverNote = 'Cover note is required';
    } else if (formData.coverNote.trim().length < 10) {
      newErrors.coverNote = 'Cover note must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (hasAlreadyApplied) {
      setErrors({ general: 'You have already applied for this internship.' });
      return;
    }

    if (!validate()) {
      return;
    }

    const result = onApply({
      internshipId: internship.id,
      company: internship.company,
      role: internship.role,
      studentName: formData.studentName.trim(),
      email: formData.email.trim(),
      portfolioUrl: formData.portfolioUrl.trim(),
      coverNote: formData.coverNote.trim(),
    });

    if (result.success) {
      setSubmitSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1400);
    } else {
      setErrors({ general: result.message });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Apply for ${internship.role}`}
      size="md"
    >
      <div className="internship-modal-content">
        {/* Selected Internship Summary Card */}
        <div className="apply-modal-header-card">
          <div className="apply-modal-header-info">
            <span className="apply-company-name">{internship.company}</span>
            <h4 className="apply-role-title">{internship.role}</h4>
          </div>
          <div className="apply-modal-header-badges">
            <span className="stipend-badge">{internship.stipend}</span>
            <Badge variant={isRemote ? 'success' : 'purple'} size="sm">
              {internship.workMode}
            </Badge>
          </div>
        </div>

        {/* State 1: Already Applied Banner */}
        {hasAlreadyApplied ? (
          <div className="apply-already-box">
            <CheckCircle2 size={32} color="#10b981" />
            <div>
              <h4>Application Already Submitted</h4>
              <p>
                You have already submitted an application for this {internship.company} role. Your application is recorded in portal records.
              </p>
            </div>
            <button
              type="button"
              className="btn-apply-close"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        ) : submitSuccess ? (
          /* State 2: Immediate Success Feedback */
          <div className="apply-success-box">
            <CheckCircle2 size={36} color="#10b981" />
            <h4>Application Submitted Successfully!</h4>
            <p>
              Your application for <strong>{internship.role}</strong> at <strong>{internship.company}</strong> has been recorded in your portal applications.
            </p>
          </div>
        ) : (
          /* State 3: Active Application Form */
          <form className="apply-form" onSubmit={handleSubmit} noValidate>
            {errors.general && (
              <div className="apply-form-error-banner" role="alert">
                <AlertCircle size={15} />
                <span>{errors.general}</span>
              </div>
            )}

            {/* Student Name */}
            <div className="apply-form-group">
              <label htmlFor="studentName" className="apply-form-label">
                <User size={13} /> Full Name <span className="required-star">*</span>
              </label>
              <input
                id="studentName"
                name="studentName"
                type="text"
                className={`apply-form-input ${errors.studentName ? 'error' : ''}`}
                placeholder="Enter your full name"
                value={formData.studentName}
                onChange={handleChange}
              />
              {errors.studentName && (
                <span className="apply-field-error" role="alert">
                  <AlertCircle size={12} /> {errors.studentName}
                </span>
              )}
            </div>

            {/* Email Address */}
            <div className="apply-form-group">
              <label htmlFor="email" className="apply-form-label">
                <Mail size={13} /> Email Address <span className="required-star">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`apply-form-input ${errors.email ? 'error' : ''}`}
                placeholder="student@universityverse.edu"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <span className="apply-field-error" role="alert">
                  <AlertCircle size={12} /> {errors.email}
                </span>
              )}
            </div>

            {/* Portfolio / GitHub URL (Optional) */}
            <div className="apply-form-group">
              <label htmlFor="portfolioUrl" className="apply-form-label">
                <Globe size={13} /> Portfolio or GitHub URL <span className="optional-tag">(Optional)</span>
              </label>
              <input
                id="portfolioUrl"
                name="portfolioUrl"
                type="url"
                className={`apply-form-input ${errors.portfolioUrl ? 'error' : ''}`}
                placeholder="https://github.com/your-username"
                value={formData.portfolioUrl}
                onChange={handleChange}
              />
              {errors.portfolioUrl && (
                <span className="apply-field-error" role="alert">
                  <AlertCircle size={12} /> {errors.portfolioUrl}
                </span>
              )}
            </div>

            {/* Cover Note */}
            <div className="apply-form-group">
              <label htmlFor="coverNote" className="apply-form-label">
                <FileText size={13} /> Cover Note / Why are you interested? <span className="required-star">*</span>
              </label>
              <textarea
                id="coverNote"
                name="coverNote"
                rows={3}
                className={`apply-form-textarea ${errors.coverNote ? 'error' : ''}`}
                placeholder="Briefly describe your relevant coursework, projects, or why you'd excel in this role..."
                value={formData.coverNote}
                onChange={handleChange}
              />
              {errors.coverNote && (
                <span className="apply-field-error" role="alert">
                  <AlertCircle size={12} /> {errors.coverNote}
                </span>
              )}
            </div>

            {/* Modal Actions */}
            <div className="apply-modal-actions">
              <button
                type="button"
                className="btn-apply-cancel"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-apply-submit"
              >
                <Send size={14} /> Submit Application
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
