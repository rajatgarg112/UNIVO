/**
 * validators.js – Form validation utilities for UniversityVerse
 */

/**
 * validateEmail('user@example.com') → true
 */
export function validateEmail(email) {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).trim().toLowerCase());
}

/**
 * validatePassword('MyPass123!') → { isValid: true, errors: [] }
 * Rules: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
 */
export function validatePassword(password) {
  const errors = [];
  if (!password) {
    return { isValid: false, errors: ['Password is required.'] };
  }
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters.');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter.');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter.');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number.');
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Password must contain at least one special character.');
  }
  return { isValid: errors.length === 0, errors };
}

/**
 * validatePhone('9876543210') → true
 * Accepts 10-digit Indian numbers, with or without +91 prefix
 */
export function validatePhone(phone) {
  if (!phone) return false;
  const digits = String(phone).replace(/\D/g, '');
  // Accept 10 digits or 12 digits starting with 91
  return digits.length === 10 || (digits.length === 12 && digits.startsWith('91'));
}

/**
 * validateRequired('', 'Name') → 'Name is required.'
 * validateRequired('Aryan', 'Name') → null
 */
export function validateRequired(value, fieldName) {
  if (value === null || value === undefined || String(value).trim() === '') {
    return `${fieldName} is required.`;
  }
  return null;
}

/**
 * validateMinLength('Hi', 5, 'Username') → 'Username must be at least 5 characters.'
 */
export function validateMinLength(value, min, fieldName) {
  if (!value || String(value).trim().length < min) {
    return `${fieldName} must be at least ${min} characters.`;
  }
  return null;
}

/**
 * validateMaxLength('VeryLongName...', 20, 'Username') → 'Username cannot exceed 20 characters.'
 */
export function validateMaxLength(value, max, fieldName) {
  if (value && String(value).trim().length > max) {
    return `${fieldName} cannot exceed ${max} characters.`;
  }
  return null;
}

/**
 * validateOTP('123456') → true
 * validateOTP('12345')  → false (must be exactly 6 digits)
 */
export function validateOTP(otp) {
  if (!otp) return false;
  return /^\d{6}$/.test(String(otp).trim());
}

/**
 * validateForm(fields, rules) → { isValid: boolean, errors: {} }
 *
 * fields = { email: 'user@example.com', password: 'abc' }
 * rules  = {
 *   email:    [{ type: 'required' }, { type: 'email' }],
 *   password: [{ type: 'required' }, { type: 'minLength', value: 8 }],
 * }
 */
export function validateForm(fields, rules) {
  const errors = {};

  for (const [fieldName, fieldRules] of Object.entries(rules)) {
    const value = fields[fieldName];
    let fieldError = null;

    for (const rule of fieldRules) {
      switch (rule.type) {
        case 'required':
          fieldError = validateRequired(value, rule.label || fieldName);
          break;
        case 'email':
          if (value && !validateEmail(value)) {
            fieldError = rule.message || 'Please enter a valid email address.';
          }
          break;
        case 'phone':
          if (value && !validatePhone(value)) {
            fieldError = rule.message || 'Please enter a valid phone number.';
          }
          break;
        case 'minLength':
          fieldError = validateMinLength(value, rule.value, rule.label || fieldName);
          break;
        case 'maxLength':
          fieldError = validateMaxLength(value, rule.value, rule.label || fieldName);
          break;
        case 'otp':
          if (!validateOTP(value)) {
            fieldError = rule.message || 'OTP must be exactly 6 digits.';
          }
          break;
        case 'password':
          const { isValid, errors: pwErrors } = validatePassword(value);
          if (!isValid) fieldError = pwErrors[0];
          break;
        case 'match':
          if (value !== fields[rule.matchField]) {
            fieldError = rule.message || `${rule.label || fieldName} does not match.`;
          }
          break;
        default:
          break;
      }
      if (fieldError) break; // Stop at first error per field
    }

    if (fieldError) {
      errors[fieldName] = fieldError;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
