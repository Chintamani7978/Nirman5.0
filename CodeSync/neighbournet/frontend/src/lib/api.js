let authToken = localStorage.getItem('token');

export const setAuthToken = (token) => {
  if (token) {
    authToken = token;
    localStorage.setItem('token', token);
  } else {
    authToken = null;
    localStorage.removeItem('token');
  }
};

const apiFetch = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `Request failed with status ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) return null;

  return response.json();
};

export const getRequests = (lat, lng, radiusKm) => {
  // Note: Using radiusKm to match backend expectation
  const params = new URLSearchParams({ lat, lng, radiusKm });
  return apiFetch(`/requests?${params.toString()}`);
};

export const createRequest = (payload) => {
  return apiFetch('/requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const assignRequest = (id) => {
  return apiFetch(`/requests/${id}/assign`, {
    method: 'POST',
  });
};

/*
// Example Usage:

import { setAuthToken, getRequests, createRequest } from './lib/api';

// 1. Set the token (e.g., after login)
setAuthToken('your-jwt-token-here');

// 2. Get requests
try {
  const requests = await getRequests(51.505, -0.09, 5);
  console.log('Requests:', requests);
} catch (error) {
  console.error('Failed to fetch requests:', error.message);
}

// 3. Create a request
try {
  const newRequest = await createRequest({
    type: 'Help Needed',
    description: 'Need groceries',
    contact: '555-0123',
    lat: 51.505,
    lng: -0.09
  });
  console.log('Created Request:', newRequest);
} catch (error) {
  console.error('Failed to create request:', error.message);
}
*/
