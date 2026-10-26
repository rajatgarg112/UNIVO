import React, { useState, useEffect, useRef } from 'react';
import Modal from '../../../components/ui/Modal/Modal';
import FormInput from '../../../components/forms/FormInput/FormInput';
import { AlertCircle } from 'lucide-react';
import './ComplaintModal.css';

const CATEGORIES = [
  'Electrical',
  'Plumbing',
  'Furniture',
  'Internet',
  'Cleanliness',
];

const PRIORITIES = ['Low', 'Medium', 'High'];

const INITIAL_FORM_STATE = {
  title: '',
  category: 'Electrical',
  roomNumber: '',
  priority: 'Medium',
  description: '',
};

/**
 * ComplaintModal
 * Controlled form modal for creating or editing hostel complaints.
 *
 * Props:
 * - isOpen: boolean (controls visibility)
 * - onClose: function (invoked to close modal)
 * - onSubmit: function (receives form data upon valid submission)
 * - complaintToEdit: object | null (pre-fills form if editing existing item)
 */
function ComplaintModal({ isOpen, onClose, onSubmit, complaintToEdit }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});

  // Ref to directly access and focus the Complaint Title input DOM element
  const titleInputRef = useRef(null);

  // Reset form or populate with complaintToEdit when modal opens or complaintToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (complaintToEdit) {
        setFormData({
          title: complaintToEdit.title || '',
          category: complaintToEdit.category || 'Electrical',
          roomNumber: complaintToEdit.roomNumber || '',
          priority: complaintToEdit.priority || 'Medium',
          description: complaintToEdit.description || '',
        });
      } else {
        setFormData(INITIAL_FORM_STATE);
      }
      setErrors({});

      // Auto-focus the Complaint Title input when modal opens
      const timer = setTimeout(() => {
        if (titleInputRef.current) {
          titleInputRef.current.focus();
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [isOpen, complaintToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear inline error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Complaint title is required.';
    } else if (formData.title.trim().length < 4) {
      newErrors.title = 'Title must be at least 4 characters long.';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category.';
    }

    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = 'Room number is required (e.g. A-204).';
    }

    if (!formData.priority) {
      newErrors.priority = 'Please select a priority level.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please describe the issue.';
    } else if (formData.description.trim().length < 8) {
      newErrors.description = 'Description must be at least 8 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Call onSubmit passing updated or new complaint fields
    if (typeof onSubmit === 'function') {
      onSubmit({
        ...formData,
        id: complaintToEdit ? complaintToEdit.id : undefined,
        status: complaintToEdit ? complaintToEdit.status : 'Pending',
        date: complaintToEdit ? complaintToEdit.date : new Date().toISOString().split('T')[0],
      });
    }

    if (typeof onClose === 'function') {
      onClose();
    }
  };

  const modalTitle = complaintToEdit
    ? 'Edit Hostel Complaint'
    : 'Submit Hostel Complaint';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      size="md"
      className="hostel-complaint-modal-window"
    >
      <form onSubmit={handleSubmit} className="hostel-complaint-form" noValidate>
        {/* Title */}
        <FormInput
          id="hostel-complaint-title"
          name="title"
          label="Complaint Title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Ceiling Fan Regulator Malfunctioning"
          error={errors.title}
          required
          inputRef={titleInputRef}
        />

        {/* Category & Room Number in 2 columns */}
        <div className="hostel-form-row">
          <div className="form-group hostel-form-group">
            <label htmlFor="hostel-category-select" className="form-label">
              Category <span className="form-required">*</span>
            </label>
            <select
              id="hostel-category-select"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`hostel-form-select ${errors.category ? 'error' : ''}`}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <div className="form-error" role="alert">
                <AlertCircle size={12} />
                <span>{errors.category}</span>
              </div>
            )}
          </div>

          <FormInput
            id="hostel-room-number"
            name="roomNumber"
            label="Room Number"
            value={formData.roomNumber}
            onChange={handleChange}
            placeholder="e.g. A-204"
            error={errors.roomNumber}
            required
          />
        </div>

        {/* Priority */}
        <div className="form-group hostel-form-group">
          <label htmlFor="hostel-priority-select" className="form-label">
            Priority Level <span className="form-required">*</span>
          </label>
          <select
            id="hostel-priority-select"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className={`hostel-form-select ${errors.priority ? 'error' : ''}`}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p} Priority
              </option>
            ))}
          </select>
          {errors.priority && (
            <div className="form-error" role="alert">
              <AlertCircle size={12} />
              <span>{errors.priority}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="form-group hostel-form-group">
          <label htmlFor="hostel-description-textarea" className="form-label">
            Issue Description <span className="form-required">*</span>
          </label>
          <textarea
            id="hostel-description-textarea"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the complaint in detail..."
            className={`hostel-form-textarea ${errors.description ? 'error' : ''}`}
          />
          {errors.description && (
            <div className="form-error" role="alert">
              <AlertCircle size={12} />
              <span>{errors.description}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="hostel-modal-actions">
          <button
            type="button"
            className="hostel-btn-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button type="submit" className="hostel-btn-submit">
            {complaintToEdit ? 'Save Changes' : 'Submit Complaint'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default React.memo(ComplaintModal);
