import { getToken } from './apiUser';

const API_BASE_URL = 'http://localhost:5000';

// Helper to get headers with token
const getAuthHeaders = () => {
  const token = getToken();
  if (!token) throw new Error("No authentication token found");
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Admin Login (ללא טוקן)
export const adminLogin = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }
  return data;
};

// Admin Logout
export const adminLogout = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/logout`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }
  return data;
};

// 1. Users Stats
export const getUsersStats = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/stats/users`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }
  return data;
};

// 2. Vacations Stats
export const getVacationStats = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/stats/vacations`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }
  return data;
};

// 3. Likes Stats
export const getLikesStats = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/stats/likes`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }
  return data;
};

// 4. Likes Distribution
export const getLikesDistribution = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/stats/likes-distribution`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }
  return data;
};

