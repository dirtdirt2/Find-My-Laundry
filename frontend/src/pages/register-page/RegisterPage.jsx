import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Mail,
  ShieldCheck,
  WashingMachine,
} from 'lucide-react';
import {
  maskEmailAddress,
  normalizeOtp,
  validateRegistrationForm,
} from './RegisterPage.js';
import { registerAccount, resendEmailOtp, verifyEmailOtp } from '../../services/api.js';
import './RegisterPage.css';

const INITIAL_FORM_VALUES = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptedTerms: false,
};

function FormField({ id, label, type = 'text', value, onChange, placeholder, autoComplete, error, trailing }) {
  return (
    <div className="register-field">
      <label className="register-field__label" htmlFor={id}>
        {label}
      </label>
      <div className={`register-field__control ${error ? 'register-field__control--error' : ''}`}>
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          required
        />
        {trailing}
      </div>
      {error && (
        <p className="register-field__error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default function RegisterPage() {
  const [formValues, setFormValues] = useState(INITIAL_FORM_VALUES);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [stage, setStage] = useState('register');
  const [otp, setOtp] = useState('');
  const [otpMessage, setOtpMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [requestError, setRequestError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field) => (event) => {
    const value = field === 'acceptedTerms'
      ? event.target.checked
      : event.target.value;

    setFormValues((currentValues) => ({ ...currentValues, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: '' }));
  };

  const handleRegistrationSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateRegistrationForm(formValues);
    setErrors(validationErrors);
    setRequestError('');

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    setOtp('');
    setOtpMessage('');

    try {
      const response = await registerAccount({
        fullName: formValues.fullName.trim(),
        email: formValues.email.trim(),
        password: formValues.password,
        acceptedTerms: formValues.acceptedTerms,
      });
      setOtpMessage(response.message || 'Registration details saved. Check the backend terminal for your local OTP.');
      setStage('verify');
    } catch (error) {
      setRequestError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();

    if (otp.length !== 6) {
      setOtpMessage('Enter the complete 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    setOtpMessage('');
    try {
      const response = await verifyEmailOtp(formValues.email.trim(), otp);
      setSuccessMessage(response.message || 'Your email has been verified.');
      setStage('success');
    } catch (error) {
      setOtpMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpMessage('');
    setIsSubmitting(true);
    try {
      const response = await resendEmailOtp(formValues.email.trim());
      setOtpMessage(response.message || 'A new verification code was generated. Check the backend terminal.');
    } catch (error) {
      setOtpMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const returnToRegistration = () => {
    setStage('register');
    setOtp('');
    setOtpMessage('');
  };

  return (
    <main className="register-page">
      <div className="register-page__scroll-area">
        <header className="register-brand">
          <div className="register-brand__mark" aria-hidden="true">
            <WashingMachine size={22} strokeWidth={2.2} />
          </div>
          <span>Find My Laundry</span>
        </header>

        {stage === 'register' ? (
          <>
            <div className="register-intro">
              <span className="register-eyebrow">YOUR LAUNDRY, MADE EASIER</span>
              <h1>Create your account</h1>
              <p>Join Find My Laundry and discover laundry services around you.</p>
            </div>

            {requestError && <p className="register-otp-message" role="alert">{requestError}</p>}

            <form className="register-form" onSubmit={handleRegistrationSubmit} noValidate>
              <FormField
                id="fullName"
                label="Full name"
                value={formValues.fullName}
                onChange={updateField('fullName')}
                placeholder="Enter your full name"
                autoComplete="name"
                error={errors.fullName}
              />

              <FormField
                id="email"
                label="Email address"
                type="email"
                value={formValues.email}
                onChange={updateField('email')}
                placeholder="you@example.com"
                autoComplete="email"
                error={errors.email}
              />

              <FormField
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formValues.password}
                onChange={updateField('password')}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                error={errors.password}
                trailing={(
                  <button
                    className="register-field__visibility"
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                )}
              />

              <FormField
                id="confirmPassword"
                label="Confirm password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formValues.confirmPassword}
                onChange={updateField('confirmPassword')}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                error={errors.confirmPassword}
                trailing={(
                  <button
                    className="register-field__visibility"
                    type="button"
                    onClick={() => setShowConfirmPassword((visible) => !visible)}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                )}
              />

              <div className="register-terms">
                <label className="register-terms__label" htmlFor="acceptedTerms">
                  <input
                    id="acceptedTerms"
                    name="acceptedTerms"
                    type="checkbox"
                    checked={formValues.acceptedTerms}
                    onChange={updateField('acceptedTerms')}
                    aria-invalid={Boolean(errors.acceptedTerms)}
                  />
                  <span>
                    I agree to the <span className="register-inline-link">Terms of Service</span> and{' '}
                    <span className="register-inline-link">Privacy Policy</span>.
                  </span>
                </label>
                {errors.acceptedTerms && (
                  <p className="register-field__error" role="alert">{errors.acceptedTerms}</p>
                )}
              </div>

              <button className="register-primary-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account...' : 'Continue to email verification'}
                <ArrowRight size={18} />
              </button>
            </form>

            <p className="register-login-prompt">
              Already have an account? <a href="/login">Log in</a>
            </p>
          </>
        ) : stage === 'verify' ? (
          <section className="register-verify" aria-labelledby="verify-heading">
            <button className="register-back-button" type="button" onClick={returnToRegistration}>
              <ArrowLeft size={17} />
              Back to registration
            </button>

            <div className="register-verify__icon" aria-hidden="true">
              <Mail size={27} />
            </div>
            <span className="register-eyebrow">ONE MORE STEP</span>
            <h1 id="verify-heading">Verify your email</h1>
            <p className="register-verify__description">
              Enter the 6-digit verification code generated for
              <strong> {maskEmailAddress(formValues.email)}</strong>.
            </p>

            <form className="register-otp-form" onSubmit={handleOtpSubmit}>
              <label className="register-field__label" htmlFor="otp-code">
                Verification code
              </label>
              <input
                id="otp-code"
                className="register-otp-input"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                value={otp}
                onChange={(event) => {
                  setOtp(normalizeOtp(event.target.value));
                  setOtpMessage('');
                }}
                placeholder="• • • • • •"
                aria-describedby="otp-help"
              />
              <p className="register-otp-help" id="otp-help">
                Enter the 6-digit code sent to your email address.
              </p>

              {otpMessage && <p className="register-otp-message" role="status">{otpMessage}</p>}

              <button className="register-primary-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Verifying...' : 'Verify email'}
                <ArrowRight size={18} />
              </button>
            </form>

            <button className="register-resend-button" type="button" onClick={handleResendOtp} disabled={isSubmitting}>
              Didn't receive a code? <span>Resend code</span>
            </button>

            <div className="register-backend-note">
              <ShieldCheck size={18} />
              <p>
                <strong>Local development:</strong> the OTP is printed in the backend terminal.
                Actual email delivery must be configured before production registration is enabled.
              </p>
            </div>
          </section>
        ) : (
          <section className="register-verify register-success" aria-labelledby="success-heading">
            <div className="register-verify__icon register-success__icon" aria-hidden="true">
              <CheckCircle2 size={29} />
            </div>
            <span className="register-eyebrow">EMAIL VERIFIED</span>
            <h1 id="success-heading">You're all set!</h1>
            <p className="register-verify__description">{successMessage}</p>
            <a className="register-primary-button register-success__link" href="/login">Continue to login</a>
          </section>
        )}

        <footer className="register-footer">
          <CheckCircle2 size={14} />
          <span>Your laundry search starts here.</span>
        </footer>
      </div>
    </main>
  );
}
