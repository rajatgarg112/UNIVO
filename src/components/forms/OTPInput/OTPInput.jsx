import React, { useRef } from 'react';
import './OTPInput.css';

const OTPInput = ({ value = ['', '', '', '', '', ''], onChange, error }) => {
  const inputRefs = useRef([]);

  const focusInput = (index) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].focus();
      inputRefs.current[index].select();
    }
  };

  const handleChange = (e, index) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const newValue = [...value];
    newValue[index] = char;
    onChange(newValue);
    if (char && index < 5) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (value[index]) {
        const newValue = [...value];
        newValue[index] = '';
        onChange(newValue);
      } else if (index > 0) {
        focusInput(index - 1);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1);
    } else if (e.key === 'ArrowRight' && index < 5) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newValue = [...value];
    pasted.split('').forEach((char, i) => {
      if (i < 6) newValue[i] = char;
    });
    onChange(newValue);
    const nextEmpty = newValue.findIndex((v) => v === '');
    focusInput(nextEmpty === -1 ? 5 : nextEmpty);
  };

  return (
    <div>
      <div className={`otp-container${error ? ' otp-error' : ''}`}>
        {value.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className={`otp-input${digit ? ' otp-filled' : ''}`}
            aria-label={`OTP digit ${index + 1}`}
          />
        ))}
      </div>
      {error && <p className="otp-error-text">{error}</p>}
    </div>
  );
};

export default OTPInput;
