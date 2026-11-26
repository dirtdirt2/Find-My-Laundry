import { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react';
import {
  getProfileInitials,
  loadProfile,
  saveProfile,
  validateProfile,
} from './ProfilePage.js';
import './ProfilePage.css';

function ProfileField({ id, label, value, onChange, placeholder, icon: Icon, error, readOnly = false }) {
  return (
    <div className="profile-field">
      <label className="profile-field__label" htmlFor={id}>{label}</label>
      <div className={`profile-field__control ${error ? 'profile-field__control--error' : ''} ${readOnly ? 'profile-field__control--readonly' : ''}`}>
        <Icon className="profile-field__icon" size={17} aria-hidden="true" />
        <input
          id={id}
          name={id}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
      {error && <p className="profile-field__error" id={`${id}-error`} role="alert">{error}</p>}
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(() => loadProfile());
  const [draft, setDraft] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState('');
  const [noticeType, setNoticeType] = useState('success');

  const updateField = (field) => (event) => {
    setDraft((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: '' }));
    setNotice('');
  };

  const beginEditing = () => {
    setDraft({ ...profile });
    setErrors({});
    setNotice('');
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraft({ ...profile });
    setErrors({});
    setNotice('');
    setIsEditing(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateProfile(draft);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    const updatedProfile = {
      ...profile,
      fullName: draft.fullName.trim(),
      phoneNumber: draft.phoneNumber.trim(),
      location: draft.location.trim(),
    };

    setProfile(updatedProfile);
    setDraft(updatedProfile);
    setIsEditing(false);

    const stored = saveProfile(updatedProfile);
    setNoticeType(stored ? 'success' : 'warning');
    setNotice(
      stored
        ? 'Profile updated on this device. It is not synced to an account yet.'
        : 'Your changes are visible for this session, but this browser could not save them.',
    );
  };

  return (
    <main className="profile-page">
      <div className="profile-page__scroll-area">
        <header className="profile-page__header">
          <a className="profile-page__back" href="/" aria-label="Back to home">
            <ArrowLeft size={19} />
          </a>
          <h1>My Profile</h1>
          {!isEditing ? (
            <button className="profile-page__header-action" type="button" onClick={beginEditing} aria-label="Edit profile">
              <Pencil size={17} />
            </button>
          ) : (
            <span className="profile-page__header-spacer" aria-hidden="true" />
          )}
        </header>

        <section className="profile-hero" aria-label="Profile overview">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar" aria-label={`Profile initials ${getProfileInitials(profile.fullName)}`}>
              {getProfileInitials(profile.fullName)}
            </div>
          </div>
          <div className="profile-hero__name">{profile.fullName || 'Your Name'}</div>
          <div className="profile-hero__email">{profile.email}</div>
          <div className="profile-member-pill"><ShieldCheck size={13} /> Find My Laundry profile</div>
        </section>

        {notice && (
          <p className={`profile-notice profile-notice--${noticeType}`} role="status">
            {notice}
          </p>
        )}

        <section className="profile-section">
          <div className="profile-section__heading">
            <div>
              <span className="profile-eyebrow">ACCOUNT</span>
              <h2>Personal information</h2>
            </div>
            {!isEditing && (
              <button className="profile-edit-link" type="button" onClick={beginEditing}>
                <Pencil size={13} /> Edit
              </button>
            )}
          </div>

          <form className="profile-card" onSubmit={handleSubmit} noValidate>
            <ProfileField
              id="profile-full-name"
              label="Full name"
              value={isEditing ? draft.fullName : profile.fullName}
              onChange={updateField('fullName')}
              placeholder="Enter your full name"
              icon={UserRound}
              error={errors.fullName}
              readOnly={!isEditing}
            />
            <ProfileField
              id="profile-email"
              label="Email address"
              value={profile.email}
              placeholder="you@example.com"
              icon={Mail}
              readOnly
            />
            <ProfileField
              id="profile-phone"
              label="Phone number"
              value={isEditing ? draft.phoneNumber : (profile.phoneNumber || 'Not added yet')}
              onChange={updateField('phoneNumber')}
              placeholder="e.g. +63 912 345 6789"
              icon={Phone}
              error={errors.phoneNumber}
              readOnly={!isEditing}
            />
            <ProfileField
              id="profile-location"
              label="Location"
              value={isEditing ? draft.location : (profile.location || 'Not added yet')}
              onChange={updateField('location')}
              placeholder="City or area"
              icon={MapPin}
              readOnly={!isEditing}
            />

            {isEditing ? (
              <div className="profile-form-actions">
                <button className="profile-button profile-button--secondary" type="button" onClick={cancelEditing}>
                  <X size={16} /> Cancel
                </button>
                <button className="profile-button profile-button--primary" type="submit">
                  <Check size={16} /> Save changes
                </button>
              </div>
            ) : (
              <p className="profile-email-note">
                Your email address is read-only in this preview. Changing it will require email verification once OTP is connected.
              </p>
            )}
          </form>
        </section>

        <section className="profile-preview-note">
          <ShieldCheck size={17} />
          <p><strong>Frontend preview:</strong> profile edits are stored in this browser only. A future backend will connect these details to the signed-in account.</p>
        </section>

        <footer className="profile-footer">
          <a href="/">Back to laundry shops</a>
        </footer>
      </div>
    </main>
  );
}
