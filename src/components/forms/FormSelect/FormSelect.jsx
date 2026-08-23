import React from 'react';
import { AlertCircle } from 'lucide-react';
import './FormSelect.css';

const FormSelect = ({
  label,
  id,
  name,
  value,
  onChange,
  options = [],
  error,
  required = false,
  placeholder = 'Select an option',
  disabled = false,
}) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}
      <div className="form-select-wrapper">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`form-select${error ? ' error' : ''}${disabled ? ' disabled' : ''}`}
          aria-invalid={!!error}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="form-select-arrow" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {error && (
        <div className="form-error" role="alert">
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FormSelect;
