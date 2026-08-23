import React from 'react';
import { AlertCircle } from 'lucide-react';
import './FormInput.css';

const FormInput = ({
  label,
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  icon,
  helpText,
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
      <div className="form-input-wrapper">
        {icon && (
          <span className="form-input-icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`form-input${icon ? ' form-input-with-icon' : ''}${error ? ' error' : ''}${disabled ? ' disabled' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
        />
      </div>
      {error && (
        <div id={`${id}-error`} className="form-error" role="alert">
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}
      {helpText && !error && (
        <p id={`${id}-help`} className="form-help">{helpText}</p>
      )}
    </div>
  );
};

export default FormInput;
