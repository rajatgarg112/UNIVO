import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import './Toast.css';

/**
 * Toast
 * Lightweight floating alert notification.
 *
 * Props:
 * - message: string (text to display; if empty/null, component renders null)
 * - type: 'success' | 'error' | 'info' (determines icon and badge color)
 * - onClose: function (callback triggered when close button is clicked)
 */
function Toast({ message, type = 'info', onClose }) {
  if (!message) return null;

  const renderIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} className="hostel-toast-icon hostel-toast-icon-success" />;
      case 'error':
        return <AlertCircle size={18} className="hostel-toast-icon hostel-toast-icon-error" />;
      case 'info':
      default:
        return <Info size={18} className="hostel-toast-icon hostel-toast-icon-info" />;
    }
  };

  return (
    <div className={`hostel-toast hostel-toast-${type}`} role="alert" aria-live="assertive">
      <div className="hostel-toast-content">
        {renderIcon()}
        <span className="hostel-toast-message">{message}</span>
      </div>
      {typeof onClose === 'function' && (
        <button
          type="button"
          className="hostel-toast-close"
          onClick={onClose}
          aria-label="Dismiss notification"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}

export default Toast;
