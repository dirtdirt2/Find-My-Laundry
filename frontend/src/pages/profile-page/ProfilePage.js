export const PROFILE_STORAGE_KEY = 'find-my-laundry-profile';

// Demo values are used until the app has a real authenticated user and backend.
export const DEFAULT_PROFILE = {
  fullName: 'Your Name',
  email: 'you@example.com',
  phoneNumber: '',
  location: 'Naga City, Camarines Sur',
};

/** Read the profile preview saved in this browser, falling back to demo values. */
export function loadProfile() {
  try {
    const savedProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!savedProfile) return { ...DEFAULT_PROFILE };

    const parsedProfile = JSON.parse(savedProfile);
    if (!parsedProfile || typeof parsedProfile !== 'object' || Array.isArray(parsedProfile)) {
      return { ...DEFAULT_PROFILE };
    }

    return { ...DEFAULT_PROFILE, ...parsedProfile };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

/** Save profile preview data locally. This does not update a server account. */
export function saveProfile(profile) {
  try {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    return true;
  } catch {
    return false;
  }
}

/** Validate editable profile fields before saving. */
export function validateProfile(profile) {
  const errors = {};
  const fullName = String(profile.fullName ?? '').trim();
  const phoneNumber = String(profile.phoneNumber ?? '').trim();

  if (!fullName) {
    errors.fullName = 'Please enter your full name.';
  } else if (fullName.length < 2) {
    errors.fullName = 'Your name must contain at least 2 characters.';
  }

  if (phoneNumber && !/^\+?[0-9\s().-]{7,20}$/.test(phoneNumber)) {
    errors.phoneNumber = 'Please enter a valid phone number.';
  }

  return errors;
}

/** Generate up to two initials for the profile avatar. */
export function getProfileInitials(fullName) {
  const words = String(fullName ?? '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'U';
  return words.slice(0, 2).map((word) => word[0].toUpperCase()).join('');
}
