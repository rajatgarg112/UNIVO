import React, { useState } from 'react';
import { User, Mail, Hash, BookOpen, Phone, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * EventRegistrationForm Component
 * Controlled form component with field validation and auth pre-filling.
 *
 * Demonstrates:
 * - Controlled inputs
 * - Form validation (regex, required fields, error feedback)
 * - Integration with useAuth() context
 * - Confirmation workflow before submission
 */
const EventRegistrationForm = ({ event, onSubmit, onCancel, isSubmitting }) => {
  const { user } = useAuth();

  // Controlled form state pre-filled from authenticated user
  const [formData, setFormData] = useState({
    studentName: user?.name || '',
    email: user?.email || '',
    rollNo: user?.rollNo || '',
    department: user?.department || 'Computer Science',
    semester: user?.semester || '6th',
    phone: '',
    notes: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [showConfirmStep, setShowConfirmStep] = useState(false);

  // Field change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear specific error on edit
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Full Name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'University email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    if (!formData.rollNo.trim()) {
      newErrors.rollNo = 'Student Roll Number / University ID is required.';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Contact number is required for event emergency contact.';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Please provide a valid 10-digit mobile number.';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must acknowledge the event guidelines to proceed.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 1: Validate and show review confirmation
  const handleProceedToConfirm = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmStep(true);
    }
  };

  // Step 2: Final submit
  const handleFinalSubmit = () => {
    onSubmit(formData);
  };

  if (showConfirmStep) {
    return (
      <div className="event-registration-confirm-step">
        <div className="confirm-step-header">
          <CheckCircle2 size={24} className="confirm-icon" />
          <div>
            <h3 className="confirm-title">Confirm Registration Details</h3>
            <p className="confirm-subtitle">Please verify your details before reserving your seat.</p>
          </div>
        </div>

        <div className="confirm-summary-card">
          <div className="confirm-row">
            <span className="confirm-label">Event:</span>
            <span className="confirm-value font-bold">{event.title}</span>
          </div>
          <div className="confirm-row">
            <span className="confirm-label">Date & Time:</span>
            <span className="confirm-value">{event.displayDate} • {event.time}</span>
          </div>
          <div className="confirm-row">
            <span className="confirm-label">Venue:</span>
            <span className="confirm-value">{event.venue}</span>
          </div>
          <div className="confirm-divider" />
          <div className="confirm-row">
            <span className="confirm-label">Student Name:</span>
            <span className="confirm-value">{formData.studentName}</span>
          </div>
          <div className="confirm-row">
            <span className="confirm-label">Email:</span>
            <span className="confirm-value">{formData.email}</span>
          </div>
          <div className="confirm-row">
            <span className="confirm-label">Roll No:</span>
            <span className="confirm-value">{formData.rollNo}</span>
          </div>
          <div className="confirm-row">
            <span className="confirm-label">Department:</span>
            <span className="confirm-value">{formData.department} ({formData.semester} Sem)</span>
          </div>
          <div className="confirm-row">
            <span className="confirm-label">Mobile:</span>
            <span className="confirm-value">{formData.phone}</span>
          </div>
          {formData.notes && (
            <div className="confirm-row">
              <span className="confirm-label">Special Notes:</span>
              <span className="confirm-value">{formData.notes}</span>
            </div>
          )}
        </div>

        <div className="registration-modal-actions">
          <button
            type="button"
            className="reg-btn-secondary"
            onClick={() => setShowConfirmStep(false)}
            disabled={isSubmitting}
          >
            Edit Information
          </button>
          <button
            type="button"
            className="reg-btn-primary"
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Confirming...' : 'Confirm & Reserve Seat'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="event-registration-form" onSubmit={handleProceedToConfirm} noValidate>
      {/* Student Name */}
      <div className="form-group">
        <label className="form-label" htmlFor="reg-name">
          <User size={14} /> Full Name <span className="req">*</span>
        </label>
        <input
          id="reg-name"
          name="studentName"
          type="text"
          className={`form-input ${errors.studentName ? 'has-error' : ''}`}
          placeholder="e.g. Aryan Sharma"
          value={formData.studentName}
          onChange={handleChange}
        />
        {errors.studentName && <span className="form-error-msg">{errors.studentName}</span>}
      </div>

      {/* University Email */}
      <div className="form-group">
        <label className="form-label" htmlFor="reg-email">
          <Mail size={14} /> University Email <span className="req">*</span>
        </label>
        <input
          id="reg-email"
          name="email"
          type="email"
          className={`form-input ${errors.email ? 'has-error' : ''}`}
          placeholder="e.g. aryan@universityverse.edu"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="form-error-msg">{errors.email}</span>}
      </div>

      {/* Row: Roll No & Department */}
      <div className="form-row-2">
        <div className="form-group">
          <label className="form-label" htmlFor="reg-roll">
            <Hash size={14} /> University Roll No <span className="req">*</span>
          </label>
          <input
            id="reg-roll"
            name="rollNo"
            type="text"
            className={`form-input ${errors.rollNo ? 'has-error' : ''}`}
            placeholder="e.g. CS2021001"
            value={formData.rollNo}
            onChange={handleChange}
          />
          {errors.rollNo && <span className="form-error-msg">{errors.rollNo}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reg-dept">
            <BookOpen size={14} /> Department <span className="req">*</span>
          </label>
          <input
            id="reg-dept"
            name="department"
            type="text"
            className={`form-input ${errors.department ? 'has-error' : ''}`}
            placeholder="e.g. Computer Science"
            value={formData.department}
            onChange={handleChange}
          />
          {errors.department && <span className="form-error-msg">{errors.department}</span>}
        </div>
      </div>

      {/* Row: Semester & Contact Phone */}
      <div className="form-row-2">
        <div className="form-group">
          <label className="form-label" htmlFor="reg-sem">
            Semester
          </label>
          <select
            id="reg-sem"
            name="semester"
            className="form-select"
            value={formData.semester}
            onChange={handleChange}
          >
            <option value="1st">1st Semester</option>
            <option value="2nd">2nd Semester</option>
            <option value="3rd">3rd Semester</option>
            <option value="4th">4th Semester</option>
            <option value="5th">5th Semester</option>
            <option value="6th">6th Semester</option>
            <option value="7th">7th Semester</option>
            <option value="8th">8th Semester</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reg-phone">
            <Phone size={14} /> Mobile Contact <span className="req">*</span>
          </label>
          <input
            id="reg-phone"
            name="phone"
            type="tel"
            maxLength={10}
            className={`form-input ${errors.phone ? 'has-error' : ''}`}
            placeholder="10-digit mobile number"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <span className="form-error-msg">{errors.phone}</span>}
        </div>
      </div>

      {/* Special Requests / Motivation (Optional) */}
      <div className="form-group">
        <label className="form-label" htmlFor="reg-notes">
          <MessageSquare size={14} /> Dietary / Accommodation / Motivation (Optional)
        </label>
        <textarea
          id="reg-notes"
          name="notes"
          rows={3}
          className="form-textarea"
          placeholder="Mention team name, dietary preferences, or questions for speakers..."
          value={formData.notes}
          onChange={handleChange}
        />
      </div>

      {/* Terms & Guidelines Checkbox */}
      <div className="form-group form-checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
          />
          <span>
            I agree to adhere to the UNIVO Code of Conduct and attend the scheduled event sessions
            punctually.
          </span>
        </label>
        {errors.agreeTerms && <span className="form-error-msg">{errors.agreeTerms}</span>}
      </div>

      {/* Modal Actions */}
      <div className="registration-modal-actions">
        <button type="button" className="reg-btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="reg-btn-primary">
          Review & Submit
        </button>
      </div>
    </form>
  );
};

export default EventRegistrationForm;
