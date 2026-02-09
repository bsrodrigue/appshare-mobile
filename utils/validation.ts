const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+\d{1,3}\d+$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

export type FormatValidationOK = {
  ok: boolean;
  err?: string;
};

export const validateEmail = (email: string): FormatValidationOK => {
  if (!email.trim()) {
    return { ok: false, err: 'Email is required' };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { ok: false, err: 'Please enter a valid email address' };
  }
  return { ok: true };
};

export const validatePassword = (password: string): FormatValidationOK => {
  if (!password.trim()) {
    return { ok: false, err: 'Password is required' };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { ok: false, err: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` };
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return { ok: false, err: 'Password is too long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { ok: false, err: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { ok: false, err: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { ok: false, err: 'Password must contain at least one number' };
  }
  return { ok: true };
};

export function validatePhoneFormat(phone: string): FormatValidationOK {
  if (!phone.trim()) {
    return { ok: false, err: 'Phone number is required' };
  }
  if (!PHONE_REGEX.test(phone)) {
    return { ok: false, err: `The number must be in format +{countrycode}{number}, current value: ${phone}` };
  }
  return { ok: true };
} 