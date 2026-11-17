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

  const updateField = (field) => (event) => {
    const value = field === 'acceptedTerms'
      ? event.target.checked
      : event.target.value;

    setFormValues((currentValues) => ({ ...currentValues, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: '' }));
  };

  const handleRegistrationSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateRegistrationForm(formValues);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Frontend preview only: no account is created and no email is sent here.
    setOtp('');
    setOtpMessage('');
    setStage('verify');
  };

  const handleOtpSubmit = (event) => {
    event.preventDefault();

    if (otp.length !== 6) {
      setOtpMessage('Enter the complete 6-digit verification code.');
      return;
    }

    setOtpMessage(
      'OTP verification is not connected yet. No code has been checked and your account has not been created.',
    );
  };

  const handleResendOtp = () => {
    setOtpMessage(
      'Email delivery is not connected yet, so a new verification code cannot be sent.',
    );
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

              <button className="register-primary-button" type="submit">
                Continue to email verification
                <ArrowRight size={18} />
              </button>
            </form>

            <p className="register-login-prompt">
              Already have an account? <a href="/login">Log in</a>
            </p>
          </>
        ) : (
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
              A 6-digit verification code will be sent to
              <strong> {maskEmailAddress(formValues.email)}</strong> once email delivery is connected.
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

              <button className="register-primary-button" type="submit">
                Verify email
                <ArrowRight size={18} />
              </button>
            </form>

            <button className="register-resend-button" type="button" onClick={handleResendOtp}>
              Didn't receive a code? <span>Resend code</span>
            </button>

            <div className="register-backend-note">
              <ShieldCheck size={18} />
              <p>
                <strong>Frontend preview:</strong> email sending and OTP validation will be connected
                when the backend is implemented. No email or account is created yet.
              </p>
            </div>
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
