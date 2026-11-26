export const MIN_PASSWORD_LENGTH = 8;

/**
 * Validate the values entered in the registration form
 *
 * @param {{ fullName: string, email: string, password: string, confirmPassword: string, acceptedTerms: boolean }} values
 * @returns {Record<string, string>} Field-specific validation errors.
 */
export function validateRegistrationForm(values) {
  const errors = {};
  const normalizedEmail = values.email.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!values.fullName.trim()) {
    errors.fullName = 'Please enter your full name.';
  } else if (values.fullName.trim().length < 2) {
    errors.fullName = 'Your name must contain at least 2 characters.';
  }

  if (!normalizedEmail) {
    errors.email = 'Please enter your email address.';
  } else if (!emailPattern.test(normalizedEmail)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!values.password) {
    errors.password = 'Please create a password.';
  } else if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Your password must contain at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Your passwords do not match.';
  }

  if (!values.acceptedTerms) {
    errors.acceptedTerms = 'Please accept the terms to continue.';
  }

  return errors;
}

/** Hide part of an email address when displaying it on the OTP screen */
export function maskEmailAddress(email) {
  const [localPart, domain] = email.trim().split('@');

  if (!localPart || !domain) {
    return email;
  }

  const visiblePart = localPart.length <= 2
    ? localPart[0]
    : localPart.slice(0, 2);

  return `${visiblePart}${'*'.repeat(Math.max(localPart.length - visiblePart.length, 3))}@${domain}`;
}

/** Keep only numeric characters and limit the OTP field to six digits */
export function normalizeOtp(value) {
  return value.replace(/\D/g, '').slice(0, 6);
}
