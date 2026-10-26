import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import './Toast.css';

/**
 * Reusable UI Toast Component
 * Displays temporary floating alert notifications with auto-dismiss.
 *
 * Props:
 * - toast: { message: string, type?: 'success' | 'error' | 'info' | 'warning' } | null
 * - onClose: () => void
 * - duration?: number (milliseconds, default 3500)
 */
const Toast = ({ toast, onClose, duration = 3500 }) => {
  useEffect(() => {
    if (!toast || !onClose) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [toast, onClose, duration]);

  if (!toast || !toast.message) return null;

  const type = toast.type || 'info';

  const renderIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} className="ui-toast-icon success" />;
      case 'error':
        return <AlertCircle size={18} className="ui-toast-icon error" />;
      case 'warning':
        return <AlertTriangle size={18} className="ui-toast-icon warning" />;
      case 'info':
      default:
        return <Info size={18} className="ui-toast-icon info" />;
    }
  };

  return (
    <div className={`ui-toast-container ${type}`} role="alert" aria-live="polite">
      <div className="ui-toast-content">
        {renderIcon()}
        <span className="ui-toast-message">{toast.message}</span>
      </div>
      {typeof onClose === 'function' && (
        <button
          type="button"
          className="ui-toast-close"
          onClick={onClose}
          aria-label="Close notification"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
};

export default Toast;
