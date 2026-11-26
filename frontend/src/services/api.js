const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api')
  .replace(/\/$/, '');

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error('Cannot connect to the backend. Make sure the API server is running.');
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `Request failed with status ${response.status}.`);
  }
  return payload;
}

export function getLaundryShops() {
  return request('/shops');
}

export function registerAccount(values) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(values),
  });
}

export function resendEmailOtp(email) {
  return request('/auth/resend-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function verifyEmailOtp(email, code) {
  return request('/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
}
