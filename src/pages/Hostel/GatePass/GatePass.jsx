import React, { useState, useEffect, useMemo } from 'react';
import {
  Ticket,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Trash2,
} from 'lucide-react';
import Modal from '../../../components/ui/Modal/Modal';
import FormInput from '../../../components/forms/FormInput/FormInput';
import Toast from '../components/Toast';
import HostelStatCard from '../components/HostelStatCard';
import useLocalStorage from '../../../hooks/useLocalStorage';
import './GatePass.css';

const STORAGE_KEY = 'univo_hostel_gate_passes';

/**
 * Initial empty state for the gate pass application form (Destination removed)
 */
const INITIAL_FORM_STATE = {
  passType: 'Day Out',
  leavingTime: '',
  returnTime: '',
  reason: '',
};

/**
 * Sample gate pass records without destination field (for initial display and fallback)
 */
const INITIAL_GATE_PASSES = [
  {
    id: 'gp-001',
    passType: 'Day Out',
    leavingTime: '2026-10-17T10:00',
    returnTime: '2026-10-17T19:00',
    reason: 'Purchase reference books and project stationery',
    status: 'Approved',
  },
  {
    id: 'gp-002',
    passType: 'Night Out',
    leavingTime: '2026-10-24T17:00',
    returnTime: '2026-10-27T08:00',
    reason: 'Attending family wedding with parental permission',
    status: 'Pending',
  },
  {
    id: 'gp-003',
    passType: 'Day Out',
    leavingTime: '2026-10-15T14:00',
    returnTime: '2026-10-15T19:00',
    reason: 'Routine health checkup and medicine refill',
    status: 'Approved',
  },
  {
    id: 'gp-004',
    passType: 'Night Out',
    leavingTime: '2026-10-10T20:00',
    returnTime: '2026-10-11T09:00',
    reason: 'Late evening peer study session at university center',
    status: 'Rejected',
  },
];

/**
 * Helper to format date-time strings into a clean readable format (e.g. 17 Oct 2026, 07:00 PM)
 */
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return 'N/A';
  try {
    const date = new Date(dateTimeStr);
    if (isNaN(date.getTime())) return dateTimeStr;
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return dateTimeStr;
  }
};

/**
 * ApplyGatePassModal Component
 * Controlled form modal for creating student gate pass requests with conditional
 * Day Out and Night Out fields and validation.
 */
function ApplyGatePassModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});

  // Reset form fields and clear errors whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(INITIAL_FORM_STATE);
      setErrors({});
    }
  }, [isOpen]);

  // Handle pass type switching and auto-calculate return time or clear errors
  const handlePassTypeChange = (e) => {
    const newPassType = e.target.value;

    setFormData((prev) => {
      let updatedReturnTime = prev.returnTime;

      if (newPassType === 'Day Out') {
        // Automatically set return time to 7:00 PM on the leaving date if leaving date is set
        if (prev.leavingTime && prev.leavingTime.includes('T')) {
          const datePart = prev.leavingTime.split('T')[0];
          updatedReturnTime = `${datePart}T19:00`;
        } else {
          updatedReturnTime = '';
        }
      } else {
        // Switching to Night Out: clear auto-assigned return time so student enters exact return date & time
        updatedReturnTime = '';
      }

      return {
        ...prev,
        passType: newPassType,
        returnTime: updatedReturnTime,
      };
    });

    // Clear obsolete validation errors when switching pass types
    setErrors((prev) => {
      const nextErrors = { ...prev };
      delete nextErrors.passType;
      delete nextErrors.leavingTime;
      delete nextErrors.returnTime;
      return nextErrors;
    });
  };

  // Handle leaving date/time changes with Day Out automatic 7:00 PM return calculation
  const handleLeavingTimeChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => {
      let updatedReturnTime = prev.returnTime;

      if (prev.passType === 'Day Out') {
        if (value && value.includes('T')) {
          const datePart = value.split('T')[0];
          updatedReturnTime = `${datePart}T19:00`;
        } else {
          updatedReturnTime = '';
        }
      }

      return {
        ...prev,
        leavingTime: value,
        returnTime: updatedReturnTime,
      };
    });

    // Clear timing-related errors on change
    if (errors.leavingTime || errors.returnTime) {
      setErrors((prev) => ({
        ...prev,
        leavingTime: '',
        returnTime: '',
      }));
    }
  };

  // Generic controlled input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Validate form fields based on Pass Type rules
  const validate = () => {
    const newErrors = {};

    // 1. Pass Type is required
    if (!formData.passType) {
      newErrors.passType = 'Please select a pass type.';
    }

    // 2. Leaving Date & Time is required
    if (!formData.leavingTime) {
      newErrors.leavingTime = 'Leaving date and time is required.';
    } else {
      const leavingDate = new Date(formData.leavingTime);
      const leavingHours = leavingDate.getHours();
      const leavingMinutes = leavingDate.getMinutes();

      // For Day Out: must leave before 7:00 PM (19:00)
      if (formData.passType === 'Day Out') {
        if (leavingHours > 19 || (leavingHours === 19 && leavingMinutes >= 0)) {
          newErrors.leavingTime = 'Leaving time must be before 7:00 PM for Day Out passes. Please choose an earlier time.';
        }
      }
    }

    // 3. Night Out: Expected Return Date & Time is required and must be after leaving time
    if (formData.passType === 'Night Out') {
      if (!formData.returnTime) {
        newErrors.returnTime = 'Expected return date and time is required.';
      } else if (formData.leavingTime) {
        const leavingMs = new Date(formData.leavingTime).getTime();
        const returnMs = new Date(formData.returnTime).getTime();

        if (returnMs <= leavingMs) {
          newErrors.returnTime = 'Expected return date/time must be after leaving date/time.';
        }
      }
    }

    // 4. Reason / Purpose is required (minimum 5 characters)
    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason / purpose is required.';
    } else if (formData.reason.trim().length < 5) {
      newErrors.reason = 'Reason must be at least 5 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Ensure Day Out always stores 7:00 PM on the leaving date as return time
    let finalReturnTime = formData.returnTime;
    if (formData.passType === 'Day Out' && formData.leavingTime) {
      const datePart = formData.leavingTime.split('T')[0];
      finalReturnTime = `${datePart}T19:00`;
    }

    onSubmit({
      passType: formData.passType,
      leavingTime: formData.leavingTime,
      returnTime: finalReturnTime,
      reason: formData.reason.trim(),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply for Gate Pass"
      size="md"
      className="gate-pass-modal-window"
    >
      <form onSubmit={handleSubmit} className="gate-pass-modal-form" noValidate>
        {/* Pass Type Selection */}
        <div className="form-group gate-pass-form-group">
          <label htmlFor="gatepass-type-select" className="form-label">
            Pass Type <span className="form-required">*</span>
          </label>
          <select
            id="gatepass-type-select"
            name="passType"
            value={formData.passType}
            onChange={handlePassTypeChange}
            className={`gate-pass-form-select ${errors.passType ? 'error' : ''}`}
          >
            <option value="Day Out">Day Out (Same-day outing)</option>
            <option value="Night Out">Night Out (Overnight / Weekend)</option>
          </select>
          {errors.passType && (
            <div className="form-error" role="alert">
              <AlertCircle size={12} />
              <span>{errors.passType}</span>
            </div>
          )}
        </div>

        {/* Conditional Information Box */}
        {formData.passType === 'Day Out' ? (
          <div className="gate-pass-info-box gate-pass-info-day">
            <div className="gate-pass-info-header">
              <Clock size={16} className="gate-pass-info-icon" />
              <span className="gate-pass-info-title">Day Out Pass</span>
            </div>
            <p className="gate-pass-info-text">
              Return time will be on the same day. Expected return is automatically set to <strong>7:00 PM</strong>.
            </p>
          </div>
        ) : (
          <div className="gate-pass-info-box gate-pass-info-night">
            <div className="gate-pass-info-header">
              <Calendar size={16} className="gate-pass-info-icon" />
              <span className="gate-pass-info-title">Night Out Pass</span>
            </div>
            <p className="gate-pass-info-text">
              Night Out is for overnight or weekend stays. Please specify both your leaving and expected return date & time.
            </p>
          </div>
        )}

        {/* Timings Section */}
        {formData.passType === 'Day Out' ? (
          /* Day Out: Single Leaving Date & Time */
          <div className="gate-pass-form-group">
            <FormInput
              id="gatepass-leaving-time"
              name="leavingTime"
              type="datetime-local"
              label="Leaving Date & Time"
              value={formData.leavingTime}
              onChange={handleLeavingTimeChange}
              error={errors.leavingTime}
              required
            />
          </div>
        ) : (
          /* Night Out: Leaving and Expected Return in 2 columns */
          <div className="gate-pass-form-row">
            <FormInput
              id="gatepass-leaving-time"
              name="leavingTime"
              type="datetime-local"
              label="Leaving Date & Time"
              value={formData.leavingTime}
              onChange={handleLeavingTimeChange}
              error={errors.leavingTime}
              required
            />

            <FormInput
              id="gatepass-return-time"
              name="returnTime"
              type="datetime-local"
              label="Expected Return Date & Time"
              value={formData.returnTime}
              onChange={handleChange}
              error={errors.returnTime}
              required
            />
          </div>
        )}

        {/* Reason / Purpose (Below Timings Section) */}
        <div className="form-group gate-pass-form-group">
          <label htmlFor="gatepass-reason" className="form-label">
            Reason / Purpose <span className="form-required">*</span>
          </label>
          <textarea
            id="gatepass-reason"
            name="reason"
            rows={3}
            value={formData.reason}
            onChange={handleChange}
            placeholder="Explain the purpose of your outing..."
            className={`gate-pass-form-textarea ${errors.reason ? 'error' : ''}`}
          />
          {errors.reason && (
            <div className="form-error" role="alert">
              <AlertCircle size={12} />
              <span>{errors.reason}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="gate-pass-modal-actions">
          <button
            type="button"
            className="gate-pass-btn-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button type="submit" className="gate-pass-btn-submit">
            Submit Request
          </button>
        </div>
      </form>
    </Modal>
  );
}

/**
 * GatePass Page Component
 * Allows hostel residents to view gate pass history, dynamic statistics, and apply for outings
 * with persistent LocalStorage integration.
 */
function GatePass() {
  // ── Dynamic Gate Pass State with useLocalStorage Custom Hook ──
  const [gatePasses, setGatePasses] = useLocalStorage(
    STORAGE_KEY,
    INITIAL_GATE_PASSES
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Auto-dismiss toast notification after 4 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // ── Dynamic Statistics Calculation ──
  const stats = useMemo(() => {
    return {
      total: gatePasses.length,
      pending: gatePasses.filter((p) => p.status === 'Pending').length,
      approved: gatePasses.filter((p) => p.status === 'Approved').length,
      rejected: gatePasses.filter((p) => p.status === 'Rejected').length,
    };
  }, [gatePasses]);

  // Modal open and close handlers
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle form submission: prepend new pass, close modal, and display success toast
  const handleFormSubmit = (formData) => {
    const newPass = {
      id: `gp-${Date.now()}`,
      passType: formData.passType,
      leavingTime: formData.leavingTime,
      returnTime: formData.returnTime,
      reason: formData.reason,
      status: 'Pending',
    };

    setGatePasses((prev) => [newPass, ...prev]);
    setIsModalOpen(false);
    setToast({
      message: `Your ${formData.passType} gate pass request has been submitted and is awaiting warden review.`,
      type: 'success',
    });
  };

  // Cancel pending gate pass request
  const handleCancelPass = (id) => {
    const isConfirmed = window.confirm(
      'Are you sure you want to cancel this pending gate pass request?'
    );

    if (isConfirmed) {
      setGatePasses((prev) => prev.filter((p) => p.id !== id));
      setToast({
        message: 'Gate pass request cancelled successfully.',
        type: 'info',
      });
    }
  };

  // Helper for status badge CSS classes
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return {
          className: 'gate-pass-status-approved',
          icon: <CheckCircle2 size={13} />,
        };
      case 'Rejected':
        return {
          className: 'gate-pass-status-rejected',
          icon: <XCircle size={13} />,
        };
      case 'Pending':
      default:
        return {
          className: 'gate-pass-status-pending',
          icon: <AlertCircle size={13} />,
        };
    }
  };

  return (
    <div className="gate-pass-page">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Apply Gate Pass Modal */}
      <ApplyGatePassModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
      />

      {/* ── Page Header ── */}
      <div className="gate-pass-header">
        <div className="gate-pass-header-left">
          <div className="gate-pass-header-icon-box">
            <Ticket size={28} className="gate-pass-header-icon" />
          </div>
          <div className="gate-pass-header-text">
            <h1 className="gate-pass-title">Gate Pass Management</h1>
            <p className="gate-pass-subtitle">
              Apply for an outing and track your gate pass requests.
            </p>
          </div>
        </div>

        {/* Apply Gate Pass Button */}
        <button
          type="button"
          className="gate-pass-apply-btn"
          onClick={handleOpenModal}
        >
          <Plus size={18} />
          Apply Gate Pass
        </button>
      </div>

      {/* ── Dynamic Statistics Cards Grid ── */}
      <div className="gate-pass-stats-grid">
        <HostelStatCard
          title="Total Passes"
          value={stats.total}
          description="Logged outing requests"
        />
        <HostelStatCard
          title="Pending"
          value={stats.pending}
          description="Awaiting warden review"
        />
        <HostelStatCard
          title="Approved"
          value={stats.approved}
          description="Approved gate passes"
        />
        <HostelStatCard
          title="Rejected"
          value={stats.rejected}
          description="Declined applications"
        />
      </div>

      {/* ── Gate Pass History Section ── */}
      <div className="gate-pass-section">
        <div className="gate-pass-section-header">
          <div>
            <h2 className="gate-pass-section-title">Gate Pass History</h2>
            <p className="gate-pass-section-subtitle">
              Recent outing applications and warden approval statuses.
            </p>
          </div>
          <span className="gate-pass-badge-count">
            Showing {gatePasses.length} Outing Requests
          </span>
        </div>

        {/* Gate Pass Cards List or Empty State */}
        {gatePasses.length > 0 ? (
          <div className="gate-pass-list">
            {gatePasses.map((pass) => {
              const statusInfo = getStatusBadge(pass.status);
              const isNightOut = pass.passType === 'Night Out';

              return (
                <div key={pass.id} className="gate-pass-card">
                  {/* Card Header: Type Pill & Status Badge */}
                  <div className="gate-pass-card-header">
                    <span className={`gate-pass-type-pill ${isNightOut ? 'night-out' : 'day-out'}`}>
                      {pass.passType}
                    </span>

                    <span className={`gate-pass-status-badge ${statusInfo.className}`}>
                      {statusInfo.icon}
                      {pass.status}
                    </span>
                  </div>

                  {/* Card Body: Reason / Purpose (Destination completely removed) */}
                  <div className="gate-pass-card-body">
                    <div className="gate-pass-reason-wrapper">
                      <span className="gate-pass-reason-label">Purpose / Reason</span>
                      <p className="gate-pass-reason">{pass.reason}</p>
                    </div>
                  </div>

                  {/* Timing Details Grid */}
                  <div className="gate-pass-timings">
                    <div className="gate-pass-time-col">
                      <span className="gate-pass-time-label">
                        <Clock size={12} /> Leaving
                      </span>
                      <span className="gate-pass-time-value">{formatDateTime(pass.leavingTime)}</span>
                    </div>

                    <div className="gate-pass-time-col">
                      <span className="gate-pass-time-label">
                        <Calendar size={12} /> Expected Return
                      </span>
                      <span className="gate-pass-time-value">{formatDateTime(pass.returnTime)}</span>
                    </div>
                  </div>

                  {/* Cancel Action: Visible ONLY for Pending requests */}
                  {pass.status === 'Pending' && (
                    <div className="gate-pass-card-footer">
                      <button
                        type="button"
                        className="gate-pass-cancel-btn"
                        onClick={() => handleCancelPass(pass.id)}
                        title="Cancel this pending gate pass request"
                      >
                        <Trash2 size={13} />
                        Cancel Request
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="gate-pass-empty-state">
            <Ticket size={40} className="gate-pass-empty-icon" />
            <h3 className="gate-pass-empty-title">No Gate Passes Found</h3>
            <p className="gate-pass-empty-text">
              You have not submitted any gate pass requests yet. Click below to apply for an outing.
            </p>
            <button
              type="button"
              className="gate-pass-apply-btn"
              onClick={handleOpenModal}
            >
              <Plus size={16} />
              Apply Gate Pass
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GatePass;
