/**
 * Centralized API service for THE BEST INSURANCE POINT Client
 * Uses VITE_API_BASE_URL if configured, otherwise defaults to relative /api
 */

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || data.error || `HTTP Error ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // OTP Endpoints
  sendOtp: (mobile) =>
    request('/api/otp/send', {
      method: 'POST',
      body: JSON.stringify({ mobile }),
    }),

  verifyOtp: ({ mobile, otp, token }) =>
    request('/api/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ mobile, otp, token }),
    }),

  // Application Endpoints
  submitApplication: (payload) =>
    request('/api/applications/submit', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  listApplications: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/applications${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  },

  updateApplicationStatus: (id, status, note = '') =>
    request(`/api/applications/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    }),

  // Contact Page Insurance Enquiry Endpoint
  submitEnquiry: (payload) =>
    request('/api/enquiries', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

export default api;
